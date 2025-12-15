import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, ShieldAlert, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserTable from '../../components/tables/UserTable';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Mock Data for "Master Stroke" testing
const MOCK_USERS = [
    { id: 1, clientId: 'MS-1001', name: 'Rajesh Kumar', email: 'rajesh@example.com', ip: '192.168.1.101', equity: 150000, marginUsed: 45000, pnl: 12500, plan: 'Options Segment', status: 'Active' },
    { id: 2, clientId: 'MS-1002', name: 'Amit Singh', email: 'amit@example.com', ip: '10.0.0.55', equity: 5000, marginUsed: 80000, pnl: -12000, plan: 'Forex Segment', status: 'Liquidated' }, // Liquidated (Equity < 20% of Margin)
    { id: 3, clientId: 'MS-1003', name: 'Sneha Gupta', email: 'sneha@example.com', ip: '172.16.0.23', equity: 500000, marginUsed: 120000, pnl: 45000, plan: 'NFT Segment', status: 'Active' },
    { id: 4, clientId: 'MS-1004', name: 'Vikram Malhotra', email: 'vikram@example.com', ip: '192.168.0.12', equity: 25000, marginUsed: 0, pnl: 0, plan: 'Free Demo Trial', status: 'Blocked' },
    { id: 5, clientId: 'MS-1005', name: 'Priya Sharma', email: 'priya@example.com', ip: '192.168.1.105', equity: 75000, marginUsed: 70000, pnl: -5000, plan: 'Comodity Segment', status: 'Active' },
];

const UsersList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        // In real app, fetch from API
        setUsers(MOCK_USERS);
    }, []);

    const handleAction = (action, user) => {
        console.log(`Action: ${action} on user`, user);

        if (action === 'view') {
            navigate(`/users/details?id=${user.id}`);
        } else if (action === 'edit') {
            navigate(`/users/edit?id=${user.id}`);
        } else if (action === 'liquidate') {
            alert(`LIQUIDATING POSITIONS for ${user.clientId}. Logic: Equity reached 20% limit.`);
        } else if (action === 'block') {
            // In real app, call API to block
            alert(`Blocking user ${user.name}`);
        }
    };

    const filteredUsers = users.filter(user =>
        (filter === 'All' || user.status === filter) &&
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.clientId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="h-full flex flex-col gap-2">
            {/* Toolbar */}
            <div className="flex items-center justify-between shrink-0 bg-card border border-white/5 p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                        <ShieldAlert size={16} className="text-primary" />
                        Client Database
                    </h2>

                    <div className="h-6 w-[1px] bg-white/10"></div>

                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground font-medium">Status:</span>
                        {['All', 'Active', 'Liquidated', 'Blocked'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-2.5 py-1 rounded-md border text-[10px] font-bold transition-all uppercase tracking-wide ${filter === f ? 'border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'border-transparent text-muted-foreground hover:bg-muted/20 hover:text-foreground'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-2 text-muted-foreground" size={12} />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text"
                            placeholder="SEARCH CLIENT ID..."
                            className="bg-secondary/30 border border-white/5 h-8 pl-9 pr-3 w-56 text-[11px] font-mono rounded-lg focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-0 transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-[11px] border-white/10 gap-1.5 rounded-lg hover:border-primary/50">
                        <Download size={12} /> Export
                    </Button>
                    <Button variant="primary" size="sm" className="h-8 text-[11px] gap-1.5 rounded-lg font-bold shadow-lg shadow-primary/20">
                        <Plus size={12} /> New Client
                    </Button>
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
                    <span>Active Equity: <span className="text-emerald-500 font-bold">₹ {(8500000).toLocaleString()}</span></span>
                    <span>Risk Exposure: <span className="text-red-500 font-bold">₹ {(420000).toLocaleString()}</span></span>
                </div>
            </div>
        </div>
    );
};

export default UsersList;
