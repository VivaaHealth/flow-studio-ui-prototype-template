import type { ReactNode } from 'react'
import { useTheme } from '@mui/material/styles'
import { SideNavigation } from './side-navigation'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const theme = useTheme()
  
  return (
    <div className="flex h-screen" style={{ backgroundColor: theme.palette.background.default }}>
      <SideNavigation />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
