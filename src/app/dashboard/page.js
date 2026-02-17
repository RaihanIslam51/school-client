'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../../config/api';

export default function DashboardOverview() {
    const router = useRouter();
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        notices: 0,
        classes: 12
    });
    const [recentStudents, setRecentStudents] = useState([]);
    const [recentTeachers, setRecentTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch students
            const studentsRes = await fetch(`${API_URL}/api/students`, { cache: 'no-store' });
            const studentsResponse = await studentsRes.json();
            
            // Fetch teachers
            const teachersRes = await fetch(`${API_URL}/api/teachers`, { cache: 'no-store' });
            const teachersResponse = await teachersRes.json();
            
            // Fetch notices
            const noticesRes = await fetch(`${API_URL}/api/notices`, { cache: 'no-store' });
            const noticesResponse = await noticesRes.json();
            
            // Extract data and counts from API responses
            const students = studentsResponse.data || [];
            const teachers = teachersResponse.data || [];
            const notices = noticesResponse.data || [];
            
            // Update stats using count from server
            setStats({
                students: studentsResponse.count || 0,
                teachers: teachersResponse.count || 0,
                notices: noticesResponse.count || 0,
                classes: 12
            });
            
            // Set recent students (last 5)
            setRecentStudents(students.slice(-5).reverse());
            
            // Set recent teachers (last 5)
            setRecentTeachers(teachers.slice(-5).reverse());
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };


    const quickActions = [
        {
            title: 'Add Student',
            description: 'Register new student',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            ),
            action: () => router.push('/dashboard/students')
        },
        {
            title: 'Add Teacher',
            description: 'Register new teacher',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            action: () => router.push('/dashboard/teachers')
        },
        {
            title: 'Post Notice',
            description: 'Create announcement',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            ),
            action: () => router.push('/dashboard/settings/notices')
        },
        {
            title: 'Attendance',
            description: 'Mark attendance',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
            action: () => router.push('/dashboard/attendance')
        },
        {
            title: 'Exams',
            description: 'Manage examinations',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            action: () => router.push('/dashboard/exams')
        },
        {
            title: 'Reports',
            description: 'View analytics',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            action: () => router.push('/dashboard/reports')
        },
        {
            title: 'Fees',
            description: 'Manage payments',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            action: () => router.push('/dashboard/fees')
        },
        {
            title: 'Certificates',
            description: 'Generate certificates',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
            ),
            action: () => router.push('/dashboard/certificates')
        },
        {
            title: 'Settings',
            description: 'System configuration',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            action: () => router.push('/dashboard/settings')
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            {/* Welcome Header */}
            <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-2">
                    Welcome to Dashboard! 👋
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">Here's what's happening in your school today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Total Students */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Total Students</p>
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900">
                                {loading ? '...' : stats.students}
                            </h3>
                            <p className="text-xs text-blue-600 mt-1">Enrolled students</p>
                        </div>
                        <div className="bg-blue-900 rounded-lg p-2 sm:p-4 flex-shrink-0">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Total Teachers */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Total Teachers</p>
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-900">
                                {loading ? '...' : stats.teachers}
                            </h3>
                            <p className="text-xs text-green-600 mt-1">Teaching staff</p>
                        </div>
                        <div className="bg-green-900 rounded-lg p-2 sm:p-4 flex-shrink-0">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Active Notices */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Active Notices</p>
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-900">
                                {loading ? '...' : stats.notices}
                            </h3>
                            <p className="text-xs text-purple-600 mt-1">Announcements</p>
                        </div>
                        <div className="bg-purple-900 rounded-lg p-2 sm:p-4 flex-shrink-0">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Total Classes */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Total Classes</p>
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-900">{stats.classes}</h3>
                            <p className="text-xs text-orange-600 mt-1">Active classes</p>
                        </div>
                        <div className="bg-orange-900 rounded-lg p-2 sm:p-4 flex-shrink-0">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-900">Quick Actions</h2>
                    <div className="h-1 flex-1 bg-gradient-to-r from-blue-900 to-transparent sm:ml-4 rounded"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.action}
                            className="group flex items-center gap-3 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-900 hover:border-blue-900 transition-all duration-300 text-left"
                        >
                            <div className="bg-blue-900 group-hover:bg-white rounded-lg p-2 sm:p-3 transition-colors duration-300 flex-shrink-0">
                                <div className="text-white group-hover:text-blue-900 transition-colors duration-300">
                                    {action.icon}
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-gray-800 group-hover:text-white transition-colors duration-300 text-sm sm:text-base">
                                    {action.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 group-hover:text-blue-100 transition-colors duration-300">
                                    {action.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Recent Students */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
                        <h2 className="text-lg sm:text-xl font-bold text-blue-900">Recent Students</h2>
                        <button
                            onClick={() => router.push('/dashboard/students')}
                            className="text-xs sm:text-sm text-blue-900 hover:text-blue-700 font-medium whitespace-nowrap"
                        >
                            View All →
                        </button>
                    </div>
                    <div className="space-y-3">
                        {loading ? (
                            <div className="text-center py-6 sm:py-8">
                                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-900 mx-auto"></div>
                            </div>
                        ) : recentStudents.length > 0 ? (
                            recentStudents.map((student, index) => (
                                <div
                                    key={student._id || index}
                                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200 border border-gray-100"
                                >
                                    <div className="relative flex-shrink-0">
                                        {student.imageUrl ? (
                                            <img
                                                src={student.imageUrl}
                                                alt={student.name}
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-blue-900"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-900 rounded-full flex items-center justify-center border-2 border-blue-900">
                                                <span className="text-white font-bold text-sm sm:text-lg">
                                                    {student.name?.charAt(0).toUpperCase() || 'S'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{student.name}</h3>
                                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                                            Class {student.class} • Roll: {student.rollNumber}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-8 sm:py-12">
                                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <p className="font-medium text-sm sm:text-base">No students registered yet</p>
                                <p className="text-xs sm:text-sm mt-1">Add your first student to get started</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Teachers */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
                        <h2 className="text-lg sm:text-xl font-bold text-blue-900">Recent Teachers</h2>
                        <button
                            onClick={() => router.push('/dashboard/teachers')}
                            className="text-xs sm:text-sm text-blue-900 hover:text-blue-700 font-medium whitespace-nowrap"
                        >
                            View All →
                        </button>
                    </div>
                    <div className="space-y-3">
                        {loading ? (
                            <div className="text-center py-6 sm:py-8">
                                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-900 mx-auto"></div>
                            </div>
                        ) : recentTeachers.length > 0 ? (
                            recentTeachers.map((teacher, index) => (
                                <div
                                    key={teacher._id || index}
                                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200 border border-gray-100"
                                >
                                    <div className="relative flex-shrink-0">
                                        {teacher.imageUrl ? (
                                            <img
                                                src={teacher.imageUrl}
                                                alt={teacher.name}
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-green-900"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-900 rounded-full flex items-center justify-center border-2 border-green-900">
                                                <span className="text-white font-bold text-sm sm:text-lg">
                                                    {teacher.name?.charAt(0).toUpperCase() || 'T'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{teacher.name}</h3>
                                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                                            {teacher.subject} • {teacher.qualification}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {teacher.employeeId}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-8 sm:py-12">
                                <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="font-medium text-sm sm:text-base">No teachers registered yet</p>
                                <p className="text-xs sm:text-sm mt-1">Add your first teacher to get started</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
