import React from 'react';
import { Download, ShoppingCart, RefreshCcw, CheckCircle, XCircle } from 'lucide-react';

const SubscriptionTable = ({ transactions }) => {
    return (
        <div className="terminal-panel w-full h-full overflow-hidden border border-border bg-card rounded-lg shadow-2xl relative flex flex-col">
            {/* Table Header Backdrop */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <div className="overflow-auto flex-1 custom-scrollbar">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-muted/50 sticky top-0 z-10 uppercase tracking-widest text-[9px] font-bold text-muted-foreground border-b border-border shadow-sm backdrop-blur-md">
                        <tr>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Transaction ID</th>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">User Name</th>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Plan</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Amount</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Date</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Method</th>
                            <th className="px-5 py-3 text-center bg-muted/90 backdrop-blur-sm">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent text-[11px] font-medium font-mono">
                        {transactions.map((txn, index) => (
                            <tr key={index} className="hover:bg-primary/[0.02] transition-colors group relative">
                                <td className="px-5 py-3 font-bold text-muted-foreground border-r border-border font-mono relative">
                                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary/0 group-hover:bg-primary transition-colors"></div>
                                    {txn.id}
                                </td>
                                <td className="px-5 py-3 border-r border-border text-foreground font-sans font-semibold">
                                    {txn.user}
                                </td>
                                <td className="px-5 py-3 border-r border-border text-primary">
                                    {txn.plan}
                                </td>
                                <td className="px-5 py-3 text-center border-r border-border font-bold text-emerald-500 font-mono">
                                    {txn.amount}
                                </td>
                                <td className="px-5 py-3 text-center border-r border-border text-muted-foreground text-[10px]">
                                    {txn.date}
                                </td>
                                <td className="px-5 py-3 text-center border-r border-border text-muted-foreground text-[10px]">
                                    {txn.method || 'UPI'}
                                </td>
                                <td className="px-5 py-3 text-center">
                                    <span className={`px-2 py-0.5 border rounded-[4px] text-[9px] uppercase font-bold tracking-wider flex items-center justify-center gap-1.5 w-fit mx-auto ${txn.status === 'Success'
                                        ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
                                        : 'border-red-500/20 text-red-500 bg-red-500/5'
                                        }`}>
                                        {txn.status === 'Success' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                        {txn.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default SubscriptionTable;
