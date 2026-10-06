'use client';
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../../config/api';

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3.5 py-2.5 border-b border-gray-100 last:border-0">
            <div className="w-8 h-8 rounded-lg bg-[#F4F5F8] text-[#0B0F28] flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{label}</p>
                <p className="text-xs sm:text-sm font-bold text-[#0B0F28] truncate">{value || 'Not provided'}</p>
            </div>
        </div>
    );
}

export default function TeacherProfile() {
    const [teacher, setTeacher] = useState(null);
    const [classRoutines, setClassRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imgError, setImgError] = useState(false);

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
            if (user.role !== 'teacher') {
                setLoading(false);
                return;
            }
            const response = await fetch(`${API_URL}/api/teachers/email/${user.email}`);
            const teacherData = await response.json();
            if (teacherData.success && teacherData.data) {
                setTeacher(teacherData.data);
                await fetchClassRoutines(teacherData.data);
                return;
            } else {
                setTeacher(user);
                await fetchClassRoutines(user);
            }
        } catch (error) {
            console.error('Error loading teacher profile:', error);
            try {
                const userData = localStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    if (user.role === 'teacher') {
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
            let routines = [];
            if (data && data.data && Array.isArray(data.data)) routines = data.data;
            else if (Array.isArray(data)) routines = data;
            const teacherRoutines = routines.filter(routine =>
                routine.teacherId === teacherData.teacherId ||
                routine.teacherName === teacherData.name
            );
            setClassRoutines(teacherRoutines);
        } catch (error) {
            console.error('Error fetching class routines:', error);
            setClassRoutines([]);
        }
    };

    const getDayOrder = (day) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return days.indexOf(day);
    };

    const sortedRoutines = [...classRoutines].sort((a, b) => {
        const dayDiff = getDayOrder(a.day) - getDayOrder(b.day);
        if (dayDiff !== 0) return dayDiff;
        return (a.startTime || '').localeCompare(b.startTime || '');
    });

    const totalStudents = classRoutines.reduce((sum, r) => sum + (r.numberOfStudents || 0), 0);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-[#F4F5F8] gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF5500]"></div>
                <p className="text-xs text-[#0B0F28] font-bold">Loading profile...</p>
            </div>
        );
    }

    if (!teacher) {
        return (
            <div className="flex items-center justify-center py-20 bg-[#F4F5F8]">
                <div className="bg-white rounded-2xl p-8 max-w-sm text-center border border-gray-200/80 shadow-sm">
                    <div className="w-14 h-14 bg-[#EF4444]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-extrabold text-[#0B0F28] mb-1">Profile Not Found</h2>
                    <p className="text-gray-500 text-xs mb-4">Please log in to view your profile.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-5 py-2 bg-[#FF5500] text-white rounded-xl font-bold text-xs hover:bg-[#e04b00] transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in font-sans space-y-4 sm:space-y-5">
            {/* Hero Card */}
            <div className="bg-[#0B0F28] text-white rounded-2xl p-5 sm:p-6 shadow-md border border-[#0B0F28]">
                <div className="flex flex-col md:flex-row items-center md:items-center gap-5">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white/10 flex items-center justify-center border-2 border-[#FF5500]/50 overflow-hidden shadow-sm">
                            {teacher.imageUrl && !imgError ? (
                                <img
                                    src={teacher.imageUrl}
                                    alt={teacher.name}
                                    onError={() => setImgError(true)}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-3xl md:text-4xl font-extrabold text-white">
                                    {teacher.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#0B0F28] ${teacher.status === 'active' ? 'bg-[#10B981]' : 'bg-gray-400'}`}></div>
                    </div>

                    {/* Meta */}
                    <div className="text-center md:text-left flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1.5">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                                {teacher.name}
                            </h1>
                            <span className="self-center inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF5500] text-white">
                                Active Teacher
                            </span>
                        </div>
                        <p className="text-gray-300 text-xs sm:text-sm font-medium mb-3">
                            {teacher.subject || 'Faculty Member'} • ID: {teacher.teacherId || 'N/A'}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 text-xs">
                            <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10 font-semibold text-gray-200">
                                📧 {teacher.email || 'N/A'}
                            </span>
                            <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10 font-semibold text-gray-200">
                                📞 {teacher.phone || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                {/* Left Column - Details */}
                <div className="lg:col-span-1 space-y-4 sm:space-y-5">
                    {/* Personal Info */}
                    <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-sm">
                        <h2 className="text-base font-extrabold text-[#0B0F28] mb-3 pb-2 border-b border-gray-100">
                            Personal Details
                        </h2>
                        <div className="space-y-1">
                            <InfoRow
                                label="Full Name"
                                value={teacher.name}
                                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                            />
                            <InfoRow
                                label="Email Address"
                                value={teacher.email}
                                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                            />
                            <InfoRow
                                label="Phone Number"
                                value={teacher.phone}
                                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                            />
                            <InfoRow
                                label="Qualification"
                                value={teacher.qualification}
                                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>}
                            />
                            <InfoRow
                                label="Date of Joining"
                                value={teacher.dateOfJoining ? new Date(teacher.dateOfJoining).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null}
                                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                            />
                            <InfoRow
                                label="Address"
                                value={teacher.address}
                                icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>}
                            />
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-sm space-y-3">
                        <h2 className="text-base font-extrabold text-[#0B0F28] pb-2 border-b border-gray-100">
                            Professional Overview
                        </h2>
                        <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3.5 text-center">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Subject Specialization</p>
                            <p className="text-xl font-extrabold text-[#FF5500]">{teacher.subject}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200/80">
                                <p className="text-2xl font-extrabold text-[#0B0F28]">{classRoutines.length}</p>
                                <p className="text-[11px] text-gray-500 font-bold mt-0.5">Classes Assigned</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200/80">
                                <p className="text-2xl font-extrabold text-[#FF5500]">{totalStudents}</p>
                                <p className="text-[11px] text-gray-500 font-bold mt-0.5">Total Students</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Schedule */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                    <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                            <h2 className="text-base sm:text-lg font-extrabold text-[#0B0F28]">Class Schedule</h2>
                            <span className="px-2.5 py-0.5 bg-[#FF5500]/10 text-[#FF5500] text-xs font-bold rounded-full">
                                {classRoutines.length} {classRoutines.length === 1 ? 'class' : 'classes'}
                            </span>
                        </div>

                        {sortedRoutines.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                {sortedRoutines.map((routine, index) => (
                                    <div key={index} className="bg-gray-50 hover:bg-white rounded-xl border border-gray-200/80 hover:border-[#FF5500] p-4 transition-all duration-200 shadow-sm">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 bg-[#0B0F28] text-white rounded-lg flex items-center justify-center shrink-0 font-bold text-xs">
                                                    📚
                                                </div>
                                                <div>
                                                    <h3 className="font-extrabold text-[#0B0F28] text-xs sm:text-sm">{routine.subject}</h3>
                                                    <p className="text-[11px] text-gray-500 font-medium">Class {routine.className} — Sec {routine.section}</p>
                                                </div>
                                            </div>
                                            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gray-200/80 text-gray-700">
                                                {routine.day?.slice(0, 3)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 mb-3 border border-gray-200/80">
                                            <svg className="w-4 h-4 text-[#FF5500] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-xs font-bold text-[#0B0F28]">{routine.startTime} – {routine.endTime}</span>
                                            {routine.duration && <span className="text-[10px] text-gray-400 ml-auto">{routine.duration}</span>}
                                        </div>

                                        <div className="flex justify-between text-xs pt-1 border-t border-gray-200/50 text-gray-600 font-medium">
                                            <span>Room: <strong className="text-[#0B0F28]">{routine.room || 'TBA'}</strong></span>
                                            <span>Students: <strong className="text-[#FF5500]">{routine.numberOfStudents || 0}</strong></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="w-12 h-12 bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xs font-bold text-[#0B0F28] mb-0.5">No Classes Assigned</h3>
                                <p className="text-[11px] text-gray-500">You don&apos;t have any scheduled classes at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}