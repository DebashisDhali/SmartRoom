import { useState, useEffect } from 'react';
import api from '../utils/api';
import RoomCard from '../components/rooms/RoomCard';
import { Search, Filter, SlidersHorizontal, MapPin, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const locationQuery = searchParams.get('location') || '';
    const categoryQuery = searchParams.get('category') || '';

    const [filters, setFilters] = useState({
        keyword: '',
        category: categoryQuery,
        city: locationQuery,
        minPrice: '',
        maxPrice: '',
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            city: locationQuery,
            category: categoryQuery
        }));
    }, [locationQuery, categoryQuery]);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (filters.keyword) queryParams.append('keyword', filters.keyword);
            if (filters.category) queryParams.append('category', filters.category);
            if (filters.city) queryParams.append('city', filters.city);
            if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
            if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

            const { data } = await api.get(`/rooms?${queryParams.toString()}`);
            setRooms(data.rooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const clearFilters = () => {
        setFilters({
            keyword: '',
            category: '',
            city: '',
            minPrice: '',
            maxPrice: '',
        });
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Minimal Header */}
            <div className="bg-white border-b border-slate-200 py-6 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Find Your Perfect Room</h1>
                        <p className="text-slate-400 text-sm hidden sm:block">{rooms.length} listings found</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="relative w-40 sm:w-64 md:w-80">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                name="keyword"
                                value={filters.keyword}
                                onChange={handleFilterChange}
                                type="text"
                                placeholder="Search rooms..."
                                className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all text-sm outline-none"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden p-2.5 bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-200"
                        >
                            <SlidersHorizontal size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar Filters - Hidden on mobile, shown on large */}
                    <aside className={`lg:w-72 shrink-0 ${showFilters ? 'fixed inset-0 z-30 bg-white p-6 overflow-y-auto lg:relative lg:inset-auto lg:p-0 lg:bg-transparent' : 'hidden lg:block'}`}>
                        <div className="sticky top-28 space-y-6">
                            <div className="flex items-center justify-between lg:hidden mb-6">
                                <h3 className="text-xl font-bold">Filters</h3>
                                <button onClick={() => setShowFilters(false)} className="p-2 bg-slate-100 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-8">
                                {/* Category Filter */}
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Space Category</label>
                                    <div className="space-y-2">
                                        {['', 'Bachelor', 'Family'].map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setFilters({ ...filters, category: cat })}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${filters.category === cat ? 'bg-primary-50 text-primary-700 font-bold ring-2 ring-primary-100' : 'text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                <span>{cat === '' ? 'All Spaces' : cat}</span>
                                                {filters.category === cat && <div className="w-2 h-2 bg-primary-600 rounded-full shadow-lg shadow-primary-200" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Location Filter */}
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Location</label>
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            name="city"
                                            value={filters.city}
                                            onChange={handleFilterChange}
                                            type="text"
                                            placeholder="Dhaka, Chittagong..."
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Price Range Filter */}
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Monthly Rent (৳)</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            name="minPrice"
                                            value={filters.minPrice}
                                            onChange={handleFilterChange}
                                            type="number"
                                            placeholder="Min"
                                            className="w-full px-4 py-3.5 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                        />
                                        <input
                                            name="maxPrice"
                                            value={filters.maxPrice}
                                            onChange={handleFilterChange}
                                            type="number"
                                            placeholder="Max"
                                            className="w-full px-4 py-3.5 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Reset Button */}
                                <button
                                    onClick={clearFilters}
                                    className="w-full py-4 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center justify-center space-x-2 border-t border-slate-50 mt-4"
                                >
                                    <X size={14} />
                                    <span>Reset Filters</span>
                                </button>
                            </div>

                            {/* Promotional Card */}
                            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-6 text-white overflow-hidden relative shadow-xl shadow-primary-200 hidden lg:block">
                                <h4 className="text-lg font-bold relative z-10 mb-2">Need Help?</h4>
                                <p className="text-primary-100 text-[11px] relative z-10 font-medium">Our support team is available 24/7 to help you find your dream room.</p>
                                <a
                                    href="mailto:support@livingroomfinder.com?subject=Need Help Finding a Room"
                                    className="mt-4 px-4 py-2 bg-white text-primary-600 rounded-xl text-xs font-bold relative z-10 inline-block hover:bg-primary-50 transition-all"
                                >
                                    Contact Us
                                </a>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-grow">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[1, 2, 3, 4].map((n) => (
                                    <div key={n} className="bg-white rounded-[32px] h-[420px] animate-pulse border border-slate-100">
                                        <div className="h-64 bg-slate-200 rounded-t-[32px]"></div>
                                        <div className="p-8 space-y-4">
                                            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : rooms.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {rooms.map((room) => (
                                    <RoomCard key={room._id} room={room} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-[40px] border border-slate-100 shadow-sm px-6">
                                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                                    <Search size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">No rooms match your filters</h3>
                                <p className="text-slate-500 mt-3 max-w-sm mx-auto font-medium leading-relaxed">Try changing your location, category, or price range to find more options.</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-8 px-10 py-4 bg-primary-600 text-white rounded-2xl font-extrabold shadow-lg shadow-primary-200 transition-all hover:scale-105 active:scale-95"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rooms;
