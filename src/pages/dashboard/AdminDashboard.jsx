import React from 'react';
import { useTheme } from '../../components/theme-provider';
import VisualStatCard from '../../components/dashboard/VisualStatCard';
import AdminRevenueGraph from '../../components/dashboard/AdminRevenueGraph';
import RecentOrdersTable from '../../components/dashboard/RecentOrdersTable';
import ActivityLog from '../../components/dashboard/ActivityLog';
import QuickActions from '../../components/dashboard/QuickActions';

const AdminDashboard = () => {
    return (
        <div className="space-y-4 flex flex-col h-auto lg:h-full lg:overflow-hidden pb-4 lg:pb-0">
            {/* Top Grid: Top Movers (Visual Style) */}
            {/* Mobile: 2 cols, Desktop: 4 cols. Height auto on mobile, fixed on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 h-auto lg:h-36 shrink-0">
                <VisualStatCard
                    title="Revenue"
                    value="85.2L"
                    change="+24%"
                    type="area"
                    color="#10b981"
                    data={[{ v: 10 }, { v: 15 }, { v: 12 }, { v: 25 }, { v: 20 }, { v: 35 }, { v: 40 }]}
                />
                <VisualStatCard
                    title="Users"
                    value="12.4K"
                    change="+12%"
                    type="bar"
                    color="#3b82f6"
                />
                <VisualStatCard
                    title="Subs"
                    value="84%"
                    change="+5%"
                    type="radial"
                    color="#f59e0b"
                />
                <VisualStatCard
                    title="Signals"
                    value="92%"
                    change="High"
                    type="area"
                    color="#ef4444"
                    data={[{ v: 50 }, { v: 80 }, { v: 60 }, { v: 90 }, { v: 75 }, { v: 95 }, { v: 85 }]}
                />
            </div>

            {/* Main Content Grid - Trading Layout with Admin Data */}
            {/* Mobile: Stacked, Desktop: 12 Cols */}
            <div className="flex-1 lg:min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:pb-2">
                {/* Left Column: Graph & Orders (8/12) */}
                <div className="lg:col-span-9 flex flex-col gap-3 h-auto lg:h-full lg:min-h-0">
                    {/* Revenue Graph: Fixed height on mobile, Flex on desktop */}
                    <div className="h-72 lg:h-auto lg:flex-1 lg:min-h-0">
                        <AdminRevenueGraph />
                    </div>
                    {/* Recent Orders: Fixed height on mobile/desktop */}
                    <div className="h-64 lg:h-56 shrink-0">
                        <RecentOrdersTable />
                    </div>
                </div>

                {/* Right Column: Activity & Quick Actions (4/12) */}
                <div className="lg:col-span-3 flex flex-col gap-3 h-auto lg:h-full lg:min-h-0">
                    {/* Activity Log: Fixed height on mobile, Flex on desktop */}
                    <div className="h-80 lg:h-auto lg:flex-1 lg:min-h-0 rounded-2xl overflow-hidden">
                        <ActivityLog />
                    </div>
                    {/* Quick Actions: Fixed height */}
                    <div className="h-auto lg:h-48 shrink-0">
                        <QuickActions />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
