import { useState, type FormEvent } from "react";
import { X, Plus, Save } from "lucide-react";
import type { Task, TaskCategory, TaskPriority } from "../types/task";

interface TaskFormProps {
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "completed">) => void;
  initialTask?: Task;
}

export default function TaskForm({
  onClose,
  onSubmit,
  initialTask,
}: TaskFormProps) {
  const isEditing = Boolean(initialTask);

  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [category, setCategory] = useState<TaskCategory>(
    initialTask?.category ?? "Personal"
  );
  const [priority, setPriority] = useState<TaskPriority>(
    initialTask?.priority ?? "Medium"
  );
  const [date, setDate] = useState(
    initialTask?.date ?? new Date().toLocaleDateString("en-CA")
  );
  const [time, setTime] = useState(initialTask?.time ?? "09:00");
  const [duration, setDuration] = useState(initialTask?.duration ?? 30);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      category,
      priority,
      date,
      time,
      duration,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B3025]/60 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-[#FAF8F3] p-8 shadow-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-[#96765A]">
              {isEditing ? "Refine your schedule" : "Organize your day"}
            </p>

            <h2 className="font-serif text-3xl text-[#244736]">
              {isEditing ? "Edit Task" : "Create a New Task"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="rounded-full p-2 hover:bg-[#EAE1D2]"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="task-title" className="mb-2 block text-sm font-medium">
              Task Name
            </label>

            <input
              id="task-title"
              type="text"
              required
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to accomplish?"
              className="w-full rounded-xl border border-[#D5BDA3] bg-white px-4 py-3 outline-none focus:border-[#244736]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-category" className="mb-2 block text-sm font-medium">
                Category
              </label>

              <select
                id="task-category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as TaskCategory)
                }
                className="w-full rounded-xl border border-[#D5BDA3] bg-white p-3"
              >
                <option>Personal</option>
                <option>Work</option>
                <option>Learning</option>
                <option>Health</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="task-priority" className="mb-2 block text-sm font-medium">
                Priority
              </label>

              <select
                id="task-priority"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as TaskPriority)
                }
                className="w-full rounded-xl border border-[#D5BDA3] bg-white p-3"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-date" className="mb-2 block text-sm font-medium">
                Date
              </label>

              <input
                id="task-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-[#D5BDA3] bg-white p-3"
              />
            </div>

            <div>
              <label htmlFor="task-time" className="mb-2 block text-sm font-medium">
                Start Time
              </label>

              <input
                id="task-time"
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-[#D5BDA3] bg-white p-3"
              />
            </div>
          </div>

          <div>
            <label htmlFor="task-duration" className="mb-2 block text-sm font-medium">
              Duration (minutes)
            </label>

            <input
              id="task-duration"
              type="number"
              min="5"
              max="1440"
              required
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-xl border border-[#D5BDA3] bg-white p-3"
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#244736] py-4 font-medium text-white transition hover:bg-[#365E48]"
          >
            {isEditing ? <Save size={19} /> : <Plus size={19} />}
            {isEditing ? "Save Changes" : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}