'use client';
import React from 'react';
import Link from 'next/link';

const ChairmanMessagePage = () => {
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
                        Message from the Chairman
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-white/80 uppercase tracking-widest">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">Home</Link>
                        <span>•</span>
                        <span className="text-[#FF5500] font-semibold">Message from the Chairman</span>
                    </div>
                </div>
            </div>

            {/* ─── MAIN CONTENT AREA ─── */}
            <div className="container mx-auto px-4 py-3 sm:py-6">
                <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6 sm:p-12 md:p-16 shadow-xl border border-gray-100">
                    
                    {/* CIRCULAR CHAIRMAN PORTRAIT */}
                    <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
                        <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-[#FF5500]/20 mb-4 transition-transform hover:scale-105 duration-300">
                            <img 
                                src="/chairman_photo.png" 
                                alt="Heikki Salmela - Chairman, Salmela International School" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F28] tracking-tight">
                            Heikki Salmela
                        </h2>
                        <p className="text-sm sm:text-base font-semibold text-[#FF5500] uppercase tracking-wider mt-1">
                            Chairman &amp; Founder, Joy &amp; Hope Trust
                        </p>
                    </div>

                    {/* FEATURED LEAD QUOTE BOX */}
                    <div className="bg-gradient-to-r from-orange-50/80 via-orange-50/40 to-transparent border-l-4 border-[#FF5500] p-6 sm:p-8 rounded-r-2xl mb-10 shadow-sm">
                        <p className="text-lg sm:text-2xl font-semibold text-[#0B0F28] leading-relaxed italic">
                            &ldquo;A proper education enhances humanity, enriches the human mind, and quality education helps people move forward on the path to success and prosperity.&rdquo;
                        </p>
                    </div>

                    {/* ESSAY / MESSAGE PARAGRAPHS WITH ENHANCED EXTRA LARGE TYPOGRAPHY */}
                    <div className="space-y-8 text-gray-800 text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-[1.9] font-normal">
                        
                        <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-[#FF5500] first-letter:mr-2 first-letter:float-left">
                            Salmela International School is an educational institution founded by &quot;Joy &amp; Hope Trust&quot;. The founder of the &quot;Joy &amp; Hope Trust&quot; is Heikki Salmela, a Finnish Businessman, who has a deep heart for the children of Bangladesh. He wants to educate the children of Bangladesh with high-quality education.
                        </p>

                        <p>
                            The school has started its journey with the aim of providing genuine and quality education to the children of Bangladesh. The objective of the school is to educate students in academic and intellectual education while developing strong morality. Salmela International School assists students in acquiring knowledge, building an upright character, and becoming honest, gentle, and responsible citizens.
                        </p>

                        <p>
                            In order for the children of Bangladesh to move forward in tandem with the children of the developed countries of the world, it is necessary to acquire English language skills. By learning proper English, a child&apos;s beautiful future will be formed from childhood. The journey of &quot;Salmela International English Medium School&quot; started with the aim that the children of Bangladesh can learn correct and Standard English language and lead to a bright future.
                        </p>

                        <p>
                            Our teachers, Ayahs, and the entire staff of Salmela International School care deeply about students and work hard to ensure that children get the highest service and consider the school a safe place. Our teachers aim to support, guide, and teach our students according to their abilities. I am confident that the students will find a pleasant and nurturing environment in Salmela International School.
                        </p>

                    </div>

                    {/* CLOSING SIGNATURE BLOCK */}
                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-start sm:items-end text-left sm:text-right">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-1">Warm Regards,</p>
                        <p className="text-xl sm:text-2xl font-extrabold text-[#0B0F28]">Heikki Salmela</p>
                        <p className="text-sm font-semibold text-[#FF5500]">Chairman, Salmela International School</p>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default ChairmanMessagePage;
