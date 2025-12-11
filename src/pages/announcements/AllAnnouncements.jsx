import React, { useState } from 'react';
import { Search, Plus, Megaphone, Download, Radio, Calendar, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnnouncementTable from '../../components/tables/AnnouncementTable';
import Button from '../../components/ui/Button';
import { clsx } from 'clsx';

// Mock Data
const MOCK_ANNOUNCEMENTS = [
    { id: 'ANC-001', title: 'Market Holidary: Ganesh Chaturthi', message: 'Markets will remain closed on Tuesday.', type: 'Urgent', audience: 'All Users', status: 'Active', date: '2024-09-18' },
    { id: 'ANC-002', title: 'New Feature: Auto-Trade', message: 'Introducing automated trading bot for premium users.', type: 'Update', audience: 'Premium', status: 'Active', date: '2024-09-15' },
    { id: 'ANC-003', title: 'Webinar: Options Strategy', message: 'Join us live on Sunday at 10 AM.', type: 'Event', audience: 'All Users', status: 'Scheduled', date: '2024-09-22' },
    { id: 'ANC-004', title: 'Server Maintenance', message: 'Down for 1 hour approx.', type: 'Update', audience: 'All Users', status: 'Expired', date: '2024-08-10' },
];

const AllAnnouncements = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('active'); // active, scheduled, history

    const getFilteredData = () => {
        let data = MOCK_ANNOUNCEMENTS;
        if (activeTab === 'active') data = data.filter(t => t.status === 'Active');
        if (activeTab === 'scheduled') data = data.filter(t => t.status === 'Scheduled');
        if (activeTab === 'history') data = data.filter(t => t.status === 'Expired');

        return data.filter(t =>
            t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.message.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const filteredData = getFilteredData();

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Header with Tabs */}
            <div className="flex flex-col gap-4 shrink-0">
                {/* Tab Navigation */}
                <div className="flex items-center gap-1 border-b border-border">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'active'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <Radio size={14} /> Active
                    </button>
                    <button
                        onClick={() => setActiveTab('scheduled')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'scheduled'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <Calendar size={14} /> Scheduled
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
                        <History size={14} /> History
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 relative flex flex-col gap-2">
                {/* Toolbar */}
                <div className="flex items-center justify-between shrink-0 bg-card border border-border p-3 rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <Megaphone size={16} className="text-primary" />
                            Broadcast Center
                        </h2>

                        <div className="h-6 w-[1px] bg-white/10"></div>

                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground font-medium">Active:</span>
                            <span className="text-emerald-500 font-bold">{MOCK_ANNOUNCEMENTS.filter(t => t.status === 'Active').length}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-2 text-muted-foreground" size={12} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                type="text"
                                placeholder="SEARCH BROADCAST..."
                                className="bg-secondary/30 border border-border h-8 pl-9 pr-3 w-56 text-[11px] font-mono rounded-lg focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-0 transition-all placeholder:text-muted-foreground/50"
                            />
                        </div>
                        <Button variant="outline" size="sm" className="h-8 text-[11px] border-border gap-1.5 rounded-lg hover:border-primary/50">
                            <Download size={12} /> Export
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate('/announcements/create')}
                            className="h-8 text-[11px] gap-1.5 rounded-lg font-bold shadow-lg shadow-primary/20"
                        >
                            <Plus size={12} /> New Broadcast
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 min-h-0 relative">
                    <AnnouncementTable announcements={filteredData} />
                </div>
            </div>
        </div>
    );
};

export default AllAnnouncements;
