'use client';
import React from 'react';
import Link from 'next/link';
import { Eye, Building2, Globe, Lightbulb } from 'lucide-react';

const VisionPage = () => {
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
                        Our Vision
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-white/80 uppercase tracking-widest">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">Home</Link>
                        <span>•</span>
                        <span className="text-[#FF5500] font-semibold">Vision</span>
                    </div>
                </div>
            </div>

            {/* ─── MAIN CONTENT AREA ─── */}
            <div className="container mx-auto px-4 py-8 sm:py-14">
                <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6 sm:p-12 md:p-16 shadow-xl border border-gray-100 space-y-12">
                    
                    {/* SECTION BADGE */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF5500] flex items-center justify-center shrink-0 shadow-sm">
                            <Eye size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F28]">
                                Vision Statement
                            </h2>
                            <p className="text-sm sm:text-base font-semibold text-[#FF5500] uppercase tracking-wider mt-0.5">
                                Salmela International School
                            </p>
                        </div>
                    </div>

                    {/* FEATURED LEAD QUOTE */}
                    <div className="bg-gradient-to-r from-orange-50/90 via-orange-50/50 to-transparent border-l-6 border-[#FF5500] p-6 sm:p-10 rounded-r-3xl shadow-sm">
                        <p className="text-xl sm:text-3xl font-semibold text-[#0B0F28] leading-relaxed italic">
                            &ldquo;Children and youth form the future of a community. By supporting and encouraging them to explore the world, we build a strong future for the whole community.&rdquo;
                        </p>
                    </div>

                    {/* DETAILED VISION TEXT (EXTRA LARGE & EASY TO READ) */}
                    <div className="space-y-8 text-gray-800 text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-[1.9] font-normal">
                        <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:text-[#FF5500] first-letter:mr-3 first-letter:float-left">
                            Children and youth form the future of a community. By supporting, directing, and encouraging them to search for information about surrounding worlds, we build a strong future for the whole community.
                        </p>

                        <p>
                            The urge to learn creates a basis for future development and new innovation. Our goal is to make high-quality education available for an even larger group of children in the future.
                        </p>
                    </div>

                    {/* VISION PILLARS GRID */}
                    <div className="pt-10 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors shadow-sm">
                            <Building2 className="w-10 h-10 text-[#FF5500] mb-4" />
                            <h3 className="font-bold text-[#0B0F28] text-xl mb-2">Building the Future</h3>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">Inspiring children and youth to become strong, responsible pillars of society.</p>
                        </div>

                        <div className="p-8 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors shadow-sm">
                            <Lightbulb className="w-10 h-10 text-[#FF5500] mb-4" />
                            <h3 className="font-bold text-[#0B0F28] text-xl mb-2">Fostering Innovation</h3>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">Encouraging curiosity and a lifelong urge to learn, discover, and excel.</p>
                        </div>

                        <div className="p-8 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors shadow-sm">
                            <Globe className="w-10 h-10 text-[#FF5500] mb-4" />
                            <h3 className="font-bold text-[#0B0F28] text-xl mb-2">Global Accessibility</h3>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">Expanding standard international education to reach more children everywhere.</p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default VisionPage;
