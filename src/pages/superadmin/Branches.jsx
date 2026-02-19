import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, MapPin, Users, IndianRupee, Edit, Trash2, Loader2, RefreshCw, Eye, Mail, Phone, MapPinned, Clock } from 'lucide-react';
import superadminService from '@/services/superadminService';
import { toast } from 'sonner';

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    operatingHours: {
      weekday: { open: '06:00', close: '22:00' },
      weekend: { open: '08:00', close: '20:00' },
    },
    status: 'active',
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await superadminService.getAllBranches();

      if (response.status === 'success') {
        setBranches(response.data.branches || []);
      }
    } catch (error) {
      console.error('Failed to fetch branches:', error);
      toast.error('Failed to load branches');
      // Use mock data as fallback
      setBranches([
        {
          _id: 'br1',
          name: 'Downtown Sports Hub',
          code: 'DSH001',
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10001',
          phone: '+1234567800',
          email: 'downtown@sportshub.com',
          manager: { name: 'Mike Admin' },
          totalMembers: 450,
          totalRevenue: 125000,
          status: 'active',
        },
        {
          _id: 'br2',
          name: 'Westside Fitness Center',
          code: 'WFC002',
          address: '456 West Avenue',
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA',
          zipCode: '90001',
          phone: '+1234567801',
          email: 'westside@sportshub.com',
          manager: { name: 'Jane Manager' },
          totalMembers: 380,
          totalRevenue: 98000,
          status: 'active',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      phone: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      operatingHours: {
        weekday: { open: '06:00', close: '22:00' },
        weekend: { open: '08:00', close: '20:00' },
      },
      status: 'active',
    });
  };

  const validatePhoneNumber = (phone) => {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Check if it's a valid format (starts with + and has 10-15 digits)
    const phoneRegex = /^\+\d{10,15}$/;
    return phoneRegex.test(cleaned);
  };

  const handleAddBranch = async () => {
    if (!formData.name || !formData.code || !formData.phone || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.address.city || !formData.address.country) {
      toast.error('City and Country are required');
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      toast.error('Please enter a valid phone number in format: +1234567890');
      return;
    }

    try {
      setSubmitting(true);
      const response = await superadminService.createBranch(formData);

      if (response.status === 'success') {
        toast.success('Branch created successfully');
        setShowAddModal(false);
        resetForm();
        fetchBranches();
      }
    } catch (error) {
      console.error('Failed to create branch:', error);
      toast.error(error.message || 'Failed to create branch');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditBranch = async () => {
    if (!selectedBranch) return;

    if (!validatePhoneNumber(formData.phone)) {
      toast.error('Please enter a valid phone number in format: +1234567890');
      return;
    }

    try {
      setSubmitting(true);
      const response = await superadminService.updateBranch(selectedBranch._id, formData);

      if (response.status === 'success') {
        toast.success('Branch updated successfully');
        setShowEditModal(false);
        setSelectedBranch(null);
        resetForm();
        fetchBranches();
      }
    } catch (error) {
      console.error('Failed to update branch:', error);
      toast.error(error.message || 'Failed to update branch');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBranch = async () => {
    if (!selectedBranch) return;

    try {
      setSubmitting(true);
      const response = await superadminService.deleteBranch(selectedBranch._id);

      if (response.status === 'success') {
        toast.success('Branch deleted successfully');
        setShowDeleteModal(false);
        setSelectedBranch(null);
        fetchBranches();
      }
    } catch (error) {
      console.error('Failed to delete branch:', error);
      toast.error(error.message || 'Failed to delete branch');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (branch) => {
    setSelectedBranch(branch);
    setFormData({
      name: branch.name || '',
      code: branch.code || '',
      phone: branch.phone || '',
      email: branch.email || '',
      address: {
        street: branch.address || '',
        city: branch.city || '',
        state: branch.state || '',
        zipCode: branch.zipCode || '',
        country: branch.country || '',
      },
      operatingHours: branch.operatingHours || {
        weekday: { open: '06:00', close: '22:00' },
        weekend: { open: '08:00', close: '20:00' },
      },
      status: branch.status || 'active',
    });
    setShowEditModal(true);
  };

  const openDetailsModal = (branch) => {
    setSelectedBranch(branch);
    setShowDetailsModal(true);
  };

  const updateFormField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAddressField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Branches</h1>
          <p className="text-muted-foreground mt-1">Manage club branches and locations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchBranches} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Branch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Branch</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new branch location
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Branch Name *</Label>
                  <Input
                    placeholder="Downtown Sports Hub"
                    value={formData.name}
                    onChange={(e) => updateFormField('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Branch Code *</Label>
                  <Input
                    placeholder="DSH001"
                    value={formData.code}
                    onChange={(e) => updateFormField('code', e.target.value)}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Street Address</Label>
                  <Input
                    placeholder="123 Main Street"
                    value={formData.address.street}
                    onChange={(e) => updateAddressField('street', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input
                    placeholder="New York"
                    value={formData.address.city}
                    onChange={(e) => updateAddressField('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    placeholder="NY"
                    value={formData.address.state}
                    onChange={(e) => updateAddressField('state', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Zip Code</Label>
                  <Input
                    placeholder="10001"
                    value={formData.address.zipCode}
                    onChange={(e) => updateAddressField('zipCode', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Input
                    placeholder="USA"
                    value={formData.address.country}
                    onChange={(e) => updateAddressField('country', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={(e) => updateFormField('phone', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Format: +1234567890</p>
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    placeholder="branch@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormField('email', e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button onClick={handleAddBranch} disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Branch
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-muted-foreground">Loading branches...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-muted-foreground">
              No branches found. Click &quot;Add Branch&quot; to create one.
            </div>
          ) : (
            branches.map((branch) => (
              <Card
                key={branch._id}
                className="card-hover cursor-pointer transition-all"
                onClick={() => openDetailsModal(branch)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{branch.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {branch.city || 'N/A'}, {branch.country || 'N/A'}
                      </p>
                    </div>
                    <Badge variant={branch.status === 'active' ? 'default' : 'secondary'}>
                      {branch.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Total Members
                      </span>
                      <span className="font-semibold">{branch.totalMembers || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <IndianRupee className="h-4 w-4" />
                        Total Revenue
                      </span>
                      <span className="font-semibold">₹{(branch.totalRevenue || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Manager</span>
                      <span className="font-medium">{branch.manager?.name || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Contact</span>
                      <span className="font-medium">{branch.phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Code</span>
                      <span className="font-medium">{branch.code || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailsModal(branch);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(branch);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBranch(branch);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* View Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Branch Details</DialogTitle>
            <DialogDescription>
              View complete information about this branch location
            </DialogDescription>
          </DialogHeader>
          {selectedBranch && (
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedBranch.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Code: {selectedBranch.code}</p>
                  </div>
                  <Badge variant={selectedBranch.status === 'active' ? 'default' : 'secondary'} className="text-sm">
                    {selectedBranch.status}
                  </Badge>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 border-t pt-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedBranch.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedBranch.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3 border-t pt-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase">Location</h4>
                <div className="flex items-start gap-3">
                  <MapPinned className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">
                      {selectedBranch.address && selectedBranch.address !== '' ? `${selectedBranch.address}, ` : ''}
                      {selectedBranch.city || 'N/A'}
                      {selectedBranch.state ? `, ${selectedBranch.state}` : ''}
                      {selectedBranch.zipCode ? ` ${selectedBranch.zipCode}` : ''}
                    </p>
                    <p className="text-sm text-muted-foreground">{selectedBranch.country || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Manager Info */}
              <div className="space-y-3 border-t pt-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase">Branch Manager</h4>
                {selectedBranch.manager ? (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    {selectedBranch.manager.avatar && (
                      <img
                        src={selectedBranch.manager.avatar}
                        alt={selectedBranch.manager.name}
                        className="h-10 w-10 rounded-full"
                      />
                    )}
                    <div>
                      <p className="font-medium">{selectedBranch.manager.name}</p>
                      {selectedBranch.manager.email && (
                        <p className="text-sm text-muted-foreground">{selectedBranch.manager.email}</p>
                      )}
                      {selectedBranch.manager.phone && (
                        <p className="text-sm text-muted-foreground">{selectedBranch.manager.phone}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No manager assigned</p>
                )}
              </div>

              {/* Operating Hours */}
              {selectedBranch.operatingHours && (
                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Operating Hours
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedBranch.operatingHours.weekdays && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Weekdays</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedBranch.operatingHours.weekdays.open} - {selectedBranch.operatingHours.weekdays.close}
                        </p>
                      </div>
                    )}
                    {selectedBranch.operatingHours.weekends && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Weekends</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedBranch.operatingHours.weekends.open} - {selectedBranch.operatingHours.weekends.close}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Facilities & Sports */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                {selectedBranch.facilityNames && selectedBranch.facilityNames.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase mb-2">Facilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBranch.facilityNames.map((facility, index) => (
                        <Badge key={index} variant="outline">{facility}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedBranch.sportsOffered && selectedBranch.sportsOffered.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase mb-2">Sports Offered</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBranch.sportsOffered.map((sport, index) => (
                        <Badge key={index} variant="outline">{sport}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{selectedBranch.totalMembers || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <IndianRupee className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">₹{(selectedBranch.totalRevenue || 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsModal(false)}>Close</Button>
            <Button onClick={() => {
              setShowDetailsModal(false);
              openEditModal(selectedBranch);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Branch Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
            <DialogDescription>
              Update the branch information below
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Branch Name</Label>
              <Input
                placeholder="Downtown Sports Hub"
                value={formData.name}
                onChange={(e) => updateFormField('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Branch Code</Label>
              <Input
                placeholder="DSH001"
                value={formData.code}
                onChange={(e) => updateFormField('code', e.target.value)}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Street Address</Label>
              <Input
                placeholder="123 Main Street"
                value={formData.address.street}
                onChange={(e) => updateAddressField('street', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                placeholder="New York"
                value={formData.address.city}
                onChange={(e) => updateAddressField('city', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input
                placeholder="NY"
                value={formData.address.state}
                onChange={(e) => updateAddressField('state', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Zip Code</Label>
              <Input
                placeholder="10001"
                value={formData.address.zipCode}
                onChange={(e) => updateAddressField('zipCode', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input
                placeholder="USA"
                value={formData.address.country}
                onChange={(e) => updateAddressField('country', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                type="tel"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={(e) => updateFormField('phone', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Format: +1234567890</p>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="branch@example.com"
                value={formData.email}
                onChange={(e) => updateFormField('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => updateFormField('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button onClick={handleEditBranch} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Branch</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedBranch?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteBranch} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}