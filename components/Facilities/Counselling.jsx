'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Counselling = () => {
    return (
        <div className="w-full bg-white font-sans text-gray-900 min-h-screen">
            
            {/* ─── HERO HEADER BANNER ─── */}
            <div className="relative w-full h-52 sm:h-64 md:h-80 flex items-center justify-center text-center overflow-hidden bg-gray-900 shadow-sm">
                <Image
                    src="/school1.png"
                    alt="Guidance and Counselling"
                    fill
                    priority
                    className="object-cover opacity-60 filter brightness-90"
                />
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative z-10 px-4 max-w-4xl mx-auto">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
                        Guidance and Counselling
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-200 mt-2 sm:mt-3 font-medium tracking-wide">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">home</Link> - Guidance and Counselling
                    </p>
                </div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="py-12 sm:py-16 px-4 sm:px-8 max-w-4xl mx-auto text-gray-700">
                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 leading-relaxed sm:leading-[1.8] tracking-normal">
                    Guidance and counselling are oriented to helping students understand themselves, become self-sufficient in making realistic and positive selections and grow in human relationships and concerns. Guidance, hence, should prepare students for adult life as well as help them acquire appropriate attitudes and values that facilitate them to become productive and dynamic members of their communities. Primarily, the guidance program should help young people and children to develop a positive self-image and a sense of identity, create a set of beliefs and a value system that will guide their behaviors and actions.
                </p>
            </div>

        </div>
    );
};

export default Counselling;
