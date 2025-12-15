import React, { useState } from 'react';
import { Search, Plus, CreditCard, Download, Clock, PlayCircle, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PlanTable from '../../components/tables/PlanTable';
import Button from '../../components/ui/Button';
import PlanValiditySettings from './PlanValiditySettings';
import DemoPlanSettings from './DemoPlanSettings';
import { clsx } from 'clsx';

// Mock Data for Plans
const MOCK_PLANS = [
    { id: 'PLN-001', name: 'NFT Segment', price: 25000, validity_days: 30, isDemo: false, features: ['NFT specific signals', 'Priority Support'] },
    { id: 'PLN-002', name: 'Options Segment', price: 25000, validity_days: 30, isDemo: false, features: ['BankNifty/Nifty Options', 'Live Market Updates'] },
    { id: 'PLN-003', name: 'Crypto Segment', price: 25000, validity_days: 30, isDemo: false, features: ['Major Crypto Pairs', '24/7 Alerts'] },
    { id: 'PLN-004', name: 'Forex Segment', price: 25000, validity_days: 30, isDemo: false, features: ['Major Forex Pairs', 'News Events'] },
    { id: 'PLN-005', name: 'Comodity Segment', price: 25000, validity_days: 30, isDemo: false, features: ['Gold & Silver', 'Crude Oil'] },
    { id: 'PLN-006', name: 'Free Demo Trial', price: 0, validity_days: 3, isDemo: true, features: ['Delayed Signals', 'App Access'] },
];

const AllPlans = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All'); // All, Premium, Demo
    const [activeTab, setActiveTab] = useState('plans'); // plans, validity, demo

    const handleAction = (action, plan) => {
        if (action === 'edit') {
            navigate(`/plans/edit?id=${plan.id}`);
        } else if (action === 'delete') {
            alert(`Deleting plan ${plan.name}`);
        }
    };

    const filteredPlans = MOCK_PLANS.filter(plan =>
        (filter === 'All' || (filter === 'Demo' ? plan.isDemo : !plan.isDemo)) &&
        plan.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Header with Tabs */}
            <div className="flex flex-col gap-4 shrink-0">
                {/* Header removed as per user request for cleaner UI */}

                {/* Tab Navigation */}
                <div className="flex items-center gap-1 border-b border-border">
                    <button
                        onClick={() => setActiveTab('plans')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'plans'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <List size={14} /> All Plans
                    </button>
                    <button
                        onClick={() => setActiveTab('validity')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'validity'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <Clock size={14} /> Validity Rules
                    </button>
                    <button
                        onClick={() => setActiveTab('demo')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'demo'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <PlayCircle size={14} /> Demo Settings
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 min-h-0 relative flex flex-col">
                {activeTab === 'plans' && (
                    <div className="flex flex-col h-full gap-2">
                        {/* Plans Toolbar */}
                        <div className="flex items-center justify-between shrink-0 bg-card border border-border p-3 rounded-lg shadow-sm">
                            <div className="flex items-center gap-4">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                                    <CreditCard size={16} className="text-primary" />
                                    Plan Database
                                </h2>

                                <div className="h-6 w-[1px] bg-white/10"></div>

                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-muted-foreground font-medium">Filter:</span>
                                    {['All', 'Premium', 'Demo'].map(f => (
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
                                        placeholder="SEARCH PLAN..."
                                        className="bg-secondary/30 border border-border h-8 pl-9 pr-3 w-56 text-[11px] font-mono rounded-lg focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-0 transition-all placeholder:text-muted-foreground/50"
                                    />
                                </div>
                                <Button variant="outline" size="sm" className="h-8 text-[11px] border-border gap-1.5 rounded-lg hover:border-primary/50">
                                    <Download size={12} /> Export
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => navigate('/plans/create')}
                                    className="h-8 text-[11px] gap-1.5 rounded-lg font-bold shadow-lg shadow-primary/20"
                                >
                                    <Plus size={12} /> New Plan
                                </Button>
                            </div>
                        </div>

                        {/* Plans Table */}
                        <div className="flex-1 min-h-0 relative">
                            <PlanTable plans={filteredPlans} onAction={handleAction} />
                        </div>

                        {/* Footer Stats */}
                        <div className="h-9 bg-muted/30 border border-border rounded-lg flex items-center justify-between px-4 text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                            <div>Total Plans: <span className="text-foreground font-bold">{MOCK_PLANS.length}</span></div>
                            <div className="flex gap-6">
                                <span>Active Subscriptions: <span className="text-emerald-500 font-bold">1,245</span></span>
                                <span>Avg Revenue: <span className="text-amber-500 font-bold">₹ 5,200</span></span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'validity' && (
                    <div className="h-full overflow-y-auto px-4 py-2">
                        <PlanValiditySettings isEmbedded={true} />
                    </div>
                )}

                {activeTab === 'demo' && (
                    <div className="h-full overflow-y-auto px-4 py-2">
                        <DemoPlanSettings isEmbedded={true} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllPlans;
