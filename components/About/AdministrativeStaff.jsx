'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';

const staffMembers = [
    {
        name: 'Mrs. Susan Baroi',
        role: 'Chairman',
        image: '/chairman_photo.png'
    },
    {
        name: 'Mrs. Rupali Boidya',
        role: 'Treasurer',
        image: '/leva_salmela.png'
    },
    {
        name: 'Mr. Pranay Karmokar',
        role: 'Secretary (Acting)',
        image: '/heikki_salmela.png'
    },
    {
        name: 'Mr. George L. Boidya',
        role: 'Advisor',
        image: '/heikki_salmela.png'
    },
    {
        name: 'Prodip Nabab',
        role: 'Member',
        image: null
    },
    {
        name: 'Mrs. Mary Juthika Halder',
        role: 'Member',
        image: '/leva_salmela.png'
    },
    {
        name: 'Staff Member',
        role: 'Member',
        image: null
    }
];

const AdministrativeStaff = () => {
    return (
        <div className="w-full bg-white font-sans text-gray-900 min-h-screen">
            
            {/* ─── HERO HEADER BANNER ─── */}
            <div className="relative w-full h-52 sm:h-64 md:h-80 flex items-center justify-center text-center overflow-hidden bg-gray-900 shadow-sm">
                <Image
                    src="/school1.png"
                    alt="Administrative Staff"
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
                        Administrative Staff
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-200 mt-2 sm:mt-3 font-medium tracking-wide">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">home</Link> - Administrative Staff
                    </p>
                </motion.div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="py-10 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                
                {/* SECTION HEADING */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8 border-b pb-3 border-gray-200 flex items-center gap-3"
                >
                    <span className="w-3 h-6 rounded-full bg-[#FF5500]" />
                    <h2 className="text-lg sm:text-xl font-extrabold text-gray-800 tracking-wider uppercase">
                        Working Committee
                    </h2>
                </motion.div>

                {/* CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                    {staffMembers.map((member, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                            whileHover={{ y: -4, scale: 1.01 }}
                            className="bg-white border border-gray-200 rounded-2xl overflow-hidden p-4 shadow-sm hover:shadow-md transition-all flex flex-col"
                        >
                            {/* IMAGE / AVATAR CONTAINER */}
                            <div className="relative w-full aspect-[4/4.5] bg-gray-100 rounded-xl overflow-hidden mb-3.5 flex items-center justify-center border border-gray-200">
                                {member.image ? (
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover object-top"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            <User size={40} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* TEXT DETAILS */}
                            <div className="mt-auto pt-2 border-t border-gray-100">
                                <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
                                    {member.name}
                                </h3>
                                <p className="text-xs sm:text-sm font-semibold text-[#FF5500] mt-0.5">
                                    {member.role}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>

        </div>
    );
};

export default AdministrativeStaff;
