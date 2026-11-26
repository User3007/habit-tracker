# Habit Tracker

A simple habit tracker for building consistency, tracking daily habits, and viewing progress over time.

## Current Status

**Phase 2 complete: Supabase persistence and email authentication**

The Supabase migration is applied. Email/password authentication, the protected dashboard, persistent habits and daily logs, and cross-user RLS isolation have been verified.

## Features

### Phase 1

- View today's habits
- Mark habits as completed
- See daily progress
- Responsive mobile-friendly dashboard

### Phase 2 — Complete

- Supabase database with row-level security
- Email/password sign-up and sign-in
- Protected dashboard and sign-out
- Persistent habits and daily completion logs
- Verified users cannot access other users' habits or logs

### Planned

- Archive habits
- Current and longest streaks
- Completion statistics
- Calendar heatmap
- Dark mode

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase (authentication and database)
- Vercel (planned)

## Getting Started

Install dependencies:

```bash
npm install
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` using your Supabase project settings. Review and run `supabase/migrations/001_init.sql` in the Supabase SQL Editor; the app does not apply migrations automatically. Enable the email provider and sign-ups in Supabase Auth. If email confirmation is enabled, configure the site URL and add `http://localhost:3000/auth/callback` to the allowed redirect URLs, then confirm the email in the same browser used to sign up.

Start the development server:

```bash
npm run dev
```

Then open:

`http://localhost:3000`

For LAN access, open the computer's local IPv4 address on port 3000. The development server permits its current local IPv4 addresses; restart it if the address changes. HTTP does not encrypt passwords or session cookies, so use LAN access only on a trusted network. If signing up over LAN with email confirmation, also allow that origin's `/auth/callback` URL in Supabase Auth.

## Project Structure

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── login/
│   ├── auth/callback/
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── daily-progress.tsx
│   ├── habit-item.tsx
│   ├── habit-list.tsx
│   └── today-dashboard.tsx
├── lib/
│   ├── supabase/
│   ├── types.ts
│   └── utils.ts
└── proxy.ts
```

## Development

Run lint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Before committing:

```bash
npm run lint && npm run build
```

## Roadmap

- [x] Phase 1: Dashboard UI with mock data
- [x] Phase 2: Supabase, email authentication, persistent habits and logs, protected dashboard, and cross-user RLS isolation
- [ ] Phase 3: Streaks, completion statistics, and calendar heatmap