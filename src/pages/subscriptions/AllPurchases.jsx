import React, { useState } from 'react';
import { Search, Filter, RefreshCcw, Download, List, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SubscriptionTable from '../../components/tables/SubscriptionTable';
import Button from '../../components/ui/Button';
import { clsx } from 'clsx';
import ActiveSubscriptionsTable from '../../components/tables/ActiveSubscriptionsTable';

// Mock Data for Global History
const MOCK_TRANSACTIONS = [
    { id: 'TXN-8842', user: 'Rajesh Kumar', plan: 'Options Segment', amount: '₹25,000', date: '12 Jan 2024', status: 'Success' },
    { id: 'TXN-8841', user: 'Amit Singh', plan: 'Forex Segment', amount: '₹25,000', date: '12 Jan 2024', status: 'Failed' },
    { id: 'TXN-8840', user: 'Sneha Gupta', plan: 'NFT Segment', amount: '₹25,000', date: '11 Jan 2024', status: 'Success' },
    { id: 'TXN-8839', user: 'Vijay Inte', plan: 'Comodity Segment', amount: '₹25,000', date: '11 Jan 2024', status: 'Success' },
    { id: 'TXN-8838', user: 'Priya Sharma', plan: 'Crypto Segment', amount: '₹25,000', date: '10 Jan 2024', status: 'Success' },
];

// Mock Data for Active Subscriptions
const MOCK_ACTIVE_SUBS = [
    { userId: 'MS-1001', user: 'Rajesh Kumar', plan: 'Options Segment', startDate: '01 Jan 2024', expiryDate: '31 Jan 2024', daysRemaining: 20 },
    { userId: 'MS-1003', user: 'Sneha Gupta', plan: 'NFT Segment', startDate: '15 Dec 2023', expiryDate: '15 Mar 2024', daysRemaining: 85 },
    { userId: 'MS-1005', user: 'Priya Sharma', plan: 'Comodity Segment', startDate: '10 Jan 2024', expiryDate: '10 Feb 2024', daysRemaining: 29 },
    { userId: 'MS-1008', user: 'Vikram Singh', plan: 'Forex Segment', startDate: '20 Dec 2023', expiryDate: '04 Jan 2024', daysRemaining: 3 },
];

const Subscriptions = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [activeTab, setActiveTab] = useState('history'); // history, active

    const filteredTransactions = MOCK_TRANSACTIONS.filter(txn =>
        (filter === 'All' || txn.status === filter) &&
        (txn.user.toLowerCase().includes(searchTerm.toLowerCase()) || txn.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Header with Tabs */}
            <div className="flex flex-col gap-4 shrink-0">
                {/* Tab Navigation */}
                <div className="flex items-center gap-1 border-b border-border">
                    <button
                        onClick={() => setActiveTab('history')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'history'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <List size={14} /> Transactions
                    </button>
                    <button
                        onClick={() => setActiveTab('active')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'active'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <CheckCircle size={14} /> Active Subscriptions
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 relative flex flex-col">
                {activeTab === 'history' && (
                    <div className="flex flex-col h-full gap-2">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between shrink-0 bg-card border border-border p-3 rounded-lg shadow-sm">
                            <div className="flex items-center gap-4">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                                    <RefreshCcw size={16} className="text-primary" />
                                    Subscription Database
                                </h2>

                                <div className="h-6 w-[1px] bg-white/10"></div>

                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-muted-foreground font-medium">Status:</span>
                                    {['All', 'Success', 'Failed'].map(f => (
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
                                        placeholder="SEARCH TXN OR USER..."
                                        className="bg-secondary/30 border border-border h-8 pl-9 pr-3 w-56 text-[11px] font-mono rounded-lg focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-0 transition-all placeholder:text-muted-foreground/50"
                                    />
                                </div>
                                <Button variant="outline" size="sm" className="h-8 text-[11px] border-border gap-1.5 rounded-lg hover:border-primary/50">
                                    <Download size={12} /> Export
                                </Button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="flex-1 min-h-0 relative">
                            <SubscriptionTable transactions={filteredTransactions} />
                        </div>

                        {/* Footer Stats */}
                        <div className="h-9 bg-muted/30 border border-border rounded-lg flex items-center justify-between px-4 text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                            <div>Total Transactions: <span className="text-foreground font-bold">{MOCK_TRANSACTIONS.length}</span></div>
                            <div className="flex gap-6">
                                <span>Successful: <span className="text-emerald-500 font-bold">482</span></span>
                                <span>Revenue: <span className="text-emerald-500 font-bold">₹ 52,400</span></span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'active' && (
                    <div className="flex flex-col h-full gap-2">
                        {/* Active Toolbar */}
                        <div className="flex items-center justify-between shrink-0 bg-card border border-border p-3 rounded-lg shadow-sm">
                            <div className="flex items-center gap-4">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                                    <CheckCircle size={16} className="text-primary" />
                                    Active Members
                                </h2>
                                <div className="h-6 w-[1px] bg-white/10"></div>
                                <div className="text-xs text-muted-foreground">
                                    Total Active: <span className="text-foreground font-bold">{MOCK_ACTIVE_SUBS.length}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-2 text-muted-foreground" size={12} />
                                    <input
                                        type="text"
                                        placeholder="SEARCH USER..."
                                        className="bg-secondary/30 border border-border h-8 pl-9 pr-3 w-56 text-[11px] font-mono rounded-lg focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-0 transition-all placeholder:text-muted-foreground/50"
                                    />
                                </div>
                                <Button variant="outline" size="sm" className="h-8 text-[11px] border-border gap-1.5 rounded-lg hover:border-primary/50">
                                    <Download size={12} /> Export List
                                </Button>
                            </div>
                        </div>

                        {/* Active Table */}
                        <div className="flex-1 min-h-0 relative">
                            <ActiveSubscriptionsTable subscriptions={MOCK_ACTIVE_SUBS} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Subscriptions;
