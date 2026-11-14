# CautionSafe

Spec: docs/SPEC.md (source of truth). Read the relevant section before each task.

## Commands
- pnpm dev / pnpm build / pnpm lint / pnpm typecheck / pnpm test
- Database is a hosted Supabase dev project (no local Docker). CLI runs via pnpm:
  - pnpm exec supabase link --project-ref <ref>   (once)
  - pnpm db:push      (apply new migrations to the dev project)
  - pnpm db:types     (regenerate src/lib/database.types.ts from the linked project)
  - Full reset: pnpm exec supabase db reset --linked  (wipes the dev project; ask first)

## Conventions
- Next.js 15 App Router, server components by default; 'use client' only where needed
- Data access through src/lib/db/*.ts, never raw Supabase calls inside components
- Server actions for mutations, validated with Zod
- Money = integer kobo. Dates = timestamptz, shown in Africa/Lagos
- Tailwind v3 tokens from tailwind.config.ts only; no arbitrary hex values in className
- Components in src/components/ui are plain and reusable; no feature logic there
- Migrations: 0001_init.sql is the SPEC section 5 schema as written; guards that the
  schema alone can't express (triggers, accept_invite) go in later migrations

## Don'ts
- No gradients, blur effects, emoji, or AI-style illustrations
- No new dependencies without saying why
- No invented image URLs
- Never import src/lib/supabase/admin.ts (service role) from client code
