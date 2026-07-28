export interface UserPermissions {
  is_admin: boolean;
  can_view_finance: boolean;
  can_view_all_projects: boolean;
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
  status: 'Paid' | 'Pending Approval' | 'Processing';
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

// Initial Mock User Data
export const INITIAL_USER: UserProfile = {
  id: 'usr_001',
  employeeId: 'URB-DEV-01',
  name: 'Gaurav Sharma',
  role: 'Senior Video Editor & Motion Architect',
  department: 'Creative & Media Production',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  email: 'gaurav.s@urbanixsolution.internal',
  joiningDate: '15 Jan 2024',
  status: 'active',
};

// Overview Summary Metrics
export const OVERVIEW_METRICS = {
  activeProjectsCount: 4,
  activeProjectsGrowth: '+2 this month',
  pendingTasksCount: 7,
  pendingTasksUrgent: 2,
  unbilledPayoutsAmount: 145000, // ₹ 1,45,000
  payoutNextReleaseDate: '05 Aug 2026',
};

// Sample Active Projects
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'prj-101',
    title: 'Apex Financial Platform - Brand Motion & UI Video',
    clientName: 'Apex Capital Holdings LLC',
    category: 'VFX & Motion Graphics',
    status: 'In Progress',
    progressPercent: 78,
    deadline: '04 Aug 2026',
    teamMembers: ['Gaurav S.', 'Rohan K.', 'Ananya P.'],
    deliverableType: '4K Cinematic Reel & Interactive UI Animations',
    priority: 'High',
    payoutEst: 65000,
  },
  {
    id: 'prj-102',
    title: 'Nexus AI SaaS Portal - Dashboard UI & Micro-interactions',
    clientName: 'Nexus Labs Inc.',
    category: 'Web App & Frontend Development',
    status: 'In Progress',
    progressPercent: 62,
    deadline: '12 Aug 2026',
    teamMembers: ['Gaurav S.', 'Vikram R.'],
    deliverableType: 'React Components & Framer Animations',
    priority: 'High',
    payoutEst: 50000,
  },
  {
    id: 'prj-103',
    title: 'Veloce Motors - EV Promo Campaign Launch',
    clientName: 'Veloce Automotives Global',
    category: 'Commercial Video & 3D Render',
    status: 'Under Review',
    progressPercent: 90,
    deadline: '31 Jul 2026',
    teamMembers: ['Gaurav S.', 'Priya N.'],
    deliverableType: '30s TV Commercial + Social Cutdowns',
    priority: 'Medium',
    payoutEst: 30000,
  },
  {
    id: 'prj-104',
    title: 'Urbanix Design System v3.0 - Internal Motion Assets',
    clientName: 'Urbanix Core Architecture',
    category: 'Internal R&D',
    status: 'In Progress',
    progressPercent: 40,
    deadline: '20 Aug 2026',
    teamMembers: ['Gaurav S.'],
    deliverableType: 'Lottie Animations & CSS Tokens',
    priority: 'Low',
    payoutEst: 20000,
  },
];

// Sample Tasks
export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'tsk-01',
    title: 'Finalize 3D camera trajectory for Apex 4K Hero Sequence',
    projectId: 'prj-101',
    projectName: 'Apex Financial Platform',
    priority: 'Urgent',
    status: 'in_progress',
    dueDate: '29 Jul 2026',
    estimatedHours: 6,
  },
  {
    id: 'tsk-02',
    title: 'Export color-graded ProRes 4444 master files for Veloce review',
    projectId: 'prj-103',
    projectName: 'Veloce Motors Campaign',
    priority: 'High',
    status: 'in_review',
    dueDate: '30 Jul 2026',
    estimatedHours: 3,
  },
  {
    id: 'tsk-03',
    title: 'Build Framer Motion physics spring configs for Nexus UI',
    projectId: 'prj-102',
    projectName: 'Nexus AI SaaS Portal',
    priority: 'High',
    status: 'todo',
    dueDate: '02 Aug 2026',
    estimatedHours: 8,
  },
  {
    id: 'tsk-04',
    title: 'Upload raw render passes to AWS S3 bucket for client backup',
    projectId: 'prj-101',
    projectName: 'Apex Financial Platform',
    priority: 'Normal',
    status: 'todo',
    dueDate: '03 Aug 2026',
    estimatedHours: 2,
  },
  {
    id: 'tsk-05',
    title: 'Audit audio sound design overlay for Instagram 9:16 cut',
    projectId: 'prj-103',
    projectName: 'Veloce Motors Campaign',
    priority: 'Medium',
    status: 'done',
    dueDate: '27 Jul 2026',
    estimatedHours: 4,
  },
  {
    id: 'tsk-06',
    title: 'Draft technical handoff documentation for frontend team',
    projectId: 'prj-102',
    projectName: 'Nexus AI SaaS Portal',
    priority: 'Normal',
    status: 'todo',
    dueDate: '05 Aug 2026',
    estimatedHours: 5,
  },
];

