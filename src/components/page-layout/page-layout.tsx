import { ReactNode } from 'react'
import { Box as MuiBox } from '@mui/material'
import { ActionBar, ActionBarProps } from '@/components/action-bar/action-bar'

export interface PageLayoutProps {
  /**
   * Breadcrumbs for the action bar
   */
  breadcrumbs?: ActionBarProps['breadcrumbs']
  /**
   * Actions for the action bar
   */
  actions?: ActionBarProps['actions']
  /**
   * Title for the action bar (used when breadcrumbs are not provided)
   */
  title?: ActionBarProps['title']
  /**
   * Children to render in the scrollable content area
   */
  children: ReactNode
  /**
   * Whether to show padding in the content area
   * @default true
   */
  contentPadding?: boolean
}

/**
 * A reusable page layout component that provides consistent structure:
 * - Sticky action bar with breadcrumbs/actions
 * - Scrollable content area
 * - Proper spacing and overflow handling
 */
export function PageLayout({
  breadcrumbs,
  actions,
  title,
  children,
  contentPadding = true,
}: PageLayoutProps) {
  return (
    <MuiBox
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <ActionBar breadcrumbs={breadcrumbs} actions={actions} title={title} />

      <MuiBox
        sx={{
          flex: 1,
          width: '100%',
          overflowY: 'auto',
          scrollbarGutter: 'stable',
          ...(contentPadding && { p: 6 }),
        }}
      >
        {children}
      </MuiBox>
    </MuiBox>
  )
}
