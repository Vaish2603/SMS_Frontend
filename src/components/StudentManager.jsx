

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Search, ChevronLeft, ChevronRight, Plus, Trash2, Edit2, X } from 'lucide-react';

// export default function Students() {
//     const [students, setStudents] = useState([]);
//     const [search, setSearch] = useState('');
//     const [page, setPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [showForm, setShowForm] = useState(false);
    
//     // Form and CRUD States
//     const [isEditing, setIsEditing] = useState(false);
//     const [editId, setEditId] = useState(null);
//     const [name, setName] = useState('');
//     const [rollNumber, setRollNumber] = useState('');
//     const [class_Name, setClassName] = useState(''); // Maps to your form input
//     const [guardianName, setGuardianName] = useState('');

//     const fetchStudents = () => {
//         axios.get(`http://localhost:5000/api/students?search=${search}&page=${page}&limit=5`)
//             .then(res => {
//                 const recordData = Array.isArray(res.data) ? res.data : (res.data.data || []);
//                 const totalRecords = res.data.total || recordData.length;
                
//                 setStudents(recordData);
//                 setTotalPages(Math.ceil(totalRecords / 5) || 1);
//             }).catch(err => console.error("Fetch Error:", err));
//     };

//     useEffect(() => { fetchStudents(); }, [search, page]);

//     const resetForm = () => {
//         setName(''); 
//         setRollNumber(''); 
//         setClassName(''); 
//         setGuardianName('');
//         setIsEditing(false);
//         setEditId(null);
//         setShowForm(false);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         // Payload updated to exactly match your revised schema columns
//         const payload = { 
//             name: name.trim(), 
//             roll_number: rollNumber.trim(), 
//             class_name: class_Name.trim(), // <--- Correct column name matches class_name VARCHAR(50)
//             guardian_name: guardianName.trim() 
//         };

//         try {
//             if (isEditing) {
//                 await axios.put(`http://localhost:5000/api/students/${editId}`, payload);
//             } else {
//                 await axios.post('http://localhost:5000/api/students', payload);
//             }
//             resetForm();
//             fetchStudents();
//         } catch (err) { 
//             console.error("Submission Error:", err.response?.data || err.message); 
//             const serverErrorMessage = err.response?.data?.error || "Check backend console or duplicate Roll Number.";
//             alert(`Error Saving Record: ${serverErrorMessage}`);
//         }
//     };

//     const handleEditClick = (student) => {
//         setIsEditing(true);
//         setEditId(student.id);
//         setName(student.name);
//         setRollNumber(student.roll_number);
//         setClassName(student.class_name); // <--- Reads from your database updated class_name property
//         setGuardianName(student.guardian_name);
//         setShowForm(true);
//     };

//     const handleDelete = async (id) => {
//         if(confirm("Confirm deletion of student row entry?")) {
//             try {
//                 await axios.delete(`http://localhost:5000/api/students/${id}`);
//                 fetchStudents();
//             } catch (err) {
//                 console.error("Delete Error:", err);
//             }
//         }
//     };

//     return (
//         <div className="space-y-6 max-w-6xl mx-auto p-4 font-sans">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <h1 className="text-2xl font-bold text-slate-900">Student Directory</h1>
//                 <button 
//                     onClick={() => { if(showForm) resetForm(); else setShowForm(true); }} 
//                     className={`flex items-center space-x-2 px-4 py-2 text-white font-medium rounded-lg transition shadow ${showForm && !isEditing ? 'bg-slate-600 hover:bg-slate-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
//                 >
//                     {showForm && !isEditing ? <X size={16} /> : <Plus size={16} />} 
//                     <span>{showForm && !isEditing ? 'Close Panel' : 'Add Student'}</span>
//                 </button>
//             </div>

