'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './_components/sidebar';
import { menuItems } from './_components/navItems';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/');
            return;
        }
        setUser(JSON.parse(userData));
    }, [router]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const currentMenuItem = menuItems.find(item => item.path === pathname);

    // Check if we're in the settings section
    const isSettings = pathname?.startsWith('/dashboard/settings');

    return (
        <div className="min-h-screen bg-white">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar - Left Side - Only show if NOT in settings */}
                {!isSettings && (
                    <Sidebar
                        isOpen={isSidebarOpen}
                        setIsOpen={setIsSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Main Content - Right Side */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Bar - Only show if NOT in settings */}
                    {!isSettings && (
                        <header className="bg-white border-b border-[#E5E7EB] z-10">
                            <div className="flex items-center justify-between px-6 py-3.5">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setIsSidebarOpen(true)}
                                        className="lg:hidden text-[#6B7280] hover:text-[#374151] p-1 rounded-md hover:bg-[#F3F4F6] transition-colors duration-150"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                    <div>
                                        <h1 className="text-[15px] font-semibold text-[#1F2937] leading-tight">
                                            {currentMenuItem ? currentMenuItem.name : 'Dashboard'}
                                        </h1>
                                        <p className="text-[11px] text-[#9CA3AF] mt-0.5 hidden sm:block">Welcome back, {user?.name || 'Admin'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="relative p-2 text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6] rounded-lg transition-colors duration-150">
                                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#6366F1] rounded-full"></span>
                                    </button>
                                    <div className="w-8 h-8 bg-[#CFC8FF] rounded-full flex items-center justify-center ml-1">
                                        <span className="text-[#374151] font-semibold text-sm">{user?.name?.charAt(0) || 'A'}</span>
                                    </div>
                                </div>
                            </div>
                        </header>
                    )}

                    {/* Content Area */}
                    <main className="flex-1 overflow-y-auto bg-white">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
