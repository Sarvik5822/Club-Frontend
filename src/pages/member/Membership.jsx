import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, CreditCard, Building, CheckCircle, Star, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import memberService from '@/services/memberService';

export default function Membership() {
  const navigate = useNavigate();
  const [membership, setMembership] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [membershipRes, plansRes] = await Promise.all([
        memberService.getMembership(),
        memberService.getAvailablePlans(),
      ]);

      if (membershipRes.status === 'success') {
        setMembership(membershipRes.data?.membership);
      }
      if (plansRes.status === 'success') {
        setPlans(plansRes.data?.plans || []);
      }
    } catch (error) {
      console.error('Failed to fetch membership data:', error);
      toast.error('Failed to load membership data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate days until expiry
  const endDate = membership?.endDate ? new Date(membership.endDate) : null;
  const startDate = membership?.startDate ? new Date(membership.startDate) : null;
  const today = new Date();
  const daysUntilExpiry = endDate ? Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)) : 0;
  const totalDays = endDate && startDate ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) : 365;
  const daysUsed = totalDays - daysUntilExpiry;
  const usageProgress = totalDays > 0 ? Math.min((daysUsed / totalDays) * 100, 100) : 0;

  const currentPlan = membership?.plan;

  const handleUpgrade = async (planId, planName) => {
    try {
      setUpgrading(true);
      await memberService.requestUpgrade({ planId });
      toast.success(`Upgrade to ${planName} plan initiated!`, {
        description: 'Redirecting to payment...',
      });
      setTimeout(() => {
        navigate('/member/payments');
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Failed to request upgrade');
    } finally {
      setUpgrading(false);
    }
  };

  const handleRenew = async () => {
    try {
      await memberService.renewMembership();
      toast.success('Membership renewal initiated!', {
        description: 'Redirecting to payment...',
      });
      setTimeout(() => {
        navigate('/member/payments');
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Failed to renew membership');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-muted-foreground">Loading membership...</span>
      </div>
    );
  }

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
            <Badge className="text-lg px-4 py-2 bg-emerald-500 text-white">
              {currentPlan?.name || membership?.status || 'N/A'}
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
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-semibold">
                  {startDate
                    ? startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : 'N/A'}
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
                  {endDate
                    ? endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-semibold text-lg">
                  {currentPlan?.price ? `₹${currentPlan.price}` : 'N/A'}
                  {currentPlan?.duration ? `/${currentPlan.duration === 1 ? 'mo' : `${currentPlan.duration}mo`}` : ''}
                </p>
              </div>
            </div>
          </div>

          {endDate && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Membership Period</span>
                <span className="text-sm text-muted-foreground">
                  {daysUntilExpiry > 0 ? `${daysUntilExpiry} days remaining` : 'Expired'}
                </span>
              </div>
              <Progress value={usageProgress} className="h-2" />
            </div>
          )}

          {membership?.branch && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building className="h-4 w-4" />
              <span>Branch: {membership.branch.name}</span>
            </div>
          )}

          {membership?.multiClubAccess && (
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle className="h-4 w-4" />
              <span>Multi-club access enabled</span>
            </div>
          )}

          {daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
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

          {daysUntilExpiry <= 0 && endDate && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                Your membership has expired. Please renew to regain access.
              </p>
              <Button
                className="mt-3 bg-red-600 hover:bg-red-700"
                onClick={handleRenew}
              >
                Renew Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Benefits */}
      {currentPlan && (
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
                  {(currentPlan.features || []).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {currentPlan.sports && currentPlan.sports.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    Accessible Sports
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentPlan.sports.map((sport, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-emerald-100 text-emerald-700">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Options */}
      {plans.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const isCurrentPlan = currentPlan && (plan._id === currentPlan._id || plan.name === currentPlan.name);
              const isUpgrade = currentPlan && plan.price > (currentPlan.price || 0);

              return (
                <Card
                  key={plan._id || plan.id}
                  className={`relative ${isCurrentPlan ? 'border-2 border-emerald-500' :
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
                      <Badge className="text-lg px-4 py-2 bg-emerald-500 text-white mb-2">
                        {plan.name}
                      </Badge>
                    </CardTitle>
                    <div className="text-center">
                      <p className="text-4xl font-bold">₹{plan.price}</p>
                      <p className="text-sm text-muted-foreground">
                        per {plan.duration === 1 ? 'month' : `${plan.duration} months`}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {(plan.features || []).map((feature, index) => (
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
                      disabled={isCurrentPlan || !isUpgrade || upgrading}
                      onClick={() => handleUpgrade(plan._id || plan.id, plan.name)}
                    >
                      {upgrading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isCurrentPlan ? 'Current Plan' :
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
      )}
    </div>
  );
}