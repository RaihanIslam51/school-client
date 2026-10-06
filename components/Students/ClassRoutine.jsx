'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const playGroupRoutine = [
    { day: 'Sunday', p1: 'General Knowledge', p2: 'English (Book of ABC)', tiffin: 'Tiffin', p3: 'Bangla (Sonamonider)' },
    { day: 'Monday', p1: 'Math (Book of 123)', p2: 'Story Telling/Rhymes', tiffin: 'Tiffin', p3: 'Art/Rhymes' },
    { day: 'Tuesday', p1: 'English (Book of ABC) & (Begin to write)', p2: 'General knowledge', tiffin: 'Tiffin', p3: 'Math (Book of 123)' },
    { day: 'Wednesday', p1: 'English (Begin to write)', p2: 'Art/Rhymes', tiffin: 'Tiffin', p3: 'Bangla (Sonamonider)' },
    { day: 'Thursday', p1: 'Math (Book of 123)', p2: 'Activity', tiffin: 'Tiffin', p3: 'English (Book of ABC)' },
];

const nurseryRoutine = [
    { day: 'Sunday', p1: 'General Knowledge/Math (success with Math)', p2: 'English (Radiant Way)', tiffin: 'Tiffin', p3: 'Bangla (Sonamonider Lekha)' },
    { day: 'Monday', p1: 'Math (Pattern Writing B-2)', p2: 'English (Pattern Writing B-1)', tiffin: 'Tiffin', p3: 'Art & Rhymes/Story' },
    { day: 'Tuesday', p1: 'English (Radiant way)', p2: 'General knowledge/Bangla (Sonamonider Lekha)', tiffin: 'Tiffin', p3: 'Bangla (Sonamonider Lekha)' },
    { day: 'Wednesday', p1: 'English (Pattern Writing B-1)', p2: 'Art & Rhymes/Story', tiffin: 'Tiffin', p3: 'Math (Pattern Writing B-2)' },
    { day: 'Thursday', p1: 'Math (Success with Math)', p2: 'Activity', tiffin: 'Tiffin', p3: 'English (Pattern Writing B-1)' },
];

const ClassRoutine = () => {
    return (
        <div className="w-full bg-white font-sans text-gray-900 min-h-screen">
            
            {/* ─── HERO HEADER BANNER ─── */}
            <div className="relative w-full h-52 sm:h-64 md:h-80 flex items-center justify-center text-center overflow-hidden bg-gray-900 shadow-sm">
                <Image
                    src="/school1.png"
                    alt="Class routine"
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
                        Class routine
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-200 mt-2 sm:mt-3 font-medium tracking-wide">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">home</Link> - Class routine
                    </p>
                </motion.div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="py-10 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
                
                {/* ─── PLAY GROUP ROUTINE ─── */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                        <h2 className="font-bold text-gray-900 text-base sm:text-xl tracking-tight flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#FF5500]" />
                            Play Group Class Routine
                        </h2>
                        <span className="text-xs text-gray-500 font-medium hidden sm:inline-block">Scroll horizontally on small screens →</span>
                    </div>

                    <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-xl bg-white">
                        <table className="w-full text-xs sm:text-sm border-collapse text-gray-900 min-w-[640px]">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="py-3 px-3.5 text-left font-semibold border-r border-gray-200 w-1/5 text-gray-900">Day / Time</th>
                                    <th className="py-3 px-3.5 text-left font-semibold border-r border-gray-200 w-1/4 text-gray-900">09:30am - 09:55am</th>
                                    <th className="py-3 px-3.5 text-left font-semibold border-r border-gray-200 w-1/4 text-gray-900">09:55am - 10:20am</th>
                                    <th className="py-3 px-3.5 text-left font-semibold border-r border-gray-200 w-1/6 text-gray-900">10:20am - 10:45am</th>
                                    <th className="py-3 px-3.5 text-left font-semibold w-1/4 text-gray-900">10:45am - 11:10am</th>
                                </tr>
                            </thead>
                            <tbody>
                                {playGroupRoutine.map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50/70 transition-colors">
                                        <td className="py-3 px-3.5 font-bold text-gray-800 border-r border-gray-200 bg-gray-50/40">
                                            {row.day}
                                        </td>
                                        <td className="py-3 px-3.5 text-gray-800 border-r border-gray-200 font-medium">
                                            {row.p1}
                                        </td>
                                        <td className="py-3 px-3.5 text-gray-800 border-r border-gray-200 font-medium">
                                            {row.p2}
                                        </td>
                                        <td className="py-3 px-3.5 text-[#FF5500] border-r border-gray-200 font-semibold bg-orange-50/30">
                                            {row.tiffin}
                                        </td>
                                        <td className="py-3 px-3.5 text-gray-800 font-medium">
                                            {row.p3}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* ─── NURSERY ROUTINE ─── */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                        <h2 className="font-bold text-gray-900 text-base sm:text-xl tracking-tight flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#0B0F28]" />
                            Nursery Class Routine
                        </h2>
                        <span className="text-xs text-gray-500 font-medium hidden sm:inline-block">Scroll horizontally on small screens →</span>
                    </div>

                    <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-xl bg-white">
                        <table className="w-full text-xs sm:text-sm border-collapse text-gray-900 min-w-[640px]">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="py-3 px-3.5 text-left font-semibold border-r border-gray-200 w-1/5 text-gray-900">Day / Time</th>
                                    <th className="py-3 px-3.5 text-left font-semibold border-r border-gray-200 w-1/4 text-gray-900">09:30am - 10:10am</th>
                                    <th className="py-3 px-3.5 text-left font-semibold border-r border-gray-200 w-1/4 text-gray-900">10:10am - 10:50am</th>
                                    <th className="py-3 px-3.5 text-left font-semibold border-r border-gray-200 w-1/6 text-gray-900">10:50am - 11:10am</th>
                                    <th className="py-3 px-3.5 text-left font-semibold w-1/4 text-gray-900">11:10am - 11:50am</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nurseryRoutine.map((row, idx) => (
                                    <tr key={idx} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50/70 transition-colors">
                                        <td className="py-3 px-3.5 font-bold text-gray-800 border-r border-gray-200 bg-gray-50/40">
                                            {row.day}
                                        </td>
                                        <td className="py-3 px-3.5 text-gray-800 border-r border-gray-200 font-medium">
                                            {row.p1}
                                        </td>
                                        <td className="py-3 px-3.5 text-gray-800 border-r border-gray-200 font-medium">
                                            {row.p2}
                                        </td>
                                        <td className="py-3 px-3.5 text-[#FF5500] border-r border-gray-200 font-semibold bg-orange-50/30">
                                            {row.tiffin}
                                        </td>
                                        <td className="py-3 px-3.5 text-gray-800 font-medium">
                                            {row.p3}
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

export default ClassRoutine;
