# CautionSafe — Build Spec for Claude Code

Nov 14, 2026

CautionSafe v1 lets a tenant and landlord record a flat's condition room by room with time-stamped photos, sign it together, and compare move-in vs move-out when the caution fee is refunded. Escrow comes in v2.

## 1. Build prompt

Save this file in your repo as `docs/SPEC.md`, add the CLAUDE.md below at the repo root, then paste the master prompt into Claude Code.

**Master prompt (paste into Claude Code)**

```markdown
You are building CautionSafe v1, a web app for Nigerian renters and landlords.
Read docs/SPEC.md fully before writing any code. It is the source of truth.

What to build: a mobile-first Next.js app where a landlord creates a property,
invites a tenant, and both walk through the flat room by room taking time-stamped
photos. Both sign the move-in report with a phone OTP. At move-out they repeat it,
and the app shows move-in vs move-out photos side by side. The landlord proposes
deductions from the caution fee; the tenant accepts or disputes each one.
The final settlement downloads as a PDF. No money moves through the app in v1.

Rules:
1. Work milestone by milestone (SPEC section 8). Stop after each one, run the
   acceptance checks, and tell me what passed before starting the next.
2. Use the exact schema in SPEC section 5. Write it as a Supabase migration.
   Every table has row-level security on. Never use the service role key in the browser.
3. Follow the design rules in SPEC section 6 exactly. No gradients, no glassmorphism,
   no emoji in UI, no stock "hero with laptop" layout, no purple. If a rule blocks you, ask.
4. Use the SVGs in SPEC section 7 as given. Do not generate or invent image URLs.
   Use only the photo URLs listed there, or leave a grey placeholder box with a TODO.
5. Photos are captured in the browser (input capture="environment"), compressed
   client-side to max 1600px / ~300 KB, and stored in Supabase Storage.
   The server stamps capture time; never trust the client clock.
6. Naira amounts are stored as integer kobo. Format with Intl.NumberFormat('en-NG').
7. TypeScript strict. No `any`. Zod for every form and API input.
8. Write copy in plain Nigerian English. Short labels. No marketing fluff.

Start with milestone 1. First show me the file tree you plan to create.
```

**CLAUDE.md (repo root)**

```markdown
# CautionSafe

Spec: docs/SPEC.md (source of truth). Read the relevant section before each task.

## Commands
- pnpm dev / pnpm build / pnpm lint / pnpm typecheck / pnpm test
- supabase start / supabase db reset / supabase gen types typescript --local > src/lib/database.types.ts

## Conventions
- Next.js App Router, server components by default; 'use client' only where needed
- Data access through src/lib/db/*.ts, never raw Supabase calls inside components
- Server actions for mutations, validated with Zod
- Money = integer kobo. Dates = timestamptz, shown in Africa/Lagos
- Tailwind tokens from tailwind.config.ts only; no arbitrary hex values in className
- Components in src/components/ui are plain and reusable; no feature logic there

## Don'ts
- No gradients, blur effects, emoji, or AI-style illustrations
- No new dependencies without saying why
- No invented image URLs
```

## 2. Product scope

v1 is a condition-report and deduction tool, not a payments app. It must work well on a cheap Android phone on a slow 3G connection.

**In v1**

- Landlord or agent creates a property with its rooms
- Invite a tenant by phone number (SMS link)
- Move-in inspection: room-by-room checklist, photos, notes, meter readings
- Both parties sign with phone OTP; the report locks after both sign
- Move-out inspection using the same rooms, shown side by side with move-in
- Landlord proposes deductions per item with amount and reason
- Tenant accepts or disputes each deduction; settlement summary is computed
- PDF report download and share link (read-only, expiring)

**Not in v1**

- Holding or moving money (escrow is v2 with a licensed partner)
- Property listings or tenant search
- Rent collection
- Native mobile apps (PWA only)

**Roles**

