import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockAnnouncements } from '@/lib/mockData';
import { Bell, Calendar, User } from 'lucide-react';

export default function Announcements() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Announcements</h1>
        <p className="text-muted-foreground mt-1">Stay updated with the latest news and updates</p>
      </div>

      <div className="space-y-4">
        {mockAnnouncements.map((announcement) => (
          <Card key={announcement.id} className="card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    announcement.priority === 'high' ? 'bg-destructive/10' :
                    announcement.priority === 'medium' ? 'bg-warning/10' :
                    'bg-primary-100 dark:bg-primary-900'
                  }`}>
                    <Bell className={`h-5 w-5 ${
                      announcement.priority === 'high' ? 'text-destructive' :
                      announcement.priority === 'medium' ? 'text-warning' :
                      'text-primary-600'
                    }`} />
                  </div>
                  <div>
                    <CardTitle>{announcement.title}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {announcement.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(announcement.publishDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant={
                  announcement.priority === 'high' ? 'destructive' :
                  announcement.priority === 'medium' ? 'secondary' :
                  'default'
                }>
                  {announcement.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{announcement.content}</p>
              {announcement.expiryDate && (
                <p className="text-xs text-muted-foreground mt-3">
                  Valid until {new Date(announcement.expiryDate).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}