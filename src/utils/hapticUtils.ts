// Haptic feedback utility for mobile devices

export const HapticStyle = {
  LIGHT: 'light',
  MEDIUM: 'medium',
  HEAVY: 'heavy',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
} as const

export type HapticStyle = typeof HapticStyle[keyof typeof HapticStyle]

class HapticManager {
  private canVibrate: boolean

  constructor() {
    this.canVibrate = 'vibrate' in navigator
  }

  /**
   * Trigger haptic feedback with specified style
   */
  feedback(style: HapticStyle = HapticStyle.MEDIUM): void {
    if (!this.canVibrate) return

    switch (style) {
      case HapticStyle.LIGHT:
        navigator.vibrate(10)
        break
      case HapticStyle.MEDIUM:
        navigator.vibrate(20)
        break
      case HapticStyle.HEAVY:
        navigator.vibrate(30)
        break
      case HapticStyle.SUCCESS:
        // Double tap pattern for success
        navigator.vibrate([10, 50, 10])
        break
      case HapticStyle.WARNING:
        // Triple short tap for warning
        navigator.vibrate([10, 30, 10, 30, 10])
        break
      case HapticStyle.ERROR:
        // Long vibration for error
        navigator.vibrate(50)
        break
    }
  }

  /**
   * Trigger a light tap for button presses
   */
  buttonTap(): void {
    this.feedback(HapticStyle.LIGHT)
  }

  /**
   * Trigger feedback for selection changes
   */
  selectionChange(): void {
    this.feedback(HapticStyle.LIGHT)
  }

  /**
   * Trigger feedback for successful actions
   */
  success(): void {
    this.feedback(HapticStyle.SUCCESS)
  }

  /**
   * Trigger feedback for errors
   */
  error(): void {
    this.feedback(HapticStyle.ERROR)
  }

  /**
   * Check if haptic feedback is available
   */
  isAvailable(): boolean {
    return this.canVibrate
  }
}

// Export singleton instance
export const haptic = new HapticManager()

// React hook for haptic feedback
import { useCallback } from 'react'

export function useHaptic() {
  const triggerHaptic = useCallback((style?: HapticStyle) => {
    haptic.feedback(style)
  }, [])

  const buttonTap = useCallback(() => {
    haptic.buttonTap()
  }, [])

  return {
    triggerHaptic,
    buttonTap,
    isAvailable: haptic.isAvailable()
  }
}