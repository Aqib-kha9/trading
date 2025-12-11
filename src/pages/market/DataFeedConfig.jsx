import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Database, Zap, Activity, Shield, Save, RefreshCw } from 'lucide-react';

const DataFeedConfig = () => {
    const [provider, setProvider] = useState('kite');
    const [isConnected, setIsConnected] = useState(true);

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-4">

            {/* Status Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 terminal-panel bg-card border-border relative overflow-hidden" noPadding>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Activity size={100} />
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-3 h-3 rounded-full shadow-[0_0_10px] ${isConnected ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-red-500 shadow-red-500/50'}`}></div>
                            <h3 className="text-lg font-bold text-foreground">Data Stream Status</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Current Provider</div>
                                <div className="text-xl font-mono text-primary font-bold mt-1">Zerodha Kite</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Latency</div>
                                <div className="text-xl font-mono text-emerald-500 font-bold mt-1">24ms</div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="terminal-panel bg-card border-border flex flex-col justify-center items-center gap-3" noPadding>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold text-center">Tick Count</div>
                    <div className="text-4xl font-mono text-foreground font-black">2.4M</div>
                    <div className="text-[9px] text-muted-foreground">Updates received today</div>
                </Card>
            </div>

            {/* Configuration Form */}
            <Card className="terminal-panel bg-card border-border" noPadding>
                <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Database size={16} className="text-primary" />
                        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">API Configuration</h3>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-[10px] border-border gap-1">
                        <RefreshCw size={10} /> Test Connection
                    </Button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Select Provider</label>
                        <div className="flex gap-4">
                            {['kite', 'upstox', 'fyers'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setProvider(p)}
                                    className={`flex-1 py-3 px-4 rounded-lg border text-sm font-bold uppercase tracking-wide transition-all ${provider === p
                                            ? 'border-primary bg-primary/10 text-primary shadow-sm'
                                            : 'border-border bg-secondary/10 text-muted-foreground hover:bg-secondary/30'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase">API Key</label>
                            <input
                                type="password"
                                value="cx7889sady878asd"
                                onChange={() => { }}
                                className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-2.5 text-xs font-mono text-foreground focus:border-primary/50 focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase">API Secret</label>
                            <input
                                type="password"
                                value="*****************"
                                onChange={() => { }}
                                className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-2.5 text-xs font-mono text-foreground focus:border-primary/50 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-end">
                        <Button variant="primary" className="gap-2 shadow-lg shadow-primary/20">
                            <Save size={16} /> Save Configuration
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default DataFeedConfig;
