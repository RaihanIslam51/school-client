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
                    subjectName: '',
                    marks: '',
                    totalMarks: 100
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

    // Update subject name
    const updateSubjectName = (studentIndex, value) => {
        const updatedMarksData = [...marksData];
        updatedMarksData[studentIndex].subjectName = value;
        setMarksData(updatedMarksData);
    };

    // Update marks
    const updateMarks = (studentIndex, value) => {
        const updatedMarksData = [...marksData];
        updatedMarksData[studentIndex].marks = value;
        setMarksData(updatedMarksData);
    };

    // Update total marks
    const updateTotalMarks = (studentIndex, value) => {
        const updatedMarksData = [...marksData];
        updatedMarksData[studentIndex].totalMarks = parseInt(value) || 100;
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

    // Calculate student totals
    const calculateStudentTotal = (studentMarks) => {
        const marks = parseFloat(studentMarks.marks) || 0;
        const totalMarks = studentMarks.totalMarks;
        const percentage = totalMarks > 0 ? (marks / totalMarks) * 100 : 0;
        const grade = calculateGrade(percentage);
        const status = percentage >= 33 ? 'Pass' : 'Fail';
        
        return {
            totalObtained: marks.toFixed(2),
            totalMarks,
            percentage: percentage.toFixed(2),
            grade,
            status
        };
    };

    // Save results
    const saveResults = async () => {
        // Validate all fields are entered
        const invalidEntries = marksData.some(student =>
            student.subjectName === '' || student.marks === '' || student.marks === null
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
                subjects: [{
                    subjectName: student.subjectName,
                    marks: student.marks,
                    totalMarks: student.totalMarks
                }]
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
                Swal.fire('Success', 'Results saved successfully!', 'success');
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
                // Group results by class, section, examName, academicYear
                const grouped = data.data.reduce((acc, result) => {
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
                            averagePercentage: 0
                        };
                    }
                    acc[key].totalStudents += 1;
                    if (result.status === 'Pass') acc[key].passed += 1;
                    else acc[key].failed += 1;
                    acc[key].averagePercentage += result.percentage;
                    return acc;
                }, {});

                const cards = Object.values(grouped).map(card => ({
                    ...card,
                    averagePercentage: (card.averagePercentage / card.totalStudents).toFixed(2)
                }));

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

        // Data rows
        results.forEach(result => {
            const row = selectedCard
                ? [
                    result.rollNumber,
                    `"${result.studentName}"`,
                    result.subjects[0].subjectName,
                    result.subjects[0].marks,
                    result.subjects[0].totalMarks,
                    result.percentage + '%',
                    result.grade,
                    result.status,
                    result.meritPosition || 'N/A'
                ]
                : [
                    result.class,
                    result.section,
                    result.examName,
                    result.examType,
                    result.academicYear,
                    result.rollNumber,
                    `"${result.studentName}"`,
                    result.subjects[0].subjectName,
                    result.subjects[0].marks,
                    result.subjects[0].totalMarks,
                    result.percentage + '%',
                    result.grade,
                    result.status,
                    result.meritPosition || 'N/A'
                ];
            
            csvContent += row.join(',') + '\n';
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
                <style>
                    body { 
                        font-family: 'Arial', sans-serif; 
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
        <div className="min-h-screen bg-white p-2 sm:p-4 lg:p-6">
            <div className="container mx-auto container">
                {/* Header */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-blue-900">
                                📊 Marks & Results Management
                            </h1>
                            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Professional examination results management system</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => setViewMode('entry')}
                                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                                    viewMode === 'entry'
                                        ? 'bg-blue-900 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                📝 Entry Mode
                            </button>
                            <button
                                onClick={() => {
                                    fetchClassSectionCards();
                                    setViewMode('view');
                                    setSelectedCard(null);
                                }}
                                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                                    viewMode === 'view'
                                        ? 'bg-blue-900 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                👁️ View Results
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-blue-900 mb-4 sm:mb-6">🎯 Selection Criteria</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                        {/* Class Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Class</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                            >
                                <option value="">Select Class</option>
                                {classes.map((cls, index) => (
                                    <option key={index} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </div>

                        {/* Section Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Section</label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
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
                            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Exam Name</label>
                            <input
                                type="text"
                                value={examName}
                                onChange={(e) => setExamName(e.target.value)}
                                placeholder="e.g., First Terminal"
                                className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                            />
                        </div>

                        {/* Exam Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Exam Type</label>
                            <select
                                value={examType}
                                onChange={(e) => setExamType(e.target.value)}
                                className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
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
                            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Academic Year</label>
                            <input
                                type="text"
                                value={academicYear}
                                onChange={(e) => setAcademicYear(e.target.value)}
                                placeholder="2026"
                                className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                            />
                        </div>
                    </div>
                </div>

                {/* Entry Mode */}
                {viewMode === 'entry' && (
                    <>


                        {/* Marks Entry Table */}
                        {students.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                                    <h2 className="text-lg sm:text-xl font-bold text-blue-900">✍️ Marks Entry</h2>
                                    <button
                                        onClick={saveResults}
                                        disabled={loading}
                                        className="px-6 py-2 sm:px-8 sm:py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-all disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
                                    >
                                        {loading ? 'Saving...' : '💾 Save Results'}
                                    </button>
                                </div>

                                <div className="overflow-x-auto -mx-4 sm:mx-0">
                                    <div className="inline-block min-w-full align-middle">
                                        <table className="min-w-full border-collapse">
                                            <thead>
                                                <tr className="bg-blue-900 text-white">
                                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">Roll</th>
                                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">Student Name</th>
                                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">Subject Name</th>
                                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">Marks</th>
                                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">Total Marks</th>
                                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">%</th>
                                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">Grade</th>
                                                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {marksData.map((student, studentIndex) => {
                                                    const totals = calculateStudentTotal(student);
                                                    return (
                                                        <tr key={studentIndex} className="border-b hover:bg-blue-50 transition-colors">
                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold">{student.rollNumber}</td>
                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{student.studentName}</td>
                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                                <input
                                                                    type="text"
                                                                    value={student.subjectName}
                                                                    onChange={(e) => updateSubjectName(studentIndex, e.target.value)}
                                                                    className="w-full px-1 sm:px-2 py-1 border-2 border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                                                                    placeholder="Subject Name"
                                                                />
                                                            </td>
                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                                <input
                                                                    type="number"
                                                                    value={student.marks}
                                                                    onChange={(e) => updateMarks(studentIndex, e.target.value)}
                                                                    className="w-16 sm:w-20 px-1 sm:px-2 py-1 border-2 border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                                                                    min="0"
                                                                    max={student.totalMarks}
                                                                />
                                                            </td>
                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                                <input
                                                                    type="number"
                                                                    value={student.totalMarks}
                                                                    onChange={(e) => updateTotalMarks(studentIndex, e.target.value)}
                                                                    className="w-16 sm:w-20 px-1 sm:px-2 py-1 border-2 border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                                                                    min="1"
                                                                />
                                                            </td>
                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center font-bold text-xs sm:text-sm">{totals.percentage}%</td>
                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                                <span className={`px-1 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm ${
                                                                    totals.grade === 'A+' ? 'bg-green-100 text-green-800' :
                                                                    totals.grade === 'A' ? 'bg-blue-100 text-blue-800' :
                                                                    totals.grade === 'F' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                    {totals.grade}
                                                                </span>
                                                            </td>
                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                                <span className={`px-1 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm ${
                                                                    totals.status === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {totals.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
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
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                                    <h2 className="text-lg sm:text-xl font-bold text-blue-900">📚 Class & Section Results</h2>
                                    <button
                                        onClick={() => fetchResults()}
                                        className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-all text-sm sm:text-base w-full sm:w-auto"
                                    >
                                        🔍 View All Results
                                    </button>
                                </div>

                                {classSectionCards.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                        {classSectionCards.map((card, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleCardClick(card)}
                                                className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-all hover:border-blue-400"
                                            >
                                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                                    <h3 className="text-lg sm:text-xl font-bold text-blue-900">
                                                        {card.class} - {card.section}
                                                    </h3>
                                                    <div className="text-xl sm:text-2xl">📊</div>
                                                </div>
                                                
                                                <div className="space-y-1 sm:space-y-2">
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        <span className="font-semibold">Exam:</span> {card.examName}
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        <span className="font-semibold">Year:</span> {card.academicYear}
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        <span className="font-semibold">Students:</span> {card.totalStudents}
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        <span className="font-semibold">Passed:</span> {card.passed} | 
                                                        <span className="font-semibold"> Failed:</span> {card.failed}
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        <span className="font-semibold">Avg %:</span> {card.averagePercentage}%
                                                    </p>
                                                </div>
                                                
                                                <div className="mt-3 sm:mt-4 text-center">
                                                    <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors text-xs sm:text-sm">
                                                        View Details →
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 sm:py-12">
                                        <div className="text-4xl sm:text-6xl mb-4">📊</div>
                                        <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2">No Results Found</h3>
                                        <p className="text-gray-600 text-sm sm:text-base">No results have been saved in the system yet</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Detailed Results View with Edit Capability
                            <>
                                {/* Back Button */}
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                                    <button
                                        onClick={() => setSelectedCard(null)}
                                        className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all text-sm sm:text-base"
                                    >
                                        ← Back to Overview
                                    </button>
                                    <h2 className="text-lg sm:text-xl font-bold text-blue-900 mt-2 sm:mt-4">
                                        📋 Results for {selectedCard.class} - {selectedCard.section} ({selectedCard.examName})
                                    </h2>
                                </div>

                                {/* Action Buttons */}
                                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                                        <button
                                            onClick={exportToExcel}
                                            className="px-4 py-2 sm:px-6 sm:py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all text-sm sm:text-base w-full sm:w-auto"
                                        >
                                            📊 Export to Excel
                                        </button>
                                        <button
                                            onClick={downloadPDF}
                                            className="px-4 py-2 sm:px-6 sm:py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all text-sm sm:text-base w-full sm:w-auto"
                                        >
                                            📄 Download PDF
                                        </button>
                                        <button
                                            onClick={printResults}
                                            className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-all text-sm sm:text-base w-full sm:w-auto"
                                        >
                                            🖨️ Print Results
                                        </button>
                                    </div>
                                </div>

                                {/* Statistics Cards */}
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
                                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 sm:p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-xs sm:text-sm">Total Students</p>
                                                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">{results.length}</p>
                                            </div>
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded flex items-center justify-center">
                                                <span className="text-blue-900 text-lg sm:text-xl">👥</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 sm:p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-xs sm:text-sm">Passed</p>
                                                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">
                                                    {results.filter(r => r.status === 'Pass').length}
                                                </p>
                                            </div>
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded flex items-center justify-center">
                                                <span className="text-blue-900 text-lg sm:text-xl">✅</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 sm:p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-xs sm:text-sm">Failed</p>
                                                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">
                                                    {results.filter(r => r.status === 'Fail').length}
                                                </p>
                                            </div>
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded flex items-center justify-center">
                                                <span className="text-blue-900 text-lg sm:text-xl">❌</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 sm:p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-xs sm:text-sm">Average %</p>
                                                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">
                                                    {(results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(2)}%
                                                </p>
                                            </div>
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded flex items-center justify-center">
                                                <span className="text-blue-900 text-lg sm:text-xl">📈</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Editable Results Table */}
                                <div id="results-table-print" className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
                                    <h2 className="text-lg sm:text-xl font-bold text-blue-900 mb-4 sm:mb-6">✏️ Edit Results</h2>
                                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                                        <div className="inline-block min-w-full align-middle">
                                            <table className="min-w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-blue-900 text-white">
                                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">Roll</th>
                                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">Student Name</th>
                                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">Subject Name</th>
                                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">Marks</th>
                                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">Total Marks</th>
                                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">%</th>
                                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">Grade</th>
                                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">Status</th>
                                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {results.map((result, index) => (
                                                        <tr key={index} className="border-b hover:bg-blue-50 transition-colors">
                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold text-xs sm:text-sm">{result.rollNumber}</td>
                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm">{result.studentName}</td>
                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                                <input
                                                                    type="text"
                                                                    value={editedResults[result._id]?.subjectName ?? result.subjects[0].subjectName}
                                                                    onChange={(e) => setEditedResults(prev => ({
                                                                        ...prev,
                                                                        [result._id]: {
                                                                            ...prev[result._id],
                                                                            subjectName: e.target.value
                                                                        }
                                                                    }))}
                                                                    className="w-full px-1 sm:px-2 py-1 border-2 border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                                                                />
                                                            </td>
                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                                <input
                                                                    type="number"
                                                                    value={editedResults[result._id]?.marks ?? result.subjects[0].marks}
                                                                    onChange={(e) => setEditedResults(prev => ({
                                                                        ...prev,
                                                                        [result._id]: {
                                                                            ...prev[result._id],
                                                                            marks: e.target.value
                                                                        }
                                                                    }))}
                                                                    className="w-16 sm:w-20 px-1 sm:px-2 py-1 border-2 border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                                                                    min="0"
                                                                    max={editedResults[result._id]?.totalMarks ?? result.subjects[0].totalMarks}
                                                                />
                                                            </td>
                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                                <input
                                                                    type="number"
                                                                    value={editedResults[result._id]?.totalMarks ?? result.subjects[0].totalMarks}
                                                                    onChange={(e) => setEditedResults(prev => ({
                                                                        ...prev,
                                                                        [result._id]: {
                                                                            ...prev[result._id],
                                                                            totalMarks: parseInt(e.target.value) || 100
                                                                        }
                                                                    }))}
                                                                    className="w-16 sm:w-20 px-1 sm:px-2 py-1 border-2 border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                                                                    min="1"
                                                                />
                                                            </td>
                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center font-bold text-xs sm:text-sm">{result.percentage}%</td>
                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                                <span className={`px-1 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm ${
                                                                    result.grade === 'A+' ? 'bg-green-100 text-green-800' :
                                                                    result.grade === 'A' ? 'bg-blue-100 text-blue-800' :
                                                                    result.grade === 'F' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                    {result.grade}
                                                                </span>
                                                            </td>
                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                                <span className={`px-1 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm ${
                                                                    result.status === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {result.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                                                                <button 
                                                                    onClick={() => {
                                                                        const edited = editedResults[result._id];
                                                                        if (edited) {
                                                                            updateResult(result._id, {
                                                                                ...result,
                                                                                subjects: [{
                                                                                    subjectName: edited.subjectName || result.subjects[0].subjectName,
                                                                                    marks: edited.marks || result.subjects[0].marks,
                                                                                    totalMarks: edited.totalMarks || result.subjects[0].totalMarks
                                                                                }]
                                                                            });
                                                                        }
                                                                    }}
                                                                    className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors text-xs sm:text-sm"
                                                                >
                                                                    Update
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
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
                                            {results.map((result, index) => (
                                                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white' }}>
                                                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{result.rollNumber}</td>
                                                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{result.studentName}</td>
                                                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{result.subjects[0].subjectName}</td>
                                                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{result.subjects[0].marks}</td>
                                                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{result.subjects[0].totalMarks}</td>
                                                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{result.percentage}%</td>
                                                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>
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
                                                    <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>
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
                                                    {selectedCard && <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{result.meritPosition || 'N/A'}</td>}
                                                </tr>
                                            ))}
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
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 sm:p-12 text-center">
                        <div className="text-4xl sm:text-6xl mb-4">📊</div>
                        <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-2">No Results Found</h3>
                        <p className="text-gray-600 text-sm sm:text-base">No results have been saved in the system yet</p>
                    </div>
                )}

                {viewMode === 'entry' && students.length === 0 && selectedClass && selectedSection && (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 sm:p-12 text-center">
                        <div className="text-4xl sm:text-6xl mb-4">👥</div>
                        <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-2">No Students Found</h3>
                        <p className="text-gray-600 text-sm sm:text-base">No active students in selected class and section</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarksResultsPage;
