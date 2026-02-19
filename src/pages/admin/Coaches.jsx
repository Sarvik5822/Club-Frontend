import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, CheckCircle, X, Eye, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';

export default function Coaches() {
  const { toast } = useToast();
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [editingCoach, setEditingCoach] = useState(null);
  const [newCoach, setNewCoach] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    specializations: [],
    certifications: [],
    bio: '',
    hourlyRate: 0
  });

  useEffect(() => {
    fetchCoaches();
  }, [searchTerm]);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const params = {
        ...(searchTerm && { search: searchTerm })
      };
      const response = await adminService.getCoaches(params);
      setCoaches(response.data.coaches || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch coaches',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (coach) => {
    try {
      const response = await adminService.getCoachById(coach._id);
      setSelectedCoach(response.data.coach);
      setShowViewModal(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch coach details',
        variant: 'destructive',
      });
    }
  };

  const handleAddCoach = async () => {
    try {
      await adminService.createCoach(newCoach);
      toast({
        title: 'Success',
        description: 'Coach added successfully',
      });
      setShowAddModal(false);
      setNewCoach({
        email: '',
        password: '',
        name: '',
        phone: '',
        specializations: [],
        certifications: [],
        bio: '',
        hourlyRate: 0
      });
      fetchCoaches();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add coach',
        variant: 'destructive',
      });
    }
  };

  const handleEditCoach = (coach) => {
    setEditingCoach(coach);
    setShowEditModal(true);
  };

  const handleUpdateCoach = async () => {
    try {
      await adminService.updateCoach(editingCoach._id, editingCoach);
      toast({
        title: 'Success',
        description: 'Coach updated successfully',
      });
      setShowEditModal(false);
      setEditingCoach(null);
      fetchCoaches();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update coach',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCoach = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await adminService.deleteCoach(id);
      toast({
        title: 'Success',
        description: `Coach ${name} deleted successfully`,
      });
      fetchCoaches();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete coach',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading coaches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Coaches</h1>
          <p className="text-muted-foreground mt-1">Manage coaches and their profiles</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Coach
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search coaches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Coach</th>
                  <th className="text-left p-3 font-semibold">Specializations</th>
                  <th className="text-left p-3 font-semibold">Rating</th>
                  <th className="text-left p-3 font-semibold">Rate</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-right p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coaches.map((coach) => (
                  <tr key={coach._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={coach.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${coach.email}`}
                          alt={coach.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{coach.name}</p>
                          <p className="text-sm text-muted-foreground">{coach.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {coach.specializations?.slice(0, 2).map((spec, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{spec}</Badge>
                        ))}
                        {coach.specializations?.length > 2 && (
                          <Badge variant="secondary" className="text-xs">+{coach.specializations.length - 2}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{coach.rating || 'N/A'}</span>
                        {coach.rating && <span className="text-yellow-500">★</span>}
                      </div>
                    </td>
                    <td className="p-3">₹{coach.hourlyRate || 0}/hr</td>
                    <td className="p-3">
                      <Badge variant={coach.status === 'active' ? 'default' : 'secondary'}>
                        {coach.status || 'active'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewDetails(coach)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEditCoach(coach)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteCoach(coach._id, coach.name)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Coach Details Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Coach Details</DialogTitle>
          </DialogHeader>
          {selectedCoach && (
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-4">
                <img
                  src={selectedCoach.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCoach.email}`}
                  alt={selectedCoach.name}
                  className="w-20 h-20 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedCoach.name}</h3>
                  <p className="text-muted-foreground">{selectedCoach.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedCoach.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="font-semibold">{selectedCoach.rating || 'N/A'} ★</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hourly Rate</p>
                  <p className="font-semibold">₹{selectedCoach.hourlyRate || 0}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCoach.specializations?.map((spec, i) => (
                    <Badge key={i} variant="secondary">{spec}</Badge>
                  ))}
                </div>
              </div>

              {selectedCoach.certifications?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Certifications</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedCoach.certifications.map((cert, i) => (
                      <li key={i} className="text-sm">{cert}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedCoach.bio && (
                <div>
                  <h4 className="font-semibold mb-2">Bio</h4>
                  <p className="text-sm text-muted-foreground">{selectedCoach.bio}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Coach Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Coach</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={newCoach.name}
                  onChange={(e) => setNewCoach({ ...newCoach, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newCoach.email}
                  onChange={(e) => setNewCoach({ ...newCoach, email: e.target.value })}
                  placeholder="coach@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={newCoach.password}
                  onChange={(e) => setNewCoach({ ...newCoach, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={newCoach.phone}
                  onChange={(e) => setNewCoach({ ...newCoach, phone: e.target.value })}
                  placeholder="+919876543210"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Hourly Rate (₹)</Label>
              <Input
                type="number"
                value={newCoach.hourlyRate}
                onChange={(e) => setNewCoach({ ...newCoach, hourlyRate: parseInt(e.target.value) })}
                placeholder="1000"
              />
            </div>
            <div className="space-y-2">
              <Label>Specializations (comma separated)</Label>
              <Input
                value={newCoach.specializations.join(', ')}
                onChange={(e) => setNewCoach({ ...newCoach, specializations: e.target.value.split(',').map(s => s.trim()) })}
                placeholder="Swimming, Tennis, Yoga"
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={newCoach.bio}
                onChange={(e) => setNewCoach({ ...newCoach, bio: e.target.value })}
                placeholder="Brief bio about the coach..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddCoach}>Add Coach</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Coach Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Coach</DialogTitle>
          </DialogHeader>
          {editingCoach && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={editingCoach.name}
                    onChange={(e) => setEditingCoach({ ...editingCoach, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editingCoach.phone}
                    onChange={(e) => setEditingCoach({ ...editingCoach, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Hourly Rate (₹)</Label>
                <Input
                  type="number"
                  value={editingCoach.hourlyRate}
                  onChange={(e) => setEditingCoach({ ...editingCoach, hourlyRate: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={editingCoach.bio || ''}
                  onChange={(e) => setEditingCoach({ ...editingCoach, bio: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button onClick={handleUpdateCoach}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}