import type { User } from '@/lib/types/entities'

export const userFixtures: User[] = [
  {
    id: 'user-001',
    email: 'jane.doe@acme.health',
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'admin',
    organizationId: 'org-001',
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'user-002',
    email: 'john.smith@valley.med',
    firstName: 'John',
    lastName: 'Smith',
    role: 'editor',
    organizationId: 'org-002',
    createdAt: '2024-03-15T09:00:00Z',
  },
  {
    id: 'user-003',
    email: 'admin@demo.org',
    firstName: 'Demo',
    lastName: 'Admin',
    role: 'admin',
    organizationId: 'org-003',
    createdAt: '2024-06-05T08:00:00Z',
  },
  {
    id: 'user-004',
    email: 'sarah.jones@metro.health',
    firstName: 'Sarah',
    lastName: 'Jones',
    role: 'editor',
    organizationId: 'org-004',
    createdAt: '2024-02-25T12:00:00Z',
  },
  {
    id: 'user-005',
    email: 'dev@internal.eng',
    firstName: 'Dev',
    lastName: 'Engineer',
    role: 'admin',
    organizationId: 'org-005',
    createdAt: '2024-01-05T00:00:00Z',
  },
  {
    id: 'user-006',
    email: 'researcher@research.inst',
    firstName: 'Research',
    lastName: 'Lead',
    role: 'editor',
    organizationId: 'org-006',
    createdAt: '2024-05-20T14:00:00Z',
  },
  {
    id: 'user-007',
    email: 'quality@quality.partners',
    firstName: 'Quality',
    lastName: 'Manager',
    role: 'editor',
    organizationId: 'org-007',
    createdAt: '2024-04-10T11:00:00Z',
  },
  {
    id: 'user-008',
    email: 'specialist@specialty.net',
    firstName: 'Specialty',
    lastName: 'Coordinator',
    role: 'viewer',
    organizationId: 'org-008',
    createdAt: '2024-07-25T10:00:00Z',
  },
  {
    id: 'user-009',
    email: 'community@community.health',
    firstName: 'Community',
    lastName: 'Navigator',
    role: 'editor',
    organizationId: 'org-009',
    createdAt: '2024-08-10T09:00:00Z',
  },
]

export function getUserById(id: string): User | undefined {
  return userFixtures.find((user) => user.id === id)
}

export function getUserDisplayName(user: User): string {
  return `${user.firstName} ${user.lastName}`
}

export function getUserInitials(user: User): string {
  return `${user.firstName[0]}${user.lastName[0]}`
}
