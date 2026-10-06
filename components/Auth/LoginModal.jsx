'use client';
import React, { useState } from 'react';
import { API_URL } from '../../config/api';
import Swal from 'sweetalert2';
import { useLanguage } from '../../src/contexts/LanguageContext';

const LoginModal = ({ isOpen, onClose, onOpenSignup }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        email: 'student@gmail.com',
        id: '26-0012',
        role: 'Student'
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

    const handleRoleChange = (e) => {
        const role = e.target.value;
        if (role === 'Student') {
            setFormData({ email: 'student@gmail.com', id: '26-0012', role: 'Student' });
        } else if (role === 'Teacher') {
            setFormData({ email: 'teacher@gmail.com', id: '26-0006-6', role: 'Teacher' });
        } else if (role === 'Parent' || role === 'Admin') {
            setFormData({ email: 'admin@gmail.com', id: '0001-26', role: role });
        } else {
            setFormData(prev => ({ ...prev, role }));
        }
    };

    const detectRoleFromId = (id) => {
        if (!id) return null;
        if (/^\d{4}-\d{2}$/.test(id)) return 'admin';
        if (/^\d{2}-\d{4}-\d{1}$/.test(id)) return 'teacher';
        if (/^\d{2}-\d{4}$/.test(id)) return 'student';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const role = detectRoleFromId(formData.id) || (
                formData.role === 'Teacher' ? 'teacher' :
                formData.role === 'Admin' || formData.role === 'Parent' ? 'admin' : 'student'
            );

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
                localStorage.setItem('user', JSON.stringify(data.data));

                await Swal.fire({
                    icon: 'success',
                    title: 'Login Successful!',
                    text: `Welcome back, ${data.data.name}!`,
                    confirmButtonColor: '#0B0F28',
                    timer: 2000,
                    showConfirmButton: false,
                });

                onClose();

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
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: data.message || 'Invalid credentials',
                    confirmButtonColor: '#0B0F28',
                });
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: 'Please make sure the server is running on port 5000',
                confirmButtonColor: '#0B0F28',
            });
            setError('Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[#F4F5F8] border border-gray-200 shadow-2xl max-w-md w-full p-6 sm:p-10 relative rounded-none font-sans">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-500 hover:text-[#FF5500] text-2xl transition-colors cursor-pointer"
                >
                    ×
                </button>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-none mb-4 text-xs font-medium">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Username Input */}
                    <div>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Username"
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-none bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5500]"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <input
                            type="text"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            required
                            placeholder="Password"
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-none bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5500]"
                        />
                    </div>

                    {/* Role Select Dropdown */}
                    <div>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleRoleChange}
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-none bg-white text-gray-800 focus:outline-none focus:border-[#FF5500] cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[right_12px_center] bg-no-repeat pr-8"
                        >
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    {/* Login Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#FF5500] hover:bg-[#e04500] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-colors rounded-none cursor-pointer"
                        >
                            {loading ? 'LOGGING IN...' : 'LOGIN'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default LoginModal;
