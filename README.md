# ToggleLab - LaunchDarkly Feature Flag Demo

> A comprehensive demonstration of LaunchDarkly's feature flag capabilities in a realistic React application

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Available-brightgreen?style=for-the-badge)](https://tiggle-toggle.vercel.app)
[![Source Code](https://img.shields.io/badge/📚_Source_Code-GitHub-blue?style=for-the-badge)](https://github.com/areafans/tiggle-toggle)

## 🎯 What This Demonstrates

ToggleLab is a mock developer experience platform that showcases **real-world LaunchDarkly integration patterns**:

### 🔧 **Core LaunchDarkly Features**
- **Feature Rollouts** - Gradual feature releases with instant toggles
- **User Targeting & Segmentation** - Role-based feature access
- **Performance-Based Rollbacks** - Automatic circuit breaker patterns
- **AI Model Assignment** - Context-aware configuration via LaunchDarkly AI Config
- **Real-Time Updates** - Live flag changes without deployment

### 🏗️ **Technical Implementation Highlights**
- **Single Source of Truth** - Centralized flag evaluation preventing conflicts
- **Hybrid Architecture** - LaunchDarkly targeting + performance overrides
- **Global Kill Switch** - Cross-user performance monitoring
- **Clean React Patterns** - Custom hooks, context providers, TypeScript

---

## 🚀 **[Try the Live Demo](https://tiggle-toggle.vercel.app)**

**No setup required!** Click the link above and start exploring immediately.

### **Demo Scenarios to Try:**

#### **1. 👤 User Role Targeting**
- Switch between **Alex Chen** (Lab Owner), **Sam Rivera** (Beta User), and **Jordan Kim** (Standard User)
- Notice how **Jordan Kim never sees the AI Chatbot** due to LaunchDarkly targeting rules
- **Alex** and **Sam** get different AI models assigned automatically

#### **2. ⚡ Feature Rollouts**
- Toggle **"F1 - Advanced Analytics"** in the demo control panel
- See the feature appear/disappear instantly via **real LaunchDarkly API calls**
- Check the browser console for LaunchDarkly SDK activity

#### **3. 🔥 Performance Kill Switch**
- Click **"Spike Latency"** while logged in as **Alex Chen**
- Watch the **AI Chatbot disappear** due to simulated performance issues
- **Switch to Sam Rivera** - AI is still disabled (global kill switch)
- **Switch to Jordan Kim** - No AI access anyway (targeting preserved)
- Click **"Fix Latency"** to restore AI for eligible users

#### **4. 🤖 AI Model Assignment**
- Observe the **"Auto-assigned"** AI model badges
- **Alex**: Gets GPT-3.5-Turbo (lab owner privileges)
- **Sam**: Gets GPT-3.5-16k (beta user access)
- **Jordan**: No AI access (standard user)
- Models assigned via **LaunchDarkly AI Config** targeting rules

---

## 🏗️ **Architecture & Implementation**

### **Key Components**

#### **🎣 `useFeatureFlags()` Hook** - *Single Source of Truth*
```typescript
/**
 * Centralized feature flag evaluation
 * - Eliminates flag conflicts and cross-contamination
 * - Combines LaunchDarkly targeting with performance overrides
 * - Global kill switch affects all users with flag access
 */
export const useFeatureFlags = () => {
  const flags = useFlags(); // LaunchDarkly React SDK
  const { performanceState } = useDemo(); // Global performance monitoring

  // Hybrid logic: LaunchDarkly targeting + performance circuit breaker
  const aiChatbot = (performanceState.killSwitchArmed && ldAiChatbot) ? false :
                    ldAiChatbot;

  return { advancedAnalytics, aiChatbot, _debug };
};
```

#### **🌐 Global Performance Monitoring**
```typescript
/**
 * Cross-user performance state management
 * - Kill switch persists across user switches
 * - Simulates real APM integration patterns
 * - Protects user experience during performance degradation
 */
interface PerformanceState {
  currentLatency: number;
  killSwitchArmed: boolean;
  simulationMode: 'normal' | 'high-latency';
}
```

### **LaunchDarkly Integration Patterns**

#### **🎯 User Context & Targeting**
```typescript
// Dynamic user context for targeting rules
const ldContext = {
  kind: 'user',
  key: user.id,
  name: user.name,
  custom: {
    role: user.role,        // Used for targeting: 'lab-owner', 'beta-user', 'standard-user'
    department: 'engineering',
    beta_features: user.role !== 'standard-user'
  }
};
```

#### **🔄 Real-Time Flag Updates**
- LaunchDarkly React SDK provides **automatic re-rendering** when flags change
- **Server-Sent Events** keep flags in sync across browser tabs
- **Performance monitoring** triggers automatic flag changes via API

#### **🚦 Flag Evaluation Logic**
```typescript
// Advanced Analytics: Pure LaunchDarkly evaluation
const advancedAnalytics = flags['advancedAnalytics'] ?? false;

// AI Chatbot: Hybrid evaluation (targeting + performance)
const ldAiChatbot = flags['f2AiChatbot'] ?? false;
const aiChatbot = (killSwitchArmed && ldAiChatbot) ? false : ldAiChatbot;
```

---

## 🎨 **UI/UX Highlights**

### **📱 Demo Control Panel**
- **Floating controls** for easy access during demos
- **Real-time performance metrics** with live charts
- **User role switching** to demonstrate targeting
- **Feature toggles** that make actual LaunchDarkly API calls

### **🎭 User Experience**
- **Role-based dashboards** showing different feature sets
- **Smooth transitions** when features appear/disappear
- **Clear visual feedback** for flag states and performance
- **Console logging** showing LaunchDarkly SDK activity

---

## 🛠️ **Technical Stack**

- **Frontend**: React 18 + TypeScript + TailwindCSS
- **Feature Flags**: LaunchDarkly React Client SDK
- **State Management**: React Context + Custom Hooks
- **Backend**: Express.js + LaunchDarkly Server SDK (for AI Config)
- **Deployment**: Vercel (auto-deploy from GitHub)
- **Styling**: Tailwind CSS + shadcn/ui components

---

## 📊 **LaunchDarkly Features Demonstrated**

| Feature | Implementation | Demo Scenario |
|---------|---------------|---------------|
| **Boolean Flags** | `advancedAnalytics` toggle | F1 - Advanced Analytics button |
| **User Targeting** | Role-based `f2AiChatbot` rules | Jordan Kim exclusion |
| **Flag Dependencies** | Performance overrides | Kill switch during latency spikes |
| **Real-time Updates** | SSE + React re-rendering | Live flag changes |
| **API Integration** | Server-side flag toggles | Advanced Analytics API calls |
| **AI Config** | Context-aware model assignment | Auto-assigned AI models |
| **Experimentation** | Performance metrics tracking | Latency monitoring |

---

## 📁 **Code Organization**

```
src/
├── hooks/
│   └── useFeatureFlags.ts     # 🎯 Single source of truth for flags
├── contexts/
│   ├── AuthContext.tsx        # User management & role switching
│   ├── DemoContext.tsx        # Global demo state & performance
│   └── LaunchDarklyContext.tsx # LD user context management
├── components/
│   ├── DemoControlPanel.tsx   # Demo controls + performance monitoring
│   ├── AIChatbot.tsx         # Feature-flagged AI assistant
│   └── ui/                   # Reusable UI components
├── pages/
│   └── Dashboard.tsx         # Main demo interface
└── lib/
    ├── launchdarkly.ts       # LD configuration & utilities
    └── experimentTracker.ts  # Performance metrics integration
```

---

## 🔍 **Key Implementation Details**

### **Environment Setup**
```bash
# LaunchDarkly Configuration (set in Vercel)
REACT_APP_LD_CLIENT_SIDE_ID=your-client-id
LD_SDK_KEY=your-server-sdk-key
OPENAI_API_KEY=your-openai-key
```

### **Flag Configuration**
```json
{
  "advancedAnalytics": {
    "type": "boolean",
    "targeting": "manual-toggle",
    "purpose": "Feature rollout demonstration"
  },
  "f2AiChatbot": {
    "type": "boolean",
    "targeting": "role-based-rules",
    "purpose": "User segmentation demonstration"
  }
}
```

---

## 🎪 **Perfect for Demos**

This repository showcases:

✅ **Real LaunchDarkly Integration** - Not mocked or simulated
✅ **Production-Ready Patterns** - Scalable architecture
✅ **Multiple Use Cases** - Feature rollouts, targeting, performance
✅ **Clean Code Examples** - Well-commented, maintainable
✅ **Live Functionality** - Interactive demo scenarios
✅ **Educational Value** - Learn by exploring working code

---

## 🚀 **Getting Started**

### **Option 1: Explore the Live Demo**
👆 **[Click here for live demo](https://tiggle-toggle.vercel.app)** - No setup required!

### **Option 2: Run Locally**
```bash
# Clone the repository
git clone https://github.com/areafans/tiggle-toggle.git
cd tiggle-toggle

# Install dependencies
npm install

# Set up environment variables (see .env.example)
cp .env.example .env.local
# Edit .env.local with your LaunchDarkly credentials

# Start the development server
npm start
```

---

## 📞 **Questions or Feedback?**

This demo was created to showcase LaunchDarkly's capabilities in a realistic application context.

- **Live Demo**: https://tiggle-toggle.vercel.app
- **Source Code**: https://github.com/areafans/tiggle-toggle
- **Issues/Feedback**: [GitHub Issues](https://github.com/areafans/tiggle-toggle/issues)

---

*Built with ❤️ to demonstrate the power of LaunchDarkly feature flags*
# Environment variables configured for Vercel deployment
