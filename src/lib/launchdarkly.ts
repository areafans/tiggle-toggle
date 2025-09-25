import { LDUser } from 'launchdarkly-react-client-sdk';

export const LAUNCHDARKLY_CLIENT_ID = '68ce16f8c7621309bd982219';

export const createLDUser = (userId: string, role: 'lab-owner' | 'beta-user' | 'standard-user', name: string): LDUser => {
  return {
    key: userId,
    name: name,
    email: `${name.toLowerCase().replace(' ', '.')}@togglelab.com`,
    custom: {
      role: role,
      isBetaUser: role === 'beta-user',
      isLabOwner: role === 'lab-owner',
      team: 'ToggleLab Engineering',
    }
  };
};

export const createLDContext = (userId: string, role: 'lab-owner' | 'beta-user' | 'standard-user', name: string, demoMode?: string) => {
  // Create rich targeting attributes based on user role
  const baseContext = {
    kind: 'user',
    key: userId,
    name: name,
    email: `${name.toLowerCase().replace(' ', '.')}@togglelab.com`,
    role: role,
    team: 'ToggleLab Engineering',
    // Demo control attributes for targeting rules
    demoMode: demoMode || 'normal',
    advancedAnalyticsDemo: demoMode === 'advanced-analytics-on',
    aiChatbotDemo: demoMode === 'ai-chatbot-on',
    customAttribute: demoMode || 'standard'
  };

  // Add role-specific attributes for targeting
  switch (role) {
    case 'lab-owner':
      return {
        ...baseContext,
        isBetaUser: false,
        isLabOwner: true,
        accessLevel: 'admin',
        department: 'product',
        experienceLevel: 'expert',
        featureAccess: ['advanced-analytics', 'ai-chatbot', 'performance-monitoring'],
        subscriptionTier: 'enterprise',
        userSegment: 'power-user'
      };
    case 'beta-user':
      return {
        ...baseContext,
        isBetaUser: true,
        isLabOwner: false,
        accessLevel: 'beta',
        department: 'engineering',
        experienceLevel: 'advanced',
        featureAccess: ['ai-chatbot', 'beta-features'],
        subscriptionTier: 'pro',
        userSegment: 'early-adopter'
      };
    case 'standard-user':
      return {
        ...baseContext,
        isBetaUser: false,
        isLabOwner: false,
        accessLevel: 'standard',
        department: 'marketing',
        experienceLevel: 'beginner',
        featureAccess: ['basic-features'],
        subscriptionTier: 'basic',
        userSegment: 'regular-user'
      };
    default:
      return baseContext;
  }
};

// Feature flag keys for our demo scenarios (matching actual LaunchDarkly SDK format)
export const FEATURE_FLAGS = {
  // Guarded Rollout: Advanced analytics dashboard
  ADVANCED_ANALYTICS: 'advancedAnalytics',

  // User Targeting: AI chatbot with individual and rule-based targeting
  AI_CHATBOT_BETA: 'f2AiChatbot',

  // Configuration Management: AI model selection
  AI_MODEL_CONFIG: 'aiModelConfig',

  // Performance Monitoring: Auto-rollback capability
  AI_PERFORMANCE_MONITOR: 'aiPerformanceMonitor',

  // Integration Status: Slack connection
  SLACK_INTEGRATION: 'slackIntegration',
} as const;

// Default flag values for fallback
export const DEFAULT_FLAGS = {
  [FEATURE_FLAGS.ADVANCED_ANALYTICS]: false,
  [FEATURE_FLAGS.AI_CHATBOT_BETA]: false,
  [FEATURE_FLAGS.AI_MODEL_CONFIG]: 'gpt-4',
  [FEATURE_FLAGS.AI_PERFORMANCE_MONITOR]: true,
  [FEATURE_FLAGS.SLACK_INTEGRATION]: true,
} as const;