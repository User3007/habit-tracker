# Habit Tracker

A simple habit tracker for building consistency, tracking daily habits, and viewing progress over time.

## Current status

Phase 2 is complete: the responsive Today dashboard supports email/password authentication, habit creation, and persistent daily completion. Cross-user isolation was manually verified on the configured Supabase project; a new project still requires the setup below.

Built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

## Getting started

Requires Node.js 20.9 or later, npm, and a Supabase project. Install dependencies:

```bash
npm install
```

1. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` using your Supabase project settings. Never commit credentials.
2. Review and run [`001_init.sql`](supabase/migrations/001_init.sql) in the Supabase SQL Editor for a new project. The app does not apply migrations automatically; do not rerun it on an already initialized database.
3. Enable the email provider and sign-ups in Supabase Auth. If email confirmation is enabled, configure the site URL, allow `http://localhost:3000/auth/callback` as a redirect URL, and confirm the email in the browser used to sign up.

Start the development server:

```bash
npm run dev
```

Then open:

`http://localhost:3000`

For LAN access, open the computer's local IPv4 address on port 3000. The development server permits its current local IPv4 addresses; restart it if the address changes. HTTP does not encrypt passwords or session cookies, so use LAN access only on a trusted network. If signing up over LAN with email confirmation, also allow that origin's `/auth/callback` URL in Supabase Auth.

## Validation

For application changes, run:

```bash
npm run lint
npm run build
```

These checks do not verify live authentication, persistence, or row-level security. Test those behaviors against a configured Supabase project when relevant.

## Documentation

- [Current architecture](docs/architecture.md)
- [Project progression and future ideas](docs/progression.md)