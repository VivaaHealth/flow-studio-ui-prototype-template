import { Plus } from 'lucide-react'
import { PageLayout } from '@/components/page-layout'
import { EmptyState } from '@/components/empty-state'

export function AgentsPage() {
  return (
    <PageLayout
      breadcrumbs={[{ label: 'Agents' }]}
      actions={[
        {
          label: 'Create Agent',
          variant: 'contained',
          color: 'primary',
          startIcon: <Plus size={16} />,
        },
      ]}
    >
      <EmptyState />
    </PageLayout>
  )
}
