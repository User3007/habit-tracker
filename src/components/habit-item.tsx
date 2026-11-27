import { useState } from "react";
import type { Habit } from "@/lib/types";

type HabitItemProps = {
  habit: Habit;
  completed: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string, name: string, color: string) => Promise<boolean>;
  onArchive: (habit: Habit) => void;
  saving: boolean;
  busy: boolean;
};

export function HabitItem({ habit, completed, onToggle, onEdit, onArchive, saving, busy }: HabitItemProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(habit.name);
  const [color, setColor] = useState(habit.color);

  async function saveEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || busy) return;
    if (await onEdit(habit.id, name, color)) setEditing(false);
  }

  return (
    <li className="px-6 py-4 sm:px-8">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-4">
          <input
            type="checkbox"
            checked={completed}
            disabled={busy}
            onChange={() => onToggle(habit.id)}
            className="h-5 w-5 shrink-0 cursor-pointer accent-emerald-600 disabled:opacity-50"
          />
          <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: habit.color }} />
          <span className={`break-words ${completed ? "text-stone-500 line-through" : "text-stone-800"}`}>{habit.name}</span>
        </label>
        <button type="button" disabled={busy || editing} onClick={() => { setName(habit.name); setColor(habit.color); setEditing(true); }} aria-label={`Edit ${habit.name}`} className="text-sm font-semibold text-stone-600 hover:text-stone-900 disabled:opacity-50">Edit</button>
        <button type="button" disabled={busy || editing} onClick={() => onArchive(habit)} aria-label={`Archive ${habit.name}`} className="text-sm font-semibold text-stone-600 hover:text-stone-900 disabled:opacity-50">{saving ? "Saving…" : "Archive"}</button>
      </div>
      {editing && (
        <form onSubmit={saveEdit} className="mt-4 flex flex-wrap items-end gap-3">
          <label className="min-w-0 flex-1 text-sm font-medium text-stone-700">
            Name
            <input required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} disabled={saving} className="mt-1 block w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900" />
          </label>
          <label className="text-sm font-medium text-stone-700">
            Color
            <input type="color" value={color} onChange={(event) => setColor(event.target.value)} disabled={saving} className="mt-1 block h-10 w-12 cursor-pointer rounded border border-stone-300 bg-white p-1" />
          </label>
          <button type="submit" disabled={busy || !name.trim()} className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">{saving ? "Saving…" : "Save"}</button>
          <button type="button" disabled={saving} onClick={() => setEditing(false)} className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50">Cancel</button>
        </form>
      )}
    </li>
  );
}
