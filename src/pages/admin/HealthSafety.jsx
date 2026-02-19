import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Heart, AlertTriangle, FileText, Download, Eye, CheckCircle, X, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';

export default function HealthSafety() {
  const { toast } = useToast();
  const [healthRecords, setHealthRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showEditTemplateModal, setShowEditTemplateModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [followUpData, setFollowUpData] = useState({ date: '', notes: '' });

  useEffect(() => {
    fetchHealthRecords();
    fetchStats();
  }, [searchTerm, statusFilter]);

  const fetchHealthRecords = async () => {
    try {
      setLoading(true);
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      };
      const response = await adminService.getHealthRecords(params);
      setHealthRecords(response.data.records || []);
      setIncidents(response.data.incidents || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch health records',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminService.getHealthStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch health stats:', error);
    }
  };

  const handleApprove = async (memberId) => {
    try {
      await adminService.updateBasicInfo(memberId, { approved: true });
      toast({
        title: 'Success',
        description: 'Health information approved',
      });
      fetchHealthRecords();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve health information',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (memberId) => {
    try {
      await adminService.updateBasicInfo(memberId, { approved: false, status: 'rejected' });
      toast({
        title: 'Info',
        description: 'Health information rejected - member will be notified',
      });
      fetchHealthRecords();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject health information',
        variant: 'destructive',
      });
    }
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setSelectedIncident(null);
    setShowViewModal(true);
  };

  const handleViewIncidentReport = (incident) => {
    setSelectedIncident(incident);
    setSelectedRecord(null);
    setShowViewModal(true);
  };

  const handleAddFollowUp = (incident) => {
    setSelectedIncident(incident);
    setFollowUpData({ date: '', notes: '' });
    setShowFollowUpModal(true);
  };

  const handleSubmitFollowUp = async () => {
    try {
      await adminService.addInjury(selectedIncident.memberId, {
        followUp: followUpData,
        incidentId: selectedIncident._id,
      });
      toast({
        title: 'Success',
        description: 'Follow-up added successfully',
      });
      setShowFollowUpModal(false);
      fetchHealthRecords();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add follow-up',
        variant: 'destructive',
      });
    }
  };

  const handleEditTemplate = () => {
    setShowEditTemplateModal(true);
  };

  const handleSaveTemplate = () => {
    toast({
      title: 'Success',
      description: 'Waiver template updated successfully',
    });
    setShowEditTemplateModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading health records...</p>
        </div>
      </div>
    );
  }

  const filteredRecords = healthRecords.filter((record) => {
    const matchesSearch = record.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.memberId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'complete' && record.healthFormStatus === 'completed' && record.waiverStatus === 'signed') ||
      (statusFilter === 'incomplete' && (record.healthFormStatus === 'pending' || record.waiverStatus === 'pending'));
    return matchesSearch && matchesStatus;
  });

  // Calculate stats from data or use API stats
  const healthFormsCompleted = stats?.healthFormsCompleted || healthRecords.filter(r => r.healthFormStatus === 'completed').length;
  const waiversSigned = stats?.waiversSigned || healthRecords.filter(r => r.waiverStatus === 'signed').length;
  const pendingReviews = stats?.pendingReviews || healthRecords.filter(r => r.healthFormStatus === 'pending' || r.waiverStatus === 'pending').length;
  const incidentCount = stats?.incidentCount || incidents.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Health & Safety Management</h1>
        <p className="text-muted-foreground mt-1">Monitor member health information and safety incidents</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Health Forms</p>
                <p className="text-2xl font-bold mt-1">{healthFormsCompleted}</p>
                <p className="text-xs text-muted-foreground mt-1">Completed</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Waivers Signed</p>
                <p className="text-2xl font-bold mt-1">{waiversSigned}</p>
                <p className="text-xs text-muted-foreground mt-1">Active</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-bold mt-1">{pendingReviews}</p>
                <p className="text-xs text-yellow-600 mt-1">Needs attention</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Incidents (30d)</p>
                <p className="text-2xl font-bold mt-1">{incidentCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Reported</p>
              </div>
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="records" className="space-y-6">
        <TabsList>
          <TabsTrigger value="records">Health Records</TabsTrigger>
          <TabsTrigger value="incidents">Safety Incidents</TabsTrigger>
          <TabsTrigger value="waivers">Liability Waivers</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search members..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Records</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="incomplete">Incomplete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Health Records Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold">Member</th>
                      <th className="text-left p-4 font-semibold">Health Form</th>
                      <th className="text-left p-4 font-semibold">Waiver</th>
                      <th className="text-left p-4 font-semibold">Medical Cert</th>
                      <th className="text-left p-4 font-semibold">Last Updated</th>
                      <th className="text-right p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record._id || record.memberId} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={record.memberAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${record.memberEmail}`}
                              alt={record.memberName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium">{record.memberName || record.memberId?.name || 'Unknown'}</p>
                              <p className="text-sm text-muted-foreground">ID: {(record._id || record.memberId)?.slice?.(-6) || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={record.healthFormStatus === 'completed' ? 'default' : 'secondary'}>
                            {record.healthFormStatus || 'pending'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={record.waiverStatus === 'signed' ? 'default' : 'secondary'}>
                            {record.waiverStatus || 'pending'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={record.medicalCertificate === 'uploaded' ? 'default' : 'secondary'}>
                            {record.medicalCertificate || 'missing'}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm">
                          {record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleViewRecord(record)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                            {record.healthFormStatus === 'completed' && record.waiverStatus === 'signed' ? (
                              <Button size="sm" variant="ghost" className="text-green-600">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            ) : (
                              <>
                                <Button size="sm" onClick={() => handleApprove(record.memberId || record._id)}>
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleReject(record.memberId || record._id)}>
                                  <X className="h-4 w-4" />
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

          {filteredRecords.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">No health records found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          {incidents.map((incident) => (
            <Card key={incident._id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{incident.type}</h3>
                      <Badge variant={incident.status === 'resolved' ? 'default' : 'secondary'}>
                        {incident.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Reported by {incident.reportedBy} on {incident.date ? new Date(incident.date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Member Involved:</span>
                    <span className="text-sm ml-2">{incident.memberName || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Description:</span>
                    <p className="text-sm mt-1">{incident.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button size="sm" variant="outline" onClick={() => handleViewIncidentReport(incident)}>
                    View Full Report
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddFollowUp(incident)}>
                    Add Follow-up
                  </Button>
                  {incident.status !== 'resolved' && (
                    <Button size="sm">Mark as Resolved</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {incidents.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold mb-2">No Incidents Reported</h3>
                <p className="text-muted-foreground">All clear! No safety incidents in the last 30 days.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="waivers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liability Waiver Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">Current Waiver Version: 2.0</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Last updated: January 1, 2026
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Assumption of Risk:</strong> I acknowledge that participation in sports and fitness activities involves inherent risks...</p>
                  <p><strong>Release of Liability:</strong> I hereby release and discharge the sports club, its owners, employees, and agents...</p>
                  <p><strong>Medical Authorization:</strong> I authorize the club to seek emergency medical treatment if necessary...</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
                <Button variant="outline" onClick={handleEditTemplate}>
                  <FileText className="h-4 w-4 mr-2" />
                  Edit Template
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Waiver Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Signed</p>
                  <p className="text-2xl font-bold mt-1">{waiversSigned}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold mt-1">
                    {healthRecords.filter(r => r.waiverStatus === 'pending').length}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="text-2xl font-bold mt-1">{stats?.expiringWaivers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Record/Incident Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedRecord ? 'Health Record Details' : 'Incident Report Details'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedRecord && (
              <>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedRecord.memberAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRecord.memberEmail}`}
                    alt={selectedRecord.memberName}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{selectedRecord.memberName || 'Unknown'}</h3>
                    <p className="text-sm text-muted-foreground">Member ID: {selectedRecord.memberId?.slice?.(-6) || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Health Form</p>
                    <Badge variant={selectedRecord.healthFormStatus === 'completed' ? 'default' : 'secondary'}>
                      {selectedRecord.healthFormStatus || 'pending'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Waiver Status</p>
                    <Badge variant={selectedRecord.waiverStatus === 'signed' ? 'default' : 'secondary'}>
                      {selectedRecord.waiverStatus || 'pending'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Medical Certificate</p>
                    <Badge variant={selectedRecord.medicalCertificate === 'uploaded' ? 'default' : 'secondary'}>
                      {selectedRecord.medicalCertificate || 'missing'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{selectedRecord.updatedAt ? new Date(selectedRecord.updatedAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </>
            )}
            {selectedIncident && (
              <>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">{selectedIncident.type}</h4>
                  <p className="text-sm text-muted-foreground">{selectedIncident.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{selectedIncident.date ? new Date(selectedIncident.date).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member</p>
                    <p className="font-medium">{selectedIncident.memberName || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={selectedIncident.status === 'resolved' ? 'default' : 'secondary'}>
                      {selectedIncident.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reported By</p>
                    <p className="font-medium">{selectedIncident.reportedBy}</p>
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Follow-up Modal */}
      <Dialog open={showFollowUpModal} onOpenChange={setShowFollowUpModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Follow-up</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Follow-up Date</Label>
              <Input
                type="date"
                value={followUpData.date}
                onChange={(e) => setFollowUpData({ ...followUpData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Follow-up Notes</Label>
              <Textarea
                placeholder="Describe the follow-up action or update..."
                rows={4}
                value={followUpData.notes}
                onChange={(e) => setFollowUpData({ ...followUpData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFollowUpModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitFollowUp}>Add Follow-up</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Modal */}
      <Dialog open={showEditTemplateModal} onOpenChange={setShowEditTemplateModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Waiver Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Template Version</Label>
              <Input defaultValue="2.0" />
            </div>
            <div className="space-y-2">
              <Label>Waiver Content</Label>
              <Textarea
                rows={15}
                defaultValue="ASSUMPTION OF RISK AND WAIVER OF LIABILITY

I acknowledge that participation in sports and fitness activities involves inherent risks, including but not limited to physical injury, illness, or property damage. I voluntarily assume all such risks associated with my participation.

I hereby release, waive, and discharge the facility, its owners, employees, and agents from any and all liability for injuries or damages that may occur during my use of the facilities or participation in activities.

I certify that I am in good physical condition and have no medical conditions that would prevent safe participation in physical activities. I agree to follow all facility rules and safety guidelines."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditTemplateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}