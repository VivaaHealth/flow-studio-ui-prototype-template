import { useParams, Link } from 'react-router-dom'
import { Stack, Skeleton } from '@mui/material'
import { Text, Title } from '@vivaahealth/design-system'
import { ArrowLeft } from 'lucide-react'
import { useFlow } from '@/lib/hooks'
import { PageLayout } from '@/components/page-layout'
import { EmptyState } from '@/components/empty-state'

export function FlowDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { flow, isLoading } = useFlow(id)

  if (isLoading) {
    return (
      <PageLayout breadcrumbs={[{ label: 'Flows' }]}>
        <Stack spacing={3}>
          <Skeleton variant="text" width={200} height={24} />
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="rectangular" height={400} />
        </Stack>
      </PageLayout>
    )
  }

  if (!flow) {
    return (
      <PageLayout breadcrumbs={[{ label: 'Flows' }]}>
        <Stack spacing={2}>
          <Link to="/flows" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0061FF', textDecoration: 'none' }}>
            <ArrowLeft size={16} />
            <Text>Back to Flows</Text>
          </Link>
          <Title component="h1" sx={{ fontSize: '20px' }}>Flow not found</Title>
          <Text sx={{ color: 'text.secondary' }}>
            The flow you're looking for doesn't exist or has been deleted.
          </Text>
        </Stack>
      </PageLayout>
    )
  }

  const breadcrumbs = [
    { label: 'Flows', to: '/flows' },
    { label: flow.name },
  ]

  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <EmptyState />
    </PageLayout>
  )
}
