'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../src/contexts/LanguageContext';

const Navbar = ({ onOpenLogin }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    // Read user from localStorage on client after mount to avoid SSR hydration mismatch
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const userData = localStorage.getItem('user');
        if (!userData) return;

        let cancelled = false;
        const parsed = (() => {
            try {
                return JSON.parse(userData);
            } catch (e) {
                return null;
            }
        })();

        // Defer setting state to avoid synchronous setState inside effect
        const id = window.setTimeout(() => {
            if (!cancelled) setUser(parsed);
        }, 0);

        return () => {
            cancelled = true;
            clearTimeout(id);
        };
    }, []);
    const { t, language, changeLanguage } = useLanguage();



    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.reload();
    };

    const toggleLanguage = () => {
        changeLanguage(language === 'en' ? 'bn' : 'en');
    };

    const navLinks = [
      
        { name: t('nav.aboutUs'), href: '/about' },
        { name: t('nav.academics'), href: '/academics' },
        { name: t('nav.notices'), href: '/notices' },
        { name: t('nav.contact'), href: '/contact' },
    ];

    // Add appropriate link based on user role
    const getUserNavLinks = () => {
        if (!user) return navLinks;
        
        if (user.role === 'admin') {
            return [{ name: t('nav.adminDashboard'), href: '/dashboard' }, ...navLinks];
        } else if (user.role === 'teacher') {
            return [{ name: t('nav.teacherboard'), href: '/teacherboard' }, ...navLinks];
        } else if (user.role === 'student') {
            return [{ name: t('nav.portal'), href: '/portal' }, ...navLinks];
        }
        
        return navLinks;
    };

    const userNavLinks = getUserNavLinks();

    return (
        <>
        <nav className="bg-white  sticky top-0 z-40">
            <div className="container mx-auto px-2">
                <div className="flex justify-between items-center h-16 lg:h-18">
                    {/* Logo Section */}
                    <div className="shrink-0 flex items-center">
                        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                            <div className="block">
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
                                    {t('common.schoolName')}
                                </h1>
                                <p className="text-xs text-black hidden lg:block">{t('common.tagline')}</p>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Nav links (desktop only) */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {userNavLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="px-4 py-2 text-black hover:text-blue-900 transition-colors duration-200 font-semibold text-sm lg:text-base"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Language toggle — compact text pill */}
                        <button
                            onClick={toggleLanguage}
                            className="px-2.5 py-1 text-blue-900 border border-blue-900 hover:bg-blue-900 hover:text-white transition-colors duration-200 font-bold text-xs rounded tracking-wide"
                            title={language === 'en' ? 'বাংলা তে পরিবর্তন করুন' : 'Switch to English'}
                            aria-label={language === 'en' ? 'Switch to Bangla' : 'Switch to English'}
                        >
                            {language === 'en' ? 'বাং' : 'EN'}
                        </button>

                        {/* User / Login (desktop only) */}
                        <div className="hidden lg:flex items-center gap-3 ml-2 pl-2 border-l border-black">
                            {user ? (
                                <>
                                <span className="text-sm font-semibold text-black">{user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-5 py-2 bg-blue-900 hover:bg-black text-white transition-colors duration-200 font-bold text-sm"
                                >
                                    {t('common.logout')}
                                </button>
                                </>
                            ) : (
                                <button
                                    onClick={onOpenLogin}
                                    className="px-6 py-2 bg-blue-900 hover:bg-black text-white transition-colors duration-200 font-bold text-sm"
                                >
                                    {t('common.login')}
                                </button>
                            )}
                        </div>

                        {/* Hamburger (mobile) */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 text-black hover:text-blue-900 focus:outline-none transition-colors duration-200"
                                aria-expanded={isMenuOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                {!isMenuOpen ? (
                                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="bg-white border-t border-black">
                    <div className="px-4 pt-3 pb-4 space-y-1">
                        {userNavLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block px-4 py-3 text-black hover:text-blue-900 transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        {/* Mobile language toggle */}
                        <button
                            onClick={() => { toggleLanguage(); setIsMenuOpen(false); }}
                            className="flex items-center justify-between w-full px-4 py-3 text-black hover:text-blue-900 transition-colors duration-200"
                            aria-label={language === 'en' ? 'Switch to Bangla' : 'Switch to English'}
                        >
                            <span className="font-semibold text-sm">{language === 'en' ? 'Switch to Bangla' : 'ইংরেজিতে পরিবর্তন করুন'}</span>
                            <span className="px-2 py-0.5 text-xs font-bold border border-blue-900 text-blue-900 rounded tracking-wide">{language === 'en' ? 'বাং' : 'EN'}</span>
                        </button>

                        <div className="pt-3 mt-2">
                            {user ? (
                                <div className="space-y-2">
                                    <div className="px-4 py-2 text-sm font-semibold text-black text-center">
                       
                                        {user.name}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full px-4 py-2.5 text-center bg-blue-900 hover:bg-black text-white transition-colors duration-200 font-bold"
                                    >
                                        {t('common.logout')}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        onOpenLogin();
                                        setIsMenuOpen(false);
                                    }}
                                    className="block w-full px-4 py-2.5 text-center bg-blue-900 hover:bg-black text-white transition-colors duration-200 font-bold"
                                >
                                    {t('common.login')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        </>
    );
};

export default Navbar;