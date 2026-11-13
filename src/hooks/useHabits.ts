import { useEffect, useState } from "react";

export interface Habit {
  id: string;
  name: string;
  completedDates: string[];
}

const STORAGE_KEY = "dayflow_habits";

function loadHabits(): Habit[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (habit): habit is Habit =>
        typeof habit === "object" &&
        habit !== null &&
        typeof habit.id === "string" &&
        typeof habit.name === "string" &&
        Array.isArray(habit.completedDates) &&
        habit.completedDates.every(
          (date: unknown) => typeof date === "string"
        )
    );
  } catch {
    return [];
  }
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const addHabit = (name: string) => {
    const trimmedName = name.trim();

    if (!trimmedName) return;

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: trimmedName,
      completedDates: [],
    };

    setHabits((previous) => [...previous, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits((previous) =>
      previous.filter((habit) => habit.id !== id)
    );
  };

  const toggleHabit = (id: string, date: string) => {
    setHabits((previous) =>
      previous.map((habit) => {
        if (habit.id !== id) return habit;

        const alreadyCompleted =
          habit.completedDates.includes(date);

        return {
          ...habit,
          completedDates: alreadyCompleted
            ? habit.completedDates.filter(
                (completedDate) => completedDate !== date
              )
            : [...habit.completedDates, date],
        };
      })
    );
  };

  return {
    habits,
    addHabit,
    deleteHabit,
    toggleHabit,
  };
}