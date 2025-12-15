import React, { useState } from 'react';
import { ArrowLeft, Save, Upload, User, Mail, Phone, Briefcase, MapPin, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const AddBroker = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', company: '',
        location: '', commission: '20',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock API call simulation
        console.log("Onboarding Broker:", formData);
        navigate('/brokers/all');
    };

    return (
        <div className="h-full flex flex-col gap-6 max-w-4xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center gap-4 shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-lg border border-white/5 hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-foreground">Onboard New Partner</h1>
                    <p className="text-sm text-muted-foreground">Register a new sub-broker into the system.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-6 pb-6">

                {/* Basic Info Card */}
                <Card className="p-6 bg-[#050505] border-white/5 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-white/5 pb-2 mb-4">Partner Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <User size={12} /> Full Name
                            </label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Rahul Verma"
                                className="w-full bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-sm focus:border-primary/50 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Company */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <Briefcase size={12} /> Agency / Company Name
                            </label>
                            <input
                                required
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="e.g. Verma Financials"
                                className="w-full bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-sm focus:border-primary/50 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <Mail size={12} /> Email Address
                            </label>
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="rahul@example.com"
                                className="w-full bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-sm focus:border-primary/50 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <Phone size={12} /> Phone Number
                            </label>
                            <input
                                required
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 9876543210"
                                className="w-full bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-sm focus:border-primary/50 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <MapPin size={12} /> Location / City
                            </label>
                            <input
                                required
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Mumbai, Maharastra"
                                className="w-full bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-sm focus:border-primary/50 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                </Card>

                {/* Agreement Details */}
                <Card className="p-6 bg-[#050505] border-white/5 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary border-b border-white/5 pb-2 mb-4">Commission & Config</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Commission */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <Percent size={12} /> Commission Share (%)
                            </label>
                            <div className="relative">
                                <input
                                    required
                                    type="number"
                                    name="commission"
                                    value={formData.commission}
                                    onChange={handleChange}
                                    placeholder="20"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg h-10 pl-3 pr-10 text-sm focus:border-primary/50 focus:outline-none transition-colors font-mono"
                                />
                                <span className="absolute right-3 top-2.5 text-xs text-muted-foreground font-bold">%</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">Percentage of revenue shared with the broker.</p>
                        </div>

                        {/* Agreement Doc */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                                <Upload size={12} /> Agreement Document (PDF)
                            </label>
                            <div className="border border-dashed border-white/20 rounded-lg h-10 flex items-center justify-center text-xs text-muted-foreground hover:bg-white/5 cursor-pointer transition-colors">
                                <span>Click to upload contract</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)} className="w-24">Cancel</Button>
                    <Button type="submit" variant="primary" className="w-32 shadow-lg shadow-primary/20 gap-2 font-bold">
                        <Save size={14} /> Onboard
                    </Button>
                </div>

            </form>
        </div>
    );
};

export default AddBroker;
