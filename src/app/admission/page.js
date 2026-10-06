'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import Link from 'next/link';

// Function to generate PDF invoice
const generateInvoicePDF = (studentData, applicationId) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header with school name - Navy Theme (#0B0F28)
    doc.setFillColor(11, 15, 40); 
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Salmela International School', pageWidth / 2, yPosition + 8, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Admission Application Receipt', pageWidth / 2, yPosition + 18, { align: 'center' });

    yPosition = 50;

    // Application Info Box
    doc.setDrawColor(11, 15, 40);
    doc.setLineWidth(1);
    doc.rect(15, yPosition - 5, pageWidth - 30, 25);
    
    doc.setTextColor(11, 15, 40);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Application Details', 20, yPosition + 3);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(`Application ID: ${applicationId}`, 20, yPosition + 10);
    doc.text(`Status: Pending Review`, 20, yPosition + 16);
    doc.text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 20, yPosition + 22);

    yPosition = 85;

    // Student Information Section
    doc.setTextColor(11, 15, 40);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Student Information', 20, yPosition);

    yPosition += 10;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);

    const studentInfo = [
        { label: 'Full Name:', value: studentData.name },
        { label: 'Phone Number:', value: studentData.parentPhone },
        { label: 'Email:', value: studentData.email || 'N/A' },
        { label: 'Gender:', value: studentData.gender || 'N/A' },
        { label: 'Blood Group:', value: studentData.bloodGroup || 'N/A' },
        { label: 'Date of Birth:', value: studentData.dateOfBirth },
        { label: 'Nationality:', value: studentData.nationality || 'Bangladeshi' },
        { label: 'Applying for Class:', value: studentData.class },
        { label: 'Session:', value: studentData.session || '2026-2027' },
        { label: 'Medium:', value: studentData.medium || 'English Medium' }
    ];

    studentInfo.forEach((info) => {
        doc.setFont(undefined, 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text(info.label, 20, yPosition);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(60, 60, 60);
        doc.text(info.value, 80, yPosition);
        yPosition += 7;
    });

    yPosition = pageHeight - 40;

    // Important Note
    doc.setFillColor(254, 243, 199);
    doc.rect(15, yPosition - 5, pageWidth - 30, 25, 'F');
    
    doc.setDrawColor(255, 85, 0); // Orange border
    doc.setLineWidth(1);
    doc.rect(15, yPosition - 5, pageWidth - 30, 25);
    
    doc.setTextColor(120, 53, 4);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('Important Notice', 20, yPosition + 2);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    const noteLines = doc.splitTextToSize(
        'Your Student ID and Roll Number will be assigned after admin approval. You will receive a confirmation email once your application is processed.',
        160
    );
    doc.text(noteLines, 20, yPosition + 8);

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text('This is an automated receipt for your admission application submission.', pageWidth / 2, pageHeight - 8, { align: 'center' });

    // Download PDF
    const fileName = `Admission_Application_${applicationId}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
};

const Admision = () => {
    const [formData, setFormData] = useState({
        name: '',
        parentPhone: '',
        gender: '',
        email: '',
        bloodGroup: '',
        dateOfBirth: '',
        nationality: 'Bangladeshi',
        class: '',
        session: '2026-2027',
        medium: 'English Medium',
        parentName: '',
        address: 'Dhaka, Bangladesh',
        imageUrl: '',
        status: 'pending'
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                ? 'http://localhost:5000'
                : 'https://schoolserver-nine.vercel.app';

            const payload = {
                ...formData,
                parentName: formData.parentName || formData.name
            };

            const response = await fetch(`${apiUrl}/api/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                const applicationId = result.data?._id;

                Swal.fire({
                    icon: 'success',
                    title: 'Application Submitted!',
                    html: `
                        <div style="text-align: left; font-size: 14px; line-height: 1.8; font-family: sans-serif;">
                            <p style="margin-bottom: 15px; color: #374151;">Your admission application has been submitted successfully!</p>
                            <div style="background: rgba(255, 85, 0, 0.1); padding: 14px; border-radius: 8px; border-left: 4px solid #FF5500; margin-bottom: 12px;">
                                <p style="margin: 0; color: #0B0F28; font-size: 11px; font-weight: 700; text-transform: uppercase;">Status</p>
                                <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 800; color: #0B0F28;">Pending Review</p>
                            </div>
                            <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 13px;">Your Student ID and Roll Number will be assigned after admin approval.</p>
                        </div>
                    `,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#0B0F28',
                    showDenyButton: true,
                    denyButtonText: '📥 Download Receipt',
                    denyButtonColor: '#FF5500',
                }).then((result) => {
                    if (result.isDenied) {
                        generateInvoicePDF(payload, applicationId);
                    }
                });

                // Reset form
                setFormData({
                    name: '',
                    parentPhone: '',
                    gender: '',
                    email: '',
                    bloodGroup: '',
                    dateOfBirth: '',
                    nationality: 'Bangladeshi',
                    class: '',
                    session: '2026-2027',
                    medium: 'English Medium',
                    parentName: '',
                    address: 'Dhaka, Bangladesh',
                    imageUrl: '',
                    status: 'pending'
                });
            } else {
                const error = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: error.message || 'Please try again.',
                    confirmButtonColor: '#0B0F28',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Network error. Please try again.',
                confirmButtonColor: '#0B0F28',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-[#0B0F28]">
            
            {/* ─── TOP HERO BANNER WITH ANGLED BOTTOM EDGE ─── */}
            <div 
                className="relative bg-cover bg-center h-48 sm:h-64 flex items-center justify-center text-center"
                style={{ 
                    backgroundImage: "linear-gradient(rgba(11, 15, 40, 0.75), rgba(11, 15, 40, 0.75)), url('/school1.png')",
                    clipPath: "polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)"
                }}
            >
                <div className="relative z-10 px-4 -mt-4">
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-2">
                        Online applications
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-200 font-medium">
                        <Link href="/" className="hover:underline">home</Link> - Online applications
                    </p>
                </div>
            </div>

            {/* ─── MAIN FORM CONTAINER ─── */}
            <section className="py-10 sm:py-16 px-4">
                <div className="max-w-4xl mx-auto bg-[#F4F5F8] border border-gray-200 p-6 sm:p-10 shadow-sm rounded-none">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* ─── STUDENT INFO SECTION ─── */}
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-[#555555] pb-2 mb-6 border-b border-gray-300">
                                Student info
                            </h2>

                            {/* UPPER ROW: Image Upload (Left) & Name/Phone/Gender (Right) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mb-6">
                                
                                {/* LEFT IMAGE CONTAINER */}
                                <div className="border border-[#D1D5DB] rounded-none overflow-hidden bg-white shadow-xs">
                                    {/* Top Header Bar */}
                                    <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-[#D1D5DB]">
                                        <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                                            Image <span className="text-red-500">*</span>
                                        </label>
                                    </div>
                                    
                                    {/* Main Body */}
                                    <div className="p-6 flex flex-col items-center justify-between min-h-[260px]">
                                        {formData.imageUrl ? (
                                            <div className="relative flex flex-col items-center my-auto">
                                                <img
                                                    src={formData.imageUrl}
                                                    alt="Student preview"
                                                    className="w-[150px] h-[150px] object-cover rounded-full shadow-sm border border-gray-300"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                                    className="mt-2 text-xs text-red-500 font-semibold hover:underline"
                                                >
                                                    Remove photo
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="my-auto flex justify-center">
                                                <div className="w-[150px] h-[150px] rounded-full bg-[#6C757D] text-white flex items-center justify-center text-sm sm:text-base font-normal shadow-inner">
                                                    150 x 150
                                                </div>
                                            </div>
                                        )}

                                        {/* Bottom File Input Row */}
                                        <div className="w-full text-left mt-4 pt-2 flex items-center gap-2">
                                            <label 
                                                htmlFor="admission-image-input" 
                                                className="cursor-pointer bg-[#EFEEED] hover:bg-[#E4E3E1] active:bg-[#D8D7D5] text-gray-900 text-xs px-2.5 py-1 border border-gray-400 rounded-[2px] font-normal inline-block select-none"
                                            >
                                                Choose file
                                            </label>
                                            <span className="text-xs text-gray-600 font-normal truncate max-w-[140px]">
                                                {formData.imageUrl ? 'Photo selected' : 'No file chosen'}
                                            </span>
                                            <input 
                                                id="admission-image-input"
                                                type="file" 
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
                                                    if (apiKey) {
                                                        try {
                                                            const formDataUpload = new FormData();
                                                            formDataUpload.append('image', file);
                                                            formDataUpload.append('key', apiKey);

                                                            const res = await fetch('https://api.imgbb.com/1/upload', {
                                                                method: 'POST',
                                                                body: formDataUpload,
                                                            });
                                                            const data = await res.json();
                                                            if (data.success) {
                                                                setFormData(prev => ({ ...prev, imageUrl: data.data.url }));
                                                                return;
                                                            }
                                                        } catch (err) {
                                                            console.error('ImgBB upload error:', err);
                                                        }
                                                    }
                                                    
                                                    // Local preview fallback
                                                    const reader = new FileReader();
                                                    reader.onload = () => {
                                                        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }}
                                                className="hidden" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT SIDE FIELDS */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Name"
                                            className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-none bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5500]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                            Phone number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="parentPhone"
                                            value={formData.parentPhone}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Phone number"
                                            className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-none bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5500]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                            Gender <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-none bg-white text-gray-800 focus:outline-none focus:border-[#FF5500] cursor-pointer"
                                        >
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                            </div>

                            {/* LOWER ROW: Email & Blood Group, Birthday & Nationality */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-none bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5500]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Blood group <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-none bg-white text-gray-800 focus:outline-none focus:border-[#FF5500] cursor-pointer"
                                    >
                                        <option value="">Select</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Birthday <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="YYYY-MM-DD"
                                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-none bg-white text-gray-800 focus:outline-none focus:border-[#FF5500]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Nationality <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="nationality"
                                        value={formData.nationality}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Nationality"
                                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-none bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF5500]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ─── ACADEMIC INFO SECTION ─── */}
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-[#555555] pb-2 mb-6 border-b border-gray-300">
                                Academic info
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Class <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="class"
                                        value={formData.class}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-none bg-white text-gray-800 focus:outline-none focus:border-[#FF5500] cursor-pointer"
                                    >
                                        <option value="">Select</option>
                                        <option value="Play">Play</option>
                                        <option value="Nursery">Nursery</option>
                                        <option value="KG">KG</option>
                                        <option value="Class 1">Class 1</option>
                                        <option value="Class 2">Class 2</option>
                                        <option value="Class 3">Class 3</option>
                                        <option value="Class 4">Class 4</option>
                                        <option value="Class 5">Class 5</option>
                                        <option value="Class 6">Class 6</option>
                                        <option value="Class 7">Class 7</option>
                                        <option value="Class 8">Class 8</option>
                                        <option value="Class 9">Class 9</option>
                                        <option value="Class 10">Class 10</option>
                                        <option value="Class 11">Class 11</option>
                                        <option value="Class 12">Class 12</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Session <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="session"
                                        value={formData.session}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-none bg-white text-gray-800 focus:outline-none focus:border-[#FF5500] cursor-pointer"
                                    >
                                        <option value="">Select</option>
                                        <option value="2025-2026">2025-2026</option>
                                        <option value="2026-2027">2026-2027</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Medium <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="medium"
                                        value={formData.medium}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-none bg-white text-gray-800 focus:outline-none focus:border-[#FF5500] cursor-pointer"
                                    >
                                        <option value="">Select</option>
                                        <option value="Bangla Medium">Bangla Medium</option>
                                        <option value="English Medium">English Medium</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* ─── APPLY NOW SUBMIT BUTTON ─── */}
                        <div className="text-center pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-[#FF5500] hover:bg-[#e04500] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-colors rounded-none cursor-pointer"
                            >
                                {loading ? 'SUBMITTING...' : 'APPLY NOW'}
                            </button>
                        </div>

                    </form>
                </div>
            </section>

        </div>
    );
};

export default Admision;
