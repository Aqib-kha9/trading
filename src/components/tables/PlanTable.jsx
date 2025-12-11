import React from 'react';
import { Edit, Trash2, CheckCircle, XCircle, CreditCard, Clock } from 'lucide-react';

const PlanTable = ({ plans, onAction }) => {
    return (
        <div className="terminal-panel w-full h-full overflow-hidden border border-border bg-card rounded-lg shadow-2xl relative flex flex-col">
            {/* Table Header Backdrop */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <div className="overflow-auto flex-1 custom-scrollbar">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-muted/50 sticky top-0 z-10 uppercase tracking-widest text-[9px] font-bold text-muted-foreground border-b border-border shadow-sm backdrop-blur-md">
                        <tr>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Plan ID</th>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Plan Name</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Price</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Validity</th>
                            <th className="px-5 py-3 border-r border-border text-center bg-muted/90 backdrop-blur-sm">Type</th>
                            <th className="px-5 py-3 border-r border-border bg-muted/90 backdrop-blur-sm">Features Included</th>
                            <th className="px-5 py-3 text-center bg-muted/90 backdrop-blur-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent text-[11px] font-medium font-mono">
                        {plans.map((plan) => (
                            <tr key={plan.id} className="hover:bg-primary/[0.02] transition-colors group relative">
                                <td className="px-5 py-3 font-bold text-muted-foreground border-r border-border">
                                    {plan.id}
                                </td>
                                <td className="px-5 py-3 border-r border-border">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-md ${plan.isDemo ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                            <CreditCard size={14} />
                                        </div>
                                        <span className="text-foreground font-semibold font-sans text-xs">{plan.name}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-center border-r border-border font-bold text-foreground">
                                    ₹ {plan.price}
                                </td>
                                <td className="px-5 py-3 text-center border-r border-border text-muted-foreground">
                                    <div className="flex items-center justify-center gap-1">
                                        <Clock size={12} />
                                        {plan.validity_days} Days
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-center border-r border-border">
                                    <span className={`px-2 py-0.5 border rounded-[4px] text-[9px] uppercase font-bold tracking-wider ${plan.isDemo
                                            ? 'border-blue-500/20 text-blue-500 bg-blue-500/5'
                                            : 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
                                        }`}>
                                        {plan.isDemo ? 'Demo' : 'Premium'}
                                    </span>
                                </td>
                                <td className="px-5 py-3 border-r border-border max-w-[200px] truncate text-muted-foreground italic">
                                    {plan.features.join(', ')}
                                </td>
                                <td className="px-3 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <button
                                            title="Edit Plan"
                                            onClick={() => onAction('edit', plan)}
                                            className="p-1.5 hover:bg-blue-500/10 hover:text-blue-500 text-muted-foreground rounded-md transition-all duration-200"
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button
                                            title="Delete Plan"
                                            onClick={() => onAction('delete', plan)}
                                            className="p-1.5 hover:bg-red-500/10 hover:text-red-500 text-muted-foreground rounded-md transition-all duration-200"
                                        >
                                            <Trash2 size={14} />
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

export default PlanTable;
