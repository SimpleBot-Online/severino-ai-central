
-- Create prompts table if it doesn't exist
create or replace function create_prompts_table()
returns void as $$
begin
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'prompts') then
    create table public.prompts (
      id uuid default uuid_generate_v4() primary key,
      title text not null,
      content text not null,
      category text,
      user_id uuid references auth.users not null,
      created_at timestamp with time zone default now()
    );

    -- Create index for faster lookups by user_id
    create index prompts_user_id_idx on public.prompts(user_id);

    -- Enable RLS
    alter table public.prompts enable row level security;

    -- Create RLS policies
    create policy "Users can view their own prompts" on public.prompts
      for select using (auth.uid() = user_id);
      
    create policy "Users can create their own prompts" on public.prompts
      for insert with check (auth.uid() = user_id);
      
    create policy "Users can update their own prompts" on public.prompts
      for update using (auth.uid() = user_id);
      
    create policy "Users can delete their own prompts" on public.prompts
      for delete using (auth.uid() = user_id);
  end if;
end;
$$ language plpgsql;
