'use client';

import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../../../config/api';
import jsPDF from 'jspdf';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    variable: '--font-poppins',
});


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
    const fetchExpenses = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
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
            if (showLoading) setLoading(false);
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

    // Handle form submission with optimistic updates
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.category || !formData.amount) {
            Swal.fire('Error', 'Please fill all required fields', 'error');
            return;
        }

        const isEditing = !!editingExpense;
        const originalExpenses = [...expenses];
        const originalStatistics = { ...statistics };

        try {
            setLoading(true);

            // Optimistic update for better UX
            if (isEditing) {
                // Update existing expense in state
                const updatedExpense = {
                    ...editingExpense,
                    ...formData,
                    amount: Number(formData.amount) || 0
                };
                setExpenses(prev => prev.map(exp =>
                    exp._id === editingExpense._id ? updatedExpense : exp
                ));
            } else {
                // Add new expense to state (temporary ID)
                const tempExpense = {
                    ...formData,
                    amount: Number(formData.amount) || 0,
                    _id: `temp-${Date.now()}`,
                    expenseId: `EXP-${Date.now()}`,
                    status: 'Pending',
                    createdAt: new Date().toISOString()
                };
                setExpenses(prev => [tempExpense, ...prev]);
            }

            const url = isEditing
                ? `${API_BASE_URL}/expenses/${editingExpense._id}`
                : `${API_BASE_URL}/expenses`;

            const method = isEditing ? 'PUT' : 'POST';

            // Prepare data with amount as number
            const submitData = {
                ...formData,
                amount: Number(formData.amount) || 0
            };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData)
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire('Success',
                    isEditing ? 'Expense updated successfully' : 'Expense created successfully',
                    'success'
                );

                setShowForm(false);
                setEditingExpense(null);
                resetForm();

                // Fetch fresh data in background to sync
                fetchExpenses(false);
                fetchStatistics();
            } else {
                // Revert optimistic update on error
                setExpenses(originalExpenses);
                setStatistics(originalStatistics);
                Swal.fire('Error', data.message || 'Failed to save expense', 'error');
            }
        } catch (error) {
            // Revert optimistic update on error
            setExpenses(originalExpenses);
            setStatistics(originalStatistics);
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

    // Delete expense with optimistic updates
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
            const originalExpenses = [...expenses];
            const originalStatistics = { ...statistics };

            try {
                // Optimistic update - remove from UI immediately
                setExpenses(prev => prev.filter(exp => exp._id !== id));

                const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire('Deleted!', 'Expense deleted successfully', 'success');
                    // Fetch fresh data in background to sync
                    fetchExpenses(false);
                    fetchStatistics();
                } else {
                    // Revert optimistic update on error
                    setExpenses(originalExpenses);
                    setStatistics(originalStatistics);
                    Swal.fire('Error', data.message || 'Failed to delete expense', 'error');
                    return; // Don't throw, just return
                }
            } catch (error) {
                // Revert optimistic update on error
                setExpenses(originalExpenses);
                setStatistics(originalStatistics);
                console.error('Network error deleting expense:', error);
                Swal.fire('Error', 'Network error: Failed to delete expense', 'error');
            }
        }
    };

    // Approve expense with optimistic updates
    const approveExpense = async (id) => {
        const originalExpenses = [...expenses];
        const originalStatistics = { ...statistics };

        try {
            // Optimistic update - change status to Approved immediately
            setExpenses(prev => prev.map(exp =>
                exp._id === id ? { ...exp, status: 'Approved' } : exp
            ));

            const response = await fetch(`${API_BASE_URL}/expenses/${id}/approve`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approvedBy: 'Admin' })
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire('Approved!', 'Expense approved successfully', 'success');
                // Fetch fresh data in background to sync
                fetchExpenses(false);
                fetchStatistics();
            } else {
                // Revert optimistic update on error
                setExpenses(originalExpenses);
                setStatistics(originalStatistics);
                Swal.fire('Error', data.message || 'Failed to approve expense', 'error');
                return; // Don't throw, just return
            }
        } catch (error) {
            // Revert optimistic update on error
            setExpenses(originalExpenses);
            setStatistics(originalStatistics);
            console.error('Error approving expense:', error);
            Swal.fire('Error', 'Failed to approve expense', 'error');
        }
    };

    // Reject expense with optimistic updates
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
            const originalExpenses = [...expenses];
            const originalStatistics = { ...statistics };

            try {
                // Optimistic update - change status to Rejected immediately
                setExpenses(prev => prev.map(exp =>
                    exp._id === id ? { ...exp, status: 'Rejected' } : exp
                ));

                const response = await fetch(`${API_BASE_URL}/expenses/${id}/reject`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rejectionReason: reason, rejectedBy: 'Admin' })
                });

                const data = await response.json();

                if (data.success) {
                    Swal.fire('Rejected!', 'Expense rejected successfully', 'success');
                    // Fetch fresh data in background to sync
                    fetchExpenses(false);
                    fetchStatistics();
                } else {
                    // Revert optimistic update on error
                    setExpenses(originalExpenses);
                    setStatistics(originalStatistics);
                    Swal.fire('Error', data.message || 'Failed to reject expense', 'error');
                    return; // Don't throw, just return
                }
            } catch (error) {
                // Revert optimistic update on error
                setExpenses(originalExpenses);
                setStatistics(originalStatistics);
                console.error('Error rejecting expense:', error);
                Swal.fire('Error', 'Failed to reject expense', 'error');
            }
        }
    };

    // Mark as paid with optimistic updates
    const markAsPaid = async (id) => {
        const originalExpenses = [...expenses];
        const originalStatistics = { ...statistics };

        try {
            // Optimistic update - change status to Paid immediately
            setExpenses(prev => prev.map(exp =>
                exp._id === id ? { ...exp, status: 'Paid' } : exp
            ));

            const response = await fetch(`${API_BASE_URL}/expenses/${id}/mark-paid`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentDate: new Date() })
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire('Paid!', 'Expense marked as paid successfully', 'success');
                // Fetch fresh data in background to sync
                fetchExpenses(false);
                fetchStatistics();
            } else {
                // Revert optimistic update on error
                setExpenses(originalExpenses);
                setStatistics(originalStatistics);
                Swal.fire('Error', data.message || 'Failed to mark expense as paid', 'error');
            }
        } catch (error) {
            // Revert optimistic update on error
            setExpenses(originalExpenses);
            setStatistics(originalStatistics);
            console.error('Error marking as paid:', error);
            Swal.fire('Error', 'Failed to mark expense as paid', 'error');
        }
    };

    // Bulk approve with optimistic updates
    const bulkApprove = async () => {
        if (selectedExpenses.length === 0) {
            Swal.fire('Error', 'Please select expenses to approve', 'error');
            return;
        }

        const originalExpenses = [...expenses];
        const originalStatistics = { ...statistics };

        try {
            // Optimistic update - change status to Approved for selected expenses
            setExpenses(prev => prev.map(exp =>
                selectedExpenses.includes(exp._id) ? { ...exp, status: 'Approved' } : exp
            ));

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
                // Fetch fresh data in background to sync
                fetchExpenses(false);
                fetchStatistics();
            } else {
                // Revert optimistic update on error
                setExpenses(originalExpenses);
                setStatistics(originalStatistics);
                Swal.fire('Error', data.message || 'Failed to bulk approve expenses', 'error');
            }
        } catch (error) {
            // Revert optimistic update on error
            setExpenses(originalExpenses);
            setStatistics(originalStatistics);
            console.error('Error bulk approving:', error);
            Swal.fire('Error', 'Failed to bulk approve expenses', 'error');
        }
    };

    // Bulk delete with optimistic updates
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
            const originalExpenses = [...expenses];
            const originalStatistics = { ...statistics };

            try {
                // Optimistic update - remove selected expenses from UI immediately
                setExpenses(prev => prev.filter(exp => !selectedExpenses.includes(exp._id)));

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
                    // Fetch fresh data in background to sync
                    fetchExpenses(false);
                    fetchStatistics();
                } else {
                    // Revert optimistic update on error
                    setExpenses(originalExpenses);
                    setStatistics(originalStatistics);
                    Swal.fire('Error', data.message || 'Failed to bulk delete expenses', 'error');
                }
            } catch (error) {
                // Revert optimistic update on error
                setExpenses(originalExpenses);
                setStatistics(originalStatistics);
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

        try {
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;

            // Header background
            pdf.setFillColor(26, 32, 44);
            pdf.rect(0, 0, pageWidth, 18, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Expense Management Report', margin, 12);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 12, { align: 'right' });

            // Table header
            const headers = ['#', 'Expense ID', 'Title', 'Category', 'Vendor', 'Amount (BDT)', 'Date', 'Department', 'Status', 'Priority'];
            const colWidths = [8, 28, 52, 26, 30, 28, 24, 28, 22, 22];
            let y = 26;

            pdf.setFillColor(26, 32, 44);
            pdf.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            let x = margin;
            headers.forEach((header, i) => {
                pdf.text(header, x + 1, y);
                x += colWidths[i];
            });
            y += 5;

            // Table rows
            pdf.setFont('helvetica', 'normal');
            expenses.forEach((expense, index) => {
                if (y > pageHeight - 15) {
                    pdf.addPage();
                    y = 15;
                    // Re-draw header on new page
                    pdf.setFillColor(26, 32, 44);
                    pdf.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F');
                    pdf.setTextColor(255, 255, 255);
                    pdf.setFont('helvetica', 'bold');
                    x = margin;
                    headers.forEach((header, i) => {
                        pdf.text(header, x + 1, y);
                        x += colWidths[i];
                    });
                    y += 5;
                    pdf.setFont('helvetica', 'normal');
                }

                const rowColor = index % 2 === 0 ? [248, 249, 250] : [255, 255, 255];
                pdf.setFillColor(...rowColor);
                pdf.rect(margin, y - 4, pageWidth - margin * 2, 7, 'F');
                pdf.setTextColor(0, 0, 0);
                pdf.setFontSize(7.5);

                const row = [
                    String(index + 1),
                    expense.expenseId || '-',
                    (expense.title || '').substring(0, 30),
                    expense.category || '-',
                    (expense.vendor || '-').substring(0, 18),
                    `${Number(expense.amount || 0).toFixed(2)}`,
                    expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString() : '-',
                    expense.department || '-',
                    expense.status || '-',
                    expense.priority || '-',
                ];

                x = margin;
                row.forEach((cell, i) => {
                    pdf.text(String(cell), x + 1, y);
                    x += colWidths[i];
                });
                y += 7;
            });

            // Footer
            pdf.setFontSize(8);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Total Expenses: ${expenses.length}`, margin, pageHeight - 5);

            pdf.save(`Expenses_Report_${new Date().toISOString().split('T')[0]}.pdf`);
            Swal.fire('Success', 'PDF exported successfully', 'success');
        } catch (error) {
            console.error('PDF generation error:', error);
            Swal.fire('Error', 'Failed to generate PDF', 'error');
        }
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-[#1a202c] text-white';
            case 'Approved': return 'bg-[#1a202c] text-white';
            case 'Pending': return 'bg-gray-400 text-white';
            case 'Rejected': return 'bg-red-600 text-white';
            default: return 'bg-gray-300 text-black';
        }
    };

    // Get priority color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Low': return 'bg-[#1a202c] text-white';
            case 'Normal': return 'bg-[#1a202c] text-white';
            case 'High': return 'bg-gray-600 text-white';
            case 'Urgent': return 'bg-red-600 text-white';
            default: return 'bg-gray-300 text-black';
        }
    };

    return (
        <div className={`${poppins.variable} font-[family-name:var(--font-poppins)] bg-[#f4f6f9]`}>
            {/* ── Top Header Bar ── */}
            <div className="bg-[#1a2e5a] px-4 sm:px-6 lg:px-8 py-4 shadow-lg sticky top-0 z-40">
                <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                            <span className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center text-lg">💰</span>
                            Expense Management
                        </h1>
                        <p className="text-blue-200 text-xs sm:text-sm font-medium mt-0.5">Professional expense tracking & approval system</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Tab Switcher */}
                        <div className="bg-[#0f1e3d] border border-blue-800 rounded-xl p-1 flex">
                            {[
                                ['list', 'List View'],
                                ['cards', 'Cards View'],
                                ['analytics', 'Analytics']
                            ].map(([mode, label]) => (
                                <button key={mode} onClick={() => setViewMode(mode)}
                                    className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${viewMode === mode ? 'bg-white text-[#1a2e5a] shadow' : 'text-blue-200 hover:text-white'}`}>
                                    {label}
                                </button>
                            ))}
                        </div>
                        {/* Export & Add Actions */}
                        <div className="flex gap-2">
                            <button onClick={exportToExcel} title="Export to Excel"
                                className="bg-[#0f1e3d] hover:bg-[#2b4b8c] text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all">
                                📊
                            </button>
                            <button onClick={exportToPDF} title="Export to PDF"
                                className="bg-[#0f1e3d] hover:bg-[#2b4b8c] text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all">
                                📄
                            </button>
                            <button onClick={() => { resetForm(); setEditingExpense(null); setShowForm(true); }}
                                className="bg-[#f5a623] hover:bg-[#e0951a] active:bg-[#c97f10] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 transform hover:-translate-y-0.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                Add New Expense
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                {/* ── Summary Stats Row ── */}
                {statistics && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Expenses', value: `৳${(statistics.totalAmount || 0).toLocaleString()}`, sub: 'All time', icon: '💵', accent: 'indigo' },
                            { label: 'Paid Amount', value: `৳${(statistics.paidAmount || 0).toLocaleString()}`, sub: 'Completed', icon: '✅', accent: 'emerald' },
                            { label: 'Pending Amount', value: `৳${(statistics.pendingAmount || 0).toLocaleString()}`, sub: 'Awaiting approval', icon: '⏳', accent: 'rose' },
                            { label: 'Total Records', value: (statistics.totalRecords || 0).toLocaleString(), sub: 'All entries', icon: '📊', accent: 'amber' },
                        ].map(({ label, value, sub, icon, accent }) => (
                            <div key={label} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300">
                                <div className="space-y-1 min-w-0">
                                    <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">{label}</p>
                                    <p className={`text-xl sm:text-2xl font-extrabold ${accent === 'emerald' ? 'text-emerald-600' :
                                            accent === 'indigo' ? 'text-[#1a2e5a]' :
                                                accent === 'rose' ? 'text-rose-600' :
                                                    'text-amber-500'}`}>{value}</p>
                                    <span className="text-[10px] text-slate-400 font-medium hidden sm:block">{sub}</span>
                                </div>
                                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0 transition-transform duration-300 group-hover:scale-110 ${accent === 'emerald' ? 'bg-emerald-50' :
                                        accent === 'indigo' ? 'bg-indigo-50' :
                                            accent === 'rose' ? 'bg-rose-50' :
                                                'bg-amber-50'}`}>
                                    {icon}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Filter Panel ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-[#1a2e5a] to-[#2b4b8c] px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
                            <span className="text-white font-bold text-sm">Advanced Filters</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={clearFilters} className="text-[10px] sm:text-xs font-bold text-white hover:text-blue-200 uppercase tracking-wider px-2 transition-colors">Clear All</button>
                            <button onClick={applyFilters} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors border border-white/20">Apply Filters</button>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search */}
                            <div>
                                <label className="block text-xs font-bold text-[#1a2e5a] uppercase tracking-wider mb-2">Search</label>
                                <input type="text" value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} placeholder="Search expenses..."
                                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl px-3 py-2.5 text-sm text-[#1a2e5a] font-semibold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all duration-200" />
                            </div>
                            {/* Category */}
                            <div>
                                <label className="block text-xs font-bold text-[#1a2e5a] uppercase tracking-wider mb-2">Category</label>
                                <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl px-3 py-2.5 text-sm text-[#1a2e5a] font-semibold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all duration-200 cursor-pointer">
                                    <option value="">All Categories</option>
                                    {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            {/* Department */}
                            <div>
                                <label className="block text-xs font-bold text-[#1a2e5a] uppercase tracking-wider mb-2">Department</label>
                                <select value={filters.department} onChange={(e) => handleFilterChange('department', e.target.value)}
                                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl px-3 py-2.5 text-sm text-[#1a2e5a] font-semibold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all duration-200 cursor-pointer">
                                    <option value="">All Departments</option>
                                    {departments.map((dept, i) => <option key={i} value={dept}>{dept}</option>)}
                                </select>
                            </div>
                            {/* Status */}
                            <div>
                                <label className="block text-xs font-bold text-[#1a2e5a] uppercase tracking-wider mb-2">Status</label>
                                <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl px-3 py-2.5 text-sm text-[#1a2e5a] font-semibold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all duration-200 cursor-pointer">
                                    <option value="">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions Banner */}
                {selectedExpenses.length > 0 && (
                    <div className="bg-[#1a2e5a] text-white rounded-xl px-5 py-3 flex items-center justify-between shadow-lg animate-[fadeInUp_0.2s_ease]">
                        <div className="flex items-center gap-3">
                            <span className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">{selectedExpenses.length}</span>
                            <span className="font-semibold text-sm">Expenses selected</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={bulkApprove} className="bg-emerald-500 hover:bg-emerald-600 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">Approve Selected</button>
                            <button onClick={bulkDelete} className="bg-rose-500 hover:bg-rose-600 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">Delete Selected</button>
                            <button onClick={() => setSelectedExpenses([])} className="text-white/70 hover:text-white px-3 py-1.5 text-xs font-semibold">Cancel</button>
                        </div>
                    </div>
                )}

                {/* ── Data Area ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative min-h-[400px]">
                    {loading && (
                        <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 border-4 border-[#1a2e5a]/20 border-t-[#1a2e5a] rounded-full animate-spin" />
                                <p className="text-[#1a2e5a] font-bold text-sm tracking-wide">Fetching Data...</p>
                            </div>
                        </div>
                    )}

                    {expenses.length === 0 && !loading ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <span className="text-4xl opacity-40">📂</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#1a2e5a] mb-1">No expenses found</h3>
                            <p className="text-sm text-slate-400 max-w-sm mb-6">There are no expense records matching your current filter criteria.</p>
                            <button onClick={() => { resetForm(); setEditingExpense(null); setShowForm(true); }}
                                className="bg-[#1a2e5a] hover:bg-[#2b4b8c] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2">
                                + Add Expense
                            </button>
                        </div>
                    ) : (
                        viewMode === 'list' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                                            <th className="p-4 sm:px-6 py-4">
                                                <input type="checkbox"
                                                    checked={selectedExpenses.length === expenses.length && expenses.length > 0}
                                                    onChange={(e) => setSelectedExpenses(e.target.checked ? expenses.map(ex => ex._id) : [])}
                                                    className="w-4 h-4 rounded border-slate-300 text-[#1a2e5a] focus:ring-[#1a2e5a]"
                                                />
                                            </th>
                                            <th className="p-4 sm:px-6 py-4">Details</th>
                                            <th className="p-4 sm:px-6 py-4">Category & Dept</th>
                                            <th className="p-4 sm:px-6 py-4 text-right">Amount</th>
                                            <th className="p-4 sm:px-6 py-4 text-center">Status</th>
                                            <th className="p-4 sm:px-6 py-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {expenses.map((expense) => (
                                            <tr key={expense._id} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="p-4 sm:px-6 py-4">
                                                    <input type="checkbox"
                                                        checked={selectedExpenses.includes(expense._id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) setSelectedExpenses(prev => [...prev, expense._id]);
                                                            else setSelectedExpenses(prev => prev.filter(id => id !== expense._id));
                                                        }}
                                                        className="w-4 h-4 rounded border-slate-300 text-[#1a2e5a] focus:ring-[#1a2e5a]"
                                                    />
                                                </td>
                                                <td className="p-4 sm:px-6 py-4">
                                                    <p className="text-sm font-bold text-[#1a2e5a] mb-0.5">{expense.title}</p>
                                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                                        <span>{new Date(expense.expenseDate).toLocaleDateString()}</span>
                                                        {expense.vendor && (
                                                            <>
                                                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                                <span>{expense.vendor}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 sm:px-6 py-4">
                                                    <p className="text-sm font-semibold text-slate-700">{expense.category}</p>
                                                    <p className="text-xs text-slate-400 font-medium">{expense.department}</p>
                                                </td>
                                                <td className="p-4 sm:px-6 py-4 text-right">
                                                    <p className="text-sm font-extrabold text-[#1a2e5a]">৳{(expense.amount || 0).toLocaleString()}</p>
                                                    <p className="text-xs text-slate-400 font-medium">{expense.paymentMethod}</p>
                                                </td>
                                                <td className="p-4 sm:px-6 py-4 text-center">
                                                    {(() => {
                                                        const s = expense.status;
                                                        const color = s === 'Paid' ? 'emerald' : s === 'Approved' ? 'blue' : s === 'Rejected' ? 'rose' : 'amber';
                                                        return (
                                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-${color}-50 text-${color}-700 border-${color}-200`}>
                                                                {s}
                                                            </span>
                                                        );
                                                    })()}
                                                    {expense.priority === 'Urgent' && (
                                                        <span className="block mt-1 text-[9px] font-bold text-rose-500 uppercase">🔥 Urgent</span>
                                                    )}
                                                </td>
                                                <td className="p-4 sm:px-6 py-4">
                                                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {expense.status === 'Pending' && (
                                                            <>
                                                                <button onClick={() => approveExpense(expense._id)} title="Approve" className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors">✓</button>
                                                                <button onClick={() => rejectExpense(expense._id)} title="Reject" className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors">✗</button>
                                                            </>
                                                        )}
                                                        {expense.status === 'Approved' && (
                                                            <button onClick={() => markAsPaid(expense._id)} title="Mark Paid" className="w-7 h-7 rounded-lg bg-[#1a2e5a]/10 text-[#1a2e5a] hover:bg-[#1a2e5a] hover:text-white flex items-center justify-center transition-colors font-bold text-[10px]">PAY</button>
                                                        )}
                                                        <button onClick={() => editExpense(expense)} title="Edit" className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-500 hover:text-white flex items-center justify-center transition-colors">✎</button>
                                                        <button onClick={() => deleteExpense(expense._id)} title="Delete" className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors">🗑</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : viewMode === 'cards' ? (
                            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50">
                                {expenses.map((expense) => (
                                    <div key={expense._id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all relative">
                                        <div className="absolute top-4 right-4">
                                            {(() => {
                                                const s = expense.status;
                                                const color = s === 'Paid' ? 'emerald' : s === 'Approved' ? 'blue' : s === 'Rejected' ? 'rose' : 'amber';
                                                return (
                                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-${color}-50 text-${color}-700 border-${color}-200`}>
                                                        {s}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                        <h3 className="text-sm font-bold text-[#1a2e5a] pr-16 truncate mb-1">{expense.title}</h3>
                                        <p className="text-xs font-semibold text-slate-500 mb-4">{expense.category} • {expense.department}</p>

                                        <div className="bg-slate-50 rounded-lg p-3 mb-4 border border-slate-100">
                                            <p className="text-xs text-slate-400 font-medium mb-1">Amount</p>
                                            <p className="text-lg font-extrabold text-[#1a2e5a]">৳{(expense.amount || 0).toLocaleString()}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                                            <div className="text-[10px] text-slate-400 font-medium">
                                                {new Date(expense.expenseDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex gap-1.5">
                                                <button onClick={() => editExpense(expense)} className="w-6 h-6 rounded bg-slate-100 text-slate-600 hover:bg-slate-500 hover:text-white flex items-center justify-center transition-colors text-xs">✎</button>
                                                <button onClick={() => deleteExpense(expense._id)} className="w-6 h-6 rounded bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors text-xs">🗑</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                                <span className="text-4xl opacity-40 mb-4">📊</span>
                                <h3 className="text-lg font-bold text-[#1a2e5a]">Analytics View Placeholder</h3>
                                <p className="text-sm text-slate-400">Charts and graphs will be rendered here.</p>
                            </div>
                        )
                    )}
                </div>

                {/* ── Add / Edit Modal ── */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f1e3d]/60 backdrop-blur-sm overflow-y-auto">
                        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto animate-[fadeInUp_0.2s_ease]">
                            {/* Header */}
                            <div className="bg-[#1a2e5a] px-6 py-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-white font-extrabold text-lg tracking-wide">{editingExpense ? 'Edit Expense Record' : 'Add New Expense'}</h2>
                                    <p className="text-blue-200 text-xs mt-0.5">{editingExpense ? 'Update details of the selected expense' : 'Fill in the details to record a new expense'}</p>
                                </div>
                                <button onClick={() => { setShowForm(false); resetForm(); setEditingExpense(null); }}
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-lg transition-all"
                                >&times;</button>
                            </div>

                            {/* Form Body */}
                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-[#1a2e5a] uppercase tracking-wider mb-2">Expense Title <span className="text-rose-500">*</span></label>
                                        <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Monthly Electricity Bill"
                                            className="w-full bg-[#f8fafc] border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#1a2e5a] uppercase tracking-wider mb-2">Amount (৳) <span className="text-rose-500">*</span></label>
                                        <input type="number" required min="0" step="any" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00"
                                            className="w-full bg-[#f8fafc] border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#1a2e5a] uppercase tracking-wider mb-2">Expense Date <span className="text-rose-500">*</span></label>
                                        <input type="date" required value={formData.expenseDate} onChange={e => setFormData({ ...formData, expenseDate: e.target.value })}
                                            className="w-full bg-[#f8fafc] border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#1a2e5a] uppercase tracking-wider mb-2">Category <span className="text-rose-500">*</span></label>
                                        <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-[#f8fafc] border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all cursor-pointer">
                                            <option value="" disabled>Select Category</option>
                                            {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#1a2e5a] uppercase tracking-wider mb-2">Department</label>
                                        <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}
                                            className="w-full bg-[#f8fafc] border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all cursor-pointer">
                                            {departmentOptions.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#1a2e5a] uppercase tracking-wider mb-2">Payment Method</label>
                                        <select value={formData.paymentMethod} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                                            className="w-full bg-[#f8fafc] border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all cursor-pointer">
                                            {paymentMethods.map(pm => <option key={pm} value={pm}>{pm}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#1a2e5a] uppercase tracking-wider mb-2">Priority</label>
                                        <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                            className="w-full bg-[#f8fafc] border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all cursor-pointer">
                                            {priorityLevels.map(pl => <option key={pl.value} value={pl.value}>{pl.value}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#1a2e5a] uppercase tracking-wider mb-2">Vendor / Payee</label>
                                        <input type="text" value={formData.vendor} onChange={e => setFormData({ ...formData, vendor: e.target.value })} placeholder="e.g. ABC Corp"
                                            className="w-full bg-[#f8fafc] border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-[#1a2e5a] uppercase tracking-wider mb-2">Invoice / Ref No.</label>
                                        <input type="text" value={formData.invoiceNumber} onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })} placeholder="e.g. INV-2026"
                                            className="w-full bg-[#f8fafc] border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-[#1a2e5a] uppercase tracking-wider mb-2">Description / Notes</label>
                                        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Additional details..." rows="3"
                                            className="w-full bg-[#f8fafc] border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all resize-none"></textarea>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button type="button" onClick={() => { setShowForm(false); resetForm(); setEditingExpense(null); }}
                                        className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold transition-all">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={loading}
                                        className="bg-[#1a2e5a] hover:bg-[#2b4b8c] disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                                        {loading ? 'Saving...' : (editingExpense ? 'Save Changes' : 'Create Expense')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ExpensesManagementPage;
