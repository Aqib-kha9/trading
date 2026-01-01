import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { ArrowLeft, Send, Radio, Megaphone, Calendar, Save, Calculator } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { createAnnouncement, updateAnnouncement, fetchAnnouncementById } from '../../api/announcements.api';
import useToast from '../../hooks/useToast';

const CreateAnnouncement = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'NEWS',
        targetAudience: {
            role: 'all',
            planValues: []
        },
        startDate: '',
        endDate: '',
        isActive: true,
        priority: 'NORMAL'
    });

    const [pushNotification, setPushNotification] = useState(true);

    useEffect(() => {
        if (isEditMode) {
            loadAnnouncement();
        }
    }, [id]);

    const loadAnnouncement = async () => {
        try {
            const response = await fetchAnnouncementById(id);
            const data = response.data;
            setFormData({
                title: data.title,
                message: data.message,
                type: data.type,
                targetAudience: data.targetAudience,
                startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : '',
                endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : '',
                isActive: data.isActive,
                priority: data.priority
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to load announcement details');
            navigate('/announcements/all');
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.message) {
            toast.error('Please fill in title and message');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                startDate: formData.startDate || undefined,
                endDate: formData.endDate || undefined
            };

            if (isEditMode) {
                await updateAnnouncement(id, payload);
                toast.success('Announcement updated successfully');
            } else {
                await createAnnouncement(payload);
                toast.success('Announcement broadcasted successfully');
            }
            navigate('/announcements/all');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save announcement');
        } finally {
            setLoading(false);
        }
    };

    const audienceOptions = [
        { label: 'All Users', value: 'all' },
        { label: 'App Users', value: 'user' },
        { label: 'Sub Brokers', value: 'sub-broker' }
    ];

    const typeOptions = [
        { label: 'News', value: 'NEWS', color: 'border-green-500 bg-green-500/10 text-green-500' },
        { label: 'Update', value: 'UPDATE', color: 'border-blue-500 bg-blue-500/10 text-blue-500' },
        { label: 'Event', value: 'EVENT', color: 'border-purple-500 bg-purple-500/10 text-purple-500' },
        { label: 'Urgent', value: 'URGENT', color: 'border-red-500 bg-red-500/10 text-red-500' },
        { label: 'Signal', value: 'SIGNAL', color: 'border-amber-500 bg-amber-500/10 text-amber-500' },
        { label: 'Economic', value: 'ECONOMIC', color: 'border-cyan-500 bg-cyan-500/10 text-cyan-500' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header matching CreateUser style */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                    <Megaphone className="text-primary" />
                    {isEditMode ? 'Edit Broadcast' : 'New Broadcast'}
                </h1>
                <Button variant="outline" onClick={() => navigate('/announcements/all')} className="gap-2">
                    <ArrowLeft size={16} /> Cancel
                </Button>
            </div>

            <Card className="terminal-panel p-6 space-y-6 bg-card border-border relative overflow-hidden">
                {/* Visual backdrop like All Users Table */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                <div className="space-y-6 relative z-10">
                    {/* Title Section */}
                    <div className="grid grid-cols-1 gap-6">
                        <Input
                            label="Broadcast Title"
                            placeholder="e.g. Market Alert: Nifty Update"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    {/* Type & Audience Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground ml-1">Announcement Type</label>
                            <div className="flex flex-wrap gap-2">
                                {typeOptions.map(t => (
                                    <button
                                        key={t.value}
                                        onClick={() => setFormData({ ...formData, type: t.value })}
                                        className={`flex-1 min-w-[70px] py-2 px-2 rounded-md border text-[10px] font-bold uppercase tracking-wide transition-all ${formData.type === t.value
                                            ? t.color
                                            : 'border-border bg-secondary/10 text-muted-foreground hover:bg-secondary/30'
                                            }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground ml-1">Target Audience</label>
                            <div className="flex gap-2 h-[38px] items-stretch">
                                {audienceOptions.map(a => (
                                    <button
                                        key={a.value}
                                        onClick={() => setFormData({ ...formData, targetAudience: { ...formData.targetAudience, role: a.value } })}
                                        className={`flex-1 px-2 rounded-md border text-[10px] font-bold uppercase tracking-wide transition-all ${formData.targetAudience.role === a.value
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border bg-secondary/10 text-muted-foreground hover:bg-secondary/30'
                                            }`}
                                    >
                                        {a.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Message Body */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Message Body</label>
                        <textarea
                            rows={8}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Type your broadcast message content here..."
                            className="w-full bg-secondary/30 border border-input rounded-lg px-4 py-3 text-sm text-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none transition-all"
                        ></textarea>
                    </div>

                    {/* Schedule Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <Input
                            type="datetime-local"
                            label="Start Date (Schedule)"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                        <Input
                            type="datetime-local"
                            label="End Date (Expiry)"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 bg-secondary/20 px-4 py-2 rounded-lg border border-border/50 w-full md:w-auto">
                            <div className="flex items-center gap-2">
                                <Radio size={16} className="text-primary animate-pulse" />
                                <span className="text-xs font-bold uppercase text-muted-foreground">Reach:</span>
                                <span className="text-xs font-bold text-foreground">
                                    {formData.targetAudience.role === 'all' ? 'All Users'
                                        : formData.targetAudience.role === 'sub-broker' ? 'Sub-Brokers Only'
                                            : 'App Users Only'}
                                </span>
                            </div>
                            <div className="h-4 w-[1px] bg-border"></div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="push"
                                    className="accent-primary w-4 h-4 rounded border-input"
                                    checked={pushNotification}
                                    onChange={(e) => setPushNotification(e.target.checked)}
                                />
                                <label htmlFor="push" className="text-xs font-medium text-foreground cursor-pointer">Send Push Notification</label>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button
                                variant="outline"
                                onClick={() => navigate(-1)}
                                className="flex-1 md:flex-none"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                className="flex-1 md:flex-none gap-2 shadow-lg shadow-primary/20 min-w-[140px]"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading
                                    ? <span>Saving...</span>
                                    : (isEditMode ? <><Save size={16} /> Update Broadcast</> : <><Send size={16} /> Broadcast Now</>)
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CreateAnnouncement;
