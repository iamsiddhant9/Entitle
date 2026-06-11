export type CasteCategory = 'general' | 'obc' | 'sc' | 'st' | 'ews' | 'nt_dnt'
export type Occupation = 'farmer' | 'labourer' | 'skilled_trade' | 'small_business' | 'salaried' | 'unemployed' | 'other'
export type SchemeCategory = 'agriculture' | 'health' | 'education' | 'housing' | 'pension' | 'welfare'
export type EntitlementStatus = 'eligible' | 'applied' | 'submitted' | 'approved' | 'rejected' | 'needs_docs'
export type AssetType = 'bank_account' | 'insurance' | 'dividend' | 'pension'
export type AssetSource = 'RBI' | 'IRDAI' | 'SEBI'

export interface FamilyMember {
  id?: string
  name: string
  age: number
  relation: string
  occupation?: string
}

export interface CivicProfile {
  id: string
  name: string
  age: number
  state: string
  district: string
  casteCategory: CasteCategory
  annualIncome: number
  occupation: Occupation
  landHolding?: number
  familySize: number
  bplCard: boolean
  aadhaarLinked: boolean
  panLinked: boolean
  familyMembers: FamilyMember[]
  lastScanned?: string
}

export interface Scheme {
  id: string
  name: string
  category: SchemeCategory
  annualBenefit: number
  department: string
  level: 'central' | 'state' | 'local'
  state?: string
  eligibilitySummary: string
  documentsRequired: string[]
  portalUrl?: string
}

export interface Entitlement {
  id: string
  scheme: Scheme
  confidence: number
  status: EntitlementStatus
  applicationRef?: string
  appliedAt?: string
  missingDocuments?: string[]
  annualAmount: number
}

export interface UnclaimedAsset {
  id: string
  type: AssetType
  institution: string
  amount: number
  source: AssetSource
  reference: string
  claimInstructions?: string
  isClaimed: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'agent'
  content: string
  timestamp: string
  type: 'text' | 'result_card' | 'typing'
  resultData?: {
    totalAmount: number
    schemeCount: number
    assetCount: number
    entitlements: Array<{
      id: string
      schemeName: string
      annualAmount: number
      confidence: number
      status: EntitlementStatus
      category: SchemeCategory
    }>
    unclaimedAssets: Array<{
      id: string
      institution: string
      amount: number
      source: AssetSource
      assetType: AssetType
    }>
  }
}

export interface Notification {
  id: string
  title: string
  body: string
  notificationType: string
  isRead: boolean
  createdAt: string
}

export interface ProfileSummary {
  totalAnnualAmount: number
  schemeCount: number
  assetCount: number
  assetTotal: number
  lastScanned?: string
}
