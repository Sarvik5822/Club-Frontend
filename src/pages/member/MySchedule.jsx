import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import { mockSessions, mockBookings } from '../../lib/mockData';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export default function MySchedule() {
  const { user } = useAuth();
  
  const userBookings = mockBookings.filter(b => b.memberId === user?.id);
  const bookedSessions = mockSessions.filter(s => 
    userBookings.some(b => b.sessionId === s.id)
  );

  const handleCancelBooking = (sessionId, sessionTitle) => {
    toast.success(`Booking for "${sessionTitle}" cancelled successfully`);
  };

  const groupedSessions = bookedSessions.reduce((acc, session) => {
    if (!acc[session.date]) {
      acc[session.date] = [];
    }
    acc[session.date].push(session);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Schedule</h1>
        <p className="text-muted-foreground mt-1">View and manage your booked sessions</p>
      </div>

      {Object.keys(groupedSessions).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedSessions).map(([date, sessions]) => (
            <Card key={date}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary-600 transition-colors"
                    >
                      <img
                        src={session.imageUrl || 'https://mgx-backend-cdn.metadl.com/generate/images/924660/2026-01-22/36f0a43c-5afe-42bf-8fef-68eef36ee9ec.png'}
                        alt={session.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{session.title}</h4>
                            <Badge className="mt-1">{session.sport}</Badge>
                          </div>
                          <Badge variant={session.status === 'scheduled' ? 'default' : 'secondary'}>
                            {session.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {session.startTime} - {session.endTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {session.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <img
                            src={session.coachAvatar}
                            alt={session.coachName}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm">Coach: {session.coachName}</span>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelBooking(session.id, session.title)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No sessions booked</h3>
            <p className="text-muted-foreground mb-4">Start booking sessions to see them here</p>
            <Button onClick={() => window.location.href = '/member/book-sessions'}>
              Browse Sessions
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}