import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IndianRupee, Fingerprint, Shield, Bell, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';

export default function AdminSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [branchData, setBranchData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    manager: '',
    description: '',
    operatingHours: {
      weekdays: { open: '06:00', close: '22:00' },
      weekends: { open: '07:00', close: '20:00' },
    },
    settings: {
      biometric: {
        minVisitDuration: 15,
        maxVisitDuration: 4,
        autoPunchOut: 6,
        gracePeriod: 30,
        requireBiometric: true,
        allowManualCheckIn: true,
        sendNotifications: true,
      },
      facility: {
        enforceCapacity: true,
        ageRestrictions: true,
        tierAccess: true,
      },
      notifications: {
        newMemberRegistrations: true,
        membershipExpiry: true,
        paymentNotifications: true,
        complaintAlerts: true,
      },
      security: {
        twoFactorAuth: true,
        sessionTimeout: 30,
        passwordExpiry: 90,
      },
    },
    membershipPlans: [
      { name: 'Basic', monthlyPrice: 49, trialDays: 7, multiClubAccess: false, popular: false },
      { name: 'Silver', monthlyPrice: 99, trialDays: 14, multiClubAccess: false, popular: false },
      { name: 'Gold', monthlyPrice: 199, trialDays: 14, multiClubAccess: true, popular: true },
      { name: 'Platinum', monthlyPrice: 299, trialDays: 30, multiClubAccess: true, popular: false },
    ],
  });

  useEffect(() => {
    fetchBranchData();
  }, []);

  const fetchBranchData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getBranch();
      if (response.data) {
        setBranchData(prev => ({
          ...prev,
          ...response.data,
          settings: {
            ...prev.settings,
            ...response.data.settings,
          },
        }));
      }
    } catch (error) {
      console.error('Failed to fetch branch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section) => {
    try {
      setSaving(true);
      await adminService.updateBranch(branchData);
      toast({
        title: 'Success',
        description: `${section} settings saved successfully!`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateBiometricSetting = (key, value) => {
    setBranchData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        biometric: {
          ...prev.settings.biometric,
          [key]: value,
        },
      },
    }));
  };

  const updateFacilitySetting = (key, value) => {
    setBranchData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        facility: {
          ...prev.settings.facility,
          [key]: value,
        },
      },
    }));
  };

  const updateNotificationSetting = (key, value) => {
    setBranchData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        notifications: {
          ...prev.settings.notifications,
          [key]: value,
        },
      },
    }));
  };

  const updateSecuritySetting = (key, value) => {
    setBranchData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        security: {
          ...prev.settings.security,
          [key]: value,
        },
      },
    }));
  };

  const updateMembershipPlan = (index, key, value) => {
    setBranchData(prev => {
      const plans = [...prev.membershipPlans];
      plans[index] = { ...plans[index], [key]: value };
      return { ...prev, membershipPlans: plans };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground mt-1">Configure club operations and policies</p>
      </div>

      <Tabs defaultValue="membership" className="space-y-6">
        <TabsList>
          <TabsTrigger value="membership">Membership Plans</TabsTrigger>
          <TabsTrigger value="biometric">Biometric Attendance</TabsTrigger>
          <TabsTrigger value="facilities">Facility Rules</TabsTrigger>
          <TabsTrigger value="club">Club Info</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="membership" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Membership Plans & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {branchData.membershipPlans.map((plan, index) => (
                <div key={plan.name} className="p-4 border rounded-lg space-y-4">
                  <h3 className="font-semibold text-lg">{plan.name} Plan</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Monthly Price (₹)</Label>
                      <Input
                        type="number"
                        value={plan.monthlyPrice}
                        onChange={(e) => updateMembershipPlan(index, 'monthlyPrice', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Trial Days</Label>
                      <Input
                        type="number"
                        value={plan.trialDays}
                        onChange={(e) => updateMembershipPlan(index, 'trialDays', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Features (comma separated)</Label>
                    <Input
                      placeholder="Feature 1, Feature 2, Feature 3"
                      value={plan.features?.join(', ') || ''}
                      onChange={(e) => updateMembershipPlan(index, 'features', e.target.value.split(',').map(f => f.trim()))}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={plan.multiClubAccess}
                      onCheckedChange={(checked) => updateMembershipPlan(index, 'multiClubAccess', checked)}
                    />
                    <Label>Multi-Club Access</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={plan.popular}
                      onCheckedChange={(checked) => updateMembershipPlan(index, 'popular', checked)}
                    />
                    <Label>Mark as Popular</Label>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button onClick={() => handleSave('Membership Plans')} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Membership Plans'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="biometric" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5" />
                Biometric Attendance Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Punch-In/Out Policies</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Visit Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={branchData.settings.biometric.minVisitDuration}
                      onChange={(e) => updateBiometricSetting('minVisitDuration', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">Track visits shorter than this as anomalies</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Visit Duration (hours)</Label>
                    <Input
                      type="number"
                      value={branchData.settings.biometric.maxVisitDuration}
                      onChange={(e) => updateBiometricSetting('maxVisitDuration', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">Alert members exceeding this duration</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Auto Punch-Out After (hours)</Label>
                    <Input
                      type="number"
                      value={branchData.settings.biometric.autoPunchOut}
                      onChange={(e) => updateBiometricSetting('autoPunchOut', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">Automatically punch out if member forgets</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Grace Period for Late Punch-Out (minutes)</Label>
                    <Input
                      type="number"
                      value={branchData.settings.biometric.gracePeriod}
                      onChange={(e) => updateBiometricSetting('gracePeriod', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">Allow punch-out within this time after leaving</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold">Biometric System Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label>Require Biometric Verification</Label>
                      <p className="text-sm text-muted-foreground">Members must use fingerprint scanner</p>
                    </div>
                    <Switch
                      checked={branchData.settings.biometric.requireBiometric}
                      onCheckedChange={(checked) => updateBiometricSetting('requireBiometric', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label>Allow Manual Check-In (Backup)</Label>
                      <p className="text-sm text-muted-foreground">Staff can manually check in members if scanner fails</p>
                    </div>
                    <Switch
                      checked={branchData.settings.biometric.allowManualCheckIn}
                      onCheckedChange={(checked) => updateBiometricSetting('allowManualCheckIn', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label>Send Punch-In/Out Notifications</Label>
                      <p className="text-sm text-muted-foreground">Notify members via app when they punch in/out</p>
                    </div>
                    <Switch
                      checked={branchData.settings.biometric.sendNotifications}
                      onCheckedChange={(checked) => updateBiometricSetting('sendNotifications', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('Attendance Rules')} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Attendance Rules'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Facility Usage Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Capacity & Access Rules</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label>Enforce Maximum Capacity</Label>
                      <p className="text-sm text-muted-foreground">Prevent entry when facility is at capacity</p>
                    </div>
                    <Switch
                      checked={branchData.settings.facility.enforceCapacity}
                      onCheckedChange={(checked) => updateFacilitySetting('enforceCapacity', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label>Age Restrictions</Label>
                      <p className="text-sm text-muted-foreground">Enforce minimum age requirements per facility</p>
                    </div>
                    <Switch
                      checked={branchData.settings.facility.ageRestrictions}
                      onCheckedChange={(checked) => updateFacilitySetting('ageRestrictions', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Label>Membership Tier Access</Label>
                      <p className="text-sm text-muted-foreground">Restrict certain facilities to higher tier memberships</p>
                    </div>
                    <Switch
                      checked={branchData.settings.facility.tierAccess}
                      onCheckedChange={(checked) => updateFacilitySetting('tierAccess', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold">Operating Hours</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Weekday Opening Time</Label>
                    <Input
                      type="time"
                      value={branchData.operatingHours?.weekdays?.open || '06:00'}
                      onChange={(e) => setBranchData(prev => ({
                        ...prev,
                        operatingHours: {
                          ...prev.operatingHours,
                          weekdays: { ...prev.operatingHours.weekdays, open: e.target.value }
                        }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Weekday Closing Time</Label>
                    <Input
                      type="time"
                      value={branchData.operatingHours?.weekdays?.close || '22:00'}
                      onChange={(e) => setBranchData(prev => ({
                        ...prev,
                        operatingHours: {
                          ...prev.operatingHours,
                          weekdays: { ...prev.operatingHours.weekdays, close: e.target.value }
                        }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Weekend Opening Time</Label>
                    <Input
                      type="time"
                      value={branchData.operatingHours?.weekends?.open || '07:00'}
                      onChange={(e) => setBranchData(prev => ({
                        ...prev,
                        operatingHours: {
                          ...prev.operatingHours,
                          weekends: { ...prev.operatingHours.weekends, open: e.target.value }
                        }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Weekend Closing Time</Label>
                    <Input
                      type="time"
                      value={branchData.operatingHours?.weekends?.close || '20:00'}
                      onChange={(e) => setBranchData(prev => ({
                        ...prev,
                        operatingHours: {
                          ...prev.operatingHours,
                          weekends: { ...prev.operatingHours.weekends, close: e.target.value }
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSave('Facility Rules')} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Facility Rules'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="club" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Club Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Club Name</Label>
                  <Input
                    value={branchData.name}
                    onChange={(e) => setBranchData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input
                    value={branchData.phone}
                    onChange={(e) => setBranchData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input
                    type="email"
                    value={branchData.email}
                    onChange={(e) => setBranchData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Manager Name</Label>
                  <Input
                    value={branchData.manager}
                    onChange={(e) => setBranchData(prev => ({ ...prev, manager: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={branchData.address}
                  onChange={(e) => setBranchData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Club Description</Label>
                <Input
                  value={branchData.description}
                  onChange={(e) => setBranchData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('Club Info')} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Club Info'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>New Member Registrations</Label>
                    <p className="text-sm text-muted-foreground">Notify when new members register</p>
                  </div>
                  <Switch
                    checked={branchData.settings.notifications.newMemberRegistrations}
                    onCheckedChange={(checked) => updateNotificationSetting('newMemberRegistrations', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Membership Expiry Alerts</Label>
                    <p className="text-sm text-muted-foreground">Alert when memberships are expiring soon</p>
                  </div>
                  <Switch
                    checked={branchData.settings.notifications.membershipExpiry}
                    onCheckedChange={(checked) => updateNotificationSetting('membershipExpiry', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Payment Notifications</Label>
                    <p className="text-sm text-muted-foreground">Notify on successful/failed payments</p>
                  </div>
                  <Switch
                    checked={branchData.settings.notifications.paymentNotifications}
                    onCheckedChange={(checked) => updateNotificationSetting('paymentNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Complaint Alerts</Label>
                    <p className="text-sm text-muted-foreground">Immediate notification for new complaints</p>
                  </div>
                  <Switch
                    checked={branchData.settings.notifications.complaintAlerts}
                    onCheckedChange={(checked) => updateNotificationSetting('complaintAlerts', checked)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('Preferences')} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <Switch
                    checked={branchData.settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => updateSecuritySetting('twoFactorAuth', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Session Timeout (minutes)</Label>
                    <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
                  </div>
                  <Input
                    type="number"
                    value={branchData.settings.security.sessionTimeout}
                    onChange={(e) => updateSecuritySetting('sessionTimeout', parseInt(e.target.value))}
                    className="w-24"
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Password Expiry (days)</Label>
                    <p className="text-sm text-muted-foreground">Force password change after this period</p>
                  </div>
                  <Input
                    type="number"
                    value={branchData.settings.security.passwordExpiry}
                    onChange={(e) => updateSecuritySetting('passwordExpiry', parseInt(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => handleSave('Security Settings')} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Security Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}