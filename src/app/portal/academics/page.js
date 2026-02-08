'use client';
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../../config/api';

export default function PortalAcademics() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Get current student from localStorage
        const userData = localStorage.getItem('user');

        if (userData) {
            const user = JSON.parse(userData);
            setCurrentStudent(user);

            if (user._id) {
                fetchStudentResults(user._id);
            } else {
                setError('User ID not found. Please contact administrator.');
                setLoading(false);
            }
        } else {
            setError('User not logged in. Please login first.');
            setLoading(false);
        }
    }, []);

    const fetchStudentResults = async (studentId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/api/results/student/${studentId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setResults(data.data);
            } else {
                setError(data.message || 'Failed to fetch results');
                setResults([]);
            }
        } catch (error) {
            setError(error.message || 'Failed to connect to server');
            setResults([]);
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

    const getGradeColor = (grade) => {
        switch (grade) {
            case 'A+': return 'text-green-600 bg-green-50 border-green-200';
            case 'A': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'A-': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'B': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'C': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'D': return 'text-red-600 bg-red-50 border-red-200';
            case 'F': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        return status === 'Pass' ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto">
                {/* Header */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-blue-900 mb-2">
                        📚 Academic Results
                    </h1>
                    <p className="text-gray-600">
                        View your examination results and academic performance
                    </p>
                </div>
                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                        <div className="text-red-600 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <p className="text-red-600 font-semibold mb-2 text-center">Failed to load results</p>
                        <p className="text-gray-600 text-center mb-4">{error}</p>
                        <div className="text-center">
                            <button
                                onClick={() => currentStudent && fetchStudentResults(currentStudent._id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* No Results State */}
                {!error && results.length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                        <div className="text-6xl mb-4">📄</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
                        <p className="text-gray-600 mb-4">
                            Your examination results will appear here once they are published by the school administration.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto">
                            <h4 className="font-semibold text-blue-900 mb-2">💡 Note for Testing:</h4>
                            <p className="text-sm text-blue-800">
                                If you're testing this feature, results need to be created and published by an administrator through the admin panel.
                            </p>
                        </div>
                    </div>
                )}

                {/* Results Display */}
                {!error && results.length > 0 && (
                    <div className="space-y-8">
                        {results.map((result) => (
                            <div key={result._id} className="bg-white border border-gray-200 rounded-lg p-6">
                                {/* Exam Header */}
                                <div className="border-b border-gray-200 pb-4 mb-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                                {result.examName} - {result.examType}
                                            </h2>
                                            <p className="text-blue-900 font-medium">
                                                {result.academicYear} | Class {result.class} - {result.section}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 mt-4 lg:mt-0">
                                            <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(result.status)}`}>
                                                {result.status}
                                            </span>
                                            {result.meritPosition && (
                                                <span className="px-4 py-2 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-full text-sm font-bold">
                                                    Position: {result.meritPosition}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Overall Performance Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 font-medium">Total Subjects</p>
                                        <p className="text-2xl font-bold text-gray-900">{result.subjects.length}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 font-medium">Total Marks</p>
                                        <p className="text-2xl font-bold text-gray-900">{result.totalObtained}/{result.totalMarks}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 font-medium">Percentage</p>
                                        <p className="text-2xl font-bold text-blue-600">{result.percentage}%</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 font-medium">Grade</p>
                                        <p className="text-2xl font-bold text-purple-600">{result.grade}</p>
                                    </div>
                                </div>

                                {/* Subject-wise Results */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject-wise Results</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Subject</th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Marks</th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Grade</th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Progress</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {result.subjects.map((subject, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{subject.subjectName}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                                                            {subject.marks}/{subject.totalMarks}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(subject.grade)}`}>
                                                                {subject.grade}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-blue-600 h-2 rounded-full"
                                                                    style={{ width: `${(subject.marks / subject.totalMarks) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className="border-t pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-900">Published:</span>
                                            <p className="text-gray-600">{result.publishStatus}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-900">Date:</span>
                                            <p className="text-gray-600">{formatDate(result.createdAt)}</p>
                                        </div>
                                    </div>
                                    {result.remarks && (
                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-blue-900">
                                                <strong>Remarks:</strong> {result.remarks}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
