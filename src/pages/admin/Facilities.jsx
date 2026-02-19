import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit, TrendingUp, Users, Clock, MapPin, Calendar, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';
import { FACILITY_TYPES, FACILITY_STATUS } from '@/lib/constants';

// Days of the week for operating hours
const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

// Age restriction options
const AGE_RESTRICTIONS = [
  { value: 'All ages', label: 'All Ages' },
  { value: '18+', label: '18+ Only' },
  { value: '16+', label: '16+ Only' },
  { value: '12+', label: '12+ Only' },
  { value: 'Children only', label: 'Children Only (Under 12)' },
];

// Initial form state matching backend schema
const getInitialFormState = () => ({
  name: '',
  type: '',
  capacity: '',
  location: '',
  branchId: '',
  amenities: [],
  status: 'available',
  sports: [],
  safetyRules: [],
  maxOccupancy: '',
  ageRestriction: 'All ages',
  imageUrl: '',
  operatingHours: {
    monday: { open: '06:00', close: '22:00' },
    tuesday: { open: '06:00', close: '22:00' },
    wednesday: { open: '06:00', close: '22:00' },
    thursday: { open: '06:00', close: '22:00' },
    friday: { open: '06:00', close: '22:00' },
    saturday: { open: '07:00', close: '20:00' },
    sunday: { open: '07:00', close: '20:00' },
  }
});

