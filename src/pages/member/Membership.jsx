import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, CreditCard, Building, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { mockMembershipPlans, mockMembers } from '@/lib/mockData';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Membership() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get current member data
  const currentMember = mockMembers.find(m => m.id === user?.id);
  const currentPlan = mockMembershipPlans.find(p => p.name === currentMember?.membershipType);

  // Calculate days until expiry
  const expiryDate = new Date(currentMember?.membershipExpiry || '2026-12-31');
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  const daysInPeriod = 365;
  const daysUsed = daysInPeriod - daysUntilExpiry;
  const usageProgress = (daysUsed / daysInPeriod) * 100;

  const handleUpgrade = (planName) => {
    toast.success(`Upgrade to ${planName} plan initiated!`, {
      description: 'Redirecting to payment...',
    });
    setTimeout(() => {
      navigate('/member/payments');
    }, 1500);
  };

  const handleRenew = () => {
    toast.success('Membership renewal initiated!', {
      description: 'Redirecting to payment...',
    });
    setTimeout(() => {
      navigate('/member/payments');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Membership</h1>
        <p className="text-muted-foreground mt-1">Manage your membership plan and benefits</p>
      </div>

      {/* Current Membership Card */}
      <Card className="border-2 border-emerald-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Your Current Plan
            </CardTitle>
            <Badge className={`text-lg px-4 py-2 ${
              currentPlan?.color === 'yellow' ? 'bg-yellow-500' :
              currentPlan?.color === 'purple' ? 'bg-purple-500' :
              currentPlan?.color === 'slate' ? 'bg-slate-500' :
              'bg-gray-500'
            } text-white`}>
              {currentMember?.membershipType}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900">
                <Calendar className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-semibold">
                  {new Date(currentMember?.joinDate || '2024-01-15').toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expires On</p>
                <p className="font-semibold">
                  {expiryDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Cost</p>
                <p className="font-semibold text-lg">${currentPlan?.price}/mo</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Membership Period</span>
              <span className="text-sm text-muted-foreground">{daysUntilExpiry} days remaining</span>
            </div>
            <Progress value={usageProgress} className="h-2" />
          </div>

          {daysUntilExpiry <= 30 && (
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Your membership expires soon! Renew now to continue enjoying all benefits.
              </p>
              <Button 
                className="mt-3 bg-amber-600 hover:bg-amber-700"
                onClick={handleRenew}
              >
                Renew Membership
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Your Plan Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Included Features
              </h4>
              <ul className="space-y-2">
                {currentPlan?.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Accessible Sports
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentMember?.accessibleSports.map(sport => (
                  <Badge key={sport} variant="secondary" className="bg-emerald-100 text-emerald-700">
                    {sport}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multi-Club Access */}
      {currentMember?.multiClubAccess && (
        <Card className="border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Multi-Club Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your {currentMember.membershipType} membership includes access to multiple club locations:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentMember.accessibleClubs.map((club, index) => (
                <div key={index} className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{club}</p>
                      <p className="text-xs text-muted-foreground">Full access</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Options */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Upgrade Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockMembershipPlans.map((plan) => {
            const isCurrentPlan = plan.name === currentMember?.membershipType;
            const currentPlanIndex = mockMembershipPlans.findIndex(p => p.name === currentMember?.membershipType);
            const planIndex = mockMembershipPlans.findIndex(p => p.id === plan.id);
            const isUpgrade = planIndex > currentPlanIndex;

            return (
              <Card 
                key={plan.id}
                className={`relative ${
                  isCurrentPlan ? 'border-2 border-emerald-500' :
                  plan.popular ? 'border-2 border-blue-500' :
                  ''
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-emerald-500">Current Plan</Badge>
                  </div>
                )}
                {plan.popular && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500">Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-center">
                    <Badge className={`text-lg px-4 py-2 mb-2 ${
                      plan.color === 'yellow' ? 'bg-yellow-500' :
                      plan.color === 'purple' ? 'bg-purple-500' :
                      plan.color === 'slate' ? 'bg-slate-500' :
                      'bg-gray-500'
                    } text-white`}>
                      {plan.name}
                    </Badge>
                  </CardTitle>
                  <div className="text-center">
                    <p className="text-4xl font-bold">${plan.price}</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.multiClubAccess && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <Building className="h-4 w-4 text-blue-600" />
                        Multi-club access
                      </p>
                    </div>
                  )}
                  <Button 
                    className="w-full"
                    variant={isCurrentPlan ? 'outline' : isUpgrade ? 'default' : 'secondary'}
                    disabled={isCurrentPlan || !isUpgrade}
                    onClick={() => handleUpgrade(plan.name)}
                  >
                    {isCurrentPlan ? 'Current Plan' : 
                     isUpgrade ? (
                       <>
                         Upgrade <ArrowRight className="h-4 w-4 ml-2" />
                       </>
                     ) : 'Not Available'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}