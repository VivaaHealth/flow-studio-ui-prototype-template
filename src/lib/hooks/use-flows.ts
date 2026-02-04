import { useMemo, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, applyMutations, type FlowMutation } from '@/lib/db'
import { flowFixtures } from '@/lib/mock-data/fixtures'
import type { Flow, FlowStatus } from '@/lib/types/entities'

export interface UseFlowsOptions {
  agentId?: string
  organizationId?: string
  status?: FlowStatus
}

export interface UseFlowsReturn {
  flows: Flow[]
  isLoading: boolean
  createFlow: (data: Omit<Flow, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>
  updateFlow: (id: string, data: Partial<Flow>) => Promise<void>
  deleteFlow: (id: string) => Promise<void>
}

/**
 * Hook for working with flows data
 * Merges fixtures with IndexedDB mutations for a persistent prototype experience
 */
export function useFlows(options: UseFlowsOptions = {}): UseFlowsReturn {
  const { agentId, organizationId, status } = options

  // Get mutations from IndexedDB
  const mutations = useLiveQuery(() => db.flowMutations.toArray(), [])
  const isLoading = mutations === undefined

  // Compute flows by merging fixtures with mutations
  const flows = useMemo(() => {
    if (!mutations) return []

    // Start with fixtures
    const baseFlows = flowFixtures

    // Apply mutations
    const mergedFlows = applyMutations(baseFlows, mutations as FlowMutation[])

    // Apply filters
    let filtered = mergedFlows
    
    if (agentId) {
      filtered = filtered.filter((f) => f.agentId === agentId)
    }
    if (organizationId) {
      filtered = filtered.filter((f) => f.organizationId === organizationId)
    }
    if (status) {
      filtered = filtered.filter((f) => f.status === status)
    }

    // Sort by updatedAt descending
    return filtered.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }, [mutations, agentId, organizationId, status])

  // Create a new flow
  const createFlow = useCallback(
    async (data: Omit<Flow, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
      const id = `flow-${crypto.randomUUID().slice(0, 8)}`
      const now = new Date().toISOString()

      await db.flowMutations.add({
        id,
        operation: 'create',
        data: {
          ...data,
          id,
          createdAt: now,
          updatedAt: now,
        },
        timestamp: Date.now(),
      })

      return id
    },
    []
  )

  // Update an existing flow
  const updateFlow = useCallback(
    async (id: string, data: Partial<Flow>): Promise<void> => {
      await db.flowMutations.put({
        id,
        operation: 'update',
        data: {
          ...data,
          updatedAt: new Date().toISOString(),
        },
        timestamp: Date.now(),
      })
    },
    []
  )

  // Delete a flow
  const deleteFlow = useCallback(async (id: string): Promise<void> => {
    await db.flowMutations.put({
      id,
      operation: 'delete',
      data: {},
      timestamp: Date.now(),
    })
  }, [])

  return {
    flows,
    isLoading,
    createFlow,
    updateFlow,
    deleteFlow,
  }
}

/**
 * Hook for getting a single flow by ID
 */
export function useFlow(id: string | undefined) {
  const { flows, isLoading, updateFlow, deleteFlow } = useFlows()

  const flow = useMemo(() => {
    if (!id) return undefined
    return flows.find((f) => f.id === id)
  }, [flows, id])

  return {
    flow,
    isLoading,
    updateFlow: (data: Partial<Flow>) => id ? updateFlow(id, data) : Promise.resolve(),
    deleteFlow: () => id ? deleteFlow(id) : Promise.resolve(),
  }
}
