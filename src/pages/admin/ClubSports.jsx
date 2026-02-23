import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
    Plus, Edit, Trash2, Dumbbell, Search, Loader2, CheckCircle,
    Waves, Swords, Trophy, Weight, Target, Heart, Users, Zap, Music, HelpCircle,
    ToggleLeft, ToggleRight
} from 'lucide-react';
import { toast } from 'sonner';
import adminService from '@/services/adminService';
import { SPORT_CATEGORIES } from '@/lib/constants';

const categoryIcons = {
    'Aquatics': Waves,
    'Martial Arts': Swords,
    'Racket Sports': Trophy,
    'Gym & Fitness': Weight,
    'Skill & Precision': Target,
    'Mind & Body': Heart,
    'Team Sports': Users,
    'Cardio': Zap,
    'Dance': Music,
    'Other': HelpCircle,
};

export default function ClubSports() {
    const [sports, setSports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSport, setEditingSport] = useState(null);
    const [saving, setSaving] = useState(false);

    // Add form
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        icon: '',
    });

    useEffect(() => {
        fetchSports();
    }, []);

    const fetchSports = async () => {
        try {
            setLoading(true);
            const response = await adminService.getClubSports();
            if (response.status === 'success') {
                setSports(response.data.sports || []);
            }
        } catch (error) {
            console.error('Failed to fetch club sports:', error);
            toast.error('Failed to load sports');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!formData.name.trim()) {
            toast.error('Sport name is required');
            return;
        }
        if (!formData.category) {
            toast.error('Category is required');
            return;
        }
        try {
            setSaving(true);
            const response = await adminService.createClubSport(formData);
            if (response.status === 'success') {
                toast.success(`"${formData.name}" added successfully!`);
                setShowAddModal(false);
                setFormData({ name: '', category: '', description: '', icon: '' });
                fetchSports();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to add sport');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async () => {
        if (!editingSport) return;
        if (!formData.name.trim()) {
            toast.error('Sport name is required');
            return;
        }
        if (!formData.category) {
            toast.error('Category is required');
            return;
        }
        try {
            setSaving(true);
            const response = await adminService.updateClubSport(editingSport._id, formData);
            if (response.status === 'success') {
                toast.success('Sport updated successfully!');
                setShowEditModal(false);
                setEditingSport(null);
                setFormData({ name: '', category: '', description: '', icon: '' });
                fetchSports();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update sport');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (sport) => {
        if (!confirm(`Are you sure you want to delete "${sport.name}"?`)) return;
        try {
            const response = await adminService.deleteClubSport(sport._id);
            if (response.status === 'success') {
                toast.success(`"${sport.name}" deleted successfully`);
                fetchSports();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to delete sport');
        }
    };

    const handleToggleStatus = async (sport) => {
        try {
            const response = await adminService.toggleClubSportStatus(sport._id);
            if (response.status === 'success') {
                toast.success(`"${sport.name}" ${sport.status === 'active' ? 'deactivated' : 'activated'}`);
                fetchSports();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to toggle status');
        }
    };

    const openEditModal = (sport) => {
        setEditingSport(sport);
        setFormData({
            name: sport.name,
            category: sport.category,
            description: sport.description || '',
            icon: sport.icon || '',
        });
        setShowEditModal(true);
    };

    const openAddModal = () => {
        setFormData({ name: '', category: '', description: '', icon: '' });
        setShowAddModal(true);
    };

    // Filter sports
    const filteredSports = sports.filter(sport => {
        const matchesSearch = sport.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || sport.category === filterCategory;
        const matchesStatus = filterStatus === 'all' || sport.status === filterStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Group by category
    const groupedSports = filteredSports.reduce((acc, sport) => {
        if (!acc[sport.category]) acc[sport.category] = [];
        acc[sport.category].push(sport);
        return acc;
    }, {});

    // Stats
    const activeSports = sports.filter(s => s.status === 'active').length;
    const inactiveSports = sports.filter(s => s.status === 'inactive').length;
    const categories = [...new Set(sports.map(s => s.category))];

    const getCategoryStyle = (category) => {
        const cat = SPORT_CATEGORIES.find(c => c.value === category);
        return cat || SPORT_CATEGORIES[SPORT_CATEGORIES.length - 1];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <span className="ml-2">Loading sports...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Sports & Activities</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage sports and activities offered at your club
                    </p>
                </div>
                <Button onClick={openAddModal}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sport / Activity
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6 text-center">
                        <Dumbbell className="h-10 w-10 mx-auto mb-2 text-emerald-600" />
                        <h3 className="font-semibold text-2xl">{sports.length}</h3>
                        <p className="text-sm text-muted-foreground">Total Sports</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-600" />
                        <h3 className="font-semibold text-2xl">{activeSports}</h3>
                        <p className="text-sm text-muted-foreground">Active Sports</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="h-10 w-10 mx-auto mb-2 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <span className="text-lg font-bold text-gray-600">{categories.length}</span>
                        </div>
                        <h3 className="font-semibold text-2xl">{categories.length}</h3>
                        <p className="text-sm text-muted-foreground">Categories</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search sports..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {SPORT_CATEGORIES.map(cat => (
                                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Sports List */}
            {sports.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Dumbbell className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="text-xl font-semibold mb-2">No Sports Configured Yet</h3>
                        <p className="text-muted-foreground mb-6">
                            Start by adding sports and activities that your club offers.
                            Simply enter the sport name, select a category, and you're good to go!
                        </p>
                        <Button onClick={openAddModal}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Sport
                        </Button>
                    </CardContent>
                </Card>
            ) : filteredSports.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <Search className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No sports match your search criteria</p>
                    </CardContent>
                </Card>
            ) : (
                Object.entries(groupedSports).map(([category, categorySports]) => {
                    const catStyle = getCategoryStyle(category);
                    const IconComponent = categoryIcons[category] || HelpCircle;
                    return (
                        <Card key={category}>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <IconComponent className="h-5 w-5" />
                                    {category}
                                    <Badge variant="secondary" className="ml-2">{categorySports.length}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {categorySports.map((sport) => (
                                        <div
                                            key={sport._id}
                                            className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${sport.status === 'active'
                                                ? 'hover:border-emerald-500'
                                                : 'opacity-60 bg-gray-50 dark:bg-gray-900/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${sport.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                                    }`} />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium truncate">{sport.name}</p>
                                                    {sport.description && (
                                                        <p className="text-xs text-muted-foreground truncate">{sport.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleToggleStatus(sport)}
                                                    title={sport.status === 'active' ? 'Deactivate' : 'Activate'}
                                                >
                                                    {sport.status === 'active' ? (
                                                        <ToggleRight className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <ToggleLeft className="h-4 w-4 text-gray-400" />
                                                    )}
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => openEditModal(sport)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleDelete(sport)} className="text-red-600 hover:text-red-700">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })
            )}

            {/* Add Sport Modal */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogContent className="sm:max-w-[480px] w-[calc(100%-2rem)] mx-auto">
                    <DialogHeader className="text-left">
                        <DialogTitle>Add Sport / Activity</DialogTitle>
                        <DialogDescription>
                            Enter the details of the sport or activity your club offers.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="add-sport-name">Sport / Activity Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="add-sport-name"
                                placeholder="e.g., Zumba, Krav Maga, Cricket, Yoga"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="add-sport-category">Category <span className="text-red-500">*</span></Label>
                            <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                <SelectTrigger id="add-sport-category" className="w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SPORT_CATEGORIES.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="add-sport-desc">Description <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                            <Textarea
                                id="add-sport-desc"
                                placeholder="Brief description of this sport or activity"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2">
                        <Button variant="outline" onClick={() => setShowAddModal(false)} className="w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} disabled={saving} className="w-full sm:w-auto">
                            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                            Add Sport
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Sport Modal */}
            <Dialog open={showEditModal} onOpenChange={(open) => {
                setShowEditModal(open);
                if (!open) {
                    setEditingSport(null);
                    setFormData({ name: '', category: '', description: '', icon: '' });
                }
            }}>
                <DialogContent className="sm:max-w-[480px] w-[calc(100%-2rem)] mx-auto">
                    <DialogHeader className="text-left">
                        <DialogTitle>Edit Sport</DialogTitle>
                        <DialogDescription>
                            Update the details of this sport or activity.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-sport-name">Sport / Activity Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="edit-sport-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-sport-category">Category <span className="text-red-500">*</span></Label>
                            <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                <SelectTrigger id="edit-sport-category" className="w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SPORT_CATEGORIES.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-sport-desc">Description <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                            <Textarea
                                id="edit-sport-desc"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-2">
                        <Button variant="outline" onClick={() => setShowEditModal(false)} className="w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={saving} className="w-full sm:w-auto">
                            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}