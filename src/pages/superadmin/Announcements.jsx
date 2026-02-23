import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Bell, Calendar, User, Search, RefreshCw, ChevronLeft, ChevronRight, Building2, Eye, BarChart3, Paperclip } from 'lucide-react';
import superadminService from '@/services/superadminService';
import { toast } from 'sonner';

export default function SuperadminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState({ totalAnnouncements: 0, publishedAnnouncements: 0 });
  const LIMIT = 10;

  const fetchAnnouncements = async (currentPage = 1) => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: LIMIT };
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await superadminService.getAnnouncements(params);
      setAnnouncements(res.data?.announcements || []);
      setTotalPages(res.data?.totalPages || 1);
      setTotal(res.data?.total || 0);
    } catch (error) {
      toast.error('Failed to load announcements: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await superadminService.getAnnouncementStats();
      setStats(res.data || { totalAnnouncements: 0, publishedAnnouncements: 0 });
    } catch (error) {
      console.error('Failed to fetch announcement stats:', error);
    }
  };

  useEffect(() => {
    fetchAnnouncements(page);
    fetchStats();
  }, [page, statusFilter]);

  const handleViewDetail = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailModal(true);
  };

  const filteredAnnouncements = announcements.filter(a =>
    a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return { bg: 'bg-destructive/10', icon: 'text-destructive', badge: 'destructive' };
      case 'medium':
        return { bg: 'bg-yellow-100 dark:bg-yellow-900/20', icon: 'text-yellow-600', badge: 'secondary' };
      default:
        return { bg: 'bg-blue-100 dark:bg-blue-900/20', icon: 'text-blue-600', badge: 'default' };
    }
  };

  const getAudienceLabel = (audience) => {
    if (!audience) return '';
    if (Array.isArray(audience)) {
      return audience.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ');
    }
    return audience;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground mt-1">View all announcements across all branches</p>
        </div>
        <Button variant="outline" onClick={() => { fetchAnnouncements(page); fetchStats(); }} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Announcements</p>
              <p className="text-2xl font-bold">{stats.totalAnnouncements}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Bell className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="text-2xl font-bold">{stats.publishedAnnouncements}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
              <Eye className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Draft / Archived</p>
              <p className="text-2xl font-bold">{stats.totalAnnouncements - stats.publishedAnnouncements}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader>
                <div className="flex gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">No announcements found</p>
            <p className="text-muted-foreground mt-1">
              {searchTerm ? 'Try adjusting your search' : 'No announcements available'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => {
            const config = getPriorityConfig(announcement.priority);
            return (
              <Card
                key={announcement._id}
                className="card-hover cursor-pointer"
                onClick={() => handleViewDetail(announcement)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${config.bg}`}>
                        <Bell className={`h-5 w-5 ${config.icon}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{announcement.title}</CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                          {(announcement.author || announcement.authorId?.name || announcement.createdBy?.name) && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {announcement.author || announcement.authorId?.name || announcement.createdBy?.name || 'Admin'}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(announcement.publishDate || announcement.createdAt).toLocaleDateString()}
                          </span>
                          {announcement.branches && announcement.branches.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {announcement.branches.map(b => b.name || b.code || b).join(', ')}
                            </span>
                          )}
                          {announcement.targetAudience && (
                            <Badge variant="outline" className="text-xs">
                              {getAudienceLabel(announcement.targetAudience)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {announcement.priority && (
                        <Badge variant={config.badge} className="capitalize">
                          {announcement.priority}
                        </Badge>
                      )}
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
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{announcement.content}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    {announcement.expiryDate && (
                      <span>Expires: {new Date(announcement.expiryDate).toLocaleDateString()}</span>
                    )}
                    {announcement.viewCount > 0 && (
                      <span>Views: {announcement.viewCount}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !searchTerm && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
            <DialogDescription>
              {selectedAnnouncement?.createdAt && (
                <span className="flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(selectedAnnouncement.createdAt).toLocaleString()}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedAnnouncement && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 flex-wrap">
                {selectedAnnouncement.priority && (
                  <Badge variant={getPriorityConfig(selectedAnnouncement.priority).badge} className="capitalize">
                    {selectedAnnouncement.priority} Priority
                  </Badge>
                )}
                <Badge variant={
                  selectedAnnouncement.status === 'published' ? 'default' :
                    selectedAnnouncement.status === 'draft' ? 'secondary' : 'outline'
                }>
                  {selectedAnnouncement.status}
                </Badge>
                {selectedAnnouncement.targetAudience && (
                  <Badge variant="outline" className="capitalize">
                    For: {getAudienceLabel(selectedAnnouncement.targetAudience)}
                  </Badge>
                )}
                {(selectedAnnouncement.author || selectedAnnouncement.authorId?.name || selectedAnnouncement.createdBy?.name) && (
                  <Badge variant="secondary">
                    By: {selectedAnnouncement.author || selectedAnnouncement.authorId?.name || selectedAnnouncement.createdBy?.name}
                  </Badge>
                )}
              </div>

              {selectedAnnouncement.branches && selectedAnnouncement.branches.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>Branch: {selectedAnnouncement.branches.map(b => b.name || b.code || b).join(', ')}</span>
                </div>
              )}

              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {selectedAnnouncement.content}
              </p>

              {/* Show attachments in detail modal */}
              {selectedAnnouncement.attachments && selectedAnnouncement.attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Attachments</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnnouncement.attachments.map((att, idx) => (
                      <a
                        key={idx}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs bg-muted px-3 py-1.5 rounded-md hover:bg-muted/80 transition-colors text-blue-600 dark:text-blue-400"
                      >
                        <Paperclip className="h-3 w-3" />
                        {att.filename}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-3 space-y-1 text-sm text-muted-foreground">
                {selectedAnnouncement.publishDate && (
                  <p>Published: {new Date(selectedAnnouncement.publishDate).toLocaleDateString()}</p>
                )}
                {selectedAnnouncement.expiryDate && (
                  <p>Expires: {new Date(selectedAnnouncement.expiryDate).toLocaleDateString()}</p>
                )}
                {selectedAnnouncement.viewCount > 0 && (
                  <p>Views: {selectedAnnouncement.viewCount}</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}