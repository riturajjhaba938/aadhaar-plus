import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader } from '../UI/Card';
import { aggregateData } from '../../data/api';
import { DataContext } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

export function MigrationChart({ onStateClick }) {
    const { data: rawData } = useContext(DataContext);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const data = aggregateData(rawData)
        .sort((a, b) => b.totalAddressUpdates - a.totalAddressUpdates)
        .slice(0, 10); // Top 10 migration hubs

    return (
        <Card className="mb-8">
            <CardHeader
                title="Migration Patterns"
                subtitle="Top States by Address Update Intensity"
                className="text-slate-800"
            />
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="state"
                            width={100}
                            tick={{ fontSize: 12, fill: isDark ? "#cbd5e1" : "#64748b" }}
                        />
                        <Tooltip
                            cursor={{ fill: isDark ? '#1e293b' : 'transparent' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const d = payload[0].payload;
                                    const ratio = d.totalEnrolment > 0 ? (d.totalAddressUpdates / d.totalEnrolment).toFixed(2) : 0;
                                    return (
                                        <div className="bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg">
                                            <p className="font-bold text-slate-800 dark:text-white">{d.state}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">Address Updates: {d.totalAddressUpdates.toLocaleString()}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Intensity Ratio: {ratio}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="totalAddressUpdates"
                            name="Inward Migration Intensity"
                            radius={[0, 4, 4, 0]}
                            barSize={24}
                            onClick={(data) => onStateClick && onStateClick(data.state)}
                            className="cursor-pointer"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={index < 3 ? '#ef4444' : '#3b82f6'}
                                    className="hover:opacity-80 transition-opacity"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
