export type Role = 'Admin' | 'Project Manager' | 'Team Member';
export type ProjectStatus = 'Pending' | 'Active' | 'Completed' | 'On Hold';
export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Completed';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TeamMemberRole = 'Team Lead' | 'Developer' | 'Designer' | 'Tester' | 'Viewer';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: Role;
  jobTitle?: string;
  status?: string;
  emailVerified?: boolean;
  createdAt: any;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  managerId: string;
  teamId: string;
  startDate: any;
  endDate: any;
  progress: number;
  createdAt: any;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  dueDate: any;
  tags: string[];
  createdAt: any;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  createdAt: any;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  content: string;
  isRead: boolean;
  createdAt: any;
}
