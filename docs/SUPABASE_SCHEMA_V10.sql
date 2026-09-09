-- SUPABASE_SCHEMA_V10.sql
-- Esquema base de referencia. Revisar antes de ejecutar en producción.

create table if not exists seasons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  starts_on date,
  ends_on date,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  is_active boolean not null default true
);

create table if not exists competitions (
  id uuid primary key default gen_random_uuid(),
  season_id uuid references seasons(id) on delete cascade,
  category_id uuid references categories(id),
  name text not null,
  kind text not null check (kind in ('league','cup')),
  created_at timestamptz not null default now()
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id),
  name text not null,
  crest_path text,
  colors jsonb,
  delegate_name text,
  coach_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  folio text unique not null,
  public_name text not null,
  photo_path text,
  position text,
  shirt_number int,
  team_id uuid references teams(id),
  category_id uuid references categories(id),
  status text not null default 'active',
  private_profile jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  is_active boolean not null default true
);

create table if not exists rounds (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid references competitions(id) on delete cascade,
  number int not null,
  name text,
  starts_on date
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid references competitions(id) on delete cascade,
  round_id uuid references rounds(id),
  home_team_id uuid references teams(id),
  away_team_id uuid references teams(id),
  venue_id uuid references venues(id),
  kickoff timestamptz,
  status text not null default 'scheduled',
  home_score int not null default 0,
  away_score int not null default 0,
  public_notes text,
  created_at timestamptz not null default now()
);

create table if not exists match_events (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  team_id uuid references teams(id),
  player_id uuid references players(id),
  secondary_player_id uuid references players(id),
  minute int,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists match_officials (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  role text not null,
  official_name text not null
);

create table if not exists sanctions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references players(id),
  team_id uuid references teams(id),
  reason text not null,
  games_total int not null default 1,
  games_served int not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists shots (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  team_id uuid references teams(id),
  player_id uuid references players(id),
  minute int,
  x numeric not null,
  y numeric not null,
  outcome text not null,
  created_at timestamptz not null default now()
);

create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  team_id uuid references teams(id),
  match_id uuid references matches(id),
  created_at timestamptz not null default now()
);

create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  match_id uuid references matches(id) on delete cascade,
  home_score int not null,
  away_score int not null,
  points int not null default 0,
  unique(user_id, match_id)
);

create table if not exists mvp_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  match_id uuid references matches(id) on delete cascade,
  player_id uuid references players(id),
  created_at timestamptz not null default now(),
  unique(user_id, match_id)
);

create table if not exists audit_log (
  id bigint generated always as identity primary key,
  actor_user_id uuid,
  action text not null,
  entity_type text,
  entity_id text,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
