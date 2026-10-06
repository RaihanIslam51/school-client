'use client';
import { useState, useEffect, useRef } from 'react';
import { API_URL } from '../../../../config/api';

export default function TeacherExams() {
    const [exams, setExams] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExam, setSelectedExam] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setCurrentTeacher(parsed);
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [examsRes, teachersRes] = await Promise.all([
                fetch(`${API_URL}/api/exams`),
                fetch(`${API_URL}/api/teachers`)
            ]);
            const examsData = await examsRes.json();
            const teachersData = await teachersRes.json();
            if (examsData.success) setExams(examsData.data);
            if (teachersData.success) setTeachers(teachersData.data);
        } catch (err) {
            console.error('Failed to load exam data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getTeacherName = (id) => {
        if (!id) return '—';
        const t = teachers.find(t => t._id === id || t._id?.toString() === id?.toString());
        return t ? t.name : id;
    };

    const getTeacherById = (id) => {
        if (!id) return null;
        return teachers.find(t => t._id === id || t._id?.toString() === id?.toString()) || null;
    };

    const getMyInvigilatorDuties = () => {
        if (!currentTeacher) return [];
        const duties = [];
        exams.forEach(exam => {
            if (!exam.subjects || exam.status !== 'Published') return;
            exam.subjects.forEach(subject => {
                if (!subject.invigilator) return;
                const t = getTeacherById(subject.invigilator);
                if (!t) return;
                const matchById = t._id?.toString() === currentTeacher._id?.toString();
                const matchByName = t.name?.toLowerCase() === currentTeacher.name?.toLowerCase();
                if (matchById || matchByName) {
                    duties.push({ exam, subject });
                }
            });
        });
        return duties.sort((a, b) => new Date(a.subject.examDate) - new Date(b.subject.examDate));
    };

    const filteredExams = exams.filter(exam => {
        const matchSearch = exam.examName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.class?.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchSearch) return false;
        if (activeFilter === 'published') return exam.status === 'Published' || exam.status === 'Ongoing';
        if (activeFilter === 'mine') {
            if (!currentTeacher) return false;
            return exam.subjects?.some(s => {
                const t = getTeacherById(s.invigilator);
                if (!t) return false;
                return t._id?.toString() === currentTeacher._id?.toString() ||
                    t.name?.toLowerCase() === currentTeacher.name?.toLowerCase();
            });
        }
        return true;
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatTime = (t) => {
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
                const el = document.getElementById(`exam-pdf-${exam._id}`);
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

    const downloadDutyCardPDF = () => {
        import('jspdf').then(({ default: jsPDF }) => {
            import('html2canvas').then(({ default: html2canvas }) => {
                const el = document.getElementById('duty-card-pdf');
                if (!el) return;
                html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#fff' }).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`Invigilator_Duty_Card_${currentTeacher?.name?.replace(/\s+/g, '_') || 'Teacher'}.pdf`);
                });
            });
        });
    };

    const myDuties = getMyInvigilatorDuties();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-[#F4F5F8]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF5500]"></div>
                <p className="mt-3 text-xs text-[#0B0F28] font-bold">Loading exams...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in font-sans space-y-4 sm:space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FF5500]/10 text-[#FF5500] rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-base sm:text-xl font-extrabold text-[#0B0F28] tracking-tight">Exam Schedule</h1>
                        <p className="text-gray-500 text-xs">View published exams and your invigilator duties</p>
                    </div>
                </div>
                <button
                    onClick={fetchData}
                    className="px-4 py-2 bg-[#FF5500] text-white rounded-xl text-xs font-bold hover:bg-[#e04b00] transition-colors shadow-sm flex items-center gap-2"
                >
                    Refresh
                </button>
            </div>

            {/* My Duties Card */}
            {myDuties.length > 0 && (
                <div className="bg-[#0B0F28] text-white rounded-2xl p-4 sm:p-5 shadow-md border border-[#0B0F28]">
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div>
                            <h2 className="text-base sm:text-lg font-extrabold">My Invigilator Duties</h2>
                            <p className="text-gray-300 text-xs font-medium">{myDuties.length} duty assignment{myDuties.length > 1 ? 's' : ''}</p>
                        </div>
                        <button
                            onClick={downloadDutyCardPDF}
                            className="px-3.5 py-1.5 bg-[#FF5500] text-white rounded-xl font-bold text-xs hover:bg-[#e04b00] transition-colors shadow-sm"
                        >
                            Download Duty Card
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {myDuties.map(({ exam, subject }, idx) => (
                            <div key={idx} className="bg-white/10 border border-white/15 rounded-xl p-3.5 text-xs">
                                <span className="font-bold text-[#FF5500] uppercase text-[10px] bg-white px-2 py-0.5 rounded">{exam.examType}</span>
                                <h3 className="font-extrabold text-sm text-white mt-2">{subject.subjectName}</h3>
                                <p className="text-gray-300 text-[11px] mb-2">{exam.examName} — {exam.class} {exam.section}</p>
                                <div className="space-y-1 bg-black/20 rounded-lg p-2 font-medium">
                                    <p>📅 {formatDate(subject.examDate)}</p>
                                    <p>⏰ {formatTime(subject.startTime)} – {formatTime(subject.endTime)}</p>
                                    <p>🚪 Room: <strong>{subject.room || 'TBD'}</strong></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filter Bar */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-3.5 shadow-sm flex flex-col md:flex-row gap-3 items-center">
                <input
                    type="text"
                    placeholder="Search exams or class..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full md:flex-1 px-3 py-2 bg-[#F4F5F8] border border-gray-200 rounded-xl text-xs font-bold text-[#0B0F28] outline-none"
                />
                <div className="flex gap-2 w-full md:w-auto">
                    {['all', 'published', 'mine'].map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                                activeFilter === f
                                ? 'bg-[#FF5500] text-white shadow-sm'
                                : 'bg-gray-100 text-[#0B0F28] hover:bg-gray-200'
                            }`}
                        >
                            {f === 'mine' ? 'My Duties' : f === 'published' ? 'Published' : 'All Exams'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Exams List */}
            {filteredExams.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl border border-gray-200/80">
                    <p className="text-sm font-bold text-[#0B0F28]">No exams found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredExams.map(exam => (
                        <div key={exam._id} className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
                            <div className="bg-[#0B0F28] text-white px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-base font-extrabold text-white">{exam.examName}</h3>
                                    <p className="text-gray-300 text-xs font-medium">{exam.examType} • {exam.class} {exam.section} • {exam.academicYear}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => { setSelectedExam(exam); setShowModal(true); }}
                                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors"
                                    >
                                        Details
                                    </button>
                                    <button
                                        onClick={() => downloadExamPDF(exam)}
                                        className="px-3 py-1.5 bg-[#FF5500] text-white rounded-xl text-xs font-bold hover:bg-[#e04b00] transition-colors"
                                    >
                                        PDF
                                    </button>
                                </div>
                            </div>

                            {/* Schedule Table */}
                            {exam.subjects && exam.subjects.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200">
                                                <th className="px-4 py-2.5">Subject</th>
                                                <th className="px-4 py-2.5">Date</th>
                                                <th className="px-4 py-2.5">Time</th>
                                                <th className="px-4 py-2.5">Room</th>
                                                <th className="px-4 py-2.5">Invigilator</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {exam.subjects.map((subject, idx) => {
                                                const invTeacher = getTeacherById(subject.invigilator);
                                                const isMe = invTeacher && currentTeacher && (
                                                    invTeacher._id?.toString() === currentTeacher._id?.toString() ||
                                                    invTeacher.name?.toLowerCase() === currentTeacher.name?.toLowerCase()
                                                );
                                                return (
                                                    <tr key={idx} className={`hover:bg-gray-50 ${isMe ? 'bg-[#FF5500]/10 font-bold' : ''}`}>
                                                        <td className="px-4 py-2.5 font-bold text-[#0B0F28]">{subject.subjectName}</td>
                                                        <td className="px-4 py-2.5 text-gray-600 font-medium">{formatDate(subject.examDate)}</td>
                                                        <td className="px-4 py-2.5 text-gray-600 font-medium">{formatTime(subject.startTime)} – {formatTime(subject.endTime)}</td>
                                                        <td className="px-4 py-2.5 text-gray-600">{subject.room || 'TBD'}</td>
                                                        <td className="px-4 py-2.5">
                                                            {invTeacher ? (
                                                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${isMe ? 'bg-[#FF5500] text-white' : 'bg-gray-200 text-gray-700'}`}>
                                                                    {invTeacher.name} {isMe ? '(You)' : ''}
                                                                </span>
                                                            ) : '—'}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
