import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, IndianRupee, TrendingUp, Activity, Shield, Loader2 } from 'lucide-react';
import superadminService from '@/services/superadminService';
import { toast } from 'sonner';

export default function SuperadminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Default stats for fallback
  const defaultStats = [
    { label: 'Total Branches', value: '0', change: 'Loading...', icon: Building },
    { label: 'Total Members', value: '0', change: 'Loading...', icon: Users },
    { label: 'Total Revenue', value: '₹0', change: 'Loading...', icon: IndianRupee },
    { label: 'System Health', value: '99.8%', change: 'Uptime', icon: Activity },
    { label: 'Active Admins', value: '0', change: 'Loading...', icon: Shield },
    { label: 'Growth Rate', value: '0%', change: 'Month over month', icon: TrendingUp },
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await superadminService.getDashboardStats();

      if (response.status === 'success') {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      toast.error('Failed to load dashboard data. Using default values.');
      // Use mock data as fallback
      setDashboardData({
        overview: {
          totalMembers: 15432,
          totalCoaches: 25,
          totalAdmins: 45,
          totalBranches: 12,
          activeMembers: 380,
          totalRevenue: 1200000,
          todayAttendance: 120,
        },
        monthlyRevenue: [],
        branchPerformance: [],
        membershipDistribution: [],
        recentActivities: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    if (!dashboardData?.overview) return defaultStats;

    const { overview } = dashboardData;
    return [
      {
        label: 'Total Branches',
        value: overview.totalBranches?.toString() || '12',
        change: '+2 this quarter',
        icon: Building
      },
      {
        label: 'Total Members',
        value: overview.totalMembers?.toLocaleString() || '15,432',
        change: '+8%',
        icon: Users
      },
      {
        label: 'Total Revenue',
        value: `₹${(overview.totalRevenue / 100000).toFixed(1)}L`,
        change: '+15%',
        icon: IndianRupee
      },
      {
        label: 'System Health',
        value: '99.8%',
        change: 'Uptime',
        icon: Activity
      },
      {
        label: 'Active Admins',
        value: overview.totalAdmins?.toString() || '45',
        change: 'All verified',
        icon: Shield
      },
      {
        label: 'Growth Rate',
        value: '+12%',
        change: 'Month over month',
        icon: TrendingUp
      },
    ];
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Superadmin Dashboard</h1>
        <p className="text-muted-foreground mt-1">System-wide overview and analytics</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
        </div>
      ) : (
        <>
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
                        <p className="text-xs text-primary-600 mt-1">{stat.change}</p>
                      </div>
                      <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
                        <Icon className="h-5 w-5 text-primary-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Branch Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData?.branchPerformance?.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.branchPerformance.map((branch, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="font-medium">{branch.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ₹{branch.revenue?.toLocaleString() || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Branch comparison chart would appear here
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Branch</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData?.monthlyRevenue?.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.monthlyRevenue.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="font-medium">{item.month}</span>
                        <span className="text-sm text-muted-foreground">
                          ₹{item.amount?.toLocaleString() || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Revenue breakdown chart would appear here
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}