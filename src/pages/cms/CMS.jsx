import React, { useState } from 'react';
import { clsx } from 'clsx';
import { FileText, Shield, DollarSign, Info, HelpCircle, Save, Plus, Trash2, Edit3, Bold, Italic, List, Link } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const RichTextEditor = ({ label, defaultValue }) => (
    <Card className="terminal-panel bg-card border-border" noPadding>
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Edit3 size={16} className="text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">{label}</h3>
            </div>
            <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-muted/20 rounded text-muted-foreground hover:text-foreground transition-colors"><Bold size={14} /></button>
                <button className="p-1.5 hover:bg-muted/20 rounded text-muted-foreground hover:text-foreground transition-colors"><Italic size={14} /></button>
                <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                <button className="p-1.5 hover:bg-muted/20 rounded text-muted-foreground hover:text-foreground transition-colors"><List size={14} /></button>
                <button className="p-1.5 hover:bg-muted/20 rounded text-muted-foreground hover:text-foreground transition-colors"><Link size={14} /></button>
            </div>
        </div>
        <div className="p-0">
            <textarea
                className="w-full h-[400px] bg-transparent border-none p-6 text-xs font-mono text-foreground focus:outline-none resize-none leading-relaxed"
                defaultValue={defaultValue}
            ></textarea>
        </div>
        <div className="p-4 border-t border-border bg-muted/10 flex justify-end">
            <Button variant="primary" className="gap-2 shadow-lg shadow-primary/20">
                <Save size={16} /> Save Content
            </Button>
        </div>
    </Card>
);

import { useNavigate } from 'react-router-dom';

const CMS = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('terms');

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Header with Tabs */}
            <div className="flex flex-col gap-4 shrink-0">
                {/* Tab Navigation */}
                <div className="flex items-center gap-1 border-b border-border overflow-x-auto custom-scrollbar">
                    <button
                        onClick={() => setActiveTab('terms')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 whitespace-nowrap",
                            activeTab === 'terms' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <FileText size={14} /> Terms
                    </button>
                    <button
                        onClick={() => setActiveTab('privacy')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 whitespace-nowrap",
                            activeTab === 'privacy' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <Shield size={14} /> Privacy
                    </button>
                    <button
                        onClick={() => setActiveTab('refund')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 whitespace-nowrap",
                            activeTab === 'refund' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <DollarSign size={14} /> Refund
                    </button>
                    <button
                        onClick={() => setActiveTab('about')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 whitespace-nowrap",
                            activeTab === 'about' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <Info size={14} /> About Us
                    </button>
                    <button
                        onClick={() => setActiveTab('faqs')}
                        className={clsx(
                            "px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 whitespace-nowrap",
                            activeTab === 'faqs' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                        )}
                    >
                        <HelpCircle size={14} /> FAQs
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 relative overflow-y-auto custom-scrollbar">
                <div className="max-w-5xl mx-auto pb-10">

                    {activeTab === 'terms' && (
                        <RichTextEditor
                            label="Terms & Conditions"
                            defaultValue={`## 1. Introduction\nWelcome to MasterStroke Trading. By accessing our website, you agree to these terms.\n\n## 2. Services\nWe provide educational content and market analysis tools.\n\n## 3. User Obligations\nYou agree not to share your account credentials.`}
                        />
                    )}

                    {activeTab === 'privacy' && (
                        <RichTextEditor
                            label="Privacy Policy"
                            defaultValue={`## 1. Data Collection\nWe collect email and basic profile information.\n\n## 2. Usage\nData is used to personalize your experience.\n\n## 3. Security\nWe use industry-standard encryption.`}
                        />
                    )}

                    {activeTab === 'refund' && (
                        <RichTextEditor
                            label="Refund Policy"
                            defaultValue={`## 1. Eligibility\nRefunds are processed within 7 days of purchase if satisfied.\n\n## 2. Process\nContact support@masterstroke.com to initiate a request.`}
                        />
                    )}

                    {activeTab === 'about' && (
                        <RichTextEditor
                            label="About Us"
                            defaultValue={`## Our Mission\nTo empower traders with data-driven insights.\n\n## Our Story\nFounded in 2023, we have helped over 10,000 traders.`}
                        />
                    )}

                    {activeTab === 'faqs' && (
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => navigate('/cms/faqs/create')}
                                    className="gap-2 shadow-lg shadow-primary/20"
                                >
                                    <Plus size={14} /> Add New Question
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { q: "How do I upgrade my plan?", a: "Go to Subscriptions page and click Upgrade." },
                                    { q: "Is the data real-time?", a: "Yes, our data is sourced directly from exchanges." },
                                    { q: "Can I cancel anytime?", a: "Yes, you can cancel auto-renewal in settings." }
                                ].map((item, idx) => (
                                    <Card key={idx} className="bg-card border-border hover:border-primary/50 transition-colors group">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <h4 className="text-xs font-bold text-foreground">{item.q}</h4>
                                                <p className="text-[10px] text-muted-foreground">{item.a}</p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1 hover:text-primary"><Edit3 size={12} /></button>
                                                <button className="p-1 hover:text-red-500"><Trash2 size={12} /></button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CMS;
