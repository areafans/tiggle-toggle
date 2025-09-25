# ToggleLab Deployment Guide

## Overview
This guide covers deploying ToggleLab to Vercel for public demonstrations and stakeholder access.

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- LaunchDarkly account with configured flags
- OpenAI API key

## Deployment Steps

### 1. GitHub Repository Setup

The repository is already configured for Vercel deployment with:
- `vercel.json` configuration file
- `.env.example` template
- Auto-deployment ready React build

### 2. Vercel Project Creation

#### Option A: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import from GitHub repository
4. Select your ToggleLab fork/repository

#### Option B: Vercel CLI
```bash
npm i -g vercel
vercel
# Follow the prompts to link your project
```

### 3. Environment Variables Configuration

In your Vercel project dashboard, add these environment variables:

#### Required Variables
```bash
# LaunchDarkly Configuration
REACT_APP_LD_CLIENT_SIDE_ID=your-client-side-id
LAUNCHDARKLY_SDK_KEY=your-server-sdk-key

# OpenAI Configuration (for AI features)
OPENAI_API_KEY=your-openai-api-key

# Server Configuration
PORT=3001
```

#### How to Add Variables in Vercel
1. Go to your project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with appropriate values
4. Ensure variables are enabled for Production, Preview, and Development

### 4. Build Configuration

ToggleLab is pre-configured with:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

This configuration:
- Builds the React app using `npm run build`
- Serves the static files from the `build` directory
- Handles client-side routing with fallback to `index.html`

### 5. Deployment Process

#### Automatic Deployment
- Push to your main branch triggers automatic deployment
- Vercel builds and deploys automatically
- Environment variables are injected at build time

#### Manual Deployment
```bash
# Deploy from local machine
vercel --prod

# Or redeploy latest from dashboard
# Click "Redeploy" in Vercel dashboard
```

### 6. Post-Deployment Verification

After deployment, verify these features work:

#### 6.1 LaunchDarkly Integration
- [ ] Feature flags load correctly
- [ ] User targeting works (Jordan Kim doesn't see AI)
- [ ] Flag toggles update in real-time
- [ ] Console shows LaunchDarkly SDK activity

#### 6.2 Demo Functionality
- [ ] User switching works
- [ ] Advanced Analytics toggle functional
- [ ] Performance monitoring active
- [ ] AI chatbot appears for appropriate users

#### 6.3 Performance
- [ ] Initial page load < 3 seconds
- [ ] Flag evaluation < 1 second
- [ ] Smooth user switching
- [ ] Responsive design on mobile

## Live Demo URL Structure

Your deployed demo will be available at:
```
https://your-project-name.vercel.app
```

### Sharing with Stakeholders

Create a simple access guide:

```markdown
# ToggleLab Live Demo Access

🚀 **Live Demo**: https://your-project-name.vercel.app

## Quick Demo Steps:
1. **User Targeting**: Switch between users in demo controls
2. **Feature Rollout**: Toggle "F1 - Advanced Analytics"
3. **Performance Kill Switch**: Click "Spike Latency" to see circuit breaker
4. **AI Model Assignment**: Notice auto-assigned models per user

## Users Available:
- **Alex Chen** (Lab Owner): Full access, GPT-3.5-Turbo
- **Sam Rivera** (Beta User): AI access, GPT-3.5-16k
- **Jordan Kim** (Standard User): No AI access (targeting demo)
```

## Troubleshooting

### Common Deployment Issues

#### 1. Build Failures
```bash
# Check build logs in Vercel dashboard
# Common issues:
- Missing environment variables
- TypeScript compilation errors
- Missing dependencies
```

#### 2. LaunchDarkly Connection Issues
- Verify `REACT_APP_LD_CLIENT_SIDE_ID` is correct
- Check LaunchDarkly dashboard for connection logs
- Ensure environment variables are set for production

#### 3. Environment Variables Not Loading
- Variables must be prefixed with `REACT_APP_` for client-side access
- Redeploy after adding new environment variables
- Check Vercel function logs for server-side variables

### Performance Optimization

#### 4.1 Bundle Size
```bash
# Analyze bundle size
npm run build
npm install -g serve
serve -s build
```

#### 4.2 Caching
Vercel automatically configures:
- Static asset caching (CSS, JS, images)
- CDN distribution
- Gzip compression

## Monitoring

### Vercel Analytics
Enable Vercel Analytics for:
- Page view tracking
- Performance metrics
- User engagement data

### LaunchDarkly Insights
Monitor in LaunchDarkly dashboard:
- Flag evaluation counts
- User targeting distribution
- Feature adoption metrics

## Security Considerations

### Environment Variables
- Never commit actual keys to repository
- Use Vercel's encrypted environment variables
- Rotate keys regularly

### API Keys
- LaunchDarkly Client-side ID: Safe for browser exposure
- LaunchDarkly SDK Key: Server-side only (for AI Config)
- OpenAI API Key: Server-side only, implement rate limiting

## Scaling Considerations

### Performance
- Current setup handles 100+ concurrent users
- LaunchDarkly CDN provides global distribution
- Vercel Edge Functions for optimal response times

### Feature Flags
- Production deployment can use same LaunchDarkly project
- Separate environments (Test/Production) recommended
- Flag archival strategy for unused flags

## Support

### Vercel Issues
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Support](https://vercel.com/support)

### LaunchDarkly Issues
- [LaunchDarkly Docs](https://docs.launchdarkly.com/)
- [LaunchDarkly Support](https://support.launchdarkly.com/)

### ToggleLab Issues
- Check GitHub repository issues
- Review Vercel function logs
- Monitor browser console for errors