import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Building, MapPin, Users, Shield, Info, CheckCircle, Search, RefreshCw } from 'lucide-react';
import memberService from '@/services/memberService';
import { toast } from 'sonner';

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active');

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const params = { status: filterStatus };
      if (filterType !== 'all') params.type = filterType;
      const res = await memberService.getFacilities(params);
      setFacilities(res.data?.facilities || []);
    } catch (error) {
      toast.error('Failed to load facilities: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [filterType, filterStatus]);

  const handleViewDetails = async (facility) => {
    try {
      const res = await memberService.getFacilityById(facility._id);
      setSelectedFacility(res.data?.facility || facility);
      setShowDetailModal(true);
    } catch {
      setSelectedFacility(facility);
      setShowDetailModal(true);
    }
  };

  const filteredFacilities = facilities.filter(f =>
    f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-500 text-white';
      case 'maintenance': return 'bg-yellow-500 text-white';
      case 'inactive': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sports & Facilities</h1>
          <p className="text-muted-foreground mt-1">Explore available facilities at your branch</p>
        </div>
        <Button variant="outline" onClick={fetchFacilities} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search facilities..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="gym">Gym</SelectItem>
                <SelectItem value="pool">Pool</SelectItem>
                <SelectItem value="court">Court</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="field">Field</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Facilities Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i}>
              <Skeleton className="w-full h-48" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredFacilities.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">No facilities found</p>
            <p className="text-muted-foreground mt-1">
              {searchTerm ? 'Try adjusting your search' : 'No facilities available for the selected filters'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-4">{filteredFacilities.length} facilities found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map((facility) => (
              <Card
                key={facility._id}
                className="card-hover overflow-hidden cursor-pointer"
                onClick={() => handleViewDetails(facility)}
              >
                <img
                  src={facility.imageUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=200&fit=crop'}
                  alt={facility.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=200&fit=crop'; }}
                />
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{facility.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{facility.type}</p>
                    </div>
                    <Badge className={getStatusColor(facility.status)}>
                      {facility.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    {facility.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{facility.location}</span>
                      </div>
                    )}
                    {facility.branch && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{facility.branch.name}</span>
                      </div>
                    )}
                    {facility.capacity && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        <span>Capacity: {facility.capacity}</span>
                      </div>
                    )}
                  </div>

                  {facility.sports && facility.sports.length > 0 && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Sports:</p>
                      <div className="flex flex-wrap gap-1">
                        {facility.sports.slice(0, 3).map((sport, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {typeof sport === 'object' ? sport.name : sport}
                          </Badge>
                        ))}
                        {facility.sports.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{facility.sports.length - 3}</Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(facility);
                    }}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Facility Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedFacility?.name}</DialogTitle>
            <DialogDescription>Complete facility information and guidelines</DialogDescription>
          </DialogHeader>
          {selectedFacility && (
            <div className="space-y-6">
              <img
                src={selectedFacility.imageUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=300&fit=crop'}
                alt={selectedFacility.name}
                className="w-full h-64 rounded-lg object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=300&fit=crop'; }}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{selectedFacility.type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedFacility.status)}>
                    {selectedFacility.status}
                  </Badge>
                </div>
                {selectedFacility.location && (
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedFacility.location}</p>
                  </div>
                )}
                {selectedFacility.capacity && (
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-medium">{selectedFacility.capacity} people</p>
                  </div>
                )}
                {selectedFacility.branch && (
                  <div>
                    <p className="text-sm text-muted-foreground">Branch</p>
                    <p className="font-medium">{selectedFacility.branch.name}</p>
                  </div>
                )}
                {selectedFacility.openingHours && (
                  <div>
                    <p className="text-sm text-muted-foreground">Opening Hours</p>
                    <p className="font-medium">{selectedFacility.openingHours}</p>
                  </div>
                )}
              </div>

              {selectedFacility.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedFacility.description}</p>
                </div>
              )}

              {selectedFacility.amenities && selectedFacility.amenities.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Amenities
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedFacility.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedFacility.rules && selectedFacility.rules.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Rules & Guidelines
                  </h4>
                  <ul className="space-y-2">
                    {selectedFacility.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-emerald-600 mt-0.5">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedFacility.sports && selectedFacility.sports.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Available Sports</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFacility.sports.map((sport, i) => (
                      <Badge key={i} variant="secondary">
                        {typeof sport === 'object' ? sport.name : sport}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}