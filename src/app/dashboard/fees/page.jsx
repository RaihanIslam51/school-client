'use client';

import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { API_BASE_URL } from '../../../../config/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    variable: '--font-poppins',
});

// ─── Status Badge Helper ────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const map = {
        Paid: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        Partial: 'bg-blue-50 text-blue-700 border border-blue-200',
        Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    };
    return (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${map[status] || 'bg-slate-100 text-slate-600'}`}>
            {status}
        </span>
    );
};

const FeesManagementPage = () => {
    // ── State management (all original, untouched) ──────────────
    const [classes] = useState(['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']);
    const [sections] = useState(['A', 'B', 'C', 'D']);
    const [students, setStudents] = useState([]);
    const [feeRecords, setFeeRecords] = useState([]);
    const [statistics, setStatistics] = useState(null);

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [academicYear, setAcademicYear] = useState(new Date().getFullYear().toString());

    const [viewMode, setViewMode] = useState('collection');
    const [collectionMode, setCollectionMode] = useState('bulk');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedFees, setSelectedFees] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [paidAmount, setPaidAmount] = useState('');
    const [remarks, setRemarks] = useState('');

    const [loading, setLoading] = useState(false);
    const receiptRef = useRef(null);
    const [currentReceipt, setCurrentReceipt] = useState(null);
    const [recordFilter, setRecordFilter] = useState('unpaid');
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [partialEdit, setPartialEdit] = useState({ recordId: null, amount: '' });
    const [reportType, setReportType] = useState('monthly');
    const [reportStatusFilter, setReportStatusFilter] = useState('all');

    // ── Extra UI states ─────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('');
    const [feeTypeFilter, setFeeTypeFilter] = useState('');
    const [isCollectFeeModalOpen, setIsCollectFeeModalOpen] = useState(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // ── Fee category popup states ─────────────────────────────
    const [isFeePopupOpen, setIsFeePopupOpen] = useState(false);
    const [popupCategory, setPopupCategory] = useState(null);
    const [popupAmount, setPopupAmount] = useState('');
    const [popupDescription, setPopupDescription] = useState('');
    const [popupPaymentMethod, setPopupPaymentMethod] = useState('Cash');
    const [popupLoading, setPopupLoading] = useState(false);
    const popupAmountRef = useRef(null);

    // ── All-records (global) states ──────────────────────────────
    const [allRecords, setAllRecords] = useState([]);
    const [allRecordsLoading, setAllRecordsLoading] = useState(false);
    const [globalSearch, setGlobalSearch] = useState('');
    const [globalClassFilter, setGlobalClassFilter] = useState('');
    const [globalStatusFilter, setGlobalStatusFilter] = useState('');
    const [globalStats, setGlobalStats] = useState(null);

    // ── Modal collection states ─────────────────────────────────
    const [modalStudentId, setModalStudentId] = useState('bulk');
    const [modalSelectedFees, setModalSelectedFees] = useState([]);
    const [modalFeeCategory, setModalFeeCategory] = useState('');
    const [modalAmount, setModalAmount] = useState('');
    const [modalDescription, setModalDescription] = useState('');
    const [modalPaidAmount, setModalPaidAmount] = useState('');
    const [modalPaymentMethod, setModalPaymentMethod] = useState('Cash');
    const [modalRemarks, setModalRemarks] = useState('');

    // ── Edit modal states ───────────────────────────────────────
    const [editingRecord, setEditingRecord] = useState(null);
    const [editStatus, setEditStatus] = useState('Pending');
    const [editPaidAmount, setEditPaidAmount] = useState('');

    // ── Fee categories ──────────────────────────────────────────
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
        { name: 'Late Fine', defaultAmount: 100 },
    ];

    // ── Effects ─────────────────────────────────────────────────
    useEffect(() => { }, []);
    useEffect(() => { if (!selectedClass) setSelectedSection(''); }, [selectedClass]);
    useEffect(() => {
        if (selectedClass && selectedSection) {
            fetchStudents(); fetchFeeRecords(); fetchStatistics();
        } else { setStudents([]); setFeeRecords([]); }
    }, [selectedClass, selectedSection, academicYear, recordFilter]);

    // ── API helpers (all original) ──────────────────────────────
    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/fees/helpers/students?class=${selectedClass}&section=${selectedSection}`);
            const data = await res.json();
            if (data.success) setStudents(data.data);
        } catch (e) { console.error(e); Swal.fire('Error', 'Failed to load students', 'error'); }
        finally { setLoading(false); }
    };

    const fetchFeeRecords = async () => {
        try {
            const sp = recordFilter === 'paid' ? 'status=Paid'
                : recordFilter === 'unpaid' ? 'status=Pending,Partial'
                    : 'status=Paid,Pending,Partial';
            const res = await fetch(`${API_BASE_URL}/fees/class-section?class=${selectedClass}&section=${selectedSection}&academicYear=${academicYear}&${sp}`);
            const data = await res.json();
            if (data.success) {
                setFeeRecords(data.data.sort((a, b) => (parseInt(a.rollNumber) || 0) - (parseInt(b.rollNumber) || 0)));
                setSelectedRecords([]);
            }
        } catch (e) { console.error(e); }
    };

    const fetchStatistics = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/fees/statistics?class=${selectedClass}&section=${selectedSection}&academicYear=${academicYear}`);
            const data = await res.json();
            if (data.success) setStatistics(data.data);
        } catch (e) { console.error(e); }
    };

    // ── Fetch ALL fee records (no class/section filter) ──────────
    const fetchAllFeeRecords = async () => {
        try {
            setAllRecordsLoading(true);
            const res = await fetch(`${API_BASE_URL}/fees/class-section?status=Paid,Pending,Partial`);
            const data = await res.json();
            if (data.success) {
                setAllRecords(data.data.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)));
            }
        } catch (e) { console.error(e); }
        finally { setAllRecordsLoading(false); }
    };

    // ── Fetch global statistics (whole school, no filter) ────────
    const fetchGlobalStatistics = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/fees/statistics`);
            const data = await res.json();
            if (data.success) setGlobalStats(data.data);
        } catch (e) {
            console.error('Global stats fetch failed, will compute from records:', e);
        }
    };

    // ── Student selection ───────────────────────────────────────
    const toggleStudentSelection = (s) =>
        setSelectedStudents(prev => prev.some(p => p._id === s._id) ? prev.filter(p => p._id !== s._id) : [...prev, s]);
    const selectAllStudents = () => setSelectedStudents(students);
    const deselectAllStudents = () => setSelectedStudents([]);

    // ── Fee management ──────────────────────────────────────────
    const addFee = (category) => {
        setPopupCategory(category);
        setPopupAmount('');
        setPopupDescription('');
        setIsFeePopupOpen(true);
        setTimeout(() => { if (popupAmountRef.current) popupAmountRef.current.focus(); }, 80);
    };
    const confirmAndCollectFee = async () => {
        const amt = parseFloat(popupAmount);
        if (!popupAmount || isNaN(amt) || amt <= 0) {
            if (popupAmountRef.current) popupAmountRef.current.focus();
            return;
        }
        if (!selectedClass || !selectedSection) {
            Swal.fire({ title: 'Select Class & Section', text: 'Please select a class and section in the filter panel first.', icon: 'info', confirmButtonColor: '#1a2e5a' });
            return;
        }
        const toProcess = collectionMode === 'bulk' ? students : selectedStudents;
        if (toProcess.length === 0) {
            Swal.fire('No Students', collectionMode === 'bulk' ? 'No students found for this class/section.' : 'Please select at least one student first.', 'warning');
            return;
        }
        const feeEntry = { feeCategory: popupCategory.name, amount: amt, description: popupDescription || '' };
        const total = amt;
        const paid = amt; // default: fully paid
        try {
            setPopupLoading(true);
            const results = await Promise.all(
                (await Promise.all(
                    toProcess.map(s => fetch(`${API_BASE_URL}/fees`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            studentId: s._id,
                            studentName: s.name,
                            rollNumber: s.rollNumber,
                            class: selectedClass,
                            section: selectedSection,
                            academicYear,
                            fees: [feeEntry],
                            paidAmount: paid,
                            paymentMethod: popupPaymentMethod,
                            remarks: popupDescription || '',
                            collectedBy: 'Admin',
                            status: 'Paid',
                        }),
                    }))
                )).map(r => r.json())
            );
            if (results.every(r => r.success)) {
                setIsFeePopupOpen(false);
                setPopupAmount(''); setPopupDescription('');
                fetchFeeRecords(); fetchStatistics(); fetchAllFeeRecords();
                setViewMode('records');
                Swal.fire({ title: 'Fee Collected!', text: `${popupCategory.name} collected for ${toProcess.length} student${toProcess.length > 1 ? 's' : ''}!`, icon: 'success', confirmButtonColor: '#f5a623', timer: 2000, showConfirmButton: false });
            } else {
                throw new Error(`${results.filter(r => !r.success).length} collections failed`);
            }
        } catch (e) {
            console.error(e);
            Swal.fire('Error', e.message || 'Failed to collect fee', 'error');
        } finally {
            setPopupLoading(false);
        }
    };
    const removeFee = (i) => {
        const updated = selectedFees.filter((_, idx) => idx !== i);
        setSelectedFees(updated);
        setPaidAmount(updated.reduce((s, f) => s + f.amount, 0).toString());
    };
    const calculateTotals = () => {
        const total = selectedFees.reduce((s, f) => s + f.amount, 0);
        const paid = parseFloat(paidAmount) || 0;
        return { total: total.toFixed(2), paid: paid.toFixed(2), due: (total - paid).toFixed(2) };
    };

    // ── Collect fee (original) ──────────────────────────────────
    const collectFee = async () => {
        if (selectedFees.length === 0) { Swal.fire('Error', 'Please add at least one fee', 'error'); return; }
        const toProcess = collectionMode === 'bulk' ? students : selectedStudents;
        if (toProcess.length === 0) { Swal.fire('Error', 'Please select at least one student', 'error'); return; }
        const totals = calculateTotals();
        try {
            setLoading(true);
            const promises = toProcess.map(student => fetch(`${API_BASE_URL}/fees`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: student._id, studentName: student.name, rollNumber: student.rollNumber,
                    class: selectedClass, section: selectedSection, academicYear, fees: selectedFees,
                    paidAmount: parseFloat(totals.paid), paymentMethod, remarks, collectedBy: 'Admin', status: 'Pending'
                })
            }));
            const results = await Promise.all((await Promise.all(promises)).map(r => r.json()));
            if (results.every(r => r.success)) {
                Swal.fire('Success!', `Fees collected for ${toProcess.length} student${toProcess.length > 1 ? 's' : ''}!`, 'success');
                setSelectedFees([]); setPaidAmount(''); setRemarks(''); setSelectedStudents([]);
                fetchFeeRecords(); fetchStatistics(); setViewMode('records');
            } else throw new Error(`${results.filter(r => !r.success).length} fee collections failed`);
        } catch (e) { console.error(e); Swal.fire('Error', e.message || 'Failed to collect fees', 'error'); }
        finally { setLoading(false); }
    };

    // ── Receipt / PDF (original) ────────────────────────────────
    const printReceipt = (receipt) => {
        const w = window.open('', '_blank');
        w.document.write(generateReceiptHTML(receipt));
        w.document.close();
        w.onload = () => w.print();
    };
    const downloadReceiptPDF = async (receipt) => {
        Swal.fire({ title: 'Generating PDF...', text: 'Please wait', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const tmp = document.createElement('div');
        tmp.innerHTML = generateReceiptContentHTML(receipt);
        Object.assign(tmp.style, { position: 'absolute', left: '-9999px', width: '800px', backgroundColor: 'white', padding: '40px' });
        document.body.appendChild(tmp);
        try {
            const canvas = await html2canvas(tmp, { scale: 2, backgroundColor: '#ffffff' });
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
            pdf.save(`Receipt_${receipt.receiptNumber}.pdf`);
            Swal.close(); Swal.fire('Success', 'PDF downloaded successfully', 'success');
        } catch (e) { console.error(e); Swal.fire('Error', 'Failed to generate PDF', 'error'); }
        finally { document.body.removeChild(tmp); }
    };

    const generateReceiptContentHTML = (receipt) => {
        const t = { total: receipt.totalAmount.toFixed(2), paid: receipt.paidAmount.toFixed(2), due: receipt.dueAmount.toFixed(2) };
        return `<div style="font-family:'Poppins',Arial,sans-serif;max-width:800px;margin:0 auto;padding:40px;background:white;color:#111;">
<div style="text-align:center;border-bottom:2px solid #1a2e5a;padding-bottom:20px;margin-bottom:30px;">
<h1 style="color:#1a2e5a;margin:0;font-size:28px;font-weight:700;">School Management System</h1>
<p style="color:#6b7280;margin:8px 0 0;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Fee Payment Receipt</p></div>
<div style="display:flex;justify-content:space-between;margin-bottom:28px;font-size:13px;">
<div><p style="margin:4px 0"><strong>Receipt No:</strong> <span style="font-family:monospace">${receipt.receiptNumber}</span></p>
<p style="margin:4px 0"><strong>Date:</strong> ${new Date(receipt.paymentDate).toLocaleDateString()}</p>
<p style="margin:4px 0"><strong>Academic Year:</strong> ${receipt.academicYear}</p></div>
<div style="text-align:right"><p style="margin:4px 0"><strong>Payment Method:</strong> ${receipt.paymentMethod}</p>
<p style="margin:4px 0"><strong>Status:</strong> <span style="background:#e6f4ea;color:#137333;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;">${receipt.status}</span></p></div></div>
<div style="background:#f8fafc;padding:18px;border-radius:8px;margin-bottom:26px;border:1px solid #e2e8f0;font-size:13px;">
<h3 style="margin:0 0 12px;color:#1a2e5a;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;">Student Information</h3>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
<p style="margin:3px 0"><strong>Name:</strong> ${receipt.studentName}</p>
<p style="margin:3px 0"><strong>Roll No:</strong> ${receipt.rollNumber}</p>
<p style="margin:3px 0"><strong>Class:</strong> ${receipt.class}</p>
<p style="margin:3px 0"><strong>Section:</strong> ${receipt.section}</p></div></div>
<div style="margin-bottom:26px;"><h3 style="margin:0 0 12px;color:#1a2e5a;font-size:14px;font-weight:700;text-transform:uppercase;">Fee Details</h3>
<table style="width:100%;border-collapse:collapse;font-size:13px;">
<thead><tr style="background:#1a2e5a;color:#fff;"><th style="padding:10px 12px;text-align:left;">Fee Category</th><th style="padding:10px 12px;text-align:left;">Description</th><th style="padding:10px 12px;text-align:right;">Amount (৳)</th></tr></thead>
<tbody>${receipt.fees.map((f, i) => `<tr style="background:${i % 2 === 0 ? '#f8fafc' : '#fff'};border-bottom:1px solid #f1f5f9;"><td style="padding:10px 12px;font-weight:500;">${f.feeCategory}</td><td style="padding:10px 12px;color:#64748b;">${f.description || '—'}</td><td style="padding:10px 12px;text-align:right;font-weight:600;">৳${f.amount.toFixed(2)}</td></tr>`).join('')}</tbody></table></div>
<div style="background:#f8fafc;padding:18px;border-radius:8px;margin-bottom:26px;border:1px solid #e2e8f0;max-width:300px;margin-left:auto;font-size:13px;">
<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:#64748b;">Total Expected:</span><span style="font-weight:600;">৳ ${t.total}</span></div>
<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:#64748b;">Paid Amount:</span><span style="font-weight:600;color:#137333;">৳ ${t.paid}</span></div>
<div style="display:flex;justify-content:space-between;padding-top:10px;border-top:1px solid #e2e8f0;font-size:15px;font-weight:700;"><span style="color:#1a2e5a;">Balance Due:</span><span style="color:#c5221f;">৳ ${t.due}</span></div></div>
${receipt.remarks ? `<div style="margin-bottom:26px;padding:12px 16px;border-left:4px solid #f5a623;background:#fffbeb;border-radius:0 8px 8px 0;font-size:13px;"><strong>Remarks:</strong> ${receipt.remarks}</div>` : ''}
<div style="margin-top:50px;padding-top:18px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:flex-end;font-size:11px;">
<div><p style="margin:3px 0;color:#94a3b8;">Collected By: ${receipt.collectedBy || 'Admin'}</p><p style="margin:3px 0;color:#94a3b8;">Computer-generated receipt</p></div>
<div style="text-align:right;"><div style="border-top:1px solid #1a2e5a;padding-top:4px;width:180px;"><p style="margin:0;font-size:12px;color:#1a2e5a;font-weight:600;">Authorized Signature</p></div></div></div></div>`;
    };

    const generateReceiptHTML = (receipt) => `<!DOCTYPE html><html><head><title>Receipt ${receipt.receiptNumber}</title>
<style>body{margin:0;padding:20px;background:#fff;}@media print{body{padding:0;}button{display:none;}}</style></head>
<body>${generateReceiptContentHTML(receipt)}</body></html>`;

    const viewReceipt = (receipt) => { setCurrentReceipt(receipt); setIsReceiptModalOpen(true); };

    // ── Record selection ────────────────────────────────────────
    const toggleRecordSelection = (r) =>
        setSelectedRecords(prev => prev.some(p => p._id === r._id) ? prev.filter(p => p._id !== r._id) : [...prev, r]);
    const selectAllRecords = () => setSelectedRecords(feeRecords);
    const deselectAllRecords = () => setSelectedRecords([]);

    // ── Download report (original) ──────────────────────────────
    const downloadReport = async () => {
        if (feeRecords.length === 0) { Swal.fire('Error', 'No records to generate report', 'error'); return; }
        Swal.fire({ title: 'Generating Report...', text: 'Please wait', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const filtered = reportStatusFilter === 'all' ? feeRecords : feeRecords.filter(r => r.status === reportStatusFilter);
        if (filtered.length === 0) { Swal.close(); Swal.fire('No Data', `No ${reportStatusFilter} records found.`, 'warning'); return; }
        const rl = reportType === 'daily' ? 'Daily' : reportType === 'monthly' ? 'Monthly' : 'Yearly';
        const sl = reportStatusFilter === 'all' ? 'All' : reportStatusFilter;
        const totalExp = filtered.reduce((s, r) => s + (r.totalAmount || 0), 0);
        const totalCol = filtered.reduce((s, r) => s + (r.status === 'Pending' ? 0 : (r.paidAmount || 0)), 0);
        const totalDue = filtered.reduce((s, r) => s + (r.status === 'Pending' ? (r.totalAmount || 0) : Math.max(0, (r.totalAmount || 0) - (r.paidAmount || 0))), 0);
        const paidCnt = filtered.filter(r => r.status === 'Paid').length;
        const partCnt = filtered.filter(r => r.status === 'Partial').length;
        const pendCnt = filtered.filter(r => r.status === 'Pending').length;
        const uniqStu = [...new Set(filtered.map(r => r.studentName))].length;
        const byYear = {}; filtered.forEach(r => { const y = new Date(r.paymentDate).getFullYear(); if (!byYear[y]) byYear[y] = { total: 0, collected: 0, due: 0, paid: 0, partial: 0, pending: 0, count: 0 }; byYear[y].count++; byYear[y].total += r.totalAmount || 0; byYear[y].collected += r.status === 'Pending' ? 0 : (r.paidAmount || 0); byYear[y].due += r.status === 'Pending' ? (r.totalAmount || 0) : Math.max(0, (r.totalAmount || 0) - (r.paidAmount || 0)); if (r.status === 'Paid') byYear[y].paid++; else if (r.status === 'Partial') byYear[y].partial++; else byYear[y].pending++; });
        const byMonth = {}; filtered.forEach(r => { const d = new Date(r.paymentDate); const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; const label = d.toLocaleString('default', { month: 'long', year: 'numeric' }); if (!byMonth[key]) byMonth[key] = { label, total: 0, collected: 0, due: 0, paid: 0, partial: 0, pending: 0, count: 0 }; byMonth[key].count++; byMonth[key].total += r.totalAmount || 0; byMonth[key].collected += r.status === 'Pending' ? 0 : (r.paidAmount || 0); byMonth[key].due += r.status === 'Pending' ? (r.totalAmount || 0) : Math.max(0, (r.totalAmount || 0) - (r.paidAmount || 0)); if (r.status === 'Paid') byMonth[key].paid++; else if (r.status === 'Partial') byMonth[key].partial++; else byMonth[key].pending++; });
        const sortedMonths = Object.entries(byMonth).sort((a, b) => b[0].localeCompare(a[0]));
        const byDay = {}; filtered.forEach(r => { const d = new Date(r.paymentDate); const key = d.toISOString().split('T')[0]; const label = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }); if (!byDay[key]) byDay[key] = { label, total: 0, collected: 0, due: 0, paid: 0, partial: 0, pending: 0, count: 0 }; byDay[key].count++; byDay[key].total += r.totalAmount || 0; byDay[key].collected += r.status === 'Pending' ? 0 : (r.paidAmount || 0); byDay[key].due += r.status === 'Pending' ? (r.totalAmount || 0) : Math.max(0, (r.totalAmount || 0) - (r.paidAmount || 0)); if (r.status === 'Paid') byDay[key].paid++; else if (r.status === 'Partial') byDay[key].partial++; else byDay[key].pending++; });
        const sortedDays = Object.entries(byDay).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 30);
        const trs = (i) => `background:${i % 2 === 0 ? '#f9fafb' : '#fff'};`;
        const sb = (pa, pt, pe) => `<span style="background:#166534;color:#fff;padding:2px 7px;border-radius:10px;font-size:10px;margin-right:2px">${pa} Paid</span><span style="background:#92400e;color:#fff;padding:2px 7px;border-radius:10px;font-size:10px;margin-right:2px">${pt} Partial</span><span style="background:#6b7280;color:#fff;padding:2px 7px;border-radius:10px;font-size:10px">${pe} Pending</span>`;
        const hd = `<thead><tr style="background:#1a2e5a;color:#fff"><th style="padding:9px 11px;text-align:left">Period</th><th style="padding:9px 11px;text-align:center">Records</th><th style="padding:9px 11px;text-align:center">Status</th><th style="padding:9px 11px;text-align:right">Expected</th><th style="padding:9px 11px;text-align:right">Collected</th><th style="padding:9px 11px;text-align:right">Due</th></tr></thead>`;
        const bdr = (e) => e.map(([, d], i) => `<tr style="${trs(i)}"><td style="padding:8px 11px;font-weight:600">${d.label}</td><td style="padding:8px 11px;text-align:center">${d.count}</td><td style="padding:8px 11px;text-align:center">${sb(d.paid, d.partial, d.pending)}</td><td style="padding:8px 11px;text-align:right">৳${d.total.toFixed(2)}</td><td style="padding:8px 11px;text-align:right;color:#15803d;font-weight:600">৳${d.collected.toFixed(2)}</td><td style="padding:8px 11px;text-align:right;color:#dc2626;font-weight:600">৳${d.due.toFixed(2)}</td></tr>`).join('');
        const ys = reportType === 'yearly' ? `<h3 style="margin:0 0 8px;font-size:15px;color:#1a2e5a;font-weight:700">Yearly Breakdown</h3><table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:12px">${hd}<tbody>${bdr(Object.entries(byYear).sort((a, b) => b[0] - a[0]).map(([yr, d]) => [yr, { ...d, label: yr }]))}</tbody></table>` : '';
        const ms = reportType === 'monthly' ? `<h3 style="margin:0 0 8px;font-size:15px;color:#1a2e5a;font-weight:700">Monthly Breakdown</h3><table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:12px">${hd}<tbody>${bdr(sortedMonths)}</tbody></table>` : '';
        const ds = reportType === 'daily' ? `<h3 style="margin:0 0 8px;font-size:15px;color:#1a2e5a;font-weight:700">Daily Breakdown (Recent ${sortedDays.length} Days)</h3><table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:12px">${hd}<tbody>${bdr(sortedDays)}</tbody></table>` : '';
        const html = `<div style="font-family:'Poppins',Arial,sans-serif;max-width:900px;margin:0 auto;padding:30px;background:#fff;color:#1a202c">
<div style="text-align:center;border-bottom:2px solid #1a2e5a;padding-bottom:16px;margin-bottom:22px"><h1 style="margin:0;font-size:26px;color:#1a2e5a;font-weight:700">School Management System</h1><h2 style="margin:5px 0 0;font-size:17px;color:#334155;font-weight:600">Fee Collection Report — ${rl} | Status: ${sl}</h2><p style="margin:3px 0 0;font-size:12px;color:#6b7280">Generated: ${new Date().toLocaleString()} | Class: ${selectedClass} | Section: ${selectedSection} | Year: ${academicYear}</p></div>
<h3 style="margin:0 0 10px;font-size:15px;color:#1a2e5a;font-weight:700">Overall Summary</h3>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:24px">
<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;text-align:center"><p style="margin:0;font-size:11px;color:#64748b">Total Students</p><p style="margin:3px 0 0;font-size:24px;font-weight:700;color:#1e293b">${uniqStu}</p></div>
<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;text-align:center"><p style="margin:0;font-size:11px;color:#64748b">Total Records</p><p style="margin:3px 0 0;font-size:24px;font-weight:700;color:#1e293b">${filtered.length}</p><p style="margin:3px 0 0;font-size:10px">${sb(paidCnt, partCnt, pendCnt)}</p></div>
<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;text-align:center"><p style="margin:0;font-size:11px;color:#64748b">Total Expected</p><p style="margin:3px 0 0;font-size:20px;font-weight:700;color:#1e293b">৳${totalExp.toFixed(2)}</p></div>
<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px;text-align:center"><p style="margin:0;font-size:11px;color:#166534">Total Collected</p><p style="margin:3px 0 0;font-size:20px;font-weight:700;color:#166534">৳${totalCol.toFixed(2)}</p></div>
<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px;text-align:center"><p style="margin:0;font-size:11px;color:#991b1b">Total Due</p><p style="margin:3px 0 0;font-size:20px;font-weight:700;color:#991b1b">৳${totalDue.toFixed(2)}</p></div>
<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;text-align:center"><p style="margin:0;font-size:11px;color:#64748b">Collection Rate</p><p style="margin:3px 0 0;font-size:20px;font-weight:700;color:#0f172a">${totalExp > 0 ? ((totalCol / totalExp) * 100).toFixed(1) : 0}%</p></div></div>
${ys}${ms}${ds}
<h3 style="margin:0 0 8px;font-size:15px;color:#1a2e5a;font-weight:700">Student-wise Fee Detail</h3>
<table style="width:100%;border-collapse:collapse;font-size:11px"><thead><tr style="border-bottom:2px solid #1a2e5a;color:#1a2e5a;font-weight:700"><th style="padding:8px 9px;text-align:left">#</th><th style="padding:8px 9px;text-align:left">Student</th><th style="padding:8px 9px;text-align:left">Roll</th><th style="padding:8px 9px;text-align:left">Receipt No</th><th style="padding:8px 9px;text-align:left">Date</th><th style="padding:8px 9px;text-align:right">Total</th><th style="padding:8px 9px;text-align:right">Paid</th><th style="padding:8px 9px;text-align:right">Due</th><th style="padding:8px 9px;text-align:center">Status</th></tr></thead><tbody>${filtered.map((r, i) => { const due = r.status === 'Pending' ? r.totalAmount : Math.max(0, r.totalAmount - r.paidAmount); const paid = r.status === 'Pending' ? 0 : r.paidAmount; const bc = r.status === 'Paid' ? '#e6f4ea' : r.status === 'Partial' ? '#fef7e0' : '#fce8e6'; const tc = r.status === 'Paid' ? '#137333' : r.status === 'Partial' ? '#b06000' : '#c5221f'; return `<tr style="${trs(i)}"><td style="padding:7px 9px">${i + 1}</td><td style="padding:7px 9px;font-weight:600">${r.studentName}</td><td style="padding:7px 9px">${r.rollNumber}</td><td style="padding:7px 9px;font-family:monospace">${r.receiptNumber}</td><td style="padding:7px 9px">${new Date(r.paymentDate).toLocaleDateString()}</td><td style="padding:7px 9px;text-align:right">৳${r.totalAmount.toFixed(2)}</td><td style="padding:7px 9px;text-align:right;color:#137333;font-weight:600">৳${paid.toFixed(2)}</td><td style="padding:7px 9px;text-align:right;color:#c5221f;font-weight:600">৳${due.toFixed(2)}</td><td style="padding:7px 9px;text-align:center"><span style="background:${bc};color:${tc};padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600">${r.status}</span></td></tr>`; }).join('')}</tbody></table>
<div style="margin-top:30px;padding-top:12px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:10px;color:#94a3b8"><span>School Management System — Fee Collection Report</span><span>Generated: ${new Date().toLocaleString()}</span></div></div>`;
        const tmp = document.createElement('div');
        tmp.innerHTML = html; tmp.style.position = 'absolute'; tmp.style.left = '-9999px'; tmp.style.width = '950px'; tmp.style.backgroundColor = 'white';
        document.body.appendChild(tmp);
        try {
            const canvas = await html2canvas(tmp, { scale: 1.5, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const iw = 210, ih = (canvas.height * 210) / canvas.width;
            let y = 0, rem = ih, first = true;
            while (rem > 0) { if (!first) pdf.addPage(); pdf.addImage(imgData, 'PNG', 0, -y, iw, ih); y += 297; rem -= 297; first = false; }
            pdf.save(`FeeReport_${selectedClass}_${selectedSection}_${academicYear}_${Date.now()}.pdf`);
            Swal.close(); Swal.fire('Success', 'Report downloaded successfully!', 'success');
        } catch (e) { console.error(e); Swal.fire('Error', 'Failed to generate report', 'error'); }
        finally { document.body.removeChild(tmp); }
    };

    // ── Status update (original) ────────────────────────────────
    const handleStatusChange = (record, newStatus) => {
        if (newStatus === 'Partial') setPartialEdit({ recordId: record._id, amount: record.paidAmount?.toString() || '' });
        else { setPartialEdit({ recordId: null, amount: '' }); updateFeeStatus(record._id, newStatus, null); }
    };
    const updateFeeStatus = async (id, newStatus, newPaidAmount) => {
        try {
            const body = { status: newStatus };
            if (newStatus === 'Partial' && newPaidAmount !== null && newPaidAmount !== '') {
                const paid = parseFloat(newPaidAmount);
                if (isNaN(paid) || paid <= 0) { Swal.fire('Error', 'Please enter a valid paid amount', 'error'); return; }
                body.paidAmount = paid;
            }
            const res = await fetch(`${API_BASE_URL}/fees/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const data = await res.json();
            if (data.success) {
                setFeeRecords(prev => prev.map(r => r._id === id ? { ...r, status: newStatus, ...(body.paidAmount !== undefined ? { paidAmount: body.paidAmount, dueAmount: r.totalAmount - body.paidAmount } : {}) } : r));
                setPartialEdit({ recordId: null, amount: '' }); fetchStatistics();
            } else Swal.fire('Error', data.message || 'Failed to update status', 'error');
        } catch (e) { console.error(e); Swal.fire('Error', 'Failed to update status', 'error'); }
    };

    // ── Delete (original) ───────────────────────────────────────
    const deleteSelectedRecords = async () => {
        if (selectedRecords.length === 0) { Swal.fire('Error', 'Please select at least one record', 'error'); return; }
        const r = await Swal.fire({ title: 'Are you sure?', text: `Delete ${selectedRecords.length} record${selectedRecords.length > 1 ? 's' : ''}? Cannot be undone!`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280', confirmButtonText: 'Yes, delete!' });
        if (!r.isConfirmed) return;
        try {
            setLoading(true);
            const results = await Promise.all((await Promise.all(selectedRecords.map(rec => fetch(`${API_BASE_URL}/fees/${rec._id}`, { method: 'DELETE' })))).map(r => r.json()));
            if (results.every(r => r.success)) { Swal.fire('Deleted!', `${selectedRecords.length} record${selectedRecords.length > 1 ? 's' : ''} deleted.`, 'success'); setSelectedRecords([]); fetchFeeRecords(); fetchStatistics(); }
            else throw new Error(`${results.filter(r => !r.success).length} deletions failed`);
        } catch (e) { console.error(e); Swal.fire('Error', e.message || 'Failed to delete records', 'error'); }
        finally { setLoading(false); }
    };
    const deleteSingleRecord = async (record) => {
        const r = await Swal.fire({ title: 'Delete Fee Record?', text: `Delete receipt #${record.receiptNumber} for ${record.studentName}? Irreversible!`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280', confirmButtonText: 'Yes, delete it!' });
        if (!r.isConfirmed) return;
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/fees/${record._id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) { Swal.fire('Deleted!', 'Fee record deleted.', 'success'); fetchFeeRecords(); fetchStatistics(); }
            else Swal.fire('Error', data.message || 'Failed to delete record', 'error');
        } catch (e) { console.error(e); Swal.fire('Error', 'Failed to delete record', 'error'); }
        finally { setLoading(false); }
    };

    // ── Modal helpers ───────────────────────────────────────────
    const openCollectModal = () => {
        if (!selectedClass || !selectedSection) { Swal.fire({ title: 'Selection Required', text: 'Please select a Class and Section first.', icon: 'info', confirmButtonColor: '#1a2e5a' }); return; }
        setModalStudentId('bulk'); setModalSelectedFees([]); setModalPaidAmount(''); setModalRemarks(''); setIsCollectFeeModalOpen(true);
    };
    const handleModalAddFee = () => {
        if (!modalFeeCategory) { Swal.fire('Error', 'Please select a fee category', 'error'); return; }
        const amt = parseFloat(modalAmount);
        if (isNaN(amt) || amt <= 0) { Swal.fire('Error', 'Please enter a valid fee amount', 'error'); return; }
        const updated = [...modalSelectedFees, { feeCategory: modalFeeCategory, amount: amt, description: modalDescription || '' }];
        setModalSelectedFees(updated);
        setModalPaidAmount(updated.reduce((s, f) => s + f.amount, 0).toString());
        setModalFeeCategory(''); setModalAmount(''); setModalDescription('');
    };
    const handleModalRemoveFee = (i) => {
        const updated = modalSelectedFees.filter((_, idx) => idx !== i);
        setModalSelectedFees(updated);
        setModalPaidAmount(updated.reduce((s, f) => s + f.amount, 0).toString());
    };
    const handleModalCollectFee = async (e) => {
        e.preventDefault();
        if (modalSelectedFees.length === 0) { Swal.fire('Error', 'Please add at least one fee category first', 'error'); return; }
        const toProcess = modalStudentId === 'bulk' ? students : students.filter(s => s._id === modalStudentId);
        if (toProcess.length === 0) { Swal.fire('Error', 'No students found', 'error'); return; }
        const total = modalSelectedFees.reduce((s, f) => s + f.amount, 0);
        const paid = parseFloat(modalPaidAmount) || 0;
        try {
            setLoading(true);
            const results = await Promise.all((await Promise.all(toProcess.map(s => fetch(`${API_BASE_URL}/fees`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId: s._id, studentName: s.name, rollNumber: s.rollNumber, class: selectedClass, section: selectedSection, academicYear, fees: modalSelectedFees, paidAmount: paid, paymentMethod: modalPaymentMethod, remarks: modalRemarks, collectedBy: 'Admin', status: paid === total ? 'Paid' : paid > 0 ? 'Partial' : 'Pending' })
            })))).map(r => r.json()));
            if (results.every(r => r.success)) {
                Swal.fire({ title: 'Fees Collected!', text: `Collected for ${toProcess.length} student${toProcess.length > 1 ? 's' : ''}!`, icon: 'success', confirmButtonColor: '#f5a623' });
                setModalSelectedFees([]); setModalPaidAmount(''); setModalRemarks(''); setModalStudentId('bulk'); setIsCollectFeeModalOpen(false);
                fetchFeeRecords(); fetchStatistics(); setViewMode('records');
            } else throw new Error(`${results.filter(r => !r.success).length} collections failed`);
        } catch (e) { console.error(e); Swal.fire('Error', e.message || 'Failed to collect fees', 'error'); }
        finally { setLoading(false); }
    };
    const openEditRecordModal = (record) => { setEditingRecord(record); setEditStatus(record.status); setEditPaidAmount(record.paidAmount?.toString() || ''); setIsEditModalOpen(true); };
    const handleSaveEditModal = async (e) => {
        e.preventDefault();
        if (!editingRecord) return;
        try {
            setLoading(true);
            const body = { status: editStatus };
            if (editStatus === 'Partial') { const p = parseFloat(editPaidAmount); if (isNaN(p) || p <= 0) { Swal.fire('Error', 'Please enter a valid paid amount', 'error'); return; } body.paidAmount = p; }
            else if (editStatus === 'Paid') body.paidAmount = editingRecord.totalAmount;
            else if (editStatus === 'Pending') body.paidAmount = 0;
            const res = await fetch(`${API_BASE_URL}/fees/${editingRecord._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const data = await res.json();
            if (data.success) {
                setFeeRecords(prev => prev.map(r => r._id === editingRecord._id ? { ...r, status: editStatus, paidAmount: body.paidAmount, dueAmount: r.totalAmount - body.paidAmount } : r));
                setIsEditModalOpen(false); fetchStatistics(); Swal.fire({ title: 'Updated!', text: 'Fee status updated successfully.', icon: 'success', confirmButtonColor: '#1a2e5a' });
            } else Swal.fire('Error', data.message || 'Failed to update record', 'error');
        } catch (e) { console.error(e); Swal.fire('Error', 'Failed to update record', 'error'); }
        finally { setLoading(false); }
    };

    // ── Derived values ──────────────────────────────────────────
    const filteredFeeRecords = feeRecords.filter(r => {
        const matchSearch = searchQuery ? (r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || r.rollNumber.toString().includes(searchQuery) || r.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase())) : true;
        const matchType = feeTypeFilter ? r.fees.some(f => f.feeCategory === feeTypeFilter) : true;
        return matchSearch && matchType;
    });
    const totalCollectedUI = feeRecords.reduce((s, r) => s + (r.status === 'Pending' ? 0 : (r.paidAmount || 0)), 0);
    const totalExpectedUI = feeRecords.reduce((s, r) => s + (r.totalAmount || 0), 0);
    const totalDueUI = feeRecords.reduce((s, r) => s + (r.status === 'Pending' ? (r.totalAmount || 0) : Math.max(0, (r.totalAmount || 0) - (r.paidAmount || 0))), 0);

    // ── RENDER ──────────────────────────────────────────────────
    return (
        <div className={`${poppins.variable} font-[family-name:var(--font-poppins)] bg-[#f4f6f9]`}>

            {/* ── Top Header Bar ── */}
            <div className="bg-[#1a2e5a] px-4 sm:px-6 lg:px-8 py-4 shadow-lg">
                <div className="container mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Fee Management</h1>
                        <p className="text-blue-200 text-xs sm:text-sm font-medium mt-0.5">Professional fee collection &amp; real-time receipt ledgers</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Tab Switcher */}
                        <div className="bg-[#0f1e3d] border border-blue-800 rounded-xl p-1 flex">
                            {[['collection', 'Collect Fee'], ['records', 'Fee Records']].map(([mode, label]) => (
                                <button key={mode} onClick={() => {
                                    setViewMode(mode);
                                    if (mode === 'records') fetchAllFeeRecords();
                                }}
                                    className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${viewMode === mode ? 'bg-white text-[#1a2e5a] shadow' : 'text-blue-200 hover:text-white'}`}>
                                    {label}
                                </button>
                            ))}
                        </div>
                        {/* Gold CTA */}
                        <button onClick={openCollectModal}
                            className="bg-[#f5a623] hover:bg-[#e0951a] active:bg-[#c97f10] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 transform hover:-translate-y-0.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                            Add Fee / Collect Fee
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                {/* ── Summary Stats Row (always visible, shows global data by default) ── */}
                {(() => {
                    // Use class-specific stats if available, otherwise fall back to global or computed
                    const activeStats = statistics || globalStats;
                    const activeRecords = (selectedClass && selectedSection) ? feeRecords : allRecords;
                    const dispCollected = activeStats?.totalCollected
                        ?? activeRecords.reduce((s, r) => s + (r.status === 'Pending' ? 0 : (r.paidAmount || 0)), 0);
                    const dispExpected = activeStats
                        ? (activeStats.totalAmount ?? (activeStats.totalCollected + activeStats.totalDue))
                        : activeRecords.reduce((s, r) => s + (r.totalAmount || 0), 0);
                    const dispDue = activeRecords.reduce((s, r) => s + (r.status === 'Pending' ? (r.totalAmount || 0) : Math.max(0, (r.totalAmount || 0) - (r.paidAmount || 0))), 0);
                    const dispLedgers = activeStats?.totalRecords ?? activeRecords.length;
                    const isGlobal = !statistics;
                    return (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Global badge when no class selected */}
                            {isGlobal && (
                                <div className="col-span-2 lg:col-span-4 flex items-center gap-2 bg-[#1a2e5a]/5 border border-[#1a2e5a]/10 rounded-xl px-4 py-2">
                                    <span className="text-[#1a2e5a] text-[11px] font-bold">🌐 Showing school-wide totals</span>
                                    <span className="text-slate-400 text-[10px]">— Select a Class &amp; Section above for class-specific stats</span>
                                </div>
                            )}
                            {[
                                { label: 'Total Collected', value: `৳${Math.round(dispCollected).toLocaleString()}`, sub: isGlobal ? 'All classes, all time' : 'Cleared payments', icon: '💵', accent: 'emerald' },
                                { label: 'Total Expected', value: `৳${Math.round(dispExpected).toLocaleString()}`, sub: isGlobal ? 'School-wide billing sum' : 'Academic billing sum', icon: '📋', accent: 'indigo' },
                                { label: 'Total Outstanding', value: `৳${Math.round(dispDue).toLocaleString()}`, sub: isGlobal ? 'All pending / partial' : 'Pending / partial', icon: '⚠️', accent: 'rose' },
                                { label: 'Total Ledgers', value: dispLedgers.toLocaleString(), sub: isGlobal ? 'Total fee entries' : 'Active entries', icon: '📊', accent: 'amber' },
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
                    );
                })()}

                {/* ── Filter Panel ── */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-[#1a2e5a] to-[#2b4b8c] px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" /></svg>
                            <span className="text-white font-bold text-sm">Fee Dashboard Filter</span>
                        </div>
                        {(!selectedClass || !selectedSection) && (
                            <span className="bg-amber-400/20 text-amber-200 border border-amber-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                ⚠ Selection Required
                            </span>
                        )}
                        {selectedClass && selectedSection && (
                            <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                ✓ {selectedClass} — Sec {selectedSection} / {academicYear}
                            </span>
                        )}
                    </div>
                    <div className="p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { label: '🏫 Class', value: selectedClass, setter: setSelectedClass, options: classes, disabled: false, placeholder: 'Select Class' },
                                { label: '🔠 Section', value: selectedSection, setter: setSelectedSection, options: sections, disabled: !selectedClass, placeholder: 'Select Section' },
                            ].map(({ label, value, setter, options, disabled, placeholder }) => (
                                <div key={label}>
                                    <label className="block text-xs font-bold text-[#1a2e5a] uppercase tracking-wider mb-2">{label}</label>
                                    <select value={value} onChange={e => setter(e.target.value)} disabled={disabled}
                                        className="w-full bg-[#f8fafc] border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl px-3 py-2.5 text-sm text-[#1a2e5a] font-semibold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                        <option value="">{placeholder}</option>
                                        {options.map((o, i) => <option key={i} value={o}>{o}</option>)}
                                    </select>
                                </div>
                            ))}
                            <div>
                                <label className="block text-xs font-bold text-[#1a2e5a] uppercase tracking-wider mb-2">📅 Academic Year</label>
                                <input type="text" value={academicYear} onChange={e => setAcademicYear(e.target.value)} placeholder="e.g. 2026"
                                    className="w-full bg-[#f8fafc] border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl px-3 py-2.5 text-sm text-[#1a2e5a] font-bold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all duration-200" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Empty State — only for Collection view ── */}
                {viewMode === 'collection' && (!selectedClass || !selectedSection) && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 px-8 text-center">
                        <div className="text-5xl mb-4">🎯</div>
                        <h3 className="text-lg font-bold text-[#1a2e5a] mb-2">Select Class &amp; Section to Begin</h3>
                        <p className="text-slate-400 text-sm max-w-md mx-auto">Use the filter panel above to load students, fee records, and live statistics for your selected class.</p>
                    </div>
                )}

                {/* ── Loading State ── */}
                {loading && selectedClass && selectedSection && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-10 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-[#1a2e5a] border-t-transparent rounded-full animate-spin mb-3" />
                        <p className="text-slate-500 text-sm font-medium">Loading data...</p>
                    </div>
                )}

                {/* ── Global All-Records View (no class/section needed) ── */}
                {viewMode === 'records' && (!selectedClass || !selectedSection) && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {/* Top bar */}
                        <div className="bg-[#f8fafc] border-b border-slate-100 px-5 py-3 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-bold text-[#1a2e5a]">All Fee Records</h2>
                                <p className="text-slate-400 text-[10px] mt-0.5">{allRecords.length} total entries across all classes</p>
                            </div>
                            <button onClick={fetchAllFeeRecords} disabled={allRecordsLoading}
                                className="bg-[#1a2e5a] hover:bg-[#2b4b8c] disabled:opacity-50 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all">
                                🔄 Refresh
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-col md:flex-row items-center gap-3">
                            <div className="relative w-full md:flex-1">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg>
                                <input type="text" value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} placeholder="Search by name, roll, receipt number…"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1a2e5a] font-medium outline-none focus:ring-2 focus:ring-[#1a2e5a]/20 focus:border-[#1a2e5a] focus:bg-white transition-all" />
                            </div>
                            <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
                                <select value={globalClassFilter} onChange={e => setGlobalClassFilter(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#1a2e5a] outline-none focus:ring-2 focus:ring-[#1a2e5a]/20">
                                    <option value="">All Classes</option>
                                    {classes.map((c, i) => <option key={i} value={c}>{c}</option>)}
                                </select>
                                <select value={globalStatusFilter} onChange={e => setGlobalStatusFilter(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#1a2e5a] outline-none focus:ring-2 focus:ring-[#1a2e5a]/20">
                                    <option value="">All Status</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Partial">Partial</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                        </div>

                        {/* Loading */}
                        {allRecordsLoading && (
                            <div className="py-12 text-center">
                                <div className="inline-block w-8 h-8 border-4 border-[#1a2e5a] border-t-transparent rounded-full animate-spin mb-3" />
                                <p className="text-slate-400 text-sm">Loading all records…</p>
                            </div>
                        )}

                        {!allRecordsLoading && (() => {
                            const filtered = allRecords.filter(r => {
                                const q = globalSearch.toLowerCase();
                                const matchSearch = !globalSearch || (r.studentName.toLowerCase().includes(q) || r.rollNumber.toString().includes(q) || (r.receiptNumber || '').toLowerCase().includes(q));
                                const matchClass = !globalClassFilter || r.class === globalClassFilter;
                                const matchStatus = !globalStatusFilter || r.status === globalStatusFilter;
                                return matchSearch && matchClass && matchStatus;
                            });
                            if (filtered.length === 0) return (
                                <div className="py-16 text-center">
                                    <p className="text-slate-300 text-4xl mb-3">📋</p>
                                    <p className="text-slate-400 text-sm font-medium">No records found. {allRecords.length === 0 ? 'Click Refresh to load all records.' : 'Try adjusting your filters.'}</p>
                                    {allRecords.length === 0 && <button onClick={fetchAllFeeRecords} className="mt-3 bg-[#1a2e5a] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#2b4b8c] transition-all">Load All Records</button>}
                                </div>
                            );
                            return (<>
                                {/* Summary strip */}
                                <div className="px-5 py-3 bg-[#1a2e5a]/5 border-b border-slate-100 flex flex-wrap gap-4 items-center text-xs font-semibold text-slate-600">
                                    <span className="text-slate-500">Showing <span className="text-[#1a2e5a] font-extrabold">{filtered.length}</span> of {allRecords.length} records</span>
                                    <span>Total: <span className="text-[#1a2e5a] font-extrabold">৳{filtered.reduce((s, r) => s + (r.totalAmount || 0), 0).toFixed(2)}</span></span>
                                    <span>Collected: <span className="text-emerald-600 font-extrabold">৳{filtered.reduce((s, r) => s + (r.status === 'Pending' ? 0 : (r.paidAmount || 0)), 0).toFixed(2)}</span></span>
                                    <span>Due: <span className="text-rose-600 font-extrabold">৳{filtered.reduce((s, r) => s + (r.status === 'Pending' ? (r.totalAmount || 0) : Math.max(0, (r.totalAmount || 0) - (r.paidAmount || 0))), 0).toFixed(2)}</span></span>
                                </div>
                                {/* Desktop table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="bg-[#1a2e5a] text-white text-xs font-semibold">
                                                {['Receipt No', 'Student', 'Roll', 'Class', 'Sec', 'Fee Type', 'Total (৳)', 'Paid (৳)', 'Due (৳)', 'Date', 'Status', 'Actions'].map(h => (
                                                    <th key={h} className="px-4 py-3.5 whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 font-medium">
                                            {filtered.map((record, idx) => {
                                                const due = record.status === 'Pending' ? record.totalAmount : Math.max(0, record.totalAmount - record.paidAmount);
                                                const paid = record.status === 'Pending' ? 0 : record.paidAmount;
                                                return (
                                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-4 py-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">{record.receiptNumber}</td>
                                                        <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{record.studentName}</td>
                                                        <td className="px-4 py-3 text-slate-600">{record.rollNumber}</td>
                                                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{record.class}</td>
                                                        <td className="px-4 py-3 text-slate-500">{record.section}</td>
                                                        <td className="px-4 py-3 text-[11px] text-slate-400 max-w-[110px] truncate">{record.fees?.map(f => f.feeCategory).join(', ')}</td>
                                                        <td className="px-4 py-3 text-right font-bold text-slate-800">৳{record.totalAmount?.toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-right font-bold text-emerald-600">৳{paid.toFixed(2)}</td>
                                                        <td className={`px-4 py-3 text-right font-bold ${due > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>৳{due.toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{new Date(record.paymentDate).toLocaleDateString()}</td>
                                                        <td className="px-4 py-3"><StatusBadge status={record.status} /></td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-1.5">
                                                                <button onClick={() => viewReceipt(record)}
                                                                    className="bg-[#1a2e5a] hover:bg-[#2b4b8c] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shadow-sm">Receipt</button>
                                                                <button onClick={() => deleteSingleRecord(record)}
                                                                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-1 rounded-lg text-sm transition-all">🗑️</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Mobile cards */}
                                <div className="md:hidden divide-y divide-slate-100">
                                    {filtered.map((record, idx) => {
                                        const due = record.status === 'Pending' ? record.totalAmount : Math.max(0, record.totalAmount - record.paidAmount);
                                        const paid = record.status === 'Pending' ? 0 : record.paidAmount;
                                        return (
                                            <div key={idx} className="p-4 space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-bold text-sm text-[#1a2e5a]">{record.studentName}</p>
                                                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">#{record.receiptNumber}</p>
                                                    </div>
                                                    <StatusBadge status={record.status} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 rounded-xl p-3">
                                                    <div><p className="text-slate-400">Class / Sec</p><p className="font-bold text-[#1a2e5a]">{record.class}-{record.section}</p></div>
                                                    <div><p className="text-slate-400">Roll</p><p className="font-bold text-[#1a2e5a]">{record.rollNumber}</p></div>
                                                    <div><p className="text-slate-400">Expected</p><p className="font-extrabold text-[#1a2e5a]">৳{record.totalAmount?.toFixed(2)}</p></div>
                                                    <div><p className="text-slate-400">Paid</p><p className="font-extrabold text-emerald-600">৳{paid.toFixed(2)}</p></div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => viewReceipt(record)} className="flex-1 bg-[#1a2e5a] hover:bg-[#2b4b8c] text-white py-2 rounded-xl text-xs font-bold transition-all">Receipt</button>
                                                    <button onClick={() => deleteSingleRecord(record)} className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-2 rounded-xl text-xs font-bold transition-all">🗑️</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>);
                        })()}
                    </div>
                )}

                {/* ── Fee Collection View ── */}
                {viewMode === 'collection' && selectedClass && selectedSection && !loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Students Panel */}
                        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="bg-[#f8fafc] border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-bold text-[#1a2e5a]">Class List</h2>
                                    <p className="text-slate-400 text-[10px] font-medium mt-0.5">{students.length} students in {selectedClass}-{selectedSection}</p>
                                </div>
                                {collectionMode === 'individual' && (
                                    <div className="flex gap-1.5">
                                        <button onClick={selectAllStudents} className="px-2.5 py-1 bg-[#1a2e5a] text-white rounded-lg text-[10px] font-bold hover:bg-[#2b4b8c] transition-all">All</button>
                                        <button onClick={deselectAllStudents} className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-300 transition-all">Clear</button>
                                    </div>
                                )}
                            </div>
                            <div className="max-h-[480px] overflow-y-auto p-3 space-y-2">
                                {students.length === 0 && <p className="text-center text-slate-400 text-sm py-6">No students found</p>}
                                {students.map(student => {
                                    const sel = selectedStudents.some(s => s._id === student._id);
                                    return (
                                        <div key={student._id} onClick={() => collectionMode === 'individual' && toggleStudentSelection(student)}
                                            className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-150 ${collectionMode === 'bulk' ? 'border-slate-100 bg-slate-50 cursor-default' :
                                                    sel ? 'border-[#1a2e5a] bg-[#1a2e5a]/5 cursor-pointer shadow-sm' :
                                                        'border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer'}`}>
                                            <div>
                                                <p className="font-semibold text-sm text-[#1a2e5a]">{student.name}</p>
                                                <p className="text-xs text-slate-400 font-medium mt-0.5">Roll: {student.rollNumber}</p>
                                            </div>
                                            {collectionMode === 'bulk'
                                                ? <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">✓</div>
                                                : <input type="checkbox" checked={sel} readOnly className="w-4 h-4 text-[#1a2e5a] rounded accent-[#1a2e5a]" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Collection Form */}
                        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="bg-[#f8fafc] border-b border-slate-100 px-5 py-3">
                                <h2 className="text-sm font-bold text-[#1a2e5a]">Billing Details</h2>
                                <p className="text-slate-400 text-[10px] mt-0.5">Configure fees and process the transaction</p>
                            </div>
                            <div className="p-5 space-y-5">
                                {/* Collection Mode */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Collection Mode</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[['bulk', 'Bulk Billing', 'For all students'], ['individual', 'Individual', 'Select students']].map(([val, title, sub]) => (
                                            <label key={val} className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${collectionMode === val ? 'border-[#1a2e5a] bg-[#1a2e5a]/5' : 'border-slate-200 hover:bg-slate-50'}`}>
                                                <input type="radio" value={val} checked={collectionMode === val} onChange={e => { setCollectionMode(e.target.value); setSelectedStudents([]); }} className="w-4 h-4 accent-[#1a2e5a]" />
                                                <div>
                                                    <p className={`text-xs font-bold ${collectionMode === val ? 'text-[#1a2e5a]' : 'text-slate-600'}`}>{title}</p>
                                                    <p className="text-[10px] text-slate-400 font-normal">{sub}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Target Banner */}
                                <div className="bg-[#f8fafc] border border-slate-100 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-semibold">
                                    <span className="text-slate-600">{selectedClass} — Section {selectedSection}</span>
                                    <span className="text-[#f5a623]">
                                        {collectionMode === 'bulk' ? `${students.length} Students (All)` : `${selectedStudents.length} / ${students.length} Selected`}
                                    </span>
                                </div>

                                {/* Fee Category Buttons */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Add Fee Category</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {feeCategories.map((cat, i) => (
                                            <button key={i} onClick={() => addFee(cat)}
                                                className="bg-[#1a2e5a] hover:bg-[#2b4b8c] active:scale-95 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all duration-150 truncate">
                                                + {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {selectedFees.length > 0 ? (
                                    <>
                                        {/* Fee Line Items */}
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Fee Line Items</label>
                                            <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 overflow-hidden">
                                                {selectedFees.map((fee, i) => (
                                                    <div key={i} className="flex items-center justify-between bg-white px-4 py-2.5 text-xs">
                                                        <div>
                                                            <p className="font-bold text-[#1a2e5a]">{fee.feeCategory}</p>
                                                            {fee.description && <p className="text-slate-400 text-[10px] mt-0.5">{fee.description}</p>}
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-extrabold text-[#1a2e5a]">৳{fee.amount.toFixed(2)}</span>
                                                            <button onClick={() => removeFee(i)} className="w-5 h-5 rounded-full hover:bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-sm transition-all">&times;</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Payment Fields */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Payment Method</label>
                                                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#1a2e5a] font-semibold outline-none focus:ring-2 focus:ring-[#1a2e5a]/20 focus:border-[#1a2e5a]">
                                                    {['Cash', 'Card', 'Bank Transfer', 'Online', 'Cheque'].map(m => <option key={m}>{m}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Paid Amount (৳)</label>
                                                <input type="number" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} placeholder="Enter collected amount"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#1a2e5a] font-bold outline-none focus:ring-2 focus:ring-[#1a2e5a]/20 focus:border-[#1a2e5a]" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Remarks (optional)</label>
                                            <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={2} placeholder="Internal notes..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#1a2e5a] outline-none focus:ring-2 focus:ring-[#1a2e5a]/20 focus:border-[#1a2e5a] resize-none" />
                                        </div>

                                        {/* Calculation Summary */}
                                        <div className="bg-[#f8fafc] border border-slate-100 rounded-xl px-4 py-3 space-y-2 text-xs font-semibold">
                                            <div className="flex justify-between text-slate-500"><span>Expected:</span><span>৳{calculateTotals().total}</span></div>
                                            <div className="flex justify-between text-emerald-600"><span>Paid:</span><span>৳{calculateTotals().paid}</span></div>
                                            <div className="flex justify-between pt-2 border-t border-slate-200 text-rose-600 font-extrabold text-sm"><span>Balance Due:</span><span>৳{calculateTotals().due}</span></div>
                                        </div>

                                        <button onClick={collectFee} disabled={loading}
                                            className="w-full bg-[#f5a623] hover:bg-[#e0951a] active:bg-[#c97f10] disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200">
                                            {loading ? 'Processing…' : `Collect Fees — ${collectionMode === 'bulk' ? `${students.length} Students` : `${selectedStudents.length} Selected`}`}
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">
                                        <p className="text-slate-300 text-3xl mb-2">💸</p>
                                        <p className="text-slate-400 text-sm">Click a fee category button above to start building the billing sheet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Fee Records View ── */}
                {viewMode === 'records' && selectedClass && selectedSection && !loading && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {/* Records Top Bar */}
                        <div className="bg-[#f8fafc] border-b border-slate-100 px-5 py-3 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-bold text-[#1a2e5a]">Ledger Balance Sheet</h2>
                                <p className="text-slate-400 text-[10px] mt-0.5">{filteredFeeRecords.length} of {feeRecords.length} records shown</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <select value={reportType} onChange={e => setReportType(e.target.value)}
                                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-[#1a2e5a] outline-none focus:ring-2 focus:ring-[#1a2e5a]/20">
                                    {[['daily', 'Daily'], ['monthly', 'Monthly'], ['yearly', 'Yearly']].map(([v, l]) => <option key={v} value={v}>{l} Report</option>)}
                                </select>
                                <select value={reportStatusFilter} onChange={e => setReportStatusFilter(e.target.value)}
                                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-[#1a2e5a] outline-none focus:ring-2 focus:ring-[#1a2e5a]/20">
                                    {[['all', 'All Status'], ['Paid', 'Paid'], ['Partial', 'Partial'], ['Pending', 'Pending']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                </select>
                                <button onClick={downloadReport} disabled={loading || feeRecords.length === 0}
                                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
                                    📊 Report PDF
                                </button>
                                {selectedRecords.length > 0 && (
                                    <button onClick={deleteSelectedRecords} disabled={loading}
                                        className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all">
                                        🗑️ Delete ({selectedRecords.length})
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Search + Filter Bar */}
                        <div className="bg-white border-b border-slate-100 px-5 py-3 flex flex-col md:flex-row items-center gap-3">
                            <div className="relative w-full md:flex-1">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg>
                                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, roll number, receipt…"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#1a2e5a] font-medium outline-none focus:ring-2 focus:ring-[#1a2e5a]/20 focus:border-[#1a2e5a] focus:bg-white transition-all" />
                            </div>
                            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                                <select value={feeTypeFilter} onChange={e => setFeeTypeFilter(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#1a2e5a] outline-none focus:ring-2 focus:ring-[#1a2e5a]/20">
                                    <option value="">All Fee Types</option>
                                    {feeCategories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                                </select>
                                <select value={recordFilter} onChange={e => setRecordFilter(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#1a2e5a] outline-none focus:ring-2 focus:ring-[#1a2e5a]/20">
                                    <option value="all">All Records</option>
                                    <option value="paid">Paid Only</option>
                                    <option value="unpaid">Unpaid Only</option>
                                </select>
                            </div>
                        </div>

                        {/* Quick Total Bar */}
                        {filteredFeeRecords.length > 0 && (
                            <div className="px-5 py-3 bg-[#1a2e5a]/5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                                <div className="flex items-center gap-3">
                                    <button onClick={selectAllRecords} className="bg-[#1a2e5a] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold hover:bg-[#2b4b8c] transition-all">Select All</button>
                                    <button onClick={deselectAllRecords} className="bg-slate-200 text-slate-600 px-2.5 py-1 rounded-lg text-[10px] font-bold hover:bg-slate-300 transition-all">Clear</button>
                                    <span className="text-slate-500">{selectedRecords.length} selected</span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-slate-600">
                                    <span>Expected: <span className="text-[#1a2e5a] font-extrabold">৳{totalExpectedUI.toFixed(2)}</span></span>
                                    <span>Collected: <span className="text-emerald-600 font-extrabold">৳{totalCollectedUI.toFixed(2)}</span></span>
                                    <span>Due: <span className="text-rose-600 font-extrabold">৳{totalDueUI.toFixed(2)}</span></span>
                                </div>
                            </div>
                        )}

                        {filteredFeeRecords.length === 0 && (
                            <div className="py-16 text-center">
                                <p className="text-slate-300 text-4xl mb-3">📋</p>
                                <p className="text-slate-400 text-sm font-medium">No records match your current filters.</p>
                            </div>
                        )}

                        {filteredFeeRecords.length > 0 && (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                        <thead>
                                            <tr className="bg-[#1a2e5a] text-white text-xs font-semibold">
                                                <th className="px-4 py-3.5 w-10 text-center">
                                                    <input type="checkbox"
                                                        checked={selectedRecords.length === filteredFeeRecords.length && filteredFeeRecords.length > 0}
                                                        onChange={e => e.target.checked ? selectAllRecords() : deselectAllRecords()}
                                                        className="w-3.5 h-3.5 rounded accent-white" />
                                                </th>
                                                {['Receipt No', 'Student', 'Roll', 'Class/Sec', 'Fee Type', 'Total (৳)', 'Paid (৳)', 'Due (৳)', 'Status', 'Actions'].map(h => (
                                                    <th key={h} className="px-4 py-3.5 whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 font-medium">
                                            {filteredFeeRecords.map((record, idx) => {
                                                const due = record.status === 'Pending' ? record.totalAmount : Math.max(0, record.totalAmount - record.paidAmount);
                                                const paid = record.status === 'Pending' ? 0 : record.paidAmount;
                                                const checked = selectedRecords.some(r => r._id === record._id);
                                                return (
                                                    <tr key={idx} className={`hover:bg-slate-50 transition-colors ${checked ? 'bg-[#1a2e5a]/5' : ''}`}>
                                                        <td className="px-4 py-3 text-center">
                                                            <input type="checkbox" checked={checked} onChange={() => toggleRecordSelection(record)} className="w-3.5 h-3.5 rounded accent-[#1a2e5a]" />
                                                        </td>
                                                        <td className="px-4 py-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">{record.receiptNumber}</td>
                                                        <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{record.studentName}</td>
                                                        <td className="px-4 py-3 text-slate-600">{record.rollNumber}</td>
                                                        <td className="px-4 py-3 text-slate-500 text-[11px] whitespace-nowrap">{record.class} ({record.section})</td>
                                                        <td className="px-4 py-3 text-[11px] text-slate-400 max-w-[120px] truncate">{record.fees.map(f => f.feeCategory).join(', ')}</td>
                                                        <td className="px-4 py-3 text-right font-bold text-slate-800">৳{record.totalAmount.toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-right font-bold text-emerald-600">৳{paid.toFixed(2)}</td>
                                                        <td className={`px-4 py-3 text-right font-bold ${due > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>৳{due.toFixed(2)}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="relative">
                                                                <select value={record.status} onChange={e => handleStatusChange(record, e.target.value)}
                                                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border outline-none cursor-pointer transition-all ${record.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                                            record.status === 'Partial' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                                'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                                    <option value="Paid">Paid</option>
                                                                    <option value="Partial">Partial</option>
                                                                    <option value="Pending">Pending</option>
                                                                </select>
                                                                {partialEdit.recordId === record._id && (
                                                                    <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-20 w-44 space-y-2">
                                                                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Paid Amount</label>
                                                                        <input type="number" value={partialEdit.amount} onChange={e => setPartialEdit(p => ({ ...p, amount: e.target.value }))} autoFocus min="0" step="0.01"
                                                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-[#1a2e5a] font-bold outline-none" />
                                                                        {partialEdit.amount !== '' && <p className="text-[10px] font-bold text-rose-500">Due: ৳{Math.max(0, record.totalAmount - parseFloat(partialEdit.amount || 0)).toFixed(2)}</p>}
                                                                        <div className="flex gap-1.5">
                                                                            <button onClick={() => updateFeeStatus(record._id, 'Partial', partialEdit.amount)} className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold">Save</button>
                                                                            <button onClick={() => setPartialEdit({ recordId: null, amount: '' })} className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded text-[10px] font-bold">✕</button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-1.5">
                                                                <button onClick={() => viewReceipt(record)} title="View Receipt"
                                                                    className="bg-[#1a2e5a] hover:bg-[#2b4b8c] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shadow-sm">
                                                                    Receipt
                                                                </button>
                                                                <button onClick={() => openEditRecordModal(record)} title="Edit"
                                                                    className="bg-[#f5a623] hover:bg-[#e0951a] text-white px-2 py-1 rounded-lg text-[10px] font-bold transition-all shadow-sm">
                                                                    Edit
                                                                </button>
                                                                <button onClick={() => deleteSingleRecord(record)} title="Delete"
                                                                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-1 rounded-lg text-sm transition-all">
                                                                    🗑️
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden divide-y divide-slate-100">
                                    {filteredFeeRecords.map((record, idx) => {
                                        const due = record.status === 'Pending' ? record.totalAmount : Math.max(0, record.totalAmount - record.paidAmount);
                                        const paid = record.status === 'Pending' ? 0 : record.paidAmount;
                                        const checked = selectedRecords.some(r => r._id === record._id);
                                        return (
                                            <div key={idx} className={`p-4 space-y-3 ${checked ? 'bg-[#1a2e5a]/5' : ''}`}>
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-center gap-2.5">
                                                        <input type="checkbox" checked={checked} onChange={() => toggleRecordSelection(record)} className="w-4 h-4 rounded accent-[#1a2e5a] mt-0.5" />
                                                        <div>
                                                            <p className="font-bold text-sm text-[#1a2e5a]">{record.studentName}</p>
                                                            <p className="text-[10px] text-slate-400 font-mono">#{record.receiptNumber}</p>
                                                        </div>
                                                    </div>
                                                    <StatusBadge status={record.status} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2.5 text-xs bg-slate-50 rounded-xl p-3">
                                                    <div><p className="text-slate-400 font-medium">Roll / Class</p><p className="font-bold text-[#1a2e5a]">{record.rollNumber} / {record.class}-{record.section}</p></div>
                                                    <div><p className="text-slate-400 font-medium">Fee Type</p><p className="font-semibold text-[#1a2e5a] truncate">{record.fees.map(f => f.feeCategory).join(', ')}</p></div>
                                                    <div><p className="text-slate-400 font-medium">Expected</p><p className="font-extrabold text-[#1a2e5a]">৳{record.totalAmount.toFixed(2)}</p></div>
                                                    <div><p className="text-slate-400 font-medium">Paid</p><p className="font-extrabold text-emerald-600">৳{paid.toFixed(2)}</p></div>
                                                </div>
                                                <div className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-3 py-2">
                                                    <span className="text-xs text-slate-500 font-semibold">Balance Due:</span>
                                                    <span className={`font-extrabold text-sm ${due > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>৳{due.toFixed(2)}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => viewReceipt(record)} className="flex-1 bg-[#1a2e5a] hover:bg-[#2b4b8c] text-white py-2 rounded-xl text-xs font-bold shadow-sm transition-all">Receipt</button>
                                                    <button onClick={() => openEditRecordModal(record)} className="flex-1 bg-[#f5a623] hover:bg-[#e0951a] text-white py-2 rounded-xl text-xs font-bold shadow-sm transition-all">Edit</button>
                                                    <button onClick={() => deleteSingleRecord(record)} className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-2 rounded-xl text-xs font-bold transition-all">🗑️</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════════════
                Modal: Collect Fee
            ═══════════════════════════════════════════════ */}
            {isCollectFeeModalOpen && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
                    <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="bg-[#1a2e5a] px-5 py-4 flex items-center justify-between rounded-t-2xl sm:rounded-t-2xl shrink-0">
                            <div>
                                <h3 className="text-white font-extrabold text-base">Collect Fee</h3>
                                <p className="text-blue-200 text-[10px] font-bold uppercase tracking-wider">{selectedClass} — Section {selectedSection}</p>
                            </div>
                            <button onClick={() => setIsCollectFeeModalOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-lg transition-all">&times;</button>
                        </div>

                        {/* Body */}
                        <div className="overflow-y-auto flex-1 p-5 space-y-5">
                            {/* Student Select */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Student (or Bulk)</label>
                                <select value={modalStudentId} onChange={e => setModalStudentId(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#1a2e5a] font-semibold outline-none focus:ring-2 focus:ring-[#1a2e5a]/20">
                                    <option value="bulk">All Students — Bulk Billing</option>
                                    {students.map((s, i) => <option key={i} value={s._id}>{s.name} (Roll: {s.rollNumber})</option>)}
                                </select>
                            </div>

                            {/* Add Fee Row */}
                            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/60 space-y-3">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Add Fee Row</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Fee Type</label>
                                        <select value={modalFeeCategory} onChange={e => { const c = feeCategories.find(f => f.name === e.target.value); setModalFeeCategory(e.target.value); if (c) setModalAmount(c.defaultAmount.toString()); }}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#1a2e5a] font-semibold outline-none focus:ring-2 focus:ring-[#1a2e5a]/20">
                                            <option value="">Select Fee Type</option>
                                            {feeCategories.map((c, i) => <option key={i} value={c.name}>{c.name} — ৳{c.defaultAmount}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Amount (৳)</label>
                                        <input type="number" value={modalAmount} onChange={e => setModalAmount(e.target.value)} placeholder="Enter amount"
                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#1a2e5a] font-bold outline-none focus:ring-2 focus:ring-[#1a2e5a]/20" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Notes (optional)</label>
                                        <input type="text" value={modalDescription} onChange={e => setModalDescription(e.target.value)} placeholder="Row description or notes"
                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-[#1a2e5a] outline-none focus:ring-2 focus:ring-[#1a2e5a]/20" />
                                    </div>
                                </div>
                                <button onClick={handleModalAddFee}
                                    className="bg-[#1a2e5a] hover:bg-[#2b4b8c] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all">
                                    + Add to Receipt
                                </button>
                            </div>

                            {/* Fee Line Items */}
                            {modalSelectedFees.length > 0 && (
                                <div className="space-y-3">
                                    <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                                        {modalSelectedFees.map((fee, i) => (
                                            <div key={i} className="flex items-center justify-between bg-white px-4 py-2.5 text-xs">
                                                <div>
                                                    <p className="font-bold text-[#1a2e5a]">{fee.feeCategory}</p>
                                                    {fee.description && <p className="text-slate-400 text-[10px]">{fee.description}</p>}
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <span className="font-extrabold text-[#1a2e5a]">৳{fee.amount.toFixed(2)}</span>
                                                    <button onClick={() => handleModalRemoveFee(i)} className="w-5 h-5 rounded-full hover:bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-sm">&times;</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Payment fields */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-semibold text-slate-500 mb-1">Payment Method</label>
                                            <select value={modalPaymentMethod} onChange={e => setModalPaymentMethod(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#1a2e5a] font-semibold outline-none focus:ring-2 focus:ring-[#1a2e5a]/20">
                                                {['Cash', 'Card', 'Bank Transfer', 'Online', 'Cheque'].map(m => <option key={m}>{m}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-semibold text-slate-500 mb-1">Paid Amount (৳)</label>
                                            <input type="number" value={modalPaidAmount} onChange={e => setModalPaidAmount(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#1a2e5a] font-bold outline-none focus:ring-2 focus:ring-[#1a2e5a]/20" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">Remarks</label>
                                        <textarea value={modalRemarks} onChange={e => setModalRemarks(e.target.value)} rows={2} placeholder="Optional notes..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#1a2e5a] outline-none focus:ring-2 focus:ring-[#1a2e5a]/20 resize-none" />
                                    </div>
                                    <div className="bg-[#f8fafc] border border-slate-100 rounded-xl px-4 py-3 flex justify-between text-xs font-semibold">
                                        <span className="text-slate-500">Total: <span className="text-[#1a2e5a] font-extrabold">৳{modalSelectedFees.reduce((s, f) => s + f.amount, 0).toFixed(2)}</span></span>
                                        <span className="text-rose-600">Due: <span className="font-extrabold">৳{Math.max(0, modalSelectedFees.reduce((s, f) => s + f.amount, 0) - (parseFloat(modalPaidAmount) || 0)).toFixed(2)}</span></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 rounded-b-2xl">
                            <button onClick={() => setIsCollectFeeModalOpen(false)}
                                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold transition-all">Cancel</button>
                            <button onClick={handleModalCollectFee} disabled={loading || modalSelectedFees.length === 0}
                                className="bg-[#f5a623] hover:bg-[#e0951a] disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all">
                                {loading ? 'Processing…' : 'Collect Fees Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════
                Modal: Receipt / Invoice View
            ═══════════════════════════════════════════════ */}
            {isReceiptModalOpen && currentReceipt && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
                    <div className="bg-white w-full sm:max-w-3xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="bg-[#1a2e5a] px-5 py-4 flex items-center justify-between rounded-t-2xl shrink-0">
                            <div>
                                <h3 className="text-white font-extrabold text-base">Invoice Receipt</h3>
                                <p className="text-blue-200 text-[10px] font-bold uppercase tracking-wider">#{currentReceipt.receiptNumber}</p>
                            </div>
                            <button onClick={() => setIsReceiptModalOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-lg transition-all">&times;</button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                            {/* School Head */}
                            <div className="text-center border-b-2 border-slate-100 pb-4">
                                <h4 className="text-lg sm:text-xl font-extrabold text-[#1a2e5a] tracking-tight">SCHOOL MANAGEMENT SYSTEM</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Official Fee Payment Invoice Receipt</p>
                            </div>

                            {/* Meta Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
                                <div className="space-y-1.5">
                                    <p><span className="text-slate-400 font-medium">Receipt ID:</span> <span className="font-mono font-bold">{currentReceipt.receiptNumber}</span></p>
                                    <p><span className="text-slate-400 font-medium">Payment Date:</span> <span className="font-semibold">{new Date(currentReceipt.paymentDate).toLocaleDateString()}</span></p>
                                    <p><span className="text-slate-400 font-medium">Academic Year:</span> <span className="font-semibold">{currentReceipt.academicYear}</span></p>
                                </div>
                                <div className="space-y-1.5 sm:text-right">
                                    <p><span className="text-slate-400 font-medium">Payment Method:</span> <span className="font-semibold">{currentReceipt.paymentMethod}</span></p>
                                    <p><span className="text-slate-400 font-medium">Collected By:</span> <span className="font-semibold">{currentReceipt.collectedBy || 'Admin'}</span></p>
                                    <p className="flex items-center sm:justify-end gap-2"><span className="text-slate-400 font-medium">Status:</span><StatusBadge status={currentReceipt.status} /></p>
                                </div>
                            </div>

                            {/* Student Card */}
                            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                {[['Student Name', currentReceipt.studentName], ['Roll Number', currentReceipt.rollNumber], ['Class', currentReceipt.class], ['Section', currentReceipt.section]].map(([k, v]) => (
                                    <div key={k}>
                                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider mb-0.5">{k}</p>
                                        <p className="font-extrabold text-[#1a2e5a] text-sm">{v}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Fee Table */}
                            <div className="border border-slate-100 rounded-xl overflow-hidden text-xs sm:text-sm">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-[#1a2e5a] text-white font-semibold text-left">
                                            <th className="px-4 py-3">Fee Category</th>
                                            <th className="px-4 py-3">Description</th>
                                            <th className="px-4 py-3 text-right">Amount (৳)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {currentReceipt.fees.map((fee, i) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-3 font-bold text-[#1a2e5a]">{fee.feeCategory}</td>
                                                <td className="px-4 py-3 text-slate-400">{fee.description || '—'}</td>
                                                <td className="px-4 py-3 text-right font-extrabold text-slate-800">৳{fee.amount.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary */}
                            <div className="flex justify-end">
                                <div className="w-full sm:max-w-xs bg-[#f8fafc] border border-slate-100 rounded-xl p-4 space-y-2 text-xs font-semibold">
                                    <div className="flex justify-between text-slate-500"><span>Total Expected:</span><span>৳{currentReceipt.totalAmount.toFixed(2)}</span></div>
                                    <div className="flex justify-between text-emerald-600"><span>Paid Amount:</span><span>৳{currentReceipt.paidAmount.toFixed(2)}</span></div>
                                    <div className="flex justify-between pt-2.5 border-t border-slate-200 text-rose-600 font-extrabold text-sm"><span>Balance Due:</span><span>৳{currentReceipt.dueAmount.toFixed(2)}</span></div>
                                </div>
                            </div>

                            {/* Remarks */}
                            {currentReceipt.remarks && (
                                <div className="border-l-4 border-[#f5a623] bg-amber-50 px-4 py-3 rounded-r-xl text-xs text-slate-600">
                                    <strong className="text-amber-700">Admin Remarks:</strong> {currentReceipt.remarks}
                                </div>
                            )}

                            {/* Signature */}
                            <div className="flex items-end justify-between pt-6 mt-2 border-t border-slate-100 text-[10px] text-slate-400">
                                <p>Computer-generated receipt. No manual signature required for reference only.</p>
                                <div className="text-right">
                                    <div className="border-t border-slate-300 pt-1 w-36 text-[#1a2e5a] font-bold text-[11px]">Authorized Signature</div>
                                    <p>School Accounts Office</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0 rounded-b-2xl">
                            <button onClick={() => setIsReceiptModalOpen(false)}
                                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold transition-all">Close</button>
                            <button onClick={() => downloadReceiptPDF(currentReceipt)}
                                className="bg-[#1a2e5a] hover:bg-[#2b4b8c] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5">
                                📄 Download PDF
                            </button>
                            <button onClick={() => printReceipt(currentReceipt)}
                                className="bg-[#f5a623] hover:bg-[#e0951a] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5">
                                🖨️ Print
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════
                Modal: Edit Record Status
            ═══════════════════════════════════════════════ */}
            {isEditModalOpen && editingRecord && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-[#1a2e5a] px-5 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-extrabold text-base">Update Payment Status</h3>
                                <p className="text-blue-200 text-[10px] font-bold uppercase tracking-wider">#{editingRecord.receiptNumber}</p>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-lg transition-all">&times;</button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSaveEditModal} className="p-5 space-y-5">
                            {/* Student Info */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center justify-between text-xs">
                                <div>
                                    <p className="text-slate-400 font-medium">Student</p>
                                    <p className="font-bold text-[#1a2e5a] text-sm">{editingRecord.studentName}</p>
                                    <p className="text-slate-400 font-mono text-[10px] mt-0.5">Roll: {editingRecord.rollNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-400 font-medium">Total Amount</p>
                                    <p className="font-extrabold text-[#1a2e5a] text-lg">৳{editingRecord.totalAmount.toFixed(2)}</p>
                                    <p className="text-emerald-600 font-bold text-[10px]">Paid: ৳{editingRecord.paidAmount.toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Status Select */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Payment Status</label>
                                <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                                    className={`w-full border rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:ring-4 transition-all ${editStatus === 'Paid' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 focus:ring-emerald-500/20' :
                                            editStatus === 'Partial' ? 'bg-blue-50 border-blue-200 text-blue-700 focus:ring-blue-500/20' :
                                                'bg-amber-50 border-amber-200 text-amber-700 focus:ring-amber-500/20'}`}>
                                    <option value="Paid">✅ Paid</option>
                                    <option value="Partial">🔵 Partial</option>
                                    <option value="Pending">🟡 Pending</option>
                                </select>
                            </div>

                            {/* Partial Amount */}
                            {editStatus === 'Partial' && (
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">New Paid Amount (৳)</label>
                                    <input type="number" value={editPaidAmount} onChange={e => setEditPaidAmount(e.target.value)} min="0" step="0.01"
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#1a2e5a] rounded-xl px-3 py-2.5 text-sm text-[#1a2e5a] font-bold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all" />
                                    {editPaidAmount !== '' && (
                                        <p className="mt-1.5 text-xs font-bold text-rose-500">
                                            Remaining Due: ৳{Math.max(0, editingRecord.totalAmount - parseFloat(editPaidAmount || 0)).toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                                <button type="button" onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold transition-all">Cancel</button>
                                <button type="submit" disabled={loading}
                                    className="bg-[#1a2e5a] hover:bg-[#2b4b8c] disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all">
                                    {loading ? 'Saving…' : 'Update Status'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* ═════════════════════════════════════════════
                Fee Category Popup
            ═════════════════════════════════════════════ */}
            {isFeePopupOpen && popupCategory && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                    style={{ background: 'rgba(15,30,60,0.55)', backdropFilter: 'blur(4px)' }}
                    onClick={e => { if (e.target === e.currentTarget) setIsFeePopupOpen(false); }}
                >
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-[fadeInUp_0.18s_ease]">
                        {/* Header */}
                        <div className="bg-[#1a2e5a] px-5 py-4 flex items-center justify-between">
                            <div>
                                <p className="text-blue-200 text-[10px] font-bold uppercase tracking-wider">Add Fee Line Item</p>
                                <h3 className="text-white font-extrabold text-base mt-0.5">{popupCategory.name}</h3>
                            </div>
                            <button
                                onClick={() => setIsFeePopupOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-lg transition-all"
                            >&times;</button>
                        </div>

                        {/* Body */}
                        <div className="p-5 space-y-4">
                            {/* Amount */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Amount (৳) <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">৳</span>
                                    <input
                                        ref={popupAmountRef}
                                        type="number"
                                        min="1"
                                        step="any"
                                        value={popupAmount}
                                        onChange={e => setPopupAmount(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') confirmFeePopup(); if (e.key === 'Escape') setIsFeePopupOpen(false); }}
                                        placeholder={`e.g. ${popupCategory.defaultAmount}`}
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl pl-8 pr-4 py-3 text-sm text-[#1a2e5a] font-bold outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all"
                                    />
                                </div>
                                {popupAmount && (parseFloat(popupAmount) <= 0 || isNaN(parseFloat(popupAmount))) && (
                                    <p className="text-rose-500 text-[10px] font-semibold mt-1">Please enter a valid amount greater than 0</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description <span className="text-slate-300 font-normal normal-case">(optional)</span></label>
                                <input
                                    type="text"
                                    value={popupDescription}
                                    onChange={e => setPopupDescription(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') confirmFeePopup(); if (e.key === 'Escape') setIsFeePopupOpen(false); }}
                                    placeholder="e.g. April 2026, Semester 1…"
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#1a2e5a] focus:bg-white rounded-xl px-4 py-3 text-sm text-[#1a2e5a] outline-none focus:ring-4 focus:ring-[#1a2e5a]/10 transition-all"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 pb-5 space-y-3">
                            {/* Payment Method quick selector */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Payment Method</label>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {['Cash', 'Card', 'Bank Transfer', 'Online', 'Cheque'].map(m => (
                                        <button key={m} type="button"
                                            onClick={() => setPopupPaymentMethod(m)}
                                            className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${popupPaymentMethod === m
                                                    ? 'bg-[#1a2e5a] border-[#1a2e5a] text-white'
                                                    : 'border-slate-200 text-slate-500 hover:border-[#1a2e5a] hover:text-[#1a2e5a]'
                                                }`}>{m}</button>
                                    ))}
                                </div>
                            </div>
                            {/* Action buttons */}
                            <div className="flex items-center gap-3 pt-1">
                                <button
                                    onClick={() => setIsFeePopupOpen(false)}
                                    disabled={popupLoading}
                                    className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-100 disabled:opacity-50 text-slate-600 rounded-xl text-xs font-semibold transition-all"
                                >Cancel</button>
                                <button
                                    onClick={confirmAndCollectFee}
                                    disabled={!popupAmount || parseFloat(popupAmount) <= 0 || isNaN(parseFloat(popupAmount)) || popupLoading}
                                    className="flex-1 py-2.5 bg-[#f5a623] hover:bg-[#e0951a] active:bg-[#c97f10] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                                >
                                    {popupLoading
                                        ? <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />&nbsp;Collecting…</>
                                        : '✓ Collect & Go to Records'
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeesManagementPage;