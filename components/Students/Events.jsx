'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Events = () => {
    return (
        <div className="w-full bg-white font-sans text-gray-900 min-h-screen">
            
            {/* ─── HERO HEADER BANNER ─── */}
            <div className="relative w-full h-52 sm:h-64 md:h-80 flex items-center justify-center text-center overflow-hidden bg-gray-900 shadow-sm">
                <Image
                    src="/school1.png"
                    alt="Events"
                    fill
                    priority
                    className="object-cover opacity-60 filter brightness-90"
                />
                <div className="absolute inset-0 bg-black/40" />

                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 px-4 container mx-auto text-center"
                >
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
                        Events
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-200 mt-2 sm:mt-3 font-medium tracking-wide">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">home</Link> - Events
                    </p>
                </motion.div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="py-12 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-gray-700">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-sm border-l-4 border-l-[#FF5500]"
                >
                    <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 leading-relaxed sm:leading-[1.8] tracking-normal">
                        Significant National Days like the International Mother Language Day, Independence Day, National Mourning Day, Victory Day, Bengali New Year etc. are observed with a lot of enthusiasm in a befitting manner. SIS organizes the Annual Sports Days every year and also celebrates different international days like Teachers&apos; Day, Mothers&apos; Day.
                    </p>
                </motion.div>
            </div>

        </div>
    );
};

export default Events;
