import React, { useState } from 'react';
import { Search, Plus, Briefcase, Download, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BrokerTable from '../../components/tables/BrokerTable';
import Button from '../../components/ui/Button';
import { clsx } from 'clsx';

// Mock Data with Commission Type
const MOCK_BROKERS = [
    { id: 'BRK-001', name: 'Alpha Traders', location: 'Mumbai, MH', clients: 124, commission: { type: 'PERCENTAGE', value: 20 }, revenue: '₹ 5,40,000', status: 'Active' },
    { id: 'BRK-002', name: 'West Coast Finserv', location: 'Pune, MH', clients: 85, commission: { type: 'FIXED', value: 500 }, revenue: '₹ 3,20,000', status: 'Active' },
    { id: 'BRK-003', name: 'Skyline Capital', location: 'Delhi, DL', clients: 42, commission: { type: 'PERCENTAGE', value: 25 }, revenue: '₹ 1,80,000', status: 'Inactive' },
    { id: 'BRK-004', name: 'Prime Invest', location: 'Bangalore, KA', clients: 210, commission: { type: 'PERCENTAGE', value: 18 }, revenue: '₹ 8,90,000', status: 'Active' },
    { id: 'BRK-005', name: 'Rapid Growth', location: 'Hyderabad, TS', clients: 15, commission: { type: 'FIXED', value: 300 }, revenue: '₹ 45,000', status: 'Blocked' },
];

const AllBrokers = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    const filteredBrokers = MOCK_BROKERS.filter(broker =>
        (filter === 'All' || broker.status === filter) &&
        (broker.name.toLowerCase().includes(searchTerm.toLowerCase()) || broker.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleAction = (action, broker) => {
        if (action === 'view') {
            navigate(`/brokers/details?id=${broker.id}`);
        } else if (action === 'edit') {
            navigate(`/brokers/edit?id=${broker.id}`);
        }
    };

    return (
        <div className="h-full flex flex-col gap-4">

            {/* Toolbar */}
            <div className="flex items-center justify-between shrink-0 bg-card border border-white/5 p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                        <Briefcase size={16} className="text-primary" />
                        Partner Brokers
                    </h2>

                    <div className="h-6 w-[1px] bg-white/10"></div>

                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground font-medium">Status:</span>
                        {['All', 'Active', 'Inactive', 'Blocked'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={clsx(
                                    "px-2.5 py-1 rounded-md border text-[10px] font-bold transition-all uppercase tracking-wide",
                                    filter === f
                                        ? "border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                                        : "border-transparent text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                                )}
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
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="SEARCH BROKER..."
                            className="bg-secondary/30 border border-white/5 h-8 pl-9 pr-3 w-56 text-[11px] font-mono rounded-lg focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-0 transition-all placeholder:text-muted-foreground/50"
                        />
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-[11px] border-white/10 gap-1.5 rounded-lg hover:border-primary/50">
                        <Download size={12} /> Export
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/brokers/add')}
                        className="h-8 text-[11px] gap-1.5 rounded-lg font-bold shadow-lg shadow-primary/20"
                    >
                        <Plus size={12} /> Onboard Broker
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 relative">
                <BrokerTable brokers={filteredBrokers} onAction={handleAction} />
            </div>

            {/* Footer Stats */}
            <div className="h-9 bg-muted/30 border border-border rounded-lg flex items-center justify-between px-4 text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                <div>Total Partners: <span className="text-foreground font-bold">{MOCK_BROKERS.length}</span></div>
                <div className="flex gap-6">
                    <span>Active: <span className="text-emerald-500 font-bold">{MOCK_BROKERS.filter(b => b.status === 'Active').length}</span></span>
                    <span>Total Revenue: <span className="text-amber-500 font-bold">₹ 19,75,000</span></span>
                </div>
            </div>
        </div>
    );
};

export default AllBrokers;
