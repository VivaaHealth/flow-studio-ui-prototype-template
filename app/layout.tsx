import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MuiThemeProvider } from "@/components/providers/mui-theme-provider"
import { AppLayout } from "@/components/layout/app-layout"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Notable Flow Store",
  description: "Healthcare automation flows marketplace",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MuiThemeProvider>
          <AppLayout>{children}</AppLayout>
        </MuiThemeProvider>
      </body>
    </html>
  )
}
