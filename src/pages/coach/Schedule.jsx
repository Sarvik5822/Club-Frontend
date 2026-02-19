import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, MapPin } from 'lucide-react';
import { mockSessions } from '@/lib/mockData';

export default function CoachSchedule() {
  const mySessions = mockSessions;

  // Helper to calculate duration in minutes
  const getDuration = (startTime, endTime) => {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    return (eh * 60 + em) - (sh * 60 + sm);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Schedule</h1>
          <p className="text-muted-foreground">Manage your coaching sessions and availability</p>
        </div>
        <Button>Set Availability</Button>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>January 22-28, 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-2">
            <div className="col-span-1"></div>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="text-center font-semibold text-sm p-2">{day}</div>
            ))}

            {['06:00', '09:00', '12:00', '15:00', '18:00', '21:00'].map((time) => (
              <div key={time} className="contents">
                <div className="text-xs text-muted-foreground p-2">{time}</div>
                {Array.from({ length: 7 }, (_, i) => (
                  <div
                    key={`${time}-${i}`}
                    className="border rounded p-2 min-h-[60px] hover:bg-accent cursor-pointer"
                  >
                    {/* Example booked sessions */}
                    {(time === '09:00' && i === 1) && (
                      <div className="text-xs bg-primary text-primary-foreground rounded p-1">
                        <p className="font-semibold">Yoga Flow</p>
                        <p>15/20 enrolled</p>
                      </div>
                    )}
                    {(time === '18:00' && i === 1) && (
                      <div className="text-xs bg-accent text-accent-foreground rounded p-1">
                        <p className="font-semibold">HIIT Training</p>
                        <p>12/15 enrolled</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session List */}
      <Card>
        <CardHeader>
          <CardTitle>All Sessions</CardTitle>
          <CardDescription>Complete list of your coaching sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mySessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              {/* Date */}
              <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-primary/10 text-primary">
                <span className="text-xs font-semibold">{session.date.split('-')[2]}</span>
                <span className="text-xs">Jan</span>
              </div>

              {/* Session Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{session.title}</h3>
                  <Badge>{session.sport}</Badge>
                </div>

                <div className="grid gap-2 md:grid-cols-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {session.startTime} ({getDuration(session.startTime, session.endTime)} min)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{session.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{session.enrolled ?? 0}/{session.capacity} enrolled</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Edit</Button>
                <Button size="sm">View Details</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}