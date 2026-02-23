import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Shield, Upload, FileText, AlertCircle, CheckCircle, RefreshCw, Plus } from 'lucide-react';
import memberService from '@/services/memberService';
import { toast } from 'sonner';

export default function HealthSafety() {
  const [healthRecords, setHealthRecords] = useState([]);
  const [waiverData, setWaiverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showWaiverModal, setShowWaiverModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [acknowledging, setAcknowledging] = useState(false);

  const [uploadForm, setUploadForm] = useState({
    type: '',
    description: '',
    documentUrl: '',
    expiryDate: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordsRes, waiverRes] = await Promise.allSettled([
        memberService.getHealthRecords(),
        memberService.getWaivers(),
      ]);
      if (recordsRes.status === 'fulfilled') {
        setHealthRecords(recordsRes.value.data?.healthRecords || []);
      }
      if (waiverRes.status === 'fulfilled') {
        setWaiverData(waiverRes.value.data);
      }
    } catch (error) {
      toast.error('Failed to load health data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async () => {
    if (!uploadForm.type) { toast.error('Please select document type'); return; }
    if (!uploadForm.description.trim()) { toast.error('Please enter a description'); return; }
    try {
      setUploading(true);
      await memberService.uploadHealthRecord(uploadForm);
      toast.success('Health record uploaded successfully!');
      setShowUploadModal(false);
      setUploadForm({ type: '', description: '', documentUrl: '', expiryDate: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to upload record: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAcknowledgeWaiver = async () => {
    try {
      setAcknowledging(true);
      await memberService.acknowledgeWaiver({
        waiverId: 'standard-waiver-v2',
        signature: 'acknowledged',
      });
      toast.success('Liability waiver signed successfully!');
      setShowWaiverModal(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to sign waiver: ' + error.message);
    } finally {
      setAcknowledging(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved':
      case 'valid':
        return { label: 'Valid', class: 'bg-green-500 text-white' };
      case 'pending':
        return { label: 'Pending Review', class: 'bg-yellow-500 text-white' };
      case 'rejected':
      case 'expired':
        return { label: status === 'rejected' ? 'Rejected' : 'Expired', class: 'bg-red-500 text-white' };
      default:
        return { label: status, class: 'bg-gray-500 text-white' };
    }
  };

  const hasSignedWaiver = waiverData?.hasAcknowledged || (waiverData?.waivers && waiverData.waivers.length > 0);
  const latestWaiver = waiverData?.waivers?.[waiverData.waivers.length - 1];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health & Safety</h1>
          <p className="text-muted-foreground mt-1">Manage your health documents and safety information</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Health Records */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Medical Documents
          </CardTitle>
          <Button onClick={() => setShowUploadModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : healthRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-3" />
              <p>No health records uploaded yet</p>
              <Button className="mt-4" onClick={() => setShowUploadModal(true)}>
                Upload Your First Document
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {healthRecords.map((doc) => {
                const statusConfig = getStatusConfig(doc.status);
                return (
                  <div key={doc._id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold capitalize">{doc.type?.replace(/_/g, ' ')}</h4>
                        <p className="text-sm text-muted-foreground">{doc.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                          {doc.expiryDate && ` • Expires: ${new Date(doc.expiryDate).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={statusConfig.class}>{statusConfig.label}</Badge>
                      {doc.documentUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer">View</a>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liability Waiver */}
      <Card className={hasSignedWaiver ? 'border-green-500' : 'border-amber-500'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Liability Waiver
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-20 w-full rounded-lg" />
          ) : hasSignedWaiver ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100">Waiver Signed</p>
                  {latestWaiver && (
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Acknowledged on {new Date(latestWaiver.acknowledgedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={() => setShowWaiverModal(true)}>
                View Waiver Details
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-100">Action Required</p>
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

      {/* Upload Document Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Health Document</DialogTitle>
            <DialogDescription>Upload your medical certificate or fitness assessment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Document Type *</Label>
              <Select value={uploadForm.type} onValueChange={(v) => setUploadForm(p => ({ ...p, type: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical_certificate">Medical Certificate</SelectItem>
                  <SelectItem value="fitness_assessment">Fitness Assessment</SelectItem>
                  <SelectItem value="vaccination_record">Vaccination Record</SelectItem>
                  <SelectItem value="insurance">Insurance Document</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                placeholder="Describe this document..."
                rows={3}
                value={uploadForm.description}
                onChange={(e) => setUploadForm(p => ({ ...p, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Document URL</Label>
              <Input
                placeholder="https://... (link to your document)"
                value={uploadForm.documentUrl}
                onChange={(e) => setUploadForm(p => ({ ...p, documentUrl: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">Provide a link to the document (e.g., Google Drive, Dropbox)</p>
            </div>
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Input
                type="date"
                value={uploadForm.expiryDate}
                onChange={(e) => setUploadForm(p => ({ ...p, expiryDate: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>Cancel</Button>
            <Button onClick={handleUpload} disabled={uploading}>
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Waiver Modal */}
      <Dialog open={showWaiverModal} onOpenChange={setShowWaiverModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Liability Waiver & Release Form</DialogTitle>
            <DialogDescription>Please read carefully and sign to acknowledge</DialogDescription>
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
              {hasSignedWaiver ? 'Close' : 'Cancel'}
            </Button>
            {!hasSignedWaiver && (
              <Button onClick={handleAcknowledgeWaiver} disabled={acknowledging}>
                {acknowledging ? 'Signing...' : 'I Agree & Sign'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}