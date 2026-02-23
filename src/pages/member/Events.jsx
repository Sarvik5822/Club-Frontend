import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Calendar, MapPin, Users, Trophy, BookOpen, Clock, Globe, IndianRupee, Search, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import memberService from '@/services/memberService';

export default function Events() {
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.type && filters.type !== 'all') params.type = filters.type;

      const response = await memberService.getEvents(params);
      setEvents(response.data?.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch events',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      setRegistering(eventId);
      await memberService.registerForEvent(eventId);
      toast({
        title: 'Success',
        description: 'Successfully registered for the event!',
      });
      fetchEvents();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to register for event',
        variant: 'destructive',
      });
    } finally {
      setRegistering(null);
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      setRegistering(eventId);
      await memberService.unregisterFromEvent(eventId);
      toast({
        title: 'Success',
        description: 'Successfully unregistered from the event',
      });
      fetchEvents();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to unregister from event',
        variant: 'destructive',
      });
    } finally {
      setRegistering(null);
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const isRegistered = (event) => {
    return event.isRegistered || false;
  };

  const getParticipantCount = (event) => {
    return event.registration?.currentParticipants || event.participants?.length || 0;
  };

  const getMaxParticipants = (event) => {
    return event.registration?.maxParticipants || 0;
  };

  const isFull = (event) => {
    const current = getParticipantCount(event);
    const max = getMaxParticipants(event);
    return max > 0 && current >= max;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'tournament':
      case 'competition':
        return <Trophy className="h-3 w-3 mr-1" />;
      case 'workshop':
      case 'seminar':
        return <BookOpen className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Events & Tournaments</h1>
        <p className="text-muted-foreground mt-1">Participate in sports events, tournaments, and workshops</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Search events..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters({ ...filters, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="seminar">Seminar</SelectItem>
                  <SelectItem value="tournament">Tournament</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="fitness_challenge">Fitness Challenge</SelectItem>
                  <SelectItem value="open_day">Open Day</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No upcoming events found</p>
              <p className="text-sm text-muted-foreground mt-1">Check back later for new events</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <Card key={event._id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge>
                              {getTypeIcon(event.type)}
                              {(event.type || '').replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className="capitalize">{event.category}</Badge>
                            {event.pricing && !event.pricing.isFree && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <IndianRupee className="h-3 w-3 mr-1" />
                                ₹{event.pricing.memberPrice}
                              </Badge>
                            )}
                            {event.pricing?.isFree && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Free
                              </Badge>
                            )}
                            {event.location?.isOnline && (
                              <Badge variant="outline" className="text-blue-600 border-blue-600">
                                <Globe className="h-3 w-3 mr-1" />
                                Online
                              </Badge>
                            )}
                          </div>
                        </div>
                        {isRegistered(event) && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 flex-shrink-0">
                            Registered
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(event.startDate)}</span>
                        </div>
                        {event.startTime && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}</span>
                          </div>
                        )}
                        {event.location?.isOnline ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            <span>Online Event</span>
                          </div>
                        ) : event.location?.venue ? (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location.venue}{event.location.city ? `, ${event.location.city}` : ''}</span>
                          </div>
                        ) : null}
                        {getMaxParticipants(event) > 0 && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{getParticipantCount(event)}/{getMaxParticipants(event)} registered</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {event.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        {isRegistered(event) ? (
                          <Button
                            variant="outline"
                            onClick={() => handleUnregister(event._id)}
                            disabled={registering === event._id}
                          >
                            {registering === event._id ? 'Processing...' : 'Unregister'}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleRegister(event._id)}
                            disabled={isFull(event) || registering === event._id}
                          >
                            {registering === event._id ? 'Processing...' : isFull(event) ? 'Full' : 'Register Now'}
                          </Button>
                        )}
                        <Button variant="outline" onClick={() => handleViewDetails(event)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Registered Events */}
      <Card>
        <CardHeader>
          <CardTitle>My Registered Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events
              .filter((e) => isRegistered(e))
              .map((event) => (
                <div
                  key={event._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(event.startDate)}{event.startTime ? ` at ${event.startTime}` : ''}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Registered
                  </Badge>
                </div>
              ))}
            {events.filter((e) => isRegistered(e)).length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No registered events. Browse and register for upcoming events above.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>
              Complete information about this event
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge>
                    {getTypeIcon(selectedEvent.type)}
                    {(selectedEvent.type || '').replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className="capitalize">{selectedEvent.category}</Badge>
                  {selectedEvent.location?.isOnline && (
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      <Globe className="h-3 w-3 mr-1" />
                      Online
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {formatDate(selectedEvent.startDate)}
                    {selectedEvent.endDate && selectedEvent.endDate !== selectedEvent.startDate && (
                      <> - {formatDate(selectedEvent.endDate)}</>
                    )}
                  </p>
                </div>
                {selectedEvent.startTime && (
                  <div>
                    <p className="text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {selectedEvent.startTime}{selectedEvent.endTime ? ` - ${selectedEvent.endTime}` : ''}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Location</p>
                  {selectedEvent.location?.isOnline ? (
                    <p className="font-medium">Online Event</p>
                  ) : (
                    <p className="font-medium">
                      {selectedEvent.location?.venue || 'TBA'}
                      {selectedEvent.location?.city ? `, ${selectedEvent.location.city}` : ''}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground">Participants</p>
                  <p className="font-medium">
                    {getParticipantCount(selectedEvent)}/{getMaxParticipants(selectedEvent)} registered
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pricing</p>
                  {selectedEvent.pricing?.isFree ? (
                    <p className="font-medium text-green-600">Free</p>
                  ) : (
                    <p className="font-medium">₹{selectedEvent.pricing?.memberPrice || 0} (Member)</p>
                  )}
                </div>
                {selectedEvent.registration?.registrationDeadline && (
                  <div>
                    <p className="text-muted-foreground">Registration Deadline</p>
                    <p className="font-medium">{formatDate(selectedEvent.registration.registrationDeadline)}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">{isRegistered(selectedEvent) ? 'Registered' : 'Not Registered'}</p>
                </div>
              </div>

              {/* Early bird info */}
              {selectedEvent.pricing && !selectedEvent.pricing.isFree && selectedEvent.pricing.earlyBirdPrice > 0 && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    🐦 Early Bird Price: ₹{selectedEvent.pricing.earlyBirdPrice}
                    {selectedEvent.pricing.earlyBirdDeadline && (
                      <> (until {formatDate(selectedEvent.pricing.earlyBirdDeadline)})</>
                    )}
                  </p>
                </div>
              )}

              {/* Tags */}
              {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedEvent.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
            {selectedEvent && (
              isRegistered(selectedEvent) ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    handleUnregister(selectedEvent._id);
                    setShowDetailModal(false);
                  }}
                >
                  Unregister
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    handleRegister(selectedEvent._id);
                    setShowDetailModal(false);
                  }}
                  disabled={isFull(selectedEvent)}
                >
                  {isFull(selectedEvent) ? 'Event Full' : 'Register Now'}
                </Button>
              )
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}