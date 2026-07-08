
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Trash2, Edit2, Megaphone, Clock, X, Paperclip, FileText, Eye, AlertCircle } from 'lucide-react';
import '../assets/css/Notices.css';

export default function Notices() {
    const [notices, setNotices] = useState([]);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    
    // Form and Update States
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null); 
    const [existingFilePath, setExistingFilePath] = useState('');

    const fetchNotices = () => {
        axios.get('http://localhost:5000/api/notices')
            .then(res => setNotices(Array.isArray(res.data) ? res.data : []))
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchNotices(); }, []);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setSelectedFile(null);
        setExistingFilePath('');
        setIsEditing(false);
        setEditId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        
        if (selectedFile) {
            formData.append('file', selectedFile); 
        } else if (isEditing && existingFilePath) {
            formData.append('file_path', existingFilePath);
        }

        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/notices/${editId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post('http://localhost:5000/api/notices', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            resetForm();
            fetchNotices();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Error trying to process notice configuration.");
        }
    };

    const handleEditClick = (notice) => {
        setIsEditing(true);
        setEditId(notice.id);
        setTitle(notice.title);
        setDescription(notice.description);
        setExistingFilePath(notice.file_path || '');
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (confirm("Remove notice from board permanently?")) {
            try {
                await axios.delete(`http://localhost:5000/api/notices/${id}`);
                fetchNotices();
            } catch (err) { console.error(err); }
        }
    };

    const filteredNotices = notices.filter(n => 
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="notice-dashboard-container">
            {/* Header section with clean visual hierarchy */}
            <div className="board-top-bar">
                <div>
                    <h1 className="main-board-title">Notice Hub</h1>
                    <p className="main-board-subtitle">Manage and view official campus announcements</p>
                </div>
                <button 
                    onClick={() => { if(showForm) resetForm(); else setShowForm(true); }} 
                    className={`action-pill-btn ${showForm && !isEditing ? 'pill-close' : 'pill-add'}`}
                >
                    {showForm && !isEditing ? <X size={18} /> : <Plus size={18} />} 
                    <span>{showForm && !isEditing ? 'Minimize' : 'Create Notice'}</span>
                </button>
            </div>

            {/* Slide-down Form Container */}
            {showForm && (
                <form onSubmit={handleSubmit} className="modern-notice-form animate-fade-in">
                    <div className="form-title-area">
                        <Megaphone size={18} className="form-icon-header" />
                        <h2>{isEditing ? `Update Announcement` : 'Draft New Announcement'}</h2>
                    </div>
                    
                    <div className="input-grid">
                        <div className="form-field-item">
                            <label>Notice Heading</label>
                            <input type="text" placeholder="e.g., Campus Maintenance Notice" required value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        
                        <div className="form-field-item">
                            <label>Content Description</label>
                            <textarea placeholder="Type detailed announcement notes here..." required value={description} onChange={e => setDescription(e.target.value)} rows={4} />
                        </div>

                        <div className="form-field-item">
                            <label>Media Attachment</label>
                            <label className="upload-dropzone">
                                <Paperclip size={18} />
                                <span>{isEditing ? 'Click to replace document' : 'Upload PDF or Reference Image'}</span>
                                <input type="file" accept=".pdf, .png, .jpg, .jpeg" onChange={e => setSelectedFile(e.target.files[0])} />
                            </label>
                            {selectedFile ? (
                                <div className="attachment-status-pill success-pill">Ready: {selectedFile.name}</div>
                            ) : isEditing && existingFilePath ? (
                                <div className="attachment-status-pill warning-pill">Keeping current file reference</div>
                            ) : null}
                        </div>
                    </div>

                    <div className="form-action-row">
                        <button type="button" onClick={resetForm} className="cancel-pill-btn">Dismiss</button>
                        <button type="submit" className={`submit-pill-btn ${isEditing ? 'bg-amber' : 'bg-indigo'}`}>
                            {isEditing ? 'Apply Changes' : 'Publish to Board'}
                        </button>
                    </div>
                </form>
            )}

            {/* Filter controls section */}
            <div className="board-search-card">
                <Search className="search-glass-icon" size={20} />
                <input type="text" placeholder="Search parameters by notice keyword..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {/* New Modern Grid Notice Output */}
            <div className="notices-grid-layout">
                {filteredNotices.length === 0 ? (
                    <div className="board-empty-state">
                        <AlertCircle size={48} />
                        <h3>Notice Board is Clear</h3>
                        <p>No active broadcasts match your filtering criteria parameters.</p>
                    </div>
                ) : (
                    filteredNotices.map(notice => (
                        <div key={notice.id} className="notice-grid-card">
                            <div className="card-top-decoration"></div>
                            
                            <div className="notice-card-body">
                                <h3 className="notice-card-title">{notice.title}</h3>
                                <p className="notice-card-description">{notice.description}</p>
                                
                                {notice.file_path && (
                                    <div className="notice-card-attachment">
                                        <FileText size={16} />
                                        <a href={`http://localhost:5000${notice.file_path}`} target="_blank" rel="noreferrer">
                                            <Eye size={14} /> Review Attachment
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="notice-card-footer">
                                <div className="footer-timestamp">
                                    <Clock size={14} />
                                    <span>{new Date(notice.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                                </div>
                                <div className="footer-actions">
                                    <button onClick={() => handleEditClick(notice)} className="card-edit-trigger" title="Edit Bulletin">
                                        <Edit2 size={15} />
                                    </button>
                                    <button onClick={() => handleDelete(notice.id)} className="card-delete-trigger" title="Wipe Bulletin">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}