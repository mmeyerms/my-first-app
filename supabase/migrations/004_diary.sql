create table if not exists diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  ssw int not null,
  rating int check (rating between 1 and 5),
  word text,
  surprise text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, ssw)
);

alter table diary_entries enable row level security;

create policy "Users manage own diary" on diary_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index idx_diary_user_ssw on diary_entries(user_id, ssw);
