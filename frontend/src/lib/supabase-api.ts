import { supabase } from './supabase'

export interface Profile {
  id: string
  email?: string
  full_name?: string
  phone?: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

export interface BankAccount {
  id: string
  user_id: string
  template_id: string
  template_name: string
  account_holder: string
  balance: number
  currency: string
  symbol: string
  primary_color: string
  secondary_color: string
  country: string
  country_code: string
  status: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  account_id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  counterparty?: string
  date: string
  status: string
  reference?: string
  created_at: string
}

export interface SavingsGoal {
  id: string
  account_id: string
  name: string
  target: number
  current: number
  color?: string
  created_at: string
  updated_at: string
}

// Auth
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export function onAuthStateChange(callback: (session: any) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
  return subscription
}

// Profile
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data
}

export async function createProfile(userId: string, email: string, fullName: string) {
  const { error } = await supabase
    .from('profiles')
    .insert({ id: userId, email, full_name: fullName })
  if (error) throw error
}

export async function updateProfile(userId: string, data: Partial<Profile>) {
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)
  if (error) throw error
}

// Accounts
export async function getAccounts(userId: string): Promise<BankAccount[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getAccount(accountId: string): Promise<BankAccount | null> {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', accountId)
    .single()
  if (error) return null
  return data
}

export async function createAccount(userId: string, template: any, holderName: string): Promise<BankAccount | null> {
  const { data, error } = await supabase
    .from('accounts')
    .insert({
      user_id: userId,
      template_id: template.id,
      template_name: template.name,
      account_holder: holderName,
      balance: 50000,
      currency: template.currency,
      symbol: template.symbol,
      primary_color: template.primaryColor,
      secondary_color: template.secondaryColor,
      country: template.country,
      country_code: template.countryCode,
      status: 'active'
    })
    .select()
    .single()
  if (error) {
    console.error('Error creating account:', error)
    return null
  }
  return data
}

export async function updateAccountBalance(accountId: string, newBalance: number): Promise<boolean> {
  const { error } = await supabase
    .from('accounts')
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq('id', accountId)
  return !error
}

export async function deleteAccount(accountId: string): Promise<boolean> {
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', accountId)
  return !error
}

// Transactions
export async function getTransactions(accountId: string, filter?: {
  search?: string
  type?: 'all' | 'credit' | 'debit'
  dateFrom?: string
  dateTo?: string
}): Promise<Transaction[]> {
  let query = supabase
    .from('transactions')
    .select('*')
    .eq('account_id', accountId)

  if (filter?.type && filter.type !== 'all') {
    query = query.eq('type', filter.type)
  }
  if (filter?.search) {
    query = query.or(`description.ilike.%${filter.search}%,counterparty.ilike.%${filter.search}%`)
  }
  if (filter?.dateFrom) {
    query = query.gte('date', filter.dateFrom)
  }
  if (filter?.dateTo) {
    query = query.lte('date', filter.dateTo)
  }

  const { data, error } = await query.order('date', { ascending: false })
  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
  return data || []
}

export async function createTransaction(accountId: string, txn: Partial<Transaction>): Promise<Transaction | null> {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      account_id: accountId,
      ...txn,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      reference: `REF${Date.now()}`
    })
    .select()
    .single()
  if (error) {
    console.error('Error creating transaction:', error)
    return null
  }
  return data
}

export async function deleteTransaction(txnId: string): Promise<boolean> {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', txnId)
  return !error
}

// Savings Goals
export async function getSavingsGoals(accountId: string): Promise<SavingsGoal[]> {
  const { data, error } = await supabase
    .from('savings_goals')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('Error fetching savings goals:', error)
    return []
  }
  return data || []
}

export async function createSavingsGoal(accountId: string, name: string, target: number): Promise<SavingsGoal | null> {
  const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4']
  const color = colors[Math.floor(Math.random() * colors.length)]
  const { data, error } = await supabase
    .from('savings_goals')
    .insert({
      account_id: accountId,
      name,
      target,
      current: 0,
      color
    })
    .select()
    .single()
  if (error) {
    console.error('Error creating savings goal:', error)
    return null
  }
  return data
}

export async function updateSavingsGoal(goalId: string, current: number): Promise<boolean> {
  const { error } = await supabase
    .from('savings_goals')
    .update({ current, updated_at: new Date().toISOString() })
    .eq('id', goalId)
  return !error
}

export async function deleteSavingsGoal(goalId: string): Promise<boolean> {
  const { error } = await supabase
    .from('savings_goals')
    .delete()
    .eq('id', goalId)
  return !error
}
