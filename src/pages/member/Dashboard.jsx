import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Fingerprint, LogIn, LogOut, TrendingUp, Award, Building, Plus, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import memberService from '@/services/memberService';

export default function MemberDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dashboard data from API
  const [dashboardData, setDashboardData] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Punch in/out state
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [showPunchInModal, setShowPunchInModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState('');

  // Join Another Club state
  const [showJoinClubModal, setShowJoinClubModal] = useState(false);
  const [availableClubs, setAvailableClubs] = useState([]);
  const [clubsLoading, setClubsLoading] = useState(false);
  const [myJoinRequests, setMyJoinRequests] = useState([]);
  const [, setJoinRequestsLoading] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState('');
  const [joinMessage, setJoinMessage] = useState('');
  const [submittingJoin, setSubmittingJoin] = useState(false);

  // Fetch dashboard data from API
  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await memberService.getDashboard();
      if (response.status === 'success') {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch facilities from API
  const fetchFacilities = useCallback(async () => {
    try {
      const response = await memberService.getFacilities();
      if (response.status === 'success') {
        setFacilities(response.data.facilities || []);
      }
    } catch (error) {
      console.error('Failed to fetch facilities:', error);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchFacilities();
  }, [fetchDashboard, fetchFacilities]);

  const fetchAvailableClubs = async () => {
    try {
      setClubsLoading(true);
      const response = await memberService.getAvailableClubs();
      setAvailableClubs(response.data?.clubs || []);
    } catch (error) {
      console.error('Failed to fetch clubs:', error);
    } finally {
      setClubsLoading(false);
    }
  };

  const fetchMyJoinRequests = async () => {
    try {
      setJoinRequestsLoading(true);
      const response = await memberService.getMyJoinRequests();
      setMyJoinRequests(response.data?.requests || []);
    } catch (error) {
      console.error('Failed to fetch join requests:', error);
    } finally {
      setJoinRequestsLoading(false);
    }
  };

  const handleOpenJoinClubModal = () => {
    fetchAvailableClubs();
    fetchMyJoinRequests();
    setShowJoinClubModal(true);
  };

  const handleSubmitJoinRequest = async () => {
    if (!selectedClubId) {
      toast.error('Please select a club');
      return;
    }
    try {
      setSubmittingJoin(true);
      await memberService.requestJoinClub({ branchId: selectedClubId, message: joinMessage });
      toast.success('Join request submitted! The club admin will review your request.');
      setSelectedClubId('');
      setJoinMessage('');
      fetchAvailableClubs();
      fetchMyJoinRequests();
    } catch (error) {
      toast.error(error.message || 'Failed to submit join request');
    } finally {
      setSubmittingJoin(false);
    }
  };

  const handleCancelJoinRequest = async (requestId) => {
    try {
      await memberService.cancelJoinRequest(requestId);
      toast.success('Join request cancelled');
      fetchMyJoinRequests();
      fetchAvailableClubs();
    } catch (error) {
      toast.error(error.message || 'Failed to cancel request');
    }
  };

  // Extract stats from API data
  const member = dashboardData?.member;
  const apiStats = dashboardData?.stats;
  const recentPayments = dashboardData?.recentPayments || [];

  const stats = [
    {
      label: 'Total Attendance',
      value: apiStats?.totalAttendance?.toString() || '0',
      icon: Calendar,
      trend: `${apiStats?.attendanceRate || 0}% rate`,
      color: 'text-emerald-600'
    },
    {
      label: 'Present Count',
      value: apiStats?.presentCount?.toString() || '0',
      icon: TrendingUp,
      trend: 'Sessions attended',
      color: 'text-blue-600'
    },
    {
      label: 'Attendance Rate',
      value: `${apiStats?.attendanceRate || 0}%`,
      icon: Clock,
      trend: 'Overall rate',
      color: 'text-orange-600'
    },
    {
      label: 'Active Plans',
      value: apiStats?.activePlans?.toString() || '0',
      icon: Award,
      trend: 'Training plans',
      color: 'text-purple-600'
    },
  ];

  const handlePunchIn = () => {
    setShowPunchInModal(true);
  };

  const confirmPunchIn = async () => {
    if (!selectedFacility) {
      toast.error('Please select a facility');
      return;
    }

    try {
      await memberService.punchIn({ facility: selectedFacility });
      const newSession = {
        punchInTime: new Date().toISOString(),
        facility: selectedFacility,
      };
      setCurrentSession(newSession);
      setIsPunchedIn(true);
      setShowPunchInModal(false);
      toast.success(`Punched in at ${selectedFacility}`, {
        description: 'Have a great workout!',
      });
      fetchDashboard();
    } catch (error) {
      toast.error(error.message || 'Failed to punch in');
    }
  };

  const handlePunchOut = async () => {
    if (!currentSession) return;

    try {
      await memberService.punchOut({});
      const punchOutTime = new Date();
      const punchInTime = new Date(currentSession.punchInTime);
      const duration = Math.round((punchOutTime - punchInTime) / 60000);

      toast.success('Punched out successfully', {
        description: `Session duration: ${duration} minutes`,
      });

      setIsPunchedIn(false);
      setCurrentSession(null);
      fetchDashboard();
    } catch (error) {
      toast.error(error.message || 'Failed to punch out');
    }
  };

  const getElapsedTime = () => {
    if (!currentSession) return '0:00';
    const now = new Date();
    const punchIn = new Date(currentSession.punchInTime);
    const diff = Math.floor((now - punchIn) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {member?.name || user?.name}!</h1>
          <p className="text-muted-foreground mt-1">Track your club visits and stay active</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-yellow-500 text-white">
            {member?.membershipStatus || 'Active'} Member
          </Badge>
          {member?.membershipEndDate && (
            <span className="text-sm text-muted-foreground">
              Expires: {new Date(member.membershipEndDate).toLocaleDateString()}
            </span>
          )}
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
                      {currentSession.facility}
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
        {/* Recent Payments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Payments</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/member/payments')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <div
                    key={payment._id || payment.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:border-emerald-600 transition-colors"
                  >
                    <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{payment.description || payment.type}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(payment.createdAt || payment.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          ${payment.amount}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary" className={
                      payment.status === 'paid' || payment.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }>
                      {payment.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No recent payments</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 rounded-lg border">
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {member?.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="text-sm font-medium">Email</p>
                <p className="text-xs text-muted-foreground mt-1">{member?.email || user?.email}</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="text-sm font-medium">Phone</p>
                <p className="text-xs text-muted-foreground mt-1">{member?.phone || user?.phone || 'N/A'}</p>
              </div>
              <div className="p-3 rounded-lg border">
                <p className="text-sm font-medium">Status</p>
                <Badge className="mt-1 bg-emerald-500">{member?.status || 'active'}</Badge>
              </div>
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
            {facilities.length > 0 ? (
              facilities.slice(0, 4).map((facility) => (
                <div
                  key={facility._id || facility.id}
                  className="rounded-lg border overflow-hidden card-hover cursor-pointer"
                  onClick={() => navigate('/member/facilities')}
                >
                  <div className="w-full h-32 bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                    <Building className="h-10 w-10 text-white" />
                  </div>
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
              ))
            ) : (
              <div className="col-span-4 text-center py-8 text-muted-foreground">
                <Building className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No facilities available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Join Another Club Card */}
      <Card className="border-dashed border-2 border-blue-300 dark:border-blue-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Multi-Club Access
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Want to train at another club? Request access to join additional clubs.
            </p>
          </div>
          <Button onClick={handleOpenJoinClubModal} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Join Another Club
          </Button>
        </CardHeader>
      </Card>

      {/* Join Another Club Modal */}
      <Dialog open={showJoinClubModal} onOpenChange={setShowJoinClubModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Join Another Club
            </DialogTitle>
            <DialogDescription>
              Browse available clubs and request to join. The club admin will review your request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* My Pending Requests */}
            {myJoinRequests.filter(r => r.status === 'pending').length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-orange-600">Pending Requests</h4>
                {myJoinRequests.filter(r => r.status === 'pending').map((request) => (
                  <div key={request._id} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div>
                      <p className="font-medium text-sm">{request.branchId?.name || 'Unknown Club'}</p>
                      <p className="text-xs text-muted-foreground">{request.branchId?.city}</p>
                      <p className="text-xs text-orange-600 mt-1">Awaiting admin approval</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCancelJoinRequest(request._id)}
                      title="Cancel Request"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Available Clubs */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Available Clubs</h4>
              {clubsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : availableClubs.filter(c => c.memberStatus === 'available').length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No additional clubs available to join at the moment.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {availableClubs.filter(c => c.memberStatus === 'available').map((club) => (
                    <div
                      key={club._id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedClubId === club._id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-blue-300'
                        }`}
                      onClick={() => setSelectedClubId(club._id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{club.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {club.address}{club.city ? `, ${club.city}` : ''}
                          </p>
                          {club.sportsOffered && club.sportsOffered.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {club.sportsOffered.map((sport, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-full text-xs">
                                  {sport}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                          {club.code}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message */}
            {selectedClubId && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Message to Admin (Optional)</label>
                <Textarea
                  placeholder="Tell the admin why you'd like to join this club..."
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinClubModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitJoinRequest}
              disabled={!selectedClubId || submittingJoin}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submittingJoin ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Join Request'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                {facilities.map((facility) => (
                  <option key={facility._id || facility.id} value={facility.name}>
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