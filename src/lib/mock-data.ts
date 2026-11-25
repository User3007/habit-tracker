import type { Habit, HabitLog } from "@/lib/types";

export const habits: Habit[] = [
  { id: "water", name: "Drink a glass of water", color: "#60a5fa", createdAt: "2026-01-01" },
  { id: "move", name: "Move your body", color: "#fb923c", createdAt: "2026-01-01" },
  { id: "read", name: "Read for 15 minutes", color: "#a78bfa", createdAt: "2026-01-01" },
  { id: "mindful", name: "Take a mindful moment", color: "#f472b6", createdAt: "2026-01-01" },
  { id: "sleep", name: "Get ready for bed on time", color: "#34d399", createdAt: "2026-01-01" },
];

export function getMockLogs(date: string): HabitLog[] {
  if (!date) return [];

  return [
    { id: "log-water", habitId: "water", date, completed: true },
    { id: "log-read", habitId: "read", date, completed: true },
    { id: "log-move", habitId: "move", date, completed: false },
  ];
}
