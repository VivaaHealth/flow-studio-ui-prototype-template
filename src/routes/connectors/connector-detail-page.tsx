import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Stack, TextField, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material'
import { Text } from '@vivaahealth/design-system'
import { ChevronDown, Users, Calendar, ShoppingCart, FileText, MessageSquare, Building2, UserCheck, CalendarCheck, Stethoscope, Smartphone, ClipboardList, Receipt, CreditCard, FileCheck, TestTube } from 'lucide-react'
import { PageLayout } from '@/components/page-layout'
import { LoadingState } from '@/components/loading-state'
import { Tag } from '@/components/tag'
import { generateConnectorSlug, statusVariantMap, formatStatusLabel } from '@/components/tables/connectors-table'
import type { Connector, EntityType } from '@/components/tables/connectors-table'

// ============================================================================
// Entity Generation
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

// Simple seeded random function for consistent results per connector
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

// Import mock data from connectors page
// In a real app, this would come from a shared data source or API
const getMockConnectors = (): Connector[] => [
  // Requires Attention
  {
    id: '1',
    name: 'Epic HL7 - ORM/REF',
    logo: '/images/connectors/epic.png',
    useCase: 'Patient Lookup',
    source: 'Epic',
    destination: 'Notable',
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
    destination: 'Notable',
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
    destination: 'Notable',
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
    destination: 'Notable',
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
    destination: 'Epic',
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
    destination: 'Notable',
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
    destination: 'Notable',
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
    destination: 'Notable',
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
    destination: 'Notable',
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
    destination: 'Notable',
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
    destination: 'Notable',
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
    destination: 'Epic',
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
    destination: 'Epic',
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
    destination: 'Notable',
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
    destination: 'Notable',
    connectivity: 'API (Interface)',
    format: 'FHIR',
    status: 'active',
    lastActivity: '03/19/24, 06:31:17 AM',
    entities: generateEntities('15'),
  },
]

interface Component {
  id: string
  name: string
  type: 'Flow' | 'Feed'
  lastConnection: string
}

// Generate components based on connector type
function generateComponents(connector: Connector): Component[] {
  const random = seededRandom(connector.id)
  const count = Math.floor(random() * 6) + 5 // 5-10 items
  const components: Component[] = []
  
  const componentTemplates: Record<string, { flows: string[], feeds: string[] }> = {
    'Epic': {
      flows: [
        'Medication Reconciliation Workflow',
        'Appointment Reminder Workflow',
        'Referral Management Workflow',
        'Chronic Condition Monitoring Workflow',
        'Pre-operative Assessment Workflow',
        'Discharge Planning Workflow',
        'Care Coordination Workflow',
        'Patient Outreach Workflow',
      ],
      feeds: [
        'Lab Result Feed',
        'Discharge Summary Feed',
        'Patient Satisfaction Survey Feed',
        'Immunization Record Feed',
        'Allergy Information Feed',
        'Vital Signs Feed',
        'Medication History Feed',
        'Appointment Feed',
      ],
    },
    'Salesforce': {
      flows: [
        'Provider Scheduling Workflow',
        'Patient Communication Workflow',
        'Referral Tracking Workflow',
        'Appointment Confirmation Workflow',
      ],
      feeds: [
        'Provider Availability Feed',
        'Schedule Update Feed',
        'Patient Contact Feed',
      ],
    },
    'Workday': {
      flows: [
        'Employee Onboarding Workflow',
        'Provider Credentialing Workflow',
        'Staff Scheduling Workflow',
      ],
      feeds: [
        'Employee Data Feed',
        'Provider Directory Feed',
        'Schedule Import Feed',
      ],
    },
    'Blue Shield': {
      flows: [
        'Eligibility Verification Workflow',
        'Claims Processing Workflow',
        'Authorization Request Workflow',
      ],
      feeds: [
        'Eligibility Data Feed',
        'Claims Status Feed',
        'Authorization Feed',
      ],
    },
    'Twilio': {
      flows: [
        'SMS Notification Workflow',
        'Appointment Reminder Workflow',
        'Patient Survey Workflow',
        'Alert Notification Workflow',
      ],
      feeds: [
        'SMS Response Feed',
        'Call Log Feed',
        'Message Status Feed',
      ],
    },
    'Notable': {
      flows: [
        'Document Processing Workflow',
        'Data Sync Workflow',
        'Integration Workflow',
      ],
      feeds: [
        'Document Feed',
        'Data Export Feed',
        'Sync Status Feed',
      ],
    },
  }

  const templates = componentTemplates[connector.source] || componentTemplates['Epic']
  const allComponents = [
    ...templates.flows.map(name => ({ name, type: 'Flow' as const })),
    ...templates.feeds.map(name => ({ name, type: 'Feed' as const })),
  ]

  // Randomize and select using seeded random
  const shuffled = [...allComponents].sort(() => random() - 0.5)
  const selected = shuffled.slice(0, count)

  // Generate dates
  const dates = [
    '01/02/24, 08:12:12 AM',
    '05/22/23, 09:34:56 PM',
    '11/03/22, 02:45:32 AM',
    '03/15/24, 06:57:19 PM',
    '07/08/23, 11:09:41 AM',
    '12/27/22, 03:21:05 PM',
    '02/01/25, 07:33:28 AM',
    '06/19/24, 10:44:50 PM',
    '10/10/23, 01:56:14 AM',
    '04/04/22, 05:08:37 PM',
  ]

  selected.forEach((comp, index) => {
    const dateIndex = Math.floor(random() * dates.length)
    components.push({
      id: `${connector.id}-comp-${index}`,
      name: comp.name,
      type: comp.type,
      lastConnection: dates[dateIndex],
    })
  })

  return components.sort((a, b) => a.name.localeCompare(b.name))
}

