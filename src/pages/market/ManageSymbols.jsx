import React, { useState } from 'react';
import { Search, Plus, BarChart2, Download, List, Settings, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MarketTable from '../../components/tables/MarketTable';
import Button from '../../components/ui/Button';
import { clsx } from 'clsx';
import DataFeedConfig from './DataFeedConfig';

// Mock Data
const MOCK_SYMBOLS = [
    { id: 'SYM-001', symbol: 'NIFTY', name: 'Nifty 50 Index', exchange: 'NSE', type: 'INDEX', lotSize: '50', status: 'Active' },
    { id: 'SYM-002', symbol: 'BANKNIFTY', name: 'Nifty Bank Index', exchange: 'NSE', type: 'INDEX', lotSize: '15', status: 'Active' },
    { id: 'SYM-003', symbol: 'FINNIFTY', name: 'Nifty Financial Services', exchange: 'NSE', type: 'INDEX', lotSize: '40', status: 'Active' },
    { id: 'SYM-004', symbol: 'CRUDEOIL', name: 'Crude Oil Futures', exchange: 'MCX', type: 'COMMODITY', lotSize: '100', status: 'Active' },
    { id: 'SYM-005', symbol: 'RELIANCE', name: 'Reliance Industries', exchange: 'NSE', type: 'EQUITY', lotSize: '250', status: 'Inactive' },
];

const ManageSymbols = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('watchlist'); // watchlist, config

    const filteredSymbols = MOCK_SYMBOLS.filter(sym =>
        sym.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sym.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Header with Tabs */}
            <div className="flex flex-col gap-4 shrink-0">
                {/* Tab Navigation */}
                <div className="flex items-center gap-1 border-b border-border">
                    <button
                        onClick={() => setActiveTab('watchlist')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'watchlist'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <List size={14} /> Instruments
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
                        <Settings size={14} /> Data Feed Config
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 relative flex flex-col">
                {activeTab === 'watchlist' && (
                    <div className="flex flex-col h-full gap-2">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between shrink-0 bg-card border border-border p-3 rounded-lg shadow-sm">
                            <div className="flex items-center gap-4">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                                    <BarChart2 size={16} className="text-primary" />
                                    Market Watchlist
                                </h2>

                                <div className="h-6 w-[1px] bg-white/10"></div>

                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-muted-foreground font-medium">Total Symbols:</span>
                                    <span className="text-foreground font-bold">{MOCK_SYMBOLS.length}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-2 text-muted-foreground" size={12} />
                                    <input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        type="text"
                                        placeholder="SEARCH INSTRUMENT..."
                                        className="bg-secondary/30 border border-border h-8 pl-9 pr-3 w-56 text-[11px] font-mono rounded-lg focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-0 transition-all placeholder:text-muted-foreground/50"
                                    />
                                </div>
                                <Button variant="outline" size="sm" className="h-8 text-[11px] border-border gap-1.5 rounded-lg hover:border-primary/50">
                                    <Download size={12} /> Sync
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => navigate('/market/add')}
                                    className="h-8 text-[11px] gap-1.5 rounded-lg font-bold shadow-lg shadow-primary/20"
                                >
                                    <Plus size={12} /> Add Symbol
                                </Button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="flex-1 min-h-0 relative">
                            <MarketTable symbols={filteredSymbols} />
                        </div>
                    </div>
                )}

                {activeTab === 'config' && (
                    <div className="h-full overflow-y-auto custom-scrollbar">
                        <DataFeedConfig />
                    </div>
                )}
            </div>
        </div >
    );
};

export default ManageSymbols;
