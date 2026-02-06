import React, { useState } from 'react'
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
  Tooltip,
} from '@mui/material'
import { Text } from '@vivaahealth/design-system'
import { ChevronDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import PhoneIcon from '@mui/icons-material/Phone'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ScienceIcon from '@mui/icons-material/Science'
import PersonIcon from '@mui/icons-material/Person'
import VerifiedIcon from '@mui/icons-material/Verified'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import { CATEGORY_COLORS, type AgentCategory, type FlowStatus, type AgentWithFlows } from '@/lib/types/entities'
import { Tag, type TagVariant } from '@/components/tag'

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
// Status Chip
// ============================================================================

const statusVariantMap: Record<FlowStatus, TagVariant> = {
  draft: 'default',
  review: 'info',
  published: 'success',
  archived: 'default',
}

function StatusChip({ status }: { status: FlowStatus }) {
  return (
    <Tag
      variant={statusVariantMap[status]}
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      sx={{ textTransform: 'capitalize' }}
    />
  )
}

// ============================================================================
// Flows Table
// ============================================================================

export interface FlowsTableProps {
  agents: AgentWithFlows[]
  onFlowClick?: (flowId: string) => void
}

type SortField = 'name' | 'runs' | 'lastRun' | 'value' | null
type SortDirection = 'asc' | 'desc'

export function FlowsTable({ agents, onFlowClick }: FlowsTableProps) {
  const navigate = useNavigate()
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(100)
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const handleFlowRowClick = (flowId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/flows/${flowId}`)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
    setPage(0) // Reset to first page when sorting changes
  }

  const formatValue = (value: number) => (value > 0 ? `$${value}` : '$0')
  const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString() : '')

  // Sort agents
  const sortedAgents = [...agents].sort((a, b) => {
    if (!sortField) return 0

    let comparison = 0

    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'runs':
        comparison = a.totalRuns - b.totalRuns
        break
      case 'lastRun':
        const aDate = a.lastRunAt ? new Date(a.lastRunAt).getTime() : 0
        const bDate = b.lastRunAt ? new Date(b.lastRunAt).getTime() : 0
        comparison = aDate - bDate
        break
      case 'value':
        comparison = a.totalValue - b.totalValue
        break
    }

    return sortDirection === 'asc' ? comparison : -comparison
  })

  const paginatedAgents = sortedAgents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  const totalRows = sortedAgents.length

  return (
    <Box sx={{ flex: 1, paddingLeft: 6, paddingRight: '20px', py: 0, marginTop: '16px' }}>
      <Box sx={{ bgcolor: 'white', border: '1px solid #D9D9D9', borderRadius: '8px', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
          <colgroup>
            <col />
            <col style={{ width: '100px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '100px' }} />
          </colgroup>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F7F7F7', minHeight: '48px', height: '48px' }}>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: '#3F3F3F', 
                  whiteSpace: 'nowrap', 
                  verticalAlign: 'middle',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f0f0f0' }
                }}
                onClick={() => handleSort('name')}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Text sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Agent / Flow</Text>
                  <Box sx={{ color: '#9ca3af', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    {sortField === 'name' ? (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : (
                      <Box sx={{ width: 14, height: 14 }} />
                    )}
                  </Box>
                </Stack>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#3F3F3F', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '100px' }}>
                <Text sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Status</Text>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#3F3F3F', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '120px' }}>
                <Text sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Created by</Text>
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: '#3F3F3F', 
                  whiteSpace: 'nowrap', 
                  verticalAlign: 'middle',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f0f0f0' },
                  width: '120px'
                }}
                onClick={() => handleSort('lastRun')}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Text sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Last Run</Text>
                  <Box sx={{ color: '#9ca3af', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    {sortField === 'lastRun' ? (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    ) : (
                      <Box sx={{ width: 14, height: 14 }} />
                    )}
                  </Box>
                </Stack>
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: '#3F3F3F', 
                  textAlign: 'right', 
                  whiteSpace: 'nowrap', 
                  verticalAlign: 'middle',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f0f0f0' },
                  width: '120px'
                }}
                onClick={() => handleSort('runs')}
              >
                <Tooltip title="Flow runs update in real time. Values represent all-time totals.">
                  <Stack direction="row" alignItems="center" gap={0.5} justifyContent="flex-end">
                    <Box sx={{ color: '#9ca3af', flexShrink: 0, display: 'flex', alignItems: 'center', mr: 0.5 }}>
                      {sortField === 'runs' ? (
                        sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      ) : (
                        <Box sx={{ width: 14, height: 14 }} />
                      )}
                    </Box>
                    <Text sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Flow Runs</Text>
                    <InfoOutlinedIcon sx={{ fontSize: 14, color: '#9ca3af', flexShrink: 0 }} />
                  </Stack>
                </Tooltip>
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: '#3F3F3F', 
                  textAlign: 'right', 
                  whiteSpace: 'nowrap', 
                  verticalAlign: 'middle',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f0f0f0' },
                  width: '100px'
                }}
                onClick={() => handleSort('value')}
              >
                <Tooltip title="Value data refreshes about every 12 hours. Values represent all-time data.">
                  <Stack direction="row" alignItems="center" gap={0.5} justifyContent="flex-end">
                    <Box sx={{ color: '#9ca3af', flexShrink: 0, display: 'flex', alignItems: 'center', mr: 0.5 }}>
                      {sortField === 'value' ? (
                        sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      ) : (
                        <Box sx={{ width: 14, height: 14 }} />
                      )}
                    </Box>
                    <Text sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Value</Text>
                    <InfoOutlinedIcon sx={{ fontSize: 14, color: '#9ca3af', flexShrink: 0 }} />
                  </Stack>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAgents.map((agent) => (
              <React.Fragment key={agent.id}>
                {/* Agent Row */}
                <TableRow
                  sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f9fafb' }, cursor: 'pointer', minHeight: '48px', height: '48px' }}
                  onClick={() => toggleRow(agent.id)}
                >
                  <TableCell 
                    colSpan={3}
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}
                  >
                    <Stack direction="row" alignItems="center" spacing={0} sx={{ minWidth: 0 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: '#6b7280',
                          transform: expandedRows.has(agent.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.1s ease-in-out',
                          flexShrink: 0,
                        }}
                      >
                        <ChevronDown size={16} />
                      </Box>
                      <Box sx={{ flexShrink: 0, marginLeft: '8px', marginRight: '8px' }}>
                        <AgentCategoryIcon category={agent.category} />
                      </Box>
                      <Text sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{agent.name}</Text>
                      <Text sx={{ color: '#6b7280', fontWeight: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, marginLeft: '4px' }}>[{agent.organization.name}]</Text>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '120px' }}>
                    <Text sx={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formatDate(agent.lastRunAt)}</Text>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '120px' }}>
                    <Text sx={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.totalRuns.toLocaleString()}</Text>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '100px' }}>
                    <Text sx={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formatValue(agent.totalValue)}</Text>
                  </TableCell>
                </TableRow>

                {/* Child Flow Rows */}
                {expandedRows.has(agent.id) &&
                  agent.flows.map((flow) => (
                    <TableRow 
                      key={flow.id} 
                      onClick={(e) => handleFlowRowClick(flow.id, e)}
                      sx={{ 
                        bgcolor: 'white', 
                        '&:hover': { bgcolor: '#f9fafb' }, 
                        minHeight: '48px', 
                        height: '48px',
                        cursor: 'pointer',
                      }}
                    >
                      <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                        <Stack direction="row" alignItems="center" spacing={0} sx={{ minWidth: 0 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              flexShrink: 0,
                              width: '16px',
                              height: '16px',
                            }}
                          />
                          <Box sx={{ flexShrink: 0, marginLeft: '8px', marginRight: '8px', width: '24px', height: '24px' }} />
                          <Text
                            sx={{
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              minWidth: 0,
                            }}
                          >
                            {flow.name}
                          </Text>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'middle', width: '100px' }}>
                        <StatusChip status={flow.status} />
                      </TableCell>
                      <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '120px' }}>
                        <Text sx={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{flow.createdById}</Text>
                      </TableCell>
                      <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '120px' }}>
                        <Text sx={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formatDate(flow.lastRunAt)}</Text>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '120px' }}>
                        <Text sx={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{flow.flowRuns}</Text>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '100px' }}>
                        <Text sx={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formatValue(flow.value)}</Text>
                      </TableCell>
                    </TableRow>
                  ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ bgcolor: 'white' }}>
          <TablePagination
            component="div"
            count={totalRows}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`}
            rowsPerPageOptions={[25, 50, 100]}
          />
        </Box>
      </Box>
    </Box>
  )
}
