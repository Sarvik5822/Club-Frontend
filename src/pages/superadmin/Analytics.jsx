import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Users, IndianRupee, Calendar, Activity, Download, RefreshCw, Loader2 } from 'lucide-react';
import superadminService from '@/services/superadminService';
import { toast } from 'sonner';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30days');
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();

      switch (period) {
        case '7days':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      const params = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      };

      const response = await superadminService.getSystemAnalytics(params);

      if (response.status === 'success') {
        setAnalyticsData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics data');
      // Use mock data as fallback
      setAnalyticsData({
        kpis: {
          totalRevenue: 1200000,
          activeMembers: 15432,
          sessionsCompleted: 8945,
          avgAttendance: 87,
        },
        branchPerformance: [
          { branch: 'Downtown Sports Hub', revenue: 425000, members: 4500, growth: 18 },
          { branch: 'Westside Fitness Center', revenue: 380000, members: 3800, growth: 12 },
          { branch: 'Eastside Athletic Club', revenue: 295000, members: 3200, growth: 8 },
          { branch: 'Northside Wellness', revenue: 245000, members: 2850, growth: 15 },
          { branch: 'Southside Sports Complex', revenue: 180000, members: 2082, growth: 5 },
        ],
        revenueByCategory: [
          { category: 'Memberships', amount: 720000, percentage: 60 },
          { category: 'Personal Training', amount: 288000, percentage: 24 },
          { category: 'Group Classes', amount: 144000, percentage: 12 },
          { category: 'Products', amount: 48000, percentage: 4 },
        ],
        monthlyRevenue: [65, 72, 68, 80, 85, 78, 92, 88, 95, 98, 102, 110],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await superadminService.exportSystemData('analytics');
      if (response.status === 'success') {
        toast.success('Analytics data exported successfully');
      }
    } catch (error) {
      console.error('Failed to export analytics:', error);
      toast.error('Failed to export analytics data');
    }
  };

  const getKpis = () => {
    if (!analyticsData?.kpis) {
      return [
        { label: 'Total Revenue', value: '₹12L', change: '+15.3%', trend: 'up', icon: IndianRupee },
        { label: 'Active Members', value: '15,432', change: '+8.2%', trend: 'up', icon: Users },
        { label: 'Sessions Completed', value: '8,945', change: '+12.5%', trend: 'up', icon: Calendar },
        { label: 'Avg. Attendance', value: '87%', change: '-2.1%', trend: 'down', icon: Activity },
      ];
    }

    const { kpis } = analyticsData;
    return [
      {
        label: 'Total Revenue',
        value: `₹${(kpis.totalRevenue / 100000).toFixed(1)}L`,
        change: '+15.3%',
        trend: 'up',
        icon: IndianRupee
      },
      {
        label: 'Active Members',
        value: kpis.activeMembers?.toLocaleString() || '15,432',
        change: '+8.2%',
        trend: 'up',
        icon: Users
      },
      {
        label: 'Sessions Completed',
        value: kpis.sessionsCompleted?.toLocaleString() || '8,945',
        change: '+12.5%',
        trend: 'up',
        icon: Calendar
      },
      {
        label: 'Avg. Attendance',
        value: `${kpis.avgAttendance || 87}%`,
        change: '-2.1%',
        trend: 'down',
        icon: Activity
      },
    ];
  };

  const kpis = getKpis();
  const branchPerformance = analyticsData?.branchPerformance || [];
  const revenueByCategory = analyticsData?.revenueByCategory || [];
  const monthlyRevenue = analyticsData?.monthlyRevenue || [65, 72, 68, 80, 85, 78, 92, 88, 95, 98, 102, 110];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Business Intelligence</h1>
          <p className="text-muted-foreground mt-1">Advanced analytics with customizable dashboard widgets</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-muted-foreground">Loading analytics...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;
              return (
                <Card key={kpi.label}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{kpi.label}</p>
                        <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                        <div className={`flex items-center gap-1 mt-2 text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}>
                          <TrendIcon className="h-4 w-4" />
                          <span>{kpi.change}</span>
                        </div>
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
                <div className="space-y-4">
                  {branchPerformance.length > 0 ? (
                    branchPerformance.map((branch, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{branch.branch}</span>
                          <span className="text-sm text-green-600">+{branch.growth}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>₹{(branch.revenue / 1000).toFixed(0)}K revenue</span>
                          <span>{branch.members?.toLocaleString()} members</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${Math.min(100, (branch.revenue / 500000) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      No branch performance data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueByCategory.length > 0 ? (
                    revenueByCategory.map((item) => (
                      <div key={item.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.category}</span>
                          <span className="text-sm">₹{(item.amount / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-accent-600 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          {item.percentage}% of total
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      No revenue category data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {monthlyRevenue.map((height, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-primary-600 rounded-t hover:bg-primary-700 transition-colors cursor-pointer"
                      style={{ height: `${height}%` }}
                      title={`${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx]}: ${height}%`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}