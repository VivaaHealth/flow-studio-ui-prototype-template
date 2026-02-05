import { useState, useMemo } from 'react'
import { Box } from '@mui/material'
import { Plus } from 'lucide-react'

import { useAgents } from '@/lib/hooks'
import { PageLayout } from '@/components/page-layout'
import { LoadingState } from '@/components/loading-state'
import { Filters } from '@/components/filters/filters'
import { PageTabs } from '@/components/tabs/page-tabs'
import { FlowsTable } from '@/components/tables/flows-table'

// ============================================================================
// Main Page
// ============================================================================

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'published', label: 'Published' },
  { id: 'review', label: 'Review' },
  { id: 'draft', label: 'Draft' },
]

export function FlowsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchValue, setSearchValue] = useState('')

  const { agentsWithFlows, isLoading } = useAgents()

  // Filter agents based on tab
  const filteredAgents = useMemo(() => {
    let filtered = agentsWithFlows

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered
        .map((agent) => ({
          ...agent,
          flows: agent.flows.filter((f) => f.status === activeTab),
        }))
        .filter((agent) => agent.flows.length > 0)
    }

    // Filter by search (if implemented)
    if (searchValue) {
      filtered = filtered.filter(
        (agent) =>
          agent.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          agent.organization.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          agent.flows.some((flow) => flow.name.toLowerCase().includes(searchValue.toLowerCase()))
      )
    }

    return filtered
  }, [agentsWithFlows, activeTab, searchValue])

  if (isLoading) {
    return (
      <PageLayout breadcrumbs={[{ label: 'Flows' }]}>
        <LoadingState />
      </PageLayout>
    )
  }

  return (
    <PageLayout
      breadcrumbs={[{ label: 'Flows' }]}
      actions={[
        {
          label: 'Explore Templates',
          variant: 'outlined',
          color: 'secondary',
        },
        {
          label: 'Create Flow',
          variant: 'contained',
          color: 'primary',
          startIcon: <Plus size={16} />,
        },
      ]}
      contentPadding={false}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Filters
          chips={[
            { id: 'org', icon: <Plus size={14} />, label: 'Organization' },
            { id: 'agent', icon: <Plus size={14} />, label: 'Agent' },
            { id: 'created', icon: <Plus size={14} />, label: 'Created by' },
          ]}
          searchPlaceholder="Search"
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />

        <PageTabs tabs={tabs} value={activeTab} onChange={setActiveTab} />

        <FlowsTable agents={filteredAgents} />
      </Box>
    </PageLayout>
  )
}
