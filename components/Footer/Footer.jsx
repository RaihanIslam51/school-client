import React from 'react';
import Link from 'next/link';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
        { name: 'Academics', href: '/academics' },
        { name: 'Admissions', href: '/admissions' },
        { name: 'Notices', href: '/notices' },
        { name: 'Contact', href: '/contact' },
    ];

    const contactInfo = [
        { icon: '📍', text: '123 Education Street, City, State 12345' },
        { icon: '📞', text: '+1 (555) 123-4567' },
        { icon: '✉️', text: 'info@sunlightschool.edu' },
    ];

    const socialLinks = [
        { name: 'Facebook', href: '#', icon: '📘' },
        { name: 'Twitter', href: '#', icon: '🐦' },
        { name: 'Instagram', href: '#', icon: '📷' },
        { name: 'LinkedIn', href: '#', icon: '💼' },
    ];

    return (
        <footer className="bg-white text-black border-t border-black">
            <div className="container mx-auto px-3 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* School Info */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-blue-900 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900">Sunlight School</h3>
                        </div>
                        <p className="text-black text-sm leading-relaxed mb-6">
                            Nurturing young minds and building bright futures through excellence in education,
                            character development, and innovative learning experiences.
                        </p>
                        <div className="flex space-x-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="w-10 h-10 bg-white border border-black hover:bg-blue-900 hover:border-blue-900 flex items-center justify-center transition-colors duration-200 text-lg"
                                    aria-label={social.name}
                                >
                                    <span className="text-black hover:text-white transition-colors duration-200">{social.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-blue-900 flex items-center gap-2">
                            <span className="w-1 h-6 bg-blue-900"></span>
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-black hover:text-blue-900 transition-colors duration-200 text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-blue-900 flex items-center gap-2">
                            <span className="w-1 h-6 bg-blue-900"></span>
                            Contact Info
                        </h4>
                        <ul className="space-y-4">
                            {contactInfo.map((info, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                    <span className="text-blue-900 text-lg flex-shrink-0 mt-0.5">
                                        {info.icon}
                                    </span>
                                    <span className="text-black text-sm leading-relaxed">
                                        {info.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter/Additional Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-blue-900 flex items-center gap-2">
                            <span className="w-1 h-6 bg-blue-900"></span>
                            Stay Connected
                        </h4>
                        <p className="text-black text-sm mb-4 leading-relaxed">
                            Subscribe to our newsletter for the latest updates, events, and school news.
                        </p>
                        <div className="space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-white border border-black text-black placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm transition-colors duration-200"
                            />
                            <button className="w-full px-4 py-3 bg-blue-900 hover:bg-black text-white transition-colors duration-200 font-semibold text-sm">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-black mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-black text-sm">
                            © {currentYear} <span className="font-semibold text-blue-900">Sunlight School</span>. All rights reserved.
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <Link href="/privacy" className="text-black hover:text-blue-900 transition-colors duration-200">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-black hover:text-blue-900 transition-colors duration-200">
                                Terms of Service
                            </Link>
                            <Link href="/accessibility" className="text-black hover:text-blue-900 transition-colors duration-200">
                                Accessibility
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;