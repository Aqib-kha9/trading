import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, TrendingUp, Users, DollarSign, Wallet } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import UserTable from '../../components/tables/UserTable';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

// Mock Data for a single broker
const MOCK_BROKER_DETAILS = {
    id: 'BRK-001',
    name: 'Alpha Traders',
    owner: 'Rohan Mehra',
    email: 'rohan@alphatraders.com',
    phone: '+91 9876543210',
    location: 'Mumbai, Maharashtra',
    status: 'Active',
    joinedDate: '15 Jan 2024',
    commission: 20,
    totalRevenue: 540000,
    payoutDue: 45000,
};

// Mock Clients for this broker
const MOCK_BROKER_CLIENTS = [
    { id: 1, clientId: 'MS-1001', name: 'Rajesh Kumar', email: 'rajesh@example.com', ip: '192.168.1.101', equity: 150000, marginUsed: 45000, pnl: 12500, plan: 'Options Segment', status: 'Active' },
    { id: 2, clientId: 'MS-1005', name: 'Priya Sharma', email: 'priya@example.com', ip: '192.168.1.105', equity: 75000, marginUsed: 70000, pnl: -5000, plan: 'Comodity Segment', status: 'Active' },
];

const StatCard = ({ label, value, icon: Icon, subValue, highlight }) => (
    <Card className="p-4 bg-[#050505] border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
            <Icon size={48} />
        </div>
        <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <Icon size={12} /> {label}
            </div>
            <div className={`text-2xl font-black tracking-tight ${highlight ? 'text-primary' : 'text-foreground'}`}>
                {value}
            </div>
            {subValue && <div className="text-[10px] text-muted-foreground">{subValue}</div>}
        </div>
    </Card>
);

const BrokerDetails = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const brokerID = searchParams.get('id') || 'BRK-001'; // Default for mock

    // Mock Chart Data
    const data = [
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 2000 },
        { name: 'Apr', value: 2780 },
        { name: 'May', value: 1890 },
        { name: 'Jun', value: 2390 },
        { name: 'Jul', value: 3490 },
    ];

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/brokers/all')}
                        className="p-2 rounded-lg border border-white/5 hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-foreground">{MOCK_BROKER_DETAILS.name}</h1>
                            <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                                {MOCK_BROKER_DETAILS.status}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                            ID: <span className="font-mono text-xs">{MOCK_BROKER_DETAILS.id}</span>
                            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                            Joined {MOCK_BROKER_DETAILS.joinedDate}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2 text-xs">
                        <Mail size={14} /> Send Email
                    </Button>
                    <Button variant="primary" className="gap-2 text-xs font-bold shadow-lg shadow-primary/20">
                        Edit Profile
                    </Button>
                </div>
            </div>

            {/* Info and Stats Grid */}
            <div className="grid grid-cols-3 gap-6 shrink-0">
                {/* Profile Card */}
                <Card className="col-span-1 p-5 bg-[#050505] border-white/5 space-y-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary font-bold text-lg border border-white/10">
                            {MOCK_BROKER_DETAILS.name.substring(0, 2)}
                        </div>
                        <div>
                            <div className="text-sm font-bold">{MOCK_BROKER_DETAILS.owner}</div>
                            <div className="text-xs text-muted-foreground">Owner / Manager</div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Mail size={14} className="shrink-0" /> {MOCK_BROKER_DETAILS.email}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Phone size={14} className="shrink-0" /> {MOCK_BROKER_DETAILS.phone}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <MapPin size={14} className="shrink-0" /> {MOCK_BROKER_DETAILS.location}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2 border-t border-white/5">
                            <Briefcase size={14} className="shrink-0 text-primary" />
                            <span className="text-foreground font-bold">{MOCK_BROKER_DETAILS.commission}% Commission Share</span>
                        </div>
                    </div>
                </Card>

                {/* Stats & Revenue */}
                <div className="col-span-2 grid grid-cols-2 gap-4">
                    <StatCard
                        label="Total Revenue Generated"
                        value={`₹ ${MOCK_BROKER_DETAILS.totalRevenue.toLocaleString()}`}
                        icon={TrendingUp}
                        subValue="+12% from last month"
                    />
                    <StatCard
                        label="Total Clients"
                        value={MOCK_BROKER_CLIENTS.length}
                        icon={Users}
                        subValue="2 joined this week"
                    />
                    <StatCard
                        label="Commission Paid"
                        value={`₹ ${(MOCK_BROKER_DETAILS.totalRevenue * 0.8).toLocaleString()}`}
                        icon={DollarSign}
                        subValue="Lifetime payouts"
                    />
                    <StatCard
                        label="Payout Due"
                        value={`₹ ${MOCK_BROKER_DETAILS.payoutDue.toLocaleString()}`}
                        icon={Wallet}
                        highlight
                        subValue="Next payout: 01 Feb"
                    />
                </div>
            </div>

            {/* Clients Table Section */}
            <div className="flex-1 min-h-0 flex flex-col gap-3">
                <div className="flex items-center justify-between shrink-0">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Users size={14} /> Assigned Clients
                    </h3>
                </div>
                <div className="flex-1 min-h-0 relative">
                    <UserTable users={MOCK_BROKER_CLIENTS} onAction={() => { }} />
                </div>
            </div>
        </div>
    );
};

export default BrokerDetails;
