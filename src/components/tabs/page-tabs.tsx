import { useState, useEffect, useRef } from 'react'
import { Box, Tabs, Tab, Badge } from '@mui/material'

export interface TabItem {
  id: string
  label: string
  badge?: number | string
}

export interface PageTabsProps {
  tabs: TabItem[]
  value: string
  onChange: (value: string) => void
}

export function PageTabs({ tabs, value, onChange }: PageTabsProps) {
  const [isSticky, setIsSticky] = useState(false)
  const tabsRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Find the scrollable parent container
    const findScrollContainer = (element: HTMLElement | null): HTMLElement | null => {
      if (!element) return null
      const parent = element.parentElement
      if (!parent) return null
      
      const style = window.getComputedStyle(parent)
      if (style.overflowY === 'auto' || style.overflowY === 'scroll' || style.overflowY === 'overlay') {
        return parent
      }
      
      return findScrollContainer(parent)
    }

    scrollContainerRef.current = findScrollContainer(tabsRef.current)

    const handleScroll = () => {
      if (!tabsRef.current || !scrollContainerRef.current) return

      const tabsRect = tabsRef.current.getBoundingClientRect()
      const containerRect = scrollContainerRef.current.getBoundingClientRect()
      
      // Check if tabs are stuck (their top position matches the sticky top value)
      // When sticky, the tabs' top will be at the container's top
      const isCurrentlySticky = tabsRect.top <= containerRect.top + 1
      setIsSticky(isCurrentlySticky)
    }

    const scrollContainer = scrollContainerRef.current || window
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    
    // Check initial state
    handleScroll()

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Box 
      ref={tabsRef}
      sx={{ 
        position: 'sticky',
        top: 0,
        zIndex: 9,
        bgcolor: 'transparent',
        paddingLeft: 6,
        paddingRight: '20px',
        transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: 'none',
        overflow: 'visible',
        ...(isSticky && {
          bgcolor: 'white',
          boxShadow: '0px 12px 8px 0px rgba(37, 39, 82, 0.02)',
        }),
      }}
    >
      <Tabs
        value={value}
        onChange={(_, newValue) => onChange(newValue as string)}
        sx={{
          borderBottom: 1,
          borderColor: '#D9D9D9',
          overflow: 'visible',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            color: '#737373',
            minHeight: 48,
            minWidth: 0,
            paddingLeft: 0,
            paddingRight: 0,
            marginRight: '16px',
            overflow: 'visible',
            '&:last-child': {
              marginRight: 0,
            },
            '&.Mui-selected': {
              color: '#001333',
            },
            '&:hover': {
              color: '#001333',
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#001333',
            height: '2px',
            borderTopLeftRadius: '2px',
            borderTopRightRadius: '2px',
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={
              tab.badge !== undefined ? (
                <Badge 
                  badgeContent={tab.badge} 
                  color="error" 
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  sx={{ 
                    '& .MuiBadge-badge': { 
                      fontSize: '0.75rem', 
                      minWidth: '18px', 
                      height: '18px',
                      top: '-4px',
                      right: '-8px',
                    } 
                  }}
                >
                  {tab.label}
                </Badge>
              ) : (
                tab.label
              )
            }
            value={tab.id}
          />
        ))}
      </Tabs>
    </Box>
  )
}
