export interface UserPermissions {
  is_admin: boolean;
  can_view_finance: boolean;
  can_view_all_projects: boolean;
  can_view_active_projects_card?: boolean;
  can_view_pending_tasks_card?: boolean;
  can_view_financials_and_payouts?: boolean;
  can_view_project_timeline?: boolean;
  can_view_priority_queue?: boolean;
}

export interface UserProfile {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  avatarUrl: string;
  email: string;
  joiningDate?: string;
  status?: 'active' | 'on_leave';
  permissions?: UserPermissions;
}

export interface Project {
  id: string;
  title: string;
  clientName: string;
  category: string;
  status: 'In Progress' | 'Under Review' | 'Completed' | 'Upcoming';
  progressPercent: number;
  deadline: string;
  teamMembers: string[];
  deliverableType: string;
  priority: 'High' | 'Medium' | 'Low';
  payoutEst: number; // in INR
}

export interface TaskItem {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Normal';
  status: 'todo' | 'in_progress' | 'in_review' | 'done';
  dueDate: string;
  estimatedHours: number;
}

export interface Deliverable {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  linkUrl: string;
  submittedAt: string;
  fileSize?: string;
  status: 'Approved' | 'Pending Review' | 'Revision Requested';
  notes: string;
}

export interface PayoutRecord {
  id: string;
  invoiceNo: string;
  month: string;
  projectTitle: string;
  baseAmount: number; // INR
  bonusAmount: number; // INR
  totalAmount: number; // INR
  status: 'Paid' | 'Completed' | 'Pending Approval' | 'Processing' | 'On Hold';

  dueDate: string;
  paidDate?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  type: 'project' | 'payout' | 'task' | 'system';
}

// ── Initial Mock User Data (placeholder before login) ──────────────────────
export const INITIAL_USER: UserProfile = {
  id: 'usr_001',
  employeeId: 'URB-DEV-01',
  name: 'Urbanix Team Member',
  role: 'Loading...',
  department: 'Loading...',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  email: '',
  joiningDate: '',
  status: 'active',
};

// ── Overview Summary Metrics ─────────────────────────────────────────────────
// Calculated dynamically from the API response in page.tsx
export const OVERVIEW_METRICS = {
  activeProjectsCount: 0,
  activeProjectsGrowth: '',
  pendingTasksCount: 0,
  pendingTasksUrgent: 0,
  unbilledPayoutsAmount: 0,
  payoutNextReleaseDate: '',
};

// ── Live data is fetched from /api/dashboard-data/ after login. ─────────────
// These empty arrays are the initial state before the API responds.
// The Core Team assigns real data via Django Admin (Assigned Projects / Tasks / Payouts).

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_TASKS: TaskItem[] = [];

export const INITIAL_DELIVERABLES: Deliverable[] = [];

export const INITIAL_PAYOUTS: PayoutRecord[] = [];

// ── Notifications ────────────────────────────────────────────────────────────
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-welcome',
    title: 'Welcome to Urbanix CRM',
    message: 'Your dashboard is syncing. Projects and tasks assigned by the Core Team will appear shortly.',
    timeAgo: 'Just now',
    isRead: false,
    type: 'system',
  },
];

