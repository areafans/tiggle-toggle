import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk';
import { cn } from '../lib/utils';
import { FEATURE_FLAGS } from '../lib/launchdarkly';
import {
  LayoutDashboard,
  FlaskConical,
  BarChart3,
  Users,
  Settings,
  Zap,
  Circle
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Experiments', href: '/labs', icon: FlaskConical },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const flags = useFlags();
  const ldClient = useLDClient();

  // Get current flag states using PURE LaunchDarkly evaluation only
  const currentFlags = {
    advancedAnalytics: flags[FEATURE_FLAGS.ADVANCED_ANALYTICS] || false, // Pure LD
    aiChatbot: flags[FEATURE_FLAGS.AI_CHATBOT_BETA] || false, // Pure LD for targeting
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">ToggleLab</span>
        </div>

        {/* User Info */}
        <div className="mb-8 p-3 bg-secondary rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{user?.avatar}</div>
            <div>
              <div className="font-semibold text-sm">{user?.name}</div>
              <div className="text-xs text-muted-foreground capitalize">
                {user?.role.replace('-', ' ')}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 mb-8">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )
              }
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* LaunchDarkly Debug Panel */}
        <div className="p-3 bg-secondary/50 rounded-lg border">
          <div className="text-xs font-semibold text-muted-foreground mb-2">LaunchDarkly Debug</div>
          <div className="space-y-2">
            {/* Connection Status */}
            <div className="flex items-center justify-between text-xs">
              <span>Connection</span>
              <div className="flex items-center">
                <Circle className={cn("w-2 h-2 mr-1", ldClient ? "fill-green-500 text-green-500" : "fill-red-500 text-red-500")} />
                <span className={ldClient ? "text-green-400" : "text-red-400"}>
                  {ldClient ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>

            {/* Analytics Flag */}
            <div className="flex items-center justify-between text-xs">
              <span>Analytics</span>
              <span className={currentFlags.advancedAnalytics ? "text-green-400" : "text-red-400"}>
                {currentFlags.advancedAnalytics ? "true" : "false"}
              </span>
            </div>

            {/* Chatbot Flag */}
            <div className="flex items-center justify-between text-xs">
              <span>Chatbot</span>
              <span className={currentFlags.aiChatbot ? "text-green-400" : "text-red-400"}>
                {currentFlags.aiChatbot ? "true" : "false"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;