import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CreditCard, IndianRupee, Settings, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentGateways() {
  const [showStripeKey, setShowStripeKey] = useState(false);
  const [showPayPalKey, setShowPayPalKey] = useState(false);

  const gateways = [
    {
      id: '1',
      name: 'Stripe',
      icon: CreditCard,
      status: 'active',
      transactions: 1234,
      revenue: '$125,450',
      color: 'text-purple-600',
    },
    {
      id: '2',
      name: 'PayPal',
      icon: IndianRupee,
      status: 'active',
      transactions: 856,
      revenue: '$89,320',
      color: 'text-blue-600',
    },
    {
      id: '3',
      name: 'Razorpay',
      icon: CreditCard,
      status: 'inactive',
      transactions: 0,
      revenue: '$0',
      color: 'text-indigo-600',
    },
  ];

  const handleSave = (gateway) => {
    toast.success(`${gateway} configuration saved successfully`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Gateways</h1>
        <p className="text-muted-foreground mt-1">Configure payment providers and API settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gateways.map((gateway) => {
          const Icon = gateway.icon;
          return (
            <Card key={gateway.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${gateway.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant={gateway.status === 'active' ? 'default' : 'secondary'}>
                    {gateway.status}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-4">{gateway.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transactions</span>
                    <span className="font-medium">{gateway.transactions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue</span>
                    <span className="font-medium">{gateway.revenue}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Stripe Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Stripe</Label>
              <p className="text-sm text-muted-foreground">Accept payments via Stripe</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Label>Publishable Key</Label>
            <Input placeholder="pk_test_..." />
          </div>
          <div className="space-y-2">
            <Label>Secret Key</Label>
            <div className="relative">
              <Input
                type={showStripeKey ? 'text' : 'password'}
                placeholder="sk_test_..."
                className="pr-10"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowStripeKey(!showStripeKey)}
              >
                {showStripeKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Webhook Secret</Label>
            <Input placeholder="whsec_..." />
          </div>
          <Button onClick={() => handleSave('Stripe')}>
            <Settings className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            PayPal Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable PayPal</Label>
              <p className="text-sm text-muted-foreground">Accept payments via PayPal</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Label>Client ID</Label>
            <Input placeholder="AYSq3RDGsmBLJE-otTkBtM-jBc..." />
          </div>
          <div className="space-y-2">
            <Label>Client Secret</Label>
            <div className="relative">
              <Input
                type={showPayPalKey ? 'text' : 'password'}
                placeholder="EGnHDxD_qRPdaLdZz8iCr8N7_MzF-YHPTkjs6NKYQvQSBngp4PTTVWkPZRbL"
                className="pr-10"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPayPalKey(!showPayPalKey)}
              >
                {showPayPalKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch id="sandbox" defaultChecked />
              <Label htmlFor="sandbox">Sandbox Mode</Label>
            </div>
          </div>
          <Button onClick={() => handleSave('PayPal')}>
            <Settings className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}