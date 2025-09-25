import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import DemoControlPanel from '../components/DemoControlPanel';
import AIChatbot from '../components/AIChatbot';
import { useAuth } from '../contexts/AuthContext';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import {
  TrendingUp,
  Users,
  Clock,
  Zap,
  Plus
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // ╭─────────────────────────────────────────────────────────╮
  // │ LaunchDarkly Feature Flag Evaluation                    │
  // │ Uses centralized useFeatureFlags() hook for consistency │
  // │ Combines LaunchDarkly targeting + performance overrides │
  // ╰─────────────────────────────────────────────────────────╯
  const { advancedAnalytics, aiChatbot, _debug } = useFeatureFlags();

  // LaunchDarkly Demo: Console logging for stakeholder demonstrations
  console.log('🚩 LaunchDarkly Dashboard Flags for', user?.name, ':', {
    role: user?.role,
    'F1-AdvancedAnalytics': advancedAnalytics,
    'F2-AIChatbot': aiChatbot,
    debug: _debug
  });

  const activeLabs = [
    {
      id: 1,
      name: 'Coffee Chat Code Reviews',
      participants: 12,
      progress: 75,
      status: 'active',
      category: 'Productivity'
    },
    {
      id: 2,
      name: 'No-Meeting Wednesdays',
      participants: 8,
      progress: 50,
      status: 'active',
      category: 'Communication'
    },
    {
      id: 3,
      name: 'Tech Talk Tuesdays',
      participants: 15,
      progress: 90,
      status: 'completing',
      category: 'Learning'
    }
  ];

  const recentActivity = [
    { action: 'Lab completed', lab: 'Silent Standup Experiment', time: '2 hours ago' },
    { action: 'New participant joined', lab: 'Coffee Chat Code Reviews', time: '4 hours ago' },
    { action: 'Metrics updated', lab: 'Bug Hunt Fridays', time: '6 hours ago' },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your experiments.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Lab
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Labs</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +1 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              Across all experiments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Happiness</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2</div>
            <p className="text-xs text-muted-foreground">
              +0.4 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.5h</div>
            <p className="text-xs text-muted-foreground">
              Daily average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Labs and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Labs */}
        <Card>
          <CardHeader>
            <CardTitle>Active Labs</CardTitle>
            <CardDescription>
              Your currently running experiments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeLabs.map((lab) => (
              <div key={lab.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div>
                  <h4 className="font-medium">{lab.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {lab.participants} participants • {lab.category}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{lab.progress}%</div>
                  <div className="w-20 h-2 bg-muted rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${lab.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.action}</span> in{' '}
                    <span className="text-blue-500">{activity.lab}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Card (Feature Flag) */}
      {advancedAnalytics && (
        <Card className="border-green-500/50 bg-green-500/5">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
              Advanced Analytics (New!)
            </CardTitle>
            <CardDescription>
              Enhanced metrics and insights for your experiments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Get deeper insights into team productivity, collaboration patterns, and experiment ROI.
            </p>
            <Button variant="outline">
              Explore Advanced Analytics
            </Button>
          </CardContent>
        </Card>
      )}

      {/* AI Assistant (Feature Flag with Targeting) */}
      {aiChatbot && (
        <div className="flex justify-center">
          <AIChatbot />
        </div>
      )}

      {/* Demo Control Panel */}
      <DemoControlPanel />
    </div>
  );
};

export default Dashboard;