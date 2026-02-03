import { createTheme } from "@mui/material/styles"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#002766", // Notable primary color
      light: "#003A99", // Notable secondary color
      dark: "#001a4d",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#2563eb",
      light: "#dbeafe",
      dark: "#1e40af",
      contrastText: "#ffffff",
    },
    grey: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
    error: {
      main: "#ef4444",
    },
    warning: {
      main: "#fbbf24",
    },
    info: {
      main: "#2563eb",
    },
    success: {
      main: "#14b8a6",
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
    fontSize: 14,
    h1: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "0.0025em",
    },
    h2: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "0.0025em",
    },
    h3: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "0.0025em",
    },
    h4: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "0.0025em",
    },
    h5: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "0.0025em",
    },
    h6: {
      fontSize: "0.75rem",
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: "0.0025em",
    },
    body1: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "0.0025em",
    },
    body2: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "0.0025em",
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      textTransform: "none",
      letterSpacing: "0.0025em",
    },
  },
  shape: {
    borderRadius: 4,
  },
  spacing: 4, // Base spacing unit (4px)
  shadows: [
    "none",
    "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    "0 2px 8px 0 rgb(0 0 0 / 0.08)", // actionBar shadow
    "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          textTransform: "none",
          fontWeight: 500,
          transition: "all 200ms ease-in-out",
        },
        containedPrimary: {
          backgroundColor: "#002766",
          "&:hover": {
            backgroundColor: "#001a4d",
          },
        },
      },
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "4px",
            borderColor: "#d1d5db",
            "&:hover fieldset": {
              borderColor: "#9ca3af",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#002766",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
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
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "1px solid #e5e7eb",
          borderRadius: "4px",
          "& .MuiDataGrid-cell": {
            borderColor: "#f3f4f6",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f9fafb",
            borderColor: "#e5e7eb",
          },
          "& .MuiDataGrid-footerContainer": {
            borderColor: "#e5e7eb",
          },
        },
      },
    },
  },
})
