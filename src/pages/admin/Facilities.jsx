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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, TrendingUp, Users, Clock, MapPin, Calendar, Shield, ChevronsUpDown, Search, Loader2, Dumbbell } from 'lucide-react';
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

// Helper: normalize sports array to always be [{ sportId, name }] format
function normalizeSportsArray(sports) {
  if (!Array.isArray(sports)) return [];
  return sports.map((sport) => {
    if (typeof sport === 'object' && sport !== null) {
      // Could be { sportId, name } or { sportId: { _id, name }, name }
      const sportId = sport.sportId?._id || sport.sportId || '';
      const name = sport.name || sport.sportId?.name || '';
      return { sportId, name };
    }
    // Legacy: plain string
    return { sportId: '', name: sport };
  });
}

// Multi-select sports component using Popover with checkboxes
// selectedSports is now [{ sportId, name }] array
function SportsMultiSelect({ selectedSports, onSportsChange, clubSports, loadingClubSports }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const normalizedSelected = normalizeSportsArray(selectedSports);

  // Filter club sports based on search term
  const filteredSports = clubSports.filter(sport =>
    sport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sport.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group filtered sports by category
  const groupedSports = filteredSports.reduce((acc, sport) => {
    if (!acc[sport.category]) acc[sport.category] = [];
    acc[sport.category].push(sport);
    return acc;
  }, {});

  const isSelected = (clubSport) => {
    return normalizedSelected.some(
      (s) => s.sportId === clubSport._id || s.name === clubSport.name
    );
  };

  const handleToggleSport = (clubSport) => {
    if (isSelected(clubSport)) {
      // Remove
      onSportsChange(
        normalizedSelected.filter(
          (s) => s.sportId !== clubSport._id && s.name !== clubSport.name
        )
      );
    } else {
      // Add with both sportId and name
      onSportsChange([
        ...normalizedSelected,
        { sportId: clubSport._id, name: clubSport.name },
      ]);
    }
  };

  const handleRemoveSport = (sportItem) => {
    onSportsChange(
      normalizedSelected.filter(
        (s) => !(s.sportId === sportItem.sportId && s.name === sportItem.name)
      )
    );
  };

  const selectedCount = normalizedSelected.length;

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-[40px] font-normal"
          >
            <span className="text-left truncate">
              {selectedCount > 0
                ? `${selectedCount} sport${selectedCount > 1 ? 's' : ''} selected`
                : 'Select sports/activities...'}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0" align="start">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>

          <ScrollArea className="h-[280px]">
            {loadingClubSports ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Loading sports...</span>
              </div>
            ) : clubSports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <Dumbbell className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No sports configured yet.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Go to Sports & Activities page to add sports first.
                </p>
              </div>
            ) : filteredSports.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">No sports match &ldquo;{searchTerm}&rdquo;</p>
              </div>
            ) : (
              <div className="p-2">
                {Object.entries(groupedSports).map(([category, sports]) => (
                  <div key={category} className="mb-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                      {category}
                    </p>
                    {sports.map((sport) => {
                      const checked = isSelected(sport);
                      return (
                        <div
                          key={sport._id}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer"
                          onClick={() => handleToggleSport(sport)}
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => handleToggleSport(sport)}
                            className="pointer-events-none"
                          />
                          <span className="text-sm flex-1">{sport.name}</span>
                          {sport.description && (
                            <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                              {sport.description}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {selectedCount > 0 && (
            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground"
                onClick={() => onSportsChange([])}
              >
                Clear all selections
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Show selected sports as badges - display sport name only */}
      {selectedCount > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {normalizedSelected.map((sportItem, index) => (
            <Badge
              key={sportItem.sportId || sportItem.name || index}
              variant="secondary"
              className="text-xs cursor-pointer hover:bg-destructive/20 hover:text-destructive transition-colors"
              onClick={() => handleRemoveSport(sportItem)}
            >
              {sportItem.name} ✕
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Facilities() {
  const { toast } = useToast();
  const [facilities, setFacilities] = useState([]);
  const [branches, setBranches] = useState([]);
  const [clubSports, setClubSports] = useState([]);
  const [loadingClubSports, setLoadingClubSports] = useState(false);
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
    // Fetch club sports for the multi-select dropdown
    fetchClubSports();
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

  const fetchClubSports = async () => {
    try {
      setLoadingClubSports(true);
      const response = await adminService.getClubSports({ status: 'active' });
      if (response.status === 'success') {
        setClubSports(response.data.sports || []);
      } else {
        setClubSports(response?.data?.sports || []);
      }
    } catch (error) {
      console.log('Club sports fetch skipped:', error.message);
      setClubSports([]);
    } finally {
      setLoadingClubSports(false);
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
    // Normalize sports to [{ sportId, name }] format for editing
    const sports = Array.isArray(facility.sports)
      ? facility.sports.map((sport) => {
        if (typeof sport === 'object' && sport !== null) {
          const sportId = sport.sportId?._id || sport.sportId || '';
          const name = sport.name || sport.sportId?.name || '';
          return { sportId, name };
        }
        return { sportId: '', name: sport };
      })
      : [];
    setEditingFacility({ ...facility, operatingHours, sports });
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
  const renderFormFields = (formData, setFormData) => (
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
          <Label>Sports/Activities</Label>
          <SportsMultiSelect
            selectedSports={formData.sports}
            onSportsChange={(sports) => setFormData({ ...formData, sports })}
            clubSports={clubSports}
            loadingClubSports={loadingClubSports}
          />
          <p className="text-xs text-muted-foreground">
            Select the sports and activities available at this facility. Only active sports from your club are shown.
          </p>
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
            placeholder="/images/ImageUpload.jpg"
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
                      <Badge key={i} variant="outline" className="text-xs">
                        {typeof sport === 'object' ? sport.name : sport}
                      </Badge>
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
              {renderFormFields(editingFacility, setEditingFacility)}
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