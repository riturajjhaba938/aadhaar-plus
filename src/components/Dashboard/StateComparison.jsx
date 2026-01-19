import React, { useState, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { Card } from '../UI/Card';
import { STATE_LIST, aggregateData } from '../../data/api';
import { ArrowRightLeft, TrendingUp, Users, Fingerprint } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export function StateComparison({ onClose }) {
    const { data } = useContext(DataContext);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [stateA, setStateA] = useState(STATE_LIST[0] || 'Maharashtra');
    const [stateB, setStateB] = useState(STATE_LIST[1] || 'Karnataka');

    if (!data || data.length === 0) return null;

    // Helper to get stats for a state
    const getStats = (stateName) => {
        const stateData = data.filter(d => d.state === stateName);
        const aggArray = aggregateData(stateData);
        const agg = aggArray.length > 0 ? aggArray[0] : {};
        // Calculate derived metrics
        const totalEnrol = agg.totalEnrolment || 0;
        const totalUpdate = agg.totalUpdates || 0;
        const bioUpdates = agg.totalBiometricUpdates || 0;

        const mbuCompliance = totalEnrol > 0 ? (bioUpdates / totalEnrol) * 100 : 0;
        const saturation = totalEnrol > 0 ? (totalUpdate / totalEnrol) * 100 : 0;

        return {
            name: stateName,
            enrolment: totalEnrol,
            updates: totalUpdate,
            compliance: mbuCompliance,
            saturation: saturation
        };
    };

    const statsA = getStats(stateA);
    const statsB = getStats(stateB);

    const chartData = [
        { name: 'MBU Compliance %', "State A": statsA.compliance, "State B": statsB.compliance },
        { name: 'Update Saturation %', "State A": statsA.saturation, "State B": statsB.saturation },
    ];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 mb-8">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-slate-800">State Comparison Engine</h3>
                </div>
                <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-800 px-3 py-1 hover:bg-slate-200 rounded-md transition-colors">
                    Close
                </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls & Metrics */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    {/* State A Column */}
                    <div className="space-y-4">
                        <select
                            value={stateA}
                            onChange={(e) => setStateA(e.target.value)}
                            className="w-full p-3 rounded-lg border border-slate-300 bg-white font-medium text-lg outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {STATE_LIST.sort().map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div>
                                <p className="text-sm text-slate-500 uppercase font-semibold">Total Enrolments</p>
                                <p className="text-3xl font-bold text-slate-900">{statsA.enrolment.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 uppercase font-semibold">Updates Processed</p>
                                <p className="text-xl font-bold text-slate-700">{statsA.updates.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* VS Badge */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-100 rounded-full items-center justify-center border-4 border-white shadow-sm z-10">
                        <span className="font-bold text-slate-400 text-xs">VS</span>
                    </div>

                    {/* State B Column */}
                    <div className="space-y-4">
                        <select
                            value={stateB}
                            onChange={(e) => setStateB(e.target.value)}
                            className="w-full p-3 rounded-lg border border-slate-300 bg-white font-medium text-lg outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {STATE_LIST.sort().map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div className="text-right">
                                <p className="text-sm text-slate-500 uppercase font-semibold">Total Enrolments</p>
                                <p className="text-3xl font-bold text-slate-900">{statsB.enrolment.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-500 uppercase font-semibold">Updates Processed</p>
                                <p className="text-xl font-bold text-slate-700">{statsB.updates.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comparative Chart */}
                <div className="lg:col-span-3">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-slate-500" />
                        Performance Metrics Comparison
                    </h4>
                    <div className="h-[300px] w-full border border-slate-200 rounded-lg p-4 bg-slate-50">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderColor: '#e2e8f0',
                                        color: '#0f172a'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="State A" fill="#3b82f6" name={stateA} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="State B" fill="#93c5fd" name={stateB} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
