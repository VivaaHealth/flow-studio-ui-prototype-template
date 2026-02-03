"use client"

import type React from "react"

import { SideNavigation } from "./side-navigation"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <SideNavigation />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
