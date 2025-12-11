import React from 'react';
import { Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const EditUser = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Edit User</h1>
                    <p className="text-muted-foreground text-sm">Update client details and permissions</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        <X size={16} /> Cancel
                    </Button>
                    <Button variant="primary" className="shadow-lg shadow-primary/20">
                        <Save size={16} /> Save Changes
                    </Button>
                </div>
            </div>

            <Card className="bg-[#050505] border-white/5">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                            <input type="text" defaultValue="Rajesh Kumar" className="w-full bg-secondary/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                            <input type="email" defaultValue="rajesh@example.com" className="w-full bg-secondary/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                            <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-secondary/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</label>
                            <select className="w-full bg-secondary/30 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-primary/50 focus:outline-none transition-colors">
                                <option value="Active">Active</option>
                                <option value="Blocked">Blocked</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>
                    </div>
                </form>
            </Card>

            <Card className="bg-[#050505] border-white/5">
                <h3 className="text-lg font-bold text-foreground mb-4">Security Settings</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-white/5">
                        <div>
                            <div className="font-bold text-sm text-foreground">Two-Factor Authentication</div>
                            <div className="text-xs text-muted-foreground">Require 2FA for login</div>
                        </div>
                        <div className="w-10 h-5 bg-primary/20 rounded-full cursor-pointer relative">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full shadow-lg"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-white/5">
                        <div>
                            <div className="font-bold text-sm text-foreground">Trading Access</div>
                            <div className="text-xs text-muted-foreground">Allow user to execute trades</div>
                        </div>
                        <div className="w-10 h-5 bg-primary/20 rounded-full cursor-pointer relative">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full shadow-lg"></div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default EditUser;
