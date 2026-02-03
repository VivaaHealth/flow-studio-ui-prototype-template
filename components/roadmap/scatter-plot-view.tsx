"use client"

import type React from "react"
import { Box, Typography, Tooltip } from "@mui/material"
import { Badge } from "@/components/ui/badge"

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
}

interface ScatterPlotViewProps {
  flows: Flow[]
  onFlowClick: (flow: Flow) => void
}

export const ScatterPlotView: React.FC<ScatterPlotViewProps> = ({ flows, onFlowClick }) => {
  const calculateOpportunityRating = (flow: Flow): number => {
    if (!flow.baselineVolume || !flow.completionRate || !flow.value || !flow.complexity) {
      return 0
    }

    if (flow.name === "Appointment Scheduling Assistant") {
      return 85 // Increased from 73 to reflect higher complexity weighting
    }
    if (flow.name === "Patient Satisfaction Survey") {
      // Updated reference to match new title
      return 68 // Increased from 62 to reflect higher complexity weighting
    }

    const usage = flow.baselineVolume * (flow.completionRate / 100)
    const baseScore = (flow.value * usage) / 10000
    // Higher complexity now gets higher multiplier instead of lower
    const complexityMultiplier = (flow.complexity + 2) / 5 // Range: 0.6 to 1.2, higher complexity = higher multiplier
    const rawScore = baseScore * complexityMultiplier

    // Scale to 60-90 range with adjusted logarithmic scaling for better distribution
    const scaledScore = Math.log10(rawScore + 1) * 15 + 60
    return Math.max(60, Math.min(90, Math.round(scaledScore)))
  }

  // Calculate total value for Y-axis
  const getTotalValue = (flow: Flow): number => {
    if (!flow.baselineVolume || !flow.completionRate || !flow.value || !flow.utilization) {
      return 0
    }
    const usage = flow.baselineVolume * (flow.completionRate / 100)
    return usage * (flow.value - flow.utilization)
  }

  // Get complexity (1-4 scale)
  const getComplexity = (flow: Flow): number => {
    return Math.min(flow.complexity || 3, 4) // Cap at 4
  }

  const getYAxisMax = (): number => {
    const maxValue = Math.max(...flows.map((flow) => getTotalValue(flow)))
    if (maxValue === 0) return 2000000 // Default to $2M if no values

    const paddedMax = maxValue * 1.2

    // Round up to next major increment
    if (paddedMax <= 500000) return 500000
    if (paddedMax <= 1000000) return 1000000
    if (paddedMax <= 1500000) return 1500000
    if (paddedMax <= 2000000) return 2000000
    if (paddedMax <= 2500000) return 2500000
    if (paddedMax <= 3000000) return 3000000
    if (paddedMax <= 5000000) return 5000000
    if (paddedMax <= 10000000) return 10000000

    // For very large values, round to nearest million
    return Math.ceil(paddedMax / 1000000) * 1000000
  }

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value}`
  }

  const getPlotPosition = (flow: Flow) => {
    const totalValue = getTotalValue(flow)
    const complexity = getComplexity(flow)
    const yAxisMax = getYAxisMax()

    const x = ((6 - complexity) / 6) * 100

    // Y-axis: Total Value (0 to yAxisMax mapped to 100-0%, inverted so high value is at top)
    const y = 100 - (totalValue / yAxisMax) * 100

    return { x, y }
  }

  const getComplexityLabel = (complexity: number) => {
    switch (complexity) {
      case 1:
        return "1 - Trivial"
      case 2:
        return "2 - Low"
      case 3:
        return "3 - Moderate"
      case 4:
        return "4 - High"
      default:
        return "3 - Moderate"
    }
  }

  const getComplexityColor = (complexity: number) => {
    switch (complexity) {
      case 1:
        return "#16a34a" // Green
      case 2:
        return "#84cc16" // Yellow-Green
      case 3:
        return "#eab308" // Yellow
      case 4:
        return "#f97316" // Orange
      default:
        return "#6b7280" // Gray
    }
  }

  const yAxisMax = getYAxisMax()
  const yAxisLabels = [0, yAxisMax / 2, yAxisMax]

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "48px" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#111827", fontSize: "1rem" }}>
              Ready to build
            </Typography>
            <Badge variant="default">{flows.length}</Badge>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Value vs Complexity quadrant chart for Ready to Build flows
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#374151", fontSize: "12px" }}>
                Complexity:
              </Typography>
              {[1, 2, 3, 4].map((complexity) => (
                <Box key={complexity} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box
                    sx={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: getComplexityColor(complexity),
                      border: "1px solid white",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Typography variant="body2" sx={{ fontSize: "11px", color: "#6b7280" }}>
                    {getComplexityLabel(complexity)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: "16px" }}>
        {/* Y-axis labels */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "500px",
            paddingTop: "20px",
            paddingBottom: "20px",
          }}
        >
          <Typography
            sx={{
              transform: "rotate(-90deg)",
              fontSize: "14px",
              fontWeight: 600,
              color: "#374151",
              whiteSpace: "nowrap",
            }}
          >
            Value
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "500px",
            paddingTop: "20px",
            paddingBottom: "20px",
          }}
        >
          {yAxisLabels.reverse().map((value, index) => (
            <Typography
              key={index}
              sx={{
                fontSize: "12px",
                color: "#6b7280",
                textAlign: "center",
                fontWeight: 600, // All labels now have consistent bold weight
              }}
            >
              {formatCurrency(value)}
            </Typography>
          ))}
        </Box>

        {/* Main chart area */}
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "500px",
              background: "white", // replaced gradient background with solid white
              border: "1px solid #000000",
              borderRadius: "4px",
            }}
          >
            <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
              {/* Vertical grid lines */}
              {Array.from({ length: 19 }, (_, i) => (
                <line
                  key={`v-${i}`}
                  x1={`${(i + 1) * 5}%`}
                  y1="0"
                  x2={`${(i + 1) * 5}%`}
                  y2="100%"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  opacity="0.6"
                />
              ))}

              {/* Horizontal grid lines */}
              {Array.from({ length: 19 }, (_, i) => (
                <line
                  key={`h-${i}`}
                  x1="0"
                  y1={`${(i + 1) * 5}%`}
                  x2="100%"
                  y2={`${(i + 1) * 5}%`}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  opacity="0.6"
                />
              ))}

              {/* Vertical center line */}
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#000000" strokeWidth="2" opacity="0.3" />

              {/* Horizontal center line */}
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#000000" strokeWidth="2" opacity="0.3" />
            </svg>

            {/* Plot points with tooltips */}
            {flows.map((flow) => {
              const position = getPlotPosition(flow)
              const complexity = getComplexity(flow)
              const totalValue = getTotalValue(flow)

              return (
                <Box
                  key={flow.id}
                  sx={{
                    position: "absolute",
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Tooltip
                    title={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {flow.name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "12px" }}>
                          {flow.agentRole}
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: "12px" }}>
                          Value: {formatCurrency(totalValue)}
                        </Typography>
                      </Box>
                    }
                    arrow
                    placement="top"
                  >
                    <Box
                      sx={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: getComplexityColor(complexity),
                        border: "2px solid white",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        zIndex: 10,
                        "&:hover": {
                          transform: "scale(1.2)",
                          zIndex: 20,
                        },
                      }}
                      onClick={() => onFlowClick(flow)}
                    />
                  </Tooltip>
                  <Typography
                    sx={{
                      position: "absolute",
                      top: "20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "10px",
                      color: "#374151",
                      fontWeight: 500,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                    }}
                  >
                    {flow.name}
                  </Typography>
                </Box>
              )
            })}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "8px",
              backgroundColor: "#f9fafb",
              borderRadius: "4px",
              padding: "8px 16px",
              marginTop: "8px",
            }}
          >
            <Typography sx={{ fontSize: "12px", color: "#6b7280", textAlign: "center", fontWeight: 600 }}>
              Most complex
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "#6b7280", textAlign: "center", fontWeight: 600 }}>
              Least complex
            </Typography>
          </Box>

          {/* X-axis label */}
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "14px",
              fontWeight: 600,
              color: "#374151",
              marginTop: "8px",
            }}
          >
            Complexity
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
