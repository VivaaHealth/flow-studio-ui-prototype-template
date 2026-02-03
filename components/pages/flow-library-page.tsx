"use client"

import { Box, Typography, TextField, InputAdornment, Grid, Card, CardContent, IconButton, Button } from "@mui/material"
import { Search, ChevronLeft, ChevronRight, ArrowForward, KeyboardArrowDown } from "@mui/icons-material"
import { House, FlowArrow, Users, FolderOpen, Buildings, Bookmark, MapPin } from "@phosphor-icons/react"
import { useState } from "react"

export function FlowLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("Explore library")

  const sidebarItems = [
    { icon: <House size={16} weight="regular" />, label: "Explore library" },
    { icon: <FlowArrow size={16} weight="regular" />, label: "Flow type", hasDropdown: true },
    { icon: <Users size={16} weight="regular" />, label: "Agents", hasDropdown: true },
    { icon: <FolderOpen size={16} weight="regular" />, label: "My templates" },
    { icon: <Buildings size={16} weight="regular" />, label: 'From "Organization"' },
    { icon: <Bookmark size={16} weight="regular" />, label: "Bookmarks" },
    { icon: <MapPin size={16} weight="regular" />, label: "Roadmap" },
  ]

  const flowData = {
    "Explore library": [
      "ADR (Attachment Denial Resolution)",
      "Inbound Contact Center Symptom Triage",
      "Care Gap Closure - Diabetic Retinopathy",
      "ED Discharge - PCP Follow Up",
      "Fax Documented Classification",
      "Chart Abstraction: Quality Registry - Joint Commission Stroke",
      "E&M Coding Audit Demo",
      "Pre-Surgical questionnaire via voice",
      "Pre-Visit Patient Call with Chart Summarization",
    ],
    "Flow type": [
      "Authorization Flows",
      "Documentation Flows",
      "Billing Flows",
      "Patient Communication Flows",
      "Quality Reporting Flows",
      "Care Coordination Flows",
    ],
    Agents: [
      "Admissions Coordinator Agent",
      "Documentation and Coding Agent",
      "Billing Specialist Agent",
      "Practice Management Agent",
      "Patient Care Coordinator Agent",
      "Quality Assurance Agent",
    ],
    "My templates": [
      "Custom Authorization Template",
      "Personal Documentation Flow",
      "My Billing Workflow",
      "Custom Patient Outreach",
    ],
    'From "Organization"': [
      "Organization Standard Auth Flow",
      "Corporate Documentation Template",
      "Enterprise Billing Process",
      "Organizational Quality Metrics",
    ],
    Bookmarks: [
      "Bookmarked: Care Plan Generator",
      "Bookmarked: Lab Results Processing",
      "Bookmarked: Medication Tracker",
    ],
    Roadmap: ["Planned: Advanced Analytics Flow", "Planned: AI-Powered Triage", "Planned: Automated Reporting Suite"],
  }

  const handleFilterClick = (label: string) => {
    setActiveFilter(label)
  }

  const currentFlows = flowData[activeFilter as keyof typeof flowData] || []

  const latestTemplates = [
    "ADR (Attachment Denial Resolution)",
    "Inbound Contact Center Symptom Triage",
    "Care Gap Closure - Diabetic Retinopathy",
    "ED Discharge - PCP Follow Up",
    "Fax Documented Classification",
    "Chart Abstraction: Quality Registry - Joint Commission Stroke",
  ]

  const templateCategories = [
    "E&M Coding Audit Demo",
    "Pre-Surgical questionnaire via voice",
    "Pre-Visit Patient Call with Chart Summarization",
  ]

  const agents = [
    {
      name: "Admissions Coordinator",
      description:
        "Body copy description of AI Agent including applicable flows of interest. This section can be 1-3 sentences long.",
    },
    {
      name: "Documentation and Coding",
      description:
        "Body copy description of AI Agent including applicable flows of interest. This section can be 1-3 sentences long.",
    },
    {
      name: "Billing Specialist",
      description:
        "Body copy description of AI Agent including applicable flows of interest. This section can be 1-3 sentences long.",
    },
    {
      name: "Practice",
      description:
        "Body copy description of AI Agent including applicable flows of interest. This section can be 1-3 sentences long.",
    },
  ]

  const heroContent = (
    <Box
      sx={{
        backgroundColor: "#e0e7ff",
        p: 6,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: "#1e1b4b" }}>
        Explore the flow library
      </Typography>
      <Typography sx={{ color: "#475569", mb: 4, maxWidth: 600, mx: "auto" }}>
        Explore our diverse templates tailored for various solution areas, including authorizations, practice
        coordination, and practice quality.
      </Typography>
      <TextField
        fullWidth
        placeholder="What do you want to automate"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          maxWidth: 500,
          backgroundColor: "white",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "#9ca3af" }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  )

  const sidebarContent = (
    <Box sx={{ backgroundColor: "#f9fafb", borderRadius: "8px", p: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {sidebarItems.map((item, index) => (
          <Box
            key={index}
            onClick={() => handleFilterClick(item.label)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              py: 2,
              px: 3,
              borderRadius: "6px",
              backgroundColor: activeFilter === item.label ? "#e0e7ff" : "transparent",
              color: activeFilter === item.label ? "#3730a3" : "#6b7280",
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: "1px solid",
              borderColor: activeFilter === item.label ? "#c7d2fe" : "transparent",
              "&:hover": {
                backgroundColor: activeFilter === item.label ? "#e0e7ff" : "#f3f4f6",
                borderColor: activeFilter === item.label ? "#c7d2fe" : "#e5e7eb",
              },
            }}
          >
            {item.icon}
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: activeFilter === item.label ? 600 : 400,
                flex: 1,
              }}
            >
              {item.label}
            </Typography>
            {item.hasDropdown && <KeyboardArrowDown sx={{ fontSize: 16, color: "#9ca3af" }} />}
          </Box>
        ))}
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {/* Hero Section */}
      <Box sx={{ px: 6, py: 6 }}>
        <Box sx={{ borderRadius: "8px", overflow: "hidden" }}>{heroContent}</Box>
      </Box>

      {/* Main Content - Two Column Layout */}
      <Box sx={{ display: "flex", px: 6, pb: 6, gap: 6 }}>
        {/* Left Column - Sticky Sidebar */}
        <Box
          sx={{
            width: 280,
            position: "sticky",
            top: "88px", // Height of action bar + some padding
            alignSelf: "flex-start",
            flexShrink: 0,
          }}
        >
          {sidebarContent}
        </Box>

        {/* Right Column - Scrollable Content */}
        <Box sx={{ flex: 1 }}>
          {activeFilter === "Explore library" ? (
            <>
              {/* Featured Template */}
              <Box
                sx={{
                  border: "1px solid hsl(var(--border-light))",
                  borderRadius: "8px",
                  p: 4,
                  mb: 6,
                  backgroundColor: "white",
                }}
              >
                <Box sx={{ display: "flex", gap: 4 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: "12px", color: "#6b7280", mb: 1, textTransform: "uppercase" }}>
                      Featured Template
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: "#3f3f3f" }}>
                      Post-Visit Pre-Claim HCC Suspecting
                    </Typography>
                    <Typography sx={{ color: "#6b7280", fontSize: "14px", lineHeight: 1.5 }}>
                      Categorizes each fax page and returns the contents from included pages only.
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 200,
                      height: 150,
                      backgroundColor: "#f9fafb",
                      border: "1px solid hsl(var(--border-light))",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FolderOpen sx={{ fontSize: 48, color: "#d1d5db" }} />
                  </Box>
                </Box>
              </Box>

              {/* Latest Templates */}
              <Box sx={{ mb: 6 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: "#3f3f3f" }}>
                    Latest templates
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      color: "#3b82f6",
                      borderColor: "#3b82f6",
                      "&:hover": { backgroundColor: "#eff6ff" },
                    }}
                  >
                    View all latest templates
                  </Button>
                </Box>
                <Grid container spacing={3} sx={{ justifyContent: "flex-start" }}>
                  {latestTemplates.map((template, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card
                        sx={{
                          height: 200,
                          border: "1px solid hsl(var(--border-light))",
                          borderRadius: "4px",
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "#f9fafb" },
                          width: "100%", // Ensure full width within grid item
                        }}
                      >
                        <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                          <Box
                            sx={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mb: 2,
                            }}
                          >
                            <FolderOpen sx={{ fontSize: 32, color: "#d1d5db" }} />
                          </Box>
                          <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#3f3f3f" }}>
                            {template}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Template Category */}
              <Box sx={{ mb: 6 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: "#3f3f3f" }}>
                  Template category
                </Typography>
                <Grid container spacing={3} sx={{ justifyContent: "flex-start" }}>
                  {templateCategories.map((template, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card
                        sx={{
                          height: 200,
                          border: "1px solid hsl(var(--border-light))",
                          borderRadius: "4px",
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "#f9fafb" },
                          width: "100%", // Ensure full width within grid item
                        }}
                      >
                        <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                          <Box
                            sx={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mb: 2,
                            }}
                          >
                            <FolderOpen sx={{ fontSize: 32, color: "#d1d5db" }} />
                          </Box>
                          <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#3f3f3f" }}>
                            {template}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Explore Our Agents */}
              <Box sx={{ mb: 6 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#3f3f3f" }}>
                    Explore our agents
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton size="small" sx={{ border: "1px solid hsl(var(--border-light))" }}>
                      <ChevronLeft />
                    </IconButton>
                    <IconButton size="small" sx={{ border: "1px solid hsl(var(--border-light))" }}>
                      <ChevronRight />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 3, overflowX: "auto" }}>
                  {agents.map((agent, index) => (
                    <Card
                      key={index}
                      sx={{
                        minWidth: 280,
                        border: "1px solid hsl(var(--border-light))",
                        borderRadius: "4px",
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f9fafb" },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            width: "100%",
                            height: 120,
                            backgroundColor: "#f9fafb",
                            border: "1px solid hsl(var(--border-light))",
                            borderRadius: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 3,
                          }}
                        >
                          <Users sx={{ fontSize: 32, color: "#d1d5db" }} />
                        </Box>
                        <Typography sx={{ fontSize: "16px", fontWeight: 600, mb: 2, color: "#3f3f3f" }}>
                          {agent.name}
                        </Typography>
                        <Typography sx={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.4 }}>
                          {agent.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>

              {/* Get Started Easily */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#3f3f3f" }}>
                  Get started easily
                </Typography>
                <Typography sx={{ color: "#6b7280", mb: 4, fontSize: "14px" }}>
                  Check out our resources below to get the information you need, when you need it.
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography sx={{ fontSize: "16px", fontWeight: 600, mb: 2, color: "#3f3f3f" }}>
                        Implementation guides
                      </Typography>
                      <Typography sx={{ fontSize: "14px", color: "#6b7280", mb: 3, lineHeight: 1.5 }}>
                        Empower your team by developing automations to improving the health outcomes of a specific group
                        or population.
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#3b82f6", cursor: "pointer" }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>Get the guide</Typography>
                        <ArrowForward sx={{ fontSize: 16 }} />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography sx={{ fontSize: "16px", fontWeight: 600, mb: 2, color: "#3f3f3f" }}>
                        Documentation
                      </Typography>
                      <Typography sx={{ fontSize: "14px", color: "#6b7280", mb: 3, lineHeight: 1.5 }}>
                        Search our documentation for details about our blocks, use cases, and more.
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#3b82f6", cursor: "pointer" }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>View documentation</Typography>
                        <ArrowForward sx={{ fontSize: 16 }} />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </>
          ) : (
            <Box>
              <Box
                sx={{
                  borderBottom: "1px solid hsl(var(--border-light))",
                  pb: 3,
                  mb: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: "#3f3f3f" }}>
                    {activeFilter}
                  </Typography>
                  <Typography sx={{ color: "#6b7280", fontSize: "14px" }}>
                    {currentFlows.length} {currentFlows.length === 1 ? "item" : "items"} found
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    color: "#6b7280",
                    borderColor: "#d1d5db",
                    "&:hover": { backgroundColor: "#f9fafb" },
                  }}
                >
                  Sort by relevance
                </Button>
              </Box>

              <Grid container spacing={4}>
                {currentFlows.map((flow, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card
                      sx={{
                        height: 220,
                        border: "1px solid hsl(var(--border-light))",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#f9fafb",
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        },
                        width: "100%", // Ensure full width within grid item
                      }}
                    >
                      <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                        <Box
                          sx={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 3,
                            backgroundColor: "#f8fafc",
                            borderRadius: "6px",
                            p: 2,
                          }}
                        >
                          <FolderOpen sx={{ fontSize: 36, color: "#94a3b8" }} />
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#3f3f3f",
                            lineHeight: 1.4,
                            textAlign: "center",
                          }}
                        >
                          {flow}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
