"use client"

import React from "react"
import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipArrow } from "@/components/ui/tooltip"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronUp, Search, MoreHorizontal } from "lucide-react"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import { NotableTag } from "@/components/ui/notable-tag"
import { Tooltip as MuiTooltip } from "@mui/material"
import { Info } from "@phosphor-icons/react"

interface Flow {
  id: string
  name: string
  priority?: string
  agentRole?: string
  baselineVolume?: number
  completionRate?: number
  value?: number
  roi?: string
  complexity?: number
  utilization?: number
  status?: string // Added status field
}

interface SharedTableProps {
  flows: Flow[]
  sectionId: string
  onFlowClick: (flow: Flow) => void
  onDragStart: (e: React.DragEvent, flow: Flow, index?: number) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent, sectionId?: string, index?: number) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, targetFlow: Flow, sectionId: string, dropIndex?: number) => void
  draggedFlow?: Flow | null
  crossTableDragOver?: { sectionId: string; index: number } | null
  tableBorderError?: boolean
  onMoveToReadyToBuild?: (flow: Flow) => void
}

type SortColumn =
  | "priority"
  | "progress"
  | "opportunity"
  | "usage"
  | "utilization"
  | "value"
  | "roi"
  | "complexity"
  | null
type SortDirection = "asc" | "desc"

const styles = {
  container: (borderError: boolean, isEmpty: boolean) => ({
    border: `1px solid ${borderError ? "#ef4444" : "#D9D9D9"}`,
    borderRadius: "4px",
    overflow: "visible", // Changed overflow from "hidden" to "visible" to allow tooltips to escape table boundaries
    minHeight: isEmpty ? "180px" : "auto",
    position: "relative" as const,
  }),
  table: (isEmpty: boolean) => ({
    width: "100%",
    borderCollapse: "separate" as const,
    borderSpacing: 0,
    fontSize: "14px",
    backgroundColor: "white",
    height: isEmpty ? "180px" : "auto",
    overflow: "visible", // Added overflow visible to table to prevent tooltip clipping
  }),
  headerRow: {
    backgroundColor: "#F7F7F7",
    borderBottom: "1px solid #BFBFBF",
  },
  headerCell: {
    padding: "12px 8px",
    textAlign: "left" as const,
    fontWeight: "600",
    color: "#374151",
    fontSize: "12px",
    letterSpacing: 0, // Updated letter spacing from "0.05em" to 0
  },
  sortableHeaderCell: {
    padding: "12px 8px",
    textAlign: "left" as const,
    fontWeight: "600",
    color: "#374151",
    fontSize: "12px",
    cursor: "pointer" as const,
    userSelect: "none" as const,
    transition: "background-color 0.15s ease",
    letterSpacing: 0, // Updated letter spacing from "0.05em" to 0
  },
  dragHandle: {
    padding: "8px",
    textAlign: "center" as const,
    cursor: "grab",
    backgroundColor: "#F7F7F7",
    userSelect: "none" as const,
    width: "40px",
  },
  emptyCell: {
    textAlign: "center" as const,
    verticalAlign: "middle" as const,
    color: "#6b7280",
    fontSize: "14px",
    height: "130px",
  },
  dropLine: {
    position: "absolute" as const,
    left: "0",
    right: "0",
    height: "3px",
    backgroundColor: "#1976d2",
    borderRadius: "2px",
    zIndex: 10,
    pointerEvents: "none" as const,
    transform: "scaleX(1)",
    opacity: 1,
  },
  dragPreview: {
    position: "fixed" as const,
    pointerEvents: "none" as const,
    zIndex: 1000,
    backgroundColor: "white",
    border: "2px solid #1976d2",
    borderRadius: "6px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    transform: "rotate(2deg)",
    opacity: 0.95,
    transition: "transform 0.2s ease",
  },
}

