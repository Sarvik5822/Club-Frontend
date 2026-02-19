import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Search, Eye, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';

export default function Complaints() {
  const { toast } = useToast();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    fetchComplaints();
    fetchStats();
  }, [searchTerm, statusFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      };
      const response = await adminService.getComplaints(params);
      setComplaints(response.data.complaints || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch complaints',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminService.getComplaintStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch complaint stats:', error);
    }
  };

  const handleResolve = async () => {
    if (!selectedComplaint) return;
    
    try {
      await adminService.resolveComplaint(selectedComplaint._id, {
        resolution: resolutionNotes,
        resolvedBy: 'current_admin_id',
        resolvedAt: new Date().toISOString()
      });
      toast({
        title: 'Success',
        description: 'Complaint marked as resolved',
      });
      setResolutionNotes('');
      fetchComplaints();
      fetchStats();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resolve complaint',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Complaints</h1>
        <p className="text-muted-foreground mt-1">Manage member complaints and feedback</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold mt-1">{stats?.total || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold mt-1 text-red-600">
              {stats?.pending || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold mt-1 text-yellow-600">
              {stats?.inProgress || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Resolved</p>
            <p className="text-2xl font-bold mt-1 text-green-600">
              {stats?.resolved || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Member</th>
                  <th className="text-left p-3 font-semibold">Title</th>
                  <th className="text-left p-3 font-semibold">Category</th>
                  <th className="text-left p-3 font-semibold">Priority</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">Date</th>
                  <th className="text-right p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-3 font-medium">
                      {complaint.memberId?.name || complaint.userName || 'N/A'}
                    </td>
                    <td className="p-3">{complaint.title}</td>
                    <td className="p-3">
                      <Badge variant="outline">{complaint.category}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={
                        complaint.priority === 'high' ? 'destructive' :
                        complaint.priority === 'medium' ? 'default' :
                        'secondary'
                      }>
                        {complaint.priority}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={
                        complaint.status === 'resolved' ? 'default' :
                        complaint.status === 'in_progress' ? 'secondary' :
                        'destructive'
                      }>
                        {complaint.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => setSelectedComplaint(complaint)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Complaint Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label>Member</Label>
                                <p className="font-medium mt-1">
                                  {selectedComplaint?.memberId?.name || selectedComplaint?.userName || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <Label>Title</Label>
                                <p className="font-medium mt-1">{selectedComplaint?.title}</p>
                              </div>
                              <div>
                                <Label>Description</Label>
                                <p className="text-sm mt-1">{selectedComplaint?.description}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Category</Label>
                                  <Badge className="mt-1">{selectedComplaint?.category}</Badge>
                                </div>
                                <div>
                                  <Label>Priority</Label>
                                  <Badge className="mt-1">{selectedComplaint?.priority}</Badge>
                                </div>
                              </div>
                              {selectedComplaint?.assignedTo && (
                                <div>
                                  <Label>Assigned To</Label>
                                  <p className="font-medium mt-1">{selectedComplaint.assignedTo}</p>
                                </div>
                              )}
                              {selectedComplaint?.status !== 'resolved' && (
                                <div className="space-y-2">
                                  <Label>Resolution Notes</Label>
                                  <Textarea 
                                    placeholder="Add resolution notes..." 
                                    rows={3}
                                    value={resolutionNotes}
                                    onChange={(e) => setResolutionNotes(e.target.value)}
                                  />
                                </div>
                              )}
                            </div>
                            {selectedComplaint?.status !== 'resolved' && (
                              <div className="flex justify-end gap-2">
                                <Button onClick={handleResolve}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark as Resolved
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {complaints.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No complaints found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}