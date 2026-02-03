import { PageTemplate } from "@/components/ui/page-template"
import {
  CalendarBlank,
  ChartBar,
  Headset,
  FlowArrow,
  Play,
  Database,
  WaveTriangle,
  Table,
  CheckSquare,
  Tag,
  Robot,
  FileText,
  Bell,
  Article,
  Link,
  ThumbsUp,
  Note,
  ChatCircle,
  Phone,
  Chat,
  Hospital,
  Code,
  Wrench,
} from "@phosphor-icons/react"
import { Box, Typography } from "@mui/material"
import type { ReactElement } from "react"

interface PlaceholderPageProps {
  title: string
  description?: string
  showSidebarToggle?: boolean
  onToggleSidebar?: () => void
}

function getPageIcon(title: string): ReactElement {
  const iconMap: Record<string, ReactElement> = {
    Appointments: <CalendarBlank style={{ width: 20, height: 20, color: "white" }} />,
    Reports: <ChartBar style={{ width: 20, height: 20, color: "white" }} />,
    "Web assistant": <Headset style={{ width: 20, height: 20, color: "white" }} />,
    Flows: <FlowArrow style={{ width: 20, height: 20, color: "white" }} />,
    Runs: <Play style={{ width: 20, height: 20, color: "white" }} />,
    "Knowledge base": <Database style={{ width: 20, height: 20, color: "white" }} />,
    Signals: <WaveTriangle style={{ width: 20, height: 20, color: "white" }} />,
    "Reference tables": <Table style={{ width: 20, height: 20, color: "white" }} />,
    Tasks: <CheckSquare style={{ width: 20, height: 20, color: "white" }} />,
    "Task categories": <Tag style={{ width: 20, height: 20, color: "white" }} />,
    Scenarios: <Robot style={{ width: 20, height: 20, color: "white" }} />,
    Feeds: <FileText style={{ width: 20, height: 20, color: "white" }} />,
    "Flow tester": <Play style={{ width: 20, height: 20, color: "white" }} />,
    Notifications: <Bell style={{ width: 20, height: 20, color: "white" }} />,
    Forms: <Article style={{ width: 20, height: 20, color: "white" }} />,
    "Document templates": <FileText style={{ width: 20, height: 20, color: "white" }} />,
    "Previsit links": <Link style={{ width: 20, height: 20, color: "white" }} />,
    Recommendations: <ThumbsUp style={{ width: 20, height: 20, color: "white" }} />,
    "Note templates": <Note style={{ width: 20, height: 20, color: "white" }} />,
    Messages: <ChatCircle style={{ width: 20, height: 20, color: "white" }} />,
    Templates: <FileText style={{ width: 20, height: 20, color: "white" }} />,
    "Voice calls": <Phone style={{ width: 20, height: 20, color: "white" }} />,
    "Conversation templates": <Chat style={{ width: 20, height: 20, color: "white" }} />,
    "EHR instances": <Hospital style={{ width: 20, height: 20, color: "white" }} />,
    "API instances": <Code style={{ width: 20, height: 20, color: "white" }} />,
    "Practice config EHR": <Wrench style={{ width: 20, height: 20, color: "white" }} />,
    "Practice config API": <Wrench style={{ width: 20, height: 20, color: "white" }} />,
    "Practice configs": <Wrench style={{ width: 20, height: 20, color: "white" }} />,
    "Job configs": <Wrench style={{ width: 20, height: 20, color: "white" }} />,
    "Appointment kinds": <CalendarBlank style={{ width: 20, height: 20, color: "white" }} />,
    "EHR systems": <Hospital style={{ width: 20, height: 20, color: "white" }} />,
    "Admin tools": <Wrench style={{ width: 20, height: 20, color: "white" }} />,
  }

  return iconMap[title] || <FileText style={{ width: 20, height: 20, color: "white" }} />
}

export function PlaceholderPage({
  title,
  description,
  showSidebarToggle = false,
  onToggleSidebar,
}: PlaceholderPageProps) {
  return (
    <PageTemplate
      icon={getPageIcon(title)}
      title={title}
      showSidebarToggle={showSidebarToggle}
      onToggleSidebar={onToggleSidebar}
    >
      {description && (
        <Typography
          sx={{
            mb: 3,
            color: "#4b5563",
            fontSize: "1rem",
          }}
        >
          {description}
        </Typography>
      )}

      <Box
        sx={{
          backgroundColor: "white",
          border: "1px solid #D9D9D9",
          borderRadius: "4px",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontSize: "1.125rem",
            fontWeight: 400,
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
            fontWeight: 400,
            letterSpacing: "0.0025em",
          }}
        >
          This page is under development.
        </Typography>
      </Box>
    </PageTemplate>
  )
}
