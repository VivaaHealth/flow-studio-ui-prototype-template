import type { ReactNode } from 'react'
import { SideNavigation } from './side-navigation'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-white">
      <SideNavigation />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
