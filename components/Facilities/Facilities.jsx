'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Zap, Lightbulb, Calculator, Globe, Palette, Brain,
    BookOpen
} from 'lucide-react';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useFacilities } from '../../src/hooks/useApi';

const defaultClasses = [
    {
        id: 1,
        Icon: Zap,
        title: 'Bangla',
        description: 'As Bangla is our national language, our students learn to read, write, and communicate effectively through a structured curriculum.',
        href: '/academics'
    },
    {
        id: 2,
        Icon: Lightbulb,
        title: 'English',
        description: 'Mastering English empowers students to connect globally, express ideas clearly, and build a strong foundation for future success.',
        href: '/academics'
    },
    {
        id: 3,
        Icon: Calculator,
        title: 'Math',
        description: 'Mathematics develops logical reasoning, problem-solving skills, and conceptual understanding essential for critical thinking.',
        href: '/academics'
    },
    {
        id: 4,
        Icon: Globe,
        title: 'Social Science',
        description: 'Exploring human society, history, and scientific discovery helps students understand the world and their role in shaping the future.',
        href: '/academics'
    },
    {
        id: 5,
        Icon: Palette,
        title: 'Arts',
        description: 'Art education nurtures creativity, self-expression, and appreciation for cultural diversity and artistic significance.',
        href: '/academics'
    },
    {
        id: 6,
        Icon: Brain,
        title: 'General Knowledge',
        description: 'Broadening general knowledge enriches young minds, fostering curiosity and innovative thinking for everyday problem solving.',
        href: '/academics'
    },
];

const Facilities = () => {
    const { t } = useLanguage();
    const [showAll, setShowAll] = useState(false);

    const { data: facilitiesData } = useFacilities();

    const apiFacilities = useMemo(() => {
        if (!facilitiesData) return [];
        if (Array.isArray(facilitiesData)) return facilitiesData;
        if (Array.isArray(facilitiesData.data)) return facilitiesData.data;
        if (Array.isArray(facilitiesData.facilities)) return facilitiesData.facilities;
        return [];
    }, [facilitiesData]);

    const displayItems = useMemo(() => {
        if (apiFacilities.length > 0) {
            return apiFacilities.map((fac, idx) => ({
                id: fac._id || fac.id || `fac-${idx}`,
                Icon: defaultClasses[idx % defaultClasses.length].Icon,
                title: fac.title || fac.name || 'Facility',
                description: fac.description || fac.details || 'Quality educational facilities and resources for student development.',
                href: fac.link || '/academics'
            }));
        }
        return defaultClasses;
    }, [apiFacilities]);

    const visibleItems = showAll ? displayItems : displayItems.slice(0, 6);

    return (
        <section className="py-16 sm:py-24 bg-[#F4F5F8] font-sans text-[#0B0F28] overflow-x-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ─── SECTION HEADER ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto"
                >
                    <span className="text-xs sm:text-sm font-extrabold text-[#FF5500] tracking-widest uppercase mb-2 block">
                        {t('facilities.ourClasses') || 'OUR CLASSES'}
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B0F28] tracking-tight leading-tight">
                        {t('facilities.popularClasses') || 'Popular Classes'}
                    </h2>
                </motion.div>

                {/* ─── CLASSES / FACILITIES GRID ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 container mx-auto">
                    {visibleItems.map((item, idx) => {
                        const ItemIcon = item.Icon || BookOpen;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: (idx % 3) * 0.1 }}
                                whileHover={{ y: -6, scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="bg-white border border-gray-200/80 p-6 sm:p-8 lg:p-10 flex flex-col items-center text-center justify-between transition-all duration-300 hover:shadow-xl hover:border-[#FF5500] group cursor-pointer min-h-[300px] sm:min-h-[320px]"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 mb-4 flex items-center justify-center text-[#FF5500] transition-transform duration-300 group-hover:scale-110">
                                        <ItemIcon size={46} className="stroke-[1.3]" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-[#0B0F28] mb-3 group-hover:text-[#FF5500] transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-6 font-normal">
                                        {item.description}
                                    </p>
                                </div>

                                <Link
                                    href={item.href || '/academics'}
                                    className="text-[11px] sm:text-xs font-extrabold text-[#FF5500] uppercase tracking-wider flex items-center gap-1.5 hover:underline mt-auto group/link"
                                >
                                    <span>READ MORE</span>
                                    <span className="text-sm transition-transform duration-200 group-hover/link:translate-x-1">›</span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ─── VIEW MORE BUTTON ─── */}
                {displayItems.length > 6 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="text-center mt-12 sm:mt-16"
                    >
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="px-8 py-3.5 bg-[#FF5500] hover:bg-[#e04b00] active:scale-95 text-white font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-md transition-all duration-200 hover:shadow-lg"
                        >
                            {showAll ? 'VIEW LESS' : 'VIEW MORE'}
                        </button>
                    </motion.div>
                )}

            </div>
        </section>
    );
};

export default Facilities;