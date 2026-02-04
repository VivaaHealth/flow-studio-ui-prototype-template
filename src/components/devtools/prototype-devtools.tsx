import { useState } from 'react'
import { Box, Stack, IconButton, Switch, FormControlLabel, Select, MenuItem, Button, Divider } from '@mui/material'
import { Text } from '@vivaahealth/design-system'
import { Settings, X, RotateCcw, Database, Zap } from 'lucide-react'
import { usePrototypeStore, type DataScenario } from '@/lib/stores'
import { clearDatabase, exportMutations } from '@/lib/db'

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
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
      {isOpen ? (
        <Box
          sx={{
            width: 320,
            bgcolor: '#1e293b',
            color: 'white',
            borderRadius: 2,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
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
              bgcolor: '#0f172a',
              borderBottom: '1px solid #334155',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Zap size={16} color="#fbbf24" />
              <Text variant="paragraph-medium" bold sx={{ color: 'white' }}>
                Prototype DevTools
              </Text>
            </Stack>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: '#94a3b8' }}>
              <X size={18} />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ p: 2 }}>
            {/* Data Scenario */}
            <Box sx={{ mb: 3 }}>
              <Text variant="paragraph-small" sx={{ color: '#94a3b8', mb: 1, display: 'block' }}>
                Data Scenario
              </Text>
              <Select
                fullWidth
                size="small"
                value={scenario}
                onChange={(e) => setScenario(e.target.value as DataScenario)}
                sx={{
                  bgcolor: '#334155',
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
                  '& .MuiSvgIcon-root': { color: '#94a3b8' },
                }}
              >
                <MenuItem value="demo">Demo (default fixtures)</MenuItem>
                <MenuItem value="empty">Empty State</MenuItem>
                <MenuItem value="stress">Stress Test (1000+ items)</MenuItem>
                <MenuItem value="custom">Custom (user data only)</MenuItem>
              </Select>
            </Box>

            <Divider sx={{ borderColor: '#334155', my: 2 }} />

            {/* Feature Flags */}
            <Box sx={{ mb: 3 }}>
              <Text variant="paragraph-small" sx={{ color: '#94a3b8', mb: 1, display: 'block' }}>
                Feature Flags
              </Text>
              <Stack spacing={0.5}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={featureFlags.enableAnimations}
                      onChange={() => toggleFeatureFlag('enableAnimations')}
                    />
                  }
                  label={<Text variant="paragraph-small" sx={{ color: 'white' }}>Animations</Text>}
                  sx={{ ml: 0 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={featureFlags.showPlaceholderPages}
                      onChange={() => toggleFeatureFlag('showPlaceholderPages')}
                    />
                  }
                  label={<Text variant="paragraph-small" sx={{ color: 'white' }}>Placeholder Pages</Text>}
                  sx={{ ml: 0 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={featureFlags.useMockLatency}
                      onChange={() => toggleFeatureFlag('useMockLatency')}
                    />
                  }
                  label={<Text variant="paragraph-small" sx={{ color: 'white' }}>Mock Latency ({featureFlags.mockLatencyMs}ms)</Text>}
                  sx={{ ml: 0 }}
                />
              </Stack>
            </Box>

            <Divider sx={{ borderColor: '#334155', my: 2 }} />

            {/* Actions */}
            <Stack spacing={1}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<Database size={16} />}
                onClick={handleExportData}
                sx={{
                  color: '#94a3b8',
                  borderColor: '#475569',
                  '&:hover': { borderColor: '#64748b', bgcolor: 'rgba(255,255,255,0.05)' },
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
                  color: '#f87171',
                  borderColor: '#7f1d1d',
                  '&:hover': { borderColor: '#991b1b', bgcolor: 'rgba(248, 113, 113, 0.1)' },
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
              bgcolor: '#0f172a',
              borderTop: '1px solid #334155',
            }}
          >
            <Text variant="paragraph-small" sx={{ color: '#64748b' }}>
              Press <kbd style={{ background: '#334155', padding: '2px 4px', borderRadius: 4 }}>Ctrl</kbd> +{' '}
              <kbd style={{ background: '#334155', padding: '2px 4px', borderRadius: 4 }}>.</kbd> to toggle
            </Text>
          </Box>
        </Box>
      ) : (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            bgcolor: '#1e293b',
            color: '#fbbf24',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            '&:hover': { bgcolor: '#334155' },
          }}
          title="Open Prototype DevTools"
        >
          <Settings size={20} />
        </IconButton>
      )}
    </Box>
  )
}
