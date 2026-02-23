import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Bell, Shield, Eye, RefreshCw } from 'lucide-react';
import memberService from '@/services/memberService';
import { toast } from 'sonner';

export default function Settings() {
  const [settings, _setSettings] = useState(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showActivity: true,
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await memberService.getSettings();
      const data = res.data;
      _setSettings(data?.settings);
      setTwoFactorEnabled(data?.twoFactorEnabled || false);
      if (data?.settings?.notifications) {
        setNotifications({
          email: data.settings.notifications.email ?? true,
          push: data.settings.notifications.push ?? true,
          sms: data.settings.notifications.sms ?? false,
        });
      }
      if (data?.settings?.privacy) {
        setPrivacy({
          profileVisible: data.settings.privacy.profileVisible ?? true,
          showActivity: data.settings.privacy.showActivity ?? true,
        });
      }
    } catch (error) {
      toast.error('Failed to load settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    try {
      setSaving(true);
      await memberService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle2FA = async (enable) => {
    try {
      setSaving(true);
      const res = await memberService.toggle2FA({ enable });
      setTwoFactorEnabled(res.data?.twoFactorEnabled ?? enable);
      toast.success(`Two-factor authentication ${enable ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      toast.error('Failed to toggle 2FA: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      await memberService.updateNotificationSettings(notifications);
      toast.success('Notification preferences saved!');
    } catch (error) {
      toast.error('Failed to save notifications: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    try {
      setSaving(true);
      await memberService.updatePrivacySettings(privacy);
      toast.success('Privacy settings saved!');
    } catch (error) {
      toast.error('Failed to save privacy settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account preferences</p>
        </div>
        <Button variant="outline" onClick={fetchSettings} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="security" className="space-y-6">
        <TabsList>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password regularly to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                />
              </div>
              <Button onClick={handleChangePassword} disabled={saving}>
                {saving ? 'Updating...' : 'Update Password'}
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <Skeleton className="h-12 w-full rounded-lg" />
              ) : (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      {twoFactorEnabled
                        ? '2FA is currently enabled on your account'
                        : 'Require a verification code in addition to your password'}
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={handleToggle2FA}
                    disabled={saving}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Notification Channels</h4>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(v) => setNotifications(p => ({ ...p, email: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(v) => setNotifications(p => ({ ...p, push: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(v) => setNotifications(p => ({ ...p, sms: v }))}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveNotifications} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your data and privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Profile Visibility</p>
                        <p className="text-sm text-muted-foreground">Allow other members to see your profile</p>
                      </div>
                      <Switch
                        checked={privacy.profileVisible}
                        onCheckedChange={(v) => setPrivacy(p => ({ ...p, profileVisible: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Show Activity</p>
                        <p className="text-sm text-muted-foreground">Display your activity on leaderboards</p>
                      </div>
                      <Switch
                        checked={privacy.showActivity}
                        onCheckedChange={(v) => setPrivacy(p => ({ ...p, showActivity: v }))}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSavePrivacy} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Privacy Settings'}
                  </Button>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-4">Data Management</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        Download My Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                        Delete My Account
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}