'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = ({ onOpenLogin }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.reload();
    };

    const navLinks = [
      
        { name: 'About Us', href: '/about' },
        { name: 'Academics', href: '/academics' },
        { name: 'Notices', href: '/notices' },
        { name: 'Contact', href: '/contact' },
    ];

    // Add appropriate link based on user role
    const getUserNavLinks = () => {
        if (!user) return navLinks;
        
        if (user.role === 'admin') {
            return [{ name: 'Admin Dashboard', href: '/dashboard' }, ...navLinks];
        } else if (user.role === 'teacher') {
            return [{ name: 'Teacherboard', href: '/teacherboard' }, ...navLinks];
        } else if (user.role === 'student') {
            return [{ name: 'Portal', href: '/portal' }, ...navLinks];
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
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                            <div className="block">
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
                                    Sunlight School
                                </h1>
                                <p className="text-xs text-black hidden lg:block">Excellence in Education</p>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
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
                        {user ? (
                            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-black">
                                <span className="text-sm font-semibold text-black">
                                    {user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-5 py-2 bg-blue-900 hover:bg-black text-white transition-colors duration-200 font-bold text-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={onOpenLogin}
                                className="ml-4 px-6 py-2 bg-blue-900 hover:bg-black text-white transition-colors duration-200 font-bold text-sm"
                            >
                                Login
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
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
                                        Logout
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
                                    Login
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