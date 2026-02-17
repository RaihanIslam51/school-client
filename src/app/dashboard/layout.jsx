'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard Overview', path: '/dashboard', icon: '📊' },
        { name: 'Class Management', path: '/dashboard/class-section', icon: '🏫' },
        { name: 'Teacher Management', path: '/dashboard/teachers', icon: '👨‍🏫' },
        { name: 'Student Management', path: '/dashboard/students', icon: '👨‍🎓' },
        { name: 'Admin Management', path: '/dashboard/AdminManagement', icon: '👨‍💼' },
        { name: 'Exam Management', path: '/dashboard/exams', icon: '📝' },
        { name: 'Fees Management', path: '/dashboard/fees', icon: '💰' },
        { name: 'Expense Management', path: '/dashboard/expenses', icon: '💳' },
        { name: 'Salary Management', path: '/dashboard/salary', icon: '💵' },
        { name: 'Certificate Generator', path: '/dashboard/certificates', icon: '🎓' },
        { name: 'Reports & Analytics', path: '/dashboard/reports', icon: '📊' },
        { name: 'System Settings', path: '/dashboard/settings', icon: '⚙️' },
    ];

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
                <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-black transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between p-6 border-b border-black">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-900 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <div>
                                <h2 className="text-blue-900 font-bold text-lg">Admin Panel</h2>
                                <p className="text-black text-xs">Sunlight School</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden text-black hover:text-blue-900"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* User Info */}
                    {/* <div className="p-4 border-b border-black">
                        <div className="flex items-center space-x-3 p-3 bg-white border border-black rounded">
                            <div className="w-12 h-12 bg-blue-900 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-lg">{user.name.charAt(0)}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-black font-semibold text-sm">{user.name}</p>
                                <p className="text-blue-900 text-xs capitalize">{user.role || 'Admin'}</p>
                            </div>
                        </div>
                    </div> */}

                    {/* Menu Items */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded transition-colors duration-200 ${
                                    pathname === item.path
                                        ? 'bg-blue-900 text-white'
                                        : 'text-black hover:bg-blue-900 hover:text-white'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="text-sm font-medium">{item.name}</span>
                                {pathname === item.path && (
                                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Back to Home Button */}
                    <div className="p-4 border-t border-black">
                        <Link
                            href="/"
                            className="flex items-center space-x-3 px-4 py-3 rounded text-black hover:bg-blue-900 hover:text-white transition-colors duration-200 border border-black"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="text-sm font-medium">Back to Home</span>
                        </Link>
                    </div>
                </aside>
                )}

                {/* Mobile Sidebar Overlay */}
                {!isSettings && isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Main Content - Right Side */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Bar - Only show if NOT in settings */}
                    {!isSettings && (
                    <header className="bg-white border-b border-black z-10">
                        <div className="flex items-center justify-between px-4 py-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden text-black hover:text-blue-900"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h1 className="text-xl font-bold text-blue-900">
                                {currentMenuItem ? currentMenuItem.name : 'Dashboard'}
                            </h1>
                            <div className="flex items-center space-x-4">
                                <button className="relative text-black hover:text-blue-900">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-blue-900 rounded-full"></span>
                                </button>
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
