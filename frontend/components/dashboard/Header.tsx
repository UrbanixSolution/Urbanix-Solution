'use client';

import React, { useState } from 'react';
import {
  Bell,
  Search,
  Menu,
  Shield,
  CheckCircle2,
  Clock,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  LifeBuoy
} from 'lucide-react';
import { UserProfile, NotificationItem } from './mockData';

interface HeaderProps {
  user: UserProfile;
  notifications: NotificationItem[];
  onOpenMobileMenu: () => void;
  onOpenSupportModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  notifications,
  onOpenMobileMenu,
  onOpenSupportModal,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifList, setNotifList] = useState<NotificationItem[]>(notifications);

  const unreadCount = notifList.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifList((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/80 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left: Mobile Toggle & Welcome Message */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-cyan-400 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">{user.name.split(' ')[0]}</span>
            </h2>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-[10px] font-semibold">
              {user.role}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 hidden xs:block">
            Urbanix Solution Enterprise Portal • ID: <span className="font-mono text-cyan-400/90">{user.employeeId}</span>
          </p>
        </div>
      </div>

      {/* Right: Search, Notifications & User Avatar */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Search Input */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search projects, tasks..."
            className="w-full pl-9 pr-3 py-1.5 bg-gray-900/90 border border-gray-800/90 rounded-xl text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/80 transition-all"
          />
        </div>

        {/* Support Request Quick Trigger Button */}
        <button
          onClick={onOpenSupportModal}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-cyan-500/40 text-gray-300 text-xs font-medium transition-colors"
        >
          <LifeBuoy className="w-3.5 h-3.5 text-cyan-400" />
          <span>Support</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800 text-gray-300 hover:text-cyan-400 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 text-gray-950 font-bold text-[9px] flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Popover Drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-gray-900/95 backdrop-blur-2xl border border-gray-800 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3.5 border-b border-gray-800 flex items-center justify-between bg-gray-950/60">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Notifications
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-cyan-400 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-gray-800/60">
                {notifList.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-500">
                    No new notifications.
                  </div>
                ) : (
                  notifList.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 hover:bg-gray-800/50 transition-colors flex items-start gap-3 ${
                        !item.isRead ? 'bg-cyan-950/20' : ''
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="text-xs font-semibold text-gray-200 truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-gray-500 flex items-center gap-1 font-mono">
                            <Clock className="w-2.5 h-2.5" />
                            {item.timeAgo}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-gray-800 text-center bg-gray-950/60">
                <span className="text-[10px] text-gray-500 font-mono">
                  Real-time Urbanix System Alerts
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-gray-900 border border-transparent hover:border-gray-800 transition-colors focus:outline-none"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover ring-2 ring-cyan-500/40"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-200 leading-none">{user.name}</span>
              <span className="text-[10px] font-mono text-cyan-400 mt-0.5">{user.employeeId}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
          </button>

          {/* User Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-gray-900/95 backdrop-blur-2xl border border-gray-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-gray-800/80 mb-1">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white truncate">{user.name}</span>
                </div>
                <p className="text-[11px] text-gray-400 font-mono">{user.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-[10px]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Authenticated Active Employee</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={onOpenSupportModal}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-300 hover:bg-gray-800 hover:text-cyan-400 transition-colors"
                >
                  <LifeBuoy className="w-4 h-4 text-gray-400" />
                  <span>Request IT Support</span>
                </button>
              </div>

              <div className="pt-1 mt-1 border-t border-gray-800/80">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Secure Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
