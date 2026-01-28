import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Home, Calendar, Heart, Settings, Plus, Star, MapPin, ChevronRight, CheckCircle2, Clock, XCircle, User, Camera, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [listings, setListings] = useState([]);
    const [loadingListings, setLoadingListings] = useState(false);

    const sidebarLinks = [
        { id: 'overview', name: 'Overview', icon: <LayoutDashboard size={20} /> },
        { id: 'listings', name: user.role === 'owner' ? 'My Listings' : 'My Bookings', icon: user.role === 'owner' ? <Home size={20} /> : <Calendar size={20} /> },
        { id: 'wishlist', name: 'Wishlist', icon: <Heart size={20} /> },
        { id: 'settings', name: 'Profile Settings', icon: <Settings size={20} /> },
    ];

    useEffect(() => {
        if (user.role === 'owner' && activeTab === 'listings') {
            const fetchMyListings = async () => {
                try {
                    setLoadingListings(true);
                    const { data } = await axios.get('http://localhost:5000/api/v1/rooms/owner/me', { withCredentials: true });
                    setListings(data.rooms);
                } catch (error) {
                    console.error('Error fetching listings:', error);
                } finally {
                    setLoadingListings(false);
                }
            };
            fetchMyListings();
        }
    }, [user.role, activeTab, user._id]);

    const handleDelete = async (roomId) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/v1/rooms/${roomId}`, { withCredentials: true });
            toast.success('Listing deleted');
            setListings(listings.filter(r => r._id !== roomId));
        } catch (error) {
            toast.error('Failed to delete listing');
        }
    };

    const handleToggleStatus = async (roomId, currentStatus) => {
        const newStatus = currentStatus === 'Available' ? 'Booked' : 'Available';
        try {
            await axios.patch(`http://localhost:5000/api/v1/rooms/${roomId}/status`, { status: newStatus }, { withCredentials: true });
            toast.success(`Room marked as ${newStatus}`);
            setListings(listings.map(room => room._id === roomId ? { ...room, availabilityStatus: newStatus } : room));
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const renderWishlist = () => (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Heart size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">Your Wishlist is Empty</h3>
            <p className="text-slate-500 mt-2">Save rooms you love to view them later!</p>
            <Link to="/rooms" className="text-primary-600 font-bold mt-4 inline-block hover:underline">
                Explore Rooms &rarr;
            </Link>
        </div>
    );

    const [editData, setEditData] = useState({
        name: user.name,
        phone: user.phone || '',
    });
    const [newAvatar, setNewAvatar] = useState(null);
    const [newAvatarPreview, setNewAvatarPreview] = useState(user.avatar?.url);
    const { updateProfile } = useAuth();

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleNewAvatar = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewAvatar(file);
            setNewAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', editData.name);
            data.append('phone', editData.phone);
            if (newAvatar) data.append('avatar', newAvatar);

            await updateProfile(data);
        } catch (error) {
            console.error('Update profile error:', error);
        }
    };

    const renderSettings = () => (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold mb-8 text-slate-900 font-sans">Profile Settings</h3>

            <form onSubmit={handleUpdateProfile} className="space-y-8 max-w-xl">
                {/* Avatar Update */}
                <div className="flex items-center space-x-6 pb-8 border-b border-slate-50">
                    <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-input').click()}>
                        <div className="w-24 h-24 rounded-3xl bg-slate-100 border-4 border-white shadow-xl overflow-hidden shadow-primary-100/20">
                            {newAvatarPreview ? (
                                <img src={newAvatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <User size={40} />
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl">
                            <Camera size={24} className="text-white" />
                        </div>
                        <input
                            id="avatar-input"
                            type="file"
                            accept="image/*"
                            onChange={handleNewAvatar}
                            className="hidden"
                        />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">Profile Picture</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-[200px]">PNG, JPG up to 5MB. A good photo builds trust.</p>
                        <button
                            type="button"
                            onClick={() => document.getElementById('avatar-input').click()}
                            className="text-xs font-bold text-primary-600 mt-3 hover:text-primary-700 underline"
                        >
                            Change Photo
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            value={editData.name}
                            onChange={handleEditChange}
                            placeholder="Your Name"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary-600 outline-none transition-all font-medium text-slate-900"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                        <input
                            name="phone"
                            type="tel"
                            value={editData.phone}
                            onChange={handleEditChange}
                            placeholder="017xxxxxxxx"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary-600 outline-none transition-all font-medium text-slate-900"
                        />
                    </div>
                </div>

                <div className="space-y-2 opacity-60">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Address (Read-only)</label>
                    <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none cursor-not-allowed font-medium text-slate-500"
                        disabled
                    />
                </div>

                <button
                    type="submit"
                    className="btn-primary w-full md:w-auto px-10 py-4 text-sm font-extrabold shadow-lg shadow-primary-200"
                >
                    Save Profile Changes
                </button>
            </form>
        </div>
    );

    const renderListings = () => {
        if (loadingListings) return <div className="text-center py-10">Loading your listings...</div>;
        if (listings.length === 0) return (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                <Home size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900">No Listings Yet</h3>
                <p className="text-slate-500 mt-2">Start earning by listing your first room!</p>
                <Link to="/host/create-room" className="btn-primary inline-flex items-center space-x-2 mt-6 px-8">
                    <Plus size={20} />
                    <span>Create Listing</span>
                </Link>
            </div>
        );

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listings.map(room => (
                    <div key={room._id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center space-x-4">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                            <img src={room.images[0]?.url} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                            <h4 className="font-bold text-slate-900 line-clamp-1">{room.title}</h4>
                            <p className="text-primary-600 font-bold text-sm mt-1">৳{room.price}/mo</p>
                            <div className="flex items-center space-x-2 mt-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${room.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {room.isApproved ? 'Approved' : 'Pending'}
                                </span>
                                <button
                                    onClick={() => handleToggleStatus(room._id, room.availabilityStatus)}
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${room.availabilityStatus === 'Available' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                >
                                    {room.availabilityStatus}
                                </button>
                            </div>
                        </div>
                        <div className="flex space-x-1">
                            <Link to={`/room/${room._id}`} className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                                <ChevronRight size={24} />
                            </Link>
                            <Link to={`/host/update-room/${room._id}`} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                <Edit size={20} />
                            </Link>
                            <button
                                onClick={() => handleDelete(room._id)}
                                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                            >
                                <XCircle size={22} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-64px)] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-6">
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-primary-100 overflow-hidden">
                                    <img src={user.avatar?.url} alt={user.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-slate-900 leading-tight">{user.name}</h3>
                                    <span className="text-xs uppercase font-bold text-primary-600 tracking-wider font-sans">{user.role}</span>
                                </div>
                            </div>

                            <nav className="space-y-1">
                                {sidebarLinks.map((link) => (
                                    <button
                                        key={link.id}
                                        onClick={() => setActiveTab(link.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all ${activeTab === link.id
                                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-primary-600'
                                            }`}
                                    >
                                        {link.icon}
                                        <span className="font-medium">{link.name}</span>
                                    </button>
                                ))}
                            </nav>

                            <div className="pt-6 border-t border-slate-50">
                                <div className="bg-primary-50 p-4 rounded-2xl text-center">
                                    <p className="text-xs text-primary-700 font-bold mb-1">PRO TIP</p>
                                    <p className="text-[10px] text-primary-600">Complete your profile to get 2x more visibility!</p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-grow">
                        <div className="space-y-8">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold font-sans text-slate-900">
                                        {activeTab === 'overview' ? 'Dashboard Overview' :
                                            activeTab === 'listings' ? (user.role === 'owner' ? 'My Listings' : 'My Bookings') :
                                                activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                                    </h2>
                                    <p className="text-slate-500">Welcome back, {user.name}!</p>
                                </div>
                                {user.role === 'owner' && (
                                    <Link to="/host/create-room" className="btn-primary flex items-center space-x-2">
                                        <Plus size={20} />
                                        <span>List New Room</span>
                                    </Link>
                                )}
                            </div>

                            {activeTab === 'overview' ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                                    <Calendar size={24} />
                                                </div>
                                            </div>
                                            <h4 className="text-3xl font-extrabold text-slate-900">0</h4>
                                            <p className="text-slate-500 text-sm">Active Bookings</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                                    <Home size={24} />
                                                </div>
                                            </div>
                                            <h4 className="text-3xl font-extrabold text-slate-900">{user.role === 'owner' ? listings.length : 0}</h4>
                                            <p className="text-slate-500 text-sm">{user.role === 'owner' ? 'Your Listings' : 'Wishlisted Rooms'}</p>
                                        </div>
                                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600">
                                                    <Star size={24} />
                                                </div>
                                            </div>
                                            <h4 className="text-3xl font-extrabold text-slate-900">0.0</h4>
                                            <p className="text-slate-500 text-sm">Average Rating</p>
                                        </div>
                                    </div>

                                    {/* Recent Activity / Content */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Left Column: Recent Orders/Requests */}
                                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                            <h3 className="text-xl font-bold font-sans mb-6">Recent Visit Requests</h3>
                                            <div className="text-center py-10 opacity-40">
                                                <Clock size={40} className="mx-auto mb-2" />
                                                <p className="text-sm font-medium">No recent activity</p>
                                            </div>
                                            <button
                                                onClick={() => setActiveTab('listings')}
                                                className="w-full text-center text-primary-600 font-bold text-sm mt-8 hover:underline"
                                            >
                                                View Your Listings &rarr;
                                            </button>
                                        </div>

                                        {/* Right Column: Recommendations / Tips */}
                                        <div className="space-y-8">
                                            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary-200">
                                                <div className="relative z-10">
                                                    <h3 className="text-2xl font-bold mb-2">Smart Search</h3>
                                                    <p className="text-primary-100 mb-6 text-sm">Use our advanced filters to find the perfect living space that fits your budget.</p>
                                                    <button
                                                        onClick={() => navigate('/rooms')}
                                                        className="bg-white text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-all flex items-center space-x-2"
                                                    >
                                                        <span>Explore Rooms</span>
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </div>
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/20 rounded-full -ml-8 -mb-8 blur-xl"></div>
                                            </div>

                                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                                <h3 className="text-xl font-bold mb-6">Your Progress</h3>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-slate-600">Profile Completion</span>
                                                            <span className="text-primary-600 font-bold">50%</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="w-[50%] h-full bg-primary-600 rounded-full"></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col space-y-3 pt-4">
                                                        <div className="flex items-center space-x-2 text-green-600 text-sm font-medium">
                                                            <CheckCircle2 size={16} />
                                                            <span>Email Verified</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-slate-400 text-sm font-medium">
                                                            <Clock size={16} />
                                                            <span>Identity Verification (NID) Pending</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : activeTab === 'listings' ? (
                                renderListings()
                            ) : activeTab === 'wishlist' ? (
                                renderWishlist()
                            ) : activeTab === 'settings' ? (
                                renderSettings()
                            ) : (
                                <div className="bg-white rounded-3xl p-20 text-center border border-slate-100">
                                    <h3 className="text-xl font-bold text-slate-400 font-sans">Coming Soon</h3>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
