import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './components/StudentManager'
import AttendanceManager from './components/AttendanceManager';
import Teachers from './components/Teachers';
import Leaves from './components/Leaves';
import Notices from './components/Notices';
import Events from './components/Events';

// Protected Route Guard Wrapper Interceptor
const GuardedLayout = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Sidebar />
            <div className="pl-64">
                <main className="p-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Route Gateway */}
                    <Route path="/login" element={<Login />} />

                    {/* Authenticated Application Shell Routes */}
                    <Route path="/dashboard" element={<GuardedLayout><Dashboard /></GuardedLayout>} />
                    <Route path="/students" element={<GuardedLayout><Students /></GuardedLayout>} />
                    <Route path="/attendance" element={<GuardedLayout><AttendanceManager /></GuardedLayout>} />
                    <Route path="/teachers" element={<GuardedLayout><Teachers /></GuardedLayout>} />
                    <Route path="/leaves" element={<GuardedLayout><Leaves /></GuardedLayout>} />
                    <Route path="/notices" element={<GuardedLayout><Notices /></GuardedLayout>} />
                    <Route path="/events" element={<GuardedLayout><Events /></GuardedLayout>} />

                    {/* Catchall Route Redirect */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
