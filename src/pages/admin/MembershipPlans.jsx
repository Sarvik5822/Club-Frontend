import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Check, Loader2, RefreshCw, CreditCard, Users, Building2, Info } from 'lucide-react';
import adminService from '@/services/adminService';
import { toast } from 'sonner';

export default function MembershipPlans() {
    const [plans, setPlans] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [branchInfo, setBranchInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        duration: 1,
        durationType: 'months',
        features: '',
        facilities: [],
        maxMembers: '',
        isActive: true,
        popular: false,
        color: 'blue',
    });

    const colorOptions = [
        { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
        { value: 'green', label: 'Green', class: 'bg-green-500' },
        { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
        { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
        { value: 'red', label: 'Red', class: 'bg-red-500' },
        { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
        { value: 'gray', label: 'Gray', class: 'bg-gray-500' },
    ];

    useEffect(() => {
        fetchBranchInfo();
        fetchPlans();
        fetchFacilities();
    }, []);

    const fetchBranchInfo = async () => {
        try {
            const response = await adminService.getBranch();
            if (response.data && response.data.branch) {
                setBranchInfo(response.data.branch);
            }
        } catch (error) {
            console.error('Failed to fetch branch info:', error);
        }
    };

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const response = await adminService.getMembershipPlans();

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

    const fetchFacilities = async () => {
        try {
            const response = await adminService.getFacilities();
            if (response.status === 'success') {
                setFacilities(response.data.facilities || []);
            }
        } catch (error) {
            console.error('Failed to fetch facilities:', error);
            setFacilities([
                { _id: 'f1', name: 'Gym' },
                { _id: 'f2', name: 'Swimming Pool' },
                { _id: 'f3', name: 'Fitness Studio' },
                { _id: 'f4', name: 'Tennis Court' },
                { _id: 'f5', name: 'Badminton Court' },
                { _id: 'f6', name: 'Spa' },
            ]);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            duration: 1,
            durationType: 'months',
            features: '',
            facilities: [],
            maxMembers: '',
            isActive: true,
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
                maxMembers: formData.maxMembers ? parseInt(formData.maxMembers) : undefined,
                features: formData.features.split('\n').filter(f => f.trim()),
            };

            const response = await adminService.createMembershipPlan(planData);

            if (response.status === 'success') {
                toast.success('Member facility plan created successfully for your club');
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
                maxMembers: formData.maxMembers ? parseInt(formData.maxMembers) : undefined,
                features: typeof formData.features === 'string'
                    ? formData.features.split('\n').filter(f => f.trim())
                    : formData.features,
            };

            const response = await adminService.updateMembershipPlan(selectedPlan._id, planData);

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
            const response = await adminService.deleteMembershipPlan(selectedPlan._id);

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
            description: plan.description || '',
            price: plan.price?.toString() || '',
            duration: plan.duration || 1,
            durationType: plan.durationType || 'months',
            features: Array.isArray(plan.features) ? plan.features.join('\n') : '',
            facilities: plan.facilities || [],
            maxMembers: plan.maxMembers?.toString() || '',
            isActive: plan.isActive !== false,
            popular: plan.popular || false,
            color: plan.color || 'blue',
        });
        setShowEditModal(true);
    };

    const toggleFacility = (facilityName) => {
        setFormData(prev => ({
            ...prev,
            facilities: prev.facilities.includes(facilityName)
                ? prev.facilities.filter(f => f !== facilityName)
                : [...prev.facilities, facilityName]
        }));
    };

    const getColorClass = (color) => {
        const colorMap = {
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            purple: 'bg-purple-500',
            orange: 'bg-orange-500',
            red: 'bg-red-500',
            yellow: 'bg-yellow-500',
            gray: 'bg-gray-500',
        };
        return colorMap[color] || 'bg-blue-500';
    };

    const totalPlans = plans.length;
    const activePlans = plans.filter(p => p.isActive !== false).length;
    const totalSubscribers = plans.reduce((sum, p) => sum + (p.subscriberCount || 0), 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Member Facility Plans</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage facility access plans for your club members
                        {branchInfo && (
                            <span className="ml-2 inline-flex items-center">
                                <Building2 className="h-4 w-4 mr-1" />
                                <strong>{branchInfo.name}</strong>
                            </span>
                        )}
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
                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create Member Facility Plan</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                {branchInfo && (
                                    <div className="bg-muted p-3 rounded-lg flex items-start gap-2">
                                        <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                        <div className="text-sm">
                                            <strong>Member Facility Plans</strong> define what facilities and services your members can access (e.g., gym, pool, classes). This plan will be created for <strong>{branchInfo.name}</strong>.
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label>Plan Name *</Label>
                                    <Input
                                        placeholder="e.g., Premium, Basic"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input
                                        placeholder="Brief description of the plan"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Price (₹) *</Label>
                                        <Input
                                            type="number"
                                            placeholder="1999"
                                            value={formData.price}
                                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Duration *</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="number"
                                                placeholder="1"
                                                value={formData.duration}
                                                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                                className="w-20"
                                            />
                                            <Select
                                                value={formData.durationType}
                                                onValueChange={(value) => setFormData(prev => ({ ...prev, durationType: value }))}
                                            >
                                                <SelectTrigger className="flex-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="days">Days</SelectItem>
                                                    <SelectItem value="weeks">Weeks</SelectItem>
                                                    <SelectItem value="months">Months</SelectItem>
                                                    <SelectItem value="years">Years</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Max Members</Label>
                                        <Input
                                            type="number"
                                            placeholder="Unlimited"
                                            value={formData.maxMembers}
                                            onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Color Theme</Label>
                                        <Select
                                            value={formData.color}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {colorOptions.map(color => (
                                                    <SelectItem key={color.value} value={color.value}>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-4 h-4 rounded ${color.class}`}></div>
                                                            {color.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Features (one per line)</Label>
                                    <Textarea
                                        placeholder="Access to gym equipment&#10;Swimming pool access&#10;Personal training sessions"
                                        rows={4}
                                        value={formData.features}
                                        onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Included Facilities</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {facilities.map(facility => (
                                            <Badge
                                                key={facility._id}
                                                variant={formData.facilities.includes(facility.name) ? "default" : "outline"}
                                                className="cursor-pointer"
                                                onClick={() => toggleFacility(facility.name)}
                                            >
                                                {facility.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="isActive"
                                            checked={formData.isActive}
                                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                                        />
                                        <Label htmlFor="isActive">Active</Label>
                                    </div>
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
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                            <Building2 className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Member Facility Plans (Club-Specific)</h3>
                            <p className="text-muted-foreground text-sm mt-1">
                                These plans define what facilities and services your members can access at your club. They control access to amenities like gym, pool, courts, classes, and other member benefits.
                            </p>
                            <div className="flex gap-4 mt-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Building2 className="h-4 w-4 text-green-500" />
                                    <span>Club-specific plans</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4 text-blue-500" />
                                    <span>Member facility access</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Club Plans</p>
                                <p className="text-2xl font-bold">{totalPlans}</p>
                            </div>
                            <CreditCard className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Active Plans</p>
                                <p className="text-2xl font-bold">{activePlans}</p>
                            </div>
                            <Check className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Subscribers</p>
                                <p className="text-2xl font-bold">{totalSubscribers}</p>
                            </div>
                            <Users className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading plans...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.length === 0 ? (
                        <div className="col-span-3 text-center py-12">
                            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Member Facility Plans</h3>
                            <p className="text-muted-foreground mb-4">
                                Create facility access plans for your club members. These plans define what amenities and services members can access.
                            </p>
                            <Button onClick={() => { resetForm(); setShowAddModal(true); }}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Your First Plan
                            </Button>
                        </div>
                    ) : (
                        plans.map((plan) => (
                            <Card key={plan._id} className={`relative overflow-hidden ${plan.popular ? 'border-primary border-2' : ''}`}>
                                <div className={`absolute top-0 left-0 right-0 h-1 ${getColorClass(plan.color)}`}></div>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                                            {plan.description && (
                                                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            {plan.popular && <Badge>Popular</Badge>}
                                            {plan.isActive === false && <Badge variant="secondary">Inactive</Badge>}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">₹{plan.price}</span>
                                        <span className="text-muted-foreground">/{plan.duration} {plan.durationType || 'month'}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        {plan.features?.slice(0, 4).map((feature, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm">
                                                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                        {plan.features?.length > 4 && (
                                            <div className="text-sm text-muted-foreground">
                                                +{plan.features.length - 4} more features
                                            </div>
                                        )}
                                    </div>

                                    {plan.facilities?.length > 0 && (
                                        <div className="pt-2 border-t">
                                            <p className="text-xs text-muted-foreground mb-2">Included Facilities:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {plan.facilities.slice(0, 3).map((facility, i) => (
                                                    <Badge key={i} variant="outline" className="text-xs">{facility}</Badge>
                                                ))}
                                                {plan.facilities.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">+{plan.facilities.length - 3}</Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subscribers</span>
                                            <span className="font-medium">{plan.subscriberCount || 0}</span>
                                        </div>
                                        {plan.maxMembers && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Max Capacity</span>
                                                <span className="font-medium">{plan.maxMembers}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => openEditModal(plan)}
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
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
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Member Facility Plan</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Plan Name</Label>
                            <Input
                                placeholder="e.g., Premium"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input
                                placeholder="Brief description of the plan"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Price (₹)</Label>
                                <Input
                                    type="number"
                                    placeholder="1999"
                                    value={formData.price}
                                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Duration</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="1"
                                        value={formData.duration}
                                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                        className="w-20"
                                    />
                                    <Select
                                        value={formData.durationType}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, durationType: value }))}
                                    >
                                        <SelectTrigger className="flex-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="days">Days</SelectItem>
                                            <SelectItem value="weeks">Weeks</SelectItem>
                                            <SelectItem value="months">Months</SelectItem>
                                            <SelectItem value="years">Years</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Max Members</Label>
                                <Input
                                    type="number"
                                    placeholder="Unlimited"
                                    value={formData.maxMembers}
                                    onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Color Theme</Label>
                                <Select
                                    value={formData.color}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {colorOptions.map(color => (
                                            <SelectItem key={color.value} value={color.value}>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-4 h-4 rounded ${color.class}`}></div>
                                                    {color.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Features (one per line)</Label>
                            <Textarea
                                placeholder="Access to gym equipment&#10;Swimming pool access&#10;Personal training sessions"
                                rows={4}
                                value={formData.features}
                                onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Included Facilities</Label>
                            <div className="flex flex-wrap gap-2">
                                {facilities.map(facility => (
                                    <Badge
                                        key={facility._id}
                                        variant={formData.facilities.includes(facility.name) ? "default" : "outline"}
                                        className="cursor-pointer"
                                        onClick={() => toggleFacility(facility.name)}
                                    >
                                        {facility.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="edit-isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                                />
                                <Label htmlFor="edit-isActive">Active</Label>
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
                        <DialogTitle>Delete Member Facility Plan</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Are you sure you want to delete the <strong>{selectedPlan?.name}</strong> plan?
                            This action cannot be undone and will affect {selectedPlan?.subscriberCount || 0} subscribers.
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