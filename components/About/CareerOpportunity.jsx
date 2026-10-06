'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const CareerOpportunity = () => {
    return (
        <div className="w-full bg-white font-sans text-gray-900 min-h-screen">
            
            {/* ─── HERO HEADER BANNER ─── */}
            <div className="relative w-full h-52 sm:h-64 md:h-80 flex items-center justify-center text-center overflow-hidden bg-gray-900 shadow-sm">
                <Image
                    src="/school1.png"
                    alt="Career opportunity"
                    fill
                    priority
                    className="object-cover opacity-60 filter brightness-90"
                />
                <div className="absolute inset-0 bg-black/40" />

                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 px-4 container mx-auto text-center"
                >
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
                        Career opportunity
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-200 mt-2 sm:mt-3 font-medium tracking-wide">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">home</Link> - Career opportunity
                    </p>
                </motion.div>
            </div>

            {/* ─── MAIN CONTENT: DOCUMENT PAPER CONTAINER ─── */}
            <div className="py-10 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white border border-gray-200 shadow-md p-6 sm:p-12 rounded-2xl text-gray-800 space-y-6"
                >
                    
                    {/* DOCUMENT HEADER: LOGO & ADDRESS */}
                    <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-6 border-gray-200 gap-4">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/demoschoollogo.png"
                                alt="Salmela International School"
                                width={160}
                                height={60}
                                className="h-12 sm:h-14 w-auto object-contain"
                            />
                        </div>
                        <div className="text-center sm:text-right text-[11px] sm:text-xs font-semibold text-gray-600 leading-tight uppercase">
                            <p className="font-bold text-gray-800">346 EAST PADARDIA,</p>
                            <p>SATERKUL ROAD, NORTH BADDA,</p>
                            <p>DHAKA-1212, BANGLADESH</p>
                        </div>
                    </div>

                    {/* VACANCY TITLE */}
                    <div className="text-center my-6">
                        <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-wider">
                            Vacancy
                        </h2>
                    </div>

                    {/* INTRO PARAGRAPHS */}
                    <div className="space-y-2 text-xs sm:text-sm text-gray-700 font-medium">
                        <p>
                            <span className="font-bold text-gray-900">Salmela International School</span> is an English Medium School conducted by &quot;Joy &amp; Hope Trust&quot;.
                        </p>
                        <p>
                            Applications are invited from qualified and experienced Bangladeshi citizens for the following positions:
                        </p>
                    </div>

                    {/* VACANCY TABLE */}
                    <div className="overflow-x-auto shadow-sm my-6 border border-gray-300 rounded-xl bg-white">
                        <table className="w-full text-xs sm:text-sm border-collapse text-gray-900 min-w-[640px]">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-300 text-gray-900 font-bold">
                                    <th className="py-3 px-3.5 text-left border-r border-gray-300 w-1/4">Name of the Post of Teacher</th>
                                    <th className="py-3 px-2 text-center border-r border-gray-300 w-14">No. of Post</th>
                                    <th className="py-3 px-3.5 text-left border-r border-gray-300 w-1/5">Education Qualifications</th>
                                    <th className="py-3 px-3.5 text-left border-r border-gray-300 w-1/3">Experiences</th>
                                    <th className="py-3 px-3.5 text-left">Additional Requirement</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200 bg-white align-top">
                                    <td className="py-3.5 px-3.5 border-r border-gray-300 font-semibold text-gray-900 space-y-2">
                                        <p>1. Senior Teacher</p>
                                        <p>2. Junior Teacher</p>
                                    </td>
                                    <td className="py-3.5 px-2 text-center border-r border-gray-300 font-bold text-gray-900 space-y-2">
                                        <p>1</p>
                                        <p>1</p>
                                    </td>
                                    <td className="py-3.5 px-3.5 border-r border-gray-300 font-medium text-gray-800">
                                        Hon. &amp; Masters in English
                                    </td>
                                    <td className="py-3.5 px-3.5 border-r border-gray-300 text-xs leading-relaxed text-gray-800 space-y-2">
                                        <p>Minimum 3 to 5 years of working experience with a reputed English Medium School in Bangladesh. More experience will preferable.</p>
                                        <p className="font-bold text-gray-900">(Pure candidate from English Medium or English Version).</p>
                                    </td>
                                    <td className="py-3.5 px-3.5 text-xs leading-relaxed text-gray-800 space-y-1.5">
                                        <p>1. Age- 25-40 years.</p>
                                        <p>2. High level of proficiency in English (both verbal &amp; written ability to speak in English fluently) is essential.</p>
                                        <p>3. IT knowledge in MS Office is essentially required.</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* SUBMISSION INSTRUCTIONS */}
                    <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                        <p>
                            Interested candidates are requested to send and submit their applications&apos; softcopy and hardcopy along with C.V on or before the 10th of November 2022. Please apply with your recent Passport size Photograph, National ID photocopy, job experience certificates, and Pastor/Father/Bishop&apos;s reference from your church. <span className="underline font-semibold text-gray-900">Write the Position&apos;s name on the top of the Envelope.</span>
                        </p>
                        <p>
                            Please note that <span className="font-bold text-gray-900">Salmela International School Authority</span> reserves the right to accept or reject any or all applications if it is not submitted according to the above requirements. Please mail your application to bellow address.
                        </p>
                    </div>

                    {/* CONTACT ADDRESS FOOTER */}
                    <div className="pt-4 border-t border-gray-200 text-xs sm:text-sm space-y-1 text-gray-800">
                        <p className="font-bold text-gray-900">The Chairman</p>
                        <p className="font-semibold text-gray-800">Salmela International School</p>
                        <p className="text-gray-600">Email: sis.chairman@sis.com.bd</p>
                        <p className="text-gray-600">346 East Padardia, Saterkul Road, North Badda, Dhaka-1241</p>
                    </div>

                    {/* BOTTOM QUERY STRIP */}
                    <div className="bg-gray-100 text-gray-800 font-bold text-xs sm:text-sm py-3 px-4 text-center rounded-xl border border-gray-200 mt-6">
                        For any query, please contact us: Visit us: +8801321749596
                    </div>

                </motion.div>
            </div>

        </div>
    );
};

export default CareerOpportunity;
