import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Search, PlusCircle, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'Find Rooms', path: '/rooms', icon: <Search size={18} /> },
    ];

    return (
        <nav className="sticky top-0 z-50 glass border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
                                <Home size={24} />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                                SmartRoom
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="flex items-center space-x-1 text-slate-600 hover:text-primary-600 font-medium transition-colors"
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                {(user.role === 'owner' || user.role === 'admin') && (
                                    <Link
                                        to="/host/create-room"
                                        className="flex items-center space-x-1 text-primary-600 font-medium border border-primary-200 px-4 py-2 rounded-lg hover:bg-primary-50 transition-all"
                                    >
                                        <PlusCircle size={18} />
                                        <span>Post Room</span>
                                    </Link>
                                )}
                                <Link to="/dashboard" className="flex items-center space-x-2 text-slate-700 hover:text-primary-600 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                                        <img src={user.avatar?.url} alt={user.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-medium">{user.name.split(' ')[0]}</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-slate-500 hover:text-red-600 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 hover:text-primary-600"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass border-t border-slate-100 animate-in slide-in-from-top duration-300">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="flex items-center space-x-2 px-3 py-4 text-slate-600 font-medium border-b border-slate-50"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </Link>
                        ))}
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center space-x-2 px-3 py-4 text-slate-600 font-medium border-b border-slate-50"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <User size={18} />
                                    <span>Dashboard</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className="flex w-full items-center space-x-2 px-3 py-4 text-red-600 font-medium"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 p-4">
                                <Link
                                    to="/login"
                                    className="flex items-center justify-center px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
