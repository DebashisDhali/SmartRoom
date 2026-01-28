import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, ArrowRight, UserPlus, Home, Camera } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'seeker',
    });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send as plain JSON object since we removed the avatar upload
            const data = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: formData.role
            };

            await register(data);
            navigate('/dashboard');
        } catch (error) {
            // Error is handled in context
        }
    };

    const roles = [
        { value: 'seeker', label: 'Room Seeker', description: 'I want to find a room to stay', icon: <User size={20} /> },
        { value: 'owner', label: 'Room Owner', description: 'I want to rent out my property', icon: <Home size={20} /> },
    ];

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-6">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900">Create Account</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Join thousands of users finding their homes with SmartRoom
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>


                    {/* Role Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {roles.map((role) => (
                            <div
                                key={role.value}
                                onClick={() => setFormData({ ...formData, role: role.value })}
                                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${formData.role === role.value
                                    ? 'border-primary-600 bg-primary-50 ring-4 ring-primary-500/10'
                                    : 'border-slate-100 bg-white hover:border-primary-200'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg inline-block mb-3 ${formData.role === role.value ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {role.icon}
                                </div>
                                <h4 className="font-bold text-slate-900">{role.label}</h4>
                                <p className="text-xs text-slate-500 mt-1">{role.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700 block mb-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="John Doe"
                                        minLength={4}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-slate-700 block mb-1">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        name="phone"
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="input-field pl-10"
                                        placeholder="017xxxxxxxx"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="At least 8 characters"
                                    minLength={8}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 flex items-center justify-center space-x-2 text-lg"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>Create Account</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    <div className="text-center text-sm">
                        <span className="text-slate-500">Already have an account? </span>
                        <Link to="/login" className="text-primary-600 font-bold hover:underline">
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