// ============================================================================
// Entity Icons
// ============================================================================

const entityIcons: Record<EntityType, React.ReactNode> = {
  'Patients': <Users size={14} />,
  'Encounters': <Calendar size={14} />,
  'Orders': <ShoppingCart size={14} />,
  'Documents': <FileText size={14} />,
  'Conversations': <MessageSquare size={14} />,
  'Practices': <Building2 size={14} />,
  'Providers': <UserCheck size={14} />,
  'Appointment Types': <CalendarCheck size={14} />,
  'Procedures': <Stethoscope size={14} />,
  'Devices': <Smartphone size={14} />,
  'Service Requests': <ClipboardList size={14} />,
  'Claims': <Receipt size={14} />,
  'Payments': <CreditCard size={14} />,
  'Invoices': <FileCheck size={14} />,
  'Test Results': <TestTube size={14} />,
}

// ============================================================================
// Connector Card Component
// ============================================================================

interface ConnectorCardProps {
  connector: Connector
  description: string
  onDescriptionChange: (value: string) => void
}

function ConnectorCard({ connector, description, onDescriptionChange }: ConnectorCardProps) {
  return (
    <Box
      sx={{
        bgcolor: 'white',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        p: 3,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <Stack spacing={2}>
        {/* Top Row: Logo, Name, Status Tag */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
            {connector.logo && (
              <Box
                component="img"
                src={connector.logo}
                alt=""
                sx={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  objectFit: 'contain',
                }}
              />
            )}
            <Text
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#111827',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {connector.name}
            </Text>
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <Tag
              variant={statusVariantMap[connector.status]}
              label={formatStatusLabel(connector.status, connector.errorCount)}
            />
          </Box>
        </Box>

        {/* Bottom Row: Description, Entity Tags */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              variant="outlined"
              size="small"
              placeholder="Enables results and observations tied back to patients/encounters/orders."
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'transparent',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: '1px solid #D1D5DB',
                  },
                },
                '& .MuiInputBase-input': {
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  padding: 0,
                  lineHeight: '1.5',
                },
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {connector.entities.map((entity, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: '999px',
                  bgcolor: '#F3F4F6',
                  color: '#374151',
                  border: '1px solid #D1D5DB',
                  fontSize: '0.75rem',
                  whiteSpace: 'nowrap',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#374151' }}>
                  {entityIcons[entity]}
                </Box>
                <Text sx={{ fontSize: '0.75rem', color: '#374151', fontWeight: 400 }}>{entity}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}

// ============================================================================
// Metadata Panel
// ============================================================================

interface MetadataPanelProps {
  connector: Connector
}

function MetadataPanel({ connector }: MetadataPanelProps) {
  // Determine direction based on source/destination
  const isOutbound = connector.source !== 'Notable'
  const direction = isOutbound ? 'Outbound' : 'Inbound'
  
  return (
    <Box
      sx={{
        width: '320px',
        bgcolor: '#F9FAFB',
        borderLeft: '1px solid #E5E7EB',
        height: '100%',
        overflowY: 'auto',
        scrollbarGutter: 'stable',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Text sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', mb: 2 }}>
          Metadata
        </Text>
        
        <Stack spacing={2}>
          <Accordion defaultExpanded sx={{ boxShadow: 'none', border: '1px solid #E5E7EB', borderRadius: '4px', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ChevronDown size={16} />} sx={{ minHeight: 40, '&.Mui-expanded': { minHeight: 40 } }}>
              <Text sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Connection</Text>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1.5}>
                <Box>
                  <Text sx={{ fontSize: '0.75rem', color: '#6B7280', mb: 0.5 }}>Source</Text>
                  <Text sx={{ fontSize: '0.875rem', color: '#111827' }}>{connector.source}</Text>
                </Box>
                <Box>
                  <Text sx={{ fontSize: '0.75rem', color: '#6B7280', mb: 0.5 }}>Direction</Text>
                  <Text sx={{ fontSize: '0.875rem', color: '#111827' }}>{direction}</Text>
                </Box>
                <Box>
                  <Text sx={{ fontSize: '0.75rem', color: '#6B7280', mb: 0.5 }}>Destination</Text>
                  <Text sx={{ fontSize: '0.875rem', color: '#111827' }}>{connector.destination || 'Notable'}</Text>
                </Box>
                <Box>
                  <Text sx={{ fontSize: '0.75rem', color: '#6B7280', mb: 0.5 }}>Connectivity</Text>
                  <Text sx={{ fontSize: '0.875rem', color: '#111827' }}>{connector.connectivity}</Text>
                </Box>
                <Box>
                  <Text sx={{ fontSize: '0.75rem', color: '#6B7280', mb: 0.5 }}>Format</Text>
                  <Text sx={{ fontSize: '0.875rem', color: '#111827' }}>{connector.format}</Text>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded sx={{ boxShadow: 'none', border: '1px solid #E5E7EB', borderRadius: '4px', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ChevronDown size={16} />} sx={{ minHeight: 40, '&.Mui-expanded': { minHeight: 40 } }}>
              <Text sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Details</Text>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={1.5}>
                <Box>
                  <Text sx={{ fontSize: '0.75rem', color: '#6B7280', mb: 0.5 }}>Status</Text>
                  <Tag
                    variant={connector.status === 'active' ? 'success' : connector.status === 'error' ? 'error' : 'warning'}
                    label={connector.status === 'error' && connector.errorCount ? `${connector.errorCount} Issue${connector.errorCount > 1 ? 's' : ''}` : connector.status.charAt(0).toUpperCase() + connector.status.slice(1).replace(/-/g, ' ')}
                  />
                </Box>
                <Box>
                  <Text sx={{ fontSize: '0.75rem', color: '#6B7280', mb: 0.5 }}>Last Activity</Text>
                  <Text sx={{ fontSize: '0.875rem', color: '#111827' }}>{connector.lastActivity || 'None'}</Text>
                </Box>
                <Box>
                  <Text sx={{ fontSize: '0.75rem', color: '#6B7280', mb: 0.5 }}>Use Case</Text>
                  <Text sx={{ fontSize: '0.875rem', color: '#111827' }}>{connector.useCase}</Text>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Box>
    </Box>
  )
}

// ============================================================================
// Components Table
// ============================================================================

interface ComponentsTableProps {
  components: Component[]
}

function ComponentsTable({ components }: ComponentsTableProps) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const paginatedComponents = components.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Box sx={{ mt: 3 }}>
      <Text sx={{ fontSize: '1rem', fontWeight: 600, color: '#111827', mb: 2 }}>
        Components using this connection ({components.length})
      </Text>
      <Box sx={{ bgcolor: 'white', border: '1px solid #D9D9D9', borderRadius: '8px', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F7F7F7', minHeight: '48px', height: '48px' }}>
                <TableCell sx={{ fontWeight: 600, color: '#3F3F3F', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                  <Text sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Name</Text>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3F3F3F', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                  <Text sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Component</Text>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3F3F3F', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                  <Text sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Last connection</Text>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedComponents.map((component) => (
                <TableRow
                  key={component.id}
                  sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f9fafb' }, minHeight: '48px', height: '48px' }}
                >
                  <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                    <Text sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {component.name}
                    </Text>
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'middle' }}>
                    <Tag variant="default" label={component.type} />
                  </TableCell>
                  <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                    <Text sx={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {component.lastConnection}
                    </Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ bgcolor: 'white' }}>
          <TablePagination
            component="div"
            count={components.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Box>
      </Box>
    </Box>
  )
}

// ============================================================================
// Main Page
// ============================================================================

export function ConnectorDetailPage() {
  const { id: slug } = useParams<{ id: string }>()
  const [description, setDescription] = useState('Pull all new patients into Flow Studio along with their registration data.')
  const [isLoading] = useState(false)

  // Find connector by matching the slug
  const connector = getMockConnectors().find((c) => {
    const connectorSlug = generateConnectorSlug(c)
    return connectorSlug === slug
  })
  const components = connector ? generateComponents(connector) : []

  const breadcrumbs = connector
    ? [
        { label: 'Connectors', to: '/connections' },
        { label: connector.name },
      ]
    : [{ label: 'Connectors' }]

  if (isLoading) {
    return (
      <PageLayout breadcrumbs={breadcrumbs}>
        <LoadingState />
      </PageLayout>
    )
  }

  if (!connector) {
    return (
      <PageLayout breadcrumbs={breadcrumbs}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Text sx={{ color: '#6b7280' }}>Connector not found</Text>
        </Box>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      breadcrumbs={breadcrumbs}
      actions={[
        {
          label: 'Save Updates',
          variant: 'contained',
          color: 'primary',
        },
      ]}
      contentPadding={false}
    >
      <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        {/* Main Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', scrollbarGutter: 'stable', p: 6 }}>
          <Stack spacing={4}>
            {/* Details Section */}
            <Box>
              <Text sx={{ fontSize: '1rem', fontWeight: 600, color: '#111827', mb: 2 }}>
                Details
              </Text>
              <ConnectorCard
                connector={connector}
                description={description}
                onDescriptionChange={setDescription}
              />
            </Box>

            {/* Components Table */}
            <ComponentsTable components={components} />
          </Stack>
        </Box>

        {/* Metadata Panel */}
        <MetadataPanel connector={connector} />
      </Box>
    </PageLayout>
  )
}
