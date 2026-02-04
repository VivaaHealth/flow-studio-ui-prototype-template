import { faker } from '@faker-js/faker'
import type { Flow, FlowStatus } from '@/lib/types/entities'
import { FLOW_STATUSES } from '@/lib/types/entities'

export interface CreateFlowOptions {
  agentId?: string
  organizationId?: string
  status?: FlowStatus
  createdById?: string
}

/**
 * Generate a single realistic flow
 */
export function createFlow(overrides?: Partial<Flow>): Flow {
  const createdAt = faker.date.past({ years: 2 }).toISOString()
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() }).toISOString()
  const hasRuns = faker.datatype.boolean({ probability: 0.7 })
  const flowRuns = hasRuns ? faker.number.int({ min: 1, max: 5000 }) : 0
  
  return {
    id: `flow-${faker.string.uuid().slice(0, 8)}`,
    name: generateFlowName(),
    description: faker.datatype.boolean({ probability: 0.6 }) 
      ? faker.lorem.sentence() 
      : undefined,
    agentId: `agent-${faker.string.uuid().slice(0, 8)}`,
    organizationId: `org-${faker.string.uuid().slice(0, 8)}`,
    status: faker.helpers.arrayElement(FLOW_STATUSES),
    createdById: `user-${faker.string.uuid().slice(0, 8)}`,
    flowRuns,
    value: flowRuns > 100 ? faker.number.int({ min: 0, max: 500 }) : 0,
    lastRunAt: hasRuns ? updatedAt : undefined,
    createdAt,
    updatedAt,
    ...overrides,
  }
}

/**
 * Generate multiple flows
 */
export function createFlows(count: number, options?: CreateFlowOptions): Flow[] {
  return Array.from({ length: count }, () => createFlow(options))
}

/**
 * Generate flows for an agent
 */
export function createFlowsForAgent(
  agentId: string,
  organizationId: string,
  count: number = faker.number.int({ min: 1, max: 5 })
): Flow[] {
  return Array.from({ length: count }, () => 
    createFlow({ agentId, organizationId })
  )
}

// ============================================================================
// Helper Functions
// ============================================================================

function generateFlowName(): string {
  const templates = [
    () => `${faker.company.buzzNoun()} ${faker.helpers.arrayElement(['Flow', 'Process', 'Automation'])}`,
    () => `${faker.helpers.arrayElement(['Patient', 'Provider', 'Claim', 'Auth', 'Care'])} ${faker.helpers.arrayElement(['Intake', 'Review', 'Processing', 'Validation', 'Outreach'])}`,
    () => `${faker.word.adjective()} ${faker.word.noun()} Flow`,
    () => `${faker.helpers.arrayElement(['Daily', 'Weekly', 'Automated', 'Manual'])} ${faker.helpers.arrayElement(['Billing', 'Authorization', 'Referral', 'Quality'])} ${faker.helpers.arrayElement(['Check', 'Review', 'Process'])}`,
  ]
  
  const template = faker.helpers.arrayElement(templates)
  return template().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}
