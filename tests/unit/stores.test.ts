import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '@/lib/stores/ui-store'
import { usePrototypeStore } from '@/lib/stores/prototype-store'

describe('useUIStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUIStore.setState({
      sidebarMode: 'fixed',
      sidebarHovering: false,
      expandedSections: ['Build'],
      activeModal: null,
      modalData: {},
      toasts: [],
    })
  })

  it('should toggle sidebar mode', () => {
    const { setSidebarMode } = useUIStore.getState()
    
    setSidebarMode('overlay')
    expect(useUIStore.getState().sidebarMode).toBe('overlay')
    
    setSidebarMode('fixed')
    expect(useUIStore.getState().sidebarMode).toBe('fixed')
  })

  it('should toggle section expansion', () => {
    const { toggleSection } = useUIStore.getState()
    
    // Build is initially expanded
    expect(useUIStore.getState().expandedSections).toContain('Build')
    
    // Toggle it closed
    toggleSection('Build')
    expect(useUIStore.getState().expandedSections).not.toContain('Build')
    
    // Toggle it open again
    toggleSection('Build')
    expect(useUIStore.getState().expandedSections).toContain('Build')
  })

  it('should manage modals', () => {
    const { openModal, closeModal } = useUIStore.getState()
    
    openModal('test-modal', { foo: 'bar' })
    expect(useUIStore.getState().activeModal).toBe('test-modal')
    expect(useUIStore.getState().modalData).toEqual({ foo: 'bar' })
    
    closeModal()
    expect(useUIStore.getState().activeModal).toBeNull()
    expect(useUIStore.getState().modalData).toEqual({})
  })
})

describe('usePrototypeStore', () => {
  beforeEach(() => {
    usePrototypeStore.getState().resetAll()
  })

  it('should have default values', () => {
    const state = usePrototypeStore.getState()
    expect(state.scenario).toBe('demo')
    expect(state.featureFlags.showDevTools).toBe(true)
    expect(state.currentUserId).toBe('user-001')
  })

  it('should change scenario', () => {
    const { setScenario } = usePrototypeStore.getState()
    
    setScenario('empty')
    expect(usePrototypeStore.getState().scenario).toBe('empty')
    
    setScenario('stress')
    expect(usePrototypeStore.getState().scenario).toBe('stress')
  })

  it('should toggle feature flags', () => {
    const { toggleFeatureFlag } = usePrototypeStore.getState()
    
    expect(usePrototypeStore.getState().featureFlags.enableAnimations).toBe(true)
    
    toggleFeatureFlag('enableAnimations')
    expect(usePrototypeStore.getState().featureFlags.enableAnimations).toBe(false)
  })
})
