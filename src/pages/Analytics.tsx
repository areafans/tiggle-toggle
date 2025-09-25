import React from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { FEATURE_FLAGS, DEFAULT_FLAGS } from '../lib/launchdarkly';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';

const Analytics: React.FC = () => {
  const flags = useFlags();
  const advancedAnalyticsEnabled = flags[FEATURE_FLAGS.ADVANCED_ANALYTICS] ?? DEFAULT_FLAGS[FEATURE_FLAGS.ADVANCED_ANALYTICS];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Track developer experience metrics and experiment outcomes
        </p>
      </div>

      {/* Standard Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Developer Happiness</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2/10</div>
            <p className="text-xs text-muted-foreground">+0.4 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Code Review Efficiency</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1h</div>
            <p className="text-xs text-muted-foreground">Avg. review time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meeting Time Saved</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2h</div>
            <p className="text-xs text-muted-foreground">Per week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.5h</div>
            <p className="text-xs text-muted-foreground">Daily average</p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics (Feature Flag) */}
      {advancedAnalyticsEnabled && (
        <div className="space-y-6">
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-2 text-green-500">Advanced Analytics</h2>
            <p className="text-muted-foreground">Enhanced insights and predictive metrics</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-green-500/50">
              <CardHeader>
                <CardTitle>Productivity Heat Map</CardTitle>
                <CardDescription>Team performance across different time periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  [Advanced Heat Map Visualization]
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-500/50">
              <CardHeader>
                <CardTitle>Experiment ROI Calculator</CardTitle>
                <CardDescription>Cost-benefit analysis of lab experiments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  [ROI Calculation Dashboard]
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;