//             {showForm && (
//                 <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-sm">
//                     <div className="md:col-span-4 border-b pb-2 mb-2">
//                         <h2 className="text-md font-semibold text-slate-700">
//                             {isEditing ? `Modify Details for Roll: ${rollNumber}` : 'Register a New Student'}
//                         </h2>
//                     </div>
//                     <div className="flex flex-col">
//                         <label className="text-xs font-semibold text-slate-500 mb-1">Full Name</label>
//                         <input type="text" placeholder="Name" required value={name} onChange={e => setName(e.target.value)} className="p-2 border rounded-lg focus:outline-indigo-500" />
//                     </div>
//                     <div className="flex flex-col">
//                         <label className="text-xs font-semibold text-slate-500 mb-1">Roll Number</label>
//                         <input type="text" placeholder="Roll Number" required disabled={isEditing} value={rollNumber} onChange={e => setRollNumber(e.target.value)} className="p-2 border rounded-lg focus:outline-indigo-500 disabled:bg-slate-50 disabled:text-slate-400" />
//                     </div>
//                     <div className="flex flex-col">
//                         <label className="text-xs font-semibold text-slate-500 mb-1">Class Assignment</label>
//                         <input type="text" placeholder="Class Name" required value={class_Name} onChange={e => setClassName(e.target.value)} className="p-2 border rounded-lg focus:outline-indigo-500" />
//                     </div>
//                     <div className="flex flex-col">
//                         <label className="text-xs font-semibold text-slate-500 mb-1">Guardian Identity</label>
//                         <input type="text" placeholder="Guardian Name" required value={guardianName} onChange={e => setGuardianName(e.target.value)} className="p-2 border rounded-lg focus:outline-indigo-500" />
//                     </div>
                    
//                     <div className="md:col-span-4 flex justify-end space-x-2 pt-2">
//                         {isEditing && (
//                             <button type="button" onClick={resetForm} className="py-2 px-4 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition">
//                                 Cancel
//                             </button>
//                         )}
//                         <button type="submit" className={`py-2 px-6 text-white rounded-lg font-medium transition ${isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
//                             {isEditing ? 'Update Record' : 'Save Record'}
//                         </button>
//                     </div>
//                 </form>
//             )}

//             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//                 <div className="p-4 border-b border-slate-200 flex items-center bg-slate-50">
//                     <Search className="text-slate-400 mr-2" size={18} />
//                     <input type="text" placeholder="Filter rosters by name or roll number..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="bg-transparent w-full focus:outline-none text-sm text-slate-700" />
//                 </div>
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left text-sm border-collapse">
//                         <thead>
//                             <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-medium">
//                                 <th className="p-4">Roll Number</th>
//                                 <th className="p-4">Name</th>
//                                 <th className="p-4">Class</th>
//                                 <th className="p-4">Guardian</th>
//                                 <th className="p-4 text-center">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-100 text-slate-700">
//                             {students.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="5" className="p-8 text-center text-slate-400 italic">No corresponding student entries found.</td>
//                                 </tr>
//                             ) : (
//                                 students.map(s => (
//                                     <tr key={s.id} className="hover:bg-slate-50 transition-colors">
//                                         <td className="p-4 font-mono text-xs font-semibold text-slate-900">{s.roll_number}</td>
//                                         <td className="p-4 font-medium">{s.name}</td>
//                                         <td className="p-4">{s.class_name}</td>
//                                         <td className="p-4">{s.guardian_name}</td>
//                                         <td className="p-4">
//                                             <div className="flex items-center justify-center space-x-3">
//                                                 <button onClick={() => handleEditClick(s)} className="text-amber-500 hover:text-amber-700 transition" title="Modify Record">
//                                                     <Edit2 size={16} />
//                                                 </button>
//                                                 <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 transition" title="Delete Entry">
//                                                     <Trash2 size={16} />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//                 <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
//                     <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
//                     <div className="flex space-x-1">
//                         <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 transition"><ChevronLeft size={16} /></button>
//                         <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 transition"><ChevronRight size={16} /></button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ChevronLeft, ChevronRight, Plus, Trash2, Edit2, X } from 'lucide-react';
import '../assets/css/StudentManager.css';

