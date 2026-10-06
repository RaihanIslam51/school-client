'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function PortalLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { name: 'Portal Home', path: '/portal', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
        { name: 'My Profile', path: '/portal/profile', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
        { name: 'Academic Records', path: '/portal/academics', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
        { name: 'Messages', path: '/portal/messages', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> },
        { name: 'Assignments', path: '/portal/assignments', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
        { name: 'Fees', path: '/portal/fees', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    ];

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/');
            return;
        }
        const parsedUser = JSON.parse(userData);

        // Only allow students to access portal
        if (parsedUser.role !== 'student') {
            router.push('/');
            return;
        }

        setUser(parsedUser);
    }, [router]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F5F8]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5500]"></div>
            </div>
        );
    }

    const currentMenuItem = menuItems.find(item => item.path === pathname);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('authChange'));
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-[#F4F5F8] font-sans text-[#0B0F28]">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #F4F5F8;
                }
            `}</style>
            <div className="flex h-screen overflow-hidden">
                
                {/* ─── SIDEBAR: LIGHT GRAY (#F4F5F8) ─── */}
                <aside className={`fixed inset-y-0 left-0 z-50 w-60 lg:w-64 bg-[#F4F5F8] text-[#0B0F28] shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col border-r border-gray-200/80`}>
                    
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200/80">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-[#FF5500] rounded-xl flex items-center justify-center shadow-md">
                                <span className="text-white font-extrabold text-base">🎓</span>
                            </div>
                            <div>
                                <h2 className="text-[#0B0F28] font-extrabold text-sm tracking-tight leading-none">Student Portal</h2>
                                <p className="text-gray-500 text-[11px] mt-0.5 font-medium">Salmela International</p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-[#0B0F28] p-1 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* User Profile Badge */}
                    <div className="p-3 border-b border-gray-200/80 bg-gray-100/50">
                        <div className="flex items-center space-x-2.5 p-2.5 bg-white border border-gray-200/80 rounded-xl shadow-xs">
                            <div className="w-9 h-9 bg-[#FF5500] text-white rounded-full flex items-center justify-center flex-shrink-0 font-extrabold text-sm shadow-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[#0B0F28] font-bold text-xs truncate">{user.name}</p>
                                <p className="text-[#FF5500] text-[11px] font-semibold mt-0.5">ID: {user.studentId}</p>
                                <p className="text-gray-500 text-[10px] font-medium">Class {user.class} - {user.section}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`group w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                                        isActive
                                            ? 'bg-[#FF5500] text-white font-bold shadow-md shadow-[#FF5500]/20'
                                            : 'text-gray-700 hover:bg-white hover:text-[#0B0F28] font-medium border border-transparent hover:border-gray-200/80'
                                    }`}
                                >
                                    <div className={`flex-shrink-0 transition-transform duration-200 ${!isActive && 'group-hover:scale-110'}`}>
                                        {item.icon}
                                    </div>
                                    <span className="text-xs sm:text-sm leading-none">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout Button */}
                    <div className="p-3 border-t border-gray-200/80">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-semibold"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="text-xs sm:text-sm leading-none">Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-[#0B0F28]/60 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* ─── MAIN CONTENT AREA ─── */}
                <div className="flex-1 flex flex-col overflow-hidden bg-[#F4F5F8]">
                    
                    {/* Top Header Bar */}
                    <header className="bg-white border-b border-gray-200/80 z-10 shadow-sm">
                        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="lg:hidden text-[#0B0F28] hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <div>
                                    <h1 className="text-lg sm:text-xl font-extrabold text-[#0B0F28] tracking-tight">
                                        {currentMenuItem ? currentMenuItem.name : 'Student Portal'}
                                    </h1>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5 hidden sm:block">Welcome back, {user.name} 👋</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 sm:space-x-4">
                                {/* Notification Bell */}
                                <button className="relative p-2 text-gray-600 hover:text-[#FF5500] hover:bg-gray-100 rounded-full transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5500] rounded-full ring-2 ring-white"></span>
                                </button>

                                <div className="hidden sm:block w-px h-5 bg-gray-200"></div>

                                {/* User Header Pill */}
                                <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 p-1 pr-3 rounded-full">
                                    <div className="w-7 h-7 bg-[#FF5500] text-white rounded-full flex items-center justify-center font-extrabold text-xs shadow-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden sm:block leading-tight">
                                        <p className="text-xs font-bold text-[#0B0F28]">{user.name}</p>
                                        <p className="text-[10px] font-semibold text-[#FF5500]">Student</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page Content View */}
                    <main className="flex-1 overflow-y-auto bg-[#F4F5F8] p-3 sm:p-5 lg:p-6">
                        <div className="container mx-auto">
                            {children}
                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
}
