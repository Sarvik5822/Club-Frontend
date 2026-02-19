import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, Fingerprint, LogIn, LogOut, TrendingUp, Award } from 'lucide-react';
import { mockAttendanceRecords, mockActiveSession, mockNotifications, mockFacilities } from '@/lib/mockData';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function MemberDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPunchedIn, setIsPunchedIn] = useState(mockActiveSession !== null);
  const [currentSession, setCurrentSession] = useState(mockActiveSession);
  const [showPunchInModal, setShowPunchInModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState('');

  // Get user's recent attendance
  const recentAttendance = mockAttendanceRecords
    .filter(record => record.memberId === user?.id)
    .slice(0, 5);

  // Calculate stats
  const thisWeekRecords = mockAttendanceRecords.filter(record => {
    const recordDate = new Date(record.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return record.memberId === user?.id && recordDate >= weekAgo;
  });

  const thisMonthRecords = mockAttendanceRecords.filter(record => {
    const recordDate = new Date(record.date);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    return record.memberId === user?.id && recordDate >= monthAgo;
  });

  const totalHoursThisWeek = thisWeekRecords.reduce((sum, record) => sum + record.duration, 0);
  const totalHoursThisMonth = thisMonthRecords.reduce((sum, record) => sum + record.duration, 0);

  const lastVisit = recentAttendance.length > 0 ? recentAttendance[0] : null;

  const stats = [
    { 
      label: 'Visits This Week', 
      value: thisWeekRecords.length.toString(), 
      icon: Calendar, 
      trend: `${totalHoursThisWeek} minutes total`, 
      color: 'text-emerald-600' 
    },
    { 
      label: 'Visits This Month', 
      value: thisMonthRecords.length.toString(), 
      icon: TrendingUp, 
      trend: `${totalHoursThisMonth} minutes total`, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Last Visit', 
      value: lastVisit ? new Date(lastVisit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A', 
      icon: Clock, 
      trend: lastVisit ? `${lastVisit.duration} minutes` : 'No visits yet', 
      color: 'text-orange-600' 
    },
    { 
      label: 'Current Streak', 
      value: '5 days', 
      icon: Award, 
      trend: 'Keep it up!', 
      color: 'text-purple-600' 
    },
  ];

  const handlePunchIn = () => {
    setShowPunchInModal(true);
  };

  const confirmPunchIn = () => {
    if (!selectedFacility) {
      toast.error('Please select a facility');
      return;
    }
    
    const newSession = {
      memberId: user?.id,
      clubName: 'Downtown Sports Hub',
      punchInTime: new Date().toISOString(),
      facility: selectedFacility,
    };
    
    setCurrentSession(newSession);
    setIsPunchedIn(true);
    setShowPunchInModal(false);
    toast.success(`Punched in at ${selectedFacility}`, {
      description: 'Have a great workout!',
    });
  };

  const handlePunchOut = () => {
    if (!currentSession) return;
    
    const punchOutTime = new Date();
    const punchInTime = new Date(currentSession.punchInTime);
    const duration = Math.round((punchOutTime - punchInTime) / 60000); // minutes
    
    toast.success('Punched out successfully', {
      description: `Session duration: ${duration} minutes`,
    });
    
    setIsPunchedIn(false);
    setCurrentSession(null);
  };

  const getElapsedTime = () => {
    if (!currentSession) return '0:00';
    const now = new Date();
    const punchIn = new Date(currentSession.punchInTime);
    const diff = Math.floor((now - punchIn) / 1000); // seconds
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground mt-1">Track your club visits and stay active</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-yellow-500 text-white">
            Gold Member
          </Badge>
          <span className="text-sm text-muted-foreground">Expires: Dec 31, 2026</span>
        </div>
      </div>

      {/* Biometric Punch In/Out Card */}
      <Card className="border-2 border-emerald-500">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-900">
                <Fingerprint className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {isPunchedIn ? 'Currently Checked In' : 'Ready to Work Out?'}
                </h3>
                {isPunchedIn && currentSession ? (
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {currentSession.facility} • {currentSession.clubName}
                    </p>
                    <p className="text-sm font-medium text-emerald-600">
                      Session time: {getElapsedTime()}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    Use biometric scanner to punch in
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {isPunchedIn ? (
                <Button 
                  size="lg" 
                  variant="destructive"
                  onClick={handlePunchOut}
                  className="gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  Punch Out
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={handlePunchIn}
                  className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                >
                  <LogIn className="h-5 w-5" />
                  Punch In
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="card-hover cursor-pointer" onClick={() => navigate('/member/attendance')}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
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
        {/* Recent Attendance */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Visits</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/member/attendance')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAttendance.length > 0 ? (
                recentAttendance.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:border-emerald-600 transition-colors"
                  >
                    <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900">
                      <Fingerprint className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{record.facility}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {record.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {record.clubName}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      Verified
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No visits yet</p>
                  <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700" onClick={handlePunchIn}>
                    Punch In Now
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockNotifications.slice(0, 4).map((notification) => (
                <div 
                  key={notification.id} 
                  className="flex gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 p-2 rounded-lg transition-colors"
                  onClick={() => {
                    if (notification.actionUrl) {
                      navigate(notification.actionUrl);
                    }
                  }}
                >
                  <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                    notification.type === 'success' ? 'bg-green-500' :
                    notification.type === 'warning' ? 'bg-amber-500' :
                    notification.type === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Facilities */}
      <Card>
        <CardHeader>
          <CardTitle>Your Accessible Facilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockFacilities.slice(0, 4).map((facility) => (
              <div
                key={facility.id}
                className="rounded-lg border overflow-hidden card-hover cursor-pointer"
                onClick={() => navigate('/member/facilities')}
              >
                <img
                  src={facility.imageUrl || 'https://mgx-backend-cdn.metadl.com/generate/images/924660/2026-01-22/36f0a43c-5afe-42bf-8fef-68eef36ee9ec.png'}
                  alt={facility.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h4 className="font-semibold text-sm">{facility.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{facility.type}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {facility.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{facility.capacity} capacity</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Punch In Modal */}
      <Dialog open={showPunchInModal} onOpenChange={setShowPunchInModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Biometric Punch In</DialogTitle>
            <DialogDescription>
              Select the facility you&apos;re visiting and scan your fingerprint
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="inline-flex p-6 rounded-full bg-emerald-100 dark:bg-emerald-900 mb-4">
                <Fingerprint className="h-16 w-16 text-emerald-600 animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground">Place your finger on the scanner</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Facility</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
              >
                <option value="">Choose a facility...</option>
                {mockFacilities.map((facility) => (
                  <option key={facility.id} value={facility.name}>
                    {facility.name} - {facility.type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPunchInModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmPunchIn}
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={!selectedFacility}
            >
              Confirm Punch In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}