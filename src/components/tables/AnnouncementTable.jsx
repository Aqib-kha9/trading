import React from 'react';
import { MoreVertical, Megaphone, Calendar, Users, Eye } from 'lucide-react';
import { clsx } from 'clsx';

const AnnouncementTable = ({ announcements }) => {
    const getTypeColor = (type) => {
        switch (type) {
            case 'Urgent': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'Update': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'Event': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
            default: return 'text-muted-foreground bg-muted/10 border-border';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'text-emerald-500';
            case 'Scheduled': return 'text-amber-500';
            case 'Expired': return 'text-muted-foreground';
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
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Title</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Type</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Audience</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Status</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Date</th>
                            <th className="px-5 py-3 text-center bg-muted/90 backdrop-blur-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent text-[11px] font-medium font-mono">
                        {announcements.map((item, index) => (
                            <tr key={index} className="hover:bg-primary/[0.02] transition-colors group relative">
                                <td className="px-5 py-3 border-r border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-secondary/30 flex items-center justify-center text-muted-foreground border border-white/5">
                                            <Megaphone size={14} />
                                        </div>
                                        <div>
                                            <div className="text-foreground font-bold">{item.title}</div>
                                            <div className="text-[9px] text-muted-foreground truncate w-40">{item.message}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-center border-r border-border">
                                    <span className={clsx("px-2 py-0.5 border rounded-[4px] text-[9px] uppercase font-bold tracking-wider", getTypeColor(item.type))}>
                                        {item.type}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-center border-r border-border">
                                    <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                                        <Users size={12} />
                                        <span>{item.audience}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-center border-r border-border">
                                    <span className={clsx("font-bold uppercase tracking-wider text-[10px]", getStatusColor(item.status))}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-center border-r border-border text-muted-foreground">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <Calendar size={12} />
                                        <span>{item.date}</span>
                                    </div>
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
        </div>
    );
};

export default AnnouncementTable;
