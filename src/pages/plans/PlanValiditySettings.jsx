import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const PlanValiditySettings = ({ isEmbedded = false }) => {
    return (
        <div className={!isEmbedded ? "max-w-3xl mx-auto space-y-6" : "space-y-6"}>
            {!isEmbedded && (
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Validity Global Settings</h1>
                    <p className="text-muted-foreground text-sm">Configure grace periods and expiration alerts</p>
                </div>
            )}

            <Card className="terminal-panel bg-card border-border" noPadding={isEmbedded}>
                <div className="space-y-6 p-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Grace Period (Hours)</label>
                        <p className="text-xs text-muted-foreground mb-2">Time allowed after expiry before service cuts off</p>
                        <input type="number" defaultValue="24" className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none transition-colors" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pre-Expiry Reminder (Days)</label>
                        <p className="text-xs text-muted-foreground mb-2">When to start sending renewal notifications</p>
                        <input type="number" defaultValue="3" className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none transition-colors" />
                    </div>

                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <h4 className="text-sm font-bold text-orange-500 mb-1">Auto-Renewal Policy</h4>
                        <p className="text-xs text-muted-foreground">
                            Currently, auto-renewal is disabled. Users must manually renew their plans. Enabling this requires a payment gateway that supports recurring billing.
                        </p>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button variant="primary">Save Configuration</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PlanValiditySettings;
