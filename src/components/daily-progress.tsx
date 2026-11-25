type DailyProgressProps = {
  completed: number;
  total: number;
};

export function DailyProgress({ completed, total }: DailyProgressProps) {
  return (
    <section aria-labelledby="progress-heading" className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h2 id="progress-heading" className="text-lg font-semibold text-stone-900">Daily progress</h2>
          <p className="mt-1 text-sm text-stone-500">A little progress adds up.</p>
        </div>
        <p aria-live="polite" className="shrink-0 text-sm font-semibold text-stone-700">
          {completed} / {total} completed
        </p>
      </div>
      <progress
        aria-label="Daily progress"
        className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-stone-100 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-stone-100 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-emerald-600 [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-emerald-600"
        value={completed}
        max={total || 1}
      />
    </section>
  );
}
