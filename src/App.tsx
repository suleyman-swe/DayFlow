import { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  CheckCircle2,
  Circle,
  BarChart3,
  Settings,
  Plus,
  Leaf,
  Clock3,
  ArrowUpRight,
  Trash2,
  Pencil,
  Sparkles,
  X,
  Coffee,
  AlertCircle,
  Check,
} from "lucide-react";

import { useTasks } from "./hooks/useTasks";
import { useHabits } from "./hooks/useHabits";
import TaskForm from "./components/TaskForm";
import Statistics from "./components/Statistics";
import type { Task } from "./types/task";
import { generateSmartPlan } from "./utils/smartPlanner";

type Page = "Dashboard" | "My Planner" | "Habits" | "Statistics" | "Settings";

function App() {
  const [activePage, setActivePage] = useState<Page>("Dashboard");

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [breakMinutes, setBreakMinutes] = useState(10);
  const [plannerMessage, setPlannerMessage] = useState("");

  const [newHabitName, setNewHabitName] = useState("");
  const [isAddingHabit, setIsAddingHabit] = useState(false);

  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useTasks();
  const { habits, addHabit, deleteHabit, toggleHabit } = useHabits();

  const today = [
    new Date().getFullYear(),
    String(new Date().getMonth() + 1).padStart(2, "0"),
    String(new Date().getDate()).padStart(2, "0"),
  ].join("-");

  const todaysTasks = tasks
    .filter((task) => task.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));

  const completedCount = todaysTasks.filter(
    (task) => task.completed
  ).length;

  const progress = todaysTasks.length
    ? Math.round((completedCount / todaysTasks.length) * 100)
    : 0;

  const totalMinutes = todaysTasks.reduce(
    (sum, task) => sum + task.duration,
    0
  );

  const completedHabits = habits.filter((habit) =>
    habit.completedDates.includes(today)
  ).length;

  const habitProgress = habits.length
    ? Math.round((completedHabits / habits.length) * 100)
    : 0;

  const menu = [
    { name: "Dashboard" as Page, icon: LayoutDashboard },
    { name: "My Planner" as Page, icon: CalendarDays },
    { name: "Habits" as Page, icon: CheckCircle2 },
    { name: "Statistics" as Page, icon: BarChart3 },
    { name: "Settings" as Page, icon: Settings },
  ];

  const openCreateForm = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const closeTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const handleTaskSubmit = (
    taskData: Omit<Task, "id" | "completed">
  ) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }

    closeTaskForm();
  };

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;

    addHabit(newHabitName);
    setNewHabitName("");
    setIsAddingHabit(false);
  };

  const handleGeneratePlan = () => {
    if (startTime >= endTime) {
      setPlannerMessage("End time must be later than start time.");
      return;
    }

    const pendingTasks = todaysTasks.filter(
      (task) => !task.completed
    );

    if (pendingTasks.length === 0) {
      setPlannerMessage(
        "Add at least one unfinished task before generating a plan."
      );
      return;
    }

    const result = generateSmartPlan(pendingTasks, {
      startTime,
      endTime,
      breakMinutes,
    });

    result.scheduledTasks.forEach((task) => {
      updateTask(task.id, { time: task.time });
    });

    if (result.scheduledTasks.length === 0) {
      setPlannerMessage(
        "No tasks fit into your available time. Try extending your schedule."
      );
      return;
    }

    const scheduledCount = result.scheduledTasks.length;
    const unscheduledCount = result.unscheduledTasks.length;

    setPlannerMessage(
      unscheduledCount > 0
        ? `${scheduledCount} tasks scheduled successfully. ${unscheduledCount} tasks could not fit into your available time.`
        : `Success! All ${scheduledCount} tasks have been scheduled.`
    );

    setIsPlannerOpen(false);
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const renderTaskList = (taskList: Task[]) => {
    if (taskList.length === 0) {
      return (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9CBB8] bg-[#FAF8F3] px-5 text-center">
          <div className="mb-4 rounded-full bg-[#EAF0E8] p-4 text-[#42644F]">
            <Leaf size={27} />
          </div>

          <h4 className="font-serif text-xl text-[#244736]">
            A fresh start awaits.
          </h4>

          <p className="mt-2 max-w-xs text-sm leading-6 text-[#817A70]">
            Your schedule is clear. Add your first task and start
            building a meaningful day.
          </p>

          <button
            type="button"
            onClick={openCreateForm}
            className="mt-5 rounded-xl bg-[#244736] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#365E48]"
          >
            Create Your First Task
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {taskList.map((task) => (
          <div
            key={task.id}
            className={`flex flex-wrap items-center gap-4 rounded-2xl border p-4 transition ${
              task.completed
                ? "border-[#E6EBE2] bg-[#F4F7F1]"
                : "border-[#ECE6DB] bg-[#FCFBF8] hover:border-[#D5BDA3]"
            }`}
          >
            <button
              type="button"
              onClick={() => toggleTask(task.id)}
              aria-label={
                task.completed
                  ? `Mark ${task.title} as incomplete`
                  : `Complete ${task.title}`
              }
              className="text-[#42644F]"
            >
              {task.completed ? (
                <CheckCircle2 size={25} />
              ) : (
                <Circle size={25} />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <p
                className={`break-words font-medium ${
                  task.completed
                    ? "text-[#8C968B] line-through"
                    : "text-[#244736]"
                }`}
              >
                {task.title}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#817A70]">
                <span className="flex items-center gap-1">
                  <Clock3 size={13} />
                  {task.time}
                </span>

                <span>{task.duration} min</span>

                <span className="rounded-full bg-[#EEE8DC] px-2 py-1 text-[#795C43]">
                  {task.category}
                </span>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                task.priority === "High"
                  ? "bg-[#F8E7E0] text-[#A4573E]"
                  : task.priority === "Medium"
                    ? "bg-[#F5EBD8] text-[#96723E]"
                    : "bg-[#E6EFE5] text-[#42644F]"
              }`}
            >
              {task.priority}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => openEditForm(task)}
                aria-label={`Edit ${task.title}`}
                title="Edit task"
                className="rounded-lg p-2 text-[#795C43] transition hover:bg-[#EAE1D2]"
              >
                <Pencil size={18} />
              </button>

              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete ${task.title}`}
                title="Delete task"
                className="rounded-lg p-2 text-[#B26B59] transition hover:bg-[#F8E7E0]"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderHabits = () => (
    <div className="rounded-3xl border border-[#E8E1D5] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#A98467]">
            Build consistency
          </p>

          <h3 className="font-serif text-2xl text-[#244736]">
            Daily Habits
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingHabit((previous) => !previous)}
          aria-label="Add habit"
          className="rounded-xl bg-[#EDF2EA] p-2 text-[#42644F] transition hover:bg-[#DCE8D8]"
        >
          {isAddingHabit ? <X size={19} /> : <Plus size={19} />}
        </button>
      </div>

      {isAddingHabit && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleAddHabit();
          }}
          className="mb-5 flex gap-2"
        >
          <input
            type="text"
            value={newHabitName}
            onChange={(event) => setNewHabitName(event.target.value)}
            placeholder="New habit..."
            maxLength={60}
            autoFocus
            className="min-w-0 flex-1 rounded-xl border border-[#D5BDA3] bg-[#FAF8F3] px-3 py-2 text-sm outline-none focus:border-[#244736]"
          />

          <button
            type="submit"
            aria-label="Save habit"
            className="rounded-xl bg-[#244736] px-3 text-white transition hover:bg-[#365E48]"
          >
            <Check size={19} />
          </button>
        </form>
      )}

      {habits.length === 0 ? (
        <div className="rounded-2xl bg-[#FAF8F3] px-4 py-6 text-center">
          <Leaf size={26} className="mx-auto mb-3 text-[#A98467]" />

          <p className="text-sm text-[#817A70]">
            No habits yet. Start with one small daily goal.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => {
            const isCompleted = habit.completedDates.includes(today);

            return (
              <div
                key={habit.id}
                className={`flex items-center gap-3 rounded-xl border px-3 py-3 ${
                  isCompleted
                    ? "border-[#DCE8D8] bg-[#F0F5ED]"
                    : "border-[#EEE8DC] bg-[#FCFBF8]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleHabit(habit.id, today)}
                  aria-label={
                    isCompleted
                      ? `Uncheck ${habit.name}`
                      : `Complete ${habit.name}`
                  }
                  className="shrink-0 text-[#42644F]"
                >
                  {isCompleted ? (
                    <CheckCircle2 size={21} />
                  ) : (
                    <Circle size={21} />
                  )}
                </button>

                <span
                  className={`min-w-0 flex-1 break-words text-sm ${
                    isCompleted
                      ? "text-[#8C968B] line-through"
                      : "text-[#5B6559]"
                  }`}
                >
                  {habit.name}
                </span>

                <button
                  type="button"
                  onClick={() => deleteHabit(habit.id)}
                  aria-label={`Delete habit ${habit.name}`}
                  className="shrink-0 rounded-lg p-1.5 text-[#B26B59] transition hover:bg-[#F8E7E0]"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {habits.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-xs text-[#817A70]">
            <span>Today's consistency</span>
            <span>
              {completedHabits}/{habits.length} · {habitProgress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[#EEE8DC]">
            <div
              className="h-full rounded-full bg-[#42644F] transition-all duration-500"
              style={{ width: `${habitProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderPlannerCard = () => (
    <div className="rounded-3xl bg-[#244736] p-6 text-white shadow-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#42644F]">
        <Sparkles size={23} className="text-[#E5D0B3]" />
      </div>

      <h3 className="font-serif text-2xl">Smart Day Planner</h3>

      <p className="mt-3 text-sm leading-6 text-[#D0DDD1]">
        Automatically organize your tasks based on priorities,
        durations, and available time.
      </p>

      <button
        type="button"
        onClick={() => {
          setPlannerMessage("");
          setIsPlannerOpen(true);
        }}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E5D0B3] px-5 py-3 font-medium text-[#244736] transition hover:bg-[#F2DFC5]"
      >
        <Sparkles size={18} />
        Generate My Day
      </button>
    </div>
  );

  const renderScheduleCard = (title: string, taskList: Task[]) => (
    <div className="rounded-3xl border border-[#E8E1D5] bg-white p-6 shadow-sm md:p-7">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#A98467]">
            Stay on track
          </p>

          <h3 className="font-serif text-2xl text-[#244736]">
            {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-xl bg-[#F1EBE0] px-4 py-2 text-sm font-medium text-[#795C43] transition hover:bg-[#E7DAC8]"
        >
          <Plus size={17} />
          Add Task
        </button>
      </div>

      {renderTaskList(taskList)}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FAF8F3] text-[#30372F]">
      {/* SIDEBAR */}
      <aside className="hidden w-64 shrink-0 flex-col bg-[#244736] px-6 py-8 text-white lg:flex">
        <div className="mb-14 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D9C3A5] text-[#244736]">
            <Leaf size={25} />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-semibold">
              DayFlow
            </h1>
            <p className="text-xs tracking-widest text-[#D9C3A5]">
              LIVE INTENTIONALLY
            </p>
          </div>
        </div>

        <p className="mb-5 px-3 text-xs uppercase tracking-[0.2em] text-[#A9BEAF]">
          Workspace
        </p>

        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = item.name === activePage;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setActivePage(item.name)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                  active
                    ? "bg-[#42644F] font-semibold text-white"
                    : "text-[#C5D3C8] hover:bg-[#355842]"
                }`}
              >
                <Icon size={19} />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl bg-[#365A43] p-5">
          <Leaf size={23} className="mb-4 text-[#D9C3A5]" />

          <p className="font-serif text-lg">
            Grow at your own pace.
          </p>

          <p className="mt-2 text-xs leading-5 text-[#C5D3C8]">
            Small steps create meaningful progress.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[#9EB5A5]">
          DayFlow © 2026
        </p>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAE4D9] bg-white/70 px-6 py-6 md:px-10">
          <div>
            <p className="mb-1 text-sm text-[#8C806F]">
              Your personal productivity space
            </p>

            <h2 className="font-serif text-2xl font-semibold text-[#244736]">
              Good to see you 🌿
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-[#F1EBE0] px-4 py-2 text-sm text-[#795C43] sm:flex">
              <CalendarDays size={16} />
              {formattedDate}
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DCC8AC] font-semibold text-[#244736]">
              DF
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-9 md:px-10">
          {/* DASHBOARD */}
          {activePage === "Dashboard" && (
            <>
              <section className="mb-9 flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#A98467]">
                    Your daily overview
                  </p>

                  <h2 className="font-serif text-4xl font-semibold text-[#244736] md:text-5xl">
                    Make today meaningful.
                  </h2>

                  <p className="mt-3 text-sm text-[#817A70]">
                    Focus on what matters. Let the rest flow naturally.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openCreateForm}
                  className="flex items-center gap-2 rounded-xl bg-[#244736] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#365E48]"
                >
                  <Plus size={19} />
                  Add New Task
                </button>
              </section>

              <section className="mb-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#E8E1D5] bg-white p-5">
                  <p className="text-sm text-[#817A70]">
                    Today's Tasks
                  </p>

                  <div className="mt-3 flex items-end justify-between">
                    <p className="font-serif text-4xl text-[#244736]">
                      {todaysTasks.length}
                    </p>

                    <div className="rounded-xl bg-[#EDF2EA] p-3 text-[#42644F]">
                      <CalendarDays size={21} />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E8E1D5] bg-white p-5">
                  <p className="text-sm text-[#817A70]">
                    Completed
                  </p>

                  <div className="mt-3 flex items-end justify-between">
                    <p className="font-serif text-4xl text-[#244736]">
                      {completedCount}
                    </p>

                    <div className="rounded-xl bg-[#EDF2EA] p-3 text-[#42644F]">
                      <CheckCircle2 size={21} />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E8E1D5] bg-white p-5">
                  <p className="text-sm text-[#817A70]">
                    Planned Focus
                  </p>

                  <div className="mt-3 flex items-end justify-between">
                    <p className="font-serif text-4xl text-[#244736]">
                      {Math.floor(totalMinutes / 60)}
                      <span className="ml-1 text-lg">h</span>{" "}
                      {totalMinutes % 60}
                      <span className="ml-1 text-lg">m</span>
                    </p>

                    <div className="rounded-xl bg-[#F5EDE3] p-3 text-[#A98467]">
                      <Clock3 size={21} />
                    </div>
                  </div>
                </div>
              </section>

              {plannerMessage && (
                <div className="mb-7 flex items-start justify-between gap-4 rounded-2xl border border-[#C9D9C9] bg-[#EDF4EA] p-4 text-sm text-[#244736]">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="shrink-0" />
                    <p>{plannerMessage}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPlannerMessage("")}
                    aria-label="Dismiss message"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              <section className="grid gap-7 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
                {renderScheduleCard("Today's Schedule", todaysTasks)}

                <div className="space-y-6">
                  <div className="wood-card rounded-3xl p-6 shadow-sm">
                    <div className="mb-5 flex items-start justify-between">
                      <div>
                        <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[#795C43]">
                          Keep growing
                        </p>

                        <h3 className="font-serif text-2xl text-[#244736]">
                          Daily Progress
                        </h3>
                      </div>

                      <ArrowUpRight
                        size={22}
                        className="text-[#795C43]"
                      />
                    </div>

                    <div className="mb-3 flex items-end justify-between">
                      <span className="font-serif text-5xl text-[#244736]">
                        {progress}%
                      </span>

                      <span className="text-sm text-[#795C43]">
                        {completedCount} of {todaysTasks.length} tasks
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-white/60">
                      <div
                        className="h-full rounded-full bg-[#244736] transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <p className="mt-4 text-sm text-[#795C43]">
                      {progress === 100 && todaysTasks.length > 0
                        ? "Wonderful work. You completed your day!"
                        : "Every little step counts. Keep moving forward."}
                    </p>
                  </div>

                  {renderHabits()}
                  {renderPlannerCard()}
                </div>
              </section>
            </>
          )}

          {/* STATISTICS */}
          {activePage === "Statistics" && (
            <Statistics tasks={tasks} habits={habits} />
          )}

          {/* MY PLANNER */}
          {activePage === "My Planner" && (
            <section className="space-y-7">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#A98467]">
                  Your schedule
                </p>

                <h2 className="font-serif text-4xl text-[#244736]">
                  My Planner
                </h2>

                <p className="mt-3 text-sm text-[#817A70]">
                  Organize your day and stay focused on your goals.
                </p>
              </div>

              <div className="grid gap-7 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
                {renderScheduleCard("Today's Tasks", todaysTasks)}
                {renderPlannerCard()}
              </div>
            </section>
          )}

          {/* HABITS */}
          {activePage === "Habits" && (
            <section className="mx-auto max-w-3xl space-y-7">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#A98467]">
                  Small steps, lasting change
                </p>

                <h2 className="font-serif text-4xl text-[#244736]">
                  Habit Tracker
                </h2>

                <p className="mt-3 text-sm text-[#817A70]">
                  Build consistency one day at a time.
                </p>
              </div>

              {renderHabits()}
            </section>
          )}

          {/* SETTINGS */}
          {activePage === "Settings" && (
            <section className="mx-auto max-w-3xl space-y-7">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#A98467]">
                  Your workspace
                </p>

                <h2 className="font-serif text-4xl text-[#244736]">
                  Settings
                </h2>

                <p className="mt-3 text-sm text-[#817A70]">
                  Personalize your DayFlow experience.
                </p>
              </div>

              <div className="rounded-3xl border border-[#E8E1D5] bg-white p-7">
                <div className="flex items-center gap-3">
                  <Settings size={23} className="text-[#42644F]" />

                  <h3 className="font-serif text-2xl text-[#244736]">
                    Preferences
                  </h3>
                </div>

                <p className="mt-4 text-sm leading-7 text-[#817A70]">
                  Your tasks and habits are currently saved
                  locally in your browser. More customization
                  options are coming soon.
                </p>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* CREATE / EDIT TASK MODAL */}
      {isTaskFormOpen && (
        <TaskForm
          key={editingTask?.id ?? "new-task"}
          initialTask={editingTask ?? undefined}
          onClose={closeTaskForm}
          onSubmit={handleTaskSubmit}
        />
      )}

      {/* SMART PLANNER MODAL */}
      {isPlannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B3025]/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#FAF8F3] p-7 shadow-2xl">
            <div className="mb-7 flex items-start justify-between">
              <div>
                <p className="mb-2 text-xs uppercase tracking-widest text-[#96765A]">
                  Plan with intention
                </p>

                <h2 className="font-serif text-3xl text-[#244736]">
                  Smart Day Planner
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsPlannerOpen(false)}
                aria-label="Close planner"
                className="rounded-full p-2 hover:bg-[#EAE1D2]"
              >
                <X size={22} />
              </button>
            </div>

            <p className="mb-6 text-sm leading-6 text-[#817A70]">
              Choose your available hours. DayFlow will arrange
              your unfinished tasks automatically.
            </p>

            <div className="mb-5 grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="planner-start"
                  className="mb-2 block text-sm font-medium"
                >
                  Start Time
                </label>

                <input
                  id="planner-start"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-xl border border-[#D5BDA3] bg-white p-3"
                />
              </div>

              <div>
                <label
                  htmlFor="planner-end"
                  className="mb-2 block text-sm font-medium"
                >
                  End Time
                </label>

                <input
                  id="planner-end"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-xl border border-[#D5BDA3] bg-white p-3"
                />
              </div>
            </div>

            <div className="mb-7">
              <label
                htmlFor="planner-break"
                className="mb-2 flex items-center gap-2 text-sm font-medium"
              >
                <Coffee size={17} className="text-[#795C43]" />
                Break Between Tasks (minutes)
              </label>

              <input
                id="planner-break"
                type="number"
                min="0"
                max="120"
                value={breakMinutes}
                onChange={(e) =>
                  setBreakMinutes(
                    Math.max(0, Math.min(120, Number(e.target.value) || 0))
                  )
                }
                className="w-full rounded-xl border border-[#D5BDA3] bg-white p-3"
              />
            </div>

            <button
              type="button"
              onClick={handleGeneratePlan}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#244736] py-4 font-medium text-white transition hover:bg-[#365E48]"
            >
              <Sparkles size={19} />
              Generate My Schedule
            </button>

            {plannerMessage && (
              <p className="mt-4 text-sm text-[#795C43]">
                {plannerMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;