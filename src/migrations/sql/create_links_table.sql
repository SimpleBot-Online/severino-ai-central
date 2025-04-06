
-- Create links table if it doesn't exist
create or replace function create_links_table()
returns void as $$
begin
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'links') then
    create table public.links (
      id uuid default uuid_generate_v4() primary key,
      title text not null,
      url text not null,
      description text,
      category text,
      user_id uuid references auth.users not null,
      created_at timestamp with time zone default now()
    );

    -- Create index for faster lookups by user_id
    create index links_user_id_idx on public.links(user_id);

    -- Enable RLS
    alter table public.links enable row level security;

    -- Create RLS policies
    create policy "Users can view their own links" on public.links
      for select using (auth.uid() = user_id);
      
    create policy "Users can create their own links" on public.links
      for insert with check (auth.uid() = user_id);
      
    create policy "Users can update their own links" on public.links
      for update using (auth.uid() = user_id);
      
    create policy "Users can delete their own links" on public.links
      for delete using (auth.uid() = user_id);
  end if;
end;
$$ language plpgsql;
