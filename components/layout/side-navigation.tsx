"use client"

import React, { useState, createContext, useContext, useMemo, useCallback } from "react"
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
  Link,
  ThemeProvider,
  createTheme,
} from "@mui/material"
import { Text, Icon, colors } from "@vivaahealth/design-system"
import {
  Search,
  FileText,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"
import Image from "next/image"

// Constants matching monorepo
const SIDEBAR_NAVIGATION_DRAWER_WIDTH = 228
const SIDEBAR_NAVIGATION_COLLAPSED_WIDTH = 52
const CUSTOM_SCROLL_BAR_SIZE_IN_PIXELS = 8
const NAVIGATION_HORIZONTAL_PADDING = 16
const DARK_THEME_FONT_COLOR = "#F0F1FF"

// Navigation data structure matching monorepo patterns
interface RouteLink {
  label: string
  to: string
  active?: boolean
}

interface RouteSection {
  label: string
  links: RouteLink[]
  type: "main" | "secondary"
}

const navigationSections: RouteSection[] = [
  {
    label: "Build",
    type: "main",
    links: [
      { label: "Flows", to: "/flows", active: true },
      { label: "Agents", to: "/agents" },
      { label: "Assistants", to: "/assistants" },
      { label: "Knowledge Bases", to: "/knowledge-bases" },
      { label: "Reference Tables", to: "/reference-tables" },
    ],
  },
  {
    label: "Analyze",
    type: "main",
    links: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Reports", to: "/reports" },
    ],
  },
  {
    label: "Operate",
    type: "main",
    links: [
      { label: "Runs", to: "/runs" },
      { label: "Messages", to: "/messages" },
      { label: "SMS Tasks", to: "/sms-tasks" },
    ],
  },
  {
    label: "Integrate",
    type: "main",
    links: [
      { label: "API Instances", to: "/api-instances" },
      { label: "Connections", to: "/connections" },
    ],
  },
  {
    label: "Manage",
    type: "main",
    links: [
      { label: "Users", to: "/users" },
      { label: "Permission Groups", to: "/permission-groups" },
      { label: "Practices", to: "/practices" },
      { label: "Providers", to: "/providers" },
    ],
  },
  {
    label: "Templates",
    type: "secondary",
    links: [
      { label: "Flow Templates", to: "/flow-templates" },
      { label: "Documents", to: "/documents" },
      { label: "Notes", to: "/notes" },
    ],
  },
  {
    label: "Mappings",
    type: "secondary",
    links: [
      { label: "Code Mappings", to: "/code-mappings" },
      { label: "Field Mappings", to: "/field-mappings" },
    ],
  },
  {
    label: "Tools",
    type: "secondary",
    links: [
      { label: "Flow Tester", to: "/flow-tester" },
      { label: "Document Upload", to: "/document-upload" },
    ],
  },
]

// Section expansion state enum matching monorepo
enum SectionState {
  Open = "Open",
  Closed = "Closed",
}

// Navigation mode enum matching monorepo
enum SideNavigationMode {
  OverlayOnHover = "OverlayOnHover",
  Fixed = "Fixed",
}

enum SideNavigationState {
  Expanded = "Expanded",
  Collapsed = "Collapsed",
}

// Context for sidebar state
interface SideNavigationContextValue {
  sideNavigationMode: SideNavigationMode
  sideNavigationState: SideNavigationState
  setSideNavigationModeToFixed: () => void
  setSideNavigationModeToOverlayOnHover: () => void
  isNavigationHovering: boolean
  setIsNavigationHovering: (value: boolean) => void
}

const SideNavigationContext = createContext<SideNavigationContextValue | null>(null)

function useSideNavigationContext() {
  const context = useContext(SideNavigationContext)
  if (!context) {
    throw new Error("useSideNavigationContext must be used within SideNavigationProvider")
  }
  return context
}

// Custom scrollbar styles matching monorepo
const customScrollbarStyles = {
  "&::-webkit-scrollbar": {
    width: CUSTOM_SCROLL_BAR_SIZE_IN_PIXELS,
    height: CUSTOM_SCROLL_BAR_SIZE_IN_PIXELS,
  },
  "&::-webkit-scrollbar-thumb": {
    borderRadius: "4px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.4)" },
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
}

