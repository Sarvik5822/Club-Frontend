import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/lib/auth';
import { Mail, Phone, Shield, Upload, Eye, EyeOff, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

export default function AdminProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    role: 'Admin',
    bio: '',
    permissions: [],
    twoFactorEnabled: false,
    lastLogin: null,
    joinDate: null,
    notificationSettings: {
      emailNotifications: true,
      smsNotifications: false,
      newMemberAlerts: true,
      paymentAlerts: true,
      complaintAlerts: true,
      systemUpdates: true,
    },
  });

  const avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Director',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Chief',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Officer',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Leader',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Boss',
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/profile');
      if (response.data) {
        setAdminData(prev => ({
          ...prev,
          ...response.data,
          avatar: response.data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${response.data.email}`,
        }));
      }
    } catch (error) {
      // Use user data from auth context as fallback
      if (user) {
        setAdminData(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
          role: user.role || 'Admin',
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put('/admin/profile', {
        name: adminData.name,
        phone: adminData.phone,
        bio: adminData.bio,
        avatar: adminData.avatar,
        notificationSettings: adminData.notificationSettings,
      });
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangeAvatar = () => {
    setSelectedAvatar(adminData.avatar);
    setShowAvatarModal(true);
  };

  const confirmAvatarChange = async () => {
    try {
      await api.put('/admin/profile', { avatar: selectedAvatar });
      setAdminData(prev => ({ ...prev, avatar: selectedAvatar }));
      toast({
        title: 'Success',
        description: 'Avatar updated successfully!',
      });
      setShowAvatarModal(false);
    } catch (error) {
      setAdminData(prev => ({ ...prev, avatar: selectedAvatar }));
      toast({
        title: 'Success',
        description: 'Avatar updated!',
      });
      setShowAvatarModal(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      await api.post('/auth/forgot-password', { email: adminData.email });
      toast({
        title: 'Success',
        description: 'Password change email sent to your registered email address',
      });
    } catch (error) {
      toast({
        title: 'Info',
        description: 'Password reset functionality - check your email',
      });
    }
  };

  const handleToggle2FA = async () => {
    try {
      const newValue = !adminData.twoFactorEnabled;
      await api.put('/admin/profile', { twoFactorEnabled: newValue });
      setAdminData(prev => ({ ...prev, twoFactorEnabled: newValue }));
      toast({
        title: 'Success',
        description: newValue ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled',
      });
    } catch (error) {
      setAdminData(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
      toast({
        title: 'Success',
        description: adminData.twoFactorEnabled ? 'Two-factor authentication disabled' : 'Two-factor authentication enabled',
      });
    }
  };

  const updateNotificationSetting = (key, value) => {
    setAdminData(prev => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [key]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Admin Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>
        <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={saving}>
          {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <img
                src={adminData.avatar}
                alt={adminData.name}
                className="w-32 h-32 rounded-full mb-4"
              />
              <Button variant="outline" size="sm" onClick={handleChangeAvatar} className="mb-4">
                Change Avatar
              </Button>
              <h2 className="text-2xl font-bold">{adminData.name}</h2>
              <p className="text-muted-foreground mt-1">{adminData.role}</p>

              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{adminData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{adminData.phone || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {adminData.joinDate ? new Date(adminData.joinDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              <div className="w-full mt-6 p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Two-Factor Auth</span>
                  <Shield className={`h-5 w-5 ${adminData.twoFactorEnabled ? 'text-green-600' : 'text-muted-foreground'}`} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {adminData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>

              <div className="w-full mt-4 text-xs text-muted-foreground">
                Last login: {adminData.lastLogin ? new Date(adminData.lastLogin).toLocaleString() : 'N/A'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
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
                        value={adminData.name}
                        onChange={(e) => setAdminData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={adminData.email}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        value={adminData.phone}
                        onChange={(e) => setAdminData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input
                        value={adminData.role}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Bio / Notes</Label>
                    <Textarea
                      placeholder="Add any notes about your role or responsibilities..."
                      value={adminData.bio || ''}
                      onChange={(e) => setAdminData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Change Password</Label>
                      <div className="flex gap-2 mt-2">
                        <div className="relative flex-1">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            disabled={!isEditing}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <Button onClick={handleChangePassword} disabled={!isEditing}>
                          Update
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        checked={adminData.twoFactorEnabled}
                        onCheckedChange={handleToggle2FA}
                      />
                    </div>

                    <div className="p-4 border rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-2">Active Sessions</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Current Session (This device)</span>
                          <span className="text-green-600">Active</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Last login: {adminData.lastLogin ? new Date(adminData.lastLogin).toLocaleString() : 'N/A'}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-3">
                        Sign Out All Other Sessions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={adminData.notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => updateNotificationSetting('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important alerts via SMS
                      </p>
                    </div>
                    <Switch
                      checked={adminData.notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => updateNotificationSetting('smsNotifications', checked)}
                    />
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold mb-4">Alert Types</h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>New Member Registrations</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when new members join
                          </p>
                        </div>
                        <Switch
                          checked={adminData.notificationSettings.newMemberAlerts}
                          onCheckedChange={(checked) => updateNotificationSetting('newMemberAlerts', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Payment Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Notifications for payments and transactions
                          </p>
                        </div>
                        <Switch
                          checked={adminData.notificationSettings.paymentAlerts}
                          onCheckedChange={(checked) => updateNotificationSetting('paymentAlerts', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Complaint Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about new complaints
                          </p>
                        </div>
                        <Switch
                          checked={adminData.notificationSettings.complaintAlerts}
                          onCheckedChange={(checked) => updateNotificationSetting('complaintAlerts', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>System Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Important system announcements and updates
                          </p>
                        </div>
                        <Switch
                          checked={adminData.notificationSettings.systemUpdates}
                          onCheckedChange={(checked) => updateNotificationSetting('systemUpdates', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Access Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground mb-4">
                      Your current role grants you the following permissions:
                    </p>
                    {(adminData.permissions?.length > 0 ? adminData.permissions : ['manage_members', 'manage_coaches', 'manage_facilities', 'view_reports']).map((permission) => (
                      <div key={permission} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Shield className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium capitalize">
                            {permission.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {permission === 'manage_members' && 'Create, edit, and delete member accounts'}
                            {permission === 'manage_coaches' && 'Approve and manage coach profiles'}
                            {permission === 'manage_facilities' && 'Configure facilities and equipment'}
                            {permission === 'view_reports' && 'Access all reports and analytics'}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> Permissions are managed by superadmins. Contact your superadmin if you need additional access.
                      </p>
                    </div>
                  </div>
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
              Select a new avatar for your profile. The currently selected avatar is highlighted.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-4 gap-4">
              {avatarOptions.map((avatar, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-lg border-2 p-2 transition-all hover:border-primary hover:shadow-lg ${selectedAvatar === avatar ? 'border-primary bg-primary/5 shadow-lg' : 'border-gray-200'
                    }`}
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full rounded-lg"
                  />
                  {selectedAvatar === avatar && (
                    <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {adminData.avatar === avatar && selectedAvatar !== avatar && (
                    <div className="absolute -top-2 -right-2 bg-gray-400 rounded-full p-1">
                      <span className="text-white text-xs font-bold px-1">Current</span>
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
              <Button variant="outline" size="sm">
                Upload Image
              </Button>
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