"use client"

import React, { useState } from "react"
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  SvgIcon,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material"
import { Text, Title, colors } from "@vivaahealth/design-system"
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  MoreHorizontal,
} from "lucide-react"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"
import PhoneIcon from "@mui/icons-material/Phone"
import AssignmentIcon from "@mui/icons-material/Assignment"
import ScienceIcon from "@mui/icons-material/Science"
import PersonIcon from "@mui/icons-material/Person"
import VerifiedIcon from "@mui/icons-material/Verified"
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"

// Agent categories matching the real product
type AgentCategory =
  | "rcm"
  | "authorization"
  | "callCenter"
  | "chartScrubbing"
  | "clinicalTrials"
  | "frontDesk"
  | "inpatientCare"
  | "medicationAdherence"
  | "patient"
  | "patientCare"
  | "quality"
  | "referrals"
  | "placeholder"

// Operational group colors matching the real product
const operationalGroupColors: Record<string, { dark: string; light: string }> = {
  rcm: { dark: "#1e40af", light: "#3b82f6" },
  authorization: { dark: "#7c3aed", light: "#a78bfa" },
  callCenter: { dark: "#0891b2", light: "#22d3d8" },
  chartScrubbing: { dark: "#059669", light: "#34d399" },
  clinicalTrials: { dark: "#d97706", light: "#fbbf24" },
  frontDesk: { dark: "#dc2626", light: "#f87171" },
  inpatientCare: { dark: "#9333ea", light: "#c084fc" },
  medicationAdherence: { dark: "#be185d", light: "#f472b6" },
  patient: { dark: "#0d9488", light: "#2dd4bf" },
  patientCare: { dark: "#4f46e5", light: "#818cf8" },
  quality: { dark: "#65a30d", light: "#a3e635" },
  referrals: { dark: "#ea580c", light: "#fb923c" },
  placeholder: { dark: "#374151", light: "#6b7280" },
}

// Icon map for agent categories
const categoryIcons: Record<AgentCategory, React.ReactNode> = {
  rcm: <AttachMoneyIcon sx={{ fontSize: 16, color: "white" }} />,
  authorization: <VerifiedIcon sx={{ fontSize: 16, color: "white" }} />,
  callCenter: <PhoneIcon sx={{ fontSize: 16, color: "white" }} />,
  chartScrubbing: <AssignmentIcon sx={{ fontSize: 16, color: "white" }} />,
  clinicalTrials: <ScienceIcon sx={{ fontSize: 16, color: "white" }} />,
  frontDesk: <PersonIcon sx={{ fontSize: 16, color: "white" }} />,
  inpatientCare: <LocalHospitalIcon sx={{ fontSize: 16, color: "white" }} />,
  medicationAdherence: <MedicalServicesIcon sx={{ fontSize: 16, color: "white" }} />,
  patient: <PersonIcon sx={{ fontSize: 16, color: "white" }} />,
  patientCare: <LocalHospitalIcon sx={{ fontSize: 16, color: "white" }} />,
  quality: <VerifiedIcon sx={{ fontSize: 16, color: "white" }} />,
  referrals: <AssignmentIcon sx={{ fontSize: 16, color: "white" }} />,
  placeholder: <PersonIcon sx={{ fontSize: 16, color: "white" }} />,
}

