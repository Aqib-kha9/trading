import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Settings as SettingsIcon, Shield, Headphones, CreditCard, Bell, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('admin'); // admin, support, payment, notifications

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Header with Tabs */}
            <div className="flex flex-col gap-4 shrink-0">
                {/* Tab Navigation */}
                <div className="flex items-center gap-1 border-b border-border">
                    <button
                        onClick={() => setActiveTab('admin')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'admin'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <Shield size={14} /> Admin
                    </button>
                    <button
                        onClick={() => setActiveTab('support')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'support'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <Headphones size={14} /> Support
                    </button>
                    <button
                        onClick={() => setActiveTab('payment')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'payment'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <CreditCard size={14} /> Payment
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2",
                            activeTab === 'notifications'
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <Bell size={14} /> Notifications
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 relative overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-6 pb-10">

                    {activeTab === 'admin' && (
                        <Card className="terminal-panel bg-card border-border" noPadding>
                            <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-2">
                                <Shield size={16} className="text-primary" />
                                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Admin Configuration</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase">System Name</label>
                                        <input type="text" defaultValue="MasterStroke Trading" className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-2.5 text-xs font-mono text-foreground focus:border-primary/50 focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase">Support Email</label>
                                        <input type="text" defaultValue="support@mspk.com" className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-2.5 text-xs font-mono text-foreground focus:border-primary/50 focus:outline-none" />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-white/5 flex justify-end">
                                    <Button variant="primary" className="gap-2 shadow-lg shadow-primary/20">
                                        <Save size={16} /> Save Changes
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'support' && (
                        <Card className="terminal-panel bg-card border-border" noPadding>
                            <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-2">
                                <Headphones size={16} className="text-primary" />
                                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Support Configuration</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase">Helpdesk Email</label>
                                        <input type="email" defaultValue="help@masterstroke.com" className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-2.5 text-xs font-mono text-foreground focus:border-primary/50 focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase">Contact Number</label>
                                        <input type="text" defaultValue="+91 98765 43210" className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-2.5 text-xs font-mono text-foreground focus:border-primary/50 focus:outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase">Operating Hours</label>
                                    <input type="text" defaultValue="Mon - Fri, 9:00 AM - 6:00 PM IST" className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-2.5 text-xs font-mono text-foreground focus:border-primary/50 focus:outline-none" />
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-top border-border">
                                    <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-secondary/10">
                                        <span className="text-xs font-bold text-foreground">Enable Live Chat</span>
                                        <div className="w-8 h-4 bg-primary/20 rounded-full relative cursor-pointer border border-primary/50">
                                            <div className="absolute right-0.5 top-0.5 h-2.5 w-2.5 bg-primary rounded-full shadow-sm"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-secondary/10">
                                        <span className="text-xs font-bold text-foreground">Ticket System</span>
                                        <div className="w-8 h-4 bg-primary/20 rounded-full relative cursor-pointer border border-primary/50">
                                            <div className="absolute right-0.5 top-0.5 h-2.5 w-2.5 bg-primary rounded-full shadow-sm"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                                    <Button variant="outline" size="sm" className="border-border">Reset</Button>
                                    <Button variant="primary" className="gap-2 shadow-lg shadow-primary/20">
                                        <Save size={16} /> Update Support Settings
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'payment' && (
                        <Card className="terminal-panel bg-card border-border" noPadding>
                            <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-2">
                                <CreditCard size={16} className="text-primary" />
                                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Payment Gateway</h3>
                            </div>
                            <div className="p-6 space-y-8">
                                {/* Razorpay Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-blue-600/20 flex items-center justify-center text-blue-500 font-bold text-xs border border-blue-600/30">RZP</div>
                                            <div>
                                                <h4 className="text-sm font-bold text-foreground">Razorpay</h4>
                                                <p className="text-[10px] text-muted-foreground">Indian Payment Gateway</p>
                                            </div>
                                        </div>
                                        <div className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] uppercase font-bold tracking-wider">Active</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase">Key ID</label>
                                            <input type="text" value="rzp_live_xxxxxxxxxxxx" className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-2.5 text-xs font-mono text-foreground focus:border-primary/50 focus:outline-none" readOnly />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase">Key Secret</label>
                                            <input type="password" value="****************" className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-2.5 text-xs font-mono text-foreground focus:border-primary/50 focus:outline-none" readOnly />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5 mx-[-24px]"></div>

                                {/* Stripe Section */}
                                <div className="space-y-4 opacity-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-indigo-600/20 flex items-center justify-center text-indigo-500 font-bold text-xs border border-indigo-600/30">STR</div>
                                            <div>
                                                <h4 className="text-sm font-bold text-foreground">Stripe</h4>
                                                <p className="text-[10px] text-muted-foreground">International Payments</p>
                                            </div>
                                        </div>
                                        <div className="px-2 py-1 rounded bg-secondary border border-border text-muted-foreground text-[9px] uppercase font-bold tracking-wider">Inactive</div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex justify-end">
                                    <Button variant="primary" className="gap-2 shadow-lg shadow-primary/20">
                                        <Save size={16} /> Save Credentials
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'notifications' && (
                        <Card className="terminal-panel bg-card border-border" noPadding>
                            <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-2">
                                <Bell size={16} className="text-primary" />
                                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Notification Preferences</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50">
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-bold text-foreground uppercase">Email Alerts</h4>
                                            <p className="text-[10px] text-muted-foreground">Send transactional emails for purchases and login.</p>
                                        </div>
                                        <div className="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer border border-primary/50 transition-colors">
                                            <div className="absolute right-0.5 top-0.5 h-4 w-4 bg-primary rounded-full shadow-sm"></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50">
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-bold text-foreground uppercase">WhatsApp Notifications</h4>
                                            <p className="text-[10px] text-muted-foreground">Send trade signals and alerts via WhatsApp API.</p>
                                        </div>
                                        <div className="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer border border-primary/50 transition-colors">
                                            <div className="absolute right-0.5 top-0.5 h-4 w-4 bg-primary rounded-full shadow-sm"></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card/50">
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-bold text-foreground uppercase">Telegram Integration</h4>
                                            <p className="text-[10px] text-muted-foreground">Broadcast messages to Telegram Channel.</p>
                                        </div>
                                        <div className="w-10 h-5 bg-secondary rounded-full relative cursor-pointer border border-border transition-colors">
                                            <div className="absolute left-0.5 top-0.5 h-4 w-4 bg-muted-foreground rounded-full shadow-sm"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex justify-end">
                                    <Button variant="primary" className="gap-2 shadow-lg shadow-primary/20">
                                        <Save size={16} /> Update Preferences
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Settings;
