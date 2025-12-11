import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const DemoPlanSettings = ({ isEmbedded = false }) => {
    return (
        <div className={!isEmbedded ? "max-w-3xl mx-auto space-y-6" : "space-y-6"}>
            {!isEmbedded && (
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Demo Plan Configuration</h1>
                    <p className="text-muted-foreground text-sm">Manage free trial settings for new users</p>
                </div>
            )}

            <Card className="terminal-panel bg-card border-border" noPadding={isEmbedded}>
                <div className="space-y-6 p-6">
                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border">
                        <div>
                            <div className="font-bold text-sm text-foreground">Enable Free Trial</div>
                            <div className="text-xs text-muted-foreground">Give new users limited access automatically</div>
                        </div>
                        <div className="w-10 h-5 bg-primary/20 rounded-full cursor-pointer relative">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full shadow-lg"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Trial Duration (Days)</label>
                            <input type="number" defaultValue="7" className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Initial Wallet Credit (Virtual)</label>
                            <input type="number" defaultValue="0" className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Restricted Features</label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                <input type="checkbox" checked className="accent-primary" />
                                Block Premium Signals
                            </label>
                            <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                <input type="checkbox" checked className="accent-primary" />
                                Limit Access to Nifty 50 Only
                            </label>
                            <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                <input type="checkbox" className="accent-primary" />
                                Disable Community Chat
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button variant="primary">Update Settings</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default DemoPlanSettings;
