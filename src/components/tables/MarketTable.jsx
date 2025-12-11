import React from 'react';
import { MoreVertical, CheckCircle, XCircle, Database } from 'lucide-react';

const MarketTable = ({ symbols }) => {
    return (
        <div className="terminal-panel w-full h-full overflow-hidden border border-border bg-card rounded-lg shadow-2xl relative flex flex-col">
            {/* Table Header Backdrop */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <div className="overflow-auto flex-1 custom-scrollbar">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-muted/50 sticky top-0 z-10 uppercase tracking-widest text-[9px] font-bold text-muted-foreground border-b border-border shadow-sm backdrop-blur-md">
                        <tr>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Instrument</th>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Exchange</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Type</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Lot Size</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Data Feed</th>
                            <th className="px-5 py-3 text-center bg-muted/90 backdrop-blur-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent text-[11px] font-medium font-mono">
                        {symbols.map((sym, index) => (
                            <tr key={index} className="hover:bg-primary/[0.02] transition-colors group relative">
                                <td className="px-5 py-3 border-r border-border">
                                    <div className="flex flex-col">
                                        <span className="text-foreground font-sans font-bold">{sym.symbol}</span>
                                        <span className="text-[9px] text-muted-foreground">{sym.name || sym.symbol}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3 border-r border-border">
                                    <div className="flex items-center gap-2">
                                        <span className="px-1.5 py-0.5 rounded bg-secondary/50 text-[9px] font-bold text-muted-foreground">
                                            {sym.exchange}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-center border-r border-border text-muted-foreground">
                                    {sym.type || 'DERIVATIVE'}
                                </td>
                                <td className="px-5 py-3 text-center border-r border-border font-bold text-primary font-mono">
                                    {sym.lotSize}
                                </td>
                                <td className="px-5 py-3 text-center border-r border-border">
                                    <span className={`px-2 py-0.5 border rounded-[4px] text-[9px] uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 w-fit mx-auto ${sym.status !== 'Inactive'
                                            ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
                                            : 'border-red-500/20 text-red-500 bg-red-500/5'
                                        }`}>
                                        {sym.status !== 'Inactive' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                        {sym.status || 'Active'}
                                    </span>
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

export default MarketTable;
