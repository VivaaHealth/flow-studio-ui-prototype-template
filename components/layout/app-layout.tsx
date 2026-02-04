"use client"

import type React from "react"

import { SideNavigation } from "./side-navigation"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-white">
      <SideNavigation />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