| Role | Can do | Cannot do |
| --- | --- | --- |
| Landlord | Create properties and rooms, invite tenants, run inspections, sign, propose deductions | Edit a report after both have signed |
| Agent | Same as landlord, on properties the landlord adds them to | Delete a property |
| Tenant | Join by invite, add photos and notes, sign, accept or dispute deductions | Create properties, change deduction amounts |
| Viewer (share link) | Read a signed report | Anything else |

## 3. User flows

A tenancy has two inspections (move-in and move-out) and one settlement. Each inspection moves through fixed states, and the server enforces every transition.

**Move-in**

1. Landlord creates property, adds rooms (defaults: Parlour, Bedroom 1, Kitchen, Toilet/Bath, Exterior).
2. Landlord creates a tenancy: tenant phone, start date, caution fee (₦).
3. Tenant gets an SMS link, verifies by OTP, and joins.
4. Either party opens the move-in inspection. For each room: tick checklist items (walls, floor, doors, windows, sockets, fittings), mark each Good / Fair / Damaged, add photos (min 2 per room) and notes.
5. Record meter readings (prepaid meter number and units).
6. Submit for signing. Both parties confirm by OTP. Report locks and a SHA-256 hash of its content is stored.

**Move-out**

1. Landlord opens the move-out inspection; rooms copy from move-in.
2. Each room shows the move-in photos beside a "Take move-out photo" slot.
3. Same checklist and conditions. Both sign. Report locks.

**Settlement**

1. Landlord adds deductions: room, item, amount (₦), reason, linked photo.
2. Tenant marks each one Accepted or Disputed (with a comment).
3. App shows: caution fee − accepted deductions = refund due, and lists disputed items separately.
4. Either party downloads the PDF settlement.

**Inspection states**

| From | Action | To | Who |
| --- | --- | --- | --- |
| draft | submit for signing | awaiting_signatures | landlord, agent or tenant |
| awaiting_signatures | first party signs | partially_signed | either party |
| partially_signed | second party signs | locked | the other party |
| awaiting_signatures / partially_signed | request changes | draft (signatures cleared) | either party |
| locked | — | no further changes | nobody |

**Deduction states:** proposed → accepted, or proposed → disputed → (landlord edits amount) → proposed again. A settlement is final when no deduction is in proposed.

## 4. Stack, routes and folders

Next.js App Router on Vercel, Supabase for auth, database and photo storage, Termii for SMS OTP.

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js (App Router), TypeScript strict | Server actions, one codebase |
| Styling | Tailwind CSS, no UI kit; small own components | Avoids the generic shadcn look |
| Auth | Supabase Auth, phone OTP (Termii as SMS provider) | Nigerian users trust phone over email |
| Database | Supabase Postgres + RLS | Per-tenancy access rules |
| Storage | Supabase Storage, private bucket `inspection-photos` | Signed URLs only |
| Image handling | browser-image-compression (client) | Keeps uploads small on 3G |
| PDF | @react-pdf/renderer in a route handler | Server-side, no headless browser |
| Validation | Zod | Forms and server actions |
| Tests | Vitest (logic), Playwright (one happy path) | Enough for v1 |
| PWA | next-pwa or a hand-written service worker | Install to home screen, cache shell |

**Routes**

| Route | Who | Purpose |
| --- | --- | --- |
| `/` | public | Landing page |
| `/login` | public | Phone + OTP |
| `/invite/[token]` | public | Tenant joins a tenancy |
| `/app` | signed in | My properties / my tenancies |
| `/app/properties/new` | landlord | Create property + rooms |
| `/app/properties/[id]` | landlord, agent | Property detail, tenancies |
| `/app/tenancies/[id]` | parties | Tenancy overview, both inspections, settlement |
| `/app/inspections/[id]` | parties | Room list and progress |
| `/app/inspections/[id]/rooms/[roomId]` | parties | Checklist, photos, notes |
| `/app/inspections/[id]/sign` | parties | Review and OTP sign |
| `/app/tenancies/[id]/compare` | parties | Move-in vs move-out side by side |
| `/app/tenancies/[id]/settlement` | parties | Deductions and refund due |
| `/r/[shareToken]` | anyone with link | Read-only signed report |
| `/api/reports/[inspectionId]/pdf` | parties | PDF download |

