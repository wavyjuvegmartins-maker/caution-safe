-- 0001_init: CautionSafe v1 schema (docs/SPEC.md section 5) + RLS.
-- Table definitions are copied from the spec unchanged.

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

-- access helper (from spec)
create function is_party(t uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from tenancy_parties
                 where tenancy_id = t and profile_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Supporting helpers. All are security definer so policies can look across
-- tables without RLS recursion. Every access decision still comes down to
-- tenancy_parties membership or property ownership.
-- ---------------------------------------------------------------------------

create function has_role(t uuid, roles party_role[]) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from tenancy_parties
                 where tenancy_id = t and profile_id = auth.uid() and role = any(roles));
$$;

create function owns_property(p uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from properties where id = p and owner_id = auth.uid());
$$;

create function is_property_party(p uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from tenancies t
                 join tenancy_parties tp on tp.tenancy_id = t.id
                 where t.property_id = p and tp.profile_id = auth.uid());
$$;

create function tenancy_property(t uuid) returns uuid
language sql stable security definer set search_path = public as $$
  select property_id from tenancies where id = t;
$$;

create function shares_tenancy(p uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from tenancy_parties me
                 join tenancy_parties other on other.tenancy_id = me.tenancy_id
                 where me.profile_id = auth.uid() and other.profile_id = p);
$$;

create function inspection_tenancy(i uuid) returns uuid
language sql stable security definer set search_path = public as $$
  select tenancy_id from inspections where id = i;
$$;

create function inspection_is_draft(i uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from inspections where id = i and status = 'draft');
$$;

create function room_entry_inspection(re uuid) returns uuid
language sql stable security definer set search_path = public as $$
  select inspection_id from room_entries where id = re;
$$;

-- ---------------------------------------------------------------------------
-- RLS: on for every table. Policies are for `authenticated` only; anon gets
-- nothing. Share links (/r/[shareToken]) use the service role on the server.
-- ---------------------------------------------------------------------------

alter table profiles        enable row level security;
alter table properties      enable row level security;
alter table rooms           enable row level security;
alter table tenancies       enable row level security;
alter table tenancy_parties enable row level security;
alter table inspections     enable row level security;
alter table room_entries    enable row level security;
alter table photos          enable row level security;
alter table signatures      enable row level security;
alter table deductions      enable row level security;

-- profiles
create policy profiles_select_own on profiles for select to authenticated
  using (id = auth.uid());
create policy profiles_select_shared on profiles for select to authenticated
  using (shares_tenancy(id));
create policy profiles_insert_own on profiles for insert to authenticated
  with check (id = auth.uid());
create policy profiles_update_own on profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- properties
create policy properties_owner_all on properties for all to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy properties_party_select on properties for select to authenticated
  using (is_property_party(id));

-- rooms
create policy rooms_owner_all on rooms for all to authenticated
  using (owns_property(property_id)) with check (owns_property(property_id));
create policy rooms_party_select on rooms for select to authenticated
  using (is_property_party(property_id));

-- tenancies
create policy tenancies_select on tenancies for select to authenticated
  using (is_party(id) or owns_property(property_id));
create policy tenancies_insert on tenancies for insert to authenticated
  with check (owns_property(property_id));
create policy tenancies_update on tenancies for update to authenticated
  using (owns_property(property_id) or has_role(id, array['landlord','agent']::party_role[]))
  with check (owns_property(property_id) or has_role(id, array['landlord','agent']::party_role[]));

-- tenancy_parties (tenants join via a definer function added in a later migration)
create policy parties_select on tenancy_parties for select to authenticated
  using (is_party(tenancy_id) or owns_property(tenancy_property(tenancy_id)));
create policy parties_owner_insert on tenancy_parties for insert to authenticated
  with check (owns_property(tenancy_property(tenancy_id)) and role in ('landlord','agent'));
create policy parties_owner_delete on tenancy_parties for delete to authenticated
  using (owns_property(tenancy_property(tenancy_id)) and role = 'agent');

