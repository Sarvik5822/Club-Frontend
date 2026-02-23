import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth';
import { User, Heart, Phone, FileText, Upload, Check, RefreshCw } from 'lucide-react';
import memberService from '@/services/memberService';
import { toast } from 'sonner';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);

  const [personalForm, setPersonalForm] = useState({
    name: '', email: '', phone: '', address: '',
  });
  const [healthForm, setHealthForm] = useState({
    height: '', weight: '', bloodType: '', allergies: '',
  });
  const [emergencyForm, setEmergencyForm] = useState({
    name: '', phone: '', relationship: '',
  });

  const avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
  ];

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await memberService.getProfile();
      const member = res.data?.member;
      setProfileData(member);
      if (member) {
        setPersonalForm({
          name: member.name || '',
          email: member.email || '',
          phone: member.phone || '',
          address: member.address || '',
        });
        setHealthForm({
          height: member.healthInfo?.height || '',
          weight: member.healthInfo?.weight || '',
          bloodType: member.healthInfo?.bloodType || '',
          allergies: member.healthInfo?.allergies || '',
        });
        setEmergencyForm({
          name: member.emergencyContact?.name || '',
          phone: member.emergencyContact?.phone || '',
          relationship: member.emergencyContact?.relationship || '',
        });
        setSelectedAvatar(member.profileImage || avatarOptions[0]);
      }
    } catch (error) {
      toast.error('Failed to load profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSavePersonal = async () => {
    try {
      setSaving(true);
      const res = await memberService.updateProfile(personalForm);
      const updatedMember = res.data?.member;
      if (updatedMember) {
        setProfileData(updatedMember);
        setPersonalForm({
          name: updatedMember.name || '',
          email: updatedMember.email || '',
          phone: updatedMember.phone || '',
          address: updatedMember.address || '',
        });
        updateUser({
          name: updatedMember.name,
          email: updatedMember.email,
          phone: updatedMember.phone,
          avatar: updatedMember.profileImage || updatedMember.avatar,
        });
      }
      toast.success('Personal information updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHealth = async () => {
    try {
      setSaving(true);
      const res = await memberService.updateProfile({ healthInfo: healthForm });
      const updatedMember = res.data?.member;
      if (updatedMember) {
        setProfileData(updatedMember);
        setHealthForm({
          height: updatedMember.healthInfo?.height || '',
          weight: updatedMember.healthInfo?.weight || '',
          bloodType: updatedMember.healthInfo?.bloodType || '',
          allergies: updatedMember.healthInfo?.allergies || '',
        });
      }
      toast.success('Health information updated successfully!');
    } catch (error) {
      toast.error('Failed to update health info: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmergency = async () => {
    try {
      setSaving(true);
      const res = await memberService.updateProfile({ emergencyContact: emergencyForm });
      const updatedMember = res.data?.member;
      if (updatedMember) {
        setProfileData(updatedMember);
        setEmergencyForm({
          name: updatedMember.emergencyContact?.name || '',
          phone: updatedMember.emergencyContact?.phone || '',
          relationship: updatedMember.emergencyContact?.relationship || '',
        });
      }
      toast.success('Emergency contact updated successfully!');
    } catch (error) {
      toast.error('Failed to update emergency contact: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAvatar = async () => {
    try {
      setSaving(true);
      const res = await memberService.updateProfile({ profileImage: selectedAvatar });
      const updatedMember = res.data?.member;
      if (updatedMember) {
        setProfileData(updatedMember);
        updateUser({ avatar: updatedMember.profileImage || selectedAvatar });
      }
      toast.success('Avatar updated successfully!');
      setShowAvatarModal(false);
    } catch (error) {
      toast.error('Failed to update avatar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setSelectedAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentAvatar = profileData?.profileImage || user?.avatar || avatarOptions[0];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-20 h-20 rounded-full" />
              <Skeleton className="h-9 w-32" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10" />)}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal information</p>
        </div>
        <Button variant="outline" onClick={fetchProfile} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Health
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Emergency
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={currentAvatar}
                  alt={profileData?.name || user?.name}
                  className="w-20 h-20 rounded-full border-2 border-border"
                  onError={(e) => { e.target.src = avatarOptions[0]; }}
                />
                <div>
                  <p className="font-semibold">{profileData?.name || user?.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{profileData?.role || 'Member'}</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                    setSelectedAvatar(currentAvatar);
                    setUploadedImage(null);
                    setShowAvatarModal(true);
                  }}>
                    Change Avatar
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={personalForm.name}
                    onChange={(e) => setPersonalForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalForm.email}
                    onChange={(e) => setPersonalForm(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={personalForm.phone}
                    onChange={(e) => setPersonalForm(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={personalForm.address}
                    onChange={(e) => setPersonalForm(p => ({ ...p, address: e.target.value }))}
                  />
                </div>
              </div>
              {profileData?.branch && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Branch: <span className="font-medium text-foreground">{profileData.branch?.name || profileData.branch}</span></p>
                </div>
              )}
              <Button onClick={handleSavePersonal} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Health Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="180"
                    value={healthForm.height}
                    onChange={(e) => setHealthForm(p => ({ ...p, height: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="75"
                    value={healthForm.weight}
                    onChange={(e) => setHealthForm(p => ({ ...p, weight: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Input
                    id="bloodType"
                    placeholder="O+"
                    value={healthForm.bloodType}
                    onChange={(e) => setHealthForm(p => ({ ...p, bloodType: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input
                    id="allergies"
                    placeholder="None"
                    value={healthForm.allergies}
                    onChange={(e) => setHealthForm(p => ({ ...p, allergies: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={handleSaveHealth} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyName">Contact Name</Label>
                  <Input
                    id="emergencyName"
                    placeholder="Jane Doe"
                    value={emergencyForm.name}
                    onChange={(e) => setEmergencyForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    placeholder="+1234567890"
                    value={emergencyForm.phone}
                    onChange={(e) => setEmergencyForm(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    placeholder="Spouse"
                    value={emergencyForm.relationship}
                    onChange={(e) => setEmergencyForm(p => ({ ...p, relationship: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={handleSaveEmergency} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload medical certificates, waivers, or other documents
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Go to <strong>Health &amp; Safety</strong> page to manage your health documents
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/member/health-safety'}>
                    Go to Health &amp; Safety
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Change Avatar Modal */}
      <Dialog open={showAvatarModal} onOpenChange={setShowAvatarModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Change Avatar</DialogTitle>
            <DialogDescription>Select a new avatar or upload your own image.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-4 gap-4">
              {avatarOptions.map((avatar, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-lg border-2 p-2 transition-all hover:border-primary hover:shadow-lg ${selectedAvatar === avatar && !uploadedImage ? 'border-primary bg-primary/5 shadow-lg' : 'border-gray-200'
                    }`}
                  onClick={() => { setSelectedAvatar(avatar); setUploadedImage(null); }}
                >
                  <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full rounded-lg" />
                  {selectedAvatar === avatar && !uploadedImage && (
                    <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 border-2 border-dashed rounded-lg text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">Or upload your own image</p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="avatar-upload"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('avatar-upload').click()}
              >
                Upload Image
              </Button>
              {uploadedImage && (
                <div className="mt-4 relative inline-block">
                  <img src={uploadedImage} alt="Uploaded" className="w-24 h-24 rounded-full mx-auto" />
                  <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAvatarModal(false)}>Cancel</Button>
            <Button onClick={handleSaveAvatar} disabled={!selectedAvatar || saving}>
              {saving ? 'Saving...' : 'Save Avatar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}