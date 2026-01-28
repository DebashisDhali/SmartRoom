import { MapPin, Users, Info, Star, MessageSquare, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const RoomCard = ({ room }) => {
    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toast.success('Added to wishlist!');
    };

    return (
        <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
            <Link to={`/room/${room._id}`} className="block">
                <div className="relative h-64 overflow-hidden">
                    <img
                        src={room.images[0]?.url || 'https://images.unsplash.com/photo-1522771739844-649f6d1712af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80'}
                        alt={room.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary-600 shadow-sm">
                        {room.category}
                    </div>

                    <button
                        onClick={handleWishlist}
                        className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-slate-400 hover:text-red-500 transition-all z-20"
                    >
                        <Heart size={18} />
                    </button>

                    <div className="absolute bottom-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ৳{room.price}/mo
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center space-x-1 text-yellow-500 mb-2">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm font-bold text-slate-700">{room.ratings.toFixed(1)}</span>
                        <span className="text-sm text-slate-400">({room.numOfReviews} reviews)</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {room.title}
                    </h3>

                    <div className="flex items-center text-slate-500 text-sm mb-4">
                        <MapPin size={16} className="mr-1 text-primary-500" />
                        <span className="line-clamp-1">{room.location.city}, {room.location.address}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center space-x-3 text-slate-500 text-sm">
                            <div className="flex items-center">
                                <Users size={16} className="mr-1" />
                                <span>{room.category === 'Bachelor' ? 'Single' : 'Family'}</span>
                            </div>
                            <div className="flex items-center">
                                <Info size={16} className="mr-1" />
                                <span>Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            {room.contactInfo?.whatsapp && (
                <a
                    href={`https://wa.me/${room.contactInfo.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-6 right-6 p-3 bg-[#25D366] text-white rounded-2xl shadow-lg hover:scale-110 transition-all z-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MessageSquare size={20} />
                </a>
            )}
        </div>
    );
};

export default RoomCard;
