
-- Create tasks table if it doesn't exist
create or replace function create_tasks_table()
returns void as $$
begin
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'tasks') then
    create table public.tasks (
      id uuid default uuid_generate_v4() primary key,
      title text not null,
      description text,
      due_date timestamp with time zone,
      status text not null check (status in ('pending', 'in-progress', 'completed')) default 'pending',
      user_id uuid references auth.users not null,
      created_at timestamp with time zone default now()
    );

    -- Create index for faster lookups by user_id
    create index tasks_user_id_idx on public.tasks(user_id);

    -- Enable RLS
    alter table public.tasks enable row level security;

    -- Create RLS policies
    create policy "Users can view their own tasks" on public.tasks
      for select using (auth.uid() = user_id);
      
    create policy "Users can create their own tasks" on public.tasks
      for insert with check (auth.uid() = user_id);
      
    create policy "Users can update their own tasks" on public.tasks
      for update using (auth.uid() = user_id);
      
    create policy "Users can delete their own tasks" on public.tasks
      for delete using (auth.uid() = user_id);
  end if;
end;
$$ language plpgsql;
