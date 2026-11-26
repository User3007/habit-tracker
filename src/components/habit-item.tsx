import type { Habit } from "@/lib/types";

type HabitItemProps = {
  habit: Habit;
  completed: boolean;
  onToggle: (id: string) => void;
  saving: boolean;
};

export function HabitItem({ habit, completed, onToggle, saving }: HabitItemProps) {
  return (
    <li>
      <label className="flex min-h-16 cursor-pointer items-center gap-4 px-6 py-4 transition-colors hover:bg-stone-50 sm:px-8">
        <input
          type="checkbox"
          checked={completed}
          disabled={saving}
          onChange={() => onToggle(habit.id)}
          className="h-5 w-5 shrink-0 cursor-pointer accent-emerald-600 disabled:opacity-50"
        />
        <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: habit.color }} />
        <span className={completed ? "text-stone-500 line-through" : "text-stone-800"}>{habit.name}</span>
      </label>
    </li>
  );
}
