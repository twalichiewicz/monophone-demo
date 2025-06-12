import React, { useState, useRef, useEffect } from 'react'
import './TrackNub.css'
import { clickSoundManager } from '../utils/audioUtils'

interface TrackNubProps {
  onDirectionInput: (direction: { x: number; y: number }) => void
  onClick: () => void
  onFlip?: () => void
  onLongPress?: () => void
}

const SENSITIVITY = 0.3 // Lower = more precise control
const DEAD_ZONE = 0.1 // Minimum movement to register
const MAX_DISTANCE = 25 // Maximum drag distance

const TrackNub: React.FC<TrackNubProps> = ({ onDirectionInput, onClick, onLongPress }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPressed, setIsPressed] = useState(false)
  const [isLongPress, setIsLongPress] = useState(false)
  const nubRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef({ x: 0, y: 0 })
  const dragStartRef = useRef({ x: 0, y: 0 })
  const lastDirectionRef = useRef({ x: 0, y: 0 })
  const tickIntervalRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const longPressTimerRef = useRef<number | null>(null)
  
  useEffect(() => {
    // Initialize sound on component mount
    clickSoundManager.init()
  }, [])


  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }

  const playTick = (distance: number) => {
    const audioContext = initAudio()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Higher frequency for further distance
    oscillator.frequency.value = 200 + (distance * 10)
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.05)
  }


  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const duration = style === 'light' ? 10 : style === 'medium' ? 20 : 30
      navigator.vibrate(duration)
    }
  }

  const processInput = (deltaX: number, deltaY: number) => {
    const adjustedX = deltaX * SENSITIVITY
    const adjustedY = deltaY * SENSITIVITY
    
    const distance = Math.sqrt(adjustedX * adjustedX + adjustedY * adjustedY)
    
    let normalizedX = adjustedX / MAX_DISTANCE
    let normalizedY = adjustedY / MAX_DISTANCE
    
    if (distance > MAX_DISTANCE) {
      normalizedX = (adjustedX / distance) * MAX_DISTANCE / MAX_DISTANCE
      normalizedY = (adjustedY / distance) * MAX_DISTANCE / MAX_DISTANCE
    }
    
    // Apply dead zone
    const magnitude = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY)
    if (magnitude < DEAD_ZONE) {
      normalizedX = 0
      normalizedY = 0
    } else {
      // Scale out of dead zone
      const scaledMagnitude = (magnitude - DEAD_ZONE) / (1 - DEAD_ZONE)
      normalizedX = (normalizedX / magnitude) * scaledMagnitude
      normalizedY = (normalizedY / magnitude) * scaledMagnitude
    }
    
    setPosition({
      x: normalizedX * MAX_DISTANCE,
      y: normalizedY * MAX_DISTANCE
    })
    
    // Trigger haptics on direction change
    if (Math.abs(normalizedX - lastDirectionRef.current.x) > 0.1 || 
        Math.abs(normalizedY - lastDirectionRef.current.y) > 0.1) {
      triggerHaptic('light')
      lastDirectionRef.current = { x: normalizedX, y: normalizedY }
    }
    
    onDirectionInput({ x: normalizedX, y: normalizedY })
  }

  useEffect(() => {
    const handleMouseUp = () => {
      cancelLongPress()
      setIsDragging(false)
      setPosition({ x: 0, y: 0 })
      setIsPressed(false)
      lastDirectionRef.current = { x: 0, y: 0 }
      stopTicking()
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !nubRef.current) return

      const rect = nubRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      
      // Cancel long press if moved too much
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        cancelLongPress()
      }
      
      processInput(deltaX, deltaY)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, onDirectionInput])

  // Update ticking rate based on position
  useEffect(() => {
    if (isDragging && tickIntervalRef.current) {
      stopTicking()
      startTicking()
    }
  }, [position.x, position.y, isDragging])

  const startTicking = () => {
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current)
    
    tickIntervalRef.current = window.setInterval(() => {
      const distance = Math.sqrt(position.x * position.x + position.y * position.y)
      if (distance > 5) {
        // Tick rate based on distance - further = faster ticks
        playTick(distance)
      }
    }, Math.max(100, 500 - (Math.sqrt(position.x * position.x + position.y * position.y) * 10)))
  }

  const stopTicking = () => {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current)
      tickIntervalRef.current = null
    }
  }

  const startLongPressTimer = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current)
    
    longPressTimerRef.current = window.setTimeout(() => {
      if (isPressed && Math.abs(position.x) < 5 && Math.abs(position.y) < 5) {
        setIsLongPress(true)
        triggerHaptic('heavy')
        if (onLongPress) onLongPress()
      }
    }, 3000) // 3 seconds
  }

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
    setIsLongPress(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Prevent if already pressed
    if (isPressed) return
    
    setIsDragging(true)
    setIsPressed(true)
    triggerHaptic('medium')
    clickSoundManager.playClick()
    
    const rect = nubRef.current!.getBoundingClientRect()
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    
    startTicking()
    startLongPressTimer()
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (Math.abs(position.x) < 5 && Math.abs(position.y) < 5 && !isLongPress) {
      triggerHaptic('heavy')
      onClick()
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Prevent if already pressed
    if (isPressed || isDragging) return
    
    const touch = e.touches[0]
    setIsDragging(true)
    setIsPressed(true)
    triggerHaptic('medium')
    clickSoundManager.playClick()
    
    // Use touch start position as center for more precise control
    centerRef.current = {
      x: touch.clientX,
      y: touch.clientY
    }
    dragStartRef.current = { x: touch.clientX, y: touch.clientY }
    
    startTicking()
    startLongPressTimer()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()
    
    const touch = e.touches[0]
    
    // Calculate delta from initial touch position
    const deltaX = touch.clientX - centerRef.current.x
    const deltaY = touch.clientY - centerRef.current.y
    
    // Cancel long press if moved too much
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      cancelLongPress()
    }
    
    processInput(deltaX, deltaY)
  }

  const handleTouchEnd = () => {
    cancelLongPress()
    if (Math.abs(position.x) < 5 && Math.abs(position.y) < 5 && !isLongPress) {
      triggerHaptic('heavy')
      onClick()
    }
    setIsDragging(false)
    setPosition({ x: 0, y: 0 })
    setIsPressed(false)
    lastDirectionRef.current = { x: 0, y: 0 }
    stopTicking()
    
  }

  return (
    <div 
      className={`track-nub-container ${isDragging ? 'active' : ''} ${isPressed ? 'showing-zones' : ''} ${isLongPress ? 'long-press' : ''}`}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="trackpad-surface"></div>
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
          transform: `translate(${position.x}px, ${position.y}px) ${isPressed ? 'scale(0.98)' : 'scale(1)'}`,
          pointerEvents: 'none'
        }}
      >
        <div className="nub-surface"></div>
      </div>
    </div>
  )
}

export default TrackNub