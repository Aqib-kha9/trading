import React from 'react';
import { MoreVertical, Megaphone, Calendar, Users, Eye, Edit, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

const AnnouncementTable = ({ announcements, onAction, isLoading }) => {
    const getTypeColor = (type) => {
        switch (type?.toUpperCase()) {
            case 'URGENT': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'UPDATE': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'EVENT': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
            case 'SYSTEM': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'NEWS': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'SIGNAL': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'ECONOMIC': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
            case 'REMINDER': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
            default: return 'text-muted-foreground bg-muted/10 border-border';
        }
    };

    const getStatusColor = (status) => {
        switch (status) { // Virtual status is capitalized Active/Scheduled/Expired/Disabled
            case 'Active': return 'text-emerald-500';
            case 'Scheduled': return 'text-amber-500';
            case 'Expired': return 'text-muted-foreground';
            case 'Disabled': return 'text-red-500';
            default: return 'text-muted-foreground';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getDisplayType = (item) => {
        if (item.type === 'REMINDER') return 'PLAN REMINDER';
        // Handle legacy/fallback system alerts that are actually reminders
        if (item.type === 'SYSTEM' && item.title?.includes('Renewal')) return 'PLAN REMINDER';
        return item.type;
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
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2 opactiy-50">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                        <span className="text-[10px] uppercase tracking-wider">Loading Data...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            announcements.map((item, index) => (
                                <tr key={item.id || index} className="hover:bg-primary/[0.02] transition-colors group relative">
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
                                            {getDisplayType(item)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-center border-r border-border">
                                        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                                            <Users size={12} />
                                            <span className="capitalize">{item.targetAudience?.role === 'sub-broker' ? 'Sub Broker' : item.targetAudience?.role}</span>
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
                                            <span>{formatDate(item.startDate || item.createdAt)}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                            {/* View Action */}
                                            <button
                                                onClick={() => onAction('view', item)}
                                                className="p-1.5 hover:bg-emerald-500/10 hover:text-emerald-500 text-muted-foreground rounded-md transition-all duration-200"
                                                title="View Details"
                                            >
                                                <Eye size={14} />
                                            </button>


                                            <button
                                                onClick={() => onAction('delete', item)}
                                                className="p-1.5 hover:bg-red-500/10 hover:text-red-500 text-muted-foreground rounded-md transition-all duration-200"
                                                title="Delete Announcement"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AnnouncementTable;
