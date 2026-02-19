import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, TrendingUp, Award, Target, Clock, Fingerprint, Building } from 'lucide-react';
import { mockAttendanceRecords } from '@/lib/mockData';
import { useAuth } from '@/lib/auth';

export default function Attendance() {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState('all');
  const [clubFilter, setClubFilter] = useState('all');

  // Get user's attendance records
  const userRecords = mockAttendanceRecords.filter(record => record.memberId === user?.id);

  // Apply filters
  const filteredRecords = userRecords.filter(record => {
    const recordDate = new Date(record.date);
    
    let matchesTime = true;
    if (timeFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesTime = recordDate >= weekAgo;
    } else if (timeFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      matchesTime = recordDate >= monthAgo;
    }
    
    const matchesClub = clubFilter === 'all' || record.clubName === clubFilter;
    
    return matchesTime && matchesClub;
  });

  // Calculate stats
  const totalVisits = filteredRecords.length;
  const totalMinutes = filteredRecords.reduce((sum, record) => sum + record.duration, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const avgDuration = totalVisits > 0 ? Math.round(totalMinutes / totalVisits) : 0;

  // Get unique clubs
  const uniqueClubs = [...new Set(userRecords.map(r => r.clubName))];

  // Monthly goal calculation
  const monthlyGoal = 20; // visits
  const thisMonthVisits = userRecords.filter(record => {
    const recordDate = new Date(record.date);
    const now = new Date();
    return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
  }).length;
  const goalProgress = Math.min((thisMonthVisits / monthlyGoal) * 100, 100);

  const stats = [
    { label: 'Total Visits', value: totalVisits.toString(), icon: Calendar, color: 'text-primary-600' },
    { label: 'Total Hours', value: `${totalHours}h ${totalMinutes % 60}m`, icon: Clock, color: 'text-success' },
    { label: 'Avg Duration', value: `${avgDuration} min`, icon: TrendingUp, color: 'text-orange-600' },
    { label: 'Monthly Goal', value: `${thisMonthVisits}/${monthlyGoal}`, icon: Target, color: 'text-accent-600' },
  ];

  const achievements = [
    { title: '30-Day Streak', description: 'Attended for 30 consecutive days', earned: true, icon: '🔥' },
    { title: 'Early Bird', description: 'Attended 10 morning sessions', earned: true, icon: '🌅' },
    { title: 'Multi-Club Explorer', description: 'Visited 3 different clubs', earned: true, icon: '🏢' },
    { title: 'Century Club', description: 'Completed 100 total visits', earned: false, icon: '💯' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Attendance & Performance</h1>
          <p className="text-muted-foreground mt-1">Track your visits with biometric verification</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Select value={clubFilter} onValueChange={setClubFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Club" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clubs</SelectItem>
              {uniqueClubs.map(club => (
                <SelectItem key={club} value={club}>{club}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Grid */}
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
        {/* Attendance History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center gap-4 p-4 rounded-lg border"
                  >
                    <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900">
                      <Fingerprint className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{record.facility}</h4>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(record.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(record.punchInTime).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} - {new Date(record.punchOutTime).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {record.clubName}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                        {record.duration} min
                      </Badge>
                      {record.biometricVerified && (
                        <p className="text-xs text-muted-foreground mt-1">✓ Verified</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No attendance records found</p>
                  <p className="text-sm mt-1">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    achievement.earned ? 'border-primary-600 bg-primary-50 dark:bg-primary-950' : 'opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <Award className="h-5 w-5 text-primary-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Visit Goal ({thisMonthVisits}/{monthlyGoal})</span>
                <span className="text-sm text-muted-foreground">{Math.round(goalProgress)}%</span>
              </div>
              <Progress value={goalProgress} className="h-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{thisMonthVisits}</p>
                <p className="text-sm text-muted-foreground">Visits This Month</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{uniqueClubs.length}</p>
                <p className="text-sm text-muted-foreground">Clubs Visited</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{avgDuration}</p>
                <p className="text-sm text-muted-foreground">Avg Minutes/Visit</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}