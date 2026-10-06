'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const EnglishMediumTeachers = () => {
    return (
        <div className="w-full bg-white font-sans text-gray-900 min-h-screen">
            
            {/* ─── HERO HEADER BANNER ─── */}
            <div className="relative w-full h-52 sm:h-64 md:h-80 flex items-center justify-center text-center overflow-hidden bg-gray-900 shadow-sm">
                <Image
                    src="/school1.png"
                    alt="English medium teachers"
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
                        English medium teachers
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-200 mt-2 sm:mt-3 font-medium tracking-wide">
                        <Link href="/" className="hover:text-[#FF5500] transition-colors">home</Link> - English medium teachers
                    </p>
                </motion.div>
            </div>

            {/* ─── MAIN CONTENT ─── */}
            <div className="py-10 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-10">
                
                {/* ─── TEACHER 1: SONIA MARTHA ROZARIO ─── */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
                >
                    {/* Header Bar */}
                    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#FF5500]" />
                        Sonia Martha Rozario
                    </div>

                    {/* Body Content */}
                    <div className="p-6 sm:p-8 space-y-4">
                        {/* Avatar */}
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#FF5500]/30 shadow-sm mb-4">
                            <Image
                                src="/leva_salmela.png"
                                alt="Sonia Martha Rozario"
                                fill
                                className="object-cover object-top"
                            />
                        </div>

                        {/* Message Paragraphs */}
                        <div className="space-y-3.5 text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                            <p>
                                It&apos;s my pleasure to be writing to you to introduce myself as the Senior Teacher of Salmela International School. I have been to teaching profession for over 7 years and eventually progressed to Senior teacher.
                            </p>
                            <p>
                                I feel lucky enough to get the opportunity to work with the SIS team and hearty welcoming you all to our Salmela Family.
                            </p>
                            <p>
                                We believe that happy child will be a successful child and for that we the teachers of Salmela International School gives our effort to ensure that our all students enjoy the school and achieve success in their life. We nurture the growth of our pupils- academically, socially, emotionally, morally and physically and achieve these in a safe, caring and creative environment.
                            </p>
                            <p>
                                The aim of our whole team is to work together to bring learning &apos;alive&apos; and extend pupils&apos; experiences. So that they are well prepared for the next steps in their life. We have a very hardworking and dedicated staff to serve the best for our students care. We know the importance of parent&apos;s involvement in their child&apos;s education. That&apos;s why we always try to maintain a close relationship with our parents. As a parent myself, I really value the opinions and concerns of parents and inviting you into school as much as possible.
                            </p>
                            <p>
                                Please call in at any time to see me or make an appointment to see me to discuss any concerns or issues or can see any other member of staff if we are not immediately available. We pride ourselves on being a warm, welcoming school and look forward to working together to achieve the best outcomes for all of the children.
                            </p>
                        </div>

                        {/* Signature Footer */}
                        <div className="pt-4 text-xs sm:text-sm text-gray-800 space-y-0.5 border-t border-gray-100">
                            <p className="font-bold text-gray-900">Sonia Martha Rozario</p>
                            <p className="font-semibold text-[#FF5500] italic">Senior Teacher</p>
                            <p className="font-extrabold text-gray-900">Salmela International School</p>
                        </div>
                    </div>
                </motion.div>

                {/* ─── TEACHER 2: LAYA ADHKARI TRISH ─── */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
                >
                    {/* Header Bar */}
                    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#0B0F28]" />
                        Laya Adhkari Trish
                    </div>

                    {/* Body Content */}
                    <div className="p-6 sm:p-8 space-y-4">
                        {/* Avatar */}
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#0B0F28]/30 shadow-sm mb-4">
                            <Image
                                src="/heikki_salmela.png"
                                alt="Laya Adhkari Trish"
                                fill
                                className="object-cover object-top"
                            />
                        </div>

                        {/* Message Paragraphs */}
                        <div className="space-y-3.5 text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                            <p className="font-semibold text-gray-800">
                                Dear parents and guardians,
                            </p>
                            <p>
                                My name is Laya Adhikari Trisha, and I&apos;ll be teaching your child this school year. I am so excited to get to know you and your child throughout the year. I wanted to start by allowing you to learn a little more about me. I graduated from Dhaka International University. My years of experience as a teacher have helped me form a teaching philosophy that guides how I help my students succeed in the classroom and beyond. I truly believe that their success begins with making them comfortable in the classroom, so I start our school year with plenty of activities so everyone can get to know one another. I encourage them to share their questions and opinions in an unbiased and open environment. I strive to create a space for students to explore their learning styles, then I&apos;m here to help develop their interests and guide their absorption of the material. My goal is to host regular parent/teacher conferences and ensure you&apos;re aware of your child&apos;s progress throughout the school year. I invite you to be an active participant in your child&apos;s education, as this will only help him or her to continue to grow in knowledge. Thank you for your time in reading this.
                            </p>
                            <p>
                                I&apos;m looking forward to meeting you and your child in person!
                            </p>
                        </div>

                        {/* Signature Footer */}
                        <div className="pt-4 text-xs sm:text-sm text-gray-800 space-y-0.5 border-t border-gray-100">
                            <p className="font-medium text-gray-600">Sincerely,</p>
                            <p className="font-bold text-gray-900 mt-1">Laya Adhkari Trish</p>
                            <p className="font-semibold text-[#FF5500] italic">Junior Teacher</p>
                            <p className="font-extrabold text-gray-900">Salmela International School</p>
                        </div>
                    </div>
                </motion.div>

            </div>

        </div>
    );
};

export default EnglishMediumTeachers;
