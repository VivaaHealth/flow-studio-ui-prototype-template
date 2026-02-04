import type { Organization } from '@/lib/types/entities'

export const organizationFixtures: Organization[] = [
  {
    id: 'org-001',
    name: 'Acme Healthcare',
    slug: 'acme-healthcare',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2026-01-20T14:30:00Z',
  },
  {
    id: 'org-002',
    name: 'Valley Medical Center',
    slug: 'valley-medical',
    createdAt: '2024-03-10T09:00:00Z',
    updatedAt: '2025-12-16T11:00:00Z',
  },
  {
    id: 'org-003',
    name: 'Demo Organization',
    slug: 'demo-org',
    createdAt: '2024-06-01T08:00:00Z',
    updatedAt: '2025-10-30T16:45:00Z',
  },
  {
    id: 'org-004',
    name: 'Metro Health System',
    slug: 'metro-health',
    createdAt: '2024-02-20T12:00:00Z',
    updatedAt: '2025-07-22T10:15:00Z',
  },
  {
    id: 'org-005',
    name: 'Internal - Engineering',
    slug: 'internal-eng',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'org-006',
    name: 'Research Institute',
    slug: 'research-institute',
    createdAt: '2024-05-15T14:00:00Z',
    updatedAt: '2025-11-08T13:30:00Z',
  },
  {
    id: 'org-007',
    name: 'Quality Partners',
    slug: 'quality-partners',
    createdAt: '2024-04-01T11:00:00Z',
    updatedAt: '2025-12-11T15:00:00Z',
  },
  {
    id: 'org-008',
    name: 'Specialty Network',
    slug: 'specialty-network',
    createdAt: '2024-07-20T10:00:00Z',
    updatedAt: '2025-10-07T12:00:00Z',
  },
  {
    id: 'org-009',
    name: 'Community Health',
    slug: 'community-health',
    createdAt: '2024-08-05T09:00:00Z',
    updatedAt: '2026-01-27T08:45:00Z',
  },
]

export function getOrganizationById(id: string): Organization | undefined {
  return organizationFixtures.find((org) => org.id === id)
}
