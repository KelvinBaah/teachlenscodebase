alter table public.assessments
  add column if not exists raw_upload_expires_at timestamptz;

update public.assessments
set raw_upload_expires_at = expires_at
where raw_file_path is not null
  and raw_upload_expires_at is null;

alter table public.weekly_analyses
  add column if not exists retention_category text not null default 'weekly_analysis_detail',
  add column if not exists expires_at timestamptz;

alter table public.recommendations
  add column if not exists retention_category text not null default 'recommendation_detail',
  add column if not exists expires_at timestamptz;

alter table public.teaching_method_logs
  add column if not exists retention_category text not null default 'teaching_method_detail',
  add column if not exists expires_at timestamptz;

create index if not exists assessments_raw_upload_expires_at_idx
  on public.assessments (raw_upload_expires_at);

create index if not exists assessments_expires_at_idx
  on public.assessments (expires_at);

create index if not exists weekly_analyses_expires_at_idx
  on public.weekly_analyses (expires_at);

create index if not exists recommendations_expires_at_idx
  on public.recommendations (expires_at);

create index if not exists teaching_method_logs_expires_at_idx
  on public.teaching_method_logs (expires_at);
