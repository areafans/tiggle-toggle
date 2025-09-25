# ToggleLab AI Config Integration Setup Guide

This guide walks you through setting up the real LaunchDarkly AI Config integration with OpenAI for your ToggleLab project.

## Overview

The implementation consists of:
- **Backend Service**: Express.js server using LaunchDarkly AI SDK + OpenAI API
- **Frontend Integration**: Updated React AIChatbot component calling backend service
- **LaunchDarkly AI Config**: Dashboard configuration for model/prompt management
- **Real Experimentation**: A/B testing different AI configurations

## Prerequisites

1. **LaunchDarkly Account** with AI Config feature enabled
2. **OpenAI API Key** from https://platform.openai.com/api-keys
3. **Node.js** v16+ and npm

## Step 1: Environment Setup

1. **Copy the environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Get your LaunchDarkly Server SDK Key:**
   - Go to https://app.launchdarkly.com/settings/projects
   - Select your project
   - Copy the **"SDK key"** (NOT the Client-side ID)
   - Paste it in `.env` as `LAUNCHDARKLY_SDK_KEY`

3. **Get your OpenAI API Key:**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Paste it in `.env` as `OPENAI_API_KEY`

4. **Your `.env` file should look like:**
   ```env
   LAUNCHDARKLY_SDK_KEY=sdk-abc123...
   OPENAI_API_KEY=sk-abc123...
   PORT=3001
   ```

## Step 2: LaunchDarkly AI Config Setup

1. **Create AI Config in LaunchDarkly Dashboard:**
   - Go to your LaunchDarkly project
   - Navigate to "AI Configs" section
   - Click "Create AI Config"
   - Use key: `chatbot-config`

2. **Configure Default Variation (Low-Cost Model):**
   ```json
   {
     "model": {
       "name": "gpt-3.5-turbo",
       "parameters": {
         "temperature": 0.7,
         "max_tokens": 300
       }
     },
     "messages": [
       {
         "role": "system",
         "content": "You are an AI assistant for ToggleLab, a developer experience platform. You help with experiment design, metrics analysis, and performance monitoring. Keep responses helpful, concise, and focused on developer productivity."
       }
     ]
   }
   ```

3. **Create Alternative Variations for A/B Testing:**

   **Variation: "Casual Assistant"**
   ```json
   {
     "model": {
       "name": "gpt-3.5-turbo",
       "parameters": {
         "temperature": 0.9,
         "max_tokens": 300
       }
     },
     "messages": [
       {
         "role": "system",
         "content": "Hey! I'm your friendly AI buddy for ToggleLab 🚀 I'm here to make experiment design fun and help you crush those metrics! Let's build something awesome together!"
       }
     ]
   }
   ```

   **Variation: "Technical Expert"**
   ```json
   {
     "model": {
       "name": "gpt-3.5-turbo-16k",
       "parameters": {
         "temperature": 0.3,
         "max_tokens": 400
       }
     },
     "messages": [
       {
         "role": "system",
         "content": "I am a senior technical consultant specializing in feature flag management, statistical analysis, and performance optimization. I provide detailed technical guidance for enterprise-grade experimentation platforms."
       }
     ]
   }
   ```

4. **Set Up Targeting Rules:**
   - **Lab Owners** → Technical Expert variation
   - **Beta Users** → Default variation
   - **Standard Users** → Casual Assistant variation

## Step 3: Running the Application

1. **Start both frontend and backend:**
   ```bash
   npm run dev
   ```

   Or run separately:
   ```bash
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend
   npm start
   ```

2. **Verify Services:**
   - Frontend: http://localhost:3000
   - Backend Health: http://localhost:3001/health
   - AI Config Status: http://localhost:3001/api/ai-config-status

## Step 4: Testing the Integration

1. **Check Service Connection:**
   - Open ToggleLab (http://localhost:3000)
   - Switch to a Beta User (Sam Rivera) to see AI Chatbot
   - Look for green connection indicator in chatbot header

2. **Test AI Responses:**
   - Send message: "How to optimize experiments?"
   - Verify real OpenAI response appears
   - Check response metadata (model, response time, tokens)

3. **Test User Targeting:**
   - Switch between different user roles
   - Verify different AI personalities/models based on targeting rules

## Step 5: Experimentation Setup

1. **Create Experiment in LaunchDarkly:**
   - Go to Experiments section
   - Create new experiment on `chatbot-config` AI Config
   - Set metrics: response_time_ms, tokens_used, user_satisfaction

2. **Track Custom Metrics:**
   The backend automatically tracks:
   - `response_time_ms` - AI response latency
   - `tokens_used` - OpenAI token consumption
   - `model_used` - Which model was used
   - `success` - Whether request succeeded

3. **Monitor Performance:**
   - LaunchDarkly will show real-time metrics
   - Set up alerts for high latency or errors
   - Implement automatic rollback rules

## Project Structure

```
togglelab/
├── server/
│   └── index.js           # Express backend with LaunchDarkly AI SDK
├── src/
│   └── components/
│       └── AIChatbot.tsx  # Updated React component
├── .env.example           # Environment template
├── .env                   # Your actual environment (create this)
└── AI-CONFIG-SETUP.md     # This guide
```

## Troubleshooting

### Backend Won't Start
- Check `.env` file exists with correct keys
- Verify LaunchDarkly SDK key is server-side (not client-side ID)
- Ensure OpenAI API key is valid and has sufficient credits

### React App Can't Connect
- Verify backend is running on port 3001
- Check CORS settings in server/index.js
- Look for network errors in browser dev tools

### AI Config Not Found
- Verify AI Config exists in LaunchDarkly with key `chatbot-config`
- Check LaunchDarkly project and environment
- Ensure AI Config feature is enabled for your account

### OpenAI API Errors
- Check OpenAI API key validity
- Verify sufficient account credits
- Check rate limits and usage quotas

## Next Steps

1. **Create More Variations:** Test different models (Claude, Gemini) if available
2. **Advanced Metrics:** Track user satisfaction, conversation length
3. **Auto-Rollback:** Set up performance-based rollback rules
4. **Production Setup:** Configure production environment variables
5. **Custom Metrics:** Add business-specific metrics tracking

## Architecture Benefits

✅ **Real LaunchDarkly AI Config** - No simulations or workarounds
✅ **OpenAI Integration** - Actual GPT-4/3.5-turbo responses
✅ **User Targeting** - Different AI configs per user segment
✅ **A/B Testing** - Compare model performance and costs
✅ **Metrics Tracking** - Real-time performance monitoring
✅ **Auto-Rollback** - Performance-based feature flag controls
✅ **Seamless Integration** - Works with existing ToggleLab demo

This implementation provides a production-ready foundation for AI product management using LaunchDarkly's AI Config feature.