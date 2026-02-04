import { Box, Stack } from '@mui/material'
import { Title, Text } from '@vivaahealth/design-system'
import { Construction } from 'lucide-react'

interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        p: 4,
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Construction size={40} color="#64748b" />
        </Box>
        <Title component="h1">{title}</Title>
        <Text sx={{ color: 'text.secondary', maxWidth: 400 }}>
          This page is a placeholder. Build out this feature by creating components in{' '}
          <code style={{ background: '#f1f5f9', padding: '2px 4px', borderRadius: 4 }}>
            src/routes/{title.toLowerCase().replace(/\s+/g, '-')}/
          </code>
        </Text>
      </Stack>
    </Box>
  )
}
