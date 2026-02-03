import type React from "react"
import { Button, type ButtonProps } from "@mui/material"

export interface NotableButtonProps extends Omit<ButtonProps, "variant" | "size"> {
  variant?: "primary" | "secondary" | "ghost" | "outline"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export function NotableButton({
  variant = "primary",
  size = "md",
  children,
  disabled,
  sx,
  ...props
}: NotableButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          bgcolor: "#0061FF",
          color: "white",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          "&:hover": {
            bgcolor: "#0052e6",
          },
        }
      case "secondary":
        return {
          bgcolor: "#f3f4f6",
          color: "#111827",
          border: "1px solid #e5e7eb",
          "&:hover": {
            bgcolor: "#e5e7eb",
          },
        }
      case "ghost":
        return {
          bgcolor: "transparent",
          color: "#374151",
          "&:hover": {
            bgcolor: "#f3f4f6",
            color: "#111827",
          },
        }
      case "outline":
        return {
          bgcolor: "transparent",
          color: "#374151",
          border: "1px solid #d1d5db",
          "&:hover": {
            bgcolor: "#f9fafb",
            color: "#111827",
          },
        }
      default:
        return {}
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return { px: 1.5, py: 0.75, fontSize: "0.875rem", fontWeight: 500 }
      case "md":
        return { px: 2, py: 1, fontSize: "0.875rem", fontWeight: 500 }
      case "lg":
        return { px: 3, py: 1.5, fontSize: "1rem", fontWeight: 500 }
      default:
        return {}
    }
  }

  return (
    <Button
      disabled={disabled}
      disableRipple={true}
      sx={{
        borderRadius: "4px", // Updated border radius from 6px to 4px for consistent theming
        textTransform: "none",
        transition: "all 200ms ease-in-out",
        gap: 1,
        "&:focus": {
          outline: "2px solid #0061FF",
          outlineOffset: "2px",
        },
        "&:disabled": {
          opacity: 0.5,
          cursor: "not-allowed",
        },
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  )
}
