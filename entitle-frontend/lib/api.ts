import type { CivicProfile, Entitlement, UnclaimedAsset, ChatMessage, Notification, ProfileSummary, Scheme } from './types'

// Normalize: strip trailing slash, then ensure /api is always present
function normalizeBase(url: string): string {
  const stripped = url.replace(/\/+$/, '')
  if (stripped.endsWith('/api')) return stripped
  return `${stripped}/api`
}
const BASE = normalizeBase(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api')

// Convert camelCase profile fields to snake_case for Django backend
function toSnakeProfile(data: Partial<CivicProfile>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  const map: Record<string, string> = {
    casteCategory: 'caste_category',
    annualIncome: 'annual_income',
    landHolding: 'land_holding',
    familySize: 'family_size',
    bplCard: 'bpl_card',
    aadhaarLinked: 'aadhaar_linked',
    panLinked: 'pan_linked',
    familyMembers: 'family_members',
    lastScanned: 'last_scanned',
  }
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) out[map[k] ?? k] = v
  }
  return out
}

// Convert snake_case profile response to camelCase
function fromSnakeProfile(data: Record<string, unknown>): CivicProfile {
  return {
    id: data.id as string,
    name: data.name as string,
    age: data.age as number,
    state: data.state as string,
    district: data.district as string,
    casteCategory: (data.caste_category ?? data.casteCategory) as CivicProfile['casteCategory'],
    annualIncome: (data.annual_income ?? data.annualIncome) as number,
    occupation: data.occupation as CivicProfile['occupation'],
    landHolding: (data.land_holding ?? data.landHolding) as number | undefined,
    familySize: (data.family_size ?? data.familySize) as number,
    bplCard: (data.bpl_card ?? data.bplCard) as boolean,
    aadhaarLinked: (data.aadhaar_linked ?? data.aadhaarLinked) as boolean,
    panLinked: (data.pan_linked ?? data.panLinked) as boolean,
    familyMembers: ((data.family_members ?? data.familyMembers) as CivicProfile['familyMembers']) || [],
    lastScanned: (data.last_scanned ?? data.lastScanned) as string | undefined,
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('entitle_token')
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  }
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const error = await res.text()
    throw new Error(`API ${res.status}: ${error}`)
  }
  if (res.status === 204) return {} as T
  
  const data = await res.json()
  // Automatically unwrap Django REST Framework paginated responses
  if (data && typeof data === 'object' && !Array.isArray(data) && 'results' in data && 'count' in data) {
    return data.results as T
  }
  return data as T
}

export const api = {
  // Auth
  register: (data: { username: string; email: string; password: string; first_name: string; last_name: string }) =>
    request<{ access: string; refresh: string; user: { id: string; username: string } }>('/auth/register/', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { username: string; password: string }) =>
    request<{ access: string; refresh: string }>('/auth/login/', { method: 'POST', body: JSON.stringify(data) }),

  me: () => request<{ id: string; username: string; email: string }>('/auth/me/'),

  // Profiles
  createProfile: async (data: Partial<CivicProfile>): Promise<CivicProfile> => {
    const raw = await request<Record<string, unknown>>('/profiles/', { method: 'POST', body: JSON.stringify(toSnakeProfile(data)) })
    return fromSnakeProfile(raw)
  },

  getProfile: async (id: string): Promise<CivicProfile> => {
    const raw = await request<Record<string, unknown>>(`/profiles/${id}/`)
    return fromSnakeProfile(raw)
  },

  updateProfile: async (id: string, data: Partial<CivicProfile>): Promise<CivicProfile> => {
    const raw = await request<Record<string, unknown>>(`/profiles/${id}/`, { method: 'PATCH', body: JSON.stringify(toSnakeProfile(data)) })
    return fromSnakeProfile(raw)
  },

  scanEntitlements: (profileId: string) =>
    request<Entitlement[]>(`/profiles/${profileId}/scan/`, { method: 'POST' }),

  getProfileSummary: (profileId: string) =>
    request<ProfileSummary>(`/profiles/${profileId}/summary/`),

  // Schemes
  getSchemes: () => request<Scheme[]>('/schemes/'),
  getScheme: (id: string) => request<Scheme>(`/schemes/${id}/`),

  // Entitlements
  getEntitlements: (profileId: string) =>
    request<Entitlement[]>(`/entitlements/?profile=${profileId}`),

  applyForScheme: (entitlementId: string) =>
    request<{ ref: string; status: string }>(`/entitlements/${entitlementId}/apply/`, { method: 'POST' }),

  updateEntitlement: (id: string, data: Partial<Entitlement>) =>
    request<Entitlement>(`/entitlements/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Assets
  getUnclaimedAssets: (profileId: string) =>
    request<UnclaimedAsset[]>(`/assets/?profile=${profileId}`),

  claimAsset: (assetId: string) =>
    request<{ claimInstructions: string }>(`/assets/${assetId}/claim/`, { method: 'POST' }),

  // Chat
  sendChatMessage: (profileId: string, message: string, msgCount: number = 0) =>
    request<ChatMessage>('/chat/message/', { method: 'POST', body: JSON.stringify({ profile_id: profileId, message, msg_count: msgCount }) }),

  getChatHistory: (profileId: string) =>
    request<ChatMessage[]>(`/chat/history/?profile=${profileId}`),

  // Notifications
  getNotifications: (profileId: string) =>
    request<Notification[]>(`/notifications/?profile=${profileId}`),
}
