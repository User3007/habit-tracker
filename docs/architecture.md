# Current architecture

## Application

- Next.js App Router uses `src/app/page.tsx` for the protected dashboard, `src/app/login/page.tsx` for email/password sign-in and sign-up, and `src/app/auth/callback/route.ts` for email confirmation.
- `src/components/today-dashboard.tsx` loads the user's habits and logs for active habits on the browser's local calendar date. It creates and edits habits, archives them after confirmation, and offers an archived-habits view for restoration. Archive and restore update only the `archived` flag; the dashboard reloads active habits and today's logs after archive or restore. Completion state is upserted; marking a habit incomplete stores `completed = false` rather than deleting the log. The habit-list, habit-item, and daily-progress components render the dashboard.
- Browser and server Supabase clients live in `src/lib/supabase/`. The browser client manages session cookies; the server client uses Next.js cookies. `src/proxy.ts` refreshes sessions, propagates updated cookies, and redirects unauthenticated dashboard requests; the dashboard also checks verified claims.
- The confirmation callback exchanges the authentication code for a session and writes its cookies to the redirect response. Sign-out uses Supabase's default global scope, which can revoke the user's other sessions.

## Database and access

The manually applied migration [`001_init.sql`](../supabase/migrations/001_init.sql) defines two public tables:

- `habits`: UUID `id`, `user_id` referencing `auth.users`, `name`, `color`, `created_at`, and `archived`. Deleting a user cascades to their habits.
- `habit_logs`: UUID `id`, `habit_id` referencing a habit, `date`, `completed`, and `created_at`. The `(habit_id, date)` pair is unique; deleting a habit cascades to its logs.

Both tables have row-level security enabled. Authenticated users can select, insert, update, and delete only their own habits and logs belonging to those habits; ownership is checked on writes as well as reads. The migration indexes `habits.user_id` and `habit_logs.date`; the unique constraint indexes `habit_id` first. Migrations are reviewed and run manually in Supabase; the app does not apply them.

## Configuration and hosts

The clients use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from `.env.local`. Setup and confirmation redirect settings are described in the [README](../README.md#getting-started).

`localhost` and a LAN IP use separate host-specific browser cookies. In development, `next.config.ts` allows the machine's current non-internal IPv4 addresses as dev origins; restart the server if an address changes. LAN HTTP does not encrypt passwords or session cookies, so use a trusted network.
