'use client';
import React from 'react';
import Link from 'next/link';

const HistoryPage = () => {
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
                        How did it all start?
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-white/80 uppercase tracking-widest">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">Home</Link>
                        <span>•</span>
                        <span className="text-[#FF5500] font-semibold">Our Story</span>
                    </div>
                </div>
            </div>

            {/* ─── MAIN CONTENT AREA ─── */}
            <div className="container mx-auto px-4 py-3 sm:py-6">
                <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6 sm:p-12 md:p-16 shadow-xl border border-gray-100 space-y-8 sm:space-y-10">
                    
                    {/* INTRO PARAGRAPHS */}
                    <div className="space-y-8 text-gray-800 text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-[1.9] font-normal">
                        <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-[#FF5500] first-letter:mr-2 first-letter:float-left">
                            In the early 2000&apos;s, two Bangladeshi men came to speak to the owning family of Hesburger in Finland. Their intention was to start a Hesburger restaurant in Dhaka. This meeting sparked a connection, although it did not lead to a restaurant contract.
                        </p>

                        <p>
                            A couple of years later, Kari Salmela, the current CEO of Hesburger, visited the same men in Dhaka in order to take a look at a potential restaurant location. During this visit, Kari Salmela was shocked by the conditions in the slum.
                        </p>
                    </div>

                    {/* KARI SALMELA QUOTE BOX */}
                    <div className="bg-gradient-to-r from-orange-50/80 via-orange-50/40 to-transparent border-l-4 border-[#FF5500] p-6 rounded-r-2xl shadow-sm">
                        <p className="text-lg sm:text-xl font-semibold text-[#0B0F28] leading-relaxed italic">
                            &ldquo;If God exists, he is certainly not there,&rdquo;
                        </p>
                        <p className="text-sm font-medium text-gray-500 mt-2">— Kari Salmela said to his father Heikki Salmela.</p>
                    </div>

                    {/* CONTINUATION PARAGRAPHS */}
                    <div className="space-y-6 text-gray-700 text-base sm:text-lg md:text-[19px] leading-relaxed sm:leading-[1.85] font-normal">
                        <p>
                            Another year went by. Heikki Salmela felt the urge to give tangible help to a place where the money would reach its target without extra hands in between. After some networking he established contact with FIDA, a Finnish missionary organisation who arranged a trip to Bangladesh to search for a good target.
                        </p>

                        <p className="font-semibold text-[#0B0F28]">
                            Heikki Salmela describes what sealed the deal for him:
                        </p>
                    </div>

                    {/* MISSION SEALED QUOTE */}
                    <div className="bg-gradient-to-r from-orange-50/80 via-orange-50/40 to-transparent border-l-4 border-[#FF5500] p-6 sm:p-8 rounded-r-2xl shadow-sm">
                        <p className="text-base sm:text-xl font-medium text-[#0B0F28] leading-relaxed italic">
                            &ldquo;On the last day of our trip we visited a school that operated in two clay huts - one was for the children to sleep in and the other one was for studying. The small huts of 30 square metres had no windows and the children sat on dirty floor. The student&apos;s heads were shaved and they were wearing white t-shirts with yellow symbols. When they started singing to us, the decision was made. This would be our mission.&rdquo;
                        </p>
                    </div>

                    {/* ──────────────── PROFILE SECTION 1: HEIKKI SALMELA ──────────────── */}
                    <div className="pt-8 border-t border-gray-100">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-[#FF5500]/20 mb-4 transition-transform hover:scale-105 duration-300">
                                <img 
                                    src="/heikki_salmela.png" 
                                    alt="Heikki Salmela" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F28] tracking-tight">
                                Heikki Salmela
                            </h2>
                            <p className="text-sm font-semibold text-[#FF5500] uppercase tracking-wider mt-1">
                                Founder &amp; Chairman, Hesburger
                            </p>
                        </div>

                        <div className="space-y-6 text-gray-700 text-base sm:text-lg md:text-[19px] leading-relaxed sm:leading-[1.85] font-normal">
                            <p>
                                <strong className="text-[#0B0F28] font-bold">Heikki Salmela</strong> is the founder and Chairman of the Board of the restaurant chain Hesburger. Hesburger operates in nine countries. Heikki Salmela is known as an innovative entrepreneur and a spokesman for entrepreneurship.
                            </p>

                            <p>
                                The school project in Bangladesh has been close to Heikki Salmela&apos;s heart from the start.
                            </p>

                            <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded-r-2xl">
                                <p className="text-base sm:text-lg text-gray-800 italic leading-relaxed">
                                    &ldquo;I want the story of our school to continue for a long time. Our family has invested a lot into this and it feels meaningful. It has been great to watch the progress and see children who are happy and pleased to have the opportunity to learn. We have visited their homes and seen glimpses of their lives. It is awesome that we can give them something. My wish is that one day we could teach them the Finnish language. Maybe one day we can offer them a chance to travel to Finland, work at a Hesburger restaurant, and continue to support their community.&rdquo;
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ──────────────── PROFILE SECTION 2: LEVA SALMELA ──────────────── */}
                    <div className="pt-10 border-t border-gray-100">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-[#FF5500]/20 mb-4 transition-transform hover:scale-105 duration-300">
                                <img 
                                    src="/leva_salmela.png" 
                                    alt="Leva Salmela" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0F28] tracking-tight">
                                Leva Salmela
                            </h2>
                            <p className="text-sm font-semibold text-[#FF5500] uppercase tracking-wider mt-1">
                                International Development &amp; Marketing, Hesburger
                            </p>
                        </div>

                        <div className="space-y-6 text-gray-700 text-base sm:text-lg md:text-[19px] leading-relaxed sm:leading-[1.85] font-normal">
                            <p>
                                <strong className="text-[#0B0F28] font-bold">Leva Salmela</strong> is responsible for the international development and marketing of the restaurant chain Hesburger. Leva speaks four languages and she is also the Honorary Consul of Bulgaria in Finland.
                            </p>

                            <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded-r-2xl">
                                <p className="text-base sm:text-lg text-gray-800 italic leading-relaxed">
                                    &ldquo;The first time I visited Bangladesh was in 2015 due to our Joy &amp; Hope school project. Since then, I have visited Bangladesh two or three times a year and I have been introduced to a whole new world totally different from my earlier experiences. I have met lovely people, both adults and children, in Bangladesh, and seen the effects of tangible aid in their lives. It is important to me personally that we can help people, families, and the community in this way. Starting the Salmela International School is a big step for us, but the circumstances are excellent. We have a great school building, a good network of teachers, as well as experience and understanding of how to run a school in Bangladesh. The academic and social success achieved in the Joy &amp; Hope school creates a strong basis for the new school.&rdquo;
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default HistoryPage;
