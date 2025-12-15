import React from 'react';
import { Eye, Edit, Ban, AlertTriangle, ShieldAlert } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const UserTable = ({ users, onAction }) => {
    return (
        <div className="terminal-panel w-full h-full overflow-hidden border border-border bg-card rounded-lg shadow-2xl relative flex flex-col">
            {/* Table Header Backdrop */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <div className="overflow-auto flex-1 custom-scrollbar">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-muted/50 sticky top-0 z-10 uppercase tracking-widest text-[9px] font-bold text-muted-foreground border-b border-border shadow-sm backdrop-blur-md">
                        <tr>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Client ID</th>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">IP Address</th>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Name / Contact</th>
                            <th className="px-5 py-3 border-r border-border text-right bg-muted/90 backdrop-blur-sm">Fund (Equity)</th>
                            <th className="px-5 py-3 border-r border-border text-right bg-muted/90 backdrop-blur-sm">Margin Used</th>
                            <th className="px-5 py-3 border-r border-border text-right bg-muted/90 backdrop-blur-sm">P&L (Live)</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Plan</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Status</th>
                            <th className="px-5 py-3 text-center bg-muted/90 backdrop-blur-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent text-[11px] font-medium font-mono">
                        {users.map((user) => {
                            // Mock Calculation for Status
                            const isLiquidated = user.status === 'Liquidated';
                            const isBlocked = user.status === 'Blocked';

                            return (
                                <tr key={user.id} className="hover:bg-primary/[0.02] transition-colors group relative">
                                    <td className="px-5 py-3 text-primary font-bold tracking-tight border-r border-white/5 relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary/0 group-hover:bg-primary transition-colors"></div>
                                        {user.clientId}
                                    </td>
                                    <td className="px-5 py-3 border-r border-white/5 font-mono text-[10px] text-muted-foreground">
                                        {user.ip || '—'}
                                    </td>
                                    <td className="px-5 py-3 border-r border-white/5 font-sans">
                                        <div className="flex flex-col">
                                            <span className="text-foreground font-semibold text-xs">{user.name}</span>
                                            <span className="text-[10px] text-muted-foreground">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-right border-r border-white/5 text-foreground/90 font-bold tracking-tight">₹{user.equity.toLocaleString()}</td>
                                    <td className="px-5 py-3 text-right border-r border-white/5 text-muted-foreground/80 tracking-tight">₹{user.marginUsed.toLocaleString()}</td>
                                    <td className={`px-5 py-3 text-right border-r border-white/5 font-bold tracking-tight ${user.pnl >= 0 ? 'text-emerald-500 text-shadow-emerald' : 'text-red-500 text-shadow-red'}`}>
                                        {user.pnl >= 0 ? '+' : ''}₹{user.pnl.toLocaleString()}
                                    </td>
                                    <td className="px-5 py-3 text-center border-r border-white/5">
                                        <span className={`px-2 py-0.5 border rounded-[4px] text-[9px] uppercase font-bold tracking-wider ${user.plan === 'Gold' ? 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5' :
                                            user.plan === 'Platinum' ? 'border-cyan-500/20 text-cyan-500 bg-cyan-500/5' :
                                                user.plan === 'Silver' ? 'border-slate-400/20 text-slate-400 bg-slate-400/5' :
                                                    'border-white/10 text-muted-foreground'
                                            }`}>
                                            {user.plan}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-center border-r border-white/5">
                                        {isLiquidated ? (
                                            <span className="flex items-center justify-center gap-1.5 text-red-500 bg-red-500/5 border border-red-500/10 px-2 py-0.5 rounded text-[9px] font-bold uppercase animate-pulse">
                                                <AlertTriangle size={10} /> LIQUIDATED
                                            </span>
                                        ) : isBlocked ? (
                                            <span className="text-muted-foreground bg-white/5 px-2 py-0.5 rounded text-[9px] font-bold uppercase">BLOCKED</span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-1.5 text-emerald-500 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> ACTIVE
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <button
                                                title="View Details"
                                                onClick={() => onAction('view', user)}
                                                className="p-1.5 hover:bg-emerald-500/10 hover:text-emerald-500 text-muted-foreground rounded-md transition-all duration-200"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                title="Edit User"
                                                onClick={() => onAction('edit', user)}
                                                className="p-1.5 hover:bg-blue-500/10 hover:text-blue-500 text-muted-foreground rounded-md transition-all duration-200"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            {user.status === 'Active' && (
                                                <button
                                                    title="Liquidate Positions"
                                                    onClick={() => onAction('liquidate', user)}
                                                    className="p-1.5 hover:bg-red-500/10 hover:text-red-500 text-muted-foreground rounded-md transition-all duration-200"
                                                >
                                                    <ShieldAlert size={14} />
                                                </button>
                                            )}
                                            <button
                                                title="Block Trade"
                                                onClick={() => onAction('block', user)}
                                                className="p-1.5 hover:bg-orange-500/10 hover:text-orange-500 text-muted-foreground rounded-md transition-all duration-200"
                                            >
                                                <Ban size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
