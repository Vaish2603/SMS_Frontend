import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, Plus, Trash2, Edit2, X, DollarSign } from 'lucide-react';
import '../assets/css/Teachers.css'; // Make sure to create this CSS file in your folder

export default function Teachers() {
    const [teachers, setTeachers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showForm, setShowForm] = useState(false);
    
    // Form and CRUD States
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState(''); 
    const [salary, setSalary] = useState('');

    const fetchTeachers = () => {
        axios.get(`http://localhost:5000/api/teachers?search=${search}&page=${page}&limit=5`)
            .then(res => {
                const recordData = Array.isArray(res.data) ? res.data : (res.data.data || []);
                const totalRecords = res.data.total || recordData.length;
                
                setTeachers(recordData);
                setTotalPages(Math.ceil(totalRecords / 5) || 1);
            }).catch(err => console.error("Fetch Error:", err));
    };

    useEffect(() => { fetchTeachers(); }, [search, page]);

    const resetForm = () => {
        setName(''); 
        setEmail(''); 
        setDepartment(''); 
        setSalary('');
        setIsEditing(false);
        setEditId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Payload keys perfectly mapped 1:1 to your MySQL columns
        const payload = { 
            name: name.trim(), 
            email: email.trim(), 
            department: department.trim(), 
            salary: parseFloat(salary) // Parses Decimal correctly for SQL
        };

        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/teachers/${editId}`, payload);
            } else {
                await axios.post('http://localhost:5000/api/teachers', payload);
            }
            resetForm();
            fetchTeachers();
        } catch (err) { 
            console.error("Submission Error Details:", err.response?.data || err.message); 
            const serverErrorMessage = err.response?.data?.error || err.response?.data?.message || "Server configuration error or Email already exists.";
            alert(`Error Saving Teacher: ${serverErrorMessage}`);
        }
    };

    const handleEditClick = (teacher) => {
        setIsEditing(true);
        setEditId(teacher.id);
        setName(teacher.name);
        setEmail(teacher.email);
        setDepartment(teacher.department); 
        setSalary(teacher.salary);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if(confirm("Are you sure you want to delete this teacher profile?")) {
            try {
                await axios.delete(`http://localhost:5000/api/teachers/${id}`);
                fetchTeachers();
            } catch (err) {
                console.error("Delete Error:", err);
            }
        }
    };

    return (
        <div className="teacher-container">
            <div className="directory-header">
                <h1 className="directory-title">Teachers Directory</h1>
                <button 
                    onClick={() => { if(showForm) resetForm(); else setShowForm(true); }} 
                    className={`btn-action ${showForm && !isEditing ? 'btn-close' : 'btn-add'}`}
                >
                    {showForm && !isEditing ? <X size={16} /> : <Plus size={16} />} 
                    <span>{showForm && !isEditing ? 'Close Panel' : 'Add Teacher'}</span>
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="teacher-form-card">
                    <div className="form-header">
                        <h2>{isEditing ? `Modify Profile for: ${name}` : 'Register a New Teacher'}</h2>
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="e.g. Professor Smith" required value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="name@school.com" required value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Department</label>
                        <input type="text" placeholder="e.g. Mathematics" required value={department} onChange={e => setDepartment(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Monthly Salary</label>
                        <div className="salary-input-wrapper">
                            <input type="number" step="0.01" placeholder="0.00" required value={salary} onChange={e => setSalary(e.target.value)} />
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        {isEditing && (
                            <button type="button" onClick={resetForm} className="btn-cancel">Cancel</button>
                        )}
                        <button type="submit" className={`btn-submit ${isEditing ? 'bg-warn' : 'bg-success'}`}>
                            {isEditing ? 'Update Record' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            )}

            <div className="table-card">
                <div className="search-bar-container">
                    <Search className="search-icon" size={18} />
                    <input type="text" placeholder="Search teachers by name, email or department..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                </div>
                <div className="table-wrapper">
                    <table className="teacher-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Salary</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="table-empty">No corresponding teacher entries found.</td>
                                </tr>
                            ) : (
                                teachers.map(t => (
                                    <tr key={t.id}>
                                        <td className="font-medium text-bold">{t.name}</td>
                                        <td className="font-email">{t.email}</td>
                                        <td><span className="badge-dept">{t.department}</span></td>
                                        <td className="font-mono">${Number(t.salary).toFixed(2)}</td>
                                        <td>
                                            <div className="action-cell-buttons">
                                                <button onClick={() => handleEditClick(t)} className="action-edit" title="Modify Profile">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(t.id)} className="action-delete" title="Remove Profile">
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