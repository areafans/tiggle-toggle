import React from 'react';
import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { FEATURE_FLAGS } from '../lib/launchdarkly';
import { useAuth } from '../contexts/AuthContext';
import { useLaunchDarklyDebug } from '../hooks/useLaunchDarklyDebug';
import { RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

const DebugPanel: React.FC = () => {
  const flags = useFlags();
  const ldClient = useLDClient();
  const { user } = useAuth();
  const debugInfo = useLaunchDarklyDebug();

  const isLDConnected = ldClient !== undefined;

  const handleRefresh = () => {
    if (ldClient) {
      console.log('🔄 Forcing LaunchDarkly refresh...');

      // Force evaluation of our specific flags
      const currentFlags = {
        'advancedAnalytics': ldClient.variation('advancedAnalytics'),
        'f2AiChatbot': ldClient.variation('f2AiChatbot')
      };

      console.log('Current flag evaluations:', currentFlags);

      ldClient.flush().then(() => {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  };

  return (
    <Card className="border-yellow-500/50 bg-yellow-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-yellow-100">
            🐛 LaunchDarkly Debug Panel
          </CardTitle>
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        {/* Status Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Connection Status:</span>
            <div className="flex items-center gap-2">
              {debugInfo.isConnected ? <CheckCircle className="h-3 w-3 text-green-500" /> : <AlertTriangle className="h-3 w-3 text-red-500" />}
              <Badge className={debugInfo.isConnected ? "bg-green-600" : "bg-red-600"}>
                {debugInfo.isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>Client Ready:</span>
            <div className="flex items-center gap-2">
              {debugInfo.isReady ? <CheckCircle className="h-3 w-3 text-green-500" /> : <AlertTriangle className="h-3 w-3 text-yellow-500" />}
              <Badge variant={debugInfo.isReady ? "default" : "secondary"}>
                {debugInfo.isReady ? "Ready" : "Initializing"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>SDK Version:</span>
            <Badge variant="secondary">
              {debugInfo.clientVersion || "Unknown"}
            </Badge>
          </div>
        </div>

        {/* Errors */}
        {debugInfo.errors.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium text-red-400 flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Errors:
            </div>
            {debugInfo.errors.map((error, index) => (
              <div key={index} className="text-red-300 text-xs bg-red-900/20 p-2 rounded">
                {error}
              </div>
            ))}
          </div>
        )}

        {/* Current User */}
        <div className="flex items-center justify-between">
          <span>Current User:</span>
          <span className="text-blue-300">
            {user?.name} ({user?.role})
          </span>
        </div>

        {/* Feature Flags */}
        <div className="space-y-2">
          <div className="font-medium text-yellow-200">Demo Feature Flags:</div>

          <div className="flex items-center justify-between">
            <span>F1 - Advanced Analytics:</span>
            <Badge variant={flags[FEATURE_FLAGS.ADVANCED_ANALYTICS] ? "default" : "outline"}>
              {flags[FEATURE_FLAGS.ADVANCED_ANALYTICS]?.toString() || 'undefined'}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>F2 - AI Chatbot:</span>
            <Badge variant={flags[FEATURE_FLAGS.AI_CHATBOT_BETA] ? "default" : "outline"}>
              {flags[FEATURE_FLAGS.AI_CHATBOT_BETA]?.toString() || 'undefined'}
            </Badge>
          </div>
        </div>

        {/* Client Information */}
        <div className="space-y-2">
          <div className="font-medium text-yellow-200">Client Info:</div>
          <div className="flex items-center justify-between">
            <span>Client Ready:</span>
            <Badge variant={ldClient ? "default" : "destructive"}>
              {ldClient ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Flags Count:</span>
            <Badge variant="secondary">
              {Object.keys(flags).length}
            </Badge>
          </div>
        </div>

        {/* Raw Flags Object */}
        <details className="mt-4">
          <summary className="cursor-pointer text-yellow-200">
            Raw Flags (useFlags: {Object.keys(flags).length}, allFlags: {Object.keys(debugInfo.allFlags).length})
          </summary>
          <div className="mt-2 space-y-2">
            <div>
              <div className="text-yellow-300 text-xs mb-1">From useFlags():</div>
              <pre className="p-2 bg-black/50 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(flags, null, 2)}
              </pre>
            </div>
            <div>
              <div className="text-yellow-300 text-xs mb-1">From client.allFlags():</div>
              <pre className="p-2 bg-black/50 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(debugInfo.allFlags, null, 2)}
              </pre>
            </div>
          </div>
        </details>

        {/* Expected Flag Keys */}
        <details className="mt-4">
          <summary className="cursor-pointer text-yellow-200">Expected Flag Keys</summary>
          <pre className="mt-2 p-2 bg-black/50 rounded text-xs overflow-auto">
            {JSON.stringify(FEATURE_FLAGS, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
};

export default DebugPanel;