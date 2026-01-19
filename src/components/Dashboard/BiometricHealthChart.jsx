import React, { useContext } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader } from '../UI/Card';
import { AlertCircle } from 'lucide-react';
import { aggregateData } from '../../data/api';
import { DataContext } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

// Component
export function BiometricHealthChart() {
    const { data: rawData } = useContext(DataContext);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const data = aggregateData(rawData)
        .sort((a, b) => b.totalBioUpdates - a.totalBioUpdates)
        .slice(0, 10); // Top 10 states

    // Logic to find largest gap
    const maxGapState = [...data].sort((a, b) => {
        const gapA = a.childEnrolmentsLagged - a.totalBioUpdates;
        const gapB = b.childEnrolmentsLagged - b.totalBioUpdates;
        return gapB - gapA;
    })[0];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
                <CardHeader
                    title="Biometric Health Gap"
                    subtitle="Lagged Child Enrolments (Expected) vs Actual MBU"
                />
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
                            <XAxis
                                dataKey="state"
                                tick={{ fontSize: 10, fill: isDark ? "#cbd5e1" : "#64748b" }}
                                interval={0}
                                angle={-30}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                stroke="#94a3b8"
                                tick={{ fill: "#475569" }} // Slate-600
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke={isDark ? "#2dd4bf" : "#0f766e"}
                                tick={{ fill: isDark ? "#2dd4bf" : "#0f766e" }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: isDark ? '#0f172a' : '#fff',
                                    borderColor: isDark ? '#334155' : '#ccc',
                                    color: isDark ? '#fff' : '#000'
                                }}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <Bar
                                yAxisId="left"
                                dataKey="childEnrolmentsLagged"
                                name="Expected Updates (from 5y Ago)"
                                barSize={20}
                                fill="#c7d2fe" // Indigo-200
                                radius={[4, 4, 0, 0]}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="totalBioUpdates"
                                name="Actual Biometric Updates"
                                stroke="#0f766e" // Teal-700
                                strokeWidth={3}
                                dot={{ fill: '#0f766e', r: 4 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card>
                <CardHeader title="MBU Insights" />
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-indigo-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-semibold text-indigo-900">High Discrepancy Alert</h4>
                            <p className="text-sm text-indigo-700 mt-1">
                                {maxGapState ? maxGapState.state : "N/A"} shows the largest gap between expected and actual biometric updates.
                                Targeted camps recommended.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Priority Districts</h4>
                    {/* Mock Priority List - In real app, we would drill down to district data */}
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-lg group hover:border-indigo-200 transition-colors">
                            <span className="text-sm font-medium text-slate-700">District {String.fromCharCode(65 + i)}</span>
                            <span className="text-xs px-2 py-1 bg-red-50 text-red-600 font-medium rounded-full border border-red-100">Critical</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
