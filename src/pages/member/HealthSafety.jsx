import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Shield, Upload, FileText, AlertCircle, CheckCircle, Phone, User } from 'lucide-react';
import { toast } from 'sonner';

export default function HealthSafety() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showWaiverModal, setShowWaiverModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const [emergencyContacts, setEmergencyContacts] = useState([
    {
      id: 1,
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1234567899',
      isPrimary: true,
    },
    {
      id: 2,
      name: 'John Smith',
      relationship: 'Brother',
      phone: '+1234567888',
      isPrimary: false,
    },
  ]);

  const healthDocuments = [
    {
      id: 1,
      name: 'Medical Certificate',
      type: 'Medical',
      uploadDate: '2026-01-15',
      expiryDate: '2026-12-31',
      status: 'valid',
      fileUrl: '#',
    },
    {
      id: 2,
      name: 'Fitness Assessment',
      type: 'Fitness',
      uploadDate: '2026-01-10',
      expiryDate: '2026-06-30',
      status: 'expiring-soon',
      fileUrl: '#',
    },
  ];

  const waiverStatus = {
    signed: true,
    signedDate: '2026-01-15',
    version: '2.0',
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    toast.success('Document uploaded successfully');
    setShowUploadModal(false);
    setSelectedFile(null);
  };

  const handleSignWaiver = () => {
    toast.success('Liability waiver signed successfully');
    setShowWaiverModal(false);
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newContact = {
      id: emergencyContacts.length + 1,
      name: formData.get('name'),
      relationship: formData.get('relationship'),
      phone: formData.get('phone'),
      isPrimary: formData.get('isPrimary') === 'on',
    };
    setEmergencyContacts([...emergencyContacts, newContact]);
    toast.success('Emergency contact added successfully');
    setShowAddContactModal(false);
  };

  const handleEditContact = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedContacts = emergencyContacts.map(contact => 
      contact.id === editingContact.id 
        ? {
            ...contact,
            name: formData.get('name'),
            relationship: formData.get('relationship'),
            phone: formData.get('phone'),
            isPrimary: formData.get('isPrimary') === 'on',
          }
        : contact
    );
    setEmergencyContacts(updatedContacts);
    toast.success('Emergency contact updated successfully');
    setShowEditContactModal(false);
    setEditingContact(null);
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setShowEditContactModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Health & Safety</h1>
        <p className="text-muted-foreground mt-1">Manage your health documents and safety information</p>
      </div>

      {/* Health Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Medical Documents
          </CardTitle>
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {healthDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{doc.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Type: {doc.type} • Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      doc.status === 'valid' ? 'default' :
                      doc.status === 'expiring-soon' ? 'secondary' :
                      'destructive'
                    }
                    className={
                      doc.status === 'valid' ? 'bg-green-500' :
                      doc.status === 'expiring-soon' ? 'bg-yellow-500' :
                      ''
                    }
                  >
                    {doc.status === 'valid' ? 'Valid' :
                     doc.status === 'expiring-soon' ? 'Expiring Soon' :
                     'Expired'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liability Waiver */}
      <Card className={waiverStatus.signed ? 'border-green-500' : 'border-amber-500'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Liability Waiver
          </CardTitle>
        </CardHeader>
        <CardContent>
          {waiverStatus.signed ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100">
                    Waiver Signed
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Signed on {new Date(waiverStatus.signedDate).toLocaleDateString()} • Version {waiverStatus.version}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setShowWaiverModal(true)}>
                View Waiver Details
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                <AlertCircle className="h-6 w-6 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-100">
                    Action Required
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Please review and sign the liability waiver to continue using our facilities
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowWaiverModal(true)}>
                Review & Sign Waiver
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Contacts
          </CardTitle>
          <Button variant="outline" onClick={() => setShowAddContactModal(true)}>
            <User className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{contact.name}</h4>
                      {contact.isPrimary && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {contact.relationship} • {contact.phone}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => openEditModal(contact)}>
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Document Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Medical Document</DialogTitle>
            <DialogDescription>
              Upload your medical certificate or fitness assessment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="docType">Document Type</Label>
              <select id="docType" className="w-full p-2 border rounded-md">
                <option value="">Select type...</option>
                <option value="medical">Medical Certificate</option>
                <option value="fitness">Fitness Assessment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Select File</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this document"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Waiver Modal */}
      <Dialog open={showWaiverModal} onOpenChange={setShowWaiverModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Liability Waiver & Release Form</DialogTitle>
            <DialogDescription>
              Please read carefully and sign to acknowledge
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 border rounded-lg space-y-3 text-sm">
              <p className="font-semibold">ASSUMPTION OF RISK AND WAIVER OF LIABILITY</p>
              <p>
                I acknowledge that participation in sports and fitness activities involves inherent risks,
                including but not limited to physical injury, illness, or property damage. I voluntarily
                assume all such risks associated with my participation.
              </p>
              <p>
                I hereby release, waive, and discharge the facility, its owners, employees, and agents
                from any and all liability for injuries or damages that may occur during my use of the
                facilities or participation in activities.
              </p>
              <p>
                I certify that I am in good physical condition and have no medical conditions that would
                prevent safe participation in physical activities. I agree to follow all facility rules
                and safety guidelines.
              </p>
              <p className="text-muted-foreground italic">
                Version 2.0 • Last Updated: January 1, 2026
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWaiverModal(false)}>
              {waiverStatus.signed ? 'Close' : 'Cancel'}
            </Button>
            {!waiverStatus.signed && (
              <Button onClick={handleSignWaiver}>
                I Agree & Sign
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Contact Modal */}
      <Dialog open={showAddContactModal} onOpenChange={setShowAddContactModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Emergency Contact</DialogTitle>
            <DialogDescription>
              Add a new emergency contact person
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddContact}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Full Name</Label>
                <Input id="add-name" name="name" placeholder="Jane Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-relationship">Relationship</Label>
                <Input id="add-relationship" name="relationship" placeholder="Spouse" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-phone">Phone Number</Label>
                <Input id="add-phone" name="phone" type="tel" placeholder="+1234567890" required />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="add-isPrimary" name="isPrimary" className="rounded" />
                <Label htmlFor="add-isPrimary" className="text-sm">
                  Set as primary contact
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddContactModal(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Contact
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Modal */}
      <Dialog open={showEditContactModal} onOpenChange={setShowEditContactModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Emergency Contact</DialogTitle>
            <DialogDescription>
              Update emergency contact information
            </DialogDescription>
          </DialogHeader>
          {editingContact && (
            <form onSubmit={handleEditContact}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input id="edit-name" name="name" defaultValue={editingContact.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-relationship">Relationship</Label>
                  <Input id="edit-relationship" name="relationship" defaultValue={editingContact.relationship} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input id="edit-phone" name="phone" type="tel" defaultValue={editingContact.phone} required />
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="edit-isPrimary" 
                    name="isPrimary" 
                    className="rounded" 
                    defaultChecked={editingContact.isPrimary}
                  />
                  <Label htmlFor="edit-isPrimary" className="text-sm">
                    Set as primary contact
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowEditContactModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}