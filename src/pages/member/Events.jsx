import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Calendar, MapPin, Users, Trophy, BookOpen, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Annual Swimming Championship',
      type: 'Tournament',
      date: '2026-02-15',
      time: '09:00 AM',
      location: 'Pool 1',
      participants: 45,
      maxParticipants: 50,
      description: 'Annual swimming competition for all skill levels. Prizes for top 3 finishers in each category.',
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/924660/2026-01-22/95b292c3-03c8-46e0-b6fe-abaa4426ce3e.png',
      registered: false,
    },
    {
      id: 2,
      title: 'Yoga & Meditation Workshop',
      type: 'Workshop',
      date: '2026-02-08',
      time: '10:00 AM',
      location: 'Studio A',
      participants: 18,
      maxParticipants: 25,
      description: 'Learn advanced meditation techniques and deepen your yoga practice with expert guidance.',
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/924660/2026-01-22/36f0a43c-5afe-42bf-8fef-68eef36ee9ec.png',
      registered: true,
    },
    {
      id: 3,
      title: 'Martial Arts Demonstration',
      type: 'Event',
      date: '2026-02-20',
      time: '06:00 PM',
      location: 'Main Hall',
      participants: 32,
      maxParticipants: 100,
      description: 'Watch expert martial artists demonstrate various techniques and styles. Open to all members.',
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/924660/2026-01-22/cdd269bf-deb1-450d-ae90-b197f7184d6e.png',
      registered: false,
    },
    {
      id: 4,
      title: 'Nutrition & Fitness Seminar',
      type: 'Workshop',
      date: '2026-02-12',
      time: '02:00 PM',
      location: 'Conference Room',
      participants: 28,
      maxParticipants: 40,
      description: 'Expert nutritionist will discuss meal planning, supplements, and optimal nutrition for athletes.',
      image: 'https://mgx-backend-cdn.metadl.com/generate/images/924660/2026-01-22/cf7c9bab-6268-4340-8b47-f2195b32b430.png',
      registered: false,
    },
  ]);

  const handleRegister = (eventId) => {
    setEvents(events.map(e => 
      e.id === eventId ? { ...e, registered: true, participants: e.participants + 1 } : e
    ));
    const event = events.find(e => e.id === eventId);
    toast.success(`Successfully registered for ${event?.title}!`);
  };

  const handleUnregister = (eventId) => {
    setEvents(events.map(e => 
      e.id === eventId ? { ...e, registered: false, participants: e.participants - 1 } : e
    ));
    const event = events.find(e => e.id === eventId);
    toast.success(`Unregistered from ${event?.title}`);
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Events & Tournaments</h1>
        <p className="text-muted-foreground mt-1">Participate in sports events, tournaments, and workshops</p>
      </div>

      {/* Event Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden card-hover">
                <div className="flex flex-col md:flex-row">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full md:w-48 h-48 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <Badge className="mt-1">
                          {event.type === 'Tournament' && <Trophy className="h-3 w-3 mr-1" />}
                          {event.type === 'Workshop' && <BookOpen className="h-3 w-3 mr-1" />}
                          {event.type}
                        </Badge>
                      </div>
                      {event.registered && (
                        <Badge variant="secondary" className="bg-success/10 text-success">
                          Registered
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{event.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{event.participants}/{event.maxParticipants} registered</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      {event.registered ? (
                        <Button
                          variant="outline"
                          onClick={() => handleUnregister(event.id)}
                        >
                          Unregister
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleRegister(event.id)}
                          disabled={event.participants >= event.maxParticipants}
                        >
                          {event.participants >= event.maxParticipants ? 'Full' : 'Register Now'}
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
              .filter((e) => e.registered)
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                      <Calendar className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.date} at {event.time}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Registered
                  </Badge>
                </div>
              ))}
            {events.filter((e) => e.registered).length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No registered events. Browse and register for upcoming events above.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>
              Complete information about this event
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-48 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
                <Badge className="mt-2">
                  {selectedEvent.type === 'Tournament' && <Trophy className="h-3 w-3 mr-1" />}
                  {selectedEvent.type === 'Workshop' && <BookOpen className="h-3 w-3 mr-1" />}
                  {selectedEvent.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Date & Time</p>
                  <p className="font-medium">{selectedEvent.date} at {selectedEvent.time}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedEvent.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Participants</p>
                  <p className="font-medium">{selectedEvent.participants}/{selectedEvent.maxParticipants} registered</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">{selectedEvent.registered ? 'Registered' : 'Not Registered'}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Close
            </Button>
            {selectedEvent && (
              selectedEvent.registered ? (
                <Button 
                  variant="outline"
                  onClick={() => {
                    handleUnregister(selectedEvent.id);
                    setShowDetailModal(false);
                  }}
                >
                  Unregister
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    handleRegister(selectedEvent.id);
                    setShowDetailModal(false);
                  }}
                  disabled={selectedEvent.participants >= selectedEvent.maxParticipants}
                >
                  {selectedEvent.participants >= selectedEvent.maxParticipants ? 'Event Full' : 'Register Now'}
                </Button>
              )
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}