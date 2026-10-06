'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: 'student@gmail.com',
        id: '26-0012',
        role: 'Student'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRoleChange = (e) => {
        const role = e.target.value;
        if (role === 'Student') {
            setFormData({ email: 'student@gmail.com', id: '26-0012', role: 'Student' });
        } else if (role === 'Teacher') {
            setFormData({ email: 'teacher@gmail.com', id: '26-0006-6', role: 'Teacher' });
        } else if (role === 'Admin') {
            setFormData({ email: 'admin@gmail.com', id: '0001-26', role: 'Admin' });
        } else {
            setFormData(prev => ({ ...prev, role }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
            const apiUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                ? 'http://localhost:5000'
                : 'https://schoolserver-nine.vercel.app';

            const detectedRole = detectRoleFromId(formData.id) || (
                formData.role === 'Teacher' ? 'teacher' :
                formData.role === 'Admin' ? 'admin' : 'student'
            );

            const loginData = {
                email: formData.email,
                role: detectedRole,
                ...(detectedRole === 'teacher' ? { teacherId: formData.id } :
                    detectedRole === 'admin' ? { adminId: formData.id } :
                    { studentId: formData.id })
            };

            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Server connection error. Please try again.',
                confirmButtonColor: '#0B0F28',
            });
            setError('Server connection error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-[#0B0F28]">
            
            {/* ─── TOP HERO BANNER WITH ANGLED CHEVRON CUT ─── */}
            <div 
                className="relative bg-cover bg-center h-52 sm:h-72 md:h-80 flex items-center justify-center text-center overflow-hidden"
                style={{ 
                    backgroundImage: "linear-gradient(rgba(11, 15, 40, 0.75), rgba(11, 15, 40, 0.75)), url('/school1.png')",
                    clipPath: "polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)"
                }}
            >
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 px-4 -mt-4"
                >
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-2">
                        Login
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-200 font-medium tracking-wide">
                        <Link href="/" className="hover:underline">home</Link> - Login
                    </p>
                </motion.div>
            </div>

            {/* ─── MAIN LOGIN FORM SECTION ─── */}
            <section className="py-12 sm:py-20 px-4 flex justify-center bg-white">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full bg-[#F4F5F8] border border-gray-200/80 p-6 sm:p-10 rounded-none shadow-xs"
                >
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 text-xs mb-4 font-medium rounded-none">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* USERNAME / EMAIL */}
                        <div>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                placeholder="Username"
                                className="w-full px-3.5 py-3 text-xs sm:text-sm border border-gray-300 rounded-none bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5500] transition-colors"
                            />
                        </div>

                        {/* PASSWORD / ID */}
                        <div>
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleInputChange}
                                required
                                placeholder="Password"
                                className="w-full px-3.5 py-3 text-xs sm:text-sm border border-gray-300 rounded-none bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5500] transition-colors"
                            />
                        </div>

                        {/* ROLE SELECT DROPDOWN */}
                        <div>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleRoleChange}
                                className="w-full px-3.5 py-3 text-xs sm:text-sm border border-gray-300 rounded-none bg-white text-gray-800 focus:outline-none focus:border-[#FF5500] cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23333333%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[right_12px_center] bg-no-repeat pr-8"
                            >
                                <option value="Student">Student</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

                        {/* LOGIN BUTTON */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-[#FF5500] hover:bg-[#e04500] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all rounded-none cursor-pointer active:scale-[0.99]"
                            >
                                {loading ? 'LOGGING IN...' : 'LOGIN'}
                            </button>
                        </div>

                    </form>
                </motion.div>
            </section>

        </div>
    );
};

export default LoginPage;
