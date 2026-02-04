import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "@vivaahealth/design-system/dist/index.css"
import { MuiThemeProvider } from "@/components/providers/mui-theme-provider"
import { AppLayout } from "@/components/layout/app-layout"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Flow Studio UI Prototype",
  description: "Product design prototyping environment for Notable Flow Studio",
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
