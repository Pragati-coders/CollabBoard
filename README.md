# CollabBoard 🚀

A production-ready, multi-tenant SaaS project management platform built with Next.js 15, Clerk, Supabase, and Prisma. Inspired by Linear, Notion, and Jira.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | Tailwind CSS + shadcn/ui |
| Auth | Clerk (multi-tenant orgs) |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Realtime | Supabase Realtime |
| Drag & Drop | dnd-kit |
| Charts | Recharts |
| Animations | Framer Motion |
| Jobs | Inngest |
| Package Manager | pnpm |
| Deployment | Vercel + Supabase |

---

## Features

- Multi-tenant workspaces (one per company)
- Clerk authentication (sign up, login, org switching)
- RBAC: Owner / Admin / Manager / Member / Guest
- Kanban boards with real-time drag-and-drop
- Dashboard with KPI cards and charts
- Analytics: burndown, velocity, workload distribution
- Notifications center
- Team management
- Settings & danger zone
- Dark mode by default
- Command palette ready

---

## Quick Start (Local)

### 1. Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A [Clerk](https://clerk.com) account
- A [Supabase](https://supabase.com) project

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your keys in `.env.local` (see Environment Variables section below).

### 4. Set up the database

```bash
pnpm db:generate   # Generate Prisma client
pnpm db:push       # Push schema to Supabase
pnpm db:seed       # Optional: seed test data
```

### 5. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create `.env.local` with:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk — https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase — https://app.supabase.com
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Database (Supabase PostgreSQL connection string)
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres

# Inngest — https://inngest.com
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...
```

---

## Clerk Setup

1. Create a Clerk app at [clerk.com](https://clerk.com)
2. Enable **Organizations** in Clerk Dashboard → Organizations
3. Copy your publishable key and secret key
4. Add `http://localhost:3000` as an allowed origin
5. Set up a webhook pointing to `https://your-domain.com/api/webhooks/clerk`

---

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings → Database → copy the connection string
3. Replace `[YOUR-PASSWORD]` with your database password
4. Enable Realtime for the tables you want live updates on

---

## Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add all environment variables in the Vercel dashboard under Project → Settings → Environment Variables.

---

## Project Structure

```
collabboard/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Protected dashboard routes
│   │   ├── page.tsx        # Main dashboard
│   │   ├── projects/       # Project management
│   │   ├── board/[boardId] # Kanban board
│   │   ├── members/        # Team management
│   │   ├── analytics/      # Charts & metrics
│   │   ├── notifications/  # Notification center
│   │   └── settings/       # Workspace settings
│   ├── sign-in/            # Clerk auth pages
│   ├── sign-up/
│   ├── onboarding/         # Workspace creation
│   └── api/                # API routes
├── components/
│   ├── ui/                 # Base UI components (shadcn)
│   └── shared/             # Layout components (Sidebar, etc.)
├── features/               # Feature modules
│   ├── boards/             # Kanban board logic & components
│   └── analytics/          # Chart components
├── lib/                    # Utilities (db, supabase, permissions)
├── types/                  # TypeScript types
├── middleware.ts            # Clerk auth middleware
├── prisma/
│   ├── schema.prisma       # Full DB schema
│   └── seed.ts             # Seed script
└── styles/
    └── globals.css         # Global styles + CSS vars
```

---

## License

MIT — use freely in your portfolio.
