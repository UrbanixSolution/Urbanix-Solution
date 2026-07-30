'use client';

import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  UploadCloud,
  Wallet,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from './mockData';

export type DashboardTab = 'dashboard' | 'projects' | 'tasks' | 'deliverables' | 'payouts';

interface SidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  user: UserProfile;
  onLogout: () => void;
  projectCount?: number;
  taskCount?: number;
  payoutCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  user,
  onLogout,
  projectCount = 0,
  taskCount = 0,
  payoutCount = 0,
}) => {
  const canViewFinance = user.permissions?.can_view_financials_and_payouts ?? user.permissions?.can_view_finance ?? true;

  const navItems = [
    {
      id: 'dashboard' as DashboardTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'projects' as DashboardTab,
      label: 'My Projects',
      icon: FolderKanban,
      badge: projectCount > 0 ? String(projectCount) : null,
    },
    {
      id: 'tasks' as DashboardTab,
      label: 'Task Board',
      icon: CheckSquare,
      badge: taskCount > 0 ? String(taskCount) : null,
    },
    {
      id: 'deliverables' as DashboardTab,
      label: 'Upload Deliverables',
      icon: UploadCloud,
      badge: null,
    },
    ...(canViewFinance
      ? [
          {
            id: 'payouts' as DashboardTab,
            label: 'Payouts',
            icon: Wallet,
            badge: payoutCount > 0 ? String(payoutCount) : null,
          },
        ]
      : []),
  ];


  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-gray-950/90 backdrop-blur-xl border-r border-gray-800/90 text-gray-200 transition-all duration-300 ease-in-out flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding Section */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-800/80">
          {!isCollapsed && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-extrabold text-gray-950 text-sm shadow-md shadow-cyan-500/20 shrink-0">
                U
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white tracking-wide text-sm leading-tight flex items-center gap-1">
                  URBANIX <span className="text-cyan-400 text-xs font-mono">CRM</span>
                </span>
                <span className="text-[10px] text-gray-500 font-mono tracking-wider">
                  PRIVATE PORTAL
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-full flex justify-center">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-extrabold text-gray-950 text-base shadow-md shadow-cyan-500/20">
                U
              </div>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-cyan-400 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* System Status Pill */}
        {!isCollapsed && (
          <div className="mx-4 mt-4 p-2.5 rounded-xl bg-gray-900/60 border border-gray-800/80 flex items-center gap-2 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-gray-400 text-[11px] font-mono">INTERNAL WORKSPACE • ONLINE</span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-cyan-950/50 text-cyan-300 font-semibold border-l-4 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900/70 border-l-4 border-transparent'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {/* Active tab glow overlay */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-cyan-500/5 pointer-events-none" />
                )}

                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'
                  }`}
                />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          isActive
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Logout Footer */}
      <div className="p-3 border-t border-gray-800/80 bg-gray-950/90">
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-gray-900/80 border border-gray-800">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-cyan-500/40 shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate">{user.name}</span>
                <span className="text-[10px] font-mono text-cyan-400 truncate">{user.employeeId}</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Secure Logout"
              className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/50 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            title="Secure Logout"
            className="w-full flex justify-center p-2.5 rounded-xl bg-gray-900 hover:bg-red-950/40 border border-gray-800 text-gray-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
};
