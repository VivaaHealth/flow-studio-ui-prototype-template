import { Link, useLocation } from 'react-router-dom'
import {
  Drawer,
  Stack,
  Divider,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import { Text, Icon, colors } from '@vivaahealth/design-system'
import { Search, FileText, LogOut, PanelLeftClose, PanelLeft } from 'lucide-react'
import { useUIStore, selectIsSidebarExpanded } from '@/lib/stores'

// ============================================================================
// Constants
// ============================================================================

const SIDEBAR_NAVIGATION_DRAWER_WIDTH = 228
const SIDEBAR_NAVIGATION_COLLAPSED_WIDTH = 52
const CUSTOM_SCROLL_BAR_SIZE_IN_PIXELS = 8
const NAVIGATION_HORIZONTAL_PADDING = 16
const DARK_THEME_FONT_COLOR = '#F0F1FF'

// ============================================================================
// Navigation Data
// ============================================================================

interface RouteLink {
  label: string
  to: string
}

interface RouteSection {
  label: string
  links: RouteLink[]
  type: 'main' | 'secondary'
}

const navigationSections: RouteSection[] = [
  {
    label: 'Build',
    type: 'main',
    links: [
      { label: 'Flows', to: '/flows' },
      { label: 'Agents', to: '/agents' },
      { label: 'Assistants', to: '/assistants' },
      { label: 'Knowledge Bases', to: '/knowledge-bases' },
      { label: 'Reference Tables', to: '/reference-tables' },
    ],
  },
  {
    label: 'Analyze',
    type: 'main',
    links: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Reports', to: '/reports' },
    ],
  },
  {
    label: 'Operate',
    type: 'main',
    links: [
      { label: 'Runs', to: '/runs' },
      { label: 'Messages', to: '/messages' },
      { label: 'SMS Tasks', to: '/sms-tasks' },
    ],
  },
  {
    label: 'Integrate',
    type: 'main',
    links: [
      { label: 'API Instances', to: '/api-instances' },
      { label: 'Connections', to: '/connections' },
    ],
  },
  {
    label: 'Manage',
    type: 'main',
    links: [
      { label: 'Users', to: '/users' },
      { label: 'Permission Groups', to: '/permission-groups' },
      { label: 'Practices', to: '/practices' },
      { label: 'Providers', to: '/providers' },
    ],
  },
  {
    label: 'Templates',
    type: 'secondary',
    links: [
      { label: 'Flow Templates', to: '/flow-templates' },
      { label: 'Documents', to: '/documents' },
      { label: 'Notes', to: '/notes' },
    ],
  },
  {
    label: 'Mappings',
    type: 'secondary',
    links: [
      { label: 'Code Mappings', to: '/code-mappings' },
      { label: 'Field Mappings', to: '/field-mappings' },
    ],
  },
  {
    label: 'Tools',
    type: 'secondary',
    links: [
      { label: 'Flow Tester', to: '/flow-tester' },
      { label: 'Document Upload', to: '/document-upload' },
    ],
  },
]

// ============================================================================
// Dark Theme
// ============================================================================

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#030A33', paper: '#030A33' },
    primary: { main: colors.extended.blue[60], contrastText: DARK_THEME_FONT_COLOR },
    text: { primary: DARK_THEME_FONT_COLOR, secondary: DARK_THEME_FONT_COLOR },
    divider: '#282E54',
  },
  components: {
    MuiAccordion: {
      defaultProps: { disableGutters: true, square: true },
      styleOverrides: {
        root: { background: 'transparent', boxShadow: 'none', '&::before': { display: 'none' } },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          minHeight: 32,
          padding: `0 ${NAVIGATION_HORIZONTAL_PADDING - CUSTOM_SCROLL_BAR_SIZE_IN_PIXELS}px`,
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
        },
        content: { margin: '4px 0', '&.Mui-expanded': { margin: '4px 0' } },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: `0 ${NAVIGATION_HORIZONTAL_PADDING - CUSTOM_SCROLL_BAR_SIZE_IN_PIXELS}px`,
          marginBottom: '8px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { fontWeight: 400, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } } },
    },
    MuiLink: {
      styleOverrides: { root: { borderRadius: 4, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } } },
    },
    MuiInputBase: {
      styleOverrides: {
        input: { fontSize: '1rem', '&::placeholder': { color: '#9CA3AF', opacity: 0.9, fontStyle: 'italic' } },
      },
    },
  },
})

// ============================================================================
// Custom Scrollbar
// ============================================================================

const customScrollbarStyles = {
  '&::-webkit-scrollbar': { width: CUSTOM_SCROLL_BAR_SIZE_IN_PIXELS, height: CUSTOM_SCROLL_BAR_SIZE_IN_PIXELS },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.4)' },
  },
  '&::-webkit-scrollbar-track': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
}

