import { useEffect, useState } from 'react';
import { useLDClient, useFlags } from 'launchdarkly-react-client-sdk';

interface LDDebugInfo {
  isReady: boolean;
  isConnected: boolean;
  clientVersion: string | null;
  allFlags: Record<string, any>;
  flagCount: number;
  lastUpdate: Date | null;
  errors: string[];
}

export const useLaunchDarklyDebug = (): LDDebugInfo => {
  const ldClient = useLDClient();
  const flags = useFlags();
  const [debugInfo, setDebugInfo] = useState<LDDebugInfo>({
    isReady: false,
    isConnected: false,
    clientVersion: null,
    allFlags: {},
    flagCount: 0,
    lastUpdate: null,
    errors: []
  });

  useEffect(() => {
    if (!ldClient) {
      setDebugInfo(prev => ({
        ...prev,
        isConnected: false,
        errors: [...prev.errors, 'LaunchDarkly client not initialized']
      }));
      return;
    }

    const updateDebugInfo = () => {
      try {
        setDebugInfo({
          isReady: true, // If we have the client, assume it's ready
          isConnected: true,
          clientVersion: 'React SDK',
          allFlags: ldClient.allFlags(),
          flagCount: Object.keys(flags).length,
          lastUpdate: new Date(),
          errors: []
        });
      } catch (error) {
        setDebugInfo(prev => ({
          ...prev,
          errors: [...prev.errors, `Debug update error: ${error}`]
        }));
      }
    };

    // Initial update
    updateDebugInfo();

    // Listen for flag changes
    const handleFlagChange = () => {
      console.log('🏳️ LaunchDarkly flag changed', { flags: ldClient.allFlags() });
      updateDebugInfo();
    };

    const handleReady = () => {
      console.log('✅ LaunchDarkly client ready');
      updateDebugInfo();
    };

    const handleFailed = (error: Error) => {
      console.error('❌ LaunchDarkly client failed:', error);
      setDebugInfo(prev => ({
        ...prev,
        errors: [...prev.errors, `Client failed: ${error.message}`]
      }));
    };

    ldClient.on('ready', handleReady);
    ldClient.on('failed', handleFailed);
    ldClient.on('change', handleFlagChange);

    return () => {
      ldClient.off('ready', handleReady);
      ldClient.off('failed', handleFailed);
      ldClient.off('change', handleFlagChange);
    };
  }, [ldClient, flags]);

  return debugInfo;
};