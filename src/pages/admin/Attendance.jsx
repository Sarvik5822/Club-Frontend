import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, Filter, Clock, MapPin, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';

export default function Attendance() {
  const { toast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('today');
  const [facilityFilter, setFacilityFilter] = useState('all');

  useEffect(() => {
    fetchAttendance();
    fetchStats();
  }, [searchTerm, dateFilter, facilityFilter]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(dateFilter !== 'all' && { dateRange: dateFilter }),
        ...(facilityFilter !== 'all' && { facility: facilityFilter }),
      };
      const response = await adminService.getAttendance(params);
      setAttendanceRecords(response.data.records || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch attendance records',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminService.getAttendanceStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch attendance stats:', error);
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getAnomalyStatus = (duration) => {
    if (duration < 30) return { type: 'short', label: 'Short Visit', color: 'bg-yellow-500' };
    if (duration > 180) return { type: 'long', label: 'Extended Visit', color: 'bg-orange-500' };
    return { type: 'normal', label: 'Normal', color: 'bg-green-500' };
  };

  const handleExport = () => {
    toast({
      title: 'Success',
      description: 'Attendance report exported successfully',
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('today');
    setFacilityFilter('all');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics from data or use API stats
  const totalVisits = stats?.totalVisits || attendanceRecords.length;
  const uniqueMembers = stats?.uniqueMembers || new Set(attendanceRecords.map(r => r.memberId)).size;
  const avgDuration = stats?.avgDuration || (attendanceRecords.length > 0
    ? Math.round(attendanceRecords.reduce((sum, r) => sum + (r.duration || 0), 0) / attendanceRecords.length)
    : 0);
  const anomalies = stats?.anomalies || attendanceRecords.filter(r => r.duration < 30 || r.duration > 180).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Biometric Attendance Tracking</h1>
          <p className="text-muted-foreground mt-1">Monitor member punch-in/out records and visit patterns</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Visits</p>
                <p className="text-2xl font-bold mt-1">{totalVisits}</p>
                <p className="text-xs text-muted-foreground mt-1">In selected period</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Members</p>
                <p className="text-2xl font-bold mt-1">{uniqueMembers}</p>
                <p className="text-xs text-muted-foreground mt-1">Active visitors</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Duration</p>
                <p className="text-2xl font-bold mt-1">{avgDuration} min</p>
                <p className="text-xs text-muted-foreground mt-1">Per visit</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Anomalies</p>
                <p className="text-2xl font-bold mt-1">{anomalies}</p>
                <p className="text-xs text-muted-foreground mt-1">Unusual visits</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search members..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={facilityFilter} onValueChange={setFacilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by facility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Facilities</SelectItem>
                <SelectItem value="gym">Gym Floor</SelectItem>
                <SelectItem value="pool">Pool</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="court">Sports Court</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {attendanceRecords.length} attendance records
        </p>
      </div>

      {/* Attendance Records */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies Only</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold">Member</th>
                      <th className="text-left p-4 font-semibold">Date</th>
                      <th className="text-left p-4 font-semibold">Facility</th>
                      <th className="text-left p-4 font-semibold">Punch In</th>
                      <th className="text-left p-4 font-semibold">Punch Out</th>
                      <th className="text-left p-4 font-semibold">Duration</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((record) => {
                      const anomaly = getAnomalyStatus(record.duration);

                      return (
                        <tr key={record._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={record.memberAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${record.memberEmail}`}
                                alt={record.memberName}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <p className="font-medium text-sm">{record.memberName || 'Unknown'}</p>
                                <p className="text-xs text-muted-foreground">ID: {record.memberId?.slice(-6) || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm">
                            {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {record.facility || 'N/A'}
                            </div>
                          </td>
                          <td className="p-4 text-sm font-mono">
                            {record.punchInTime ? new Date(record.punchInTime).toLocaleTimeString() : 'N/A'}
                          </td>
                          <td className="p-4 text-sm font-mono">
                            {record.punchOutTime ? new Date(record.punchOutTime).toLocaleTimeString() : 'Active'}
                          </td>
                          <td className="p-4">
                            <span className="font-semibold">{formatDuration(record.duration)}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {record.biometricVerified && (
                                <Badge variant="outline" className="text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                              {anomaly.type !== 'normal' && (
                                <Badge className={`${anomaly.color} text-xs`}>
                                  {anomaly.label}
                                </Badge>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies">
          <Card>
            <CardHeader>
              <CardTitle>Unusual Visit Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendanceRecords
                  .filter(r => r.duration < 30 || r.duration > 180)
                  .map((record) => {
                    const anomaly = getAnomalyStatus(record.duration);

                    return (
                      <div key={record._id} className="p-4 rounded-lg border bg-orange-50 dark:bg-orange-900/20">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={record.memberAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${record.memberEmail}`}
                              alt={record.memberName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-medium">{record.memberName || 'Unknown'}</p>
                              <p className="text-sm text-muted-foreground">
                                {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'} • {record.facility || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <Badge className={anomaly.color}>
                            {anomaly.label}
                          </Badge>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-semibold">{formatDuration(record.duration)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Punch In</p>
                            <p className="font-mono">{record.punchInTime ? new Date(record.punchInTime).toLocaleTimeString() : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Punch Out</p>
                            <p className="font-mono">{record.punchOutTime ? new Date(record.punchOutTime).toLocaleTimeString() : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {attendanceRecords.filter(r => r.duration < 30 || r.duration > 180).length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-semibold mb-2">No Anomalies Detected</h3>
                    <p className="text-muted-foreground">
                      All visits are within normal duration ranges
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {attendanceRecords.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No attendance records found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters to see more results
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}