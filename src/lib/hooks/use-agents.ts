import { useMemo, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, applyMutations, type AgentMutation } from '@/lib/db'
import { agentFixtures } from '@/lib/mock-data/fixtures'
import { flowFixtures } from '@/lib/mock-data/fixtures'
import { organizationFixtures } from '@/lib/mock-data/fixtures'
import type { Agent, AgentCategory, AgentWithFlows, Flow } from '@/lib/types/entities'

export interface UseAgentsOptions {
  organizationId?: string
  category?: AgentCategory
  status?: 'active' | 'inactive'
}

export interface UseAgentsReturn {
  agents: Agent[]
  agentsWithFlows: AgentWithFlows[]
  isLoading: boolean
  createAgent: (data: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>
  updateAgent: (id: string, data: Partial<Agent>) => Promise<void>
  deleteAgent: (id: string) => Promise<void>
}

/**
 * Hook for working with agents data
 */
export function useAgents(options: UseAgentsOptions = {}): UseAgentsReturn {
  const { organizationId, category, status } = options

  // Get mutations from IndexedDB
  const agentMutations = useLiveQuery(() => db.agentMutations.toArray(), [])
  const flowMutations = useLiveQuery(() => db.flowMutations.toArray(), [])
  const isLoading = agentMutations === undefined || flowMutations === undefined

  // Compute agents by merging fixtures with mutations
  const agents = useMemo(() => {
    if (!agentMutations) return []

    const mergedAgents = applyMutations(agentFixtures, agentMutations as AgentMutation[])

    let filtered = mergedAgents

    if (organizationId) {
      filtered = filtered.filter((a) => a.organizationId === organizationId)
    }
    if (category) {
      filtered = filtered.filter((a) => a.category === category)
    }
    if (status) {
      filtered = filtered.filter((a) => a.status === status)
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name))
  }, [agentMutations, organizationId, category, status])

  // Compute agents with their flows and organization
  const agentsWithFlows = useMemo(() => {
    if (!flowMutations || !agentMutations) return []

    const mergedFlows = applyMutations(flowFixtures, flowMutations as any[])
    const flowsByAgent = new Map<string, Flow[]>()
    
    for (const flow of mergedFlows) {
      const existing = flowsByAgent.get(flow.agentId) ?? []
      flowsByAgent.set(flow.agentId, [...existing, flow])
    }

    const orgMap = new Map(organizationFixtures.map((o) => [o.id, o]))

    return agents.map((agent) => ({
      ...agent,
      organization: orgMap.get(agent.organizationId) ?? {
        id: agent.organizationId,
        name: 'Unknown Organization',
        slug: 'unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      flows: flowsByAgent.get(agent.id) ?? [],
    }))
  }, [agents, flowMutations, agentMutations])

  // Create a new agent
  const createAgent = useCallback(
    async (data: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
      const id = `agent-${crypto.randomUUID().slice(0, 8)}`
      const now = new Date().toISOString()

      await db.agentMutations.add({
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

  // Update an existing agent
  const updateAgent = useCallback(
    async (id: string, data: Partial<Agent>): Promise<void> => {
      await db.agentMutations.put({
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

  // Delete an agent
  const deleteAgent = useCallback(async (id: string): Promise<void> => {
    await db.agentMutations.put({
      id,
      operation: 'delete',
      data: {},
      timestamp: Date.now(),
    })
  }, [])

  return {
    agents,
    agentsWithFlows,
    isLoading,
    createAgent,
    updateAgent,
    deleteAgent,
  }
}

/**
 * Hook for getting a single agent by ID
 */
export function useAgent(id: string | undefined) {
  const { agents, agentsWithFlows, isLoading, updateAgent, deleteAgent } = useAgents()

  const agent = useMemo(() => {
    if (!id) return undefined
    return agents.find((a) => a.id === id)
  }, [agents, id])

  const agentWithFlows = useMemo(() => {
    if (!id) return undefined
    return agentsWithFlows.find((a) => a.id === id)
  }, [agentsWithFlows, id])

  return {
    agent,
    agentWithFlows,
    isLoading,
    updateAgent: (data: Partial<Agent>) => (id ? updateAgent(id, data) : Promise.resolve()),
    deleteAgent: () => (id ? deleteAgent(id) : Promise.resolve()),
  }
}
