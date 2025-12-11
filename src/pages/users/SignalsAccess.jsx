import React from 'react';
import { Key, Unlock, Lock } from 'lucide-react';
import Card from '../../components/ui/Card';

const SignalsAccess = ({ isEmbedded = false }) => {
    const accessList = [
        { category: 'Nifty 50 Options', access: true, expiry: '12 Feb 2024' },
        { category: 'BankNifty Options', access: true, expiry: '12 Feb 2024' },
        { category: 'Stocks Intraday', access: true, expiry: '12 Feb 2024' },
        { category: 'Commodity (MCX)', access: false, expiry: '-' },
        { category: 'Forex Signals', access: false, expiry: '-' },
    ];

    return (
        <div className={`space-y-6 ${isEmbedded ? 'pt-2' : ''}`}>
            {!isEmbedded && (
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Signals Access Control</h1>
                    <p className="text-muted-foreground text-sm">Manage which trading signals this user can see</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accessList.map((item, index) => (
                    <Card
                        key={index}
                        className={`border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors ${item.access ? 'bg-[#050505]' : 'bg-black/40'}`}
                        noPadding
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-lg ${item.access ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                                    {item.access ? <Unlock size={20} /> : <Lock size={20} />}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${item.access
                                    ? 'border-primary/20 bg-primary/5 text-primary'
                                    : 'border-white/10 bg-white/5 text-muted-foreground'
                                    }`}>
                                    {item.access ? 'Granted' : 'Locked'}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-foreground mb-1">{item.category}</h3>
                            <p className="text-xs text-muted-foreground">
                                {item.access ? `Valid until: ${item.expiry}` : 'Upgrade plan to unlock'}
                            </p>
                        </div>

                        {/* Footer Action */}
                        <div className="p-3 bg-white/[0.02] border-t border-white/5 flex justify-end">
                            <button className={`text-xs font-bold uppercase tracking-wider hover:underline ${item.access ? 'text-red-500' : 'text-primary'}`}>
                                {item.access ? 'Revoke Access' : 'Grant Access'}
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SignalsAccess;
