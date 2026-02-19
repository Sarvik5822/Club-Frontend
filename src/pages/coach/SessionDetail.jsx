import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, MapPin, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockSessions, mockMembers } from '../../lib/mockData';
import { toast } from 'sonner';

export default function SessionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const session = mockSessions.find(s => s.id === id) || mockSessions[0];
  
  const [attendance, setAttendance] = useState({});
  const [notes, setNotes] = useState('');

  const participants = mockMembers.slice(0, session.bookedCount);

  const handleEndSession = () => {
    toast.success('Session ended successfully');
    navigate('/coach/schedule');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/coach/schedule')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Session Details</h1>
          <p className="text-muted-foreground mt-1">Manage session attendance and notes</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <img
              src={session.imageUrl || 'https://mgx-backend-cdn.metadl.com/generate/images/924660/2026-01-22/36f0a43c-5afe-42bf-8fef-68eef36ee9ec.png'}
              alt={session.title}
              className="w-32 h-32 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{session.title}</h2>
                  <Badge className="mt-2">{session.sport}</Badge>
                </div>
                <Badge variant={session.status === 'scheduled' ? 'default' : 'secondary'} className="text-lg px-4 py-1">
                  {session.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <div>
                    <p className="text-sm">Time</p>
                    <p className="font-semibold text-foreground">{session.startTime} - {session.endTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <div>
                    <p className="text-sm">Location</p>
                    <p className="font-semibold text-foreground">{session.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <div>
                    <p className="text-sm">Participants</p>
                    <p className="font-semibold text-foreground">{session.bookedCount}/{session.capacity}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Attendance</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const allChecked = Object.keys(attendance).length === participants.length;
                const newAttendance = {};
                participants.forEach(p => {
                  newAttendance[p.id] = !allChecked;
                });
                setAttendance(newAttendance);
              }}
            >
              {Object.keys(attendance).length === participants.length ? 'Unmark All' : 'Mark All'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:border-primary-600 transition-colors"
                >
                  <Checkbox
                    checked={attendance[participant.id] || false}
                    onCheckedChange={(checked) =>
                      setAttendance({ ...attendance, [participant.id]: checked })
                    }
                  />
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{participant.name}</p>
                    <p className="text-sm text-muted-foreground">{participant.email}</p>
                  </div>
                  {attendance[participant.id] && (
                    <CheckCircle className="h-5 w-5 text-success" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Add notes about this session..."
              rows={8}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => toast.success('Notes saved successfully')}
              >
                Save Notes
              </Button>
              <Button
                className="w-full"
                variant="destructive"
                onClick={handleEndSession}
              >
                End Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}