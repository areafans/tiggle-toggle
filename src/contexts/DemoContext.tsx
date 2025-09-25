import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DemoOverrides {
  advancedAnalytics?: boolean;
  aiChatbot?: boolean;
  aiModel?: string;
  simulatedLatency?: number;
}

interface PerformanceState {
  currentLatency: number;
  killSwitchArmed: boolean;
  simulationMode: 'normal' | 'high-latency';
}

interface DemoContextType {
  isDemo: boolean;
  overrides: DemoOverrides;
  performanceState: PerformanceState;
  setOverride: (key: keyof DemoOverrides, value: any) => void;
  clearOverride: (key: keyof DemoOverrides) => void;
  clearAllOverrides: () => void;
  setDemoMode: (enabled: boolean) => void;
  updatePerformanceState: (updates: Partial<PerformanceState>) => void;
  setSimulationMode: (mode: 'normal' | 'high-latency') => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDemo, setIsDemo] = useState(false);
  const [overrides, setOverrides] = useState<DemoOverrides>({});
  const [performanceState, setPerformanceState] = useState<PerformanceState>({
    currentLatency: 80,
    killSwitchArmed: false,
    simulationMode: 'normal'
  });

  const setOverride = (key: keyof DemoOverrides, value: any) => {
    setOverrides(prev => ({ ...prev, [key]: value }));
    setIsDemo(true);
  };

  const clearOverride = (key: keyof DemoOverrides) => {
    setOverrides(prev => {
      const newOverrides = { ...prev };
      delete newOverrides[key];

      // If no overrides remain, disable demo mode
      if (Object.keys(newOverrides).length === 0) {
        setIsDemo(false);
      }

      return newOverrides;
    });
  };

  const clearAllOverrides = () => {
    setOverrides({});
    setIsDemo(false);
  };

  const setDemoMode = (enabled: boolean) => {
    setIsDemo(enabled);
    if (!enabled) {
      setOverrides({});
    }
  };

  const updatePerformanceState = (updates: Partial<PerformanceState>) => {
    setPerformanceState(prev => ({ ...prev, ...updates }));
  };

  const setSimulationMode = (mode: 'normal' | 'high-latency') => {
    updatePerformanceState({ simulationMode: mode });
  };

  return (
    <DemoContext.Provider value={{
      isDemo,
      overrides,
      performanceState,
      setOverride,
      clearOverride,
      clearAllOverrides,
      setDemoMode,
      updatePerformanceState,
      setSimulationMode
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};

// REMOVED: useFlagWithDemo hook to prevent LaunchDarkly targeting bypass
// All flag evaluation should use pure LaunchDarkly evaluation for accurate targeting demo