-- inspections: parties read; parties create drafts; nobody updates a locked one
create policy inspections_select on inspections for select to authenticated
  using (is_party(tenancy_id));
create policy inspections_insert on inspections for insert to authenticated
  with check (is_party(tenancy_id) and status = 'draft');
create policy inspections_update on inspections for update to authenticated
  using (is_party(tenancy_id) and status <> 'locked')
  with check (is_party(tenancy_id));

-- room_entries: read if party; write only while the inspection is draft
create policy room_entries_select on room_entries for select to authenticated
  using (is_party(inspection_tenancy(inspection_id)));
create policy room_entries_insert on room_entries for insert to authenticated
  with check (is_party(inspection_tenancy(inspection_id)) and inspection_is_draft(inspection_id));
create policy room_entries_update on room_entries for update to authenticated
  using (is_party(inspection_tenancy(inspection_id)) and inspection_is_draft(inspection_id))
  with check (is_party(inspection_tenancy(inspection_id)) and inspection_is_draft(inspection_id));
create policy room_entries_delete on room_entries for delete to authenticated
  using (is_party(inspection_tenancy(inspection_id)) and inspection_is_draft(inspection_id));

-- photos: read if party; write only while draft; you can only upload as yourself
create policy photos_select on photos for select to authenticated
  using (is_party(inspection_tenancy(room_entry_inspection(room_entry_id))));
create policy photos_insert on photos for insert to authenticated
  with check (uploaded_by = auth.uid()
              and is_party(inspection_tenancy(room_entry_inspection(room_entry_id)))
              and inspection_is_draft(room_entry_inspection(room_entry_id)));
create policy photos_update on photos for update to authenticated
  using (uploaded_by = auth.uid() and inspection_is_draft(room_entry_inspection(room_entry_id)))
  with check (uploaded_by = auth.uid() and inspection_is_draft(room_entry_inspection(room_entry_id)));
create policy photos_delete on photos for delete to authenticated
  using (uploaded_by = auth.uid() and inspection_is_draft(room_entry_inspection(room_entry_id)));

-- signatures: parties read. No insert/update/delete policy for users: the sign
-- server action verifies the OTP, then writes with the service role.
create policy signatures_select on signatures for select to authenticated
  using (is_party(inspection_tenancy(inspection_id)));

-- deductions: parties read; landlord/agent insert and delete proposed ones.
-- Column-level rules (tenant: status + tenant_comment only; landlord: not
-- status) are enforced by a trigger in a later migration.
create policy deductions_select on deductions for select to authenticated
  using (is_party(tenancy_id));
create policy deductions_insert on deductions for insert to authenticated
  with check (has_role(tenancy_id, array['landlord','agent']::party_role[]) and status = 'proposed');
create policy deductions_update on deductions for update to authenticated
  using (is_party(tenancy_id)) with check (is_party(tenancy_id));
create policy deductions_delete on deductions for delete to authenticated
  using (has_role(tenancy_id, array['landlord','agent']::party_role[]) and status = 'proposed');

-- ---------------------------------------------------------------------------
-- Storage: private bucket, paths {tenancy_id}/{inspection_id}/{photo_id}.jpg
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('inspection-photos', 'inspection-photos', false, 524288, array['image/jpeg']);

create policy photos_bucket_select on storage.objects for select to authenticated
  using (bucket_id = 'inspection-photos'
         and is_party(((storage.foldername(name))[1])::uuid));
create policy photos_bucket_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'inspection-photos'
              and is_party(((storage.foldername(name))[1])::uuid)
              and inspection_tenancy(((storage.foldername(name))[2])::uuid)
                  = ((storage.foldername(name))[1])::uuid
              and inspection_is_draft(((storage.foldername(name))[2])::uuid));
create policy photos_bucket_delete on storage.objects for delete to authenticated
  using (bucket_id = 'inspection-photos'
         and owner_id = auth.uid()::text
         and inspection_is_draft(((storage.foldername(name))[2])::uuid));
