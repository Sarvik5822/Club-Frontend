import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Mail, Phone, Award, Calendar, Star, Edit2, Save, Upload, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import coachService from '@/services/coachService';

export default function CoachProfile() {
  useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [currentAvatar, setCurrentAvatar] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [coachData, setCoachData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    specializations: [],
    certifications: []
  });

  const avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Coach',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Trainer',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Instructor',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mentor',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Guide',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Expert',
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await coachService.getProfile();
      if (response.status === 'success') {
        const profile = response.data.coach;
        const stats = response.data.stats;

        setCoachData({
          ...profile,
          stats
        });

        setCurrentAvatar(profile.avatar || avatarOptions[0]);
        setFormData({
          name: profile.name || '',
          phone: profile.phone || '',
          bio: profile.bio || '',
          specializations: profile.specializations || [],
          certifications: profile.certifications || []
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updateData = {
        ...formData,
        avatar: currentAvatar
      };

      const response = await coachService.updateProfile(updateData);
      if (response.status === 'success') {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        fetchProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleChangeAvatar = () => {
    setSelectedAvatar(currentAvatar);
    setUploadedImage(null);
    setShowAvatarModal(true);
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
      toast.success('Image uploaded successfully');
    }
  };

  const confirmAvatarChange = () => {
    setCurrentAvatar(selectedAvatar);
    toast.success('Avatar updated successfully!');
    setShowAvatarModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your professional information</p>
        </div>
        <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={currentAvatar} alt={coachData?.name} />
                <AvatarFallback>{coachData?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="mb-4" onClick={handleChangeAvatar}>
                Change Photo
              </Button>
              <h2 className="text-2xl font-bold">{coachData?.name}</h2>
              <p className="text-muted-foreground mt-1">Professional Coach</p>

              <div className="flex items-center gap-2 mt-4">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="text-lg font-semibold">{coachData?.rating || 0}</span>
                <span className="text-sm text-muted-foreground">({coachData?.stats?.totalSessions || 0} sessions)</span>
              </div>

              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{coachData?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{coachData?.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {coachData?.createdAt ? new Date(coachData.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              <div className="w-full mt-6">
                <h3 className="font-semibold mb-2">Specializations</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {formData.specializations?.length > 0 ? (
                    formData.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary">{spec}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No specializations added</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={coachData?.email}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Branch</Label>
                      <Input
                        value={coachData?.branchId?.name || 'Not assigned'}
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={5}
                      placeholder="Tell us about your experience and expertise..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Specializations (comma separated)</Label>
                    <Input
                      value={formData.specializations?.join(', ')}
                      onChange={(e) => setFormData({ ...formData, specializations: e.target.value.split(',').map(s => s.trim()) })}
                      disabled={!isEditing}
                      placeholder="e.g., Yoga, Pilates, Meditation"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Total Clients</Label>
                      <Input
                        value={coachData?.stats?.totalClients || 0}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Average Rating</Label>
                      <Input
                        value={`${coachData?.rating || 0} / 5.0`}
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certifications" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Certifications & Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.certifications?.length > 0 ? (
                    <div className="space-y-4">
                      {formData.certifications.map((cert, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900">
                              <Award className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{cert.name || cert}</h4>
                              {cert.issuer && <p className="text-sm text-muted-foreground">{cert.issuer}</p>}
                              {cert.year && <p className="text-xs text-muted-foreground mt-1">Issued: {cert.year}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No certifications added</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Change Avatar Modal */}
      <Dialog open={showAvatarModal} onOpenChange={setShowAvatarModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Change Avatar</DialogTitle>
            <DialogDescription>
              Select a new avatar or upload your own image. The currently selected avatar is highlighted.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-4 gap-4">
              {avatarOptions.map((avatar, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-lg border-2 p-2 transition-all hover:border-primary-600 hover:shadow-lg ${selectedAvatar === avatar ? 'border-primary-600 bg-primary-50 dark:bg-primary-950 shadow-lg' : 'border-gray-200'
                    }`}
                  onClick={() => {
                    setSelectedAvatar(avatar);
                    setUploadedImage(null);
                  }}
                >
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full rounded-lg"
                  />
                  {selectedAvatar === avatar && !uploadedImage && (
                    <div className="absolute -top-2 -right-2 bg-primary-600 rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 border-2 border-dashed rounded-lg text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Or upload your own image
              </p>
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
                  <div className="absolute -top-2 -right-2 bg-primary-600 rounded-full p-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm text-success mt-2">Selected for upload</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAvatarModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAvatarChange} disabled={!selectedAvatar}>
              Save Avatar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}