alter table public.assessments
  add column if not exists average_confidence numeric(4, 2),
  add column if not exists participation_rate numeric(5, 2),
  add column if not exists current_teaching_method text,
  add column if not exists teacher_observation text;

update public.assessments
set teacher_observation = coalesce(teacher_observation, teacher_note)
where teacher_note is not null;
