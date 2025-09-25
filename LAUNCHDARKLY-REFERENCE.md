# LaunchDarkly Flag Key Reference Guide

## Definitive Naming Convention (September 2025)

### LaunchDarkly Dashboard/API (kebab-case)
- **f2-ai-chatbot** → Controls AI chatbot visibility
- **advanced-analytics** → Controls advanced analytics features

### React SDK (camelCase - auto-transformed)
- **f2AiChatbot** → Use this in React code
- **advancedAnalytics** → Use this in React code

### Code Usage

#### ✅ CORRECT - React Components
```javascript
// In React components - use camelCase
const flags = useFlags();
const aiChatbotEnabled = flags.f2AiChatbot;
const advancedAnalyticsEnabled = flags.advancedAnalytics;

// Or with constants
const aiChatbotEnabled = flags[FEATURE_FLAGS.AI_CHATBOT_BETA];
```

#### ✅ CORRECT - Feature Flag Constants
```javascript
export const FEATURE_FLAGS = {
  ADVANCED_ANALYTICS: 'advancedAnalytics',
  AI_CHATBOT_BETA: 'f2AiChatbot',
};
```

#### ✅ CORRECT - REST API Calls
```javascript
// API calls - use kebab-case
const response = await fetch('https://app.launchdarkly.com/api/v2/flags/default/f2-ai-chatbot');
const response = await fetch('https://app.launchdarkly.com/api/v2/flags/default/advanced-analytics');
```

#### ✅ CORRECT - Server SDK (Node.js)
```javascript
// Server SDK - use kebab-case (original flag keys)
const aiEnabled = ldClient.variation('f2-ai-chatbot', context, false);
const analyticsEnabled = ldClient.variation('advanced-analytics', context, false);
```

### Key Rules
1. **React SDK**: Always use camelCase (`f2AiChatbot`, `advancedAnalytics`)
2. **REST API**: Always use kebab-case (`f2-ai-chatbot`, `advanced-analytics`)
3. **Server SDK**: Always use kebab-case (`f2-ai-chatbot`, `advanced-analytics`)

### Debug Commands
```bash
# Check what React SDK actually serves:
curl "https://clientsdk.launchdarkly.com/sdk/evalx/CLIENT_ID/contexts/BASE64_CONTEXT"

# Check flag state in LaunchDarkly:
curl "https://app.launchdarkly.com/api/v2/flags/default/f2-ai-chatbot"
```