const TruncatedText: React.FC<{ text: string; maxWidth: string; hasAgentRole?: boolean }> = ({
  text,
  maxWidth,
  hasAgentRole = false,
}) => {
  const [isTruncated, setIsTruncated] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth)
    }
  }, [text])

  const content = (
    <div
      ref={textRef}
      style={{
        maxWidth,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  )

  if (isTruncated && !hasAgentRole) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent className="bg-black text-white border-black" sideOffset={5}>
            <p>{text}</p>
            <TooltipArrow className="fill-black" />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
}

export const SharedTable: React.FC<SharedTableProps> = ({
  flows,
  sectionId,
  onFlowClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  draggedFlow,
  crossTableDragOver,
  tableBorderError = false,
  onMoveToReadyToBuild,
}) => {
  const isEmpty = flows.length === 0
  const [sortColumn, setSortColumn] = useState<SortColumn>(sectionId === "planning" ? "priority" : "priority")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null)
  const tableRef = useRef<HTMLTableElement>(null)

  useEffect(() => {
    if (!isDragging && draggedFlow === null) {
      setIsTransitioning(true)
      const timer = setTimeout(() => setIsTransitioning(false), 300)
      return () => clearTimeout(timer)
    }
  }, [flows.length, isDragging, draggedFlow])

  const getComplexityVariant = (complexity: number | undefined): "success" | "warning" | "destructive" | "working" => {
    if (!complexity) return "working"
    if (complexity >= 4) return "destructive" // High/Major (4-5)
    if (complexity === 3) return "warning" // Medium (3)
    if (complexity <= 2) return "success" // Minor/Small (1-2)
    return "working"
  }

  const getComplexityLabel = (complexity: number | undefined) => {
    if (!complexity) return "-"
    switch (complexity) {
      case 1:
        return "Trivial"
      case 2:
        return "Low"
      case 3:
        return "Moderate"
      case 4:
        return "High"
      default:
        return "-"
    }
  }

  const calculateUsage = (flow: Flow): number =>
    Math.round((flow.baselineVolume || 0) * ((flow.completionRate || 0) / 100))

  const calculateValue = (flow: Flow): number => {
    const usage = (flow.baselineVolume || 0) * ((flow.completionRate || 0) / 100)
    return usage * (flow.value || 0)
  }

  const calculateUtilization = (flow: Flow): number => {
    const usage = calculateUsage(flow)
    return Math.round((flow.utilization || 0) * usage)
  }

  const calculateROI = (flow: Flow): string => {
    if (!flow.utilization) return "0%"
    const roi = ((flow.value || 0) / flow.utilization) * 100
    return `${Math.round(roi)}%`
  }

  const calculateOpportunityRating = (flow: Flow): number => {
    if (!flow.value || !flow.complexity || !flow.utilization) {
      return 60 // Base score for incomplete data
    }

    const value = flow.value || 0
    const utilization = flow.utilization || 0
    const complexity = flow.complexity || 1

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
  }

  const handleSort = (column: SortColumn) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedFlows = React.useMemo(() => {
    if (!sortColumn) return flows

    return [...flows].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortColumn) {
        case "priority":
          aValue = Number.parseInt(a.priority || "999")
          bValue = Number.parseInt(b.priority || "999")
          break
        case "opportunity":
          aValue = a.status === "Planning" || a.status === "Backlog" ? -1 : calculateOpportunityRating(a)
          bValue = b.status === "Planning" || b.status === "Backlog" ? -1 : calculateOpportunityRating(b)
          break
        case "usage":
          aValue = a.status === "Planning" || a.status === "Backlog" ? -1 : calculateUsage(a)
          bValue = b.status === "Planning" || b.status === "Backlog" ? -1 : calculateUsage(b)
          break
        case "utilization":
          aValue = calculateUtilization(a)
          bValue = calculateUtilization(b)
          break
        case "value":
          aValue = calculateValue(a)
          bValue = calculateValue(b)
          break
        case "roi":
          aValue = Number.parseFloat(calculateROI(a).replace("%", ""))
          bValue = Number.parseFloat(calculateROI(b).replace("%", ""))
          break
        case "complexity":
          aValue = a.complexity || 0
          bValue = b.complexity || 0
          break
        default:
          return 0
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }, [flows, sortColumn, sortDirection, sectionId])

  const isDragDisabled = sortColumn !== "priority"

  const renderSortIndicator = (column: SortColumn) => {
    if (sortColumn !== column) return null

    return sortDirection === "asc" ? <ChevronUp style={{ width: "12px", height: "12px", marginLeft: "4px" }} /> : null
  }

  const getDropLineTop = (index: number) => {
    if (!tableRef.current) return 0

    const headerRow = tableRef.current.querySelector("thead tr")
    const headerHeight = headerRow ? headerRow.getBoundingClientRect().height : 49

    const rows = tableRef.current.querySelectorAll("tbody tr")
    if (rows.length === 0) return headerHeight

    if (index === 0) {
      return headerHeight
    }

    const targetRow = rows[index - 1]
    if (targetRow) {
      const rowRect = targetRow.getBoundingClientRect()
      const tableRect = tableRef.current.getBoundingClientRect()
      return rowRect.bottom - tableRect.top
    }

    // Fallback calculation
    const rowHeight = 49
    return headerHeight + index * rowHeight
  }

  const handleDragStart = (e: React.DragEvent, flow: Flow, index?: number) => {
    if (isDragDisabled) return

    setIsDragging(true)

    // Create a custom drag image
    const dragElement = e.currentTarget as HTMLElement
    const rect = dragElement.getBoundingClientRect()

    // Set drag effect
    e.dataTransfer.effectAllowed = "move"

    onDragStart(e, flow, index)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setDragOverIndex(null)
    onDragEnd()
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (isDragDisabled) return

    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

    setDragOverIndex(index)
    onDragOver(e, sectionId, index)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over state if we're leaving the table entirely
    const rect = tableRef.current?.getBoundingClientRect()
    if (rect) {
      const { clientX, clientY } = e
      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
        setDragOverIndex(null)
      }
    }
    onDragLeave(e)
  }

  const isPlanningFlowComplete = (flow: Flow): boolean => {
    return (
      flow.status === "Planning" && !!flow.baselineVolume && !!flow.completionRate && !!flow.value && !!flow.complexity
    )
  }

  const isBacklogFlowComplete = (flow: Flow): boolean => {
    return (
      flow.status === "Backlog" && !!flow.baselineVolume && !!flow.completionRate && !!flow.value && !!flow.complexity
    )
  }

  const isFlowReadyToBuild = (flow: Flow): boolean => {
    return isPlanningFlowComplete(flow) || isBacklogFlowComplete(flow)
  }

  const handleMoveToReadyToBuild = (flow: Flow, e: React.MouseEvent) => {
    e.stopPropagation()
    if (onMoveToReadyToBuild) {
      onMoveToReadyToBuild(flow)
    } else {
      console.log("Moving flow to Ready to build:", flow.id, flow.name)
    }
  }

  const getAgentRoleVariant = (agentRole: string | undefined): "blue" | "teal" | "purple" | "cyan" | "magenta" => {
    if (!agentRole) return "blue"

    // Group related agent roles by color
    const roleColorMap: Record<string, "blue" | "teal" | "purple" | "cyan" | "magenta"> = {
      // Blue - Scheduling & Coordination roles
      Scheduler: "blue",
      "Care Coordinator": "blue",
      "Referral Coordinator": "blue",

      // Teal - Specialist roles (Authorization, Insurance, etc.)
      "Authorization Specialist": "teal",
      "Insurance Specialist": "teal",
      "Intake Specialist": "teal",

      // Purple - Quality & Analysis roles
      "Quality Specialist": "purple",
      "Quality Analyst": "purple",
      Pharmacist: "purple",

      // Cyan - Contact & Communication roles
      "Contact Specialist": "cyan",

      // Magenta - Default for any unspecified roles
    }

    return roleColorMap[agentRole] || "magenta"
  }

  return (
    <div style={styles.container(tableBorderError, isEmpty)}>
      {crossTableDragOver?.sectionId === sectionId && crossTableDragOver?.index !== undefined && !isDragDisabled && (
        <div
          style={{
            ...styles.dropLine,
            top: `${getDropLineTop(crossTableDragOver.index)}px`,
          }}
        />
      )}

      <table ref={tableRef} style={styles.table(isEmpty)}>
        <thead>
          <tr style={styles.headerRow}>
            <th
              style={{ ...styles.sortableHeaderCell, width: "60px" }}
              onClick={() => handleSort("priority")}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                Priority
                {renderSortIndicator("priority")}
              </div>
            </th>
            <th style={{ ...styles.headerCell, width: "280px" }}>Flow name</th>
            <th
              style={{ ...styles.sortableHeaderCell, textAlign: "right", width: "100px" }}
              onClick={() => handleSort("opportunity")}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
                Opportunity
                <MuiTooltip
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
                  <Info size={12} style={{ color: "#9ca3af" }} onClick={(e) => e.stopPropagation()} />
                </MuiTooltip>
                {renderSortIndicator("opportunity")}
              </div>
            </th>
            <th
              style={{ ...styles.sortableHeaderCell, textAlign: "right", width: "100px" }}
              onClick={() => handleSort("usage")}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
                Usage
                <MuiTooltip title="Baseline Volume X Deflection Rate / 1000" placement="right" arrow>
                  <Info size={12} style={{ color: "#9ca3af" }} onClick={(e) => e.stopPropagation()} />
                </MuiTooltip>
                {renderSortIndicator("usage")}
              </div>
            </th>
            <th
              style={{ ...styles.sortableHeaderCell, textAlign: "right", width: "100px" }}
              onClick={() => handleSort("utilization")}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
                Utilization
                <MuiTooltip title="Price per flow run X Usage" placement="right" arrow>
                  <Info size={12} style={{ color: "#9ca3af" }} onClick={(e) => e.stopPropagation()} />
                </MuiTooltip>
                {renderSortIndicator("utilization")}
              </div>
            </th>
            <th
              style={{ ...styles.sortableHeaderCell, textAlign: "right", width: "100px" }}
              onClick={() => handleSort("value")}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
                Value
                <MuiTooltip title="(Value per flow run - Price per flow run) X Usage" placement="right" arrow>
                  <Info size={12} style={{ color: "#9ca3af" }} onClick={(e) => e.stopPropagation()} />
                </MuiTooltip>
                {renderSortIndicator("value")}
              </div>
            </th>
            <th
              style={{ ...styles.sortableHeaderCell, textAlign: "right", width: "80px" }}
              onClick={() => handleSort("roi")}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
                ROI
                <MuiTooltip title="(Value / Utilization) X 100" placement="right" arrow>
                  <Info size={12} style={{ color: "#9ca3af" }} onClick={(e) => e.stopPropagation()} />
                </MuiTooltip>
                {renderSortIndicator("roi")}
              </div>
            </th>
            <th
              style={{ ...styles.sortableHeaderCell, textAlign: "right", width: "100px" }}
              onClick={() => handleSort("complexity")}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                Complexity
                {renderSortIndicator("complexity")}
              </div>
            </th>
            <th style={{ ...styles.headerCell, textAlign: "right", width: "80px", paddingRight: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td
                colSpan={9}
                style={{
                  ...styles.emptyCell,
                  padding: "32px 24px",
                }}
                onDragOver={(e) => {
                  if (!isDragDisabled) {
                    e.preventDefault()
                    e.dataTransfer.dropEffect = "move"
                  }
                }}
                onDrop={(e) => {
                  if (!isDragDisabled && draggedFlow) {
                    // Create a dummy flow to pass to onDrop for empty table drops
                    const dummyFlow: Flow = {
                      id: "dummy",
                      name: "dummy",
                    }
                    onDrop(e, dummyFlow, sectionId, 0)
                  }
                }}
                onDragLeave={handleDragLeave}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      border: "2px dashed #d1d5db",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <Search
                      style={{
                        width: "32px",
                        height: "32px",
                        color: "#9ca3af",
                      }}
                    />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "16px", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Add flows to plan your backlog
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    style={{
                      fontSize: "14px",
                      padding: "8px 16px",
                      color: "#00031A",
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle explore flow library action
                    }}
                  >
                    Explore Flow Library
                  </Button>
                </div>
              </td>
            </tr>
          ) : (
            sortedFlows.map((flow, index) => {
              const isDragged = draggedFlow?.id === flow.id && isDragging

              return (
                <tr
                  key={flow.id}
                  style={{
                    backgroundColor: "white",
                    opacity: isDragged ? 0.7 : 1,
                    transform: isDragged ? "scale(0.98)" : "scale(1)",
                    transition: isDragged
                      ? "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                      : "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    cursor: "pointer",
                    borderLeft: "3px solid transparent",
                  }}
                  onClick={() => onFlowClick(flow)}
                  onDragOver={(e) => !isDragDisabled && handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => !isDragDisabled && onDrop(e, flow, sectionId, index)}
                >
                  <td
                    style={{
                      padding: "12px 8px",
                      color: "#374151",
                      fontWeight: "500",
                      width: "60px",
                      borderBottom: index < sortedFlows.length - 1 ? "1px solid #D9D9D9" : "none",
                      cursor: isDragDisabled ? "default" : "grab",
                      verticalAlign: "middle",
                      transition: "all 0.15s ease",
                    }}
                    draggable={!isDragDisabled}
                    onDragStart={(e) => !isDragDisabled && handleDragStart(e, flow, index)}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <DragIndicatorIcon
                        style={{
                          fontSize: "16px",
                          color: isDragDisabled ? "#d1d5db" : "#6b7280",
                          marginRight: "8px",
                          userSelect: "none",
                          transition: "color 0.15s ease",
                        }}
                      />
                      <span>{flow.priority || "-"}</span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      fontWeight: "400",
                      color: "#111827",
                      width: "280px",
                      borderBottom: index < sortedFlows.length - 1 ? "1px solid #D9D9D9" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <TruncatedText
                        text={flow.name}
                        maxWidth={flow.agentRole ? "calc(100% - 30px)" : "100%"}
                        hasAgentRole={!!flow.agentRole}
                      />
                      {flow.agentRole && (
                        <Popover open={openPopoverId === flow.id} onOpenChange={() => {}}>
                          <PopoverTrigger asChild>
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                cursor: "default",
                                flexShrink: 0,
                              }}
                              onClick={(e) => e.stopPropagation()}
                              onMouseEnter={() => setOpenPopoverId(flow.id)}
                              onMouseLeave={() => setOpenPopoverId(null)}
                            >
                              <Info
                                size={14}
                                style={{
                                  color: "#9ca3af",
                                }}
                              />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent
                            side="right"
                            className="w-auto p-3 bg-white border border-gray-200"
                            sideOffset={8}
                            onOpenAutoFocus={(e) => e.preventDefault()}
                            onMouseEnter={() => setOpenPopoverId(flow.id)}
                            onMouseLeave={() => setOpenPopoverId(null)}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <Label className="text-sm font-medium text-gray-700">Agent role</Label>
                              <Badge variant="secondary" className="text-xs">
                                {flow.agentRole}
                              </Badge>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                      {isFlowReadyToBuild(flow) && (
                        <NotableTag
                          variant="success"
                          size="sm"
                          onClick={(e) => handleMoveToReadyToBuild(flow, e)}
                          className="cursor-pointer hover:opacity-80 flex-shrink-0"
                        >
                          Ready to build
                        </NotableTag>
                      )}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      color: "#374151",
                      textAlign: "right",
                      width: "100px",
                      borderBottom: index < sortedFlows.length - 1 ? "1px solid #D9D9D9" : "none",
                      fontWeight: "600",
                    }}
                  >
                    {flow.status === "Planning" &&
                    (!flow.baselineVolume || !flow.completionRate || !flow.value || !flow.complexity)
                      ? "–"
                      : flow.status === "Backlog" &&
                          (!flow.baselineVolume || !flow.completionRate || !flow.value || !flow.complexity)
                        ? "–"
                        : calculateOpportunityRating(flow)}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      color: "#374151",
                      textAlign: "right",
                      width: "100px",
                      borderBottom: index < sortedFlows.length - 1 ? "1px solid #D9D9D9" : "none",
                    }}
                  >
                    {flow.status === "Planning" && (!flow.baselineVolume || !flow.completionRate)
                      ? "–"
                      : flow.status === "Backlog" && (!flow.baselineVolume || !flow.completionRate)
                        ? "–"
                        : calculateUsage(flow).toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      color: "#374151",
                      textAlign: "right",
                      width: "100px",
                      borderBottom: index < sortedFlows.length - 1 ? "1px solid #D9D9D9" : "none",
                    }}
                  >
                    {flow.status === "Planning" && !flow.utilization
                      ? "–"
                      : flow.status === "Backlog" && !flow.utilization
                        ? "–"
                        : `$${calculateUtilization(flow).toLocaleString()}`}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      color: "#374151",
                      textAlign: "right",
                      width: "100px",
                      borderBottom: index < sortedFlows.length - 1 ? "1px solid #D9D9D9" : "none",
                    }}
                  >
                    {flow.status === "Planning" && (!flow.baselineVolume || !flow.completionRate || !flow.value)
                      ? "–"
                      : flow.status === "Backlog" && (!flow.baselineVolume || !flow.completionRate || !flow.value)
                        ? "–"
                        : `$${calculateValue(flow).toLocaleString()}`}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      color: "#374151",
                      textAlign: "right",
                      width: "80px",
                      borderBottom: index < sortedFlows.length - 1 ? "1px solid #D9D9D9" : "none",
                    }}
                  >
                    {flow.status === "Planning" && !flow.utilization
                      ? "–"
                      : flow.status === "Backlog" && !flow.utilization
                        ? "–"
                        : calculateROI(flow)}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      color: "#374151",
                      textAlign: "right",
                      width: "100px",
                      borderBottom: index < sortedFlows.length - 1 ? "1px solid #D9D9D9" : "none",
                    }}
                  >
                    {flow.status === "Planning" && !flow.complexity ? (
                      "–"
                    ) : flow.status === "Backlog" && !flow.complexity ? (
                      "–"
                    ) : (
                      <NotableTag variant={getComplexityVariant(flow.complexity)} size="sm">
                        {getComplexityLabel(flow.complexity)}
                      </NotableTag>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      textAlign: "center",
                      width: "80px",
                      borderBottom: index < sortedFlows.length - 1 ? "1px solid #D9D9D9" : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              // Handle move to draft action
                              console.log("Move to draft:", flow.id)
                            }}
                          >
                            Move to draft
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              // Handle delete from roadmap action
                              console.log("Delete from roadmap:", flow.id)
                            }}
                            className="text-red-600 focus:text-red-600"
                          >
                            Delete from Roadmap
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
