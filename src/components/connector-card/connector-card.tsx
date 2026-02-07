import { Box, Card, CardContent, Stack } from '@mui/material'
import { Text } from '@vivaahealth/design-system'
import { ArrowDownLeft, ArrowUpRight, Plug, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Tag } from '@/components/tag'

// ============================================================================
// Types
// ============================================================================

export interface ConnectorCardProps {
  id: string
  name: string
  logo: string
  description: string
  variant: 'templates' | 'canonical'
  // Templates variant props
  direction?: 'Inbound' | 'Outbound'
  // Canonical variant props
  usage?: number
  category?: string
  // Shared props
  flowCount?: number
  onClick?: () => void
}

// ============================================================================
// Utility Functions
// ============================================================================

function formatUsage(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

// ============================================================================
// Content Components
// ============================================================================

interface TemplatesContentProps {
  name: string
  logo: string
  description: string
  direction?: 'Inbound' | 'Outbound'
  flowCount?: number
}

function TemplatesContent({ name, logo, description, direction, flowCount }: TemplatesContentProps) {
  return (
    <Stack spacing={2}>
      {/* Logo */}
      <Box
        component="img"
        src={logo}
        alt={name}
        sx={{
          maxWidth: '104px',
          maxHeight: '24px',
          minHeight: '24px',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          alignSelf: 'flex-start',
        }}
      />
      
      {/* Title */}
      <Text sx={{ fontSize: '1rem', fontWeight: 600, color: '#333333', pt: 2, }}>
        {name}
      </Text>
      
      {/* Description */}
      <Text
        sx={{
          fontSize: '0.875rem',
          color: '#4A4A4A',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {description}
      </Text>
      
      {/* Bottom Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 2, }}>
        <Tag
          variant="default"
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5}}>
              {direction === 'Inbound' ? (
                <ArrowDownLeft size={14} />
              ) : (
                <ArrowUpRight size={14} />
              )}
              <Text sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{direction}</Text>
            </Box>
          }
        />
        {flowCount !== undefined && (
          <Tag
            variant="default"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Text sx={{ fontSize: '0.75rem', fontWeight: 600 }}>+</Text>
                <Text sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{flowCount} Flows</Text>
              </Box>
            }
          />
        )}
      </Box>
    </Stack>
  )
}

interface CanonicalContentProps {
  name: string
  logo: string
  description: string
  usage?: number
  category?: string
  flowCount?: number
}

function CanonicalContent({ name, logo, description, usage, category, flowCount }: CanonicalContentProps) {
  return (
    <Stack spacing={0}>
      {/* Logo and Flow Count Tag Row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', minHeight: '24px', mb: 2 }}>
        <Box
          component="img"
          src={logo}
          alt={name}
          sx={{
            maxWidth: '104px',
            maxHeight: '24px',
            minHeight: '24px',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            alignSelf: 'flex-start',
            flexShrink: 0,
          }}
        />
        {flowCount !== undefined && (
          <Tag
            variant="success"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Plug size={14} />
                <Text sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{flowCount}</Text>
              </Box>
            }
          />
        )}
      </Box>
      
      {/* Usage and Category Row */}
      {usage !== undefined && category && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '14px', mt: '-1px' }}>
              <Download size={14} color="#737373" />
            </Box>
            <Text sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#737373', lineHeight: '14px', height: '14px', display: 'flex', alignItems: 'center' }}>
              {formatUsage(usage)}
            </Text>
          </Box>
          <Box
            sx={{
              width: '1px',
              height: '12px',
              bgcolor: '#E5E7EB',
            }}
          />
          <Text sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#737373', textTransform: 'uppercase' }}>
            {category}
          </Text>
        </Box>
      )}
      
      {/* Description */}
      <Text
        sx={{
          fontSize: '0.875rem',
          color: '#374151',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {description}
      </Text>
    </Stack>
  )
}

// ============================================================================
// Connector Card Component
// ============================================================================

export function ConnectorCard({
  id,
  name,
  logo,
  description,
  variant,
  direction,
  flowCount,
  usage,
  category,
  onClick,
}: ConnectorCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(`/connections/templates/${id}`)
    }
  }

  // Shared Card styling - consistent across variants
  const baseCardSx = {
    borderRadius: '8px',
    border: '1px solid #D9D9D9',
    bgcolor: 'white',
    cursor: 'pointer',
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none',
      bgcolor: '#FAFAFA',
    },
  }

  // Variant-specific overrides
  const cardSx =
    variant === 'templates'
      ? {
          ...baseCardSx,
          minWidth: 320,
        }
      : {
          ...baseCardSx,
          height: '100%',
        }

  return (
    <Card sx={cardSx} onClick={handleClick}>
      <CardContent sx={{ p: 4, '&:last-child': { pb: 4 } }}>
        {variant === 'templates' ? (
          <TemplatesContent
            name={name}
            logo={logo}
            description={description}
            direction={direction}
            flowCount={flowCount}
          />
        ) : (
          <CanonicalContent
            name={name}
            logo={logo}
            description={description}
            usage={usage}
            category={category}
            flowCount={flowCount}
          />
        )}
      </CardContent>
    </Card>
  )
}
