'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Uniform = () => {
    return (
        <div className="w-full bg-white font-sans text-gray-900 min-h-screen">
            
            {/* ─── HERO HEADER BANNER ─── */}
            <div className="relative w-full h-52 sm:h-64 md:h-80 flex items-center justify-center text-center overflow-hidden bg-gray-900 shadow-sm">
                <Image
                    src="/school1.png"
                    alt="Uniform"
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
                        Uniform
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-200 mt-2 sm:mt-3 font-medium tracking-wide">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">home</Link> - Uniform
                    </p>
                </motion.div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="py-10 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-6">
                
                {/* BOYS UNIFORM */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm border-l-4 border-l-[#FF5500]"
                >
                    <p className="text-base sm:text-lg font-medium text-gray-700 leading-relaxed sm:leading-[1.8]">
                        <strong className="font-extrabold text-gray-900 text-lg sm:text-xl block mb-2">Boys –</strong>
                        Black long pant/ trouser, blue paste color (125, 208,215) half sleeve shirt bearing the school Monogram on the shirt pocket. White socks, black shoes. Black tie and black belt. Black cardigan is to be worn in winter.
                    </p>
                </motion.div>

                {/* GIRLS UNIFORM */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm border-l-4 border-l-[#0B0F28]"
                >
                    <p className="text-base sm:text-lg font-medium text-gray-700 leading-relaxed sm:leading-[1.8]">
                        <strong className="font-extrabold text-gray-900 text-lg sm:text-xl block mb-2">Girls –</strong>
                        Black skirt, blue paste color (125, 208,215) half sleeve shirt bearing the school Monogram on the shirt pocket. White socks, black shoes and black tie. Black cardigan is to be worn in winter.
                    </p>
                </motion.div>

            </div>

        </div>
    );
};

export default Uniform;
