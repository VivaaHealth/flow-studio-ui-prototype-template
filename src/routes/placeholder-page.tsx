import { PageLayout } from '@/components/page-layout'
import { EmptyState } from '@/components/empty-state'

interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <PageLayout breadcrumbs={[{ label: title }]}>
      <EmptyState />
    </PageLayout>
  )
}
