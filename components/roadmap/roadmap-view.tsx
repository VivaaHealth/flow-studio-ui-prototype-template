"use client"

import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ScatterPlotView } from "./scatter-plot-view"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table2, Grid3X3 } from "lucide-react"
import { Edit2, Plus } from "lucide-react" // Import Edit2 and Plus

import type React from "react"

import type { ReactElement } from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Drawer,
  IconButton,
  TextField, // Added TextField import for calculation input fields
  Button,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { X, Edit, Upload, Trash2 } from "lucide-react"
import { Info } from "@phosphor-icons/react"
import { SharedTable } from "./shared-table"

interface Flow {
  id: string
  name: string
  description?: string
  priority?: string
  agentRole?: string
  baselineVolume?: number
  completionRate?: number
  value?: number
  utilization?: number
  roi?: string
  complexity?: number
  potentialValue?: number
  status?: string
  category?: string
  contentItems?: FileItem[]
  links?: FileItem[] // Ensure links are part of the Flow interface
}

interface FileItem {
  id: string
  name: string
  type: "file" | "link" | "Charter" | "Reference Sheet" | "Scope of Work" | "Other"
  url?: string
  variant?: "Charter" | "Reference Sheet" | "Scope of Work" | "Other" | ""
  description?: string
  size?: number
}

const calculateUsage = (flow: Flow): number =>
  Math.round((flow.baselineVolume || 0) * ((flow.completionRate || 0) / 100))

const calculateValue = (flow: Flow): number => {
  const usage = (flow.baselineVolume || 0) * ((flow.completionRate || 0) / 100)
  return usage * ((flow.value || 0) - (flow.utilization || 0))
}

const calculateROI = (flow: Flow): string => {
  if (!flow.utilization) return "0%"
  const roi = ((flow.value || 0) / flow.utilization) * 100
  return `${Math.round(roi)}%`
}

const validateFlowForReady = (flow: Flow): string => {
  const missing = []
  if (!flow.baselineVolume) missing.push("Baseline Volume")
  if (!flow.completionRate) missing.push("Deflection Rate")
  if (!flow.value) missing.push("Value per Run")
  if (!flow.utilization) missing.push("Price per Run")

  return missing.length > 0 ? `Missing required fields: ${missing.join(", ")}` : ""
}

const getPlanningProgress = (flow: Flow, currentValues?: Partial<Flow>) => {
  if (flow.status !== "Planning") return null

  // Use current form values if provided, otherwise use flow values
  const values = currentValues ? { ...flow, ...currentValues } : flow

  const fields = [
    {
      name: "Usage",
      value: values.baselineVolume && values.completionRate ? "Complete" : "Incomplete",
      completed: !!(values.baselineVolume && values.completionRate),
    },
    {
      name: "Value",
      value: values.value && values.utilization ? "Complete" : "Incomplete",
      completed: !!(values.value && values.utilization),
    },
    {
      name: "Complexity",
      value: values.complexity ? "Complete" : "Incomplete",
      completed: !!values.complexity,
    },
    {
      name: "Charter",
      value: values.contentItems?.some((item) => item.variant === "Charter") ? "Complete" : "Incomplete",
      completed: !!values.contentItems?.some((item) => item.variant === "Charter"),
    },
  ]

  const completedCount = fields.filter((field) => field.completed).length

  return {
    fields,
    count: completedCount,
    total: 4, // Updated total from 3 to 4
  }
}

const getBacklogProgress = (flow: Flow, currentValues?: Partial<Flow>) => {
  if (flow.status !== "Backlog") return null

  // Use current form values if provided, otherwise use flow values
  const values = currentValues ? { ...flow, ...currentValues } : flow

  const fields = [
    {
      name: "Usage",
      value: values.baselineVolume && values.completionRate ? "Complete" : "Incomplete",
      completed: !!(values.baselineVolume && values.completionRate),
    },
    {
      name: "Value",
      value: values.value && values.utilization ? "Complete" : "Incomplete",
      completed: !!(values.value && values.utilization),
    },
    {
      name: "Complexity",
      value: values.complexity ? "Complete" : "Incomplete",
      completed: !!values.complexity,
    },
    {
      name: "Charter",
      value: values.contentItems?.some((item) => item.variant === "Charter") ? "Complete" : "Incomplete",
      completed: !!values.contentItems?.some((item) => item.variant === "Charter"),
    },
  ]

  const completedCount = fields.filter((field) => field.completed).length

  return {
    fields,
    count: completedCount,
    total: 4,
  }
}

