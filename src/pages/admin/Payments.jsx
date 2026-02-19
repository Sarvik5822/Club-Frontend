import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import adminService from '@/services/adminService';

export default function AdminPayments() {
  const { toast } = useToast();
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [searchTerm, statusFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      };
      const response = await adminService.getPayments(params);
      setPayments(response.data.payments || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch payments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminService.getPaymentStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch payment stats:', error);
    }
  };

  const handleRefund = async (id, amount) => {
    if (!confirm(`Are you sure you want to refund ₹${amount}?`)) return;

    try {
      await adminService.processRefund(id, {
        refundAmount: amount,
        reason: 'Requested by admin',
        refundMethod: 'original'
      });
      toast({
        title: 'Success',
        description: 'Refund processed successfully',
      });
      fetchPayments();
      fetchStats();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to process refund',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadInvoice = async (id) => {
    try {
      const blob = await adminService.generateInvoice(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: 'Success',
        description: 'Invoice downloaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to download invoice',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments & Refunds</h1>
        <p className="text-muted-foreground mt-1">Manage payments and process refunds</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold mt-1">₹{(stats?.totalRevenue || 0).toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold mt-1">₹{(stats?.pendingAmount || 0).toLocaleString()}</p>
            <p className="text-xs text-yellow-600 mt-1">{stats?.pendingCount || 0} invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold mt-1">₹{(stats?.completedAmount || 0).toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">{stats?.completedCount || 0} payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Refunded</p>
            <p className="text-2xl font-bold mt-1">₹{(stats?.refundedAmount || 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Description</th>
                  <th className="text-left p-3 font-semibold">Amount</th>
                  <th className="text-left p-3 font-semibold">Date</th>
                  <th className="text-left p-3 font-semibold">Method</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-right p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-3">
                      <p className="font-medium">{payment.description || payment.type}</p>
                      <p className="text-sm text-muted-foreground">ID: {payment._id.slice(-6)}</p>
                    </td>
                    <td className="p-3 font-semibold">₹{payment.amount.toLocaleString()}</td>
                    <td className="p-3 text-sm">
                      {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() :
                        payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="capitalize">{payment.method || 'N/A'}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={
                        payment.status === 'completed' ? 'default' :
                          payment.status === 'pending' ? 'secondary' :
                            payment.status === 'failed' ? 'destructive' :
                              'outline'
                      }>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadInvoice(payment._id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {payment.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRefund(payment._id, payment.amount)}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Refund
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {payments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No payments found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}