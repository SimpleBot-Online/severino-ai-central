
-- Create profiles table if it doesn't exist
create or replace function create_profiles_table()
returns void as $$
begin
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'profiles') then
    create table public.profiles (
      id uuid references auth.users on delete cascade primary key,
      username text unique,
      avatar_url text,
      first_name text,
      last_name text,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    );

    -- Enable RLS
    alter table public.profiles enable row level security;

    -- Create RLS policies
    create policy "Users can view their own profiles" on public.profiles
      for select using (auth.uid() = id);
      
    create policy "Users can update their own profiles" on public.profiles
      for update using (auth.uid() = id);
      
    -- Create a function to auto-create a profile when a user signs up
    create or replace function public.handle_new_user()
    returns trigger as $$
    begin
      insert into public.profiles (id, username, avatar_url, first_name, last_name)
      values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
      return new;
    end;
    $$ language plpgsql security definer;

    -- Create a trigger to call the function
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  end if;
end;
$$ language plpgsql;
