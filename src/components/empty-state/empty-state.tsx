import { Box, Stack } from '@mui/material'
import { Text } from '@vivaahealth/design-system'

export interface EmptyStateProps {
  /**
   * Main message to display
   * @default "No content available"
   */
  message?: string
  /**
   * Subtitle or description
   * @default "This page is under construction"
   */
  description?: string
  /**
   * Minimum height of the empty state container
   * @default "400px"
   */
  minHeight?: string
}

/**
 * A reusable empty state component for pages with no content
 */
export function EmptyState({
  message = 'No content available',
  description = 'This page is under construction',
  minHeight = '400px',
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Text sx={{ color: '#6b7280', fontSize: '1rem' }}>{message}</Text>
        <Text variant="paragraph-small" sx={{ color: '#9ca3af' }}>
          {description}
        </Text>
      </Stack>
    </Box>
  )
}
