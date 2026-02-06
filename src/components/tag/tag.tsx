import { Chip, ChipProps } from '@mui/material'
import { forwardRef } from 'react'

// ============================================================================
// Tag Colors
// ============================================================================

export const TAG_COLORS = {
  success: { bg: '#E6F7ED', text: '#1A3B22', border: '#A3D9B1' }, // Connected style
  warning: { bg: '#FFF4CC', text: '#6B4C00', border: '#FFDA66' }, // Warning style
  error: { bg: '#FFD4D4', text: '#A30000', border: '#FF9999' }, // Error style
  primary: { bg: '#E6F0FF', text: '#113264', border: '#BBD7FF' }, // Primary/Provisional style
  info: { bg: '#E6F0FF', text: '#113264', border: '#BBD7FF' }, // Provisional style
  default: { bg: '#F5F5F5', text: '#333333', border: '#D0D0D0' }, // Test style
} as const

export type TagVariant = keyof typeof TAG_COLORS

// ============================================================================
// Tag Component
// ============================================================================

export interface TagProps extends Omit<ChipProps, 'color' | 'variant'> {
  /**
   * The variant/color scheme of the tag
   * @default 'default'
   */
  variant?: TagVariant
}

/**
 * A reusable Tag component that follows the product's design system.
 * Built on top of MUI Chip with consistent styling, colors, and spacing.
 */
export const Tag = forwardRef<HTMLDivElement, TagProps>(
  ({ variant = 'default', sx, ...props }, ref) => {
    const colors = TAG_COLORS[variant]

    return (
      <Chip
        ref={ref}
        {...props}
        sx={{
          bgcolor: colors.bg,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          borderRadius: '4px',
          fontSize: '0.75rem',
          height: 'auto',
          minHeight: 'auto',
          minWidth: 'max-content',
          padding: '0 4px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          '& .MuiChip-label': {
            padding: 0,
            paddingLeft: 0,
            paddingRight: 0,
            whiteSpace: 'nowrap',
          },
          ...sx,
        }}
      />
    )
  }
)

Tag.displayName = 'Tag'
