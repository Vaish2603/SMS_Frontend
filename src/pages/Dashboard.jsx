import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, GraduationCap, FileText } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, pendingLeaveRequests: 0 });

    useEffect(() => {
        axios.get('http://localhost:5000/api/dashboard/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error(err));
    }, []);

    const cards = [
        { title: 'Enrolled Students', val: stats.totalStudents, color: 'text-blue-600 bg-blue-100', icon: GraduationCap },
        { title: 'Active Faculty', val: stats.totalTeachers, color: 'text-emerald-600 bg-emerald-100', icon: Users },
        { title: 'Pending Leaves', val: stats.pendingLeaveRequests, color: 'text-amber-600 bg-amber-100', icon: FileText },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Administrative Metrics Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((c, i) => {
                    const Icon = c.icon;
                    return (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-between shadow-sm">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{c.title}</p>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{c.val}</p>
                            </div>
                            <div className={`p-4 rounded-xl ${c.color}`}><Icon size={24} /></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
