import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Building, MapPin, Users, Shield, Info, CheckCircle } from 'lucide-react';
import { mockFacilities, mockMembers } from '@/lib/mockData';
import { useAuth } from '@/lib/auth';

export default function Facilities() {
  const { user } = useAuth();
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Get current member data
  const currentMember = mockMembers.find(m => m.id === user?.id);
  const accessibleSports = currentMember?.accessibleSports || [];

  // Filter facilities based on member's accessible sports
  const accessibleFacilities = mockFacilities.filter(facility => 
    facility.sports.some(sport => accessibleSports.includes(sport))
  );

  const handleViewDetails = (facility) => {
    setSelectedFacility(facility);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sports & Facilities</h1>
        <p className="text-muted-foreground mt-1">
          Explore facilities available under your {currentMember?.membershipType} membership
        </p>
      </div>

      {/* Membership Info Card */}
      <Card className="border-emerald-500">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Your Membership Access</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {accessibleSports.map(sport => (
                  <Badge key={sport} variant="secondary" className="bg-emerald-100 text-emerald-700">
                    {sport}
                  </Badge>
                ))}
              </div>
              {currentMember?.multiClubAccess && (
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Multi-club access enabled
                </p>
              )}
            </div>
            <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">
              {currentMember?.membershipType} Member
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Accessible Facilities Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Accessible Facilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessibleFacilities.map((facility) => (
            <Card 
              key={facility.id} 
              className="card-hover overflow-hidden cursor-pointer"
              onClick={() => handleViewDetails(facility)}
            >
              <img
                src={facility.imageUrl || 'https://mgx-backend-cdn.metadl.com/generate/images/924660/2026-01-22/36f0a43c-5afe-42bf-8fef-68eef36ee9ec.png'}
                alt={facility.name}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{facility.name}</h3>
                    <p className="text-sm text-muted-foreground">{facility.type}</p>
                  </div>
                  <Badge 
                    variant={facility.status === 'available' ? 'default' : 'destructive'}
                    className={facility.status === 'available' ? 'bg-emerald-500' : ''}
                  >
                    {facility.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{facility.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Max {facility.maxOccupancy} people • {facility.ageRestriction}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Available Sports:</p>
                  <div className="flex flex-wrap gap-1">
                    {facility.sports.map(sport => (
                      <Badge key={sport} variant="outline" className="text-xs">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                </div>

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

      {/* Multi-Club Access Info */}
      {currentMember?.multiClubAccess && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Your Accessible Clubs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentMember.accessibleClubs.map((club, index) => (
                <div key={index} className="p-4 rounded-lg border flex items-center gap-3">
                  <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900">
                    <Building className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{club}</p>
                    <p className="text-xs text-muted-foreground">Full access</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Facility Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedFacility?.name}</DialogTitle>
            <DialogDescription>
              Complete facility information and guidelines
            </DialogDescription>
          </DialogHeader>
          {selectedFacility && (
            <div className="space-y-6">
              <img
                src={selectedFacility.imageUrl}
                alt={selectedFacility.name}
                className="w-full h-64 rounded-lg object-cover"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{selectedFacility.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedFacility.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="font-medium">{selectedFacility.capacity} people</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Occupancy</p>
                  <p className="font-medium">{selectedFacility.maxOccupancy} people</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age Restriction</p>
                  <p className="font-medium">{selectedFacility.ageRestriction}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={selectedFacility.status === 'available' ? 'default' : 'destructive'}>
                    {selectedFacility.status}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Amenities
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedFacility.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Safety Rules & Guidelines
                </h4>
                <ul className="space-y-2">
                  {selectedFacility.safetyRules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-emerald-600 mt-0.5">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Available Sports</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFacility.sports.map(sport => (
                    <Badge key={sport} variant="secondary">
                      {sport}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}