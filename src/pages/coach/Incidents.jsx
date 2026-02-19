import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, Clock, User, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function IncidentReports() {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const incidents = [
    {
      id: 1,
      type: 'Injury',
      severity: 'Minor',
      member: 'John Doe',
      session: 'Morning Yoga Flow',
      date: '2026-01-20',
      time: '07:30',
      description: 'Member experienced minor muscle strain during stretching exercise.',
      action: 'Applied ice, advised rest for 24 hours',
      status: 'Resolved',
      followUps: [
        { date: '2026-01-21', note: 'Member reported feeling better, resumed light activities' }
      ]
    },
    {
      id: 2,
      type: 'Equipment',
      severity: 'Medium',
      member: 'N/A',
      session: 'Advanced Swimming',
      date: '2026-01-18',
      time: '09:15',
      description: 'Pool lane divider came loose during session.',
      action: 'Session moved to different lanes, maintenance notified',
      status: 'In Progress',
      followUps: []
    },
  ];

  const handleSubmitReport = () => {
    toast.success('Incident report submitted successfully');
    setShowReportModal(false);
  };

  const handleViewDetails = (incident) => {
    setSelectedIncident(incident);
    setShowViewModal(true);
  };

  const handleAddFollowUp = (incident) => {
    setSelectedIncident(incident);
    setShowFollowUpModal(true);
  };

  const handleSubmitFollowUp = () => {
    toast.success('Follow-up added successfully');
    setShowFollowUpModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Incident Reports</h1>
          <p className="text-muted-foreground mt-1">Report and track safety incidents and injuries</p>
        </div>
        <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Report Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Report New Incident</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Incident Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="injury">Injury</SelectItem>
                      <SelectItem value="equipment">Equipment Issue</SelectItem>
                      <SelectItem value="facility">Facility Issue</SelectItem>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Session/Location</Label>
                <Input placeholder="e.g., Morning Yoga Flow - Studio A" />
              </div>

              <div className="space-y-2">
                <Label>Member Involved (if applicable)</Label>
                <Input placeholder="Member name or ID" />
              </div>

              <div className="space-y-2">
                <Label>Incident Description</Label>
                <Textarea
                  placeholder="Describe what happened in detail..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Immediate Action Taken</Label>
                <Textarea
                  placeholder="Describe the immediate response and actions taken..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Witnesses (if any)</Label>
                <Input placeholder="Names of witnesses" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="medicalAttention" className="rounded" />
                <Label htmlFor="medicalAttention" className="text-sm">
                  Medical attention was required
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="notifyAdmin" className="rounded" />
                <Label htmlFor="notifyAdmin" className="text-sm">
                  Notify admin immediately
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReportModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReport}>Submit Report</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Incidents</p>
                <p className="text-2xl font-bold mt-1">12</p>
              </div>
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold mt-1">2</p>
              </div>
              <div className="p-3 rounded-full bg-warning/10">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold mt-1">10</p>
              </div>
              <div className="p-3 rounded-full bg-success/10">
                <FileText className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold mt-1">2</p>
              </div>
              <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
                <Clock className="h-5 w-5 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incident List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="p-4 border rounded-lg hover:border-primary-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{incident.type} Incident</h4>
                      <Badge
                        variant={
                          incident.severity === 'Critical' ? 'destructive' :
                          incident.severity === 'Major' ? 'destructive' :
                          incident.severity === 'Medium' ? 'secondary' :
                          'default'
                        }
                      >
                        {incident.severity}
                      </Badge>
                      <Badge
                        variant={incident.status === 'Resolved' ? 'default' : 'secondary'}
                      >
                        {incident.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {incident.session}
                    </p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {incident.date} at {incident.time}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {incident.member !== 'N/A' && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Member:</span>
                      <span className="font-medium">{incident.member}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground mb-1">Description:</p>
                    <p>{incident.description}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Action Taken:</p>
                    <p>{incident.action}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button size="sm" variant="outline" onClick={() => handleViewDetails(incident)}>
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddFollowUp(incident)}>
                    Add Follow-up
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Details Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Incident Details</DialogTitle>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{selectedIncident.type} Incident</h3>
                <Badge variant={selectedIncident.status === 'Resolved' ? 'default' : 'secondary'}>
                  {selectedIncident.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">{selectedIncident.date} at {selectedIncident.time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Severity</p>
                  <Badge variant={selectedIncident.severity === 'Critical' ? 'destructive' : 'default'}>
                    {selectedIncident.severity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedIncident.session}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member</p>
                  <p className="font-medium">{selectedIncident.member}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm">{selectedIncident.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Action Taken</h4>
                <p className="text-sm">{selectedIncident.action}</p>
              </div>

              {selectedIncident.followUps && selectedIncident.followUps.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Follow-ups</h4>
                  <div className="space-y-2">
                    {selectedIncident.followUps.map((followUp, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">{followUp.date}</p>
                        <p className="text-sm mt-1">{followUp.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Follow-up Modal */}
      <Dialog open={showFollowUpModal} onOpenChange={setShowFollowUpModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Follow-up</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Follow-up Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Follow-up Notes</Label>
              <Textarea
                placeholder="Describe the follow-up action or update..."
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="markResolved" className="rounded" />
              <Label htmlFor="markResolved" className="text-sm">
                Mark incident as resolved
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFollowUpModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitFollowUp}>Add Follow-up</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Safety Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">When to Report</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Any injury, regardless of severity</li>
                <li>• Equipment malfunction or damage</li>
                <li>• Facility safety concerns</li>
                <li>• Member behavioral issues</li>
                <li>• Near-miss incidents</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Immediate Actions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ensure member safety first</li>
                <li>• Provide first aid if trained</li>
                <li>• Call emergency services if needed</li>
                <li>• Secure the area</li>
                <li>• Document everything immediately</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}