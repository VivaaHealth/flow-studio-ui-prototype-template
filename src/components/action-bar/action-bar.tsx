import React from 'react'
import { Box, Stack, Breadcrumbs, Button } from '@mui/material'
import { Title, Text } from '@vivaahealth/design-system'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export interface ActionButton {
  label: string
  variant?: 'contained' | 'outlined' | 'text'
  color?: 'primary' | 'secondary'
  startIcon?: React.ReactNode
  onClick?: () => void
  sx?: Record<string, any>
}

export interface ActionBarProps {
  title?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: ActionButton[]
  children?: React.ReactNode
}

export function ActionBar({ title, breadcrumbs, actions, children }: ActionBarProps) {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: 6,
        paddingTop: '12px',
        paddingBottom: '12px',
        bgcolor: 'white',
        borderBottom: '1px solid #D9D9D9',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '32px' }}>
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <Breadcrumbs separator={<ChevronRight size={14} color="#9ca3af" />}>
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1
                return crumb.to && !isLast ? (
                  <Link 
                    key={index} 
                    to={crumb.to} 
                    style={{ textDecoration: 'none' }}
                  >
                    <Text 
                      variant="paragraph-small" 
                      sx={{ 
                        fontSize: '20px', 
                        fontWeight: 600,
                        lineHeight: '125%',
                        color: '#737373',
                        '&:hover': {
                          color: '#3F3F3F',
                        },
                      }}
                    >
                      {crumb.label}
                    </Text>
                  </Link>
                ) : (
                  <Text
                    key={index}
                    variant="paragraph-small"
                    sx={{ 
                      color: isLast ? '#111827' : '#737373', 
                      fontSize: '20px',
                      fontWeight: 600,
                      lineHeight: '125%',
                    }}
                  >
                    {crumb.label}
                  </Text>
                )
              })}
            </Breadcrumbs>
          ) : (
            <>
              {title && (
                <Title component="h1" sx={{ fontSize: '20px', fontWeight: 600, lineHeight: '125%' }}>
                  {title}
                </Title>
              )}
              {children}
            </>
          )}
        </Box>
        {actions && actions.length > 0 && (
          <Stack direction="row" spacing={2}>
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'contained'}
                color={action.color || 'primary'}
                startIcon={action.startIcon}
                onClick={action.onClick}
                sx={action.sx}
              >
                {action.label}
              </Button>
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
