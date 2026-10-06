'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const VisitingHours = () => {
    return (
        <div className="w-full bg-white font-sans text-gray-900 min-h-screen">
            
            {/* ─── HERO HEADER BANNER ─── */}
            <div className="relative w-full h-52 sm:h-64 md:h-80 flex items-center justify-center text-center overflow-hidden bg-gray-900 shadow-sm">
                <Image
                    src="/school1.png"
                    alt="Visiting Hours"
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
                        Visiting Hours
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-200 mt-2 sm:mt-3 font-medium tracking-wide">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">home</Link> - Visiting Hours
                    </p>
                </motion.div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="py-10 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-gray-800 space-y-8">
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8"
                >
                    {/* OFFICE & TEACHER HOURS */}
                    <div className="space-y-3 border-l-4 border-l-[#FF5500] pl-4 sm:pl-6">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                            School Office: <span className="text-[#FF5500]">9:00 am - 3:00 pm</span> <span className="text-xs sm:text-sm text-gray-500 font-medium">(1:00 PM – 2:00 PM Lunch break)</span>
                        </h2>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                            Class/Subject Teacher: <span className="text-[#0B0F28]">By Appointment</span>
                        </h3>
                    </div>

                    {/* APPOINTMENT TIMING */}
                    <div className="space-y-3 pt-6 border-t border-gray-100 border-l-4 border-l-[#0B0F28] pl-4 sm:pl-6">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                            Appointment Timing:
                        </h2>
                        <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium">
                            Please call at school office 9:00 am to 3:00 pm. If you would like to visit us at other time other than the above, please call the school Office number for an Appointment.
                        </p>
                    </div>
                </motion.div>

            </div>

        </div>
    );
};

export default VisitingHours;
