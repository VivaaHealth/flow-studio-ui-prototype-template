/**
 * Core domain entities for the prototype
 * These mirror the real product's data structures
 */

// ============================================================================
// Enums & Constants
// ============================================================================

export const AGENT_CATEGORIES = [
  'rcm',
  'authorization',
  'callCenter',
  'chartScrubbing',
  'clinicalTrials',
  'frontDesk',
  'inpatientCare',
  'medicationAdherence',
  'patient',
  'patientCare',
  'quality',
  'referrals',
  'placeholder',
] as const

export type AgentCategory = (typeof AGENT_CATEGORIES)[number]

export const FLOW_STATUSES = ['draft', 'review', 'published', 'archived'] as const
export type FlowStatus = (typeof FLOW_STATUSES)[number]

// ============================================================================
// Core Entities
// ============================================================================

export interface Organization {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  role: 'admin' | 'editor' | 'viewer'
  organizationId: string
  createdAt: string
}

export interface Agent {
  id: string
  name: string
  description?: string
  category: AgentCategory
  organizationId: string
  status: 'active' | 'inactive'
  flowCount: number
  totalRuns: number
  totalValue: number
  lastRunAt?: string
  createdAt: string
  updatedAt: string
}

export interface Flow {
  id: string
  name: string
  description?: string
  agentId: string
  organizationId: string
  status: FlowStatus
  createdById: string
  flowRuns: number
  value: number
  lastRunAt?: string
  createdAt: string
  updatedAt: string
}

export interface FlowRun {
  id: string
  flowId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startedAt: string
  completedAt?: string
  value?: number
  error?: string
}

// ============================================================================
// View Models (for UI display)
// ============================================================================

export interface AgentWithFlows extends Agent {
  organization: Organization
  flows: Flow[]
}

export interface FlowWithDetails extends Flow {
  agent: Agent
  organization: Organization
  createdBy: User
}

// ============================================================================
// Category Styling
// ============================================================================

export const CATEGORY_COLORS: Record<AgentCategory, { dark: string; light: string }> = {
  rcm: { dark: '#1e40af', light: '#3b82f6' },
  authorization: { dark: '#7c3aed', light: '#a78bfa' },
  callCenter: { dark: '#0891b2', light: '#22d3d8' },
  chartScrubbing: { dark: '#059669', light: '#34d399' },
  clinicalTrials: { dark: '#d97706', light: '#fbbf24' },
  frontDesk: { dark: '#dc2626', light: '#f87171' },
  inpatientCare: { dark: '#9333ea', light: '#c084fc' },
  medicationAdherence: { dark: '#be185d', light: '#f472b6' },
  patient: { dark: '#0d9488', light: '#2dd4bf' },
  patientCare: { dark: '#4f46e5', light: '#818cf8' },
  quality: { dark: '#65a30d', light: '#a3e635' },
  referrals: { dark: '#ea580c', light: '#fb923c' },
  placeholder: { dark: '#374151', light: '#6b7280' },
}

export const CATEGORY_LABELS: Record<AgentCategory, string> = {
  rcm: 'Revenue Cycle',
  authorization: 'Authorization',
  callCenter: 'Call Center',
  chartScrubbing: 'Chart Review',
  clinicalTrials: 'Clinical Trials',
  frontDesk: 'Front Desk',
  inpatientCare: 'Inpatient Care',
  medicationAdherence: 'Medication',
  patient: 'Patient',
  patientCare: 'Patient Care',
  quality: 'Quality',
  referrals: 'Referrals',
  placeholder: 'Other',
}