// Fully anonymized dummy data
const flowsData = [
  {
    id: "1",
    name: "Billing Automation Agent",
    organization: "Acme Healthcare",
    category: "rcm" as AgentCategory,
    lastRun: "02/03/2026",
    flowRuns: 7022,
    value: 110,
    children: [],
  },
  {
    id: "2",
    name: "Prior Auth Agent",
    organization: "Valley Medical Center",
    category: "authorization" as AgentCategory,
    lastRun: "12/16/2025",
    flowRuns: 9,
    value: 0,
    children: [],
  },
  {
    id: "3",
    name: "Patient Outreach Agent",
    organization: "Demo Organization",
    category: "callCenter" as AgentCategory,
    lastRun: "10/30/2025",
    flowRuns: 13,
    value: 0,
    children: [
      {
        id: "3-1",
        name: "Appointment Reminder Flow",
        status: "Draft",
        createdBy: "jane.doe@...",
        lastRun: "06/26/2025",
        flowRuns: 8,
        value: 0,
      },
      {
        id: "3-2",
        name: "Follow-up Care Nudge",
        status: "Draft",
        createdBy: "jane.doe@...",
        lastRun: "10/30/2025",
        flowRuns: 5,
        value: 0,
      },
      {
        id: "3-3",
        name: "Wellness Check Outreach",
        status: "Draft",
        createdBy: "john.smith@...",
        lastRun: null,
        flowRuns: 0,
        value: 0,
      },
      {
        id: "3-4",
        name: "Pre-Procedure Instructions",
        status: null,
        createdBy: "jane.doe@...",
        lastRun: null,
        flowRuns: 0,
        value: 0,
      },
      {
        id: "3-5",
        name: "Test Flow",
        status: "Draft",
        createdBy: "admin@...",
        lastRun: null,
        flowRuns: 0,
        value: 0,
      },
    ],
  },
  {
    id: "4",
    name: "Chart Review Agent",
    organization: "Metro Health System",
    category: "chartScrubbing" as AgentCategory,
    lastRun: "07/22/2025",
    flowRuns: 26,
    value: 0,
    children: [],
  },
  {
    id: "5",
    name: "Development Testing",
    organization: "Internal - Engineering",
    category: "placeholder" as AgentCategory,
    lastRun: "01/15/2026",
    flowRuns: 3,
    value: 0,
    children: [],
  },
  {
    id: "6",
    name: "Clinical Trial Screening",
    organization: "Research Institute",
    category: "clinicalTrials" as AgentCategory,
    lastRun: "11/08/2025",
    flowRuns: 1,
    value: 0,
    children: [],
  },
  {
    id: "7",
    name: "Quality Metrics Agent",
    organization: "Quality Partners",
    category: "quality" as AgentCategory,
    lastRun: "12/11/2025",
    flowRuns: 167,
    value: 0,
    children: [],
  },
  {
    id: "8",
    name: "Referral Coordinator",
    organization: "Specialty Network",
    category: "referrals" as AgentCategory,
    lastRun: "10/07/2025",
    flowRuns: 4,
    value: 0,
    children: [],
  },
  {
    id: "9",
    name: "Patient Care Navigator",
    organization: "Community Health",
    category: "patientCare" as AgentCategory,
    lastRun: "01/27/2026",
    flowRuns: 851,
    value: 0,
    children: [],
  },
]

const tabs = [
  { id: "all", label: "All" },
  { id: "published", label: "Published" },
  { id: "review", label: "Review" },
  { id: "draft", label: "Draft" },
]

