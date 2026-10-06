'use client';
import React from 'react';
import Link from 'next/link';
import { Clock, CalendarCheck, ShieldAlert, FileText } from 'lucide-react';

const AttendancePage = () => {
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
                        Arrival &amp; Attendance
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-white/80 uppercase tracking-widest">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">Home</Link>
                        <span>•</span>
                        <span className="text-[#FF5500] font-semibold">Arrival &amp; Attendance</span>
                    </div>
                </div>
            </div>

            {/* ─── MAIN CONTENT AREA ─── */}
            <div className="container mx-auto px-4 py-8 sm:py-14">
                <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6 sm:p-12 md:p-16 shadow-xl border border-gray-100 space-y-12">
                    
                    {/* SECTION BADGE */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF5500] flex items-center justify-center shrink-0 shadow-sm">
                            <Clock size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F28]">
                                School Rules &amp; Timing Policy
                            </h2>
                            <p className="text-sm sm:text-base font-semibold text-[#FF5500] uppercase tracking-wider mt-0.5">
                                Salmela International School
                            </p>
                        </div>
                    </div>

                    {/* KEY TIMINGS CALLOUT BOX */}
                    <div className="bg-gradient-to-r from-orange-50/90 via-orange-50/50 to-transparent border-l-6 border-[#FF5500] p-6 sm:p-10 rounded-r-3xl shadow-sm space-y-3">
                        <div className="flex items-center gap-3 text-[#FF5500] font-bold text-lg uppercase tracking-wider">
                            <Clock className="w-6 h-6" />
                            <span>Gate Timing &amp; Morning Assembly</span>
                        </div>
                        <p className="text-xl sm:text-3xl font-bold text-[#0B0F28] leading-relaxed">
                            School Gate Opens: <span className="text-[#FF5500]">9:00 AM</span> | Gate Closes &amp; Assembly Begins: <span className="text-[#FF5500]">9:15 AM</span>
                        </p>
                    </div>

                    {/* DETAILED ATTENDANCE RULES (EXTRA LARGE & EASY TO READ) */}
                    <div className="space-y-8 text-gray-800 text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-[1.9] font-normal">
                        <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:text-[#FF5500] first-letter:mr-3 first-letter:float-left">
                            Students must enter the school gate between <strong>9:00 AM and 9:15 AM</strong>. At 9:15 AM sharp, the school gate will be closed and the morning assembly will commence. Upon arrival, students are requested to keep their bags in their respective classrooms and assemble in line immediately at the sound of the bell.
                        </p>

                        <p>
                            A child makes maximum educational progress through regular attendance. Regular presence in class is vital for learning. Absence will only be excused for genuine illness, family emergency, or accident.
                        </p>

                        <p>
                            When returning after an absence, students must present a written note signed by a parent or legal guardian to their class teacher. For any planned upcoming absence, a formal leave application must be submitted to the school administration at least <strong>one week in advance</strong>.
                        </p>
                    </div>

                    {/* POLICY PILLARS GRID */}
                    <div className="pt-10 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors shadow-sm">
                            <Clock className="w-10 h-10 text-[#FF5500] mb-4" />
                            <h3 className="font-bold text-[#0B0F28] text-xl mb-2">Punctuality</h3>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">Punctual arrival before 9:15 AM develops discipline and ensures no assembly or lesson is missed.</p>
                        </div>

                        <div className="p-8 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors shadow-sm">
                            <CalendarCheck className="w-10 h-10 text-[#FF5500] mb-4" />
                            <h3 className="font-bold text-[#0B0F28] text-xl mb-2">Regular Attendance</h3>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">Consistent daily attendance builds momentum for maximum academic and social progress.</p>
                        </div>

                        <div className="p-8 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors shadow-sm">
                            <FileText className="w-10 h-10 text-[#FF5500] mb-4" />
                            <h3 className="font-bold text-[#0B0F28] text-xl mb-2">Written Authorization</h3>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">Signed parent notes or advance applications are required for all excused absences.</p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default AttendancePage;
