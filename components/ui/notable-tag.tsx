"use client"

import type React from "react"
import { theme } from "@/lib/theme"
import { cn } from "@/lib/utils"

export interface NotableTagProps {
  variant?: "default" | "active" | "outline" | "success" | "warning" | "destructive" | "working"
  size?: "sm" | "md"
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const tagVariants = {
  default: `bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]`, // Gray variant
  active: `bg-[#dbeafe] text-[#1e40af] border border-[#bfdbfe]`, // Blue variant
  outline: `bg-transparent border border-[${theme.colors.gray[300]}] text-[${theme.colors.gray[700]}] hover:bg-[${theme.colors.gray[50]}]`,
  success: `bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]`, // Green variant
  warning: `bg-[#fef3c7] text-[#92400e] border border-[#fde68a]`, // Yellow variant
  destructive: `bg-[#fee2e2] text-[#991b1b] border border-[#fecaca]`, // Pink/Red variant
  working: `bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]`,
}

const tagSizes = {
  sm: "px-1 py-0.5 text-xs font-bold", // 4px left/right, 2px top/bottom
  md: "px-1 py-0.5 text-sm font-bold", // 4px left/right, 2px top/bottom
}

export function NotableTag({ variant = "default", size = "md", children, onClick, className }: NotableTagProps) {
  const Component = onClick ? "button" : "span"

  return (
    <Component
      onClick={onClick}
      className={cn(
        `inline-flex items-center justify-center rounded transition-all duration-200 flex-shrink-0`,
        // Variant styles
        tagVariants[variant],
        // Size styles
        tagSizes[size],
        // Interactive styles if clickable
        onClick && "cursor-pointer hover:opacity-80",
        className,
      )}
    >
      {children}
    </Component>
  )
}
