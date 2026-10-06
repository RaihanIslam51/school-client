'use client';
import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Camera, Flame, Zap, UserCheck } from 'lucide-react';

const SecurityFacilityPage = () => {
    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-[#1F2937]">
            
            {/* ─── TOP HERO BANNER WITH BACKGROUND IMAGE & OVERLAY ─── */}
            <div 
                className="relative bg-cover bg-center h-64 sm:h-80 flex flex-col items-center justify-center text-white px-4 shadow-md"
                style={{
                    backgroundImage: `linear-gradient(rgba(11, 15, 40, 0.65), rgba(11, 15, 40, 0.75)), url('/chairman_banner.png')`
                }}
            >
                <div className="text-center max-w-5xl mx-auto z-10 space-y-3">
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Campus Security
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-white/80 uppercase tracking-widest">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">Home</Link>
                        <span>•</span>
                        <span>Facilities</span>
                        <span>•</span>
                        <span className="text-[#FF5500] font-semibold">Security</span>
                    </div>
                </div>
            </div>

            {/* ─── MAIN CONTENT AREA ─── */}
            <div className="container mx-auto px-4 py-8 sm:py-14">
                <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6 sm:p-12 md:p-16 shadow-xl border border-gray-100 space-y-12">
                    
                    {/* SECTION BADGE */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF5500] flex items-center justify-center shrink-0 shadow-sm">
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F28]">
                                Safety &amp; Security Standards
                            </h2>
                            <p className="text-sm sm:text-base font-semibold text-[#FF5500] uppercase tracking-wider mt-0.5">
                                Salmela International School
                            </p>
                        </div>
                    </div>

                    {/* FEATURED LEAD QUOTE BOX */}
                    <div className="bg-gradient-to-r from-orange-50/90 via-orange-50/50 to-transparent border-l-6 border-[#FF5500] p-6 sm:p-10 rounded-r-3xl shadow-sm">
                        <p className="text-xl sm:text-3xl font-semibold text-[#0B0F28] leading-relaxed italic">
                            &ldquo;Providing a safe, 24/7 monitored, and fully protected environment for every student and staff member.&rdquo;
                        </p>
                    </div>

                    {/* DETAILED SECURITY TEXT (EXTRA LARGE & EASY TO READ) */}
                    <div className="space-y-8 text-gray-800 text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-[1.9] font-normal">
                        <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:text-[#FF5500] first-letter:mr-3 first-letter:float-left">
                            The entire school building is under continuous 24/7 CCTV camera surveillance. Professional security guards are stationed at the campus gates 24 hours a day. No unauthorized visitors are allowed inside without prior permission, and only authorized parents/guardians are permitted to visit students.
                        </p>

                        <p>
                            Fire extinguishers and alarm systems are installed on every floor of the building. We conduct regular precautions as well as periodic Fire and Earthquake safety drills for all students and staff.
                        </p>

                        <p>
                            Additionally, Salmela International School features an automatic functional power generator that covers every classroom and facility to guarantee uninterrupted electricity during power outages.
                        </p>
                    </div>

                    {/* SECURITY HIGHLIGHT CARDS GRID */}
                    <div className="pt-10 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors shadow-sm">
                            <Camera className="w-10 h-10 text-[#FF5500] mb-4" />
                            <h3 className="font-bold text-[#0B0F28] text-xl mb-2">24/7 CCTV &amp; Guards</h3>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">Round-the-clock camera monitoring and trained security personnel controlling gate access.</p>
                        </div>

                        <div className="p-8 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors shadow-sm">
                            <Flame className="w-10 h-10 text-[#FF5500] mb-4" />
                            <h3 className="font-bold text-[#0B0F28] text-xl mb-2">Fire &amp; Drill Safety</h3>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">Fire alarms and extinguishers on every floor, with periodic emergency response drills.</p>
                        </div>

                        <div className="p-8 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors shadow-sm">
                            <Zap className="w-10 h-10 text-[#FF5500] mb-4" />
                            <h3 className="font-bold text-[#0B0F28] text-xl mb-2">Automatic Generator</h3>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">Full automatic power backup providing seamless electricity for all classrooms.</p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default SecurityFacilityPage;
