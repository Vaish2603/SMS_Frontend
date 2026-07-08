import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Trash2, Edit2, X, Calendar, Paperclip, FileText, Video, Image } from 'lucide-react';
import '../assets/css/Events.css';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    
    // Form CRUD tracking hooks
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [existingFilePath, setExistingFilePath] = useState('');

    const fetchEvents = () => {
        axios.get('http://localhost:5000/api/events')
            .then(res => setEvents(Array.isArray(res.data) ? res.data : []))
            .catch(err => console.error(err));
    };

    useEffect(() => { fetchEvents(); }, []);

    const resetForm = () => {
        setTitle(''); setDescription(''); setEventDate('');
        setSelectedFile(null); setExistingFilePath('');
        setIsEditing(false); setEditId(null); setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('event_date', eventDate);
        
        if (selectedFile) {
            formData.append('file', selectedFile);
        } else if (isEditing && existingFilePath) {
            formData.append('file_path', existingFilePath);
        }

        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/events/${editId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post('http://localhost:5000/api/events', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            resetForm();
            fetchEvents();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Error executing processing parameters on media.");
        }
    };

    const handleEditClick = (ev) => {
        setIsEditing(true);
        setEditId(ev.id);
        setTitle(ev.title);
        setDescription(ev.description);
        setEventDate(ev.event_date.split('T')[0]);
        setExistingFilePath(ev.file_path || '');
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm("Permanently eliminate this calendar event record?")) {
            try {
                await axios.delete(`http://localhost:5000/api/events/${id}`);
                fetchEvents();
            } catch (err) { console.error(err); }
        }
    };

    // Inline utility function helper to render specific icon shapes relative to attached media format
    const renderMediaPreview = (filePath) => {
        if (!filePath) return null;
        const ext = filePath.split('.').pop().toLowerCase();
        const fullUrl = `http://localhost:5000${filePath}`;

        if (['png', 'jpg', 'jpeg'].includes(ext)) {
            return <img src={fullUrl} alt="Preview" className="media-preview-thumbnail" />;
        } else if (['mp4', 'mkv', 'mov'].includes(ext)) {
            return (
                <video className="media-preview-video" controls>
                    <source src={fullUrl} type={`video/${ext === 'mov' ? 'quicktime' : ext}`} />
                </video>
            );
        } else {
            return (
                <a href={fullUrl} target="_blank" rel="noreferrer" className="attachment-badge-link">
                    <FileText size={14} /> Open attached document PDF
                </a>
            );
        }
    };

    const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="event-container">
            <div className="directory-header">
                <h1 className="directory-title">School Events Manager</h1>
                <button onClick={() => { if(showForm) resetForm(); else setShowForm(true); }} className={`btn-action ${showForm && !isEditing ? 'btn-close' : 'btn-add'}`}>
                    {showForm && !isEditing ? <X size={16} /> : <Plus size={16} />} 
                    <span>{showForm && !isEditing ? 'Close Panel' : 'Add Event'}</span>
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="event-form-card">
                    <div className="form-header">
                        <h2>{isEditing ? `Modify Event Framework` : 'Schedule an Institutional Event'}</h2>
                    </div>
                    <div className="form-group">
                        <label>Event Headline Title</label>
                        <input type="text" placeholder="e.g., Annual Sports Meet" required value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Calendar Date</label>
                        <input type="date" required value={eventDate} onChange={e => setEventDate(e.target.value)} />
                    </div>
                    <div className="form-group md:col-span-2">
                        <label>Media Exhibit Asset (PDF, Image, Video)</label>
                        <label className="file-upload-label">
                            <Paperclip size={16} />
                            <span>Replace / Choose Asset Package</span>
                            <input type="file" accept=".pdf, .png, .jpg, .jpeg, .mp4, .mkv, .mov" onChange={e => setSelectedFile(e.target.files[0])} />
                        </label>
                        {selectedFile ? (
                            <span className="file-name-indicator">{selectedFile.name}</span>
                        ) : existingFilePath ? (
                            <span className="file-name-indicator text-warn">Retaining current file attachment</span>
                        ) : null}
                    </div>
                    <div className="form-group md:col-span-4">
                        <label>Description Details</label>
                        <textarea placeholder="Write full logistics details..." required value={description} onChange={e => setDescription(e.target.value)} rows={3} />
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" onClick={resetForm} className="btn-cancel">Cancel</button>
                        <button type="submit" className={`btn-submit ${isEditing ? 'bg-warn' : 'bg-success'}`}>
                            {isEditing ? 'Update Event' : 'Save Event'}
                        </button>
                    </div>
                </form>
            )}

            <div className="board-card">
                <div className="search-bar-container">
                    <Search className="search-icon" size={18} />
                    <input type="text" placeholder="Search events schedule..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>

                <div className="events-grid-list">
                    {filteredEvents.length === 0 ? (
                        <div className="board-empty"><p>No listed school events schedules found.</p></div>
                    ) : (
                        filteredEvents.map(ev => (
                            <div key={ev.id} className="event-item-row">
                                <div className="event-item-main">
                                    <div className="event-item-meta">
                                        <Calendar size={16} className="text-indigo" />
                                        <span className="event-date-stamp">{ev.event_date.split('T')[0]}</span>
                                        <h3 className="event-item-title">{ev.title}</h3>
                                    </div>
                                    <p className="event-item-description">{ev.description}</p>
                                    
                                    {/* Interactive contextual content display */}
                                    <div className="media-preview-container">
                                        {renderMediaPreview(ev.file_path)}
                                    </div>
                                </div>
                                <div className="event-item-actions">
                                    <button onClick={() => handleEditClick(ev)} className="action-edit" title="Modify Event"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(ev.id)} className="action-delete" title="Drop Record"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}