
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../Layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Clock, LogOut } from 'lucide-react';
import { format } from 'date-fns';

export function Profile() {
    const { user, logout } = useAuth();

    // Fallback if user is null (should be handled by ProtectedRoute)
    if (!user) return null;

    return (
        <DashboardLayout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                    <p className="text-slate-500">Manage your account settings and preferences</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
                    <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 text-3xl font-bold border border-teal-100">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                            <p className="text-slate-500 flex items-center justify-center sm:justify-start gap-2 mt-1">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-medium border border-teal-100">
                                    <Shield className="w-3 h-3" />
                                    Administrator
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200">
                                    <Clock className="w-3 h-3" />
                                    Member since {format(new Date(), 'MMMM yyyy')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Personal Information
                            </label>
                            <div className="space-y-4">
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="text-xs text-slate-500 mb-0.5">Full Name</div>
                                    <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="text-xs text-slate-500 mb-0.5">Email Address</div>
                                    <div className="text-sm font-medium text-slate-900">{user.email}</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                System Access
                            </label>
                            <div className="space-y-4">
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="text-xs text-slate-500 mb-0.5">Role</div>
                                    <div className="text-sm font-medium text-slate-900">{user.role || 'User'}</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="text-xs text-slate-500 mb-0.5">User ID</div>
                                    <div className="text-sm font-medium text-slate-900 font-mono">
                                        UID-{user.id?.toString().padStart(6, '0')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 sm:p-8 border-t border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4">Account Actions</h3>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors text-sm font-medium shadow-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Security Logs Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Security Activity</h2>
                    <SecurityLogs />
                </div>
            </div>
        </DashboardLayout>
    );
}

function SecurityLogs() {
    const [logs, setLogs] = React.useState([]);
    const { user } = useAuth(); // To trigger re-fetch if needed

    React.useEffect(() => {
        const fetchLogs = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3000';
                const res = await fetch(`${API_URL}/api/logs`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setLogs(data);
                }
            } catch (err) {
                console.error("Failed to fetch logs", err);
            }
        };
        fetchLogs();
    }, []);

    if (logs.length === 0) {
        return (
            <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <Shield className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500 dark:text-slate-400">No recent activity found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3">Action</th>
                            <th className="px-6 py-3">Details</th>
                            <th className="px-6 py-3">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${log.action === 'LOGIN' ? 'bg-green-100 text-green-800' :
                                        log.action === 'REGISTER' ? 'bg-blue-100 text-blue-800' :
                                            'bg-slate-100 text-slate-800'
                                        }`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{log.details}</td>
                                <td className="px-6 py-4 text-slate-500">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
