'use client';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, GraduationCap, BookOpen, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useBanners } from '../../src/hooks/useApi';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.1,
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }
    }
};

const Hero = () => {
    const { t } = useLanguage();

    const defaultBanners = useMemo(() => [
        { image: '/school1.png', alt: 'School Banner 1' },
        { image: '/school1.png', alt: 'School Banner 2' },
        { image: '/school1.png', alt: 'School Banner 3' },
        { image: '/school1.png', alt: 'School Banner 4' },
        { image: '/school1.png', alt: 'School Banner 5' },
        { image: '/school1.png', alt: 'School Banner 6' },
    ], []);

    const [currentSlide, setCurrentSlide] = useState(0);
    const { data: bannersData } = useBanners();
    const banners = bannersData?.data || [];

    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const intervalRef = useRef(null);

    const activeBanners = banners.length > 0 ? banners : defaultBanners;
    const slides = useMemo(() => {
        const all = activeBanners.flatMap(b =>
            b.image ? [{ image: b.image, banner: b }] :
                (!b.images || b.images.length === 0) ? [] : b.images.map(image => ({ image, banner: b }))
        );
        return all.length > 0 ? all : defaultBanners.map(b => ({ image: b.image, banner: b }));
    }, [activeBanners, defaultBanners]);

    useEffect(() => {
        if (slides.length <= 1) return;
        intervalRef.current = setInterval(() => {
            setCurrentSlide(p => (p + 1) % slides.length);
        }, 6000);
        return () => clearInterval(intervalRef.current);
    }, [slides.length, currentSlide]);

    const nextSlide = useCallback(() => { setCurrentSlide(p => (p + 1) % slides.length); }, [slides.length]);
    const prevSlide = useCallback(() => { setCurrentSlide(p => (p - 1 + slides.length) % slides.length); }, [slides.length]);
    const goToSlide = useCallback((i) => { setCurrentSlide(i); }, []);

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
        setTouchEnd(e.targetTouches[0].clientX);
    };
    const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const d = touchStart - touchEnd;
        if (d > 50) nextSlide();
        else if (d < -50) prevSlide();
        setTouchStart(0);
        setTouchEnd(0);
    };

    return (
        <section
            className="relative w-full bg-white font-sans overflow-x-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="banner"
            aria-label="Hero Section"
        >
            {/* ──────────────── HERO BACKGROUND SLIDER ──────────────── */}
            <div className="relative w-full h-[400px] sm:h-[520px] md:h-[600px] lg:h-[650px] xl:h-[700px] overflow-hidden bg-[#0B0F28]">
                <AnimatePresence mode="wait">
                    {slides.map((slide, index) => index === currentSlide && (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 1.04 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={slide.image}
                                alt={slide.banner?.alt || 'School banner'}
                                fill
                                className="object-cover object-center"
                                priority={index === 0}
                                sizes="100vw"
                                unoptimized={slide.image.includes('i.ibb.co')}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F28]/70 via-black/35 to-black/20" />

                {/* ──────────────── VERTICAL SLIDE INDICATORS (RIGHT SIDE) ──────────────── */}
                <div className="absolute right-3 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2.5">
                    {slides.slice(0, 6).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToSlide(i)}
                            aria-label={`Go to slide ${i + 1}`}
                            className="p-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5500]"
                        >
                            <span className={`block rounded-full transition-all duration-300 ${i === currentSlide
                                    ? 'w-4 h-4 bg-[#FF5500] border-2 border-white shadow-lg scale-110'
                                    : 'w-3 h-3 bg-transparent border-2 border-white/70 hover:border-white hover:scale-105'
                                }`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* ──────────────── OVERLAPPING FEATURE CARDS (3 CARDS - STAGGERED STEP DESIGN) ──────────────── */}
            <div className="container mx-auto px-4 sm:px-6 relative z-30 -mt-20 sm:-mt-28 md:-mt-36 lg:-mt-44">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-40px' }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto items-start"
                >

                    {/* CARD 1: SKILLED TEACHERS */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{ y: -8, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="bg-[#0B0F28] hover:bg-[#FF5500] p-6 sm:p-8 lg:p-10 text-center flex flex-col items-center justify-between text-white shadow-xl transition-all duration-300 group cursor-pointer min-h-[250px] sm:min-h-[280px] md:min-h-[360px]"
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 mb-3 sm:mb-4 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
                                <Users size={46} className="stroke-[1.3]" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-2.5 sm:mb-3 text-white">
                                Skilled Teachers
                            </h3>
                            <p className="text-xs sm:text-sm text-white/80 group-hover:text-white/95 leading-relaxed mb-5 max-w-xs font-normal transition-colors">
                                Our skilled teachers evaluate the mind and give energy to the students to reach their full potential.
                            </p>
                        </div>
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white tracking-wider uppercase transition-all"
                        >
                            <span className="group-hover:underline">Read More</span>
                            <span className="text-sm transition-transform duration-200 group-hover:translate-x-1">›</span>
                        </Link>
                    </motion.div>

                    {/* CARD 2: SCHOLARSHIP FACILITY */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{ y: -8, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="bg-[#FF5500] p-6 sm:p-8 lg:p-10 md:pb-16 text-center flex flex-col items-center justify-between text-white shadow-2xl transition-all duration-300 group cursor-pointer min-h-[250px] sm:min-h-[280px] md:min-h-[420px]"
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 mb-3 sm:mb-4 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
                                <GraduationCap size={50} className="stroke-[1.3]" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-2.5 sm:mb-3 text-white">
                                Scholarship Facility
                            </h3>
                            <p className="text-xs sm:text-sm text-white/95 leading-relaxed mb-5 max-w-xs font-normal">
                                {t('common.schoolName') || 'Salmela International School'} offers merit scholarship facilities. Please contact us for details.
                            </p>
                        </div>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white tracking-wider uppercase transition-all"
                        >
                            <span className="group-hover:underline">Read More</span>
                            <span className="text-sm transition-transform duration-200 group-hover:translate-x-1">›</span>
                        </Link>
                    </motion.div>

                    {/* CARD 3: ONLINE ATTENDANCES */}
                    <motion.div
                        variants={cardVariants}
                        whileHover={{ y: -8, scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="bg-[#0B0F28] hover:bg-[#FF5500] p-6 sm:p-8 lg:p-10 md:pb-24 text-center flex flex-col items-center justify-between text-white shadow-2xl transition-all duration-300 group cursor-pointer min-h-[250px] sm:min-h-[280px] md:min-h-[480px]"
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 mb-3 sm:mb-4 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
                                <BookOpen size={46} className="stroke-[1.3]" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-2.5 sm:mb-3 text-white">
                                Online Attendances
                            </h3>
                            <p className="text-xs sm:text-sm text-white/80 group-hover:text-white/95 leading-relaxed mb-5 max-w-xs font-normal transition-colors">
                                Real-time online attendance tracking empowers students and parents with academic clarity and confidence.
                            </p>
                        </div>
                        <Link
                            href="/portal"
                            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white tracking-wider uppercase transition-all"
                        >
                            <span className="group-hover:underline">Read More</span>
                            <span className="text-sm transition-transform duration-200 group-hover:translate-x-1">›</span>
                        </Link>
                    </motion.div>

                </motion.div>
            </div>

            {/* ──────────────── WELCOME ABOUT SECTION (BELOW CARDS) ──────────────── */}
            <div className="bg-white pt-16 sm:pt-24 lg:pt-28 pb-16 sm:pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center container mx-auto">

                        {/* LEFT: SCHOOL BUILDING IMAGE */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.65, ease: 'easeOut' }}
                            className="relative w-full h-[280px] sm:h-[400px] lg:h-[460px] overflow-hidden shadow-xl group cursor-pointer"
                        >
                            <Image
                                src="/school1.png"
                                alt={t('common.schoolName') || 'Salmela International School Building'}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>

                        {/* RIGHT: WELCOME CONTENT */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.65, ease: 'easeOut' }}
                            className="space-y-5"
                        >
                            <div className="inline-block">
                                <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF5500] bg-[#FF5500]/10 px-3 py-1 rounded-full">
                                    About Our School
                                </span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0B0F28] tracking-tight leading-snug">
                                Welcome to {t('common.schoolName') || 'Salmela International School'}
                            </h2>

                            <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
                                A proper education enhances humanity and enriches the human mind, and quality education helps people move forward on the path to success and prosperity.
                            </p>

                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                                {t('common.schoolName') || 'Salmela International School'} is an educational institution founded by &ldquo;Joy &amp; Hope Trust&rdquo;. The founder of the &ldquo;Joy &amp; Hope Trust&rdquo; is Heikki Salmela, a Finnish Businessman, who has a heart for the children of Bangladesh.
                            </p>

                            {/* CHECKLIST */}
                            <div className="pt-3 space-y-3.5">
                                <div className="flex items-center gap-3 group">
                                    <div className="w-6 h-6 rounded-full bg-[#FF5500] text-white flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                                        <CheckCircle size={14} className="stroke-[3]" />
                                    </div>
                                    <span className="font-bold text-sm text-[#0B0F28] group-hover:text-[#FF5500] transition-colors">Great Technology &amp; Modern Labs</span>
                                </div>

                                <div className="flex items-center gap-3 group">
                                    <div className="w-6 h-6 rounded-full bg-[#FF5500] text-white flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                                        <CheckCircle size={14} className="stroke-[3]" />
                                    </div>
                                    <span className="font-bold text-sm text-[#0B0F28] group-hover:text-[#FF5500] transition-colors">Experienced &amp; Dedicated Teachers</span>
                                </div>

                                <div className="flex items-center gap-3 group">
                                    <div className="w-6 h-6 rounded-full bg-[#FF5500] text-white flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                                        <CheckCircle size={14} className="stroke-[3]" />
                                    </div>
                                    <span className="font-bold text-sm text-[#0B0F28] group-hover:text-[#FF5500] transition-colors">Holistic Curriculum &amp; Student Portal</span>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;