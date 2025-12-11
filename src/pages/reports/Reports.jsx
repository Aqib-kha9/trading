import React, { useState } from 'react';
import { clsx } from 'clsx';
import { BarChart2, TrendingUp, Users, Download, Calendar, DollarSign, Activity } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import AdminRevenueGraph from '../../components/dashboard/AdminRevenueGraph';
import GrowthGraph from '../../components/dashboard/GrowthGraph';
import PerformanceGraph from '../../components/dashboard/PerformanceGraph';

const StatCard = ({ title, value, change, positive }) => (
    <Card className="bg-card border-border p-4 relative overflow-hidden group hover:border-primary/50 transition-all">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={40} />
        </div>
        <div className="space-y-1 relative z-10">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{title}</h4>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{value}</span>
                <span className={clsx("text-[10px] font-bold", positive ? "text-emerald-500" : "text-red-500")}>
                    {positive ? "+" : ""}{change}%
                </span>
            </div>
        </div>
    </Card>
);

const Reports = () => {
    const [activeTab, setActiveTab] = useState('revenue');

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Header with Tabs */}
            <div className="flex flex-col gap-4 shrink-0">
                {/* Tab Navigation */}
                <div className="flex items-center gap-1 border-b border-border">
                    <button
                        onClick={() => setActiveTab('revenue')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'revenue'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <DollarSign size={14} /> Revenue
                    </button>
                    <button
                        onClick={() => setActiveTab('subscription')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'subscription'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <Users size={14} /> Subscriptions
                    </button>
                    <button
                        onClick={() => setActiveTab('signals')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'signals'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <TrendingUp size={14} /> Signal Performance
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 relative overflow-y-auto custom-scrollbar">

                {/* Toolbar */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-card border border-border rounded-lg p-1 flex items-center">
                            <button className="px-3 py-1 text-[10px] font-bold text-foreground bg-primary/20 rounded">This Month</button>
                            <button className="px-3 py-1 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors">Last Quarter</button>
                            <button className="px-3 py-1 text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors">Yearly</button>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 border-border shadow-sm">
                        <Download size={14} /> Export CSV
                    </Button>
                </div>

                <div className="max-w-6xl mx-auto space-y-6 pb-10">

                    {activeTab === 'revenue' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <StatCard title="Total Revenue" value="₹ 12.5L" change="12.5" positive />
                                <StatCard title="Avg. Revenue / User" value="₹ 450" change="2.1" positive />
                                <StatCard title="Refunds Processed" value="₹ 12K" change="-5.4" positive />
                                <StatCard title="Projected" value="₹ 15L" change="8.2" positive />
                            </div>

                            <div className="h-[400px] w-full">
                                <AdminRevenueGraph />
                            </div>
                        </div>
                    )}

                    {activeTab === 'subscription' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <StatCard title="New Subscribers" value="1,240" change="8.5" positive />
                                <StatCard title="Churn Rate" value="4.2%" change="-1.1" positive />
                                <StatCard title="Active Plans" value="8,500" change="12.3" positive />
                                <StatCard title="Retention" value="85%" change="0.5" positive />
                            </div>

                            <div className="h-[400px] w-full">
                                <GrowthGraph />
                            </div>
                        </div>
                    )}

                    {activeTab === 'signals' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <StatCard title="Win Rate" value="76%" change="2.4" positive />
                                <StatCard title="Total Signals" value="450" change="15" positive />
                                <StatCard title="Avg. Profit" value="12%" change="1.2" positive />
                                <StatCard title="Loss Streak" value="3" change="-10" positive />
                            </div>

                            <div className="h-[400px] w-full">
                                <PerformanceGraph />
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Reports;
