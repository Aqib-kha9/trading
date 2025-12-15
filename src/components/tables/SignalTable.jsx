import React from 'react';
import { TrendingUp, TrendingDown, Target, AlertTriangle, Clock, MoreVertical } from 'lucide-react';

const SignalTable = ({ signals }) => {
    return (
        <div className="terminal-panel w-full h-full overflow-hidden border border-border bg-card rounded-lg shadow-2xl relative flex flex-col">
            {/* Table Header Backdrop */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <div className="overflow-auto flex-1 custom-scrollbar">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-muted/50 sticky top-0 z-10 uppercase tracking-widest text-[9px] font-bold text-muted-foreground border-b border-border shadow-sm backdrop-blur-md">
                        <tr>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Symbol</th>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Signal Type</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Entry Price</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Stop Loss</th>
                            {/* Target column removed */}
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Status</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Time</th>
                            <th className="px-5 py-3 text-center bg-muted/90 backdrop-blur-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent text-[11px] font-medium font-mono">
                        {signals.map((signal, index) => {
                            const isBuy = signal.type === 'BUY';
                            return (
                                <tr key={index} className="hover:bg-primary/[0.02] transition-colors group relative">
                                    <td className="px-5 py-3 border-r border-border">
                                        <div className="flex flex-col">
                                            <span className="text-foreground font-sans font-bold">{signal.symbol}</span>
                                            <div className="text-[9px] text-muted-foreground">NSE</div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 border-r border-border">
                                        <div className={`flex items-center gap-2 font-bold ${isBuy ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {isBuy ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                            {signal.type}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-center border-r border-border text-foreground font-bold">
                                        {signal.entry}
                                    </td>
                                    <td className="px-5 py-3 text-center border-r border-border text-red-500 font-bold">
                                        {signal.stoploss}
                                    </td>
                                    {/* Target cell removed */}
                                    <td className="px-5 py-3 text-center border-r border-border">
                                        <span className={`px-2 py-0.5 border rounded-[4px] text-[9px] uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 w-fit mx-auto ${signal.status === 'Active' ? 'border-blue-500/20 text-blue-500 bg-blue-500/5' :
                                            signal.status === 'Target Hit' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                                                'border-red-500/20 text-red-500 bg-red-500/5'
                                            }`}>
                                            {signal.status === 'Target Hit' && <Target size={10} />}
                                            {signal.status === 'Stoploss Hit' && <AlertTriangle size={10} />}
                                            {signal.status === 'Active' && <Clock size={10} />}
                                            {signal.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-center border-r border-border text-muted-foreground text-[10px]">
                                        {new Date(signal.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <button className="p-1.5 hover:bg-muted/20 rounded text-muted-foreground hover:text-foreground transition-all">
                                            <MoreVertical size={14} />
                                        </button>
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

export default SignalTable;
