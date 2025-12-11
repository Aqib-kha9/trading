import React from 'react';
import { Download, ShoppingCart } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const PurchaseHistory = () => {
    // Mock Data
    const purchases = [
        { id: 'INV-2024-001', user: 'Rajesh Kumar', plan: 'Gold Membership', amount: 4999, date: '12 Jan 2024', method: 'UPI' },
        { id: 'INV-2024-002', user: 'Amit Singh', plan: 'Silver Membership', amount: 2499, date: '11 Jan 2024', method: 'Credit Card' },
        { id: 'INV-2024-003', user: 'Sneha Gupta', plan: 'Platinum Membership', amount: 9999, date: '10 Jan 2024', method: 'UPI' },
        { id: 'INV-2024-004', user: 'Vikram Malhotra', plan: 'Gold Membership', amount: 4999, date: '09 Jan 2024', method: 'Netbanking' },
    ];

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Global Purchase History</h1>
                    <p className="text-muted-foreground text-sm">All transactions across the platform</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download size={14} /> Export CSV
                    </Button>
                </div>
            </div>

            <Card className="flex-1 bg-[#050505] border-white/5 overflow-hidden" noPadding>
                <div className="overflow-auto h-full">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-secondary/30 text-xs font-bold uppercase text-muted-foreground sticky top-0">
                            <tr>
                                <th className="p-4 border-b border-white/5">Invoice ID</th>
                                <th className="p-4 border-b border-white/5">User</th>
                                <th className="p-4 border-b border-white/5">Plan Purchased</th>
                                <th className="p-4 border-b border-white/5">Amount</th>
                                <th className="p-4 border-b border-white/5">Date</th>
                                <th className="p-4 border-b border-white/5">Method</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {purchases.map((item, index) => (
                                <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4 font-mono text-muted-foreground">{item.id}</td>
                                    <td className="p-4 font-medium text-foreground">{item.user}</td>
                                    <td className="p-4 text-foreground">{item.plan}</td>
                                    <td className="p-4 text-emerald-500 font-mono font-bold">₹{item.amount.toLocaleString()}</td>
                                    <td className="p-4 text-muted-foreground">{item.date}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-4 bg-white/10 rounded flex items-center justify-center">
                                                <ShoppingCart size={10} className="text-muted-foreground" />
                                            </div>
                                            <span className="text-xs text-muted-foreground">{item.method}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default PurchaseHistory;
