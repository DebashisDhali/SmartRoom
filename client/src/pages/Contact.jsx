import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create mailto link with form data
        const mailtoLink = `mailto:support@smartroom.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;

        window.location.href = mailtoLink;
        toast.success('Opening your email client...');

        // Reset form
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50 py-16">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-slate-900 mb-4">
                        Get in <span className="text-primary-600">Touch</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Email Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-all">
                                <Mail size={28} className="text-primary-600 group-hover:text-white transition-all" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Email Us</h3>
                            <p className="text-sm text-slate-500 mb-3">Our team is here to help</p>
                            <a
                                href="mailto:support@smartroom.com?subject=Inquiry from Contact Page"
                                className="text-primary-600 font-bold text-sm hover:underline"
                            >
                                support@smartroom.com
                            </a>
                        </div>

                        {/* Phone Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-all">
                                <Phone size={28} className="text-green-600 group-hover:text-white transition-all" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Call Us</h3>
                            <p className="text-sm text-slate-500 mb-3">Mon-Fri from 9am to 6pm</p>
                            <a
                                href="tel:+8801234567890"
                                className="text-green-600 font-bold text-sm hover:underline"
                            >
                                +880 1234 567890
                            </a>
                        </div>

                        {/* WhatsApp Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-all">
                                <MessageCircle size={28} className="text-emerald-600 group-hover:text-white transition-all" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">WhatsApp</h3>
                            <p className="text-sm text-slate-500 mb-3">Quick response guaranteed</p>
                            <a
                                href="https://wa.me/8801234567890?text=Hi, I need help with SmartRoom"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 font-bold text-sm hover:underline"
                            >
                                Chat on WhatsApp
                            </a>
                        </div>

                        {/* Office Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-all">
                                <MapPin size={28} className="text-blue-600 group-hover:text-white transition-all" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Visit Us</h3>
                            <p className="text-sm text-slate-500 mb-3">Come say hello at our office</p>
                            <p className="text-sm text-slate-700 font-medium">
                                Sector 10, Uttara<br />
                                Dhaka, Bangladesh
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Send us a Message</h2>
                            <p className="text-slate-500 mb-8">Fill out the form below and we'll get back to you shortly.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-bold text-slate-700 block mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-slate-700 block mb-2">Your Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-slate-700 block mb-2">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="How can we help you?"
                                        className="input-field"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-slate-700 block mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="6"
                                        placeholder="Tell us more about your inquiry..."
                                        className="input-field resize-none"
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                                >
                                    <Send size={20} />
                                    <span>Send Message</span>
                                </button>
                            </form>

                            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                                <p className="text-xs text-blue-900">
                                    <strong>💡 Note:</strong> This will open your default email client. If you prefer, you can also reach us directly at the contact details on the left.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
