import { useState } from 'react'
import { Box, Stack, Accordion, AccordionSummary, AccordionDetails, IconButton, Select, MenuItem, FormControl, TextField, Button, InputAdornment, Divider } from '@mui/material'
import { Text } from '@vivaahealth/design-system'
import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { PageLayout } from '@/components/page-layout'
import { ConnectorCard } from '@/components/connector-card'

// ============================================================================
// Types
// ============================================================================

interface CuratedConnector {
  id: string
  name: string
  logo: string
  description: string
  direction: 'Inbound' | 'Outbound'
  flowCount: number
}

interface ConnectorTemplate {
  id: string
  name: string
  logo: string
  usage: number
  category: string
  description: string
  commentCount?: number
  flowCount?: number
}

// ============================================================================
// Mock Data
// ============================================================================

const curatedConnectors: CuratedConnector[] = [
  {
    id: '1',
    name: 'Epic API FHIR - Patient',
    logo: '/images/connectors/epic.png',
    description: 'Connect with Epic and MyChart for seamless FHIR data transfers.',
    direction: 'Inbound',
    flowCount: 2,
  },
  {
    id: '2',
    name: 'PNT SFTP X12 - TAP',
    logo: '/images/connectors/pnt.png',
    description: 'Connect with Epic and MyChart for seamless FHIR data transfers.',
    direction: 'Outbound',
    flowCount: 2,
  },
  {
    id: '3',
    name: 'OnBase VPN HL7 - MDM',
    logo: '/images/connectors/onbase.png',
    description: 'Connect with Epic and MyChart for seamless FHIR data transfers.',
    direction: 'Inbound',
    flowCount: 2,
  },
]

