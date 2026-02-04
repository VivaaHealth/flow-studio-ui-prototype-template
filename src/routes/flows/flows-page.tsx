import React, { useState, useMemo } from 'react'
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Tooltip,
  Tabs,
  Tab,
  Skeleton,
} from '@mui/material'
import { Text, Title } from '@vivaahealth/design-system'
import { ChevronDown, Plus, Search, MoreHorizontal } from 'lucide-react'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import PhoneIcon from '@mui/icons-material/Phone'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ScienceIcon from '@mui/icons-material/Science'
import PersonIcon from '@mui/icons-material/Person'
import VerifiedIcon from '@mui/icons-material/Verified'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import { useAgents } from '@/lib/hooks'
import { CATEGORY_COLORS, type AgentCategory, type FlowStatus } from '@/lib/types/entities'

// ============================================================================
// Category Icons
// ============================================================================

const categoryIcons: Record<AgentCategory, React.ReactNode> = {
  rcm: <AttachMoneyIcon sx={{ fontSize: 16, color: 'white' }} />,
  authorization: <VerifiedIcon sx={{ fontSize: 16, color: 'white' }} />,
  callCenter: <PhoneIcon sx={{ fontSize: 16, color: 'white' }} />,
  chartScrubbing: <AssignmentIcon sx={{ fontSize: 16, color: 'white' }} />,
  clinicalTrials: <ScienceIcon sx={{ fontSize: 16, color: 'white' }} />,
  frontDesk: <PersonIcon sx={{ fontSize: 16, color: 'white' }} />,
  inpatientCare: <LocalHospitalIcon sx={{ fontSize: 16, color: 'white' }} />,
  medicationAdherence: <MedicalServicesIcon sx={{ fontSize: 16, color: 'white' }} />,
  patient: <PersonIcon sx={{ fontSize: 16, color: 'white' }} />,
  patientCare: <LocalHospitalIcon sx={{ fontSize: 16, color: 'white' }} />,
  quality: <VerifiedIcon sx={{ fontSize: 16, color: 'white' }} />,
  referrals: <AssignmentIcon sx={{ fontSize: 16, color: 'white' }} />,
  placeholder: <PersonIcon sx={{ fontSize: 16, color: 'white' }} />,
}

function AgentCategoryIcon({ category, size = 24 }: { category: AgentCategory; size?: number }) {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.placeholder
  const background = `linear-gradient(to right, ${colors.dark}, ${colors.light})`

  return (
    <Box
      sx={{
        width: size,
        height: size,
        background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
      }}
    >
      {categoryIcons[category] || categoryIcons.placeholder}
    </Box>
  )
}

// ============================================================================
// Filter Chip
// ============================================================================

function FilterChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 3,
        py: 1.5,
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        bgcolor: 'white',
        cursor: 'pointer',
        '&:hover': { bgcolor: '#f9fafb' },
      }}
    >
      {icon}
      <Text sx={{ fontSize: '0.875rem', color: '#374151' }}>{label}</Text>
    </Box>
  )
}

// ============================================================================
// Status Chip
// ============================================================================

const statusColors: Record<FlowStatus, { bg: string; text: string }> = {
  draft: { bg: '#f3f4f6', text: '#374151' },
  review: { bg: '#fef3c7', text: '#92400e' },
  published: { bg: '#d1fae5', text: '#065f46' },
  archived: { bg: '#f3f4f6', text: '#6b7280' },
}