export default function StudentManager() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showForm, setShowForm] = useState(false);
    
    
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [name, setName] = useState('');
    const [roll_number, setRollNumber] = useState('');
    const [class_name, setClassName] = useState(''); 
    const [guardian_name, setGuardianName] = useState('');

    const fetchStudents = () => {
        axios.get(`http://localhost:5000/api/students?search=${search}&page=${page}&limit=5`)
            .then(res => {
                const recordData = Array.isArray(res.data) ? res.data : (res.data.data || []);
                const totalRecords = res.data.total || recordData.length;
                
                setStudents(recordData);
                setTotalPages(Math.ceil(totalRecords / 5) || 1);
            }).catch(err => console.error("Fetch Error:", err));
    };

    useEffect(() => { fetchStudents(); }, [search, page]);

    const resetForm = () => {
        setName(''); 
        setRollNumber(''); 
        setClassName(''); 
        setGuardianName('');
        setIsEditing(false);
        setEditId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Payload properties map 1:1 exactly with your MySQL Table Columns
        const payload = { 
            name: name.trim(), 
            roll_number: roll_number.trim(), 
            class_name: class_name.trim(), // sent exactly as class_name
            guardian_name: guardian_name.trim() 
        };

        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/students/${editId}`, payload);
            } else {
                await axios.post('http://localhost:5000/api/students', payload);
            }
            resetForm();
            fetchStudents();
        } catch (err) { 
            console.error("Submission Error Details:", err.response?.data || err.message); 
            const serverErrorMessage = err.response?.data?.error || err.response?.data?.message || "Internal Server Connection Error.";
            alert(`Error Saving Record: ${serverErrorMessage}`);
        }
    };

    const handleEditClick = (student) => {
        setIsEditing(true);
        setEditId(student.id);
        setName(student.name);
        setRollNumber(student.roll_number);
        setClassName(student.class_name); // Reads matching column directly from response rows
        setGuardianName(student.guardian_name);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if(confirm("Confirm deletion of student row entry?")) {
            try {
                await axios.delete(`http://localhost:5000/api/students/${id}`);
                fetchStudents();
            } catch (err) {
                console.error("Delete Error:", err);
            }
        }
    };

    return (
        <div className="student-container">
            <div className="directory-header">
                <h1 className="directory-title">Student Directory</h1>
                <button 
                    onClick={() => { if(showForm) resetForm(); else setShowForm(true); }} 
                    className={`btn-action ${showForm && !isEditing ? 'btn-close' : 'btn-add'}`}
                >
                    {showForm && !isEditing ? <X size={16} /> : <Plus size={16} />} 
                    <span>{showForm && !isEditing ? 'Close Panel' : 'Add Student'}</span>
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="student-form-card">
                    <div className="form-header">
                        <h2>{isEditing ? `Modify Details for Roll: ${roll_number}` : 'Register a New Student'}</h2>
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="Name" required value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Roll Number</label>
                        <input type="text" placeholder="Roll Number" required disabled={isEditing} value={roll_number} onChange={e => setRollNumber(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Class </label>
                        {/* Tied precisely to state variable name: class_name */}
                        <input type="text" placeholder="Class Name" required value={class_name} onChange={e => setClassName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Guardian Name</label>
                        <input type="text" placeholder="Guardian Name" required value={guardian_name} onChange={e => setGuardianName(e.target.value)} />
                    </div>
                    
                    <div className="form-actions">
                        {isEditing && (
                            <button type="button" onClick={resetForm} className="btn-cancel">Cancel</button>
                        )}
                        <button type="submit" className={`btn-submit ${isEditing ? 'bg-warn' : 'bg-success'}`}>
                            {isEditing ? 'Update Record' : 'Save Record'}
                        </button>
                    </div>
                </form>
            )}

            <div className="table-card">
                <div className="search-bar-container">
                    <Search className="search-icon" size={18} />
                    <input type="text" placeholder="Filter rosters by name or roll number..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                </div>
                <div className="table-wrapper">
                    <table className="student-table">
                        <thead>
                            <tr>
                                <th>Roll Number</th>
                                <th>Name</th>
                                <th>Class</th>
                                <th>Guardian</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="table-empty">No corresponding student entries found.</td>
                                </tr>
                            ) : (
                                students.map(s => (
                                    <tr key={s.id}>
                                        <td className="font-mono text-bold">{s.roll_number}</td>
                                        <td className="font-medium">{s.name}</td>
                                        <td>{s.class_name}</td>
                                        <td>{s.guardian_name}</td>
                                        <td>
                                            <div className="action-cell-buttons">
                                                <button onClick={() => handleEditClick(s)} className="action-edit" title="Modify Record">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(s.id)} className="action-delete" title="Delete Entry">
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