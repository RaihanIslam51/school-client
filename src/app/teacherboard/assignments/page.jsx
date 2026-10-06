'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { API_URL } from '../../../../config/api';
import Swal from 'sweetalert2';
import ImgBBUpload from '../../../../components/ImgBBUpload';

export default function AssignmentManagement() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [filterClass, setFilterClass] = useState('');
    const [filterSubject, setFilterSubject] = useState('');
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [currentTeacher, setCurrentTeacher] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        className: '',
        section: '',
        deadline: '',
        imageUrl: '',
        teacherId: '',
        teacherName: '',
        totalMarks: '',
        status: 'active'
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const user = JSON.parse(userData);
            setCurrentTeacher(user);
        }
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/assignments`);
            const data = await response.json();
            if (data.success) {
                setAssignments(data.data);
            }
        } catch (error) {
            console.error('Error fetching assignments:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch assignments',
                customClass: { container: 'swal-high-z-index' }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageUpload = (url) => {
        setUploadedImageUrl(url);
        setFormData({
            ...formData,
            imageUrl: url
        });
    };

    const handleAddAssignment = () => {
        setIsEditMode(false);
        setCurrentAssignment(null);
        setUploadedImageUrl('');
        setFormData({
            title: '',
            description: '',
            subject: '',
            className: '',
            section: '',
            deadline: '',
            imageUrl: '',
            teacherId: currentTeacher?.teacherId || '',
            teacherName: currentTeacher?.name || '',
            totalMarks: '',
            status: 'active'
        });
        setIsModalOpen(true);
    };

    const handleEditAssignment = (assignment) => {
        setIsEditMode(true);
        setCurrentAssignment(assignment);
        setUploadedImageUrl(assignment.imageUrl || '');
        setFormData({
            title: assignment.title,
            description: assignment.description,
            subject: assignment.subject,
            className: assignment.className,
            section: assignment.section,
            deadline: assignment.deadline,
            imageUrl: assignment.imageUrl || '',
            teacherId: assignment.teacherId,
            teacherName: assignment.teacherName,
            totalMarks: assignment.totalMarks || '',
            status: assignment.status
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let url, method;
            if (isEditMode) {
                url = `${API_URL}/api/assignments/${currentAssignment._id}`;
                method = 'PUT';
            } else {
                url = `${API_URL}/api/assignments`;
                method = 'POST';
            }
            
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                await Swal.fire({
                    icon: 'success',
                    title: isEditMode ? 'Updated!' : 'Created!',
                    text: isEditMode ? 'Assignment updated successfully' : 'Assignment created successfully',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { container: 'swal-high-z-index' }
                });
                setIsModalOpen(false);
                await fetchAssignments();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'Operation failed',
                    customClass: { container: 'swal-high-z-index' }
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong!',
                customClass: { container: 'swal-high-z-index' }
            });
        }
    };

    const handleDeleteAssignment = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#0B0F28',
            confirmButtonText: 'Yes, delete it!',
            customClass: { container: 'swal-high-z-index' }
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_URL}/api/assignments/${id}`, {
                    method: 'DELETE',
                });
                const data = await response.json();
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Assignment has been deleted.',
                        timer: 2000,
                        showConfirmButton: false,
                        customClass: { container: 'swal-high-z-index' }
                    });
                    fetchAssignments();
                }
            } catch (error) {
                console.error('Error deleting assignment:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete assignment',
                    customClass: { container: 'swal-high-z-index' }
                });
            }
        }
    };

    const filteredAssignments = assignments.filter(assignment => {
        const matchesClass = filterClass === '' || assignment.className === filterClass;
        const matchesSubject = filterSubject === '' || assignment.subject.toLowerCase().includes(filterSubject.toLowerCase());
        return matchesClass && matchesSubject;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDeadlineStatus = (deadline) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { status: 'overdue', bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]', label: 'Overdue' };
        if (diffDays <= 2) return { status: 'urgent', bg: 'bg-[#FF5500]/10', text: 'text-[#FF5500]', label: `${diffDays} days left` };
        return { status: 'active', bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', label: `${diffDays} days left` };
    };

    return (
        <div className="animate-fade-in font-sans space-y-4 sm:space-y-5">
            {/* Header & Filters */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FF5500]/10 rounded-xl flex items-center justify-center shrink-0 text-[#FF5500]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-base sm:text-xl font-extrabold text-[#0B0F28] tracking-tight">
                                Assignment Management
                            </h2>
                            <p className="text-gray-500 text-xs">Create and manage assignments for your classes</p>
                        </div>
                    </div>
                    <button
                        onClick={handleAddAssignment}
                        className="bg-[#FF5500] hover:bg-[#e04b00] text-white px-4 py-2.5 rounded-xl transition-colors font-bold text-xs shadow-sm flex items-center gap-2 justify-center"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Create Assignment
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#F4F5F8] p-3 rounded-xl border border-gray-200/70">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Filter by Class</label>
                        <select
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl outline-none text-xs font-bold text-[#0B0F28]"
                        >
                            <option value="">All Classes</option>
                            {[...Array(10)].map((_, i) => (
                                <option key={i} value={`Class ${i + 1}`}>Class {i + 1}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Filter by Subject</label>
                        <input
                            type="text"
                            value={filterSubject}
                            onChange={(e) => setFilterSubject(e.target.value)}
                            placeholder="Search subject..."
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl outline-none text-xs font-bold text-[#0B0F28]"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => { setFilterClass(''); setFilterSubject(''); }}
                            className="w-full px-3 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors text-xs"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
                {[
                    { label: 'Total Assignments', value: assignments.length, color: 'text-[#0B0F28]', bg: 'bg-[#0B0F28]/10' },
                    { label: 'Active', value: assignments.filter(a => a.status === 'active').length, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10' },
                    { label: 'Due Soon', value: assignments.filter(a => getDeadlineStatus(a.deadline).status === 'urgent').length, color: 'text-[#FF5500]', bg: 'bg-[#FF5500]/10' },
                    { label: 'Overdue', value: assignments.filter(a => getDeadlineStatus(a.deadline).status === 'overdue').length, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white border border-gray-200/80 p-4 rounded-2xl shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{stat.label}</p>
                            <p className={`text-2xl font-extrabold ${stat.color} mt-0.5`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cards Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-200/80 shadow-sm">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF5500]"></div>
                    <p className="mt-3 text-xs text-[#0B0F28] font-bold">Loading assignments...</p>
                </div>
            ) : filteredAssignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-200/80 shadow-sm">
                    <p className="text-sm font-extrabold text-[#0B0F28]">No assignments found</p>
                    <p className="text-xs text-gray-500 mt-0.5">Create an assignment to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredAssignments.map((assignment) => {
                        const deadlineInfo = getDeadlineStatus(assignment.deadline);
                        return (
                            <div key={assignment._id} className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
                                <div className="relative h-36 bg-[#F4F5F8] border-b border-gray-200/70 overflow-hidden">
                                    {assignment.imageUrl ? (
                                        <img
                                            src={assignment.imageUrl}
                                            alt={assignment.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute top-2.5 right-2.5">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${deadlineInfo.bg} ${deadlineInfo.text}`}>
                                            {deadlineInfo.label}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="text-sm font-extrabold text-[#0B0F28] line-clamp-1 mb-1 group-hover:text-[#FF5500] transition-colors">
                                        {assignment.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-3 line-clamp-2 font-medium">
                                        {assignment.description}
                                    </p>

                                    <div className="space-y-1.5 mt-auto mb-3 text-xs">
                                        <div className="flex justify-between text-gray-600 font-medium">
                                            <span>Subject:</span>
                                            <strong className="text-[#0B0F28]">{assignment.subject}</strong>
                                        </div>
                                        <div className="flex justify-between text-gray-600 font-medium">
                                            <span>Class:</span>
                                            <strong className="text-[#0B0F28]">{assignment.className} - {assignment.section}</strong>
                                        </div>
                                        <div className="flex justify-between text-gray-600 font-medium">
                                            <span>Deadline:</span>
                                            <strong className="text-[#FF5500]">{formatDate(assignment.deadline)}</strong>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 mt-auto">
                                        <button
                                            onClick={() => handleEditAssignment(assignment)}
                                            className="bg-gray-100 hover:bg-gray-200 text-[#0B0F28] px-2.5 py-1.5 rounded-xl transition-colors text-xs font-bold"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAssignment(assignment._id)}
                                            className="bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] px-2.5 py-1.5 rounded-xl transition-colors text-xs font-bold"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0B0F28]/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl flex flex-col">
                        <div className="bg-[#0B0F28] text-white p-4 shrink-0 flex items-center justify-between">
                            <h3 className="text-base font-extrabold flex items-center gap-2">
                                <span className="text-[#FF5500]">📝</span>
                                {isEditMode ? 'Edit Assignment' : 'Create New Assignment'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-white p-1"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto custom-scrollbar">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-[#0B0F28] mb-1">Assignment Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 bg-[#F4F5F8] border border-gray-200 rounded-xl outline-none text-xs font-bold text-[#0B0F28]"
                                        placeholder="Title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#0B0F28] mb-1">Description *</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows="3"
                                        className="w-full px-3 py-2 bg-[#F4F5F8] border border-gray-200 rounded-xl outline-none text-xs font-bold text-[#0B0F28] resize-none"
                                        placeholder="Description..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-[#0B0F28] mb-1">Subject *</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 bg-[#F4F5F8] border border-gray-200 rounded-xl outline-none text-xs font-bold text-[#0B0F28]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#0B0F28] mb-1">Class *</label>
                                        <select
                                            name="className"
                                            value={formData.className}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 bg-[#F4F5F8] border border-gray-200 rounded-xl outline-none text-xs font-bold text-[#0B0F28]"
                                        >
                                            <option value="">Select Class</option>
                                            {[...Array(10)].map((_, i) => (
                                                <option key={i} value={`Class ${i + 1}`}>Class {i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-[#0B0F28] mb-1">Section *</label>
                                        <select
                                            name="section"
                                            value={formData.section}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 bg-[#F4F5F8] border border-gray-200 rounded-xl outline-none text-xs font-bold text-[#0B0F28]"
                                        >
                                            <option value="">Select Section</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                            <option value="D">D</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-[#0B0F28] mb-1">Deadline *</label>
                                        <input
                                            type="date"
                                            name="deadline"
                                            value={formData.deadline}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 bg-[#F4F5F8] border border-gray-200 rounded-xl outline-none text-xs font-bold text-[#0B0F28]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#0B0F28] mb-1">Assignment Image (Optional)</label>
                                    <ImgBBUpload onUploadSuccess={handleImageUpload} />
                                </div>

                                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold rounded-xl text-xs transition-colors"
                                    >
                                        {isEditMode ? 'Update Assignment' : 'Create Assignment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}