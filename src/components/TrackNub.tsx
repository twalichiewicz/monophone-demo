import React, { useState, useRef, useEffect, useCallback } from 'react'
import './TrackNub.css'
import { clickSoundManager } from '../utils/audioUtils'

interface TrackNubProps {
  onDirectionInput: (direction: { x: number; y: number }, isDelta?: boolean) => void
  onClick: () => void
  onFlip?: () => void
  onLongPress?: () => void
}

// Navigation modes
type NavMode = 'idle' | 'swipe' | 'cursor' | 'longpress'

const NavModes = {
  IDLE: 'idle' as NavMode,
  SWIPE: 'swipe' as NavMode,
  CURSOR: 'cursor' as NavMode,
  LONG_PRESS: 'longpress' as NavMode
}

// Gesture thresholds
const SWIPE_THRESHOLD = 15 // pixels to trigger swipe
const HOLD_DURATION = 150 // ms to enter cursor mode
const LONG_PRESS_DURATION = 3000 // ms for long press
const VISUAL_MAX_DISTANCE = 25 // max visual displacement
const CURSOR_SENSITIVITY = 0.5 // cursor movement sensitivity

const TrackNub: React.FC<TrackNubProps> = ({ 
  onDirectionInput, 
  onClick, 
  onLongPress 
}) => {
  // State
  const [mode, setMode] = useState<NavMode>(NavModes.IDLE)
  const [visualPosition, setVisualPosition] = useState({ x: 0, y: 0 })
  const [isPressed, setIsPressed] = useState(false)
  
  // Refs for gesture tracking
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 })
  const currentTouchRef = useRef({ x: 0, y: 0 })
  const hasMovedRef = useRef(false)
  const hasFiredSwipeRef = useRef(false)
  
  // Timer refs
  const holdTimerRef = useRef<number | undefined>(undefined)
  const longPressTimerRef = useRef<number | undefined>(undefined)
  
  // Container ref
  const nubRef = useRef<HTMLDivElement>(null)

  // Haptic feedback
  const triggerHaptic = useCallback((style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if ('vibrate' in navigator) {
      const duration = style === 'light' ? 10 : style === 'medium' ? 20 : 30
      navigator.vibrate(duration)
    }
  }, [])

  // Calculate movement delta
  const getDelta = useCallback(() => {
    return {
      x: currentTouchRef.current.x - touchStartRef.current.x,
      y: currentTouchRef.current.y - touchStartRef.current.y
    }
  }, [])

  // Calculate distance from start
  const getDistance = useCallback(() => {
    const delta = getDelta()
    return Math.sqrt(delta.x * delta.x + delta.y * delta.y)
  }, [getDelta])

  // Update visual position
  const updateVisualPosition = useCallback((deltaX: number, deltaY: number) => {
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    let visualX = deltaX
    let visualY = deltaY
    
    // Clamp to max distance
    if (distance > VISUAL_MAX_DISTANCE) {
      const scale = VISUAL_MAX_DISTANCE / distance
      visualX *= scale
      visualY *= scale
    }
    
    setVisualPosition({ x: visualX, y: visualY })
  }, [])

  // Handle swipe detection
  const checkSwipe = useCallback(() => {
    if (mode !== NavModes.IDLE || hasFiredSwipeRef.current) return
    
    const delta = getDelta()
    const distance = getDistance()
    
    if (distance >= SWIPE_THRESHOLD) {
      // Calculate swipe direction
      const angle = Math.atan2(delta.y, delta.x)
      let dirX = 0
      let dirY = 0
      
      if (angle >= -Math.PI/4 && angle < Math.PI/4) {
        dirX = 1 // Right
      } else if (angle >= Math.PI/4 && angle < 3*Math.PI/4) {
        dirY = 1 // Down  
      } else if (angle >= -3*Math.PI/4 && angle < -Math.PI/4) {
        dirY = -1 // Up
      } else {
        dirX = -1 // Left
      }
      
      // Fire swipe event
      onDirectionInput({ x: dirX, y: dirY }, false)
      setMode(NavModes.SWIPE)
      hasFiredSwipeRef.current = true
      triggerHaptic('medium')
      
      // Cancel hold timer
      if (holdTimerRef.current !== undefined) {
        clearTimeout(holdTimerRef.current)
        holdTimerRef.current = undefined
      }
    }
  }, [mode, getDelta, getDistance, onDirectionInput, triggerHaptic])

  // Handle cursor mode
  const updateCursor = useCallback(() => {
    if (mode !== NavModes.CURSOR) return
    
    const delta = getDelta()
    onDirectionInput({ 
      x: delta.x * CURSOR_SENSITIVITY, 
      y: delta.y * CURSOR_SENSITIVITY 
    }, true)
  }, [mode, getDelta, onDirectionInput])

  // Start hold timer
  const startHoldTimer = useCallback(() => {
    if (holdTimerRef.current !== undefined) {
      clearTimeout(holdTimerRef.current)
    }
    
    holdTimerRef.current = window.setTimeout(() => {
      if (mode === NavModes.IDLE && !hasFiredSwipeRef.current) {
        setMode(NavModes.CURSOR)
        triggerHaptic('light')
        // Send initial cursor position to show cursor
        onDirectionInput({ x: 0, y: 0 }, true)
      }
    }, HOLD_DURATION)
  }, [mode, triggerHaptic, onDirectionInput])

  // Start long press timer
  const startLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current !== undefined) {
      clearTimeout(longPressTimerRef.current)
    }
    
    longPressTimerRef.current = window.setTimeout(() => {
      if (mode === NavModes.IDLE && !hasMovedRef.current) {
        setMode(NavModes.LONG_PRESS)
        triggerHaptic('heavy')
        if (onLongPress) onLongPress()
      }
    }, LONG_PRESS_DURATION)
  }, [mode, triggerHaptic, onLongPress])

  // Handle touch/mouse start
  const handleStart = useCallback((x: number, y: number) => {
    // Reset state
    setMode(NavModes.IDLE)
    setIsPressed(true)
    hasMovedRef.current = false
    hasFiredSwipeRef.current = false
    
    // Record start position and time
    touchStartRef.current = { x, y, time: Date.now() }
    currentTouchRef.current = { x, y }
    
    // Start timers
    startHoldTimer()
    startLongPressTimer()
    
    // Haptic feedback
    triggerHaptic('light')
    
    // Record press for sound
    clickSoundManager.init()
  }, [startHoldTimer, startLongPressTimer, triggerHaptic])

  // Handle touch/mouse move
  const handleMove = useCallback((x: number, y: number) => {
    if (!isPressed) return
    
    currentTouchRef.current = { x, y }
    const delta = getDelta()
    const distance = getDistance()
    
    // Mark as moved if threshold exceeded
    if (distance > 5) {
      hasMovedRef.current = true
      
      // Cancel long press
      if (longPressTimerRef.current !== undefined) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = undefined
      }
    }
    
    // Update visual position
    updateVisualPosition(delta.x, delta.y)
    
    // Handle based on mode
    switch (mode) {
      case NavModes.IDLE:
        checkSwipe()
        break
      case NavModes.CURSOR:
        updateCursor()
        break
    }
  }, [isPressed, mode, getDelta, getDistance, updateVisualPosition, checkSwipe, updateCursor])

  // Handle touch/mouse end
  const handleEnd = useCallback(() => {
    if (!isPressed) return
    
    // Clear timers
    if (holdTimerRef.current !== undefined) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = undefined
    }
    if (longPressTimerRef.current !== undefined) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = undefined
    }
    
    // Play sound for quick taps
    const duration = Date.now() - touchStartRef.current.time
    if (duration < 500 && !hasMovedRef.current) {
      clickSoundManager.playClick()
    }
    
    // Handle click
    if (mode === NavModes.IDLE && !hasMovedRef.current) {
      triggerHaptic('heavy')
      onClick()
    }
    
    // Reset state
    setMode(NavModes.IDLE)
    setIsPressed(false)
    setVisualPosition({ x: 0, y: 0 })
    hasMovedRef.current = false
    hasFiredSwipeRef.current = false
  }, [isPressed, mode, onClick, triggerHaptic])

  // Mouse event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }, [handleStart])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX, e.clientY)
  }, [handleMove])

  const handleMouseUp = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }, [handleStart])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleMove(touch.clientX, touch.clientY)
  }, [handleMove])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    handleEnd()
  }, [handleEnd])

  // Setup global mouse listeners
  useEffect(() => {
    if (isPressed) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isPressed, handleMouseMove, handleMouseUp])

  // Initialize sound on mount
  useEffect(() => {
    clickSoundManager.init()
  }, [])

  return (
    <div 
      className={`track-nub-container ${isPressed ? 'active' : ''} ${mode === NavModes.LONG_PRESS ? 'long-press' : ''}`}
      onMouseDown={'ontouchstart' in window ? undefined : handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="trackpad-surface">
        <div className="texture-layer"></div>
      </div>
      <div className="click-zones">
        <div className="click-zone"></div>
        <div className="click-zone"></div>
        <div className="click-zone"></div>
        <div className="click-zone"></div>
      </div>
      <div 
        ref={nubRef}
        className={`track-nub ${isPressed ? 'pressed' : ''}`}
        style={{
          transform: `translate(${visualPosition.x}px, ${visualPosition.y}px) ${isPressed ? 'scale(0.98)' : 'scale(1)'}`,
          pointerEvents: 'none'
        }}
      >
        <div className="nub-surface"></div>
      </div>
      {mode === NavModes.CURSOR && (
        <div className="cursor-mode-indicator">Cursor Mode</div>
      )}
    </div>
  )
}

export default TrackNub