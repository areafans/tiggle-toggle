import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'lab-owner' | 'beta-user' | 'standard-user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  switchUser: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Alex Chen',
    email: 'alex.chen@togglelab.com',
    role: 'lab-owner',
    avatar: '👨‍💻'
  },
  {
    id: 'user2',
    name: 'Sam Rivera',
    email: 'sam.rivera@togglelab.com',
    role: 'beta-user',
    avatar: '👩‍🔬'
  },
  {
    id: 'user3',
    name: 'Jordan Kim',
    email: 'jordan.kim@togglelab.com',
    role: 'standard-user',
    avatar: '👨‍🎨'
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUsers[0]); // Default to lab owner

  const switchUser = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, switchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { mockUsers };