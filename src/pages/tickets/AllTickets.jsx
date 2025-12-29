import React, { useState, useEffect } from 'react';
import { Search, Plus, MessageSquare, Download, Filter, Inbox, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TicketTable from '../../components/tables/TicketTable';
import Button from '../../components/ui/Button';
import { clsx } from 'clsx';

const AllTickets = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('open'); // open, resolved, all
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const loadTickets = async () => {
            try {
                const { fetchTickets } = await import('../../api/tickets.api');
                const { data } = await fetchTickets();
                setTickets(data);
            } catch (e) {
                console.error("Failed to load tickets", e);
            }
        };
        loadTickets();
    }, []);

    const getFilteredTickets = () => {
        let data = tickets;
        if (activeTab === 'open') data = data.filter(t => t.status === 'Open');
        if (activeTab === 'resolved') data = data.filter(t => t.status === 'Resolved');

        return data.filter(t =>
            (t.subject && t.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (t.id && t.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (t.user && t.user.name && t.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    };

    const filteredTickets = getFilteredTickets();

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Header with Tabs */}
            <div className="flex flex-col gap-4 shrink-0">
                {/* Tab Navigation */}
                <div className="flex items-center gap-1 border-b border-border">
                    <button
                        onClick={() => setActiveTab('open')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'open'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <AlertCircle size={14} /> Open Tickets
                    </button>
                    <button
                        onClick={() => setActiveTab('resolved')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'resolved'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <CheckCircle size={14} /> Resolved
                    </button>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'all'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <Inbox size={14} /> All Tickets
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 relative flex flex-col gap-2">
                {/* Toolbar */}
                <div className="flex items-center justify-between shrink-0 bg-card border border-border p-3 rounded-lg shadow-sm">
                    <div className="flex items-center gap-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <MessageSquare size={16} className="text-primary" />
                            Support Helpdesk
                        </h2>

                        <div className="h-6 w-[1px] bg-white/10"></div>

                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground font-medium">Pending:</span>
                            <span className="text-red-500 font-bold">{tickets.filter(t => t.status === 'Open').length}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-2 text-muted-foreground" size={12} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                type="text"
                                placeholder="SEARCH TICKET..."
                                className="bg-secondary/30 border border-border h-8 pl-9 pr-3 w-56 text-[11px] font-mono rounded-lg focus:border-primary/50 focus:bg-secondary/50 focus:outline-none focus:ring-0 transition-all placeholder:text-muted-foreground/50"
                            />
                        </div>
                        <Button variant="outline" size="sm" className="h-8 text-[11px] border-border gap-1.5 rounded-lg hover:border-primary/50">
                            <Download size={12} /> Export
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate('/tickets/create')}
                            className="h-8 text-[11px] gap-1.5 rounded-lg font-bold shadow-lg shadow-primary/20"
                        >
                            <Plus size={12} /> Create Ticket
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 min-h-0 relative">
                    <TicketTable tickets={filteredTickets} />
                </div>
            </div>
        </div>
    );
};

export default AllTickets;
