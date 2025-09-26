import React from 'react';
import Sidebar from './Sidebar';
import DemoControlPanel from './DemoControlPanel';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
      <DemoControlPanel />
    </div>
  );
};

export default Layout;