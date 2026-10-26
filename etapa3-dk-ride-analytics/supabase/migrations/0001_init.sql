-- DK Ride Analytics: esquema inicial (RASCUNHO, ainda não aplicado).
-- Revise junto com docs/modelo-de-dados.md antes de rodar no SQL Editor do Supabase.

create table public.rides (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null default auth.uid() references auth.users (id) on delete cascade,
  ride_date            date not null,
  start_time           time,
  end_time             time,
  duration_minutes     integer,
  distance_km          numeric(6, 2),
  base_amount_cents    integer not null,
  tip_amount_cents     integer not null default 0,
  bonus_amount_cents   integer not null default 0,
  platform_fees_cents  integer not null default 0,
  platform             text,
  notes                text not null default '',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),

  constraint rides_times_together  check ((start_time is null) = (end_time is null)),
  constraint rides_duration_range  check (duration_minutes is null or duration_minutes between 1 and 720),
  constraint rides_duration_source check (start_time is null or duration_minutes is null),
  constraint rides_distance_range  check (distance_km is null or (distance_km > 0 and distance_km <= 300)),
  constraint rides_base_positive   check (base_amount_cents > 0),
  constraint rides_amounts_nonneg  check (tip_amount_cents >= 0 and bonus_amount_cents >= 0 and platform_fees_cents >= 0),
  constraint rides_fees_le_gross   check (platform_fees_cents <= base_amount_cents + tip_amount_cents + bonus_amount_cents),
  constraint rides_platform_len    check (platform is null or char_length(platform) <= 40),
  constraint rides_notes_len       check (char_length(notes) <= 200)
);

create table public.expenses (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  expense_date  date not null,
  category      text not null,
  amount_cents  integer not null,
  notes         text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint expenses_category check (category in
    ('combustivel', 'manutencao', 'seguro_documentacao', 'plano_celular', 'equipamentos', 'outros')),
  constraint expenses_amount_positive check (amount_cents > 0),
  constraint expenses_notes_len check (char_length(notes) <= 200)
);

create index rides_user_date_idx    on public.rides (user_id, ride_date desc);
create index expenses_user_date_idx on public.expenses (user_id, expense_date desc);

-- Mantém updated_at correto a cada edição
create function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger rides_set_updated_at    before update on public.rides
  for each row execute function public.set_updated_at();
create trigger expenses_set_updated_at before update on public.expenses
  for each row execute function public.set_updated_at();

-- Row Level Security: cada usuário acessa só as próprias linhas
alter table public.rides    enable row level security;
alter table public.expenses enable row level security;

create policy rides_select on public.rides for select to authenticated
  using ((select auth.uid()) = user_id);
create policy rides_insert on public.rides for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy rides_update on public.rides for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy rides_delete on public.rides for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy expenses_select on public.expenses for select to authenticated
  using ((select auth.uid()) = user_id);
create policy expenses_insert on public.expenses for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy expenses_update on public.expenses for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy expenses_delete on public.expenses for delete to authenticated
  using ((select auth.uid()) = user_id);
