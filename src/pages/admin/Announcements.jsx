import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Send, Building2, Archive, Paperclip, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';

const AUDIENCE_OPTIONS = [
  { id: 'member', label: 'Members' },
  { id: 'coach', label: 'Coaches' },
  { id: 'admin', label: 'Admins' },
  { id: 'superadmin', label: 'Super Admins' },
];

export default function Announcements() {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    targetAudience: ['member'],
    priority: 'medium',
    publishDate: '',
    expiryDate: '',
    status: 'draft',
    attachments: []
  });

  // Attachment input state for create form
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');

  // Attachment input state for edit form
  const [editAttachmentName, setEditAttachmentName] = useState('');
  const [editAttachmentUrl, setEditAttachmentUrl] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAnnouncements();
      setAnnouncements(response.data.announcements || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch announcements',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAudienceChange = (audienceId, checked, isEdit = false) => {
    if (isEdit && editingAnnouncement) {
      const current = editingAnnouncement.targetAudience || [];
      const updated = checked
        ? [...current, audienceId]
        : current.filter((a) => a !== audienceId);
      setEditingAnnouncement({ ...editingAnnouncement, targetAudience: updated });
    } else {
      const current = newAnnouncement.targetAudience || [];
      const updated = checked
        ? [...current, audienceId]
        : current.filter((a) => a !== audienceId);
      setNewAnnouncement({ ...newAnnouncement, targetAudience: updated });
    }
  };

  // Add attachment to create form
  const handleAddAttachment = () => {
    if (!newAttachmentName.trim() || !newAttachmentUrl.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Both filename and URL are required for attachment',
        variant: 'destructive',
      });
      return;
    }
    setNewAnnouncement({
      ...newAnnouncement,
      attachments: [...(newAnnouncement.attachments || []), { filename: newAttachmentName.trim(), url: newAttachmentUrl.trim() }]
    });
    setNewAttachmentName('');
    setNewAttachmentUrl('');
  };

  // Remove attachment from create form
  const handleRemoveAttachment = (index) => {
    const updated = [...(newAnnouncement.attachments || [])];
    updated.splice(index, 1);
    setNewAnnouncement({ ...newAnnouncement, attachments: updated });
  };

  // Add attachment to edit form
  const handleAddEditAttachment = () => {
    if (!editAttachmentName.trim() || !editAttachmentUrl.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Both filename and URL are required for attachment',
        variant: 'destructive',
      });
      return;
    }
    setEditingAnnouncement({
      ...editingAnnouncement,
      attachments: [...(editingAnnouncement.attachments || []), { filename: editAttachmentName.trim(), url: editAttachmentUrl.trim() }]
    });
    setEditAttachmentName('');
    setEditAttachmentUrl('');
  };

  // Remove attachment from edit form
  const handleRemoveEditAttachment = (index) => {
    const updated = [...(editingAnnouncement.attachments || [])];
    updated.splice(index, 1);
    setEditingAnnouncement({ ...editingAnnouncement, attachments: updated });
  };

  const handleCreate = async () => {
    try {
      if (newAnnouncement.targetAudience.length === 0) {
        toast({
          title: 'Validation Error',
          description: 'Please select at least one target audience',
          variant: 'destructive',
        });
        return;
      }

      const payload = { ...newAnnouncement };
      // Remove empty optional fields
      if (!payload.publishDate) delete payload.publishDate;
      if (!payload.expiryDate) delete payload.expiryDate;
      if (!payload.attachments || payload.attachments.length === 0) delete payload.attachments;

      await adminService.createAnnouncement(payload);
      toast({
        title: 'Success',
        description: 'Announcement created successfully',
      });
      setShowCreateModal(false);
      setNewAnnouncement({
        title: '',
        content: '',
        targetAudience: ['member'],
        priority: 'medium',
        publishDate: '',
        expiryDate: '',
        status: 'draft',
        attachments: []
      });
      setNewAttachmentName('');
      setNewAttachmentUrl('');
      fetchAnnouncements();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create announcement',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement({
      ...announcement,
      targetAudience: announcement.targetAudience || ['member'],
      attachments: announcement.attachments || [],
      publishDate: announcement.publishDate
        ? new Date(announcement.publishDate).toISOString().split('T')[0]
        : '',
      expiryDate: announcement.expiryDate
        ? new Date(announcement.expiryDate).toISOString().split('T')[0]
        : '',
    });
    setEditAttachmentName('');
    setEditAttachmentUrl('');
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      if (editingAnnouncement.targetAudience.length === 0) {
        toast({
          title: 'Validation Error',
          description: 'Please select at least one target audience',
          variant: 'destructive',
        });
        return;
      }

      const payload = {
        title: editingAnnouncement.title,
        content: editingAnnouncement.content,
        targetAudience: editingAnnouncement.targetAudience,
        priority: editingAnnouncement.priority,
        status: editingAnnouncement.status,
        publishDate: editingAnnouncement.publishDate || undefined,
        expiryDate: editingAnnouncement.expiryDate || undefined,
        attachments: editingAnnouncement.attachments || [],
      };

      await adminService.updateAnnouncement(editingAnnouncement._id, payload);
      toast({
        title: 'Success',
        description: 'Announcement updated successfully',
      });
      setShowEditModal(false);
      setEditingAnnouncement(null);
      fetchAnnouncements();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update announcement',
        variant: 'destructive',
      });
    }
  };

  const handlePublish = async (id) => {
    try {
      await adminService.publishAnnouncement(id);
      toast({
        title: 'Success',
        description: 'Announcement published',
      });
      fetchAnnouncements();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to publish announcement',
        variant: 'destructive',
      });
    }
  };

  const handleArchive = async (id) => {
    try {
      await adminService.archiveAnnouncement(id);
      toast({
        title: 'Success',
        description: 'Announcement archived',
      });
      fetchAnnouncements();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to archive announcement',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await adminService.deleteAnnouncement(id);
      toast({
        title: 'Success',
        description: 'Announcement deleted',
      });
      fetchAnnouncements();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete announcement',
        variant: 'destructive',
      });
    }
  };

  const getAudienceLabels = (audience) => {
    if (!audience || !Array.isArray(audience)) return 'N/A';
    return audience
      .map((a) => {
        const found = AUDIENCE_OPTIONS.find((opt) => opt.id === a);
        return found ? found.label : a;
      })
      .join(', ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground mt-1">Create and manage announcements for your branch</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="Announcement title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Content <span className="text-destructive">*</span></Label>
                <Textarea
                  placeholder="Announcement content..."
                  rows={5}
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                />
              </div>

              {/* Target Audience - Multi-select checkboxes */}
              <div className="space-y-2">
                <Label>Target Audience <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg">
                  {AUDIENCE_OPTIONS.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`create-audience-${option.id}`}
                        checked={newAnnouncement.targetAudience.includes(option.id)}
                        onCheckedChange={(checked) => handleAudienceChange(option.id, checked, false)}
                      />
                      <label
                        htmlFor={`create-audience-${option.id}`}
                        className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                {newAnnouncement.targetAudience.length === 0 && (
                  <p className="text-xs text-destructive">Select at least one audience</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={newAnnouncement.priority}
                    onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={newAnnouncement.status}
                    onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Publish Date (Optional)</Label>
                  <Input
                    type="date"
                    value={newAnnouncement.publishDate}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, publishDate: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Leave empty to use current date when published</p>
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date (Optional)</Label>
                  <Input
                    type="date"
                    value={newAnnouncement.expiryDate}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-2">
                <Label>Attachments (Optional)</Label>
                <div className="border rounded-lg p-4 space-y-3">
                  {/* Existing attachments list */}
                  {newAnnouncement.attachments && newAnnouncement.attachments.length > 0 && (
                    <div className="space-y-2">
                      {newAnnouncement.attachments.map((att, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm font-medium truncate">{att.filename}</span>
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:underline truncate"
                            >
                              {att.url}
                            </a>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 flex-shrink-0"
                            onClick={() => handleRemoveAttachment(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new attachment inputs */}
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">Filename</Label>
                      <Input
                        placeholder="e.g., schedule.pdf"
                        value={newAttachmentName}
                        onChange={(e) => setNewAttachmentName(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">URL</Label>
                      <Input
                        placeholder="e.g., https://example.com/file.pdf"
                        value={newAttachmentUrl}
                        onChange={(e) => setNewAttachmentUrl(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9"
                      onClick={handleAddAttachment}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!newAnnouncement.title || !newAnnouncement.content}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement._id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground flex-wrap">
                    <span>By {announcement.author || announcement.authorId?.name || 'Admin'}</span>
                    {announcement.branches && announcement.branches.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {announcement.branches[0].name || announcement.branches[0].code}
                      </span>
                    )}
                    {announcement.targetAudience && (
                      <Badge variant="outline" className="text-xs">
                        Audience: {getAudienceLabels(announcement.targetAudience)}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    announcement.priority === 'urgent' ? 'destructive' :
                      announcement.priority === 'high' ? 'destructive' :
                        announcement.priority === 'medium' ? 'default' :
                          'secondary'
                  }>
                    {announcement.priority}
                  </Badge>
                  <Badge variant={
                    announcement.status === 'published' ? 'default' :
                      announcement.status === 'draft' ? 'secondary' :
                        'outline'
                  }>
                    {announcement.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{announcement.content}</p>

              {/* Show attachments if any */}
              {announcement.attachments && announcement.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {announcement.attachments.map((att, idx) => (
                    <a
                      key={idx}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md hover:bg-muted/80 transition-colors"
                    >
                      <Paperclip className="h-3 w-3" />
                      {att.filename}
                    </a>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex gap-4 text-sm text-muted-foreground flex-wrap">
                  <span>Created: {new Date(announcement.createdAt).toLocaleDateString()}</span>
                  {announcement.publishDate && (
                    <span>Published: {new Date(announcement.publishDate).toLocaleDateString()}</span>
                  )}
                  {announcement.expiryDate && (
                    <span>Expires: {new Date(announcement.expiryDate).toLocaleDateString()}</span>
                  )}
                  {announcement.viewCount > 0 && (
                    <span>Views: {announcement.viewCount}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(announcement)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {announcement.status === 'draft' && (
                    <Button size="sm" onClick={() => handlePublish(announcement._id)}>
                      <Send className="h-4 w-4 mr-1" />
                      Publish
                    </Button>
                  )}
                  {announcement.status === 'published' && (
                    <Button size="sm" variant="outline" onClick={() => handleArchive(announcement._id)}>
                      <Archive className="h-4 w-4 mr-1" />
                      Archive
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(announcement._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {announcements.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No announcements found</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Announcement Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          {editingAnnouncement && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title <span className="text-destructive">*</span></Label>
                <Input
                  value={editingAnnouncement.title}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Content <span className="text-destructive">*</span></Label>
                <Textarea
                  value={editingAnnouncement.content}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                  rows={5}
                />
              </div>

              {/* Target Audience - Multi-select checkboxes */}
              <div className="space-y-2">
                <Label>Target Audience <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg">
                  {AUDIENCE_OPTIONS.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-audience-${option.id}`}
                        checked={(editingAnnouncement.targetAudience || []).includes(option.id)}
                        onCheckedChange={(checked) => handleAudienceChange(option.id, checked, true)}
                      />
                      <label
                        htmlFor={`edit-audience-${option.id}`}
                        className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={editingAnnouncement.priority}
                    onValueChange={(value) => setEditingAnnouncement({ ...editingAnnouncement, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editingAnnouncement.status}
                    onValueChange={(value) => setEditingAnnouncement({ ...editingAnnouncement, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Publish Date (Optional)</Label>
                  <Input
                    type="date"
                    value={editingAnnouncement.publishDate}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, publishDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date (Optional)</Label>
                  <Input
                    type="date"
                    value={editingAnnouncement.expiryDate}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Attachments Section for Edit */}
              <div className="space-y-2">
                <Label>Attachments (Optional)</Label>
                <div className="border rounded-lg p-4 space-y-3">
                  {/* Existing attachments list */}
                  {editingAnnouncement.attachments && editingAnnouncement.attachments.length > 0 && (
                    <div className="space-y-2">
                      {editingAnnouncement.attachments.map((att, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm font-medium truncate">{att.filename}</span>
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:underline truncate"
                            >
                              {att.url}
                            </a>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 flex-shrink-0"
                            onClick={() => handleRemoveEditAttachment(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new attachment inputs */}
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">Filename</Label>
                      <Input
                        placeholder="e.g., schedule.pdf"
                        value={editAttachmentName}
                        onChange={(e) => setEditAttachmentName(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">URL</Label>
                      <Input
                        placeholder="e.g., https://example.com/file.pdf"
                        value={editAttachmentUrl}
                        onChange={(e) => setEditAttachmentUrl(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9"
                      onClick={handleAddEditAttachment}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}