'use client';
import React from 'react';
import Link from 'next/link';
import { Laptop, Wifi, Code2, ShieldCheck } from 'lucide-react';

const ComputerLabFacilityPage = () => {
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
                        Computer Lab
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-white/80 uppercase tracking-widest">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">Home</Link>
                        <span>•</span>
                        <span>Facilities</span>
                        <span>•</span>
                        <span className="text-[#FF5500] font-semibold">Computer Lab</span>
                    </div>
                </div>
            </div>

            {/* ─── MAIN CONTENT AREA ─── */}
            <div className="container mx-auto px-4 py-8 sm:py-14">
                <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6 sm:p-12 md:p-16 shadow-xl border border-gray-100 space-y-12">
                    
                    {/* SECTION BADGE */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF5500] flex items-center justify-center shrink-0 shadow-sm">
                            <Laptop size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F28]">
                                Modern ICT &amp; Digital Lab
                            </h2>
                            <p className="text-sm sm:text-base font-semibold text-[#FF5500] uppercase tracking-wider mt-0.5">
                                Salmela International School
                            </p>
                        </div>
                    </div>

                    {/* FEATURED LEAD QUOTE BOX */}
                    <div className="bg-gradient-to-r from-orange-50/90 via-orange-50/50 to-transparent border-l-6 border-[#FF5500] p-6 sm:p-10 rounded-r-3xl shadow-sm">
                        <p className="text-xl sm:text-3xl font-semibold text-[#0B0F28] leading-relaxed italic">
                            &ldquo;Empowering students with 21st-century IT skills, programming, and global connectivity in a safe digital environment.&rdquo;
                        </p>
                    </div>

                    {/* DETAILED COMPUTER LAB TEXT (EXTRA LARGE & EASY TO READ) */}
                    <div className="space-y-8 text-gray-800 text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-[1.9] font-normal">
                        <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:text-[#FF5500] first-letter:mr-3 first-letter:float-left">
                            In the era of globalization, Salmela International School recognizes the fundamental importance of Information and Communication Technology. We have established two state-of-the-art ICT labs equipped with high-end laptop computers, high-speed broadband internet, and secure Wi-Fi connectivity.
                        </p>

                        <p>
                            Our labs enable students to master essential IT skills, programming, and Finnish language learning in a cyber-safe environment. We empower students to explore global knowledge and become true digital global citizens.
                        </p>

                        <p>
                            To maintain discipline and safety, students enter the computer lab under the direct guidance of certified ICT teachers, and silence is strictly observed during all sessions.
                        </p>
                    </div>

                    {/* ICT LAB HIGHLIGHT CARDS GRID */}
                    <div className="pt-10 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors shadow-sm">
                            <Laptop className="w-10 h-10 text-[#FF5500] mb-4" />
                            <h3 className="font-bold text-[#0B0F28] text-xl mb-2">High-End Hardware</h3>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">Two modern ICT labs featuring high-performance laptops and high-speed Wi-Fi.</p>
                        </div>

                        <div className="p-8 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors shadow-sm">
                            <Code2 className="w-10 h-10 text-[#FF5500] mb-4" />
                            <h3 className="font-bold text-[#0B0F28] text-xl mb-2">Coding &amp; Language</h3>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">Hands-on learning for computer programming, IT skills, and Finnish language software.</p>
                        </div>

                        <div className="p-8 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors shadow-sm">
                            <ShieldCheck className="w-10 h-10 text-[#FF5500] mb-4" />
                            <h3 className="font-bold text-[#0B0F28] text-xl mb-2">Cyber-Safe Guidance</h3>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">Supervised sessions led by experienced ICT faculty ensuring safety and focus.</p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default ComputerLabFacilityPage;
