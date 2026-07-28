'use client';

import React from 'react';
import {
  FolderKanban,
  CheckSquare,
  IndianRupee,
  ArrowUpRight,
  Clock,
  Send,
  LifeBuoy,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Layers,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { Project, TaskItem, PayoutRecord, UserPermissions } from './mockData';

interface DashboardHomeProps {
  projects: Project[];
  tasks: TaskItem[];
  payouts: PayoutRecord[];
  permissions?: UserPermissions;
  onOpenSubmitDeliverableModal: () => void;
  onOpenSupportModal: () => void;
  onNavigateTab: (tab: 'projects' | 'tasks' | 'deliverables' | 'payouts') => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  projects,
  tasks,
  payouts,
  permissions,
  onOpenSubmitDeliverableModal,
  onOpenSupportModal,
  onNavigateTab,
}) => {
  const canViewActiveProjects = permissions?.can_view_active_projects_card ?? true;
  const canViewPendingTasks = permissions?.can_view_pending_tasks_card ?? true;
  const canViewPayouts = permissions?.can_view_financials_and_payouts ?? permissions?.can_view_finance ?? false;
  const canViewTimeline = permissions?.can_view_project_timeline ?? true;
  const canViewPriorityQueue = permissions?.can_view_priority_queue ?? true;

  // Calculated stats from data
  const activeProjectsCount = projects.filter((p) => p.status === 'In Progress' || p.status === 'Under Review').length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'done').length;
  
  // Calculate total unbilled/pending payouts in INR
  const unbilledPayoutsTotal = payouts
    .filter((p) => p.status === 'Pending Approval' || p.status === 'Processing')
    .reduce((sum, item) => sum + item.totalAmount, 0);

  const pendingUrgentTasks = tasks.filter((t) => (t.priority === 'Urgent' || t.priority === 'High') && t.status !== 'done');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Greeting Card */}
      <div className="relative rounded-2xl bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-950/90 border border-gray-800 p-6 shadow-xl overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Urbanix Core Agency Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Internal Client & Deliverables Hub
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
              Track real-time project milestones, task queues, client deliverables{canViewPayouts ? ', and pending payout releases' : ''}.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSubmitDeliverableModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-gray-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all transform active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Submit Deliverable</span>
            </button>
            <button
              onClick={onOpenSupportModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 text-xs font-semibold transition-colors"
            >
              <LifeBuoy className="w-4 h-4 text-cyan-400" />
              <span>Support</span>
            </button>
          </div>
        </div>
      </div>

      {/* OVERVIEW WIDGET CARDS (Top Row) */}
      <div className={`grid grid-cols-1 ${canViewPayouts ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'} gap-5`}>
        {/* Card 1: Active Projects */}
        {canViewActiveProjects && (
          <div
            onClick={() => onNavigateTab('projects')}
            className="group relative rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800/90 hover:border-cyan-500/50 p-6 shadow-xl transition-all duration-300 hover:shadow-cyan-500/10 cursor-pointer overflow-hidden"
          >
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors" />
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-inner">
                <FolderKanban className="w-6 h-6" />
              </div>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                +2 this month
              </span>
            </div>
            
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Active Projects
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                {activeProjectsCount}
              </h3>
              <span className="text-xs text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-medium">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              Current active milestone assignments
            </p>
          </div>
        )}

        {/* Card 2: Pending Tasks */}
        {canViewPendingTasks && (
          <div
            onClick={() => onNavigateTab('tasks')}
            className="group relative rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800/90 hover:border-cyan-500/50 p-6 shadow-xl transition-all duration-300 hover:shadow-cyan-500/10 cursor-pointer overflow-hidden"
          >
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-colors" />
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-teal-950/80 border border-teal-500/30 text-teal-400 flex items-center justify-center shadow-inner">
                <CheckSquare className="w-6 h-6" />
              </div>
              {pendingUrgentTasks.length > 0 && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                  {pendingUrgentTasks.length} Urgent
                </span>
              )}
            </div>

            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Pending Tasks
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-3xl font-extrabold text-white tracking-tight">
                {pendingTasksCount}
              </h3>
              <span className="text-xs text-teal-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-medium">
                Task board <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              Action items requiring review or dev
            </p>
          </div>
        )}

        {/* Card 3: Unbilled/Pending Payouts - CONDITIONAL RBAC RENDERING */}
        {canViewPayouts && (
          <div
            onClick={() => onNavigateTab('payouts')}
            className="group relative rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800/90 hover:border-cyan-500/50 p-6 shadow-xl transition-all duration-300 hover:shadow-cyan-500/10 cursor-pointer overflow-hidden sm:col-span-2 lg:col-span-1"
          >
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner">
                <IndianRupee className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-full">
                Release: 05 Aug 2026
              </span>
            </div>

            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Unbilled / Pending Payouts
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                ₹ {unbilledPayoutsTotal.toLocaleString('en-IN')}
              </h3>
              <span className="text-xs text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-medium">
                Breakdown <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              Approved milestone earnings ready for disbursement
            </p>
          </div>
        )}
      </div>

      {/* MIDDLE SECTION: ACTIVE PROJECT TIMELINE & SIDEBAR QUEUE */}
      <div className={`grid grid-cols-1 ${canViewPriorityQueue ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
        {/* Left 2 Cols: Project Timeline List / Table */}
        {canViewTimeline && (
          <div className={`${canViewPriorityQueue ? 'lg:col-span-2' : 'lg:col-span-1'} rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800/90 p-6 shadow-xl flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Active Project Timeline
                    </h3>
                    <p className="text-xs text-gray-400">
                      Live client projects with deadline indicators and visual progress
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('projects')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Timeline Item List */}
              <div className="space-y-4">
                {projects.map((project) => {
                  const getStatusBadge = (status: Project['status']) => {
                    switch (status) {
                      case 'In Progress':
                        return 'bg-cyan-950/70 text-cyan-300 border-cyan-500/40';
                      case 'Under Review':
                        return 'bg-amber-950/70 text-amber-300 border-amber-500/40';
                      case 'Completed':
                        return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40';
                      default:
                        return 'bg-gray-800 text-gray-400 border-gray-700';
                    }
                  };

                  return (
                    <div
                      key={project.id}
                      className="p-4 rounded-xl bg-gray-950/60 border border-gray-800/80 hover:border-gray-700 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0 animate-pulse" />
                          <div>
                            <h4 className="text-sm font-bold text-white tracking-wide">
                              {project.title}
                            </h4>
                            <span className="text-xs text-gray-400">
                              Client: <strong className="text-gray-300">{project.clientName}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(
                              project.status
                            )}`}
                          >
                            {project.status}
                          </span>
                          <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            {project.deadline}
                          </span>
                        </div>
                      </div>

                      {/* Visual Progress Bar (Neon Teal & Cyan) */}
                      <div>
                        <div className="flex justify-between text-xs mb-1.5 font-medium">
                          <span className="text-gray-400">{project.deliverableType}</span>
                          <span className="text-cyan-400 font-mono font-bold">
                            {project.progressPercent}% Completed
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-900 overflow-hidden p-0.5 border border-gray-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                            style={{ width: `${project.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Right 1 Col: Quick Actions & Pending Urgent Tasks */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800/90 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Quick Actions</span>
            </h3>

            <div className="space-y-3">
              <button
                onClick={onOpenSubmitDeliverableModal}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-gray-900 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-400 text-gray-950 font-bold flex items-center justify-center shadow-md">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Submit Project Link/File
                    </h4>
                    <p className="text-[10px] text-gray-400">Upload video cut or code repo</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 group-hover:text-cyan-400 transition-all" />
              </button>

              <button
                onClick={onOpenSupportModal}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gray-950/60 border border-gray-800 hover:border-gray-700 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 text-cyan-400 flex items-center justify-center">
                    <LifeBuoy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Request Support
                    </h4>
                    <p className="text-[10px] text-gray-400">IT, admin, or payout query</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 group-hover:text-cyan-400 transition-all" />
              </button>
            </div>
          </div>

          {/* Top Priority Task Snapshot */}
          {canViewPriorityQueue && (
            <div className="rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800/90 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-teal-400" />
                  <span>Priority Queue</span>
                </h3>
                <button
                  onClick={() => onNavigateTab('tasks')}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  View board
                </button>
              </div>

              <div className="space-y-2.5">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-semibold text-gray-200 truncate">
                        {task.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 truncate">{task.projectName}</p>
                    </div>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold shrink-0 ${
                        task.priority === 'Urgent'
                          ? 'bg-red-950 text-red-400 border border-red-800/60'
                          : 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
