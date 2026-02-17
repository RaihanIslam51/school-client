'use client';
import React from 'react';
import Link from 'next/link';

export default function PortalHome() {
    const quickLinks = [
        { name: 'My Profile', path: '/portal/profile', icon: '👤' },
        { name: 'Academic Records', path: '/portal/academics', icon: '📚' },
        { name: 'Attendance', path: '/portal/attendance', icon: '📅' },
        { name: 'Assignments', path: '/portal/assignments', icon: '📝' },
        { name: 'Exam Schedule', path: '/portal/exams', icon: '📊' },
        { name: 'Results', path: '/portal/results', icon: '📈' },
        { name: 'Notices', path: '/portal/notices', icon: '📢' },
        { name: 'Library', path: '/portal/library', icon: '📖' },
        { name: 'Fees', path: '/portal/fees', icon: '💰' },
    ];

    return (
        <div className="p-1 sm:p-2 lg:p-3 xl:p-4">
            {/* Welcome Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 mb-2">Welcome to Your Portal</h1>
                <p className="text-gray-600 text-sm sm:text-base">Access all your academic resources in one place</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl sm:text-3xl">📚</span>
                        <span className="text-xl sm:text-2xl font-bold text-gray-900">8</span>
                    </div>
                    <h3 className="text-gray-900 font-semibold text-sm sm:text-base">Subjects</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Current semester</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl sm:text-3xl">📅</span>
                        <span className="text-xl sm:text-2xl font-bold text-gray-900">92%</span>
                    </div>
                    <h3 className="text-gray-900 font-semibold text-sm sm:text-base">Attendance</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">This month</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl sm:text-3xl">📝</span>
                        <span className="text-xl sm:text-2xl font-bold text-gray-900">5</span>
                    </div>
                    <h3 className="text-gray-900 font-semibold text-sm sm:text-base">Assignments</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Pending</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl sm:text-3xl">📢</span>
                        <span className="text-xl sm:text-2xl font-bold text-gray-900">3</span>
                    </div>
                    <h3 className="text-gray-900 font-semibold text-sm sm:text-base">New Notices</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">This week</p>
                </div>
            </div>

            {/* Quick Links */}
            <div className="mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-bold text-blue-900 mb-4 sm:mb-6">Quick Access</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            className="group bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform flex-shrink-0">
                                    <span className="text-xl sm:text-2xl">{link.icon}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-900 transition-colors truncate">
                                        {link.name}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600">Access now →</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-blue-900 mb-4">Recent Activity</h2>
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg">
                        <span className="text-xl sm:text-2xl flex-shrink-0">📚</span>
                        <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">New Assignment Posted</h4>
                            <p className="text-xs sm:text-sm text-gray-600">Mathematics - Chapter 5 Problems</p>
                            <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg">
                        <span className="text-xl sm:text-2xl flex-shrink-0">📈</span>
                        <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Exam Results Published</h4>
                            <p className="text-xs sm:text-sm text-gray-600">Physics Mid-term Results Available</p>
                            <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg">
                        <span className="text-xl sm:text-2xl flex-shrink-0">📢</span>
                        <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">New Notice</h4>
                            <p className="text-xs sm:text-sm text-gray-600">School Annual Function - Registration Open</p>
                            <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
