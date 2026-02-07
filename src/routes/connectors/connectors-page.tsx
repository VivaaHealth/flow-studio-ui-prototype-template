import { useState, useMemo } from 'react'
import { Box } from '@mui/material'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { PageLayout } from '@/components/page-layout'
import { Filters } from '@/components/filters/filters'
import { PageTabs } from '@/components/tabs/page-tabs'
import { ConnectorsTable, type Connector, type EntityType } from '@/components/tables/connectors-table'

// ============================================================================
// Entity Generation (shared with detail page)
// ============================================================================

const ALL_ENTITIES: EntityType[] = [
  'Patients',
  'Encounters',
  'Orders',
  'Documents',
  'Conversations',
  'Practices',
  'Providers',
  'Appointment Types',
  'Procedures',
  'Devices',
  'Service Requests',
  'Claims',
  'Payments',
  'Invoices',
  'Test Results',
]

function seededRandom(seed: string): () => number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash = hash & hash
  }
  let value = Math.abs(hash) / 2147483647
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function generateEntities(connectorId: string): EntityType[] {
  const random = seededRandom(connectorId)
  const count = Math.floor(random() * 3) + 2 // 2-4 entities
  const shuffled = [...ALL_ENTITIES].sort(() => random() - 0.5)
  return shuffled.slice(0, count)
}

// ============================================================================
// Mock Data
// ============================================================================

const mockConnectors: Connector[] = [
  // Requires Attention
  {
    id: '1',
    name: 'Epic HL7 - ORM/REF',
    logo: '/images/connectors/epic.png',
    useCase: 'Patient Lookup',
    source: 'Epic',
    connectivity: 'TCP',
    format: 'HL7',
    status: 'in-setup',
    lastActivity: 'None - Installing',
    entities: generateEntities('1'),
  },
  {
    id: '2',
    name: 'Salesforce API',
    logo: '/images/connectors/salesforce.png',
    useCase: 'Provider Availability',
    source: 'Salesforce',
    connectivity: 'REST API',
    format: 'JSON',
    status: 'error',
    errorCount: 1,
    lastActivity: 'Error: API connection',
    entities: generateEntities('2'),
  },
  {
    id: '3',
    name: 'Epic HL7 - ADT',
    logo: '/images/connectors/epic.png',
    useCase: 'New Patient Feed',
    source: 'Epic',
    connectivity: 'TCP',
    format: 'HL7',
    status: 'inactive',
    lastActivity: '03/15/24, 06:57:19 PM',
    entities: generateEntities('3'),
  },
  // Active
  {
    id: '4',
    name: 'Epic HL7 SIU',
    logo: '/images/connectors/epic.png',
    useCase: 'Appointments',
    source: 'Epic',
    connectivity: 'TCP',
    format: 'HL7',
    status: 'active',
    lastActivity: '03/27/24, 02:15:32 PM',
    entities: generateEntities('4'),
  },
  {
    id: '5',
    name: 'Epic FHIR - Documents',
    logo: '/images/connectors/epic.png',
    useCase: 'Clinical Documents',
    source: 'Notable',
    connectivity: 'API (Feed)',
    format: 'FHIR',
    status: 'active',
    lastActivity: '03/28/24, 11:42:59 AM',
    entities: generateEntities('5'),
  },
  {
    id: '6',
    name: 'Workday SFTP - CSV',
    logo: '/images/connectors/workday.png',
    useCase: 'Provider Availability',
    source: 'Workday',
    connectivity: 'SFTP',
    format: 'CSV',
    status: 'active',
    lastActivity: '03/20/24, 09:29:01 AM',
    entities: generateEntities('6'),
  },
  {
    id: '7',
    name: 'BlueShield API - X12',
    logo: '/images/connectors/blueshield.png',
    useCase: 'Eligibility Data',
    source: 'Blue Shield',
    connectivity: 'API (Interface)',
    format: 'X12',
    status: 'active',
    lastActivity: '03/22/24, 04:05:47 PM',
    entities: generateEntities('7'),
  },
  {
    id: '8',
    name: 'Twilio API - JSON',
    logo: '/images/connectors/twilio.png',
    useCase: 'Notification Data',
    source: 'Twilio',
    connectivity: 'API (Interface)',
    format: 'JSON',
    status: 'active',
    lastActivity: '03/18/24, 01:50:22 PM',
    entities: generateEntities('8'),
  },
  {
    id: '9',
    name: 'Epic HL7 - MDM',
    logo: '/images/connectors/epic.png',
    useCase: 'Document Refere...',
    source: 'Epic',
    connectivity: 'TCP',
    format: 'HL7',
    status: 'active',
    lastActivity: '03/29/24, 08:38:14 AM',
    entities: generateEntities('9'),
  },
  {
    id: '10',
    name: 'Epic HL7 - ADT',
    logo: '/images/connectors/epic.png',
    useCase: 'Patient List',
    source: 'Epic',
    connectivity: 'TCP',
    format: 'HL7',
    status: 'active',
    lastActivity: '03/21/24, 07:11:08 PM',
    entities: generateEntities('10'),
  },
  {
    id: '11',
    name: 'Epic FHIR - Medication',
    logo: '/images/connectors/epic.png',
    useCase: 'Medication',
    source: 'Epic',
    connectivity: 'API (Feed)',
    format: 'FHIR',
    status: 'active',
    lastActivity: '03/25/24, 03:55:36 AM',
    entities: generateEntities('11'),
  },
  {
    id: '12',
    name: 'Epic Appointment Slots',
    logo: '/images/connectors/epic.png',
    useCase: 'EPIC_APP_MARKET',
    source: 'Notable',
    connectivity: 'SFTP',
    format: 'CSV',
    status: 'active',
    lastActivity: '03/17/24, 10:23:41 AM',
    entities: generateEntities('12'),
  },
  {
    id: '13',
    name: 'Epic Document Export',
    logo: '/images/connectors/epic.png',
    useCase: 'EPIC_APP_MARKET',
    source: 'Notable',
    connectivity: 'API (Interface)',
    format: 'X12',
    status: 'active',
    lastActivity: '03/26/24, 12:09:53 PM',
    entities: generateEntities('13'),
  },
  {
    id: '14',
    name: 'Epic New Patients',
    logo: '/images/connectors/epic.png',
    useCase: 'Notable',
    source: 'Epic',
    connectivity: 'API (Interface)',
    format: 'FHIR',
    status: 'active',
    lastActivity: '03/16/24, 05:44:29 PM',
    entities: generateEntities('14'),
  },
  {
    id: '15',
    name: 'Epic Existing Patients',
    logo: '/images/connectors/epic.png',
    useCase: 'Notable',
    source: 'Epic',
    connectivity: 'API (Interface)',
    format: 'FHIR',
    status: 'active',
    lastActivity: '03/19/24, 06:31:17 AM',
    entities: generateEntities('15'),
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

  const navigate = useNavigate()

  return (
    <PageLayout
      breadcrumbs={[{ label: 'Connectors' }]}
      actions={[
        {
          label: 'Create Connector',
          variant: 'contained',
          color: 'primary',
          startIcon: <Plus size={16} />,
          onClick: () => navigate('/connections/templates'),
        },
      ]}
      contentPadding={false}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <PageTabs tabs={tabs} value={activeTab} onChange={setActiveTab} />

        <Box sx={{ paddingTop: '24px' }}>
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
        </Box>

        <ConnectorsTable connectors={filteredConnectors} />
      </Box>
    </PageLayout>
  )
}
