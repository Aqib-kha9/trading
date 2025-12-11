import React from 'react';
import Card from '../../components/ui/Card';

const ActiveSubscriptions = () => {
    return (
        <div className="h-full flex flex-col">
            <h1 className="text-2xl font-bold text-foreground mb-6">Active Subscriptions</h1>
            <Card className="flex-1 bg-[#050505] border-white/5" noPadding>
                <div className="p-10 flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 animate-pulse"></div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Loading Subscription Data...</h3>
                        <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-2">
                            This module will connect to the live subscription database shortly.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ActiveSubscriptions;
