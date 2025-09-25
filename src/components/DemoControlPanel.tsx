import React, { useState } from 'react';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { useAuth, mockUsers, UserRole } from '../contexts/AuthContext';
import { useDemo } from '../contexts/DemoContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { SimpleExperimentTracker } from '../lib/experimentTracker';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import {
  Settings,
  User,
  Zap,
  Bot,
  ChevronDown,
  Slack,
  Activity
} from 'lucide-react';

const DemoControlPanel: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [simulatedLatency, setSimulatedLatency] = useState(80);
  const [metricHistory, setMetricHistory] = useState<number[]>([80, 85, 90, 75, 82]);
  const [experimentTracker, setExperimentTracker] = useState<SimpleExperimentTracker | null>(null);

  const { user, switchUser } = useAuth();
  const ldClient = useLDClient();
  const { setOverride, clearOverride, clearAllOverrides, performanceState, updatePerformanceState, setSimulationMode } = useDemo();

  // Initialize experiment tracker when ldClient and user are available
  React.useEffect(() => {
    if (ldClient && user) {
      setExperimentTracker(new SimpleExperimentTracker(ldClient, user));
    }
  }, [ldClient, user]);

  // Get current flag states using consistent hook
  const { advancedAnalytics: advancedAnalyticsFlag, aiChatbot: aiChatbotFlag } = useFeatureFlags();

  const currentFlags = {
    advancedAnalytics: advancedAnalyticsFlag,
    aiChatbot: aiChatbotFlag,
    slackIntegration: true // Always on for demo
  };

  const handleUserSwitch = (newRole: UserRole) => {
    const newUser = mockUsers.find(u => u.role === newRole);
    if (newUser) {
      switchUser(newUser);
      // Clear all demo overrides so LaunchDarkly targeting can work naturally
      clearAllOverrides();

      console.log('🔄 Switching to user:', newUser.name, '- LaunchDarkly context will be updated automatically by LaunchDarklyProvider');
    }
  };

  // ╭─────────────────────────────────────────────────────────╮
  // │ LaunchDarkly API Integration - Real Feature Flag Toggle │
  // │ Demonstrates server-side flag management via REST API   │
  // ╰─────────────────────────────────────────────────────────╯
  const toggleAdvancedAnalytics = async () => {
    const currentValue = currentFlags.advancedAnalytics;
    const newValue = !currentValue;

    try {
      // LaunchDarkly REST API: Toggle flag state for entire environment
      const response = await fetch(`https://app.launchdarkly.com/api/v2/flags/default/advanced-analytics`, {
        method: 'PATCH',
        headers: {
          'Authorization': 'api-1c02800f-3e4a-47f2-97d7-8d4cefef0816',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          "op": "replace",
          "path": "/environments/test/on",
          "value": newValue
        }])
      });

      if (response.ok) {
        console.log(`✅ Successfully toggled Advanced Analytics to ${newValue}`);
      } else {
        console.error(`❌ Failed to toggle Advanced Analytics:`, response.status, response.statusText);
      }
    } catch (error) {
      console.error(`❌ Error toggling Advanced Analytics:`, error);
    }
  };




  // Simulate performance spike that triggers automatic rollback
  const triggerHighLatency = () => {
    console.log('🚨 Simulating performance spike...');
    // This will generate high latency data that should trigger LaunchDarkly's automatic rollback
    setSimulationMode('high-latency');
  };

  const restoreNormalLatency = () => {
    console.log('✅ Restoring normal performance...');
    // This will generate normal latency data, allowing LaunchDarkly to re-enable if appropriate
    setSimulationMode('normal');
  };

  React.useEffect(() => {
    if (!experimentTracker) return;

    const monitoringInterval = setInterval(async () => {
      const aiEnabled = currentFlags.aiChatbot;

      // Generate realistic latency based on current simulation mode and actual flag state
      let baseLatency: number;
      if (performanceState.simulationMode === 'high-latency') {
        // Performance spike: 600-900ms (above threshold)
        baseLatency = Math.floor(Math.random() * 300) + 600;
      } else if (aiEnabled) {
        // AI enabled: normal 400-500ms
        baseLatency = Math.floor(Math.random() * 100) + 400;
      } else {
        // AI disabled: low 80-150ms
        baseLatency = Math.floor(Math.random() * 70) + 80;
      }


      // Send data to LaunchDarkly experiment
      experimentTracker.trackResponseTime(baseLatency);

      // Update global performance state and visualization
      updatePerformanceState({ currentLatency: baseLatency });
      setSimulatedLatency(baseLatency);
      setMetricHistory(prev => [...prev.slice(-9), baseLatency]);

      // ╭─────────────────────────────────────────────────────────╮
      // │ LaunchDarkly + Performance Monitoring Circuit Breaker   │
      // │ Preserves targeting rules while adding performance layer │
      // ╰─────────────────────────────────────────────────────────╯
      if (baseLatency > 500 && aiEnabled && !performanceState.killSwitchArmed) {
        console.log('🚨 LaunchDarkly Demo: Performance circuit breaker triggered at', baseLatency + 'ms!');
        console.log('🔄 GLOBAL kill switch: Affects ALL users with LaunchDarkly AI access');
        console.log('🎯 LaunchDarkly targeting preserved: Jordan Kim remains unaffected (no LD access)');
        console.log('🌐 Alex & Sam: AI disabled globally due to performance (overrides LD targeting)');
        updatePerformanceState({ killSwitchArmed: true });
      } else if (baseLatency < 300 && performanceState.killSwitchArmed) {
        console.log('✅ LaunchDarkly Demo: Performance recovered to', baseLatency + 'ms');
        console.log('🔄 GLOBAL kill switch disarmed: LaunchDarkly targeting rules restored');
        console.log('🌐 Alex & Sam: AI restored based on LaunchDarkly evaluation');
        updatePerformanceState({ killSwitchArmed: false });
      }

      console.log(`📊 Monitoring: ${baseLatency}ms (AI: ${aiEnabled ? 'ON' : 'OFF'}, Global Kill Switch: ${performanceState.killSwitchArmed ? 'ARMED' : 'READY'})`);

    }, 3000);

    return () => clearInterval(monitoringInterval);
  }, [experimentTracker, currentFlags.aiChatbot, performanceState.simulationMode, performanceState.killSwitchArmed, updatePerformanceState]);

  if (isCollapsed) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsCollapsed(false)}
          className="bg-white hover:bg-gray-50 text-black border shadow-lg"
        >
          <Settings className="mr-2 h-4 w-4" />
          Demo Controls
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="border-blue-500/50 bg-blue-950/90 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-blue-100 flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Demo Controls
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(true)}
              className="text-blue-200 hover:text-blue-100"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {/* User Role Switching */}
          <div className="space-y-2">
            <label className="text-blue-200 font-medium flex items-center">
              <User className="mr-2 h-4 w-4" />
              Demo Users (3 Total)
            </label>
            <div className="space-y-1">
              {mockUsers.map((mockUser) => (
                <Button
                  key={mockUser.id}
                  variant={user?.role === mockUser.role ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleUserSwitch(mockUser.role)}
                  className="w-full text-xs h-8 justify-start"
                >
                  <span className="mr-2">{mockUser.avatar}</span>
                  <span className="flex-1 text-left">{mockUser.name}</span>
                  <span className="text-xs opacity-70">
                    {mockUser.role === 'lab-owner' && '🤖'}
                    {mockUser.role === 'beta-user' && '🤖'}
                    {mockUser.role === 'standard-user' && '❌'}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Feature Flags */}
          <div className="space-y-2">
            <label className="text-blue-200 font-medium flex items-center">
              <Zap className="mr-2 h-4 w-4" />
              Feature Rollout Control
            </label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs">F1 - Advanced Analytics</span>
                <Button
                  variant={currentFlags.advancedAnalytics ? "default" : "outline"}
                  size="sm"
                  onClick={toggleAdvancedAnalytics}
                  className="h-6 px-2 text-xs"
                >
                  {currentFlags.advancedAnalytics ? 'ON' : 'OFF'}
                </Button>
              </div>
            </div>
          </div>

          {/* AI Model Assignment */}
          <div className="space-y-2">
            <label className="text-blue-200 font-medium flex items-center">
              <Bot className="mr-2 h-4 w-4" />
              AI Model Assignment
            </label>
            <div className="bg-gray-900/50 p-2 rounded">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-300">Auto-assigned:</span>
                <Badge className="bg-purple-600 text-white text-xs flex items-center w-32 justify-center">
                  {currentFlags.aiChatbot ? (
                    <>
                      <Zap className="mr-1 h-3 w-3" />
                      {user?.role === 'lab-owner' ? 'GPT-3.5-Turbo' : 'GPT-3.5-16k'}
                    </>
                  ) : (
                    'No AI Access'
                  )}
                </Badge>
              </div>
            </div>
            <div className="text-xs text-blue-300/70">
              Model switches automatically with user role
            </div>
          </div>

          {/* Performance Monitoring */}
          <div className="space-y-2">
            <label className="text-blue-200 font-medium flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Performance Monitor
            </label>

            {/* Latency Chart */}
            <div className="bg-gray-900/50 p-2 rounded text-xs">
              <div className="flex items-center justify-between mb-2">
                <span>Response Time</span>
                <span className={simulatedLatency > 400 ? "text-red-400" : "text-green-400"}>
                  {simulatedLatency}ms
                </span>
              </div>

              {/* Mini chart visualization */}
              <div className="flex items-end space-x-1 h-8">
                {metricHistory.map((latency, i) => (
                  <div
                    key={i}
                    className={`w-2 rounded-t ${
                      latency > 400 ? 'bg-red-500' :
                      latency > 200 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ height: `${Math.min((latency / 600) * 32, 32)}px` }}
                  />
                ))}
              </div>

              <div className="text-xs text-gray-400 mt-1">
                Live experiment data
              </div>
            </div>

            {/* Performance Controls */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={triggerHighLatency}
                className="h-7 text-xs"
                disabled={performanceState.simulationMode === 'high-latency'}
              >
                Spike Latency
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={restoreNormalLatency}
                className="h-7 text-xs bg-green-600 hover:bg-green-700"
                disabled={performanceState.simulationMode === 'normal'}
              >
                Fix Latency
              </Button>
            </div>
          </div>

          {/* Slack Integration Status */}
          <div className="space-y-2">
            <label className="text-blue-200 font-medium flex items-center">
              <Slack className="mr-2 h-4 w-4" />
              Integrations
            </label>
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-300">Slack</span>
              <div className="inline-flex items-center rounded-full border border-transparent bg-green-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                Connected
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoControlPanel;