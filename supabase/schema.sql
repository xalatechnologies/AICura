-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Basic profile fields
  name varchar(255),
  age integer,
  gender varchar(50),
  height decimal(5,2),  -- in cm
  weight decimal(5,2),  -- in kg
  
  -- Medical information
  medical_conditions text[],
  allergies text[],
  medications text[],
  blood_type varchar(10),
  last_physical_date date,
  
  -- Emergency contact
  emergency_contact_name varchar(255),
  emergency_contact_phone varchar(50),
  
  -- Preferences and settings
  preferred_language text default 'en',
  theme text DEFAULT 'light',
  onboarding_completed boolean default false,
  
  -- Complex JSON fields
  lifestyle_factors jsonb default '{
    "smoking": false,
    "alcohol": false,
    "exercise_frequency": "none",
    "diet_restrictions": []
  }'::jsonb,
  
  communication_preferences jsonb default '{
    "email_notifications": true,
    "sms_notifications": false,
    "appointment_reminders": true,
    "newsletter": false
  }'::jsonb,

  constraint language_check check (preferred_language in ('en', 'es', 'no', 'ar', 'ps', 'fa-AF', 'ur')),
  CONSTRAINT theme_check CHECK (theme in ('light', 'dark'))
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update their own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create indexes for commonly queried fields
create index idx_profiles_onboarding_completed on profiles(onboarding_completed);
create index idx_profiles_preferred_language on profiles(preferred_language);

-- Create function to handle new user creation
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update updated_at timestamp
create function update_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create trigger for updating timestamp
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_profiles_updated_at(); 