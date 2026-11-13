import type { Task } from "../types/task";

const STORAGE_KEY = "dayflow_tasks";

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function loadTasks(): Task[] {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY);

    if (!storedTasks) {
      return [];
    }

    const parsed: unknown = JSON.parse(storedTasks);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as Task[];
  } catch (error) {
    console.error("Failed to load tasks:", error);
    return [];
  }
}