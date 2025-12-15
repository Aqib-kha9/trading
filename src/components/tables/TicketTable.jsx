import React from 'react';
import { MoreVertical, CheckCircle, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';

const TicketTable = ({ tickets }) => {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'text-blue-500';
            case 'Resolved': return 'text-emerald-500';
            default: return 'text-muted-foreground';
        }
    };

    return (
        <div className="terminal-panel w-full h-full overflow-hidden border border-border bg-card rounded-lg shadow-2xl relative flex flex-col">
            {/* Table Header Backdrop */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <div className="overflow-auto flex-1 custom-scrollbar">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-muted/50 sticky top-0 z-10 uppercase tracking-widest text-[9px] font-bold text-muted-foreground border-b border-border shadow-sm backdrop-blur-md">
                        <tr>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Ticket ID</th>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Subject</th>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">User</th>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">IP Address</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Priority</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Status</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Date</th>
                            <th className="px-5 py-3 text-center bg-muted/90 backdrop-blur-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent text-[11px] font-medium font-mono">
                        {tickets.map((ticket, index) => (
                            <tr key={index} className="hover:bg-primary/[0.02] transition-colors group relative">
                                <td className="px-5 py-3 border-r border-border font-bold text-muted-foreground">
                                    {ticket.id}
                                </td>
                                <td className="px-5 py-3 border-r border-border">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-foreground font-sans font-bold">{ticket.subject}</span>
                                        <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                                            <span className="bg-secondary px-1 py-0.5 rounded">{ticket.category}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3 border-r border-border">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-[9px] font-bold border border-white/10 uppercase">
                                            {ticket.user.substring(0, 2)}
                                        </div>
                                        <span className="text-foreground">{ticket.user}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3 border-r border-border font-mono text-muted-foreground">
                                    {ticket.ipAddress || '-'}
                                </td>
                                <td className="px-5 py-3 text-center border-r border-border">
                                    <span className={clsx("px-2 py-0.5 border rounded-[4px] text-[9px] uppercase font-bold tracking-wider", getPriorityColor(ticket.priority))}>
                                        {ticket.priority}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-center border-r border-border">
                                    <div className={clsx("flex items-center justify-center gap-1 font-bold uppercase tracking-wider text-[10px]", getStatusColor(ticket.status))}>
                                        {ticket.status === 'Open' ? <AlertCircle size={10} /> : <CheckCircle size={10} />}
                                        {ticket.status}
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-center border-r border-border text-muted-foreground">
                                    {ticket.date}
                                </td>
                                <td className="px-5 py-3 text-center">
                                    <button className="p-1.5 hover:bg-muted/20 rounded text-muted-foreground hover:text-foreground transition-all">
                                        <MoreVertical size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default TicketTable;
