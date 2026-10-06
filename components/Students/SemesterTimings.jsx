'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const timingData = [
    { label: 'Class', col1: 'Play Group', col2: 'Nursery', isHeader: true },
    { label: 'Days', col1: 'Sunday to Thursday', col2: 'Sunday to Thursday' },
    { label: 'Assembly', col1: '9:15 AM', col2: '9:15 AM' },
    { label: 'Periods', col1: '3', col2: '4' },
    { label: 'Time', col1: '9:30 AM – 11:20 PM', col2: '9:30 AM – 11:50 PM' },
];

const SemesterTimings = () => {
    return (
        <div className="w-full bg-white font-sans text-gray-900 min-h-screen">
            
            {/* ─── HERO HEADER BANNER ─── */}
            <div className="relative w-full h-52 sm:h-64 md:h-80 flex items-center justify-center text-center overflow-hidden bg-gray-900 shadow-sm">
                <Image
                    src="/school1.png"
                    alt="Semester & Timings"
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
                        Semester &amp; Timings
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-200 mt-2 sm:mt-3 font-medium tracking-wide">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">home</Link> - Semester &amp; Timings
                    </p>
                </motion.div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="py-10 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    {/* INTRO TEXT */}
                    <div className="space-y-2 text-sm sm:text-base font-medium text-gray-700 leading-relaxed bg-gray-50/80 border-l-4 border-[#FF5500] p-4 sm:p-5 rounded-r-lg shadow-sm">
                        <p>
                            School session begins from July and ends at June and is divided into two Semesters - Half yearly and Annual.
                        </p>
                        <p className="text-gray-600">
                            Regular school timings of classes are given below:
                        </p>
                    </div>

                    {/* TIMINGS TABLE */}
                    <div className="overflow-x-auto shadow-sm my-6 border border-gray-200 rounded-xl bg-white">
                        <table className="w-full text-xs sm:text-sm border-collapse text-gray-900">
                            <tbody>
                                {timingData.map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50/80 transition-colors">
                                        <td className="py-3.5 sm:py-4 px-4 font-bold text-gray-800 border-r border-gray-200 w-1/4 sm:w-1/5 bg-gray-50/60">
                                            {row.label}
                                        </td>
                                        <td className={`py-3.5 sm:py-4 px-5 border-r border-gray-200 w-1/3 sm:w-2/5 ${row.isHeader ? 'font-bold text-gray-900 bg-gray-100/50' : 'font-medium text-gray-700'}`}>
                                            {row.col1}
                                        </td>
                                        <td className={`py-3.5 sm:py-4 px-5 ${row.isHeader ? 'font-bold text-gray-900 bg-gray-100/50' : 'font-medium text-gray-700'}`}>
                                            {row.col2}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

        </div>
    );
};

export default SemesterTimings;
