import { Box, Stack, Skeleton } from '@mui/material'

export interface LoadingStateProps {
  /**
   * Number of skeleton items to show
   * @default 3
   */
  items?: number
  /**
   * Whether to show a full page loading layout
   * @default false
   */
  fullPage?: boolean
}

/**
 * A reusable loading state component with skeleton loaders
 */
export function LoadingState({ items = 3, fullPage = false }: LoadingStateProps) {
  const content = (
    <Stack spacing={3}>
      <Skeleton variant="rectangular" height={64} />
      <Skeleton variant="rectangular" height={48} />
      {Array.from({ length: items }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={400} />
      ))}
    </Stack>
  )

  if (fullPage) {
    return (
      <Box sx={{ p: 6 }}>
        {content}
      </Box>
    )
  }

  return content
}
