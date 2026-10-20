-- IGMA Saturday: paste all of this into Supabase → SQL Editor → New query → Run.
-- Safe to run more than once.

create table if not exists public.spots (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  player_name text not null check (char_length(trim(player_name)) between 1 and 80),
  position    text not null default 'BENCH' check (
    position in (
      'R-GK','R-LB','R-RB','R-LM','R-CM','R-RM','R-ST',
      'B-GK','B-LB','B-RB','B-LM','B-CM','B-RM','B-ST',
      'BENCH'
    )
  ),
  created_at  timestamptz not null default now()
);

-- One entry per player.
create unique index if not exists spots_one_per_user on public.spots (user_id);
-- One player per position on the pitch (the bench holds any number).
create unique index if not exists spots_one_per_position on public.spots (position) where position <> 'BENCH';

-- Row Level Security: nobody reads anything without logging in.
alter table public.spots enable row level security;

drop policy if exists "Logged-in players see the lineup" on public.spots;
create policy "Logged-in players see the lineup"
  on public.spots for select
  to authenticated
  using (auth.uid() is not null);

drop policy if exists "Players add only themselves" on public.spots;
create policy "Players add only themselves"
  on public.spots for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Players change only their own spot" on public.spots;
create policy "Players change only their own spot"
  on public.spots for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Players remove only their own spot" on public.spots;
create policy "Players remove only their own spot"
  on public.spots for delete
  to authenticated
  using (user_id = auth.uid());

-- Logged-out visitors get no table access at all.
revoke all on public.spots from anon;
grant select, insert, update, delete on public.spots to authenticated;
