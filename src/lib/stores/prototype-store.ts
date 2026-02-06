import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// ============================================================================
// Types
// ============================================================================

export type DataScenario = 'demo' | 'empty' | 'stress' | 'custom'

export interface FeatureFlags {
  showDevTools: boolean
  enableAnimations: boolean
  showPlaceholderPages: boolean
  useMockLatency: boolean
  mockLatencyMs: number
  backgroundWarm: boolean
}

interface PrototypeState {
  // Current scenario
  scenario: DataScenario
  
  // Feature flags
  featureFlags: FeatureFlags
  
  // Simulated user
  currentUserId: string
  currentOrgId: string
  
  // Actions
  setScenario: (scenario: DataScenario) => void
  setFeatureFlag: <K extends keyof FeatureFlags>(key: K, value: FeatureFlags[K]) => void
  toggleFeatureFlag: (key: keyof FeatureFlags) => void
  setCurrentUser: (userId: string) => void
  setCurrentOrg: (orgId: string) => void
  resetAll: () => void
}

// ============================================================================
// Defaults
// ============================================================================

const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  showDevTools: true,
  enableAnimations: true,
  showPlaceholderPages: true,
  useMockLatency: false,
  mockLatencyMs: 500,
  backgroundWarm: true,
}

// ============================================================================
// Store
// ============================================================================

export const usePrototypeStore = create<PrototypeState>()(
  persist(
    immer((set) => ({
      scenario: 'demo',
      featureFlags: DEFAULT_FEATURE_FLAGS,
      currentUserId: 'user-001',
      currentOrgId: 'org-001',

      setScenario: (scenario) =>
        set((state) => {
          state.scenario = scenario
        }),

      setFeatureFlag: (key, value) =>
        set((state) => {
          state.featureFlags[key] = value
        }),

      toggleFeatureFlag: (key) =>
        set((state) => {
          const current = state.featureFlags[key]
          if (typeof current === 'boolean') {
            // @ts-expect-error - We know this is a boolean flag
            state.featureFlags[key] = !current
          }
        }),

      setCurrentUser: (userId) =>
        set((state) => {
          state.currentUserId = userId
        }),

      setCurrentOrg: (orgId) =>
        set((state) => {
          state.currentOrgId = orgId
        }),

      resetAll: () =>
        set((state) => {
          state.scenario = 'demo'
          state.featureFlags = DEFAULT_FEATURE_FLAGS
          state.currentUserId = 'user-001'
          state.currentOrgId = 'org-001'
        }),
    })),
    { name: 'prototype-store' }
  )
)

// ============================================================================
// Helpers
// ============================================================================

/**
 * Utility to add mock latency for more realistic prototype behavior
 */
export async function withMockLatency<T>(fn: () => T | Promise<T>): Promise<T> {
  const { featureFlags } = usePrototypeStore.getState()
  
  if (featureFlags.useMockLatency) {
    await new Promise((resolve) => setTimeout(resolve, featureFlags.mockLatencyMs))
  }
  
  return fn()
}
