'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { API_URL } from '../../../../config/api';

export default function TeacherProfile() {
    const [teacher, setTeacher] = useState(null);
    const [classRoutines, setClassRoutines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTeacherProfile();
    }, []);


    const loadTeacherProfile = async () => {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) {
                alert('Please log in to view your profile');
                return;
            }

            const user = JSON.parse(userData);
            console.log('Current user from localStorage:', user);

            // Check if user is a teacher
            if (user.role !== 'teacher') {
                console.log('User is not a teacher, role:', user.role);
                setLoading(false);
                return;
            }

            // Fetch teacher data from server using email
            console.log('Fetching teacher data from API by email...');
            const response = await fetch(`${API_URL}/api/teachers/email/${user.email}`);
            const teacherData = await response.json();
            console.log('Teacher API response:', teacherData);

            if (teacherData.success && teacherData.data) {
                console.log('Found complete teacher data by email:', teacherData.data);
                setTeacher(teacherData.data);
                await fetchClassRoutines(teacherData.data);
                return;
            } else {
                console.log('Teacher not found in database by email:', user.email);
                // Fallback to localStorage data
                console.log('Using localStorage data as fallback');
                setTeacher(user);
                await fetchClassRoutines(user);
            }

        } catch (error) {
            console.error('Error loading teacher profile:', error);
            // Final fallback
            try {
                const userData = localStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    if (user.role === 'teacher') {
                        console.log('Final fallback: using localStorage data');
                        setTeacher(user);
                        await fetchClassRoutines(user);
                    }
                }
            } catch (fallbackError) {
                console.error('Final fallback error:', fallbackError);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchClassRoutines = async (teacherData) => {
        try {
            const response = await fetch(`${API_URL}/api/class/routines`);
            const data = await response.json();
            
            // Ensure we have an array of routines
            let routines = [];
            if (data && data.data && Array.isArray(data.data)) {
                routines = data.data;
            } else if (Array.isArray(data)) {
                routines = data;
            }

            // Filter routines for this teacher
            const teacherRoutines = routines.filter(routine =>
                routine.teacherId === teacherData.teacherId ||
                routine.teacherName === teacherData.name
            );

            setClassRoutines(teacherRoutines);
        } catch (error) {
            console.error('Error fetching class routines:', error);
            setClassRoutines([]); // Set empty array on error
        }
    };

    const getDayOrder = (day) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return days.indexOf(day);
    };

    const sortedRoutines = classRoutines.sort((a, b) => {
        const dayDiff = getDayOrder(a.day) - getDayOrder(b.day);
        if (dayDiff !== 0) return dayDiff;
        return a.startTime.localeCompare(b.startTime);
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900"></div>
            </div>
        );
    }

    if (!teacher) {
        // Check if user is not a teacher
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.role !== 'teacher') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center border border-gray-200">
                    <div className="text-6xl mb-4">🚫</div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-2">Access Restricted</h2>
                    <p className="text-black mb-4">This page is only accessible to teachers.</p>
                    <p className="text-sm text-black">
                        You are logged in as: <span className="font-semibold capitalize">{user.role}</span>
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-6 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all font-semibold"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
            }
        }
        
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-6xl mb-4">👨‍🏫</div>
                    <h2 className="text-2xl font-bold text-black mb-2">Profile Not Found</h2>
                    <p className="text-black">Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto p-4 sm:p-6">
                {/* Header Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 mb-6 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                        {/* Profile Image */}
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                            {teacher.imageUrl ? (
                                <Image
                                    src={teacher.imageUrl}
                                    alt={teacher.name}
                                    width={128}
                                    height={128}
                                    className="w-full h-full rounded-lg object-cover"
                                />
                            ) : (
                                <span className="text-4xl md:text-5xl text-blue-900 font-bold">
                                    {teacher.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>

                        {/* Teacher Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">{teacher.name}</h1>
                            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0 text-black">
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold">Teacher ID: {teacher.teacherId}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span>Subject: {teacher.subject}</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium ${
                                    teacher.status === 'active'
                                        ? 'bg-blue-900 text-white'
                                        : 'bg-gray-600 text-white'
                                }`}>
                                    {teacher.status === 'active' ? 'Active Teacher' : 'Inactive Teacher'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Information Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Personal Information */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-blue-900 flex items-center">
                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mr-2">
                                    <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                Personal Information
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-black">Full Name</p>
                                    <p className="text-base font-semibold text-black">{teacher.name}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-black">Email</p>
                                    <p className="text-base font-semibold text-black">{teacher.email || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-black">Phone</p>
                                    <p className="text-base font-semibold text-black">{teacher.phone || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-black">Qualification</p>
                                    <p className="text-base font-semibold text-black">{teacher.qualification || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <div>
                                    <p className="text-sm font-medium text-black">Experience</p>
                                    <p className="text-base font-semibold text-black">{teacher.experience ? `${teacher.experience} years` : 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <div>
                                    <p className="text-sm font-medium text-black">Date of Joining</p>
                                    <p className="text-base font-semibold text-black">
                                        {teacher.dateOfJoining ? new Date(teacher.dateOfJoining).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'Not provided'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-blue-900 flex items-center">
                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mr-2">
                                    <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                Professional Information
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="text-center p-4 bg-white rounded">
                                <p className="text-sm font-medium text-black mb-1">Subject Specialization</p>
                                <p className="text-2xl font-bold text-blue-900">{teacher.subject}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-white rounded">
                                    <p className="text-sm font-medium text-black mb-1">Classes Assigned</p>
                                    <p className="text-xl font-bold text-black">{classRoutines.length}</p>
                                </div>
                                <div className="text-center p-3 bg-white rounded">
                                    <p className="text-sm font-medium text-black mb-1">Total Students</p>
                                    <p className="text-xl font-bold text-black">
                                        {classRoutines.reduce((sum, routine) => sum + (routine.numberOfStudents || 0), 0)}
                                    </p>
                                </div>
                            </div>

                            <div className="py-2">
                                <p className="text-sm font-medium text-black mb-1">Address</p>
                                <p className="text-base font-semibold text-black">
                                    {teacher.address || 'Not provided'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Class Management Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-blue-900 flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M9 11h6" />
                                </svg>
                            </div>
                            Class Management Schedule
                        </h2>
                        <div className="text-right">
                            <p className="text-sm text-black">Total Classes</p>
                            <p className="text-xl font-bold text-blue-900">{classRoutines.length}</p>
                        </div>
                    </div>

                    {sortedRoutines.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sortedRoutines.map((routine, index) => (
                                <div key={index} className="bg-white rounded border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                                <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-black">{routine.subject}</h3>
                                                <p className="text-sm text-black">Class {routine.className} - {routine.section}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-black">{routine.day}</p>
                                            <p className="text-sm font-semibold text-blue-900">{routine.startTime} - {routine.endTime}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-black">Room:</span>
                                            <span className="font-medium">{routine.room || 'TBA'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-black">Students:</span>
                                            <span className="font-medium">{routine.numberOfStudents || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-black">Duration:</span>
                                            <span className="font-medium">{routine.duration || '1 hour'}</span>
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                            routine.status === 'active'
                                                ? 'bg-blue-900 text-white'
                                                : 'bg-gray-600 text-white'
                                        }`}>
                                            {routine.status === 'active' ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M9 11h6" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-black mb-2">No Classes Assigned</h3>
                            <p className="text-black">You don't have any classes scheduled at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}