export default function Facilities() {
  const { toast } = useToast();
  const [facilities, setFacilities] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [viewingStats, setViewingStats] = useState(null);
  const [newFacility, setNewFacility] = useState(getInitialFormState());

  useEffect(() => {
    fetchFacilities();
    // Branch fetch is optional - don't block page load if it fails
    fetchBranches();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await adminService.getFacilities();
      setFacilities(response.data.facilities || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch facilities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      // Try to get branch info - this is optional, don't show error if it fails
      const response = await adminService.getBranches();
      setBranches(response?.data?.branches || []);
    } catch (error) {
      // Silently handle error - branches dropdown will just be empty
      console.log('Branch fetch skipped:', error.message);
      setBranches([]);
    }
  };

  const handleAddFacility = async () => {
    // Validation
    if (!newFacility.name || !newFacility.type || !newFacility.capacity || !newFacility.location || !newFacility.maxOccupancy) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields (Name, Type, Capacity, Location, Max Occupancy)',
        variant: 'destructive',
      });
      return;
    }

    try {
      const facilityData = {
        ...newFacility,
        capacity: parseInt(newFacility.capacity),
        maxOccupancy: parseInt(newFacility.maxOccupancy),
      };

      // Remove branchId if empty (backend will use admin's branch)
      if (!facilityData.branchId) {
        delete facilityData.branchId;
      }

      await adminService.createFacility(facilityData);
      toast({
        title: 'Success',
        description: 'Facility added successfully',
      });
      setShowAddModal(false);
      setNewFacility(getInitialFormState());
      fetchFacilities();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add facility',
        variant: 'destructive',
      });
    }
  };

  const handleEditFacility = (facility) => {
    // Ensure operatingHours has all days
    const operatingHours = {
      monday: facility.operatingHours?.monday || { open: '06:00', close: '22:00' },
      tuesday: facility.operatingHours?.tuesday || { open: '06:00', close: '22:00' },
      wednesday: facility.operatingHours?.wednesday || { open: '06:00', close: '22:00' },
      thursday: facility.operatingHours?.thursday || { open: '06:00', close: '22:00' },
      friday: facility.operatingHours?.friday || { open: '06:00', close: '22:00' },
      saturday: facility.operatingHours?.saturday || { open: '07:00', close: '20:00' },
      sunday: facility.operatingHours?.sunday || { open: '07:00', close: '20:00' },
    };
    setEditingFacility({ ...facility, operatingHours });
    setShowEditModal(true);
  };

  const handleUpdateFacility = async () => {
    try {
      const facilityData = {
        ...editingFacility,
        capacity: parseInt(editingFacility.capacity),
        maxOccupancy: parseInt(editingFacility.maxOccupancy),
      };

      // Remove branchId if empty
      if (!facilityData.branchId) {
        delete facilityData.branchId;
      }

      await adminService.updateFacility(editingFacility._id, facilityData);
      toast({
        title: 'Success',
        description: 'Facility updated successfully',
      });
      setShowEditModal(false);
      setEditingFacility(null);
      fetchFacilities();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update facility',
        variant: 'destructive',
      });
    }
  };

  const handleViewStats = async (facility) => {
    try {
      const response = await adminService.getFacilityStats(facility._id);
      setViewingStats({ ...facility, stats: response.data });
      setShowStatsModal(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch facility stats',
        variant: 'destructive',
      });
    }
  };

  // Helper function to get facility type label
  const getFacilityTypeLabel = (typeValue) => {
    const facilityType = FACILITY_TYPES.find(t => t.value === typeValue);
    return facilityType ? facilityType.label : typeValue;
  };

  // Helper to update operating hours
  const updateOperatingHours = (formData, setFormData, day, field, value) => {
    setFormData({
      ...formData,
      operatingHours: {
        ...formData.operatingHours,
        [day]: {
          ...formData.operatingHours[day],
          [field]: value
        }
      }
    });
  };

  // Render form fields (reusable for Add and Edit)
  const renderFormFields = (formData, setFormData, isEdit = false) => (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="hours">Operating Hours</TabsTrigger>
        <TabsTrigger value="safety">Safety & Rules</TabsTrigger>
      </TabsList>

      {/* Basic Info Tab */}
      <TabsContent value="basic" className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Facility Name <span className="text-red-500">*</span></Label>
            <Input
              placeholder="e.g., Studio A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Type <span className="text-red-500">*</span></Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {FACILITY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Capacity <span className="text-red-500">*</span></Label>
            <Input
              type="number"
              placeholder="25"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Max Occupancy <span className="text-red-500">*</span></Label>
            <Input
              type="number"
              placeholder="30"
              value={formData.maxOccupancy}
              onChange={(e) => setFormData({ ...formData, maxOccupancy: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Location <span className="text-red-500">*</span></Label>
          <Input
            placeholder="Building 1, Floor 2"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Only show branch dropdown if branches are available */}
          {branches.length > 0 && (
            <div className="space-y-2">
              <Label>Branch</Label>
              <Select
                value={formData.branchId || 'none'}
                onValueChange={(value) => setFormData({ ...formData, branchId: value === 'none' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Default Branch</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch._id} value={branch._id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {FACILITY_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </TabsContent>

      {/* Details Tab */}
      <TabsContent value="details" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label>Sports/Activities (comma separated)</Label>
          <Input
            placeholder="Yoga, Pilates, Meditation"
            value={Array.isArray(formData.sports) ? formData.sports.join(', ') : ''}
            onChange={(e) => setFormData({ ...formData, sports: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
          />
        </div>

        <div className="space-y-2">
          <Label>Amenities (comma separated)</Label>
          <Input
            placeholder="Air Conditioning, Sound System, Mirrors"
            value={Array.isArray(formData.amenities) ? formData.amenities.join(', ') : ''}
            onChange={(e) => setFormData({ ...formData, amenities: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
          />
        </div>

        <div className="space-y-2">
          <Label>Age Restriction</Label>
          <Select
            value={formData.ageRestriction || 'All ages'}
            onValueChange={(value) => setFormData({ ...formData, ageRestriction: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select age restriction" />
            </SelectTrigger>
            <SelectContent>
              {AGE_RESTRICTIONS.map((age) => (
                <SelectItem key={age.value} value={age.value}>
                  {age.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input
            placeholder="/images/photo1770984360.jpg"
            value={formData.imageUrl || ''}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
          {formData.imageUrl && (
            <div className="mt-2">
              <img
                src={formData.imageUrl}
                alt="Facility preview"
                className="w-full h-32 object-cover rounded-md"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
        </div>
      </TabsContent>

      {/* Operating Hours Tab */}
      <TabsContent value="hours" className="space-y-4 mt-4">
        <ScrollArea className="h-[300px] pr-4">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day.key} className="grid grid-cols-3 gap-4 items-center py-2 border-b">
              <Label className="font-medium">{day.label}</Label>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Open</Label>
                <Input
                  type="time"
                  value={formData.operatingHours?.[day.key]?.open || '06:00'}
                  onChange={(e) => updateOperatingHours(formData, setFormData, day.key, 'open', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Close</Label>
                <Input
                  type="time"
                  value={formData.operatingHours?.[day.key]?.close || '22:00'}
                  onChange={(e) => updateOperatingHours(formData, setFormData, day.key, 'close', e.target.value)}
                />
              </div>
            </div>
          ))}
        </ScrollArea>
      </TabsContent>

      {/* Safety & Rules Tab */}
      <TabsContent value="safety" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label>Safety Rules (one per line)</Label>
          <Textarea
            placeholder="No running near pool&#10;Wear appropriate footwear&#10;Follow instructor guidelines"
            rows={6}
            value={Array.isArray(formData.safetyRules) ? formData.safetyRules.join('\n') : ''}
            onChange={(e) => setFormData({ ...formData, safetyRules: e.target.value.split('\n').map(s => s.trim()).filter(s => s) })}
          />
          <p className="text-xs text-muted-foreground">Enter each safety rule on a new line</p>
        </div>
      </TabsContent>
    </Tabs>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading facilities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Facilities & Sports Management</h1>
          <p className="text-muted-foreground mt-1">Manage facilities and track utilization</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Facility
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Facility</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {renderFormFields(newFacility, setNewFacility)}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button onClick={handleAddFacility}>Add Facility</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <Card key={facility._id} className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{facility.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{getFacilityTypeLabel(facility.type)}</p>
                </div>
                <Badge variant={facility.status === 'available' ? 'default' : 'secondary'}>
                  {facility.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {facility.imageUrl && (
                <img
                  src={facility.imageUrl}
                  alt={facility.name}
                  className="w-full h-32 object-cover rounded-md"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> Capacity
                  </span>
                  <span className="font-medium">{facility.capacity} people</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> Max Occupancy
                  </span>
                  <span className="font-medium">{facility.maxOccupancy} people</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Location
                  </span>
                  <span className="font-medium">{facility.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Occupancy</span>
                  <span className="font-medium">{facility.currentOccupancy || 0}</span>
                </div>
                {facility.ageRestriction && facility.ageRestriction !== 'All ages' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Age Restriction</span>
                    <Badge variant="outline">{facility.ageRestriction}</Badge>
                  </div>
                )}
              </div>

              {facility.sports && facility.sports.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Sports/Activities</p>
                  <div className="flex flex-wrap gap-1">
                    {facility.sports.map((sport, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{sport}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {facility.amenities && facility.amenities.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-1">
                    {facility.amenities.slice(0, 3).map((amenity, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{amenity}</Badge>
                    ))}
                    {facility.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{facility.amenities.length - 3} more</Badge>
                    )}
                  </div>
                </div>
              )}

              {facility.safetyRules && facility.safetyRules.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Safety Rules
                  </p>
                  <p className="text-xs text-muted-foreground">{facility.safetyRules.length} rules defined</p>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditFacility(facility)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" className="flex-1" onClick={() => handleViewStats(facility)}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Stats
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {facilities.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No facilities found</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Facility Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Facility</DialogTitle>
          </DialogHeader>
          {editingFacility && (
            <div className="py-4">
              {renderFormFields(editingFacility, setEditingFacility, true)}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button onClick={handleUpdateFacility}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Stats Modal */}
      <Dialog open={showStatsModal} onOpenChange={setShowStatsModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Facility Statistics - {viewingStats?.name}</DialogTitle>
          </DialogHeader>
          {viewingStats && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold">{viewingStats.stats?.totalVisits || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Visits</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-2xl font-bold">{viewingStats.stats?.avgDuration || 0}m</p>
                    <p className="text-sm text-muted-foreground">Avg Duration</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold">{viewingStats.stats?.occupancyRate || 0}%</p>
                    <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Facility Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{getFacilityTypeLabel(viewingStats.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity:</span>
                    <span className="font-medium">{viewingStats.capacity} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Occupancy:</span>
                    <span className="font-medium">{viewingStats.maxOccupancy} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Occupancy:</span>
                    <span className="font-medium">{viewingStats.currentOccupancy || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{viewingStats.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Age Restriction:</span>
                    <span className="font-medium">{viewingStats.ageRestriction || 'All ages'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge>{viewingStats.status}</Badge>
                  </div>
                </div>
              </div>

              {viewingStats.operatingHours && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Operating Hours
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day.key} className="flex justify-between">
                        <span className="text-muted-foreground">{day.label}:</span>
                        <span className="font-medium">
                          {viewingStats.operatingHours[day.key]?.open || 'Closed'} - {viewingStats.operatingHours[day.key]?.close || 'Closed'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewingStats.safetyRules && viewingStats.safetyRules.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Safety Rules
                  </h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {viewingStats.safetyRules.map((rule, i) => (
                      <li key={i} className="text-muted-foreground">{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatsModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}