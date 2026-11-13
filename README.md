# 🌿 DayFlow

**A Nature-Inspired Productivity Planner**

DayFlow is a responsive productivity web application for organizing daily tasks, building habits, and understanding personal progress. Its forest-green and warm-cream design aims to make planning feel calm and approachable.

**[Live Demo](https://day-flow-blue.vercel.app/)** · **[Source Code](https://github.com/suleyman-swe/DayFlow)**

## ✨ Features

- **Task management:** Add, edit, delete, and complete tasks with a category, priority, date, time, and estimated duration.
- **Smart Day Planner:** Automatically schedule today's unfinished tasks by priority and duration within a chosen time window, including configurable breaks. Tasks that do not fit are reported.
- **Habit tracker:** Add habits, mark daily completions, and track consistency.
- **Statistics:** View a seven-day chart of completed tasks, overall completion rate, estimated time associated with completed tasks, and recent habit consistency.
- **Local persistence:** Tasks and habits are saved in your browser's LocalStorage, without requiring an account.

> **Note:** Smart Day Planner currently uses a deterministic priority-based scheduling algorithm, **not** a generative AI model or external AI API. The statistics chart groups completed tasks by their scheduled dates, since completion timestamps are not stored.

## 🛠️ Tech Stack

| Technology | Purpose |
| --- | --- |
| React | User interface |
| TypeScript | Type safety |
| Vite | Development and production builds |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| Recharts | Data visualization |
| Browser LocalStorage | Data persistence |
| Git & GitHub | Version control |
| Vercel | Hosting |

## 🚀 Getting Started

**Prerequisites:** Node.js and npm.

```bash
git clone https://github.com/suleyman-swe/DayFlow.git
cd DayFlow
npm install
npm run dev
```

Open the local address printed by Vite in your terminal.

To create and preview a production build:

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```text
src/
├── components/
│   ├── TaskForm.tsx
│   └── Statistics.tsx
├── hooks/
│   ├── useTasks.ts
│   └── useHabits.ts
├── types/
│   └── task.ts
├── utils/
│   ├── storage.ts
│   └── smartPlanner.ts
├── App.tsx
└── index.css
```

## ⚙️ How Scheduling Works

1. Collect unfinished tasks scheduled for today.
2. Sort tasks by priority (**High → Medium → Low**), using shorter durations to break ties.
3. Allocate tasks within the selected start and end times, including breaks between scheduled tasks.
4. Update the scheduled start times of tasks that fit.
5. Report tasks that could not be scheduled within the available time.

This is an automatic heuristic scheduler; it does not consider external calendar conflicts or fixed appointments.

## 💾 Data & Privacy

DayFlow stores task and habit data locally in each browser profile. Different people using different browsers or browser profiles have separate data. Data is **not** synchronized between devices and may be lost if browser storage is cleared. People sharing the same browser profile can access the same locally stored data.

## 🤖 AI Assistance Disclosure

AI-assisted development tools were used to support project planning, React/TypeScript implementation, interface design, debugging, and documentation. The application itself does not currently call an AI service.

## 🔮 Potential Improvements

- Accounts and secure cloud synchronization
- Calendar integration and conflict detection
- More advanced scheduling constraints
- Optional AI-powered planning
- Notifications and additional analytics

## 👨‍💻 Developer

**Süleyman Bektaş** · Software Engineering Student

[GitHub Profile](https://github.com/suleyman-swe)

## 📄 Status

DayFlow is deployed as a functional web application: **[Open DayFlow](https://day-flow-blue.vercel.app/)**.

