'use client';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { API_URL } from '../../../../../config/api';

const NoticesPage = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'general',
        date: '',
        important: false
    });
    const [editingNotice, setEditingNotice] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Notice types with enhanced styling
    const noticeTypes = [
        { value: 'general', label: 'General Notice', icon: '📢', color: 'bg-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700' },
        { value: 'exam', label: 'Exam Notice', icon: '📝', color: 'bg-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-700' },
        { value: 'holiday', label: 'Holiday Notice', icon: '🏖️', color: 'bg-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-700' },
        { value: 'event', label: 'Event Notice', icon: '🎉', color: 'bg-purple-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-700' },
        { value: 'academic', label: 'Academic Notice', icon: '🎓', color: 'bg-indigo-500', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200', textColor: 'text-indigo-700' },
        { value: 'urgent', label: 'Urgent Notice', icon: '🚨', color: 'bg-red-500', bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-700' }
    ];

    // Fetch notices
    const fetchNotices = async () => {
        try {
            const response = await fetch(`${API_URL}/api/notices`);
            const data = await response.json();
            if (data.success) {
                setNotices(data.data);
            }
        } catch (error) {
            console.error('Error fetching notices:', error);
            Swal.fire({
                icon: 'error',
                title: 'Connection Error',
                text: 'Failed to load notices. Please check your connection.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    // Handle form submission (Create/Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const url = editingNotice
                ? `${API_URL}/api/notices/${editingNotice._id}`
                : `${API_URL}/api/notices`;

            const method = editingNotice ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    createdBy: 'Admin',
                    status: 'active'
                }),
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: editingNotice ? 'Notice Updated!' : 'Notice Created!',
                    text: `The notice has been ${editingNotice ? 'updated' : 'published'} successfully.`,
                    timer: 2000,
                    showConfirmButton: false
                });

                // Reset form
                resetForm();
                fetchNotices();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || `Failed to ${editingNotice ? 'update' : 'create'} notice`,
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            type: 'general',
            date: '',
            important: false
        });
        setEditingNotice(null);
        setShowForm(false);
        setShowModal(false);
    };

    // Open create modal
    const openCreateModal = () => {
        setEditingNotice(null);
        setFormData({
            title: '',
            content: '',
            type: 'general',
            date: '',
            important: false
        });
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setEditingNotice(null);
    };

    // Start editing notice
    const startEdit = (notice) => {
        setFormData({
            title: notice.title,
            content: notice.content,
            type: notice.type,
            date: notice.date ? new Date(notice.date).toISOString().split('T')[0] : '',
            important: notice.important || false
        });
        setEditingNotice(notice);
        setShowModal(true);
    };

    // Delete notice with enhanced confirmation
    const handleDelete = async (notice) => {
        const result = await Swal.fire({
            title: 'Delete Notice?',
            html: `
                <div class="text-left">
                    <p class="text-gray-600 mb-4">Are you sure you want to delete this notice?</p>
                    <div class="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
                        <h3 class="font-bold text-gray-800 mb-2">${notice.title}</h3>
                        <p class="text-sm text-gray-600">${notice.content.substring(0, 100)}${notice.content.length > 100 ? '...' : ''}</p>
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-lg px-6 py-2',
                cancelButton: 'rounded-lg px-6 py-2'
            }
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_URL}/api/notices/${notice._id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Notice has been deleted successfully.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    fetchNotices();
                } else {
                    throw new Error('Failed to delete notice');
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete notice. Please try again.'
                });
            }
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Filter notices based on search and type
    const filteredNotices = notices.filter(notice => {
        const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            notice.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || notice.type === filterType;
        return matchesSearch && matchesType;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="h-10 bg-gray-300 rounded-lg w-80"></div>
                            <div className="h-12 bg-gray-300 rounded-xl w-32"></div>
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            <div className="xl:col-span-1">
                                <div className="h-96 bg-gray-300 rounded-2xl"></div>
                            </div>
                            <div className="xl:col-span-2">
                                <div className="h-96 bg-gray-300 rounded-2xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto p-6">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                                📢 Notice Management
                            </h1>
                            <p className="text-gray-600 text-lg">Create, manage, and organize school notices professionally</p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Notice
                        </button>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search notices..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white shadow-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white shadow-sm min-w-[140px]"
                        >
                            <option value="all">All Types</option>
                            {noticeTypes.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Notices List */}
                    <div className="w-full">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white flex items-center">
                                            <span className="mr-3">📋</span>
                                            Notices ({filteredNotices.length})
                                        </h2>
                                        <p className="text-gray-300 mt-1">
                                            {filterType === 'all' ? 'All published notices' : `${noticeTypes.find(t => t.value === filterType)?.label} notices`}
                                        </p>
                                    </div>
                                    {notices.length > 0 && (
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-white">{notices.length}</div>
                                            <div className="text-sm text-gray-300">Total Notices</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                {filteredNotices.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="text-6xl mb-4">
                                            {searchTerm || filterType !== 'all' ? '🔍' : '📭'}
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                            {searchTerm || filterType !== 'all' ? 'No Results Found' : 'No Notices Yet'}
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            {searchTerm || filterType !== 'all'
                                                ? 'Try adjusting your search or filter criteria'
                                                : 'Create your first notice to get started'
                                            }
                                        </p>
                                        {(!searchTerm && filterType === 'all') && (
                                            <button
                                                onClick={openCreateModal}
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Create First Notice
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredNotices.map((notice) => {
                                            const typeInfo = noticeTypes.find(t => t.value === notice.type) || noticeTypes[0];
                                            return (
                                                <div
                                                    key={notice._id}
                                                    className={`group relative p-6 rounded-2xl border-l-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                                                        notice.important
                                                            ? 'border-red-500 bg-gradient-to-r from-red-50 to-pink-50'
                                                            : `${typeInfo.borderColor} ${typeInfo.bgColor}`
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        {/* Notice Icon */}
                                                        <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${typeInfo.color} flex items-center justify-center text-2xl shadow-lg`}>
                                                            {typeInfo.icon}
                                                        </div>

                                                        {/* Notice Content */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                                            {notice.title}
                                                                        </h3>
                                                                        {notice.important && (
                                                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full animate-pulse">
                                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                                </svg>
                                                                                IMPORTANT
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${typeInfo.color} text-white`}>
                                                                            {typeInfo.icon} {typeInfo.label}
                                                                        </span>
                                                                        <span className="flex items-center gap-1">
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                            {formatDate(notice.date)}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Action Buttons */}
                                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                    <button
                                                                        onClick={() => startEdit(notice)}
                                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                                        title="Edit notice"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                        </svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(notice)}
                                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                                        title="Delete notice"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <p className="text-gray-700 leading-relaxed line-clamp-3">
                                                                {notice.content}
                                                            </p>

                                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                                                <div className="text-xs text-gray-500">
                                                                    ID: {notice._id} • Created: {formatDate(notice.createdAt || notice.date)}
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => startEdit(notice)}
                                                                        className="inline-flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                        </svg>
                                                                        Edit
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notice Form Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center">
                                        <span className="mr-3">{editingNotice ? '✏️' : '✍️'}</span>
                                        {editingNotice ? 'Edit Notice' : 'Create New Notice'}
                                    </h2>
                                    <p className="text-blue-100 mt-1">
                                        {editingNotice ? 'Update notice details' : 'Publish a new announcement'}
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Notice Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-4">
                                    Notice Type
                                </label>
                                <div className="grid grid-cols-1 gap-3">
                                    {noticeTypes.map((type) => (
                                        <label
                                            key={type.value}
                                            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                                                formData.type === type.value
                                                    ? `${type.borderColor} ${type.bgColor} shadow-lg ring-2 ring-opacity-50 ring-blue-300`
                                                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="type"
                                                value={type.value}
                                                checked={formData.type === type.value}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <div className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center text-white text-xl mr-4 shadow-md`}>
                                                {type.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-800">{type.label}</div>
                                                <div className="text-sm text-gray-600">Click to select this type</div>
                                            </div>
                                            {formData.type === type.value && (
                                                <div className="ml-4">
                                                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Notice Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                    placeholder="Enter a clear, concise title..."
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Notice Date *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Notice Content *
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                    rows={10}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-gray-50 focus:bg-white"
                                    placeholder="Write detailed notice content here..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.content.length} characters
                                </p>
                            </div>

                            {/* Important Checkbox */}
                            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-xl">
                                <input
                                    type="checkbox"
                                    name="important"
                                    id="important"
                                    checked={formData.important}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                                />
                                <label htmlFor="important" className="ml-3 flex-1">
                                    <span className="text-sm font-semibold text-red-700">Mark as Important Notice</span>
                                    <p className="text-xs text-red-600 mt-1">This will highlight the notice and draw extra attention</p>
                                </label>
                                <div className="text-red-500">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                                >
                                    {submitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            {editingNotice ? 'Updating...' : 'Publishing...'}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <span className="mr-2">{editingNotice ? '✏️' : '📢'}</span>
                                            {editingNotice ? 'Update Notice' : 'Publish Notice'}
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoticesPage;