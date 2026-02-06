import { useState } from 'react'
import { Box, Stack, IconButton, Switch, FormControlLabel, Select, MenuItem, Button, Divider } from '@mui/material'
import { Text } from '@vivaahealth/design-system'
import { Settings, X, RotateCcw, Database, Zap } from 'lucide-react'
import { usePrototypeStore, type DataScenario } from '@/lib/stores'
import { clearDatabase, exportMutations } from '@/lib/db'

const DARK_BG_PRIMARY = '#030A33'
const DARK_BG_SECONDARY = '#00044B'
const DARK_TEXT_PRIMARY = '#F0F1FF'
const DARK_TEXT_SECONDARY = '#9CA3AF'
const DARK_DIVIDER = '#353B5C'
const DARK_HOVER = 'rgba(255, 255, 255, 0.1)'
const LETTER_SPACING = '0.0025em'

export function PrototypeDevTools() {
  const [isOpen, setIsOpen] = useState(false)
  const { scenario, setScenario, featureFlags, toggleFeatureFlag, resetAll } = usePrototypeStore()

  const handleResetData = async () => {
    if (confirm('This will clear all prototype data. Are you sure?')) {
      await clearDatabase()
      resetAll()
      window.location.reload()
    }
  }

  const handleExportData = async () => {
    const data = await exportMutations()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prototype-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Don't render in production
  if (import.meta.env.PROD && !featureFlags.showDevTools) {
    return null
  }

  return (
    <Box sx={{ position: 'fixed', bottom: '8px', right: 0, zIndex: 9999 }}>
      {isOpen ? (
        <Box
          sx={{
            width: 320,
            background: `linear-gradient(180deg, ${DARK_BG_PRIMARY} 0%, ${DARK_BG_SECONDARY} 100%)`,
            color: DARK_TEXT_PRIMARY,
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
            borderLeft: `1px solid ${DARK_DIVIDER}`,
            borderTop: `1px solid ${DARK_DIVIDER}`,
            borderBottom: `1px solid ${DARK_DIVIDER}`,
            boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            letterSpacing: LETTER_SPACING,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1.5,
              bgcolor: DARK_BG_PRIMARY,
              borderBottom: `1px solid ${DARK_DIVIDER}`,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Zap size={16} color="#0061FF" />
              <Text 
                variant="paragraph-medium" 
                sx={{ 
                  color: DARK_TEXT_PRIMARY,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  letterSpacing: LETTER_SPACING,
                }}
              >
                Prototype DevTools
              </Text>
            </Stack>
            <IconButton 
              size="small" 
              onClick={() => setIsOpen(false)} 
              sx={{ 
                color: DARK_TEXT_SECONDARY,
                '&:hover': { bgcolor: DARK_HOVER },
              }}
            >
              <X size={18} />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ p: 2 }}>
            {/* Data Scenario */}
            <Box sx={{ mb: 3 }}>
              <Text 
                variant="paragraph-small" 
                sx={{ 
                  color: DARK_TEXT_SECONDARY, 
                  mb: 1, 
                  display: 'block',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontSize: '0.75rem',
                  letterSpacing: LETTER_SPACING,
                }}
              >
                Data Scenario
              </Text>
              <Select
                fullWidth
                size="small"
                value={scenario}
                onChange={(e) => setScenario(e.target.value as DataScenario)}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: DARK_TEXT_PRIMARY,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontSize: '0.875rem',
                  letterSpacing: LETTER_SPACING,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: DARK_DIVIDER },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: DARK_TEXT_SECONDARY },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0061FF' },
                  '& .MuiSvgIcon-root': { color: DARK_TEXT_SECONDARY },
                }}
              >
                <MenuItem 
                  value="demo"
                  sx={{
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontSize: '0.875rem',
                    color: DARK_TEXT_PRIMARY,
                    '&:hover': { bgcolor: DARK_HOVER },
                  }}
                >
                  Demo (default fixtures)
                </MenuItem>
                <MenuItem 
                  value="empty"
                  sx={{
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontSize: '0.875rem',
                    color: DARK_TEXT_PRIMARY,
                    '&:hover': { bgcolor: DARK_HOVER },
                  }}
                >
                  Empty State
                </MenuItem>
                <MenuItem 
                  value="stress"
                  sx={{
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontSize: '0.875rem',
                    color: DARK_TEXT_PRIMARY,
                    '&:hover': { bgcolor: DARK_HOVER },
                  }}
                >
                  Stress Test (1000+ items)
                </MenuItem>
                <MenuItem 
                  value="custom"
                  sx={{
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontSize: '0.875rem',
                    color: DARK_TEXT_PRIMARY,
                    '&:hover': { bgcolor: DARK_HOVER },
                  }}
                >
                  Custom (user data only)
                </MenuItem>
              </Select>
            </Box>

            <Divider sx={{ borderColor: DARK_DIVIDER, my: 2 }} />

            {/* Feature Flags */}
            <Box sx={{ mb: 3 }}>
              <Text 
                variant="paragraph-small" 
                sx={{ 
                  color: DARK_TEXT_SECONDARY, 
                  mb: 1, 
                  display: 'block',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontSize: '0.75rem',
                  letterSpacing: LETTER_SPACING,
                }}
              >
                Feature Flags
              </Text>
              <Stack spacing={0.5}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={featureFlags.enableAnimations}
                      onChange={() => toggleFeatureFlag('enableAnimations')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#0061FF',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#0061FF',
                        },
                      }}
                    />
                  }
                  label={
                    <Text 
                      variant="paragraph-small" 
                      sx={{ 
                        color: DARK_TEXT_PRIMARY,
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontSize: '0.875rem',
                        letterSpacing: LETTER_SPACING,
                      }}
                    >
                      Animations
                    </Text>
                  }
                  sx={{ ml: 0 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={featureFlags.showPlaceholderPages}
                      onChange={() => toggleFeatureFlag('showPlaceholderPages')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#0061FF',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#0061FF',
                        },
                      }}
                    />
                  }
                  label={
                    <Text 
                      variant="paragraph-small" 
                      sx={{ 
                        color: DARK_TEXT_PRIMARY,
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontSize: '0.875rem',
                        letterSpacing: LETTER_SPACING,
                      }}
                    >
                      Placeholder Pages
                    </Text>
                  }
                  sx={{ ml: 0 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={featureFlags.useMockLatency}
                      onChange={() => toggleFeatureFlag('useMockLatency')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#0061FF',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#0061FF',
                        },
                      }}
                    />
                  }
                  label={
                    <Text 
                      variant="paragraph-small" 
                      sx={{ 
                        color: DARK_TEXT_PRIMARY,
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontSize: '0.875rem',
                        letterSpacing: LETTER_SPACING,
                      }}
                    >
                      Mock Latency ({featureFlags.mockLatencyMs}ms)
                    </Text>
                  }
                  sx={{ ml: 0 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={featureFlags.backgroundWarm}
                      onChange={() => toggleFeatureFlag('backgroundWarm')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#0061FF',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#0061FF',
                        },
                      }}
                    />
                  }
                  label={
                    <Text 
                      variant="paragraph-small" 
                      sx={{ 
                        color: DARK_TEXT_PRIMARY,
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontSize: '0.875rem',
                        letterSpacing: LETTER_SPACING,
                      }}
                    >
                      Background Warm
                    </Text>
                  }
                  sx={{ ml: 0 }}
                />
              </Stack>
            </Box>

            <Divider sx={{ borderColor: DARK_DIVIDER, my: 2 }} />

            {/* Actions */}
            <Stack spacing={1}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<Database size={16} />}
                onClick={handleExportData}
                sx={{
                  color: DARK_TEXT_PRIMARY,
                  borderColor: DARK_DIVIDER,
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: LETTER_SPACING,
                  '&:hover': { 
                    borderColor: DARK_TEXT_SECONDARY, 
                    bgcolor: DARK_HOVER,
                  },
                }}
              >
                Export Data
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<RotateCcw size={16} />}
                onClick={handleResetData}
                sx={{
                  color: '#ef4444',
                  borderColor: '#7f1d1d',
                  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: LETTER_SPACING,
                  '&:hover': { 
                    borderColor: '#991b1b', 
                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                  },
                }}
              >
                Reset All Data
              </Button>
            </Stack>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              px: 2,
              py: 1,
              bgcolor: DARK_BG_PRIMARY,
              borderTop: `1px solid ${DARK_DIVIDER}`,
            }}
          >
            <Text 
              variant="paragraph-small" 
              sx={{ 
                color: DARK_TEXT_SECONDARY,
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '0.75rem',
                letterSpacing: LETTER_SPACING,
              }}
            >
              Press <kbd style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                padding: '2px 6px', 
                borderRadius: 4,
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '0.75rem',
                color: DARK_TEXT_PRIMARY,
              }}>Ctrl</kbd> +{' '}
              <kbd style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                padding: '2px 6px', 
                borderRadius: 4,
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '0.75rem',
                color: DARK_TEXT_PRIMARY,
              }}>.</kbd> to toggle
            </Text>
          </Box>
        </Box>
      ) : (
        <Box
          onClick={() => setIsOpen(true)}
          sx={{
            background: `linear-gradient(180deg, ${DARK_BG_PRIMARY} 0%, ${DARK_BG_SECONDARY} 100%)`,
            color: DARK_TEXT_PRIMARY,
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
            borderLeft: `1px solid ${DARK_DIVIDER}`,
            borderTop: `1px solid ${DARK_DIVIDER}`,
            borderBottom: `1px solid ${DARK_DIVIDER}`,
            padding: '12px 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 40,
            '&:hover': { 
              bgcolor: DARK_HOVER,
              borderLeftColor: '#0061FF',
            },
            transition: 'all 0.2s ease',
          }}
          title="Open Prototype DevTools"
        >
          <Settings size={20} style={{ transform: 'rotate(-90deg)', color: DARK_TEXT_PRIMARY }} />
        </Box>
      )}
    </Box>
  )
}
