import { PageTemplate } from "@/components/ui/page-template"
import { CheckSquare } from "@phosphor-icons/react"
import { Box, Typography } from "@mui/material"

interface TasksPageProps {
  showSidebarToggle?: boolean
  onToggleSidebar?: () => void
}

export function TasksPage({ showSidebarToggle = false, onToggleSidebar }: TasksPageProps) {
  return (
    <PageTemplate
      icon={<CheckSquare style={{ width: 20, height: 20, color: "white" }} />}
      title="Tasks"
      showSidebarToggle={showSidebarToggle}
      onToggleSidebar={onToggleSidebar}
    >
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
          This page is under development.
        </Typography>
      </Box>
    </PageTemplate>
  )
}
