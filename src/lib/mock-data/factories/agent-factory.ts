import { faker } from '@faker-js/faker'
import type { Agent, AgentCategory } from '@/lib/types/entities'
import { AGENT_CATEGORIES } from '@/lib/types/entities'

export interface CreateAgentOptions {
  organizationId?: string
  category?: AgentCategory
}

/**
 * Generate a single realistic agent
 */
export function createAgent(overrides?: Partial<Agent>): Agent {
  const category = overrides?.category ?? faker.helpers.arrayElement(AGENT_CATEGORIES)
  const createdAt = faker.date.past({ years: 2 }).toISOString()
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() }).toISOString()
  const flowCount = faker.number.int({ min: 0, max: 10 })
  const hasRuns = flowCount > 0 && faker.datatype.boolean({ probability: 0.8 })
  
  return {
    id: `agent-${faker.string.uuid().slice(0, 8)}`,
    name: generateAgentName(category),
    description: faker.datatype.boolean({ probability: 0.7 })
      ? faker.lorem.sentence()
      : undefined,
    category,
    organizationId: `org-${faker.string.uuid().slice(0, 8)}`,
    status: faker.helpers.weightedArrayElement([
      { value: 'active' as const, weight: 80 },
      { value: 'inactive' as const, weight: 20 },
    ]),
    flowCount,
    totalRuns: hasRuns ? faker.number.int({ min: 1, max: 10000 }) : 0,
    totalValue: hasRuns && faker.datatype.boolean({ probability: 0.3 })
      ? faker.number.int({ min: 10, max: 1000 })
      : 0,
    lastRunAt: hasRuns ? updatedAt : undefined,
    createdAt,
    updatedAt,
    ...overrides,
  }
}

/**
 * Generate multiple agents
 */
export function createAgents(count: number, options?: CreateAgentOptions): Agent[] {
  return Array.from({ length: count }, () => createAgent(options))
}

/**
 * Generate agents for an organization (one per category)
 */
export function createAgentsForOrganization(
  organizationId: string,
  categories?: AgentCategory[]
): Agent[] {
  const cats = categories ?? faker.helpers.arrayElements(
    [...AGENT_CATEGORIES],
    faker.number.int({ min: 2, max: 5 })
  )
  
  return cats.map((category) => createAgent({ organizationId, category }))
}

// ============================================================================
// Helper Functions
// ============================================================================

function generateAgentName(category: AgentCategory): string {
  // Use category to generate appropriate agent names
  const suffixes = ['Agent', 'Assistant', 'Coordinator', 'Manager', 'Automation']
  const suffix = faker.helpers.arrayElement(suffixes)
  
  const prefixes: Record<AgentCategory, string[]> = {
    rcm: ['Billing', 'Revenue', 'Claims', 'Payment'],
    authorization: ['Prior Auth', 'Authorization', 'Approval'],
    callCenter: ['Patient Outreach', 'Call Center', 'Communication'],
    chartScrubbing: ['Chart Review', 'Documentation', 'Record'],
    clinicalTrials: ['Trial', 'Research', 'Study'],
    frontDesk: ['Front Desk', 'Check-in', 'Registration'],
    inpatientCare: ['Inpatient', 'Hospital', 'Acute Care'],
    medicationAdherence: ['Medication', 'Pharmacy', 'Rx'],
    patient: ['Patient', 'Member', 'Enrollee'],
    patientCare: ['Care', 'Patient Care', 'Care Navigation'],
    quality: ['Quality', 'Metrics', 'Performance'],
    referrals: ['Referral', 'Specialist', 'Transfer'],
    placeholder: ['Test', 'Development', 'Demo'],
  }
  
  const prefix = faker.helpers.arrayElement(prefixes[category])
  return `${prefix} ${suffix}`
}
