import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, AlertTriangle, Clock, MoreVertical, XCircle, Trash2, Edit, Cpu } from 'lucide-react';
import { clsx } from 'clsx';

const SignalTable = ({ signals, onAction, isLoading }) => {
    // Dropdown State Management
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (id, e) => {
        e.stopPropagation();
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    return (
        <div className="terminal-panel w-full h-full overflow-hidden border border-border bg-card rounded-lg shadow-2xl relative flex flex-col">
            {/* Table Header Backdrop */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <div className="overflow-auto flex-1 custom-scrollbar pb-20"> {/* pb-20 for dropdown space */}
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-muted/50 sticky top-0 z-10 uppercase tracking-widest text-[9px] font-bold text-muted-foreground border-b border-border shadow-sm backdrop-blur-md">
                        <tr>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm w-48">Symbol</th>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm text-center">Type</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Entry</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Stop Loss</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm w-48">Targets</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Status</th>
                            <th className="px-5 py-3 text-center bg-muted/90 backdrop-blur-sm w-10">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent text-[11px] font-medium font-mono">
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="h-[400px] text-center">
                                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground animate-pulse">
                                        <div className="animate-spin text-primary">
                                            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                                        </div>
                                        <span className="text-xs font-mono uppercase tracking-widest">Loading Market Signals...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            signals.map((signal, index) => {
                                const isBuy = signal.type === 'BUY';
                                const isDropdownOpen = openDropdownId === signal.id;

                                // Check if targets is object (new format) or missing
                                const targets = signal.targets || {};
                                const targetString = [targets.target1, targets.target2, targets.target3].filter(Boolean).join(' / ');

                                return (
                                    <tr key={signal.id || index} className="hover:bg-primary/[0.02] transition-colors group relative">
                                        <td className="px-5 py-3 border-r border-border">
                                            <div className="flex flex-col">
                                                <span className="text-foreground font-sans font-bold">{signal.symbol}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] text-muted-foreground">{signal.segment || 'NSE'}</span>
                                                    {signal.isFree && <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-1 rounded uppercase font-bold">Free</span>}
                                                    {signal.notes?.includes('Bot') && <span className="text-[8px] bg-violet-500/10 text-violet-500 px-1 rounded uppercase font-bold flex items-center gap-1"><Cpu size={8} /> Bot</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 border-r border-border text-center">
                                            <div className={`inline-flex items-center gap-1.5 font-bold px-2 py-0.5 rounded ${isBuy ? 'text-emerald-500 bg-emerald-500/5' : 'text-red-500 bg-red-500/5'}`}>
                                                {isBuy ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                {signal.type}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-center border-r border-border text-foreground font-bold">
                                            {signal.entry}
                                        </td>
                                        <td className="px-5 py-3 text-center border-r border-border text-red-500 font-bold bg-red-500/[0.02]">
                                            {signal.stoploss}
                                        </td>
                                        <td className="px-5 py-3 text-center border-r border-border text-emerald-500 font-bold bg-emerald-500/[0.02]">
                                            {targetString || '-'}
                                        </td>
                                        <td className="px-5 py-3 text-center border-r border-border">
                                            <span className={clsx(
                                                "px-2 py-0.5 border rounded-[4px] text-[9px] uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 w-fit mx-auto",
                                                signal.status === 'Active' ? 'border-blue-500/20 text-blue-500 bg-blue-500/5' :
                                                    signal.status === 'Target Hit' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                                                        signal.status === 'Stoploss Hit' ? 'border-red-500/20 text-red-500 bg-red-500/5' :
                                                            'border-white/10 text-muted-foreground bg-white/5'
                                            )}>
                                                {signal.status === 'Target Hit' && <Target size={10} />}
                                                {signal.status === 'Stoploss Hit' && <AlertTriangle size={10} />}
                                                {signal.status === 'Active' && <Clock size={10} />}
                                                {signal.status === 'Closed' && <XCircle size={10} />}
                                                {signal.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-center relative">
                                            <button
                                                onClick={(e) => toggleDropdown(signal.id, e)}
                                                className="p-1.5 hover:bg-muted/20 rounded text-muted-foreground hover:text-foreground transition-all"
                                            >
                                                <MoreVertical size={14} />
                                            </button>

                                            {isDropdownOpen && (
                                                <div
                                                    ref={dropdownRef}
                                                    className="absolute right-8 top-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-xl z-50 flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100"
                                                >
                                                    <button
                                                        onClick={() => { onAction('updateStatus', signal, 'Target Hit'); setOpenDropdownId(null); }}
                                                        className="px-3 py-2 text-[10px] hover:bg-emerald-500/10 hover:text-emerald-500 text-left flex items-center gap-2 font-medium transition-colors"
                                                    >
                                                        <Target size={12} /> Target Hit
                                                    </button>
                                                    <button
                                                        onClick={() => { onAction('updateStatus', signal, 'Stoploss Hit'); setOpenDropdownId(null); }}
                                                        className="px-3 py-2 text-[10px] hover:bg-red-500/10 hover:text-red-500 text-left flex items-center gap-2 font-medium transition-colors"
                                                    >
                                                        <AlertTriangle size={12} /> Stoploss Hit
                                                    </button>
                                                    <div className="h-[1px] bg-border my-1"></div>
                                                    <button
                                                        onClick={() => { onAction('close', signal); setOpenDropdownId(null); }}
                                                        className="px-3 py-2 text-[10px] hover:bg-muted/20 text-left flex items-center gap-2 font-medium transition-colors"
                                                    >
                                                        <XCircle size={12} /> Close Position
                                                    </button>
                                                    <button
                                                        onClick={() => { onAction('edit', signal); setOpenDropdownId(null); }}
                                                        className="px-3 py-2 text-[10px] hover:bg-muted/20 text-left flex items-center gap-2 font-medium transition-colors"
                                                    >
                                                        <Edit size={12} /> Edit Details
                                                    </button>
                                                    <div className="h-[1px] bg-border my-1"></div>
                                                    <button
                                                        onClick={() => { onAction('delete', signal); setOpenDropdownId(null); }}
                                                        className="px-3 py-2 text-[10px] hover:bg-red-500/10 text-red-500 text-left flex items-center gap-2 font-bold transition-colors"
                                                    >
                                                        <Trash2 size={12} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SignalTable;
