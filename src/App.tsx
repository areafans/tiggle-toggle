import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LDProvider } from 'launchdarkly-react-client-sdk';
import { AuthProvider } from './contexts/AuthContext';
import { LaunchDarklyProvider } from './contexts/LaunchDarklyContext';
import { DemoProvider } from './contexts/DemoContext';
import { LAUNCHDARKLY_CLIENT_ID, createLDContext } from './lib/launchdarkly';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Labs from './pages/Labs';
import Analytics from './pages/Analytics';
import Community from './pages/Community';
import Settings from './pages/Settings';

function AppContent() {
  return (
    <AuthProvider>
      <LaunchDarklyProvider>
        <DemoProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/labs" element={<Labs />} />
                <Route path="/labs/:labId" element={<Labs />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/community" element={<Community />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </Router>
        </DemoProvider>
      </LaunchDarklyProvider>
    </AuthProvider>
  );
}

function App() {
  const initialContext = createLDContext('user1', 'lab-owner', 'Alex Chen');

  console.log('🚀 App initializing with LaunchDarkly:', {
    clientSideID: LAUNCHDARKLY_CLIENT_ID,
    context: initialContext
  });

  return (
    <LDProvider
      clientSideID={LAUNCHDARKLY_CLIENT_ID}
      context={initialContext}
      options={{
        bootstrap: 'localStorage',
        streaming: true,
        logger: {
          debug: (message: string, ...args: any[]) => console.log('🏳️ LD Debug:', message, ...args),
          info: (message: string, ...args: any[]) => console.log('ℹ️ LD Info:', message, ...args),
          warn: (message: string, ...args: any[]) => console.warn('⚠️ LD Warn:', message, ...args),
          error: (message: string, ...args: any[]) => console.error('❌ LD Error:', message, ...args),
        }
      }}
    >
      <AppContent />
    </LDProvider>
  );
}

export default App;
