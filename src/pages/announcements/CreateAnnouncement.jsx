import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ArrowLeft, Send, Radio, Megaphone, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateAnnouncement = () => {
    const navigate = useNavigate();
    const [type, setType] = useState('Update');
    const [audience, setAudience] = useState('All Users');

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Draft New Broadcast</h1>
                        <p className="text-xs text-muted-foreground font-mono">Send push notifications or in-app messages to users.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Form */}
                <Card className="md:col-span-2 terminal-panel bg-card border-border" noPadding>
                    <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-2">
                        <Megaphone size={16} className="text-primary" />
                        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Announcement Details</h3>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase">Title</label>
                            <input
                                type="text"
                                placeholder="e.g., Important Market Update"
                                className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-2.5 text-xs font-mono text-foreground focus:border-primary/50 focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Type</label>
                                <div className="flex gap-2">
                                    {['Update', 'Urgent', 'Event'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setType(t)}
                                            className={`flex-1 py-2 px-2 rounded-md border text-[10px] font-bold uppercase tracking-wide transition-all ${type === t
                                                    ? t === 'Urgent' ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-primary bg-primary/10 text-primary'
                                                    : 'border-border bg-secondary/10 text-muted-foreground hover:bg-secondary/30'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Audience</label>
                                <div className="flex gap-2">
                                    {['All Users', 'Premium', 'Free'].map(a => (
                                        <button
                                            key={a}
                                            onClick={() => setAudience(a)}
                                            className={`flex-1 py-2 px-2 rounded-md border text-[10px] font-bold uppercase tracking-wide transition-all ${audience === a
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-border bg-secondary/10 text-muted-foreground hover:bg-secondary/30'
                                                }`}
                                        >
                                            {a}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase">Message Body</label>
                            <textarea
                                rows={6}
                                placeholder="Type your message here..."
                                className="w-full bg-secondary/20 border border-border rounded-lg px-4 py-3 text-xs font-mono text-foreground focus:border-primary/50 focus:outline-none resize-none"
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Schedule (Optional)</label>
                                <div className="flex items-center gap-1.5 text-xs text-primary cursor-pointer hover:underline">
                                    <Calendar size={12} />
                                    <span>Send Later</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="push" className="accent-primary" defaultChecked />
                                <label htmlFor="push" className="text-xs text-muted-foreground">Send Push Notification</label>
                            </div>
                            <Button variant="primary" className="gap-2 shadow-lg shadow-primary/20">
                                <Send size={16} /> Broadcast Now
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="bg-card border-border p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                                <Radio size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-foreground">Reach Estimate</h4>
                            </div>
                        </div>
                        <div className="text-center py-4">
                            <div className="text-3xl font-bold text-foreground">1,240</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Users will be notified</div>
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center">
                            Based on your selection of <strong>{audience}</strong>.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CreateAnnouncement;
