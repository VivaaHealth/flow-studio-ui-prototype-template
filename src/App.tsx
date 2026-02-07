import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { usePrototypeStore } from '@/lib/stores'
import { createMuiTheme } from '@/lib/theme/mui-theme'
import { AppLayout } from '@/components/layout/app-layout'
import { PrototypeDevTools } from '@/components/devtools/prototype-devtools'

// Routes
import { FlowsPage } from '@/routes/flows/flows-page'
import { FlowDetailPage } from '@/routes/flows/flow-detail-page'
import { AgentsPage } from '@/routes/agents/agents-page'
import { ConnectorsPage } from '@/routes/connectors/connectors-page'
import { ConnectorDetailPage } from '@/routes/connectors/connector-detail-page'
import { ConnectorTemplatesPage } from '@/routes/connectors/connector-templates-page'
import { PlaceholderPage } from '@/routes/placeholder-page'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

function ThemedApp() {
  const backgroundWarm = usePrototypeStore((state) => state.featureFlags.backgroundWarm)
  const theme = createMuiTheme(backgroundWarm)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Redirect root to /flows */}
            <Route path="/" element={<Navigate to="/flows" replace />} />
            
            {/* Build */}
            <Route path="/flows" element={<FlowsPage />} />
            <Route path="/flows/:id" element={<FlowDetailPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/assistants" element={<PlaceholderPage title="Assistants" />} />
            <Route path="/knowledge-bases" element={<PlaceholderPage title="Knowledge Bases" />} />
            <Route path="/reference-tables" element={<PlaceholderPage title="Reference Tables" />} />
            
            {/* Analyze */}
            <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
            <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
            
            {/* Operate */}
            <Route path="/runs" element={<PlaceholderPage title="Runs" />} />
            <Route path="/messages" element={<PlaceholderPage title="Messages" />} />
            <Route path="/sms-tasks" element={<PlaceholderPage title="SMS Tasks" />} />
            
            {/* Connect */}
            <Route path="/connections" element={<ConnectorsPage />} />
            <Route path="/connections/templates" element={<ConnectorTemplatesPage />} />
            <Route path="/feeds" element={<PlaceholderPage title="Feeds" />} />
            <Route path="/triggers" element={<PlaceholderPage title="Triggers" />} />
            <Route path="/ehr-systems" element={<PlaceholderPage title="EHR Systems" />} />
            <Route path="/connections/:id" element={<ConnectorDetailPage />} />
            
            {/* Manage */}
            <Route path="/users" element={<PlaceholderPage title="Users" />} />
            <Route path="/permission-groups" element={<PlaceholderPage title="Permission Groups" />} />
            <Route path="/practices" element={<PlaceholderPage title="Practices" />} />
            <Route path="/providers" element={<PlaceholderPage title="Providers" />} />
            
            {/* Templates */}
            <Route path="/flow-templates" element={<PlaceholderPage title="Flow Templates" />} />
            <Route path="/documents" element={<PlaceholderPage title="Documents" />} />
            <Route path="/notes" element={<PlaceholderPage title="Notes" />} />
            
            {/* Mappings */}
            <Route path="/code-mappings" element={<PlaceholderPage title="Code Mappings" />} />
            <Route path="/field-mappings" element={<PlaceholderPage title="Field Mappings" />} />
            
            {/* Tools */}
            <Route path="/flow-tester" element={<PlaceholderPage title="Flow Tester" />} />
            <Route path="/document-upload" element={<PlaceholderPage title="Document Upload" />} />
            
            {/* 404 */}
            <Route path="*" element={<PlaceholderPage title="404 - Not Found" />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
      <PrototypeDevTools />
    </ThemeProvider>
  )
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemedApp />
    </QueryClientProvider>
  )
}
