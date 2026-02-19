import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Ban, CheckCircle, Clock, MapPin, Calendar, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';

export default function MemberDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [member, setMember] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [healthInfo, setHealthInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [coaches, setCoaches] = useState([]);

  const fetchCoaches = useCallback(async () => {
    try {
      const response = await adminService.getCoaches({ limit: 100 });
      setCoaches(response.data.coaches || []);
    } catch (error) {
      console.error('Failed to fetch coaches:', error);
    }
  }, []);

  useEffect(() => {
    fetchMemberDetails();
    fetchCoaches();
  }, [id, fetchCoaches]);

  const fetchMemberDetails = async () => {
    try {
      setLoading(true);

      // Fetch member details
      const memberRes = await adminService.getMemberById(id);
      setMember(memberRes.data.member || memberRes.data);

      // Fetch member's attendance
      try {
        const attendanceRes = await adminService.getAttendance({ memberId: id });
        setAttendance(attendanceRes.data.records || []);
      } catch (e) {
        // Silently handle - attendance may not exist yet
        setAttendance([]);
      }

      // Fetch member's payments
      try {
        const paymentsRes = await adminService.getPayments({ memberId: id });
        setPayments(paymentsRes.data.payments || []);
      } catch (e) {
        // Silently handle - payments may not exist yet
        setPayments([]);
      }

      // Fetch health records - gracefully handle 404 (no record exists yet)
      try {
        const healthRes = await adminService.getHealthRecordByMemberId(id);
        setHealthInfo(healthRes.data);
      } catch (e) {
        // Health record not found is expected for members without health data
        setHealthInfo(null);
      }

    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch member details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = () => {
    setEditingMember({ ...member });
    setShowEditModal(true);
  };

  const handleUpdateMember = async () => {
    try {
      const memberData = { ...editingMember };
      const selectedCoachId = memberData.coachId?._id || memberData.coachId;

      // Remove coachId from the main update payload (handle separately)
      delete memberData.coachId;

      // Update member basic info
      await adminService.updateMember(editingMember._id, memberData);

      // Handle coach assignment separately
      if (selectedCoachId && selectedCoachId !== 'none') {
        await adminService.assignCoachToMember(selectedCoachId, { memberId: editingMember._id });
      } else {
        // Remove coach by updating member with null coachId
        await adminService.updateMember(editingMember._id, { coachId: null });
      }

      toast({
        title: 'Success',
        description: 'Member updated successfully',
      });
      setShowEditModal(false);
      setEditingMember(null);
      fetchMemberDetails();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update member',
        variant: 'destructive',
      });
    }
  };

  const handleApprove = async () => {
    try {
      await adminService.approveMember(id, { approved: true });
      toast({
        title: 'Success',
        description: 'Member approved successfully',
      });
      fetchMemberDetails();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve member',
        variant: 'destructive',
      });
    }
  };

  const handleSuspend = async () => {
    try {
      await adminService.updateMemberStatus(id, { status: 'suspended' });
      toast({
        title: 'Info',
        description: 'Member suspended',
      });
      fetchMemberDetails();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to suspend member',
        variant: 'destructive',
      });
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading member details...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-muted-foreground">Member not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/members')}>
            Back to Members
          </Button>
        </div>
      </div>
    );
  }

  // Calculate attendance stats
  const totalVisits = attendance.length;
  const totalMinutes = attendance.reduce((sum, record) => sum + (record.duration || 0), 0);
  const avgDuration = totalVisits > 0 ? Math.round(totalMinutes / totalVisits) : 0;
  const thisWeekVisits = attendance.filter(record => {
    const recordDate = new Date(record.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return recordDate >= weekAgo;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/members')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Member Details</h1>
          <p className="text-muted-foreground mt-1">View and edit member information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenEditModal}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          {member.status === 'pending' && (
            <Button onClick={handleApprove}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          )}
          {member.status === 'active' && (
            <Button variant="destructive" onClick={handleSuspend}>
              <Ban className="h-4 w-4 mr-2" />
              Suspend
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <img
              src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email}`}
              alt={member.name}
              className="w-24 h-24 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{member.name}</h2>
                  <p className="text-muted-foreground">{member.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">{member.phone || 'No phone'}</p>
                </div>
                <Badge className="text-lg px-4 py-1">{member.membershipType || member.membership?.type || 'N/A'}</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={member.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                    {member.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Join Date</p>
                  <p className="font-semibold">{member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="font-semibold">{member.membershipExpiry ? new Date(member.membershipExpiry).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Multi-Club Access</p>
                  <p className="font-semibold">{member.multiClubAccess ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {/* Coach Info */}
              <div className="mt-6 p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned Coach</p>
                    {member.coachId ? (
                      <div>
                        <p className="font-semibold">{member.coachId.name}</p>
                        {member.coachId.email && (
                          <p className="text-sm text-muted-foreground">{member.coachId.email}</p>
                        )}
                        {member.coachId.specialization && (
                          <p className="text-xs text-muted-foreground mt-0.5">Specialization: {member.coachId.specialization}</p>
                        )}
                      </div>
                    ) : (
                      <p className="font-semibold text-muted-foreground italic">No coach assigned</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Visits</p>
                <p className="text-2xl font-bold mt-1">{totalVisits}</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold mt-1">{thisWeekVisits}</p>
                <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Duration</p>
                <p className="text-2xl font-bold mt-1">{avgDuration} min</p>
                <p className="text-xs text-muted-foreground mt-1">Per visit</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Time</p>
                <p className="text-2xl font-bold mt-1">{formatDuration(totalMinutes)}</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance">
        <TabsList>
          <TabsTrigger value="attendance">Biometric Attendance</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="health">Health & Safety</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              {attendance.length > 0 ? (
                <div className="space-y-3">
                  {attendance.map((record) => (
                    <div key={record._id} className="p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                            </Badge>
                            {record.biometricVerified && (
                              <Badge className="bg-green-500">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-muted-foreground text-xs">Club</p>
                                <p className="font-medium">{record.clubName || record.branchId?.name || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-muted-foreground text-xs">Facility</p>
                                <p className="font-medium">{record.facility || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-muted-foreground text-xs">Duration</p>
                                <p className="font-medium">{formatDuration(record.duration)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Punch In: {record.punchInTime ? new Date(record.punchInTime).toLocaleTimeString() : 'N/A'}</span>
                            <span>•</span>
                            <span>Punch Out: {record.punchOutTime ? new Date(record.punchOutTime).toLocaleTimeString() : 'Active'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No attendance records</h3>
                  <p className="text-muted-foreground">
                    This member hasn&apos;t punched in yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length > 0 ? (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment._id} className="flex justify-between items-center p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{payment.description || `${payment.type} - ${payment.membershipType || 'Membership'}`}</p>
                        <p className="text-sm text-muted-foreground">{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{payment.amount?.toLocaleString() || 0}</p>
                        <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'} className="mt-1">
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No payment records found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Health & Safety Information</CardTitle>
            </CardHeader>
            <CardContent>
              {healthInfo || member.healthInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Height</p>
                      <p className="font-semibold">{healthInfo?.height || member.healthInfo?.height || 'N/A'} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="font-semibold">{healthInfo?.weight || member.healthInfo?.weight || 'N/A'} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Blood Type</p>
                      <p className="font-semibold">{healthInfo?.bloodType || member.healthInfo?.bloodType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Allergies</p>
                      <p className="font-semibold">{healthInfo?.allergies?.join(', ') || member.healthInfo?.allergies?.join(', ') || 'None'}</p>
                    </div>
                  </div>
                  {(healthInfo?.emergencyContact || member.emergencyContact) && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <h4 className="font-semibold mb-2 text-red-900 dark:text-red-100">Emergency Contact</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Name</p>
                          <p className="font-medium">{healthInfo?.emergencyContact?.name || member.emergencyContact?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p className="font-medium">{healthInfo?.emergencyContact?.phone || member.emergencyContact?.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Relationship</p>
                          <p className="font-medium">{healthInfo?.emergencyContact?.relationship || member.emergencyContact?.relationship || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No health information available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                {member.notes || 'No notes added yet'}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Member Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={editingMember.name || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editingMember.email || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={editingMember.phone || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editingMember.status}
                    onValueChange={(value) => setEditingMember({ ...editingMember, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Membership Type</Label>
                  <Select
                    value={editingMember.membershipType}
                    onValueChange={(value) => setEditingMember({ ...editingMember, membershipType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Membership Expiry</Label>
                  <Input
                    type="date"
                    value={editingMember.membershipExpiry?.split('T')[0] || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, membershipExpiry: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Assign Coach (Optional)</Label>
                <Select
                  value={editingMember.coachId?._id || editingMember.coachId || 'none'}
                  onValueChange={(value) => {
                    if (value === 'none') {
                      setEditingMember({ ...editingMember, coachId: null });
                    } else {
                      setEditingMember({ ...editingMember, coachId: value });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a coach (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Coach</SelectItem>
                    {coaches.map((coach) => (
                      <SelectItem key={coach._id} value={coach._id}>
                        {coach.name} — {coach.specialization || 'General'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}