// Dark theme matching monorepo Theme.tsx
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#030A33",
      paper: "#030A33",
    },
    primary: {
      main: colors.extended.blue[60],
      contrastText: DARK_THEME_FONT_COLOR,
    },
    text: {
      primary: DARK_THEME_FONT_COLOR,
      secondary: DARK_THEME_FONT_COLOR,
    },
    divider: "#282E54",
  },
  components: {
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
        square: true,
      },
      styleOverrides: {
        root: {
          background: "transparent",
          boxShadow: "none",
          "&::before": {
            display: "none",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          minHeight: 32,
          padding: `0 ${NAVIGATION_HORIZONTAL_PADDING - CUSTOM_SCROLL_BAR_SIZE_IN_PIXELS}px`,
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
        content: {
          margin: "4px 0",
          "&.Mui-expanded": {
            margin: "4px 0",
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: `0 ${NAVIGATION_HORIZONTAL_PADDING - CUSTOM_SCROLL_BAR_SIZE_IN_PIXELS}px`,
          marginBottom: "8px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 400,
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: "1rem",
          "&::placeholder": {
            color: "#9CA3AF",
            opacity: 0.9,
            fontStyle: "italic",
          },
        },
      },
    },
  },
})

// Sidebar Navigation Link component matching monorepo Link.tsx
interface SidebarNavigationLinkProps {
  link: RouteLink
  onClick?: () => void
}

function SidebarNavigationLink({ link, onClick }: SidebarNavigationLinkProps) {
  const { sideNavigationState } = useSideNavigationContext()
  const linkIsActive = link.active === true

  return (
    <Stack direction="row" spacing={1}>
      <Divider
        orientation="vertical"
        flexItem
        sx={{ borderColor: linkIsActive ? "white" : "divider" }}
      />
      <Text
        variant="paragraph-medium"
        sx={{
          display: "inline-block",
          width: "100%",
        }}
      >
        <Link
          href={link.to}
          onClick={onClick}
          color="inherit"
          underline="none"
          tabIndex={sideNavigationState === SideNavigationState.Collapsed ? -1 : 0}
          sx={{
            display: "inline-block",
            width: "100%",
            paddingX: 1.5,
            paddingY: 0.5,
            borderRadius: 1,
            ...(linkIsActive
              ? {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    opacity: 1,
                  },
                }
              : {
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }),
          }}
        >
          {link.label}
        </Link>
      </Text>
    </Stack>
  )
}

// Sidebar Navigation Accordion matching monorepo LinkAccordion.tsx
interface SidebarNavigationLinkAccordionProps {
  routeSection: RouteSection
  sectionExpansionState: Record<string, SectionState>
  setSectionExpansionState: React.Dispatch<React.SetStateAction<Record<string, SectionState>>>
}

function SidebarNavigationLinkAccordion({
  routeSection,
  sectionExpansionState,
  setSectionExpansionState,
}: SidebarNavigationLinkAccordionProps) {
  const { label, links } = routeSection
  const { sideNavigationState } = useSideNavigationContext()
  const isExpanded = sectionExpansionState[label] === SectionState.Open

  // Check if any link in this section is active
  const hasActiveLink = links.some((link) => link.active)

  return (
    <Accordion
      expanded={isExpanded}
      onChange={(_, nextIsExpanded) => {
        setSectionExpansionState((prev) => ({
          ...prev,
          [label]: nextIsExpanded ? SectionState.Open : SectionState.Closed,
        }))
      }}
    >
      <AccordionSummary
        sx={{
          backgroundColor: hasActiveLink && !isExpanded ? "rgba(255, 255, 255, 0.2)" : "transparent",
        }}
        expandIcon={<Icon.ChevronDown color="text.primary" />}
        tabIndex={sideNavigationState === SideNavigationState.Collapsed ? -1 : 0}
      >
        <Text variant="paragraph-medium" bold={hasActiveLink || isExpanded}>
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

// Sidebar Navigation Button matching monorepo SidebarNavigationButton.tsx
function SidebarNavigationButton() {
  const {
    setSideNavigationModeToFixed,
    setSideNavigationModeToOverlayOnHover,
    sideNavigationMode,
    sideNavigationState,
  } = useSideNavigationContext()

  return (
    <IconButton
      aria-label={
        sideNavigationMode === SideNavigationMode.OverlayOnHover
          ? "Make navigation fixed"
          : "Make navigation collapsed"
      }
      aria-expanded={sideNavigationState === SideNavigationState.Expanded}
      onClick={() => {
        if (sideNavigationMode === SideNavigationMode.Fixed) {
          setSideNavigationModeToOverlayOnHover()
        } else {
          setSideNavigationModeToFixed()
        }
      }}
      tabIndex={sideNavigationState === SideNavigationState.Collapsed ? -1 : 0}
      sx={{ color: "white" }}
    >
      {sideNavigationMode === SideNavigationMode.OverlayOnHover ? (
        <PanelLeft size={20} />
      ) : (
        <PanelLeftClose size={20} />
      )}
    </IconButton>
  )
}

// Top Section matching monorepo TopSection.tsx
function SidebarNavigationTopSection() {
  const { sideNavigationState } = useSideNavigationContext()
  const isCollapsed = sideNavigationState === SideNavigationState.Collapsed

  return (
    <Stack gap={0.5} divider={<Divider />}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" paddingRight={isCollapsed ? 0 : 2}>
        <Link
          href="/"
          aria-label="Navigate to home page"
          tabIndex={isCollapsed ? -1 : 0}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            marginX: isCollapsed ? 0 : 2,
            paddingTop: 1.5,
            paddingBottom: 2,
            marginY: 0.25,
            transition: "0.2s",
            opacity: 1,
            width: isCollapsed ? "100%" : "auto",
            "&:hover": {
              background: "transparent",
            },
          }}
        >
          {isCollapsed ? (
            // Notable "N" icon for collapsed state - inline SVG matching the brand
            <Box
              sx={{
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="url(#notable-gradient)" />
                <path
                  d="M7.5 17V7H9.5L14.5 14V7H16.5V17H14.5L9.5 10V17H7.5Z"
                  fill="white"
                />
                <defs>
                  <linearGradient id="notable-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B82F6" />
                    <stop offset="1" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
              </svg>
            </Box>
          ) : (
            <Box
              sx={{
                width: 120,
                overflow: "hidden",
                display: "inline-block",
              }}
            >
              <Image
                src="/images/notable-full-logo.svg"
                alt="Notable"
                width={119}
                height={16}
                style={{ display: "block" }}
              />
            </Box>
          )}
        </Link>
        {!isCollapsed && <SidebarNavigationButton />}
      </Stack>
      {/* Search - show icon only when collapsed, full field when expanded */}
      <Box
        sx={{
          marginX: isCollapsed ? 0 : 2,
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start",
        }}
      >
        {isCollapsed ? (
          <IconButton
            aria-label="Search"
            sx={{ color: "#9CA3AF" }}
          >
            <Search size={20} />
          </IconButton>
        ) : (
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search"
            tabIndex={isCollapsed ? -1 : 0}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: "inherit" }}>
                  <Search size={16} color="#9CA3AF" />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "transparent",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                "&.Mui-focused": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
                color: "white",
              },
            }}
          />
        )}
      </Box>
    </Stack>
  )
}

