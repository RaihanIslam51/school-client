'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Play, X, Award, Users, GraduationCap, BookOpen } from 'lucide-react';
import { useLanguage } from '../../src/contexts/LanguageContext';

const CounterNumber = ({ numericTarget, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-40px' });

    useEffect(() => {
        if (!isInView) return;
        let startTime = null;
        const duration = 1800; // 1.8s animation

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Smooth ease-out quad formula
            const easeOut = progress * (2 - progress);
            setCount(Math.floor(easeOut * numericTarget));

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                setCount(numericTarget);
            }
        };

        requestAnimationFrame(step);
    }, [isInView, numericTarget]);

    return (
        <span ref={ref}>
            {count}{suffix}
        </span>
    );
};

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        }
    }
};

const statVariants = {
    hidden: { opacity: 0, y: 25 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: 'easeOut' }
    }
};

const Academics = () => {
    const { t, language } = useLanguage();
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    const isBn = language === 'bn';

    const stats = [
        {
            numericValue: 60,
            suffix: '+',
            icon: Users,
            label: isBn ? 'দক্ষ শিক্ষক' : 'Skilled Teachers'
        },
        {
            numericValue: 800,
            suffix: '+',
            icon: GraduationCap,
            label: isBn ? 'মেধাবী শিক্ষার্থী' : 'Bright Students'
        },
        {
            numericValue: 5,
            suffix: '',
            icon: BookOpen,
            label: isBn ? 'শিক্ষা বিভাগ' : 'Academic Departments'
        },
        {
            numericValue: 19,
            suffix: '',
            icon: Award,
            label: isBn ? 'জাতীয় পুরস্কার' : 'National Awards'
        }
    ];

    return (
        <section className="py-16 sm:py-24 bg-[#0B0F28] font-sans text-white overflow-hidden relative">
            
            {/* Background Glow Accents */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FF5500]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#FF5500]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* ─── TOP SECTION: VIDEO THUMBNAIL + TEXT CONTENT ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center mb-16 sm:mb-20">

                    {/* LEFT COLUMN: VIDEO THUMBNAIL WITH PLAY BUTTON */}
                    <motion.div
                        initial={{ opacity: 0, x: -35 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.65, ease: 'easeOut' }}
                        className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-md overflow-hidden bg-gray-900 shadow-2xl group cursor-pointer border border-[#1E2548]"
                        onClick={() => setIsVideoOpen(true)}
                    >
                        <Image
                            src="/school1.png"
                            alt={isBn ? 'স্কুল ভিডিও ফ্রিভিউ' : 'School Video Preview'}
                            fill
                            className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F28]/80 via-black/30 to-transparent flex items-center justify-center">
                            
                            {/* PLAY BUTTON WITH PULSE */}
                            <motion.button
                                whileHover={{ scale: 1.12 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative w-16 h-16 sm:w-20 sm:h-20 bg-[#FF5500] rounded-full flex items-center justify-center text-white shadow-2xl ring-4 ring-[#FF5500]/40 transition-all duration-300 group-hover:ring-[#FF5500]/80 group-hover:bg-[#e04b00]"
                                aria-label={isBn ? 'ভিডিও প্লেই করুন' : 'Play Video'}
                            >
                                <Play size={28} className="fill-white translate-x-0.5" />
                            </motion.button>

                        </div>

                        <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none">
                            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF5500] bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 inline-block mb-1">
                                {isBn ? 'ক্যাম্পাস ভিডিও' : 'Campus Tour'}
                            </span>
                            <p className="text-sm sm:text-base font-bold text-white drop-shadow">
                                {isBn ? 'আমাদের বিশ্বমানের ক্যাম্পাস এক্সপ্লোর করুন' : 'Explore Our World-Class Campus'}
                            </p>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN: TEXT CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, x: 35 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.65, ease: 'easeOut' }}
                        className="flex flex-col justify-center"
                    >
                        <div className="inline-block mb-3">
                            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF5500] bg-[#FF5500]/10 px-3 py-1.5 rounded-full border border-[#FF5500]/20">
                                {isBn ? 'একাডেমিক শ্রেষ্ঠত্ব' : 'Academic Excellence'}
                            </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5 leading-snug">
                            {isBn ? 'বিশ্বমানের সেরা আন্তর্জাতিক স্কুল' : 'World-Class International School'}
                        </h2>

                        <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                            <p>
                                {isBn
                                    ? 'সালমেলা ইন্টারন্যাশনাল স্কুল শিক্ষার্থীদের মননশীলতা ও আধুনিক মানসম্পন্ন শিক্ষার এক অনন্য মেলবন্ধন রচনা করে। আমরা উন্নত প্রযুক্তি ও নৈতিক শিক্ষার মাধ্যমে শিক্ষার্থীদের ভবিষ্যতের জন্য তৈরি করি।'
                                    : 'Salmela International School provides an extraordinary blending of innovative education and moral values. We equip students with modern technology, critical thinking, and character development for tomorrow.'}
                            </p>
                            <p>
                                {isBn
                                    ? 'আমাদের অভিজ্ঞ শিক্ষক মণ্ডলী প্রতিটি শিক্ষার্থীর মেধা ও মননশীলতা বিকাশে নিবেদিতপ্রাণ। আধুনিক ক্লাসরুম এবং সমৃদ্ধ লাইব্রেরি শিক্ষার্থীদের শিক্ষার প্রতিটি পদক্ষেপে অনুপ্রেরণা জোগায়।'
                                    : 'Our dedicated teachers are passionate about nurturing each student’s individual potential. State-of-the-art classrooms and rich learning facilities inspire holistic development.'}
                            </p>
                        </div>
                    </motion.div>

                </div>

                {/* ─── BOTTOM SECTION: 4 STAT BOXES WITH ANIMATED COUNTERS ─── */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-30px' }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
                >
                    {stats.map((stat, idx) => {
                        const StatIcon = stat.icon;

                        return (
                            <motion.div
                                key={idx}
                                variants={statVariants}
                                whileHover={{ y: -6, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-[#0B0F28] border border-[#212952] p-6 sm:p-8 text-center rounded-sm transition-all duration-300 hover:border-[#FF5500] hover:bg-[#0e153b] group shadow-xl relative overflow-hidden cursor-pointer"
                            >
                                <div className="absolute top-3 right-3 text-[#FF5500]/15 group-hover:text-[#FF5500]/30 transition-colors">
                                    <StatIcon size={36} />
                                </div>
                                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FF5500] mb-2 font-sans tracking-tight group-hover:scale-105 transition-transform duration-300">
                                    <CounterNumber numericTarget={stat.numericValue} suffix={stat.suffix} />
                                </div>
                                <div className="text-xs sm:text-sm font-bold text-white/90 tracking-wide group-hover:text-white transition-colors">
                                    {stat.label}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>

            {/* ─── VIDEO MODAL ─── */}
            <AnimatePresence>
                {isVideoOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
                        onClick={() => setIsVideoOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl aspect-video border border-gray-800"
                        >
                            <button
                                onClick={() => setIsVideoOpen(false)}
                                className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/70 hover:bg-[#FF5500] text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                                title="School Overview Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Academics;
