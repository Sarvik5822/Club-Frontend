import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Clock,
  MapPin,
  User,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { mockSessions } from '@/lib/mockData';
import { toast } from 'sonner';

export default function Schedule() {
  const [view, setView] = useState('week');
  const [currentDate, setCurrentDate] = useState(
    new Date(2026, 0, 23)
  );
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isPastSession, setIsPastSession] = useState(false);

  const mySchedule = mockSessions.slice(0, 4);

  const pastSessions = [
    {
      id: 'past1',
      title: 'HIIT Training',
      date: '2026-01-20',
      sport: 'Fitness',
      status: 'completed',
    },
    {
      id: 'past2',
      title: 'Yoga Flow',
      date: '2026-01-19',
      sport: 'Yoga',
      status: 'completed',
    },
    {
      id: 'past3',
      title: 'Swimming',
      date: '2026-01-18',
      sport: 'Swimming',
      status: 'completed',
    },
  ];

  const handleCancel = (sessionId, title) => {
    toast.success(`Cancelled: ${title}`);
    setShowDetailModal(false);
  };

  const handleViewDetails = (
    session,
    isPast = false
  ) => {
    setSelectedSession(session);
    setIsPastSession(isPast);
    setShowDetailModal(true);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      )
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      )
    );
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);

  const getDuration = (startTime, endTime) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    return endH * 60 + endM - (startH * 60 + startM);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Full Schedule</h1>
          <p className="text-muted-foreground">
            View and manage your booked sessions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            onClick={() => setView('week')}
          >
            Week
          </Button>
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            onClick={() => setView('month')}
          >
            Month
          </Button>
        </div>
      </div>

      {/* CALENDAR */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Calendar View</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardDescription className="min-w-[150px] text-center">
                {currentDate.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </CardDescription>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
              (day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold p-2"
                >
                  {day}
                </div>
              )
            )}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="aspect-square p-2 border rounded-lg bg-muted"
              />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const hasSession = [23, 24, 25].includes(day);

              return (
                <div
                  key={day}
                  className={`aspect-square p-2 border rounded-lg text-center hover:bg-accent cursor-pointer ${
                    hasSession
                      ? 'bg-primary/10 border-primary'
                      : ''
                  }`}
                >
                  <div className="text-sm font-medium">{day}</div>
                  {hasSession && (
                    <div className="text-xs text-primary mt-1">
                      •
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* UPCOMING */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>
            Your booked classes and activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mySchedule.map((session) => (
            <div
              key={session.id}
              className="flex gap-4 p-4 border rounded-lg"
            >
              <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-primary/10">
                <span className="text-xs font-semibold">
                  {session.date.split('-')[2]}
                </span>
                <span className="text-xs">Jan</span>
              </div>

              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-lg">
                  {session.title}
                </h3>
                <Badge variant="outline">{session.sport}</Badge>

                <div className="grid gap-2 md:grid-cols-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {session.startTime} (
                    {getDuration(
                      session.startTime,
                      session.endTime
                    )}{' '}
                    min)
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {session.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {session.coachName}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewDetails(session)}
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    handleCancel(session.id, session.title)
                  }
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PAST */}
      <Card>
        <CardHeader>
          <CardTitle>Past Sessions</CardTitle>
          <CardDescription>
            Your completed activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {pastSessions.map((session) => (
            <div
              key={session.id}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">
                  {session.title} - {session.date}
                </p>
                <p className="text-xs text-muted-foreground">
                  Completed • {session.sport}
                </p>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  const fullSession = mockSessions[0];
                  handleViewDetails(
                    {
                      ...fullSession,
                      ...session,
                      status: 'completed',
                    },
                    true
                  );
                }}
              >
                View
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* MODAL */}
      <Dialog
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
            <DialogDescription>
              {isPastSession
                ? 'Completed session information'
                : 'Upcoming session information'}
            </DialogDescription>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedSession.title}</h3>
                <Badge variant="outline" className="mt-2">{selectedSession.sport}</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedSession.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedSession.startTime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedSession.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Coach</p>
                  <p className="font-medium">{selectedSession.coachName}</p>
                </div>
              </div>

              {selectedSession.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{selectedSession.description}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDetailModal(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}