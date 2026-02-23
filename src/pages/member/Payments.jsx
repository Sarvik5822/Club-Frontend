import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Download, CreditCard, Calendar, IndianRupee, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import memberService from '@/services/memberService';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
    { id: 'stripe', name: 'Stripe', icon: CreditCard, description: 'Secure payment via Stripe' },
    { id: 'paypal', name: 'PayPal', icon: IndianRupee, description: 'Pay with PayPal account' },
  ];

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await memberService.getPayments();
      if (response.status === 'success') {
        setPayments(response.data?.payments || []);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Calculate totals from API data
  const totalPaid = payments
    .filter(p => p.status === 'paid' || p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const thisMonth = new Date();
  const thisMonthPayments = payments
    .filter(p => {
      const pDate = new Date(p.createdAt || p.date);
      return pDate.getMonth() === thisMonth.getMonth() && pDate.getFullYear() === thisMonth.getFullYear();
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const handleAddPaymentMethod = () => {
    setShowPaymentMethodModal(true);
  };

  const confirmAddPaymentMethod = () => {
    const methodName = paymentMethods.find(m => m.id === selectedPaymentMethod)?.name;
    toast.success(`${methodName} added successfully!`);
    setShowPaymentMethodModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-muted-foreground">Loading payments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments & Invoices</h1>
        <p className="text-muted-foreground mt-1">Manage your payment history and methods</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold mt-1">${totalPaid}</p>
              </div>
              <div className="p-3 rounded-full bg-success/10">
                <IndianRupee className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold mt-1">${totalPending}</p>
              </div>
              <div className="p-3 rounded-full bg-warning/10">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold mt-1">${thisMonthPayments}</p>
              </div>
              <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
                <CreditCard className="h-5 w-5 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment Methods</CardTitle>
            <Button size="sm" onClick={handleAddPaymentMethod}>
              <Plus className="h-4 w-4 mr-2" />
              Add Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                  <CreditCard className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium">Visa ending in 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                </div>
              </div>
              <Badge>Default</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <div
                  key={payment._id || payment.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:border-primary-600 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      payment.status === 'paid' || payment.status === 'completed' ? 'bg-success/10' :
                      payment.status === 'pending' ? 'bg-warning/10' :
                      'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <CreditCard className={`h-5 w-5 ${
                        payment.status === 'paid' || payment.status === 'completed' ? 'text-success' :
                        payment.status === 'pending' ? 'text-warning' :
                        'text-gray-500'
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold">{payment.description || payment.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.createdAt || payment.date).toLocaleDateString()}
                        {payment.method ? ` • ${payment.method}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-lg">${payment.amount}</p>
                      <Badge variant={
                        payment.status === 'paid' || payment.status === 'completed' ? 'default' :
                        payment.status === 'pending' ? 'secondary' :
                        'destructive'
                      }>
                        {payment.status}
                      </Badge>
                    </div>
                    {payment.invoiceUrl && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No payment records found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Payment Method Modal */}
      <Dialog open={showPaymentMethodModal} onOpenChange={setShowPaymentMethodModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Choose a payment method to add to your account
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div key={method.id} className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-primary-600 transition-colors">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="flex items-center gap-3 flex-1 cursor-pointer">
                        <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900">
                          <Icon className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentMethodModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAddPaymentMethod}>
              Add Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}