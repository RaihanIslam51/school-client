
'use client';

import React, { useState } from 'react';
import ImgBBUpload from '../../../components/ImgBBUpload';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';

// Function to generate PDF invoice
const generateInvoicePDF = (studentData, applicationId) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header with school name
    doc.setFillColor(30, 58, 138); // Dark blue
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Sunlight School', pageWidth / 2, yPosition + 8, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Admission Application Receipt', pageWidth / 2, yPosition + 18, { align: 'center' });

    yPosition = 50;

    // Application Info Box
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(1);
    doc.rect(15, yPosition - 5, pageWidth - 30, 25);
    
    doc.setTextColor(30, 58, 138);
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
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Student Information', 20, yPosition);

    yPosition += 10;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);

    const studentInfo = [
        { label: 'Full Name:', value: studentData.name },
        { label: 'Email:', value: studentData.email },
        { label: 'Date of Birth:', value: studentData.dateOfBirth },
        { label: 'Applying for Class:', value: studentData.class },
        { label: 'Preferred Section:', value: studentData.section || 'Any' },
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

    yPosition += 5;

    // Parent Information Section
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Parent/Guardian Information', 20, yPosition);

    yPosition += 10;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);

    const parentInfo = [
        { label: 'Parent/Guardian Name:', value: studentData.parentName },
        { label: 'Phone Number:', value: studentData.parentPhone },
    ];

    parentInfo.forEach((info) => {
        doc.setFont(undefined, 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text(info.label, 20, yPosition);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(60, 60, 60);
        doc.text(info.value, 80, yPosition);
        yPosition += 7;
    });

    yPosition += 5;

    // Address Section
    doc.setTextColor(30, 58, 138);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.text('Address', 20, yPosition);

    yPosition += 6;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    
    const addressLines = doc.splitTextToSize(studentData.address, 170);
    doc.text(addressLines, 20, yPosition);

    yPosition = pageHeight - 40;

    // Important Note
    doc.setFillColor(255, 243, 205); // Light yellow background
    doc.rect(15, yPosition - 5, pageWidth - 30, 25, 'F');
    
    doc.setDrawColor(255, 193, 7); // Yellow border
    doc.setLineWidth(1);
    doc.rect(15, yPosition - 5, pageWidth - 30, 25);
    
    doc.setTextColor(102, 81, 0); // Dark brown text
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('📝 Important', 20, yPosition + 2);
    
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

    // Download the PDF
    const fileName = `Admission_Application_${applicationId}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
};

const Admision = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        class: '',
        section: '',
        dateOfBirth: '',
        parentName: '',
        parentPhone: '',
        address: '',
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
            // Get API URL
            const apiUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
                ? 'http://localhost:5000'
                : 'https://schoolserver-nine.vercel.app';

            console.log('📝 Submitting admission application...');
            console.log('   Status: pending (no studentId/rollNumber yet)');

            const response = await fetch(`${apiUrl}/api/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                const applicationId = result.data?._id;
                console.log('✅ Admission application submitted successfully');
                console.log('   Application ID:', applicationId);
                console.log('   Will receive studentId and rollNumber after admin approval');

                Swal.fire({
                    icon: 'success',
                    title: 'Application Submitted!',
                    html: `
                        <div style="text-align: left; font-size: 14px; line-height: 1.8;">
                            <p style="margin-bottom: 15px;">Your admission application has been submitted successfully!</p>
                            <div style="background: #f0f9ff; padding: 12px; border-radius: 8px; border-left: 3px solid #3b82f6; margin-bottom: 12px;">
                                <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase;">Status</p>
                                <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: bold; color: #1e293b;">Pending Review</p>
                            </div>
                            <p style="margin: 15px 0 0 0; color: #64748b; font-size: 13px;">Your Student ID and Roll Number will be assigned after admin approval.</p>
                        </div>
                    `,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                    showDenyButton: true,
                    denyButtonText: '📥 Download Invoice',
                    customClass: {
                        denyButton: 'swal-download-btn',
                    },
                }).then((result) => {
                    if (result.isDenied) {
                        generateInvoicePDF(formData, applicationId);
                    }
                });

                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    class: '',
                    section: '',
                    dateOfBirth: '',
                    parentName: '',
                    parentPhone: '',
                    address: '',
                    imageUrl: '',
                    status: 'pending'
                });
            } else {
                const error = await response.json();
                console.error('❌ Submission failed:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: error.message || 'Please try again.',
                });
            }
        } catch (error) {
            console.error('❌ Network error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Network error. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-12 lg:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Student Admission Application
                        </h1>
                        <p className="text-lg text-gray-600">
                            Apply for admission to Sunlight School. Fill out the form below with accurate information.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6">
                            <h2 className="text-xl font-bold">Application Form</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Applying for Class *</label>
                                    <select
                                        name="class"
                                        value={formData.class}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select Class</option>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Section</label>
                                    <select
                                        name="section"
                                        value={formData.section}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Any Section</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                        <option value="D">D</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Parent/Guardian Name *</label>
                                    <input
                                        type="text"
                                        name="parentName"
                                        value={formData.parentName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Parent or guardian name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Parent Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="parentPhone"
                                        value={formData.parentPhone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="01XXXXXXXXX"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        rows="3"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your complete address"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Student Photo</label>
                                    <div className="space-y-3">
                                        {formData.imageUrl && (
                                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <img
                                                    src={formData.imageUrl}
                                                    alt="Student preview"
                                                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-700 font-medium">Photo uploaded</p>
                                                    <p className="text-xs text-gray-500">Click upload below to replace</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    title="Remove photo"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                        <ImgBBUpload
                                            onUploadSuccess={(urls) => {
                                                setFormData({ ...formData, imageUrl: urls[0] });
                                                Swal.fire({
                                                    icon: 'success',
                                                    title: 'Upload Successful!',
                                                    text: 'Photo uploaded successfully.',
                                                    timer: 2000,
                                                    showConfirmButton: false,
                                                });
                                            }}
                                            onUploadError={(error) => {
                                                Swal.fire({
                                                    icon: 'error',
                                                    title: 'Upload Failed',
                                                    text: error,
                                                });
                                            }}
                                            multiple={false}
                                            maxFiles={1}
                                        />
                                        <p className="text-xs text-gray-500">Upload a clear photo (JPG, PNG, GIF). Max 32MB.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 pt-6 border-t">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Admision;
