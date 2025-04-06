
-- Create chips table if it doesn't exist
create or replace function create_chips_table()
returns void as $$
begin
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'chips') then
    create table public.chips (
      id uuid default uuid_generate_v4() primary key,
      name text not null,
      phone text not null,
      status text not null check (status in ('active', 'inactive', 'heating')) default 'inactive',
      user_id uuid references auth.users not null,
      created_at timestamp with time zone default now()
    );

    -- Create index for faster lookups by user_id
    create index chips_user_id_idx on public.chips(user_id);

    -- Enable RLS
    alter table public.chips enable row level security;

    -- Create RLS policies
    create policy "Users can view their own chips" on public.chips
      for select using (auth.uid() = user_id);
      
    create policy "Users can create their own chips" on public.chips
      for insert with check (auth.uid() = user_id);
      
    create policy "Users can update their own chips" on public.chips
      for update using (auth.uid() = user_id);
      
    create policy "Users can delete their own chips" on public.chips
      for delete using (auth.uid() = user_id);
  end if;
end;
$$ language plpgsql;
