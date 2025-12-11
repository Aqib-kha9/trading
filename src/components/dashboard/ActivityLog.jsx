import React from 'react';
import { Clock, Shield, User, Wallet, Activity } from 'lucide-react';

const LOGS = [
    { id: 1, type: 'login', msg: 'Admin login via 192.168.1.5', time: 'Just now', icon: Shield, color: 'text-emerald-500' },
    { id: 2, type: 'sub', msg: 'User Rajesh purchased Gold Plan', time: '2 mins ago', icon: Wallet, color: 'text-amber-500' },
    { id: 3, type: 'user', msg: 'New Registration: Amit Singh', time: '15 mins ago', icon: User, color: 'text-blue-500' },
    { id: 4, type: 'sys', msg: 'Signal Broadcast: NIFTY Buy', time: '1 hr ago', icon: Activity, color: 'text-purple-500' },
    { id: 5, type: 'login', msg: 'User Sneha logged in', time: '2 hrs ago', icon: User, color: 'text-white/50' },
    { id: 6, type: 'sub', msg: 'Sub Expired: Vikram M.', time: '3 hrs ago', icon: Wallet, color: 'text-red-500' },
    { id: 7, type: 'sys', msg: 'System Backup Completed', time: '5 hrs ago', icon: Activity, color: 'text-emerald-500' },
    { id: 8, type: 'login', msg: 'Admin session refresh', time: '6 hrs ago', icon: Shield, color: 'text-emerald-500' },
];

const ActivityLog = () => {
    return (
        <div className="h-full bg-background/50 border border-white/5 rounded-xl shadow-xl flex flex-col overflow-hidden relative group hover:border-primary/50 transition-all duration-500">
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none"></div>

            {/* Top Shine */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="h-10 shrink-0 border-b border-white/5 px-3 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-xs font-bold text-white/90 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} className="text-primary" /> Live Activity
                </h3>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {LOGS.map((log) => (
                    <div key={log.id} className="group flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-default">
                        <div className={`mt-0.5 shrink-0 ${log.color}`}>
                            <log.icon size={12} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-muted-foreground group-hover:text-white transition-colors truncate">
                                {log.msg}
                            </p>
                            <span className="text-[9px] text-muted-foreground/40 font-mono flex items-center gap-1">
                                <Clock size={8} /> {log.time}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-700 group-hover:w-full"></div>
        </div>
    );
};

export default ActivityLog;
