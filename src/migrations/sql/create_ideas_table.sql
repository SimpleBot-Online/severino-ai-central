
-- Create ideas table if it doesn't exist
create or replace function create_ideas_table()
returns void as $$
begin
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'ideas') then
    create table public.ideas (
      id uuid default uuid_generate_v4() primary key,
      title text not null,
      description text,
      category text,
      user_id uuid references auth.users not null,
      created_at timestamp with time zone default now()
    );

    -- Create index for faster lookups by user_id
    create index ideas_user_id_idx on public.ideas(user_id);

    -- Enable RLS
    alter table public.ideas enable row level security;

    -- Create RLS policies
    create policy "Users can view their own ideas" on public.ideas
      for select using (auth.uid() = user_id);
      
    create policy "Users can create their own ideas" on public.ideas
      for insert with check (auth.uid() = user_id);
      
    create policy "Users can update their own ideas" on public.ideas
      for update using (auth.uid() = user_id);
      
    create policy "Users can delete their own ideas" on public.ideas
      for delete using (auth.uid() = user_id);
  end if;
end;
$$ language plpgsql;
