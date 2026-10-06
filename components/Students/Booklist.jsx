'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Booklist = () => {
    return (
        <div className="w-full bg-white font-sans text-gray-900 min-h-screen">
            
            {/* ─── HERO HEADER BANNER ─── */}
            <div className="relative w-full h-52 sm:h-64 md:h-80 flex items-center justify-center text-center overflow-hidden bg-gray-900 shadow-sm">
                <Image
                    src="/school1.png"
                    alt="Booklist"
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
                        Booklist
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-200 mt-2 sm:mt-3 font-medium tracking-wide">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">home</Link> - Booklist
                    </p>
                </motion.div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="py-10 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white border border-gray-200 shadow-sm p-6 sm:p-10 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200"
                >
                    
                    {/* ─── COLUMN 1: PLAY GROUP ─── */}
                    <div className="space-y-4 md:pr-6">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                            <span className="w-2.5 h-6 bg-[#FF5500] rounded-full" />
                            <h2 className="font-extrabold text-gray-900 text-lg sm:text-xl tracking-tight">
                                Play Group
                            </h2>
                        </div>

                        {/* Books List */}
                        <div className="space-y-2">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Textbooks & Workbooks</h3>
                            <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-gray-800 font-medium leading-relaxed">
                                <li>My book of ABC (Bichitra Publications)</li>
                                <li>Rhymes for children (Playgroup) (Bichitra Publication)</li>
                                <li>Begin to write Book-1 (Series)</li>
                                <li>My first Book of 123 (Bichitra publication)</li>
                                <li>How to Draw &amp; Colour- A (Madhubun Publication)</li>
                                <li>সোনামণিদের অ আ ক খ (Bichitra Publication)</li>
                                <li>Alphabet Practice Work Book (Small &amp; Capital writing) (Bichitra Publication)</li>
                                <li>Play with Numbers (1-20) (Bichitra Publication)</li>
                            </ol>
                        </div>

                        {/* Necessary Items */}
                        <div className="pt-4 space-y-2 border-t border-gray-100">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                                Other necessary items
                            </h3>
                            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-700 font-medium">
                                <li>1 single line copy</li>
                                <li>1 four-line copy</li>
                                <li>1 square line copy</li>
                                <li>Drawing copy (Small)</li>
                                <li>1 box Crayon/Oil pastel (12 colours)</li>
                                <li>4 pencils</li>
                                <li>2 Erasers</li>
                                <li>2 sharpeners</li>
                                <li>A4 size Colour paper (20 pc)</li>
                                <li>2 Tissue box</li>
                                <li>1 Glue stick</li>
                                <li>School Diary (From school Office)</li>
                            </ul>
                        </div>
                    </div>

                    {/* ─── COLUMN 2: NURSERY ─── */}
                    <div className="space-y-4 pt-6 md:pt-0 md:pl-8">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                            <span className="w-2.5 h-6 bg-[#0B0F28] rounded-full" />
                            <h2 className="font-extrabold text-gray-900 text-lg sm:text-xl tracking-tight">
                                Nursery
                            </h2>
                        </div>

                        {/* Books List */}
                        <div className="space-y-2">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Textbooks & Workbooks</h3>
                            <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-gray-800 font-medium leading-relaxed">
                                <li>The Radiant Way (Pre-Primer) (Allied Publishers limited)</li>
                                <li>Pattern writing book-1 (English) (Bichitra Publications)</li>
                                <li>Pattern writing Book-2 9 math) (Bichitra Publications)</li>
                                <li>Sonamonider Lekha Shekho (Praromvik) (Mrs. Masuma Gazi) (Nabarun publication)</li>
                                <li>Success with Maths Ahead (Primer A) (Orient Blackswan Publication)</li>
                                <li>My Big Book of Nursery Rhymes (Popular Children&apos;s book Publication)</li>
                                <li>How to Draw &amp; Colour- B</li>
                            </ol>
                        </div>

                        {/* Necessary Items */}
                        <div className="pt-4 space-y-2 border-t border-gray-100">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                                Other necessary items
                            </h3>
                            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-700 font-medium">
                                <li>2 single line copy</li>
                                <li>2 four-line copy</li>
                                <li>2 Square line copy</li>
                                <li>1 Drawing copy (Small)</li>
                                <li>1 Box Crayon/ Oil Pastel (12 colours)</li>
                                <li>4 pencils</li>
                                <li>2 Erasers</li>
                                <li>2 sharpeners</li>
                                <li>A4 Size Colour paper (20 pc)</li>
                                <li>1 Diary (From School Premises)</li>
                                <li>2 Tissue Box</li>
                                <li>1 glue stick</li>
                            </ul>
                        </div>
                    </div>

                </motion.div>
            </div>

        </div>
    );
};

export default Booklist;
