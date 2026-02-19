import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Check, Loader2, RefreshCw, Globe, Building2, Info } from 'lucide-react';
import superadminService from '@/services/superadminService';
import { toast } from 'sonner';

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: 1,
    features: '',
    description: '',
    popular: false,
    color: 'blue',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await superadminService.getAllMembershipPlans();

      if (response.status === 'success') {
        setPlans(response.data.plans || response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch membership plans:', error);
      toast.error('Failed to load membership plans');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      duration: 1,
      features: '',
      description: '',
      popular: false,
      color: 'blue',
    });
  };

  const handleAddPlan = async () => {
    if (!formData.name || !formData.price || !formData.duration) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const planData = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        features: formData.features.split('\n').filter(f => f.trim()),
      };

      const response = await superadminService.createMembershipPlan(planData);

      if (response.status === 'success') {
        toast.success('Admin subscription plan created successfully');
        setShowAddModal(false);
        resetForm();
        fetchPlans();
      }
    } catch (error) {
      console.error('Failed to create membership plan:', error);
      toast.error(error.message || 'Failed to create membership plan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPlan = async () => {
    if (!selectedPlan) return;

    try {
      setSubmitting(true);
      const planData = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        features: typeof formData.features === 'string'
          ? formData.features.split('\n').filter(f => f.trim())
          : formData.features,
      };

      const response = await superadminService.updateMembershipPlan(selectedPlan._id, planData);

      if (response.status === 'success') {
        toast.success('Membership plan updated successfully');
        setShowEditModal(false);
        setSelectedPlan(null);
        resetForm();
        fetchPlans();
      }
    } catch (error) {
      console.error('Failed to update membership plan:', error);
      toast.error(error.message || 'Failed to update membership plan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!selectedPlan) return;

    try {
      setSubmitting(true);
      const response = await superadminService.deleteMembershipPlan(selectedPlan._id);

      if (response.status === 'success') {
        toast.success('Membership plan deleted successfully');
        setShowDeleteModal(false);
        setSelectedPlan(null);
        fetchPlans();
      }
    } catch (error) {
      console.error('Failed to delete membership plan:', error);
      toast.error(error.message || 'Failed to delete membership plan');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name || '',
      price: plan.price?.toString() || '',
      duration: plan.duration || 1,
      features: Array.isArray(plan.features) ? plan.features.join('\n') : '',
      description: plan.description || '',
      popular: plan.popular || false,
      color: plan.color || 'blue',
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Subscription Plans</h1>
          <p className="text-muted-foreground mt-1">
            <Globe className="h-4 w-4 inline mr-1" />
            Manage subscription plans that admins can purchase for their clubs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchPlans} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Admin Subscription Plan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg flex items-start gap-2 border border-blue-200 dark:border-blue-800">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Admin Subscription Plans</strong> define what features and capabilities admins get when they purchase a plan for their club (e.g., max members, features, support level).
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Plan Name *</Label>
                  <Input
                    placeholder="e.g., Professional, Enterprise"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Brief description of what this plan offers"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (₹/month) *</Label>
                    <Input
                      type="number"
                      placeholder="4999"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration (months) *</Label>
                    <Input
                      type="number"
                      placeholder="1"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Features (one per line)</Label>
                  <Textarea
                    placeholder="Up to 500 members&#10;Advanced analytics&#10;Priority support&#10;Custom branding"
                    rows={5}
                    value={formData.features}
                    onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="popular"
                      checked={formData.popular}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, popular: checked }))}
                    />
                    <Label htmlFor="popular">Mark as Popular</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button onClick={handleAddPlan} disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Plan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Admin Subscription Plans (Application-Level)</h3>
              <p className="text-muted-foreground text-sm mt-1">
                These plans define what admins can purchase for their clubs. They control features like maximum member capacity, analytics access, support levels, and other club management capabilities.
              </p>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <span>Available to all club admins</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-green-500" />
                  <span>Controls club capabilities</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-muted-foreground">Loading plans...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.length === 0 ? (
            <div className="col-span-4 text-center py-12">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Admin Subscription Plans</h3>
              <p className="text-muted-foreground mb-4">
                Create subscription plans that club admins can purchase to access different features and capabilities.
              </p>
              <Button onClick={() => { resetForm(); setShowAddModal(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Plan
              </Button>
            </div>
          ) : (
            plans.map((plan) => (
              <Card key={plan._id} className={`card-hover ${plan.popular ? 'border-primary-600 border-2' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <Globe className="h-4 w-4 text-blue-500" title="Application-level plan" />
                    </div>
                    {plan.popular && <Badge>Popular</Badge>}
                  </div>
                  {plan.description && (
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  )}
                  <div className="mt-4">
                    <span className="text-4xl font-bold">₹{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features?.slice(0, 5).map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {plan.features?.length > 5 && (
                      <div className="text-sm text-muted-foreground">
                        +{plan.features.length - 5} more features
                      </div>
                    )}
                  </div>
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{plan.duration} month(s)</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => openEditModal(plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedPlan(plan);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Edit Plan Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Admin Subscription Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input
                placeholder="e.g., Professional"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Brief description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (₹/month)</Label>
                <Input
                  type="number"
                  placeholder="4999"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Duration (months)</Label>
                <Input
                  type="number"
                  placeholder="1"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Features (one per line)</Label>
              <Textarea
                placeholder="Up to 500 members&#10;Advanced analytics&#10;Priority support"
                rows={5}
                value={formData.features}
                onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-popular"
                checked={formData.popular}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, popular: checked }))}
              />
              <Label htmlFor="edit-popular">Mark as Popular</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button onClick={handleEditPlan} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Admin Subscription Plan</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete the <strong>{selectedPlan?.name}</strong> plan?
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeletePlan} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}