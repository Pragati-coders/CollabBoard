export interface Column {
  id: string;
  name: string;
  color: string;
  order: number;
}

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
