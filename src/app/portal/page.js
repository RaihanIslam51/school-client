'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../../../config/api';

export default function PortalHome() {
    const [stats, setStats] = useState({
        subjects: null,
        attendance: null,
        assignments: null,
        notices: null,
    });
    const [recentAssignments, setRecentAssignments] = useState([]);
    const [recentNotices, setRecentNotices] = useState([]);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [assignmentsRes, noticesRes, academicsRes, attendanceRes] = await Promise.allSettled([
                    fetch(`${API_BASE_URL}/assignments`),
                    fetch(`${API_BASE_URL}/notices`),
                    fetch(`${API_BASE_URL}/academics`),
                    fetch(`${API_BASE_URL}/attendance`),
                ]);

                if (assignmentsRes.status === 'fulfilled' && assignmentsRes.value.ok) {
                    const d = await assignmentsRes.value.json();
                    const arr = d.data || d.assignments || (Array.isArray(d) ? d : []);
                    setStats(prev => ({ ...prev, assignments: arr.length }));
                    const sorted = [...arr].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                    setRecentAssignments(sorted.slice(0, 3));
                }

                if (noticesRes.status === 'fulfilled' && noticesRes.value.ok) {
                    const d = await noticesRes.value.json();
                    const arr = d.data || d.notices || (Array.isArray(d) ? d : []);
                    const sorted = [...arr].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                    setStats(prev => ({ ...prev, notices: arr.length }));
                    setRecentNotices(sorted.slice(0, 3));
                }

                if (academicsRes.status === 'fulfilled' && academicsRes.value.ok) {
                    const d = await academicsRes.value.json();
                    const arr = d.data || (Array.isArray(d) ? d : []);
                    setStats(prev => ({ ...prev, subjects: arr.length }));
                }

                if (attendanceRes.status === 'fulfilled' && attendanceRes.value.ok) {
                    const d = await attendanceRes.value.json();
                    const arr = d.data || (Array.isArray(d) ? d : []);
                    let totalStudents = 0, presentStudents = 0;
                    arr.forEach(record => {
                        const records = record.attendanceRecords || [];
                        totalStudents += records.length;
                        presentStudents += records.filter(r => r.status === 'present').length;
                    });
                    const pct = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : null;
                    setStats(prev => ({ ...prev, attendance: pct }));
                }
            } catch (e) {
                console.error('Portal dashboard fetch error:', e);
            } finally {
                setLoadingStats(false);
            }
        };
        fetchAll();
    }, []);

    const formatTimeAgo = (dateStr) => {
        if (!dateStr) return '';
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins || 1} min${mins !== 1 ? 's' : ''} ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    const quickLinks = [
        { name: 'My Profile', path: '/portal/profile', desc: 'View your details', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
        { name: 'Academic Records', path: '/portal/academics', desc: 'Syllabus & Subjects', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
        { name: 'Attendance', path: '/portal/attendance', desc: 'Check presence', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
        { name: 'Assignments', path: '/portal/assignments', desc: 'Pending tasks', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
        { name: 'Exam Schedule', path: '/portal/exams', desc: 'Upcoming tests', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
        { name: 'Results', path: '/portal/results', desc: 'Grades & scores', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> },
        { name: 'Notices', path: '/portal/notices', desc: 'Important alerts', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg> },
        { name: 'Library', path: '/portal/library', desc: 'Issued books', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
        { name: 'Fees', path: '/portal/fees', desc: 'Payment history', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    ];

    return (
        <div className="animate-fade-in font-sans space-y-4 sm:space-y-5">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {[
                    { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>, label: 'Subjects', sub: 'In academics', value: stats.subjects, bg: 'bg-[#0B0F28]', text: 'text-[#0B0F28]', lightBg: 'bg-[#0B0F28]/10' },
                    { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, label: 'Attendance', sub: 'Overall presence', value: stats.attendance !== null ? `${stats.attendance}%` : null, bg: stats.attendance >= 75 ? 'bg-[#10B981]' : stats.attendance !== null ? 'bg-[#EF4444]' : 'bg-gray-400', text: stats.attendance >= 75 ? 'text-[#10B981]' : stats.attendance !== null ? 'text-[#EF4444]' : 'text-gray-600', lightBg: stats.attendance >= 75 ? 'bg-[#10B981]/10' : stats.attendance !== null ? 'bg-[#EF4444]/10' : 'bg-gray-100' },
                    { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>, label: 'Assignments', sub: 'Total posted', value: stats.assignments, bg: 'bg-[#FF5500]', text: 'text-[#FF5500]', lightBg: 'bg-[#FF5500]/10' },
                    { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>, label: 'Notices', sub: 'Total alerts', value: stats.notices, bg: 'bg-[#0B0F28]', text: 'text-[#0B0F28]', lightBg: 'bg-[#0B0F28]/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/80">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-500 text-[11px] font-semibold bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">Overview</span>
                            <div className={`w-9 h-9 ${stat.lightBg} rounded-xl flex items-center justify-center text-lg`}>
                                {stat.icon}
                            </div>
                        </div>
                        <div>
                            <h3 className={`text-2xl sm:text-3xl font-extrabold mb-0.5 ${stat.text}`}>
                                {loadingStats ? (
                                    <span className="inline-block w-10 h-7 bg-gray-100 rounded animate-pulse"></span>
                                ) : (
                                    stat.value ?? '—'
                                )}
                            </h3>
                            <p className="text-[#0B0F28] text-xs font-bold">{stat.label}</p>
                            <p className="text-gray-500 text-[11px] mt-0.5">{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                {/* Left Column (Quick Access & Activity) */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                    {/* Quick Access */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                            <h2 className="text-base sm:text-lg font-extrabold text-[#0B0F28] tracking-tight">Quick Access</h2>
                            <div className="h-1 flex-1 bg-gradient-to-r from-[#FF5500]/20 to-transparent sm:ml-4 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    className="group flex items-center gap-3 p-3 bg-gray-50 border border-gray-200/70 rounded-xl hover:bg-white hover:border-[#FF5500] transition-all duration-300 text-left shadow-sm hover:shadow-md"
                                >
                                    <div className="bg-white group-hover:bg-[#FF5500] text-[#0B0F28] group-hover:text-white rounded-lg p-2 transition-colors duration-300 flex-shrink-0 text-lg border border-gray-200 group-hover:border-[#FF5500]">
                                        {link.icon}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-[#0B0F28] group-hover:text-[#FF5500] text-xs sm:text-sm transition-colors">
                                            {link.name}
                                        </h3>
                                        <p className="text-[11px] text-gray-500 truncate">
                                            {link.desc}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent Assignments */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                            <h2 className="text-base sm:text-lg font-extrabold text-[#0B0F28] tracking-tight">Recent Assignments</h2>
                            <Link href="/portal/assignments" className="text-xs text-[#FF5500] hover:underline font-bold transition-colors">
                                View All →
                            </Link>
                        </div>
                        <div className="space-y-2.5">
                            {loadingStats ? (
                                [1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 animate-pulse">
                                        <div className="w-9 h-9 bg-gray-200 rounded-lg flex-shrink-0"></div>
                                        <div className="flex-1"><div className="h-4 bg-gray-200 rounded w-2/3 mb-1.5"></div><div className="h-3 bg-gray-100 rounded w-1/3"></div></div>
                                    </div>
                                ))
                            ) : recentAssignments.length > 0 ? recentAssignments.map((a, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-white rounded-xl transition-all duration-200 border border-gray-200/70 hover:border-[#FF5500] shadow-sm">
                                    <div className="w-9 h-9 bg-[#FF5500]/10 rounded-lg flex items-center justify-center flex-shrink-0 text-[#FF5500]">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-[#0B0F28] text-xs sm:text-sm truncate">{a.title || 'Assignment'}</h3>
                                        <p className="text-[11px] text-gray-500 truncate mt-0.5 font-medium">
                                            {[a.class, a.section].filter(Boolean).join(' - ')}
                                            {a.createdAt ? ` • ${formatTimeAgo(a.createdAt)}` : ''}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${a.status === 'active' ? 'bg-[#10B981]/10 text-[#10B981]' :
                                                a.status === 'closed' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                                                    'bg-[#FF5500]/10 text-[#FF5500]'
                                            }`}>
                                            {a.status || 'open'}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="w-12 h-12 mx-auto bg-gray-200/60 rounded-full flex items-center justify-center text-gray-400 mb-2">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                    </div>
                                    <p className="font-bold text-[#0B0F28] text-xs sm:text-sm">No assignments yet</p>
                                    <p className="text-[11px] text-gray-500 mt-0.5">Check back later for tasks</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column (Notices) */}
                <div className="space-y-4 sm:space-y-5">
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base sm:text-lg font-extrabold text-[#0B0F28] tracking-tight">Recent Notices</h3>
                            <Link href="/portal/notices" className="text-xs text-[#FF5500] hover:underline font-bold transition-colors">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {loadingStats ? (
                                [1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0 animate-pulse">
                                        <div className="w-1.5 rounded-full bg-gray-200"></div>
                                        <div className="flex-1"><div className="h-3.5 bg-gray-200 rounded w-full mb-1.5"></div><div className="h-2.5 bg-gray-100 rounded w-1/2"></div></div>
                                    </div>
                                ))
                            ) : recentNotices.length > 0 ? recentNotices.map((n, i) => (
                                <div key={i} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0 group">
                                    <div className={`w-1.5 rounded-full ${n.isImportant ? 'bg-[#EF4444]' : 'bg-[#0B0F28]/30 group-hover:bg-[#FF5500]'} transition-colors`}></div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-[#0B0F28] text-xs sm:text-sm leading-snug group-hover:text-[#FF5500] transition-colors">{n.title || 'Notice'}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[11px] text-gray-500 font-medium">
                                                {n.category ? `${n.category} • ` : ''}{n.createdAt ? formatTimeAgo(n.createdAt) : ''}
                                            </p>
                                            {n.isImportant && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-[#EF4444]/10 text-[#EF4444]">Important</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-5 text-gray-400 text-xs font-medium">No new notices</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

