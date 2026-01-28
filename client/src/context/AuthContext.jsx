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
            try {
                const { data } = await api.get('/auth/me');
                setUser(data.user);
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const { data } = await api.post('/auth/login', { email, password });
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
            const config = userData instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
            const { data } = await api.post('/auth/register', userData, config);
            setUser(data.user);
            setIsAuthenticated(true);
            toast.success('Registered successfully');
            return data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Registration failed';
            toast.error(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (formData) => {
        try {
            setLoading(true);
            const { data } = await api.put('/users/me/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
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
