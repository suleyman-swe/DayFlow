import { useState, useEffect } from "react";
import type { Task } from "../types/task";
import { loadTasks, saveTasks } from "../utils/storage";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  // Save tasks whenever they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // CREATE
  const addTask = (task: Omit<Task, "id" | "completed">) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
  };

  // UPDATE
  const updateTask = (id: string, updatedData: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updatedData, id: task.id } : task
      )
    );
  };

  // DELETE
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // COMPLETE / UNCOMPLETE
  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
}