// Middle Section matching monorepo MiddleSection.tsx
interface SidebarNavigationMiddleSectionProps {
  sectionExpansionState: Record<string, SectionState>
  setSectionExpansionState: React.Dispatch<React.SetStateAction<Record<string, SectionState>>>
}

function SidebarNavigationMiddleSection({
  sectionExpansionState,
  setSectionExpansionState,
}: SidebarNavigationMiddleSectionProps) {
  const { sideNavigationState } = useSideNavigationContext()

  const mainSections = navigationSections.filter((s) => s.type === "main")
  const secondarySections = navigationSections.filter((s) => s.type === "secondary")

  return (
    <Box
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
        flexGrow: 1,
        ...customScrollbarStyles,
        scrollbarGutter: "stable both-edges",
        width: SIDEBAR_NAVIGATION_DRAWER_WIDTH,
        opacity: sideNavigationState === SideNavigationState.Collapsed ? 0 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      {mainSections.map((routeSection) => (
        <SidebarNavigationLinkAccordion
          key={routeSection.label}
          routeSection={routeSection}
          sectionExpansionState={sectionExpansionState}
          setSectionExpansionState={setSectionExpansionState}
        />
      ))}

      {/* Divider between main and secondary sections */}
      <Divider
        sx={{
          marginY: 1,
          marginLeft: `-${NAVIGATION_HORIZONTAL_PADDING - CUSTOM_SCROLL_BAR_SIZE_IN_PIXELS}px`,
          marginRight: `-${NAVIGATION_HORIZONTAL_PADDING - CUSTOM_SCROLL_BAR_SIZE_IN_PIXELS}px`,
        }}
      />

      {secondarySections.map((routeSection) => (
        <SidebarNavigationLinkAccordion
          key={routeSection.label}
          routeSection={routeSection}
          sectionExpansionState={sectionExpansionState}
          setSectionExpansionState={setSectionExpansionState}
        />
      ))}
    </Box>
  )
}

