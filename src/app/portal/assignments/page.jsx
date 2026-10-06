'use client';
import React, { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { API_URL } from '../../../../config/api';

export default memo(function StudentAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentStudent, setCurrentStudent] = useState(null);

    useEffect(() => {
        // Get current student from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setCurrentStudent(user);
            fetchStudentAssignments(user.class, user.section);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchStudentAssignments = async (studentClass, studentSection) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/assignments`);
            const data = await response.json();

            if (data.success) {
                // Filter assignments for current student's class and section
                const filteredAssignments = data.data.filter(assignment =>
                    assignment.className === studentClass &&
                    assignment.section === studentSection &&
                    assignment.status === 'active'
                );
                setAssignments(filteredAssignments);
            }
        } catch (error) {
            console.error('Error fetching assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysUntilDeadline = (deadline) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { text: 'Overdue', color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' };
        if (diffDays === 0) return { text: 'Due Today', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' };
        if (diffDays === 1) return { text: 'Due Tomorrow', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' };
        return { text: `${diffDays} days left`, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F4F5F8] p-4 sm:p-6 lg:p-8">
                <div className="container mx-auto">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5500] mx-auto"></div>
                        <p className="mt-4 text-gray-500 font-medium">Loading assignments...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F5F8] p-1 sm:p-2 lg:p-3 font-sans">
            <div className="container mx-auto">
                {/* Header */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 mb-4 sm:mb-5 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-xl lg:text-2xl font-extrabold text-[#0B0F28] mb-1 tracking-tight">
                            📝 My Assignments
                        </h1>
                        <p className="text-gray-500 font-medium text-xs sm:text-sm">
                            View and manage your assignments for {currentStudent?.class} - {currentStudent?.section}
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#0B0F28]/5 rounded-bl-full -mr-8 -mt-8 z-0"></div>
                </div>

                {/* Assignments List */}
                {assignments.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-bold text-[#0B0F28] mb-2 font-heading">No Assignments Yet</h3>
                        <p className="text-gray-500">
                            Your teachers have not assigned any assignments for your class yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 sm:space-y-6">
                        {assignments.map((assignment) => {
                            const deadlineInfo = getDaysUntilDeadline(assignment.deadline);
                            return (
                                <div key={assignment._id} className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-[#0B0F28] mb-1 font-heading">
                                                        {assignment.title}
                                                    </h3>
                                                    <p className="text-[#FF5500] font-semibold mb-2">
                                                        {assignment.subject}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${deadlineInfo.color} ${deadlineInfo.bg}`}>
                                                    {deadlineInfo.text}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 mb-6 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                {assignment.description}
                                            </p>

                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm bg-gray-50/70 border border-gray-200/60 rounded-xl p-4">
                                                <div>
                                                    <span className="text-xs text-gray-500 font-medium block mb-0.5">Teacher</span>
                                                    <p className="font-semibold text-[#0B0F28]">{assignment.teacherName}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-500 font-medium block mb-0.5">Class</span>
                                                    <p className="font-semibold text-[#0B0F28]">{assignment.className} - {assignment.section}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-500 font-medium block mb-0.5">Deadline</span>
                                                    <p className="font-semibold text-[#0B0F28]">{formatDate(assignment.deadline)}</p>
                                                </div>
                                                {assignment.totalMarks && (
                                                    <div>
                                                        <span className="text-xs text-gray-500 font-medium block mb-0.5">Total Marks</span>
                                                        <p className="font-semibold text-[#0B0F28]">{assignment.totalMarks}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {assignment.imageUrl && (
                                            <div className="mt-6 lg:mt-0 lg:ml-6 flex-shrink-0">
                                                <img
                                                    src={assignment.imageUrl}
                                                    alt="Assignment"
                                                    width={192}
                                                    height={128}
                                                    className="w-full lg:w-48 h-32 lg:h-full object-cover rounded-xl border border-gray-100 shadow-sm"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Summary Card */}
                {assignments.length > 0 && (
                    <div className="mt-6 sm:mt-8 bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-[#0B0F28] mb-4 font-heading">Assignment Summary</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200/70">
                                <div className="text-3xl font-bold text-[#0B0F28] mb-1 font-heading">{assignments.length}</div>
                                <div className="text-sm font-medium text-gray-500">Total Assignments</div>
                            </div>
                            <div className="text-center p-4 bg-[#10B981]/10 rounded-xl border border-[#10B981]/20">
                                <div className="text-3xl font-bold text-[#10B981] mb-1 font-heading">
                                    {assignments.filter(a => new Date(a.deadline) > new Date()).length}
                                </div>
                                <div className="text-sm font-medium text-[#10B981]">Pending</div>
                            </div>
                            <div className="text-center p-4 bg-[#EF4444]/10 rounded-xl border border-[#EF4444]/20">
                                <div className="text-3xl font-bold text-[#EF4444] mb-1 font-heading">
                                    {assignments.filter(a => new Date(a.deadline) < new Date()).length}
                                </div>
                                <div className="text-sm font-medium text-[#EF4444]">Overdue</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});