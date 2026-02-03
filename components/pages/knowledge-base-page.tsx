import { PageTemplate } from "@/components/ui/page-template"
import { Database } from "@phosphor-icons/react"
import { Box, Typography } from "@mui/material"

interface KnowledgeBasePageProps {
  showSidebarToggle?: boolean
  onToggleSidebar?: () => void
}

export function KnowledgeBasePage({ showSidebarToggle = false, onToggleSidebar }: KnowledgeBasePageProps) {
  return (
    <PageTemplate
      icon={<Database style={{ width: 20, height: 20, color: "white" }} />}
      title="Knowledge base"
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
