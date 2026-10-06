'use client';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, ChevronDown, ChevronRight, LogOut, LayoutDashboard,
    BookOpen, Globe, GraduationCap, Phone, Lock, FileText
} from 'lucide-react';
import { useLanguage } from '../../src/contexts/LanguageContext';

const mobileMenuVariant = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
    show: { opacity: 1, height: 'auto', transition: { duration: 0.35, ease: 'easeOut' } },
};

const dropdownVariant = {
    hidden: { opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.15 } },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
};

const Navbar = ({ onOpenLogin }) => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [user, setUser] = useState(null);
    const [imgError, setImgError] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeSubDropdown, setActiveSubDropdown] = useState(null);
    const profileRef = useRef(null);
    const headerRef = useRef(null);

    const { t, language, changeLanguage } = useLanguage();

    /* ── Reset all open dropdowns/menus when route changes ── */
    useEffect(() => {
        setIsMenuOpen(false);
        setShowProfile(false);
        setActiveDropdown(null);
        setActiveSubDropdown(null);
    }, [pathname]);

    /* ── Read & sync user state from localStorage (SSR-safe with event listener) ── */
    const loadUserFromStorage = useCallback(() => {
        if (typeof window === 'undefined') return;
        try {
            const raw = localStorage.getItem('user');
            setUser(raw ? JSON.parse(raw) : null);
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            setUser(null);
        }
    }, []);

    useEffect(() => {
        loadUserFromStorage();

        const handleStorageChange = () => loadUserFromStorage();
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('authChange', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authChange', handleStorageChange);
        };
    }, [loadUserFromStorage]);

    /* ── Close dropdowns on click outside & Escape key ── */
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfile(false);
            }
            if (headerRef.current && !headerRef.current.contains(e.target)) {
                setActiveDropdown(null);
                setActiveSubDropdown(null);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsMenuOpen(false);
                setShowProfile(false);
                setActiveDropdown(null);
                setActiveSubDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    /* ── Handlers ── */
    const handleNavClick = useCallback((e, link) => {
        if (link.dropdown && link.dropdown.length > 0) {
            e.preventDefault();
            setActiveDropdown(prev => prev === link.name ? null : link.name);
            setActiveSubDropdown(null);
            return;
        }

        setActiveDropdown(null);
        setActiveSubDropdown(null);

        if (link.href === '/' && pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [pathname]);

    const handleSubItemClick = useCallback((e, subItem) => {
        if (subItem.hasSub && subItem.subItems?.length) {
            e.preventDefault();
            setActiveSubDropdown(prev => prev === subItem.name ? null : subItem.name);
            return;
        }

        setActiveDropdown(null);
        setActiveSubDropdown(null);
    }, []);

    const handleMobileNavClick = useCallback((e, link) => {
        if (link.dropdown && link.dropdown.length > 0) {
            e.preventDefault();
            setActiveDropdown(prev => prev === link.name ? null : link.name);
            return;
        }

        setIsMenuOpen(false);
        setActiveDropdown(null);
        setActiveSubDropdown(null);

        if (link.href === '/' && pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [pathname]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('user');
        setUser(null);
        setShowProfile(false);
        window.dispatchEvent(new Event('authChange'));
        window.location.reload();
    }, []);

    const toggleLanguage = useCallback(() => {
        changeLanguage(language === 'en' ? 'bn' : 'en');
    }, [changeLanguage, language]);

    /* ── Nav Links Configuration (Memoized) ── */
    const baseLinks = useMemo(() => [
        { name: t('nav.home') || 'Home', href: '/' },
        {
            name: t('nav.aboutUs') || 'About Us',
            href: '/about',
            dropdown: [
                { name: 'Message from the chairman', href: '/about/chairman' },
                { name: 'How did it all start?', href: '/about/history' },
                { name: 'Mission', href: '/about/mission' },
                { name: 'Vision', href: '/about/vision' },
                { name: 'Arrival & Attendance', href: '/about/attendance' },
                { name: 'Admission', href: '/about/admission' },
                {
                    name: 'Student Facilities',
                    href: '/about#facilities',
                    hasSub: true,
                    subItems: [
                        { name: 'Library', href: '/about/facilities/library' },
                        { name: 'Computer Lab', href: '/about/facilities/computer-lab' },
                        { name: 'Security', href: '/about/facilities/security' },
                        { name: 'Play Ground', href: '/about/facilities/playground' },
                        { name: 'Re-Admission', href: '/about/facilities/readmission' },
                    ]
                },
            ]
        },
        {
            name: t('About School') || 'About School',
            href: '#',
            dropdown: [
                {
                    name: 'Academic Calendar',
                    href: '#',
                    hasSub: true,
                    subItems: [
                        { name: 'English Medium Academic Calendar', href: '/academics/calendar' },
                        { name: 'Bangla Medium Academic Calendar', href: '/notices' },
                    ]
                },
                { name: 'Visiting Hours', href: '/about/visiting-hours' },
                { name: 'Security & discipline', href: '/about/security-discipline' },
                {
                    name: 'Facilities',
                    href: '#',
                    hasSub: true,
                    subItems: [
                        { name: 'Multimedia Classroom', href: '/about/facilities/multimedia-classroom' },
                        { name: 'Medical Facilities', href: '/about/facilities/medical-facilities' },
                        { name: 'Counseling', href: '/about/facilities/counselling' },
                    ]
                },
                { name: 'Award', href: '/about/award' },
                { name: 'Parents', href: '/about/parents' },
                {
                    name: 'Teachers & Staff',
                    href: '#',
                    hasSub: true,
                    subItems: [
                        { name: 'Administrative Staff', href: '/about/administrative-staff' },
                        { name: 'English Medium Teachers', href: '/about/english-medium-teachers' },
                    ]
                },
                { name: 'Career Opportunity', href: '/about/career-opportunity' },
            ]
        },
        {
            name: t('Students') || 'Students',
            href: '#',
            dropdown: [
                { name: 'Semester & Timings', href: '/students/semester-timings' },
                { name: 'Syllabus', href: '/students/syllabus' },
                { name: 'Booklist', href: '/students/booklist' },
                { name: 'Uniform', href: '/students/uniform' },
                { name: 'Class routine', href: '/students/class-routine' },
                { name: 'Notes', href: '/students/notes' },
                { name: 'Events', href: '/students/events' },
                { name: 'Video gallery', href: '/students/video-gallery' },
                { name: 'Photo Gallery', href: '/students/photo-gallery' },
            ]
        },
        { name: t('Notices') || 'Notices', href: '/notices' },
        { name: t('nav.contact') || 'Contact Us', href: '/contact' },
    ], [t]);

    const userNavLinks = useMemo(() => {
        if (!user) return baseLinks;
        const roleLink =
            user.role === 'admin' ? { name: t('nav.adminDashboard') || 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={15} /> } :
            user.role === 'teacher' ? { name: t('nav.teacherboard') || 'Teacherboard', href: '/teacherboard', icon: <BookOpen size={15} /> } :
            user.role === 'student' ? { name: t('nav.portal') || 'Portal', href: '/portal', icon: <GraduationCap size={15} /> } : null;
        return roleLink ? [baseLinks[0], roleLink, ...baseLinks.slice(1)] : baseLinks;
    }, [user, baseLinks, t]);

    /* ── User initials for avatar ── */
    const initials = useMemo(() => {
        return user?.name
            ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
            : '?';
    }, [user?.name]);

    return (
        <header ref={headerRef} className="sticky top-0 z-50 shadow-md w-full font-sans">
            {/* ──────────────── TOP ROW: WHITE BACKGROUND (#FFFFFF) ──────────────── */}
            <div className="bg-white border-b border-gray-100 text-[#0B0F28]">
                <div className="container mx-auto px-4 sm:px-8 py-3.5 sm:py-4.5 flex items-center justify-between">
                    
                    {/* LOGO */}
                    <Link
                        href="/"
                        onClick={(e) => {
                            setActiveDropdown(null);
                            setActiveSubDropdown(null);
                            if (pathname === '/') {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                        }}
                        className="flex items-center gap-3 shrink-0 min-w-0 max-w-[75%] sm:max-w-none"
                    >
                        {!imgError ? (
                            <img
                                src="/demoschoollogo.png"
                                alt={t('common.schoolName') || 'Salmela International School'}
                                className="h-10 sm:h-14 lg:h-16 w-auto object-contain max-w-[200px] sm:max-w-none"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded flex items-center justify-center bg-[#FF5500] text-white shrink-0">
                                    <GraduationCap size={24} />
                                </div>
                                <span className="font-extrabold text-sm sm:text-lg md:text-xl lg:text-2xl tracking-tight text-[#0B0F28] truncate">
                                    {t('common.schoolName') || 'SALMELA INTERNATIONAL SCHOOL'}
                                </span>
                            </div>
                        )}
                    </Link>

                    {/* DESKTOP TOP RIGHT: PHONE + LOGIN + APPLY NOW */}
                    <div className="hidden lg:flex items-center gap-5 xl:gap-8">
                        
                        {/* Phone Block */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 xl:w-11 xl:h-11 rounded-full border-2 border-[#FF5500] flex items-center justify-center text-[#FF5500] shrink-0">
                                <Phone className="w-4.5 h-4.5 xl:w-5 xl:h-5 fill-current" />
                            </div>
                            <div className="leading-tight">
                                <p className="text-xs xl:text-base font-extrabold text-[#0B0F28] tracking-wide">
                                    {t('nav.phone') || 'Phone'}
                                </p>
                                <p className="text-xs xl:text-base font-bold text-gray-600">
                                    +8801321-749596
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons Group */}
                        <div className="flex items-center gap-3">
                            
                            {/* LOGIN / PROFILE BUTTON */}
                            {user ? (
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => setShowProfile(prev => !prev)}
                                        aria-expanded={showProfile}
                                        aria-haspopup="true"
                                        className="h-11 xl:h-12 flex items-stretch bg-[#FF5500] hover:bg-[#e04b00] active:scale-[0.98] text-white font-extrabold text-xs xl:text-sm uppercase tracking-wider transition-all overflow-hidden shadow-sm hover:brightness-105"
                                    >
                                        <span className="px-4 xl:px-6 flex items-center gap-2.5 font-bold">
                                            <span className="w-5.5 h-5.5 rounded-full bg-white/25 text-white flex items-center justify-center text-[11px]">
                                                {initials}
                                            </span>
                                            <span className="max-w-[100px] xl:max-w-[120px] truncate">{user.name}</span>
                                        </span>
                                        <span className="w-10 xl:w-12 bg-[#D94800] flex items-center justify-center border-l border-white/15">
                                            <ChevronDown size={16} className={`transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`} />
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {showProfile && (
                                            <motion.div
                                                variants={dropdownVariant}
                                                initial="hidden"
                                                animate="show"
                                                exit="hidden"
                                                className="absolute right-0 mt-2 w-56 bg-[#0B0F28] border border-white/10 shadow-2xl overflow-hidden py-1.5 z-50 text-white"
                                            >
                                                <div className="px-4 py-2.5 border-b border-white/10">
                                                    <p className="text-xs text-[#FF5500] font-bold uppercase tracking-wider">{user.role}</p>
                                                    <p className="text-sm font-bold truncate mt-0.5">{user.name}</p>
                                                </div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-white/5 text-sm font-semibold transition-colors text-left"
                                                >
                                                    <LogOut size={16} />
                                                    {t('common.logout')}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="h-11 xl:h-12 flex items-stretch bg-[#FF5500] hover:bg-[#e04b00] active:scale-[0.98] text-white font-extrabold text-xs xl:text-sm uppercase tracking-wider transition-all overflow-hidden shadow-sm hover:brightness-105"
                                >
                                    <span className="px-5 xl:px-7 flex items-center justify-center">
                                        {t('common.login') || 'LOGIN'}
                                    </span>
                                    <span className="w-10 xl:w-12 bg-[#D94800] flex items-center justify-center border-l border-white/15">
                                        <Lock size={16} />
                                    </span>
                                </Link>
                            )}

                            {/* APPLY NOW BUTTON */}
                            <Link
                                href="/admission"
                                className="h-11 xl:h-12 flex items-stretch bg-[#FF5500] hover:bg-[#e04b00] active:scale-[0.98] text-white font-extrabold text-xs xl:text-sm uppercase tracking-wider transition-all overflow-hidden shadow-sm hover:brightness-105"
                            >
                                <span className="px-5 xl:px-7 flex items-center justify-center gap-1">
                                    {t('nav.applyNow') || 'APPLY NOW'}
                                    <span className="text-base font-normal ml-0.5">›</span>
                                </span>
                                <span className="w-10 xl:w-12 bg-[#D94800] flex items-center justify-center border-l border-white/15">
                                    <FileText size={16} />
                                </span>
                            </Link>

                        </div>
                    </div>

                    {/* MOBILE HAMBURGER BUTTON */}
                    <div className="flex lg:hidden items-center gap-2">
                        <button
                            onClick={() => setIsMenuOpen(prev => !prev)}
                            className="p-2 text-[#0B0F28] hover:bg-black/5 rounded transition-colors"
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>

                </div>
            </div>

            {/* ──────────────── BOTTOM ROW: DARK NAVY BACKGROUND (#0B0F28) ──────────────── */}
            <nav className="bg-[#0B0F28] text-white relative">
                <div className="container mx-auto px-4 sm:px-8 flex items-center justify-between h-14 sm:h-16">
                    
                    {/* DESKTOP NAV LINKS WITH HOVER / CLICK DROPDOWN */}
                    <div className="hidden lg:flex items-center h-full">
                        {userNavLinks.map((link, idx) => {
                            const isHovered = activeDropdown === link.name;
                            const hasDropdown = Boolean(link.dropdown?.length);
                            const isRightAligned = idx >= userNavLinks.length - 2;

                            return (
                                <div
                                    key={`${link.name}-${link.href}-${idx}`}
                                    className="relative h-full flex items-center shrink-0"
                                    onMouseEnter={() => hasDropdown && setActiveDropdown(link.name)}
                                    onMouseLeave={() => {
                                        if (hasDropdown) {
                                            setActiveDropdown(null);
                                            setActiveSubDropdown(null);
                                        }
                                    }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={(e) => handleNavClick(e, link)}
                                        aria-haspopup={hasDropdown ? "true" : undefined}
                                        aria-expanded={hasDropdown ? isHovered : undefined}
                                        className={`h-full px-3 xl:px-4.5 2xl:px-5 flex items-center gap-1.5 text-xs xl:text-sm 2xl:text-[15px] font-bold transition-all duration-150 whitespace-nowrap ${
                                            isHovered
                                                ? 'bg-[#FF5500] text-white'
                                                : 'text-white hover:text-[#FF5500]'
                                        }`}
                                    >
                                        {link.icon && <span className={isHovered ? 'text-white' : 'text-[#FF5500]'}>{link.icon}</span>}
                                        <span>{link.name}</span>
                                        {hasDropdown && (
                                            <ChevronDown
                                                size={14}
                                                className={`transition-transform duration-200 ${isHovered ? 'rotate-180 text-white' : 'opacity-80'}`}
                                            />
                                        )}
                                    </Link>

                                    {/* DROPDOWN MENU */}
                                    {hasDropdown && (
                                        <AnimatePresence>
                                            {isHovered && (
                                                <motion.div
                                                    variants={dropdownVariant}
                                                    initial="hidden"
                                                    animate="show"
                                                    exit="hidden"
                                                    className={`absolute top-full min-w-[260px] w-max bg-[#0B0F28] shadow-2xl py-2.5 z-50 border-t-2 border-[#FF5500] ${
                                                        isRightAligned ? 'right-0 left-auto' : 'left-0'
                                                    }`}
                                                >
                                                    {link.dropdown.map((subItem) => {
                                                        const isSubHovered = activeSubDropdown === subItem.name;
                                                        const hasSubItems = Boolean(subItem.subItems?.length);

                                                        return (
                                                            <div
                                                                key={subItem.name}
                                                                className="relative"
                                                                onMouseEnter={() => setActiveSubDropdown(hasSubItems ? subItem.name : null)}
                                                                onMouseLeave={(e) => {
                                                                    const relatedTarget = e.relatedTarget;
                                                                    if (!e.currentTarget.contains(relatedTarget)) {
                                                                        setActiveSubDropdown(null);
                                                                    }
                                                                }}
                                                            >
                                                                <Link
                                                                    href={subItem.href}
                                                                    onClick={(e) => handleSubItemClick(e, subItem)}
                                                                    className={`px-6 py-3.5 text-sm font-semibold transition-colors flex items-center justify-between group ${
                                                                        isSubHovered
                                                                            ? 'bg-[#FF5500] text-white'
                                                                            : 'text-white/95 hover:text-white hover:bg-[#FF5500]'
                                                                    }`}
                                                                >
                                                                    <span>{subItem.name}</span>
                                                                    {(subItem.hasSub || hasSubItems) && (
                                                                        <ChevronRight
                                                                            size={14}
                                                                            className={`transition-transform ${isSubHovered ? 'text-white translate-x-0.5' : 'opacity-70 group-hover:text-white'}`}
                                                                        />
                                                                    )}
                                                                </Link>

                                                                {/* NESTED SIDE SUB-DROPDOWN FLYOUT */}
                                                                {hasSubItems && (
                                                                    <AnimatePresence>
                                                                        {isSubHovered && (
                                                                            <motion.div
                                                                                variants={dropdownVariant}
                                                                                initial="hidden"
                                                                                animate="show"
                                                                                exit="hidden"
                                                                                className={`absolute top-0 min-w-[240px] w-max bg-[#0B0F28] shadow-2xl py-2.5 z-50 ${
                                                                                    isRightAligned
                                                                                        ? 'right-full left-auto border-r border-white/10'
                                                                                        : 'left-full border-l border-white/10'
                                                                                }`}
                                                                            >
                                                                                {subItem.subItems.map((child) => (
                                                                                    <Link
                                                                                        key={child.name}
                                                                                        href={child.href}
                                                                                        onClick={() => {
                                                                                            setActiveDropdown(null);
                                                                                            setActiveSubDropdown(null);
                                                                                        }}
                                                                                        className="px-6 py-3.5 text-sm font-semibold text-white/95 hover:text-white hover:bg-[#FF5500] transition-colors block"
                                                                                    >
                                                                                        {child.name}
                                                                                    </Link>
                                                                                ))}
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* RIGHT: LANGUAGE TOGGLE / FLAG ICON */}
                    <div className="hidden lg:flex items-center shrink-0 pl-2">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity p-1"
                            title={language === 'en' ? 'Switch to Bangla' : 'Switch to English'}
                        >
                            <span className="text-2xl leading-none select-none">
                                {language === 'en' ? '🇺🇸' : '🇧🇩'}
                            </span>
                        </button>
                    </div>

                </div>

                {/* ──────────────── MOBILE MENU DRAWER ──────────────── */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            variants={mobileMenuVariant}
                            initial="hidden"
                            animate="show"
                            exit="hidden"
                            className="lg:hidden border-t border-white/10 bg-[#0B0F28] overflow-y-auto max-h-[82vh] shadow-2xl"
                        >
                            <div className="px-5 py-5 space-y-4">
                                
                                {/* Phone Info */}
                                <div className="flex items-center gap-3 bg-white/5 p-3 rounded border border-white/10">
                                    <Phone className="w-5 h-5 text-[#FF5500] shrink-0" />
                                    <div>
                                        <p className="text-[11px] font-bold text-white/70 uppercase">Phone</p>
                                        <p className="text-xs font-bold text-white">+8801321-749596</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    {user ? (
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center justify-center gap-2 py-2.5 bg-red-600/20 text-red-400 border border-red-500/30 rounded text-xs font-bold"
                                        >
                                            <LogOut size={14} />
                                            {t('common.logout')}
                                        </button>
                                    ) : (
                                        <Link
                                            href="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="h-10 flex items-stretch bg-[#FF5500] text-white rounded text-xs font-extrabold uppercase tracking-wider overflow-hidden"
                                        >
                                            <span className="flex-1 flex items-center justify-center">{t('common.login') || 'LOGIN'}</span>
                                            <span className="w-9 bg-[#D94800] flex items-center justify-center shrink-0"><Lock size={13} /></span>
                                        </Link>
                                    )}

                                    <Link
                                        href="/admission"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="h-10 flex items-stretch bg-[#FF5500] text-white rounded text-xs font-extrabold uppercase tracking-wider overflow-hidden"
                                    >
                                        <span className="flex-1 flex items-center justify-center">{t('nav.applyNow') || 'APPLY NOW'}</span>
                                        <span className="w-9 bg-[#D94800] flex items-center justify-center shrink-0"><FileText size={13} /></span>
                                    </Link>
                                </div>

                                {/* Nav Links */}
                                <div className="space-y-1 pt-2 border-t border-white/10">
                                    {userNavLinks.map((link, idx) => {
                                        const hasDropdown = Boolean(link.dropdown?.length);
                                        const isExpanded = activeDropdown === link.name;

                                        return (
                                            <div key={`${link.name}-${link.href}-${idx}`} className="space-y-1">
                                                <div className="flex items-center justify-between px-3 py-2.5 rounded text-white font-bold text-sm">
                                                    <Link
                                                        href={link.href}
                                                        onClick={(e) => handleMobileNavClick(e, link)}
                                                        className="flex items-center gap-2.5 hover:text-[#FF5500] flex-1"
                                                    >
                                                        {link.icon && <span className="text-[#FF5500]">{link.icon}</span>}
                                                        <span>{link.name}</span>
                                                    </Link>
                                                    {hasDropdown && (
                                                        <button
                                                            onClick={() => setActiveDropdown(isExpanded ? null : link.name)}
                                                            className="p-1 text-white/70 hover:text-white"
                                                            aria-label={`Toggle ${link.name} dropdown`}
                                                            aria-expanded={isExpanded}
                                                        >
                                                            <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Mobile Dropdown Sublinks */}
                                                {hasDropdown && isExpanded && (
                                                    <div className="pl-6 space-y-1 border-l-2 border-[#FF5500] ml-3 py-1">
                                                        {link.dropdown.map((subItem) => (
                                                            <React.Fragment key={subItem.name}>
                                                                <Link
                                                                    href={subItem.href}
                                                                    onClick={(e) => {
                                                                        if (subItem.href === '#') {
                                                                            e.preventDefault();
                                                                            setActiveSubDropdown(prev => prev === subItem.name ? null : subItem.name);
                                                                        } else {
                                                                            setIsMenuOpen(false);
                                                                        }
                                                                    }}
                                                                    className="block py-2 text-xs font-semibold text-white/80 hover:text-[#FF5500]"
                                                                >
                                                                    {subItem.name}
                                                                </Link>
                                                                {subItem.subItems?.map((child) => (
                                                                    <Link
                                                                        key={child.name}
                                                                        href={child.href}
                                                                        onClick={() => setIsMenuOpen(false)}
                                                                        className="block pl-4 py-1 text-[11px] font-medium text-white/60 hover:text-[#FF5500]"
                                                                    >
                                                                        └ {child.name}
                                                                    </Link>
                                                                ))}
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Language Switcher */}
                                <div className="pt-2 border-t border-white/10">
                                    <button
                                        onClick={() => { toggleLanguage(); setIsMenuOpen(false); }}
                                        className="w-full flex items-center justify-between px-3 py-2.5 bg-white/5 hover:bg-white/10 rounded text-xs font-bold text-white transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Globe size={14} className="text-[#FF5500]" />
                                            <span>{language === 'en' ? 'Switch to Bangla' : 'Switch to English'}</span>
                                        </div>
                                        <span className="text-xl">{language === 'en' ? '🇺🇸' : '🇧🇩'}</span>
                                    </button>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
};

export default Navbar;