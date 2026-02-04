import Dexie, { type Table } from 'dexie'
import type { Flow, Agent, Organization, User, FlowRun } from '@/lib/types/entities'

// ============================================================================
// Mutation Types (for tracking changes to fixtures)
// ============================================================================

export interface EntityMutation<T> {
  id: string
  operation: 'create' | 'update' | 'delete'
  data: Partial<T>
  timestamp: number
}

export type FlowMutation = EntityMutation<Flow>
export type AgentMutation = EntityMutation<Agent>
export type OrganizationMutation = EntityMutation<Organization>
export type UserMutation = EntityMutation<User>

// ============================================================================
// Database Class
// ============================================================================

export class PrototypeDB extends Dexie {
  // Mutation tables (changes to fixtures)
  flowMutations!: Table<FlowMutation>
  agentMutations!: Table<AgentMutation>
  organizationMutations!: Table<OrganizationMutation>
  userMutations!: Table<UserMutation>
  
  // Direct storage tables (for generated/runtime data)
  flowRuns!: Table<FlowRun>

  constructor() {
    super('flow-studio-prototype')
    
    this.version(1).stores({
      flowMutations: 'id, operation, timestamp',
      agentMutations: 'id, operation, timestamp',
      organizationMutations: 'id, operation, timestamp',
      userMutations: 'id, operation, timestamp',
      flowRuns: 'id, flowId, status, startedAt',
    })
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const db = new PrototypeDB()

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Clear all data from the database (full reset)
 */
export async function clearDatabase(): Promise<void> {
  await db.flowMutations.clear()
  await db.agentMutations.clear()
  await db.organizationMutations.clear()
  await db.userMutations.clear()
  await db.flowRuns.clear()
}

/**
 * Export all mutations for debugging/backup
 */
export async function exportMutations() {
  return {
    flows: await db.flowMutations.toArray(),
    agents: await db.agentMutations.toArray(),
    organizations: await db.organizationMutations.toArray(),
    users: await db.userMutations.toArray(),
    flowRuns: await db.flowRuns.toArray(),
  }
}

/**
 * Generic mutation applier - merges fixtures with mutations
 */
export function applyMutations<T extends { id: string }>(
  fixtures: T[],
  mutations: EntityMutation<T>[]
): T[] {
  const mutationMap = new Map(mutations.map((m) => [m.id, m]))
  const result: T[] = []

  // Process existing fixtures
  for (const fixture of fixtures) {
    const mutation = mutationMap.get(fixture.id)
    if (mutation?.operation === 'delete') continue
    if (mutation?.operation === 'update') {
      result.push({ ...fixture, ...mutation.data } as T)
    } else {
      result.push(fixture)
    }
    mutationMap.delete(fixture.id)
  }

  // Add created items
  for (const mutation of mutationMap.values()) {
    if (mutation.operation === 'create' && mutation.data) {
      result.push(mutation.data as T)
    }
  }

  return result
}
