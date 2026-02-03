import { PageTemplate } from "@/components/ui/page-template"
import { Table } from "@phosphor-icons/react"
import { Box, Typography } from "@mui/material"

interface ReferenceTablesPageProps {
  showSidebarToggle?: boolean
  onToggleSidebar?: () => void
}

export function ReferenceTablesPage({ showSidebarToggle = false, onToggleSidebar }: ReferenceTablesPageProps) {
  return (
    <PageTemplate
      icon={<Table style={{ width: 20, height: 20, color: "white" }} />}
      title="Reference tables"
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
          variant="h5"
          sx={{
            fontSize: "1.125rem",
            fontWeight: 500,
            color: "#111827",
            mb: 1,
            letterSpacing: "0.0025em",
          }}
        >
          Coming Soon
        </Typography>
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
