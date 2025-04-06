
-- Create settings table if it doesn't exist
create or replace function create_settings_table()
returns void as $$
begin
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'settings') then
    create table public.settings (
      id uuid default uuid_generate_v4() primary key,
      openai_api_key text,
      webhook_url text,
      evolution_api_key text,
      webhook_evolution_url text,
      theme text not null check (theme in ('dark', 'light')) default 'dark',
      language text not null check (language in ('pt', 'en')) default 'pt',
      enable_notifications boolean not null default false,
      auto_save boolean not null default true,
      user_id uuid references auth.users not null unique,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    );

    -- Create index for faster lookups by user_id
    create index settings_user_id_idx on public.settings(user_id);

    -- Enable RLS
    alter table public.settings enable row level security;

    -- Create RLS policies
    create policy "Users can view their own settings" on public.settings
      for select using (auth.uid() = user_id);
      
    create policy "Users can create their own settings" on public.settings
      for insert with check (auth.uid() = user_id);
      
    create policy "Users can update their own settings" on public.settings
      for update using (auth.uid() = user_id);
      
    create policy "Users can delete their own settings" on public.settings
      for delete using (auth.uid() = user_id);
  end if;
end;
$$ language plpgsql;
