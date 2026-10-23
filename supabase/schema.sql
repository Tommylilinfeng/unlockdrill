-- UnlockDrill: email signups from the homepage and landing pages.
-- Run in the Supabase SQL editor. The browser uses the anon key and can only INSERT.
create table if not exists public.signups (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  email        text not null,
  page         text not null,            -- path the form was on, e.g. /for/scrollers
  variant      text not null,            -- value prop slug, e.g. scrollers
  exam         text not null,            -- sat | gre
  utm_source   text, utm_medium text, utm_campaign text, utm_content text,
  referrer     text,
  user_agent   text
);
create unique index if not exists signups_email_variant_uidx on public.signups (email, variant);

alter table public.signups enable row level security;
drop policy if exists "anon can insert signups" on public.signups;
create policy "anon can insert signups" on public.signups for insert to anon with check (true);
-- No select policy for anon: the team reads signups in the Supabase dashboard or with the service key.

-- Optional: practice events, written by the question flow when VITE_SUPABASE_URL is set.
create table if not exists public.practice_events (
  id           bigint generated always as identity primary key,
  created_at   timestamptz not null default now(),
  device_id    text not null,            -- random id stored in localStorage, not tied to a person
  app          text,                     -- instagram | tiktok | ...
  question_id  text,
  event        text not null,            -- shown | answered | skipped | paused | returned
  correct      boolean,
  ms_to_answer integer
);
alter table public.practice_events enable row level security;
drop policy if exists "anon can insert practice events" on public.practice_events;
create policy "anon can insert practice events" on public.practice_events for insert to anon with check (true);

-- Profiles (preview, dev builds): one row per signed-in user holding their on-device progress as JSON.
-- Answers, optional mistake tags, last diagnostic and invite code; see src/lib/progress.ts.
create table if not exists public.user_progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  name       text,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.user_progress enable row level security;
drop policy if exists "users read own progress" on public.user_progress;
create policy "users read own progress" on public.user_progress for select to authenticated using (auth.uid() = user_id);
drop policy if exists "users insert own progress" on public.user_progress;
create policy "users insert own progress" on public.user_progress for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "users update own progress" on public.user_progress;
create policy "users update own progress" on public.user_progress for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
