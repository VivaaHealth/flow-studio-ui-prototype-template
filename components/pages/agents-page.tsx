"use client"
import { MagnifyingGlass, Plus, Circuitry, Phone, FileText, WaveTriangle, DotsThree } from "@phosphor-icons/react"
import type React from "react"
import { useState } from "react"

import { NotableButton } from "@/components/ui/notable-button"
import { PageTemplate } from "@/components/ui/page-template"
import { Box, TextField, InputAdornment } from "@mui/material"

interface AgentsPageProps {
  showSidebarToggle?: boolean
  onToggleSidebar?: () => void
}

interface AgentData {
  id: number
  name: string
  organization: string
  description: string
  lastModified: string
  priority: number
  icon: React.ComponentType<any>
  gradient: string
}

const initialAgentsData: AgentData[] = [
  {
    id: 1,
    name: "2 way Messaging Agent",
    organization: "PCHS",
    description: "Agent for 2way messaging flows",
    lastModified: "Jan 2, 2025, 10:15 am",
    priority: 1,
    icon: Phone,
    gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
  },
  {
    id: 2,
    name: "Authorizations Agent",
    organization: "PCHS",
    description: "Prior authorizations, denial management",
    lastModified: "Jan 2, 2025, 10:15 am",
    priority: 2,
    icon: WaveTriangle,
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
  },
  {
    id: 3,
    name: "Booking Confirmation Call Center",
    organization: "PCHS",
    description: "Automizing booking calls in the call center",
    lastModified: "Jan 2, 2025, 10:15 am",
    priority: 3,
    icon: Phone,
    gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
  },
  {
    id: 4,
    name: "Call Center Agent",
    organization: "PCHS",
    description: "Fulfills jobs from PCHS Call Center that can be automated",
    lastModified: "Jan 2, 2025, 10:15 am",
    priority: 4,
    icon: Phone,
    gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
  },
  {
    id: 5,
    name: "Care Coordinator",
    organization: "PCHS",
    description: "Manages patient care transitions. Conduct post-dischar...",
    lastModified: "Jan 2, 2025, 10:15 am",
    priority: 5,
    icon: FileText,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  },
  {
    id: 6,
    name: "Care Gap Outreach",
    organization: "PCHS",
    description: "Agent for flows related to Care Gap Outreaches to the p...",
    lastModified: "Jan 2, 2025, 10:15 am",
    priority: 6,
    icon: FileText,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  },
  {
    id: 7,
    name: "Clinical Algorithms",
    organization: "PCHS",
    description: "Flows to enable the processing of clinical data for auto...",
    lastModified: "Jan 2, 2025, 10:15 am",
    priority: 7,
    icon: WaveTriangle,
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
  },
  {
    id: 8,
    name: "Clinical Documentation Analyst",
    organization: "PCHS",
    description: "Review health care documentation to assess the qualit...",
    lastModified: "Jan 2, 2025, 10:15 am",
    priority: 8,
    icon: WaveTriangle,
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
  },
  {
    id: 9,
    name: "Clinical Trials",
    organization: "PCHS",
    description: "Flows to send patients clinical trial opportunities",
    lastModified: "Jan 2, 2025, 10:15 am",
    priority: 9,
    icon: FileText,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  },
  {
    id: 10,
    name: "Enrollment Agent",
    organization: "PCHS",
    description: "Enables initiatives to grow enrollment numbers for PCHS",
    lastModified: "Jan 2, 2025, 10:15 am",
    priority: 10,
    icon: FileText,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  },
  {
    id: 11,
    name: "HCC Suspecting",
    organization: "PCHS",
    description: "Agent that evaluates clinical data from orders to abstra...",
    lastModified: "Jan 2, 2025, 10:15 am",
    priority: 11,
    icon: WaveTriangle,
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
  },
  {
    id: 12,
    name: "Inpatient Operations Agent",
    organization: "PCHS",
    description: "Inpatent authorizations, Peer-to-peer, Denials, Out-of-...",
    lastModified: "Jan 2, 2025, 10:15 am",
    priority: 12,
    icon: FileText,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  },
]

