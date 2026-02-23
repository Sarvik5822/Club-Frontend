import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Bell, Calendar, User, Search, RefreshCw, ChevronLeft, ChevronRight, Paperclip } from 'lucide-react';
import coachService from '@/services/coachService';
import { toast } from 'sonner';

export default function CoachAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const LIMIT = 10;

  const fetchAnnouncements = async (currentPage = 1) => {
    try {
      setLoading(true);
      const res = await coachService.getAnnouncements({ page: currentPage, limit: LIMIT });
      setAnnouncements(res.data?.announcements || []);
      setTotalPages(res.data?.totalPages || res.pages || 1);
      setTotal(res.data?.total || res.total || 0);
    } catch (error) {
      toast.error('Failed to load announcements: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(page);
  }, [page]);

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
          <p className="text-muted-foreground mt-1">Stay updated with the latest news and updates</p>
        </div>
        <Button variant="outline" onClick={() => fetchAnnouncements(page)} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search announcements..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {total > 0 && (
        <p className="text-sm text-muted-foreground">{total} announcements total</p>
      )}

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
              {searchTerm ? 'Try adjusting your search' : 'No announcements available at this time'}
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
                          {(announcement.author || announcement.authorId?.name) && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {announcement.author || announcement.authorId?.name || 'Admin'}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(announcement.publishDate || announcement.createdAt).toLocaleDateString()}
                          </span>
                          {announcement.targetAudience && (
                            <Badge variant="outline" className="text-xs">
                              {getAudienceLabel(announcement.targetAudience)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {announcement.priority && (
                      <Badge variant={config.badge} className="capitalize flex-shrink-0">
                        {announcement.priority}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{announcement.content}</p>
                  {/* Show attachments count if any */}
                  {announcement.attachments && announcement.attachments.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Paperclip className="h-3 w-3" />
                      {announcement.attachments.length} attachment{announcement.attachments.length > 1 ? 's' : ''}
                    </div>
                  )}

                  {announcement.expiryDate && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Valid until {new Date(announcement.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                  <Button variant="link" className="p-0 h-auto mt-2 text-sm">
                    Read more →
                  </Button>
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
                {selectedAnnouncement.targetAudience && (
                  <Badge variant="outline" className="capitalize">
                    For: {getAudienceLabel(selectedAnnouncement.targetAudience)}
                  </Badge>
                )}
                {(selectedAnnouncement.author || selectedAnnouncement.authorId?.name) && (
                  <Badge variant="secondary">
                    By: {selectedAnnouncement.author || selectedAnnouncement.authorId?.name}
                  </Badge>
                )}
              </div>
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

              {selectedAnnouncement.expiryDate && (
                <p className="text-sm text-muted-foreground border-t pt-3">
                  Valid until: {new Date(selectedAnnouncement.expiryDate).toLocaleDateString()}
                </p>
              )}
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