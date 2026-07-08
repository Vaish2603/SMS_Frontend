import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, Users, GraduationCap, ClipboardCheck, 
    FileText, Megaphone, Calendar, LogOut 
} from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/students', label: 'Students', icon: GraduationCap },
        { path: '/teachers', label: 'Teachers', icon: Users },
        { path: '/attendance', label: 'Attendance', icon: ClipboardCheck },
        { path: '/leaves', label: 'Leave Requests', icon: FileText },
        { path: '/notices', label: 'Notice Board', icon: Megaphone },
        { path: '/events', label: 'Events', icon: Calendar },
    ];

    return (
        <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 text-xl font-bold border-b border-slate-800 tracking-wide text-indigo-400">
                School Management
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}

// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// export default function Sidebar({ children }) {
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   const menuItems = [
//     { name: 'Dashboard', path: '/dashboard' },
//     { name: 'Student Management', path: '/students' },
//     { name: 'Teacher Management', path: '/teachers' },
//     { name: 'Attendance Matrix', path: '/attendance' },
//     { name: 'Leave Management', path: '/leaves' },
//     { name: 'Notice Board', path: '/notices' },
//     { name: 'Events Panel', path: '/events' },
//     { name: 'My Profile', path: '/profile' },
//   ];

//   return (
//     <div className="flex min-h-screen bg-slate-100">
//       <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col fixed h-full">
//         <div className="p-5 font-bold text-xl border-b border-slate-800 text-white tracking-wide">
//           SMS Admin Portal
//         </div>
//         <nav className="flex-1 p-4 space-y-1">
//           {menuItems.map((item) => (
//             <Link key={item.name} to={item.path} className="block px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
//               {item.name}
//             </Link>
//           ))}
//         </nav>
//         <div className="p-4 border-t border-slate-800">
//           <button onClick={() => { logout(); navigate('/'); }} className="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 rounded-lg text-sm font-medium transition-colors">
//             Exit Console
//           </button>
//         </div>
//       </aside>
//       <main className="flex-1 ml-64 p-8">{children}</main>
//     </div>
//   );
// }