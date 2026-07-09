export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface SearchResult {
  type: "project" | "board" | "card";
  id: string;
  title: string;
  href: string;
  meta?: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalBoards: number;
  totalMembers: number;
  totalCards: number;
  completedCards: number;
  openCards: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  entityName?: string;
  entityType?: string;
  createdAt: string;
  user: { name: string; imageUrl?: string };
}

export interface BoardColumn {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface BoardCard {
  id: string;
  columnId: string;
  title: string;
  description?: string;
  priority: string;
  dueDate?: string | null;
  order: number;
  assignees: Array<{ user: { name: string; imageUrl?: string } }>;
  labels: Array<{ label: { name: string; color: string } }>;
  _count: { comments: number; attachments: number };
}

export interface OrgMember {
  id: string;
  role: string;
  isSuspended: boolean;
  joinedAt: string;
  user: { name: string; email: string; imageUrl?: string };
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}
