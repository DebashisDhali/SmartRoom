import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home as HomeIcon, Star, Shield, Zap, User } from 'lucide-react';
import api from '../utils/api';
import RoomCard from '../components/rooms/RoomCard';

const Home = () => {
    const navigate = useNavigate();
    const [featuredRooms, setFeaturedRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data } = await api.get('/rooms');
                if (data && data.rooms) {
                    setFeaturedRooms(data.rooms.slice(0, 3));
                }
            } catch (error) {
                console.error('Error fetching featured rooms:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const location = formData.get('location');
        navigate(`/rooms?location=${location}`);
    };

    const categories = [
        { title: 'Bachelor Rooms', count: '120+', icon: <User className="text-blue-500" /> },
        { title: 'Family Houses', count: '80+', icon: <HomeIcon className="text-green-500" /> },
        { title: 'Sublets', count: '45+', icon: <Zap className="text-purple-500" /> },
    ];

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        alt="Hero Background"
                        className="w-full h-full object-cover scale-110"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        Find Your Perfect <span className="text-primary-400">SmartRoom</span> Without Brokers
                    </h1>
                    <p className="text-lg md:text-xl mb-10 text-slate-200">
                        Digitally verified rooms for bachelors and families. Experience a seamless living hunt today.
                    </p>

                    <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl mx-auto">
                        <div className="flex-grow flex items-center px-4 space-x-2 text-slate-800 border-b md:border-b-0 md:border-r border-slate-100 py-2">
                            <MapPin size={20} className="text-primary-500" />
                            <input
                                name="location"
                                type="text"
                                placeholder="Enter location (e.g. Uttara, Dhaka)"
                                className="w-full bg-transparent focus:outline-none placeholder:text-slate-400"
                            />
                        </div>
                        <button type="submit" className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center space-x-2">
                            <Search size={20} />
                            <span>Search Now</span>
                        </button>
                    </form>

                    <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
                        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            <Shield size={16} className="text-primary-400" />
                            <span>Verified Listings Only</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            <Star size={16} className="text-yellow-400" />
                            <span>Zero Broker Fee</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Explore by Categories</h2>
                        <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div
                            onClick={() => navigate('/rooms?category=Bachelor')}
                            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 group cursor-pointer"
                        >
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Search className="text-blue-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Bachelor Rooms</h3>
                            <p className="text-slate-500 mb-6">Affordable and flexible rooms designed for students and working professionals.</p>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">Verified Listings</span>
                                <button className="text-primary-600 font-bold hover:underline">Explore &rarr;</button>
                            </div>
                        </div>

                        <div
                            onClick={() => navigate('/rooms?category=Family')}
                            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 group cursor-pointer"
                        >
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <HomeIcon className="text-green-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Family Houses</h3>
                            <p className="text-slate-500 mb-6">Spacious and secure homes in prime locations for comfortable family living.</p>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">Top Rated</span>
                                <button className="text-primary-600 font-bold hover:underline">Explore &rarr;</button>
                            </div>
                        </div>

                        <div
                            onClick={() => navigate('/rooms')}
                            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 group cursor-pointer"
                        >
                            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="text-purple-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">All Listings</h3>
                            <p className="text-slate-500 mb-6">Browse through all available properties to find your perfect match instantly.</p>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">Newly Added</span>
                                <button className="text-primary-600 font-bold hover:underline">Browse All &rarr;</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Rooms Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4 md:gap-0">
                        <div>
                            <h2 className="text-3xl font-bold mb-2 text-slate-900 text-left">Newest Listings</h2>
                            <p className="text-slate-500 text-left">Check out the latest rooms posted in your city</p>
                        </div>
                        <button
                            onClick={() => navigate('/rooms')}
                            className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all flex items-center space-x-2"
                        >
                            <span>View All</span>
                            <Search size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            [1, 2, 3].map((n) => (
                                <div key={n} className="bg-white rounded-3xl h-96 animate-pulse border border-slate-100">
                                    <div className="h-2/3 bg-slate-200 rounded-t-3xl"></div>
                                    <div className="p-6 space-y-4">
                                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                                    </div>
                                </div>
                            ))
                        ) : featuredRooms.length > 0 ? (
                            featuredRooms.map((room) => (
                                <RoomCard key={room._id} room={room} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10">
                                <div className="bg-slate-50 rounded-3xl p-8 inline-block">
                                    <HomeIcon size={48} className="mx-auto text-slate-300 mb-4" />
                                    <p className="text-slate-500 font-medium">No featured rooms available at the moment.</p>
                                    <button
                                        onClick={() => navigate('/rooms')}
                                        className="mt-4 text-primary-600 font-bold hover:underline"
                                    >
                                        Browse all listings
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1560448204-61dc36dc98c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
                                    alt="Feature Room"
                                    className="rounded-3xl shadow-2xl"
                                />
                                <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl max-w-xs animate-bounce-slow">
                                    <div className="flex items-center space-x-2 text-primary-600 font-bold mb-2">
                                        <Shield size={20} />
                                        <span>Owner Verified</span>
                                    </div>
                                    <p className="text-slate-500 text-sm italic">"I found an amazing room in just 2 days. The direct contact with the owner was so helpful!"</p>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl font-bold mb-6">Why Choose SmartRoom?</h2>
                            <div className="space-y-8">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">No Misinformation</h4>
                                        <p className="text-slate-500">Every room listing is manually verified by our team. What you see is exactly what you get.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                                        <Star size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">Smart Search Algorithm</h4>
                                        <p className="text-slate-500">Our AI-based logic recommends rooms that perfectly match your budget and location preferences.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">Real-time Booking</h4>
                                        <p className="text-slate-500">Directly chat with owners and request a visit through our automated workflow system.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
