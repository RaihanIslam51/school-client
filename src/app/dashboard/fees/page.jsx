'use client';

import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../../../config/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FeesManagementPage = () => {
    // State management
    const [classes, setClasses] = useState(['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']);
    const [sections, setSections] = useState(['A', 'B', 'C', 'D']);
    const [students, setStudents] = useState([]);
    const [feeRecords, setFeeRecords] = useState([]);
    const [statistics, setStatistics] = useState(null);
    
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString());
    
    const [viewMode, setViewMode] = useState('collection'); // 'collection' or 'records'
    const [collectionMode, setCollectionMode] = useState('bulk'); // 'bulk' or 'individual'
    const [selectedStudents, setSelectedStudents] = useState([]); // For individual mode
    const [selectedFees, setSelectedFees] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [paidAmount, setPaidAmount] = useState('');
    const [remarks, setRemarks] = useState('');
    
    const [loading, setLoading] = useState(false);
    const receiptRef = useRef(null);
    const [currentReceipt, setCurrentReceipt] = useState(null);
    const [recordFilter, setRecordFilter] = useState('unpaid'); // 'all', 'paid', 'unpaid'
    const [selectedRecords, setSelectedRecords] = useState([]); // For bulk delete

    // Fee categories
    const feeCategories = [
        { name: 'Admission Fee', defaultAmount: 5000 },
        { name: 'Monthly Tuition Fee', defaultAmount: 2000 },
        { name: 'Exam Fee', defaultAmount: 500 },
        { name: 'Registration Fee', defaultAmount: 1000 },
        { name: 'Library Fee', defaultAmount: 300 },
        { name: 'Transport Fee', defaultAmount: 1500 },
        { name: 'Sports Fee', defaultAmount: 400 },
        { name: 'Computer Lab Fee', defaultAmount: 600 },
        { name: 'Development Fee', defaultAmount: 800 },
        { name: 'Late Fine', defaultAmount: 100 }
    ];

    // Load classes on mount
    useEffect(() => {
        // Classes are now static
    }, []);

    // Load sections when class changes
    useEffect(() => {
        if (selectedClass) {
            // Sections are now static
        } else {
            setSelectedSection('');
        }
    }, [selectedClass]);

    // Load students when both class and section are selected
    useEffect(() => {
        if (selectedClass && selectedSection) {
            fetchStudents();
            fetchFeeRecords();
            fetchStatistics();
        } else {
            setStudents([]);
            setFeeRecords([]);
        }
    }, [selectedClass, selectedSection, academicYear, recordFilter]);

    // Fetch students
    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/fees/helpers/students?class=${selectedClass}&section=${selectedSection}`);
            const data = await response.json();
            
            if (data.success) {
                setStudents(data.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            Swal.fire('Error', 'Failed to load students', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Fetch fee records
    const fetchFeeRecords = async () => {
        try {
            let statusParam = '';
            if (recordFilter === 'paid') {
                statusParam = 'status=Paid';
            } else if (recordFilter === 'unpaid') {
                statusParam = 'status=Pending,Partial';
            } else if (recordFilter === 'all') {
                statusParam = 'status=Paid,Pending,Partial';
            }

            const response = await fetch(
                `${API_BASE_URL}/fees/class-section?class=${selectedClass}&section=${selectedSection}&academicYear=${academicYear}&${statusParam}`
            );
            const data = await response.json();
            
            if (data.success) {
                // Sort records by roll number in ascending order
                const sortedRecords = data.data.sort((a, b) => {
                    const rollA = parseInt(a.rollNumber) || 0;
                    const rollB = parseInt(b.rollNumber) || 0;
                    return rollA - rollB;
                });
                setFeeRecords(sortedRecords);
                // Clear selected records when data changes
                setSelectedRecords([]);
            }
        } catch (error) {
            console.error('Error fetching fee records:', error);
        }
    };

    // Fetch statistics
    const fetchStatistics = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/fees/statistics?class=${selectedClass}&section=${selectedSection}&academicYear=${academicYear}`
            );
            const data = await response.json();
            
            if (data.success) {
                setStatistics(data.data);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    // Select/deselect student for individual collection
    const toggleStudentSelection = (student) => {
        setSelectedStudents(prev => {
            const isSelected = prev.some(s => s._id === student._id);
            if (isSelected) {
                return prev.filter(s => s._id !== student._id);
            } else {
                return [...prev, student];
            }
        });
    };

    // Select all students
    const selectAllStudents = () => {
        setSelectedStudents(students);
    };

    // Deselect all students
    const deselectAllStudents = () => {
        setSelectedStudents([]);
    };

    // Add fee to collection
    const addFee = (category) => {
        Swal.fire({
            title: `Add ${category.name}`,
            html: `
                <input id="fee-amount" class="swal2-input" type="number" placeholder="Amount" value="${category.defaultAmount}" />
                <textarea id="fee-description" class="swal2-textarea" placeholder="Description (optional)"></textarea>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Add',
            confirmButtonColor: '#3b82f6',
            preConfirm: () => {
                const amount = document.getElementById('fee-amount').value;
                const description = document.getElementById('fee-description').value;
                
                if (!amount || parseFloat(amount) <= 0) {
                    Swal.showValidationMessage('Please enter a valid amount');
                    return false;
                }
                
                return { 
                    feeCategory: category.name,
                    amount: parseFloat(amount),
                    description: description || ''
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setSelectedFees([...selectedFees, result.value]);
                // Auto-set paid amount to total
                const newTotal = [...selectedFees, result.value].reduce((sum, f) => sum + f.amount, 0);
                setPaidAmount(newTotal.toString());
            }
        });
    };

    // Remove fee from collection
    const removeFee = (index) => {
        const updatedFees = selectedFees.filter((_, i) => i !== index);
        setSelectedFees(updatedFees);
        // Update paid amount
        const newTotal = updatedFees.reduce((sum, f) => sum + f.amount, 0);
        setPaidAmount(newTotal.toString());
    };

    // Calculate totals
    const calculateTotals = () => {
        const total = selectedFees.reduce((sum, fee) => sum + fee.amount, 0);
        const paid = parseFloat(paidAmount) || 0;
        const due = total - paid;
        
        return {
            total: total.toFixed(2),
            paid: paid.toFixed(2),
            due: due.toFixed(2)
        };
    };

    // Collect fee for selected students (bulk or individual)
    const collectFee = async () => {
        if (selectedFees.length === 0) {
            Swal.fire('Error', 'Please add at least one fee', 'error');
            return;
        }

        const studentsToProcess = collectionMode === 'bulk' ? students : selectedStudents;
        
        if (studentsToProcess.length === 0) {
            Swal.fire('Error', 'Please select at least one student', 'error');
            return;
        }

        const totals = calculateTotals();
        
        try {
            setLoading(true);
            
            // Create fee records for selected students
            const promises = studentsToProcess.map(student => {
                const feeData = {
                    studentId: student._id,
                    studentName: student.name,
                    rollNumber: student.rollNumber,
                    class: selectedClass,
                    section: selectedSection,
                    academicYear,
                    fees: selectedFees,
                    paidAmount: parseFloat(totals.paid),
                    paymentMethod,
                    remarks,
                    collectedBy: 'Admin',
                    status: 'Pending' // Default status
                };

                return fetch(`${API_BASE_URL}/fees`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(feeData)
                });
            });

            const responses = await Promise.all(promises);
            
            // Check if all succeeded
            const results = await Promise.all(responses.map(r => r.json()));
            const allSuccess = results.every(result => result.success);
            
            if (allSuccess) {
                Swal.fire('Success!', `Fees collected for ${studentsToProcess.length} student${studentsToProcess.length > 1 ? 's' : ''}!`, 'success');
                
                // Reset form
                setSelectedFees([]);
                setPaidAmount('');
                setRemarks('');
                setSelectedStudents([]);
                
                // Refresh data and switch to records view
                fetchFeeRecords();
                fetchStatistics();
                setViewMode('records');
            } else {
                const failedCount = results.filter(r => !r.success).length;
                throw new Error(`${failedCount} fee collections failed`);
            }
        } catch (error) {
            console.error('Error collecting fees:', error);
            Swal.fire('Error', error.message || 'Failed to collect fees', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Show receipt options
    const showReceiptOptions = (receipt) => {
        Swal.fire({
            title: 'Fee Collected!',
            html: `
                <p class="text-lg mb-4">Receipt Number: <strong>${receipt.receiptNumber}</strong></p>
                <p class="text-gray-600">What would you like to do?</p>
            `,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: '🖨️ Print Receipt',
            denyButtonText: '📄 Download PDF',
            cancelButtonText: 'Close',
            confirmButtonColor: '#3b82f6',
            denyButtonColor: '#8b5cf6'
        }).then((result) => {
            if (result.isConfirmed) {
                printReceipt(receipt);
            } else if (result.isDenied) {
                downloadReceiptPDF(receipt);
            }
        });
    };

    // Print receipt
    const printReceipt = (receipt) => {
        const receiptHTML = generateReceiptHTML(receipt);
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.print();
        };
    };

    // Download receipt as PDF
    const downloadReceiptPDF = async (receipt) => {
        Swal.fire({
            title: 'Generating PDF...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Create temporary receipt element
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = generateReceiptContentHTML(receipt);
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.width = '800px';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.padding = '40px';
        document.body.appendChild(tempDiv);

        try {
            const canvas = await html2canvas(tempDiv, { 
                scale: 2,
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`Receipt_${receipt.receiptNumber}.pdf`);
            
            Swal.close();
            Swal.fire('Success', 'PDF downloaded successfully', 'success');
        } catch (error) {
            console.error('PDF generation error:', error);
            Swal.fire('Error', 'Failed to generate PDF', 'error');
        } finally {
            document.body.removeChild(tempDiv);
        }
    };

    // Generate receipt content HTML
    const generateReceiptContentHTML = (receipt) => {
        const totals = {
            total: receipt.totalAmount.toFixed(2),
            paid: receipt.paidAmount.toFixed(2),
            due: receipt.dueAmount.toFixed(2)
        };

        return `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: white;">
                <!-- Header -->
                <div style="text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #1e40af; margin: 0; font-size: 32px;">🎓 School Management System</h1>
                    <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Fee Payment Receipt</p>
                </div>

                <!-- Receipt Info -->
                <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                    <div>
                        <p style="margin: 5px 0;"><strong>Receipt No:</strong> ${receipt.receiptNumber}</p>
                        <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(receipt.paymentDate).toLocaleDateString()}</p>
                        <p style="margin: 5px 0;"><strong>Academic Year:</strong> ${receipt.academicYear}</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${receipt.paymentMethod}</p>
                        <p style="margin: 5px 0;"><strong>Status:</strong> 
                            <span style="background: ${receipt.status === 'Paid' ? '#10b981' : receipt.status === 'Partial' ? '#f59e0b' : '#ef4444'}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">${receipt.status}</span>
                        </p>
                    </div>
                </div>

                <!-- Student Info -->
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Student Information</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <p style="margin: 5px 0;"><strong>Name:</strong> ${receipt.studentName}</p>
                        <p style="margin: 5px 0;"><strong>Roll Number:</strong> ${receipt.rollNumber}</p>
                        <p style="margin: 5px 0;"><strong>Class:</strong> ${receipt.class}</p>
                        <p style="margin: 5px 0;"><strong>Section:</strong> ${receipt.section}</p>
                    </div>
                </div>

                <!-- Fee Details -->
                <div style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Fee Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #3b82f6; color: white;">
                                <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Fee Category</th>
                                <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Description</th>
                                <th style="padding: 12px; text-align: right; border: 1px solid #ddd;">Amount (৳)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${receipt.fees.map((fee, index) => `<tr style="background: ${index % 2 === 0 ? '#f9fafb' : 'white'};"><td style="padding: 12px; border: 1px solid #ddd;">${fee.feeCategory}</td><td style="padding: 12px; border: 1px solid #ddd;">${fee.description || '-'}</td><td style="padding: 12px; text-align: right; border: 1px solid #ddd;">${fee.amount.toFixed(2)}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Summary -->
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="font-size: 16px;">Total Amount:</span>
                        <span style="font-size: 16px; font-weight: bold;">৳ ${totals.total}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="font-size: 16px; color: #10b981;">Paid Amount:</span>
                        <span style="font-size: 16px; font-weight: bold; color: #10b981;">৳ ${totals.paid}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 2px solid #d1d5db;">
                        <span style="font-size: 18px; font-weight: bold; color: ${parseFloat(totals.due) > 0 ? '#ef4444' : '#6b7280'};">Due Amount:</span>
                        <span style="font-size: 18px; font-weight: bold; color: ${parseFloat(totals.due) > 0 ? '#ef4444' : '#6b7280'};">৳ ${totals.due}</span>
                    </div>
                </div>

                ${receipt.remarks ? `
                    <div style="margin-bottom: 30px;">
                        <p style="margin: 5px 0;"><strong>Remarks:</strong> ${receipt.remarks}</p>
                    </div>
                ` : ''}

                <!-- Footer -->
                <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                        <div>
                            <p style="margin: 5px 0; color: #6b7280; font-size: 12px;">Collected By: ${receipt.collectedBy || 'Admin'}</p>
                            <p style="margin: 5px 0; color: #6b7280; font-size: 12px;">This is a computer-generated receipt</p>
                        </div>
                        <div style="text-align: right;">
                            <div style="border-top: 1px solid #000; padding-top: 5px; width: 200px;">
                                <p style="margin: 0; font-size: 12px;">Authorized Signature</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    // Generate full receipt HTML for printing
    const generateReceiptHTML = (receipt) => {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Fee Receipt - ${receipt.receiptNumber}</title>
                <style>
                    body { margin: 0; padding: 20px; }
                    @media print {
                        body { padding: 0; }
                        button { display: none; }
                    }
                </style>
            </head>
            <body>
                ${generateReceiptContentHTML(receipt)}
            </body>
            </html>
        `;
    };

    // View existing receipt
    const viewReceipt = (receipt) => {
        setCurrentReceipt(receipt);
        showReceiptOptions(receipt);
    };

    // Select/deselect fee record for bulk delete
    const toggleRecordSelection = (record) => {
        setSelectedRecords(prev => {
            const isSelected = prev.some(r => r._id === record._id);
            if (isSelected) {
                return prev.filter(r => r._id !== record._id);
            } else {
                return [...prev, record];
            }
        });
    };

    // Select all records
    const selectAllRecords = () => {
        setSelectedRecords(feeRecords);
    };

    // Deselect all records
    const deselectAllRecords = () => {
        setSelectedRecords([]);
    };

    // Delete selected records
    const deleteSelectedRecords = async () => {
        if (selectedRecords.length === 0) {
            Swal.fire('Error', 'Please select at least one record to delete', 'error');
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${selectedRecords.length} fee record${selectedRecords.length > 1 ? 's' : ''}. This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete!',
            cancelButtonText: 'Cancel'
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setLoading(true);
            
            // Delete selected records
            const promises = selectedRecords.map(record => 
                fetch(`${API_BASE_URL}/fees/${record._id}`, {
                    method: 'DELETE'
                })
            );

            const responses = await Promise.all(promises);
            
            // Check if all succeeded
            const results = await Promise.all(responses.map(r => r.json()));
            const allSuccess = results.every(result => result.success);
            
            if (allSuccess) {
                Swal.fire('Success!', `${selectedRecords.length} record${selectedRecords.length > 1 ? 's' : ''} deleted successfully!`, 'success');
                
                // Reset selection and refresh data
                setSelectedRecords([]);
                fetchFeeRecords();
                fetchStatistics();
            } else {
                const failedCount = results.filter(r => !r.success).length;
                throw new Error(`${failedCount} deletions failed`);
            }
        } catch (error) {
            console.error('Error deleting records:', error);
            Swal.fire('Error', error.message || 'Failed to delete records', 'error');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="container mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                💰 Fees Management System
                            </h1>
                            <p className="text-gray-600 mt-2">Professional fee collection and receipt management</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setViewMode('collection')}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                    viewMode === 'collection'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                💵 Fee Collection
                            </button>
                            <button
                                onClick={() => setViewMode('records')}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                    viewMode === 'records'
                                        ? 'bg-purple-600 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                📋 Fee Records
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Selection Criteria</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Class Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Class</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">Select Class</option>
                                {classes.map((cls, index) => (
                                    <option key={index} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </div>

                        {/* Section Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Section</label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                disabled={!selectedClass}
                            >
                                <option value="">Select Section</option>
                                {sections.map((section, index) => (
                                    <option key={index} value={section}>{section}</option>
                                ))}
                            </select>
                        </div>

                        {/* Academic Year */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
                            <input
                                type="text"
                                value={academicYear}
                                onChange={(e) => setAcademicYear(e.target.value)}
                                placeholder="2026"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                {statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Total Collected</p>
                                    <p className="text-3xl font-bold mt-2">৳{statistics.totalCollected.toLocaleString()}</p>
                                </div>
                                <div className="text-5xl opacity-20">💵</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Paid Records</p>
                                    <p className="text-3xl font-bold mt-2">{statistics.paidCount}</p>
                                </div>
                                <div className="text-5xl opacity-20">✅</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-100 text-sm">Total Due</p>
                                    <p className="text-3xl font-bold mt-2">৳{statistics.totalDue.toLocaleString()}</p>
                                </div>
                                <div className="text-5xl opacity-20">⚠️</div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Total Records</p>
                                    <p className="text-3xl font-bold mt-2">{statistics.totalRecords}</p>
                                </div>
                                <div className="text-5xl opacity-20">📊</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Fee Collection Mode */}
                {viewMode === 'collection' && selectedClass && selectedSection && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Students Info */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">👥 Students ({students.length})</h2>
                                {collectionMode === 'individual' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={selectAllStudents}
                                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700"
                                        >
                                            Select All
                                        </button>
                                        <button
                                            onClick={deselectAllStudents}
                                            className="px-3 py-1 bg-gray-600 text-white rounded text-sm font-semibold hover:bg-gray-700"
                                        >
                                            Deselect All
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="max-h-[600px] overflow-y-auto">
                                <div className="space-y-3">
                                    {students.map((student) => (
                                        <div
                                            key={student._id}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                collectionMode === 'bulk'
                                                    ? 'border-blue-200 bg-blue-50'
                                                    : selectedStudents.some(s => s._id === student._id)
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                            onClick={() => collectionMode === 'individual' && toggleStudentSelection(student)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold text-gray-800">{student.name}</p>
                                                    <p className="text-sm text-gray-600">Roll: {student.rollNumber}</p>
                                                </div>
                                                {collectionMode === 'bulk' ? (
                                                    <div className="text-green-600 text-2xl">✓</div>
                                                ) : (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedStudents.some(s => s._id === student._id)}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            toggleStudentSelection(student);
                                                        }}
                                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Fee Collection Form */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">💳 Fee Collection</h2>
                            
                            <div className="space-y-6">
                                {/* Collection Mode Selection */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Collection Mode</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="bulk"
                                                checked={collectionMode === 'bulk'}
                                                onChange={(e) => {
                                                    setCollectionMode(e.target.value);
                                                    setSelectedStudents([]);
                                                }}
                                                className="mr-2"
                                            />
                                            <span className="text-sm font-medium">Bulk Collection (All Students)</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="individual"
                                                checked={collectionMode === 'individual'}
                                                onChange={(e) => {
                                                    setCollectionMode(e.target.value);
                                                    setSelectedStudents([]);
                                                }}
                                                className="mr-2"
                                            />
                                            <span className="text-sm font-medium">Individual Selection</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Class/Section Info */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-blue-200">
                                    <p className="font-semibold text-gray-800">
                                        {collectionMode === 'bulk' ? 'Bulk Fee Collection' : 'Individual Fee Collection'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Class: {selectedClass} | Section: {selectedSection} | 
                                        {collectionMode === 'bulk' 
                                            ? ` Students: ${students.length}` 
                                            : ` Selected: ${selectedStudents.length}/${students.length}`
                                        }
                                    </p>
                                </div>

                                    {/* Fee Categories */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">Add Fees</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {feeCategories.map((category, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => addFee(category)}
                                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                                                >
                                                    + {category.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedFees.length > 0 ? (
                                        <>
                                            {/* Selected Fees */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-3">Selected Fees</label>
                                                <div className="space-y-2">
                                                    {selectedFees.map((fee, index) => (
                                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                                            <div>
                                                                <p className="font-semibold text-sm">{fee.feeCategory}</p>
                                                                {fee.description && (
                                                                    <p className="text-xs text-gray-600">{fee.description}</p>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-bold">৳{fee.amount}</span>
                                                                <button
                                                                    onClick={() => removeFee(index)}
                                                                    className="text-red-500 hover:text-red-700 font-bold"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Payment Details */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
                                                <select
                                                    value={paymentMethod}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="Cash">Cash</option>
                                                    <option value="Card">Card</option>
                                                    <option value="Bank Transfer">Bank Transfer</option>
                                                    <option value="Online">Online</option>
                                                    <option value="Cheque">Cheque</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Paid Amount (৳)</label>
                                                <input
                                                    type="number"
                                                    value={paidAmount}
                                                    onChange={(e) => setPaidAmount(e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter amount"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks (Optional)</label>
                                                <textarea
                                                    value={remarks}
                                                    onChange={(e) => setRemarks(e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    rows="2"
                                                    placeholder="Add any remarks..."
                                                ></textarea>
                                            </div>

                                            {/* Summary */}
                                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border-2 border-gray-200">
                                                <div className="flex justify-between mb-2">
                                                    <span className="font-semibold">Total Amount:</span>
                                                    <span className="font-bold">৳{calculateTotals().total}</span>
                                                </div>
                                                <div className="flex justify-between mb-2">
                                                    <span className="font-semibold text-green-600">Paid Amount:</span>
                                                    <span className="font-bold text-green-600">৳{calculateTotals().paid}</span>
                                                </div>
                                                <div className="flex justify-between pt-2 border-t-2 border-gray-300">
                                                    <span className="font-semibold text-red-600">Due Amount:</span>
                                                    <span className="font-bold text-red-600">৳{calculateTotals().due}</span>
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <button
                                                onClick={collectFee}
                                                disabled={loading}
                                                className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
                                            >
                                                {loading ? 'Processing...' : `💰 Collect Fees for ${
                                                    collectionMode === 'bulk' 
                                                        ? `${students.length} Students` 
                                                        : `${selectedStudents.length} Selected Student${selectedStudents.length !== 1 ? 's' : ''}`
                                                }`}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="text-6xl mb-4">💰</div>
                                            <p className="text-gray-600">
                                                {collectionMode === 'bulk' 
                                                    ? 'Add fees to collect for all students' 
                                                    : 'Add fees and select students to collect fees'
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                {/* Fee Records Mode */}
                {viewMode === 'records' && selectedClass && selectedSection && (
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">📋 Fee Records ({feeRecords.length})</h2>
                                {statistics && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        Total: {statistics.totalRecords} | Paid: {statistics.paidCount} | Unpaid: {statistics.totalRecords - statistics.paidCount}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                {selectedRecords.length > 0 && (
                                    <button
                                        onClick={deleteSelectedRecords}
                                        disabled={loading}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all disabled:opacity-50"
                                    >
                                        🗑️ Delete ({selectedRecords.length})
                                    </button>
                                )}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Filter Records</label>
                                    <select
                                        value={recordFilter}
                                        onChange={(e) => setRecordFilter(e.target.value)}
                                        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">All Records</option>
                                        <option value="paid">Paid Only</option>
                                        <option value="unpaid">Unpaid Only</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        {feeRecords.length > 0 && (
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={selectAllRecords}
                                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700"
                                    >
                                        Select All
                                    </button>
                                    <button
                                        onClick={deselectAllRecords}
                                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm font-semibold hover:bg-gray-700"
                                    >
                                        Deselect All
                                    </button>
                                </div>
                                <span className="text-sm text-gray-600">
                                    {selectedRecords.length} of {feeRecords.length} selected
                                </span>
                            </div>
                        )}
                        
                        {feeRecords.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                            <th className="px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRecords.length === feeRecords.length && feeRecords.length > 0}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            selectAllRecords();
                                                        } else {
                                                            deselectAllRecords();
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                            </th>
                                            <th className="px-4 py-3 text-left">Receipt No</th>
                                            <th className="px-4 py-3 text-left">Date</th>
                                            <th className="px-4 py-3 text-left">Student</th>
                                            <th className="px-4 py-3 text-left">Roll</th>
                                            <th className="px-4 py-3 text-right">Total (৳)</th>
                                            <th className="px-4 py-3 text-right">Paid (৳)</th>
                                            <th className="px-4 py-3 text-right">Due (৳)</th>
                                            <th className="px-4 py-3 text-center">Status</th>
                                            <th className="px-4 py-3 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {feeRecords.map((record, index) => (
                                            <tr key={index} className={`border-b hover:bg-blue-50 transition-colors ${
                                                selectedRecords.some(r => r._id === record._id) ? 'bg-blue-50' : ''
                                            }`}>
                                                <td className="px-4 py-3 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRecords.some(r => r._id === record._id)}
                                                        onChange={() => toggleRecordSelection(record)}
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 font-mono text-sm">{record.receiptNumber}</td>
                                                <td className="px-4 py-3 text-sm">{new Date(record.paymentDate).toLocaleDateString()}</td>
                                                <td className="px-4 py-3">{record.studentName}</td>
                                                <td className="px-4 py-3">{record.rollNumber}</td>
                                                <td className="px-4 py-3 text-right font-semibold">{record.totalAmount.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right font-semibold text-green-600">{record.paidAmount.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right font-semibold text-red-600">{record.dueAmount.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <select
                                                        value={record.status}
                                                        onChange={(e) => updateFeeStatus(record._id, e.target.value)}
                                                        className={`px-3 py-1 rounded-full text-sm font-bold border-0 ${
                                                            record.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                                            record.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                                                            record.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        <option value="Paid">Paid</option>
                                                        <option value="Partial">Partial</option>
                                                        <option value="Pending">Pending</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => viewReceipt(record)}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all"
                                                    >
                                                        📄 View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📋</div>
                                <p className="text-gray-600">No fee records found for this class and section</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {(!selectedClass || !selectedSection) && (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="text-6xl mb-4">🎯</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Get Started</h3>
                        <p className="text-gray-600">Select class and section to manage fees</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeesManagementPage;