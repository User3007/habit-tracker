create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  color text not null default '#34d399',
  created_at timestamptz not null default now(),
  archived boolean not null default false
);

create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  date date not null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  unique (habit_id, date)
);

create index habits_user_id_idx on public.habits (user_id);
-- The unique constraint indexes habit_id as the first column.
create index habit_logs_date_idx on public.habit_logs (date);

alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

grant select, insert, update, delete on public.habits to authenticated;
grant select, insert, update, delete on public.habit_logs to authenticated;

create policy "Users manage their own habits"
  on public.habits for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users manage logs for their own habits"
  on public.habit_logs for all to authenticated
  using (exists (
    select 1 from public.habits
    where habits.id = habit_logs.habit_id
      and habits.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.habits
    where habits.id = habit_logs.habit_id
      and habits.user_id = (select auth.uid())
  ));
