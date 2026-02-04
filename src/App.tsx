import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { muiTheme } from '@/lib/theme/mui-theme'
import { AppLayout } from '@/components/layout/app-layout'
import { PrototypeDevTools } from '@/components/devtools/prototype-devtools'

// Routes
import { FlowsPage } from '@/routes/flows/flows-page'
import { FlowDetailPage } from '@/routes/flows/flow-detail-page'
import { AgentsPage } from '@/routes/agents/agents-page'
import { PlaceholderPage } from '@/routes/placeholder-page'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={muiTheme}>
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
              
              {/* Integrate */}
              <Route path="/api-instances" element={<PlaceholderPage title="API Instances" />} />
              <Route path="/connections" element={<PlaceholderPage title="Connections" />} />
              
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
    </QueryClientProvider>
  )
}
