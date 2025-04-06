
-- Create notes table if it doesn't exist
create or replace function create_notes_table()
returns void as $$
begin
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'notes') then
    create table public.notes (
      id uuid default uuid_generate_v4() primary key,
      title text not null,
      content text,
      user_id uuid references auth.users not null,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    );

    -- Create index for faster lookups by user_id
    create index notes_user_id_idx on public.notes(user_id);

    -- Enable RLS
    alter table public.notes enable row level security;

    -- Create RLS policies
    create policy "Users can view their own notes" on public.notes
      for select using (auth.uid() = user_id);
      
    create policy "Users can create their own notes" on public.notes
      for insert with check (auth.uid() = user_id);
      
    create policy "Users can update their own notes" on public.notes
      for update using (auth.uid() = user_id);
      
    create policy "Users can delete their own notes" on public.notes
      for delete using (auth.uid() = user_id);
  end if;
end;
$$ language plpgsql;
