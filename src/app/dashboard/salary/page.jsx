'use client';

import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../../../config/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SalaryManagementPage = () => {
    // State management
    const [salaries, setSalaries] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [employeeTypes, setEmployeeTypes] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [employees, setEmployees] = useState([]);

    // Filters
    const [filters, setFilters] = useState({
        employeeType: '',
        department: '',
        status: '',
        salaryMonth: '',
        salaryYear: new Date().getFullYear().toString(),
        academicYear: new Date().getFullYear().toString(),
        startDate: '',
        endDate: '',
        search: ''
    });

    // Form states
    const [showForm, setShowForm] = useState(false);
    const [editingSalary, setEditingSalary] = useState(null);
    const [formData, setFormData] = useState({
        employeeId: '',
        employeeName: '',
        employeeType: 'Teacher',
        department: 'Academic',
        designation: '',
        academicYear: new Date().getFullYear().toString(),
        salaryMonth: new Date().toISOString().slice(0, 7), // YYYY-MM format
        salaryYear: new Date().getFullYear(),

        // Salary Structure
        basicSalary: '',
        houseRentAllowance: '',
        conveyanceAllowance: '',
        medicalAllowance: '',
        specialAllowance: '',

        // Deductions
        providentFund: '',
        professionalTax: '',
        incomeTax: '',
        loanDeduction: '',

        // Additional
        workingDays: 30,
        presentDays: 30,
        leaveDays: 0,
        overtimeHours: 0,
        overtimeRate: 0,
        performanceBonus: '',
        annualBonus: '',

        // Payment
        paymentMethod: 'Bank Transfer',
        bankAccount: {
            accountNumber: '',
            bankName: '',
            ifscCode: ''
        },

        // Notes
        notes: ''
    });

    // UI states
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'cards', 'analytics', 'slips'
    const [selectedSalaries, setSelectedSalaries] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [selectedSlip, setSelectedSlip] = useState(null);

    // Employee types
    const employeeTypeOptions = [
        'Teacher',
        'Staff',
        'Admin',
        'Principal',
        'Librarian',
        'Accountant',
        'Security Guard',
        'Maintenance Staff'
    ];

    // Departments
    const departmentOptions = [
        'Academic',
        'Administration',
        'Maintenance',
        'IT',
        'Finance',
        'HR',
        'Security',
        'Library'
    ];

    // Payment methods
    const paymentMethods = [
        'Bank Transfer',
        'Cash',
        'Cheque',
        'Online'
    ];

    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchSalaries(),
                    fetchStatistics(),
                    fetchHelperData(),
                    fetchEmployees()
                ]);
            } catch (error) {
                console.error('Error loading initial data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    // Fetch salaries with filters
    const fetchSalaries = async () => {
        try {
            const queryParams = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });

            const response = await fetch(`${API_BASE_URL}/salaries?${queryParams}`);
            const data = await response.json();

            if (data.success) {
                setSalaries(data.data);
            }
        } catch (error) {
            console.error('Error fetching salaries:', error);
            Swal.fire('Error', 'Failed to load salaries', 'error');
        }
    };

    // Fetch statistics
    const fetchStatistics = async () => {
        try {
            const queryParams = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value && key !== 'search') queryParams.append(key, value);
            });

            const response = await fetch(`${API_BASE_URL}/salaries/statistics?${queryParams}`);
            const data = await response.json();

            if (data.success) {
                setStatistics(data.data);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    // Fetch helper data
    const fetchHelperData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/salaries/helpers`);
            const data = await response.json();
            if (data.success) {
                setDepartments(data.data.departments);
                setEmployeeTypes(data.data.employeeTypes);
                setDesignations(data.data.designations);
            }
        } catch (error) {
            console.error('Error fetching helper data:', error);
        }
    };

    // Fetch employees
    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/teachers`);
            const data = await response.json();
            if (data.success) {
                setEmployees(data.data);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    // Handle filter changes
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    // Apply filters
    const applyFilters = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchSalaries(),
                fetchStatistics()
            ]);
        } catch (error) {
            console.error('Error applying filters:', error);
        } finally {
            setLoading(false);
        }
    };

    // Clear filters
    const clearFilters = () => {
        setFilters({
            employeeType: '',
            department: '',
            status: '',
            salaryMonth: '',
            salaryYear: new Date().getFullYear().toString(),
            academicYear: new Date().getFullYear().toString(),
            startDate: '',
            endDate: '',
            search: ''
        });
        setTimeout(() => {
            fetchSalaries();
            fetchStatistics();
        }, 100);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.employeeId || !formData.basicSalary) {
            Swal.fire('Error', 'Please fill the required fields: Employee and Basic Salary', 'error');
            return;
        }

        // Check for duplicate salary record (only for new records)
        if (!editingSalary) {
            try {
                const checkResponse = await fetch(`${API_BASE_URL}/salaries?employeeId=${formData.employeeId}&salaryMonth=${formData.salaryMonth}&salaryYear=${formData.salaryYear}`);
                const checkData = await checkResponse.json();
                if (checkData.success && checkData.data.length > 0) {
                    Swal.fire('Error', 'A salary record already exists for this employee for the selected month and year. Please edit the existing record instead.', 'error');
                    return;
                }
            } catch (error) {
                console.error('Error checking for duplicate salary:', error);
                // Continue with submission if check fails
            }
        }

        try {
            setLoading(true);
            const url = editingSalary
                ? `${API_BASE_URL}/salaries/${editingSalary._id}`
                : `${API_BASE_URL}/salaries`;

            const method = editingSalary ? 'PUT' : 'POST';

            // Convert string values to numbers for proper calculation
            const processedData = {
                ...formData,
                basicSalary: parseFloat(formData.basicSalary) || 0,
                houseRentAllowance: parseFloat(formData.houseRentAllowance) || 0,
                conveyanceAllowance: parseFloat(formData.conveyanceAllowance) || 0,
                medicalAllowance: parseFloat(formData.medicalAllowance) || 0,
                specialAllowance: parseFloat(formData.specialAllowance) || 0,
                performanceBonus: parseFloat(formData.performanceBonus) || 0,
                annualBonus: parseFloat(formData.annualBonus) || 0,
                providentFund: parseFloat(formData.providentFund) || 0,
                professionalTax: parseFloat(formData.professionalTax) || 0,
                incomeTax: parseFloat(formData.incomeTax) || 0,
                loanDeduction: parseFloat(formData.loanDeduction) || 0,
                workingDays: parseInt(formData.workingDays) || 30,
                presentDays: parseInt(formData.presentDays) || 30,
                leaveDays: parseInt(formData.leaveDays) || 0,
                overtimeHours: parseFloat(formData.overtimeHours) || 0,
                overtimeRate: parseFloat(formData.overtimeRate) || 0,
                salaryYear: parseInt(formData.salaryYear) || new Date().getFullYear()
            };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(processedData)
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire('Success',
                    editingSalary ? 'Salary updated successfully' : 'Salary created successfully',
                    'success'
                );

                setShowForm(false);
                setEditingSalary(null);
                resetForm();
                
                if (!editingSalary) {
                    // Add new salary to the list immediately
                    setSalaries(prev => [data.data, ...prev]);
                } else {
                    // Update existing salary in the list
                    setSalaries(prev => prev.map(s => s._id === data.data._id ? data.data : s));
                }
                
                fetchStatistics();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error saving salary:', error);
            Swal.fire('Error', error.message || 'Failed to save salary', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            employeeId: '',
            employeeName: '',
            employeeType: 'Teacher',
            department: 'Academic',
            designation: '',
            academicYear: new Date().getFullYear().toString(),
            salaryMonth: new Date().toISOString().slice(0, 7),
            salaryYear: new Date().getFullYear(),

            basicSalary: '',
            houseRentAllowance: '',
            conveyanceAllowance: '',
            medicalAllowance: '',
            specialAllowance: '',

            providentFund: '',
            professionalTax: '',
            incomeTax: '',
            loanDeduction: '',

            workingDays: 30,
            presentDays: 30,
            leaveDays: 0,
            overtimeHours: 0,
            overtimeRate: 0,
            performanceBonus: '',
            annualBonus: '',

            paymentMethod: 'Bank Transfer',
            bankAccount: {
                accountNumber: '',
                bankName: '',
                ifscCode: ''
            },

            notes: ''
        });
    };

    // Edit salary
    const editSalary = (salary) => {
        setEditingSalary(salary);
        setFormData({
            employeeId: salary.employeeId._id || salary.employeeId,
            employeeName: salary.employeeName,
            employeeType: salary.employeeType,
            department: salary.department,
            designation: salary.designation,
            academicYear: salary.academicYear,
            salaryMonth: salary.salaryMonth,
            salaryYear: salary.salaryYear,

            basicSalary: salary.basicSalary.toString(),
            houseRentAllowance: salary.houseRentAllowance.toString(),
            conveyanceAllowance: salary.conveyanceAllowance.toString(),
            medicalAllowance: salary.medicalAllowance.toString(),
            specialAllowance: salary.specialAllowance.toString(),

            providentFund: salary.providentFund.toString(),
            professionalTax: salary.professionalTax.toString(),
            incomeTax: salary.incomeTax.toString(),
            loanDeduction: salary.loanDeduction.toString(),

            workingDays: salary.workingDays,
            presentDays: salary.presentDays,
            leaveDays: salary.leaveDays,
            overtimeHours: salary.overtimeHours,
            overtimeRate: salary.overtimeRate,
            performanceBonus: salary.performanceBonus.toString(),
            annualBonus: salary.annualBonus.toString(),

            paymentMethod: salary.paymentMethod,
            bankAccount: salary.bankAccount || {
                accountNumber: '',
                bankName: '',
                ifscCode: ''
            },

            notes: salary.notes || ''
        });
        setShowForm(true);
    };

    // Delete salary
    const deleteSalary = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Salary Record?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Delete'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_BASE_URL}/salaries/${id}`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire('Deleted!', 'Salary record deleted successfully', 'success');
                    fetchSalaries();
                    fetchStatistics();
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error('Error deleting salary:', error);
                Swal.fire('Error', 'Failed to delete salary record', 'error');
            }
        }
    };

    // Approve salary
    const approveSalary = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/salaries/${id}/approve`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approvedBy: 'Admin' })
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire('Approved!', 'Salary approved successfully', 'success');
                fetchSalaries();
                fetchStatistics();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error approving salary:', error);
            Swal.fire('Error', 'Failed to approve salary', 'error');
        }
    };

    // Reject salary
    const rejectSalary = async (id) => {
        const { value: reason } = await Swal.fire({
            title: 'Reject Salary',
            input: 'textarea',
            inputLabel: 'Rejection Reason',
            inputPlaceholder: 'Enter reason for rejection...',
            inputValidator: (value) => {
                if (!value) {
                    return 'Rejection reason is required!';
                }
            },
            showCancelButton: true,
            confirmButtonColor: '#ef4444'
        });

        if (reason) {
            try {
                const response = await fetch(`${API_BASE_URL}/salaries/${id}/reject`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rejectionReason: reason, rejectedBy: 'Admin' })
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire('Rejected!', 'Salary rejected successfully', 'success');
                    fetchSalaries();
                    fetchStatistics();
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error('Error rejecting salary:', error);
                Swal.fire('Error', 'Failed to reject salary', 'error');
            }
        }
    };

    // Mark as paid
    const markAsPaid = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/salaries/${id}/mark-paid`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentDate: new Date() })
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire('Paid!', 'Salary marked as paid successfully', 'success');
                fetchSalaries();
                fetchStatistics();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error marking as paid:', error);
            Swal.fire('Error', 'Failed to mark salary as paid', 'error');
        }
    };

    // Bulk approve
    const bulkApprove = async () => {
        if (selectedSalaries.length === 0) {
            Swal.fire('Error', 'Please select salaries to approve', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/salaries/bulk/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    salaryIds: selectedSalaries,
                    approvedBy: 'Admin'
                })
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire('Success!', `${data.count} salaries approved successfully`, 'success');
                setSelectedSalaries([]);
                setShowBulkActions(false);
                fetchSalaries();
                fetchStatistics();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error bulk approving:', error);
            Swal.fire('Error', 'Failed to bulk approve salaries', 'error');
        }
    };

    // Bulk delete
    const bulkDelete = async () => {
        if (selectedSalaries.length === 0) {
            Swal.fire('Error', 'Please select salaries to delete', 'error');
            return;
        }

        const result = await Swal.fire({
            title: 'Delete Selected Salaries?',
            text: `This will delete ${selectedSalaries.length} salary records. This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Delete All'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_BASE_URL}/salaries/bulk/delete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ salaryIds: selectedSalaries })
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire('Deleted!', `${data.count} salaries deleted successfully`, 'success');
                    setSelectedSalaries([]);
                    setShowBulkActions(false);
                    fetchSalaries();
                    fetchStatistics();
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error('Error bulk deleting:', error);
                Swal.fire('Error', 'Failed to bulk delete salaries', 'error');
            }
        }
    };

    // Generate salary slip
    const generateSalarySlip = async (salaryId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/salaries/${salaryId}/slip`);
            const data = await response.json();

            if (data.success) {
                setSelectedSlip(data.data);
                setViewMode('slips');
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error generating salary slip:', error);
            Swal.fire('Error', 'Failed to generate salary slip', 'error');
        }
    };

    // Export salary slips to PDF
    const exportSalarySlipToPDF = () => {
        if (!selectedSlip) {
            Swal.fire('Error', 'No salary slip selected', 'error');
            return;
        }

        Swal.fire({
            title: 'Generating PDF...',
            text: 'Please wait',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const element = document.getElementById('salary-slip');
        if (!element) {
            Swal.fire('Error', 'Salary slip element not found', 'error');
            return;
        }

        html2canvas(element, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`Salary_Slip_${selectedSlip.salaryId}_${new Date().toISOString().split('T')[0]}.pdf`);

            Swal.close();
            Swal.fire('Success', 'Salary slip exported successfully', 'success');
        }).catch(error => {
            console.error('PDF generation error:', error);
            Swal.fire('Error', 'Failed to generate PDF', 'error');
        });
    };

    // Export to Excel
    const exportToExcel = () => {
        if (salaries.length === 0) {
            Swal.fire('Error', 'No salaries to export', 'error');
            return;
        }

        // Create CSV content
        let csvContent = `Salary Report\n`;
        csvContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

        // Headers
        const headers = [
            'Salary ID', 'Employee Name', 'Employee Type', 'Department', 'Designation',
            'Basic Salary', 'Gross Salary', 'Net Salary', 'Month', 'Year', 'Status'
        ];
        csvContent += headers.join(',') + '\n';

        // Data rows
        salaries.forEach(salary => {
            const row = [
                salary.salaryId,
                `"${salary.employeeName}"`,
                salary.employeeType,
                salary.department,
                `"${salary.designation}"`,
                salary.basicSalary,
                salary.grossSalary,
                salary.netSalary,
                salary.salaryMonth,
                salary.salaryYear,
                salary.status
            ];
            csvContent += row.join(',') + '\n';
        });

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Salaries_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        Swal.fire('Success', 'Salaries exported to Excel', 'success');
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Approved': return 'bg-blue-100 text-blue-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            case 'Hold': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Handle employee selection
    const handleEmployeeChange = (employeeId) => {
        const selectedEmployee = employees.find(emp => emp._id === employeeId);
        if (selectedEmployee) {
            setFormData(prev => ({
                ...prev,
                employeeId,
                employeeName: selectedEmployee.name,
                designation: selectedEmployee.designation || '',
                department: selectedEmployee.department || prev.department
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="container mx-auto">
                {/* Professional Header */}
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 mb-8 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between flex-wrap gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/25">
                                    <span className="text-white text-2xl">💰</span>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                        Salary Management System
                                    </h1>
                                    <p className="text-slate-600 mt-2 text-lg">Professional payroll processing and employee compensation management</p>
                                </div>
                            </div>

                            {/* Professional View Mode Buttons */}
                            <div className="flex gap-3 flex-wrap">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg ${
                                        viewMode === 'list'
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/25'
                                            : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-300 hover:shadow-xl'
                                    }`}
                                >
                                    📋 List View
                                </button>
                                <button
                                    onClick={() => setViewMode('cards')}
                                    className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg ${
                                        viewMode === 'cards'
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/25'
                                            : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-purple-300 hover:shadow-xl'
                                    }`}
                                >
                                    🎴 Cards View
                                </button>
                                <button
                                    onClick={() => setViewMode('analytics')}
                                    className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg ${
                                        viewMode === 'analytics'
                                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/25'
                                            : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-300 hover:shadow-xl'
                                    }`}
                                >
                                    📊 Analytics
                                </button>
                                <button
                                    onClick={() => setViewMode('slips')}
                                    className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg ${
                                        viewMode === 'slips'
                                            ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-rose-500/25'
                                            : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-rose-300 hover:shadow-xl'
                                    }`}
                                >
                                    📄 Salary Slips
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Professional Statistics Cards */}
                {statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-between">
                                <div className="space-y-3">
                                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Total Salaries</p>
                                    <p className="text-4xl font-bold text-slate-800">{statistics.totalRecords || 0}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-xs text-slate-500 font-medium">Active Records</span>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                    <span className="text-2xl">👥</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-between">
                                <div className="space-y-3">
                                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Total Gross Salary</p>
                                    <p className="text-4xl font-bold text-slate-800">৳{(statistics.totalGrossSalary || 0).toLocaleString()}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                        <span className="text-xs text-slate-500 font-medium">Before Deductions</span>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                    <span className="text-2xl">💰</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-between">
                                <div className="space-y-3">
                                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Total Net Salary</p>
                                    <p className="text-4xl font-bold text-slate-800">৳{(statistics.totalNetSalary || 0).toLocaleString()}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <span className="text-xs text-slate-500 font-medium">After Deductions</span>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                                    <span className="text-2xl">💵</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-between">
                                <div className="space-y-3">
                                    <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Total Deductions</p>
                                    <p className="text-4xl font-bold text-slate-800">৳{(statistics.totalDeductions || 0).toLocaleString()}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                        <span className="text-xs text-slate-500 font-medium">Tax & Contributions</span>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                                    <span className="text-2xl">📉</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Professional Filters Section */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center">
                                <span className="text-white text-lg">🔍</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Advanced Filters</h2>
                                <p className="text-slate-600 text-sm">Filter and search salary records efficiently</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={applyFilters}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center gap-2"
                            >
                                <span>🔍</span>
                                <span>Apply Filters</span>
                            </button>
                            <button
                                onClick={clearFilters}
                                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all duration-300 transform hover:scale-105 border-2 border-slate-200 hover:border-slate-300"
                            >
                                🗑️ Clear All
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* Professional Search Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">🔍 Search Employees</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    placeholder="Search by name, ID, or designation..."
                                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-slate-50 focus:bg-white text-slate-700 placeholder-slate-400 font-medium"
                                />
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                                    <span className="text-lg">🔍</span>
                                </div>
                            </div>
                        </div>

                        {/* Employee Type */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">👤 Employee Type</label>
                            <select
                                value={filters.employeeType}
                                onChange={(e) => handleFilterChange('employeeType', e.target.value)}
                                className="w-full px-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-slate-50 focus:bg-white text-slate-700 font-medium"
                            >
                                <option value="">All Employee Types</option>
                                {employeeTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Department */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">🏢 Department</label>
                            <select
                                value={filters.department}
                                onChange={(e) => handleFilterChange('department', e.target.value)}
                                className="w-full px-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-slate-50 focus:bg-white text-slate-700 font-medium"
                            >
                                <option value="">All Departments</option>
                                {departments.map((dept, index) => (
                                    <option key={index} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">📊 Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full px-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-slate-50 focus:bg-white text-slate-700 font-medium"
                            >
                                <option value="">All Status</option>
                                <option value="Draft">📝 Draft</option>
                                <option value="Pending">⏳ Pending</option>
                                <option value="Approved">✅ Approved</option>
                                <option value="Rejected">❌ Rejected</option>
                                <option value="Paid">💰 Paid</option>
                                <option value="Hold">⏸️ Hold</option>
                            </select>
                        </div>

                        {/* Salary Month */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">📅 Salary Month</label>
                            <input
                                type="month"
                                value={filters.salaryMonth}
                                onChange={(e) => handleFilterChange('salaryMonth', e.target.value)}
                                className="w-full px-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-slate-50 focus:bg-white text-slate-700 font-medium"
                            />
                        </div>

                        {/* Salary Year */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">📆 Salary Year</label>
                            <input
                                type="number"
                                value={filters.salaryYear}
                                onChange={(e) => handleFilterChange('salaryYear', e.target.value)}
                                placeholder="2026"
                                className="w-full px-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-slate-50 focus:bg-white text-slate-700 font-medium"
                            />
                        </div>

                        {/* Academic Year */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">🎓 Academic Year</label>
                            <input
                                type="text"
                                value={filters.academicYear}
                                onChange={(e) => handleFilterChange('academicYear', e.target.value)}
                                placeholder="2025-2026"
                                className="w-full px-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-slate-50 focus:bg-white text-slate-700 font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Action Buttons */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 mb-8">
                    <div className="flex flex-wrap gap-4 justify-between items-center">
                        <div className="flex gap-3 flex-wrap">
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                            >
                                <span>➕</span>
                                <span>Add Salary</span>
                            </button>

                            {selectedSalaries.length > 0 && (
                                <>
                                    <button
                                        onClick={() => setShowBulkActions(!showBulkActions)}
                                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center gap-2"
                                    >
                                        <span>⚡</span>
                                        <span>Bulk Actions ({selectedSalaries.length})</span>
                                    </button>

                                    {showBulkActions && (
                                        <div className="flex gap-3 flex-wrap">
                                            <button
                                                onClick={bulkApprove}
                                                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                                            >
                                                <span>✅</span>
                                                <span>Approve All</span>
                                            </button>
                                            <button
                                                onClick={bulkDelete}
                                                className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25 flex items-center gap-2"
                                            >
                                                <span>🗑️</span>
                                                <span>Delete All</span>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex gap-3 flex-wrap">
                            <button
                                onClick={exportToExcel}
                                className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                            >
                                <span>📊</span>
                                <span>Export Excel</span>
                            </button>
                            {selectedSlip && (
                                <button
                                    onClick={exportSalarySlipToPDF}
                                    className="px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-rose-500/25 flex items-center gap-2"
                                >
                                    <span>📄</span>
                                    <span>Export Salary Slip PDF</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Professional Add/Edit Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md bg-black/20">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                                            <span className="text-white text-xl">
                                                {editingSalary ? '✏️' : '➕'}
                                            </span>
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-slate-800">
                                                {editingSalary ? 'Edit Salary Record' : 'Add New Salary'}
                                            </h2>
                                            <p className="text-slate-600 mt-1">
                                                {editingSalary ? 'Update employee salary details' : 'Create a new salary entry for an employee'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingSalary(null);
                                            resetForm();
                                        }}
                                        className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center justify-center text-slate-600 hover:text-slate-800 transition-all duration-300"
                                    >
                                        <span className="text-xl">×</span>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Employee Selection */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Employee *
                                            </label>
                                            <select
                                                value={formData.employeeId}
                                                onChange={(e) => handleEmployeeChange(e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                required
                                            >
                                                <option value="">Select Employee</option>
                                                {employees.map((employee) => (
                                                    <option key={employee._id} value={employee._id}>
                                                        {employee.name} - {employee.designation}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Employee Type */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Employee Type
                                            </label>
                                            <select
                                                value={formData.employeeType}
                                                onChange={(e) => setFormData({...formData, employeeType: e.target.value})}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            >
                                                {employeeTypeOptions.map((type, index) => (
                                                    <option key={index} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Department */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Department
                                            </label>
                                            <select
                                                value={formData.department}
                                                onChange={(e) => setFormData({...formData, department: e.target.value})}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            >
                                                {departmentOptions.map((dept, index) => (
                                                    <option key={index} value={dept}>{dept}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Designation */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Designation
                                            </label>
                                            <select
                                                value={formData.designation}
                                                onChange={(e) => setFormData({...formData, designation: e.target.value})}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            >
                                                <option value="">Select Designation</option>
                                                {designations.map((desig, index) => (
                                                    <option key={index} value={desig}>{desig}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Salary Month */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Salary Month
                                            </label>
                                            <input
                                                type="month"
                                                value={formData.salaryMonth}
                                                onChange={(e) => setFormData({...formData, salaryMonth: e.target.value})}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        {/* Academic Year */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Academic Year
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.academicYear}
                                                onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="2025-2026"
                                            />
                                        </div>
                                    </div>

                                    {/* Salary Structure */}
                                    <div className="bg-blue-50 rounded-lg p-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">💰 Salary Structure</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Basic Salary */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Basic Salary (৳) *
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.basicSalary}
                                                    onChange={(e) => setFormData({...formData, basicSalary: e.target.value})}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                    required
                                                />
                                            </div>

                                            {/* House Rent Allowance */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    House Rent Allowance (৳)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.houseRentAllowance}
                                                    onChange={(e) => setFormData({...formData, houseRentAllowance: e.target.value})}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                />
                                            </div>

                                            {/* Conveyance Allowance */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Conveyance Allowance (৳)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.conveyanceAllowance}
                                                    onChange={(e) => setFormData({...formData, conveyanceAllowance: e.target.value})}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                />
                                            </div>

                                            {/* Medical Allowance */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Medical Allowance (৳)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.medicalAllowance}
                                                    onChange={(e) => setFormData({...formData, medicalAllowance: e.target.value})}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                />
                                            </div>

                                            {/* Special Allowance */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Special Allowance (৳)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.specialAllowance}
                                                    onChange={(e) => setFormData({...formData, specialAllowance: e.target.value})}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                />
                                            </div>

                                            {/* Performance Bonus */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Performance Bonus (৳)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.performanceBonus}
                                                    onChange={(e) => setFormData({...formData, performanceBonus: e.target.value})}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Deductions */}
                                    <div className="bg-red-50 rounded-lg p-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">📉 Deductions</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Provident Fund */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Provident Fund (৳)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.providentFund}
                                                    onChange={(e) => setFormData({...formData, providentFund: e.target.value})}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                />
                                            </div>

                                            {/* Professional Tax */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Professional Tax (৳)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.professionalTax}
                                                    onChange={(e) => setFormData({...formData, professionalTax: e.target.value})}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                />
                                            </div>

                                            {/* Income Tax */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Income Tax (৳)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.incomeTax}
                                                    onChange={(e) => setFormData({...formData, incomeTax: e.target.value})}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="0.00"
                                                    step="0.01"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Attendance & Overtime */}
                                    <div className="bg-green-50 rounded-lg p-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">📅 Attendance & Overtime</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {/* Working Days */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Working Days
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.workingDays}
                                                    onChange={(e) => setFormData({...formData, workingDays: parseInt(e.target.value)})}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    min="1"
                                                    max="31"
                                                />
                                            </div>

                                            {/* Present Days */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Present Days
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.presentDays}
                                                    onChange={(e) => setFormData({...formData, presentDays: parseInt(e.target.value)})}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    min="0"
                                                    max={formData.workingDays}
                                                />
                                            </div>

                                            {/* Overtime Hours */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Overtime Hours
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.overtimeHours}
                                                    onChange={(e) => setFormData({...formData, overtimeHours: parseFloat(e.target.value)})}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    step="0.5"
                                                    min="0"
                                                />
                                            </div>

                                            {/* Overtime Rate */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Overtime Rate (৳/hour)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.overtimeRate}
                                                    onChange={(e) => setFormData({...formData, overtimeRate: parseFloat(e.target.value)})}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    step="0.01"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Information */}
                                    <div className="bg-purple-50 rounded-lg p-6">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">💳 Payment Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Payment Method */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Payment Method
                                                </label>
                                                <select
                                                    value={formData.paymentMethod}
                                                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                >
                                                    {paymentMethods.map((method, index) => (
                                                        <option key={index} value={method}>{method}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Bank Account Number */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Account Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.bankAccount.accountNumber}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        bankAccount: {...formData.bankAccount, accountNumber: e.target.value}
                                                    })}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Bank account number"
                                                />
                                            </div>

                                            {/* Bank Name */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Bank Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.bankAccount.bankName}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        bankAccount: {...formData.bankAccount, bankName: e.target.value}
                                                    })}
                                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="Bank name"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Notes
                                        </label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            rows="3"
                                            placeholder="Additional notes..."
                                        ></textarea>
                                    </div>

                                    {/* Professional Submit Buttons */}
                                    <div className="flex gap-4 justify-end pt-8 border-t border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowForm(false);
                                                setEditingSalary(null);
                                                resetForm();
                                            }}
                                            className="px-8 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all duration-300 transform hover:scale-105 border-2 border-slate-200 hover:border-slate-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg shadow-blue-500/25 flex items-center gap-2"
                                        >
                                            {loading && (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            )}
                                            <span>{loading ? 'Saving...' : (editingSalary ? 'Update Salary' : 'Create Salary')}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Professional Salaries List View */}
                {viewMode === 'list' && (
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                        <div className="p-8 border-b border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                                    <span className="text-white text-lg">📋</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Salary Records</h2>
                                    <p className="text-slate-600 text-sm">{salaries.length} total salary entries</p>
                                </div>
                            </div>
                        </div>

                        {salaries.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left">
                                                <input
                                                    type="checkbox"
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedSalaries(salaries.map(salary => salary._id));
                                                        } else {
                                                            setSelectedSalaries([]);
                                                        }
                                                    }}
                                                    checked={selectedSalaries.length === salaries.length && salaries.length > 0}
                                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </th>
                                            <th className="px-6 py-4 text-left font-bold text-slate-700">Salary ID</th>
                                            <th className="px-6 py-4 text-left font-bold text-slate-700">Employee</th>
                                            <th className="px-6 py-4 text-left font-bold text-slate-700">Department</th>
                                            <th className="px-6 py-4 text-left font-bold text-slate-700">Month/Year</th>
                                            <th className="px-6 py-4 text-right font-bold text-slate-700">Basic Salary</th>
                                            <th className="px-6 py-4 text-right font-bold text-slate-700">Net Salary</th>
                                            <th className="px-6 py-4 text-center font-bold text-slate-700">Status</th>
                                            <th className="px-6 py-4 text-center font-bold text-slate-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salaries.map((salary, index) => (
                                            <tr key={salary._id} className="border-b border-slate-100 hover:bg-slate-50 transition-all duration-200">
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSalaries.includes(salary._id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedSalaries([...selectedSalaries, salary._id]);
                                                            } else {
                                                                setSelectedSalaries(selectedSalaries.filter(id => id !== salary._id));
                                                            }
                                                        }}
                                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{salary.salaryId}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="font-bold text-slate-800">{salary.employeeName}</div>
                                                        <div className="text-sm text-slate-500">{salary.designation}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{salary.department}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="font-semibold text-slate-700">{salary.salaryMonth}/{salary.salaryYear}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-bold text-slate-800">৳{(salary.basicSalary || 0).toFixed(2)}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-bold text-emerald-600">৳{(salary.netSalary || 0).toFixed(2)}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(salary.status)}`}>
                                                        {salary.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => editSalary(salary)}
                                                            className="p-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 shadow-lg shadow-blue-500/25"
                                                            title="Edit Salary"
                                                        >
                                                            ✏️
                                                        </button>

                                                        <button
                                                            onClick={() => generateSalarySlip(salary._id)}
                                                            className="p-2 bg-purple-600 text-white rounded-xl text-sm hover:bg-purple-700 transition-all duration-300 transform hover:scale-110 shadow-lg shadow-purple-500/25"
                                                            title="Generate Salary Slip"
                                                        >
                                                            📄
                                                        </button>

                                                        {salary.status === 'Pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => approveSalary(salary._id)}
                                                                    className="p-2 bg-emerald-600 text-white rounded-xl text-sm hover:bg-emerald-700 transition-all duration-300 transform hover:scale-110 shadow-lg shadow-emerald-500/25"
                                                                    title="Approve Salary"
                                                                >
                                                                    ✅
                                                                </button>
                                                                <button
                                                                    onClick={() => rejectSalary(salary._id)}
                                                                    className="p-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition-all duration-300 transform hover:scale-110 shadow-lg shadow-red-500/25"
                                                                    title="Reject Salary"
                                                                >
                                                                    ❌
                                                                </button>
                                                            </>
                                                        )}

                                                        {salary.status === 'Approved' && (
                                                            <button
                                                                onClick={() => markAsPaid(salary._id)}
                                                                className="p-2 bg-orange-600 text-white rounded-xl text-sm hover:bg-orange-700 transition-all duration-300 transform hover:scale-110 shadow-lg shadow-orange-500/25"
                                                                title="Mark as Paid"
                                                            >
                                                                💰
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => deleteSalary(salary._id)}
                                                            className="p-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition-all duration-300 transform hover:scale-110 shadow-lg shadow-red-500/25"
                                                            title="Delete Salary"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                    <span className="text-4xl">📋</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">No Salary Records Found</h3>
                                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                    {Object.values(filters).some(filter => filter !== '' && filter !== new Date().getFullYear().toString())
                                        ? "No salary records match your current filters. Try adjusting your search criteria."
                                        : "Start by adding your first salary record to track employee compensation."}
                                </p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl font-bold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-emerald-500/25"
                                >
                                    ➕ Add First Salary
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Professional Cards View */}
                {viewMode === 'cards' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                                <span className="text-white text-lg">🎴</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Salary Cards</h2>
                                <p className="text-slate-600 text-sm">{salaries.length} salary records in card view</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {salaries.map((salary) => (
                                <div key={salary._id} className="bg-white rounded-3xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="space-y-2">
                                                <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{salary.employeeName}</h3>
                                                <p className="text-sm text-slate-500">{salary.designation}</p>
                                                <p className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded-lg inline-block">{salary.salaryId}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(salary.status)}`}>
                                                    {salary.status}
                                                </span>
                                                <span className="text-sm text-slate-600 font-medium">{salary.salaryMonth}/{salary.salaryYear}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600 font-medium">Department:</span>
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{salary.department}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600 font-medium">Basic Salary:</span>
                                                <span className="font-bold text-slate-800">৳{(salary.basicSalary || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600 font-medium">Gross Salary:</span>
                                                <span className="font-bold text-blue-600">৳{(salary.grossSalary || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600 font-medium">Net Salary:</span>
                                                <span className="font-bold text-emerald-600">৳{(salary.netSalary || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600 font-medium">Deductions:</span>
                                                <span className="font-bold text-red-600">৳{(salary.totalDeductions || 0).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => editSalary(salary)}
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
                                            >
                                                ✏️ Edit
                                            </button>

                                            <button
                                                onClick={() => generateSalarySlip(salary._id)}
                                                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-2xl text-sm font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25"
                                            >
                                                📄 Slip
                                            </button>

                                            {salary.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => approveSalary(salary._id)}
                                                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-2xl text-sm font-semibold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25"
                                                    >
                                                        ✅ Approve
                                                    </button>
                                                    <button
                                                        onClick={() => rejectSalary(salary._id)}
                                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-2xl text-sm font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25"
                                                    >
                                                        ❌ Reject
                                                    </button>
                                                </>
                                            )}

                                            {salary.status === 'Approved' && (
                                                <button
                                                    onClick={() => markAsPaid(salary._id)}
                                                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-2xl text-sm font-semibold hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/25"
                                                >
                                                    💰 Mark Paid
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {salaries.length === 0 && (
                            <div className="col-span-full text-center py-16">
                                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                    <span className="text-4xl">🎴</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">No Salary Records Found</h3>
                                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                    {Object.values(filters).some(filter => filter !== '' && filter !== new Date().getFullYear().toString())
                                        ? "No salary records match your current filters. Try adjusting your search criteria."
                                        : "Start by adding your first salary record to track employee compensation."}
                                </p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl font-bold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-emerald-500/25"
                                >
                                    ➕ Add First Salary
                                </button>
                            </div>
                        )}
                        </div>
                    </div>
                )}

                {/* Professional Analytics View */}
                {viewMode === 'analytics' && statistics && (
                    <div className="space-y-8">
                        {/* Analytics Header */}
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center">
                                <span className="text-white text-lg">📊</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Salary Analytics</h2>
                                <p className="text-slate-600 text-sm">Comprehensive insights into salary distribution and trends</p>
                            </div>
                        </div>

                        {/* Status Breakdown */}
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-sm">📈</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">Status Breakdown</h3>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300">
                                        <div className="text-3xl font-bold text-slate-600 mb-2">{statistics.statusCounts?.Draft || 0}</div>
                                        <div className="text-slate-600 font-medium">Draft</div>
                                        <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                                            <div className="bg-slate-500 h-2 rounded-full" style={{width: `${(statistics.statusCounts?.Draft || 0) / Math.max(Object.values(statistics.statusCounts || {}).reduce((a, b) => a + b, 0), 1) * 100}%`}}></div>
                                        </div>
                                    </div>
                                    <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 hover:shadow-lg transition-all duration-300">
                                        <div className="text-3xl font-bold text-amber-600 mb-2">{statistics.statusCounts?.Pending || 0}</div>
                                        <div className="text-slate-600 font-medium">Pending</div>
                                        <div className="w-full bg-amber-200 rounded-full h-2 mt-3">
                                            <div className="bg-amber-500 h-2 rounded-full" style={{width: `${(statistics.statusCounts?.Pending || 0) / Math.max(Object.values(statistics.statusCounts || {}).reduce((a, b) => a + b, 0), 1) * 100}%`}}></div>
                                        </div>
                                    </div>
                                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                                        <div className="text-3xl font-bold text-blue-600 mb-2">{statistics.statusCounts?.Approved || 0}</div>
                                        <div className="text-slate-600 font-medium">Approved</div>
                                        <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(statistics.statusCounts?.Approved || 0) / Math.max(Object.values(statistics.statusCounts || {}).reduce((a, b) => a + b, 0), 1) * 100}%`}}></div>
                                        </div>
                                    </div>
                                    <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 hover:shadow-lg transition-all duration-300">
                                        <div className="text-3xl font-bold text-emerald-600 mb-2">{statistics.statusCounts?.Paid || 0}</div>
                                        <div className="text-slate-600 font-medium">Paid</div>
                                        <div className="w-full bg-emerald-200 rounded-full h-2 mt-3">
                                            <div className="bg-emerald-500 h-2 rounded-full" style={{width: `${(statistics.statusCounts?.Paid || 0) / Math.max(Object.values(statistics.statusCounts || {}).reduce((a, b) => a + b, 0), 1) * 100}%`}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Department Breakdown */}
                        {statistics.departmentBreakdown && Object.keys(statistics.departmentBreakdown).length > 0 && (
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                                <div className="p-8">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                            <span className="text-white text-sm">🏢</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800">Department-wise Distribution</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {Object.entries(statistics.departmentBreakdown).map(([department, amount]) => (
                                            <div key={department} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-300">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                                                    <span className="font-semibold text-slate-700">{department}</span>
                                                </div>
                                                <span className="font-bold text-xl text-blue-600">৳{(amount || 0).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Employee Type Breakdown */}
                        {statistics.employeeTypeBreakdown && Object.keys(statistics.employeeTypeBreakdown).length > 0 && (
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                                <div className="p-8">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                            <span className="text-white text-sm">👥</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800">Employee Type Distribution</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {Object.entries(statistics.employeeTypeBreakdown).map(([type, amount]) => (
                                            <div key={type} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-300">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                                                    <span className="font-semibold text-slate-700">{type}</span>
                                                </div>
                                                <span className="font-bold text-xl text-purple-600">৳{(amount || 0).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Salary Slip View */}
                {viewMode === 'slips' && selectedSlip && (
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">📄 Salary Slip</h2>
                            <button
                                onClick={exportSalarySlipToPDF}
                                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
                            >
                                📄 Export PDF
                            </button>
                        </div>

                        <div id="salary-slip" className="bg-gray-50 rounded-lg p-8 border-2 border-gray-300">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Sunlight School</h1>
                                <p className="text-gray-600">Salary Slip for {selectedSlip.salaryDetails.month}/{selectedSlip.salaryDetails.year}</p>
                                <p className="text-sm text-gray-500">Salary ID: {selectedSlip.salaryId}</p>
                            </div>

                            {/* Employee Information */}
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Employee Details</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Name:</span>
                                            <span className="font-semibold">{selectedSlip.employee.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Employee ID:</span>
                                            <span className="font-semibold">{selectedSlip.employee.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Designation:</span>
                                            <span className="font-semibold">{selectedSlip.employee.designation}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Department:</span>
                                            <span className="font-semibold">{selectedSlip.employee.department}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Employee Type:</span>
                                            <span className="font-semibold">{selectedSlip.employee.type}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Salary Period</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Month/Year:</span>
                                            <span className="font-semibold">{selectedSlip.salaryDetails.month}/{selectedSlip.salaryDetails.year}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Working Days:</span>
                                            <span className="font-semibold">{selectedSlip.salaryDetails.workingDays}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Present Days:</span>
                                            <span className="font-semibold">{selectedSlip.salaryDetails.presentDays}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Payment Date:</span>
                                            <span className="font-semibold">
                                                {selectedSlip.payment.paymentDate
                                                    ? new Date(selectedSlip.payment.paymentDate).toLocaleDateString()
                                                    : 'Not Paid'
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <span className={`font-semibold px-2 py-1 rounded ${getStatusColor(selectedSlip.payment.status)}`}>
                                                {selectedSlip.payment.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Earnings */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-green-800 mb-4 bg-green-100 p-3 rounded">💰 Earnings</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-green-100">
                                                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                                                <th className="border border-gray-300 px-4 py-2 text-right">Amount (৳)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">Basic Salary</td>
                                                <td className="border border-gray-300 px-4 py-2 text-right font-semibold">
                                                    {(selectedSlip.earnings.basicSalary || 0).toFixed(2)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">House Rent Allowance</td>
                                                <td className="border border-gray-300 px-4 py-2 text-right">
                                                    {(selectedSlip.earnings.houseRentAllowance || 0).toFixed(2)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">Conveyance Allowance</td>
                                                <td className="border border-gray-300 px-4 py-2 text-right">
                                                    {(selectedSlip.earnings.conveyanceAllowance || 0).toFixed(2)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">Medical Allowance</td>
                                                <td className="border border-gray-300 px-4 py-2 text-right">
                                                    {(selectedSlip.earnings.medicalAllowance || 0).toFixed(2)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">Special Allowance</td>
                                                <td className="border border-gray-300 px-4 py-2 text-right">
                                                    {(selectedSlip.earnings.specialAllowance || 0).toFixed(2)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">Performance Bonus</td>
                                                <td className="border border-gray-300 px-4 py-2 text-right">
                                                    {(selectedSlip.earnings.performanceBonus || 0).toFixed(2)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">Overtime Amount</td>
                                                <td className="border border-gray-300 px-4 py-2 text-right">
                                                    {(selectedSlip.earnings.overtimeAmount || 0).toFixed(2)}
                                                </td>
                                            </tr>
                                            <tr className="bg-green-50 font-bold">
                                                <td className="border border-gray-300 px-4 py-2">Gross Salary</td>
                                                <td className="border border-gray-300 px-4 py-2 text-right">
                                                    {(selectedSlip.totals.grossSalary || 0).toFixed(2)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Deductions */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-red-800 mb-4 bg-red-100 p-3 rounded">📉 Deductions</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-red-100">
                                                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                                                <th className="border border-gray-300 px-4 py-2 text-right">Amount (৳)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">Provident Fund</td>
                                                <td className="border border-gray-300 px-4 py-2 text-right">
                                                    {(selectedSlip.deductions.providentFund || 0).toFixed(2)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">Professional Tax</td>
                                                <td className="border border-gray-300 px-4 py-2 text-right">
                                                    {(selectedSlip.deductions.professionalTax || 0).toFixed(2)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">Income Tax</td>
                                                <td className="border border-gray-300 px-4 py-2 text-right">
                                                    {(selectedSlip.deductions.incomeTax || 0).toFixed(2)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">Loan Deduction</td>
                                                <td className="border border-gray-300 px-4 py-2 text-right">
                                                    {(selectedSlip.deductions.loanDeduction || 0).toFixed(2)}
                                                </td>
                                            </tr>
                                            <tr className="bg-red-50 font-bold">
                                                <td className="border border-gray-300 px-4 py-2">Total Deductions</td>
                                                <td className="border border-gray-300 px-4 py-2 text-right">
                                                    {(selectedSlip.totals.totalDeductions || 0).toFixed(2)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Net Salary */}
                            <div className="bg-blue-100 p-6 rounded-lg text-center">
                                <h3 className="text-2xl font-bold text-blue-800 mb-2">Net Salary</h3>
                                <p className="text-4xl font-bold text-green-600">৳{(selectedSlip.totals.netSalary || 0).toFixed(2)}</p>
                                <p className="text-sm text-gray-600 mt-2">
                                    Amount in Words: {numberToWords(selectedSlip.totals.netSalary || 0)} Taka Only
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="mt-8 text-center text-sm text-gray-600">
                                <p>This is a computer-generated salary slip and does not require signature.</p>
                                <p>Generated on: {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                )}

               
              
            </div>
        </div>
    );
};

// Helper function to convert numbers to words
function numberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    function convertLessThanOneThousand(n) {
        if (n === 0) return '';
        let result = '';

        if (n >= 100) {
            result += ones[Math.floor(n / 100)] + ' Hundred ';
            n %= 100;
        }

        if (n >= 20) {
            result += tens[Math.floor(n / 10)] + ' ';
            n %= 10;
        } else if (n >= 10) {
            result += teens[n - 10] + ' ';
            return result.trim();
        }

        if (n > 0) {
            result += ones[n] + ' ';
        }

        return result.trim();
    }

    if (num === 0) return 'Zero';

    let result = '';
    let crore = Math.floor(num / 10000000);
    let lakh = Math.floor((num % 10000000) / 100000);
    let thousand = Math.floor((num % 100000) / 1000);
    let remainder = num % 1000;

    if (crore > 0) result += convertLessThanOneThousand(crore) + ' Crore ';
    if (lakh > 0) result += convertLessThanOneThousand(lakh) + ' Lakh ';
    if (thousand > 0) result += convertLessThanOneThousand(thousand) + ' Thousand ';
    if (remainder > 0) result += convertLessThanOneThousand(remainder);

    return result.trim();
}

export default SalaryManagementPage;