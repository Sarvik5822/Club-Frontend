import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, IndianRupee, Activity, Clock, AlertCircle } from 'lucide-react';
import adminService from '@/services/adminService';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData ? [
    {
      label: 'Total Members',
      value: dashboardData.branchStats?.totalMembers || 0,
      change: `${dashboardData.branchStats?.activeMembers || 0} active`,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: 'Revenue This Month',
      value: `₹${(dashboardData.revenueStats?.thisMonth || 0).toLocaleString()}`,
      change: dashboardData.revenueStats?.lastMonth
        ? `${((dashboardData.revenueStats.thisMonth - dashboardData.revenueStats.lastMonth) / dashboardData.revenueStats.lastMonth * 100).toFixed(1)}%`
        : '0%',
      icon: IndianRupee,
      color: 'text-green-600'
    },
    {
      label: 'Daily Visits (Today)',
      value: dashboardData.todayStats?.attendance || 0,
      change: `${dashboardData.todayStats?.sessionsScheduled || 0} sessions`,
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      label: 'Revenue Today',
      value: `₹${(dashboardData.revenueStats?.today || 0).toLocaleString()}`,
      change: 'Today',
      icon: IndianRupee,
      color: 'text-orange-600'
    },
    {
      label: 'New Registrations',
      value: dashboardData.todayStats?.newRegistrations || 0,
      change: 'Today',
      icon: AlertCircle,
      color: 'text-red-600'
    },
    {
      label: 'Active Coaches',
      value: dashboardData.branchStats?.totalCoaches || 0,
      change: 'All approved',
      icon: Activity,
      color: 'text-emerald-600'
    },
  ] : [];

  const recentActivity = dashboardData?.recentActivities || [
    { member: 'Loading...', action: 'Fetching recent activities', time: 'Just now', type: 'info' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of club operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className={`text-xs mt-1 ${stat.color}`}>{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'punch-in' ? 'bg-green-500' :
                    activity.type === 'punch-out' ? 'bg-blue-500' :
                      activity.type === 'payment' ? 'bg-yellow-500' :
                        'bg-purple-500'
                    }`} />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.member || activity.userName || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">{activity.action || activity.description}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.time || 'Just now'}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
            <div className="space-y-3">
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Currently {dashboardData?.branchStats?.activeSessions || 0} active sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Visit Trend</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg border">
                <span className="text-sm font-medium">Total Members</span>
                <span className="text-lg font-bold">{dashboardData?.branchStats?.totalMembers || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg border">
                <span className="text-sm font-medium">Active Members</span>
                <span className="text-lg font-bold">{dashboardData?.branchStats?.activeMembers || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg border">
                <span className="text-sm font-medium">Active Sessions</span>
                <span className="text-lg font-bold">{dashboardData?.branchStats?.activeSessions || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg border">
                <span className="text-sm font-medium">Total Coaches</span>
                <span className="text-lg font-bold">{dashboardData?.branchStats?.totalCoaches || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}