// Sample Deliverables Submissions
export const INITIAL_DELIVERABLES: Deliverable[] = [
  {
    id: 'del-901',
    projectId: 'prj-103',
    projectName: 'Veloce Motors Campaign',
    title: 'Veloce EV 30s Cut-v3_ColorGraded_Master.mp4',
    linkUrl: 'https://drive.google.com/file/d/urbanix-veloce-v3-master/view',
    submittedAt: '28 Jul 2026, 14:30',
    fileSize: '1.84 GB',
    status: 'Pending Review',
    notes: 'Incorporated client feedback on bass boost and end logo glow.',
  },
  {
    id: 'del-900',
    projectId: 'prj-101',
    projectName: 'Apex Financial Platform',
    title: 'Apex_Hero_Motion_Teaser_Draft2.mov',
    linkUrl: 'https://frame.io/player/apex-motion-teaser-v2',
    submittedAt: '25 Jul 2026, 11:15',
    fileSize: '940 MB',
    status: 'Approved',
    notes: 'Approved by Creative Director for client presentation.',
  },
  {
    id: 'del-899',
    projectId: 'prj-102',
    projectName: 'Nexus AI SaaS Portal',
    title: 'Nexus_UI_Component_Library_v1.zip',
    linkUrl: 'https://github.com/urbanix-internal/nexus-ui/releases/tag/v1.0.0',
    submittedAt: '21 Jul 2026, 18:40',
    fileSize: '42 MB',
    status: 'Approved',
    notes: 'Clean TypeScript build verified with Tailwind preset.',
  },
];

// Sample Payout History
export const INITIAL_PAYOUTS: PayoutRecord[] = [
  {
    id: 'pay-2026-07',
    invoiceNo: 'URB-INV-2026-088',
    month: 'July 2026 (Unbilled Current)',
    projectTitle: 'Apex Financial & Nexus AI Milestone 1',
    baseAmount: 125000,
    bonusAmount: 20000,
    totalAmount: 145000,
    status: 'Pending Approval',
    dueDate: '05 Aug 2026',
  },
  {
    id: 'pay-2026-06',
    invoiceNo: 'URB-INV-2026-071',
    month: 'June 2026',
    projectTitle: 'Krypton Cyber Platform & Veloce Teaser',
    baseAmount: 110000,
    bonusAmount: 15000,
    totalAmount: 125000,
    status: 'Paid',
    dueDate: '05 Jul 2026',
    paidDate: '04 Jul 2026',
  },
  {
    id: 'pay-2026-05',
    invoiceNo: 'URB-INV-2026-054',
    month: 'May 2026',
    projectTitle: 'Aether Cloud Motion Assets',
    baseAmount: 95000,
    bonusAmount: 10000,
    totalAmount: 105000,
    status: 'Paid',
    dueDate: '05 Jun 2026',
    paidDate: '05 Jun 2026',
  },
];

// Notifications
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Deliverable Approved',
    message: 'Apex Hero Motion Teaser was approved by Creative Lead.',
    timeAgo: '2 hours ago',
    isRead: false,
    type: 'project',
  },
  {
    id: 'notif-2',
    title: 'Payout Disbursement Scheduled',
    message: 'July unbilled payout of ₹1,45,000 scheduled for Aug 5th.',
    timeAgo: '5 hours ago',
    isRead: false,
    type: 'payout',
  },
  {
    id: 'notif-3',
    title: 'New High Priority Task Assigned',
    message: 'Finalize 3D camera trajectory for Apex 4K Hero Sequence.',
    timeAgo: '1 day ago',
    isRead: true,
    type: 'task',
  },
];
