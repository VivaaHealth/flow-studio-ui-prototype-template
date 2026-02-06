import { useState, useMemo } from 'react'
import { Box } from '@mui/material'
import { Plus } from 'lucide-react'

import { PageLayout } from '@/components/page-layout'
import { Filters } from '@/components/filters/filters'
import { PageTabs } from '@/components/tabs/page-tabs'
import { ConnectorsTable, type Connector } from '@/components/tables/connectors-table'

// ============================================================================
// Mock Data
// ============================================================================

const mockConnectors: Connector[] = [
  {
    id: '1',
    name: 'Epic HL7 - ORM/REF',
    useCase: 'Patient Lookup',
    source: 'Epic',
    connectivity: 'TCP',
    format: 'HL7',
    status: 'in-setup',
    lastActivity: 'None - Installing',
  },
  {
    id: '2',
    name: 'Salesforce API',
    useCase: 'Provider Availability',
    source: 'Salesforce',
    connectivity: 'REST API',
    format: 'JSON',
    status: 'error',
    errorCount: 1,
    lastActivity: 'Error: API connection',
  },
  {
    id: '3',
    name: 'Epic HL7 - ADT',
    useCase: 'New Patient Feed',
    source: 'Epic',
    connectivity: 'TCP',
    format: 'HL7',
    status: 'inactive',
    lastActivity: '03/15/24, 06:57:19 PM',
  },
  {
    id: '4',
    name: 'Epic FHIR',
    useCase: 'Patient Data Sync',
    source: 'Epic',
    connectivity: 'REST API',
    format: 'FHIR',
    status: 'active',
    lastActivity: '03/27/24, 02:15:32 PM',
  },
  {
    id: '5',
    name: 'Workday CSV',
    useCase: 'Employee Import',
    source: 'Workday',
    connectivity: 'SFTP',
    format: 'CSV',
    status: 'active',
    lastActivity: '03/27/24, 01:30:15 PM',
  },
  {
    id: '6',
    name: 'BlueShield X12',
    useCase: 'Claims Processing',
    source: 'BlueShield',
    connectivity: 'EDI',
    format: 'X12',
    status: 'active',
    lastActivity: '03/27/24, 12:45:22 PM',
  },
  {
    id: '7',
    name: 'Twilio SMS',
    useCase: 'Patient Notifications',
    source: 'Twilio',
    connectivity: 'REST API',
    format: 'JSON',
    status: 'active',
    lastActivity: '03/27/24, 11:20:08 AM',
  },
]

// ============================================================================
// Main Page
// ============================================================================

export function ConnectorsPage() {
  const [activeTab, setActiveTab] = useState('active')
  const [searchValue, setSearchValue] = useState('')

  // Filter connectors based on tab
  const filteredConnectors = useMemo(() => {
    let filtered = mockConnectors

    // Filter by tab
    if (activeTab === 'active') {
      filtered = filtered.filter((c) => c.status === 'active')
    } else if (activeTab === 'requires-attention') {
      filtered = filtered.filter((c) => c.status !== 'active')
    }

    // Filter by search
    if (searchValue) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          c.useCase.toLowerCase().includes(searchValue.toLowerCase()) ||
          c.source.toLowerCase().includes(searchValue.toLowerCase())
      )
    }

    return filtered
  }, [activeTab, searchValue])

  // Count errored items for badge
  const errorCount = useMemo(() => {
    return mockConnectors.filter((c) => c.status === 'error').length
  }, [])

  const tabs = [
    { id: 'active', label: 'Active' },
    { id: 'requires-attention', label: 'Requires Attention', badge: errorCount > 0 ? errorCount : undefined },
  ]

  return (
    <PageLayout
      breadcrumbs={[{ label: 'Connectors' }]}
      contentPadding={false}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <PageTabs tabs={tabs} value={activeTab} onChange={setActiveTab} />

        <Filters
          chips={[
            { id: 'source', icon: <Plus size={14} />, label: 'Source' },
            { id: 'destination', icon: <Plus size={14} />, label: 'Destination' },
            { id: 'connectivity', icon: <Plus size={14} />, label: 'Connectivity' },
            { id: 'format', icon: <Plus size={14} />, label: 'Format' },
            { id: 'status', icon: <Plus size={14} />, label: 'Status' },
          ]}
          searchPlaceholder="Search"
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />

        <ConnectorsTable connectors={filteredConnectors} />
      </Box>
    </PageLayout>
  )
}
