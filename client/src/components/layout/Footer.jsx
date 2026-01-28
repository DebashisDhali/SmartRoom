import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white">
                                <Home size={24} />
                            </div>
                            <span className="text-xl font-bold text-white">
                                SmartRoom
                            </span>
                        </Link>
                        <p className="text-slate-400 leading-relaxed">
                            Making room hunting easy, transparent, and hassle-free for bachelors and families. Find your perfect living space without brokers.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://facebook.com/smartroom"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="https://twitter.com/smartroom"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all"
                            >
                                <Twitter size={18} />
                            </a>
                            <a
                                href="https://instagram.com/smartroom"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="https://linkedin.com/company/smartroom"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all"
                            >
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li><Link to="/rooms" className="hover:text-primary-400 transition-colors">Find Rooms</Link></li>
                            <li><Link to="/register" className="hover:text-primary-400 transition-colors">List Your Room</Link></li>
                            <li><Link to="/dashboard" className="hover:text-primary-400 transition-colors">My Dashboard</Link></li>
                            <li><Link to="/contact" className="hover:text-primary-400 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Support</h3>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="https://wa.me/8801234567890?text=Hi, I have a question about SmartRoom"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary-400 transition-colors"
                                >
                                    FAQs & Help
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:support@smartroom.com?subject=Terms of Service Inquiry"
                                    className="hover:text-primary-400 transition-colors"
                                >
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:support@smartroom.com?subject=Privacy Policy Inquiry"
                                    className="hover:text-primary-400 transition-colors"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:support@smartroom.com?subject=Trust & Safety Inquiry"
                                    className="hover:text-primary-400 transition-colors"
                                >
                                    Trust & Safety
                                </a>
                            </li>
                            <li><Link to="/rooms" className="hover:text-primary-400 transition-colors">Browse All Rooms</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <MapPin size={18} className="text-primary-500 mt-1 flex-shrink-0" />
                                <span>Sector 10, Uttara, Dhaka, Bangladesh</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={18} className="text-primary-500 flex-shrink-0" />
                                <a
                                    href="mailto:support@smartroom.com?subject=Inquiry from SmartRoom Website"
                                    className="hover:text-primary-400 transition-colors"
                                >
                                    support@smartroom.com
                                </a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={18} className="text-primary-500 flex-shrink-0" />
                                <a
                                    href="tel:+8801234567890"
                                    className="hover:text-primary-400 transition-colors"
                                >
                                    +880 1234 567890
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} SmartRoom. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span>Built with ❤️ for Bachelors</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
