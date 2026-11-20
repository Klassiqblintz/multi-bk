-- Create tables for multi-banking app
-- Run this in Supabase SQL Editor

-- Users table (extends Supabase Auth)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Bank accounts table
create table accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  template_id text not null,
  template_name text not null,
  account_holder text not null,
  balance decimal(15,2) default 0,
  currency text default 'USD',
  symbol text default '$',
  primary_color text,
  secondary_color text,
  country text,
  country_code text,
  status text default 'active',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Transactions table
create table transactions (
  id uuid default gen_random_uuid() primary key,
  account_id uuid references accounts on delete cascade not null,
  type text not null, -- 'credit' or 'debit'
  amount decimal(15,2) not null,
  description text not null,
  counterparty text,
  date date not null,
  status text default 'completed',
  reference text,
  created_at timestamp with time zone default now()
);

-- Savings goals table
create table savings_goals (
  id uuid default gen_random_uuid() primary key,
  account_id uuid references accounts on delete cascade not null,
  name text not null,
  target decimal(15,2) not null,
  current decimal(15,2) default 0,
  color text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table accounts enable row level security;
alter table transactions enable row level security;
alter table savings_goals enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Accounts policies
create policy "Users can view own accounts"
  on accounts for select
  using (auth.uid() = user_id);

create policy "Users can insert own accounts"
  on accounts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own accounts"
  on accounts for update
  using (auth.uid() = user_id);

create policy "Users can delete own accounts"
  on accounts for delete
  using (auth.uid() = user_id);

-- Transactions policies
create policy "Users can view own transactions"
  on transactions for select
  using (
    auth.uid() = (select user_id from accounts where accounts.id = transactions.account_id)
  );

create policy "Users can insert own transactions"
  on transactions for insert
  with check (
    auth.uid() = (select user_id from accounts where accounts.id = account_id)
  );

create policy "Users can update own transactions"
  on transactions for update
  using (
    auth.uid() = (select user_id from accounts where accounts.id = transactions.account_id)
  );

-- Savings goals policies
create policy "Users can view own goals"
  on savings_goals for select
  using (
    auth.uid() = (select user_id from accounts where accounts.id = account_id)
  );

create policy "Users can insert own goals"
  on savings_goals for insert
  with check (
    auth.uid() = (select user_id from accounts where accounts.id = account_id)
  );

create policy "Users can update own goals"
  on savings_goals for update
  using (
    auth.uid() = (select user_id from accounts where accounts.id = account_id)
  );

-- Enable insert for profiles on signup
create policy "Enable insert for authenticated users"
  on profiles for insert
  with check (auth.uid() = id);
