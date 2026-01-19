import React, { useContext, useMemo } from 'react';
import {
    ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea
} from 'recharts';
import { Card, CardHeader } from '../UI/Card';
import { DataContext } from '../../context/DataContext';
import { TrendingUp, Activity, Sparkles, TrendingDown } from 'lucide-react';
import { format, addMonths } from 'date-fns';

export function ForecastingChart() {
    const { data: rawData } = useContext(DataContext);

    // 1. Process Historical Data & Calculate Trend
    const { chartData, annualTrend } = useMemo(() => {
        if (!rawData || rawData.length === 0) return { chartData: [], annualTrend: 0 };

        // Aggregate by period
        const historyMap = new Map();
        rawData.forEach(d => {
            if (!d.period) return;
            if (!historyMap.has(d.period)) {
                historyMap.set(d.period, {
                    period: d.period,
                    displayDate: d.period,
                    index: 0,
                    actual: 0
                });
            }
            historyMap.get(d.period).actual += d.enrolment.total;
        });

        // Sort
        const history = Array.from(historyMap.values()).sort((a, b) => a.period.localeCompare(b.period));
        if (history.length === 0) return { chartData: [], annualTrend: 0 };

        // Index & Date Format
        history.forEach((d, i) => {
            d.index = i;
            try {
                const date = new Date(d.period);
                if (!isNaN(date)) d.displayDate = format(date, 'MMM yyyy');
            } catch (e) {
                d.displayDate = d.period;
            }
        });

        // 2. Linear Regression (Slope/Intercept)
        const n = history.length;
        if (n < 2) return { chartData: history, annualTrend: 0 };

        const sumX = history.reduce((acc, d) => acc + d.index, 0);
        const sumY = history.reduce((acc, d) => acc + d.actual, 0);
        const sumXY = history.reduce((acc, d) => acc + (d.index * d.actual), 0);
        const sumXX = history.reduce((acc, d) => acc + (d.index * d.index), 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        const annualTrendVal = Math.round(slope * 12);

        // Apply Trend Line to History
        history.forEach(d => {
            d.trend = Math.round(slope * d.index + intercept);
        });

        // 3. Predictions
        const predictions = [];
        const lastPoint = history[n - 1];
        const lastIndex = lastPoint.index;

        let lastDateObj = new Date();
        try {
            const d = new Date(lastPoint.period);
            if (!isNaN(d)) lastDateObj = d;
        } catch (e) { }

        // Future Points
        for (let i = 1; i <= 6; i++) {
            const nextIndex = lastIndex + i;
            const predictedValue = Math.max(0, Math.round(slope * nextIndex + intercept));

            const nextDate = addMonths(lastDateObj, i);
            const nextPeriodStr = format(nextDate, 'yyyy-MM-dd');
            const nextDisplayStr = format(nextDate, 'MMM yyyy');

            predictions.push({
                period: nextPeriodStr,
                displayDate: nextDisplayStr,
                index: nextIndex,
                forecast: predictedValue, // The explicit prediction line
                trend: predictedValue,    // The continuous trend line
                isPrediction: true
            });
        }

        // Anchor the forecast line to the last actual point for visual continuity
        // We add a 'forecast' value to the last history item
        history[history.length - 1].forecast = history[history.length - 1].actual;

        return {
            chartData: [...history, ...predictions],
            annualTrend: annualTrendVal
        };

    }, [rawData]);

    const isPositiveTrend = annualTrend >= 0;
    const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;
    const trendColor = isPositiveTrend ? "text-emerald-600" : "text-rose-600";
    const trendBg = isPositiveTrend ? "bg-emerald-50" : "bg-rose-50";

    return (
        <Card className="mb-8 border-none ring-1 ring-slate-200 shadow-xl bg-gradient-to-br from-white to-slate-50 overflow-hidden">
            <CardHeader
                title={
                    <div className="flex items-center gap-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 text-xl font-bold">
                            Predictive Forecasting
                        </span>
                        <div className="relative">
                            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                        </div>
                    </div>
                }
                subtitle="AI-Driven Trend Analysis for Next 6 Months"
                action={
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-2 border border-slate-200 ${trendBg} ${trendColor}`}>
                        <TrendIcon className="w-3 h-3" />
                        Annual Trend: {annualTrend > 0 ? '+' : ''}{annualTrend.toLocaleString()} / yr
                    </div>
                }
            />

            <div className="h-[450px] w-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <defs>
                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.6} />
                        <XAxis
                            dataKey="displayDate"
                            tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                            interval={chartData.length > 12 ? 2 : 0}
                            angle={-30}
                            textAnchor="end"
                            height={60}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                padding: '12px'
                            }}
                            cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5 5' }}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />

                        {/* 1. Actuals Area */}
                        <Area
                            type="monotone"
                            dataKey="actual"
                            name="Historical Performance"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            fill="url(#colorActual)"
                            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                        />

                        {/* 2. Linear Trend Line (Overall) */}
                        <Line
                            type="monotone"
                            dataKey="trend"
                            name="Linear Trend Fit"
                            stroke="#f59e0b" // Amber-500
                            strokeWidth={2}
                            strokeDasharray="3 3"
                            dot={false}
                            activeDot={false}
                            strokeOpacity={0.7}
                        />

                        {/* 3. Prediction Line (Future) */}
                        <Line
                            type="monotone"
                            dataKey="forecast"
                            name="AI Projected Trend"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            strokeDasharray="4 4"
                            dot={(props) => {
                                const { cx, cy, payload } = props;
                                if (payload.isPrediction) {
                                    return (
                                        <circle cx={cx} cy={cy} r={4} fill="#fff" stroke="#8b5cf6" strokeWidth={2} />
                                    );
                                }
                                return null;
                            }}
                            activeDot={{ r: 7 }}
                        />

                        <ReferenceArea
                            x1={chartData.find(d => d.isPrediction)?.displayDate}
                            x2={chartData[chartData.length - 1]?.displayDate}
                            strokeOpacity={0}
                            fill="#8b5cf6"
                            fillOpacity={0.03}
                        />

                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            <div className="px-6 pb-6 bg-slate-50/50">
                <div className="flex items-start gap-3 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                    <TrendingUp className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Growth Trajectory</p>
                        <p className="text-xs text-slate-600 mt-1">
                            The <span className="text-amber-500 font-medium">Amber Line</span> shows the calculated line-of-best-fit across your entire history.
                            We project this trend to continue, resulting in an estimated increase of <span className="font-semibold text-indigo-700">{(annualTrend / 12).toFixed(0)}</span> enrolments per month.
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
