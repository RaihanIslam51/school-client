'use client';
import React from 'react';
import Link from 'next/link';
import { GraduationCap, FileCheck2, Clock, Image as ImageIcon, Contact, CheckCircle2 } from 'lucide-react';

const AboutAdmissionPage = () => {
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
                        Admission Procedure
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-white/80 uppercase tracking-widest">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">Home</Link>
                        <span>•</span>
                        <span className="text-[#FF5500] font-semibold">Admission</span>
                    </div>
                </div>
            </div>

            {/* ─── MAIN CONTENT AREA ─── */}
            <div className="container mx-auto px-4 py-8 sm:py-14">
                <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6 sm:p-12 md:p-16 shadow-xl border border-gray-100 space-y-12">
                    
                    {/* SECTION BADGE */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#FF5500] flex items-center justify-center shrink-0 shadow-sm">
                            <GraduationCap size={32} />
                        </div>
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B0F28]">
                                Admission Guidelines
                            </h2>
                            <p className="text-sm sm:text-base font-semibold text-[#FF5500] uppercase tracking-wider mt-0.5">
                                Salmela International School
                            </p>
                        </div>
                    </div>

                    {/* KEY OFFICE HOURS CALLOUT BOX */}
                    <div className="bg-gradient-to-r from-orange-50/90 via-orange-50/50 to-transparent border-l-6 border-[#FF5500] p-6 sm:p-10 rounded-r-3xl shadow-sm space-y-2">
                        <div className="flex items-center gap-3 text-[#FF5500] font-bold text-lg uppercase tracking-wider">
                            <Clock className="w-6 h-6" />
                            <span>Admission Form Collection &amp; Office Hours</span>
                        </div>
                        <p className="text-xl sm:text-3xl font-bold text-[#0B0F28] leading-relaxed">
                            Working Days: <span className="text-[#FF5500]">10:00 AM to 1:00 PM</span> (School Office)
                        </p>
                    </div>

                    {/* INTRO TEXT */}
                    <div className="text-gray-800 text-xl sm:text-2xl font-bold text-[#0B0F28]">
                        The following step-by-step procedure should be followed for admission:
                    </div>

                    {/* STRUCTURED ADMISSION STEPS (EXTRA LARGE & EASY TO READ) */}
                    <div className="space-y-6 text-gray-800 text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-[1.9] font-normal">
                        
                        <div className="flex gap-4 items-start bg-gray-50/80 p-6 sm:p-8 rounded-2xl border border-gray-100">
                            <span className="w-10 h-10 rounded-full bg-[#FF5500] text-white flex items-center justify-center font-bold text-xl shrink-0 mt-1">1</span>
                            <div>
                                <h3 className="font-bold text-[#0B0F28] text-xl sm:text-2xl mb-2">Form Collection &amp; Submission</h3>
                                <p className="text-gray-700">Collect the official Admission Form from the school office on any working day between 10:00 AM and 1:00 PM upon payment of the requisite fee. Submit the filled-in form within the given due date.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start bg-gray-50/80 p-6 sm:p-8 rounded-2xl border border-gray-100">
                            <span className="w-10 h-10 rounded-full bg-[#FF5500] text-white flex items-center justify-center font-bold text-xl shrink-0 mt-1">2</span>
                            <div>
                                <h3 className="font-bold text-[#0B0F28] text-xl sm:text-2xl mb-2">Required Certificates &amp; Documents</h3>
                                <p className="text-gray-700">Along with the filled form, parents must submit an official Birth Certificate (issued by City Corporation / Union Council / Hospital) and a photocopy of the student&apos;s last exam report card.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start bg-gray-50/80 p-6 sm:p-8 rounded-2xl border border-gray-100">
                            <span className="w-10 h-10 rounded-full bg-[#FF5500] text-white flex items-center justify-center font-bold text-xl shrink-0 mt-1">3</span>
                            <div>
                                <h3 className="font-bold text-[#0B0F28] text-xl sm:text-2xl mb-2">Required Photographs</h3>
                                <p className="text-gray-700">Submit two (2) recent stamp-size photographs of the student, and three (3) stamp-size + one (1) passport-size photograph of the parent(s) or legal guardian.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start bg-gray-50/80 p-6 sm:p-8 rounded-2xl border border-gray-100">
                            <span className="w-10 h-10 rounded-full bg-[#FF5500] text-white flex items-center justify-center font-bold text-xl shrink-0 mt-1">4</span>
                            <div>
                                <h3 className="font-bold text-[#0B0F28] text-xl sm:text-2xl mb-2">Written Test &amp; Viva Assessment</h3>
                                <p className="text-gray-700">Applicants must appear for both a written test and a viva interview. <em>(Note: Play Group students are exempt from written tests)</em>. Both parents (Father &amp; Mother) must be present during the viva.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start bg-gray-50/80 p-6 sm:p-8 rounded-2xl border border-gray-100">
                            <span className="w-10 h-10 rounded-full bg-[#FF5500] text-white flex items-center justify-center font-bold text-xl shrink-0 mt-1">5</span>
                            <div>
                                <h3 className="font-bold text-[#0B0F28] text-xl sm:text-2xl mb-2">Selection &amp; Final Enrollment</h3>
                                <p className="text-gray-700">Approved applicants will be published on the school notice board. Enrollment of both new and continuing students must be completed strictly according to the schedule provided by the school office.</p>
                            </div>
                        </div>

                    </div>

                    {/* CONTACT & WEBSITE FOOTNOTE */}
                    <div className="pt-8 border-t border-gray-100 bg-orange-50/60 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h4 className="text-xl font-bold text-[#0B0F28]">Need Assistance or Fee Details?</h4>
                            <p className="text-base sm:text-lg text-gray-700 mt-1">Contact the school office directly or visit our official website for notices and tuition updates.</p>
                        </div>
                        <a 
                            href="http://www.sis.com.bd" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FF5500] text-white font-bold rounded-xl hover:bg-[#e04b00] transition-colors shrink-0 shadow-md"
                        >
                            <span>Visit www.sis.com.bd</span>
                        </a>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default AboutAdmissionPage;
