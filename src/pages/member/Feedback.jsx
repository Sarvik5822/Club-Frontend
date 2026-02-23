import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Star, MessageSquare, RefreshCw, Plus, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import memberService from '@/services/memberService';
import { toast } from 'sonner';

const CATEGORIES = ['facility', 'coach', 'service', 'cleanliness', 'equipment', 'other'];

function StarRating({ value, onChange, size = 'h-8 w-8' }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? 'transition-transform hover:scale-110' : ''}
          disabled={!onChange}
        >
          <Star
            className={`${size} ${star <= (hovered || value)
                ? 'fill-yellow-500 text-yellow-500'
                : 'text-gray-300'
              }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function Feedback() {
  const [myFeedback, setMyFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const [form, setForm] = useState({
    category: '',
    rating: 0,
    subject: '',
    message: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [feedbackRes, statsRes] = await Promise.allSettled([
        memberService.getMyFeedback(),
        memberService.getFeedbackStats(),
      ]);
      if (feedbackRes.status === 'fulfilled') {
        setMyFeedback(feedbackRes.value.data?.feedbacks || []);
      }
      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data);
      }
    } catch (error) {
      toast.error('Failed to load feedback: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!form.category) { toast.error('Please select a category'); return; }
    if (form.rating === 0) { toast.error('Please select a rating'); return; }
    if (!form.subject.trim()) { toast.error('Please enter a subject'); return; }
    if (!form.message.trim()) { toast.error('Please enter your feedback'); return; }

    try {
      setSubmitting(true);
      await memberService.submitFeedback(form);
      toast.success('Feedback submitted successfully!');
      setShowSubmitModal(false);
      setForm({ category: '', rating: 0, subject: '', message: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to submit feedback: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await memberService.deleteFeedback(id);
      toast.success('Feedback deleted');
      setShowDeleteConfirm(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to delete: ' + error.message);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'resolved': return { label: 'Resolved', class: 'bg-green-500 text-white' };
      case 'reviewed': return { label: 'Reviewed', class: 'bg-blue-500 text-white' };
      case 'pending': return { label: 'Pending', class: 'bg-yellow-500 text-white' };
      default: return { label: status, class: 'bg-gray-500 text-white' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feedback & Ratings</h1>
          <p className="text-muted-foreground mt-1">Share your experience and help us improve</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowSubmitModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{stats.total || 0}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-2xl font-bold">{stats.averageRating?.toFixed(1) || '0.0'}</p>
                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              </div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Clock className="h-3 w-3" /> Pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.resolved || 0}</p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Resolved
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* My Feedback History */}
      <Card>
        <CardHeader>
          <CardTitle>My Feedback History</CardTitle>
          <CardDescription>Your submitted feedback and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 border rounded-lg space-y-2">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : myFeedback.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-3" />
              <p>No feedback submitted yet</p>
              <Button className="mt-4" onClick={() => setShowSubmitModal(true)}>
                Submit Your First Feedback
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myFeedback.map((fb) => {
                const statusConfig = getStatusConfig(fb.status);
                return (
                  <div key={fb._id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold">{fb.subject}</h4>
                          <Badge className={statusConfig.class}>{statusConfig.label}</Badge>
                          <Badge variant="outline" className="capitalize">{fb.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(fb.createdAt).toLocaleDateString()}
                          {fb.branchId && ` • ${fb.branchId.name}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StarRating value={fb.rating} size="h-4 w-4" />
                        {fb.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setShowDeleteConfirm(fb._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{fb.message}</p>
                    {fb.adminResponse && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                          Staff Response {fb.respondedBy && `— ${fb.respondedBy.name}`}
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-200">{fb.adminResponse}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Feedback Modal */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
            <DialogDescription>Share your experience to help us improve our services</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm(p => ({ ...p, category: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Rating *</Label>
              <StarRating value={form.rating} onChange={(v) => setForm(p => ({ ...p, rating: v }))} />
            </div>
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Input
                placeholder="Brief subject of your feedback"
                value={form.subject}
                onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Message *</Label>
              <Textarea
                placeholder="Describe your experience in detail..."
                rows={4}
                value={form.message}
                onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Feedback</DialogTitle>
            <DialogDescription>Are you sure you want to delete this feedback? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleDelete(showDeleteConfirm)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}