

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Save, CheckCircle, XCircle } from 'lucide-react';
import '../assets/css/AttendanceManager.css';

export default function AttendanceManager() {
    const [students, setStudents] = useState([]);
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceMap, setAttendanceMap] = useState({}); // Stores { student_id: 'Present' | 'Absent' }
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // 1. Fetch all students once on mount
    useEffect(() => {
        axios.get('http://localhost:5000/api/students?limit=1000')
            .then(res => {
                const records = Array.isArray(res.data) ? res.data : (res.data.data || []);
                setStudents(records);
                
                // Set initial fallback mapping state
                const initialMap = {};
                records.forEach(s => { initialMap[s.id] = 'Present'; });
                setAttendanceMap(initialMap);
            })
            .catch(err => console.error("Error loading student roster:", err));
    }, []);

    // 2. Fetch or reset attendance only when the date changes, or right after students array initially fills
    useEffect(() => {
        if (!attendanceDate || students.length === 0) return;
        
        setLoading(true);
        axios.get(`http://localhost:5000/api/attendance?date=${attendanceDate}`)
            .then(res => {
                const existingRecords = res.data || [];
                const updatedMap = {};

                // First, establish default "Present" state for all active roster members
                students.forEach(s => { updatedMap[s.id] = 'Present'; });

                // Overwrite defaults if historical records exist in the database for today
                if (existingRecords.length > 0) {
                    existingRecords.forEach(rec => {
                        if (updatedMap[rec.student_id] !== undefined) {
                            updatedMap[rec.student_id] = rec.status;
                        }
                    });
                }
                
                setAttendanceMap(updatedMap);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching day attendance:", err);
                setLoading(false);
            });
    // FIXED: Removed raw "students" array to prevent infinite execution loop crashes
    }, [attendanceDate, students.length]); 

    // Toggle individual student status
    const handleStatusChange = (studentId, status) => {
        setAttendanceMap(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    // Submit bulk attendance manifest to database
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Ensure we have active records to send
        if (Object.keys(attendanceMap).length === 0) {
            alert("No student metrics available to save.");
            return;
        }

        const records = Object.keys(attendanceMap).map(studentId => ({
            student_id: parseInt(studentId),
            date: attendanceDate,
            status: attendanceMap[studentId]
        }));

        try {
            // Sends direct bulk array manifest payload matching backend requirements
            await axios.post('http://localhost:5000/api/attendance/bulk', { date: attendanceDate, records });
            setMessage({ type: 'success', text: `Attendance register updated successfully for ${attendanceDate}!` });
            
            // Clear message alert panel after timeout
            setTimeout(() => setMessage({ type: '', text: '' }), 4000);
        } catch (err) {
            console.error("Attendance post error details:", err.response?.data || err.message);
            const errMsg = err.response?.data?.error || err.response?.data?.message || "Something went wrong on the server.";
            setMessage({ type: 'error', text: errMsg });
        }
    };

    return (
        <div className="attendance-container">
            <div className="attendance-header">
                <h1 className="attendance-title">Daily Attendance Register</h1>
                
                <div className="date-picker-wrapper">
                    <Calendar size={18} className="calendar-icon" />
                    <input 
                        type="date" 
                        value={attendanceDate} 
                        onChange={(e) => setAttendanceDate(e.target.value)} 
                        className="date-input"
                    />
                </div>
            </div>

            {message.text && (
                <div className={`alert-box ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="attendance-card">
                <div className="table-wrapper">
                    <table className="attendance-table">
                        <thead>
                            <tr>
                                <th>Roll Number</th>
                                <th>Student Name</th>
                                <th>Assigned Class</th>
                                <th className="text-center">Status Selection</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="table-loading">Loading sheet data...</td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="table-empty">No active students found in directory database.</td>
                                </tr>
                            ) : (
                                students.map(s => (
                                    <tr key={s.id} className={attendanceMap[s.id] === 'Absent' ? 'row-absent' : ''}>
                                        <td className="font-mono font-bold">{s.roll_number}</td>
                                        <td className="font-medium">{s.name}</td>
                                        <td>{s.class_name}</td>
                                        <td>
                                            <div className="status-toggle-group">
                                                <button 
                                                    type="button"
                                                    onClick={() => handleStatusChange(s.id, 'Present')}
                                                    className={`btn-toggle toggle-present ${attendanceMap[s.id] === 'Present' ? 'active' : ''}`}
                                                >
                                                    <CheckCircle size={14} /> Present
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => handleStatusChange(s.id, 'Absent')}
                                                    className={`btn-toggle toggle-absent ${attendanceMap[s.id] === 'Absent' ? 'active' : ''}`}
                                                >
                                                    <XCircle size={14} /> Absent
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {students.length > 0 && !loading && (
                    <div className="attendance-footer-actions">
                        <button type="submit" className="btn-save-attendance">
                            <Save size={16} /> Save Register Entries
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}