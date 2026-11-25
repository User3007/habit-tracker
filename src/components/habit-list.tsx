import { HabitItem } from "@/components/habit-item";
import type { Habit } from "@/lib/types";

type HabitListProps = {
  habits: Habit[];
  completedIds: Set<string>;
  onToggle: (id: string) => void;
};

export function HabitList({ habits, completedIds, onToggle }: HabitListProps) {
  return (
    <section aria-labelledby="habits-heading" className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-100 px-6 py-5 sm:px-8">
        <h2 id="habits-heading" className="text-lg font-semibold text-stone-900">Your habits</h2>
        <p className="mt-1 text-sm text-stone-500">Check in with yourself today.</p>
      </div>
      <ul className="divide-y divide-stone-100">
        {habits.map((habit) => (
          <HabitItem key={habit.id} habit={habit} completed={completedIds.has(habit.id)} onToggle={onToggle} />
        ))}
      </ul>
    </section>
  );
}
