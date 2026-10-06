'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { GraduationCap, MapPin, Mail, Phone, ChevronRight } from 'lucide-react';

const FacebookIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const TwitterIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
);

const LinkedinIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

const Footer = () => {
    const { t, language } = useLanguage();
    const [imgError, setImgError] = useState(false);
    const isBn = language === 'bn';

    return (
        <footer className="bg-[#0B0F28] text-white font-sans pt-16 pb-8 border-t border-gray-800/80 overflow-x-hidden relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ─── MAIN GRID ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 items-start"
                >
                    
                    {/* COLUMN 1: SCHOOL LOGO & CONTACT ADDRESS */}
                    <div className="space-y-4">
                        <div className="bg-white p-3 inline-block rounded shadow-md">
                            {!imgError ? (
                                <img
                                    src="/demoschoollogo.png"
                                    alt={t('common.schoolName') || 'Salmela International School'}
                                    className="h-10 sm:h-12 w-auto object-contain"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="flex items-center gap-2 text-[#0B0F28]">
                                    <div className="w-8 h-8 rounded flex items-center justify-center bg-[#FF5500] text-white">
                                        <GraduationCap size={20} />
                                    </div>
                                    <span className="font-extrabold text-xs sm:text-sm tracking-tight">
                                        SALMELA INTERNATIONAL SCHOOL
                                    </span>
                                </div>
                            )}
                        </div>

                        <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed">
                            {isBn
                                ? 'আন্তর্জাতিক মানের গুণগত শিক্ষা ও নৈতিক মূল্যবোধ বিকাশে প্রতিশ্রুতিবদ্ধ।'
                                : 'Committed to delivering international standard education and strong moral values.'}
                        </p>

                        <div className="space-y-2.5 text-xs sm:text-sm text-gray-300 font-normal pt-1">
                            <div className="flex items-start gap-2.5">
                                <MapPin size={16} className="text-[#FF5500] shrink-0 mt-0.5" />
                                <span>346, East Padardia, Saterkul Road, North Badda, Dhaka-2941</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Mail size={16} className="text-[#FF5500] shrink-0" />
                                <a href="mailto:sis.admin@sis.com.bd" className="hover:text-[#FF5500] transition-colors">sis.admin@sis.com.bd</a>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Phone size={16} className="text-[#FF5500] shrink-0" />
                                <a href="tel:+8801321749596" className="hover:text-[#FF5500] transition-colors">+8801321-749596</a>
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 2: QUICK LINKS */}
                    <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-white mb-4 sm:mb-6 border-b border-[#FF5500]/40 pb-2 inline-block">
                            {isBn ? 'দ্রুত লিঙ্ক' : 'Quick Links'}
                        </h3>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300 font-normal">
                            <li>
                                <Link href="/" className="hover:text-[#FF5500] transition-all inline-flex items-center gap-1 group">
                                    <ChevronRight size={14} className="text-[#FF5500] transition-transform group-hover:translate-x-1" />
                                    <span>{isBn ? 'হোম পেজ' : 'Home'}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-[#FF5500] transition-all inline-flex items-center gap-1 group">
                                    <ChevronRight size={14} className="text-[#FF5500] transition-transform group-hover:translate-x-1" />
                                    <span>{isBn ? 'আমাদের সম্পর্কে' : 'About Us'}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/about/admission" className="hover:text-[#FF5500] transition-all inline-flex items-center gap-1 group">
                                    <ChevronRight size={14} className="text-[#FF5500] transition-transform group-hover:translate-x-1" />
                                    <span>{isBn ? 'ভর্তি তথ্য' : 'Admission'}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/notices" className="hover:text-[#FF5500] transition-all inline-flex items-center gap-1 group">
                                    <ChevronRight size={14} className="text-[#FF5500] transition-transform group-hover:translate-x-1" />
                                    <span>{isBn ? 'নোটিশ বোর্ড' : 'Notice Board'}</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMN 3: USEFUL RESOURCES */}
                    <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-white mb-4 sm:mb-6 border-b border-[#FF5500]/40 pb-2 inline-block">
                            {isBn ? 'দরকারী রিসোর্স' : 'Useful Resources'}
                        </h3>
                        <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300 font-normal">
                            <li>
                                <Link href="/academics/calendar" className="hover:text-[#FF5500] transition-all inline-flex items-center gap-1 group">
                                    <ChevronRight size={14} className="text-[#FF5500] transition-transform group-hover:translate-x-1" />
                                    <span>{isBn ? 'একাডেমিক ক্যালেন্ডার' : 'Academic Calendar'}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/students/syllabus" className="hover:text-[#FF5500] transition-all inline-flex items-center gap-1 group">
                                    <ChevronRight size={14} className="text-[#FF5500] transition-transform group-hover:translate-x-1" />
                                    <span>{isBn ? 'সিলেবাস ও পাঠ্যসূচি' : 'Syllabus'}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/students/video-gallery" className="hover:text-[#FF5500] transition-all inline-flex items-center gap-1 group">
                                    <ChevronRight size={14} className="text-[#FF5500] transition-transform group-hover:translate-x-1" />
                                    <span>{isBn ? 'ভিডিও গ্যালারি' : 'Video Gallery'}</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-[#FF5500] transition-all inline-flex items-center gap-1 group">
                                    <ChevronRight size={14} className="text-[#FF5500] transition-transform group-hover:translate-x-1" />
                                    <span>{isBn ? 'যোগাযোগ' : 'Contact Us'}</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* COLUMN 4: SOCIAL LINKS */}
                    <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-white mb-4 sm:mb-6 border-b border-[#FF5500]/40 pb-2 inline-block">
                            {isBn ? 'সোশ্যাল মিডিয়া' : 'Connect With Us'}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-300 mb-4 leading-relaxed">
                            {isBn ? 'আমাদের সামাজিক যোগাযোগ মাধ্যমে যুক্ত থাকুন।' : 'Follow our official channels for real-time updates.'}
                        </p>
                        <div className="flex items-center gap-3">
                            <motion.a
                                whileHover={{ scale: 1.15, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF5500] text-white flex items-center justify-center transition-colors shadow-md"
                                aria-label="Facebook"
                            >
                                <FacebookIcon className="w-4 h-4" />
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.15, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF5500] text-white flex items-center justify-center transition-colors shadow-md"
                                aria-label="Twitter"
                            >
                                <TwitterIcon className="w-4 h-4" />
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.15, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF5500] text-white flex items-center justify-center transition-colors shadow-md"
                                aria-label="LinkedIn"
                            >
                                <LinkedinIcon className="w-4 h-4" />
                            </motion.a>
                        </div>
                    </div>

                </motion.div>

                {/* ─── BOTTOM COPYRIGHT BAR ─── */}
                <div className="border-t border-gray-800/80 mt-12 sm:mt-16 pt-6 sm:pt-8 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-gray-400">
                    <p>
                        Copyright &copy; 2026 {t('common.schoolName') || 'Salmela International School'}. All Rights Reserved.
                    </p>
                    <p>
                        Developed by{' '}
                        <a
                            href="#"
                            className="text-[#FF5500] hover:underline font-semibold transition-colors"
                        >
                            NavigationBiz
                        </a>
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;