**Folder structure**

```text
src/
  app/
    (marketing)/page.tsx
    login/page.tsx
    invite/[token]/page.tsx
    app/
      layout.tsx
      page.tsx
      properties/...
      tenancies/[id]/{page,compare,settlement}/...
      inspections/[id]/{page,sign,rooms/[roomId]}/...
    r/[shareToken]/page.tsx
    api/reports/[inspectionId]/pdf/route.ts
  components/
    ui/            # Button, Input, Badge, Sheet, PhotoTile, Stepper
    inspection/    # RoomCard, ChecklistItem, ConditionPicker, PhotoCapture
    compare/       # SideBySide
    brand/         # Logo.tsx, icons.tsx (SVGs from section 7)
  lib/
    db/            # properties.ts, tenancies.ts, inspections.ts, deductions.ts
    auth.ts
    money.ts       # kobo <-> naira
    hash.ts        # report hashing
    database.types.ts
  actions/         # server actions per feature
supabase/
  migrations/0001_init.sql
  seed.sql
docs/SPEC.md
```

## 5. Data model

Ten tables. Access is always decided by membership in `tenancy_parties`, checked by one helper function used in every RLS policy.

```sql
-- supabase/migrations/0001_init.sql
create extension if not exists pgcrypto;

create type party_role as enum ('landlord','agent','tenant');
create type inspection_kind as enum ('move_in','move_out');
create type inspection_status as enum ('draft','awaiting_signatures','partially_signed','locked');
create type condition_grade as enum ('good','fair','damaged','missing');
create type deduction_status as enum ('proposed','accepted','disputed');

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  phone text unique not null,
  created_at timestamptz not null default now()
);

create table properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id),
  label text not null,              -- e.g. 'Flat 3, 12 Okigwe Rd'
  address text not null,
  city text not null,
  state text not null,
  created_at timestamptz not null default now()
);

create table rooms (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  name text not null,
  position int not null default 0
);

create table tenancies (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id),
  start_date date not null,
  end_date date,
  caution_fee_kobo bigint not null check (caution_fee_kobo >= 0),
  invite_token text unique default encode(gen_random_bytes(16),'hex'),
  invite_phone text,
  created_at timestamptz not null default now()
);

create table tenancy_parties (
  tenancy_id uuid references tenancies(id) on delete cascade,
  profile_id uuid references profiles(id),
  role party_role not null,
  primary key (tenancy_id, profile_id)
);

create table inspections (
  id uuid primary key default gen_random_uuid(),
  tenancy_id uuid not null references tenancies(id) on delete cascade,
  kind inspection_kind not null,
  status inspection_status not null default 'draft',
  meter_number text,
  meter_units numeric,
  content_hash text,                -- sha256 of report JSON at lock time
  share_token text unique,
  locked_at timestamptz,
  unique (tenancy_id, kind)
);

create table room_entries (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references inspections(id) on delete cascade,
  room_id uuid not null references rooms(id),
  checklist jsonb not null default '{}',  -- {"walls":"good","floor":"fair",...}
  overall condition_grade,
  notes text,
  unique (inspection_id, room_id)
);

create table photos (
  id uuid primary key default gen_random_uuid(),
  room_entry_id uuid not null references room_entries(id) on delete cascade,
  storage_path text not null,
  captured_at timestamptz not null default now(),  -- server time
  uploaded_by uuid not null references profiles(id),
  caption text
);

create table signatures (
  inspection_id uuid references inspections(id) on delete cascade,
  profile_id uuid references profiles(id),
  signed_at timestamptz not null default now(),
  content_hash text not null,
  primary key (inspection_id, profile_id)
);

create table deductions (
  id uuid primary key default gen_random_uuid(),
  tenancy_id uuid not null references tenancies(id) on delete cascade,
  room_id uuid references rooms(id),
  item text not null,
  amount_kobo bigint not null check (amount_kobo > 0),
  reason text not null,
  photo_id uuid references photos(id),
  status deduction_status not null default 'proposed',
  tenant_comment text,
  created_at timestamptz not null default now()
);

-- access helper
create function is_party(t uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from tenancy_parties
                 where tenancy_id = t and profile_id = auth.uid());
$$;
```

