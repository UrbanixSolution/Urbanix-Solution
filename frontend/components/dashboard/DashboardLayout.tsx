'use client';

import React, { useState } from 'react';
import { Sidebar, DashboardTab } from './Sidebar';
import { Header } from './Header';
import { UserProfile, NotificationItem } from './mockData';
import { X } from 'lucide-react';

interface DashboardLayoutProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  user: UserProfile;
  notifications: NotificationItem[];
  onLogout: () => void;
  onOpenSupportModal: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  onTabChange,
  user,
  notifications,
  onLogout,
  onOpenSupportModal,
  children,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-gray-950">
      {/* Background Cinematic Radial Glowing Blobs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[125px] pointer-events-none z-0 animate-pulse" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="fixed top-1/2 left-2/3 w-80 h-80 bg-teal-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Desktop Left Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          user={user}
          onLogout={onLogout}
        />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop blur overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-gray-950/80 backdrop-blur-md transition-opacity"
          />

          <div className="relative w-72 max-w-[85vw] h-full bg-gray-950 border-r border-gray-800 shadow-2xl flex flex-col justify-between z-50">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-extrabold text-gray-950 text-sm">
                  U
                </div>
                <span className="font-bold text-white text-sm">URBANIX CRM</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white bg-gray-900 border border-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2 flex-1">
              <Sidebar
                activeTab={activeTab}
                onTabChange={(tab) => {
                  onTabChange(tab);
                  setIsMobileMenuOpen(false);
                }}
                isCollapsed={false}
                onToggleCollapse={() => {}}
                user={user}
                onLogout={onLogout}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 flex flex-col min-h-screen z-10 relative ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <Header
          user={user}
          notifications={notifications}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSupportModal={onOpenSupportModal}
          onLogout={onLogout}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer info */}
        <footer className="py-4 px-6 border-t border-gray-800/80 text-center text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl w-full mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Urbanix Solutions Internal CRM Portal • Enterprise Encryption Active</span>
          </div>
          <div className="text-gray-400 font-mono text-[11px]">
            Logged in as {user.employeeId} ({user.name})
          </div>
        </footer>
      </div>
    </div>
  );
};
