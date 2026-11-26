"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { DailyProgress } from "@/components/daily-progress";
import { HabitList } from "@/components/habit-list";
import { createClient } from "@/lib/supabase/browser";
import type { Habit } from "@/lib/types";

function getLocalDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function subscribeToDate(callback: () => void) {
  const timer = window.setInterval(callback, 60_000);
  window.addEventListener("focus", callback);
  return () => {
    window.clearInterval(timer);
    window.removeEventListener("focus", callback);
  };
}

const getServerDate = () => "";

type HabitRow = {
  id: string;
  name: string;
  color: string;
  created_at: string;
};

function toHabit(row: HabitRow): Habit {
  return { id: row.id, name: row.name, color: row.color, createdAt: row.created_at };
}

export function TodayDashboard({ userId }: { userId: string }) {
  const router = useRouter();
  const today = useSyncExternalStore(subscribeToDate, getLocalDate, getServerDate);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => new Set());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#34d399");
  const [creating, setCreating] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [savingIds, setSavingIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (!today) return;
    let cancelled = false;
    const supabase = createClient();

    async function load() {
      setLoading(true);
      setLoadError("");
      const { data: habitRows, error: habitsError } = await supabase
        .from("habits")
        .select("id, name, color, created_at")
        .eq("user_id", userId)
        .eq("archived", false)
        .order("created_at", { ascending: true });
      if (cancelled) return;
      if (habitsError) {
        setLoadError(habitsError.message);
        setLoading(false);
        return;
      }

      const loadedHabits = (habitRows ?? []).map(toHabit);
      const ids = loadedHabits.map((habit) => habit.id);
      const { data: logs, error: logsError } = ids.length
        ? await supabase.from("habit_logs").select("habit_id, completed").eq("date", today).in("habit_id", ids)
        : { data: [], error: null };
      if (cancelled) return;
      if (logsError) {
        setLoadError(logsError.message);
        setLoading(false);
        return;
      }
      setHabits(loadedHabits);
      setCompletedIds(new Set((logs ?? []).filter((log) => log.completed).map((log) => log.habit_id)));
      setLoading(false);
    }

    void load();
    return () => { cancelled = true; };
  }, [today, userId, reload]);

  async function createHabit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || creating) return;
    setCreating(true);
    setError("");
    const { data, error: createError } = await createClient()
      .from("habits")
      .insert({ user_id: userId, name: trimmedName, color })
      .select("id, name, color, created_at")
      .single();
    if (createError) setError(createError.message);
    else {
      setHabits((previous) => [...previous, toHabit(data)]);
      setName("");
    }
    setCreating(false);
  }

  async function toggleHabit(id: string) {
    if (savingIds.has(id)) return;
    const completed = !completedIds.has(id);
    setSavingIds((previous) => new Set(previous).add(id));
    setError("");
    const { error: saveError } = await createClient()
      .from("habit_logs")
      .upsert({ habit_id: id, date: today, completed }, { onConflict: "habit_id,date" });
    if (saveError) setError(saveError.message);
    else if (today === getLocalDate()) {
      setCompletedIds((previous) => {
        const next = new Set(previous);
        if (completed) next.add(id);
        else next.delete(id);
        return next;
      });
    }
    setSavingIds((previous) => {
      const next = new Set(previous);
      next.delete(id);
      return next;
    });
  }

  async function signOut() {
    setSigningOut(true);
    setError("");
    const { error: signOutError } = await createClient().auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      setSigningOut(false);
      return;
    }
    router.replace("/login");
    router.refresh();
  }

  const formattedDate = today
    ? new Date(`${today}T12:00:00`).toLocaleDateString(undefined, {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
      })
    : "Today";

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-8 sm:py-16">
      <header className="mb-8 flex items-start justify-between gap-4 sm:mb-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Habit tracker</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">Hello, today.</h1>
          <p className="mt-2 text-base text-stone-500">{formattedDate}</p>
        </div>
        <button type="button" onClick={signOut} disabled={signingOut} className="shrink-0 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50">
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </header>
      <div className="space-y-5">
        {loading ? (
          <p role="status" className="text-sm text-stone-500">Loading your habits…</p>
        ) : loadError ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-700">
            <p>Could not load your habits: {loadError}</p>
            <button type="button" onClick={() => setReload((value) => value + 1)} className="mt-3 font-semibold underline">Try again</button>
          </div>
        ) : (
          <>
            <DailyProgress completed={completedIds.size} total={habits.length} />
            <HabitList habits={habits} completedIds={completedIds} onToggle={toggleHabit} savingIds={savingIds} />
            {habits.length === 0 && <p className="text-sm text-stone-500">No habits yet. Add one to get started.</p>}
            <form onSubmit={createHabit} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-stone-900">Add a habit</h2>
              <div className="mt-4 flex flex-wrap items-end gap-3">
                <label className="min-w-0 flex-1 text-sm font-medium text-stone-700">
                  Name
                  <input required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900" />
                </label>
                <label className="text-sm font-medium text-stone-700">
                  Color
                  <input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="mt-1 block h-10 w-12 cursor-pointer rounded border border-stone-300 bg-white p-1" />
                </label>
                <button type="submit" disabled={creating || !name.trim()} className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">
                  {creating ? "Adding…" : "Add habit"}
                </button>
              </div>
            </form>
          </>
        )}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      </div>
      <p className="mt-6 text-center text-sm text-stone-500">Small steps, one day at a time.</p>
    </main>
  );
}
