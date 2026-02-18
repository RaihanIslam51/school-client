'use client';
import React, { useState } from 'react';
import { API_URL } from '../../config/api';
import Swal from 'sweetalert2';
import { useLanguage } from '../../src/contexts/LanguageContext';

const LoginModal = ({ isOpen, onClose, onOpenSignup }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        email: '',
        id: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    // Automatically detect role based on ID format
    const detectRoleFromId = (id) => {
        if (!id) return null;
        
        // Admin format: 0001-26 (4 digits - 2 digits)
        if (/^\d{4}-\d{2}$/.test(id)) {
            return 'admin';
        }
        // Teacher format: 26-0001-1 (2 digits - 4 digits - 1 digit)
        else if (/^\d{2}-\d{4}-\d{1}$/.test(id)) {
            return 'teacher';
        }
        // Student format: 26-0001 (2 digits - 4 digits)
        else if (/^\d{2}-\d{4}$/.test(id)) {
            return 'student';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Detect role from ID format
            const role = detectRoleFromId(formData.id);
            
            if (!role) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Invalid ID Format',
                    html: `
                        <div class="text-left">
                            <p class="mb-2">Please enter ID in correct format:</p>
                            <ul class="list-disc list-inside space-y-1 text-sm">
                                <li><strong>Admin:</strong> 0001-26</li>
                                <li><strong>Student:</strong> 26-0001</li>
                                <li><strong>Teacher:</strong> 26-0001-1</li>
                            </ul>
                        </div>
                    `,
                    confirmButtonColor: '#dc2626',
                    customClass: {
                        container: 'swal-high-z-index'
                    }
                });
                setLoading(false);
                return;
            }

            // Build login data based on detected role
            const loginData = {
                email: formData.email,
                role: role,
                ...(role === 'teacher' ? { teacherId: formData.id } : 
                  role === 'admin' ? { adminId: formData.id } : 
                  { studentId: formData.id })
            };

            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (data.success) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(data.data));
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Login Successful!',
                    text: `Welcome back, ${data.data.name}!`,
                    confirmButtonColor: '#2563eb',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: {
                        container: 'swal-high-z-index'
                    }
                });
                
                onClose();
                
                // Redirect based on user role
                if (data.data.role === 'admin') {
                    window.location.href = '/dashboard';
                } else if (data.data.role === 'teacher') {
                    window.location.href = '/teacherboard';
                } else if (data.data.role === 'student') {
                    window.location.href = '/portal';
                } else {
                    window.location.reload();
                }
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: data.message || 'Invalid credentials',
                    confirmButtonColor: '#dc2626',
                    customClass: {
                        container: 'swal-high-z-index'
                    }
                });
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: 'Please make sure the server is running on port 5000',
                confirmButtonColor: '#dc2626',
                customClass: {
                    container: 'swal-high-z-index'
                }
            });
            setError('Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                >
                    ×
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">👤</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.loginTitle')}</h2>
                    <p className="text-gray-600">{t('auth.loginTitle')}</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t('auth.email')}
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder={t('auth.email')}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            ID Number
                        </label>
                        <input
                            type="text"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter your ID (e.g., 26-0001)"
                        />
                        {/* <div className="mt-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                            <p className="text-xs font-semibold text-blue-900 mb-2">📋 ID Format Guide:</p>
                            <div className="space-y-1">
                                <p className="text-xs text-blue-800">
                                    <span className="font-semibold">👨‍💼 Admin:</span> 0001-26 (Number-Year)
                                </p>
                                <p className="text-xs text-blue-800">
                                    <span className="font-semibold">📚 Student:</span> 26-0001 (Year-Number)
                                </p>
                                <p className="text-xs text-blue-800">
                                    <span className="font-semibold">👨‍🏫 Teacher:</span> 26-0001-1 (Year-Number-Subject)
                                </p>
                            </div>
                            <p className="text-xs text-blue-600 mt-2 italic">
                                ✨ Your account type will be detected automatically
                            </p>
                        </div> */}
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg disabled:opacity-50"
                    >
                        {loading ? `${t('common.loading')}` : t('auth.loginButton')}
                    </button>
                </form>

               
            
            </div>
        </div>
    );
};

export default LoginModal;
