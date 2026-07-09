export interface Card {
  id: string;
  columnId: string;
  title: string;
  description: string;
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW" | "NONE";
  dueDate: string | null;
  assignee: string | null;
  labels: string[];
  order: number;
}

export interface Comment {
  id: string;
  cardId: string;
  content: string;
  createdAt: string;
  user: { name: string; imageUrl?: string };
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
}
