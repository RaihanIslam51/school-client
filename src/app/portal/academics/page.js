'use client';
import React from 'react';

export default function PortalAcademics() {
    const subjects = [
        { name: 'Mathematics', teacher: 'Mr. Ahmed', grade: 'A', percentage: 92 },
        { name: 'Physics', teacher: 'Ms. Rahman', grade: 'A-', percentage: 88 },
        { name: 'Chemistry', teacher: 'Dr. Khan', grade: 'B+', percentage: 85 },
        { name: 'Biology', teacher: 'Ms. Begum', grade: 'A', percentage: 90 },
        { name: 'English', teacher: 'Mr. Islam', grade: 'A+', percentage: 95 },
        { name: 'Bengali', teacher: 'Ms. Akter', grade: 'A', percentage: 91 },
        { name: 'ICT', teacher: 'Mr. Hasan', grade: 'A+', percentage: 96 },
        { name: 'Social Science', teacher: 'Ms. Sultana', grade: 'B+', percentage: 84 },
    ];

    const getGradeColor = (grade) => {
        if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
        if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
        return 'text-gray-600 bg-gray-50';
    };

    return (
        <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Academic Records</h1>
                <p className="text-blue-100">View your grades and academic performance</p>
            </div>

            {/* Overall Performance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">📊</span>
                        <span className="text-3xl font-bold text-blue-600">89.6%</span>
                    </div>
                    <h3 className="text-gray-800 font-semibold">Overall Average</h3>
                    <p className="text-gray-500 text-sm">Current semester</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">🏆</span>
                        <span className="text-3xl font-bold text-green-600">A</span>
                    </div>
                    <h3 className="text-gray-800 font-semibold">Overall Grade</h3>
                    <p className="text-gray-500 text-sm">Excellent performance</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">📈</span>
                        <span className="text-3xl font-bold text-purple-600">5/8</span>
                    </div>
                    <h3 className="text-gray-800 font-semibold">A Grades</h3>
                    <p className="text-gray-500 text-sm">Out of 8 subjects</p>
                </div>
            </div>

            {/* Subject-wise Performance */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Subject-wise Performance</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Teacher</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Percentage</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Grade</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Progress</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {subjects.map((subject) => (
                                <tr key={subject.name} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{subject.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{subject.teacher}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{subject.percentage}%</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(subject.grade)}`}>
                                            {subject.grade}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                                                style={{ width: `${subject.percentage}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Assessments */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Assessments</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                            <h4 className="font-semibold text-gray-900">Mathematics - Mid Term Exam</h4>
                            <p className="text-sm text-gray-600">Score: 92/100</p>
                        </div>
                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold">A</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div>
                            <h4 className="font-semibold text-gray-900">Physics - Class Test</h4>
                            <p className="text-sm text-gray-600">Score: 45/50</p>
                        </div>
                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold">A</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div>
                            <h4 className="font-semibold text-gray-900">English - Essay Competition</h4>
                            <p className="text-sm text-gray-600">Score: 95/100</p>
                        </div>
                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold">A+</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
