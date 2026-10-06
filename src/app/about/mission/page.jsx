'use client';
import React from 'react';
import Link from 'next/link';
import { Target, ShieldCheck, Award, Compass } from 'lucide-react';

const MissionPage = () => {
    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-[#1F2937]">
            
            {/* ─── TOP HERO BANNER WITH BACKGROUND IMAGE & OVERLAY ─── */}
            <div 
                className="relative bg-cover bg-center h-64 sm:h-80 flex flex-col items-center justify-center text-white px-4 shadow-md"
                style={{
                    backgroundImage: `linear-gradient(rgba(11, 15, 40, 0.65), rgba(11, 15, 40, 0.75)), url('/chairman_banner.png')`
                }}
            >
                <div className="text-center max-w-4xl mx-auto z-10 space-y-3">
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Our Mission
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-white/80 uppercase tracking-widest">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">Home</Link>
                        <span>•</span>
                        <span className="text-[#FF5500] font-semibold">Mission</span>
                    </div>
                </div>
            </div>

            {/* ─── MAIN CONTENT AREA ─── */}
            <div className="container mx-auto px-4 py-8 sm:py-14">
                <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6 sm:p-12 md:p-16 shadow-xl border border-gray-100 space-y-12">
                    
                    {/* SECTION BADGE */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF5500] flex items-center justify-center shrink-0 shadow-sm">
                            <Target size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F28]">
                                Mission Statement
                            </h2>
                            <p className="text-sm sm:text-base font-semibold text-[#FF5500] uppercase tracking-wider mt-0.5">
                                Salmela International School
                            </p>
                        </div>
                    </div>

                    {/* FEATURED LEAD QUOTE */}
                    <div className="bg-gradient-to-r from-orange-50/90 via-orange-50/50 to-transparent border-l-6 border-[#FF5500] p-6 sm:p-10 rounded-r-3xl shadow-sm">
                        <p className="text-xl sm:text-3xl font-semibold text-[#0B0F28] leading-relaxed italic">
                            &ldquo;We provide high-quality, equal education. Every day we work hard to ensure that our school is a safe place where children enjoy coming and are ready to spread their wings in life.&rdquo;
                        </p>
                    </div>

                    {/* DETAILED MISSION TEXT */}
                    <div className="space-y-8 text-gray-800 text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-[1.9] font-normal">
                        <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-[#FF5500] first-letter:mr-2 first-letter:float-left">
                            We provide high-quality, equal education to every student. Our educated teachers and the entire staff of Salmela International School genuinely care about the students and their personal development.
                        </p>

                        <p>
                            Every day we work hard to ensure that our school is a safe and nurturing place where children enjoy coming to learn. Students who graduate from our school become independent, active, and courageous individuals, fully prepared to spread their wings in life.
                        </p>
                    </div>

                    {/* MISSION PILLARS GRID */}
                    <div className="pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors">
                            <Award className="w-8 h-8 text-[#FF5500] mb-3" />
                            <h3 className="font-bold text-[#0B0F28] text-base mb-1">Quality Education</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">Dedicated to equal, high-standard academic excellence for every child.</p>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors">
                            <ShieldCheck className="w-8 h-8 text-[#FF5500] mb-3" />
                            <h3 className="font-bold text-[#0B0F28] text-base mb-1">Safe Environment</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">A caring atmosphere where students feel secure, valued, and inspired.</p>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors">
                            <Compass className="w-8 h-8 text-[#FF5500] mb-3" />
                            <h3 className="font-bold text-[#0B0F28] text-base mb-1">Empowered Leaders</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">Fostering independent, active, and courageous citizens ready for the world.</p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default MissionPage;