// ============================================================================
// Components
// ============================================================================

function SidebarNavigationLink({ link }: { link: RouteLink }) {
  const location = useLocation()
  const isExpanded = useUIStore(selectIsSidebarExpanded)
  const isActive = location.pathname === link.to || location.pathname.startsWith(link.to + '/')

  return (
    <Stack direction="row" spacing={1}>
      <Divider orientation="vertical" flexItem sx={{ borderColor: isActive ? 'white' : 'divider' }} />
      <Text variant="paragraph-medium" sx={{ display: 'inline-block', width: '100%' }}>
        <Link
          to={link.to}
          tabIndex={!isExpanded ? -1 : 0}
          style={{
            display: 'inline-block',
            width: '100%',
            paddingLeft: 6,
            paddingRight: 6,
            paddingTop: 2,
            paddingBottom: 2,
            borderRadius: 4,
            color: 'inherit',
            textDecoration: 'none',
            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
          }}
          onMouseEnter={(e) => {
            if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
          }}
          onMouseLeave={(e) => {
            if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          {link.label}
        </Link>
      </Text>
    </Stack>
  )
}

function SidebarNavigationLinkAccordion({ routeSection }: { routeSection: RouteSection }) {
  const location = useLocation()
  const isExpanded = useUIStore(selectIsSidebarExpanded)
  const expandedSections = useUIStore((s) => s.expandedSections)
  const toggleSection = useUIStore((s) => s.toggleSection)

  const { label, links } = routeSection
  const isSectionExpanded = expandedSections.includes(label)
  const hasActiveLink = links.some(
    (link) => location.pathname === link.to || location.pathname.startsWith(link.to + '/')
  )

  return (
    <Accordion
      expanded={isSectionExpanded}
      onChange={() => toggleSection(label)}
    >
      <AccordionSummary
        sx={{ backgroundColor: hasActiveLink && !isSectionExpanded ? 'rgba(255, 255, 255, 0.2)' : 'transparent' }}
        expandIcon={<Icon.ChevronDown color="text.primary" />}
        tabIndex={!isExpanded ? -1 : 0}
      >
        <Text variant="paragraph-medium" bold={hasActiveLink || isSectionExpanded}>
          {label}
        </Text>
      </AccordionSummary>
      <AccordionDetails>
        {links.map((link) => (
          <SidebarNavigationLink key={link.label} link={link} />
        ))}
      </AccordionDetails>
    </Accordion>
  )
}

function SidebarNavigationButton() {
  const sidebarMode = useUIStore((s) => s.sidebarMode)
  const setSidebarMode = useUIStore((s) => s.setSidebarMode)
  const isExpanded = useUIStore(selectIsSidebarExpanded)

  return (
    <IconButton
      aria-label={sidebarMode === 'overlay' ? 'Make navigation fixed' : 'Make navigation collapsed'}
      aria-expanded={isExpanded}
      onClick={() => setSidebarMode(sidebarMode === 'fixed' ? 'overlay' : 'fixed')}
      tabIndex={!isExpanded ? -1 : 0}
      sx={{ color: 'white' }}
    >
      {sidebarMode === 'overlay' ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
    </IconButton>
  )
}

function SidebarNavigationTopSection() {
  const isExpanded = useUIStore(selectIsSidebarExpanded)

  return (
    <Stack gap={0.5} divider={<Divider />}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" paddingRight={!isExpanded ? 0 : 2}>
        <Link
          to="/"
          aria-label="Navigate to home page"
          tabIndex={!isExpanded ? -1 : 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: !isExpanded ? 'center' : 'flex-start',
            marginLeft: !isExpanded ? 0 : 16,
            marginRight: !isExpanded ? 0 : 16,
            paddingTop: 6,
            paddingBottom: 8,
            width: !isExpanded ? '100%' : 'auto',
            textDecoration: 'none',
          }}
        >
          {!isExpanded ? (
            <Box sx={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="url(#notable-gradient)" />
                <path d="M7.5 17V7H9.5L14.5 14V7H16.5V17H14.5L9.5 10V17H7.5Z" fill="white" />
                <defs>
                  <linearGradient id="notable-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B82F6" />
                    <stop offset="1" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
              </svg>
            </Box>
          ) : (
            <Box sx={{ width: 120, overflow: 'hidden', display: 'inline-block' }}>
              <img src="/images/notable-full-logo.svg" alt="Notable" width={119} height={16} style={{ display: 'block' }} />
            </Box>
          )}
        </Link>
        {isExpanded && <SidebarNavigationButton />}
      </Stack>
      <Box sx={{ marginX: !isExpanded ? 0 : 2, display: 'flex', alignItems: 'center', justifyContent: !isExpanded ? 'center' : 'flex-start' }}>
        {!isExpanded ? (
          <IconButton aria-label="Search" sx={{ color: '#9CA3AF' }}>
            <Search size={20} />
          </IconButton>
        ) : (
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: 'inherit' }}>
                  <Search size={16} color="#9CA3AF" />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: 'transparent',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                '&.Mui-focused': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                color: 'white',
              },
            }}
          />
        )}
      </Box>
    </Stack>
  )
}

