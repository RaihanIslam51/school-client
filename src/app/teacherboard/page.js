'use client';
import React from 'react';
import Link from 'next/link';

export default function TeacherboardHome() {
    const quickLinks = [
        { name: 'My Profile', path: '/teacherboard/TeacherProfile', icon: '👨‍🏫', color: 'bg-[#1a202c]' },
        { name: 'Assignments', path: '/teacherboard/assignments', icon: '📝', color: 'bg-[#1a202c]' },
        { name: 'Messages', path: '/teacherboard/Message', icon: '💬', color: 'bg-[#1a202c]' },
        { name: 'Attendance', path: '/teacherboard/attendance', icon: '✅', color: 'bg-[#1a202c]' },
        { name: 'Marks & Results', path: '/teacherboard/marks-results', icon: '📊', color: 'bg-[#1a202c]' },
        { name: 'Class Schedule', path: '/teacherboard/schedule', icon: '📅', color: 'bg-[#1a202c]' },
        { name: 'Students', path: '/teacherboard/students', icon: '👥', color: 'bg-[#1a202c]' },
        { name: 'Notices', path: '/teacherboard/notices', icon: '📢', color: 'bg-[#1a202c]' },
        { name: 'Salary', path: '/teacherboard/salary', icon: '💰', color: 'bg-[#1a202c]' },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Welcome Section */}
            <div className="bg-[#1a202c] rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 text-white">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">Welcome to Teacherboard</h1>
                <p className="text-gray-300 text-sm sm:text-base">Manage your teaching activities and access resources</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl sm:text-3xl">👥</span>
                        <span className="text-xl sm:text-2xl font-bold text-[#1a202c]">45</span>
                    </div>
                    <h3 className="text-black font-semibold text-sm sm:text-base">Students</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Under my guidance</p>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl sm:text-3xl">📚</span>
                        <span className="text-xl sm:text-2xl font-bold text-[#1a202c]">6</span>
                    </div>
                    <h3 className="text-black font-semibold text-sm sm:text-base">Subjects</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Teaching this semester</p>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl sm:text-3xl">📝</span>
                        <span className="text-xl sm:text-2xl font-bold text-[#1a202c]">12</span>
                    </div>
                    <h3 className="text-black font-semibold text-sm sm:text-base">Assignments</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Pending review</p>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl sm:text-3xl">📅</span>
                        <span className="text-xl sm:text-2xl font-bold text-[#1a202c]">24</span>
                    </div>
                    <h3 className="text-black font-semibold text-sm sm:text-base">Classes</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">This month</p>
                </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">Quick Access</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {quickLinks.map((link, index) => (
                        <Link
                            key={index}
                            href={link.path}
                            className={`${link.color} rounded-lg sm:rounded-xl p-4 sm:p-6 text-white hover:bg-[#2d3748] transition-all duration-200 transform hover:-translate-y-1 shadow-sm hover:shadow-md`}
                        >
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <span className="text-2xl sm:text-3xl">{link.icon}</span>
                                <div>
                                    <h3 className="font-bold text-base sm:text-lg text-white">{link.name}</h3>
                                    <p className="text-gray-300 text-xs sm:text-sm">Access {link.name.toLowerCase()}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activities */}
            <div className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">Recent Activities</h2>
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1a202c] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm sm:text-base">📝</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-black text-sm sm:text-base">Assignment graded</p>
                            <p className="text-gray-600 text-xs sm:text-sm">Mathematics - Class 10A • 2 hours ago</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1a202c] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm sm:text-base">📅</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-black text-sm sm:text-base">Attendance marked</p>
                            <p className="text-gray-600 text-xs sm:text-sm">Science - Class 9B • Yesterday</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1a202c] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm sm:text-base">📢</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-black text-sm sm:text-base">Notice posted</p>
                            <p className="text-gray-600 text-xs sm:text-sm">Exam schedule update • 3 days ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}