export default function FlowsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set(["3"]))
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(100)

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const formatValue = (value: number) => {
    return value > 0 ? `$${value}` : "$0"
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#ffffff" }}>
      {/* Header */}
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 6,
          bgcolor: "white",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Title variant="h1" sx={{ fontSize: "1.5rem", fontWeight: 600 }}>
          Flows
        </Title>
        <Stack direction="row" spacing={2}>
          <Box
            component="button"
            sx={{
              px: 4,
              py: 2,
              borderRadius: "4px",
              border: "1px solid #0061FF",
              bgcolor: "white",
              color: "#0061FF",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              "&:hover": { bgcolor: "#f0f7ff" },
            }}
          >
            Explore Templates
          </Box>
          <Box
            component="button"
            sx={{
              px: 4,
              py: 2,
              borderRadius: "4px",
              border: "none",
              bgcolor: "#0061FF",
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:hover": { bgcolor: "#0052D9" },
            }}
          >
            Create Flow
          </Box>
        </Stack>
      </Box>

      {/* Filters */}
      <Box sx={{ px: 6, py: 3, bgcolor: "white" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <FilterChip icon={<Plus size={14} />} label="Organization" />
          <FilterChip icon={<Plus size={14} />} label="Agent" />
          <FilterChip icon={<Plus size={14} />} label="Created by" />
          <TextField
            size="small"
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="#9ca3af" />
                </InputAdornment>
              ),
            }}
            sx={{
              width: 200,
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                bgcolor: "#f9fafb",
                "& fieldset": { borderColor: "#e5e7eb" },
              },
            }}
          />
        </Stack>
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 6 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              color: "#6b7280",
              minHeight: 48,
              "&.Mui-selected": {
                color: "#002766",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#1d4ed8",
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} value={tab.id} />
          ))}
        </Tabs>
      </Box>

      {/* Table */}
      <Box sx={{ flex: 1, px: 6, py: 0 }}>
        <TableContainer sx={{ bgcolor: "white", border: "1px solid #e5e7eb", borderTop: "none" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell sx={{ fontWeight: 500, color: "#374151", width: "40%" }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Text sx={{ fontWeight: 500 }}>Agent / Flow</Text>
                    <Box sx={{ color: "#9ca3af" }}>↑</Box>
                  </Stack>
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: "#374151", width: "10%" }}>
                  <Text sx={{ fontWeight: 500 }}>Status</Text>
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: "#374151", width: "15%" }}>
                  <Text sx={{ fontWeight: 500 }}>Created by</Text>
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: "#374151", width: "12%" }}>
                  <Text sx={{ fontWeight: 500 }}>Last Run</Text>
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: "#374151", width: "10%", textAlign: "right" }}>
                  <Tooltip title="Flow runs update in real time. Values represent all-time totals.">
                    <Stack direction="row" alignItems="center" gap={0.5} justifyContent="flex-end">
                      <Text sx={{ fontWeight: 500 }}>Flow Runs</Text>
                      <InfoOutlinedIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
                    </Stack>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ fontWeight: 500, color: "#374151", width: "8%", textAlign: "right" }}>
                  <Tooltip title="Value data refreshes about every 12 hours. Values represent all-time data.">
                    <Stack direction="row" alignItems="center" gap={0.5} justifyContent="flex-end">
                      <Text sx={{ fontWeight: 500 }}>Value</Text>
                      <InfoOutlinedIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
                    </Stack>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ width: "5%" }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {flowsData.map((agent) => (
                <React.Fragment key={agent.id}>
                  {/* Agent Row */}
                  <TableRow
                    sx={{
                      bgcolor: "#f9fafb",
                      "&:hover": { bgcolor: "#f3f4f6" },
                      cursor: "pointer",
                    }}
                    onClick={() => toggleRow(agent.id)}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "#6b7280",
                            transform: expandedRows.has(agent.id) ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.1s ease-in-out",
                          }}
                        >
                          <ChevronDown size={16} />
                        </Box>
                        <AgentCategoryIcon category={agent.category} />
                        <Text sx={{ fontWeight: 600 }}>{agent.name}</Text>
                        <Text sx={{ color: "#6b7280", fontWeight: 400 }}>[{agent.organization}]</Text>
                      </Stack>
                    </TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell>
                      <Text sx={{ color: "#374151" }}>{agent.lastRun}</Text>
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Text sx={{ color: "#374151" }}>{agent.flowRuns.toLocaleString()}</Text>
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Text sx={{ color: "#374151" }}>{formatValue(agent.value)}</Text>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <MoreHorizontal size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Child Flow Rows */}
                  {expandedRows.has(agent.id) &&
                    agent.children.map((flow) => (
                      <TableRow key={flow.id} sx={{ "&:hover": { bgcolor: "#f9fafb" } }}>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 6 }}>
                            <Text>{flow.name}</Text>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {flow.status && (
                            <Chip
                              label={flow.status}
                              size="small"
                              sx={{
                                bgcolor: "#f3f4f6",
                                color: "#374151",
                                fontSize: "0.75rem",
                                height: 24,
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Text sx={{ color: "#374151" }}>{flow.createdBy}</Text>
                        </TableCell>
                        <TableCell>
                          <Text sx={{ color: "#374151" }}>{flow.lastRun || ""}</Text>
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          <Text sx={{ color: "#374151" }}>{flow.flowRuns}</Text>
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          <Text sx={{ color: "#374151" }}>{formatValue(flow.value)}</Text>
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ bgcolor: "white", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb" }}>
          <TablePagination
            component="div"
            count={-1}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            labelDisplayedRows={() => "1–100 of more than 100"}
            rowsPerPageOptions={[25, 50, 100]}
          />
        </Box>
      </Box>
    </Box>
  )
}

// Helper Components
function FilterChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 3,
        py: 1.5,
        borderRadius: "20px",
        border: "1px solid #e5e7eb",
        bgcolor: "white",
        cursor: "pointer",
        "&:hover": { bgcolor: "#f9fafb" },
      }}
    >
      {icon}
      <Text sx={{ fontSize: "0.875rem", color: "#374151" }}>{label}</Text>
    </Box>
  )
}

// Agent Category Icon component matching the real product pattern
interface AgentCategoryIconProps {
  category: AgentCategory
  size?: number
}

function AgentCategoryIcon({ category, size = 24 }: AgentCategoryIconProps) {
  const colors = operationalGroupColors[category] || operationalGroupColors.placeholder
  const background = `linear-gradient(to right, ${colors.dark}, ${colors.light})`

  return (
    <Box
      sx={{
        width: size,
        height: size,
        background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "6px",
      }}
    >
      {categoryIcons[category] || categoryIcons.placeholder}
    </Box>
  )
}
