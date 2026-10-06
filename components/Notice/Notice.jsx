'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell } from 'lucide-react';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useNotices } from '../../src/hooks/useApi';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' }
    }
};

const Notice = () => {
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { t, language } = useLanguage();
    const isBn = language === 'bn';

    const { data: noticesData, isLoading: loading, error: fetchError } = useNotices();
    const notices = noticesData?.data || [];
    const error = fetchError?.message || null;

    /* ── Fallback notices matching reference screenshots if API data is empty ── */
    const defaultNotices = [
        { _id: '1', title: '২১ ফেব্রুয়ারি', date: '2026-02-19', content: '২১শে ফেব্রুয়ারি মহান শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস উপলক্ষে বিদ্যালয়ের কার্যক্রম বন্ধ থাকিবে এবং প্রভাতফেরীর আয়োজন করা হইবে।' },
        { _id: '2', title: 'Saraswati Puja', date: '2026-01-26', content: 'Saraswati Puja will be celebrated on 26th January. All students and teachers are requested to attend the puja program at the school campus.' },
        { _id: '3', title: 'Saraswati Puja', date: '2026-01-26', content: 'Notice regarding Saraswati Puja holiday and cultural program arrangements.' },
        { _id: '4', title: 'Durga Puja', date: '2026-09-27', content: 'School will remain closed on account of Durga Puja festival from 27th September to 5th October.' },
        { _id: '5', title: 'National Mourning Day', date: '2026-08-14', content: 'National Mourning Day will be observed with solemnity and respect on 15th August.' },
        { _id: '6', title: 'Holiday Notice (Ashura)', date: '2026-08-07', content: 'The school will remain closed on 7th August on account of Holy Ashura.' },
        { _id: '7', title: 'Public Holiday', date: '2026-07-26', content: 'Public holiday notice for all students and administration staff.' },
        { _id: '8', title: 'Urgent Notice', date: '2026-04-06', content: 'Urgent notice regarding upcoming mid-term evaluation exams and fee submission.' },
        { _id: '9', title: 'Government Holiday (Sab-E-Miraj)', date: '2026-03-01', content: 'School will remain closed on 1st March on the occasion of Holy Sab-E-Miraj.' },
    ];

    const displayNotices = notices.length > 0 ? notices : defaultNotices;

    /* ── Helper to format Day and Month ── */
    const getDayAndMonth = (dateString) => {
        if (!dateString) return { day: '01', month: 'Jan' };
        try {
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return { day: '01', month: 'Jan' };
            const day = d.getDate().toString().padStart(2, '0');
            const month = d.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { month: 'long' });
            return { day, month };
        } catch {
            return { day: '01', month: 'Jan' };
        }
    };

    const openModal = (n) => { setSelectedNotice(n); setShowModal(true); };
    const closeModal = () => { setShowModal(false); setSelectedNotice(null); };

    return (
        <section className="min-h-screen bg-white font-sans text-[#0B0F28] overflow-x-hidden">

            {/* ──────────────── TOP BANNER HEADER ──────────────── */}
            <div className="relative w-full h-56 sm:h-72 lg:h-80 overflow-hidden flex items-center justify-center bg-[#0B0F28]">
                <Image
                    src="/school1.png"
                    alt="Notice Boards Banner"
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
                        {isBn ? 'নোটিশ বোর্ড' : 'Notice Boards'}
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-white/80">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">{isBn ? 'হোম' : 'Home'}</Link>
                        <span>»</span>
                        <span className="text-[#FF5500] font-bold">{isBn ? 'নোটিশ বোর্ড' : 'Notice Boards'}</span>
                    </div>
                </motion.div>
            </div>

            {/* ──────────────── NOTICES LIST ──────────────── */}
            <div className="py-12 sm:py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                    {loading ? (
                        <div className="space-y-4 max-w-5xl mx-auto">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-28 bg-gray-100 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500 font-bold">{error}</div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-30px' }}
                            className="space-y-5 max-w-5xl mx-auto"
                        >
                            {displayNotices.map((notice) => {
                                const { day, month } = getDayAndMonth(notice.createdAt || notice.date);

                                return (
                                    <motion.div
                                        key={notice._id || notice.id || notice.title + notice.date}
                                        variants={itemVariants}
                                        whileHover={{ y: -3, scale: 1.005 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => openModal(notice)}
                                        className="relative bg-white border border-gray-200 hover:border-[#FF5500] hover:border-2 p-4 sm:p-5 transition-all duration-300 shadow-sm hover:shadow-xl group cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                    >
                                        {/* LEFT: DATE BOX + TITLE */}
                                        <div className="flex items-center gap-4 sm:gap-8 min-w-0 w-full sm:w-auto">

                                            {/* Date Box (Inverts to solid orange on hover) */}
                                            <div className="w-18 h-18 sm:w-24 sm:h-24 border-2 border-[#FF5500] bg-white group-hover:bg-[#FF5500] text-[#FF5500] group-hover:text-white flex flex-col items-center justify-center transition-colors duration-300 shrink-0">
                                                <span className="text-2xl sm:text-3xl font-extrabold leading-none">
                                                    {day}
                                                </span>
                                                <span className="text-xs sm:text-sm font-bold capitalize mt-1">
                                                    {month}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-base sm:text-xl font-extrabold text-[#0B0F28] leading-tight flex-1 group-hover:text-[#FF5500] transition-colors">
                                                {notice.title}
                                            </h3>
                                        </div>

                                        {/* RIGHT: READ MORE BUTTON */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openModal(notice); }}
                                            className="self-end sm:self-auto px-4 py-2 sm:px-6 sm:py-2.5 border border-[#FF5500] text-[#FF5500] group-hover:bg-[#FF5500] group-hover:text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shrink-0"
                                        >
                                            {isBn ? 'বিস্তারিত' : 'READ MORE'}
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                </div>
            </div>

            {/* ──────────────── NOTICE DETAILS MODAL ──────────────── */}
            <AnimatePresence>
                {showModal && selectedNotice && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white max-w-xl w-full p-6 sm:p-8 shadow-2xl border-t-4 border-[#FF5500] relative rounded-sm"
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 transition-colors"
                                aria-label="Close modal"
                            >
                                <X size={24} />
                            </button>

                            {/* Modal Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-[#FF5500]/10 text-[#FF5500] rounded-lg">
                                    <Bell size={22} />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-[#FF5500] uppercase tracking-wider">
                                        {isBn ? 'নোটিশের বিবরণ' : 'Notice Details'}
                                    </span>
                                    <p className="text-xs text-gray-500 font-medium">
                                        {selectedNotice.date || selectedNotice.createdAt}
                                    </p>
                                </div>
                            </div>

                            {/* Modal Title */}
                            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B0F28] mb-4">
                                {selectedNotice.title}
                            </h2>

                            {/* Modal Content */}
                            <div className="text-sm text-gray-700 leading-relaxed space-y-3 mb-6 bg-gray-50 p-4 border-l-4 border-[#0B0F28]">
                                <p className="whitespace-pre-line">{selectedNotice.content}</p>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2 bg-[#0B0F28] hover:bg-[#FF5500] text-white text-xs font-extrabold uppercase tracking-wider transition-colors"
                                >
                                    {isBn ? 'বন্ধ করুন' : 'Close'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Notice;