import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Clock, Eye, IndianRupee, Globe, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';

// Reusable Event Form component used by both Create and Edit modals
function EventForm({ event, setEvent, nested = false }) {
    const handleChange = (field, value) => {
        setEvent((prev) => ({ ...prev, [field]: value }));
    };

    const handleLocationChange = (field, value) => {
        setEvent((prev) => ({
            ...prev,
            location: { ...prev.location, [field]: value },
        }));
    };

    const handleRegistrationChange = (field, value) => {
        setEvent((prev) => ({
            ...prev,
            registration: { ...prev.registration, [field]: value },
        }));
    };

    const handlePricingChange = (field, value) => {
        setEvent((prev) => ({
            ...prev,
            pricing: { ...prev.pricing, [field]: value },
        }));
    };

    const handleTagsChange = (value) => {
        const tagsArray = value.split(',').map((t) => t.trim()).filter(Boolean);
        setEvent((prev) => ({ ...prev, tags: tagsArray }));
    };

    return (
        <div className="space-y-4 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="font-semibold">Basic Information</h3>
                <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                        placeholder="Event title"
                        value={event.title || ''}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        placeholder="Event description..."
                        rows={3}
                        value={event.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Event Type</Label>
                        <Select
                            value={event.type || 'other'}
                            onValueChange={(value) => handleChange('type', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="competition">Competition</SelectItem>
                                <SelectItem value="workshop">Workshop</SelectItem>
                                <SelectItem value="seminar">Seminar</SelectItem>
                                <SelectItem value="tournament">Tournament</SelectItem>
                                <SelectItem value="social">Social</SelectItem>
                                <SelectItem value="fitness_challenge">Fitness Challenge</SelectItem>
                                <SelectItem value="open_day">Open Day</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                            value={event.category || 'sports'}
                            onValueChange={(value) => handleChange('category', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sports">Sports</SelectItem>
                                <SelectItem value="fitness">Fitness</SelectItem>
                                <SelectItem value="wellness">Wellness</SelectItem>
                                <SelectItem value="social">Social</SelectItem>
                                <SelectItem value="educational">Educational</SelectItem>
                                <SelectItem value="promotional">Promotional</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {/* Tags */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Tags
                    </Label>
                    <Input
                        placeholder="e.g. basketball, tournament, competition (comma separated)"
                        value={(event.tags || []).join(', ')}
                        onChange={(e) => handleTagsChange(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Separate tags with commas</p>
                </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-4">
                <h3 className="font-semibold">Date & Time</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Start Date *</Label>
                        <Input
                            type="date"
                            value={event.startDate || ''}
                            onChange={(e) => handleChange('startDate', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>End Date *</Label>
                        <Input
                            type="date"
                            value={event.endDate || ''}
                            onChange={(e) => handleChange('endDate', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input
                            type="time"
                            value={event.startTime || ''}
                            onChange={(e) => handleChange('startTime', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input
                            type="time"
                            value={event.endTime || ''}
                            onChange={(e) => handleChange('endTime', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
                <h3 className="font-semibold">Location</h3>
                <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Online Event
                    </Label>
                    <Switch
                        checked={event.location?.isOnline || false}
                        onCheckedChange={(checked) => handleLocationChange('isOnline', checked)}
                    />
                </div>
                {event.location?.isOnline ? (
                    <div className="space-y-2">
                        <Label>Online Meeting Link</Label>
                        <Input
                            placeholder="https://meet.google.com/... or https://zoom.us/..."
                            value={event.location?.onlineLink || ''}
                            onChange={(e) => handleLocationChange('onlineLink', e.target.value)}
                        />
                    </div>
                ) : (
                    <>
                        <div className="space-y-2">
                            <Label>Venue</Label>
                            <Input
                                placeholder="Venue name"
                                value={event.location?.venue || ''}
                                onChange={(e) => handleLocationChange('venue', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Address</Label>
                            <Input
                                placeholder="Street address"
                                value={event.location?.address || ''}
                                onChange={(e) => handleLocationChange('address', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>City</Label>
                            <Input
                                placeholder="City"
                                value={event.location?.city || ''}
                                onChange={(e) => handleLocationChange('city', e.target.value)}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Registration */}
            <div className="space-y-4">
                <h3 className="font-semibold">Registration</h3>
                <div className="flex items-center justify-between">
                    <Label>Registration Required</Label>
                    <Switch
                        checked={event.registration?.isRequired ?? true}
                        onCheckedChange={(checked) => handleRegistrationChange('isRequired', checked)}
                    />
                </div>
                {(event.registration?.isRequired ?? true) && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Max Participants</Label>
                                <Input
                                    type="number"
                                    value={event.registration?.maxParticipants ?? 100}
                                    onChange={(e) => handleRegistrationChange('maxParticipants', parseInt(e.target.value) || 0)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Registration Deadline</Label>
                                <Input
                                    type="date"
                                    value={event.registration?.registrationDeadline ? (typeof event.registration.registrationDeadline === 'string' && event.registration.registrationDeadline.includes('T') ? event.registration.registrationDeadline.split('T')[0] : event.registration.registrationDeadline) : ''}
                                    onChange={(e) => handleRegistrationChange('registrationDeadline', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Enable Waitlist</Label>
                            <Switch
                                checked={event.registration?.waitlistEnabled || false}
                                onCheckedChange={(checked) => handleRegistrationChange('waitlistEnabled', checked)}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Pricing */}
            <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                    <IndianRupee className="h-4 w-4" />
                    Pricing
                </h3>
                <div className="flex items-center justify-between">
                    <Label>Free Event</Label>
                    <Switch
                        checked={event.pricing?.isFree ?? true}
                        onCheckedChange={(checked) => handlePricingChange('isFree', checked)}
                    />
                </div>
                {!(event.pricing?.isFree ?? true) && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Member Price (₹)</Label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={event.pricing?.memberPrice ?? 0}
                                    onChange={(e) => handlePricingChange('memberPrice', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Non-Member Price (₹)</Label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={event.pricing?.nonMemberPrice ?? 0}
                                    onChange={(e) => handlePricingChange('nonMemberPrice', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Early Bird Price (₹)</Label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={event.pricing?.earlyBirdPrice ?? ''}
                                    onChange={(e) => handlePricingChange('earlyBirdPrice', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Early Bird Deadline</Label>
                                <Input
                                    type="date"
                                    value={event.pricing?.earlyBirdDeadline ? (typeof event.pricing.earlyBirdDeadline === 'string' && event.pricing.earlyBirdDeadline.includes('T') ? event.pricing.earlyBirdDeadline.split('T')[0] : event.pricing.earlyBirdDeadline) : ''}
                                    onChange={(e) => handlePricingChange('earlyBirdDeadline', e.target.value)}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Settings */}
            <div className="space-y-4">
                <h3 className="font-semibold">Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Visibility</Label>
                        <Select
                            value={event.visibility || 'members_only'}
                            onValueChange={(value) => handleChange('visibility', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="members_only">Members Only</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                            value={event.status || 'draft'}
                            onValueChange={(value) => handleChange('status', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                {nested && <SelectItem value="ongoing">Ongoing</SelectItem>}
                                {nested && <SelectItem value="completed">Completed</SelectItem>}
                                {nested && <SelectItem value="cancelled">Cancelled</SelectItem>}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}

const initialEventState = {
    title: '',
    description: '',
    type: 'other',
    category: 'sports',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: {
        venue: '',
        address: '',
        city: '',
        isOnline: false,
        onlineLink: '',
    },
    registration: {
        isRequired: true,
        maxParticipants: 100,
        registrationDeadline: '',
        waitlistEnabled: false,
    },
    pricing: {
        isFree: true,
        memberPrice: 0,
        nonMemberPrice: 0,
        earlyBirdPrice: '',
        earlyBirdDeadline: '',
    },
    tags: [],
    visibility: 'members_only',
    status: 'draft',
};

export default function Events() {
    const { toast } = useToast();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        type: 'all',
        status: 'all',
    });
    const [newEvent, setNewEvent] = useState({ ...initialEventState });

    useEffect(() => {
        fetchEvents();
    }, [filters]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.type && filters.type !== 'all') params.type = filters.type;
            if (filters.status && filters.status !== 'all') params.status = filters.status;

            const response = await adminService.getEvents(params);
            setEvents(response.data.events || []);
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to fetch events',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            if (!newEvent.title || !newEvent.startDate || !newEvent.endDate) {
                toast({
                    title: 'Validation Error',
                    description: 'Please fill in all required fields (Title, Start Date, End Date)',
                    variant: 'destructive',
                });
                return;
            }

            await adminService.createEvent(newEvent);
            toast({
                title: 'Success',
                description: 'Event created successfully',
            });
            setShowCreateModal(false);
            setNewEvent({ ...initialEventState });
            fetchEvents();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create event',
                variant: 'destructive',
            });
        }
    };

    const handleEdit = (event) => {
        setEditingEvent({
            ...event,
            startDate: event.startDate ? new Date(event.startDate).toISOString().split('T')[0] : '',
            endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
            location: event.location || { venue: '', address: '', city: '', isOnline: false, onlineLink: '' },
            registration: event.registration || { isRequired: true, maxParticipants: 100, registrationDeadline: '', waitlistEnabled: false },
            pricing: event.pricing || { isFree: true, memberPrice: 0, nonMemberPrice: 0, earlyBirdPrice: '', earlyBirdDeadline: '' },
            tags: event.tags || [],
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        try {
            await adminService.updateEvent(editingEvent._id, editingEvent);
            toast({
                title: 'Success',
                description: 'Event updated successfully',
            });
            setShowEditModal(false);
            setEditingEvent(null);
            fetchEvents();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update event',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            await adminService.deleteEvent(id);
            toast({
                title: 'Success',
                description: 'Event deleted successfully',
            });
            fetchEvents();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete event',
                variant: 'destructive',
            });
        }
    };

    const handleViewDetails = (event) => {
        setSelectedEvent(event);
        setShowDetailsModal(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published':
                return 'default';
            case 'ongoing':
                return 'default';
            case 'completed':
                return 'secondary';
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'competition':
                return 'destructive';
            case 'tournament':
                return 'destructive';
            case 'workshop':
                return 'default';
            case 'seminar':
                return 'default';
            default:
                return 'secondary';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Events</h1>
                    <p className="text-muted-foreground mt-1">Manage and organize events for your branch</p>
                </div>
                <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Event</DialogTitle>
                        </DialogHeader>
                        <EventForm event={newEvent} setEvent={setNewEvent} nested={false} />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                            <Button onClick={handleCreate}>Create Event</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Search</Label>
                            <Input
                                placeholder="Search events..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select
                                value={filters.type}
                                onValueChange={(value) => setFilters({ ...filters, type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="competition">Competition</SelectItem>
                                    <SelectItem value="workshop">Workshop</SelectItem>
                                    <SelectItem value="seminar">Seminar</SelectItem>
                                    <SelectItem value="tournament">Tournament</SelectItem>
                                    <SelectItem value="social">Social</SelectItem>
                                    <SelectItem value="fitness_challenge">Fitness Challenge</SelectItem>
                                    <SelectItem value="open_day">Open Day</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={filters.status}
                                onValueChange={(value) => setFilters({ ...filters, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="ongoing">Ongoing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Events List */}
            <div className="grid gap-4">
                {events.map((event) => (
                    <Card key={event._id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-xl">{event.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {event.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                    <Badge variant={getTypeColor(event.type)}>
                                        {(event.type || '').replace('_', ' ')}
                                    </Badge>
                                    <Badge variant={getStatusColor(event.status)}>
                                        {event.status}
                                    </Badge>
                                    {event.pricing && !event.pricing.isFree && (
                                        <Badge variant="outline" className="text-green-600 border-green-600">
                                            <IndianRupee className="h-3 w-3 mr-1" />
                                            Paid
                                        </Badge>
                                    )}
                                    {event.location?.isOnline && (
                                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                                            <Globe className="h-3 w-3 mr-1" />
                                            Online
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(event.startDate).toLocaleDateString()}</span>
                                </div>
                                {event.startTime && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>{event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}</span>
                                    </div>
                                )}
                                {event.location?.isOnline ? (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Globe className="h-4 w-4" />
                                        <span>Online Event</span>
                                    </div>
                                ) : event.location?.venue ? (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span className="truncate">{event.location.venue}</span>
                                    </div>
                                ) : null}
                                {event.registration?.maxParticipants && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>
                                            {event.registration.currentParticipants || 0}/{event.registration.maxParticipants}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {/* Tags */}
                            {event.tags && event.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {event.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="text-sm text-muted-foreground">
                                    Created: {new Date(event.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(event)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleEdit(event)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(event._id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {events.length === 0 && (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No events found</p>
                            <p className="text-sm text-muted-foreground mt-1">Create your first event to get started</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Edit Event Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                    </DialogHeader>
                    {editingEvent && (
                        <EventForm event={editingEvent} setEvent={setEditingEvent} nested={true} />
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
                        <Button onClick={handleUpdate}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Event Details Modal */}
            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Event Details</DialogTitle>
                    </DialogHeader>
                    {selectedEvent && (
                        <div className="space-y-6 py-4">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">{selectedEvent.title}</h3>
                                <p className="text-muted-foreground">{selectedEvent.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Type</Label>
                                    <p className="font-medium capitalize">{(selectedEvent.type || '').replace('_', ' ')}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Category</Label>
                                    <p className="font-medium capitalize">{selectedEvent.category}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Status</Label>
                                    <Badge variant={getStatusColor(selectedEvent.status)} className="mt-1">
                                        {selectedEvent.status}
                                    </Badge>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Visibility</Label>
                                    <p className="font-medium capitalize">{(selectedEvent.visibility || '').replace('_', ' ')}</p>
                                </div>
                            </div>

                            <div>
                                <Label className="text-muted-foreground">Date & Time</Label>
                                <div className="mt-2 space-y-1">
                                    <p className="font-medium">
                                        {new Date(selectedEvent.startDate).toLocaleDateString()} - {new Date(selectedEvent.endDate).toLocaleDateString()}
                                    </p>
                                    {selectedEvent.startTime && selectedEvent.endTime && (
                                        <p className="text-sm text-muted-foreground">
                                            {selectedEvent.startTime} - {selectedEvent.endTime}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <Label className="text-muted-foreground">Location</Label>
                                <div className="mt-2 space-y-1">
                                    {selectedEvent.location?.isOnline ? (
                                        <>
                                            <p className="font-medium flex items-center gap-2">
                                                <Globe className="h-4 w-4" /> Online Event
                                            </p>
                                            {selectedEvent.location.onlineLink && (
                                                <a href={selectedEvent.location.onlineLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                                    {selectedEvent.location.onlineLink}
                                                </a>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {selectedEvent.location?.venue && (
                                                <p className="font-medium">{selectedEvent.location.venue}</p>
                                            )}
                                            {selectedEvent.location?.address && (
                                                <p className="text-sm text-muted-foreground">{selectedEvent.location.address}</p>
                                            )}
                                            {selectedEvent.location?.city && (
                                                <p className="text-sm text-muted-foreground">{selectedEvent.location.city}</p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Registration */}
                            {selectedEvent.registration && (
                                <div>
                                    <Label className="text-muted-foreground">Registration</Label>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-sm">
                                            Registration: {selectedEvent.registration.isRequired ? 'Required' : 'Not Required'}
                                        </p>
                                        <p className="text-sm">
                                            Participants: {selectedEvent.registration.currentParticipants || 0} / {selectedEvent.registration.maxParticipants}
                                        </p>
                                        {selectedEvent.registration.waitlistEnabled && (
                                            <p className="text-sm text-muted-foreground">Waitlist: Enabled</p>
                                        )}
                                        {selectedEvent.registration.registrationDeadline && (
                                            <p className="text-sm text-muted-foreground">
                                                Deadline: {new Date(selectedEvent.registration.registrationDeadline).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Pricing */}
                            {selectedEvent.pricing && (
                                <div>
                                    <Label className="text-muted-foreground">Pricing</Label>
                                    <div className="mt-2 space-y-1">
                                        {selectedEvent.pricing.isFree ? (
                                            <p className="text-sm font-medium text-green-600">Free Event</p>
                                        ) : (
                                            <>
                                                <p className="text-sm">Member Price: ₹{selectedEvent.pricing.memberPrice}</p>
                                                <p className="text-sm">Non-Member Price: ₹{selectedEvent.pricing.nonMemberPrice}</p>
                                                {selectedEvent.pricing.earlyBirdPrice > 0 && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Early Bird: ₹{selectedEvent.pricing.earlyBirdPrice}
                                                        {selectedEvent.pricing.earlyBirdDeadline && (
                                                            <> (until {new Date(selectedEvent.pricing.earlyBirdDeadline).toLocaleDateString()})</>
                                                        )}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                                <div>
                                    <Label className="text-muted-foreground">Tags</Label>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {selectedEvent.tags.map((tag, index) => (
                                            <Badge key={index} variant="outline">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDetailsModal(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}