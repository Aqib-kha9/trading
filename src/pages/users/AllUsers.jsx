import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, ShieldAlert, Download, Users, Activity, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserTable from '../../components/tables/UserTable';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Mock Data (Unchanged)
const MOCK_USERS = [
    {
        id: 1, clientId: 'MS-1001', name: 'Rajesh Kumar', email: 'rajesh@example.com', ip: '192.168.1.101',
        equity: 150000, marginUsed: 45000, pnl: 12500, plan: 'Options Segment', status: 'Active',
        subBrokerId: 'SB001', subBrokerName: 'Rahul Sharma', subscriptionStart: '2025-12-01', subscriptionExpiry: '2026-01-30'
    },
    {
        id: 2, clientId: 'MS-1002', name: 'Amit Singh', email: 'amit@example.com', ip: '10.0.0.55',
        equity: 5000, marginUsed: 80000, pnl: -12000, plan: 'Forex Segment', status: 'Liquidated',
        subBrokerId: 'DIRECT', subBrokerName: 'Direct Client', subscriptionStart: '2025-11-15', subscriptionExpiry: '2025-12-15'
    },
    {
        id: 3, clientId: 'MS-1003', name: 'Sneha Gupta', email: 'sneha@example.com', ip: '172.16.0.23',
        equity: 500000, marginUsed: 120000, pnl: 45000, plan: 'Equity Segment', status: 'Active',
        subBrokerId: 'SB002', subBrokerName: 'Priya Patel', subscriptionStart: '2025-12-10', subscriptionExpiry: '2026-03-10'
    },
    {
        id: 4, clientId: 'MS-1004', name: 'Vikram Malhotra', email: 'vikram@example.com', ip: '192.168.0.12',
        equity: 25000, marginUsed: 0, pnl: 0, plan: 'Free Demo Trial', status: 'Blocked',
        subBrokerId: 'SB001', subBrokerName: 'Rahul Sharma', subscriptionStart: '2025-12-01', subscriptionExpiry: '2025-12-05'
    },
    {
        id: 5, clientId: 'MS-1005', name: 'Priya Sharma', email: 'priya@example.com', ip: '192.168.1.105',
        equity: 75000, marginUsed: 70000, pnl: -5000, plan: 'Comodity Segment', status: 'Active',
        subBrokerId: 'DIRECT', subBrokerName: 'Direct Client', subscriptionStart: '2025-12-14', subscriptionExpiry: '2026-01-14'
    },
];

const SUB_BROKERS = [
    { id: 'All', name: 'All Brokers' },
    { id: 'DIRECT', name: 'Direct Clients' },
    { id: 'SB001', name: 'Rahul Sharma (SB001)' },
    { id: 'SB002', name: 'Priya Patel (SB002)' },
];

const STATUS_OPTIONS = ['All', 'Active', 'Liquidated', 'Blocked'];

const UsersList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [subBrokerFilter, setSubBrokerFilter] = useState('All');

    useEffect(() => {
        setUsers(MOCK_USERS);
    }, []);

    const handleAction = (action, user) => {
        if (action === 'view') navigate(`/users/details?id=${user.id}`);
        else if (action === 'edit') navigate(`/users/edit?id=${user.id}`);
        else if (action === 'liquidate') alert(`LIQUIDATING ${user.clientId}`);
        else if (action === 'block') alert(`BLOCKING ${user.name}`);
    };

    const filteredUsers = users.filter(user => {
        const matchesStatus = filter === 'All' || user.status === filter;
        const matchesSubBroker = subBrokerFilter === 'All' || user.subBrokerId === subBrokerFilter;
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.clientId.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSubBroker && matchesSearch;
    });

    return (
        <div className="h-full flex flex-col gap-2">
            {/* Toolbar - Simple & Clean */}
            <div className="shrink-0 bg-card border border-white/5 p-3 rounded-lg shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                {/* Left Section: Title & Filters (Now both are Dropdowns) */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full lg:w-auto">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2 shrink-0">
                        <ShieldAlert size={16} className="text-primary" />
                        Client Database
                    </h2>

                    <div className="hidden md:block h-6 w-[1px] bg-white/10"></div>

                    {/* Filters Wrapper */}
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">

                        {/* Status Filter Dropdown */}
                        <div className="flex items-center gap-2 text-xs shrink-0 w-full sm:w-auto">
                            <span className="text-muted-foreground font-medium shrink-0">Status:</span>
                            <div className="relative w-full sm:w-20">
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="w-full bg-secondary/30 border border-white/10 text-foreground text-[10px] font-medium rounded px-2 py-1 appearance-none focus:border-primary focus:outline-none cursor-pointer"
                                >
                                    {STATUS_OPTIONS.map(status => (
                                        <option key={status} value={status} className="bg-[#0f172a] text-white">{status}</option>
                                    ))}
                                </select>
                                <Activity size={12} className="absolute right-2 top-1.5 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        <div className="hidden md:block h-6 w-[1px] bg-white/10"></div>

                        {/* Broker Filter Dropdown */}
                        <div className="flex items-center gap-2 text-xs shrink-0 w-full sm:w-auto">
                            <span className="text-muted-foreground font-medium shrink-0">Broker:</span>
                            <div className="relative w-full sm:w-30">
                                <select
                                    value={subBrokerFilter}
                                    onChange={(e) => setSubBrokerFilter(e.target.value)}
                                    className="w-full bg-secondary/30 border border-white/10 text-foreground text-[10px] font-medium rounded px-2 py-1 appearance-none focus:border-primary focus:outline-none cursor-pointer"
                                >
                                    {SUB_BROKERS.map(sb => (
                                        <option key={sb.id} value={sb.id} className="bg-[#0f172a] text-white">{sb.name}</option>
                                    ))}
                                </select>
                                <Users size={12} className="absolute right-2 top-1.5 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Search & Actions */}
                <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
                    <div className="relative group w-full md:w-auto">
                        <Search className="absolute left-3 top-2 text-muted-foreground" size={12} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text"
                            placeholder="SEARCH CLIENT ID..."
                            className="bg-secondary/30 border border-white/5 h-8 pl-9 pr-3 w-full md:w-56 text-[11px] font-mono rounded-lg focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-0 transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        {/* <Button variant="outline" size="sm" className="h-8 flex-1 md:flex-none text-[11px] border-white/10 gap-1.5 rounded-lg hover:border-primary/50 justify-center">
                            <Download size={12} /> Export
                        </Button> */}
                        <Button variant="primary" size="sm" className="h-8 flex-1 md:flex-none text-[11px] gap-1.5 rounded-lg font-bold shadow-lg shadow-primary/20 justify-center">
                            <Plus size={12} /> New Client
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Table Area */}
            <div className="flex-1 min-h-0 relative">
                <UserTable users={filteredUsers} onAction={handleAction} />
            </div>

            {/* Footer Stats */}
            <div className="h-9 bg-muted/30 border border-border rounded-lg flex items-center justify-between px-4 text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                <div>Total Clients: <span className="text-foreground font-bold">{users.length}</span></div>
                <div className="flex gap-6">
                    {subBrokerFilter !== 'All' && <span>Filter: <span className="text-primary font-bold">{SUB_BROKERS.find(s => s.id === subBrokerFilter)?.name}</span></span>}
                    <span>Active Equity: <span className="text-emerald-500 font-bold">₹ {(8500000).toLocaleString()}</span></span>
                </div>
            </div>
        </div>
    );
};

export default UsersList;
