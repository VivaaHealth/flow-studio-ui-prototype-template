import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded border px-1 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-[#e2e8f0] bg-[#f1f5f9] text-[#475569]", // Gray variant to match NotableTag
        primary: "border-[#bfdbfe] bg-[#dbeafe] text-[#1e40af]", // Blue variant to match NotableTag
        working: "border-[#e2e8f0] bg-[#f1f5f9] text-[#475569]", // Same as default
        success: "border-[#bbf7d0] bg-[#dcfce7] text-[#166534]", // Green variant
        destructive: "border-[#fecaca] bg-[#fee2e2] text-[#991b1b]", // Red variant
        warning: "border-[#fde68a] bg-[#fef3c7] text-[#92400e]", // Yellow variant
        outline: "text-foreground border-border",
        blue: "border-[#66A0FF] bg-[#CCDFFF] text-[#003A99]", // Blue-30, Blue-90, Blue-70
        teal: "border-[#84E8EB] bg-[#C5F7F8] text-[#0F7A7A]", // Darkened teal text color for better contrast
        purple: "border-[#B38CFB] bg-[#E3D5FD] text-[#7C3CF5]", // Purple-30, Purple-90, Purple-70
        cyan: "border-[#78C3F5] bg-[#CAE8FC] text-[#0B6BA8]", // Darkened cyan text color for better contrast
        magenta: "border-[#F886AF] bg-[#FBCEDE] text-[#EE2A71]", // Magenta-30, Magenta-90, Magenta-70
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
