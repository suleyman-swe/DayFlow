import type { Task, TaskPriority } from "../types/task";

export interface PlannerSettings {
  startTime: string;
  endTime: string;
  breakMinutes: number;
}

export interface PlannerResult {
  scheduledTasks: Task[];
  unscheduledTasks: Task[];
}

const priorityScore: Record<TaskPriority, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function generateSmartPlan(
  tasks: Task[],
  settings: PlannerSettings
): PlannerResult {
  const startMinutes = timeToMinutes(settings.startTime);
  const endMinutes = timeToMinutes(settings.endTime);

  if (
    !Number.isFinite(startMinutes) ||
    !Number.isFinite(endMinutes) ||
    startMinutes >= endMinutes ||
    settings.breakMinutes < 0
  ) {
    return {
      scheduledTasks: [],
      unscheduledTasks: [...tasks],
    };
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityDifference =
      priorityScore[b.priority] - priorityScore[a.priority];

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return a.duration - b.duration;
  });

  const scheduledTasks: Task[] = [];
  const unscheduledTasks: Task[] = [];

  let currentTime = startMinutes;

  for (const task of sortedTasks) {
    if (task.completed) {
      continue;
    }

    const breakTime =
      scheduledTasks.length > 0 ? settings.breakMinutes : 0;

    const taskStart = currentTime + breakTime;
    const taskEnd = taskStart + task.duration;

    if (taskEnd <= endMinutes) {
      scheduledTasks.push({
        ...task,
        time: minutesToTime(taskStart),
      });

      currentTime = taskEnd;
    } else {
      unscheduledTasks.push(task);
    }
  }

  return {
    scheduledTasks,
    unscheduledTasks,
  };
}