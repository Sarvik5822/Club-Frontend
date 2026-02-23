import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Globe, Mail, CreditCard, Shield, Zap, Save, RefreshCw, Loader2 } from 'lucide-react';
import superadminService from '@/services/superadminService';
import { toast } from 'sonner';

export default function SuperadminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    siteName: '',
    timezone: '',
    dateFormat: '',
    currency: '',
  });

  const [emailSettings, setEmailSettings] = useState({
    enabled: true,
    provider: '',
    fromName: '',
    fromEmail: '',
  });

  const [paymentSettings, setPaymentSettings] = useState({
    enabled: true,
    currency: '',
    taxRate: 0,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 3600,
    passwordMinLength: 6,
    maxLoginAttempts: 5,
  });

  const [featureSettings, setFeatureSettings] = useState({
    biometricAttendance: true,
    multiClubAccess: true,
    trainingPlans: true,
    messaging: true,
    announcements: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await superadminService.getSystemSettings();

      if (response.status === 'success') {
        const data = response.data.settings;
        setSettings(data);
        if (data.general) setGeneralSettings(data.general);
        if (data.email) setEmailSettings(data.email);
        if (data.payment) setPaymentSettings(prev => ({
          ...prev,
          enabled: data.payment.enabled ?? true,
          currency: data.payment.currency || '',
          taxRate: data.payment.taxRate || 0,
        }));
        if (data.security) setSecuritySettings(data.security);
        if (data.features) setFeatureSettings(data.features);
      }
    } catch (error) {
      console.error('Failed to fetch system settings:', error);
      toast.error('Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const updatedSettings = {
        general: generalSettings,
        email: emailSettings,
        payment: paymentSettings,
        security: securitySettings,
        features: featureSettings,
      };

      const response = await superadminService.updateSystemSettings(updatedSettings);

      if (response.status === 'success') {
        toast.success('System settings updated successfully!');
        setSettings(updatedSettings);
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error(error.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground mt-1">Configure global system settings and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSettings} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Settings
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="features">
            <Zap className="h-4 w-4 mr-2" />
            Features
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic system information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Site Name</Label>
                  <Input
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    placeholder="Sports Club Management System"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Input
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
                    placeholder="Asia/Kolkata"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Input
                    value={generalSettings.dateFormat}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input
                    value={generalSettings.currency}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, currency: e.target.value }))}
                    placeholder="INR"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Configure email notifications and delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Enable Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Send email notifications to users</p>
                </div>
                <Switch
                  checked={emailSettings.enabled}
                  onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, enabled: checked }))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Provider</Label>
                  <Input
                    value={emailSettings.provider}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, provider: e.target.value }))}
                    placeholder="smtp"
                  />
                </div>
                <div className="space-y-2">
                  <Label>From Name</Label>
                  <Input
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                    placeholder="Sports Club"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>From Email</Label>
                  <Input
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                    placeholder="noreply@sportsclub.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>Configure payment gateway and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Enable Payments</p>
                  <p className="text-sm text-muted-foreground">Allow online payment processing</p>
                </div>
                <Switch
                  checked={paymentSettings.enabled}
                  onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, enabled: checked }))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input
                    value={paymentSettings.currency}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, currency: e.target.value }))}
                    placeholder="INR"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={paymentSettings.taxRate}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure authentication and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorEnabled}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: checked }))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Session Timeout (seconds)</Label>
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 3600 }))}
                    placeholder="3600"
                    min="300"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Min Password Length</Label>
                  <Input
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) || 6 }))}
                    placeholder="6"
                    min="4"
                    max="32"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) || 5 }))}
                    placeholder="5"
                    min="1"
                    max="20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature Toggles */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>Enable or disable system features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { key: 'biometricAttendance', label: 'Biometric Attendance', desc: 'Enable biometric-based attendance tracking' },
                { key: 'multiClubAccess', label: 'Multi-Club Access', desc: 'Allow members to access multiple clubs' },
                { key: 'trainingPlans', label: 'Training Plans', desc: 'Enable personalized training plan features' },
                { key: 'messaging', label: 'Messaging', desc: 'Enable in-app messaging between users' },
                { key: 'announcements', label: 'Announcements', desc: 'Enable announcement broadcasting' },
              ].map((feature) => (
                <div key={feature.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{feature.label}</p>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                  <Switch
                    checked={featureSettings[feature.key]}
                    onCheckedChange={(checked) =>
                      setFeatureSettings(prev => ({ ...prev, [feature.key]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}