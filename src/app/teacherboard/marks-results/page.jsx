'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../../../config/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const MarksResultsPage = () => {
    // State management
    const [classes, setClasses] = useState(['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']);
    const [sections, setSections] = useState(['A', 'B', 'C', 'D']);
    const [students, setStudents] = useState([]);
    const [results, setResults] = useState([]);
    const [classSectionCards, setClassSectionCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null); // {class, section, examName, academicYear}
    const [editedResults, setEditedResults] = useState({}); // {resultId: {subjectName, marks, totalMarks}}
    
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [examName, setExamName] = useState('');
    const [examType, setExamType] = useState('');
    const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString());
    
    const [marksData, setMarksData] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [savingIndex, setSavingIndex] = useState(null); // index of student being saved individually
    const [viewMode, setViewMode] = useState('entry'); // 'entry' or 'view'


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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedClass]);

    // Load students when both class and section are selected
    useEffect(() => {
        if (selectedClass && selectedSection) {
            fetchStudents();
        } else {
            setStudents([]);
            setMarksData([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedClass, selectedSection]);

    // Fetch students
    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/results/helpers/students?class=${selectedClass}&section=${selectedSection}`);
            const data = await response.json();
            
            if (data.success) {
                setStudents(data.data);
                // Initialize marks data
                const initialMarksData = data.data.map(student => ({
                    studentId: student._id,
                    studentName: student.name,
                    rollNumber: student.rollNumber,
                    subjects: [{ subjectName: '', marks: '', totalMarks: 100 }]
                }));
                setMarksData(initialMarksData);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            Swal.fire('Error', 'Failed to load students', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Get safe subjects array for a student entry
    const getSafeSubjects = (student) =>
        Array.isArray(student.subjects) && student.subjects.length
            ? student.subjects
            : [{ subjectName: '', marks: '', totalMarks: 100 }];

    // Add a subject row to a student
    const addSubject = (studentIndex) => {
        const updatedMarksData = [...marksData];
        const existing = getSafeSubjects(updatedMarksData[studentIndex]);
        updatedMarksData[studentIndex] = {
            ...updatedMarksData[studentIndex],
            subjects: [...existing, { subjectName: '', marks: '', totalMarks: 100 }]
        };
        setMarksData(updatedMarksData);
    };

    // Remove a subject row from a student (min 1)
    const removeSubject = (studentIndex, subjectIndex) => {
        const updatedMarksData = [...marksData];
        const subs = [...getSafeSubjects(updatedMarksData[studentIndex])];
        if (subs.length === 1) {
            subs[0] = { subjectName: '', marks: '', totalMarks: 100 };
        } else {
            subs.splice(subjectIndex, 1);
        }
        updatedMarksData[studentIndex] = { ...updatedMarksData[studentIndex], subjects: subs };
        setMarksData(updatedMarksData);
    };

    // Update subject name
    const updateSubjectName = (studentIndex, subjectIndex, value) => {
        const updatedMarksData = [...marksData];
        const subs = [...getSafeSubjects(updatedMarksData[studentIndex])];
        subs[subjectIndex] = { ...subs[subjectIndex], subjectName: value };
        updatedMarksData[studentIndex] = { ...updatedMarksData[studentIndex], subjects: subs };
        setMarksData(updatedMarksData);
    };

    // Update marks
    const updateMarks = (studentIndex, subjectIndex, value) => {
        const updatedMarksData = [...marksData];
        const subs = [...getSafeSubjects(updatedMarksData[studentIndex])];
        subs[subjectIndex] = { ...subs[subjectIndex], marks: value };
        updatedMarksData[studentIndex] = { ...updatedMarksData[studentIndex], subjects: subs };
        setMarksData(updatedMarksData);
    };

    // Update total marks
    const updateTotalMarks = (studentIndex, subjectIndex, value) => {
        const updatedMarksData = [...marksData];
        const subs = [...getSafeSubjects(updatedMarksData[studentIndex])];
        subs[subjectIndex] = { ...subs[subjectIndex], totalMarks: parseInt(value) || 100 };
        updatedMarksData[studentIndex] = { ...updatedMarksData[studentIndex], subjects: subs };
        setMarksData(updatedMarksData);
    };

    // Update individual result
    const updateResult = async (resultId, updatedData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/results/${resultId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire('Success', 'Result updated successfully!', 'success');
                // Refresh the results
                if (selectedCard) {
                    fetchFilteredResults(selectedCard);
                }
            } else {
                throw new Error(data.message || 'Failed to update result');
            }
        } catch (error) {
            console.error('Update result error:', error);
            Swal.fire('Error', error.message || 'Failed to update result', 'error');
        }
    };

    // Calculate grade
    const calculateGrade = (percentage) => {
        if (percentage >= 80) return 'A+';
        if (percentage >= 70) return 'A';
        if (percentage >= 60) return 'A-';
        if (percentage >= 50) return 'B';
        if (percentage >= 40) return 'C';
        if (percentage >= 33) return 'D';
        return 'F';
    };

    // Calculate student totals across all subjects
    const calculateStudentTotal = (studentMarks) => {
        const subjects = Array.isArray(studentMarks.subjects) ? studentMarks.subjects : [];
        const totalObtained = subjects.reduce((sum, s) => sum + (parseFloat(s.marks) || 0), 0);
        const totalMarks = subjects.reduce((sum, s) => sum + (parseInt(s.totalMarks) || 0), 0);
        const percentage = totalMarks > 0 ? (totalObtained / totalMarks) * 100 : 0;
        const grade = calculateGrade(percentage);
        const status = percentage >= 33 ? 'Pass' : 'Fail';
        return {
            totalObtained: totalObtained.toFixed(2),
            totalMarks,
            percentage: percentage.toFixed(2),
            grade,
            status
        };
    };

    // Save a single student's result
    const saveStudentResult = async (studentIndex) => {
        const student = marksData[studentIndex];
        const subs = getSafeSubjects(student);

        if (subs.some(s => s.subjectName === '' || s.marks === '' || s.marks === null)) {
            Swal.fire('Error', 'Please enter subject name and marks for this student', 'error');
            return;
        }
        if (!examName) {
            Swal.fire('Error', 'Please enter Exam Name before saving', 'error');
            return;
        }

        try {
            setSavingIndex(studentIndex);
            const payload = [{
                studentId: student.studentId,
                studentName: student.studentName,
                rollNumber: student.rollNumber,
                class: selectedClass,
                section: selectedSection,
                examName,
                examType,
                academicYear,
                subjects: subs
            }];

            const response = await fetch(`${API_BASE_URL}/results/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ results: payload })
            });
            const data = await response.json();

            if (data.success) {
                Swal.fire({ icon: 'success', title: 'Saved!', text: `${student.studentName}'s results saved.`, timer: 1500, showConfirmButton: false });
            } else {
                throw new Error(data.message || 'Failed to save');
            }
        } catch (error) {
            Swal.fire('Error', error.message || 'Failed to save result', 'error');
        } finally {
            setSavingIndex(null);
        }
    };

    // Save results
    const saveResults = async () => {
        // Validate all fields are entered
        const invalidEntries = marksData.some(student =>
            !Array.isArray(student.subjects) ||
            student.subjects.some(s => s.subjectName === '' || s.marks === '' || s.marks === null)
        );

        if (invalidEntries) {
            Swal.fire('Error', 'Please enter subject name and marks for all students', 'error');
            return;
        }

        try {
            setLoading(true);
            
            const resultsPayload = marksData.map(student => ({
                studentId: student.studentId,
                studentName: student.studentName,
                rollNumber: student.rollNumber,
                class: selectedClass,
                section: selectedSection,
                examName,
                examType,
                academicYear,
                subjects: getSafeSubjects(student)
            }));

            const response = await fetch(`${API_BASE_URL}/results/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ results: resultsPayload })
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire('Success', 'All results saved successfully!', 'success');
                fetchResults();
            } else {
                throw new Error(data.message || 'Failed to save results');
            }
        } catch (error) {
            console.error('Error saving results:', error);
            Swal.fire('Error', error.message || 'Failed to save results', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Fetch saved results
    const fetchResults = async () => {
        try {
            setLoading(true);
            let url = `${API_BASE_URL}/results`;
            const params = new URLSearchParams();
            
            if (selectedClass) params.append('class', selectedClass);
            if (selectedSection) params.append('section', selectedSection);
            if (examName) params.append('examName', examName);
            if (academicYear) params.append('academicYear', academicYear);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setResults(data.data);
                setViewMode('view');
            }
        } catch (error) {
            console.error('Error fetching results:', error);
            Swal.fire('Error', 'Failed to load results', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Fetch class/section cards for overview
    const fetchClassSectionCards = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/results`);
            const data = await response.json();

            if (data.success) {
                // Step 1: Group by class+section+examName+academicYear (full exam groups)
                const examGrouped = data.data.reduce((acc, result) => {
                    const key = `${result.class}-${result.section}-${result.examName}-${result.academicYear}`;
                    if (!acc[key]) {
                        acc[key] = {
                            class: result.class,
                            section: result.section,
                            examName: result.examName,
                            academicYear: result.academicYear,
                            totalStudents: 0,
                            passed: 0,
                            failed: 0,
                            averagePercentage: 0,
                            // track latest createdAt in this exam group
                            _latestCreatedAt: result.createdAt || ''
                        };
                    }
                    acc[key].totalStudents += 1;
                    if (result.status === 'Pass') acc[key].passed += 1;
                    else acc[key].failed += 1;
                    acc[key].averagePercentage += result.percentage;
                    // keep the most recent createdAt for tie-breaking
                    if ((result.createdAt || '') > acc[key]._latestCreatedAt) {
                        acc[key]._latestCreatedAt = result.createdAt || '';
                    }
                    return acc;
                }, {});

                const allCards = Object.values(examGrouped).map(card => ({
                    ...card,
                    averagePercentage: (card.averagePercentage / card.totalStudents).toFixed(2)
                }));

                // Step 2: For each class+section keep only the LATEST exam card
                // Latest = highest academicYear; if tied, highest _latestCreatedAt
                const latestPerClassSection = allCards.reduce((acc, card) => {
                    const key = `${card.class}-${card.section}`;
                    if (!acc[key]) {
                        acc[key] = card;
                    } else {
                        const existing = acc[key];
                        const newYear = parseInt(card.academicYear) || 0;
                        const exYear  = parseInt(existing.academicYear) || 0;
                        if (
                            newYear > exYear ||
                            (newYear === exYear && (card._latestCreatedAt || '') > (existing._latestCreatedAt || ''))
                        ) {
                            acc[key] = card;
                        }
                    }
                    return acc;
                }, {});

                const cards = Object.values(latestPerClassSection).map(({ _latestCreatedAt, ...rest }) => rest);

                setClassSectionCards(cards);
            }
        } catch (error) {
            console.error('Error fetching class section cards:', error);
        }
    };

    // Handle card click
    const handleCardClick = (card) => {
        setSelectedCard(card);
        // Set filters and fetch results
        setSelectedClass(card.class);
        setSelectedSection(card.section);
        setExamName(card.examName);
        setAcademicYear(card.academicYear);
        setEditedResults({}); // Reset edited results
        fetchFilteredResults(card);
    };

    // Fetch filtered results for selected card
    const fetchFilteredResults = async (card) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${API_BASE_URL}/results?class=${card.class}&section=${card.section}&examName=${card.examName}&academicYear=${card.academicYear}`
            );
            const data = await response.json();

            if (data.success) {
                setResults(data.data);
                setEditedResults({}); // Reset edited results
            }
        } catch (error) {
            console.error('Error fetching filtered results:', error);
            Swal.fire('Error', 'Failed to load results', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Export to Excel (CSV)
    const exportToExcel = () => {
        if (results.length === 0) {
            Swal.fire('Error', 'No results to export', 'error');
            return;
        }

        // Create CSV content
        const title = selectedCard 
            ? `Results - ${selectedCard.class} ${selectedCard.section} (${selectedCard.examName})`
            : 'All Results Export';
        let csvContent = `${title}\n\n`;
        
        // Headers
        const headers = selectedCard 
            ? ['Roll', 'Student Name', 'Subject Name', 'Marks', 'Total Marks', 'Percentage', 'Grade', 'Status', 'Merit Position']
            : ['Class', 'Section', 'Exam Name', 'Exam Type', 'Academic Year', 'Roll', 'Student Name', 'Subject Name', 'Marks', 'Total Marks', 'Percentage', 'Grade', 'Status', 'Merit Position'];
        csvContent += headers.join(',') + '\n';

        // Data rows — one row per subject per student
        results.forEach(result => {
            const subs = Array.isArray(result.subjects) && result.subjects.length ? result.subjects : [{ subjectName: 'N/A', marks: 'N/A', totalMarks: 'N/A' }];
            subs.forEach((sub, si) => {
                const row = selectedCard
                    ? [
                        si === 0 ? result.rollNumber : '',
                        si === 0 ? `"${result.studentName}"` : '',
                        sub.subjectName,
                        sub.marks,
                        sub.totalMarks,
                        si === 0 ? result.percentage + '%' : '',
                        si === 0 ? result.grade : '',
                        si === 0 ? result.status : '',
                        si === 0 ? (result.meritPosition || 'N/A') : ''
                    ]
                    : [
                        si === 0 ? result.class : '',
                        si === 0 ? result.section : '',
                        si === 0 ? result.examName : '',
                        si === 0 ? result.examType : '',
                        si === 0 ? result.academicYear : '',
                        si === 0 ? result.rollNumber : '',
                        si === 0 ? `"${result.studentName}"` : '',
                        sub.subjectName,
                        sub.marks,
                        sub.totalMarks,
                        si === 0 ? result.percentage + '%' : '',
                        si === 0 ? result.grade : '',
                        si === 0 ? result.status : '',
                        si === 0 ? (result.meritPosition || 'N/A') : ''
                    ];
                csvContent += row.join(',') + '\n';
            });
        });

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = selectedCard 
            ? `Results_${selectedCard.class}_${selectedCard.section}_${selectedCard.examName}.csv`
            : `All_Results_Export.csv`;
        link.click();

        Swal.fire('Success', 'Results exported to Excel', 'success');
    };

    // Print results
    const printResults = () => {
        if (results.length === 0) {
            Swal.fire('Error', 'No results to print', 'error');
            return;
        }

        const printWindow = window.open('', '_blank');
        const printContent = document.getElementById('print-pdf-content').innerHTML;
        
        printWindow.document.write(`
            <html>
            <head>
                <title>${selectedCard ? `Results - ${selectedCard.class} ${selectedCard.section}` : 'All Results Report'}</title>
                <link href="https://fonts.googleapis.com/css2?family=Sora:wght@100..800&display=swap" rel="stylesheet">
                <style>
                    body { 
                        font-family: 'Sora', sans-serif; 
                        margin: 0; 
                        padding: 20px; 
                        background-color: white;
                        color: #1f2937;
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-top: 20px; 
                        font-size: 12px;
                    }
                    th, td { 
                        border: 1px solid #374151; 
                        padding: 8px; 
                        text-align: center; 
                    }
                    th { 
                        background-color: #3b82f6; 
                        color: white; 
                        font-weight: bold;
                        padding: 12px 8px;
                    }
                    tr:nth-child(even) { 
                        background-color: #f9fafb; 
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 30px; 
                        border-bottom: 2px solid #374151; 
                        padding-bottom: 20px;
                    }
                    .header h1 {
                        font-size: 28px;
                        font-weight: bold;
                        color: #1f2937;
                        margin: 0;
                    }
                    .header h2 {
                        font-size: 20px;
                        color: #6b7280;
                        margin: 10px 0;
                    }
                    .header p {
                        font-size: 14px;
                        color: #9ca3af;
                    }
                    .stats {
                        margin-bottom: 20px;
                        display: flex;
                        justify-content: space-around;
                        background-color: #f3f4f6;
                        padding: 15px;
                        border-radius: 8px;
                    }
                    .stat-item {
                        text-align: center;
                    }
                    .stat-value {
                        font-size: 24px;
                        font-weight: bold;
                        color: #1f2937;
                    }
                    .stat-label {
                        font-size: 12px;
                        color: #6b7280;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 10px;
                        color: #9ca3af;
                    }
                    .pass { 
                        background-color: #d1fae5; 
                        color: #065f46; 
                        padding: 4px 8px; 
                        border-radius: 12px; 
                        font-weight: bold; 
                    }
                    .fail { 
                        background-color: #fee2e2; 
                        color: #991b1b; 
                        padding: 4px 8px; 
                        border-radius: 12px; 
                        font-weight: bold; 
                    }
                    .grade-a-plus { background-color: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 12px; font-weight: bold; }
                    .grade-a { background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 12px; font-weight: bold; }
                    .grade-f { background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 12px; font-weight: bold; }
                    .grade-other { background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 12px; font-weight: bold; }
                    @media print {
                        body { margin: 0; }
                        button { display: none; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                ${printContent}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.onload = function() {
            printWindow.print();
        };
    };

    // Download individual student result card as PDF
    const downloadStudentCard = (result) => {
        const resSubs = Array.isArray(result.subjects) && result.subjects.length
            ? result.subjects
            : [{ subjectName: 'N/A', marks: 0, totalMarks: 100 }];
        const totalObtained = resSubs.reduce((s, sub) => s + (parseFloat(sub.marks) || 0), 0);
        const totalMarks   = resSubs.reduce((s, sub) => s + (parseInt(sub.totalMarks) || 0), 0);
        const percentage   = totalMarks > 0 ? (totalObtained / totalMarks * 100).toFixed(2) : '0.00';
        const grade        = calculateGrade(parseFloat(percentage));
        const status       = parseFloat(percentage) >= 33 ? 'Pass' : 'Fail';
        const meritPos     = result.meritPosition ? `#${result.meritPosition}` : '-';
        const statusColor  = status === 'Pass' ? '#16a34a' : '#dc2626';
        const gradeColor   = grade === 'A+' ? '#16a34a' : grade === 'A' ? '#1d4ed8' : grade === 'F' ? '#dc2626' : '#b45309';
        const pctNum       = parseFloat(percentage);
        const barColor     = pctNum >= 80 ? '#16a34a' : pctNum >= 60 ? '#2563eb' : pctNum >= 33 ? '#d97706' : '#dc2626';
        const classInfo    = selectedCard ? `${selectedCard.class} - Section ${selectedCard.section}` : '';
        const examInfo     = selectedCard ? `${selectedCard.examName}` : result.examName || '';
        const yearInfo     = selectedCard ? selectedCard.academicYear : result.academicYear || '';

        // Build rows HTML
        const rows = resSubs.map((sub, i) => {
            const pct = sub.totalMarks > 0 ? ((parseFloat(sub.marks) || 0) / parseInt(sub.totalMarks) * 100).toFixed(1) : '0.0';
            const bg  = i % 2 === 0 ? '#f8fafc' : '#fff';
            return `
                <tr style="background:${bg};">
                    <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;font-size:13px;">${i + 1}</td>
                    <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#1e293b;font-weight:500;font-size:13px;">${sub.subjectName}</td>
                    <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:center;font-weight:700;color:#1e40af;font-size:13px;">${sub.marks}</td>
                    <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:center;color:#64748b;font-size:13px;">${sub.totalMarks}</td>
                    <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:center;color:#64748b;font-size:13px;">${pct}%</td>
                </tr>`;
        }).join('');

        const cardHTML = `
            <div id="student-result-card" style="
                width:720px;
                background:#fff;
                font-family:'Segoe UI',Arial,sans-serif;
                border-radius:16px;
                overflow:hidden;
                box-shadow:0 4px 32px rgba(0,0,0,0.13);
                border:1px solid #e2e8f0;
            ">
                <!-- Header gradient banner -->
                <div style="background:linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 60%,#3b82f6 100%);padding:32px 36px 28px;position:relative;overflow:hidden;">
                    <div style="position:absolute;top:-40px;right:-40px;width:180px;height:180px;background:rgba(255,255,255,0.06);border-radius:50%;"></div>
                    <div style="position:absolute;bottom:-60px;left:-30px;width:220px;height:220px;background:rgba(255,255,255,0.04);border-radius:50%;"></div>
                    <div style="position:relative;z-index:1;">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                            <div>
                                <div style="font-size:11px;font-weight:600;letter-spacing:2px;color:rgba(255,255,255,0.65);text-transform:uppercase;margin-bottom:4px;">Official Result Card</div>
                                <div style="font-size:24px;font-weight:800;color:#fff;line-height:1.2;">School Management System</div>
                            </div>
                            <div style="width:64px;height:64px;background:rgba(255,255,255,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;border:2px solid rgba(255,255,255,0.25);">🎓</div>
                        </div>
                        <div style="display:flex;gap:16px;flex-wrap:wrap;">
                            ${classInfo ? `<span style="background:rgba(255,255,255,0.15);color:#fff;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:600;border:1px solid rgba(255,255,255,0.25);">🏫 ${classInfo}</span>` : ''}
                            ${examInfo  ? `<span style="background:rgba(255,255,255,0.15);color:#fff;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:600;border:1px solid rgba(255,255,255,0.25);">📋 ${examInfo}</span>`  : ''}
                            ${yearInfo  ? `<span style="background:rgba(255,255,255,0.15);color:#fff;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:600;border:1px solid rgba(255,255,255,0.25);">📅 ${yearInfo}</span>`  : ''}
                        </div>
                    </div>
                </div>

                <!-- Student identity strip -->
                <div style="background:#f1f5f9;padding:20px 36px;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;gap:16px;">
                    <div style="display:flex;align-items:center;gap:16px;">
                        <div style="width:52px;height:52px;background:linear-gradient(135deg,#1e3a8a,#3b82f6);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:800;flex-shrink:0;">
                            ${(result.studentName || 'S').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style="font-size:19px;font-weight:800;color:#1e293b;">${result.studentName}</div>
                            <div style="font-size:12px;color:#64748b;font-weight:500;margin-top:2px;">Roll No: <strong style="color:#1e3a8a;">${result.rollNumber}</strong></div>
                        </div>
                    </div>
                    <div style="text-align:center;">
                        <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Merit Position</div>
                        <div style="font-size:22px;font-weight:800;color:#1e3a8a;">${meritPos}</div>
                    </div>
                </div>

                <!-- Subject table -->
                <div style="padding:24px 36px 0;">
                    <div style="font-size:13px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Subject-wise Performance</div>
                    <table style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr style="background:linear-gradient(90deg,#1e3a8a,#2563eb);">
                                <th style="padding:11px 14px;text-align:left;color:#fff;font-size:12px;font-weight:700;letter-spacing:0.5px;">#</th>
                                <th style="padding:11px 14px;text-align:left;color:#fff;font-size:12px;font-weight:700;letter-spacing:0.5px;">Subject</th>
                                <th style="padding:11px 14px;text-align:center;color:#fff;font-size:12px;font-weight:700;letter-spacing:0.5px;">Obtained</th>
                                <th style="padding:11px 14px;text-align:center;color:#fff;font-size:12px;font-weight:700;letter-spacing:0.5px;">Total</th>
                                <th style="padding:11px 14px;text-align:center;color:#fff;font-size:12px;font-weight:700;letter-spacing:0.5px;">%</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>

                <!-- Summary row -->
                <div style="margin:20px 36px 0;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
                    <div style="text-align:center;flex:1;">
                        <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Total Marks</div>
                        <div style="font-size:20px;font-weight:800;color:#1e293b;">${totalObtained} <span style="font-size:14px;color:#64748b;font-weight:500;">/ ${totalMarks}</span></div>
                    </div>
                    <div style="width:1px;height:40px;background:#e2e8f0;"></div>
                    <div style="text-align:center;flex:1;">
                        <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Percentage</div>
                        <div style="font-size:20px;font-weight:800;color:${barColor};">${percentage}%</div>
                    </div>
                    <div style="width:1px;height:40px;background:#e2e8f0;"></div>
                    <div style="text-align:center;flex:1;">
                        <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Grade</div>
                        <div style="font-size:20px;font-weight:800;color:${gradeColor};">${grade}</div>
                    </div>
                    <div style="width:1px;height:40px;background:#e2e8f0;"></div>
                    <div style="text-align:center;flex:1;">
                        <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Result</div>
                        <div style="font-size:20px;font-weight:800;color:${statusColor};">${status}</div>
                    </div>
                </div>

                <!-- Percentage bar -->
                <div style="margin:16px 36px 0;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                        <span style="font-size:11px;font-weight:600;color:#64748b;">Score Progress</span>
                        <span style="font-size:11px;font-weight:700;color:${barColor};">${percentage}%</span>
                    </div>
                    <div style="height:8px;background:#e2e8f0;border-radius:999px;overflow:hidden;">
                        <div style="height:100%;width:${Math.min(parseFloat(percentage), 100)}%;background:linear-gradient(90deg,${barColor},${barColor}cc);border-radius:999px;"></div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="margin:20px 36px 0;padding:16px 0 24px;border-top:1px dashed #e2e8f0;display:flex;align-items:center;justify-content:space-between;">
                    <div style="font-size:11px;color:#94a3b8;">Generated: ${new Date().toLocaleDateString('en-BD', { year:'numeric', month:'long', day:'numeric' })}</div>
                    <div style="font-size:11px;color:#94a3b8;">School Management System &copy; ${new Date().getFullYear()}</div>
                </div>
            </div>`;

        // Inject hidden container, capture, then remove
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1;';
        wrapper.innerHTML = cardHTML;
        document.body.appendChild(wrapper);

        const cardEl = wrapper.querySelector('#student-result-card');

        Swal.fire({ title: 'Generating Result Card...', text: 'Please wait', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        html2canvas(cardEl, { scale: 2.5, useCORS: true, backgroundColor: '#ffffff', logging: false }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pageW = pdf.internal.pageSize.getWidth();
            const imgW = pageW - 20;
            const imgH = (canvas.height * imgW) / canvas.width;
            pdf.addImage(imgData, 'PNG', 10, 15, imgW, imgH);
            pdf.save(`Result_Card_${result.studentName}_${result.rollNumber}.pdf`);
            document.body.removeChild(wrapper);
            Swal.fire({ icon: 'success', title: 'Downloaded!', text: `Result card for ${result.studentName} saved.`, timer: 2000, showConfirmButton: false });
        }).catch(() => {
            document.body.removeChild(wrapper);
            Swal.fire('Error', 'Could not generate result card.', 'error');
        });
    };

    // Download as PDF
    const downloadPDF = () => {
        if (results.length === 0) {
            Swal.fire('Error', 'No results to download', 'error');
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

        const element = document.getElementById('print-pdf-content');
        
        if (!element) {
            Swal.close();
            Swal.fire('Error', 'Print content not found', 'error');
            return;
        }

        // Temporarily show the element for capture
        const originalDisplay = element.style.display;
        element.style.display = 'block';

        html2canvas(element, { 
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            // Restore original display
            element.style.display = originalDisplay;

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            
            const imgWidth = 280;
            const pageHeight = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 10;

            // Add first page
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add additional pages if needed
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight + 10;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(selectedCard 
                ? `Results_${selectedCard.class}_${selectedCard.section}_${selectedCard.examName}.pdf`
                : `All_Results_Report.pdf`
            );
            
            Swal.close();
            Swal.fire('Success', 'PDF downloaded successfully', 'success');
        }).catch(error => {
            // Restore original display
            element.style.display = originalDisplay;
            console.error('PDF generation error:', error);
            Swal.close();
            Swal.fire('Error', 'Failed to generate PDF. Please try again.', 'error');
        });
    };

    return (
        <div className="animate-fade-in font-sans space-y-4 sm:space-y-5">
            {/* Header */}
            <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FF5500]/10 text-[#FF5500] rounded-xl flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-base sm:text-xl font-extrabold text-[#0B0F28] tracking-tight">
                                Marks & Results
                            </h1>
                            <p className="text-gray-500 text-xs">Professional examination results management system</p>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 w-full sm:w-auto bg-[#F4F5F8] p-1 rounded-xl border border-gray-200/70">
                        <button
                            onClick={() => setViewMode('entry')}
                            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold transition-all text-xs flex items-center justify-center gap-1.5 ${
                                viewMode === 'entry'
                                    ? 'bg-[#FF5500] text-white shadow-sm'
                                    : 'bg-transparent text-gray-600 hover:bg-gray-200/60'
                            }`}
                        >
                            Entry Mode
                        </button>
                        <button
                            onClick={() => {
                                fetchClassSectionCards();
                                setViewMode('view');
                                setSelectedCard(null);
                            }}
                            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold transition-all text-xs flex items-center justify-center gap-1.5 ${
                                viewMode === 'view'
                                    ? 'bg-[#FF5500] text-white shadow-sm'
                                    : 'bg-transparent text-gray-600 hover:bg-gray-200/60'
                            }`}
                        >
                            View Results
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-4 sm:p-5">
                <h2 className="text-sm font-extrabold text-[#0B0F28] mb-3 flex items-center gap-2">
                    <span className="text-[#FF5500]">⚙️</span> Selection Criteria
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                    {/* Class Selection */}
                    <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Class</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full px-3 py-2 bg-[#F4F5F8] border border-gray-200 rounded-xl outline-none text-xs font-bold text-[#0B0F28]"
                        >
                            <option value="">Select Class</option>
                            {classes.map((cls, index) => (
                                <option key={index} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>

                    {/* Section Selection */}
                    <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Section</label>
                        <select
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            className="w-full px-3 py-2 bg-[#F4F5F8] border border-gray-200 rounded-xl outline-none text-xs font-bold text-[#0B0F28]"
                            disabled={!selectedClass}
                        >
                            <option value="">Select Section</option>
                            {sections.map((section, index) => (
                                <option key={index} value={section}>{section}</option>
                            ))}
                        </select>
                    </div>

                    {/* Exam Name */}
                    <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Exam Name</label>
                        <input
                            type="text"
                            value={examName}
                            onChange={(e) => setExamName(e.target.value)}
                            placeholder="e.g., First Terminal"
                            className="w-full px-3 py-2 bg-[#F4F5F8] border border-gray-200 rounded-xl outline-none text-xs font-bold text-[#0B0F28]"
                        />
                    </div>

                    {/* Exam Type */}
                    <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Exam Type</label>
                        <select
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                            className="w-full px-3 py-2 bg-[#F4F5F8] border border-gray-200 rounded-xl outline-none text-xs font-bold text-[#0B0F28]"
                        >
                            <option value="">Select Type</option>
                            <option value="Terminal">Terminal</option>
                            <option value="Mid-Term">Mid-Term</option>
                            <option value="Final">Final</option>
                            <option value="Class Test">Class Test</option>
                            <option value="Unit Test">Unit Test</option>
                        </select>
                    </div>

                    {/* Academic Year */}
                    <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Academic Year</label>
                        <input
                            type="text"
                            value={academicYear}
                            onChange={(e) => setAcademicYear(e.target.value)}
                            placeholder="2026"
                            className="w-full px-3 py-2 bg-[#F4F5F8] border border-gray-200 rounded-xl outline-none text-xs font-bold text-[#0B0F28]"
                        />
                    </div>
                </div>
            </div>

                {/* Entry Mode */}
                {viewMode === 'entry' && (
                    <>


                        {/* Marks Entry Table */}
                        {students.length > 0 && (
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                                    <h2 className="text-lg font-bold text-[#1E3A5F] font-heading flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        Marks Entry
                                    </h2>
                                    <button
                                        onClick={saveResults}
                                        disabled={loading}
                                        className="px-6 py-2.5 bg-[#1E3A5F] text-white rounded-xl font-semibold hover:bg-[#1E3A5F]/90 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                                        {loading ? 'Saving...' : 'Save All Results'}
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {marksData.map((student, studentIndex) => {
                                        const subjects = getSafeSubjects(student);
                                        const totals = calculateStudentTotal(student);
                                        return (
                                            <div key={student.studentId} className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors">
                                                {/* Student Header */}
                                                <div className="bg-[#F8FAFC] px-5 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-md px-2.5 py-1 shadow-sm">Roll: {student.rollNumber}</span>
                                                        <span className="text-base font-bold text-[#1E3A5F]">{student.studentName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                                                            <span className="text-xs text-gray-500 font-semibold uppercase">Total:</span>
                                                            <span className="text-sm font-bold text-[#1E3A5F]">{totals.totalObtained}/{totals.totalMarks}</span>
                                                        </div>
                                                        <span className="text-sm font-bold text-[#1E3A5F] bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 shadow-sm">{totals.percentage}%</span>
                                                        <span className={`px-2.5 py-1.5 rounded-lg font-bold text-xs border ${
                                                            totals.grade === 'A+' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                                                            totals.grade === 'A' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                            totals.grade === 'F' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' :
                                                            'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
                                                        }`}>{totals.grade}</span>
                                                        <span className={`px-2.5 py-1.5 rounded-lg font-bold text-xs border ${totals.status === 'Pass' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'}`}>
                                                            {totals.status}
                                                        </span>
                                                        <button
                                                            onClick={() => saveStudentResult(studentIndex)}
                                                            disabled={savingIndex === studentIndex}
                                                            className="px-4 py-1.5 bg-[#10B981] text-white rounded-lg font-semibold hover:bg-[#10B981]/90 transition-colors text-xs disabled:opacity-50 shadow-sm flex items-center gap-1.5 ml-2"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                            {savingIndex === studentIndex ? 'Saving...' : 'Save'}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Subjects Table */}
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="bg-white text-gray-500 border-b border-gray-100">
                                                                <th className="px-5 py-3 text-left font-semibold text-xs uppercase tracking-wider">#</th>
                                                                <th className="px-5 py-3 text-left font-semibold text-xs uppercase tracking-wider">Subject Name</th>
                                                                <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wider">Marks Obtained</th>
                                                                <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wider">Total Marks</th>
                                                                <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wider">Remove</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {subjects.map((sub, subIndex) => (
                                                                <tr key={subIndex} className="bg-white hover:bg-gray-50/50 transition-colors">
                                                                    <td className="px-5 py-3 text-gray-400 font-bold">{subIndex + 1}</td>
                                                                    <td className="px-5 py-3">
                                                                        <input
                                                                            type="text"
                                                                            value={sub.subjectName}
                                                                            onChange={(e) => updateSubjectName(studentIndex, subIndex, e.target.value)}
                                                                            className="w-full px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none text-sm font-medium text-[#1E3A5F]"
                                                                            placeholder="e.g. Mathematics"
                                                                        />
                                                                    </td>
                                                                    <td className="px-5 py-3 text-center">
                                                                        <input
                                                                            type="number"
                                                                            value={sub.marks}
                                                                            onChange={(e) => updateMarks(studentIndex, subIndex, e.target.value)}
                                                                            className="w-24 px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none text-sm font-bold text-[#1E3A5F]"
                                                                            min="0"
                                                                            max={sub.totalMarks}
                                                                            placeholder="0"
                                                                        />
                                                                    </td>
                                                                    <td className="px-5 py-3 text-center">
                                                                        <input
                                                                            type="number"
                                                                            value={sub.totalMarks}
                                                                            onChange={(e) => updateTotalMarks(studentIndex, subIndex, e.target.value)}
                                                                            className="w-24 px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none text-sm font-medium text-gray-500"
                                                                            min="1"
                                                                            placeholder="100"
                                                                        />
                                                                    </td>
                                                                    <td className="px-5 py-3 text-center">
                                                                        <button
                                                                            onClick={() => removeSubject(studentIndex, subIndex)}
                                                                            disabled={subjects.length === 1}
                                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors mx-auto"
                                                                            title="Remove subject"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Add Subject Button */}
                                                <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100">
                                                    <button
                                                        onClick={() => addSubject(studentIndex)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#1E3A5F] rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                        Add Subject
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* View Mode - Results Cards and Table */}
                {viewMode === 'view' && (
                    <>
                        {!selectedCard ? (
                            // Class/Section Cards View
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                                    <h2 className="text-lg font-bold text-[#1E3A5F] font-heading flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        Class & Section Results
                                    </h2>
                                    <button
                                        onClick={() => fetchResults()}
                                        className="px-6 py-2.5 bg-[#1E3A5F] text-white rounded-xl font-semibold hover:bg-[#1E3A5F]/90 transition-all text-sm shadow-sm flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                        View All Results
                                    </button>
                                </div>

                                {classSectionCards.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {classSectionCards.map((card, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleCardClick(card)}
                                                className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 cursor-pointer hover:shadow-md transition-all hover:border-[#1E3A5F]/30 group"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-bold text-[#1E3A5F] font-heading group-hover:text-[#F59E0B] transition-colors">
                                                        {card.class} - {card.section}
                                                    </h3>
                                                    <div className="w-10 h-10 bg-[#1E3A5F]/5 rounded-xl flex items-center justify-center group-hover:bg-[#F59E0B]/10 transition-colors">
                                                        <svg className="w-5 h-5 text-[#1E3A5F] group-hover:text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-xl border border-gray-50">
                                                    <p className="text-xs text-gray-500 flex justify-between">
                                                        <span className="font-semibold text-gray-600">Exam:</span> <span className="font-bold text-[#1E3A5F]">{card.examName}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 flex justify-between">
                                                        <span className="font-semibold text-gray-600">Year:</span> <span className="font-bold text-[#1E3A5F]">{card.academicYear}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 flex justify-between">
                                                        <span className="font-semibold text-gray-600">Students:</span> <span className="font-bold text-[#1E3A5F]">{card.totalStudents}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 flex justify-between">
                                                        <span className="font-semibold text-gray-600">Passed:</span> <span className="font-bold text-[#10B981]">{card.passed}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 flex justify-between">
                                                        <span className="font-semibold text-gray-600">Failed:</span> <span className="font-bold text-[#EF4444]">{card.failed}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 flex justify-between pt-1 border-t border-gray-100 mt-1">
                                                        <span className="font-semibold text-gray-600">Avg %:</span> <span className="font-bold text-[#1E3A5F]">{card.averagePercentage}%</span>
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-4 mx-auto border border-gray-100">
                                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-[#1E3A5F] font-heading mb-1">No Results Found</h3>
                                        <p className="text-gray-500 text-sm">No results have been saved in the system yet</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Detailed Results View with Edit Capability
                            <>
                                {/* Back Button & Action Buttons Header */}
                                <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 mb-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setSelectedCard(null)}
                                                className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                            </button>
                                            <div>
                                                <h2 className="text-xl font-bold text-[#1E3A5F] font-heading">
                                                    Results for {selectedCard.class} - {selectedCard.section}
                                                </h2>
                                                <p className="text-sm text-gray-500 font-medium">Exam: {selectedCard.examName}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-row flex-wrap gap-3">
                                            <button
                                                onClick={exportToExcel}
                                                className="px-4 py-2.5 bg-[#10B981] text-white rounded-xl font-semibold hover:bg-[#10B981]/90 transition-all text-sm shadow-sm flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                Export Excel
                                            </button>
                                            <button
                                                onClick={downloadPDF}
                                                className="px-4 py-2.5 bg-white text-[#EF4444] border border-[#EF4444]/20 rounded-xl font-semibold hover:bg-[#EF4444]/5 transition-all text-sm shadow-sm flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                                PDF Report
                                            </button>
                                            <button
                                                onClick={printResults}
                                                className="px-4 py-2.5 bg-white text-[#1E3A5F] border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm shadow-sm flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                                Print
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Statistics Cards */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                                    <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Total Students</p>
                                                <p className="text-2xl font-bold text-[#1E3A5F] mt-1 font-heading">{results.length}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-[#1E3A5F]/10 rounded-xl flex items-center justify-center">
                                                <svg className="w-6 h-6 text-[#1E3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Passed</p>
                                                <p className="text-2xl font-bold text-[#10B981] mt-1 font-heading">
                                                    {results.filter(r => r.status === 'Pass').length}
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center">
                                                <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Failed</p>
                                                <p className="text-2xl font-bold text-[#EF4444] mt-1 font-heading">
                                                    {results.filter(r => r.status === 'Fail').length}
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 bg-[#EF4444]/10 rounded-xl flex items-center justify-center">
                                                <svg className="w-6 h-6 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Average %</p>
                                                <p className="text-2xl font-bold text-[#F59E0B] mt-1 font-heading">
                                                    {(results.reduce((sum, r) => sum + r.percentage, 0) / (results.length || 1)).toFixed(2)}%
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center">
                                                <svg className="w-6 h-6 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Results — card-based view + inline edit per student */}
                                <div id="results-table-print" className="bg-white border border-gray-100 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
                                    <h2 className="text-lg font-bold text-[#1E3A5F] mb-6 font-heading flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                        Student Results
                                    </h2>
                                    <div className="space-y-5">
                                        {results.map((result, index) => {
                                            const resSubs = Array.isArray(result.subjects) && result.subjects.length
                                                ? result.subjects
                                                : [{ subjectName: 'N/A', marks: 0, totalMarks: 100 }];
                                            const isEditing = !!editedResults[result._id];
                                            const editedSubs = editedResults[result._id]?.subjects ?? resSubs.map(s => ({ ...s }));

                                            // Live totals (updates as user edits)
                                            const liveSubs = isEditing ? editedSubs : resSubs;
                                            const liveTotalObtained = liveSubs.reduce((s, sub) => s + (parseFloat(sub.marks) || 0), 0);
                                            const liveTotalMarks = liveSubs.reduce((s, sub) => s + (parseInt(sub.totalMarks) || 0), 0);
                                            const livePercentage = liveTotalMarks > 0 ? (liveTotalObtained / liveTotalMarks * 100).toFixed(2) : '0.00';
                                            const liveGrade = calculateGrade(parseFloat(livePercentage));
                                            const liveStatus = parseFloat(livePercentage) >= 33 ? 'Pass' : 'Fail';

                                            return (
                                                <div key={result._id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#1E3A5F]/30 transition-colors shadow-sm">
                                                    {/* Student header */}
                                                    <div className={`px-5 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 ${isEditing ? 'bg-[#F59E0B]/5' : 'bg-[#F8FAFC]'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center font-bold text-xs">{index + 1}</div>
                                                            <span className="text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-md px-2.5 py-1 shadow-sm">Roll: {result.rollNumber}</span>
                                                            <span className="text-base font-bold text-[#1E3A5F]">{result.studentName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                                                                <span className="text-xs text-gray-500 font-semibold uppercase">Total:</span>
                                                                <span className="text-sm font-bold text-[#1E3A5F]">{liveTotalObtained}/{liveTotalMarks}</span>
                                                            </div>
                                                            <span className="text-sm font-bold text-[#1E3A5F] bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 shadow-sm">{livePercentage}%</span>
                                                            <span className={`px-2.5 py-1.5 rounded-lg font-bold text-xs border ${
                                                                liveGrade === 'A+' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                                                                liveGrade === 'A' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                                liveGrade === 'F' ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20' :
                                                                'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
                                                            }`}>{liveGrade}</span>
                                                            <span className={`px-2.5 py-1.5 rounded-lg font-bold text-xs border ${liveStatus === 'Pass' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'}`}>
                                                                {liveStatus}
                                                            </span>
                                                            {isEditing ? (
                                                                <div className="flex gap-2 ml-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            updateResult(result._id, { ...result, subjects: editedSubs });
                                                                            setEditedResults(prev => { const c = { ...prev }; delete c[result._id]; return c; });
                                                                        }}
                                                                        className="px-4 py-1.5 bg-[#10B981] text-white rounded-lg font-semibold hover:bg-[#10B981]/90 transition-colors text-xs flex items-center gap-1.5 shadow-sm"
                                                                    >
                                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                                        Save
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setEditedResults(prev => { const c = { ...prev }; delete c[result._id]; return c; })}
                                                                        className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-xs flex items-center gap-1.5 shadow-sm"
                                                                    >
                                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex gap-2 ml-2">
                                                                    <button
                                                                        onClick={() => downloadStudentCard(result)}
                                                                        className="px-3 py-1.5 bg-white text-[#1E3A5F] border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-xs flex items-center gap-1.5 shadow-sm"
                                                                        title="Download Result Card PDF"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                                        Card
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setEditedResults(prev => ({
                                                                            ...prev,
                                                                            [result._id]: { subjects: resSubs.map(s => ({ ...s })) }
                                                                        }))}
                                                                        className="px-3 py-1.5 bg-[#1E3A5F]/10 text-[#1E3A5F] rounded-lg font-semibold hover:bg-[#1E3A5F]/20 transition-colors text-xs flex items-center gap-1.5"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                                        Edit
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Subjects table */}
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-sm">
                                                            <thead>
                                                                <tr className="bg-white text-gray-500 border-b border-gray-100">
                                                                    <th className="px-5 py-3 text-left font-semibold text-xs uppercase tracking-wider">#</th>
                                                                    <th className="px-5 py-3 text-left font-semibold text-xs uppercase tracking-wider">Subject Name</th>
                                                                    <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wider">Marks</th>
                                                                    <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wider">Total</th>
                                                                    {isEditing && <th className="px-5 py-3 text-center font-semibold text-xs uppercase tracking-wider">Remove</th>}
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-50">
                                                                {(isEditing ? editedSubs : resSubs).map((sub, si) => (
                                                                    <tr key={si} className="bg-white hover:bg-gray-50/50 transition-colors">
                                                                        <td className="px-5 py-3 text-gray-400 font-bold">{si + 1}</td>
                                                                        <td className="px-5 py-3">
                                                                            {isEditing ? (
                                                                                <input
                                                                                    type="text"
                                                                                    value={sub.subjectName}
                                                                                    onChange={(e) => {
                                                                                        const n = editedSubs.map((s, i) => i === si ? { ...s, subjectName: e.target.value } : s);
                                                                                        setEditedResults(prev => ({ ...prev, [result._id]: { subjects: n } }));
                                                                                    }}
                                                                                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none text-sm font-medium text-[#1E3A5F]"
                                                                                    placeholder="Subject Name"
                                                                                />
                                                                            ) : (
                                                                                <span className="font-bold text-[#1E3A5F]">{sub.subjectName}</span>
                                                                            )}
                                                                        </td>
                                                                        <td className="px-5 py-3 text-center">
                                                                            {isEditing ? (
                                                                                <input
                                                                                    type="number"
                                                                                    value={sub.marks}
                                                                                    onChange={(e) => {
                                                                                        const n = editedSubs.map((s, i) => i === si ? { ...s, marks: e.target.value } : s);
                                                                                        setEditedResults(prev => ({ ...prev, [result._id]: { subjects: n } }));
                                                                                    }}
                                                                                    className="w-24 px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none text-sm font-bold text-[#1E3A5F]"
                                                                                    min="0"
                                                                                />
                                                                            ) : (
                                                                                <span className="font-bold text-[#1E3A5F]">{sub.marks}</span>
                                                                            )}
                                                                        </td>
                                                                        <td className="px-5 py-3 text-center">
                                                                            {isEditing ? (
                                                                                <input
                                                                                    type="number"
                                                                                    value={sub.totalMarks}
                                                                                    onChange={(e) => {
                                                                                        const n = editedSubs.map((s, i) => i === si ? { ...s, totalMarks: parseInt(e.target.value) || 100 } : s);
                                                                                        setEditedResults(prev => ({ ...prev, [result._id]: { subjects: n } }));
                                                                                    }}
                                                                                    className="w-24 px-3 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F] outline-none text-sm font-medium text-gray-500"
                                                                                    min="1"
                                                                                />
                                                                            ) : (
                                                                                <span className="text-gray-500 font-medium">{sub.totalMarks}</span>
                                                                            )}
                                                                        </td>
                                                                        {isEditing && (
                                                                            <td className="px-5 py-3 text-center">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        if (editedSubs.length === 1) return;
                                                                                        const n = editedSubs.filter((_, i) => i !== si);
                                                                                        setEditedResults(prev => ({ ...prev, [result._id]: { subjects: n } }));
                                                                                    }}
                                                                                    disabled={editedSubs.length === 1}
                                                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors mx-auto"
                                                                                >
                                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                                                </button>
                                                                            </td>
                                                                        )}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    {/* Add subject — only in edit mode */}
                                                    {isEditing && (
                                                        <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100">
                                                            <button
                                                                onClick={() => {
                                                                    const n = [...editedSubs, { subjectName: '', marks: '', totalMarks: 100 }];
                                                                    setEditedResults(prev => ({ ...prev, [result._id]: { subjects: n } }));
                                                                }}
                                                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#1E3A5F] rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                                Add Subject
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Hidden Print/PDF Content */}
                                <div id="print-pdf-content" style={{ display: 'none' }}>
                                    <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
                                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>School Management System</h1>
                                        <h2 style={{ fontSize: '20px', color: '#6b7280', margin: '10px 0' }}>
                                            {selectedCard ? `Results for ${selectedCard.class} - ${selectedCard.section} (${selectedCard.examName})` : 'All Results Report'}
                                        </h2>
                                        <p style={{ fontSize: '14px', color: '#9ca3af' }}>Academic Year: {selectedCard ? selectedCard.academicYear : academicYear} | Generated on: {new Date().toLocaleDateString()}</p>
                                    </div>
                                    
                                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-around', backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '8px' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{results.length}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Students</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{results.filter(r => r.status === 'Pass').length}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Passed</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>{results.filter(r => r.status === 'Fail').length}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Failed</div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                                                {results.length > 0 ? (results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(2) : '0.00'}%
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>Average %</div>
                                        </div>
                                    </div>

                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginTop: '20px' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#3b82f6', color: 'white' }}>
                                                <th style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Roll</th>
                                                <th style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Student Name</th>
                                                <th style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Subject Name</th>
                                                <th style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Marks</th>
                                                <th style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Total Marks</th>
                                                <th style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>%</th>
                                                <th style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Grade</th>
                                                <th style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Status</th>
                                                {selectedCard && <th style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>Merit Position</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map((result, index) => {
                                                const pSubs = Array.isArray(result.subjects) && result.subjects.length ? result.subjects : [{ subjectName: 'N/A', marks: 'N/A', totalMarks: 'N/A' }];
                                                return pSubs.map((sub, si) => (
                                                    <tr key={`${index}-${si}`} style={{ backgroundColor: si > 0 ? '#f0f9ff' : (index % 2 === 0 ? '#f9fafb' : 'white') }}>
                                                        {si === 0 && (
                                                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle' }} rowSpan={pSubs.length}>{result.rollNumber}</td>
                                                        )}
                                                        {si === 0 && (
                                                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', verticalAlign: 'middle' }} rowSpan={pSubs.length}>{result.studentName}</td>
                                                        )}
                                                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{sub.subjectName}</td>
                                                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{sub.marks}</td>
                                                        <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{sub.totalMarks}</td>
                                                        {si === 0 && (
                                                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle' }} rowSpan={pSubs.length}>
                                                                {result.percentage}%
                                                                <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 'normal' }}>
                                                                    {result.totalObtained || ''}/{result.totalMarks || ''}
                                                                </div>
                                                            </td>
                                                        )}
                                                        {si === 0 && (
                                                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', verticalAlign: 'middle' }} rowSpan={pSubs.length}>
                                                                <span style={{
                                                                    padding: '4px 8px',
                                                                    borderRadius: '12px',
                                                                    fontWeight: 'bold',
                                                                    backgroundColor: result.grade === 'A+' ? '#d1fae5' : result.grade === 'A' ? '#dbeafe' : result.grade === 'F' ? '#fee2e2' : '#fef3c7',
                                                                    color: result.grade === 'A+' ? '#065f46' : result.grade === 'A' ? '#1e40af' : result.grade === 'F' ? '#991b1b' : '#92400e'
                                                                }}>
                                                                    {result.grade}
                                                                </span>
                                                            </td>
                                                        )}
                                                        {si === 0 && (
                                                            <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', verticalAlign: 'middle' }} rowSpan={pSubs.length}>
                                                                <span style={{
                                                                    padding: '4px 8px',
                                                                    borderRadius: '12px',
                                                                    fontWeight: 'bold',
                                                                    backgroundColor: result.status === 'Pass' ? '#d1fae5' : '#fee2e2',
                                                                    color: result.status === 'Pass' ? '#065f46' : '#991b1b'
                                                                }}>
                                                                    {result.status}
                                                                </span>
                                                            </td>
                                                        )}
                                                        {selectedCard && si === 0 && <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', verticalAlign: 'middle' }} rowSpan={pSubs.length}>{result.meritPosition || 'N/A'}</td>}
                                                    </tr>
                                                ));
                                            })}
                                        </tbody>
                                    </table>
                                    
                                    <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '10px', color: '#9ca3af' }}>
                                        <p>This report is generated by School Management System. For any queries, contact the administration.</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* Empty State */}
                {viewMode === 'view' && !selectedCard && classSectionCards.length === 0 && (
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-12 sm:p-16 text-center">
                        <div className="w-20 h-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-4 mx-auto border border-gray-100">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-[#1E3A5F] font-heading mb-2">No Results Found</h3>
                        <p className="text-gray-500">No results have been saved in the system yet</p>
                    </div>
                )}

                {viewMode === 'entry' && students.length === 0 && selectedClass && selectedSection && (
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-12 sm:p-16 text-center">
                        <div className="w-20 h-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-4 mx-auto border border-gray-100">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-[#1E3A5F] font-heading mb-2">No Students Found</h3>
                        <p className="text-gray-500">No active students in selected class and section</p>
                    </div>
                )}
            </div>
    );
};

export default MarksResultsPage;
