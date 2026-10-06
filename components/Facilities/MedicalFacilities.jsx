'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const MedicalFacilities = () => {
    return (
        <div className="w-full bg-white font-sans text-gray-900 min-h-screen">
            
            {/* ─── HERO HEADER BANNER ─── */}
            <div className="relative w-full h-52 sm:h-64 md:h-80 flex items-center justify-center text-center overflow-hidden bg-gray-900 shadow-sm">
                <Image
                    src="/school1.png"
                    alt="Medical Facilities"
                    fill
                    priority
                    className="object-cover opacity-60 filter brightness-90"
                />
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-10 px-4 max-w-4xl mx-auto">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
                        Medical Facilities
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-200 mt-2 sm:mt-3 font-medium tracking-wide">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">home</Link> - Medical Facilities
                    </p>
                </div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="py-12 sm:py-16 px-4 sm:px-8 max-w-4xl mx-auto text-gray-700">
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 leading-relaxed sm:leading-[1.8] tracking-normal">
                    The clinic at SIS has a professional female physician who is always there to take care of the students&apos; health problems and provide primary medication in case of any emergency. For this the SIS clinic is equipped with a variety of necessary medication, first aid and other basic medical facilities.
                </p>
            </div>

        </div>
    );
};

export default MedicalFacilities;
