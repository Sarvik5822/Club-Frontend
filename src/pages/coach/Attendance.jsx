import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, CheckCircle2, XCircle, Clock, Users } from 'lucide-react';
import { mockSessions, mockMembers } from '@/lib/mockData';
import { toast } from 'sonner';

export default function CoachAttendance() {
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [notes, setNotes] = useState({});

  const todaySessions = mockSessions.filter(s => s.date === '2026-01-23');
  const sessionParticipants = mockMembers.slice(0, 5);

  const handleMarkAttendance = () => {
    toast.success('Attendance marked successfully!');
  };

  const toggleAttendance = (memberId) => {
    setAttendance(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance Tracking</h1>
        <p className="text-muted-foreground mt-1">Mark attendance for your sessions</p>
      </div>

      {/* Today's Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <p>{"Today's Sessions"}</p>
          </CardTitle>
          <CardDescription>Select a session to mark attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todaySessions.map((session) => (
              <Card
                key={session.id}
                className={`cursor-pointer transition-all ${
                  selectedSession === session.id
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950'
                    : 'hover:border-primary-300'
                }`}
                onClick={() => setSelectedSession(session.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{session.title}</h4>
                      <Badge className="mt-1">{session.sport}</Badge>
                    </div>
                    {selectedSession === session.id && (
                      <CheckCircle2 className="h-5 w-5 text-primary-600" />
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{session.startTime} - {session.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      <span>{session.bookedCount} participants</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mark Attendance */}
      {selectedSession && (
        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
            <CardDescription>Check participants who attended the session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {sessionParticipants.map((member) => (
                <div key={member.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <Checkbox
                    id={`attendance-${member.id}`}
                    checked={attendance[member.id] || false}
                    onCheckedChange={() => toggleAttendance(member.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <label
                          htmlFor={`attendance-${member.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {member.name}
                        </label>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label htmlFor={`notes-${member.id}`} className="text-sm">
                        Performance Notes (Optional)
                      </Label>
                      <Textarea
                        id={`notes-${member.id}`}
                        placeholder="Add notes about performance, progress, or areas for improvement..."
                        rows={2}
                        className="mt-1"
                        value={notes[member.id] || ''}
                        onChange={(e) => setNotes(prev => ({ ...prev, [member.id]: e.target.value }))}
                      />
                    </div>
                  </div>
                  {attendance[member.id] ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleMarkAttendance}>Save Attendance</Button>
              <Button variant="outline">Save as Draft</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { session: 'Morning Yoga Flow', date: '2026-01-22', present: 18, total: 20 },
              { session: 'Advanced Swimming', date: '2026-01-21', present: 10, total: 12 },
              { session: 'Pilates Core', date: '2026-01-20', present: 14, total: 15 },
            ].map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{record.session}</p>
                  <p className="text-sm text-muted-foreground">{record.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{record.present}/{record.total}</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((record.present / record.total) * 100)}% attendance
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}