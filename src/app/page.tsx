"use client";

import { useState, useSyncExternalStore } from "react";
import { DailyProgress } from "@/components/daily-progress";
import { HabitList } from "@/components/habit-list";
import { getMockLogs, habits } from "@/lib/mock-data";

function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const subscribe = () => () => {};
const getServerDate = () => "";

export default function Home() {
  const today = useSyncExternalStore(subscribe, getLocalDate, getServerDate);
  const [toggledIds, setToggledIds] = useState<Set<string>>(() => new Set());
  const completedIds = new Set(
    getMockLogs(today).filter((log) => log.completed).map((log) => log.habitId),
  );

  for (const id of toggledIds) {
    if (completedIds.has(id)) completedIds.delete(id);
    else completedIds.add(id);
  }

  function toggleHabit(id: string) {
    setToggledIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const formattedDate = today
    ? new Date(`${today}T12:00:00`).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Today";

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8 sm:py-16">
      <header className="mb-8 sm:mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Habit tracker</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">Hello, today.</h1>
        <p className="mt-2 text-base text-stone-500">{formattedDate}</p>
      </header>
      <div className="space-y-5">
        <DailyProgress completed={completedIds.size} total={habits.length} />
        <HabitList habits={habits} completedIds={completedIds} onToggle={toggleHabit} />
      </div>
      <p className="mt-6 text-center text-sm text-stone-500">Small steps, one day at a time.</p>
    </main>
  );
}