function StatusChip({ status }: { status: FlowStatus }) {
  const colors = statusColors[status]
  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      size="small"
      sx={{
        bgcolor: colors.bg,
        color: colors.text,
        fontSize: '0.75rem',
        height: 24,
        textTransform: 'capitalize',
      }}
    />
  )
}

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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(100)

  const { agentsWithFlows, isLoading } = useAgents()

  // Filter agents based on tab
  const filteredAgents = useMemo(() => {
    if (activeTab === 'all') return agentsWithFlows

    return agentsWithFlows
      .map((agent) => ({
        ...agent,
        flows: agent.flows.filter((f) => f.status === activeTab),
      }))
      .filter((agent) => agent.flows.length > 0)
  }, [agentsWithFlows, activeTab])

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const formatValue = (value: number) => (value > 0 ? `$${value}` : '$0')
  const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString() : '')

  if (isLoading) {
    return (
      <Box sx={{ p: 6 }}>
        <Stack spacing={2}>
          <Skeleton variant="rectangular" height={64} />
          <Skeleton variant="rectangular" height={48} />
          <Skeleton variant="rectangular" height={400} />
        </Stack>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#ffffff' }}>
      {/* Header */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 6,
          bgcolor: 'white',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Title component="h1" sx={{ fontSize: '1.5rem', fontWeight: 600 }}>
          Flows
        </Title>
        <Stack direction="row" spacing={2}>
          <Box
            component="button"
            sx={{
              px: 4,
              py: 2,
              borderRadius: '4px',
              border: '1px solid #0061FF',
              bgcolor: 'white',
              color: '#0061FF',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': { bgcolor: '#f0f7ff' },
            }}
          >
            Explore Templates
          </Box>
          <Box
            component="button"
            sx={{
              px: 4,
              py: 2,
              borderRadius: '4px',
              border: 'none',
              bgcolor: '#0061FF',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': { bgcolor: '#0052D9' },
            }}
          >
            Create Flow
          </Box>
        </Stack>
      </Box>

      {/* Filters */}
      <Box sx={{ px: 6, py: 3, bgcolor: 'white' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <FilterChip icon={<Plus size={14} />} label="Organization" />
          <FilterChip icon={<Plus size={14} />} label="Agent" />
          <FilterChip icon={<Plus size={14} />} label="Created by" />
          <TextField
            size="small"
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="#9ca3af" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                bgcolor: '#f9fafb',
                '& fieldset': { borderColor: '#e5e7eb' },
              },
            }}
          />
        </Stack>
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 6 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              color: '#6b7280',
              minHeight: 48,
              '&.Mui-selected': { color: '#002766' },
            },
            '& .MuiTabs-indicator': { backgroundColor: '#1d4ed8' },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} value={tab.id} />
          ))}
        </Tabs>
      </Box>

      {/* Table */}
      <Box sx={{ flex: 1, px: 6, py: 0 }}>
        <TableContainer sx={{ bgcolor: 'white', border: '1px solid #e5e7eb', borderTop: 'none' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f9fafb' }}>
                <TableCell sx={{ fontWeight: 500, color: '#374151', width: '40%' }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Text sx={{ fontWeight: 500 }}>Agent / Flow</Text>
                    <Box sx={{ color: '#9ca3af' }}>↑</Box>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: '#374151', width: '10%' }}>
                  <Text sx={{ fontWeight: 500 }}>Status</Text>
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: '#374151', width: '15%' }}>
                  <Text sx={{ fontWeight: 500 }}>Created by</Text>
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: '#374151', width: '12%' }}>
                  <Text sx={{ fontWeight: 500 }}>Last Run</Text>
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: '#374151', width: '10%', textAlign: 'right' }}>
                  <Tooltip title="Flow runs update in real time. Values represent all-time totals.">
                    <Stack direction="row" alignItems="center" gap={0.5} justifyContent="flex-end">
                      <Text sx={{ fontWeight: 500 }}>Flow Runs</Text>
                      <InfoOutlinedIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                    </Stack>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: '#374151', width: '8%', textAlign: 'right' }}>
                  <Tooltip title="Value data refreshes about every 12 hours. Values represent all-time data.">
                    <Stack direction="row" alignItems="center" gap={0.5} justifyContent="flex-end">
                      <Text sx={{ fontWeight: 500 }}>Value</Text>
                      <InfoOutlinedIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                    </Stack>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ width: '5%' }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAgents.map((agent) => (
                <React.Fragment key={agent.id}>
                  {/* Agent Row */}
                  <TableRow
                    sx={{ bgcolor: '#f9fafb', '&:hover': { bgcolor: '#f3f4f6' }, cursor: 'pointer' }}
                    onClick={() => toggleRow(agent.id)}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: '#6b7280',
                            transform: expandedRows.has(agent.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.1s ease-in-out',
                          }}
                        >
                          <ChevronDown size={16} />
                        </Box>
                        <AgentCategoryIcon category={agent.category} />
                        <Text sx={{ fontWeight: 600 }}>{agent.name}</Text>
                        <Text sx={{ color: '#6b7280', fontWeight: 400 }}>[{agent.organization.name}]</Text>
                      </Stack>
                    </TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell>
                      <Text sx={{ color: '#374151' }}>{formatDate(agent.lastRunAt)}</Text>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Text sx={{ color: '#374151' }}>{agent.totalRuns.toLocaleString()}</Text>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Text sx={{ color: '#374151' }}>{formatValue(agent.totalValue)}</Text>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <MoreHorizontal size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Child Flow Rows */}
                  {expandedRows.has(agent.id) &&
                    agent.flows.map((flow) => (
                      <TableRow key={flow.id} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 6 }}>
                            <Text>{flow.name}</Text>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={flow.status} />
                        </TableCell>
                        <TableCell>
                          <Text sx={{ color: '#374151' }}>{flow.createdById}</Text>
                        </TableCell>
                        <TableCell>
                          <Text sx={{ color: '#374151' }}>{formatDate(flow.lastRunAt)}</Text>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Text sx={{ color: '#374151' }}>{flow.flowRuns}</Text>
                        </TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>
                          <Text sx={{ color: '#374151' }}>{formatValue(flow.value)}</Text>
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box
          sx={{
            bgcolor: 'white',
            borderLeft: '1px solid #e5e7eb',
            borderRight: '1px solid #e5e7eb',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <TablePagination
            component="div"
            count={-1}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            labelDisplayedRows={() => `1–${filteredAgents.length} of ${filteredAgents.length}`}
            rowsPerPageOptions={[25, 50, 100]}
          />
        </Box>
      </Box>
    </Box>
  )
}
