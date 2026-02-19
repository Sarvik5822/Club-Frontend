import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, TrendingUp, Calendar, Activity, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { mockMembers } from '../../lib/mockData';

export default function MemberDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const member = mockMembers.find(m => m.id === id) || mockMembers[0];

  const performanceData = [
    { date: '2026-01-15', metric: 'Weight', value: 78 },
    { date: '2026-01-16', metric: 'Weight', value: 77.5 },
    { date: '2026-01-17', metric: 'Weight', value: 77 },
    { date: '2026-01-18', metric: 'Weight', value: 76.5 },
  ];

  const notes = [
    { date: '2026-01-20', content: 'Great progress on strength training. Increased weights by 10%.', author: 'Sarah Johnson' },
    { date: '2026-01-18', content: 'Member showed excellent form during squats. Ready to progress to next level.', author: 'Sarah Johnson' },
  ];

  const recentVisits = [
    { date: '2026-01-23', checkIn: '07:30 AM', checkOut: '09:15 AM', duration: '1h 45m' },
    { date: '2026-01-22', checkIn: '06:45 AM', checkOut: '08:30 AM', duration: '1h 45m' },
    { date: '2026-01-20', checkIn: '07:00 AM', checkOut: '09:00 AM', duration: '2h 00m' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/coach/members')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Member Details</h1>
          <p className="text-muted-foreground mt-1">View member performance and training history</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-24 h-24 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{member.name}</h2>
                  <p className="text-muted-foreground">{member.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">{member.phone}</p>
                </div>
                <Badge className="text-lg px-4 py-1">{member.membershipType}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-semibold">{new Date(member.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Visits</p>
                  <p className="font-semibold">48</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="font-semibold text-success">12 visits</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Visit History</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="notes">Training Notes</TabsTrigger>
          <TabsTrigger value="health">Health Info</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold mt-1">12</p>
                    <p className="text-xs text-muted-foreground mt-1">Visits completed</p>
                  </div>
                  <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
                    <Calendar className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Weight Progress</p>
                    <p className="text-2xl font-bold mt-1">-5 kg</p>
                    <p className="text-xs text-success mt-1">Goal: -10 kg</p>
                  </div>
                  <div className="p-3 rounded-full bg-success/10">
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-2xl font-bold mt-1">8 days</p>
                    <p className="text-xs text-muted-foreground mt-1">Personal best!</p>
                  </div>
                  <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                    <Activity className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Recent Visit History (Read-Only)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentVisits.map((visit, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{visit.date}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Check-in: {visit.checkIn}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Check-out: {visit.checkOut}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{visit.duration}</p>
                      <p className="text-sm text-muted-foreground">Duration</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{data.metric}</p>
                      <p className="text-sm text-muted-foreground">{data.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{data.value} kg</p>
                      {index > 0 && (
                        <p className="text-sm text-success">
                          -{(performanceData[index - 1].value - data.value).toFixed(1)} kg
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Training Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea placeholder="Add a new training note..." rows={3} />
                <Button className="mt-2" onClick={() => toast.success('Note added successfully')}>
                  Add Note
                </Button>
              </div>
              <div className="space-y-3 pt-4 border-t">
                {notes.map((note, index) => (
                  <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-sm">{note.author}</p>
                      <p className="text-xs text-muted-foreground">{note.date}</p>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Health Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Height</p>
                  <p className="font-semibold">{member.healthInfo?.height || 'N/A'} cm</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-semibold">{member.healthInfo?.weight || 'N/A'} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Type</p>
                  <p className="font-semibold">{member.healthInfo?.bloodType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Allergies</p>
                  <p className="font-semibold">{member.healthInfo?.allergies?.join(', ') || 'None'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Emergency Contact</p>
                  {member.emergencyContact ? (
                    <div>
                      <p className="font-semibold">
                        {member.emergencyContact.name} ({member.emergencyContact.relationship}): {member.emergencyContact.phone}
                      </p>
                    </div>
                  ) : (
                    <p className="font-semibold">N/A</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}