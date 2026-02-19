import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Star, Activity, Calendar, Target } from 'lucide-react';
import coachService from '@/services/coachService';
import { toast } from 'sonner';

export default function CoachDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await coachService.getDashboard();
      if (response.status === 'success') {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentActivity = dashboardData?.recentActivity || [];

  const statsConfig = [
    {
      label: 'Members Guiding',
      value: stats.totalMembers || 0,
      icon: Users,
      color: 'text-primary-600'
    },
    {
      label: 'Active This Week',
      value: stats.activeThisWeek || 0,
      icon: Activity,
      color: 'text-accent-600'
    },
    {
      label: 'Avg Progress Rate',
      value: stats.avgProgressRate || '0%',
      icon: TrendingUp,
      color: 'text-success'
    },
    {
      label: 'Average Rating',
      value: stats.averageRating || 0,
      icon: Star,
      color: 'text-yellow-600'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Coach Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s your overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Member Activity</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary-600 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {activity.memberAvatar ? (
                        <img
                          src={activity.memberAvatar}
                          alt={activity.member}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">
                            {activity.member?.charAt(0) || 'M'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{activity.member || 'Unknown'}</h4>
                      <p className="text-sm text-muted-foreground">{activity.activity || 'Activity'}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        activity.status === 'present' ? 'default' :
                          activity.status === 'late' ? 'secondary' :
                            'destructive'
                      }>
                        {activity.status || 'N/A'}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time ? new Date(activity.time).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Total Sessions</span>
              </div>
              <span className="font-semibold">{stats.totalSessions || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Upcoming Sessions</span>
              </div>
              <span className="font-semibold">{stats.upcomingSessions || 0}</span>
            </div>
            <Button className="w-full mt-4" onClick={() => window.location.href = '/coach/members'}>
              <Users className="h-4 w-4 mr-2" />
              View All Members
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}