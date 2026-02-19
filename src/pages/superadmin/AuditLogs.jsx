import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Filter, Loader2, RefreshCw } from 'lucide-react';
import superadminService from '@/services/superadminService';
import { toast } from 'sonner';

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  useEffect(() => {
    fetchAuditLogs();
  }, [pagination.page, roleFilter, actionFilter]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(roleFilter !== 'all' && { userRole: roleFilter }),
        ...(actionFilter !== 'all' && { method: actionFilter.toUpperCase() }),
      };

      const response = await superadminService.getAuditLogs(params);

      if (response.status === 'success') {
        setLogs(response.data.logs || []);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      toast.error('Failed to load audit logs');
      // Use mock data as fallback
      setLogs([
        {
          _id: '1',
          createdAt: '2026-01-22T14:30:25Z',
          userName: 'Mike Admin',
          userRole: 'admin',
          action: 'Updated member profile',
          resource: 'member',
          method: 'UPDATE',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: { target: 'John Doe' },
        },
        {
          _id: '2',
          createdAt: '2026-01-22T13:15:10Z',
          userName: 'Super Admin',
          userRole: 'superadmin',
          action: 'Created new admin',
          resource: 'admin',
          method: 'CREATE',
          ipAddress: '192.168.1.50',
          status: 'success',
          details: { target: 'Jane Manager' },
        },
        {
          _id: '3',
          createdAt: '2026-01-22T12:45:33Z',
          userName: 'Mike Admin',
          userRole: 'admin',
          action: 'Approved coach',
          resource: 'coach',
          method: 'UPDATE',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: { target: 'David Lee' },
        },
        {
          _id: '4',
          createdAt: '2026-01-22T11:20:15Z',
          userName: 'Super Admin',
          userRole: 'superadmin',
          action: 'Modified payment gateway',
          resource: 'payment-gateway',
          method: 'UPDATE',
          ipAddress: '192.168.1.50',
          status: 'success',
          details: { target: 'Stripe' },
        },
        {
          _id: '5',
          createdAt: '2026-01-22T10:05:42Z',
          userName: 'Mike Admin',
          userRole: 'admin',
          action: 'Cancelled session',
          resource: 'session',
          method: 'UPDATE',
          ipAddress: '192.168.1.100',
          status: 'success',
          details: { target: 'Morning Yoga Flow' },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await superadminService.exportSystemData('audit-logs');
      if (response.status === 'success') {
        toast.success('Audit logs exported successfully');
        // Handle file download if needed
      }
    } catch (error) {
      console.error('Failed to export audit logs:', error);
      toast.error('Failed to export audit logs');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'superadmin':
        return 'bg-red-500';
      case 'admin':
        return 'bg-purple-500';
      case 'coach':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getActionColor = (action, method) => {
    if (method === 'CREATE' || action?.includes('Created') || action?.includes('Approved')) return 'text-green-600';
    if (method === 'DELETE' || action?.includes('Deleted') || action?.includes('Cancelled')) return 'text-red-600';
    if (method === 'UPDATE' || action?.includes('Updated') || action?.includes('Modified')) return 'text-yellow-600';
    return 'text-muted-foreground';
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">View system activity logs with timestamp, actor, action, and changes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAuditLogs} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Activity Logs</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="superadmin">Superadmin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="coach">Coach</SelectItem>
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Created</SelectItem>
                <SelectItem value="update">Updated</SelectItem>
                <SelectItem value="delete">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <span className="ml-2 text-muted-foreground">Loading audit logs...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No audit logs found
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log._id}
                    className="p-4 rounded-lg border hover:border-primary-600 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getRoleBadgeColor(log.userRole)}>
                          {log.userRole}
                        </Badge>
                        <span className="font-medium">{log.userName}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className={`text-sm mb-2 ${getActionColor(log.action, log.method)}`}>
                      <span className="font-medium">{log.action}</span>
                      {log.details?.target && (
                        <>
                          {' on '}
                          <span className="font-medium">{log.details.target}</span>
                        </>
                      )}
                      <Badge variant="outline" className="ml-2">
                        {log.resource}
                      </Badge>
                    </div>
                    {log.details?.changes && log.details.changes.length > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                        <p className="text-xs font-semibold mb-2">Changes:</p>
                        <div className="space-y-1">
                          {log.details.changes.map((change, idx) => (
                            <div key={idx} className="text-xs">
                              <span className="font-medium">{change.field}:</span>{' '}
                              <span className="text-red-600 line-through">{change.oldValue || 'empty'}</span>
                              {' → '}
                              <span className="text-green-600">{change.newValue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>IP: {log.ipAddress}</span>
                      <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className="text-xs">
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total logs)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}