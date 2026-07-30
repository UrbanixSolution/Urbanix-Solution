'use client';

import React, { useState, useEffect } from 'react';
import { LoginCard } from '@/components/dashboard/LoginCard';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardHome } from '@/components/dashboard/DashboardHome';
import { ProjectsView } from '@/components/dashboard/ProjectsView';
import { TaskBoardView } from '@/components/dashboard/TaskBoardView';
import { DeliverablesView } from '@/components/dashboard/DeliverablesView';
import { PayoutsView } from '@/components/dashboard/PayoutsView';
import { SubmitDeliverableModal } from '@/components/dashboard/SubmitDeliverableModal';
import { SupportModal } from '@/components/dashboard/SupportModal';
import { DashboardTab } from '@/components/dashboard/Sidebar';
import {
  INITIAL_USER,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_DELIVERABLES,
  INITIAL_PAYOUTS,
  INITIAL_NOTIFICATIONS,
  UserProfile,
  Project,
  TaskItem,
  Deliverable,
  PayoutRecord,
  NotificationItem
} from '@/components/dashboard/mockData';

export default function AgencyPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Dashboard State (Populated dynamically from Django REST API /api/dashboard-data/)
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [deliverables, setDeliverables] = useState<Deliverable[]>(INITIAL_DELIVERABLES);
  const [payouts, setPayouts] = useState<PayoutRecord[]>(INITIAL_PAYOUTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modals state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Check URL query params for magic_token auto-login
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const magicToken = params.get('magic_token') || params.get('token');

    if (magicToken) {
      localStorage.setItem('auth_token', magicToken);
      setIsLoadingData(true);

      // Authenticate via Magic Login Endpoint
      fetch(`http://127.0.0.1:8000/api/auth/magic-login/?token=${encodeURIComponent(magicToken)}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Invalid or expired magic token.");
        })
        .then((data) => {
          const empId = data.user?.employee_id || data.user?.username || 'URB-DEV';
          localStorage.setItem('employee_id', empId);
          handleLoginSuccess(empId, data);
        })
        .catch((err) => {
          console.warn("Magic Token login failed:", err);
          setIsLoadingData(false);
        });
    }
  }, []);

  // Fetch Dashboard Data from Django Backend REST API
  const fetchDashboardData = async (tokenOverride?: string) => {
    setIsLoadingData(true);
    try {
      const token = tokenOverride || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '') || '';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/dashboard-data/`, {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.user) {
          setUser({
            id: data.user.id || 'usr_api',
            employeeId: data.user.employee_id || 'URB-DEV',
            name: data.user.name || 'Agency Team Member',
            role: data.user.role || 'Senior Developer',
            department: data.user.department || 'Production',
            avatarUrl: data.user.avatar_url || INITIAL_USER.avatarUrl,
            email: data.user.email || 'employee@urbanixsolution.online',
            permissions: data.permissions || data.user.permissions
          });
        }

        setProjects(data.projects || []);
        setTasks(data.tasks || []);
        setDeliverables(data.deliverables || []);
        setPayouts(data.payouts || []);
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.warn("Django REST API offline error.", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLoginSuccess = (employeeId: string, loginData?: any) => {
    setIsAuthenticated(true);
    
    if (loginData && loginData.token) {
      localStorage.setItem('auth_token', loginData.token);
    }

    if (loginData && loginData.user) {
      setUser({
        id: loginData.user.id,
        employeeId: loginData.user.employee_id || employeeId,
        name: loginData.user.name,
        role: loginData.user.role,
        department: loginData.user.department,
        avatarUrl: loginData.user.avatar_url || INITIAL_USER.avatarUrl,
        email: loginData.user.email,
        permissions: loginData.permissions || loginData.user.permissions
      });
    }

    // Fetch real dashboard state & card permissions using token
    fetchDashboardData(loginData?.token);
  };


  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const handleAddDeliverable = (newDeliv: Deliverable) => {
    setDeliverables((prev) => [newDeliv, ...prev]);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Deliverable Submitted',
      message: `New deliverable "${newDeliv.title}" submitted for ${newDeliv.projectName}.`,
      timeAgo: 'Just now',
      isRead: false,
      type: 'project',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <>
      {!isAuthenticated ? (
        // Ultra-Modern Glassmorphism Login View
        <div className="relative min-h-screen bg-gray-950 flex flex-col justify-center items-center py-12 px-4 overflow-hidden selection:bg-cyan-500 selection:text-gray-950">
          {/* Radial Glowing Ambient Blobs */}
          <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
          <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[160px] pointer-events-none" />

          {/* Login Card */}
          <LoginCard onLoginSuccess={handleLoginSuccess} />
        </div>
      ) : isLoadingData ? (
        // Cinematic Loading Skeleton Screen
        <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center text-white">
          <div className="flex flex-col items-center gap-4">
            <img
              src="/urbanix-logo.png"
              alt="Urbanix Solution Logo"
              className="w-12 h-12 object-contain rounded-xl shadow-lg shadow-cyan-500/30 animate-pulse border border-cyan-500/30"
            />
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold font-mono tracking-wider">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span>SYNCING URBANIX CRM DATA...</span>
            </div>
          </div>
        </div>
      ) : (
        // Main CRM Portal Layout & Views
        <DashboardLayout
          activeTab={activeTab}
          onTabChange={setActiveTab}
          user={user}
          notifications={notifications}
          onLogout={handleLogout}
          onOpenSupportModal={() => setIsSupportModalOpen(true)}
        >
          {activeTab === 'dashboard' && (
            <DashboardHome
              projects={projects}
              tasks={tasks}
              payouts={payouts}
              permissions={user.permissions}
              onOpenSubmitDeliverableModal={() => setIsSubmitModalOpen(true)}
              onOpenSupportModal={() => setIsSupportModalOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              onOpenSubmitDeliverableModal={() => setIsSubmitModalOpen(true)}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskBoardView initialTasks={tasks} />
          )}

          {activeTab === 'deliverables' && (
            <DeliverablesView
              deliverables={deliverables}
              projects={projects}
              onSubmitDeliverable={handleAddDeliverable}
            />
          )}

          {activeTab === 'payouts' && user.permissions?.can_view_finance !== false && (
            <PayoutsView payouts={payouts} />
          )}

          {/* Global Quick Action Modals */}
          <SubmitDeliverableModal
            isOpen={isSubmitModalOpen}
            onClose={() => setIsSubmitModalOpen(false)}
            projects={projects}
            onSubmit={handleAddDeliverable}
          />

          <SupportModal
            isOpen={isSupportModalOpen}
            onClose={() => setIsSupportModalOpen(false)}
            user={user}
          />
        </DashboardLayout>
      )}
    </>
  );
}
