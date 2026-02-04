import { describe, it, expect } from 'vitest'
import {
  flowFixtures,
  agentFixtures,
  getFlowById,
  getAgentById,
  getFlowsByAgent,
} from '@/lib/mock-data/fixtures'

describe('Fixtures', () => {
  describe('flowFixtures', () => {
    it('should have valid flow data', () => {
      expect(flowFixtures.length).toBeGreaterThan(0)
      
      for (const flow of flowFixtures) {
        expect(flow.id).toBeDefined()
        expect(flow.name).toBeDefined()
        expect(flow.agentId).toBeDefined()
        expect(flow.organizationId).toBeDefined()
        expect(flow.status).toMatch(/^(draft|review|published|archived)$/)
      }
    })

    it('should get flow by ID', () => {
      const flow = getFlowById('flow-001')
      expect(flow).toBeDefined()
      expect(flow?.name).toBe('Claim Submission Flow')
    })

    it('should return undefined for unknown flow ID', () => {
      const flow = getFlowById('nonexistent')
      expect(flow).toBeUndefined()
    })
  })

  describe('agentFixtures', () => {
    it('should have valid agent data', () => {
      expect(agentFixtures.length).toBeGreaterThan(0)
      
      for (const agent of agentFixtures) {
        expect(agent.id).toBeDefined()
        expect(agent.name).toBeDefined()
        expect(agent.category).toBeDefined()
        expect(agent.status).toMatch(/^(active|inactive)$/)
      }
    })

    it('should get agent by ID', () => {
      const agent = getAgentById('agent-001')
      expect(agent).toBeDefined()
      expect(agent?.name).toBe('Billing Automation Agent')
    })
  })

  describe('Cross-references', () => {
    it('all flows should reference valid agents', () => {
      for (const flow of flowFixtures) {
        const agent = getAgentById(flow.agentId)
        expect(agent).toBeDefined()
      }
    })

    it('getFlowsByAgent should return correct flows', () => {
      const flows = getFlowsByAgent('agent-001')
      expect(flows.length).toBeGreaterThan(0)
      
      for (const flow of flows) {
        expect(flow.agentId).toBe('agent-001')
      }
    })
  })
})