export const RoadmapView: React.FC = (): ReactElement => {
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [draggedFlow, setDraggedFlow] = useState<Flow | null>(null)
  const [crossTableDragOver, setCrossTableDragOver] = useState<{ sectionId: string; index: number } | null>(null)

  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  // Form states
  const [editingTaxonomy, setEditingTaxonomy] = useState(false)
  const [editedAgentRole, setEditedAgentRole] = useState("")
  const [flowFiles, setFlowFiles] = useState<FileItem[]>([])
  const [newLinkName, setNewLinkName] = useState("")
  const [newLinkUrl, setNewLinkUrl] = useState("")
  const [flowName, setFlowName] = useState("")
  const [flowDescription, setFlowDescription] = useState("")
  const [flowValue, setFlowValue] = useState("")
  const [flowComplexity, setFlowComplexity] = useState("")
  const [flowStatus, setFlowStatus] = useState("")
  const [flowCategory, setFlowCategory] = useState("")
  const [showLinksForm, setShowLinksForm] = useState(false)

  // Metric inputs
  const [baselineVolumeInput, setBaselineVolumeInput] = useState("")
  const [completionRateInput, setCompletionRateInput] = useState("")
  const [valuePerRunInput, setValuePerRunInput] = useState("")
  const [pricePerRunInput, setPricePerRunInput] = useState("")

  // Complexity state
  const [complexityValue, setComplexityValue] = useState<number>(3)

  const complexityLabels: { [key: number]: string } = {
    1: "Trivial",
    2: "Low",
    3: "Moderate",
    4: "High",
    5: "Extreme",
  }

  // Error states
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [showValidationErrors, setShowValidationErrors] = useState<{ [key: string]: boolean }>({})
  const [tableBorderErrors, setTableBorderErrors] = useState<{ [key: string]: boolean }>({})
  const [alerts, setAlerts] = useState<{ sectionId: string; type: string; message: string }[]>([])

  const [editingLinkId, setEditingLinkId] = useState<string | null>(null)
  const [editingLinkName, setEditingLinkName] = useState("")
  const [editingLinkUrl, setEditingLinkUrl] = useState("")
  const [editingLinkDescription, setEditingLinkDescription] = useState("")

  const [readyFlows, setReadyFlows] = useState<Flow[]>([
    {
      id: "4",
      name: "Prior Authorization Workflow",
      priority: "1",
      agentRole: "Authorization Specialist",
      baselineVolume: 270000, // doubled from 135000 to 270000
      completionRate: 73, // Updated deflection rate from 26.4% to 73%
      value: 7.7,
      utilization: 2.1,
      roi: "12.2%",
      complexity: 4,
      status: "Ready",
      category: "Workflow",
      contentItems: [
        {
          id: "file-4-1",
          name: "Prior_Auth_Charter.pdf",
          type: "Charter",
          variant: "Charter",
          description:
            "Charter document outlining prior authorization workflow automation requirements and Notable platform integration strategy",
          fileType: "PDF",
          size: 102400, // Example size
        },
        {
          id: "file-4-2",
          name: "Authorization_Process_Map.pdf",
          type: "Other",
          variant: "Scope of Work",
          description:
            "Detailed process mapping for prior authorization workflows with Notable's automation capabilities and efficiency metrics",
          fileType: "PDF",
          size: 204800, // Example size
        },
      ],
      links: [
        {
          id: "link-4-1",
          name: "Notable Prior Auth Integration Guide",
          type: "link",
          url: "https://notable.com/integration/prior-authorization",
        },
      ],
    },
    {
      id: "2",
      name: "Insurance Verification Bot",
      priority: "2",
      agentRole: "Insurance Specialist",
      baselineVolume: 720000, // doubled from 360000 to 720000
      completionRate: 78, // Updated deflection rate from 27.6% to 78%
      value: 3.74,
      utilization: 1.2,
      roi: "10.4%",
      complexity: 4,
      status: "Ready",
      category: "Bot",
      contentItems: [
        {
          id: "file-2-1",
          name: "Insurance_Verification_Charter.pdf",
          type: "Charter",
          variant: "Charter",
          description:
            "Charter document defining insurance verification bot requirements and Notable platform integration strategy",
          fileType: "PDF",
          size: 153600, // Example size
        },
        {
          id: "file-2-2",
          name: "Revenue_Cycle_Analysis.xlsx",
          type: "Value roadmap",
          variant: "Scope of Work",
          description:
            "Comprehensive value analysis for insurance verification automation including Notable platform ROI projections",
          fileType: "XLSX",
          size: 51200, // Example size
        },
        {
          id: "file-2-3",
          name: "Bot_Implementation_Guide.docx",
          type: "Other",
          variant: "Other",
          description:
            "Step-by-step implementation guide for deploying Notable's insurance verification bot in healthcare environments",
          fileType: "DOC",
          size: 76800, // Example size
        },
      ],
      links: [
        {
          id: "link-2-1",
          name: "Notable Bot Architecture Documentation",
          type: "link",
          url: "https://docs.notable.com/bots/insurance-verification",
        },
      ],
    },
    {
      id: "1",
      name: "Patient Intake Automation",
      priority: "3",
      agentRole: "Intake Specialist",
      baselineVolume: 510000, // doubled from 255000 to 510000
      completionRate: 82, // Updated deflection rate from 25.5% to 82%
      value: 5.63,
      utilization: 0.85,
      roi: "22.1%",
      complexity: 3,
      status: "Ready",
      category: "Automation",
      contentItems: [
        {
          id: "file-1-1",
          name: "Patient_Intake_Charter.pdf",
          type: "Charter",
          variant: "Charter",
          description:
            "Comprehensive charter defining patient intake automation requirements and success metrics for Notable platform integration",
          fileType: "PDF",
          size: 122880, // Example size
        },
        {
          id: "file-1-2",
          name: "Notable_Integration_Strategy.docx",
          type: "Other",
          variant: "Reference Sheet",
          description:
            "Strategic framework for integrating Notable's AI capabilities with existing patient intake workflows",
          fileType: "DOC",
          size: 98304, // Example size
        },
      ],
      links: [
        {
          id: "link-1-1",
          name: "2025 Patient Flow Roadmap",
          type: "link",
          url: "https://notable.com/roadmap/patient-flow-2025",
        },
      ],
    },
    {
      id: "3",
      name: "Appointment Scheduling Assistant",
      priority: "4",
      agentRole: "Scheduler",
      baselineVolume: 1250000, // Updated baseline volume from 390,000 to 1,250,000
      completionRate: 85, // Updated deflection rate from 23.4% to 85%
      value: 8.25, // Updated value per flow run from 2.37 to 8.25
      utilization: 2.5, // Updated price per flow run (utilization) from 0.45 to 2.50
      roi: "17.5%",
      complexity: 2,
      status: "Ready",
      category: "Assistant",
      contentItems: [
        {
          id: "file-3-0",
          name: "Scheduling_Assistant_Charter.pdf",
          type: "Charter",
          variant: "Charter",
          description:
            "Charter document outlining appointment scheduling assistant requirements and Notable platform integration strategy",
          fileType: "PDF",
          size: 184320, // Example size
        },
        {
          id: "file-3-1",
          name: "Scheduling_Assistant_Requirements.pdf",
          type: "Other",
          variant: "Reference Sheet",
          description:
            "Requirements document defining appointment scheduling assistant specifications and Notable platform integration",
          fileType: "PDF",
          size: 230400, // Example size
        },
        {
          id: "file-3-2",
          name: "Scheduling_Value_Analysis.xlsx",
          type: "Value roadmap",
          variant: "Scope of Work",
          description:
            "Comprehensive value analysis showing ROI projections and efficiency gains from Notable's scheduling assistant implementation",
          fileType: "XLSX",
          size: 65536, // Example size
        },
      ],
      links: [
        {
          id: "link-3-1",
          name: "Implementation Strategy for Notable Scheduling",
          type: "link",
          url: "https://notable.com/implementation/scheduling-assistant",
        },
      ],
    },
    {
      id: "5",
      name: "Patient Satisfaction Survey", // Updated title from "Patient satisfaction survey flow"
      priority: "5",
      agentRole: "Quality Specialist",
      baselineVolume: 192000, // doubled from 96000 to 192000
      completionRate: 89, // Updated deflection rate from 22.5% to 89%
      value: 2.69,
      utilization: 0.65,
      roi: "13.8%",
      complexity: 1,
      status: "Ready",
      category: "Survey",
      contentItems: [
        {
          id: "file-5-0",
          name: "Patient_Satisfaction_Charter.pdf",
          type: "Charter",
          variant: "Charter",
          description:
            "Charter document defining patient satisfaction survey flow requirements and Notable platform integration strategy",
          fileType: "PDF",
          size: 114688, // Example size
        },
        {
          id: "file-5-1",
          name: "Survey_Flow_Design.pdf",
          type: "Other",
          variant: "Reference Sheet",
          description:
            "Design specifications for patient satisfaction survey flow with Notable's automation capabilities",
          fileType: "PDF",
          size: 163840, // Example size
        },
        {
          id: "file-5-2",
          name: "Quality_Metrics_Analysis.xlsx",
          type: "Value roadmap",
          variant: "Other",
          description:
            "Analysis of quality metrics and ROI projections for automated patient satisfaction surveys using Notable platform",
          fileType: "XLSX",
          size: 40960, // Example size
        },
      ],
      links: [
        {
          id: "link-5-1",
          name: "Notable Survey Integration Documentation",
          type: "link",
          url: "https://notable.com/integration/patient-surveys",
        },
      ],
    },
  ])

  const [planningFlows, setPlanningFlows] = useState<Flow[]>([
    {
      id: "6",
      name: "Care Plan Generator",
      priority: "1",
      agentRole: "Care Coordinator",
      status: "Planning",
      category: "Planning",
    },
    {
      id: "7",
      name: "Medication Reconciliation System",
      priority: "2",
      agentRole: "Pharmacist",
      status: "Planning",
      category: "Planning",
    },
    {
      id: "8",
      name: "Quality Metrics Dashboard",
      priority: "3",
      agentRole: "Quality Analyst",
      status: "Planning",
      category: "Planning",
    },
  ])

  const [backlogFlows, setBacklogFlows] = useState<Flow[]>([
    {
      id: "9",
      name: "Referrals - Fax Order Transcription",
      agentRole: "Referral Coordinator",
      status: "Backlog",
      category: "Automation",
      priority: "1",
    },
    {
      id: "10",
      name: "Prior Authorizations - Sidekick",
      agentRole: "Authorization Specialist",
      status: "Backlog",
      category: "Automation",
      priority: "2",
    },
    {
      id: "11",
      name: "Care Gap Closure - Chart Scrubbing",
      agentRole: "Quality Analyst",
      status: "Backlog",
      category: "Analytics",
      priority: "3",
    },
    {
      id: "12",
      name: "Outbound Previsit - Contact Center",
      agentRole: "Contact Specialist",
      status: "Backlog",
      category: "Communication",
      priority: "4",
    },
  ])

  const [drawerWidth, setDrawerWidth] = useState(66) // percentage
  const [isResizing, setIsResizing] = useState(false)
  const resizeRef = useRef<HTMLDivElement>(null)

  const [editingValues, setEditingValues] = useState<Partial<Flow>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [contentItems, setContentItems] = useState<FileItem[]>([])
  const [showMoveToReadyDialog, setShowMoveToReadyDialog] = useState(false)

  const [isDragOver, setIsDragOver] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // const [openVariantDropdown, setOpenVariantDropdown] = useState<string | null>(null)

  const [linkInputs, setLinkInputs] = useState<Array<{ id: string; name: string; url: string }>>([])

  const moveFlowToPlanning = (flow: Flow) => {
    // Remove from backlog
    removeFlowFromSection(flow.id, "backlog")

    // Update flow status to Planning
    const updatedFlow = { ...flow, status: "Planning" as const }

    // Add to planning section at the bottom (no specific index = end of list)
    addFlowToSection(updatedFlow, "planning")

    // Update selected flow if it's the same flow
    if (selectedFlow && selectedFlow.id === flow.id) {
      setSelectedFlow(updatedFlow)
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      // Check if file type is supported
      const supportedTypes = [".pdf", ".doc", ".docx", ".csv", ".xlsx", ".xls", ".txt", ".ppt", ".pptx"]
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()

      if (supportedTypes.includes(fileExtension)) {
        const newItem: FileItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: "file",
          variant: "Charter",
          description: "",
          size: file.size,
        }
        if (selectedFlow) {
          const updatedFlow = {
            ...selectedFlow,
            contentItems: [...(selectedFlow.contentItems || []), newItem],
          }
          setSelectedFlow(updatedFlow)

          setEditingValues((prev) => ({
            ...prev,
            contentItems: [...(selectedFlow.contentItems || []), newItem],
          }))

          // Update the flow in the appropriate list
          if (selectedFlow.status === "Ready") {
            setReadyFlows((flows) => flows.map((f) => (f.id === selectedFlow.id ? updatedFlow : f)))
          } else {
            setPlanningFlows((flows) => flows.map((f) => (f.id === selectedFlow.id ? updatedFlow : f)))
          }
        }
      }
    })
  }

  const getFileTypeDisplay = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return { text: "PDF", color: "#dc2626" }
      case "doc":
      case "docx":
        return { text: "DOC", color: "#2563eb" }
      case "csv":
        return { text: "CSV", color: "#059669" }
      case "xlsx":
      case "xls":
        return { text: "XLS", color: "#059669" }
      case "txt":
        return { text: "TXT", color: "#6b7280" }
      case "ppt":
      case "pptx":
        return { text: "PPT", color: "#ea580c" }
      default:
        return { text: "FILE", color: "#6b7280" }
    }
  }

  const handleDragStart = (e: React.DragEvent, flow: Flow) => {
    setDraggedFlow(flow)
    e.dataTransfer.effectAllowed = "move"

    const dragPreview = document.createElement("div")
    dragPreview.style.cssText = `
      position: absolute;
      top: -1000px;
      left: -1000px;
      background: white;
      border: 1px solid #D9D9D9;
      border-radius: 4px;
      padding: 12px 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      z-index: 1000;
      white-space: nowrap;
    `

    // Flow name
    const nameSpan = document.createElement("span")
    nameSpan.textContent = flow.name
    nameSpan.style.cssText = `
      font-weight: 500;
      color: #111827;
      white-space: nowrap;
    `

    // Agent role tag
    const agentRoleTag = document.createElement("span")
    agentRoleTag.textContent = flow.agentRole || "Not specified"
    agentRoleTag.style.cssText = `
      background: hsl(var(--primary));
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 500;
      white-space: nowrap;
    `

    // Operational group tag
    const operationalGroupTag = document.createElement("span")
    operationalGroupTag.textContent = flow.operationalGroup || "Not specified"
    operationalGroupTag.style.cssText = `
      background: #6b7280;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 500;
      white-space: nowrap;
    `

    dragPreview.appendChild(nameSpan)
    dragPreview.appendChild(agentRoleTag)
    dragPreview.appendChild(operationalGroupTag)

    document.body.appendChild(dragPreview)

    const rect = dragPreview.getBoundingClientRect()
    const centerY = rect.height / 2
    e.dataTransfer.setDragImage(dragPreview, 0, centerY)

    // Clean up the preview element after drag starts
    setTimeout(() => {
      document.body.removeChild(dragPreview)
    }, 0)
  }

  const handleDragEnd = () => {
    setDraggedFlow(null)
    setCrossTableDragOver(null)
  }

  const handleDragOver = (e: React.DragEvent, sectionId?: string, index?: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

    if (sectionId !== undefined && index !== undefined) {
      setCrossTableDragOver({ sectionId, index })
    }
  }

  const handleDragLeave = () => {
    setCrossTableDragOver(null)
  }

  const handleDrop = (e: React.DragEvent, targetFlow: Flow, targetSectionId: string, dropIndex?: number) => {
    e.preventDefault()

    if (!draggedFlow) return

    const sourceSectionId = getFlowSection(draggedFlow.id)
    if (!sourceSectionId) return

    if (targetSectionId === "ready") {
      if (draggedFlow.status === "Planning") {
        const hasAllFields = !!(
          draggedFlow.baselineVolume &&
          draggedFlow.completionRate &&
          draggedFlow.value &&
          draggedFlow.complexity
        )
        if (!hasAllFields) {
          setValidationErrors({
            ...validationErrors,
            [targetSectionId]:
              "Ready to build flows must have all 4 requirements completed (Usage, Value, Complexity, and Charter)",
          })
          setShowValidationErrors({ ...showValidationErrors, [targetSectionId]: true })
          setTableBorderErrors({ [targetSectionId]: true })
          setTimeout(() => {
            setShowValidationErrors({ ...showValidationErrors, [targetSectionId]: false })
            setTableBorderErrors({})
          }, 5000)
          setDraggedFlow(null)
          setCrossTableDragOver(null)
          return
        }
      } else {
        const error = validateFlowForReady(draggedFlow)
        if (error) {
          setValidationErrors({ ...validationErrors, [targetSectionId]: error })
          setShowValidationErrors({ ...showValidationErrors, [targetSectionId]: true })
          setTableBorderErrors({ [targetSectionId]: true })
          setTimeout(() => {
            setShowValidationErrors({ ...showValidationErrors, [targetSectionId]: false })
            setTableBorderErrors({})
          }, 5000)
          setDraggedFlow(null)
          setCrossTableDragOver(null)
          return
        }
      }
    }
    // Backlog and Planning sections accept any flow without validation

    // Remove from source
    removeFlowFromSection(draggedFlow.id, sourceSectionId)

    const updatedFlow = (() => {
      if (targetSectionId === "ready" && draggedFlow.status === "Planning") {
        return { ...draggedFlow, status: "ready-to-build" }
      } else if (targetSectionId === "planning") {
        return { ...draggedFlow, status: "Planning" }
      } else if (targetSectionId === "backlog") {
        return { ...draggedFlow, status: "Backlog" }
      }
      return draggedFlow
    })()

    // Add to target
    addFlowToSection(updatedFlow, targetSectionId, dropIndex)

    if (selectedFlow && selectedFlow.id === draggedFlow.id) {
      setSelectedFlow(updatedFlow)
    }

    setDraggedFlow(null)
    setCrossTableDragOver(null)
  }

  const getFlowSection = (flow: Flow | string): string | null => {
    const flowId = typeof flow === "string" ? flow : flow.id
    if (readyFlows.find((f) => f.id === flowId)) return "ready"
    if (planningFlows.find((f) => f.id === flowId)) return "planning"
    if (backlogFlows.find((f) => f.id === flowId)) return "backlog"
    return null
  }

  const removeFlowFromSection = (flowId: string, sectionId: string) => {
    switch (sectionId) {
      case "ready":
        setReadyFlows((prev) => {
          const newFlows = prev.filter((f) => f.id !== flowId)
          // Recalculate priorities to be sequential from 1
          return newFlows.map((f, i) => ({ ...f, priority: (i + 1).toString() }))
        })
        break
      case "planning":
        setPlanningFlows((prev) => {
          const newFlows = prev.filter((f) => f.id !== flowId)
          // Recalculate priorities to be sequential from 1
          return newFlows.map((f, i) => ({ ...f, priority: (i + 1).toString() }))
        })
        break
      case "backlog":
        setBacklogFlows((prev) => {
          const newFlows = prev.filter((f) => f.id !== flowId)
          // Recalculate priorities to be sequential from 1
          return newFlows.map((f, i) => ({ ...f, priority: (i + 1).toString() }))
        })
        break
    }
  }

  const addFlowToSection = (flow: Flow, sectionId: string, index?: number) => {
    switch (sectionId) {
      case "ready":
        setReadyFlows((prev) => {
          const newFlows = [...prev]
          if (index !== undefined) {
            newFlows.splice(index, 0, flow)
          } else {
            newFlows.push(flow)
          }
          // Recalculate priorities to be sequential from 1
          return newFlows.map((f, i) => ({ ...f, priority: (i + 1).toString() }))
        })
        break
      case "planning":
        setPlanningFlows((prev) => {
          const newFlows = [...prev]
          if (index !== undefined) {
            newFlows.splice(index, 0, flow)
          } else {
            newFlows.push(flow)
          }
          // Recalculate priorities to be sequential from 1
          return newFlows.map((f, i) => ({ ...f, priority: (i + 1).toString() }))
        })
        break
      case "backlog":
        setBacklogFlows((prev) => {
          const newFlows = [...prev]
          if (index !== undefined) {
            newFlows.splice(index, 0, flow)
          } else {
            newFlows.push(flow)
          }
          // Recalculate priorities to be sequential from 1
          return newFlows.map((f, i) => ({ ...f, priority: (i + 1).toString() }))
        })
        break
    }
  }

  const updateFlowInSection = (updatedFlow: Flow, sectionId: string) => {
    switch (sectionId) {
      case "ready":
        setReadyFlows((prev) => prev.map((f) => (f.id === updatedFlow.id ? updatedFlow : f)))
        break
      case "planning":
        setPlanningFlows((prev) => prev.map((f) => (f.id === updatedFlow.id ? updatedFlow : f)))
        break
      case "backlog":
        setBacklogFlows((prev) => prev.map((f) => (f.id === updatedFlow.id ? updatedFlow : f)))
        break
    }
  }

  const handleMoveToReadyToBuild = (flow: Flow) => {
    const sourceSectionId = getFlowSection(flow.id)
    if (!sourceSectionId) return

    const charterFile = flow.contentItems?.find((item) => item.variant === "Charter")
    const updatedFlow = {
      ...flow,
      status: "ready-to-build",
      contentItems: charterFile ? [charterFile] : [],
    }

    // Remove from source and add to ready section at the bottom
    removeFlowFromSection(flow.id, sourceSectionId)
    addFlowToSection(updatedFlow, "ready")
  }

  const handleFlowClick = (flow: Flow) => {
    setSelectedFlow(flow)
    setEditedAgentRole(flow.agentRole || "")
    setBaselineVolumeInput(flow.baselineVolume?.toString() || "")
    setCompletionRateInput(flow.completionRate?.toString() || "")
    setValuePerRunInput(flow.value?.toString() || "")
    setPricePerRunInput(flow.utilization ? flow.utilization.toFixed(2) : "")
    setComplexityValue(flow.complexity || 3)
    setFlowStatus(flow.status || "") // Set flowStatus from the clicked flow
    setDrawerOpen(true)
  }

  const updateFlowField = (field: keyof Flow, value: number) => {
    if (!selectedFlow) return

    setEditingValues((prev) => ({
      ...prev,
      [field]: value,
    }))
    setHasUnsavedChanges(true)
  }

  const getCurrentFlowValues = () => {
    if (!selectedFlow) return null
    return {
      ...selectedFlow,
      ...editingValues,
    }
  }

  useEffect(() => {
    if (selectedFlow && drawerOpen) {
      const isNewFlow = !editingValues.id || editingValues.id !== selectedFlow.id

      if (isNewFlow) {
        setEditingValues({
          id: selectedFlow.id,
          contentItems: selectedFlow.contentItems || [],
          links: selectedFlow.links || [], // Initialize links from selectedFlow
        })
        setHasUnsavedChanges(false)
        setFlowName(selectedFlow.name)
        setFlowDescription(selectedFlow.description || "")
        setFlowValue(selectedFlow.value?.toString() || "")
        setFlowComplexity(selectedFlow.complexity?.toString() || "")
        setPricePerRunInput(selectedFlow.utilization ? selectedFlow.utilization.toFixed(2) : "")
        setFlowStatus(selectedFlow.status || "")
        setFlowCategory(selectedFlow.category || "")
      }
    }
  }, [selectedFlow, drawerOpen])

  const isPlanningFlowComplete = (flow: Flow) => {
    const currentValues = getCurrentFlowValues()
    if (!currentValues) return false

    return (
      currentValues.value &&
      currentValues.complexity &&
      currentValues.utilization &&
      flowName.trim() !== "" &&
      flowDescription.trim() !== ""
    )
  }

  const moveFlowToReadyToBuild = () => {
    if (!selectedFlow) return

    const charterFile = selectedFlow.contentItems?.find((item) => item.variant === "Charter")

    const updatedFlow: Flow = {
      ...selectedFlow,
      ...editingValues,
      agentRole: editedAgentRole,
      name: flowName,
      description: flowDescription,
      status: "ready-to-build", // Change status to ready-to-build
      category: flowCategory,
      contentItems: charterFile ? [charterFile] : [], // Only keep Charter file
    }

    // Remove from planning and add to ready-to-build
    removeFlowFromSection(selectedFlow.id, "planning")
    addFlowToSection(updatedFlow, "ready")

    setShowMoveToReadyDialog(false)
    setDrawerOpen(false)
    setEditingTaxonomy(false)
    setEditingValues({})
    setHasUnsavedChanges(false)
  }

  const handleSaveFlow = () => {
    if (!selectedFlow) return

    console.log("[v0] handleSaveFlow called for flow:", selectedFlow.id, selectedFlow.name)

    const updatedFlow: Flow = {
      ...selectedFlow,
      ...editingValues,
      agentRole: editedAgentRole,
      name: flowName,
      description: flowDescription,
      status: flowStatus,
      category: flowCategory,
    }

    console.log("[v0] updatedFlow:", updatedFlow)

    const isPlanning = planningFlows.some((flow) => flow.id === selectedFlow.id)
    console.log("[v0] isPlanning:", isPlanning)

    if (isPlanning) {
      const isComplete =
        updatedFlow.value &&
        updatedFlow.complexity &&
        updatedFlow.utilization &&
        flowName.trim() !== "" &&
        flowDescription.trim() !== ""

      if (isComplete) {
        console.log("[v0] Planning flow is complete, showing move dialog")
        removeFlowFromSection(selectedFlow.id, "planning")
        addFlowToSection(updatedFlow, "planning")
        setSelectedFlow(updatedFlow)
        setShowMoveToReadyDialog(true)
        return
      }
    }

    const sectionId = getFlowSection(selectedFlow.id)
    console.log("[v0] sectionId for flow:", sectionId)

    if (sectionId) {
      console.log("[v0] Updating flow in section:", sectionId)
      updateFlowInSection(updatedFlow, sectionId)
      setSelectedFlow(updatedFlow)
      console.log("[v0] Flow updated successfully")
    } else {
      console.log("[v0] ERROR: Could not find section for flow")
    }

    setDrawerOpen(false)
    setEditingTaxonomy(false)
    setEditingValues({})
    setHasUnsavedChanges(false)
  }

  const handleAddLink = () => {
    const newLinkInput = {
      id: Date.now().toString(),
      name: "",
      url: "",
    }
    setLinkInputs((prev) => [...prev, newLinkInput])
  }

  const updateLinkInput = (id: string, field: "name" | "url", value: string) => {
    setLinkInputs((prev) => prev.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const handleDeleteLink = (linkId: string) => {
    if (!selectedFlow) return

    setLinkInputs((prev) => prev.filter((input) => input.id !== linkId))

    const updatedFlow = {
      ...selectedFlow,
      links: (selectedFlow.links || []).filter((link) => link.id !== linkId),
    }

    setSelectedFlow(updatedFlow)

    const sectionId = getFlowSection(selectedFlow.id)
    if (sectionId) {
      removeFlowFromSection(selectedFlow.id, sectionId)
      addFlowToSection(updatedFlow, sectionId)
    }
    setHasUnsavedChanges(true)
  }

  const handleDeleteFile = (fileId: string) => {
    setFlowFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const dismissError = (sectionId: string) => {
    const errorElement = document.querySelector(`[data-error="${sectionId}"]`) as HTMLElement
    if (errorElement) {
      errorElement.style.transition = "opacity 1.0s ease-out"
      errorElement.style.opacity = "0"
      setTimeout(() => {
        setShowValidationErrors({ ...showValidationErrors, [sectionId]: false })
        setTableBorderErrors({ ...tableBorderErrors, [sectionId]: false })
      }, 1000)
    } else {
      setShowValidationErrors({ ...showValidationErrors, [sectionId]: false })
      setTableBorderErrors({ ...tableBorderErrors, [sectionId]: false })
    }
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }, [])

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return

    const windowWidth = window.innerWidth
    const newWidth = ((windowWidth - e.clientX) / windowWidth) * 100

    // Constrain between 25% and 90%
    const constrainedWidth = Math.min(Math.max(newWidth, 25), 90)
    setDrawerWidth(constrainedWidth)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
  }

  useEffect(() => {
    if (isResizing) {
      const handleMouseMove = (e: MouseEvent) => {
        const windowWidth = window.innerWidth
        const newWidth = ((windowWidth - e.clientX) / windowWidth) * 100

        // Constrain between 25% and 90%
        const constrainedWidth = Math.min(Math.max(newWidth, 25), 90)
        setDrawerWidth(constrainedWidth)
      }

      const handleMouseUp = () => {
        setIsResizing(false)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "ew-resize"
      document.body.style.userSelect = "none"

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }
    }
  }, [isResizing, handleMouseDown])

  const getComplexityVariant = (complexity: number | undefined): "success" | "warning" | "destructive" | "working" => {
    if (!complexity) return "working"
    if (complexity >= 4) return "destructive" // High/Major (4-5)
    if (complexity === 3) return "warning" // Medium (3)
    if (complexity <= 2) return "success" // Minor/Small (1-2)
    return "working"
  }

  const getICEScoreColor = (score: number): string => {
    if (score >= 1000000) return "#16a34a" // Green for high scores (1M+)
    if (score >= 500000) return "#eab308" // Yellow for medium scores (500K-1M)
    return "#dc2626" // Red for low scores (<500K)
  }

  const getICEScoreGradient = (score: number): string => {
    if (score >= 1000000) return "linear-gradient(135deg, #16a34a 0%, #15803d 100%)" // Green gradient
    if (score >= 500000) return "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)" // Yellow gradient
    return "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" // Red gradient
  }

  const getOpportunityRatingScoreColor = (score: number): string => {
    if (score >= 85) return "#16a34a" // Green for high scores (85-100)
    if (score >= 75) return "#eab308" // Yellow for medium scores (75-84)
    return "#dc2626" // Red for low scores (60-74)
  }

  const getOpportunityRatingScoreGradient = (score: number): string => {
    if (score >= 85) return "linear-gradient(135deg, #16a34a 0%, #15803d 100%)" // Green gradient
    if (score >= 75) return "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)" // Yellow gradient
    return "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" // Red gradient
  }

  const getComplexityColors = (complexity: number) => {
    switch (complexity) {
      case 1: // Low - Green
        return { bg: "#dcfce7", border: "#16a34a", text: "#15803d" }
      case 2: // Small - Yellow-Green (more yellow)
        return { bg: "#fefce8", border: "#84cc16", text: "#65a30d" }
      case 3: // Medium - Yellow
        return { bg: "#fefce8", border: "#eab308", text: "#ca8a04" }
      case 4: // Large - Orange
        return { bg: "#fff7ed", border: "#f97316", text: "#ea580c" }
      case 5: // Major - Red
        return { bg: "#fef2f2", border: "#ef4444", text: "#dc2626" }
      default:
        return { bg: "#f9fafb", border: "#e5e7eb", text: "#6b7280" }
    }
  }

  const formatFileSize = (bytes: number | undefined): string => {
    if (!bytes) return "Unknown size"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  const openPDFInNewTab = (fileName: string) => {
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 2000
>>
stream
BT
/F1 12 Tf
50 750 Td
(Customer: Pacific Coast Health System) Tj
0 -20 Td
(Project Name: ${fileName.replace(".pdf", "").replace(/[^a-zA-Z0-9\s]/g, "")}) Tj
0 -20 Td
(Date: 9/23/25) Tj
0 -20 Td
(Created By: Eric Smejkal) Tj
0 -40 Td
/F1 16 Tf
(Project Charter) Tj
0 -30 Td
/F1 12 Tf
(This document serves to align on the project's scope and cross-functional) Tj
0 -15 Td
(commitments critical to its success. It outlines the key elements that will guide) Tj
0 -15 Td
(execution and impact.) Tj
0 -30 Td
/F1 14 Tf
(Project Overview & Business Rationale) Tj
0 -25 Td
/F1 12 Tf
(Establishing a clear project overview and business rationale ensures all stakeholders) Tj
0 -15 Td
(understand the purpose, strategic value, and intended outcomes of the initiative—keeping) Tj
0 -15 Td
(teams aligned and focused from the start.) Tj
0 -30 Td
/F1 14 Tf
(Problem Statement) Tj
0 -25 Td
/F1 12 Tf
(For patients already enrolled in a cancer clinical trial, each clinic) Tj
0 -15 Td
(visit may have specific trial-mandated requirements \\(labs,) Tj
0 -15 Td
(measurements, imaging, questionnaires, etc.\\). These must be) Tj
0 -15 Td
(completed and documented in Epic to pass sponsor or NCI audits.) Tj
0 -15 Td
(Currently, there is no systematic process to ensure these tasks are) Tj
0 -15 Td
(completed during the visit. This leads to:) Tj
0 -20 Td
(• Missed or incomplete trial-required activities) Tj
0 -15 Td
(• Poor documentation in Epic) Tj
0 -15 Td
(• Audit failures, which can result in reputational damage, lost) Tj
0 -15 Td
(  funding, and even suspension of trial participation.) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000136 00000 n 
0000000271 00000 n 
0000002324 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
2404
%%EOF`

    const blob = new Blob([pdfContent], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank")

    // Clean up the URL after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  // Helper functions for link editing
  const handleEditLink = (link: FileItem) => {
    setEditingLinkId(link.id)
    setEditingLinkName(link.name)
    setEditingLinkUrl(link.url || "")
    setEditingLinkDescription(link.description || "")
  }

  const handleSaveEditedLink = () => {
    if (!selectedFlow || editingLinkId === null) return

    const updatedFlow = {
      ...selectedFlow,
      links: selectedFlow.links?.map((link) =>
        link.id === editingLinkId
          ? {
              ...link,
              name: editingLinkName,
              url: editingLinkUrl,
              description: editingLinkDescription,
            }
          : link,
      ),
    }

    setSelectedFlow(updatedFlow)
    setEditingValues((prev) => ({ ...prev, links: updatedFlow.links }))
    setHasUnsavedChanges(true)

    const sectionId = getFlowSection(selectedFlow.id)
    if (sectionId) {
      removeFlowFromSection(selectedFlow.id, sectionId)
      addFlowToSection(updatedFlow, sectionId)
    }

    setEditingLinkId(null)
  }

  const handleCancelEditLink = () => {
    setEditingLinkId(null)
  }

  const handleSaveLinkInput = (linkInput: { id: string; name: string; url: string }) => {
    if (!selectedFlow || !linkInput.name.trim() || !linkInput.url.trim()) return

    const newLink: FileItem = {
      id: linkInput.id, // Use the temporary ID
      name: linkInput.name,
      url: linkInput.url,
      type: "link",
      description: "", // Default description
    }

    const updatedFlow = {
      ...selectedFlow,
      links: [...(selectedFlow.links || []), newLink],
    }

    setSelectedFlow(updatedFlow)
    setEditingValues((prev) => ({ ...prev, links: updatedFlow.links }))
    setHasUnsavedChanges(true)

    const sectionId = getFlowSection(selectedFlow.id)
    if (sectionId) {
      removeFlowFromSection(selectedFlow.id, sectionId)
      addFlowToSection(updatedFlow, sectionId)
    }

    // Remove the input field
    setLinkInputs((prev) => prev.filter((input) => input.id !== linkInput.id))
  }

  const removeLinkInput = (id: string) => {
    setLinkInputs((prev) => prev.filter((input) => input.id !== id))
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page Header */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          {/* Title and subtitle container - left side */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, fontSize: "1rem" }}>
              Build your Flows Roadmap
            </Typography>
            <Typography variant="body1" sx={{ color: "#6b7280" }}>
              Add metrics to your flows and prioritize which flows to build next.
            </Typography>
          </Box>

          {/* Toggle container - right side */}
          <div
            style={{
              backgroundColor: "#EDEDED",
              borderRadius: "4px",
              padding: "4px",
              display: "flex",
              gap: "0px",
              height: "auto",
            }}
          >
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => value && setViewMode(value as "table" | "grid")}
              style={{
                backgroundColor: "transparent",
                gap: "0px",
              }}
            >
              <ToggleGroupItem
                value="table"
                aria-label="Table view"
                style={{
                  backgroundColor: viewMode === "table" ? "white" : "transparent",
                  color: viewMode === "table" ? "#1f2937" : "#6b7280",
                  border: "none",
                  borderRadius: "4px",
                  padding: viewMode === "table" ? "6px 8px" : "4px 8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: viewMode === "table" ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
                  transition: "all 0.15s ease",
                  height: "auto",
                }}
              >
                <Table2 size={20} />
                Table
              </ToggleGroupItem>
              <ToggleGroupItem
                value="grid"
                aria-label="Grid view"
                style={{
                  backgroundColor: viewMode === "grid" ? "white" : "transparent",
                  color: viewMode === "grid" ? "#1f2937" : "#6b7280",
                  border: "none",
                  borderRadius: "4px",
                  padding: viewMode === "grid" ? "6px 8px" : "4px 8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: viewMode === "grid" ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
                  transition: "all 0.15s ease",
                  height: "auto",
                }}
              >
                <Grid3X3 size={20} />
                Grid
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </Box>
      </Box>

      {viewMode === "grid" ? (
        /* Grid View - Scatter Plot for Ready to Build flows only */
        <ScatterPlotView flows={readyFlows} onFlowClick={handleFlowClick} />
      ) : (
        /* Table View - Original tables */
        <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Ready Table */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#111827", fontSize: "1rem" }}>
                  Ready to build
                </Typography>
                <Badge variant="default">{readyFlows.length}</Badge>
              </Box>
              {showValidationErrors.ready && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    transition: "opacity 0.2s ease-in-out",
                    opacity: showValidationErrors.ready ? 1 : 0,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#dc2626", fontSize: "0.875rem", fontWeight: 600 }}>
                    {validationErrors.ready}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => dismissError("ready")}
                    sx={{
                      p: 0.5,
                      color: "#dc2626",
                      "&:hover": {
                        backgroundColor: "rgba(220, 38, 38, 0.1)",
                      },
                    }}
                  >
                    <X size={14} />
                  </IconButton>
                </Box>
              )}
            </Box>
            <SharedTable
              flows={readyFlows}
              sectionId="ready"
              onFlowClick={handleFlowClick}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              draggedFlow={draggedFlow}
              crossTableDragOver={crossTableDragOver}
              tableBorderError={tableBorderErrors.ready}
            />
          </Box>

          {/* Planning Table */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#111827", fontSize: "1rem" }}>
                  Planning
                </Typography>
                <Badge variant="default">{planningFlows.length}</Badge>
              </Box>
              {showValidationErrors.planning && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    transition: "opacity 0.2s ease-in-out",
                    opacity: showValidationErrors.planning ? 1 : 0,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#dc2626", fontSize: "0.875rem", fontWeight: 600 }}>
                    {validationErrors.planning}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => dismissError("planning")}
                    sx={{
                      p: 0.5,
                      color: "#dc2626",
                      "&:hover": {
                        backgroundColor: "rgba(220, 38, 38, 0.1)",
                      },
                    }}
                  >
                    <X size={14} />
                  </IconButton>
                </Box>
              )}
            </Box>
            <SharedTable
              flows={planningFlows}
              sectionId="planning"
              onFlowClick={handleFlowClick}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              draggedFlow={draggedFlow}
              crossTableDragOver={crossTableDragOver}
              onMoveToReadyToBuild={handleMoveToReadyToBuild}
            />
          </Box>

          {/* Backlog Table */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#111827", fontSize: "1rem" }}>
                  Backlog
                </Typography>
                <Badge variant="default">{backlogFlows.length}</Badge>
              </Box>
              {showValidationErrors.backlog && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    transition: "opacity 0.2s ease-in-out",
                    opacity: showValidationErrors.backlog ? 1 : 0,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#dc2626", fontSize: "0.875rem", fontWeight: 600 }}>
                    {validationErrors.backlog}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => dismissError("backlog")}
                    sx={{
                      p: 0.5,
                      color: "#dc2626",
                      "&:hover": {
                        backgroundColor: "rgba(220, 38, 38, 0.1)",
                      },
                    }}
                  >
                    <X size={14} />
                  </IconButton>
                </Box>
              )}
            </Box>
            <SharedTable
              flows={backlogFlows}
              sectionId="backlog"
              onFlowClick={handleFlowClick}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              draggedFlow={draggedFlow}
              crossTableDragOver={crossTableDragOver}
              onMoveToReadyToBuild={handleMoveToReadyToBuild}
            />
          </Box>
        </Box>
      )}

      {/* Flow Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: `${drawerWidth}vw`,
            minWidth: "400px",
            maxWidth: "90vw",
          },
        }}
        ModalProps={{
          BackdropProps: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.1)", // 10% opacity overlay
            },
          },
        }}
      >
        <Box sx={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
          <Box
            ref={resizeRef}
            onMouseDown={handleMouseDown}
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              cursor: "ew-resize",
              backgroundColor: isResizing ? "rgba(59, 130, 246, 0.3)" : "transparent",
              zIndex: 1000,
              "&:hover": {
                backgroundColor: "rgba(59, 130, 246, 0.2)",
              },
            }}
          />

          {selectedFlow && (
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                backgroundColor: "white",
                padding: "16px 24px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "16px" }}>
                    {selectedFlow.name}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Badge variant="secondary" className="text-xs">
                      {selectedFlow.agentRole || "No Role"}
                    </Badge>
                  </Box>

                  <IconButton size="small" onClick={() => setEditingTaxonomy(!editingTaxonomy)}>
                    <Edit size={16} />
                  </IconButton>
                </Box>

                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  {selectedFlow.description || "No description available."}
                </Typography>
              </Box>

              <IconButton onClick={() => setDrawerOpen(false)}>
                <X size={20} />
              </IconButton>
            </Box>
          )}

          {selectedFlow && (
            <Box sx={{ flex: 1, overflow: "auto", paddingBottom: "80px" }}>
              {selectedFlow && getFlowSection(selectedFlow) === "planning" && (
                <Box sx={{ padding: "24px", borderBottom: "1px solid #e5e7eb" }}>
                  {(() => {
                    const currentValues = getCurrentFlowValues()
                    const progress = getPlanningProgress(selectedFlow, editingValues)
                    if (!progress) return null

                    const isComplete = progress.count === 4

                    return (
                      <Alert
                        className={`${isComplete ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}`}
                      >
                        <div className="space-y-4">
                          <AlertDescription className="text-black">
                            {isComplete
                              ? "All metrics completed! This flow is ready for projections and analysis."
                              : "Complete the remaining metrics below to unlock projections and move this flow forward."}
                          </AlertDescription>

                          <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                              {progress.fields.map((field, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <div
                                    className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                                      field.completed ? "bg-green-500 text-white" : "bg-blue-200 text-blue-800"
                                    }`}
                                  >
                                    {field.completed ? "✓" : idx + 1}
                                  </div>
                                  <span className={field.completed ? "text-black font-medium" : "text-black"}>
                                    {field.name}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center gap-3 flex-1 justify-end">
                              <div className="bg-gray-200 rounded-full h-2 opacity-100 flex-1">
                                <div
                                  className="h-2 rounded-full transition-all duration-300 bg-green-500"
                                  style={{ width: `${(progress.count / progress.total) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Alert>
                    )
                  })()}
                </Box>
              )}

              {selectedFlow && getFlowSection(selectedFlow) === "backlog" && (
                <Box sx={{ padding: "24px", borderBottom: "1px solid #e5e7eb" }}>
                  <Alert className="bg-amber-50 border-amber-200">
                    <div className="flex items-center justify-between w-full">
                      <AlertDescription className="text-black">
                        Move to the planning section to begin the prioritization process for this flow.
                      </AlertDescription>
                      <Button
                        onClick={() => moveFlowToPlanning(selectedFlow)}
                        size="sm"
                        className="ml-4 bg-amber-100 hover:bg-[rgb(255,231,189)] text-black"
                      >
                        Move to planning
                      </Button>
                    </div>
                  </Alert>
                </Box>
              )}

              {selectedFlow && getFlowSection(selectedFlow) === "ready" && (
                <Box sx={{ padding: "24px", borderBottom: "1px solid #e5e7eb" }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "16px", color: "#111827", mb: 3 }}>
                    Summary
                  </Typography>

                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
                    {(() => {
                      const currentValues = getCurrentFlowValues()
                      if (!currentValues) return null

                      const opportunityScore = (() => {
                        const currentValues = getCurrentFlowValues()
                        if (!currentValues) return 60

                        const value = currentValues.value || 0
                        const utilization = currentValues.utilization || 0
                        const complexity = currentValues.complexity || 1

                        // Base calculation: (Value - Cost) normalized to 0-30 range (reduced from 40)
                        const netValue = Math.max(0, value - utilization) // Profit per run
                        const normalizedNetValue = Math.min(30, netValue / 2) // Cap at 30 points (reduced from 40)

                        // Complexity bonus: Higher complexity now gives higher scores (reversed logic)
                        // Complexity 4 (High) = +30 points
                        // Complexity 3 (Moderate) = +20 points
                        // Complexity 2 (Low) = +10 points
                        // Complexity 1 (Trivial) = +5 points
                        const complexityBonus = Math.max(5, complexity * 7.5)

                        // Value tier bonus: Higher value flows get additional points
                        let valueTierBonus = 0
                        if (value >= 100) valueTierBonus = 15
                        else if (value >= 50) valueTierBonus = 10
                        else if (value >= 25) valueTierBonus = 5

                        // Calculate final score (60-100 range)
                        let finalScore = 60 + normalizedNetValue + complexityBonus + valueTierBonus

                        // Add bonus for optimal combinations (high value, high complexity)
                        if (value > 50 && complexity >= 3) {
                          finalScore += 5 // Additional 5 points for high-value, high-complexity combinations
                        }

                        // Ensure score stays within 60-100 range
                        return Math.min(100, Math.max(60, Math.round(finalScore)))
                      })()

                      const usage =
                        currentValues.baselineVolume && currentValues.completionRate
                          ? currentValues.baselineVolume * (currentValues.completionRate / 100)
                          : 0

                      const utilization = currentValues.utilization && usage ? currentValues.utilization * usage : 0

                      const value = currentValues.value && usage ? usage * (currentValues.value || 0) : 0

                      const roi = utilization > 0 ? Math.round((value / utilization) * 100) : 0

                      const complexity = currentValues.complexity || 0

                      return (
                        <>
                          <Card sx={{ backgroundColor: "rgb(251, 251, 252)", border: "1px solid #e5e7eb" }}>
                            <CardContent sx={{ padding: "12px !important" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, fontSize: "12px", color: "#6b7280" }}
                                >
                                  Opportunity Rating
                                </Typography>
                                <Tooltip
                                  title={
                                    <div>
                                      <p style={{ fontWeight: "600" }}>Impact, Confidence, Effort</p>
                                      <p style={{ fontSize: "12px", opacity: 0.8 }}>
                                        Quality score (1-100) based on value, usage, and complexity
                                      </p>
                                    </div>
                                  }
                                  placement="right"
                                  arrow
                                >
                                  <Info
                                    style={{
                                      width: "12px",
                                      height: "12px",
                                      color: "#6b7280",
                                      cursor: "default",
                                    }}
                                  />
                                </Tooltip>
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "18px", color: "#111827" }}>
                                {opportunityScore}
                              </Typography>
                            </CardContent>
                          </Card>

                          <Card sx={{ backgroundColor: "rgb(251, 251, 252)", border: "1px solid #e5e7eb" }}>
                            <CardContent sx={{ padding: "12px !important" }}>
                              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600, fontSize: "12px", color: "#6b7280" }}
                                  >
                                    Usage
                                  </Typography>
                                  <Tooltip title="Baseline Volume X Deflection Rate / 1000" placement="right" arrow>
                                    <Info size={12} style={{ color: "#9ca3af", cursor: "help" }} />
                                  </Tooltip>
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500 }}
                                >
                                  /year
                                </Typography>
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "18px", color: "#111827" }}>
                                {usage.toLocaleString()}
                              </Typography>
                            </CardContent>
                          </Card>

                          <Card sx={{ backgroundColor: "rgb(251, 251, 252)", border: "1px solid #e5e7eb" }}>
                            <CardContent sx={{ padding: "12px !important" }}>
                              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600, fontSize: "12px", color: "#6b7280" }}
                                  >
                                    Utilization
                                  </Typography>
                                  <Tooltip title="Price per flow run X Usage" placement="right" arrow>
                                    <Info size={12} style={{ color: "#9ca3af", cursor: "help" }} />
                                  </Tooltip>
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500 }}
                                >
                                  /year
                                </Typography>
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "18px", color: "#111827" }}>
                                ${utilization.toLocaleString()}
                              </Typography>
                            </CardContent>
                          </Card>

                          <Card sx={{ backgroundColor: "rgb(251, 251, 252)", border: "1px solid #e5e7eb" }}>
                            <CardContent sx={{ padding: "12px !important" }}>
                              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600, fontSize: "12px", color: "#6b7280" }}
                                  >
                                    Value
                                  </Typography>
                                  <Tooltip
                                    title="(Value per flow run - Price per flow run) X Usage"
                                    placement="right"
                                    arrow
                                  >
                                    <Info size={12} style={{ color: "#9ca3af", cursor: "help" }} />
                                  </Tooltip>
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500 }}
                                >
                                  /year
                                </Typography>
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "18px", color: "#111827" }}>
                                ${value.toLocaleString()}
                              </Typography>
                            </CardContent>
                          </Card>

                          <Card sx={{ backgroundColor: "rgb(251, 251, 252)", border: "1px solid #e5e7eb" }}>
                            <CardContent sx={{ padding: "12px !important" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, fontSize: "12px", color: "#6b7280" }}
                                >
                                  ROI
                                </Typography>
                                <Tooltip title="(Value / Utilization) X 100" placement="right" arrow>
                                  <Info size={12} style={{ color: "#9ca3af", cursor: "help" }} />
                                </Tooltip>
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "18px", color: "#111827" }}>
                                {roi}%
                              </Typography>
                            </CardContent>
                          </Card>

                          <Card sx={{ backgroundColor: "rgb(251, 251, 252)", border: "1px solid #e5e7eb" }}>
                            <CardContent sx={{ padding: "12px !important" }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, fontSize: "12px", color: "#6b7280" }}
                                >
                                  Complexity
                                </Typography>
                                <Tooltip title="Manual complexity rating (1-5)" placement="right" arrow>
                                  <Info size={12} style={{ color: "#9ca3af", cursor: "help" }} />
                                </Tooltip>
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "18px", color: "#111827" }}>
                                {complexity ? complexityLabels[complexity] : "–"}
                              </Typography>
                            </CardContent>
                          </Card>
                        </>
                      )
                    })()}
                  </Box>
                </Box>
              )}

              <Box sx={{ padding: "24px", borderBottom: "1px solid #e5e7eb" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "16px", color: "#111827", mb: 3 }}>
                  Usage
                </Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: "#374151" }}>
                      Baseline Volume
                    </Typography>
                    <TextField
                      fullWidth
                      type="text"
                      value={getCurrentFlowValues()?.baselineVolume?.toLocaleString() || ""}
                      onChange={(e) => {
                        const numericValue = Number.parseInt(e.target.value.replace(/,/g, "")) || 0
                        updateFlowField("baselineVolume", numericValue)
                      }}
                      onFocus={(e) => e.target.select()}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <Typography
                            variant="caption"
                            sx={{ color: "#6b7280", fontSize: "12px", whiteSpace: "nowrap" }}
                          >
                            Runs per year
                          </Typography>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "14px",
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "13px", mt: 1, display: "block" }}>
                      Expected # of automations per year
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: "#374151" }}>
                      Deflection Rate
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={getCurrentFlowValues()?.completionRate || ""}
                      onChange={(e) => {
                        const value = Number.parseFloat(e.target.value) || 0
                        const clampedValue = Math.max(1, Math.min(100, value))
                        updateFlowField("completionRate", clampedValue)
                      }}
                      onFocus={(e) => e.target.select()}
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 1, max: 100, step: 1 }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "12px" }}>
                            %
                          </Typography>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "14px",
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "13px", mt: 1, display: "block" }}>
                      Percentage of automations processed by Notable
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ padding: "24px", borderBottom: "1px solid #e5e7eb" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "16px", color: "#111827", mb: 3 }}>
                  Value
                </Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: "#374151" }}>
                      Value Per Flow Run
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={getCurrentFlowValues()?.value || ""}
                      onChange={(e) => updateFlowField("value", Number.parseFloat(e.target.value) || 0)}
                      onFocus={(e) => e.target.select()}
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 0, step: 0.01 }}
                      InputProps={{
                        startAdornment: (
                          <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "12px", mr: 0.5 }}>
                            $
                          </Typography>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "14px",
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: "#374151" }}>
                      Price Per Flow Run
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={getCurrentFlowValues()?.utilization || ""}
                      onChange={(e) => updateFlowField("utilization", Number.parseFloat(e.target.value) || 0)}
                      onFocus={(e) => e.target.select()}
                      variant="outlined"
                      size="small"
                      inputProps={{ min: 0, step: 0.01 }}
                      InputProps={{
                        startAdornment: (
                          <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "12px", mr: 0.5 }}>
                            $
                          </Typography>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "14px",
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Complexity Section - keeping the new button format */}
              <Box sx={{ padding: "24px", borderBottom: "1px solid #e5e7eb" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "16px", color: "#111827" }}>
                    Complexity
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 3, width: "100%" }}>
                  {[
                    { value: 1, label: "Trivial", colors: getComplexityColors(1) },
                    { value: 2, label: "Low", colors: getComplexityColors(2) },
                    { value: 3, label: "Moderate", colors: getComplexityColors(3) },
                    { value: 4, label: "High", colors: getComplexityColors(4) },
                  ].map((complexity) => {
                    const isSelected = getCurrentFlowValues()?.complexity === complexity.value
                    return (
                      <Button
                        key={complexity.value}
                        variant="outlined"
                        disableRipple={true}
                        onClick={() => updateFlowField("complexity", complexity.value)}
                        sx={{
                          flex: 1,
                          height: "72px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                          borderRadius: "4px",
                          border: `1px solid ${isSelected ? complexity.colors.border : "rgb(209, 213, 219)"}`,
                          backgroundColor: isSelected ? complexity.colors.bg : "white",
                          color: isSelected ? complexity.colors.text : "#6b7280",
                          "&:hover": {
                            backgroundColor: isSelected ? complexity.colors.bg : "#f9fafb",
                            borderColor: isSelected ? complexity.colors.border : "#9ca3af",
                          },
                          "&:focus": {
                            borderColor: isSelected ? complexity.colors.border : "#3b82f6",
                            boxShadow: isSelected ? "none" : "0 0 0 1px #3b82f6",
                          },
                          textTransform: "none",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: "20px",
                            fontWeight: 600,
                            lineHeight: 1,
                          }}
                        >
                          {complexity.value}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "12px",
                            fontWeight: 500,
                            lineHeight: 1,
                          }}
                        >
                          {complexity.label}
                        </Typography>
                      </Button>
                    )
                  })}
                </Box>
              </Box>

              <Box sx={{ padding: "24px", borderBottom: "1px solid #e5e7eb" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "16px", color: "#111827", mb: 3 }}>
                  Charter
                </Typography>

                {selectedFlow?.contentItems?.map((item) => (
                  <Card
                    key={item.id}
                    sx={{
                      mb: 2,
                      border: "1px solid rgb(209, 213, 219)",
                      borderRadius: "4px",
                      overflow: "visible",
                      "&:hover": {
                        borderColor: "#9ca3af",
                      },
                      "&:focus-within": {
                        borderColor: "#3b82f6",
                        boxShadow: "0 0 0 1px #3b82f6",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "4px",
                            backgroundColor: "#f3f4f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            alignSelf: "flex-end",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "12px",
                              fontWeight: 600,
                              color: getFileTypeDisplay(item.name).color,
                            }}
                          >
                            {getFileTypeDisplay(item.name).text}
                          </Typography>
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                width: "fit-content",
                                position: "relative",
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  fontSize: "16px",
                                  fontWeight: 600,
                                  color: "#002766", // Updated charter file link color to #002766
                                  marginBottom: "4px",
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                  "&:hover": {
                                    color: "#003d99", // Updated hover color to a slightly lighter shade of #002766
                                  },
                                }}
                                onClick={() => openPDFInNewTab(item.name)}
                              >
                                {item.name}
                              </Typography>
                            </Box>

                            <Typography variant="caption" sx={{ color: "#737373", fontSize: "14px" }}>
                              {formatFileSize(item.size)}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              position: "relative",
                              "&:hover .full-description": {
                                display: "block",
                              },
                            }}
                          >
                            <input
                              type="text"
                              value={item.description || ""}
                              placeholder="Add a description"
                              onChange={(e) => {
                                if (selectedFlow) {
                                  const updatedFlow = {
                                    ...selectedFlow,
                                    contentItems: selectedFlow.contentItems?.map((i) =>
                                      i.id === item.id ? { ...i, description: e.target.value } : i,
                                    ),
                                  }
                                  setSelectedFlow(updatedFlow)
                                  setEditingValues((prev) => ({
                                    ...prev,
                                    contentItems: updatedFlow.contentItems,
                                  }))
                                  setHasUnsavedChanges(true)
                                  if (selectedFlow.status === "Ready") {
                                    setReadyFlows((flows) =>
                                      flows.map((f) => (f.id === selectedFlow.id ? updatedFlow : f)),
                                    )
                                  } else {
                                    setPlanningFlows((flows) =>
                                      flows.map((f) => (f.id === selectedFlow.id ? updatedFlow : f)),
                                    )
                                  }
                                }
                              }}
                              style={{
                                border: "none",
                                background: "transparent",
                                fontSize: "14px",
                                color: item.description ? "#6b7280" : "#737373",
                                fontStyle: item.description ? "normal" : "italic",
                                outline: "none",
                                width: "100%",
                                padding: 0,
                                marginTop: "4px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                              title={item.description && item.description.length > 50 ? item.description : undefined}
                            />
                            {item.description && item.description.length > 50 && (
                              <Box
                                className="full-description"
                                sx={{
                                  display: "none",
                                  position: "fixed",
                                  bottom: "calc(100% + 8px)",
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  backgroundColor: "#1f2937",
                                  color: "white",
                                  padding: "8px 12px",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  zIndex: 9999,
                                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                  wordWrap: "break-word",
                                  whiteSpace: "normal",
                                  maxWidth: "300px",
                                  minWidth: "200px",
                                  "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    top: "100%",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    border: "4px solid transparent",
                                    borderTopColor: "#1f2937",
                                  },
                                }}
                              >
                                {item.description}
                              </Box>
                            )}
                          </Box>
                        </Box>

                        <IconButton
                          size="small"
                          onClick={() => {
                            if (selectedFlow) {
                              const updatedFlow = {
                                ...selectedFlow,
                                contentItems: selectedFlow.contentItems?.filter((i) => i.id !== item.id),
                              }
                              setSelectedFlow(updatedFlow)
                              if (selectedFlow.status === "Ready") {
                                setReadyFlows((flows) => flows.map((f) => (f.id === selectedFlow.id ? updatedFlow : f)))
                              } else {
                                setPlanningFlows((flows) =>
                                  flows.map((f) => (f.id === selectedFlow.id ? updatedFlow : f)),
                                )
                              }
                            }
                          }}
                          sx={{ color: "#dc2626" }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}

                {!selectedFlow?.contentItems || selectedFlow.contentItems.length === 0 ? (
                  <Box
                    sx={{
                      border: isDragOver ? "2px dashed #66A0FF" : "2px dashed #D9D9D9",
                      borderRadius: "4px",
                      padding: "32px",
                      textAlign: "center",
                      backgroundColor: isDragOver ? "#dbeafe" : "#FBFBFC",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "#CCDFFF",
                        backgroundColor: "#F6F6FE",
                      },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragOver(true)
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault()
                      setIsDragOver(false)
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDragOver(false)
                      handleFileSelect(e.dataTransfer.files)
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        backgroundColor: "#dbeafe",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                      }}
                    >
                      <Upload size={20} style={{ color: "#3b82f6" }} />
                    </Box>
                    <Typography sx={{ fontSize: "16px", color: "#3b82f6", fontWeight: 500 }}>
                      Browse <span style={{ color: "#737373", fontWeight: 400 }}>or drag a file here</span>
                    </Typography>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    sx={{
                      mt: 2,
                      color: "#000000",
                      fontWeight: 500,
                      textTransform: "none",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "transparent",
                      px: 2,
                      py: 0.5,
                      alignSelf: "flex-start",
                      "&:hover": {
                        backgroundColor: "#f9fafb",
                        borderColor: "#9ca3af",
                      },
                      "&:active": {
                        backgroundColor: "#f9fafb",
                        transform: "none",
                      },
                      "&:focus": {
                        outline: "none",
                        boxShadow: "none",
                      },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    + Add file
                  </Button>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  multiple
                  accept=".pdf,.doc,.docx,.csv,.xlsx,.xls,.txt,.ppt,.pptx"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </Box>

              {/* Update the Resources section with improved Links UI */}
              <Box sx={{ padding: "24px", borderBottom: "1px solid #e5e7eb" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "16px", color: "#111827", mb: 3 }}>
                  Resources
                </Typography>

                <Box>
                  {selectedFlow?.links && selectedFlow.links.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      {selectedFlow.links.map((link) => (
                        <Box
                          key={link.id}
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            padding: "12px",
                            border: "1px solid rgb(209, 213, 219)",
                            borderRadius: "4px",
                            backgroundColor: "#ffffff",
                            mb: 2,
                            "&:hover": {
                              borderColor: "#9ca3af",
                            },
                          }}
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            {editingLinkId === link.id ? (
                              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <TextField
                                  value={editingLinkName}
                                  onChange={(e) => setEditingLinkName(e.target.value)}
                                  placeholder="Link name"
                                  size="small"
                                  fullWidth
                                />
                                <TextField
                                  value={editingLinkUrl}
                                  onChange={(e) => setEditingLinkUrl(e.target.value)}
                                  placeholder="URL"
                                  size="small"
                                  fullWidth
                                />
                                <TextField
                                  value={editingLinkDescription}
                                  onChange={(e) => setEditingLinkDescription(e.target.value)}
                                  placeholder="Description (optional)"
                                  size="small"
                                  fullWidth
                                  multiline
                                  rows={2}
                                />
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={handleSaveEditedLink}
                                    sx={{
                                      backgroundColor: "#002766",
                                      "&:hover": { backgroundColor: "#003d99" },
                                      textTransform: "none",
                                    }}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={handleCancelEditLink}
                                    sx={{ textTransform: "none" }}
                                  >
                                    Cancel
                                  </Button>
                                </Box>
                              </Box>
                            ) : (
                              <>
                                <Typography
                                  component="a"
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    color: "#002766",
                                    textDecoration: "none",
                                    "&:hover": {
                                      color: "#003d99",
                                      textDecoration: "underline",
                                    },
                                    display: "block",
                                    mb: link.description ? 0.5 : 0,
                                  }}
                                >
                                  {link.name} ({link.url})
                                </Typography>
                                {link.description && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "#6b7280",
                                      fontSize: "12px",
                                      lineHeight: 1.4,
                                    }}
                                  >
                                    {link.description}
                                  </Typography>
                                )}
                              </>
                            )}
                          </Box>

                          {editingLinkId !== link.id && (
                            <Box sx={{ display: "flex", gap: 0.5, ml: 2 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditLink(link)}
                                sx={{
                                  color: "#6b7280",
                                  "&:hover": {
                                    color: "#374151",
                                    backgroundColor: "#f9fafb",
                                  },
                                }}
                              >
                                <Edit2 size={14} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteLink(link.id)}
                                sx={{
                                  color: "#dc2626",
                                  "&:hover": {
                                    color: "#b91c1c",
                                    backgroundColor: "#fef2f2",
                                  },
                                }}
                              >
                                <Trash2 size={14} />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}

                  {linkInputs.map((linkInput) => (
                    <Box key={linkInput.id} sx={{ display: "flex", gap: "12px", alignItems: "flex-start", mb: "12px" }}>
                      <TextField
                        placeholder="Link name"
                        value={linkInput.name}
                        onChange={(e) => updateLinkInput(linkInput.id, "name", e.target.value)}
                        size="small"
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        placeholder="URL"
                        value={linkInput.url}
                        onChange={(e) => updateLinkInput(linkInput.id, "url", e.target.value)}
                        size="small"
                        sx={{ flex: 1 }}
                      />
                      <IconButton
                        onClick={() => handleSaveLinkInput(linkInput)}
                        disabled={!linkInput.name.trim() || !linkInput.url.trim()}
                        sx={{
                          color: "#002766",
                          "&:hover": {
                            backgroundColor: "#f0f9ff",
                          },
                          "&:disabled": {
                            color: "#d1d5db",
                          },
                        }}
                      >
                        <Plus size={16} />
                      </IconButton>
                      <IconButton
                        onClick={() => removeLinkInput(linkInput.id)}
                        sx={{
                          color: "#dc2626",
                          "&:hover": {
                            backgroundColor: "#fef2f2",
                          },
                        }}
                      >
                        <X size={16} />
                      </IconButton>
                    </Box>
                  ))}

                  <Button
                    variant="outlined"
                    disableRipple
                    sx={{
                      mt: 1.5,
                      color: "#000000",
                      fontWeight: 500,
                      textTransform: "none",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db",
                      backgroundColor: "transparent",
                      px: 2,
                      py: 0.5,
                      alignSelf: "flex-start",
                      "&:hover": {
                        backgroundColor: "#f9fafb",
                        borderColor: "#9ca3af",
                      },
                      "&:active": {
                        backgroundColor: "#f9fafb",
                        transform: "none",
                      },
                      "&:focus": {
                        outline: "none",
                        boxShadow: "none",
                      },
                    }}
                    onClick={handleAddLink}
                    startIcon={<Plus size={16} />}
                  >
                    Add link
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          {selectedFlow && (
            <Box
              sx={{
                position: "fixed",
                bottom: 0,
                right: 0,
                width: `${drawerWidth}vw`,
                minWidth: "400px",
                maxWidth: "90vw",
                padding: "12px 24px",
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                backgroundColor: "white",
                borderTop: "1px solid #e5e7eb",
                zIndex: 1000,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderColor: "#d1d5db",
                  color: "#374151",
                  "&:hover": {
                    borderColor: "#9ca3af",
                    backgroundColor: "#f9fafb",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveFlow}
                disabled={!hasUnsavedChanges}
                sx={{
                  backgroundColor: hasUnsavedChanges ? "#0061FF" : "#9ca3af",
                  "&:hover": {
                    backgroundColor: hasUnsavedChanges ? "#0052E6" : "#9ca3af",
                  },
                  "&:disabled": {
                    backgroundColor: "#9ca3af",
                    color: "#ffffff",
                  },
                  boxShadow: "none",
                }}
              >
                Save Changes
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      <Dialog open={showMoveToReadyDialog} onClose={() => setShowMoveToReadyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Is this flow ready to build?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Now that you have all your values added, this flow can be prioritized in your ready to build section and
            create your projections. Would you like to move it up now?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={() => setShowMoveToReadyDialog(false)} sx={{ color: "#6b7280" }}>
            Not now
          </Button>
          <Button
            onClick={moveFlowToReadyToBuild}
            variant="contained"
            sx={{
              backgroundColor: "#002766",
              "&:hover": {
                backgroundColor: "#001a4d",
              },
            }}
          >
            Yes, move it
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
