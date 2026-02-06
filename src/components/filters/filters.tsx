import React from 'react'
import { Box, Stack, TextField, InputAdornment, Divider } from '@mui/material'
import { Text } from '@vivaahealth/design-system'
import { Search } from 'lucide-react'

export interface FilterChipItem {
  id: string
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

export interface FiltersProps {
  chips?: FilterChipItem[]
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  showSearch?: boolean
}

function FilterChip({ icon, label, active = false, onClick }: FilterChipItem) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 3,
        py: 1.5,
        borderRadius: '20px',
        maxHeight: 32,
        border: active ? '1px solid #BFBFBF' : '1px dashed #BFBFBF',
        borderStyle: active ? 'solid' : 'dashed',
        bgcolor: 'white',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': { bgcolor: '#f9fafb' },
      }}
    >
      {icon}
      <Text
        sx={{
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 600,
          letterSpacing: '0.0025em',
          color: '#374151',
        }}
      >
        {label}
      </Text>
    </Box>
  )
}

export function Filters({ chips = [], searchPlaceholder = 'Search', searchValue, onSearchChange, showSearch = true }: FiltersProps) {
  const hasFilters = chips.length > 0 || showSearch

  if (!hasFilters) {
    return null
  }

  return (
    <Box sx={{ paddingLeft: 6, paddingRight: '20px', py: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        {chips.map((chip) => (
          <FilterChip key={chip.id} {...chip} />
        ))}
        {chips.length > 0 && showSearch && (
          <Box sx={{ display: 'flex', alignItems: 'center', height: 32, paddingX: '2px' }}>
            <Divider orientation="vertical" sx={{ borderColor: '#e5e7eb', height: '50%', alignSelf: 'center' }} />
          </Box>
        )}
        {showSearch && (
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={searchValue || ''}
            onChange={(e) => onSearchChange?.(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="#9ca3af" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 200,
              maxHeight: 32,
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                bgcolor: 'white',
                maxHeight: 32,
                '& fieldset': { borderColor: '#BFBFBF', borderStyle: 'solid' },
                '& input::placeholder': {
                  fontStyle: 'italic',
                },
              },
            }}
          />
        )}
      </Stack>
    </Box>
  )
}
