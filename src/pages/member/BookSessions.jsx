import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { mockSessions, sports, locations } from '@/lib/mockData';
import { Search, Calendar, MapPin, Users, Clock, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function BookSessions() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const filteredSessions = mockSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.sport.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === 'all' || session.sport === selectedSport;
    const matchesLocation = selectedLocation === 'all' || session.location === selectedLocation;
    const matchesDifficulty = selectedDifficulty === 'all' || session.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesSport && matchesLocation && matchesDifficulty;
  });

  const handleViewSession = (session) => {
    setSelectedSession(session);
    setShowDetailModal(true);
  };

  const handleBookSession = () => {
    setShowDetailModal(false);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    toast.success(`Successfully booked ${selectedSession?.title}!`);
    setShowBookingModal(false);
    setTimeout(() => {
      navigate('/member/schedule');
    }, 1500);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSport('all');
    setSelectedLocation('all');
    setSelectedDifficulty('all');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Book Sessions</h1>
        <p className="text-muted-foreground mt-1">Browse and book available classes</p>
      </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sessions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger>
                <SelectValue placeholder="Select sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {sports.map(sport => (
                  <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredSessions.length} of {mockSessions.length} sessions
        </p>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session) => (
          <Card 
            key={session.id} 
            className="card-hover overflow-hidden cursor-pointer"
            onClick={() => handleViewSession(session)}
          >
            <img
              src={session.imageUrl || 'https://mgx-backend-cdn.metadl.com/generate/images/924660/2026-01-22/36f0a43c-5afe-42bf-8fef-68eef36ee9ec.png'}
              alt={session.title}
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{session.title}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {session.sport}
                  </Badge>
                </div>
                <Badge className={
                  session.difficulty === 'Beginner' ? 'bg-green-500' :
                  session.difficulty === 'Intermediate' ? 'bg-yellow-500' :
                  'bg-red-500'
                }>
                  {session.difficulty}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {session.description}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{session.startTime} - {session.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{session.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{session.bookedCount}/{session.capacity} spots filled</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <img
                  src={session.coachAvatar}
                  alt={session.coachName}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{session.coachName}</p>
                  <p className="text-xs text-muted-foreground">Instructor</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-lg font-bold text-primary-600">${session.price}</span>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewSession(session);
                  }}
                  disabled={session.bookedCount >= session.capacity}
                >
                  {session.bookedCount >= session.capacity ? 'Full' : 'View Details'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No sessions found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters to see more results
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </CardContent>
        </Card>
      )}

      {/* Session Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
            <DialogDescription>
              Complete information about this session
            </DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <img
                src={selectedSession.imageUrl}
                alt={selectedSession.title}
                className="w-full h-48 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold">{selectedSession.title}</h3>
                <Badge className="mt-2">{selectedSession.sport}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{selectedSession.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Date & Time</p>
                  <p className="font-medium">{selectedSession.date} at {selectedSession.startTime} - {selectedSession.endTime}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedSession.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Instructor</p>
                  <p className="font-medium">{selectedSession.coachName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Difficulty</p>
                  <p className="font-medium">{selectedSession.difficulty}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Capacity</p>
                  <p className="font-medium">{selectedSession.bookedCount}/{selectedSession.capacity} spots filled</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-medium text-primary-600">${selectedSession.price}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
            <Button onClick={handleBookSession}>
              Book Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Confirmation Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              Review your session details before confirming
            </DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-4">
                <img
                  src={selectedSession.imageUrl}
                  alt={selectedSession.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{selectedSession.title}</h4>
                  <Badge variant="secondary" className="mt-1">
                    {selectedSession.sport}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-medium">
                    {selectedSession.date} at {selectedSession.startTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{selectedSession.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instructor</span>
                  <span className="font-medium">{selectedSession.coachName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty</span>
                  <span className="font-medium">{selectedSession.difficulty}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Total Amount</span>
                  <span className="font-bold text-primary-600 text-lg">
                    ${selectedSession.price}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBooking}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}