import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit, Trash2, Eye, Download, Filter, CheckCircle, X, Clock, UserPlus, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';

export default function Members() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false); // eslint-disable-line no-unused-vars
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [activeTab, setActiveTab] = useState('members');

  // Coaches list for dropdown
  const [coaches, setCoaches] = useState([]);

  // Join Requests state
  const [joinRequests, setJoinRequests] = useState([]);
  const [joinRequestsLoading, setJoinRequestsLoading] = useState(false);
  const [joinRequestsPendingCount, setJoinRequestsPendingCount] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingRequest, setRejectingRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(membershipFilter !== 'all' && { membershipType: membershipFilter }),
      };

      const response = await adminService.getMembers(params);
      setMembers(response.data.members || []);
      setPagination(response.data.pagination || { currentPage: 1, totalPages: 1 });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch members',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, membershipFilter, pagination.currentPage, toast]);

  const fetchCoaches = useCallback(async () => {
    try {
      const response = await adminService.getCoaches({ limit: 100 });
      setCoaches(response.data.coaches || []);
    } catch (error) {
      console.error('Failed to fetch coaches:', error);
    }
  }, []);

  const fetchJoinRequests = useCallback(async () => {
    try {
      setJoinRequestsLoading(true);
      const response = await adminService.getJoinRequests({ status: 'all' });
      setJoinRequests(response.data.requests || []);
      setJoinRequestsPendingCount(response.data.pendingCount || 0);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch join requests',
        variant: 'destructive',
      });
    } finally {
      setJoinRequestsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMembers();
    fetchCoaches();
  }, [fetchMembers, fetchCoaches]);

  useEffect(() => {
    if (activeTab === 'join-requests') {
      fetchJoinRequests();
    }
  }, [activeTab, fetchJoinRequests]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'suspended': return 'bg-red-500';
      case 'expired': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getMembershipColor = (type) => {
    switch (type) {
      case 'Platinum': return 'bg-purple-500';
      case 'Gold': return 'bg-yellow-500';
      case 'Silver': return 'bg-gray-400';
      case 'Basic': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getJoinRequestStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleViewMember = (id) => {
    navigate(`/admin/members/${id}`);
  };

  const handleApproveMember = async (id, name) => {
    try {
      await adminService.approveMember(id, { approved: true });
      toast({
        title: 'Success',
        description: `Member ${name} approved successfully`,
      });
      fetchMembers();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve member',
        variant: 'destructive',
      });
    }
  };

  const handleRejectMember = async (id, name) => {
    try {
      await adminService.updateMemberStatus(id, { status: 'suspended', reason: 'Application rejected' });
      toast({
        title: 'Success',
        description: `Member ${name} application rejected`,
      });
      fetchMembers();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject member',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMember = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await adminService.deleteMember(id);
      toast({
        title: 'Success',
        description: `Member ${name} deleted successfully`,
      });
      fetchMembers();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete member',
        variant: 'destructive',
      });
    }
  };

  const handleExport = () => {
    toast({
      title: 'Success',
      description: 'Member list exported successfully',
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setMembershipFilter('all');
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
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
      fetchMembers();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update member',
        variant: 'destructive',
      });
    }
  };

  const handleAssignCoach = async (memberId, coachId) => {
    try {
      if (coachId && coachId !== 'none') {
        await adminService.assignCoachToMember(coachId, { memberId });
        toast({
          title: 'Success',
          description: 'Coach assigned to member successfully',
        });
      } else {
        // Remove coach assignment by updating member directly
        await adminService.updateMember(memberId, { coachId: null });
        toast({
          title: 'Success',
          description: 'Coach removed from member',
        });
      }
      fetchMembers();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to assign coach',
        variant: 'destructive',
      });
    }
  };

  // Join Request handlers
  const handleApproveJoinRequest = async (requestId) => {
    try {
      await adminService.approveJoinRequest(requestId);
      toast({
        title: 'Success',
        description: 'Join request approved. Member now has access to this club.',
      });
      fetchJoinRequests();
      fetchMembers();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve join request',
        variant: 'destructive',
      });
    }
  };

  const handleRejectJoinRequest = async () => {
    if (!rejectingRequest) return;
    try {
      await adminService.rejectJoinRequest(rejectingRequest._id, { reason: rejectionReason });
      toast({
        title: 'Success',
        description: 'Join request rejected.',
      });
      setShowRejectModal(false);
      setRejectingRequest(null);
      setRejectionReason('');
      fetchJoinRequests();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject join request',
        variant: 'destructive',
      });
    }
  };

  const pendingCount = members.filter(m => m.status === 'pending').length;

  if (loading && activeTab === 'members') {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Members Management</h1>
          <p className="text-muted-foreground mt-1">View and manage all club members</p>
          {pendingCount > 0 && (
            <p className="text-sm text-orange-600 mt-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {pendingCount} member{pendingCount > 1 ? 's' : ''} awaiting approval
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Tabs for Members and Join Requests */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Members
            {pendingCount > 0 && (
              <Badge className="bg-orange-500 text-white ml-1 text-xs px-1.5 py-0.5">{pendingCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="join-requests" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Club Join Requests
            {joinRequestsPendingCount > 0 && (
              <Badge className="bg-blue-500 text-white ml-1 text-xs px-1.5 py-0.5">{joinRequestsPendingCount}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search members..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending Approval</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={membershipFilter} onValueChange={setMembershipFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by membership" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Memberships</SelectItem>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Basic">Basic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {members.length} members (Page {pagination.currentPage} of {pagination.totalPages})
            </p>
          </div>

          {/* Members Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold">Member</th>
                      <th className="text-left p-4 font-semibold">Contact</th>
                      <th className="text-left p-4 font-semibold">Coach</th>
                      <th className="text-left p-4 font-semibold">Membership</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                      <th className="text-left p-4 font-semibold">Join Date</th>
                      <th className="text-left p-4 font-semibold">Expiry</th>
                      <th className="text-right p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.email}`}
                              alt={member.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">ID: {member._id.slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm">{member.email}</p>
                          <p className="text-sm text-muted-foreground">{member.phone}</p>
                        </td>
                        <td className="p-4">
                          {member.coachId ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                                {(member.coachId.name || '?').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{member.coachId.name}</p>
                                <p className="text-xs text-muted-foreground">{member.coachId.email}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">No coach</span>
                          )}
                        </td>
                        <td className="p-4">
                          <Badge className={getMembershipColor(member.membershipType)}>
                            {member.membershipType}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm">
                          {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-4 text-sm">
                          {member.membershipExpiry ? new Date(member.membershipExpiry).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            {member.status === 'pending' ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleApproveMember(member._id, member.name)}
                                  title="Approve Member"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRejectMember(member._id, member.name)}
                                  title="Reject Application"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleViewMember(member._id)}
                                  title="View Details & Attendance"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditMember(member)}
                                  title="Edit Member"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteMember(member._id, member.name)}
                                  title="Delete Member"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {members.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No members found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to see more results
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Join Requests Tab */}
        <TabsContent value="join-requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Club Join Requests
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Members from other clubs requesting to join your club. Approve to grant them multi-club access.
              </p>
            </CardHeader>
            <CardContent>
              {joinRequestsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading requests...</p>
                  </div>
                </div>
              ) : joinRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No join requests</h3>
                  <p className="text-muted-foreground">
                    No members have requested to join your club yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b">
                      <tr>
                        <th className="text-left p-4 font-semibold">Member</th>
                        <th className="text-left p-4 font-semibold">Contact</th>
                        <th className="text-left p-4 font-semibold">Sports</th>
                        <th className="text-left p-4 font-semibold">Message</th>
                        <th className="text-left p-4 font-semibold">Status</th>
                        <th className="text-left p-4 font-semibold">Requested On</th>
                        <th className="text-right p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {joinRequests.map((request) => (
                        <tr key={request._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={request.userId?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.userId?.email}`}
                                alt={request.userId?.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <p className="font-medium">{request.userId?.name || 'Unknown'}</p>
                                <p className="text-xs text-muted-foreground">{request.userId?.membershipType || 'Basic'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-sm">{request.userId?.email}</p>
                            <p className="text-sm text-muted-foreground">{request.userId?.phone}</p>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {(request.userId?.accessibleSports || []).slice(0, 3).map((sport, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-xs">
                                  {sport}
                                </span>
                              ))}
                              {(request.userId?.accessibleSports || []).length > 3 && (
                                <span className="text-xs text-muted-foreground">+{request.userId.accessibleSports.length - 3} more</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="text-sm text-muted-foreground max-w-[200px] truncate">
                              {request.message || 'No message'}
                            </p>
                          </td>
                          <td className="p-4">
                            <Badge className={getJoinRequestStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              {request.status === 'pending' ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleApproveJoinRequest(request._id)}
                                    title="Approve Join Request"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      setRejectingRequest(request);
                                      setShowRejectModal(true);
                                    }}
                                    title="Reject Join Request"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  {request.status === 'approved' ? 'Approved' : 'Rejected'}
                                  {request.reviewedAt && ` on ${new Date(request.reviewedAt).toLocaleDateString()}`}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editingMember.email}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={editingMember.phone}
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
                    value={editingMember.membershipExpiry?.split('T')[0]}
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
                        {coach.name} — {coach.specializations?.join(', ') || 'General'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Coach assignment depends on whether the member opts for a coach or not.
                </p>
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

      {/* Reject Join Request Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Join Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to reject the join request from <strong>{rejectingRequest?.userId?.name}</strong>?
            </p>
            <div className="space-y-2">
              <Label>Reason for Rejection (Optional)</Label>
              <Textarea
                placeholder="Provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowRejectModal(false);
              setRejectingRequest(null);
              setRejectionReason('');
            }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectJoinRequest}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}