import React, { createContext, useContext, useEffect } from 'react';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { createLDContext } from '../lib/launchdarkly';
import { useAuth, User } from './AuthContext';

interface LaunchDarklyContextType {
  updateLDUser: (user: User) => void;
}

const LaunchDarklyContext = createContext<LaunchDarklyContextType | undefined>(undefined);

interface LaunchDarklyProviderProps {
  children: React.ReactNode;
}

export const LaunchDarklyProvider: React.FC<LaunchDarklyProviderProps> = ({ children }) => {
  const ldClient = useLDClient();
  const { user } = useAuth();

  const updateLDUser = (authUser: User) => {
    if (ldClient) {
      const ldContext = createLDContext(authUser.id, authUser.role, authUser.name);

      console.log('🎯 LaunchDarkly Context BEFORE update for', authUser.name, ':', ldContext);

      ldClient.identify(ldContext).then(() => {
        console.log('✅ LaunchDarkly context updated successfully for', authUser.name);

        // Check flag values immediately after context update
        setTimeout(() => {
          const flags = {
            advancedAnalytics: ldClient.variation('advancedAnalytics'),
            f2AiChatbot: ldClient.variation('f2AiChatbot')
          };
          console.log('🚩 Flag values for', authUser.name, 'after context update:', flags);
        }, 500);

      }).catch((error) => {
        console.error('❌ Failed to update LaunchDarkly context for', authUser.name, ':', error);
      });
    } else {
      console.warn('⚠️ LaunchDarkly client not available for', authUser.name);
    }
  };

  // Update LD user when auth user changes
  useEffect(() => {
    if (user && ldClient) {
      updateLDUser(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, ldClient]);

  return (
    <LaunchDarklyContext.Provider value={{ updateLDUser }}>
      {children}
    </LaunchDarklyContext.Provider>
  );
};

export const useLaunchDarkly = () => {
  const context = useContext(LaunchDarklyContext);
  if (context === undefined) {
    throw new Error('useLaunchDarkly must be used within a LaunchDarklyProvider');
  }
  return context;
};