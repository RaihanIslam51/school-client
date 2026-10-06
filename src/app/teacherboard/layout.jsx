'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function TeacherboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard Home', path: '/teacherboard', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
        { name: 'My Profile', path: '/teacherboard/TeacherProfile', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
        { name: 'Exam Schedule', path: '/teacherboard/exams', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
        { name: 'Assignments', path: '/teacherboard/assignments', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
        { name: 'Messages', path: '/teacherboard/Message', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> },
        { name: 'Attendance', path: '/teacherboard/attendance', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
        { name: 'Marks & Results', path: '/teacherboard/marks-results', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
        { name: 'Students', path: '/teacherboard/students', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    ];

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/');
            return;
        }
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'teacher') {
            router.push('/');
            return;
        }
        setUser(parsedUser);
    }, [router]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F4F5F8]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF5500]"></div>
            </div>
        );
    }

    const currentMenuItem = menuItems.find(item => item.path === pathname);

    return (
        <div className="min-h-screen bg-[#F4F5F8] font-sans">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #F4F5F8;
                }
            `}</style>
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar - Left Side */}
                <aside className={`fixed inset-y-0 left-0 z-50 w-60 lg:w-64 bg-[#F4F5F8] text-[#0B0F28] border-r border-gray-200/80 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200/80">
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-[#FF5500] text-white rounded-xl flex items-center justify-center shadow-sm text-lg">
                                👩‍🏫
                            </div>
                            <div>
                                <h2 className="text-[#0B0F28] font-extrabold text-base tracking-tight">Teacherboard</h2>
                                <p className="text-gray-500 text-[11px] font-medium">Sunlight School</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden text-gray-500 hover:text-[#0B0F28] p-1 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="p-3.5 border-b border-gray-200/80">
                        <div className="flex items-center space-x-3 p-2.5 bg-white border border-gray-200/80 rounded-xl shadow-sm">
                            <div className="w-9 h-9 bg-[#FF5500] text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'T'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[#0B0F28] font-bold text-xs truncate">{user.name}</p>
                                <p className="text-gray-500 text-[10px] capitalize font-medium">{user.role || 'Teacher'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`group w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                                        isActive
                                            ? 'bg-[#FF5500] text-white font-bold shadow-md'
                                            : 'text-[#0B0F28] hover:bg-white hover:text-[#FF5500] font-semibold'
                                    }`}
                                >
                                    <div className="flex-shrink-0">
                                        {item.icon}
                                    </div>
                                    <span className="text-xs sm:text-sm leading-none">{item.name}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Back to Home Button */}
                    <div className="p-3 border-t border-gray-200/80">
                        <Link
                            href="/"
                            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[#0B0F28] hover:bg-white hover:text-[#FF5500] transition-all duration-200 group text-xs sm:text-sm font-semibold"
                        >
                            <div className="flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            <span>Logout</span>
                        </Link>
                    </div>
                </aside>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-[#0B0F28]/40 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Main Content - Right Side */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Bar */}
                    <header className="bg-white border-b border-gray-200/80 z-10 shadow-sm">
                        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="lg:hidden text-gray-600 hover:text-[#0B0F28] p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <div>
                                    <h1 className="text-base sm:text-lg font-extrabold text-[#0B0F28] tracking-tight">
                                        {currentMenuItem ? currentMenuItem.name : 'Teacherboard'}
                                    </h1>
                                    <p className="text-[11px] text-gray-500 font-medium hidden sm:block">Welcome back, {user.name} 👋</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button className="relative p-2 text-gray-500 hover:text-[#0B0F28] hover:bg-gray-100 rounded-full transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5500] rounded-full"></span>
                                </button>
                                <div className="hidden sm:block w-px h-5 bg-gray-200 mx-1"></div>
                                <div className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-full transition-colors">
                                    <div className="w-8 h-8 bg-[#0B0F28] text-white rounded-full flex items-center justify-center font-bold text-xs">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'T'}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-xs font-extrabold text-[#0B0F28] leading-tight">{user.name}</p>
                                        <p className="text-[10px] text-gray-500 font-semibold capitalize">{user.role || 'Teacher'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Area */}
                    <main className="flex-1 overflow-y-auto bg-[#F4F5F8] p-3 sm:p-5 lg:p-6">
                        <div className="w-full container mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}