// Bottom Section matching monorepo BottomSection.tsx
function SidebarNavigationBottomSection() {
  const { sideNavigationState } = useSideNavigationContext()
  const isCollapsed = sideNavigationState === SideNavigationState.Collapsed

  return (
    <Stack
      marginX={isCollapsed ? 0 : 2}
      gap={0.5}
      alignItems={isCollapsed ? "center" : "flex-start"}
      justifyContent="center"
    >
      {isCollapsed ? (
        // Icon-only buttons when collapsed
        <>
          <IconButton
            component={Link}
            href="https://docs.notablehealth.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Documentation"
            sx={{ color: "white" }}
          >
            <FileText size={20} />
          </IconButton>
          <IconButton
            onClick={() => {
              console.log("Sign out clicked")
            }}
            aria-label="Sign Out"
            sx={{ color: "white" }}
          >
            <LogOut size={20} />
          </IconButton>
        </>
      ) : (
        // Full buttons when expanded
        <>
          <Button
            component={Link}
            variant="text"
            href="https://docs.notablehealth.com"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<FileText size={16} />}
            color="inherit"
            fullWidth
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
            }}
          >
            <Text variant="paragraph-medium">Documentation</Text>
          </Button>
          <Button
            variant="text"
            color="inherit"
            startIcon={<LogOut size={16} />}
            onClick={() => {
              console.log("Sign out clicked")
            }}
            fullWidth
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
            }}
            aria-label="Sign Out"
          >
            <Text variant="paragraph-medium">Sign Out</Text>
          </Button>
        </>
      )}
    </Stack>
  )
}

// Main SideNavigation component matching monorepo Drawer.tsx
export function SideNavigation() {
  // State management matching monorepo context.ts
  const [sideNavigationMode, setSideNavigationMode] = useState<SideNavigationMode>(
    SideNavigationMode.Fixed
  )
  const [isNavigationHovering, setIsNavigationHovering] = useState(false)

  // Section expansion state - default "Build" to open since it has active link
  const [sectionExpansionState, setSectionExpansionState] = useState<Record<string, SectionState>>({
    Build: SectionState.Open,
  })

  const sideNavigationState = useMemo(() => {
    if (sideNavigationMode === SideNavigationMode.Fixed || isNavigationHovering) {
      return SideNavigationState.Expanded
    }
    return SideNavigationState.Collapsed
  }, [sideNavigationMode, isNavigationHovering])

  const setSideNavigationModeToFixed = useCallback(() => {
    setSideNavigationMode(SideNavigationMode.Fixed)
  }, [])

  const setSideNavigationModeToOverlayOnHover = useCallback(() => {
    setSideNavigationMode(SideNavigationMode.OverlayOnHover)
    setIsNavigationHovering(false)
  }, [])

  const contextValue = useMemo<SideNavigationContextValue>(
    () => ({
      sideNavigationMode,
      sideNavigationState,
      setSideNavigationModeToFixed,
      setSideNavigationModeToOverlayOnHover,
      isNavigationHovering,
      setIsNavigationHovering,
    }),
    [
      sideNavigationMode,
      sideNavigationState,
      setSideNavigationModeToFixed,
      setSideNavigationModeToOverlayOnHover,
      isNavigationHovering,
    ]
  )

  const isOverlayOnHover = sideNavigationMode === SideNavigationMode.OverlayOnHover

  return (
    <SideNavigationContext.Provider value={contextValue}>
      <ThemeProvider theme={darkTheme}>
        <Drawer
          open
          variant="permanent"
          sx={{
            flexShrink: 0,
            width: isOverlayOnHover
              ? SIDEBAR_NAVIGATION_COLLAPSED_WIDTH
              : SIDEBAR_NAVIGATION_DRAWER_WIDTH,
            transition: "width 0.2s ease",
            "& .MuiDrawer-paper": {
              width:
                sideNavigationState === SideNavigationState.Expanded
                  ? SIDEBAR_NAVIGATION_DRAWER_WIDTH
                  : SIDEBAR_NAVIGATION_COLLAPSED_WIDTH,
              transition: "width 0.2s ease",
            },
          }}
          slotProps={{
            paper: {
              sx: {
                overflow: "hidden",
                paddingY: 0.5,
                background: "linear-gradient(180deg, #030A33 0%, #00044B 100%)",
                boxShadow:
                  isOverlayOnHover && sideNavigationState === SideNavigationState.Expanded
                    ? 6
                    : 0,
              },
            },
          }}
          onMouseLeave={() => setIsNavigationHovering(false)}
          onMouseEnter={(event: React.MouseEvent) => {
            if (event.buttons === 0) {
              setIsNavigationHovering(true)
            }
          }}
        >
          <Stack
            role="navigation"
            sx={{ height: "100%", gap: 0.5, borderRadius: 0, overflowX: "hidden" }}
            divider={<Divider />}
            tabIndex={sideNavigationState === SideNavigationState.Collapsed ? -1 : 0}
          >
            <SidebarNavigationTopSection />
            <SidebarNavigationMiddleSection
              sectionExpansionState={sectionExpansionState}
              setSectionExpansionState={setSectionExpansionState}
            />
            <SidebarNavigationBottomSection />
          </Stack>
        </Drawer>
      </ThemeProvider>
    </SideNavigationContext.Provider>
  )
}
