import React from 'react';
import { Clock, MoreVertical, CreditCard, AlertCircle } from 'lucide-react';

const ActiveSubscriptionsTable = ({ subscriptions }) => {
    return (
        <div className="terminal-panel w-full h-full overflow-hidden border border-border bg-card rounded-lg shadow-2xl relative flex flex-col">
            {/* Table Header Backdrop */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <div className="overflow-auto flex-1 custom-scrollbar">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-muted/50 sticky top-0 z-10 uppercase tracking-widest text-[9px] font-bold text-muted-foreground border-b border-border shadow-sm backdrop-blur-md">
                        <tr>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">User Identity</th>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Current Plan</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Start Date</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Expiry Date</th>
                            <th className="px-5 py-3 border-r border-border w-48 bg-muted/90 backdrop-blur-sm">Validity Progress</th>
                            <th className="px-5 py-3 text-center bg-muted/90 backdrop-blur-sm">Last Login IP</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent text-[11px] font-medium font-mono">
                        {subscriptions.map((sub, index) => {
                            // Calculate progress (mock logic)
                            const total = 30; // 30 days plan
                            const remaining = sub.daysRemaining;
                            const progress = ((total - remaining) / total) * 100;

                            return (
                                <tr key={index} className="hover:bg-primary/[0.02] transition-colors group relative">
                                    <td className="px-5 py-3 border-r border-border">
                                        <div className="flex flex-col">
                                            <span className="text-foreground font-sans font-bold">{sub.user}</span>
                                            <span className="text-[9px] text-muted-foreground">{sub.userId}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 border-r border-border">
                                        <div className="flex items-center gap-2">
                                            <CreditCard size={12} className="text-primary" />
                                            <span className="text-primary font-bold">{sub.plan}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-center border-r border-border text-muted-foreground">
                                        {sub.startDate}
                                    </td>
                                    <td className="px-5 py-3 text-center border-r border-border font-bold text-foreground">
                                        {sub.expiryDate}
                                    </td>
                                    <td className="px-5 py-3 border-r border-border">
                                        <div className="flex flex-col gap-1 w-full">
                                            <div className="flex justify-between text-[9px] uppercase font-bold text-muted-foreground">
                                                <span>Active</span>
                                                <span className={remaining < 5 ? "text-red-500" : "text-emerald-500"}>{remaining} Days Left</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${remaining < 5 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-center text-muted-foreground">
                                        {sub.lastLoginIp || '-'}
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

export default ActiveSubscriptionsTable;
