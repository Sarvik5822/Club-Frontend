import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, Flame, Activity } from 'lucide-react';

export default function Progress() {
  const stats = [
    { label: 'Total Sessions', value: '48', change: '+12%', icon: Calendar },
    { label: 'Current Streak', value: '12 days', change: 'Personal best!', icon: Flame },
    { label: 'Calories Burned', value: '15,240', change: '+8%', icon: Activity },
    { label: 'Weight Progress', value: '-5 kg', change: 'Goal: -10 kg', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Progress & Stats</h1>
        <p className="text-muted-foreground mt-1">Track your fitness journey</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <CardTitle>Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart visualization would go here
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart visualization would go here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}