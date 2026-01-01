import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../components/theme-provider';
import VisualStatCard from '../../components/dashboard/VisualStatCard';
import AdminRevenueGraph from '../../components/dashboard/AdminRevenueGraph';
import RecentOrdersTable from '../../components/dashboard/RecentOrdersTable';
import ActivityLog from '../../components/dashboard/ActivityLog';
import QuickActions from '../../components/dashboard/QuickActions';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = React.useState({
        users: { total: 0, growth: 0 },
        subscriptions: { active: 0, growth: 0 },
        revenue: { total: 0, growth: 0 },
        tickets: { pending: 0 },
        revenueGraph: [],
        recentOrders: [],
        activityLog: []
    });

    React.useEffect(() => {
        const loadStats = async () => {
            try {
                const { fetchDashboardStats } = await import('../../api/dashboard.api');
                const { data } = await fetchDashboardStats();
                setStats(data); // Backend now returns nested structure correctly
            } catch (e) {
                console.error("Stats load failed", e);
            }
        };
        loadStats();
    }, []);

    return (
        <div className="space-y-4 flex flex-col h-auto lg:h-full lg:overflow-hidden pb-4 lg:pb-0">
            {/* ... */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 h-auto lg:h-36 shrink-0">
                <VisualStatCard
                    title="Revenue"
                    value={`₹${(stats.revenue?.total || 0).toLocaleString()}`}
                    change={`${stats.revenue?.growth || 0}%`}
                    type="area"
                    color="#10b981"
                    data={stats.revenueGraph}
                    onClick={() => navigate('/subscriptions/all')}
                />
                <VisualStatCard
                    title="Users"
                    value={stats.users?.total || 0}
                    change={`${stats.users?.growth || 0}%`}
                    type="bar"
                    color="#3b82f6"
                    onClick={() => navigate('/users/all')}
                />
                <VisualStatCard
                    title="Subs"
                    value={stats.subscriptions?.active || 0}
                    change={`${stats.subscriptions?.growth || 0}%`}
                    type="radial"
                    color="#f59e0b"
                    onClick={() => navigate('/subscriptions/active')}
                />
                <VisualStatCard
                    title="Tickets"
                    value={stats.tickets?.pending || 0}
                    change="Pending"
                    type="area"
                    color="#ef4444"
                    onClick={() => navigate('/tickets/all')}
                />
            </div>

            {/* Main Content Grid - Trading Layout with Admin Data */}
            {/* Mobile: Stacked, Desktop: 12 Cols */}
            <div className="flex-1 lg:min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:pb-2">
                {/* Left Column: Graph & Orders (8/12) */}
                <div className="lg:col-span-9 flex flex-col gap-3 h-auto lg:h-full lg:min-h-0">
                    {/* Revenue Graph: Fixed height on mobile, Flex on desktop */}
                    <div className="h-72 lg:h-auto lg:flex-1 lg:min-h-0">
                        <AdminRevenueGraph data={stats.revenueGraph} totalRevenue={stats.revenue?.total} growth={stats.revenue?.growth} />
                    </div>
                    {/* Recent Orders: Fixed height on mobile/desktop */}
                    <div className="h-64 lg:h-56 shrink-0">
                        <RecentOrdersTable orders={stats.recentOrders} />
                    </div>
                </div>

                {/* Right Column: Activity & Quick Actions (4/12) */}
                <div className="lg:col-span-3 flex flex-col gap-3 h-auto lg:h-full lg:min-h-0">
                    {/* Activity Log: Fixed height on mobile, Flex on desktop */}
                    <div className="h-80 lg:h-auto lg:flex-1 lg:min-h-0 rounded-2xl overflow-hidden">
                        <ActivityLog logs={stats.activityLog} />
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
