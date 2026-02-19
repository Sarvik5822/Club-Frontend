import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, TrendingUp, Flame, Award, Medal } from 'lucide-react';

export default function Leaderboard() {
  const leaderboardData = [
    { rank: 1, name: 'Alice Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', points: 2450, sessions: 48, streak: 15 },
    { rank: 2, name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', points: 2280, sessions: 45, streak: 12 },
    { rank: 3, name: 'Bob Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', points: 2150, sessions: 42, streak: 10 },
    { rank: 4, name: 'Emma Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', points: 2050, sessions: 40, streak: 8 },
    { rank: 5, name: 'Mike Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', points: 1980, sessions: 38, streak: 7 },
  ];

  const achievements = [
    { icon: '🔥', title: '30-Day Streak', description: 'Attended sessions for 30 consecutive days', points: 500, unlocked: true },
    { icon: '🌅', title: 'Early Bird', description: 'Attended 10 morning sessions', points: 200, unlocked: true },
    { icon: '🧘', title: 'Yoga Master', description: 'Completed 20 yoga sessions', points: 300, unlocked: true },
    { icon: '💯', title: 'Century Club', description: 'Attended 100 total sessions', points: 1000, unlocked: false },
    { icon: '🏊', title: 'Swim Champion', description: 'Completed 50 swimming sessions', points: 500, unlocked: false },
    { icon: '💪', title: 'Strength Legend', description: 'Lifted over 10,000 kg total', points: 800, unlocked: false },
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">Compete with other members and earn achievements</p>
      </div>

      <Tabs defaultValue="overall" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="monthly">This Month</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-6">
          {/* Your Stats */}
          <Card className="border-primary-600 bg-primary-50 dark:bg-primary-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600">#2</div>
                  <p className="text-sm text-muted-foreground mt-1">Overall Rank</p>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Points</p>
                    <p className="text-xl font-bold">2,280</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sessions</p>
                    <p className="text-xl font-bold">45</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Streak</p>
                    <p className="text-xl font-bold flex items-center gap-1">
                      <Flame className="h-5 w-5 text-orange-600" />
                      12
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Members */}
          <Card>
            <CardHeader>
              <CardTitle>Top Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboardData.map((member) => (
                  <div
                    key={member.rank}
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      member.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-950' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(member.rank)}
                    </div>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{member.name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {member.points} pts
                        </span>
                        <span>{member.sessions} sessions</span>
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-600" />
                          {member.streak} days
                        </span>
                      </div>
                    </div>
                    {member.rank <= 3 && (
                      <Badge className={
                        member.rank === 1 ? 'bg-yellow-500' :
                        member.rank === 2 ? 'bg-gray-400' :
                        'bg-orange-600'
                      }>
                        Top {member.rank}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>January 2026 Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboardData.slice(0, 10).map((member) => (
                  <div
                    key={member.rank}
                    className="flex items-center gap-4 p-4 rounded-lg border"
                  >
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(member.rank)}
                    </div>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.sessions} sessions this month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{member.points}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      achievement.unlocked
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-950'
                        : 'opacity-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold">{achievement.title}</h4>
                          {achievement.unlocked && (
                            <Badge className="bg-success">Unlocked</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{achievement.points} points</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* How Points Work */}
      <Card>
        <CardHeader>
          <CardTitle>How to Earn Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900">
                <TrendingUp className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h4 className="font-semibold">Attend Sessions</h4>
                <p className="text-sm text-muted-foreground">Earn 50 points per session attended</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900">
                <Flame className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold">Build Streaks</h4>
                <p className="text-sm text-muted-foreground">Earn 10 bonus points per consecutive day</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <Trophy className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-semibold">Unlock Achievements</h4>
                <p className="text-sm text-muted-foreground">Earn bonus points for special milestones</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-success/10">
                <Award className="h-5 w-5 text-success" />
              </div>
              <div>
                <h4 className="font-semibold">Refer Friends</h4>
                <p className="text-sm text-muted-foreground">Earn 200 points per successful referral</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}