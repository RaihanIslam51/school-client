'use client';
import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../../config/api';
import ImgBBUpload from '../../../../components/ImgBBUpload';
import Swal from 'sweetalert2';

export default function PortalProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [editMode, setEditMode] = useState({
        address: false,
        parentPhone: false,
        image: false
    });
    const [formData, setFormData] = useState({
        address: '',
        parentPhone: '',
        imageUrl: ''
    });

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = () => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setFormData({
                address: parsedUser.address || '',
                parentPhone: parsedUser.parentPhone || '',
                imageUrl: parsedUser.imageUrl || ''
            });
        }
        setLoading(false);
    };

    const handleImageUpload = async (imageUrl) => {
        setFormData(prev => ({ ...prev, imageUrl }));
        await updateProfile({ imageUrl });
        setEditMode(prev => ({ ...prev, image: false }));
    };

    const handleFieldUpdate = async (field, value) => {
        try {
            setUpdating(true);
            await updateProfile({ [field]: value });
            setEditMode(prev => ({ ...prev, [field]: false }));

            // Update local user data
            const updatedUser = { ...user, [field]: value };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`,
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update profile. Please try again.'
            });
        } finally {
            setUpdating(false);
        }
    };

    const updateProfile = async (updateData) => {
        const response = await fetch(`${API_URL}/api/auth/user/${user._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        return response.json();
    };

    const handleCancel = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: user[field] || ''
        }));
        setEditMode(prev => ({ ...prev, [field]: false }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="text-center">
                    <div className="text-6xl mb-4">👤</div>
                    <h2 className="text-xl font-bold text-blue-900 mb-2">Profile Not Found</h2>
                    <p className="text-gray-600">Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6">
            <div className="container mx-auto">
                {/* Header Section */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                        {/* Profile Image */}
                        <div className="relative group">
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                                {user.imageUrl ? (
                                    <img
                                        src={user.imageUrl}
                                        alt={user.name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-6xl md:text-7xl text-blue-900 font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            {/* Edit Image Button */}
                            <button
                                onClick={() => setEditMode(prev => ({ ...prev, image: !prev.image }))}
                                className="absolute -bottom-2 -right-2 bg-blue-900 text-white p-3 rounded-full shadow-sm hover:bg-blue-800 transition-all duration-300 border-2 border-white"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">{user.name}</h1>
                            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0 text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="font-semibold">Student ID: {user.studentId}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V7l-7-5z" clipRule="evenodd" />
                                    </svg>
                                    <span>Class {user.class} - Section {user.section}</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                                    user.status === 'active'
                                        ? 'bg-white border border-gray-200 text-gray-900'
                                        : 'bg-white border border-gray-200 text-gray-900'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full mr-2 ${
                                        user.status === 'active' ? 'bg-blue-900' : 'bg-gray-400'
                                    }`}></div>
                                    {user.status === 'active' ? 'Active Student' : 'Inactive Student'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Image Upload Modal */}
                {editMode.image && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md">
                        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md w-full shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-blue-900">Update Profile Picture</h3>
                                <button
                                    onClick={() => setEditMode(prev => ({ ...prev, image: false }))}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <ImgBBUpload
                                onUploadSuccess={(url) => handleImageUpload(url)}
                                onUploadError={(error) => Swal.fire('Error', error, 'error')}
                            />
                        </div>
                    </div>
                )}

                {/* Profile Information Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Personal Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-blue-900 flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                Personal Information
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                                    <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                                </div>
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-lg font-semibold text-gray-900">{user.email || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'Not provided'}
                                    </p>
                                </div>
                            </div>

                            {/* Editable Address */}
                            <div className="py-3 border-b border-gray-100">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                                        {editMode.address ? (
                                            <div className="space-y-3">
                                                <textarea
                                                    value={formData.address}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    rows="3"
                                                    placeholder="Enter your address"
                                                />
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={() => handleFieldUpdate('address', formData.address)}
                                                        disabled={updating}
                                                        className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200 disabled:opacity-50"
                                                    >
                                                        {updating ? 'Saving...' : 'Save'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel('address')}
                                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-start">
                                                <p className="text-lg font-semibold text-gray-900 flex-1">
                                                    {user.address || 'Not provided'}
                                                </p>
                                                <button
                                                    onClick={() => setEditMode(prev => ({ ...prev, address: true }))}
                                                    className="ml-3 p-2 text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic & Contact Information */}
                    <div className="space-y-8">
                        {/* Academic Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-blue-900 flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    Academic Information
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Student ID</p>
                                    <p className="text-2xl font-bold text-gray-900">{user.studentId}</p>
                                </div>
                                <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Roll Number</p>
                                    <p className="text-2xl font-bold text-gray-900">{user.rollNumber || 'N/A'}</p>
                                </div>
                                <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Class</p>
                                    <p className="text-2xl font-bold text-gray-900">{user.class}</p>
                                </div>
                                <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Section</p>
                                    <p className="text-2xl font-bold text-gray-900">{user.section}</p>
                                </div>
                            </div>
                        </div>

                        {/* Parent/Guardian Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-blue-900 flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    Parent/Guardian Information
                                </h2>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Parent Name</p>
                                        <p className="text-lg font-semibold text-gray-900">{user.parentName || 'Not provided'}</p>
                                    </div>
                                </div>

                                {/* Editable Parent Phone */}
                                <div className="py-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-500 mb-1">Parent Phone</p>
                                            {editMode.parentPhone ? (
                                                <div className="space-y-3">
                                                    <input
                                                        type="tel"
                                                        value={formData.parentPhone}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, parentPhone: e.target.value }))}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                        placeholder="Enter parent phone number"
                                                    />
                                                    <div className="flex space-x-3">
                                                        <button
                                                            onClick={() => handleFieldUpdate('parentPhone', formData.parentPhone)}
                                                            disabled={updating}
                                                            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200 disabled:opacity-50"
                                                        >
                                                            {updating ? 'Saving...' : 'Save'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancel('parentPhone')}
                                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex justify-between items-center">
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        {user.parentPhone || 'Not provided'}
                                                    </p>
                                                    <button
                                                        onClick={() => setEditMode(prev => ({ ...prev, parentPhone: true }))}
                                                        className="ml-3 p-2 text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
