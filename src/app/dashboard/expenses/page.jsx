'use client';

import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../../../config/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ExpensesManagementPage = () => {
    // State management
    const [expenses, setExpenses] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [vendors, setVendors] = useState([]);
    
    // Filters
    const [filters, setFilters] = useState({
        category: '',
        status: '',
        department: '',
        academicYear: new Date().getFullYear().toString(),
        month: '',
        startDate: '',
        endDate: '',
        vendor: '',
        priority: '',
        search: ''
    });
    
    // Form states
    const [showForm, setShowForm] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        subCategory: '',
        amount: '',
        expenseDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash',
        vendor: '',
        vendorContact: '',
        invoiceNumber: '',
        department: 'General',
        priority: 'Normal',
        tags: [],
        isRecurring: false,
        recurringFrequency: ''
    });
    
    // UI states
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'cards', 'analytics'
    const [selectedExpenses, setSelectedExpenses] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    
    // Expense categories
    const expenseCategories = [
        'Salary',
        'Utilities',
        'Maintenance',
        'Supplies',
        'Transportation',
        'Rent',
        'Insurance',
        'Marketing',
        'Technology',
        'Professional Services',
        'Training',
        'Events',
        'Miscellaneous'
    ];

    // Departments
    const departmentOptions = [
        'General',
        'Academic',
        'Administration',
        'Maintenance',
        'IT',
        'Finance',
        'HR',
        'Security'
    ];

    // Payment methods
    const paymentMethods = [
        'Cash',
        'Bank Transfer',
        'Cheque',
        'Card',
        'Online',
        'Petty Cash'
    ];

    // Priority levels
    const priorityLevels = [
        { value: 'Low', color: 'green' },
        { value: 'Normal', color: 'blue' },
        { value: 'High', color: 'orange' },
        { value: 'Urgent', color: 'red' }
    ];

    // Load initial data
    useEffect(() => {
        fetchExpenses();
        fetchStatistics();
        fetchCategories();
        fetchDepartments();
        fetchVendors();
    }, []);

    // Fetch expenses with filters
    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });

            const response = await fetch(`${API_BASE_URL}/expenses?${queryParams}`);
            const data = await response.json();
            
            if (data.success) {
                setExpenses(data.data);
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
            Swal.fire('Error', 'Failed to load expenses', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Fetch statistics
    const fetchStatistics = async () => {
        try {
            const queryParams = new URLSearchParams();
            
            Object.entries(filters).forEach(([key, value]) => {
                if (value && key !== 'search') queryParams.append(key, value);
            });

            const response = await fetch(`${API_BASE_URL}/expenses/statistics?${queryParams}`);
            const data = await response.json();
            
            if (data.success) {
                setStatistics(data.data);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    // Fetch helper data
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/expenses/helpers/categories`);
            const data = await response.json();
            if (data.success) setCategories(data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/expenses/helpers/departments`);
            const data = await response.json();
            if (data.success) setDepartments(data.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchVendors = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/expenses/helpers/vendors`);
            const data = await response.json();
            if (data.success) setVendors(data.data);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

    // Handle filter changes
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    // Apply filters
    const applyFilters = () => {
        fetchExpenses();
        fetchStatistics();
    };

    // Clear filters
    const clearFilters = () => {
        setFilters({
            category: '',
            status: '',
            department: '',
            academicYear: new Date().getFullYear().toString(),
            month: '',
            startDate: '',
            endDate: '',
            vendor: '',
            priority: '',
            search: ''
        });
        setTimeout(() => {
            fetchExpenses();
            fetchStatistics();
        }, 100);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.category || !formData.amount) {
            Swal.fire('Error', 'Please fill all required fields', 'error');
            return;
        }

        try {
            setLoading(true);
            const url = editingExpense 
                ? `${API_BASE_URL}/expenses/${editingExpense._id}`
                : `${API_BASE_URL}/expenses`;
            
            const method = editingExpense ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire('Success', 
                    editingExpense ? 'Expense updated successfully' : 'Expense created successfully', 
                    'success'
                );
                
                setShowForm(false);
                setEditingExpense(null);
                resetForm();
                fetchExpenses();
                fetchStatistics();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error saving expense:', error);
            Swal.fire('Error', error.message || 'Failed to save expense', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: '',
            subCategory: '',
            amount: '',
            expenseDate: new Date().toISOString().split('T')[0],
            paymentMethod: 'Cash',
            vendor: '',
            vendorContact: '',
            invoiceNumber: '',
            department: 'General',
            priority: 'Normal',
            tags: [],
            isRecurring: false,
            recurringFrequency: ''
        });
    };

    // Edit expense
    const editExpense = (expense) => {
        setEditingExpense(expense);
        setFormData({
            title: expense.title,
            description: expense.description || '',
            category: expense.category,
            subCategory: expense.subCategory || '',
            amount: expense.amount.toString(),
            expenseDate: new Date(expense.expenseDate).toISOString().split('T')[0],
            paymentMethod: expense.paymentMethod,
            vendor: expense.vendor || '',
            vendorContact: expense.vendorContact || '',
            invoiceNumber: expense.invoiceNumber || '',
            department: expense.department,
            priority: expense.priority,
            tags: expense.tags || [],
            isRecurring: expense.isRecurring || false,
            recurringFrequency: expense.recurringFrequency || ''
        });
        setShowForm(true);
    };

    // Delete expense
    const deleteExpense = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Expense?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Delete'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire('Deleted!', 'Expense deleted successfully', 'success');
                    fetchExpenses();
                    fetchStatistics();
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error('Error deleting expense:', error);
                Swal.fire('Error', 'Failed to delete expense', 'error');
            }
        }
    };

    // Approve expense
    const approveExpense = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/expenses/${id}/approve`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approvedBy: 'Admin' })
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire('Approved!', 'Expense approved successfully', 'success');
                fetchExpenses();
                fetchStatistics();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error approving expense:', error);
            Swal.fire('Error', 'Failed to approve expense', 'error');
        }
    };

    // Reject expense
    const rejectExpense = async (id) => {
        const { value: reason } = await Swal.fire({
            title: 'Reject Expense',
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
                const response = await fetch(`${API_BASE_URL}/expenses/${id}/reject`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rejectionReason: reason, rejectedBy: 'Admin' })
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire('Rejected!', 'Expense rejected successfully', 'success');
                    fetchExpenses();
                    fetchStatistics();
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error('Error rejecting expense:', error);
                Swal.fire('Error', 'Failed to reject expense', 'error');
            }
        }
    };

    // Mark as paid
    const markAsPaid = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/expenses/${id}/mark-paid`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentDate: new Date() })
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire('Paid!', 'Expense marked as paid successfully', 'success');
                fetchExpenses();
                fetchStatistics();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error marking as paid:', error);
            Swal.fire('Error', 'Failed to mark expense as paid', 'error');
        }
    };

    // Bulk approve
    const bulkApprove = async () => {
        if (selectedExpenses.length === 0) {
            Swal.fire('Error', 'Please select expenses to approve', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/expenses/bulk/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    expenseIds: selectedExpenses,
                    approvedBy: 'Admin'
                })
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire('Success!', `${data.count} expenses approved successfully`, 'success');
                setSelectedExpenses([]);
                setShowBulkActions(false);
                fetchExpenses();
                fetchStatistics();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error bulk approving:', error);
            Swal.fire('Error', 'Failed to bulk approve expenses', 'error');
        }
    };

    // Bulk delete
    const bulkDelete = async () => {
        if (selectedExpenses.length === 0) {
            Swal.fire('Error', 'Please select expenses to delete', 'error');
            return;
        }

        const result = await Swal.fire({
            title: 'Delete Selected Expenses?',
            text: `This will delete ${selectedExpenses.length} expenses. This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Delete All'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_BASE_URL}/expenses/bulk/delete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ expenseIds: selectedExpenses })
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire('Deleted!', `${data.count} expenses deleted successfully`, 'success');
                    setSelectedExpenses([]);
                    setShowBulkActions(false);
                    fetchExpenses();
                    fetchStatistics();
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error('Error bulk deleting:', error);
                Swal.fire('Error', 'Failed to bulk delete expenses', 'error');
            }
        }
    };

    // Export to Excel
    const exportToExcel = () => {
        if (expenses.length === 0) {
            Swal.fire('Error', 'No expenses to export', 'error');
            return;
        }

        // Create CSV content
        let csvContent = `Expenses Report\n`;
        csvContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

        // Headers
        const headers = [
            'Expense ID', 'Title', 'Category', 'Amount', 'Date', 'Vendor', 
            'Department', 'Status', 'Payment Method', 'Priority'
        ];
        csvContent += headers.join(',') + '\n';

        // Data rows
        expenses.forEach(expense => {
            const row = [
                expense.expenseId,
                `"${expense.title}"`,
                expense.category,
                expense.amount,
                new Date(expense.expenseDate).toLocaleDateString(),
                `"${expense.vendor || ''}"`,
                expense.department,
                expense.status,
                expense.paymentMethod,
                expense.priority
            ];
            csvContent += row.join(',') + '\n';
        });

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Expenses_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        Swal.fire('Success', 'Expenses exported to Excel', 'success');
    };

    // Export to PDF
    const exportToPDF = () => {
        if (expenses.length === 0) {
            Swal.fire('Error', 'No expenses to export', 'error');
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

        const element = document.getElementById('expenses-table');
        
        html2canvas(element, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgWidth = 280;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save(`Expenses_Report_${new Date().toISOString().split('T')[0]}.pdf`);
            
            Swal.close();
            Swal.fire('Success', 'PDF exported successfully', 'success');
        }).catch(error => {
            console.error('PDF generation error:', error);
            Swal.fire('Error', 'Failed to generate PDF', 'error');
        });
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Approved': return 'bg-blue-100 text-blue-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get priority color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Low': return 'bg-green-100 text-green-800';
            case 'Normal': return 'bg-blue-100 text-blue-800';
            case 'High': return 'bg-orange-100 text-orange-800';
            case 'Urgent': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="container mx-auto py-8 conatiner">
                {/* Professional Header */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-slate-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                                    <span className="text-white text-xl">💰</span>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        Expense Management
                                    </h1>
                                    <p className="text-slate-600 font-medium">Professional expense tracking & approval system</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                                    viewMode === 'list'
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25'
                                        : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg'
                                }`}
                            >
                                📋 List View
                            </button>
                            <button
                                onClick={() => setViewMode('cards')}
                                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                                    viewMode === 'cards'
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-500/25'
                                        : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-300 hover:shadow-lg'
                                }`}
                            >
                                🎴 Cards View
                            </button>
                            <button
                                onClick={() => setViewMode('analytics')}
                                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                                    viewMode === 'analytics'
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/25'
                                        : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-purple-300 hover:shadow-lg'
                                }`}
                            >
                                📊 Analytics
                            </button>
                        </div>
                    </div>
                </div>

                {/* Enhanced Statistics Cards */}
                {statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-slate-600 font-medium text-sm uppercase tracking-wide">Total Expenses</p>
                                    <p className="text-3xl font-bold text-slate-800">৳{statistics.totalAmount.toLocaleString()}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-xs text-slate-500">All time</span>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-white text-2xl">💵</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-slate-600 font-medium text-sm uppercase tracking-wide">Paid Amount</p>
                                    <p className="text-3xl font-bold text-emerald-600">৳{statistics.paidAmount.toLocaleString()}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                        <span className="text-xs text-slate-500">Completed</span>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-white text-2xl">✅</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-slate-600 font-medium text-sm uppercase tracking-wide">Pending Amount</p>
                                    <p className="text-3xl font-bold text-amber-600">৳{statistics.pendingAmount.toLocaleString()}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                        <span className="text-xs text-slate-500">Awaiting approval</span>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-white text-2xl">⏳</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-slate-600 font-medium text-sm uppercase tracking-wide">Total Records</p>
                                    <p className="text-3xl font-bold text-slate-800">{statistics.totalRecords}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                                        <span className="text-xs text-slate-500">All entries</span>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-white text-2xl">📊</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Professional Filters Section */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-slate-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                                <span className="text-white text-lg">🔍</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Advanced Filters</h2>
                                <p className="text-slate-600 text-sm">Filter and search expenses with precision</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={applyFilters}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
                            >
                                🔍 Apply Filters
                            </button>
                            <button
                                onClick={clearFilters}
                                className="px-6 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-2xl font-semibold hover:border-slate-300 hover:shadow-lg transition-all duration-300"
                            >
                                🗑️ Clear All
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                placeholder="Search expenses..."
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                            <select
                                value={filters.department}
                                onChange={(e) => handleFilterChange('department', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">All Departments</option>
                                {departments.map((dept, index) => (
                                    <option key={index} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>

                        {/* Academic Year */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
                            <input
                                type="text"
                                value={filters.academicYear}
                                onChange={(e) => handleFilterChange('academicYear', e.target.value)}
                                placeholder="2026"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Month */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Month</label>
                            <select
                                value={filters.month}
                                onChange={(e) => handleFilterChange('month', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="">All Months</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Professional Action Buttons */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-slate-200">
                    <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                            >
                                <span>➕</span>
                                <span>Add Expense</span>
                            </button>
                            
                            {selectedExpenses.length > 0 && (
                                <>
                                    <button
                                        onClick={() => setShowBulkActions(!showBulkActions)}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center gap-2"
                                    >
                                        <span>⚡</span>
                                        <span>Bulk Actions ({selectedExpenses.length})</span>
                                    </button>
                                    
                                    {showBulkActions && (
                                        <div className="flex gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                            <button
                                                onClick={bulkApprove}
                                                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all duration-300 flex items-center gap-1"
                                            >
                                                <span>✅</span>
                                                <span>Approve All</span>
                                            </button>
                                            <button
                                                onClick={bulkDelete}
                                                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all duration-300 flex items-center gap-1"
                                            >
                                                <span>🗑️</span>
                                                <span>Delete All</span>
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={exportToExcel}
                                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                            >
                                <span>📊</span>
                                <span>Export Excel</span>
                            </button>
                            <button
                                onClick={exportToPDF}
                                className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-rose-500/25 flex items-center gap-2"
                            >
                                <span>📄</span>
                                <span>Export PDF</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Professional Add/Edit Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md bg-black/20">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                                            <span className="text-white text-xl">
                                                {editingExpense ? '✏️' : '➕'}
                                            </span>
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-slate-800">
                                                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                                            </h2>
                                            <p className="text-slate-600 mt-1">
                                                {editingExpense ? 'Update expense details' : 'Create a new expense entry'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingExpense(null);
                                            resetForm();
                                        }}
                                        className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center justify-center text-slate-600 hover:text-slate-800 transition-all duration-300"
                                    >
                                        <span className="text-xl">×</span>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Title */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Expense title"
                                                required
                                            />
                                        </div>

                                        {/* Category */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Category *
                                            </label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {expenseCategories.map((category, index) => (
                                                    <option key={index} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Amount */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Amount (৳) *
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                required
                                            />
                                        </div>

                                        {/* Expense Date */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Expense Date
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.expenseDate}
                                                onChange={(e) => setFormData({...formData, expenseDate: e.target.value})}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>

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

                                        {/* Vendor */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Vendor/Supplier
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.vendor}
                                                onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Vendor name"
                                            />
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

                                        {/* Priority */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Priority
                                            </label>
                                            <select
                                                value={formData.priority}
                                                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            >
                                                {priorityLevels.map((priority, index) => (
                                                    <option key={index} value={priority.value}>{priority.value}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Invoice Number */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Invoice/Bill Number
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.invoiceNumber}
                                                onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Invoice number"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                rows="3"
                                                placeholder="Expense description..."
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* Professional Submit Buttons */}
                                    <div className="flex gap-4 justify-end pt-8 border-t border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowForm(false);
                                                setEditingExpense(null);
                                                resetForm();
                                            }}
                                            className="px-8 py-3 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition-all duration-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg shadow-blue-500/25 flex items-center gap-2"
                                        >
                                            {loading && (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            )}
                                            <span>{loading ? 'Saving...' : (editingExpense ? 'Update Expense' : 'Add Expense')}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Professional Expenses List View */}
                {viewMode === 'list' && (
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                                <span className="text-white text-lg">📋</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Expenses List</h2>
                                <p className="text-slate-600 text-sm">{expenses.length} total expenses</p>
                            </div>
                        </div>
                        
                        {expenses.length > 0 ? (
                            <div className="overflow-x-auto rounded-2xl border border-slate-200">
                                <table id="expenses-table" className="w-full">
                                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left">
                                                <input
                                                    type="checkbox"
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedExpenses(expenses.map(exp => exp._id));
                                                        } else {
                                                            setSelectedExpenses([]);
                                                        }
                                                    }}
                                                    checked={selectedExpenses.length === expenses.length && expenses.length > 0}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                            </th>
                                            <th className="px-6 py-4 text-left font-semibold text-slate-700">Expense ID</th>
                                            <th className="px-6 py-4 text-left font-semibold text-slate-700">Title</th>
                                            <th className="px-6 py-4 text-left font-semibold text-slate-700">Category</th>
                                            <th className="px-6 py-4 text-left font-semibold text-slate-700">Vendor</th>
                                            <th className="px-6 py-4 text-right font-semibold text-slate-700">Amount (৳)</th>
                                            <th className="px-6 py-4 text-center font-semibold text-slate-700">Date</th>
                                            <th className="px-6 py-4 text-center font-semibold text-slate-700">Status</th>
                                            <th className="px-6 py-4 text-center font-semibold text-slate-700">Priority</th>
                                            <th className="px-6 py-4 text-center font-semibold text-slate-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses.map((expense, index) => (
                                            <tr key={expense._id} className={`border-b border-slate-100 hover:bg-slate-50 transition-all duration-200 ${
                                                selectedExpenses.includes(expense._id) ? 'bg-blue-50' : ''
                                            }`}>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedExpenses.includes(expense._id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedExpenses([...selectedExpenses, expense._id]);
                                                            } else {
                                                                setSelectedExpenses(selectedExpenses.filter(id => id !== expense._id));
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 font-mono text-sm text-slate-600 font-medium">{expense.expenseId}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-slate-800">{expense.title}</div>
                                                    {expense.description && (
                                                        <div className="text-xs text-slate-500 mt-1 line-clamp-1">{expense.description}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                                                        {expense.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-700">{expense.vendor || '-'}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-bold text-lg text-emerald-600">৳{expense.amount.toFixed(2)}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-sm text-slate-600">
                                                    {new Date(expense.expenseDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(expense.status)}`}>
                                                        {expense.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPriorityColor(expense.priority)}`}>
                                                        {expense.priority}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex gap-1 justify-center">
                                                        <button
                                                            onClick={() => editExpense(expense)}
                                                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-200"
                                                            title="Edit"
                                                        >
                                                            ✏️
                                                        </button>
                                                        
                                                        {expense.status === 'Pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => approveExpense(expense._id)}
                                                                    className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-all duration-200"
                                                                    title="Approve"
                                                                >
                                                                    ✅
                                                                </button>
                                                                <button
                                                                    onClick={() => rejectExpense(expense._id)}
                                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
                                                                    title="Reject"
                                                                >
                                                                    ❌
                                                                </button>
                                                            </>
                                                        )}
                                                        
                                                        {expense.status === 'Approved' && (
                                                            <button
                                                                onClick={() => markAsPaid(expense._id)}
                                                                className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all duration-200"
                                                                title="Mark as Paid"
                                                            >
                                                                💰
                                                            </button>
                                                        )}
                                                        
                                                        <button
                                                            onClick={() => deleteExpense(expense._id)}
                                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
                                                            title="Delete"
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
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📋</div>
                                <p className="text-gray-600">No expenses found matching your filters</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Professional Cards View */}
                {viewMode === 'cards' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center">
                                <span className="text-white text-lg">🎴</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Expense Cards</h2>
                                <p className="text-slate-600 text-sm">{expenses.length} expenses in card view</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {expenses.map((expense) => (
                                <div key={expense._id} className="bg-white rounded-3xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="space-y-2">
                                                <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{expense.title}</h3>
                                                <p className="text-sm text-slate-500 font-mono">{expense.expenseId}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(expense.status)}`}>
                                                    {expense.status}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPriorityColor(expense.priority)}`}>
                                                    {expense.priority}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600 font-medium">Category:</span>
                                                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">{expense.category}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600 font-medium">Amount:</span>
                                                <span className="font-bold text-xl text-emerald-600">৳{expense.amount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600 font-medium">Date:</span>
                                                <span className="text-sm text-slate-700">{new Date(expense.expenseDate).toLocaleDateString()}</span>
                                            </div>
                                            {expense.vendor && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-600 font-medium">Vendor:</span>
                                                    <span className="text-sm text-slate-700">{expense.vendor}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-600 font-medium">Department:</span>
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">{expense.department}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => editExpense(expense)}
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25"
                                            >
                                                ✏️ Edit
                                            </button>
                                            
                                            {expense.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => approveExpense(expense._id)}
                                                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-2xl text-sm font-semibold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25"
                                                    >
                                                        ✅ Approve
                                                    </button>
                                                    <button
                                                        onClick={() => rejectExpense(expense._id)}
                                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-2xl text-sm font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25"
                                                    >
                                                        ❌ Reject
                                                    </button>
                                                </>
                                            )}
                                            
                                            {expense.status === 'Approved' && (
                                                <button
                                                    onClick={() => markAsPaid(expense._id)}
                                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-2xl text-sm font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25"
                                                >
                                                    💰 Mark Paid
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        
                        {expenses.length === 0 && (
                            <div className="col-span-full text-center py-16">
                                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                    <span className="text-4xl">🎴</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">No Expenses Found</h3>
                                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                    {searchTerm || filters.category || filters.status || filters.priority || filters.department
                                        ? "No expenses match your current filters. Try adjusting your search criteria."
                                        : "Start by adding your first expense to track your organization's spending."}
                                </p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl font-bold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-emerald-500/25"
                                >
                                    ➕ Add First Expense
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
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                                <span className="text-white text-lg">📊</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Expense Analytics</h2>
                                <p className="text-slate-600 text-sm">Comprehensive insights into your expense data</p>
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
                                    <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 hover:shadow-lg transition-all duration-300">
                                        <div className="text-3xl font-bold text-amber-600 mb-2">{statistics.statusCounts.pending}</div>
                                        <div className="text-slate-600 font-medium">Pending</div>
                                        <div className="w-full bg-amber-200 rounded-full h-2 mt-3">
                                            <div className="bg-amber-500 h-2 rounded-full" style={{width: `${(statistics.statusCounts.pending / Math.max(expenses.length, 1)) * 100}%`}}></div>
                                        </div>
                                    </div>
                                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                                        <div className="text-3xl font-bold text-blue-600 mb-2">{statistics.statusCounts.approved}</div>
                                        <div className="text-slate-600 font-medium">Approved</div>
                                        <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(statistics.statusCounts.approved / Math.max(expenses.length, 1)) * 100}%`}}></div>
                                        </div>
                                    </div>
                                    <div className="text-center p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-200 hover:shadow-lg transition-all duration-300">
                                        <div className="text-3xl font-bold text-red-600 mb-2">{statistics.statusCounts.rejected}</div>
                                        <div className="text-slate-600 font-medium">Rejected</div>
                                        <div className="w-full bg-red-200 rounded-full h-2 mt-3">
                                            <div className="bg-red-500 h-2 rounded-full" style={{width: `${(statistics.statusCounts.rejected / Math.max(expenses.length, 1)) * 100}%`}}></div>
                                        </div>
                                    </div>
                                    <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 hover:shadow-lg transition-all duration-300">
                                        <div className="text-3xl font-bold text-emerald-600 mb-2">{statistics.statusCounts.paid}</div>
                                        <div className="text-slate-600 font-medium">Paid</div>
                                        <div className="w-full bg-emerald-200 rounded-full h-2 mt-3">
                                            <div className="bg-emerald-500 h-2 rounded-full" style={{width: `${(statistics.statusCounts.paid / Math.max(expenses.length, 1)) * 100}%`}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Category Breakdown */}
                        {statistics.categoryBreakdown && Object.keys(statistics.categoryBreakdown).length > 0 && (
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                                <div className="p-8">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                                            <span className="text-white text-sm">📊</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800">Category Breakdown</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {Object.entries(statistics.categoryBreakdown).map(([category, amount]) => (
                                            <div key={category} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-300">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                                                    <span className="font-semibold text-slate-700">{category}</span>
                                                </div>
                                                <span className="font-bold text-xl text-emerald-600">৳{amount.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Monthly Trends */}
                        {statistics.monthlyTrends && Object.keys(statistics.monthlyTrends).length > 0 && (
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                                <div className="p-8">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                                            <span className="text-white text-sm">📅</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800">Monthly Trends</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {Object.entries(statistics.monthlyTrends).map(([month, amount]) => (
                                            <div key={month} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all duration-300">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
                                                    <span className="font-semibold text-slate-700">{month}</span>
                                                </div>
                                                <span className="font-bold text-xl text-violet-600">৳{amount.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Professional Loading State */}
                {loading && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md bg-black/20">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-slate-200">
                            <div className="relative mb-6">
                                <div className="w-16 h-16 border-4 border-slate-200 rounded-full animate-spin mx-auto"></div>
                                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Loading Expenses</h3>
                            <p className="text-slate-600">Please wait while we fetch your data...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpensesManagementPage;