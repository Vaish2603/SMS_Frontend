import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, Plus, Trash2, X, Calendar, Check, AlertCircle } from 'lucide-react';
import '../assets/css/Leaves.css';

export default function Leaves() {
    const [leaves, setLeaves] = useState([]);
    const [teachers, setTeachers] = useState([]); // Used to populate a dropdown selector
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showForm, setShowForm] = useState(false);
    
    // Form and CRUD States
    const [teacherId, setTeacherId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState(''); 
    const [reason, setReason] = useState('');

    // Fetch leave requests and list of teachers for the form dropdown selector
    const fetchLeaves = () => {
        axios.get(`http://localhost:5000/api/leaves?search=${search}&page=${page}&limit=5`)
            .then(res => {
                const recordData = Array.isArray(res.data) ? res.data : (res.data.data || []);
                const totalRecords = res.data.total || recordData.length;
                setLeaves(recordData);
                setTotalPages(Math.ceil(totalRecords / 5) || 1);
            }).catch(err => console.error("Fetch Error:", err));
    };

    const fetchTeachers = () => {
        axios.get('http://localhost:5000/api/teachers?limit=1000')
            .then(res => {
                const recordData = Array.isArray(res.data) ? res.data : (res.data.data || []);
                setTeachers(recordData);
            }).catch(err => console.error("Fetch Teachers Error:", err));
    };

    useEffect(() => { 
        fetchLeaves(); 
        fetchTeachers();
    }, [search, page]);

    const resetForm = () => {
        setTeacherId(''); 
        setStartDate(''); 
        setEndDate(''); 
        setReason('');
        setShowForm(false);
    };

    // Submit a New Request (Defaults to Pending via database schema)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = { 
            teacher_id: parseInt(teacherId), 
            start_date: startDate, 
            end_date: endDate, 
            reason: reason.trim()
        };

        try {
            await axios.post('http://localhost:5000/api/leaves', payload);
            resetForm();
            fetchLeaves();
        } catch (err) { 
            console.error("Submission Error Details:", err.response?.data || err.message); 
            alert("Error submitting request. Verify that the date parameters are logical.");
        }
    };

    // Update Request Status (Approve / Reject)
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/leaves/${id}/status`, { status: newStatus });
            fetchLeaves();
        } catch (err) {
            console.error("Status Update Error:", err);
            alert("Failed to update status parameters on server.");
        }
    };

    const handleDelete = async (id) => {
        if(confirm("Permanently drop this leave log entry?")) {
            try {
                await axios.delete(`http://localhost:5000/api/leaves/${id}`);
                fetchLeaves();
            } catch (err) {
                console.error("Delete Error:", err);
            }
        }
    };

    return (
        <div className="leave-container">
            <div className="directory-header">
                <h1 className="directory-title">Leave Applications</h1>
                <button 
                    onClick={() => setShowForm(!showForm)} 
                    className={`btn-action ${showForm ? 'btn-close' : 'btn-add'}`}
                >
                    {showForm ? <X size={16} /> : <Plus size={16} />} 
                    <span>{showForm ? 'Close Panel' : 'Apply for Leave'}</span>
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="leave-form-card">
                    <div className="form-header">
                        <h2>New Leave Request Form</h2>
                    </div>
                    <div className="form-group">
                        <label>Select Applicant Teacher</label>
                        <select required value={teacherId} onChange={e => setTeacherId(e.target.value)} className="form-select">
                            <option value="">-- Select Teacher --</option>
                            {teachers.map(t => (
                                <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Start Date</label>
                        <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input type="date" required value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                    <div className="form-group md:col-span-4">
                        <label>Reason / Statement</label>
                        <textarea placeholder="Provide detailed operational reason..." required value={reason} onChange={e => setReason(e.target.value)} rows={3} />
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" onClick={resetForm} className="btn-cancel">Cancel</button>
                        <button type="submit" className="btn-submit bg-success">Submit Request</button>
                    </div>
                </form>
            )}

            <div className="table-card">
                <div className="search-bar-container">
                    <Search className="search-icon" size={18} />
                    <input type="text" placeholder="Search parameters by teacher name or reasons..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                </div>
                <div className="table-wrapper">
                    <table className="leave-table">
                        <thead>
                            <tr>
                                <th>Teacher Profile</th>
                                <th>Duration</th>
                                <th>Reason Log</th>
                                <th>Status Metric</th>
                                <th className="text-center">Action Logic</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="table-empty">No leave allocation requests detected.</td>
                                </tr>
                            ) : (
                                leaves.map(l => (
                                    <tr key={l.id}>
                                        <td className="font-medium text-bold">
                                            {l.teacher_name || `ID: ${l.teacher_id}`}
                                            <div className="text-sub-dept">{l.department}</div>
                                        </td>
                                        <td className="font-mono text-date-span">
                                            <div>{l.start_date.split('T')[0]}</div>
                                            <div className="text-to-span">to</div>
                                            <div>{l.end_date.split('T')[0]}</div>
                                        </td>
                                        <td className="reason-cell-text">{l.reason}</td>
                                        <td>
                                            <span className={`badge-status status-${l.status.toLowerCase()}`}>
                                                {l.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-cell-buttons">
                                                {l.status === 'Pending' && (
                                                    <>
                                                        <button onClick={() => handleStatusUpdate(l.id, 'Approved')} className="action-approve" title="Approve Leave">
                                                            <Check size={16} />
                                                        </button>
                                                        <button onClick={() => handleStatusUpdate(l.id, 'Rejected')} className="action-reject" title="Reject Leave">
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                <button onClick={() => handleDelete(l.id)} className="action-delete" title="Drop File Row Entry">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="pagination-footer">
                    <span className="page-indicator">Page {page} of {totalPages}</span>
                    <div className="pagination-controls">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={16} /></button>
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}