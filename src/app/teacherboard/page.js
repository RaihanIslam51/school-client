'use client';
import React from 'react';
import Link from 'next/link';

export default function TeacherboardHome() {
    const quickLinks = [
        { name: 'My Profile', path: '/teacherboard/TeacherProfile', icon: '👨‍🏫', color: 'from-blue-500 to-indigo-500' },
        { name: 'Assignments', path: '/teacherboard/assignments', icon: '📝', color: 'from-purple-500 to-pink-500' },
        { name: 'Messages', path: '/teacherboard/Message', icon: '💬', color: 'from-green-500 to-emerald-500' },
        { name: 'Attendance', path: '/teacherboard/attendance', icon: '✅', color: 'from-red-500 to-orange-500' },
        { name: 'Marks & Results', path: '/teacherboard/marks-results', icon: '📊', color: 'from-yellow-500 to-amber-500' },
        { name: 'Class Schedule', path: '/teacherboard/schedule', icon: '📅', color: 'from-blue-500 to-cyan-500' },
        { name: 'Students', path: '/teacherboard/students', icon: '👥', color: 'from-teal-500 to-cyan-500' },
        { name: 'Notices', path: '/teacherboard/notices', icon: '📢', color: 'from-orange-500 to-red-500' },
        { name: 'Salary', path: '/teacherboard/salary', icon: '💰', color: 'from-indigo-500 to-purple-500' },
    ];

    return (
        <div className="p-6 lg:p-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">Welcome to Teacherboard</h1>
                <p className="text-blue-100">Manage your teaching activities and access resources</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">👥</span>
                        <span className="text-2xl font-bold text-blue-600">45</span>
                    </div>
                    <h3 className="text-gray-800 font-semibold">Students</h3>
                    <p className="text-gray-500 text-sm">Under my guidance</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">📚</span>
                        <span className="text-2xl font-bold text-green-600">6</span>
                    </div>
                    <h3 className="text-gray-800 font-semibold">Subjects</h3>
                    <p className="text-gray-500 text-sm">Teaching this semester</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">📝</span>
                        <span className="text-2xl font-bold text-purple-600">12</span>
                    </div>
                    <h3 className="text-gray-800 font-semibold">Assignments</h3>
                    <p className="text-gray-500 text-sm">Pending review</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">📅</span>
                        <span className="text-2xl font-bold text-orange-600">24</span>
                    </div>
                    <h3 className="text-gray-800 font-semibold">Classes</h3>
                    <p className="text-gray-500 text-sm">This month</p>
                </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quickLinks.map((link, index) => (
                        <Link
                            key={index}
                            href={link.path}
                            className={`bg-gradient-to-r ${link.color} rounded-xl p-6 text-white hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
                        >
                            <div className="flex items-center space-x-4">
                                <span className="text-3xl">{link.icon}</span>
                                <div>
                                    <h3 className="font-bold text-lg">{link.name}</h3>
                                    <p className="text-white/80 text-sm">Access {link.name.toLowerCase()}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activities */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activities</h2>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600">📝</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">Assignment graded</p>
                            <p className="text-gray-600 text-sm">Mathematics - Class 10A • 2 hours ago</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600">📅</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">Attendance marked</p>
                            <p className="text-gray-600 text-sm">Science - Class 9B • Yesterday</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600">📢</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">Notice posted</p>
                            <p className="text-gray-600 text-sm">Exam schedule update • 3 days ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}