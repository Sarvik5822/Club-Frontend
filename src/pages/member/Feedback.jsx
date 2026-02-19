import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { mockCoaches } from '@/lib/mockData';
import { toast } from 'sonner';

export default function Feedback() {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showRateCoachModal, setShowRateCoachModal] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [coachRating, setCoachRating] = useState(0);
  const [hoveredCoachRating, setHoveredCoachRating] = useState(0);

  const handleSubmitFeedback = () => {
    toast.success('Thank you for your feedback!');
  };

  const handleRateCoach = (coach) => {
    setSelectedCoach(coach);
    setCoachRating(0);
    setHoveredCoachRating(0);
    setShowRateCoachModal(true);
  };

  const confirmCoachRating = () => {
    if (coachRating === 0) {
      toast.error('Please select a rating');
      return;
    }
    toast.success(`Successfully rated ${selectedCoach.name} with ${coachRating} stars!`);
    setShowRateCoachModal(false);
  };

  // Mock recent visits for feedback (replacing sessions)
  const recentVisits = [
    {
      id: 1,
      facility: 'Gym Floor',
      coach: 'Sarah Johnson',
      date: '2026-01-27',
      sport: 'Gym',
    },
    {
      id: 2,
      facility: 'Pool 1',
      coach: 'David Lee',
      date: '2026-01-25',
      sport: 'Swimming',
    },
    {
      id: 3,
      facility: 'Studio A',
      coach: 'Sarah Johnson',
      date: '2026-01-23',
      sport: 'Yoga',
    },
  ];

  const myFeedback = [
    {
      id: 1,
      facility: 'Studio A',
      coach: 'Sarah Johnson',
      date: '2026-01-20',
      rating: 5,
      comment: 'Excellent facilities! Very clean and well-maintained.',
      helpful: 12,
    },
    {
      id: 2,
      facility: 'Pool 1',
      coach: 'David Lee',
      date: '2026-01-18',
      rating: 4,
      comment: 'Great swimming pool, would love more lane availability during peak hours.',
      helpful: 8,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Feedback & Ratings</h1>
        <p className="text-muted-foreground mt-1">Rate your visits and help improve our services</p>
      </div>

      {/* Rate Recent Visits */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Your Recent Visits</CardTitle>
          <CardDescription>Share your experience to help us improve</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentVisits.map((visit) => (
            <div key={visit.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{visit.facility}</h4>
                  <p className="text-sm text-muted-foreground">
                    Coach: {visit.coach} • {visit.date}
                  </p>
                </div>
                <Badge>{visit.sport}</Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Your Rating</Label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSelectedRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= (hoveredRating || selectedRating)
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor={`comment-${visit.id}`}>Your Feedback (Optional)</Label>
                  <Textarea
                    id={`comment-${visit.id}`}
                    placeholder="Share your experience, suggestions, or what you liked..."
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <Button onClick={handleSubmitFeedback}>Submit Feedback</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* My Previous Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>My Previous Feedback</CardTitle>
          <CardDescription>Your submitted reviews and ratings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {myFeedback.map((feedback) => (
            <div key={feedback.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{feedback.facility}</h4>
                  <p className="text-sm text-muted-foreground">
                    Coach: {feedback.coach} • {feedback.date}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < feedback.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm">{feedback.comment}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <button className="flex items-center gap-1 hover:text-primary-600 transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{feedback.helpful} found helpful</span>
                </button>
                <button className="flex items-center gap-1 hover:text-primary-600 transition-colors">
                  <MessageSquare className="h-4 w-4" />
                  <span>Reply from staff</span>
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rate Coaches */}
      <Card>
        <CardHeader>
          <CardTitle>Coach Ratings</CardTitle>
          <CardDescription>View and rate your coaches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCoaches.map((coach) => (
              <div key={coach.id} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <img
                    src={coach.avatar}
                    alt={coach.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{coach.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-medium">{coach.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({coach.totalSessions} sessions)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {coach.specializations.map((spec, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-3 w-full"
                      onClick={() => handleRateCoach(coach)}
                    >
                      Rate Coach
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rate Coach Modal */}
      <Dialog open={showRateCoachModal} onOpenChange={setShowRateCoachModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Coach</DialogTitle>
            <DialogDescription>
              Share your experience with {selectedCoach?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedCoach && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCoach.avatar}
                  alt={selectedCoach.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{selectedCoach.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedCoach.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label>Your Rating</Label>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCoachRating(star)}
                      onMouseEnter={() => setHoveredCoachRating(star)}
                      onMouseLeave={() => setHoveredCoachRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= (hoveredCoachRating || coachRating)
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="coach-feedback">Your Feedback (Optional)</Label>
                <Textarea
                  id="coach-feedback"
                  placeholder="Share your experience with this coach..."
                  rows={4}
                  className="mt-2"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRateCoachModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmCoachRating}>
              Submit Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}