export function AgentsPage({ showSidebarToggle = false, onToggleSidebar }: AgentsPageProps) {
  const [readyRowData, setReadyRowData] = useState(initialAgentsData.slice(0, 5))
  const [rowData, setRowData] = useState(initialAgentsData)
  const [draggedItem, setDraggedItem] = useState<AgentData | null>(null)

  const handleReadyDragStart = (e: React.DragEvent, item: AgentData) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleReadyDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleReadyDrop = (e: React.DragEvent, targetItem: AgentData) => {
    e.preventDefault()

    if (!draggedItem || draggedItem.id === targetItem.id) return

    const newData = [...readyRowData]
    const draggedIndex = newData.findIndex((item) => item.id === draggedItem.id)
    const targetIndex = newData.findIndex((item) => item.id === targetItem.id)

    newData.splice(draggedIndex, 1)
    newData.splice(targetIndex, 0, draggedItem)

    const updatedData = newData.map((item, index) => ({
      ...item,
      priority: index + 1,
    }))

    setReadyRowData(updatedData)
    setDraggedItem(null)
  }

  const handleDragStart = (e: React.DragEvent, item: AgentData) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetItem: AgentData) => {
    e.preventDefault()

    if (!draggedItem || draggedItem.id === targetItem.id) return

    const newData = [...rowData]
    const draggedIndex = newData.findIndex((item) => item.id === draggedItem.id)
    const targetIndex = newData.findIndex((item) => item.id === targetItem.id)

    newData.splice(draggedIndex, 1)
    newData.splice(targetIndex, 0, draggedItem)

    const updatedData = newData.map((item, index) => ({
      ...item,
      priority: index + 1,
    }))

    setRowData(updatedData)
    setDraggedItem(null)
  }

  return (
    <PageTemplate
      icon={<Circuitry style={{ width: 20, height: 20, color: "white" }} />}
      title="Agents"
      action={
        <NotableButton>
          <Plus style={{ width: 20, height: 20 }} />
          Create an agent
        </NotableButton>
      }
      showSidebarToggle={showSidebarToggle}
      onToggleSidebar={onToggleSidebar}
    >
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search"
          variant="outlined"
          size="small"
          sx={{
            maxWidth: "384px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              bgcolor: "white",
              "& fieldset": {
                borderColor: "#d1d5db",
              },
              "&:hover fieldset": {
                borderColor: "#9ca3af",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#002766",
                borderWidth: "2px",
              },
            },
            "& .MuiOutlinedInput-input::placeholder": {
              fontStyle: "italic",
              color: "#737373",
              opacity: 1,
            },
            "& .MuiOutlinedInput-input": {
              color: "#3F3F3F",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MagnifyingGlass style={{ width: 20, height: 20, color: "#737373" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#374151", marginBottom: "16px" }}>Ready</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e5e7eb" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb" }}>
              <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #e5e7eb", width: "100px" }}>
                Priority
              </th>
              <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #e5e7eb", width: "300px" }}>
                Agent name
              </th>
              <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #e5e7eb", width: "150px" }}>
                Organization
              </th>
              <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #e5e7eb", width: "400px" }}>
                Description
              </th>
              <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #e5e7eb", width: "200px" }}>
                Last modified
              </th>
            </tr>
          </thead>
          <tbody>
            {readyRowData.map((agent) => {
              const IconComponent = agent.icon
              return (
                <tr
                  key={agent.id}
                  draggable
                  onDragStart={(e) => handleReadyDragStart(e, agent)}
                  onDragOver={handleReadyDragOver}
                  onDrop={(e) => handleReadyDrop(e, agent)}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    cursor: "move",
                    backgroundColor: draggedItem?.id === agent.id ? "#f3f4f6" : "white",
                  }}
                >
                  <td style={{ padding: "8px" }}>{agent.priority}</td>
                  <td style={{ padding: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          background: agent.gradient,
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconComponent style={{ width: "12px", height: "12px", color: "white" }} />
                      </div>
                      {agent.name}
                    </div>
                  </td>
                  <td style={{ padding: "8px" }}>{agent.organization}</td>
                  <td style={{ padding: "8px" }}>{agent.description}</td>
                  <td style={{ padding: "8px" }}>{agent.lastModified}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#374151", marginBottom: "16px" }}>Ready to build</h2>
      <div style={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: 600, color: "#374151", width: "100px" }}>
                Priority
              </th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: 600, color: "#374151", width: "300px" }}>
                Agent name
              </th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: 600, color: "#374151", width: "150px" }}>
                Organization
              </th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: 600, color: "#374151", width: "400px" }}>
                Description
              </th>
              <th style={{ padding: "12px", textAlign: "left", fontWeight: 600, color: "#374151", width: "200px" }}>
                Last modified
              </th>
              <th
                style={{ padding: "12px", textAlign: "center", fontWeight: 600, color: "#374151", width: "80px" }}
              ></th>
            </tr>
          </thead>
          <tbody>
            {rowData.map((agent) => {
              const IconComponent = agent.icon
              return (
                <tr
                  key={agent.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, agent)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, agent)}
                  style={{
                    borderBottom: "1px solid #f3f4f6",
                    cursor: "move",
                    backgroundColor: draggedItem?.id === agent.id ? "#f3f4f6" : "white",
                  }}
                >
                  <td style={{ padding: "12px", color: "#374151" }}>{agent.priority}</td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          background: agent.gradient,
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconComponent style={{ width: "16px", height: "16px", color: "white" }} />
                      </div>
                      <span style={{ color: "#374151" }}>{agent.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px", color: "#374151" }}>{agent.organization}</td>
                  <td style={{ padding: "12px", color: "#374151" }}>{agent.description}</td>
                  <td style={{ padding: "12px", color: "#374151" }}>{agent.lastModified}</td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <DotsThree style={{ width: "20px", height: "20px", color: "#9ca3af" }} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </PageTemplate>
  )
}
