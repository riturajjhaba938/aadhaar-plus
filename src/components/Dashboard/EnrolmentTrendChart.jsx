import React, { useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader } from '../UI/Card';
import { DataContext } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';

// Aggregate data by period (month-year)
const processData = (data) => {
    const periodMap = new Map();

    // If using Real Data check if we have enough points, otherwise it might look sparse
    data.forEach(d => {
        if (!periodMap.has(d.period)) {
            periodMap.set(d.period, {
                name: d.period,
                year: d.year,
                month: d.month,
                NewEnrolments: 0,
                TotalUpdates: 0
            });
        }
        const item = periodMap.get(d.period);
        item.NewEnrolments += d.enrolment.total;
        item.TotalUpdates += d.updates.total;
    });

    return Array.from(periodMap.values());
};

export function EnrolmentTrendChart() {
    const { data } = useContext(DataContext);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const CHART_DATA = processData(data);

    return (
        <Card className="mb-8">
            <CardHeader
                title="Enrolment vs Updates Trend"
                subtitle="Historical View"
            />
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={CHART_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fill: isDark ? "#cbd5e1" : "#64748b" }}
                            tickMargin={10}
                            interval={CHART_DATA.length > 10 ? 5 : 0}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: isDark ? "#cbd5e1" : "#64748b" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                border: isDark ? '1px solid #334155' : 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                backgroundColor: isDark ? '#0f172a' : '#fff',
                                color: isDark ? '#fff' : '#000'
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line
                            type="monotone"
                            dataKey="NewEnrolments"
                            stroke="#0d9488" // Teal-600
                            strokeWidth={3}
                            name="New Enrolments"
                            dot={{ fill: '#0d9488', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="TotalUpdates"
                            stroke="#3b82f6" // Blue-500
                            strokeWidth={3}
                            name="Total Updates"
                            dot={{ fill: '#3b82f6', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