function SidebarNavigationMiddleSection() {
  const isExpanded = useUIStore(selectIsSidebarExpanded)
  const mainSections = navigationSections.filter((s) => s.type === 'main')
  const secondarySections = navigationSections.filter((s) => s.type === 'secondary')

  return (
    <Box
      sx={{
        overflowY: 'auto',
        overflowX: 'hidden',
        flexGrow: 1,
        ...customScrollbarStyles,
        scrollbarGutter: 'stable both-edges',
        width: SIDEBAR_NAVIGATION_DRAWER_WIDTH,
        opacity: !isExpanded ? 0 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      {mainSections.map((routeSection) => (
        <SidebarNavigationLinkAccordion key={routeSection.label} routeSection={routeSection} />
      ))}
      <Divider
        sx={{
          marginY: 1,
          marginLeft: `-${NAVIGATION_HORIZONTAL_PADDING - CUSTOM_SCROLL_BAR_SIZE_IN_PIXELS}px`,
          marginRight: `-${NAVIGATION_HORIZONTAL_PADDING - CUSTOM_SCROLL_BAR_SIZE_IN_PIXELS}px`,
        }}
      />
      {secondarySections.map((routeSection) => (
        <SidebarNavigationLinkAccordion key={routeSection.label} routeSection={routeSection} />
      ))}
    </Box>
  )
}

function SidebarNavigationBottomSection() {
  const isExpanded = useUIStore(selectIsSidebarExpanded)

  return (
    <Stack marginX={!isExpanded ? 0 : 2} gap={0.5} alignItems={!isExpanded ? 'center' : 'flex-start'} justifyContent="center">
      {!isExpanded ? (
        <>
          <IconButton
            component="a"
            href="https://docs.notablehealth.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Documentation"
            sx={{ color: 'white' }}
          >
            <FileText size={20} />
          </IconButton>
          <IconButton onClick={() => console.log('Sign out clicked')} aria-label="Sign Out" sx={{ color: 'white' }}>
            <LogOut size={20} />
          </IconButton>
        </>
      ) : (
        <>
          <Button
            component="a"
            variant="text"
            href="https://docs.notablehealth.com"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<FileText size={16} />}
            color="inherit"
            fullWidth
            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
          >
            <Text variant="paragraph-medium">Documentation</Text>
          </Button>
          <Button
            variant="text"
            color="inherit"
            startIcon={<LogOut size={16} />}
            onClick={() => console.log('Sign out clicked')}
            fullWidth
            sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
            aria-label="Sign Out"
          >
            <Text variant="paragraph-medium">Sign Out</Text>
          </Button>
        </>
      )}
    </Stack>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function SideNavigation() {
  const sidebarMode = useUIStore((s) => s.sidebarMode)
  const setSidebarHovering = useUIStore((s) => s.setSidebarHovering)
  const isExpanded = useUIStore(selectIsSidebarExpanded)
  const isOverlay = sidebarMode === 'overlay'

  return (
    <ThemeProvider theme={darkTheme}>
      <Drawer
        open
        variant="permanent"
        sx={{
          flexShrink: 0,
          width: isOverlay ? SIDEBAR_NAVIGATION_COLLAPSED_WIDTH : SIDEBAR_NAVIGATION_DRAWER_WIDTH,
          transition: 'width 0.2s ease',
          '& .MuiDrawer-paper': {
            width: isExpanded ? SIDEBAR_NAVIGATION_DRAWER_WIDTH : SIDEBAR_NAVIGATION_COLLAPSED_WIDTH,
            transition: 'width 0.2s ease',
          },
        }}
        slotProps={{
          paper: {
            sx: {
              overflow: 'hidden',
              paddingY: 0.5,
              background: 'linear-gradient(180deg, #030A33 0%, #00044B 100%)',
              boxShadow: isOverlay && isExpanded ? 6 : 0,
            },
          },
        }}
        onMouseLeave={() => setSidebarHovering(false)}
        onMouseEnter={(event) => {
          if (event.buttons === 0) {
            setSidebarHovering(true)
          }
        }}
      >
        <Stack
          role="navigation"
          sx={{ height: '100%', gap: 0.5, borderRadius: 0, overflowX: 'hidden' }}
          divider={<Divider />}
          tabIndex={!isExpanded ? -1 : 0}
        >
          <SidebarNavigationTopSection />
          <SidebarNavigationMiddleSection />
          <SidebarNavigationBottomSection />
        </Stack>
      </Drawer>
    </ThemeProvider>
  )
}
