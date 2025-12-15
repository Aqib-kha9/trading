import React from 'react';
import { MoreVertical, CheckCircle, XCircle, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

const BrokerTable = ({ brokers, onAction }) => {
    return (
        <div className="terminal-panel w-full h-full overflow-hidden border border-border bg-card rounded-lg shadow-2xl relative flex flex-col">
            {/* Table Header Backdrop */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <div className="overflow-auto flex-1 custom-scrollbar">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-muted/50 sticky top-0 z-10 uppercase tracking-widest text-[9px] font-bold text-muted-foreground border-b border-border shadow-sm backdrop-blur-md">
                        <tr>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Broker ID</th>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Broker Name</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Clients</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Commission</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Total Revenue</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Status</th>
                            <th className="px-5 py-3 text-center bg-muted/90 backdrop-blur-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent text-[11px] font-medium font-mono">
                        {brokers.map((broker, index) => (
                            <tr key={index} className="hover:bg-primary/[0.02] transition-colors group relative">
                                <td className="px-5 py-3 border-r border-border font-bold text-muted-foreground">
                                    {broker.id}
                                </td>
                                <td className="px-5 py-3 border-r border-border">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-foreground font-sans font-bold">{broker.name}</span>
                                        <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                                            <span>{broker.location}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3 border-r border-border text-center">
                                    <div className="flex items-center justify-center gap-1 font-bold text-foreground">
                                        <Users size={12} className="text-primary/70" />
                                        {broker.clients}
                                    </div>
                                </td>
                                <td className="px-5 py-3 border-r border-border text-center text-primary font-bold">
                                    {broker.commission}%
                                </td>
                                <td className="px-5 py-3 border-r border-border text-center text-emerald-500 font-bold">
                                    {broker.revenue}
                                </td>
                                <td className="px-5 py-3 text-center border-r border-border">
                                    <span className={clsx(
                                        "px-2 py-0.5 border rounded-[4px] text-[9px] uppercase font-bold tracking-wider flex items-center justify-center gap-1 w-fit mx-auto",
                                        broker.status === 'Active' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' :
                                            broker.status === 'Inactive' ? 'text-slate-400 bg-slate-500/10 border-slate-500/20' :
                                                'text-red-500 bg-red-500/10 border-red-500/20'
                                    )}>
                                        {broker.status === 'Active' && <CheckCircle size={10} />}
                                        {broker.status === 'Inactive' && <AlertCircle size={10} />}
                                        {broker.status === 'Blocked' && <XCircle size={10} />}
                                        {broker.status}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <button
                                            onClick={() => onAction('view', broker)}
                                            className="p-1.5 hover:bg-muted/20 rounded text-muted-foreground hover:text-primary transition-all" title="View Details"
                                        >
                                            <TrendingUp size={14} />
                                        </button>
                                        <button
                                            onClick={() => onAction('edit', broker)}
                                            className="p-1.5 hover:bg-muted/20 rounded text-muted-foreground hover:text-foreground transition-all" title="Edit"
                                        >
                                            <MoreVertical size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BrokerTable;