**RLS rules (write one policy per line below)**

- Enable RLS on every table.
- `profiles`: a user reads and updates only their own row; parties of a shared tenancy can read each other's name and phone.
- `properties`, `rooms`: owner has full access; parties of any tenancy on the property can read.
- `tenancies`, `inspections`, `room_entries`, `photos`, `deductions`: read if `is_party(tenancy_id)`.
- Writes to `room_entries` and `photos` only when the inspection status is `draft`.
- `deductions`: insert and update amount only by landlord or agent; `status` and `tenant_comment` updated only by the tenant.
- `signatures`: insert only your own row, only via the sign server action after OTP check.
- Share links (`/r/[shareToken]`) are served by a server route using the service role, read-only, and only for `locked` inspections.
- Storage bucket `inspection-photos` is private; paths are `{tenancy_id}/{inspection_id}/{photo_id}.jpg`; serve with signed URLs that expire after 1 hour.

## 6. Design direction

CautionSafe should look like a well-made official inspection form, not a startup template. The model is a clean printed document with stamps: paper colour, ink-black text, ruled lines, and colour used only to mean something (good, fair, damaged).

**Anti-slop rules (Claude Code must follow)**

- No gradients, glassmorphism, blurred blobs, glowing borders or drop-shadow cards.
- No purple, no indigo, no "tech blue" (#3B82F6 and friends).
- No emoji in the UI. No sparkle icons. No "AI-powered" anywhere.
- No centred hero with a big headline + two buttons + laptop mockup. The landing page opens with a real sample report.
- No 3-column "features" grid with icons in circles.
- No lorem ipsum. Use realistic Nigerian sample data (names, addresses in Aba, Umuahia, Port Harcourt; ₦ amounts).
- Rounded corners max 6px. Borders 1px. Shadows only on the bottom sheet.
- Every colour must carry meaning or be neutral.

**Palette**

| Token | Hex | Use |
| --- | --- | --- |
| paper | #F7F5F0 | App background |
| card | #FFFFFF | Cards, sheets |
| ink | #1C1B19 | Main text, primary buttons |
| ink-muted | #6B6860 | Secondary text, labels |
| rule | #E2DED5 | Borders, dividers, table lines |
| green | #1F6B4A | Good condition, signed, refund due |
| amber | #A86B12 | Fair condition, awaiting signature |
| red | #B3261E | Damaged / missing, disputed |
| stamp-bg | #EAF2EC | Locked-report stamp background |

Primary buttons are ink (#1C1B19) with paper text, not green. Green means "good", so it is never decoration.

**Type**

- IBM Plex Sans (400, 500, 600) for all UI text, via `next/font/google`.
- IBM Plex Mono (400, 500) for money, meter numbers, dates, report IDs and hashes.
- Scale: 13 / 15 / 17 / 20 / 26 px. Body 15px on mobile. Line height 1.45.
- Headings in sentence case. Labels in small caps style: 12px, uppercase, letter-spacing 0.06em, ink-muted.

**Layout**

- Mobile first, 375px base. Max content width 720px on desktop, left-aligned, like a document.
- Spacing scale 4 / 8 / 12 / 16 / 24 / 32 px.
- Bottom action bar on inspection screens (thumb reach), not top buttons.
- Tables in reports use ruled rows (1px #E2DED5), no zebra stripes.

**Key components**

| Component | Look and behaviour |
| --- | --- |
| ConditionPicker | Four segmented buttons: Good / Fair / Damaged / Missing; selected one fills with its colour at 12% tint and a 1px border in full colour |
| PhotoTile | 4:3 photo, 6px radius, caption below in Plex Mono 12px: capture time "14 Nov 2026, 10:42" |
| RoomCard | Room name, condition badge, photo count, progress tick; tap opens room screen |
| SideBySide | Two columns labelled MOVE-IN / MOVE-OUT, same room, matched photos; on phones, swipe between them |
| LockedStamp | Rotated -4deg rectangle, 1.5px green border, text "SIGNED BY BOTH PARTIES" + date + short hash in Plex Mono |
| MoneyRow | Label left, amount right in Plex Mono, e.g. ₦150,000.00 |
| Stepper | Move-in → Move-out → Settlement, flat line with numbered dots |

**Copy tone:** short and direct. "Take 2 photos of this room." "Waiting for Chidi to sign." "Refund due: ₦120,000."

## 7. Assets

All brand marks and icons are hand-written SVGs below. Copy them as they are into `src/components/brand/`. For photos, the best option is your own: shoot 10–15 real rooms in Aba, Umuahia or Port Harcourt flats on your phone. That beats any stock image and is the strongest way to avoid the AI-slop look.

**Logo mark (32×32)**: a house inside an ink tile, with a check.

```svg
<svg viewBox="0 0 32 32" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="CautionSafe">
  <rect x="1" y="1" width="30" height="30" rx="6" fill="#1C1B19"/>
  <path d="M8 15.5 16 9l8 6.5V24H8z" stroke="#F7F5F0" stroke-width="2" stroke-linejoin="round"/>
  <path d="m12.5 18.5 2.5 2.5 4.5-5" stroke="#F7F5F0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

Wordmark: the mark + "CautionSafe" in IBM Plex Sans 600, 18px, ink, 8px gap. No tagline in the header.

**Icons (24×24, stroke = currentColor)**: wrap each path set in this shell.

```svg
<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <!-- paths go here -->
</svg>
```

| Icon | Paths |
| --- | --- |
| camera | `<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>` |
| room (door) | `<path d="M6 21V3h12v18"/><path d="M3 21h18"/><circle cx="15" cy="12" r="0.9" fill="currentColor"/>` |
| meter | `<rect x="4" y="3" width="16" height="18" rx="2"/><rect x="7" y="6" width="10" height="5" rx="1"/><path d="M8 15h2M14 15h2M8 18h2M14 18h2"/>` |
| sign (pen) | `<path d="M4 20h16"/><path d="M14.5 4.5l3 3L9 16H6v-3z"/>` |
| locked | `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>` |
| damaged | `<path d="M12 3 2 20h20z"/><path d="M12 10v4"/><circle cx="12" cy="17" r="0.9" fill="currentColor"/>` |
| compare | `<rect x="3" y="5" width="8" height="14" rx="1"/><rect x="13" y="5" width="8" height="14" rx="1"/>` |

**Locked stamp (240×84)**: make the date and hash props in React.

```svg
<svg viewBox="0 0 240 84" width="240" height="84" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Signed by both parties">
  <g transform="rotate(-4 120 42)">
    <rect x="6" y="10" width="228" height="64" rx="4" fill="#EAF2EC" stroke="#1F6B4A" stroke-width="1.5"/>
    <rect x="11" y="15" width="218" height="54" rx="2" stroke="#1F6B4A" stroke-width="0.75"/>
    <text x="120" y="38" text-anchor="middle" font-family="IBM Plex Sans, sans-serif" font-weight="600" font-size="13" letter-spacing="1.2" fill="#1F6B4A">SIGNED BY BOTH PARTIES</text>
    <text x="120" y="58" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="11" fill="#1F6B4A">14 NOV 2026 · #a3f9c21e</text>
  </g>
</svg>
```

**Empty state: floor plan line drawing (200×140)**: shown when a property has no inspections yet.

```svg
<svg viewBox="0 0 200 140" width="200" height="140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g stroke="#6B6860" stroke-width="1.5">
    <rect x="10" y="10" width="180" height="120"/>
    <path d="M100 10v70M10 80h180M130 80v50M100 45h90"/>
  </g>
  <g font-family="IBM Plex Mono, monospace" font-size="8" fill="#6B6860" text-anchor="middle">
    <text x="55" y="48">PARLOUR</text>
    <text x="145" y="30">KITCHEN</text>
    <text x="145" y="65">BATH</text>
    <text x="70" y="108">BEDROOM 1</text>
    <text x="160" y="108">BEDROOM 2</text>
  </g>
</svg>
```

**Photos for the landing page sample report**

These are Unsplash photo pages found by search, not direct image files. Download each one by hand into `public/images/` and check its licence on the page first. Claude Code must not hot-link or invent other URLs.

| Use | Photo page | Licence |
| --- | --- | --- |
| Kitchen (sample report) | [Modern kitchen, Lagos](https://unsplash.com/photos/a-modern-kitchen-with-marble-counter-tops-and-stainless-steel-appliances-70U9U4UG_bY) | Free (Unsplash License) |
| Empty room (move-out) | [Empty room with large window and sink](https://unsplash.com/photos/an-empty-room-with-a-large-window-and-a-sink-k1_m1qbpHEE) | Free download |
| Bare room (move-in) | [Empty room, brown wall, wooden floor](https://unsplash.com/photos/dark-brown-wall-in-an-empty-room-with-a-wooden-floor-ur5gBDDT9iY) | Check on page |

The Lagos kitchen photo is a well-finished, high-end space, while most users rent plainer flats. Use it only on the landing page, and replace all three with your own shots before launch. Anything else stays as a grey #E2DED5 4:3 box with the camera icon centred and a `TODO: real photo` comment.

## 8. Build milestones

Seven milestones, each small enough for one Claude Code session. Claude Code stops after each one and shows that every check passes.

| # | Milestone | Acceptance checks |
| --- | --- | --- |
| 1 | Project setup: Next.js, Tailwind tokens from section 6, Plex fonts, Supabase local, migration 0001, generated types, CLAUDE.md | `pnpm build`, `pnpm typecheck` and `supabase db reset` pass; a test page shows every palette token and type size |
| 2 | Auth: phone OTP login, profile creation, protected `/app` layout | Login with a test number works; `/app` redirects when signed out; RLS blocks reading another user's profile |
| 3 | Properties and tenancies: create property with default rooms, reorder rooms, create tenancy, invite link by SMS, tenant joins | Tenant sees only their tenancy; landlord can't see other landlords' properties; invite token works once |
| 4 | Move-in inspection: room list, checklist, ConditionPicker, photo capture with compression and upload, notes, meter reading | Photo under 400 KB after compression; `captured_at` is server time; works at 375px width; offline photo queue retries on reconnect |
| 5 | Signing and lock: review screen, OTP sign, content hash, LockedStamp, share link, PDF | Editing after lock fails at the database level (test it); hash in PDF matches database; share link shows only locked reports |
| 6 | Move-out and compare: copy rooms, SideBySide view, sign and lock | Every room shows move-in photos next to move-out slots; swipe works on mobile |
| 7 | Settlement: deductions, accept or dispute, refund due, settlement PDF, landing page with sample report | Refund due = caution fee − accepted deductions (unit test in kobo); tenant can't change amounts; landing page passes the anti-slop list in section 6 |

**Before launch**

- [ ] Replace all stock photos with your own room shots
- [ ] Lighthouse mobile score 90+ on `/` and `/app`
- [ ] Test the full flow with 2 real people on 2 Android phones
- [ ] Privacy page: what photos are stored, for how long, who can see them
- [ ] Termii sender ID approved for SMS
