'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const ContactPage = () => {
    const { t, language } = useLanguage();
    const isBn = language === 'bn';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
        setTimeout(() => setIsSubmitted(false), 5000);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-[#374151] overflow-x-hidden">
            
            {/* ──────────────── TOP BANNER HEADER ──────────────── */}
            <div className="relative w-full h-56 sm:h-72 lg:h-80 overflow-hidden flex items-center justify-center bg-[#0B0F28]">
                <Image
                    src="/school1.png"
                    alt="Contacts Banner"
                    fill
                    className="object-cover opacity-50"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F28] via-black/40 to-black/30" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 text-center px-4"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
                        {isBn ? 'যোগাযোগ' : 'Contact Us'}
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-white/80">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">{isBn ? 'হোম' : 'Home'}</Link>
                        <span>»</span>
                        <span className="text-[#FF5500] font-bold">{isBn ? 'যোগাযোগ' : 'Contact Us'}</span>
                    </div>
                </motion.div>
            </div>

            {/* ──────────────── MAIN CONTENT (LOCATION & DETAILS & MAP & FORM) ──────────────── */}
            <div className="py-12 sm:py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* LOCATION DETAILS SECTION */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4 mb-10 text-left"
                    >
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F28] underline underline-offset-8 decoration-2 decoration-[#FF5500]">
                            {isBn ? 'যোগাযোগের ঠিকানা:' : 'Contact Location:'}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                            
                            {/* Address Card */}
                            <div className="flex items-start gap-4 p-5 bg-[#F4F5F8] rounded-xl border border-gray-200/80 shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-[#FF5500] text-white flex items-center justify-center shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-[#0B0F28] text-sm sm:text-base mb-1">
                                        {isBn ? 'ক্যাম্পাস ঠিকানা' : 'Campus Address'}
                                    </h4>
                                    <p className="text-sm font-medium text-gray-700 leading-snug">
                                        346, East Padardia, Saterkul Road, North Badda, Dhaka-2941
                                    </p>
                                </div>
                            </div>

                            {/* Contact Info Card */}
                            <div className="flex items-start gap-4 p-5 bg-[#F4F5F8] rounded-xl border border-gray-200/80 shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-[#FF5500] text-white flex items-center justify-center shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-extrabold text-[#0B0F28] text-sm sm:text-base mb-1">
                                        {isBn ? 'ফোন ও ইমেইল' : 'Phone & Email'}
                                    </h4>
                                    <p className="text-sm font-medium text-gray-700">
                                        <span className="font-bold text-[#0B0F28]">Phone:</span> +880-1321749596
                                    </p>
                                    <p className="text-sm font-medium text-gray-700">
                                        <span className="font-bold text-[#0B0F28]">Email:</span> salmela.international.school@gmail.com
                                    </p>
                                </div>
                            </div>

                        </div>
                    </motion.div>

                    {/* MAP EMBED */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="w-full overflow-hidden border border-gray-200 rounded-xl shadow-lg mb-16"
                    >
                        <iframe
                            title="Salmela International School Map"
                            src="https://www.google.com/maps?q=Salmela+International+School+346+East+Padardia+Saterkul+Rd+Dhaka+2941+Bangladesh&output=embed"
                            className="w-full h-80 sm:h-[450px] border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </motion.div>

                    {/* CONTACT FORM */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="max-w-3xl mx-auto bg-[#F4F5F8] p-6 sm:p-10 rounded-2xl border border-gray-200/80 shadow-md"
                    >
                        <div className="text-center mb-8">
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F28] mb-2">
                                {isBn ? 'আমাদের বার্তা পাঠান' : 'Send Us A Message'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {isBn ? 'যেকোনো প্রশ্ন থাকলে নিচের ফর্মে তথ্য দিয়ে আমাদের বার্তা পাঠান।' : 'Have questions? Fill out the form below and we will respond as soon as possible.'}
                            </p>
                        </div>

                        {isSubmitted && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800 text-sm font-semibold"
                            >
                                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                                <span>{isBn ? 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে! শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।' : 'Thank you for your message! We will get back to you soon.'}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-[#0B0F28] uppercase tracking-wider mb-2">
                                        {isBn ? 'আপনার নাম' : 'Your Name'}
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5500] focus:border-[#FF5500] transition-all"
                                        placeholder={isBn ? 'আপনার পূর্ণ নাম লিখুন' : 'Enter your name'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#0B0F28] uppercase tracking-wider mb-2">
                                        {isBn ? 'আপনার ইমেইল' : 'Your Email'}
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5500] focus:border-[#FF5500] transition-all"
                                        placeholder={isBn ? 'আপনার ইমেইল নাম লিখুন' : 'Enter your email'}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-[#0B0F28] uppercase tracking-wider mb-2">
                                        {isBn ? 'ফোন নম্বর' : 'Phone Number'}
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5500] focus:border-[#FF5500] transition-all"
                                        placeholder="+8801321749596"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#0B0F28] uppercase tracking-wider mb-2">
                                        {isBn ? 'বিষয়' : 'Subject'}
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5500] focus:border-[#FF5500] transition-all"
                                        placeholder={isBn ? 'বার্তার বিষয়' : 'Message subject'}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-[#0B0F28] uppercase tracking-wider mb-2">
                                    {isBn ? 'বার্তা' : 'Message'}
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5500] focus:border-[#FF5500] transition-all resize-none"
                                    placeholder={isBn ? 'আপনার বার্তা লিখুন...' : 'Write your message...'}
                                ></textarea>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-[#FF5500] hover:bg-[#e04b00] text-white font-extrabold py-3.5 px-6 rounded-lg uppercase tracking-wider shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <Send size={16} />
                                <span>{isBn ? 'বার্তা পাঠান' : 'Send Message'}</span>
                            </motion.button>
                        </form>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default ContactPage;