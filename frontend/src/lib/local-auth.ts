export interface User {
  email: string
  fullName: string
  password: string
  createdAt: string
}

export interface OtpRecord {
  email: string
  code: string
  expiresAt: number
  used: boolean
}

const USERS_KEY = 'multiBank_users'
const OTPS_KEY = 'multiBank_otps'

function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getOtps(): OtpRecord[] {
  try {
    return JSON.parse(localStorage.getItem(OTPS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveOtps(otps: OtpRecord[]) {
  localStorage.setItem(OTPS_KEY, JSON.stringify(otps))
}

function cleanOtps() {
  const now = Date.now()
  const all = getOtps()
  const valid = all.filter(o => o.expiresAt > now)
  if (valid.length !== all.length) {
    saveOtps(valid)
  }
  return valid
}

export function signUp(email: string, password: string, fullName: string): { user: User; created: boolean } {
  const users = getUsers()
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (existing) {
    throw new Error('An account with this email already exists')
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }

  const user: User = {
    email: email.toLowerCase(),
    password,
    fullName,
    createdAt: new Date().toISOString(),
  }

  saveUsers([...users, user])

  return { user, created: true }
}

export function signIn(email: string, password: string): User | null {
  const users = getUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) {
    return null
  }
  if (user.password !== password) {
    return null
  }
  return { ...user, password: '***' } as User
}

export function resetPassword(email: string, newPassword: string): boolean {
  const users = getUsers()
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase())
  if (idx === -1) return false
  if (newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }
  users[idx].password = newPassword
  saveUsers(users)
  return true
}

export function generateOtp(email: string): string {
  const otpls = getOtps()
  // Clean expired
  const now = Date.now()
  const valid = otpls.filter(o => o.expiresAt > now)

  // Check if there's already a valid OTP for this email (within 5 minutes)
  const existing = valid.find(o => o.email.toLowerCase() === email.toLowerCase() && !o.used)
  if (existing && existing.expiresAt > now + 60000) {
    return existing.code
  }

  // Generate new 6-digit code
  const code = String(Math.floor(100000 + Math.random() * 900000))
  const otpRecord: OtpRecord = {
    email: email.toLowerCase(),
    code,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    used: false,
  }
  saveOtps([...valid, otpRecord])
  return code
}

export function verifyOtp(email: string, code: string): boolean {
  const otpls = cleanOtps()
  const otp = otpls.find(o =>
    o.email.toLowerCase() === email.toLowerCase() &&
    o.code === code &&
    !o.used &&
    o.expiresAt > Date.now()
  )
  if (!otp) return false
  // Mark as used
  otp.used = true
  const updated = otpls.map(o => o === otp ? otp : o)
  saveOtps(updated)
  return true
}

export function getSession(): { email: string; fullName: string } | null {
  const sessionStr = localStorage.getItem('multiBank_session')
  if (!sessionStr) return null
  try {
    return JSON.parse(sessionStr)
  } catch {
    return null
  }
}

export function setSession(email: string, fullName: string) {
  localStorage.setItem('multiBank_session', JSON.stringify({ email, fullName }))
}

export function clearSession() {
  localStorage.removeItem('multiBank_session')
}

export function isLoggedIn(): boolean {
  return getSession() !== null
}
