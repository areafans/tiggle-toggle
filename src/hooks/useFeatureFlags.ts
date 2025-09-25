import { useFlags } from 'launchdarkly-react-client-sdk';
import { useDemo } from '../contexts/DemoContext';
import { FEATURE_FLAGS, DEFAULT_FLAGS } from '../lib/launchdarkly';

/**
 * SINGLE SOURCE OF TRUTH for all feature flag evaluation
 * Handles LaunchDarkly targeting + performance overrides correctly
 */
export const useFeatureFlags = () => {
  const flags = useFlags();
  const { overrides, performanceState } = useDemo();

  // Advanced Analytics: Pure LaunchDarkly (no overrides needed)
  const advancedAnalytics = flags[FEATURE_FLAGS.ADVANCED_ANALYTICS] ?? DEFAULT_FLAGS[FEATURE_FLAGS.ADVANCED_ANALYTICS];

  // AI Chatbot: LaunchDarkly targeting + global performance kill switch
  const ldAiChatbot = flags[FEATURE_FLAGS.AI_CHATBOT_BETA] ?? DEFAULT_FLAGS[FEATURE_FLAGS.AI_CHATBOT_BETA];

  // Global performance override: ONLY applies if user already has LaunchDarkly access
  // This ensures Jordan Kim is never affected by kill switch (he has no LD access)
  // Kill switch is global - if armed, it affects ALL users who normally have access
  const aiChatbot = (performanceState.killSwitchArmed && ldAiChatbot) ? false :
                    (overrides.aiChatbot === false && ldAiChatbot) ? false :
                    ldAiChatbot;

  return {
    advancedAnalytics,
    aiChatbot,
    // Debug info
    _debug: {
      ldAiChatbot,
      performanceOverride: overrides.aiChatbot,
      globalKillSwitch: performanceState.killSwitchArmed,
      currentLatency: performanceState.currentLatency,
      simulationMode: performanceState.simulationMode,
      finalAiChatbot: aiChatbot
    }
  };
};