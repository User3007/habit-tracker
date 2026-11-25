export type Habit = {
  id: string;
  name: string;
  color: string;
  createdAt: string;
};

export type HabitLog = {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
};
