'use client';
import React from 'react';
import Link from 'next/link';

export default function PortalHome() {
    const quickLinks = [
        { name: 'My Profile', path: '/portal/profile', icon: '👤', color: 'from-blue-500 to-indigo-500' },
        { name: 'Academic Records', path: '/portal/academics', icon: '📚', color: 'from-blue-500 to-cyan-500' },
        { name: 'Attendance', path: '/portal/attendance', icon: '📅', color: 'from-green-500 to-emerald-500' },
        { name: 'Assignments', path: '/portal/assignments', icon: '📝', color: 'from-purple-500 to-pink-500' },
        { name: 'Exam Schedule', path: '/portal/exams', icon: '📊', color: 'from-red-500 to-orange-500' },
        { name: 'Results', path: '/portal/results', icon: '📈', color: 'from-yellow-500 to-amber-500' },
        { name: 'Notices', path: '/portal/notices', icon: '📢', color: 'from-orange-500 to-red-500' },
        { name: 'Library', path: '/portal/library', icon: '📖', color: 'from-teal-500 to-cyan-500' },
        { name: 'Fees', path: '/portal/fees', icon: '💰', color: 'from-indigo-500 to-purple-500' },
    ];

    return (
        <div className="p-4 lg:p-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 mb-8 text-white">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">Welcome to Your Portal</h1>
                <p className="text-green-100">Access all your academic resources in one place</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">📚</span>
                        <span className="text-2xl font-bold text-blue-600">8</span>
                    </div>
                    <h3 className="text-gray-800 font-semibold">Subjects</h3>
                    <p className="text-gray-500 text-sm">Current semester</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">📅</span>
                        <span className="text-2xl font-bold text-green-600">92%</span>
                    </div>
                    <h3 className="text-gray-800 font-semibold">Attendance</h3>
                    <p className="text-gray-500 text-sm">This month</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">📝</span>
                        <span className="text-2xl font-bold text-purple-600">5</span>
                    </div>
                    <h3 className="text-gray-800 font-semibold">Assignments</h3>
                    <p className="text-gray-500 text-sm">Pending</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">📢</span>
                        <span className="text-2xl font-bold text-orange-600">3</span>
                    </div>
                    <h3 className="text-gray-800 font-semibold">New Notices</h3>
                    <p className="text-gray-500 text-sm">This week</p>
                </div>
            </div>

            {/* Quick Links */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            className="group bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${link.color} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                                    <span className="text-2xl">{link.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                                        {link.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">Access now →</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                        <span className="text-2xl">📚</span>
                        <div>
                            <h4 className="font-semibold text-gray-900">New Assignment Posted</h4>
                            <p className="text-sm text-gray-600">Mathematics - Chapter 5 Problems</p>
                            <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                        <span className="text-2xl">📈</span>
                        <div>
                            <h4 className="font-semibold text-gray-900">Exam Results Published</h4>
                            <p className="text-sm text-gray-600">Physics Mid-term Results Available</p>
                            <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-lg">
                        <span className="text-2xl">📢</span>
                        <div>
                            <h4 className="font-semibold text-gray-900">New Notice</h4>
                            <p className="text-sm text-gray-600">School Annual Function - Registration Open</p>
                            <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
