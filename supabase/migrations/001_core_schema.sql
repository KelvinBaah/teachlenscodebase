create extension if not exists "pgcrypto";

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update
    set email = excluded.email;

  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  institution_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  course_name text not null,
  subject_area text not null,
  class_size integer not null check (class_size > 0),
  class_level text not null,
  term_label text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  title text not null,
  assessment_date date not null,
  assessment_type text not null,
  topic text,
  average_score numeric(5, 2),
  score_summary jsonb,
  concept_summary jsonb,
  teacher_note text,
  confidence_summary text,
  raw_file_path text,
  retention_category text not null default 'assessment_detail',
  expires_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.weekly_analyses (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  assessment_id uuid references public.assessments (id) on delete cascade,
  summary text,
  detected_patterns jsonb not null default '[]'::jsonb,
  average_score numeric(5, 2),
  understanding_bands jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  assessment_id uuid references public.assessments (id) on delete cascade,
  weekly_analysis_id uuid references public.weekly_analyses (id) on delete cascade,
  method_name text not null,
  reason text,
  implementation_note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.teaching_method_logs (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles (id) on delete cascade,
  class_id uuid not null references public.classes (id) on delete cascade,
  assessment_id uuid references public.assessments (id) on delete set null,
  weekly_analysis_id uuid references public.weekly_analyses (id) on delete set null,
  recommendation_id uuid references public.recommendations (id) on delete set null,
  log_date date not null,
  method_used text not null,
  reflection_note text,
  was_recommended boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists classes_set_updated_at on public.classes;
create trigger classes_set_updated_at
  before update on public.classes
  for each row execute procedure public.set_updated_at();

drop trigger if exists assessments_set_updated_at on public.assessments;
create trigger assessments_set_updated_at
  before update on public.assessments
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.assessments enable row level security;
alter table public.weekly_analyses enable row level security;
alter table public.recommendations enable row level security;
alter table public.teaching_method_logs enable row level security;

create policy "profiles select own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles update own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "classes own access"
  on public.classes for all
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

create policy "assessments own access"
  on public.assessments for all
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

create policy "weekly analyses own access"
  on public.weekly_analyses for all
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

create policy "recommendations own access"
  on public.recommendations for all
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

create policy "teaching method logs own access"
  on public.teaching_method_logs for all
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

create index if not exists classes_teacher_id_idx on public.classes (teacher_id);
create index if not exists assessments_class_id_idx on public.assessments (class_id);
create index if not exists weekly_analyses_class_id_idx on public.weekly_analyses (class_id);
create index if not exists recommendations_class_id_idx on public.recommendations (class_id);
create index if not exists teaching_method_logs_class_id_idx on public.teaching_method_logs (class_id);
