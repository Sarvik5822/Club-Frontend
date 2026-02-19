import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, Lock, Globe } from 'lucide-react';
import { toast } from 'sonner';
import coachService from '@/services/coachService';

export default function CoachSettings() {
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    availability: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '10:00', end: '14:00', available: false },
      sunday: { start: '10:00', end: '14:00', available: false }
    }
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await coachService.getSettings();
      if (response.status === 'success') {
        setSettings(response.data.settings || settings);
        setTwoFactorEnabled(response.data.twoFactorEnabled || false);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await coachService.updateSettings(settings);
      if (response.status === 'success') {
        toast.success('Settings saved successfully!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const updateNotificationSetting = (key, value) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'sessionReminders', label: 'Session Reminders', desc: 'Get notified before your scheduled sessions', checked: true },
                { key: 'newBooking', label: 'New Booking Alerts', desc: 'Receive alerts when clients book your sessions', checked: true },
                { key: 'cancellation', label: 'Cancellation Notifications', desc: 'Get notified when clients cancel bookings', checked: true },
                { key: 'clientMessages', label: 'Client Messages', desc: 'Receive notifications for new messages from clients', checked: true },
                { key: 'performanceReports', label: 'Performance Reports', desc: 'Weekly summary of your coaching performance', checked: false },
                { key: 'adminAnnouncements', label: 'Admin Announcements', desc: 'Important updates from club management', checked: true },
              ].map((notif) => (
                <div key={notif.key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{notif.label}</Label>
                    <p className="text-sm text-muted-foreground">{notif.desc}</p>
                  </div>
                  <Switch defaultChecked={notif.checked} />
                </div>
              ))}

              <div className="pt-4 border-t">
                <Label className="mb-3 block">Notification Method</Label>
                <div className="space-y-3">
                  {[
                    { id: 'email-notif', key: 'email', label: 'Email notifications', checked: settings.notifications?.email },
                    { id: 'push-notif', key: 'push', label: 'Push notifications', checked: settings.notifications?.push },
                    { id: 'sms-notif', key: 'sms', label: 'SMS notifications', checked: settings.notifications?.sms },
                  ].map((method) => (
                    <div key={method.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={method.id}
                        checked={method.checked}
                        onChange={(e) => updateNotificationSetting(method.key, e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor={method.id} className="text-sm font-normal">{method.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Change Password */}
                <div>
                  <h3 className="font-semibold mb-4">Change Password</h3>
                  <div className="space-y-3">
                    {['Current Password', 'New Password', 'Confirm New Password'].map((label, i) => (
                      <div key={i} className="space-y-2">
                        <Label>{label}</Label>
                        <Input type="password" />
                      </div>
                    ))}
                    <Button>Update Password</Button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                    />
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Chrome on Windows • Los Angeles, CA</p>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-3">Sign Out All Other Sessions</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language */}
              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['en', 'es', 'fr', 'de'].map((lang) => (
                      <SelectItem key={lang} value={lang}>{lang.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Select defaultValue="pst">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                    <SelectItem value="est">Eastern Time (ET)</SelectItem>
                    <SelectItem value="cst">Central Time (CT)</SelectItem>
                    <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Format */}
              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                </div>
                <Switch checked={theme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
              </div>

              {/* Other Preferences */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-accept Bookings</Label>
                  <p className="text-sm text-muted-foreground">Automatically confirm new session bookings</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Availability to Clients</Label>
                  <p className="text-sm text-muted-foreground">Let clients see your available time slots</p>
                </div>
                <Switch defaultChecked />
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t">
                <Button onClick={handleSave} className="w-full">Save All Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}