import React, { useState } from 'react';
import { Search, Plus, Radio, Download, List, History, Settings, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SignalTable from '../../components/tables/SignalTable';
import Button from '../../components/ui/Button';
import { clsx } from 'clsx';
import SignalConfiguration from './SignalConfiguration';

// Mock Data
const MOCK_SIGNALS = [
    { id: 'SIG-1001', symbol: 'NIFTY 50', type: 'BUY', entry: '21500', stoploss: '21450', status: 'Active', timestamp: '2024-01-12T10:30:00' },
    { id: 'SIG-1002', symbol: 'BANKNIFTY', type: 'SELL', entry: '47800', stoploss: '47900', status: 'Active', timestamp: '2024-01-12T09:15:00' }, // Status changed from Target Hit to Active/Stoploss Hit as Target is gone
    { id: 'SIG-1003', symbol: 'RELIANCE', type: 'BUY', entry: '2600', stoploss: '2580', status: 'Stoploss Hit', timestamp: '2024-01-11T14:20:00' },
    { id: 'SIG-1004', symbol: 'HDFCBANK', type: 'BUY', entry: '1650', stoploss: '1640', status: 'Active', timestamp: '2024-01-12T11:00:00' },
];

const MOCK_HISTORY = [
    { id: 'SIG-0998', symbol: 'TATASTEEL', type: 'BUY', entry: '135', stoploss: '132', status: 'Closed', timestamp: '2024-01-10T09:30:00' },
    { id: 'SIG-0997', symbol: 'INFY', type: 'SELL', entry: '1520', stoploss: '1540', status: 'Stoploss Hit', timestamp: '2024-01-09T10:00:00' },
    { id: 'SIG-0996', symbol: 'NIFTY 50', type: 'BUY', entry: '21400', stoploss: '21350', status: 'Closed', timestamp: '2024-01-08T11:45:00' },
];

const AllSignals = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [activeTab, setActiveTab] = useState('live'); // live, history, config

    const getFilteredData = (data) => data.filter(sig =>
        (filter === 'All' || sig.status === filter) &&
        (sig.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredSignals = getFilteredData(MOCK_SIGNALS);
    const filteredHistory = getFilteredData(MOCK_HISTORY);

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Header with Tabs */}
            <div className="flex flex-col gap-4 shrink-0">
                {/* Tab Navigation */}
                <div className="flex items-center gap-1 border-b border-border">
                    <button
                        onClick={() => setActiveTab('live')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'live'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <TrendingUp size={14} /> Live Signals
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'history'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <History size={14} /> Signal History
                    </button>
                    <button
                        onClick={() => setActiveTab('config')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'config'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <Settings size={14} /> Configuration
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 relative flex flex-col">
                {activeTab === 'live' && (
                    <div className="flex flex-col h-full gap-2">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between shrink-0 bg-card border border-border p-3 rounded-lg shadow-sm">
                            <div className="flex items-center gap-4">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                                    <Radio size={16} className="text-primary" />
                                    Signal Terminal
                                </h2>

                                <div className="h-6 w-[1px] bg-white/10"></div>

                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-muted-foreground font-medium">Status:</span>
                                    {['All', 'Active', 'Target Hit', 'Stoploss Hit'].map(f => (
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
                                        placeholder="SEARCH SYMBOL..."
                                        className="bg-secondary/30 border border-border h-8 pl-9 pr-3 w-56 text-[11px] font-mono rounded-lg focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-0 transition-all placeholder:text-muted-foreground/50"
                                    />
                                </div>
                                <Button variant="outline" size="sm" className="h-8 text-[11px] border-border gap-1.5 rounded-lg hover:border-primary/50">
                                    <Download size={12} /> Export
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => navigate('/signals/create')}
                                    className="h-8 text-[11px] gap-1.5 rounded-lg font-bold shadow-lg shadow-primary/20"
                                >
                                    <Plus size={12} /> New Signal
                                </Button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="flex-1 min-h-0 relative">
                            <SignalTable signals={filteredSignals} />
                        </div>

                        {/* Footer Stats */}
                        <div className="h-9 bg-muted/30 border border-border rounded-lg flex items-center justify-between px-4 text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                            <div>Total Signals: <span className="text-foreground font-bold">{MOCK_SIGNALS.length}</span></div>
                            <div className="flex gap-6">
                                <span>Success Rate: <span className="text-emerald-500 font-bold">85%</span></span>
                                <span>Active Positions: <span className="text-blue-500 font-bold">2</span></span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="flex flex-col h-full gap-2">
                        {/* History Toolbar - Simplified */}
                        <div className="flex items-center justify-between shrink-0 bg-card border border-border p-3 rounded-lg shadow-sm">
                            <div className="flex items-center gap-4">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <History size={16} />
                                    Archive
                                </h2>
                                <div className="h-6 w-[1px] bg-white/10"></div>
                                <div className="text-xs text-muted-foreground">
                                    Total Records: <span className="text-foreground font-bold">{MOCK_HISTORY.length}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-2 text-muted-foreground" size={12} />
                                    <input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        type="text"
                                        placeholder="SEARCH ARCHIVE..."
                                        className="bg-secondary/30 border border-border h-8 pl-9 pr-3 w-56 text-[11px] font-mono rounded-lg focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-0 transition-all placeholder:text-muted-foreground/50"
                                    />
                                </div>
                                <Button variant="outline" size="sm" className="h-8 text-[11px] border-border gap-1.5 rounded-lg hover:border-primary/50">
                                    <Download size={12} /> Report
                                </Button>
                            </div>
                        </div>

                        {/* History Table */}
                        <div className="flex-1 min-h-0 relative">
                            <SignalTable signals={filteredHistory} />
                        </div>
                    </div>
                )}

                {activeTab === 'config' && (
                    <div className="h-full overflow-y-auto custom-scrollbar">
                        <SignalConfiguration />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllSignals;
