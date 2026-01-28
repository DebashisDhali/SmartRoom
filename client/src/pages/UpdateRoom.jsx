import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ImagePlus, MapPin, DollarSign, Info, List, CheckCircle2, X, Plus, ChevronRight, ChevronLeft, Video, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const UpdateRoom = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Bachelor',
        location: {
            address: '',
            city: '',
            latitude: '',
            longitude: '',
        },
        contactInfo: {
            phone: '',
            whatsapp: '',
            facebook: '',
        },
        facilities: [],
        rules: [],
    });

    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [currentFacility, setCurrentFacility] = useState('');
    const [currentRule, setCurrentRule] = useState('');
    const [showMapPicker, setShowMapPicker] = useState(false);

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData({
                        ...formData,
                        location: {
                            ...formData.location,
                            latitude: latitude.toString(),
                            longitude: longitude.toString(),
                        }
                    });
                    toast.success('Current location detected!');
                    setShowMapPicker(true);
                },
                (error) => {
                    toast.error('Unable to get location. Please enter manually.');
                    setShowMapPicker(true);
                }
            );
        } else {
            toast.error('Geolocation not supported');
        }
    };

    const extractCoordinatesFromUrl = (url) => {
        try {
            let match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (match) {
                return { latitude: match[1], longitude: match[2] };
            }
            match = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (match) {
                return { latitude: match[1], longitude: match[2] };
            }
            match = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (match) {
                return { latitude: match[1], longitude: match[2] };
            }
            match = url.match(/\/place\/[^/]+\/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (match) {
                return { latitude: match[1], longitude: match[2] };
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    const handleMapUrlPaste = (e) => {
        const url = e.target.value;
        const coords = extractCoordinatesFromUrl(url);

        if (coords) {
            setFormData({
                ...formData,
                location: {
                    ...formData.location,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                }
            });
            toast.success('📍 Coordinates extracted from URL!');
            e.target.value = '';
        }
    };

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                setFetching(true);
                const { data } = await axios.get(`http://localhost:5000/api/v1/rooms/${id}`);
                const room = data.room;

                // Check ownership
                if (user && room.owner && room.owner._id !== user._id && user.role !== 'admin') {
                    toast.error('Not authorized to edit this room');
                    navigate('/dashboard');
                    return;
                }

                setFormData({
                    title: room.title,
                    description: room.description,
                    price: room.price,
                    category: room.category,
                    location: {
                        address: room.location.address,
                        city: room.location.city,
                    },
                    contactInfo: {
                        phone: room.contactInfo.phone,
                        whatsapp: room.contactInfo.whatsapp || '',
                        facebook: room.contactInfo.facebook || '',
                    },
                    facilities: room.facilities || [],
                    rules: room.rules || [],
                });
                setExistingImages(room.images || []);
            } catch (error) {
                toast.error('Failed to fetch room details');
                navigate('/dashboard');
            } finally {
                setFetching(false);
            }
        };

        fetchRoomDetails();
    }, [id, user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: { ...formData[parent], [child]: value }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (e.target.name === 'images') {
            setImages(files);
            const previews = files.map(file => URL.createObjectURL(file));
            setImagePreviews(previews);
        } else {
            setVideos(files);
        }
    };

    const addFacility = () => {
        if (currentFacility && !formData.facilities.includes(currentFacility)) {
            setFormData({ ...formData, facilities: [...formData.facilities, currentFacility] });
            setCurrentFacility('');
        }
    };

    const removeFacility = (idx) => {
        const updated = formData.facilities.filter((_, i) => i !== idx);
        setFormData({ ...formData, facilities: updated });
    };

    const addRule = () => {
        if (currentRule && !formData.rules.includes(currentRule)) {
            setFormData({ ...formData, rules: [...formData.rules, currentRule] });
            setCurrentRule('');
        }
    };

    const removeRule = (idx) => {
        const updated = formData.rules.filter((_, i) => i !== idx);
        setFormData({ ...formData, rules: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = new FormData();

            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('location', JSON.stringify(formData.location));
            data.append('contactInfo', JSON.stringify(formData.contactInfo));
            data.append('facilities', JSON.stringify(formData.facilities));
            data.append('rules', JSON.stringify(formData.rules));

            images.forEach(image => data.append('images', image));
            videos.forEach(video => data.append('videos', video));

            await axios.put(`http://localhost:5000/api/v1/rooms/${id}`, data, {
                withCredentials: true,
            });

            toast.success('Room updated successfully!');
            navigate(`/room/${id}`);
        } catch (error) {
            console.error('Submission error:', error);
            toast.error(error.response?.data?.message || 'Failed to update room');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = (e) => {
        if (e) e.preventDefault();

        // Basic validation for Step 1
        if (step === 1) {
            if (!formData.title || !formData.price || !formData.description || !formData.contactInfo.phone) {
                toast.error('Please fill in all required fields');
                return;
            }
        }

        // Basic validation for Step 2
        if (step === 2) {
            if (!formData.location.city || !formData.location.address) {
                toast.error('Please fill in location details');
                return;
            }
        }

        setStep(step + 1);
    };

    const prevStep = (e) => {
        if (e) e.preventDefault();
        setStep(step - 1);
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <Loader2 size={48} className="text-primary-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading room details...</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-10">
            <div className="max-w-3xl mx-auto px-4">
                {/* Progress Bar */}
                <div className="mb-10 flex items-center justify-between">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center flex-grow last:flex-grow-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-lg ${step >= s ? 'bg-primary-600 text-white' : 'bg-white text-slate-400 border border-slate-200'
                                }`}>
                                {step > s ? <CheckCircle2 size={24} /> : s}
                            </div>
                            {s < 3 && (
                                <div className={`flex-grow h-1 mx-4 rounded-full transition-all ${step > s ? 'bg-primary-600' : 'bg-slate-200'
                                    }`}></div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <header className="mb-10">
                            <h1 className="text-3xl font-extrabold text-slate-900">
                                {step === 1 ? 'Update Basic Info' : step === 2 ? 'Location & Features' : 'Update Media & Rules'}
                            </h1>
                            <p className="text-slate-500 mt-2">Modify the details of your room listing</p>
                        </header>

                        <form
                            onSubmit={handleSubmit}
                            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                            className="space-y-8"
                        >
                            {/* Step 1: Basic Info */}
                            {step === 1 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div>
                                        <label className="text-sm font-bold text-slate-700 block mb-2">Room Title</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                <Info size={18} />
                                            </div>
                                            <input
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                type="text"
                                                placeholder="e.g. Spacious Single Room in Uttara"
                                                className="input-field pl-12"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">Monthly Rent (৳)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                    <DollarSign size={18} />
                                                </div>
                                                <input
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    type="number"
                                                    placeholder="8500"
                                                    className="input-field pl-12"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">Category</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                    <List size={18} />
                                                </div>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    className="input-field pl-12"
                                                >
                                                    <option value="Bachelor">Bachelor</option>
                                                    <option value="Family">Family</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">Contact Phone</label>
                                            <input
                                                name="contactInfo.phone"
                                                value={formData.contactInfo.phone}
                                                onChange={handleChange}
                                                type="tel"
                                                placeholder="01712345678"
                                                className="input-field"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">WhatsApp (Optional)</label>
                                            <input
                                                name="contactInfo.whatsapp"
                                                value={formData.contactInfo.whatsapp}
                                                onChange={handleChange}
                                                type="tel"
                                                placeholder="01712345678"
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">Facebook (Optional)</label>
                                            <input
                                                name="contactInfo.facebook"
                                                value={formData.contactInfo.facebook}
                                                onChange={handleChange}
                                                type="text"
                                                placeholder="https://facebook.com/username"
                                                className="input-field"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-slate-700 block mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="4"
                                            placeholder="Describe your room..."
                                            className="input-field resize-none py-3"
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Location & Features */}
                            {step === 2 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">City</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                    <MapPin size={18} />
                                                </div>
                                                <input
                                                    name="location.city"
                                                    value={formData.location.city}
                                                    onChange={handleChange}
                                                    type="text"
                                                    placeholder="Dhaka"
                                                    className="input-field pl-12"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">Address</label>
                                            <input
                                                name="location.address"
                                                value={formData.location.address}
                                                onChange={handleChange}
                                                type="text"
                                                placeholder="House 24, Road 10, Sector 4"
                                                className="input-field"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Google Maps URL Input */}
                                    <div className="bg-gradient-to-r from-blue-50 to-primary-50 border-2 border-blue-200 rounded-3xl p-6">
                                        <div className="flex items-start space-x-3 mb-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                                                <MapPin size={20} className="text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900 mb-1">📍 Paste Google Maps Link</h4>
                                                <p className="text-xs text-slate-600 mb-3">
                                                    Copy the URL from Google Maps and paste it here. We'll automatically extract the coordinates!
                                                </p>
                                                <input
                                                    type="text"
                                                    onChange={handleMapUrlPaste}
                                                    placeholder="https://maps.google.com/..."
                                                    className="w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                />
                                                <p className="text-[10px] text-slate-500 mt-2 italic">
                                                    💡 Tip: Open Google Maps → Right-click on location → Click the coordinates → Copy URL from browser
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div className="flex-1 h-px bg-slate-200"></div>
                                        <span className="px-4 text-xs font-bold text-slate-400 uppercase">Or</span>
                                        <div className="flex-1 h-px bg-slate-200"></div>
                                    </div>

                                    {/* Map Picker Button */}
                                    <div className="flex items-center space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowMapPicker(true)}
                                            className="flex-1 bg-gradient-to-r from-blue-500 to-primary-600 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
                                        >
                                            <MapPin size={20} />
                                            <span>Pick Location from Map</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={getCurrentLocation}
                                            className="px-6 py-3.5 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-all"
                                            title="Use My Current Location"
                                        >
                                            📍
                                        </button>
                                    </div>

                                    {formData.location.latitude && formData.location.longitude && (
                                        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start space-x-3">
                                            <CheckCircle2 size={20} className="text-green-600 mt-0.5 shrink-0" />
                                            <div className="text-sm">
                                                <p className="font-bold text-green-900">Location Coordinates Set!</p>
                                                <p className="text-green-700 text-xs mt-1">
                                                    Lat: {parseFloat(formData.location.latitude).toFixed(6)},
                                                    Lng: {parseFloat(formData.location.longitude).toFixed(6)}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Map Picker Modal */}
                                    {showMapPicker && (
                                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                                            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                                                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-slate-900">Pick Your Location</h3>
                                                        <p className="text-sm text-slate-500 mt-1">Enter coordinates manually or use your current location</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setShowMapPicker(false)}
                                                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                                    >
                                                        <X size={24} />
                                                    </button>
                                                </div>

                                                <div className="p-6">
                                                    <div className="relative h-[500px] rounded-2xl overflow-hidden border-2 border-slate-200">
                                                        <iframe
                                                            width="100%"
                                                            height="100%"
                                                            frameBorder="0"
                                                            src={`https://www.google.com/maps?q=${formData.location.latitude || '23.8103'},${formData.location.longitude || '90.4125'}&z=15&output=embed`}
                                                            title="Location Picker"
                                                        ></iframe>
                                                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                                            <div className="w-12 h-12 bg-red-500 rounded-full shadow-lg flex items-center justify-center text-white text-2xl animate-bounce">
                                                                📍
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
                                                        <p className="text-sm text-blue-900 font-medium mb-3">💡 Manual Coordinate Entry:</p>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-600 block mb-1">Latitude</label>
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    value={formData.location.latitude}
                                                                    onChange={(e) => setFormData({
                                                                        ...formData,
                                                                        location: { ...formData.location, latitude: e.target.value }
                                                                    })}
                                                                    placeholder="23.8103"
                                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-600 block mb-1">Longitude</label>
                                                                <input
                                                                    type="number"
                                                                    step="any"
                                                                    value={formData.location.longitude}
                                                                    onChange={(e) => setFormData({
                                                                        ...formData,
                                                                        location: { ...formData.location, longitude: e.target.value }
                                                                    })}
                                                                    placeholder="90.4125"
                                                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-2">
                                                            Tip: Right-click on Google Maps and select "What's here?" to get coordinates
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => setShowMapPicker(false)}
                                                        className="w-full mt-6 bg-primary-600 text-white py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all"
                                                    >
                                                        Confirm Location
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {formData.location.city && formData.location.address && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Location Preview (Google Maps)</label>
                                            <div className="rounded-3xl overflow-hidden h-44 border border-slate-200 bg-slate-50 relative group">
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    frameBorder="0"
                                                    src={`https://www.google.com/maps?q=${encodeURIComponent(formData.location.address + ', ' + formData.location.city)}&output=embed`}
                                                    className="grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                                                ></iframe>
                                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-200 flex items-center space-x-2 shadow-sm pointer-events-none">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                    <span className="text-[10px] font-bold text-slate-600">Syncing with Maps</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-sm font-bold text-slate-700 block mb-2">Facilities</label>
                                        <div className="flex space-x-2 mb-3">
                                            <input
                                                value={currentFacility}
                                                onChange={(e) => setCurrentFacility(e.target.value)}
                                                type="text"
                                                placeholder="e.g. Attached Washroom"
                                                className="input-field"
                                            />
                                            <button
                                                type="button"
                                                onClick={addFacility}
                                                className="bg-primary-100 text-primary-600 p-3 rounded-xl hover:bg-primary-200 transition-colors"
                                            >
                                                <Plus size={24} />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.facilities.map((fac, idx) => (
                                                <span key={idx} className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium text-slate-700">
                                                    <span>{fac}</span>
                                                    <button type="button" onClick={() => removeFacility(idx)} className="text-slate-400 hover:text-red-500">
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Media & Rules */}
                            {step === 3 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div>
                                        <label className="text-sm font-bold text-slate-700 block mb-2">House Rules</label>
                                        <div className="flex space-x-2 mb-3">
                                            <input
                                                value={currentRule}
                                                onChange={(e) => setCurrentRule(e.target.value)}
                                                type="text"
                                                placeholder="e.g. No Smoking"
                                                className="input-field"
                                            />
                                            <button
                                                type="button"
                                                onClick={addRule}
                                                className="bg-primary-100 text-primary-600 p-3 rounded-xl hover:bg-primary-200 transition-colors"
                                            >
                                                <Plus size={24} />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.rules.map((rule, idx) => (
                                                <span key={idx} className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium text-slate-700">
                                                    <span>{rule}</span>
                                                    <button type="button" onClick={() => removeRule(idx)} className="text-slate-400 hover:text-red-500">
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-slate-700 block mb-2">Current Images</label>
                                        <div className="flex gap-2 overflow-x-auto pb-4">
                                            {existingImages.map((img, i) => (
                                                <div key={i} className="relative w-20 h-20 shrink-0">
                                                    <img src={img.url} className="w-full h-full object-cover rounded-xl border border-slate-200" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">Upload New Images (Replaces Old)</label>
                                            <label className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-primary-400 hover:bg-primary-50 transition-all cursor-pointer group">
                                                <ImagePlus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                                                <p className="text-[10px] font-medium text-center">Select New Images</p>
                                                <input
                                                    type="file"
                                                    name="images"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                            <div className="flex gap-2 mt-2 overflow-x-auto">
                                                {imagePreviews.map((url, i) => (
                                                    <img key={i} src={url} alt="preview" className="w-12 h-12 object-cover rounded-lg" />
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block mb-2">Upload New Video</label>
                                            <label className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-primary-400 hover:bg-primary-50 transition-all cursor-pointer group">
                                                <Video size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                                                <p className="text-[10px] font-medium text-center">Select New Video</p>
                                                <input
                                                    type="file"
                                                    name="videos"
                                                    accept="video/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                            {videos.length > 0 && <p className="text-[10px] mt-2 text-green-600 font-medium truncate">{videos[0].name}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between pt-10 border-t border-slate-50">
                                {step > 1 ? (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex items-center space-x-2 text-slate-500 font-bold hover:text-slate-800 transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                        <span>Back</span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/room/${id}`)}
                                        className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                                    >
                                        Cancel
                                    </button>
                                )}

                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="btn-primary px-10 py-4 flex items-center space-x-2"
                                    >
                                        <span>Next</span>
                                        <ChevronRight size={20} />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary px-10 py-4 flex items-center space-x-2 bg-slate-900"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span>Save Changes</span>
                                                <CheckCircle2 size={20} />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateRoom;
