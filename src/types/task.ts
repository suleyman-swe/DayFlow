export type TaskCategory =
  | "Personal"
  | "Work"
  | "Learning"
  | "Health"
  | "Other";

export type TaskPriority = "Low" | "Medium" | "High";

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  date: string;
  time: string;
  duration: number;
  completed: boolean;
}