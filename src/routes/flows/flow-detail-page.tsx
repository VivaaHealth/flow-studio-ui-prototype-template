import { useParams, Link } from 'react-router-dom'
import { Box, Stack, Breadcrumbs, Skeleton } from '@mui/material'
import { Title, Text } from '@vivaahealth/design-system'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { useFlow } from '@/lib/hooks'
import { getAgentById } from '@/lib/mock-data/fixtures'

export function FlowDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { flow, isLoading } = useFlow(id)

  if (isLoading) {
    return (
      <Box sx={{ p: 6 }}>
        <Stack spacing={3}>
          <Skeleton variant="text" width={200} height={24} />
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="rectangular" height={400} />
        </Stack>
      </Box>
    )
  }

  if (!flow) {
    return (
      <Box sx={{ p: 6 }}>
        <Stack spacing={2}>
          <Link to="/flows" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0061FF', textDecoration: 'none' }}>
            <ArrowLeft size={16} />
            <Text>Back to Flows</Text>
          </Link>
          <Title component="h1">Flow not found</Title>
          <Text sx={{ color: 'text.secondary' }}>
            The flow you're looking for doesn't exist or has been deleted.
          </Text>
        </Stack>
      </Box>
    )
  }

  const agent = getAgentById(flow.agentId)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ px: 6, py: 3, borderBottom: '1px solid #e5e7eb' }}>
        <Breadcrumbs separator={<ChevronRight size={14} color="#9ca3af" />} sx={{ mb: 2 }}>
          <Link to="/flows" style={{ color: '#6b7280', textDecoration: 'none' }}>
            <Text variant="paragraph-small">Flows</Text>
          </Link>
          {agent && (
            <Text variant="paragraph-small" sx={{ color: '#6b7280' }}>
              {agent.name}
            </Text>
          )}
          <Text variant="paragraph-small" sx={{ color: '#111827' }}>
            {flow.name}
          </Text>
        </Breadcrumbs>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Title component="h1">{flow.name}</Title>
          <Stack direction="row" spacing={2}>
            <Box
              component="button"
              sx={{
                px: 4,
                py: 2,
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                bgcolor: 'white',
                color: '#374151',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f9fafb' },
              }}
            >
              Edit Flow
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
                '&:hover': { bgcolor: '#0052D9' },
              }}
            >
              Run Flow
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, p: 6 }}>
        <Stack spacing={4}>
          {/* Flow Details Card */}
          <Box sx={{ p: 4, border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <Title component="h2" sx={{ mb: 3, fontSize: '1.125rem' }}>
              Flow Details
            </Title>
            <Stack spacing={2}>
              <Stack direction="row" spacing={4}>
                <Box sx={{ minWidth: 150 }}>
                  <Text variant="paragraph-small" sx={{ color: '#6b7280' }}>
                    Status
                  </Text>
                  <Text sx={{ textTransform: 'capitalize' }}>{flow.status}</Text>
                </Box>
                <Box sx={{ minWidth: 150 }}>
                  <Text variant="paragraph-small" sx={{ color: '#6b7280' }}>
                    Total Runs
                  </Text>
                  <Text>{flow.flowRuns.toLocaleString()}</Text>
                </Box>
                <Box sx={{ minWidth: 150 }}>
                  <Text variant="paragraph-small" sx={{ color: '#6b7280' }}>
                    Value
                  </Text>
                  <Text>${flow.value}</Text>
                </Box>
              </Stack>
              <Stack direction="row" spacing={4}>
                <Box sx={{ minWidth: 150 }}>
                  <Text variant="paragraph-small" sx={{ color: '#6b7280' }}>
                    Last Run
                  </Text>
                  <Text>{flow.lastRunAt ? new Date(flow.lastRunAt).toLocaleString() : 'Never'}</Text>
                </Box>
                <Box sx={{ minWidth: 150 }}>
                  <Text variant="paragraph-small" sx={{ color: '#6b7280' }}>
                    Created
                  </Text>
                  <Text>{new Date(flow.createdAt).toLocaleDateString()}</Text>
                </Box>
                <Box sx={{ minWidth: 150 }}>
                  <Text variant="paragraph-small" sx={{ color: '#6b7280' }}>
                    Updated
                  </Text>
                  <Text>{new Date(flow.updatedAt).toLocaleDateString()}</Text>
                </Box>
              </Stack>
              {flow.description && (
                <Box>
                  <Text variant="paragraph-small" sx={{ color: '#6b7280' }}>
                    Description
                  </Text>
                  <Text>{flow.description}</Text>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Placeholder for flow builder/editor */}
          <Box
            sx={{
              p: 4,
              border: '1px solid #e5e7eb',
              borderRadius: 2,
              bgcolor: '#f9fafb',
              minHeight: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Stack spacing={2} alignItems="center">
              <Text sx={{ color: '#6b7280' }}>
                Flow Editor Canvas
              </Text>
              <Text variant="paragraph-small" sx={{ color: '#9ca3af' }}>
                Build out the flow editor component here
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