const allConnectors: ConnectorTemplate[] = [
  { id: '1', name: 'Epic', logo: '/images/connectors/epic.png', usage: 43900, category: 'EHR/EMR', description: 'Connect with Epic Systems EHR to exchange patient records, clinical data, and enable interoperability across healthcare organizations.', commentCount: 22, flowCount: 22 },
  { id: '2', name: 'Cerner', logo: '/images/connectors/cerner.png', usage: 22500, category: 'EHR/EMR', description: 'Integrate with Oracle Health (formerly Cerner) EHR to access comprehensive clinical documentation and patient records.', commentCount: 2 },
  { id: '3', name: 'OnBase', logo: '/images/connectors/onbase.png', usage: 13400, category: 'ECM', description: 'Connect with Hyland OnBase enterprise content management platform to access and manage unstructured healthcare documents and records.', flowCount: 2 },
  { id: '4', name: 'athenahealth', logo: '/images/connectors/athena.png', usage: 3100, category: 'EHR/EMR', description: 'Integrate with athenaOne AI-native EHR and practice management platform for ambulatory care workflows and revenue cycle management.' },
  { id: '5', name: 'Optum', logo: '/images/connectors/optum.png', usage: 2900, category: 'Payer', description: 'Connect with Optum payer solutions for utilization management, care coordination, and health plan operations.' },
  { id: '6', name: 'MEDITECH', logo: '/images/connectors/meditech.png', usage: 1200, category: 'EHR/EMR', description: 'Integrate with MEDITECH Expanse intelligent EHR for hospital information systems and clinical workflows.' },
  { id: '7', name: 'experian', logo: '/images/connectors/experian.png', usage: 982, category: 'Clearinghouse', description: 'Connect with Experian Health data analytics and revenue cycle solutions for claims processing and financial insights.' },
  { id: '8', name: 'EviCore', logo: '/images/connectors/evicore.png', usage: 788, category: 'Payer', description: 'Integrate with EviCore utilization management platform for prior authorization and medical benefits management.' },
  { id: '9', name: 'Helix', logo: '/images/connectors/helix.png', usage: 729, category: 'EHR/EMR', description: 'Connect with Helix enterprise genomics platform to access population health data and precision medicine insights.' },
  { id: '11', name: 'eClinicalWorks', logo: '/images/connectors/eclinicalworks.png', usage: 605, category: 'EHR/EMR', description: 'Integrate with eClinicalWorks AI-powered EHR and practice management system for ambulatory care delivery.' },
  { id: '12', name: 'twilio', logo: '/images/connectors/twilio.png', usage: 583, category: 'Telephony', description: 'Connect with Twilio communications platform for HIPAA-compliant SMS messaging, appointment reminders, and patient engagement.', commentCount: 4, flowCount: 4 },
  { id: '13', name: 'omada', logo: '/images/connectors/omada.png', usage: 510, category: 'EHR/EMR', description: 'Integrate with Omada Health digital chronic care platform for diabetes, hypertension, and musculoskeletal condition management.' },
  { id: '14', name: 'Salesforce', logo: '/images/connectors/salesforce.png', usage: 411, category: 'CRM', description: 'Connect with Salesforce Health Cloud CRM for patient engagement, appointment management, and personalized care communications.' },
  { id: '15', name: 'Workday', logo: '/images/connectors/workday.png', usage: 102, category: 'EHR/EMR', description: 'Integrate with Workday HCM for healthcare workforce management, clinician scheduling, and human resources operations.' },
  { id: '16', name: 'GoodRx', logo: '/images/connectors/goodrx.png', usage: 91, category: 'Clearinghouse', description: 'Connect with GoodRx prescription discount platform for medication pricing, pharmacy network access, and prescription management.' },
  { id: '17', name: 'surescripts', logo: '/images/connectors/surescripts.png', usage: 87, category: 'Clearinghouse', description: 'Integrate with Surescripts e-prescribing network for secure prescription delivery and pharmacy connectivity.' },
  { id: '18', name: 'P-n-T Data Corp.', logo: '/images/connectors/pnt.png', usage: 80, category: 'Clearinghouse', description: 'Connect with P-n-T Data Corp healthcare clearinghouse for secure EDI claims processing and clinical data exchange.' },
  { id: '20', name: 'zendesk', logo: '/images/connectors/zendesk.png', usage: 46, category: 'Customer Support', description: 'Integrate with Zendesk HIPAA-compliant help desk platform for patient support, ticket management, and customer service operations.' },
  { id: '21', name: 'slack', logo: '/images/connectors/slack.png', usage: 40, category: 'Customer Support', description: 'Connect with Slack HIPAA-compliant collaboration platform for healthcare team communication and care coordination.' },
  { id: '22', name: 'Cisco', logo: '/images/connectors/cisco.png', usage: 37, category: 'Telephony', description: 'Integrate with Cisco Webex telehealth platform for virtual care delivery, remote consultations, and secure provider communications.' },
  { id: '27', name: 'MEDHOST', logo: '/images/connectors/medhost.png', usage: 1, category: 'EHR/EMR', description: 'Connect with MEDHOST enterprise EHR and EDIS for hospital information systems and emergency department workflows.' },
]

// ============================================================================
// Components
// ============================================================================

// ============================================================================
// Main Page
// ============================================================================

