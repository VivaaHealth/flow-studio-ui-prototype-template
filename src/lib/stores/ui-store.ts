import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// ============================================================================
// Types
// ============================================================================

export type SideNavigationMode = 'fixed' | 'overlay'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

interface UIState {
  // Sidebar
  sidebarMode: SideNavigationMode
  sidebarHovering: boolean
  expandedSections: string[]
  
  // Modals
  activeModal: string | null
  modalData: Record<string, unknown>
  
  // Toasts
  toasts: Toast[]
  
  // Actions
  setSidebarMode: (mode: SideNavigationMode) => void
  setSidebarHovering: (hovering: boolean) => void
  toggleSection: (section: string) => void
  setExpandedSection: (section: string | null) => void
  openModal: (id: string, data?: Record<string, unknown>) => void
  closeModal: () => void
  showToast: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
}

// ============================================================================
// Store
// ============================================================================

export const useUIStore = create<UIState>()(
  persist(
    immer((set) => ({
      // Initial state
      sidebarMode: 'fixed',
      sidebarHovering: false,
      expandedSections: ['Build'], // Default expanded
      activeModal: null,
      modalData: {},
      toasts: [],

      // Sidebar actions
      setSidebarMode: (mode) =>
        set((state) => {
          state.sidebarMode = mode
          if (mode === 'overlay') {
            state.sidebarHovering = false
          }
        }),

      setSidebarHovering: (hovering) =>
        set((state) => {
          state.sidebarHovering = hovering
        }),

      toggleSection: (section) =>
        set((state) => {
          const index = state.expandedSections.indexOf(section)
          if (index >= 0) {
            state.expandedSections.splice(index, 1)
          } else {
            state.expandedSections.push(section)
          }
        }),

      setExpandedSection: (section) =>
        set((state) => {
          if (section === null) {
            state.expandedSections = []
          } else {
            state.expandedSections = [section]
          }
        }),

      // Modal actions
      openModal: (id, data = {}) =>
        set((state) => {
          state.activeModal = id
          state.modalData = data
        }),

      closeModal: () =>
        set((state) => {
          state.activeModal = null
          state.modalData = {}
        }),

      // Toast actions
      showToast: (toast) =>
        set((state) => {
          const id = crypto.randomUUID()
          state.toasts.push({ ...toast, id })
          
          // Auto-dismiss after duration (default 5s)
          const duration = toast.duration ?? 5000
          setTimeout(() => {
            set((s) => {
              s.toasts = s.toasts.filter((t) => t.id !== id)
            })
          }, duration)
        }),

      dismissToast: (id) =>
        set((state) => {
          state.toasts = state.toasts.filter((t) => t.id !== id)
        }),
    })),
    {
      name: 'ui-store',
      partialize: (state) => ({
        sidebarMode: state.sidebarMode,
        expandedSections: state.expandedSections,
      }),
    }
  )
)

// ============================================================================
// Selectors
// ============================================================================

export const selectIsSidebarExpanded = (state: UIState) =>
  state.sidebarMode === 'fixed' || state.sidebarHovering
