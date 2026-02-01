import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, Users, Heart, Share2, Star, CheckCircle2, ShieldCheck, ChevronLeft, Calendar, MessageSquare, Phone, Edit, Settings, RefreshCcw, Info, Facebook } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const RoomDetails = () => {
    const { id } = useParams();
    const { isAuthenticated, user } = useAuth();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/rooms/${id}`);
                setRoom(data.room);
            } catch (error) {
                console.error('Error fetching room:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id]);

    const [bookingLoading, setBookingLoading] = useState(false);

    const handleBooking = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to request a visit');
            return;
        }
        setBookingLoading(true);
        // Simulate API call
        setTimeout(() => {
            toast.success('Visit request sent to owner!');
            setBookingLoading(false);
        }, 1000);
    };

    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
    const [reviewLoading, setReviewLoading] = useState(false);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error('Please login to leave a review');
            return;
        }
        try {
            setReviewLoading(true);
            const { data } = await api.put(`/rooms/review`, {
                rating: reviewData.rating,
                comment: reviewData.comment,
                roomId: id
            });

            toast.success('Review submitted successfully!');
            setRoom(data.room);
            setReviewData({ rating: 5, comment: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setReviewLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        const newStatus = room.availabilityStatus === 'Available' ? 'Booked' : 'Available';
        try {
            await api.patch(`/rooms/${id}/status`, { status: newStatus });
            toast.success(`Room marked as ${newStatus}`);
            setRoom({ ...room, availabilityStatus: newStatus });
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleWishlist = () => {
        toast.success('Added to wishlist!');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!room) return <div className="text-center py-20">Room not found</div>;

    const isOwner = user && room.owner && (room.owner._id === user._id || room.owner === user._id);

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <Link to="/rooms" className="inline-flex items-center text-slate-500 hover:text-primary-600 font-medium mb-6 transition-colors">
                    <ChevronLeft size={20} className="mr-1" />
                    Back to Listings
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src={room.images[activeImage]?.url || 'https://images.unsplash.com/photo-1522771739844-649f6d1712af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80'}
                                    alt={room.title}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={handleWishlist}
                                    className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-slate-400 hover:text-red-500 transition-all z-10"
                                >
                                    <Heart size={20} />
                                </button>
                                <div className="absolute bottom-6 right-6 bg-slate-900/40 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium">
                                    {activeImage + 1} / {room.images.length || 1}
                                </div>
                            </div>

                            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                                {room.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all ${activeImage === idx ? 'border-primary-600 scale-95' : 'border-transparent hover:scale-105'
                                            }`}
                                    >
                                        <img src={img.url} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Room Info */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-bold">
                                    {room.category}
                                </span>
                                <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center">
                                    <ShieldCheck size={16} className="mr-1" />
                                    Verified
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{room.title}</h1>

                            <div className="flex items-center text-slate-500 mb-8">
                                <MapPin size={20} className="mr-2 text-primary-500" />
                                <span className="text-lg">{room.location.address}, {room.location.city}</span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-slate-100 mb-8">
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-sm mb-1">Rent</span>
                                    <span className="text-xl font-extrabold text-slate-900">৳{room.price}<span className="text-sm text-slate-400">/mo</span></span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-sm mb-1">Type</span>
                                    <span className="font-bold text-slate-900">{room.category}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-sm mb-1">Capacity</span>
                                    <span className="font-bold text-slate-900">{room.category === 'Bachelor' ? '1 Person' : 'Family'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-400 text-sm mb-1">Rating</span>
                                    <div className="flex items-center space-x-1 text-slate-900 font-bold">
                                        <Star size={18} fill="#f59e0b" className="text-yellow-500" />
                                        <span>{room.ratings.toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-xl font-bold mb-4">Description</h3>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    {room.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                                <div>
                                    <h3 className="text-xl font-bold mb-4">Facilities</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {room.facilities.map((fac, idx) => (
                                            <div key={idx} className="flex items-center space-x-3 text-slate-700">
                                                <CheckCircle2 size={18} className="text-primary-500" />
                                                <span>{fac}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-4">House Rules</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {room.rules.map((rule, idx) => (
                                            <div key={idx} className="flex items-center space-x-3 text-slate-500 text-sm">
                                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                                <span>{rule}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {room.videos && room.videos.length > 0 && (
                                <div className="mt-10 pt-10 border-t border-slate-100">
                                    <h3 className="text-xl font-bold mb-6">Room Video Walkthrough</h3>
                                    <div className="aspect-video rounded-3xl overflow-hidden bg-slate-100 shadow-xl">
                                        <video
                                            src={room.videos[0].url}
                                            controls
                                            className="w-full h-full object-cover"
                                        ></video>
                                    </div>
                                </div>
                            )}

                            {/* Map Section */}
                            <div className="mt-10 pt-10 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold">Location on Map</h3>
                                        {room.location.latitude && room.location.longitude && (
                                            <p className="text-xs text-green-600 font-medium mt-1 flex items-center">
                                                <CheckCircle2 size={12} className="mr-1" />
                                                Precise GPS coordinates set by owner
                                            </p>
                                        )}
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${room.location.latitude && room.location.longitude ? room.location.latitude + ',' + room.location.longitude : encodeURIComponent(room.location.address + ', ' + room.location.city)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-600 font-bold text-sm flex items-center space-x-1 hover:underline"
                                    >
                                        <MapPin size={16} />
                                        <span>Open in Google Maps</span>
                                    </a>
                                </div>
                                <div className="rounded-[32px] overflow-hidden h-80 bg-slate-100 border border-slate-200 shadow-inner group relative">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        aria-hidden="false"
                                        tabIndex="0"
                                        src={`https://www.google.com/maps?q=${room.location.latitude && room.location.longitude ? room.location.latitude + ',' + room.location.longitude : encodeURIComponent(room.location.address + ', ' + room.location.city)}&output=embed`}
                                        title="Room Location"
                                        className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                                    ></iframe>
                                    {room.location.latitude && room.location.longitude && (
                                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1 pointer-events-none">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                            <span>Exact Location</span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 flex items-start space-x-2">
                                    <Info size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                    <div className="text-xs text-slate-500">
                                        {room.location.latitude && room.location.longitude ? (
                                            <div>
                                                <p className="font-bold text-slate-700">Precise GPS Location:</p>
                                                <p className="mt-1">
                                                    Latitude: {parseFloat(room.location.latitude).toFixed(6)}° |
                                                    Longitude: {parseFloat(room.location.longitude).toFixed(6)}°
                                                </p>
                                                <p className="mt-1 text-[10px] italic">
                                                    This exact location was set by the room owner using GPS coordinates.
                                                </p>
                                            </div>
                                        ) : (
                                            <p>Approximate location based on address. Exact location will be shared after successful visit request.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <div className="mt-16 pt-16 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">Guest Reviews</h3>
                                        <div className="flex items-center mt-2 space-x-2">
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={16} fill={i < Math.round(room.ratings) ? "currentColor" : "none"} />
                                                ))}
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">{room.ratings.toFixed(1)}</span>
                                            <span className="text-sm text-slate-400">({room.numOfReviews} reviews)</span>
                                        </div>
                                    </div>
                                    {isAuthenticated && !isOwner && (
                                        <a href="#write-review" className="text-primary-600 font-bold text-sm hover:underline">Write a review &darr;</a>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                                    {room.reviews && room.reviews.length > 0 ? (
                                        room.reviews.map((rev, idx) => (
                                            <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                                <div className="flex items-center space-x-3 mb-4">
                                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
                                                        {rev.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm">{rev.name}</p>
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 text-sm leading-relaxed">{rev.comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-10 text-center bg-slate-50 rounded-3xl border border-slate-100">
                                            <MessageSquare size={40} className="mx-auto text-slate-300 mb-4" />
                                            <p className="text-slate-500 font-medium">No reviews yet. Be the first to share your experience!</p>
                                        </div>
                                    )}
                                </div>

                                {/* Write a Review Form */}
                                {isAuthenticated && !isOwner && (
                                    <div id="write-review" className="bg-white p-8 rounded-[32px] border-2 border-primary-50 shadow-sm">
                                        <h4 className="text-xl font-bold text-slate-900 mb-6">Leave a Review</h4>
                                        <form onSubmit={handleReviewSubmit} className="space-y-6">
                                            <div>
                                                <label className="text-sm font-bold text-slate-700 block mb-3">Your Rating</label>
                                                <div className="flex items-center space-x-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setReviewData({ ...reviewData, rating: star })}
                                                            className={`p-1 transition-all ${reviewData.rating >= star ? 'text-yellow-400' : 'text-slate-200'}`}
                                                        >
                                                            <Star size={32} fill={reviewData.rating >= star ? "currentColor" : "none"} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-slate-700 block mb-3">Your Comment</label>
                                                <textarea
                                                    rows="4"
                                                    required
                                                    value={reviewData.comment}
                                                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                                    placeholder="Share your experience staying in this room..."
                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary-600 outline-none transition-all resize-none"
                                                ></textarea>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={reviewLoading}
                                                className="btn-primary py-4 px-10 font-bold flex items-center space-x-2 disabled:opacity-70"
                                            >
                                                {reviewLoading ? (
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <span>Post Review</span>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center">
                                <div className="w-full mb-6">
                                    <div className="flex justify-between items-end mb-6">
                                        <div>
                                            <span className="text-3xl font-extrabold text-slate-900">৳{room.price}</span>
                                            <span className="text-slate-500"> / month</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Calendar size={20} className="text-primary-600 mr-3" />
                                                <div>
                                                    <p className="text-xs text-slate-400">Availability</p>
                                                    <p className={`text-sm font-bold ${room.availabilityStatus === 'Available' ? 'text-green-600' : 'text-red-600'}`}>{room.availabilityStatus}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {isOwner ? (
                                        <div className="space-y-3 w-full">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Management Tools</div>
                                            <Link
                                                to={`/host/update-room/${id}`}
                                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                                            >
                                                <Edit size={20} />
                                                <span>Edit Room Details</span>
                                            </Link>
                                            <button
                                                onClick={handleToggleStatus}
                                                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all border-2 ${room.availabilityStatus === 'Available' ? 'border-primary-600 text-primary-600 hover:bg-primary-50' : 'border-green-600 text-green-600 hover:bg-green-50'}`}
                                            >
                                                <RefreshCcw size={20} />
                                                <span>Mark as {room.availabilityStatus === 'Available' ? 'Booked' : 'Available'}</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleBooking}
                                                disabled={bookingLoading}
                                                className="w-full btn-primary py-4 mb-4 text-lg font-bold flex items-center justify-center space-x-2 disabled:opacity-70"
                                            >
                                                {bookingLoading ? (
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        <Calendar size={20} />
                                                        <span>Request Visit</span>
                                                    </>
                                                )}
                                            </button>

                                            {room.contactInfo && (
                                                <div className="space-y-3">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Contact Owner</p>

                                                    <a
                                                        href={`tel:${room.contactInfo.phone}`}
                                                        className="w-full border-2 border-primary-200 py-4 rounded-2xl font-bold text-slate-700 hover:bg-primary-50 transition-all flex items-center justify-center space-x-2"
                                                    >
                                                        <Phone size={20} className="text-primary-600" />
                                                        <span>{room.contactInfo.phone}</span>
                                                    </a>

                                                    {room.contactInfo.whatsapp && (
                                                        <a
                                                            href={`https://wa.me/${room.contactInfo.whatsapp.replace(/\D/g, '')}?text=Hi, I'm interested in your room: ${encodeURIComponent(room.title)}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold hover:bg-[#128C7E] transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                                                        >
                                                            <MessageSquare size={20} />
                                                            <span>WhatsApp Owner</span>
                                                        </a>
                                                    )}

                                                    {room.contactInfo.facebook && (
                                                        <a
                                                            href={room.contactInfo.facebook}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full bg-[#1877F2] text-white py-4 rounded-2xl font-bold hover:bg-[#166FE5] transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                                                        >
                                                            <Facebook size={20} />
                                                            <span>View Facebook Profile</span>
                                                        </a>
                                                    )}

                                                    {/* Admin Support */}
                                                    <div className="mt-6 pt-6 border-t border-slate-100">
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Need Help?</p>
                                                        <a
                                                            href="https://wa.me/8801234567890?text=Hi SmartRoom Support, I need help with this room"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full bg-gradient-to-r from-blue-500 to-primary-600 text-white py-3.5 rounded-2xl font-bold hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
                                                        >
                                                            <MessageSquare size={18} />
                                                            <span>Contact Admin Support</span>
                                                        </a>
                                                        <p className="text-[10px] text-slate-400 text-center mt-2">
                                                            Available 24/7 for assistance
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <p className="text-xs text-slate-400 text-center">
                                    You won't be charged yet. Secure and verified process.
                                </p>
                            </div>

                            {/* Owner Info */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-4">Hosted by</h4>
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
                                        <img
                                            src={room.owner?.avatar?.url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                                            alt="Owner"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{room.owner?.name || 'Loading...'}</p>
                                        <p className="text-xs text-slate-500">Owner since 2024</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 text-primary-600 bg-primary-50 px-3 py-2 rounded-xl text-xs font-bold">
                                    <ShieldCheck size={16} />
                                    <span>Identity Verified & Trusted</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;
