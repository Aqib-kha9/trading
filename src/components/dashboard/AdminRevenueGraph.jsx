import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Maximize2, MoreHorizontal, Calendar, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../components/theme-provider';

const AdminRevenueGraph = ({ filter = 'month' }) => {
    const { theme } = useTheme();

    const [data, setData] = useState([]);

    // Mock Data Sets
    const datasets = {
        month: [
            { time: '01 Dec', revenue: 45000, users: 120 },
            { time: '05 Dec', revenue: 52000, users: 135 },
            { time: '10 Dec', revenue: 49000, users: 140 },
            { time: '15 Dec', revenue: 63000, users: 158 },
            { time: '20 Dec', revenue: 58000, users: 162 },
            { time: '25 Dec', revenue: 75000, users: 185 },
            { time: '30 Dec', revenue: 82000, users: 210 },
        ],
        quarter: [
            { time: 'Oct W1', revenue: 150000, users: 450 },
            { time: 'Oct W2', revenue: 165000, users: 480 },
            { time: 'Nov W1', revenue: 180000, users: 520 },
            { time: 'Nov W2', revenue: 175000, users: 550 },
            { time: 'Dec W1', revenue: 210000, users: 620 },
            { time: 'Dec W2', revenue: 250000, users: 750 },
        ],
        year: [
            { time: 'Jan', revenue: 450000, users: 1200 },
            { time: 'Mar', revenue: 520000, users: 1350 },
            { time: 'May', revenue: 680000, users: 1500 },
            { time: 'Jul', revenue: 750000, users: 1850 },
            { time: 'Sep', revenue: 920000, users: 2100 },
            { time: 'Nov', revenue: 1100000, users: 2400 },
            { time: 'Dec', revenue: 1250000, users: 2800 },
        ],
    };

    useEffect(() => {
        setData(datasets[filter] || datasets['month']);
    }, [filter]);

    return (
        <div className="h-full flex flex-col bg-background/50 border border-white/5 rounded-xl shadow-xl overflow-hidden relative group hover:border-primary/50 transition-all duration-500">
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none"></div>

            {/* Top Shine */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Header */}
            <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight text-white/90 flex items-center gap-2">
                            REVENUE GROWTH <span className="text-[10px] text-muted-foreground font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5 uppercase">{filter === 'month' ? 'Current Month' : filter === 'quarter' ? 'Q4 2024' : '2024 YTD'}</span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-1.5 text-muted-foreground hover:text-white transition-colors"><Maximize2 size={14} /></button>
                </div>
            </div>

            {/* Stats Overlay */}
            <div className="absolute top-16 left-6 z-10 pointer-events-none">
                <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Total Revenue</span>
                    <span className="text-3xl font-bold text-white tracking-tight flex items-end gap-2">
                        {filter === 'month' ? '₹ 8,50,000' : filter === 'quarter' ? '₹ 45,20,000' : '₹ 1,80,00,000'}
                        <span className="text-sm font-medium text-emerald-500 mb-1.5 flex items-center gap-0.5">+12.5% <ArrowUpRight size={12} /></span>
                    </span>
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 w-full min-h-0 pt-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#525252', fontSize: 10, fontFamily: 'monospace' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#525252', fontSize: 10, fontFamily: 'monospace' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#09090b',
                                borderColor: 'rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                            }}
                            itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                            labelStyle={{ color: '#a1a1aa', fontSize: '10px', marginBottom: '4px' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                        <Area
                            type="monotone"
                            dataKey="users"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorUsers)"
                            connectNulls
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-700 group-hover:w-full"></div>
        </div>
    );
};

export default AdminRevenueGraph;
