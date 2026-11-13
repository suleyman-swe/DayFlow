import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Leaf,
  TrendingUp,
} from "lucide-react";

import type { Task } from "../types/task";
import type { Habit } from "../hooks/useHabits";

interface StatisticsProps {
  tasks: Task[];
  habits: Habit[];
}

export default function Statistics({
  tasks,
  habits,
}: StatisticsProps) {
  const today = new Date();

  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    const dateString = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    const dayTasks = tasks.filter(
      (task) => task.date === dateString
    );

    const completedTasks = dayTasks.filter(
      (task) => task.completed
    );

    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      date: dateString,
      completed: completedTasks.length,
      total: dayTasks.length,
    };
  });

  const completedTasks = tasks.filter(
    (task) => task.completed
  );

  const totalCompleted = completedTasks.length;

  const totalFocusMinutes = completedTasks.reduce(
    (sum, task) => sum + task.duration,
    0
  );

  const totalHours = Math.floor(totalFocusMinutes / 60);
  const remainingMinutes = totalFocusMinutes % 60;

  const taskCompletionRate = tasks.length
    ? Math.round((totalCompleted / tasks.length) * 100)
    : 0;

  const last7Dates = last7Days.map((day) => day.date);

  const totalHabitOpportunities =
    habits.length * last7Dates.length;

  const completedHabitOpportunities = habits.reduce(
    (total, habit) =>
      total +
      last7Dates.filter((date) =>
        habit.completedDates.includes(date)
      ).length,
    0
  );

  const habitCompletionRate = totalHabitOpportunities
    ? Math.round(
        (completedHabitOpportunities /
          totalHabitOpportunities) *
          100
      )
    : 0;

  const stats = [
    {
      title: "Completed Tasks",
      value: totalCompleted.toString(),
      description: "All-time completed tasks",
      icon: CheckCircle2,
    },
    {
      title: "Focus Time",
      value: `${totalHours}h ${remainingMinutes}m`,
      description: "Time from completed tasks",
      icon: Clock3,
    },
    {
      title: "Task Success",
      value: `${taskCompletionRate}%`,
      description: "Overall task completion",
      icon: TrendingUp,
    },
    {
      title: "Habit Consistency",
      value: `${habitCompletionRate}%`,
      description: "Last 7 days",
      icon: Leaf,
    },
  ];

  return (
    <section className="space-y-8">
      {/* HEADER */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#A98467]">
          Your growth in numbers
        </p>

        <h2 className="font-serif text-4xl font-semibold text-[#244736]">
          Your Statistics
        </h2>

        <p className="mt-3 text-sm text-[#817A70]">
          Track your progress and celebrate every step forward.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#E8E1D5] bg-white p-5 shadow-sm"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm text-[#817A70]">
                  {stat.title}
                </p>

                <div className="rounded-xl bg-[#EDF2EA] p-3 text-[#42644F]">
                  <Icon size={21} />
                </div>
              </div>

              <p className="font-serif text-3xl text-[#244736]">
                {stat.value}
              </p>

              <p className="mt-2 text-xs text-[#9A9185]">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* WEEKLY CHART */}
      <div className="rounded-3xl border border-[#E8E1D5] bg-white p-6 shadow-sm md:p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-[#EDF2EA] p-3 text-[#42644F]">
            <BarChart3 size={23} />
          </div>

          <div>
            <h3 className="font-serif text-2xl text-[#244736]">
              Weekly Productivity
            </h3>

            <p className="mt-1 text-sm text-[#817A70]">
              Tasks completed over the last 7 days
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={last7Days}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#EEE8DC"
              />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#817A70", fontSize: 12 }}
              />

              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#817A70", fontSize: 12 }}
              />

              <Tooltip
                cursor={{ fill: "#F4F0E8" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E8E1D5",
                  backgroundColor: "#FAF8F3",
                }}
              />

              <Bar
                dataKey="completed"
                fill="#42644F"
                radius={[8, 8, 0, 0]}
                maxBarSize={48}
                name="Completed Tasks"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="wood-card rounded-3xl p-7">
        <div className="mb-3 flex items-center gap-3">
          <Leaf size={24} className="text-[#795C43]" />

          <h3 className="font-serif text-2xl text-[#244736]">
            Your Growth Journey
          </h3>
        </div>

        <p className="text-sm leading-7 text-[#795C43]">
          You've completed{" "}
          <strong>{totalCompleted} tasks</strong> and
          planned activities representing{" "}
          <strong>
            {totalHours} hours and {remainingMinutes} minutes
          </strong>{" "}
          of completed work.
          Keep building meaningful routines, one day at a time.
        </p>
      </div>
    </section>
  );
}