import { createTheme } from '@mui/material/styles'

// MUI theme configuration aligned with @vivaahealth/design-system
export const createMuiTheme = (backgroundWarm: boolean = true) => createTheme({
  palette: {
    primary: {
      main: '#002766',
      light: '#003A99',
      dark: '#001a4d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0061FF',
      light: '#dbeafe',
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    background: {
      default: backgroundWarm ? '#F6F4F4' : '#FBFBFC',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#fbbf24',
    },
    info: {
      main: '#0061FF',
    },
    success: {
      main: '#14b8a6',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    allVariants: {
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textRendering: 'optimizeLegibility',
    },
    h1: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0.0025em',
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0.0025em',
    },
    h3: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.0025em',
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.0025em',
    },
    h5: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.0025em',
    },
    h6: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.0025em',
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.0025em',
    },
    body2: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.0025em',
    },
    button: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.0025em',
    },
  },
  shape: {
    borderRadius: 4,
  },
  spacing: 4,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: 600,
          borderRadius: '4px',
          textTransform: 'none',
          boxShadow: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          verticalAlign: 'middle',
          transition: 'all 200ms ease-in-out',
          '& .MuiButton-startIcon': {
            marginLeft: 0,
            marginRight: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          '& .MuiButton-endIcon': {
            marginLeft: '8px',
            marginRight: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
          },
        },
        outlined: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#0061FF',
          '&:hover': {
            backgroundColor: '#0052D9',
          },
        },
        // Size specs: Small 24px, Medium 32px, Large 40px (padding + text line-height = height)
        sizeSmall: {
          minHeight: 24,
          maxHeight: 24,
          padding: '4px 8px',
          fontSize: '0.75rem',
          lineHeight: 1,
          '& .MuiButton-startIcon': {
            marginRight: '6px',
          },
          '& .MuiButton-endIcon': {
            marginLeft: '6px',
          },
        },
        sizeMedium: {
          minHeight: 32,
          maxHeight: 32,
          padding: '6px 8px',
          fontSize: '0.875rem',
          lineHeight: 1,
          '& .MuiButton-startIcon': {
            marginRight: '8px',
          },
          '& .MuiButton-endIcon': {
            marginLeft: '8px',
          },
        },
        sizeLarge: {
          minHeight: 40,
          maxHeight: 40,
          padding: '8px 8px',
          fontSize: '1rem',
          lineHeight: 1,
          '& .MuiButton-startIcon': {
            marginRight: '10px',
          },
          '& .MuiButton-endIcon': {
            marginLeft: '10px',
          },
        },
      },
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minHeight: 32,
          maxHeight: 32,
          width: 32,
          padding: '4px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            borderColor: '#d1d5db',
            '&:hover fieldset': {
              borderColor: '#9ca3af',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0061FF',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#e5e7eb',
        },
      },
    },
  },
})

// Default theme export for backwards compatibility
export const muiTheme = createMuiTheme(true)
