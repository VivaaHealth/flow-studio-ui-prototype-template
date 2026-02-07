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
// Logo: N (fixed, always visible) + text (fades in when expanded)
const LOGO_N_WIDTH = 22
const LOGO_TEXT_WIDTH = 92
const LOGO_LEFT_OFFSET = '1rem' // 16px total from drawer edge to N
const LOGO_TEXT_GAP = '0.5rem' // 8px between N and text
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
    label: 'Connect',
    type: 'main',
    links: [
      { label: 'Connectors', to: '/connections' },
      { label: 'Feeds', to: '/feeds' },
      { label: 'Triggers', to: '/triggers' },
      { label: 'EHR Systems', to: '/ehr-systems' },
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

// 0.25% letter-spacing as length (CSS letter-spacing uses length, not %)
const LETTER_SPACING_025 = '0.0025em'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#030A33', paper: '#030A33' },
    primary: { main: colors.extended.blue[60], contrastText: DARK_THEME_FONT_COLOR },
    text: { primary: DARK_THEME_FONT_COLOR, secondary: DARK_THEME_FONT_COLOR },
    divider: '#353B5C',
  },
  typography: {
    allVariants: { letterSpacing: LETTER_SPACING_025 },
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
          padding: `2px ${NAVIGATION_HORIZONTAL_PADDING - CUSTOM_SCROLL_BAR_SIZE_IN_PIXELS}px`,
          letterSpacing: LETTER_SPACING_025,
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
        root: {
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: 600,
          letterSpacing: LETTER_SPACING_025,
          boxShadow: 'none',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)', boxShadow: 'none' },
          '&:active': { boxShadow: 'none' },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minHeight: 32,
          maxHeight: 32,
          width: 32,
          padding: '4px',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
        },
      },
    },
    MuiLink: {
      styleOverrides: { root: { borderRadius: 4, letterSpacing: LETTER_SPACING_025, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } } },
    },
    MuiInputBase: {
      styleOverrides: {
        input: { fontSize: '1rem', letterSpacing: LETTER_SPACING_025, '&::placeholder': { color: '#9CA3AF', opacity: 0.9, fontStyle: 'italic' } },
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

function SidebarNavigationLink({ link, sectionLabel }: { link: RouteLink; sectionLabel: string }) {
  const location = useLocation()
  const isExpanded = useUIStore(selectIsSidebarExpanded)
  const setExpandedSection = useUIStore((s) => s.setExpandedSection)
  const isActive = location.pathname === link.to || location.pathname.startsWith(link.to + '/')

  const handleClick = () => {
    // Collapse all other sections and expand the section containing this link
    setExpandedSection(sectionLabel)
  }

  return (
    <Stack direction="row" spacing={1}>
      <Divider orientation="vertical" flexItem sx={{ borderColor: isActive ? 'white' : 'divider' }} />
      <Text
        variant="paragraph-medium"
        sx={{
          display: 'inline-block',
          width: '100%',
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '130%',
          letterSpacing: LETTER_SPACING_025,
        }}
      >
        <Link
          to={link.to}
          tabIndex={!isExpanded ? -1 : 0}
          onClick={handleClick}
          style={{
            display: 'inline-block',
            width: '100%',
            paddingLeft: 6,
            paddingRight: 6,
            paddingTop: '4px',
            paddingBottom: '4px',
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
      <AccordionDetails sx={{ display: 'block', paddingTop: 0, marginTop: '2px' }}>
        <Stack gap="2px">
          {links.map((link) => (
            <SidebarNavigationLink key={link.label} link={link} sectionLabel={label} />
          ))}
        </Stack>
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
    <Stack gap={0} divider={<Divider />}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" paddingRight={!isExpanded ? 0 : 2}>
        <Link
          to="/"
          aria-label="Navigate to home page"
          tabIndex={!isExpanded ? -1 : 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: !isExpanded ? 1 : 'none',
            minWidth: 0,
            marginLeft: 0,
            marginRight: !isExpanded ? 0 : 16,
            marginBottom: '1px',
            paddingTop: 19,
            paddingBottom: 19,
            paddingLeft: LOGO_LEFT_OFFSET,
            textDecoration: 'none',
            overflow: 'hidden',
          }}
        >
          {/* N: always visible, fixed position; 2x intrinsic size for crisp SVG on retina */}
          <Box
            sx={{
              flexShrink: 0,
              width: LOGO_N_WIDTH,
              height: 16,
              overflow: 'hidden',
            }}
          >
            <img
              src="/images/notable-n.svg"
              alt=""
              width={LOGO_N_WIDTH * 2}
              height={32}
              style={{
                display: 'block',
                width: LOGO_N_WIDTH,
                height: 16,
                imageRendering: 'auto',
              }}
              aria-hidden
            />
          </Box>
          {/* Text: 8px gap from N; fades in at full size on entry, fades out then collapses on exit; 2x for crisp SVG */}
          <Box
            sx={{
              width: isExpanded ? LOGO_TEXT_WIDTH : 0,
              marginLeft: isExpanded ? LOGO_TEXT_GAP : 0,
              height: 16,
              overflow: 'hidden',
              opacity: isExpanded ? 1 : 0,
              transition: isExpanded
                ? 'opacity 0.2s ease, width 0s ease 0s, margin-left 0s ease 0s'
                : 'opacity 0.2s ease, width 0s ease 0.2s, margin-left 0s ease 0.2s',
            }}
          >
            <img
              src="/images/notable-text.svg"
              alt="otable"
              width={LOGO_TEXT_WIDTH * 2}
              height={32}
              style={{
                display: 'block',
                width: LOGO_TEXT_WIDTH,
                height: 16,
                imageRendering: 'auto',
              }}
              aria-hidden
            />
          </Box>
        </Link>
        {isExpanded && <SidebarNavigationButton />}
      </Stack>
      <Box
        sx={{
          marginX: 0,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: !isExpanded ? 'center' : 'flex-start',
          paddingLeft: LOGO_LEFT_OFFSET,
          backgroundColor: 'transparent',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
          '&:has(.Mui-focused)': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
        }}
      >
        {/* Search icon: always visible, fixed position - just an icon, no button */}
        <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateY(-1px)' }}>
          <Search size={16} color="white" />
        </Box>
        {/* Search input: fades in when expanding, fades out when collapsing */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            marginLeft: '8px',
            opacity: isExpanded ? 1 : 0,
            width: isExpanded ? 'auto' : 0,
            overflow: 'hidden',
            transition: isExpanded
              ? 'opacity 0.2s ease, width 0s ease 0s, margin-left 0s ease 0s'
              : 'opacity 0.2s ease, width 0s ease 0.2s, margin-left 0s ease 0.2s',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search"
            InputProps={{
              sx: {
                backgroundColor: 'transparent',
                minHeight: 48,
                paddingTop: '4px',
                paddingBottom: '4px',
                paddingLeft: '0px',
                borderRadius: 0,
                '& .MuiOutlinedInput-notchedOutline': { border: 'none', borderRadius: 0 },
                '& input': {
                  paddingLeft: '0px',
                },
                color: 'white',
                '& input::placeholder': {
                  fontStyle: 'italic',
                },
              },
            }}
          />
        </Box>
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
      {secondarySections.map((routeSection) => (
        <SidebarNavigationLinkAccordion key={routeSection.label} routeSection={routeSection} />
      ))}
    </Box>
  )
}

function SidebarNavigationBottomSection() {
  const isExpanded = useUIStore(selectIsSidebarExpanded)

  return (
    <Stack gap={0.5} alignItems="flex-start" justifyContent="center" sx={{ paddingLeft: LOGO_LEFT_OFFSET, paddingBottom: '4px' }}>
      {/* Documentation: icon always visible, text fades in/out */}
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px' }}>
        <Box
          component="a"
          href="https://docs.notablehealth.com/l"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Documentation"
          sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
        >
          <FileText size={16} color="white" />
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            opacity: isExpanded ? 1 : 0,
            width: isExpanded ? 'auto' : 0,
            overflow: 'hidden',
            transition: isExpanded
              ? 'opacity 0.2s ease, width 0s ease 0s'
              : 'opacity 0.2s ease, width 0s ease 0.2s',
          }}
        >
          <Button
            component="a"
            variant="text"
            href="https://docs.notablehealth.com/l"
            target="_blank"
            rel="noopener noreferrer"
            color="inherit"
            fullWidth
            sx={{ 
              justifyContent: 'flex-start', 
              textTransform: 'none', 
              paddingLeft: 0,
              '&:hover': { backgroundColor: 'transparent' },
            }}
          >
            <Text variant="paragraph-medium">Documentation</Text>
          </Button>
        </Box>
      </Box>
      {/* Sign Out: icon always visible, text fades in/out */}
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px' }}>
        <Box
          component="button"
          onClick={() => console.log('Sign out clicked')}
          aria-label="Sign Out"
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <LogOut size={16} color="white" />
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            opacity: isExpanded ? 1 : 0,
            width: isExpanded ? 'auto' : 0,
            overflow: 'hidden',
            transition: isExpanded
              ? 'opacity 0.2s ease, width 0s ease 0s'
              : 'opacity 0.2s ease, width 0s ease 0.2s',
          }}
        >
          <Button
            variant="text"
            color="inherit"
            onClick={() => console.log('Sign out clicked')}
            fullWidth
            sx={{ 
              justifyContent: 'flex-start', 
              textTransform: 'none', 
              paddingLeft: 0,
              '&:hover': { backgroundColor: 'transparent' },
            }}
            aria-label="Sign Out"
          >
            <Text variant="paragraph-medium">Sign Out</Text>
          </Button>
        </Box>
      </Box>
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
              paddingTop: 0,
              paddingBottom: 0.5,
              background: 'linear-gradient(180deg, #030A33 0%, #00044B 100%)',
              boxShadow: isOverlay && isExpanded ? 6 : 0,
              '& *': { letterSpacing: LETTER_SPACING_025 },
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
          tabIndex={!isExpanded ? -1 : 0}
        >
          <Box sx={(theme) => ({ boxShadow: `0 1px 0 0 ${theme.palette.divider}` })}>
            <SidebarNavigationTopSection />
          </Box>
          <SidebarNavigationMiddleSection />
          <Divider />
          <SidebarNavigationBottomSection />
        </Stack>
      </Drawer>
    </ThemeProvider>
  )
}
