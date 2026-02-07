import React from 'react'
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { Text } from '@vivaahealth/design-system'
import { useNavigate } from 'react-router-dom'
import { Tag } from '@/components/tag'

// ============================================================================
// Types
// ============================================================================

export type EntityType =
  | 'Patients'
  | 'Encounters'
  | 'Orders'
  | 'Documents'
  | 'Conversations'
  | 'Practices'
  | 'Providers'
  | 'Appointment Types'
  | 'Procedures'
  | 'Devices'
  | 'Service Requests'
  | 'Claims'
  | 'Payments'
  | 'Invoices'
  | 'Test Results'

export interface Connector {
  id: string
  name: string
  logo?: string
  useCase: string
  source: string
  destination?: string
  connectivity: string
  format: string
  status: 'active' | 'in-setup' | 'inactive' | 'error'
  errorCount?: number
  lastActivity?: string
  entities: EntityType[]
}

export interface ConnectorsTableProps {
  connectors: Connector[]
}

// ============================================================================
// URL Slug Generation
// ============================================================================

function createSlug(text: string): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

export function generateConnectorSlug(connector: Connector): string {
  const parts = [
    connector.name,
    connector.useCase,
    connector.source,
    connector.connectivity,
    connector.format,
  ]
  return parts.map(createSlug).filter(Boolean).join('-')
}

// ============================================================================
// Connectors Table
// ============================================================================

export const statusVariantMap: Record<Connector['status'], 'success' | 'warning' | 'error' | 'default'> = {
  active: 'success',
  'in-setup': 'warning',
  inactive: 'warning',
  error: 'error',
}

export function formatStatusLabel(status: Connector['status'], errorCount?: number): string {
  if (status === 'error' && errorCount) {
    return `${errorCount} Issue${errorCount > 1 ? 's' : ''}`
  }
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ')
}

export function ConnectorsTable({ connectors }: ConnectorsTableProps) {
  const navigate = useNavigate()

  const handleRowClick = (connector: Connector, e: React.MouseEvent) => {
    e.stopPropagation()
    const slug = generateConnectorSlug(connector)
    navigate(`/connections/${slug}`)
  }

  return (
    <Box sx={{ flex: 1, paddingLeft: 6, paddingRight: '20px', py: 0 }}>
      <Box sx={{ bgcolor: 'white', border: '1px solid #D9D9D9', borderRadius: '8px', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
            <colgroup>
              <col style={{ width: '200px' }} />
              <col style={{ width: '150px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: '180px' }} />
            </colgroup>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F7F7F7', minHeight: '48px', height: '48px' }}>
                <TableCell sx={{ fontWeight: 600, color: '#3F3F3F', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                  <Text sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Connector Name</Text>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3F3F3F', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
                  <Text sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Use Case</Text>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3F3F3F', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '120px' }}>
                  <Text sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Source</Text>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3F3F3F', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '120px' }}>
                  <Text sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Connectivity</Text>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3F3F3F', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '100px' }}>
                  <Text sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Format</Text>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3F3F3F', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '100px' }}>
                  <Text sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Status</Text>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#3F3F3F', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '180px', textAlign: 'right' }}>
                  <Text sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Last Activity</Text>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {connectors.map((connector) => (
                <TableRow
                  key={connector.id}
                  onClick={(e) => handleRowClick(connector, e)}
                  sx={{ bgcolor: 'white', '&:hover': { bgcolor: '#f9fafb' }, minHeight: '48px', height: '48px', cursor: 'pointer' }}
                >
                  <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                    <Stack direction="row" alignItems="center" spacing={0} sx={{ minWidth: 0 }}>
                      {connector.logo && (
                        <Box
                          component="img"
                          src={connector.logo}
                          alt=""
                          sx={{
                            width: 24,
                            height: 24,
                            flexShrink: 0,
                            objectFit: 'contain',
                            marginRight: '8px',
                          }}
                        />
                      )}
                      <Text sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                        {connector.name}
                      </Text>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '150px' }}>
                    <Text sx={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {connector.useCase}
                    </Text>
                  </TableCell>
                  <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '120px' }}>
                    <Text sx={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {connector.source}
                    </Text>
                  </TableCell>
                  <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '120px' }}>
                    <Text sx={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {connector.connectivity}
                    </Text>
                  </TableCell>
                  <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '100px' }}>
                    <Text sx={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {connector.format}
                    </Text>
                  </TableCell>
                  <TableCell sx={{ verticalAlign: 'middle', width: '100px' }}>
                    <Tag
                      variant={statusVariantMap[connector.status]}
                      label={formatStatusLabel(connector.status, connector.errorCount)}
                    />
                  </TableCell>
                  <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle', width: '180px', textAlign: 'right' }}>
                    <Text sx={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {connector.lastActivity || 'None'}
                    </Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}
