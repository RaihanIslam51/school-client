'use client';
import { useState, useEffect } from 'react';
import { API_URL } from '../../../../config/api';
import Swal from 'sweetalert2';

export default function ExamManagement() {
    const [activeTab, setActiveTab] = useState('setup'); // setup, schedule, marks, list
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [scheduleViewMode, setScheduleViewMode] = useState('edit'); // 'edit' or 'view'

    // Exam Setup State
    const [examSetup, setExamSetup] = useState({
        examName: '',
        examType: 'Mid Term',
        academicYear: new Date().getFullYear().toString(),
        class: '',
        section: '',
        examCategory: 'Written',
        totalMarks: '',
        passMarks: '',
        startDate: '',
        endDate: '',
        status: 'Draft'
    });

    // Subject Schedule State
    const [subjects, setSubjects] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);

    // Mark Distribution State
    const [markDistribution, setMarkDistribution] = useState({
        examId: '',
        subject: '',
        written: '',
        mcq: '',
        practical: '',
        viva: '',
        isOptional: false
    });

    const [gradeSystem, setGradeSystem] = useState([
        { grade: 'A+', minMarks: 80, maxMarks: 100 },
        { grade: 'A', minMarks: 70, maxMarks: 79 },
        { grade: 'A-', minMarks: 60, maxMarks: 69 },
        { grade: 'B', minMarks: 50, maxMarks: 59 },
        { grade: 'C', minMarks: 40, maxMarks: 49 },
        { grade: 'D', minMarks: 33, maxMarks: 39 },
        { grade: 'F', minMarks: 0, maxMarks: 32 }
    ]);

    useEffect(() => {
        fetchExams();
        fetchTeachers();
    }, []);

    useEffect(() => {
        if (selectedExam) {
            fetchExamDetails(selectedExam);
        } else {
            setSubjects([]); // Clear subjects when no exam selected
        }
    }, [selectedExam]);

    const fetchExams = async () => {
        try {
            const response = await fetch(`${API_URL}/api/exams`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                setExams(data.data);
            }
        } catch (error) {
            console.error('Error fetching exams:', error);
            // Don't show error on initial load, just log it
            if (error.message !== 'Failed to fetch') {
                Swal.fire({
                    icon: 'error',
                    title: 'Connection Error',
                    text: 'Unable to connect to server. Please make sure the server is running.',
                    customClass: { container: 'swal-high-z-index' }
                });
            }
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await fetch(`${API_URL}/api/teachers`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                setTeachers(data.data);
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
            // Silently fail - teachers are optional for initial setup
        }
    };

    const fetchExamDetails = async (examId) => {
        try {
            const response = await fetch(`${API_URL}/api/exams/${examId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
                // Add id to each subject for local management
                const subjectsWithIds = data.data.subjects.map((subject, index) => ({
                    ...subject,
                    id: subject._id || `existing-${index}-${Date.now()}`, // Use _id if available, else generate
                    examDate: subject.examDate ? new Date(subject.examDate).toISOString().split('T')[0] : '' // Format date for input
                }));
                setSubjects(subjectsWithIds);
            }
        } catch (error) {
            console.error('Error fetching exam details:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load exam schedule details.',
                customClass: { container: 'swal-high-z-index' }
            });
        }
    };

    const handleExamSetupSubmit = async (e) => {
        e.preventDefault();
        
        // Check all required fields
        if (!examSetup.examName || !examSetup.class || !examSetup.section || 
            !examSetup.academicYear || !examSetup.examCategory || 
            !examSetup.totalMarks || !examSetup.passMarks || 
            !examSetup.startDate || !examSetup.endDate) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please fill all required fields',
                customClass: { container: 'swal-high-z-index' }
            });
            return;
        }

        // Validate pass marks
        if (parseInt(examSetup.passMarks) > parseInt(examSetup.totalMarks)) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Marks',
                text: 'Pass marks cannot be greater than total marks',
                customClass: { container: 'swal-high-z-index' }
            });
            return;
        }

        // Validate dates
        if (new Date(examSetup.startDate) > new Date(examSetup.endDate)) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid Dates',
                text: 'End date must be after start date',
                customClass: { container: 'swal-high-z-index' }
            });
            return;
        }

        try {
            setLoading(true);
            const examData = {
                ...examSetup,
                totalMarks: parseInt(examSetup.totalMarks),
                passMarks: parseInt(examSetup.passMarks)
            };
            
            const response = await fetch(`${API_URL}/api/exams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(examData)
            });

            const data = await response.json();

            if (data.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Exam created successfully',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { container: 'swal-high-z-index' }
                });
                fetchExams();
                setExamSetup({
                    examName: '',
                    examType: 'Mid Term',
                    academicYear: new Date().getFullYear().toString(),
                    class: '',
                    section: '',
                    examCategory: 'Written',
                    totalMarks: '',
                    passMarks: '',
                    startDate: '',
                    endDate: '',
                    status: 'Draft'
                });
                setActiveTab('list');
            } else {
                throw new Error(data.message || 'Failed to create exam');
            }
        } catch (error) {
            console.error('Error creating exam:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to create exam',
                customClass: { container: 'swal-high-z-index' }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, {
            id: Date.now(),
            subjectName: '',
            examDate: '',
            startTime: '',
            endTime: '',
            duration: '',
            room: '',
            invigilator: ''
        }]);
    };

    const handleSubjectChange = (id, field, value) => {
        setSubjects(subjects.map(subject =>
            subject.id === id ? { ...subject, [field]: value } : subject
        ));
    };

    const handleRemoveSubject = (id) => {
        setSubjects(subjects.filter(subject => subject.id !== id));
    };

    const handleScheduleSubmit = async () => {
        if (!selectedExam) {
            Swal.fire({
                icon: 'warning',
                title: 'No Exam Selected',
                text: 'Please select an exam first',
                customClass: { container: 'swal-high-z-index' }
            });
            return;
        }

        // Validate subjects
        const validSubjects = subjects.filter(subject => 
            subject.subjectName && subject.examDate && subject.startTime && subject.endTime && subject.duration
        );

        if (validSubjects.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete Subjects',
                text: 'Please fill all required fields (Subject Name, Exam Date, Start Time, End Time, Duration) for at least one subject before saving.',
                customClass: { container: 'swal-high-z-index' }
            });
            return;
        }

        // Process subjects data for API
        const processedSubjects = validSubjects.map(subject => ({
            subjectName: subject.subjectName,
            examDate: new Date(subject.examDate),
            startTime: subject.startTime,
            endTime: subject.endTime,
            duration: parseInt(subject.duration),
            room: subject.room || '',
            invigilator: subject.invigilator || undefined
        }));

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/exams/${selectedExam}/schedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subjects: processedSubjects })
            });

            const data = await response.json();
            
            if (data.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Exam schedule saved successfully',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { container: 'swal-high-z-index' }
                });
                setSubjects([]);
                fetchExams(); // Refresh exam list to show updated data
            } else {
                throw new Error(data.message || 'Failed to save schedule');
            }
        } catch (error) {
            console.error('Error saving schedule:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to save exam schedule',
                customClass: { container: 'swal-high-z-index' }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleMarkDistributionSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/exams/marks-distribution`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(markDistribution)
            });

            const data = await response.json();
            
            if (data.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Mark distribution saved successfully',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { container: 'swal-high-z-index' }
                });
                // Refresh exams list to show updated mark distributions
                await fetchExams();
                setMarkDistribution({
                    examId: '',
                    subject: '',
                    written: '',
                    mcq: '',
                    practical: '',
                    viva: '',
                    isOptional: false
                });
            }
        } catch (error) {
            console.error('Error saving mark distribution:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to save mark distribution',
                customClass: { container: 'swal-high-z-index' }
            });
        } finally {
            setLoading(false);
        }
    };

    const updateExamStatus = async (examId, newStatus) => {
        try {
            const response = await fetch(`${API_URL}/api/exams/${examId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();
            
            if (data.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: `Exam status changed to ${newStatus}`,
                    timer: 1500,
                    showConfirmButton: false,
                    customClass: { container: 'swal-high-z-index' }
                });
                fetchExams();
            }
        } catch (error) {
            console.error('Error updating exam status:', error);
        }
    };

    const deleteExam = async (examId) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'This will delete the exam permanently!',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            customClass: { container: 'swal-high-z-index' }
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_URL}/api/exams/${examId}`, {
                    method: 'DELETE'
                });

                const data = await response.json();
                
                if (data.success) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Exam has been deleted',
                        timer: 1500,
                        showConfirmButton: false,
                        customClass: { container: 'swal-high-z-index' }
                    });
                    fetchExams();
                }
            } catch (error) {
                console.error('Error deleting exam:', error);
            }
        }
    };

    return (
        <div className="p-4 lg:p-8">
            <style jsx global>{`
                .swal-high-z-index {
                    z-index: 10000 !important;
                }
            `}</style>
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                        <svg className="w-8 h-8 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Exam Management System
                    </h2>
                    <p className="text-gray-600">Professional exam setup, scheduling & mark distribution</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-6 border-b-2 border-gray-200 pb-2">
                    <button
                        onClick={() => setActiveTab('setup')}
                        className={`px-6 py-3 rounded-t-lg font-semibold transition-all duration-200 ${
                            activeTab === 'setup'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            Exam Setup
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('schedule')}
                        className={`px-6 py-3 rounded-t-lg font-semibold transition-all duration-200 ${
                            activeTab === 'schedule'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Subject Schedule
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('marks')}
                        className={`px-6 py-3 rounded-t-lg font-semibold transition-all duration-200 ${
                            activeTab === 'marks'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Mark Distribution
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`px-6 py-3 rounded-t-lg font-semibold transition-all duration-200 ${
                            activeTab === 'list'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            Exam List
                        </span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="mt-6">
                    {/* Exam Setup Tab */}
                    {activeTab === 'setup' && (
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Create New Exam
                            </h3>
                            
                            <form onSubmit={handleExamSetupSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Name *</label>
                                        <input
                                            type="text"
                                            value={examSetup.examName}
                                            onChange={(e) => setExamSetup({...examSetup, examName: e.target.value})}
                                            placeholder="e.g., Mid Term Exam 2024"
                                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Type *</label>
                                        <select
                                            value={examSetup.examType}
                                            onChange={(e) => setExamSetup({...examSetup, examType: e.target.value})}
                                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        >
                                            <option value="Mid Term">Mid Term</option>
                                            <option value="Final">Final</option>
                                            <option value="Class Test">Class Test</option>
                                            <option value="Monthly Test">Monthly Test</option>
                                            <option value="Half Yearly">Half Yearly</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year *</label>
                                        <input
                                            type="text"
                                            value={examSetup.academicYear}
                                            onChange={(e) => setExamSetup({...examSetup, academicYear: e.target.value})}
                                            placeholder="2024-2025"
                                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Class *</label>
                                        <select
                                            value={examSetup.class}
                                            onChange={(e) => setExamSetup({...examSetup, class: e.target.value})}
                                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            required
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
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Section *</label>
                                        <select
                                            value={examSetup.section}
                                            onChange={(e) => setExamSetup({...examSetup, section: e.target.value})}
                                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            required
                                        >
                                            <option value="">Select Section</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                            <option value="D">D</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Category *</label>
                                        <select
                                            value={examSetup.examCategory}
                                            onChange={(e) => setExamSetup({...examSetup, examCategory: e.target.value})}
                                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        >
                                            <option value="Written">Written</option>
                                            <option value="MCQ">MCQ</option>
                                            <option value="Practical">Practical</option>
                                            <option value="Viva">Viva</option>
                                            <option value="Mixed">Mixed</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Total Marks *</label>
                                        <input
                                            type="number"
                                            value={examSetup.totalMarks}
                                            onChange={(e) => setExamSetup({...examSetup, totalMarks: e.target.value})}
                                            placeholder="100"
                                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pass Marks *</label>
                                        <input
                                            type="number"
                                            value={examSetup.passMarks}
                                            onChange={(e) => setExamSetup({...examSetup, passMarks: e.target.value})}
                                            placeholder="33"
                                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                                        <input
                                            type="date"
                                            value={examSetup.startDate}
                                            onChange={(e) => setExamSetup({...examSetup, startDate: e.target.value})}
                                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
                                        <input
                                            type="date"
                                            value={examSetup.endDate}
                                            onChange={(e) => setExamSetup({...examSetup, endDate: e.target.value})}
                                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Status *</label>
                                        <select
                                            value={examSetup.status}
                                            onChange={(e) => setExamSetup({...examSetup, status: e.target.value})}
                                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        >
                                            <option value="Draft">Draft</option>
                                            <option value="Published">Published</option>
                                            <option value="Ongoing">Ongoing</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-200 font-semibold disabled:opacity-50"
                                    >
                                        {loading ? 'Creating...' : 'Create Exam'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setExamSetup({
                                            examName: '',
                                            examType: 'Mid Term',
                                            academicYear: new Date().getFullYear().toString(),
                                            class: '',
                                            section: '',
                                            examCategory: 'Written',
                                            totalMarks: '',
                                            passMarks: '',
                                            startDate: '',
                                            endDate: '',
                                            status: 'Draft'
                                        })}
                                        className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Subject Schedule Tab - Will be implemented in next message */}
                    {activeTab === 'schedule' && (
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Subject-wise Exam Scheduling
                                </h3>
                                <button
                                    onClick={() => setScheduleViewMode(scheduleViewMode === 'edit' ? 'view' : 'edit')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    {scheduleViewMode === 'edit' ? 'View Schedules' : 'Edit Schedules'}
                                </button>
                            </div>

                            {scheduleViewMode === 'edit' ? (
                                <>
                                    <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6">
                                        <div className="flex items-start gap-2">
                                            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <h4 className="font-semibold text-blue-900">Required Fields</h4>
                                                <p className="text-sm text-blue-800">Fields marked with <span className="text-red-500">*</span> are required: Subject Name, Exam Date, Start Time, End Time, and Duration.</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Exam *</label>
                                        <select
                                            value={selectedExam || ''}
                                            onChange={(e) => setSelectedExam(e.target.value)}
                                            className="w-full max-w-md px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        >
                                            <option value="">Choose an exam</option>
                                            {exams.map(exam => (
                                                <option key={exam._id} value={exam._id}>
                                                    {exam.examName} - {exam.class} ({exam.section})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedExam && (
                                        <>
                                            <div className="space-y-4">
                                                {subjects.map((subject, index) => (
                                                    <div key={subject.id} className="bg-white p-5 rounded-lg border-2 border-blue-200 shadow-sm">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className="text-lg font-semibold text-gray-900">Subject #{index + 1}</h4>
                                                            <button
                                                                onClick={() => handleRemoveSubject(subject.id)}
                                                                className="text-red-600 hover:text-red-800 font-semibold"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name <span className="text-red-500">*</span></label>
                                                                <input
                                                                    type="text"
                                                                    value={subject.subjectName}
                                                                    onChange={(e) => handleSubjectChange(subject.id, 'subjectName', e.target.value)}
                                                                    placeholder="Mathematics"
                                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                    required
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Date <span className="text-red-500">*</span></label>
                                                                <input
                                                                    type="date"
                                                                    value={subject.examDate}
                                                                    onChange={(e) => handleSubjectChange(subject.id, 'examDate', e.target.value)}
                                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                    required
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time <span className="text-red-500">*</span></label>
                                                                <input
                                                                    type="time"
                                                                    value={subject.startTime}
                                                                    onChange={(e) => handleSubjectChange(subject.id, 'startTime', e.target.value)}
                                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                    required
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">End Time <span className="text-red-500">*</span></label>
                                                                <input
                                                                    type="time"
                                                                    value={subject.endTime}
                                                                    onChange={(e) => handleSubjectChange(subject.id, 'endTime', e.target.value)}
                                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                    required
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) <span className="text-red-500">*</span></label>
                                                                <input
                                                                    type="number"
                                                                    value={subject.duration}
                                                                    onChange={(e) => handleSubjectChange(subject.id, 'duration', e.target.value)}
                                                                    placeholder="120"
                                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                    required
                                                                />
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">Room / Hall</label>
                                                                <input
                                                                    type="text"
                                                                    value={subject.room}
                                                                    onChange={(e) => handleSubjectChange(subject.id, 'room', e.target.value)}
                                                                    placeholder="Room 101"
                                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </div>

                                                            <div className="md:col-span-2">
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">Invigilator (Teacher)</label>
                                                                <select
                                                                    value={subject.invigilator}
                                                                    onChange={(e) => handleSubjectChange(subject.id, 'invigilator', e.target.value)}
                                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                >
                                                                    <option value="">Select Teacher</option>
                                                                    {teachers.map(teacher => (
                                                                        <option key={teacher._id} value={teacher._id}>
                                                                            {teacher.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-6 flex gap-3">
                                                <button
                                                    onClick={handleAddSubject}
                                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
                                                >
                                                    + Add Subject
                                                </button>
                                                {subjects.length > 0 && (
                                                    <button
                                                        onClick={handleScheduleSubmit}
                                                        disabled={loading}
                                                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50"
                                                    >
                                                        {loading ? 'Saving...' : 'Save Schedule'}
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                // View Mode
                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border-2 border-emerald-200">
                                    <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        All Subject Schedules Overview
                                    </h4>

                                    {exams.length === 0 ? (
                                        <div className="text-center py-16">
                                            <svg className="w-32 h-32 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Exams Found</h3>
                                            <p className="text-gray-600 mb-6">Create exams first to view their schedules</p>
                                            <button
                                                onClick={() => setActiveTab('setup')}
                                                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-semibold"
                                            >
                                                Create New Exam
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {exams.map((exam) => (
                                                <div key={exam._id} className="bg-white rounded-lg border-2 border-emerald-200 shadow-sm overflow-hidden">
                                                    <div className="bg-emerald-600 text-white px-6 py-4">
                                                        <h5 className="text-lg font-bold">{exam.examName}</h5>
                                                        <p className="text-sm opacity-90">
                                                            {exam.class} - Section {exam.section} | {exam.examType} | {exam.academicYear}
                                                        </p>
                                                    </div>

                                                    {exam.subjects && exam.subjects.length > 0 ? (
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full">
                                                                <thead className="bg-emerald-50">
                                                                    <tr>
                                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">Subject</th>
                                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">Date</th>
                                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">Time</th>
                                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">Duration</th>
                                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">Room</th>
                                                                        <th className="px-4 py-3 text-left text-sm font-semibold text-emerald-900">Invigilator</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {exam.subjects.map((subject, index) => (
                                                                        <tr key={index} className="border-t border-emerald-100 hover:bg-emerald-25">
                                                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                                                {subject.subjectName}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                                                {subject.examDate ? new Date(subject.examDate).toLocaleDateString() : 'N/A'}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                                                {subject.startTime} - {subject.endTime}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                                                {subject.duration} min
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                                                {subject.room || 'Not assigned'}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                                                {subject.invigilator ? 
                                                                                    teachers.find(t => t._id === subject.invigilator)?.name || 'Unknown' 
                                                                                    : 'Not assigned'}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : (
                                                        <div className="px-6 py-8 text-center">
                                                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <p className="text-gray-500 font-medium">No subjects scheduled for this exam</p>
                                                            <button
                                                                onClick={() => setScheduleViewMode('edit')}
                                                                className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-sm font-semibold"
                                                            >
                                                                Schedule Subjects
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}



                    {/* Mark Distribution Tab - Continuing in next section */}
                    {activeTab === 'marks' && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Subject Mark Distribution</h3>
                                
                                <form onSubmit={handleMarkDistributionSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Exam *</label>
                                            <select
                                                value={markDistribution.examId}
                                                onChange={(e) => setMarkDistribution({...markDistribution, examId: e.target.value})}
                                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                required
                                            >
                                                <option value="">Choose an exam</option>
                                                {exams.map(exam => (
                                                    <option key={exam._id} value={exam._id}>
                                                        {exam.examName} - {exam.class} ({exam.section})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Name *</label>
                                            <input
                                                type="text"
                                                value={markDistribution.subject}
                                                onChange={(e) => setMarkDistribution({...markDistribution, subject: e.target.value})}
                                                placeholder="Mathematics"
                                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Written Marks</label>
                                            <input
                                                type="number"
                                                value={markDistribution.written}
                                                onChange={(e) => setMarkDistribution({...markDistribution, written: e.target.value})}
                                                placeholder="50"
                                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">MCQ Marks</label>
                                            <input
                                                type="number"
                                                value={markDistribution.mcq}
                                                onChange={(e) => setMarkDistribution({...markDistribution, mcq: e.target.value})}
                                                placeholder="30"
                                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Practical Marks</label>
                                            <input
                                                type="number"
                                                value={markDistribution.practical}
                                                onChange={(e) => setMarkDistribution({...markDistribution, practical: e.target.value})}
                                                placeholder="10"
                                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Viva Marks</label>
                                            <input
                                                type="number"
                                                value={markDistribution.viva}
                                                onChange={(e) => setMarkDistribution({...markDistribution, viva: e.target.value})}
                                                placeholder="10"
                                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={markDistribution.isOptional}
                                                onChange={(e) => setMarkDistribution({...markDistribution, isOptional: e.target.checked})}
                                                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                            />
                                            <span className="ml-3 text-sm font-semibold text-gray-700">Optional Subject</span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Mark Distribution'}
                                    </button>
                                </form>
                            </div>

                            {/* Existing Mark Distributions Display */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Existing Mark Distributions
                                </h3>

                                {exams.length === 0 ? (
                                    <div className="text-center py-16">
                                        <svg className="w-32 h-32 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Exams Found</h3>
                                        <p className="text-gray-600 mb-6">Create exams first to view mark distributions</p>
                                        <button
                                            onClick={() => setActiveTab('setup')}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
                                        >
                                            Create New Exam
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {exams.map((exam) => (
                                            <div key={exam._id} className="bg-white rounded-lg border-2 border-blue-200 shadow-sm overflow-hidden">
                                                <div className="bg-blue-600 text-white px-6 py-4">
                                                    <h4 className="text-lg font-bold">{exam.examName}</h4>
                                                    <p className="text-sm opacity-90">
                                                        {exam.class} - Section {exam.section} | {exam.examType} | Total: {exam.totalMarks} marks
                                                    </p>
                                                </div>

                                                {exam.markDistribution && exam.markDistribution.length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full">
                                                            <thead className="bg-blue-50">
                                                                <tr>
                                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">Subject</th>
                                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">Written</th>
                                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">MCQ</th>
                                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">Practical</th>
                                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">Viva</th>
                                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">Total</th>
                                                                    <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">Type</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {exam.markDistribution.map((mark, index) => {
                                                                    const total = (mark.written || 0) + (mark.mcq || 0) + (mark.practical || 0) + (mark.viva || 0);
                                                                    return (
                                                                        <tr key={index} className="border-t border-blue-100 hover:bg-blue-25">
                                                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                                                {mark.subject}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                                                {mark.written || 0}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                                                {mark.mcq || 0}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                                                {mark.practical || 0}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                                                {mark.viva || 0}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                                                                                {total}
                                                                            </td>
                                                                            <td className="px-4 py-3 text-sm text-gray-700">
                                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                                    mark.isOptional 
                                                                                        ? 'bg-yellow-100 text-yellow-800' 
                                                                                        : 'bg-green-100 text-green-800'
                                                                                }`}>
                                                                                    {mark.isOptional ? 'Optional' : 'Compulsory'}
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <div className="px-6 py-8 text-center">
                                                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                        </svg>
                                                        <p className="text-gray-500 font-medium">No mark distributions set for this exam</p>
                                                        <button
                                                            onClick={() => {
                                                                setMarkDistribution({...markDistribution, examId: exam._id});
                                                                // Scroll to form
                                                                document.querySelector('.bg-gradient-to-br.from-green-50')?.scrollIntoView({ behavior: 'smooth' });
                                                            }}
                                                            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-semibold"
                                                        >
                                                            Add Mark Distribution
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Grade System */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Grading System</h3>
                                
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-purple-200">
                                                <th className="border-2 border-purple-300 px-4 py-3 text-left font-bold">Grade</th>
                                                <th className="border-2 border-purple-300 px-4 py-3 text-left font-bold">Min Marks</th>
                                                <th className="border-2 border-purple-300 px-4 py-3 text-left font-bold">Max Marks</th>
                                                <th className="border-2 border-purple-300 px-4 py-3 text-left font-bold">Grade Point</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {gradeSystem.map((grade, index) => (
                                                <tr key={index} className="hover:bg-purple-100 transition-colors">
                                                    <td className="border-2 border-purple-200 px-4 py-3">
                                                        <span className="font-bold text-lg text-purple-900">{grade.grade}</span>
                                                    </td>
                                                    <td className="border-2 border-purple-200 px-4 py-3">{grade.minMarks}</td>
                                                    <td className="border-2 border-purple-200 px-4 py-3">{grade.maxMarks}</td>
                                                    <td className="border-2 border-purple-200 px-4 py-3">
                                                        <span className="font-semibold">
                                                            {grade.grade === 'A+' ? '5.00' : 
                                                             grade.grade === 'A' ? '4.00' : 
                                                             grade.grade === 'A-' ? '3.50' : 
                                                             grade.grade === 'B' ? '3.00' : 
                                                             grade.grade === 'C' ? '2.00' : 
                                                             grade.grade === 'D' ? '1.00' : '0.00'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Exam List Tab */}
                    {activeTab === 'list' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">All Exams</h3>
                                <span className="text-sm text-gray-600 bg-indigo-50 px-4 py-2 rounded-lg font-semibold">
                                    {exams.length} Exam{exams.length !== 1 ? 's' : ''} Found
                                </span>
                            </div>

                            {exams.length === 0 ? (
                                <div className="text-center py-16">
                                    <svg className="w-32 h-32 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No Exams Created Yet</h3>
                                    <p className="text-gray-600 mb-6">Start by creating your first exam in the Exam Setup tab</p>
                                    <button
                                        onClick={() => setActiveTab('setup')}
                                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold"
                                    >
                                        Create New Exam
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {exams.map((exam) => (
                                        <div key={exam._id} className="bg-gradient-to-br from-white to-indigo-50 border-2 border-indigo-200 rounded-2xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h4 className="text-xl font-bold text-gray-900 mb-2">{exam.examName}</h4>
                                                    <div className="space-y-1 text-sm text-gray-600">
                                                        <p className="flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                            </svg>
                                                            {exam.class} - Section {exam.section}
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Total: {exam.totalMarks} | Pass: {exam.passMarks}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    exam.status === 'Published' ? 'bg-green-100 text-green-800' :
                                                    exam.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                                                    exam.status === 'Completed' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {exam.status}
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-4 border-t-2 border-indigo-100">
                                                <select
                                                    onChange={(e) => updateExamStatus(exam._id, e.target.value)}
                                                    className="flex-1 px-3 py-2 text-sm border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                                    defaultValue={exam.status}
                                                >
                                                    <option value="Draft">Draft</option>
                                                    <option value="Published">Published</option>
                                                    <option value="Ongoing">Ongoing</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                                <button
                                                    onClick={() => deleteExam(exam._id)}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
