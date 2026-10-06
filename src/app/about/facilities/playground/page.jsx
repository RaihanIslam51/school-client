'use client';
import React from 'react';
import Link from 'next/link';
import { Trophy, Activity, Users, Award } from 'lucide-react';

const PlayGroundFacilityPage = () => {
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
                        School Playground
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-white/80 uppercase tracking-widest">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">Home</Link>
                        <span>•</span>
                        <span>Facilities</span>
                        <span>•</span>
                        <span className="text-[#FF5500] font-semibold">Playground</span>
                    </div>
                </div>
            </div>

            {/* ─── MAIN CONTENT AREA ─── */}
            <div className="container mx-auto px-4 py-8 sm:py-14">
                <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6 sm:p-12 md:p-16 shadow-xl border border-gray-100 space-y-12">
                    
                    {/* SECTION BADGE */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF5500] flex items-center justify-center shrink-0 shadow-sm">
                            <Trophy size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F28]">
                                Playground &amp; Sports Complex
                            </h2>
                            <p className="text-sm sm:text-base font-semibold text-[#FF5500] uppercase tracking-wider mt-0.5">
                                Salmela International School
                            </p>
                        </div>
                    </div>

                    {/* FEATURED LEAD QUOTE BOX */}
                    <div className="bg-gradient-to-r from-orange-50/90 via-orange-50/50 to-transparent border-l-6 border-[#FF5500] p-6 sm:p-10 rounded-r-3xl shadow-sm">
                        <p className="text-xl sm:text-3xl font-semibold text-[#0B0F28] leading-relaxed italic">
                            &ldquo;Fostering physical fitness, leadership qualities, teamwork, and self-dependence through active sports and outdoor games.&rdquo;
                        </p>
                    </div>

                    {/* DETAILED PLAYGROUND TEXT (EXTRA LARGE & EASY TO READ) */}
                    <div className="space-y-8 text-gray-800 text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-[1.9] font-normal">
                        <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:text-[#FF5500] first-letter:mr-3 first-letter:float-left">
                            There is a spacious, well-maintained playground for students within the campus of Salmela International School. We strongly emphasize extracurricular activities in order to strengthen leadership qualities, build teamwork, and develop self-dependence.
                        </p>

                        <p>
                            Students get ample opportunities to play different outdoor games during scheduled play periods and compete in our annual sports festivals.
                        </p>
                    </div>

                    {/* PLAYGROUND HIGHLIGHT CARDS GRID */}
                    <div className="pt-10 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors shadow-sm">
                            <Activity className="w-10 h-10 text-[#FF5500] mb-4" />
                            <h3 className="font-bold text-[#0B0F28] text-xl mb-2">Spacious Sports Grounds</h3>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">Large open-air playground for outdoor sports, physical education, and healthy recreation.</p>
                        </div>

                        <div className="p-8 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors shadow-sm">
                            <Users className="w-10 h-10 text-[#FF5500] mb-4" />
                            <h3 className="font-bold text-[#0B0F28] text-xl mb-2">Leadership &amp; Teamwork</h3>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">Extracurricular games designed to build confidence, collaboration, and self-reliance.</p>
                        </div>

                        <div className="p-8 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors shadow-sm">
                            <Award className="w-10 h-10 text-[#FF5500] mb-4" />
                            <h3 className="font-bold text-[#0B0F28] text-xl mb-2">Annual Sports Festival</h3>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">Annual tournaments and athletic competitions bringing students together in healthy competition.</p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default PlayGroundFacilityPage;
