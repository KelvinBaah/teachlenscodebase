insert into storage.buckets (id, name, public)
values ('raw-assessments', 'raw-assessments', false)
on conflict (id) do nothing;

create policy "raw assessments insert own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'raw-assessments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "raw assessments select own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'raw-assessments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "raw assessments update own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'raw-assessments'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'raw-assessments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "raw assessments delete own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'raw-assessments'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
