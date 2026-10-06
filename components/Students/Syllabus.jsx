'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Syllabus = () => {
    return (
        <div className="w-full bg-white font-sans text-gray-900 min-h-screen">
            
            {/* ─── HERO HEADER BANNER ─── */}
            <div className="relative w-full h-52 sm:h-64 md:h-80 flex items-center justify-center text-center overflow-hidden bg-gray-900 shadow-sm">
                <Image
                    src="/school1.png"
                    alt="Syllabus"
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
                        Syllabus
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-200 mt-2 sm:mt-3 font-medium tracking-wide">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">home</Link> - Syllabus
                    </p>
                </motion.div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="py-10 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                
                {/* SYLLABUS TITLE */}
                <motion.h2 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center font-extrabold text-xl sm:text-2xl text-gray-900 mb-8 tracking-wide flex items-center justify-center gap-2"
                >
                    <span className="w-3 h-3 rounded-full bg-[#FF5500]" />
                    Syllabus (Half-Yearly)
                </motion.h2>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-10 space-y-10 text-gray-800 text-xs sm:text-sm font-sans leading-relaxed"
                >
                    
                    {/* ─── 1. ENGLISH ─── */}
                    <div className="space-y-4">
                        <h3 className="font-extrabold text-gray-900 text-base sm:text-lg border-b border-gray-200 pb-2 text-[#FF5500]">
                            1. English:
                        </h3>

                        {/* Book 1 */}
                        <div className="space-y-2 pl-2 sm:pl-4">
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base">Book: Begin to write (1-12 pages)</h4>
                            <ul className="list-disc pl-5 space-y-1.5 text-gray-700 font-medium">
                                <li>Draw with your finger first and then draw lines</li>
                                <li>Start on the dot to finish the line</li>
                                <li>Follow the arrows and finish the object</li>
                                <li>Draw the given instruction of the exercise</li>
                            </ul>
                        </div>

                        {/* Book 2 */}
                        <div className="space-y-2 pl-2 sm:pl-4 pt-2">
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base">Book: My Book of ABC</h4>
                            <ul className="list-disc pl-5 space-y-1.5 text-gray-700 font-medium">
                                <li>A-Z (Oral)</li>
                                <li>Make 3 words by the letters A- O</li>
                                <li>Phonic sound of the letters (A-O)</li>
                                <li>Alphabets tracing and writing from A to M in copy</li>
                                <li>Identifying the letters</li>
                                <li>Match the letter</li>
                                <li>Identify the gap letters</li>
                                <li>Vowel</li>
                                <li>Opposite words: (Oral) (5 Words)</li>
                            </ul>

                            {/* Opposite Words Table Grid */}
                            <div className="pl-6 pt-2 grid grid-cols-2 sm:grid-cols-3 max-w-lg gap-2 text-gray-800 font-semibold text-xs sm:text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div>Small - Big</div>
                                <div>Fat - Thin</div>
                                <div>Long - Short</div>
                                <div>Heavy - Light</div>
                                <div>Near - Far</div>
                                <div>Up - Down</div>
                            </div>
                        </div>

                        {/* Book 3 */}
                        <div className="space-y-2 pl-2 sm:pl-4 pt-2">
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base">Book: Alphabet Practice Work Book</h4>
                            <ul className="list-disc pl-5 space-y-1.5 text-gray-700 font-medium">
                                <li>Trace and Write the <span className="font-bold text-gray-900">Capital Letters</span> from A to O</li>
                                <li>Do the related work to the letters in the worksheet</li>
                            </ul>
                        </div>
                    </div>

                    {/* ─── 2. MATH ─── */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h3 className="font-extrabold text-gray-900 text-base sm:text-lg border-b border-gray-200 pb-2 text-[#FF5500]">
                            2. Math:
                        </h3>

                        {/* Book 1 */}
                        <div className="space-y-2 pl-2 sm:pl-4">
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base">Book: My First Book of 123</h4>
                            <ul className="list-disc pl-5 space-y-1.5 text-gray-700 font-medium">
                                <li>Numbers in English (1-50) (Oral)</li>
                                <li>Trace &amp; write the numbers 1-10</li>
                                <li>১ থেকে ৫০ (মৌখিক)</li>
                                <li>১ থেকে ১০ পর্যন্ত খাতায় লিখ</li>
                                <li>Identify the missing numbers</li>
                                <li>Matching numbers</li>
                                <li>Count and write the number</li>
                                <li>Reverse numbers (1-10) (Oral)</li>
                                <li>Learn to Know about Shapes (3) (Circle, Triangle, Square, Rectangle)</li>
                            </ul>
                        </div>

                        {/* Book 2 */}
                        <div className="space-y-2 pl-2 sm:pl-4 pt-2">
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base">Book: Play with Numbers (page 1 to 26)</h4>
                            <ul className="list-disc pl-5 space-y-1.5 text-gray-700 font-medium">
                                <li>Trace and write numbers 1 – 10</li>
                                <li>Count and write the numbers</li>
                                <li>Match each set with its number</li>
                                <li>Circle the correct number</li>
                                <li>Which number comes before and after</li>
                                <li>Missing numbers</li>
                            </ul>
                        </div>
                    </div>

                    {/* ─── 3. বাংলা ─── */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h3 className="font-extrabold text-gray-900 text-base sm:text-lg border-b border-gray-200 pb-2 text-[#FF5500]">
                            3. বাংলা:
                        </h3>

                        <div className="space-y-2 pl-2 sm:pl-4">
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base">বই: সোনামণিদের অ আ ক খ (পৃষ্ঠা-৩ থেকে ১৬)</h4>
                            <ol className="list-decimal pl-5 space-y-2 text-gray-800 font-medium">
                                <li>অ থেকে ঔ পর্যন্ত স্বরবর্ণগুলো বলা। (মৌখিক)</li>
                                <li>অ থেকে ঔ পর্যন্ত স্বরবর্ণগুলো স্বরবর্ণধ্বনিসহ বলা। (মৌখিক)</li>
                                <li>স্বরবর্ণগুলো দিয়ে ৩টি করে শব্দগঠন কর। (মৌখিক)</li>
                                <li>বাংলা কার-চিহ্নগুলি বলা</li>
                                <li>
                                    <span className="font-bold text-gray-900">প্রশ্নোত্তর:</span>
                                    <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-700">
                                        <li>বাংলা ভাষায় স্বরবর্ণ কয়টি?</li>
                                        <li>পূর্ণ মাত্রাযুক্ত স্বরবর্ণ কয়টি?</li>
                                        <li>অর্ধ-মাত্রাযুক্ত স্বরবর্ণ কয়টি?</li>
                                        <li>মাত্রাহীন স্বরবর্ণ কয়টি?</li>
                                        <li>স্বরবর্ণের সংক্ষিপ্তরূপকে কি বলে?</li>
                                    </ul>
                                </li>
                                <li>ব্যঞ্জনবর্ণ (ক – ঞ) বলা।</li>
                                <li>৫টি ফলের নাম বল।</li>
                                <li>৫টি ফুলের নাম বল।</li>
                            </ol>
                        </div>

                        {/* খাতার কাজ */}
                        <div className="space-y-2 pl-2 sm:pl-4 pt-2">
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base">খাতার কাজ:</h4>
                            <ul className="list-disc pl-5 space-y-1.5 text-gray-700 font-medium">
                                <li>অ থেকে ঔ পর্যন্ত স্বরবর্ণগুলো লেখা।</li>
                                <li>মিল করা।</li>
                                <li>শূন্যস্থান পূরণ করা।</li>
                            </ul>
                        </div>

                        {/* ছড়া */}
                        <div className="space-y-2 pl-2 sm:pl-4 pt-2">
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base">ছড়া:</h4>
                            <ul className="list-disc pl-5 space-y-1.5 text-gray-700 font-medium">
                                <li>মিনি মিনি তোর কয়টি ছানা?</li>
                                <li>আতা গাছে তোতা পাখি</li>
                                <li>কাগজের টুকরা, কাগজের টুকরা</li>
                                <li>হাট্টিমা টিম টিম</li>
                            </ul>
                        </div>
                    </div>

                    {/* ─── 4. GENERAL KNOWLEDGE ─── */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <h3 className="font-extrabold text-gray-900 text-base sm:text-lg border-b border-gray-200 pb-2 text-[#FF5500]">
                            4. General Knowledge:
                        </h3>

                        <div className="space-y-4 pl-2 sm:pl-4">
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base">1. Name of 5 Animals (Oral)</h4>
                                <ul className="list-disc pl-5 mt-1 text-gray-700 font-medium">
                                    <li>Cow, Bear, Zebra, Lion, Deer</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base">2. Name of 5 Fruits (Oral)</h4>
                                <ul className="list-disc pl-5 mt-1 text-gray-700 font-medium">
                                    <li>Apple, Mango, Banana, Orange, Papaya</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base">3. Name of Colours (Oral)</h4>
                                <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-700 font-medium">
                                    <li>Red, Blue, Yellow (Primary Colours)</li>
                                    <li>Green, Purple, Black, White, Pink (Secondary Colours)</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base">4. Name of 7 Days (Oral)</h4>
                                <ul className="list-disc pl-5 mt-1 text-gray-700 font-medium">
                                    <li>Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base">5. Know your Body Parts (Oral)</h4>
                                <ul className="list-disc pl-5 mt-1 text-gray-700 font-medium">
                                    <li>Head, Ear, Nose, Eye, Shoulder, Neck, Mouth, Knee, Toe, Lip.</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base">6. Conversation Sentences: (Oral)</h4>
                                <ul className="list-disc pl-5 mt-1 space-y-1.5 text-gray-700 font-medium">
                                    <li>What is your name?</li>
                                    <li>My name is ____________</li>
                                    <li>How old are you?</li>
                                    <li>I am _______ years old</li>
                                    <li>What is the name of your school?</li>
                                    <li>The name of my School is Salmela International school</li>
                                    <li>Which class do you read in?</li>
                                    <li>I read in ________</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </motion.div>

            </div>

        </div>
    );
};

export default Syllabus;
