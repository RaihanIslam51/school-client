'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useLanguage } from '../../src/contexts/LanguageContext';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }
    }
};

const Achievements = () => {
    const { t, language } = useLanguage();
    const isBn = language === 'bn';

    const testimonials = isBn ? [
        {
            id: 1,
            quote: 'সালমেলা ইন্টারন্যাশনাল স্কুলে পড়াশোনা করে আমি পড়ালেখায় অভূতপূর্ব অগ্রগতি অর্জন করেছি। শিক্ষকদের আন্তরিক দিকনির্দেশনা ও প্রযুক্তি নির্ভর ক্লাস আমার শিক্ষাজীবনকে অত্যন্ত সমৃদ্ধ করেছে।',
            name: 'রাহাত হাসান',
            role: 'শিক্ষার্থী',
            subject: '১০ম শ্রেণী'
        },
        {
            id: 2,
            quote: 'স্কুলের সুশৃঙ্খল পরিবেশ ও আধুনিক সায়েন্স ল্যাব ব্যবহারের মাধ্যমে আমরা প্র্যাকটিক্যাল জ্ঞান অর্জনে সক্ষম হয়েছি। এখান থেকেই আমার ভবিষ্যৎ লক্ষ্যের সূচনা হয়েছে।',
            name: 'সারা আহমেদ',
            role: 'শিক্ষার্থী',
            subject: 'বিজ্ঞান বিভাগ'
        },
        {
            id: 3,
            quote: 'শিক্ষকদের সার্বক্ষণিক সহায়তা এবং ডিজিটাল এটেনডেন্স সিস্টেম আমাদের পড়াশোনায় আরও দায়িত্বশীল ও মনোযোগী করে তুলেছে। সালমেলা স্কুল সেরা শিক্ষা প্রদান করে।',
            name: 'তানভীর ইসলাম',
            role: 'শিক্ষার্থী',
            subject: 'ব্যবসায় শিক্ষা'
        }
    ] : [
        {
            id: 1,
            quote: 'Studying at Salmela International School has transformed my learning experience. The interactive multimedia classes and caring teachers motivated me to achieve top grades.',
            name: 'Jhon Smith',
            role: 'Student',
            subject: 'Class 10'
        },
        {
            id: 2,
            quote: 'The modern computer lab and supportive academic environment gave me the confidence to pursue my passions. This school builds a solid foundation for every child.',
            name: 'Emily Davis',
            role: 'Student',
            subject: 'Science Section'
        },
        {
            id: 3,
            quote: 'Salmela International School provides the perfect blend of discipline, quality education, and extra-curricular activities. I am proud to be a student here.',
            name: 'Michael Brown',
            role: 'Student',
            subject: 'Commerce Section'
        }
    ];

    return (
        <section className="py-16 sm:py-24 bg-[#F4F5F8] font-sans text-[#0B0F28] overflow-x-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ─── SECTION HEADER ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16 sm:mb-20 max-w-3xl mx-auto"
                >
                    <span className="text-xs sm:text-sm font-extrabold text-[#FF5500] tracking-widest uppercase mb-2 block">
                        {t('achievements.testimonials') || 'TESTIMONIALS'}
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B0F28] tracking-tight leading-tight">
                        {t('achievements.studentSaying') || 'What Our Students Say'}
                    </h2>
                </motion.div>

                {/* ─── TESTIMONIALS GRID ─── */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-30px' }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 items-stretch container mx-auto"
                >
                    {testimonials.map((item) => (
                        <motion.div
                            key={item.id}
                            variants={cardVariants}
                            whileHover={{ y: -8, scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="relative bg-white border border-[#FF5500]/40 p-6 sm:p-8 pt-9 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:border-[#FF5500] group min-h-[240px] rounded-none cursor-pointer"
                        >
                            {/* OVERLAPPING ORANGE QUOTE ICON BADGE */}
                            <div className="absolute -top-5 left-6 w-10 h-10 bg-[#FF5500] rounded-full flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                <Quote size={18} className="fill-white rotate-180" />
                            </div>

                            {/* STAR RATING */}
                            <div className="flex items-center gap-1 text-[#FF5500] mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className="fill-current text-[#FF5500]" />
                                ))}
                            </div>

                            {/* TESTIMONIAL QUOTE TEXT */}
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal mb-6">
                                &ldquo;{item.quote}&rdquo;
                            </p>

                            {/* AUTHOR NAME & SUBJECT */}
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs sm:text-sm font-sans mt-auto">
                                <div>
                                    <span className="font-extrabold text-[#0B0F28] block text-sm sm:text-base">{item.name}</span>
                                    <span className="font-medium text-gray-500 text-xs">{item.role} • {item.subject}</span>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-[#FF5500]" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
};

export default Achievements;