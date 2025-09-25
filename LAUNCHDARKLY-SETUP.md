# LaunchDarkly Setup Guide for ToggleLab

## Overview
ToggleLab demonstrates LaunchDarkly's feature flag capabilities through a realistic React application. This guide walks through setting up your own LaunchDarkly environment to run the demo.

## Prerequisites
- LaunchDarkly account (free trial available at [launchdarkly.com](https://launchdarkly.com))
- OpenAI API key (for AI Chatbot feature)
- Node.js 18+ and npm

## Step 1: LaunchDarkly Project Setup

### 1.1 Create a New Project
1. Log into your LaunchDarkly dashboard
2. Create a new project named "ToggleLab Demo"
3. Set up Test and Production environments

### 1.2 Get Your SDK Keys
From your project settings, copy these values:
- **Client-side ID**: For React frontend integration
- **Server SDK Key**: For backend AI Config integration

## Step 2: Feature Flag Configuration

Create these feature flags in your LaunchDarkly dashboard:

### Flag 1: Advanced Analytics (`advanced-analytics`)
- **Type**: Boolean
- **Purpose**: Feature rollout demonstration
- **Default Value**: `false`
- **Targeting**: Manual toggle (no specific rules needed)

### Flag 2: AI Chatbot (`f2-ai-chatbot`)
- **Type**: Boolean
- **Purpose**: User targeting demonstration
- **Default Value**: `false`
- **Targeting Rules**:
  ```
  IF user.role is one of ["lab-owner", "beta-user"]
    THEN serve: true
  ELSE
    THEN serve: false
  ```

### Flag 3: AI Model Config (`chatbot-config`)
- **Type**: AI Config
- **Purpose**: Context-aware model assignment
- **Configuration**:
  - **Lab Owner**: GPT-3.5-Turbo
  - **Beta User**: GPT-3.5-16k
  - **Standard User**: No access

## Step 3: AI Config Setup (Optional but Recommended)

### 3.1 Create AI Config
1. Go to AI Configs in LaunchDarkly dashboard
2. Create new config with key: `chatbot-config`
3. Set up model assignments based on user context

### 3.2 Model Assignment Rules
```json
{
  "model": {
    "if": [
      {"var": "user.role"},
      {
        "lab-owner": "gpt-3.5-turbo",
        "beta-user": "gpt-3.5-turbo-16k",
        "standard-user": null
      },
      "gpt-3.5-turbo"
    ]
  },
  "temperature": 0.7,
  "max_tokens": 150
}
```

## Step 4: Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
# LaunchDarkly Configuration
REACT_APP_LD_CLIENT_SIDE_ID=your-client-side-id-here
LAUNCHDARKLY_SDK_KEY=your-server-sdk-key-here

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Server Configuration
PORT=3001
```

## Step 5: User Context Configuration

The demo uses three predefined users for targeting:

### Alex Chen (Lab Owner)
- **Role**: `lab-owner`
- **Attributes**: Full access to all features
- **AI Model**: GPT-3.5-Turbo

### Sam Rivera (Beta User)
- **Role**: `beta-user`
- **Attributes**: Beta feature access
- **AI Model**: GPT-3.5-16k

### Jordan Kim (Standard User)
- **Role**: `standard-user`
- **Attributes**: Basic access only
- **AI Model**: No access

## Step 6: API Access (For Flag Toggling)

To enable the "Advanced Analytics" toggle in the demo:

1. Generate an API access token in LaunchDarkly
2. Update the API token in `src/components/DemoControlPanel.tsx`
3. Ensure the token has `writer` permissions for your project

## Step 7: Testing the Integration

Start the application and verify:

1. **Flag Evaluation**: Check browser console for LaunchDarkly connection logs
2. **User Targeting**: Switch between users and verify AI chatbot visibility
3. **Performance Kill Switch**: Test latency spike simulation
4. **API Integration**: Toggle Advanced Analytics flag

## Troubleshooting

### Common Issues

**1. Flags not loading**
- Verify Client-side ID is correct
- Check browser network tab for LaunchDarkly requests
- Ensure flags exist in your LaunchDarkly project

**2. Targeting not working**
- Verify user context attributes match targeting rules
- Check flag targeting configuration in LaunchDarkly dashboard
- Review browser console for targeting evaluation logs

**3. AI Chatbot not appearing**
- Confirm OpenAI API key is valid
- Check server console for AI Config errors
- Verify user has appropriate targeting rules

### Debug Mode

Enable debug logging by checking the browser console. ToggleLab provides comprehensive logging for:
- Flag evaluation results
- User context updates
- Performance monitoring
- API responses

## Demo Scenarios

Once set up, try these demo scenarios:

1. **Feature Rollout**: Toggle Advanced Analytics ON/OFF via demo controls
2. **User Targeting**: Switch to Jordan Kim → AI chatbot should disappear
3. **Performance Circuit Breaker**: Spike latency → AI disables globally
4. **Model Assignment**: Notice different AI models per user role

## Support

For LaunchDarkly-specific issues:
- [LaunchDarkly Documentation](https://docs.launchdarkly.com/)
- [LaunchDarkly Support](https://support.launchdarkly.com/)

For ToggleLab demo issues:
- Check the GitHub repository issues section
- Review the console logs for detailed error information