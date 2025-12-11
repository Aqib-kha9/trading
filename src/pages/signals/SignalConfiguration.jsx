import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Tag, Plus, Trash2, Shield, Send } from 'lucide-react';

const SignalConfiguration = () => {
    // Mock State for Categories
    const [categories, setCategories] = useState([
        { id: 1, name: 'NIFTY 50', type: 'Index' },
        { id: 2, name: 'BANKNIFTY', type: 'Index' },
        { id: 3, name: 'INTRADAY STOCKS', type: 'Equity' },
        { id: 4, name: 'BTST', type: 'Equity' },
        { id: 5, name: 'CRUDE OIL', type: 'Commodity' },
    ]);

    const [newCat, setNewCat] = useState('');

    const addCategory = () => {
        if (newCat.trim()) {
            setCategories([...categories, { id: Date.now(), name: newCat.toUpperCase(), type: 'Custom' }]);
            setNewCat('');
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Categories Management */}
                <Card className="terminal-panel bg-card border-border" noPadding>
                    <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Tag size={16} className="text-primary" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Signal Segments</h3>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">{categories.length} SEGMENTS</span>
                    </div>

                    <div className="p-4 space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newCat}
                                onChange={(e) => setNewCat(e.target.value)}
                                placeholder="NEW SYMBOL/SEGMENT..."
                                className="flex-1 bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs font-mono focus:border-primary/50 focus:outline-none"
                            />
                            <Button size="sm" variant="primary" onClick={addCategory} className="w-10 flex items-center justify-center">
                                <Plus size={14} />
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <div key={cat.id} className="group relative flex items-center bg-secondary/20 border border-border rounded-md pl-3 pr-8 py-1.5 transition-all hover:bg-secondary/40 hover:border-primary/30">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-foreground">{cat.name}</span>
                                        <span className="text-[8px] text-muted-foreground uppercase">{cat.type}</span>
                                    </div>
                                    <button
                                        onClick={() => setCategories(categories.filter(c => c.id !== cat.id))}
                                        className="absolute right-1 w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Automation Loading */}
                <Card className="terminal-panel bg-card border-border" noPadding>
                    <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Send size={16} className="text-blue-500" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Automation Channels</h3>
                        </div>
                        <span className="text-[10px] text-emerald-500 font-bold font-mono uppercase">System Online</span>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="text-sm font-bold text-foreground">Telegram Broadcast</div>
                                <div className="text-xs text-muted-foreground">Auto-post signals to Telegram Channel</div>
                            </div>
                            <div className="w-10 h-5 bg-primary/20 rounded-full cursor-pointer relative">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full shadow-lg"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between opacity-50">
                            <div className="space-y-0.5">
                                <div className="text-sm font-bold text-foreground">WhatsApp API</div>
                                <div className="text-xs text-muted-foreground">Send alerts via WhatsApp Business</div>
                            </div>
                            <div className="w-10 h-5 bg-white/10 rounded-full cursor-pointer relative">
                                <div className="absolute left-1 top-1 w-3 h-3 bg-muted-foreground rounded-full shadow-lg"></div>
                            </div>
                        </div>

                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-500 mb-1">
                                <Shield size={12} />
                                <span className="text-[10px] font-bold uppercase">Safe Mode</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                Access Control is currently enforced. Only users with active Plan IDs matching the Signal Category will receive updates.
                            </p>
                        </div>
                    </div>
                </Card>

            </div>
        </div>
    );
};

export default SignalConfiguration;
