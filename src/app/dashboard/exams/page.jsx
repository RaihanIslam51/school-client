'use client';
import { useState, useEffect, useMemo } from 'react';
import { API_URL } from '../../../../config/api';
import Swal from 'sweetalert2';

export default function ExamManagement() {
    const [activeTab, setActiveTab] = useState('setup'); // setup, schedule, marks, list
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [scheduleViewMode, setScheduleViewMode] = useState('edit'); // 'edit' or 'view'

    // Search query for Exam List filtering
    const [searchQuery, setSearchQuery] = useState('');

    // Track active editing state for Exam Setup
    const [editingExamId, setEditingExamId] = useState(null);

    // Form validation errors state
    const [errors, setErrors] = useState({});

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
        status: 'Draft',
        // Optional local UI states
        duration: '120',
        description: ''
    });

    // Subject Schedule State
    const [subjects, setSubjects] = useState([]);
    const [selectedExam, setSelectedExam] = useState('');

    // Mark Distribution Local State for Tab 3 Inline Editing
    const [distributions, setDistributions] = useState([]);

    // Mark Distribution Legacy State (Retained to prevent reference crashes)
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
            setSubjects([]);
        }
    }, [selectedExam]);

    // Load and sync mark distributions for Tab 3
    useEffect(() => {
        if (selectedExam && activeTab === 'marks') {
            const exam = exams.find(e => e._id === selectedExam);
            if (exam) {
                const initialDist = (exam.subjects || []).map(subject => {
                    const existing = (exam.markDistribution || []).find(md => md.subject === subject.subjectName);
                    return {
                        subject: subject.subjectName,
                        fullMarks: existing ? existing.mcq : 100, // Map Full Marks to mcq
                        passMarks: existing ? existing.viva : 33,  // Map Pass Marks to viva
                        practicalMarks: existing ? existing.practical : 0, // Practical
                        theoryMarks: existing ? existing.written : 0, // Written
                        isOptional: existing ? existing.isOptional : false
                    };
                });
                setDistributions(initialDist);
            }
        } else if (!selectedExam) {
            setDistributions([]);
        }
    }, [selectedExam, activeTab, exams]);

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
                const subjectsWithIds = data.data.subjects.map((subject, index) => ({
                    ...subject,
                    id: subject._id || `existing-${index}-${Date.now()}`,
                    examDate: subject.examDate ? new Date(subject.examDate).toISOString().split('T')[0] : ''
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

        // Client-side Validation without alert()
        let tempErrors = {};
        if (!examSetup.examName) tempErrors.examName = "Exam Title is required";
        if (!examSetup.class) tempErrors.class = "Class is required";
        if (!examSetup.section) tempErrors.section = "Section is required";
        if (!examSetup.academicYear) tempErrors.academicYear = "Term/Session is required";
        if (!examSetup.totalMarks) tempErrors.totalMarks = "Total Marks is required";
        if (!examSetup.passMarks) tempErrors.passMarks = "Pass Marks is required";
        if (!examSetup.startDate) tempErrors.startDate = "Start Date is required";
        if (!examSetup.endDate) tempErrors.endDate = "End Date is required";

        if (examSetup.passMarks && examSetup.totalMarks && parseInt(examSetup.passMarks) > parseInt(examSetup.totalMarks)) {
            tempErrors.passMarks = "Pass marks cannot exceed total marks";
        }

        if (examSetup.startDate && examSetup.endDate && new Date(examSetup.startDate) > new Date(examSetup.endDate)) {
            tempErrors.endDate = "End date must be after start date";
        }

        if (Object.keys(tempErrors).length > 0) {
            setErrors(tempErrors);
            return;
        }

        try {
            setLoading(true);
            const examData = {
                ...examSetup,
                totalMarks: parseInt(examSetup.totalMarks),
                passMarks: parseInt(examSetup.passMarks)
            };

            const isEditing = !!editingExamId;
            const url = isEditing ? `${API_URL}/api/exams/${editingExamId}` : `${API_URL}/api/exams`;
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(examData)
            });

            const data = await response.json();

            if (data.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: isEditing ? 'Exam updated successfully' : 'Exam created successfully',
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
                    status: 'Draft',
                    duration: '120',
                    description: ''
                });
                setErrors({});
                setEditingExamId(null);
                setSelectedExam(data.data._id || editingExamId);
                setActiveTab('schedule'); // Save & Continue moves to Subject Schedule automatically
            } else {
                throw new Error(data.message || 'Failed to save exam');
            }
        } catch (error) {
            console.error('Error saving exam:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to save exam',
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
            duration: examSetup.duration || '120',
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
                fetchExams();
                setActiveTab('marks'); // Moves to next logical step
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

    // Redesigned Mark Distribution Submission logic (saves all rows dynamically)
    const handleSaveAllDistributions = async () => {
        if (!selectedExam) return;

        // Auto-validate: Pass Marks <= Full Marks
        const hasInvalid = distributions.some(d => parseInt(d.passMarks) > parseInt(d.fullMarks));
        if (hasInvalid) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Warning',
                text: 'Some subjects have pass marks exceeding full marks. Please correct them.',
                customClass: { container: 'swal-high-z-index' }
            });
            return;
        }

        try {
            setLoading(true);
            for (const dist of distributions) {
                const payload = {
                    examId: selectedExam,
                    subject: dist.subject,
                    written: parseInt(dist.theoryMarks) || 0, // Theory
                    mcq: parseInt(dist.fullMarks) || 0,       // Full Marks mapped to mcq
                    practical: parseInt(dist.practicalMarks) || 0, // Practical
                    viva: parseInt(dist.passMarks) || 0,      // Pass Marks mapped to viva
                    isOptional: dist.isOptional || false
                };

                await fetch(`${API_URL}/api/exams/marks-distribution`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            await Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Mark distribution saved successfully',
                timer: 2000,
                showConfirmButton: false,
                customClass: { container: 'swal-high-z-index' }
            });
            fetchExams();
            setActiveTab('list'); // Transition to final tab
        } catch (error) {
            console.error('Error saving mark distribution:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to save mark distributions',
                customClass: { container: 'swal-high-z-index' }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleMarkDistributionSubmit = async (e) => {
        e.preventDefault();
        // Fallback legacy handler (for compatibility)
        handleSaveAllDistributions();
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

    const getTeacherName = (id) => {
        if (!id) return 'Not assigned';
        const t = teachers.find(t => t._id === id || t._id?.toString() === id?.toString());
        return t ? t.name : 'Unknown';
    };

    const formatDatePdf = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatTimePdf = (t) => {
        if (!t) return '—';
        const [h, m] = t.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h12 = hour % 12 || 12;
        return `${h12}:${m} ${ampm}`;
    };

    const downloadExamPDF = (exam) => {
        import('jspdf').then(({ default: jsPDF }) => {
            import('html2canvas').then(({ default: html2canvas }) => {
                const el = document.getElementById(`admin-exam-pdf-${exam._id}`);
                if (!el) return;
                html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#fff' }).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`${exam.examName.replace(/\s+/g, '_')}_${exam.class}_${exam.section}.pdf`);
                });
            });
        });
    };

    const downloadAllExamsPDF = () => {
        import('jspdf').then(({ default: jsPDF }) => {
            import('html2canvas').then(({ default: html2canvas }) => {
                const el = document.getElementById('admin-all-exams-pdf');
                if (!el) return;
                html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#fff' }).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    let heightLeft = pdfHeight;
                    let position = 0;
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                    heightLeft -= pdf.internal.pageSize.getHeight();
                    while (heightLeft > 0) {
                        position = heightLeft - pdfHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                        heightLeft -= pdf.internal.pageSize.getHeight();
                    }
                    pdf.save(`All_Exams_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.pdf`);
                });
            });
        });
    };

    const deleteExam = async (examId) => {
        const result = await Swal.fire({
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

    const handleEditExam = (exam) => {
        setEditingExamId(exam._id);
        setExamSetup({
            examName: exam.examName || '',
            examType: exam.examType || 'Mid Term',
            academicYear: exam.academicYear || '',
            class: exam.class || '',
            section: exam.section || '',
            examCategory: exam.examCategory || 'Written',
            totalMarks: exam.totalMarks ? exam.totalMarks.toString() : '',
            passMarks: exam.passMarks ? exam.passMarks.toString() : '',
            startDate: exam.startDate ? new Date(exam.startDate).toISOString().split('T')[0] : '',
            endDate: exam.endDate ? new Date(exam.endDate).toISOString().split('T')[0] : '',
            status: exam.status || 'Draft',
            duration: '120',
            description: ''
        });
        setErrors({});
        setActiveTab('setup');
    };

    // Filter exams based on search bar
    const filteredExams = useMemo(() => {
        return exams.filter(exam => {
            const query = searchQuery.toLowerCase();
            return (
                (exam.examName || '').toLowerCase().includes(query) ||
                (exam.class || '').toLowerCase().includes(query) ||
                (exam.examType || '').toLowerCase().includes(query)
            );
        });
    }, [exams, searchQuery]);

    // Sum of all full marks for Mark Distribution tab
    const totalFullMarks = useMemo(() => {
        return distributions.reduce((sum, d) => sum + (parseInt(d.fullMarks) || 0), 0);
    }, [distributions]);

    return (
        <div className="min-h-screen bg-slate-50/50 p-3 sm:p-6 font-sans">
            <style jsx global>{`
                .swal-high-z-index {
                    z-index: 10000 !important;
                }
                .scrollbar-none::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-none {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <div className="container mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                {/* Header Section */}
                <div className="border-b border-slate-100 bg-white px-6 py-6 sm:px-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                                Exam Management
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">Configure parameters, set timetables, manage mark keys, and generate schedules.</p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-3 sm:px-8">
                    <nav className="flex space-x-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0" aria-label="Tabs">
                        {[
                            { id: 'setup', name: 'Exam Setup' },
                            { id: 'schedule', name: 'Subject Schedule' },
                            { id: 'marks', name: 'Mark Distribution' },
                            { id: 'list', name: 'Exam List' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-blue-900 text-white shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content Panels */}
                <div className="p-6 sm:p-8">

                    {/* Tab 1: Exam Setup */}
                    {activeTab === 'setup' && (
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-6 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">
                                        {editingExamId ? 'Edit Exam Setup' : 'Exam Setup'}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Specify basic parameters, category, and threshold metrics.</p>
                                </div>
                                {editingExamId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingExamId(null);
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
                                                status: 'Draft',
                                                duration: '120',
                                                description: ''
                                            });
                                            setErrors({});
                                        }}
                                        className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors"
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleExamSetupSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                    {/* Exam Title - Full Width */}
                                    <div className="md:col-span-2">
                                        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Exam Title *</label>
                                        <input
                                            type="text"
                                            value={examSetup.examName}
                                            onChange={(e) => {
                                                setExamSetup({ ...examSetup, examName: e.target.value });
                                                if (errors.examName) setErrors({ ...errors, examName: null });
                                            }}
                                            placeholder="e.g., Mid Term Exam 2026"
                                            className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all ${errors.examName ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                                                }`}
                                        />
                                        {errors.examName && <p className="text-red-500 text-xs mt-1">{errors.examName}</p>}
                                    </div>

                                    {/* Class */}
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Class *</label>
                                        <select
                                            value={examSetup.class}
                                            onChange={(e) => {
                                                setExamSetup({ ...examSetup, class: e.target.value });
                                                if (errors.class) setErrors({ ...errors, class: null });
                                            }}
                                            className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all ${errors.class ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                                                }`}
                                        >
                                            <option value="">Select Class</option>
                                            {['Play', 'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(cls => (
                                                <option key={cls} value={cls}>{cls}</option>
                                            ))}
                                        </select>
                                        {errors.class && <p className="text-red-500 text-xs mt-1">{errors.class}</p>}
                                    </div>

                                    {/* Section */}
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Section *</label>
                                        <select
                                            value={examSetup.section}
                                            onChange={(e) => {
                                                setExamSetup({ ...examSetup, section: e.target.value });
                                                if (errors.section) setErrors({ ...errors, section: null });
                                            }}
                                            className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all ${errors.section ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                                                }`}
                                        >
                                            <option value="">Select Section</option>
                                            {['A', 'B', 'C', 'D'].map(sec => (
                                                <option key={sec} value={sec}>{sec}</option>
                                            ))}
                                        </select>
                                        {errors.section && <p className="text-red-500 text-xs mt-1">{errors.section}</p>}
                                    </div>

                                    {/* Term/Session */}
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Term/Session *</label>
                                        <input
                                            type="text"
                                            value={examSetup.academicYear}
                                            onChange={(e) => {
                                                setExamSetup({ ...examSetup, academicYear: e.target.value });
                                                if (errors.academicYear) setErrors({ ...errors, academicYear: null });
                                            }}
                                            placeholder="e.g., 2026-2027"
                                            className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all ${errors.academicYear ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                                                }`}
                                        />
                                        {errors.academicYear && <p className="text-red-500 text-xs mt-1">{errors.academicYear}</p>}
                                    </div>

                                    {/* Exam Type - Pill Selector */}
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Exam Type *</label>
                                        <div className="flex flex-wrap gap-2 py-1">
                                            {[
                                                { label: 'Half-Yearly', val: 'Half Yearly' },
                                                { label: 'Final', val: 'Final' },
                                                { label: 'Unit Test', val: 'Class Test' },
                                                { label: 'Mock', val: 'Monthly Test' }
                                            ].map((type) => {
                                                const isSelected = examSetup.examType === type.val;
                                                return (
                                                    <button
                                                        key={type.val}
                                                        type="button"
                                                        onClick={() => setExamSetup({ ...examSetup, examType: type.val })}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${isSelected
                                                            ? 'bg-blue-900 text-white border-blue-900'
                                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        {type.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Exam Category */}
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Exam Category *</label>
                                        <select
                                            value={examSetup.examCategory}
                                            onChange={(e) => setExamSetup({ ...examSetup, examCategory: e.target.value })}
                                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all"
                                        >
                                            <option value="Written">Written</option>
                                            <option value="MCQ">MCQ</option>
                                            <option value="Practical">Practical</option>
                                            <option value="Viva">Viva</option>
                                            <option value="Mixed">Mixed</option>
                                        </select>
                                    </div>

                                    {/* Total Duration */}
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Default Duration (minutes)</label>
                                        <input
                                            type="number"
                                            value={examSetup.duration}
                                            onChange={(e) => setExamSetup({ ...examSetup, duration: e.target.value })}
                                            placeholder="120"
                                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all"
                                        />
                                    </div>

                                    {/* Total Marks */}
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Total Marks *</label>
                                        <input
                                            type="number"
                                            value={examSetup.totalMarks}
                                            onChange={(e) => {
                                                setExamSetup({ ...examSetup, totalMarks: e.target.value });
                                                if (errors.totalMarks) setErrors({ ...errors, totalMarks: null });
                                            }}
                                            placeholder="100"
                                            className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all ${errors.totalMarks ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                                                }`}
                                        />
                                        {errors.totalMarks && <p className="text-red-500 text-xs mt-1">{errors.totalMarks}</p>}
                                    </div>

                                    {/* Pass Marks */}
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Pass Marks *</label>
                                        <input
                                            type="number"
                                            value={examSetup.passMarks}
                                            onChange={(e) => {
                                                setExamSetup({ ...examSetup, passMarks: e.target.value });
                                                if (errors.passMarks) setErrors({ ...errors, passMarks: null });
                                            }}
                                            placeholder="33"
                                            className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all ${errors.passMarks ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                                                }`}
                                        />
                                        {errors.passMarks && <p className="text-red-500 text-xs mt-1">{errors.passMarks}</p>}
                                    </div>

                                    {/* Start Date */}
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Start Date *</label>
                                        <input
                                            type="date"
                                            value={examSetup.startDate}
                                            onChange={(e) => {
                                                setExamSetup({ ...examSetup, startDate: e.target.value });
                                                if (errors.startDate) setErrors({ ...errors, startDate: null });
                                            }}
                                            className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all ${errors.startDate ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                                                }`}
                                        />
                                        {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                                    </div>

                                    {/* End Date */}
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">End Date *</label>
                                        <input
                                            type="date"
                                            value={examSetup.endDate}
                                            onChange={(e) => {
                                                setExamSetup({ ...examSetup, endDate: e.target.value });
                                                if (errors.endDate) setErrors({ ...errors, endDate: null });
                                            }}
                                            className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all ${errors.endDate ? 'border-red-500 bg-red-50/20' : 'border-slate-200'
                                                }`}
                                        />
                                        {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                                    </div>

                                    {/* Exam Status */}
                                    <div>
                                        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Exam Status *</label>
                                        <select
                                            value={examSetup.status}
                                            onChange={(e) => setExamSetup({ ...examSetup, status: e.target.value })}
                                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all"
                                        >
                                            <option value="Draft">Draft</option>
                                            <option value="Published">Published</option>
                                            <option value="Ongoing">Ongoing</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>

                                    {/* Description (Optional Textarea) */}
                                    <div className="md:col-span-2">
                                        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Description (optional)</label>
                                        <textarea
                                            value={examSetup.description}
                                            onChange={(e) => setExamSetup({ ...examSetup, description: e.target.value })}
                                            placeholder="Write additional instructions or exam remarks here..."
                                            rows="3"
                                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all resize-none"
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-sm shadow-blue-900/10 disabled:opacity-50"
                                    >
                                        {loading ? 'Processing...' : (editingExamId ? 'Update & Continue →' : 'Save & Continue →')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
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
                                                status: 'Draft',
                                                duration: '120',
                                                description: ''
                                            });
                                            setErrors({});
                                        }}
                                        className="px-6 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-xl transition-all duration-150"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Tab 2: Subject Schedule */}
                    {activeTab === 'schedule' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Subject Schedule</h3>
                                    <p className="text-sm text-slate-500 mt-0.5">Assign date, timeframes, and room numbers for subjects.</p>
                                </div>
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setScheduleViewMode('edit')}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${scheduleViewMode === 'edit'
                                            ? 'bg-white text-slate-800 shadow-sm'
                                            : 'text-slate-600 hover:text-slate-800'
                                            }`}
                                    >
                                        Edit Schedules
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setScheduleViewMode('view')}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${scheduleViewMode === 'view'
                                            ? 'bg-white text-slate-800 shadow-sm'
                                            : 'text-slate-600 hover:text-slate-800'
                                            }`}
                                    >
                                        Overview List
                                    </button>
                                </div>
                            </div>

                            {scheduleViewMode === 'edit' ? (
                                <div className="space-y-6">
                                    <div className="max-w-xl">
                                        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Select Target Exam *</label>
                                        <select
                                            value={selectedExam}
                                            onChange={(e) => setSelectedExam(e.target.value)}
                                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all"
                                        >
                                            <option value="">Choose an exam</option>
                                            {exams.map(exam => (
                                                <option key={exam._id} value={exam._id}>
                                                    {exam.examName} — Class {exam.class} ({exam.section})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedExam ? (
                                        <div className="space-y-6">
                                            {subjects.length === 0 ? (
                                                <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                                    <svg className="w-10 h-10 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                                    <h4 className="text-sm font-semibold text-slate-800">No subjects scheduled</h4>
                                                    <p className="text-xs text-slate-500 mt-1 mb-4">Click the button below to add your first subject schedule.</p>
                                                    <button
                                                        type="button"
                                                        onClick={handleAddSubject}
                                                        className="px-4 py-2 border border-blue-900 text-blue-900 hover:bg-blue-50 text-xs font-semibold rounded-lg transition-colors inline-flex items-center"
                                                    >
                                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                                        + Add Subject
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-sm text-left text-slate-600">
                                                            <thead className="text-xs font-semibold text-slate-700 uppercase bg-slate-50 border-b border-slate-100">
                                                                <tr>
                                                                    <th className="px-4 py-3.5">Subject Name *</th>
                                                                    <th className="px-4 py-3.5">Date *</th>
                                                                    <th className="px-4 py-3.5">Start Time *</th>
                                                                    <th className="px-4 py-3.5">End Time *</th>
                                                                    <th className="px-4 py-3.5 w-24">Duration (min) *</th>
                                                                    <th className="px-4 py-3.5 w-32">Room No</th>
                                                                    <th className="px-4 py-3.5">Invigilator</th>
                                                                    <th className="px-4 py-3.5 text-right">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100">
                                                                {subjects.map((subject) => (
                                                                    <tr key={subject.id} className="hover:bg-[#F8FAFC]">
                                                                        <td className="px-4 py-3">
                                                                            <input
                                                                                type="text"
                                                                                value={subject.subjectName}
                                                                                onChange={(e) => handleSubjectChange(subject.id, 'subjectName', e.target.value)}
                                                                                placeholder="Mathematics"
                                                                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-900"
                                                                            />
                                                                        </td>
                                                                        <td className="px-4 py-3">
                                                                            <input
                                                                                type="date"
                                                                                value={subject.examDate}
                                                                                onChange={(e) => handleSubjectChange(subject.id, 'examDate', e.target.value)}
                                                                                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-900"
                                                                            />
                                                                        </td>
                                                                        <td className="px-4 py-3">
                                                                            <input
                                                                                type="time"
                                                                                value={subject.startTime}
                                                                                onChange={(e) => handleSubjectChange(subject.id, 'startTime', e.target.value)}
                                                                                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-900"
                                                                            />
                                                                        </td>
                                                                        <td className="px-4 py-3">
                                                                            <input
                                                                                type="time"
                                                                                value={subject.endTime}
                                                                                onChange={(e) => handleSubjectChange(subject.id, 'endTime', e.target.value)}
                                                                                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-900"
                                                                            />
                                                                        </td>
                                                                        <td className="px-4 py-3">
                                                                            <input
                                                                                type="number"
                                                                                value={subject.duration}
                                                                                onChange={(e) => handleSubjectChange(subject.id, 'duration', e.target.value)}
                                                                                placeholder="120"
                                                                                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-900"
                                                                            />
                                                                        </td>
                                                                        <td className="px-4 py-3">
                                                                            <input
                                                                                type="text"
                                                                                value={subject.room}
                                                                                onChange={(e) => handleSubjectChange(subject.id, 'room', e.target.value)}
                                                                                placeholder="Room 101"
                                                                                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-900"
                                                                            />
                                                                        </td>
                                                                        <td className="px-4 py-3">
                                                                            <select
                                                                                value={subject.invigilator}
                                                                                onChange={(e) => handleSubjectChange(subject.id, 'invigilator', e.target.value)}
                                                                                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-900"
                                                                            >
                                                                                <option value="">Select Teacher</option>
                                                                                {teachers.map(t => (
                                                                                    <option key={t._id} value={t._id}>{t.name}</option>
                                                                                ))}
                                                                            </select>
                                                                        </td>
                                                                        <td className="px-4 py-3 text-right">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRemoveSubject(subject.id)}
                                                                                className="px-2 py-1 border border-red-200 hover:border-red-600 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors"
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={handleAddSubject}
                                                    className="px-5 py-2.5 border border-blue-900 text-blue-900 hover:bg-blue-50 text-sm font-semibold rounded-xl transition-colors inline-flex items-center justify-center gap-1.5"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                                    + Add Subject
                                                </button>
                                                {subjects.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={handleScheduleSubmit}
                                                        disabled={loading}
                                                        className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                                                    >
                                                        {loading ? 'Saving...' : 'Save Schedule'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center border border-slate-100 rounded-2xl bg-slate-50/50">
                                            <p className="text-slate-500 text-sm">Please select an exam above to view and configure its subject schedules.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Subject Schedule View Mode */
                                <div className="space-y-6">
                                    {exams.length === 0 ? (
                                        <div className="text-center py-16 bg-slate-50/50 border border-slate-100 rounded-2xl">
                                            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <h3 className="text-base font-bold text-slate-700">No Exams Scheduled Yet</h3>
                                            <p className="text-xs text-slate-500 mt-1 mb-4">Go to the setup tab to create your first exam.</p>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('setup')}
                                                className="px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-lg transition-colors hover:bg-blue-800"
                                            >
                                                Create New Exam
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {exams.map((exam) => (
                                                <div key={exam._id} className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
                                                    <div className="bg-slate-800 text-white px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                        <div>
                                                            <h5 className="text-base font-bold">{exam.examName}</h5>
                                                            <p className="text-xs text-slate-300 mt-0.5">
                                                                Class {exam.class} ({exam.section}) | {exam.examType} | Academic Year {exam.academicYear}
                                                            </p>
                                                        </div>
                                                        <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/10">
                                                            {exam.status}
                                                        </span>
                                                    </div>

                                                    {exam.subjects && exam.subjects.length > 0 ? (
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-sm text-left text-slate-600">
                                                                <thead className="text-xs font-semibold text-slate-700 uppercase bg-slate-50 border-b border-slate-100">
                                                                    <tr>
                                                                        <th className="px-5 py-3">Subject</th>
                                                                        <th className="px-5 py-3">Date</th>
                                                                        <th className="px-5 py-3">Timeframe</th>
                                                                        <th className="px-5 py-3">Duration</th>
                                                                        <th className="px-5 py-3">Room / Location</th>
                                                                        <th className="px-5 py-3">Invigilator</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-slate-100">
                                                                    {exam.subjects.map((sub, idx) => (
                                                                        <tr key={idx} className="hover:bg-[#F8FAFC]">
                                                                            <td className="px-5 py-3 font-semibold text-slate-800">{sub.subjectName}</td>
                                                                            <td className="px-5 py-3 text-slate-600">
                                                                                {sub.examDate ? new Date(sub.examDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                                                            </td>
                                                                            <td className="px-5 py-3 text-slate-600">{sub.startTime} — {sub.endTime}</td>
                                                                            <td className="px-5 py-3 text-slate-600">{sub.duration} minutes</td>
                                                                            <td className="px-5 py-3 text-slate-600">{sub.room || '—'}</td>
                                                                            <td className="px-5 py-3 text-slate-600">{getTeacherName(sub.invigilator)}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : (
                                                        <div className="p-6 text-center">
                                                            <p className="text-slate-500 text-xs font-medium">No subjects scheduled for this exam yet.</p>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedExam(exam._id);
                                                                    setScheduleViewMode('edit');
                                                                }}
                                                                className="mt-3 px-4 py-2 border border-blue-900 text-blue-900 hover:bg-blue-50 text-xs font-semibold rounded-lg transition-all"
                                                            >
                                                                Schedule Now
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

                    {/* Tab 3: Mark Distribution */}
                    {activeTab === 'marks' && (
                        <div className="space-y-6">
                            <div className="pb-4 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800">Mark Distribution</h3>
                                <p className="text-sm text-slate-500 mt-0.5">Define weightings, pass limits, practical components, and theory bounds.</p>
                            </div>

                            <div className="max-w-xl">
                                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">Select Exam *</label>
                                <select
                                    value={selectedExam}
                                    onChange={(e) => setSelectedExam(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all"
                                >
                                    <option value="">Choose an exam</option>
                                    {exams.map(exam => (
                                        <option key={exam._id} value={exam._id}>
                                            {exam.examName} — Class {exam.class} ({exam.section})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedExam ? (
                                <div className="space-y-8">
                                    {distributions.length === 0 ? (
                                        <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                            <p className="text-slate-500 text-sm">Please schedule subjects under Tab 2 first before distributing marks.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-left text-slate-600">
                                                        <thead className="text-xs font-semibold text-slate-700 uppercase bg-slate-50 border-b border-slate-100">
                                                            <tr>
                                                                <th className="px-5 py-4">Subject</th>
                                                                <th className="px-5 py-4">Theory Marks</th>
                                                                <th className="px-5 py-4">Practical Marks</th>
                                                                <th className="px-5 py-4">Pass Marks</th>
                                                                <th className="px-5 py-4">Full Marks</th>
                                                                <th className="px-5 py-4 w-28">Type</th>
                                                                <th className="px-5 py-4 text-right">Validation Alert</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {distributions.map((dist, index) => {
                                                                const isInvalid = parseInt(dist.passMarks) > parseInt(dist.fullMarks);
                                                                return (
                                                                    <tr key={index} className="hover:bg-[#F8FAFC]">
                                                                        <td className="px-5 py-4 font-semibold text-slate-800">{dist.subject}</td>
                                                                        <td className="px-5 py-4">
                                                                            <input
                                                                                type="number"
                                                                                value={dist.theoryMarks}
                                                                                onChange={(e) => {
                                                                                    const val = Math.max(0, parseInt(e.target.value) || 0);
                                                                                    setDistributions(distributions.map((d, i) =>
                                                                                        i === index ? { ...d, theoryMarks: val } : d
                                                                                    ));
                                                                                }}
                                                                                className="w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-sm text-center outline-none focus:ring-1 focus:ring-blue-900"
                                                                            />
                                                                        </td>
                                                                        <td className="px-5 py-4">
                                                                            <input
                                                                                type="number"
                                                                                value={dist.practicalMarks}
                                                                                onChange={(e) => {
                                                                                    const val = Math.max(0, parseInt(e.target.value) || 0);
                                                                                    setDistributions(distributions.map((d, i) =>
                                                                                        i === index ? { ...d, practicalMarks: val } : d
                                                                                    ));
                                                                                }}
                                                                                className="w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-sm text-center outline-none focus:ring-1 focus:ring-blue-900"
                                                                            />
                                                                        </td>
                                                                        <td className="px-5 py-4">
                                                                            <input
                                                                                type="number"
                                                                                value={dist.passMarks}
                                                                                onChange={(e) => {
                                                                                    const val = Math.max(0, parseInt(e.target.value) || 0);
                                                                                    setDistributions(distributions.map((d, i) =>
                                                                                        i === index ? { ...d, passMarks: val } : d
                                                                                    ));
                                                                                }}
                                                                                className={`w-20 px-2 py-1.5 border rounded-lg text-sm text-center outline-none focus:ring-1 ${isInvalid ? 'border-red-500 focus:ring-red-500 bg-red-50/20' : 'border-slate-200 focus:ring-blue-900'
                                                                                    }`}
                                                                            />
                                                                        </td>
                                                                        <td className="px-5 py-4">
                                                                            <input
                                                                                type="number"
                                                                                value={dist.fullMarks}
                                                                                onChange={(e) => {
                                                                                    const val = Math.max(0, parseInt(e.target.value) || 0);
                                                                                    setDistributions(distributions.map((d, i) =>
                                                                                        i === index ? { ...d, fullMarks: val } : d
                                                                                    ));
                                                                                }}
                                                                                className="w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-sm text-center outline-none focus:ring-1 focus:ring-blue-900"
                                                                            />
                                                                        </td>
                                                                        <td className="px-5 py-4">
                                                                            <label className="inline-flex items-center cursor-pointer select-none">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={dist.isOptional}
                                                                                    onChange={(e) => {
                                                                                        const val = e.target.checked;
                                                                                        setDistributions(distributions.map((d, i) =>
                                                                                            i === index ? { ...d, isOptional: val } : d
                                                                                        ));
                                                                                    }}
                                                                                    className="w-4 h-4 border-slate-300 rounded text-blue-900 focus:ring-blue-900/10 cursor-pointer"
                                                                                />
                                                                                <span className="ml-2 text-xs font-semibold text-slate-500">Optional</span>
                                                                            </label>
                                                                        </td>
                                                                        <td className="px-5 py-4 text-right">
                                                                            {isInvalid && (
                                                                                <span className="text-red-500 text-[11px] font-bold bg-red-50 px-2.5 py-1 rounded-md inline-flex items-center gap-1 animate-pulse">
                                                                                    ⚠️ Pass Marks &gt; Full Marks
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                        <tfoot className="bg-slate-50/80 font-bold text-slate-800 border-t border-slate-100">
                                                            <tr>
                                                                <td className="px-5 py-3.5">Sum/Total Full Marks</td>
                                                                <td className="px-5 py-3.5" colSpan="3"></td>
                                                                <td className="px-5 py-3.5 text-center">{totalFullMarks}</td>
                                                                <td className="px-5 py-3.5" colSpan="2"></td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </div>

                                            <div className="flex justify-start">
                                                <button
                                                    type="button"
                                                    onClick={handleSaveAllDistributions}
                                                    disabled={loading}
                                                    className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                                                >
                                                    {loading ? 'Saving...' : 'Save Distribution'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Grade System Reference Panel */}
                                    <div className="max-w-3xl border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
                                        <div className="bg-slate-800 text-white px-5 py-3">
                                            <h4 className="text-sm font-bold">Grading System Reference</h4>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left text-slate-600">
                                                <thead className="text-xs font-semibold text-slate-700 bg-slate-50 border-b border-slate-100">
                                                    <tr>
                                                        <th className="px-5 py-3">Grade</th>
                                                        <th className="px-5 py-3">Min Marks</th>
                                                        <th className="px-5 py-3">Max Marks</th>
                                                        <th className="px-5 py-3">Grade Point</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {gradeSystem.map((g, idx) => (
                                                        <tr key={idx} className="hover:bg-slate-50/50">
                                                            <td className="px-5 py-3.5 font-bold text-slate-800">{g.grade}</td>
                                                            <td className="px-5 py-3.5 text-slate-600">{g.minMarks}%</td>
                                                            <td className="px-5 py-3.5 text-slate-600">{g.maxMarks}%</td>
                                                            <td className="px-5 py-3.5 font-semibold text-slate-700">
                                                                {g.grade === 'A+' ? '5.00' :
                                                                    g.grade === 'A' ? '4.00' :
                                                                        g.grade === 'A-' ? '3.50' :
                                                                            g.grade === 'B' ? '3.00' :
                                                                                g.grade === 'C' ? '2.00' :
                                                                                    g.grade === 'D' ? '1.00' : '0.00'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 text-center border border-slate-100 rounded-2xl bg-slate-50/50">
                                    <p className="text-slate-500 text-sm">Please select an exam above to configure the mark keys per subject.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 4: Exam List */}
                    {activeTab === 'list' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Exam List</h3>
                                    <p className="text-sm text-slate-500 mt-0.5">Manage created exams, update statuses, and generate PDF schedules.</p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                                    {/* Search Bar */}
                                    <div className="relative flex-1 sm:flex-initial">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                        </span>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Filter by class or exam name..."
                                            className="w-full sm:w-64 pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all bg-slate-50/30 focus:bg-white"
                                        />
                                    </div>

                                    {exams.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={downloadAllExamsPDF}
                                            className="px-4 py-2.5 border border-blue-900 text-blue-900 hover:bg-blue-50 text-xs sm:text-sm font-semibold rounded-xl transition-all inline-flex items-center justify-center gap-1.5"
                                        >
                                            📥 Download All PDF
                                        </button>
                                    )}
                                </div>
                            </div>

                            {filteredExams.length === 0 ? (
                                <div className="text-center py-16 bg-slate-50/50 border border-slate-200/50 border-dashed rounded-2xl max-w-lg mx-auto">
                                    <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <h3 className="text-base font-bold text-slate-700">No exams created yet</h3>
                                    <p className="text-xs text-slate-500 mt-1 mb-5">Start by creating your first exam parameters in the setup tab.</p>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('setup')}
                                        className="px-5 py-2.5 bg-blue-900 text-white text-xs font-semibold rounded-xl transition-colors hover:bg-blue-800 shadow-sm shadow-blue-900/10"
                                    >
                                        Create First Exam
                                    </button>
                                </div>
                            ) : (
                                <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-slate-600">
                                            <thead className="text-xs font-semibold text-slate-700 uppercase bg-slate-50 border-b border-slate-100">
                                                <tr>
                                                    <th className="px-5 py-4">Exam Name</th>
                                                    <th className="px-5 py-4">Class &amp; Sec</th>
                                                    <th className="px-5 py-4">Term</th>
                                                    <th className="px-5 py-4">Date Range</th>
                                                    <th className="px-5 py-4 w-28">Type</th>
                                                    <th className="px-5 py-4 w-36">Status</th>
                                                    <th className="px-5 py-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {filteredExams.map((exam) => (
                                                    <tr key={exam._id} className="hover:bg-[#F8FAFC] transition-colors">
                                                        <td className="px-5 py-4">
                                                            <div className="font-semibold text-slate-800">{exam.examName}</div>
                                                            <div className="text-[11px] text-slate-400 mt-0.5">Total: {exam.totalMarks} | Pass: {exam.passMarks}</div>
                                                        </td>
                                                        <td className="px-5 py-4 text-slate-700 font-medium">{exam.class} — {exam.section}</td>
                                                        <td className="px-5 py-4 text-slate-600">{exam.academicYear}</td>
                                                        <td className="px-5 py-4 text-slate-600 text-xs">
                                                            {formatDatePdf(exam.startDate)} — {formatDatePdf(exam.endDate)}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <span className="inline-flex rounded-full text-[12px] py-0.5 px-2.5 font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                                                {exam.examType}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <select
                                                                value={exam.status}
                                                                onChange={(e) => updateExamStatus(exam._id, e.target.value)}
                                                                className={`text-[12px] font-bold rounded-full py-0.5 px-2.5 border cursor-pointer outline-none transition-all ${exam.status === 'Published' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                    exam.status === 'Ongoing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                        exam.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                                            'bg-gray-100 text-gray-600 border-gray-200'
                                                                    }`}
                                                            >
                                                                <option value="Draft" className="text-gray-900 bg-white">Draft</option>
                                                                <option value="Published" className="text-gray-900 bg-white">Upcoming</option>
                                                                <option value="Ongoing" className="text-gray-900 bg-white">Ongoing</option>
                                                                <option value="Completed" className="text-gray-900 bg-white">Completed</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-5 py-4 text-right">
                                                            <div className="inline-flex gap-1.5">
                                                                <button
                                                                    onClick={() => downloadExamPDF(exam)}
                                                                    className="p-1.5 border border-slate-200 text-slate-500 hover:text-blue-900 hover:bg-slate-50 rounded-lg transition-colors group relative"
                                                                    title="View/Download PDF"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEditExam(exam)}
                                                                    className="p-1.5 border border-slate-200 text-slate-500 hover:text-blue-900 hover:bg-slate-50 rounded-lg transition-colors group relative"
                                                                    title="Edit Exam"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteExam(exam._id)}
                                                                    className="p-1.5 border border-red-100 hover:border-red-600 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative"
                                                                    title="Delete Exam"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Hidden PDF templates required by jsPDF & html2canvas */}
                            <div className="hidden">
                                {exams.map((exam) => (
                                    <div key={exam._id} id={`admin-exam-pdf-${exam._id}`} style={{ padding: '40px', background: '#fff', fontFamily: 'Arial, sans-serif', color: '#000', width: '794px' }}>
                                        <div style={{ textAlign: 'center', borderBottom: '3px solid #1a202c', paddingBottom: '16px', marginBottom: '24px' }}>
                                            <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a202c', margin: 0 }}>EXAM SCHEDULE</h1>
                                            <p style={{ fontSize: '13px', color: '#555', margin: '4px 0 0' }}>Academic Year {exam.academicYear}</p>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px', background: '#f8f9fa', padding: '16px', borderRadius: '6px' }}>
                                            <div><span style={{ fontWeight: 'bold', color: '#333' }}>Exam Name:</span> <span>{exam.examName}</span></div>
                                            <div><span style={{ fontWeight: 'bold', color: '#333' }}>Type:</span> <span>{exam.examType}</span></div>
                                            <div><span style={{ fontWeight: 'bold', color: '#333' }}>Class:</span> <span>{exam.class} — Section {exam.section}</span></div>
                                            <div><span style={{ fontWeight: 'bold', color: '#333' }}>Category:</span> <span>{exam.examCategory}</span></div>
                                            <div><span style={{ fontWeight: 'bold', color: '#333' }}>Start Date:</span> <span>{formatDatePdf(exam.startDate)}</span></div>
                                            <div><span style={{ fontWeight: 'bold', color: '#333' }}>End Date:</span> <span>{formatDatePdf(exam.endDate)}</span></div>
                                            <div><span style={{ fontWeight: 'bold', color: '#333' }}>Total Marks:</span> <span>{exam.totalMarks}</span></div>
                                            <div><span style={{ fontWeight: 'bold', color: '#333' }}>Pass Marks:</span> <span>{exam.passMarks}</span></div>
                                            <div><span style={{ fontWeight: 'bold', color: '#333' }}>Status:</span> <span style={{ fontWeight: 'bold', color: exam.status === 'Published' ? '#065f46' : exam.status === 'Ongoing' ? '#1e40af' : '#374151' }}>{exam.status}</span></div>
                                        </div>
                                        {exam.subjects && exam.subjects.length > 0 && (
                                            <div>
                                                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1a202c', marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '6px' }}>Subject Schedule</h3>
                                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                                    <thead>
                                                        <tr style={{ background: '#1a202c', color: '#fff' }}>
                                                            <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #333' }}>Subject</th>
                                                            <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #333' }}>Date</th>
                                                            <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #333' }}>Time</th>
                                                            <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #333' }}>Duration</th>
                                                            <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #333' }}>Room</th>
                                                            <th style={{ padding: '8px 10px', textAlign: 'left', border: '1px solid #333' }}>Invigilator</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {exam.subjects.map((sub, idx) => (
                                                            <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                                                                <td style={{ padding: '7px 10px', border: '1px solid #ddd', fontWeight: '600' }}>{sub.subjectName}</td>
                                                                <td style={{ padding: '7px 10px', border: '1px solid #ddd' }}>{formatDatePdf(sub.examDate)}</td>
                                                                <td style={{ padding: '7px 10px', border: '1px solid #ddd' }}>{formatTimePdf(sub.startTime)}{sub.endTime ? ` – ${formatTimePdf(sub.endTime)}` : ''}</td>
                                                                <td style={{ padding: '7px 10px', border: '1px solid #ddd' }}>{sub.duration ? `${sub.duration} min` : '—'}</td>
                                                                <td style={{ padding: '7px 10px', border: '1px solid #ddd' }}>{sub.room || '—'}</td>
                                                                <td style={{ padding: '7px 10px', border: '1px solid #ddd' }}>{getTeacherName(sub.invigilator)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                        <div style={{ marginTop: '32px', borderTop: '1px solid #ccc', paddingTop: '12px', fontSize: '11px', color: '#777', textAlign: 'center' }}>
                                            Generated on {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} | School Management System
                                        </div>
                                    </div>
                                ))}

                                <div id="admin-all-exams-pdf" style={{ padding: '40px', background: '#fff', fontFamily: 'Arial, sans-serif', color: '#000', width: '1050px' }}>
                                    <div style={{ textAlign: 'center', borderBottom: '3px solid #1a202c', paddingBottom: '16px', marginBottom: '28px' }}>
                                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a202c', margin: 0 }}>ALL EXAM SCHEDULES</h1>
                                        <p style={{ fontSize: '13px', color: '#555', margin: '4px 0 0' }}>Generated on {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    {exams.map((exam, examIdx) => (
                                        <div key={exam._id} style={{ marginBottom: '36px', pageBreakInside: 'avoid' }}>
                                            <div style={{ background: '#1a202c', color: '#fff', padding: '10px 16px', borderRadius: '4px 4px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{examIdx + 1}. {exam.examName}</span>
                                                <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px' }}>{exam.status}</span>
                                            </div>
                                            <div style={{ border: '1px solid #ddd', borderTop: 'none', padding: '12px 16px', background: '#f9fafb', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', fontSize: '12px' }}>
                                                <div><b>Class:</b> {exam.class} — Sec {exam.section}</div>
                                                <div><b>Type:</b> {exam.examType}</div>
                                                <div><b>Year:</b> {exam.academicYear}</div>
                                                <div><b>Start:</b> {formatDatePdf(exam.startDate)}</div>
                                                <div><b>End:</b> {formatDatePdf(exam.endDate)}</div>
                                                <div><b>Total / Pass:</b> {exam.totalMarks} / {exam.passMarks}</div>
                                            </div>
                                            {exam.subjects && exam.subjects.length > 0 && (
                                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                                    <thead>
                                                        <tr style={{ background: '#374151', color: '#fff' }}>
                                                            <th style={{ padding: '7px 10px', textAlign: 'left', border: '1px solid #555' }}>Subject</th>
                                                            <th style={{ padding: '7px 10px', textAlign: 'left', border: '1px solid #555' }}>Date</th>
                                                            <th style={{ padding: '7px 10px', textAlign: 'left', border: '1px solid #555' }}>Time</th>
                                                            <th style={{ padding: '7px 10px', textAlign: 'left', border: '1px solid #555' }}>Duration</th>
                                                            <th style={{ padding: '7px 10px', textAlign: 'left', border: '1px solid #555' }}>Room</th>
                                                            <th style={{ padding: '7px 10px', textAlign: 'left', border: '1px solid #555' }}>Invigilator</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {exam.subjects.map((sub, idx) => (
                                                            <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#f3f4f6' }}>
                                                                <td style={{ padding: '6px 10px', border: '1px solid #ddd', fontWeight: '600' }}>{sub.subjectName}</td>
                                                                <td style={{ padding: '6px 10px', border: '1px solid #ddd' }}>{formatDatePdf(sub.examDate)}</td>
                                                                <td style={{ padding: '6px 10px', border: '1px solid #ddd' }}>{formatTimePdf(sub.startTime)}{sub.endTime ? ` – ${formatTimePdf(sub.endTime)}` : ''}</td>
                                                                <td style={{ padding: '6px 10px', border: '1px solid #ddd' }}>{sub.duration ? `${sub.duration} min` : '—'}</td>
                                                                <td style={{ padding: '6px 10px', border: '1px solid #ddd' }}>{sub.room || '—'}</td>
                                                                <td style={{ padding: '6px 10px', border: '1px solid #ddd' }}>{getTeacherName(sub.invigilator)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    ))}
                                    <div style={{ borderTop: '1px solid #ccc', paddingTop: '12px', fontSize: '11px', color: '#777', textAlign: 'center' }}>
                                        School Management System — Confidential
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