export function ConnectorTemplatesPage() {
  const [curatedPage, setCuratedPage] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState('popular')

  const categories = ['EHR/EMR', 'CRM', 'Payer', 'Clearinghouse', 'ECM', 'Customer Support', 'Telephony']

  const filteredConnectors = selectedCategory === 'all'
    ? allConnectors
    : allConnectors.filter((c) => c.category === selectedCategory)

  const sortedConnectors = [...filteredConnectors].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.usage - a.usage
    }
    return a.name.localeCompare(b.name)
  })

  const curatedStart = curatedPage * 3
  const curatedEnd = curatedStart + 3
  const displayedCurated = curatedConnectors.slice(curatedStart, curatedEnd)
  const totalCuratedPages = Math.ceil(curatedConnectors.length / 3)

  return (
    <PageLayout
      breadcrumbs={[
        { label: 'Connectors', to: '/connections' },
        { label: 'Templates' },
      ]}
      actions={[
        {
          label: 'Create Custom Connector',
          variant: 'contained',
          color: 'primary',
        },
      ]}
      contentPadding={false}
    >
      <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        {/* Left Filter Panel */}
        <Box
          sx={{
            width: '280px',
            bgcolor: 'white',
            borderRight: '1px solid #E5E7EB',
            overflowY: 'auto',
            scrollbarGutter: 'stable',
            padding: '24px',
            paddingTop: '24px',
            paddingLeft: '24px',
          }}
        >
          <Stack spacing={0}>
            <TextField
              size="small"
              placeholder="Search"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#6B7280" />
                  </InputAdornment>
                ),
              }}
              sx={{
                marginBottom: '16px',
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  borderRadius: '9999px',
                },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px' }}>
              <Text sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                Filter (0)
              </Text>
              <Text
                sx={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  cursor: 'pointer',
                  '&:hover': { color: '#374151' },
                }}
              >
                Clear all
              </Text>
            </Box>
            <Divider sx={{ my: 0 }} />
            <Stack spacing={0}>
              <Accordion sx={{ boxShadow: 'none', bgcolor: 'transparent', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ChevronDown size={16} />} sx={{ minHeight: 40, px: 0, '&.Mui-expanded': { minHeight: 40 } }}>
                  <Text sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Category</Text>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0 }}>
                  <Text sx={{ fontSize: '0.75rem', color: '#6B7280' }}>Filter options</Text>
                </AccordionDetails>
              </Accordion>
              <Divider />
              <Accordion sx={{ boxShadow: 'none', bgcolor: 'transparent', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ChevronDown size={16} />} sx={{ minHeight: 40, px: 0, '&.Mui-expanded': { minHeight: 40 } }}>
                  <Text sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Entity Type</Text>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0 }}>
                  <Text sx={{ fontSize: '0.75rem', color: '#6B7280' }}>Filter options</Text>
                </AccordionDetails>
              </Accordion>
              <Divider />
              <Accordion sx={{ boxShadow: 'none', bgcolor: 'transparent', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ChevronDown size={16} />} sx={{ minHeight: 40, px: 0, '&.Mui-expanded': { minHeight: 40 } }}>
                  <Text sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Vendor</Text>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0 }}>
                  <Text sx={{ fontSize: '0.75rem', color: '#6B7280' }}>Filter options</Text>
                </AccordionDetails>
              </Accordion>
              <Divider />
              <Accordion sx={{ boxShadow: 'none', bgcolor: 'transparent', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ChevronDown size={16} />} sx={{ minHeight: 40, px: 0, '&.Mui-expanded': { minHeight: 40 } }}>
                  <Text sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Connectivity</Text>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0 }}>
                  <Text sx={{ fontSize: '0.75rem', color: '#6B7280' }}>Filter options</Text>
                </AccordionDetails>
              </Accordion>
              <Divider />
              <Accordion sx={{ boxShadow: 'none', bgcolor: 'transparent', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ChevronDown size={16} />} sx={{ minHeight: 40, px: 0, '&.Mui-expanded': { minHeight: 40 } }}>
                  <Text sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Format</Text>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0 }}>
                  <Text sx={{ fontSize: '0.75rem', color: '#6B7280' }}>Filter options</Text>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </Stack>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', scrollbarGutter: 'stable', p: 6 }}>
          <Stack spacing={4}>
            {/* Curated Connectors Section */}
            <Box>
              <Text
                sx={{
                  fontSize: '12px',
                  lineHeight: '135%',
                  color: '#737373',
                  mb: 0.5,
                }}
              >
                PRE CONFIGURED TEMPLATES
              </Text>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Text sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>
                  Curated Connectors for You
                </Text>
                <Button
                  variant="outlined"
                  size="small"
                >
                  View All
                </Button>
              </Box>
              <Box sx={{ position: 'relative' }}>
                <Stack direction="row" sx={{ overflowX: 'auto', pb: 2, gap: '8px' }}>
                  {displayedCurated.map((connector) => (
                    <ConnectorCard
                      key={connector.id}
                      id={connector.id}
                      name={connector.name}
                      logo={connector.logo}
                      description={connector.description}
                      variant="templates"
                      direction={connector.direction}
                      flowCount={connector.flowCount}
                    />
                  ))}
                </Stack>
                {totalCuratedPages > 1 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 2 }}>
                    <IconButton
                      size="small"
                      onClick={() => setCuratedPage(Math.max(0, curatedPage - 1))}
                      disabled={curatedPage === 0}
                      sx={{
                        border: '1px solid #D1D5DB',
                        '&:disabled': { opacity: 0.5 },
                      }}
                    >
                      <ChevronLeft size={16} />
                    </IconButton>
                    <Text sx={{ fontSize: '0.875rem', color: '#6B7280' }}>
                      {curatedStart + 1}-{Math.min(curatedEnd, curatedConnectors.length)} of {curatedConnectors.length}
                    </Text>
                    <IconButton
                      size="small"
                      onClick={() => setCuratedPage(Math.min(totalCuratedPages - 1, curatedPage + 1))}
                      disabled={curatedPage >= totalCuratedPages - 1}
                      sx={{
                        border: '1px solid #D1D5DB',
                        '&:disabled': { opacity: 0.5 },
                      }}
                    >
                      <ChevronRight size={16} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>

            {/* All Connectors Section */}
            <Box>
              <Text sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', mb: 3 }}>
                All Connectors
              </Text>
              <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: '2px' }}>
                  <Box
                    onClick={() => setSelectedCategory('all')}
                    sx={{
                      px: 2,
                      py: 0.75,
                      borderRadius: '9999px',
                      bgcolor: selectedCategory === 'all' ? '#E6F0FF' : 'white',
                      border: '1px solid #BFBFBF',
                      cursor: 'pointer',
                    }}
                  >
                    <Text
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: selectedCategory === 'all' ? '#113264' : '#374151',
                      }}
                    >
                      All
                    </Text>
                  </Box>
                  {categories.map((cat) => (
                    <Box
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      sx={{
                        px: 2,
                        py: 0.75,
                        borderRadius: '9999px',
                        bgcolor: selectedCategory === cat ? '#E6F0FF' : 'white',
                        border: '1px solid #BFBFBF',
                        cursor: 'pointer',
                      }}
                    >
                      <Text
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: selectedCategory === cat ? '#113264' : '#374151',
                        }}
                      >
                        {cat}
                      </Text>
                    </Box>
                  ))}
                </Stack>
                <FormControl size="small" sx={{ minWidth: 'auto' }}>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{
                      px: 2,
                      py: 0.75,
                      borderRadius: '9999px',
                      bgcolor: '#E6F0FF',
                      border: '1px solid #BBD7FF',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#001333',
                      height: 'auto',
                      '& .MuiSelect-select': {
                        py: 0,
                        px: 0,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#001333',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                    }}
                  >
                    <MenuItem value="popular" sx={{ fontSize: '0.875rem' }}>Most Popular</MenuItem>
                    <MenuItem value="name" sx={{ fontSize: '0.875rem' }}>Name</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: '8px',
                }}
              >
                {sortedConnectors.map((connector) => (
                  <Box key={connector.id} sx={{ display: 'flex', height: '100%' }}>
                    <ConnectorCard
                      id={connector.id}
                      name={connector.name}
                      logo={connector.logo}
                      description={connector.description}
                      variant="canonical"
                      usage={connector.usage}
                      category={connector.category}
                      flowCount={connector.flowCount}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>
    </PageLayout>
  )
}
