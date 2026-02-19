import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, FileText, BarChart3, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import coachService from '@/services/coachService';

export default function CoachReports() {
  const [reportType, setReportType] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [format, setFormat] = useState('pdf');
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeThisMonth: 0,
    avgProgressRate: '0%',
    totalVisits: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await coachService.getDashboard();
      if (response.status === 'success') {
        setStats({
          totalMembers: response.data.stats?.totalMembers || 0,
          activeThisMonth: response.data.stats?.activeThisWeek || 0,
          avgProgressRate: response.data.stats?.avgProgressRate || '0%',
          totalVisits: response.data.stats?.totalSessions || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleGenerateReport = async () => {
    if (!reportType || !timePeriod) {
      toast.error('Please select report type and time period');
      return;
    }

    try {
      setLoading(true);
      const response = await coachService.generateReport({
        reportType,
        startDate: getStartDate(timePeriod),
        endDate: new Date().toISOString(),
        filters: { format }
      });

      if (response.status === 'success') {
        toast.success('Report generated successfully');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (exportFormat) => {
    try {
      const response = await coachService.exportReport({
        format: exportFormat,
        reportType: reportType || 'performance-summary'
      });

      if (response.status === 'success') {
        toast.success(`Exporting report as ${exportFormat.toUpperCase()}...`);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  const getStartDate = (period) => {
    const now = new Date();
    switch (period) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      case 'quarter':
        return new Date(now.setMonth(now.getMonth() - 3)).toISOString();
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
      default:
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-1">Generate and view member progress reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member-progress">Member Progress</SelectItem>
                  <SelectItem value="performance-summary">Performance Summary</SelectItem>
                  <SelectItem value="attendance">Attendance Report</SelectItem>
                  <SelectItem value="training-notes">Training Notes Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time Period</Label>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleGenerateReport} disabled={loading}>
            <FileText className="h-4 w-4 mr-2" />
            {loading ? 'Generating...' : 'Generate Report'}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold mt-1">{stats.totalMembers}</p>
              </div>
              <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
                <Users className="h-5 w-5 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active This Month</p>
                <p className="text-2xl font-bold mt-1">{stats.activeThisMonth}</p>
              </div>
              <div className="p-3 rounded-full bg-accent-100 dark:bg-accent-900">
                <TrendingUp className="h-5 w-5 text-accent-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Progress Rate</p>
                <p className="text-2xl font-bold mt-1">{stats.avgProgressRate}</p>
              </div>
              <div className="p-3 rounded-full bg-success/10">
                <BarChart3 className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold mt-1">{stats.totalVisits}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <Download className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'January Member Progress Report', date: '2026-01-20', type: 'PDF' },
              { name: 'December Performance Summary', date: '2026-01-05', type: 'Excel' },
              { name: 'Q4 2025 Training Analytics', date: '2025-12-31', type: 'PDF' },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border hover:border-primary-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-primary-100 dark:bg-primary-900">
                    <FileText className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">{report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleExport(report.type.toLowerCase())}>
                    <Download className="h-4 w-4 mr-1" />
                    {report.type}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}