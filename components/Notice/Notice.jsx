'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL } from '../../config/api';

const Notice = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [showAll, setShowAll] = useState(false);
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch notices from API
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/api/notices`);
                const data = await response.json();

                if (data.success) {
                    setNotices(data.data);
                } else {
                    throw new Error('Failed to fetch notices');
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching notices:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, []);

    const filteredNotices = activeTab === 'all'
        ? notices
        : notices.filter(notice => notice.type === activeTab);

    const displayedNotices = showAll ? filteredNotices : filteredNotices.slice(0, 4);

    const getNoticeIcon = (type) => {
        switch(type) {
            case 'exam':
                return '📝';
            case 'holiday':
                return '🏖️';
            case 'general':
                return '📢';
            case 'event':
                return '🎉';
            case 'academic':
                return '🎓';
            case 'urgent':
                return '🚨';
            default:
                return '📌';
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const openModal = (notice) => {
        setSelectedNotice(notice);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedNotice(null);
    };

    // Simple loading skeleton
    if (loading) {
        return (
            <section className="py-8 lg:py-12 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-2">
                            Notice Board
                        </h2>
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-80 mx-auto"></div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-8 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                        ))}
                    </div>

                    <div className="space-y-4 container mx-auto">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-8 lg:py-12 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Notices</h2>
                    <p className="text-gray-700">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="py-8 lg:py-12 bg-white">
                <div className="container mx-auto px-1 ">
                    {/* Section Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-2">
                            Notice Board
                        </h2>
                        <p className="text-gray-700 text-base max-w-2xl mx-auto">
                            Stay informed about important announcements and upcoming events
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {[
                            { id: 'all', label: 'All', icon: '📋' },
                            { id: 'exam', label: 'Exams', icon: '📝' },
                            { id: 'holiday', label: 'Holidays', icon: '🏖️' },
                            { id: 'general', label: 'General', icon: '📢' },
                            { id: 'event', label: 'Events', icon: '🎉' },
                            { id: 'academic', label: 'Academic', icon: '🎓' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setShowAll(false);
                                }}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-blue-900 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <span className="mr-1">{tab.icon}</span>
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Notices List */}
                    <div className="container mx-auto space-y-4">
                        {displayedNotices.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-4xl mb-4">📭</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Notices Found</h3>
                                <p className="text-gray-700">
                                    {activeTab === 'all'
                                        ? 'There are no notices published yet.'
                                        : `No ${activeTab} notices available at the moment.`
                                    }
                                </p>
                            </div>
                        ) : (
                            displayedNotices.map((notice, index) => (
                                <div
                                    key={notice._id || notice.id}
                                    className="bg-white border border-gray-200 hover:border-blue-900 hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden"
                                >
                                    <div className="p-4 sm:p-6">
                                        <div className="flex gap-4">
                                            {/* Icon */}
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-900 text-white rounded-lg flex items-center justify-center text-lg sm:text-xl">
                                                    {getNoticeIcon(notice.type)}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-medium text-blue-900 uppercase tracking-wide">
                                                                {notice.type}
                                                            </span>
                                                            {notice.important && (
                                                                <span className="text-xs font-bold text-red-600 uppercase">
                                                                    Important
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 hover:text-blue-900 transition-colors duration-200">
                                                            {notice.title}
                                                        </h3>
                                                    </div>
                                                </div>

                                                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3 line-clamp-2">
                                                    {notice.content}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <div className="text-xs sm:text-sm text-gray-600">
                                                        {formatDate(notice.createdAt || notice.date)}
                                                    </div>
                                                    <button
                                                        onClick={() => openModal(notice)}
                                                        className="text-blue-900 font-medium text-sm hover:text-blue-800 transition-colors duration-200"
                                                    >
                                                        Read More →
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* View All Button */}
                    {filteredNotices.length > 4 && (
                        <div className="text-center mt-8">
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg transition-all duration-200"
                            >
                                {showAll ? 'Show Less' : `View All Notices (${filteredNotices.length})`}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Notice Detail Modal */}
            {showModal && selectedNotice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center text-lg">
                                    {getNoticeIcon(selectedNotice.type)}
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-blue-900 uppercase">
                                        {selectedNotice.type}
                                    </span>
                                    {selectedNotice.important && (
                                        <span className="ml-2 text-sm font-bold text-red-600 uppercase">
                                            Important
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4 sm:p-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                                {selectedNotice.title}
                            </h2>

                            <div className="text-sm text-gray-600 mb-4">
                                Published on {formatDate(selectedNotice.createdAt || selectedNotice.date)}
                            </div>

                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {selectedNotice.content}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Notice;