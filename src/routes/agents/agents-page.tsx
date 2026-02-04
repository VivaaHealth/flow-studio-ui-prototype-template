import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Stack,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Skeleton,
  Chip,
} from '@mui/material'
import { Title, Text } from '@vivaahealth/design-system'
import { Search, Plus, ArrowRight } from 'lucide-react'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import PhoneIcon from '@mui/icons-material/Phone'
import AssignmentIcon from '@mui/icons-material/Assignment'
import ScienceIcon from '@mui/icons-material/Science'
import PersonIcon from '@mui/icons-material/Person'
import VerifiedIcon from '@mui/icons-material/Verified'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'

import { useAgents } from '@/lib/hooks'
import { CATEGORY_COLORS, CATEGORY_LABELS, type AgentCategory } from '@/lib/types/entities'

// ============================================================================
// Category Icons
// ============================================================================

const categoryIcons: Record<AgentCategory, React.ReactNode> = {
  rcm: <AttachMoneyIcon sx={{ fontSize: 20, color: 'white' }} />,
  authorization: <VerifiedIcon sx={{ fontSize: 20, color: 'white' }} />,
  callCenter: <PhoneIcon sx={{ fontSize: 20, color: 'white' }} />,
  chartScrubbing: <AssignmentIcon sx={{ fontSize: 20, color: 'white' }} />,
  clinicalTrials: <ScienceIcon sx={{ fontSize: 20, color: 'white' }} />,
  frontDesk: <PersonIcon sx={{ fontSize: 20, color: 'white' }} />,
  inpatientCare: <LocalHospitalIcon sx={{ fontSize: 20, color: 'white' }} />,
  medicationAdherence: <MedicalServicesIcon sx={{ fontSize: 20, color: 'white' }} />,
  patient: <PersonIcon sx={{ fontSize: 20, color: 'white' }} />,
  patientCare: <LocalHospitalIcon sx={{ fontSize: 20, color: 'white' }} />,
  quality: <VerifiedIcon sx={{ fontSize: 20, color: 'white' }} />,
  referrals: <AssignmentIcon sx={{ fontSize: 20, color: 'white' }} />,
  placeholder: <PersonIcon sx={{ fontSize: 20, color: 'white' }} />,
}

function AgentCategoryIcon({ category, size = 40 }: { category: AgentCategory; size?: number }) {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.placeholder
  const background = `linear-gradient(135deg, ${colors.dark}, ${colors.light})`

  return (
    <Box
      sx={{
        width: size,
        height: size,
        background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {categoryIcons[category] || categoryIcons.placeholder}
    </Box>
  )
}

// ============================================================================
// Main Page
// ============================================================================

export function AgentsPage() {
  const [search, setSearch] = useState('')
  const { agentsWithFlows, isLoading } = useAgents()

  const filteredAgents = agentsWithFlows.filter(
    (agent) =>
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.organization.name.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) {
    return (
      <Box sx={{ p: 6 }}>
        <Stack spacing={3}>
          <Skeleton variant="rectangular" height={64} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f9fafb' }}>
      {/* Header */}
      <Box
        sx={{
          px: 6,
          py: 3,
          bgcolor: 'white',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Title component="h1">Agents</Title>
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
            <Plus size={16} />
            Create Agent
          </Box>
        </Stack>

        <TextField
          size="small"
          placeholder="Search agents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} color="#9ca3af" />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 300,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              bgcolor: '#f9fafb',
              '& fieldset': { borderColor: '#e5e7eb' },
            },
          }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, p: 6 }}>
        <Grid container spacing={3}>
          {filteredAgents.map((agent) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={agent.id}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    {/* Header */}
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <AgentCategoryIcon category={agent.category} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Text
                          sx={{
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {agent.name}
                        </Text>
                        <Text
                          variant="paragraph-small"
                          sx={{
                            color: '#6b7280',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {agent.organization.name}
                        </Text>
                      </Box>
                    </Stack>

                    {/* Category & Status */}
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label={CATEGORY_LABELS[agent.category]}
                        size="small"
                        sx={{
                          bgcolor: '#f3f4f6',
                          color: '#374151',
                          fontSize: '0.7rem',
                          height: 22,
                        }}
                      />
                      <Chip
                        label={agent.status}
                        size="small"
                        sx={{
                          bgcolor: agent.status === 'active' ? '#d1fae5' : '#f3f4f6',
                          color: agent.status === 'active' ? '#065f46' : '#6b7280',
                          fontSize: '0.7rem',
                          height: 22,
                          textTransform: 'capitalize',
                        }}
                      />
                    </Stack>

                    {/* Stats */}
                    <Stack direction="row" spacing={3}>
                      <Box>
                        <Text variant="paragraph-small" sx={{ color: '#9ca3af' }}>
                          Flows
                        </Text>
                        <Text sx={{ fontWeight: 600 }}>{agent.flows.length}</Text>
                      </Box>
                      <Box>
                        <Text variant="paragraph-small" sx={{ color: '#9ca3af' }}>
                          Total Runs
                        </Text>
                        <Text sx={{ fontWeight: 600 }}>{agent.totalRuns.toLocaleString()}</Text>
                      </Box>
                      {agent.totalValue > 0 && (
                        <Box>
                          <Text variant="paragraph-small" sx={{ color: '#9ca3af' }}>
                            Value
                          </Text>
                          <Text sx={{ fontWeight: 600, color: '#059669' }}>${agent.totalValue}</Text>
                        </Box>
                      )}
                    </Stack>

                    {/* View Link */}
                    <Link
                      to={`/flows?agent=${agent.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        color: '#0061FF',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      View Flows
                      <ArrowRight size={14} />
                    </Link>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredAgents.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Text sx={{ color: '#6b7280' }}>No agents found matching "{search}"</Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}
