import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            // Safety timeout: If backend is dead, don't hang forever
            const timer = setTimeout(() => {
                console.warn("Auth check timed out - forcing app load");
                setLoading(false);
            }, 2000);

            try {
                const { data } = await api.get('/auth/me');
                console.log("User loaded:", data.user);

                if (data.user) {
                    setUser(data.user);
                    setIsAuthenticated(true);
                } else {
                    console.warn("User data is null despite 200 OK - Treating as guest");
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.log("No user session found or server error:", error.message);
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                clearTimeout(timer);
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const { data } = await api.post('/auth/login', { email, password });
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            setUser(data.user);
            setIsAuthenticated(true);
            toast.success('Logged in successfully');
            return data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Login failed';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            // Don't set Content-Type manually for FormData, let Axios handle it with boundary
            const { data } = await api.post('/auth/register', userData);
            // Don't auto-login
            toast.success('Registered successfully. Please login.');
            return data;
        } catch (error) {
            console.error("Registration Error:", error);
            let message = error.response?.data?.message || error.message || 'Registration failed';

            if (error.code === "ERR_NETWORK") {
                message = "Network Error: Please check your connection and ensure the server is running. If on Vercel, check the VITE_API_URL setting.";
            }

            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (formData) => {
        try {
            setLoading(true);
            const { data } = await api.put('/auth/me/update', formData); // Fixed route and removed manual header
            setUser(data.user);
            toast.success('Profile updated successfully');
            return data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.get('/auth/logout');
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
            toast.success('Logged out');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, updateProfile, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
