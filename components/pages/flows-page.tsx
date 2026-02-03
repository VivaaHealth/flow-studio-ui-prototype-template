"use client"

import { Plus } from "@phosphor-icons/react"
import { Box, Typography } from "@mui/material"
import { useState, useEffect, useRef } from "react"
import { NotableButton } from "@/components/ui/notable-button"
import { RoadmapView } from "@/components/roadmap/roadmap-view"
import { FlowLibraryPage } from "@/components/pages/flow-library-page"

export function FlowsPage() {
  const [activeTab, setActiveTab] = useState("roadmap")
  const [currentView, setCurrentView] = useState<"flows" | "library">("flows")
  const [roadmapKey, setRoadmapKey] = useState(0)
  const [isTabsSticky, setIsTabsSticky] = useState(false)
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const isTabsStickyRef = useRef(false)

  const tabs = [
    { id: "roadmap", label: "Roadmap" },
    { id: "draft", label: "Draft" },
    { id: "review", label: "Review" },
    { id: "deployed", label: "Deployed" },
  ]

  useEffect(() => {
    isTabsStickyRef.current = isTabsSticky
  }, [isTabsSticky])

  useEffect(() => {
    const findScrollContainer = () => {
      // Look for the main element with overflow-auto class
      const mainElement = document.querySelector("main.overflow-auto") as HTMLElement
      if (mainElement) {
        scrollContainerRef.current = mainElement
        return mainElement
      }

      // Fallback: look for any scrollable parent
      let element = document.querySelector("[data-flows-page]")?.parentElement
      while (element) {
        const style = window.getComputedStyle(element)
        if (
          style.overflow === "auto" ||
          style.overflowY === "auto" ||
          style.overflow === "scroll" ||
          style.overflowY === "scroll"
        ) {
          scrollContainerRef.current = element as HTMLElement
          return element as HTMLElement
        }
        element = element.parentElement
      }

      return null
    }

    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement
      const scrollTop = target.scrollTop
      const scrollTrigger = 1 // Trigger white background when scrolled >= 1px
      const newStickyState = scrollTop >= scrollTrigger

      if (newStickyState !== isTabsStickyRef.current) {
        console.log("[v0] Updating sticky state from", isTabsStickyRef.current, "to", newStickyState)
        setIsTabsSticky(newStickyState)
      }
    }

    const scrollContainer = findScrollContainer()
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, { passive: true })

      // Check initial scroll position
      handleScroll({ target: scrollContainer } as Event)

      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll)
      }
    }
  }, []) // Keep dependency array empty to prevent re-mounting

  const handleExploreFlows = () => {
    setCurrentView("library")
  }

  const handleBackToFlows = () => {
    setCurrentView("flows")
  }

  const handleResetToZeroState = () => {
    setActiveTab("roadmap")
    setCurrentView("flows")
    setRoadmapKey((prev) => prev + 1) // Force RoadmapView to re-mount and reset its state
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "roadmap":
        return <RoadmapView key={roadmapKey} onExploreFlows={handleExploreFlows} />
      case "draft":
        return (
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: "4px",
              border: "1px solid #D9D9D9",
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                color: "#4b5563",
                fontSize: "1rem",
                letterSpacing: "0.0025em",
              }}
            >
              Draft flows will be displayed here.
            </Typography>
          </Box>
        )
      case "review":
        return (
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: "4px",
              border: "1px solid #D9D9D9",
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                color: "#4b5563",
                fontSize: "1rem",
                letterSpacing: "0.0025em",
              }}
            >
              Review flows will be displayed here.
            </Typography>
          </Box>
        )
      case "deployed":
        return (
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: "4px",
              border: "1px solid #D9D9D9",
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                color: "#4b5563",
                fontSize: "1rem",
                letterSpacing: "0.0025em",
              }}
            >
              Deployed flows will be displayed here.
            </Typography>
          </Box>
        )
      default:
        return null
    }
  }

  console.log("[v0] Rendering FlowsPage with isTabsSticky:", isTabsSticky)

  if (currentView === "library") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Box
          sx={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: "24px",
            paddingRight: "24px",
            bgcolor: "white",
            borderBottom: "1px solid #D9D9D9",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{ cursor: "pointer", color: "#6b7280", fontSize: "1.25rem", fontWeight: 600 }}
              onClick={handleBackToFlows}
            >
              Flows
            </Typography>
            <Typography sx={{ color: "#6b7280" }}>/</Typography>
            <Typography sx={{ color: "#111827", fontSize: "1.125rem", fontWeight: 600 }}>Flow library</Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, bgcolor: "#FBFBFC", p: 3 }}>
          <FlowLibraryPage />
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }} data-flows-page>
      <Box
        sx={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "24px",
          paddingRight: "24px",
          bgcolor: "white",
          borderBottom: isTabsSticky ? "none" : "1px solid #D9D9D9",
          position: "sticky",
          top: 0,
          zIndex: 101, // Higher z-index than tabs
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            onClick={handleResetToZeroState}
            sx={{
              fontWeight: 600,
              color: "#111827",
              fontSize: "1.25rem",
              cursor: "pointer",
              "&:hover": {
                color: "#002766",
              },
            }}
          >
            Flows
          </Typography>
        </Box>
        <NotableButton onClick={handleExploreFlows} sx={{ fontWeight: 600 }}>
          <Plus style={{ width: 20, height: 20 }} />
          Add flow
        </NotableButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingTop: "0px",
          paddingBottom: "24px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "12px",
            paddingTop: "8px",
            position: "sticky",
            top: 56,
            zIndex: 100,
            bgcolor: isTabsSticky ? "white" : "#f9fafb",
            ...(isTabsSticky && {
              marginLeft: "-24px",
              marginRight: "-24px",
              paddingLeft: "24px",
              paddingRight: "24px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }),
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -2,
              left: isTabsSticky ? 0 : "-24px",
              right: isTabsSticky ? 0 : "-24px",
              height: "1px",
              bgcolor: "#D9D9D9",
            },
          }}
        >
          <Box sx={{ display: "flex", gap: 4 }}>
            {tabs.map((tab) => (
              <Box
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                sx={{
                  cursor: "pointer",
                  position: "relative",
                  padding: "4px 0 12px", // Updated bottom padding from 8px to 12px
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: activeTab === tab.id ? "#002766" : "#4b5563",
                    transition: "color 200ms ease",
                    "&:hover": {
                      color: activeTab === tab.id ? "#002766" : "#374151",
                    },
                  }}
                >
                  {tab.label}
                </Typography>
                {activeTab === tab.id && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -2, // moved up 1px from -3 to -2
                      left: 0,
                      right: 0,
                      height: "4px",
                      bgcolor: "#1d4ed8",
                      borderRadius: "4px 4px 0 0",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {renderTabContent()}
      </Box>
    </Box>
  )
}
