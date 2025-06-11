import React, { useState, useRef, useEffect } from 'react'
import './TrackNub.css'

interface TrackNubProps {
  onDirectionInput: (direction: { x: number; y: number }) => void
  onClick: () => void
}

const SENSITIVITY = 0.3 // Lower = more precise control
const DEAD_ZONE = 0.1 // Minimum movement to register
const MAX_DISTANCE = 25 // Maximum drag distance

const TrackNub: React.FC<TrackNubProps> = ({ onDirectionInput, onClick }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPressed, setIsPressed] = useState(false)
  const nubRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef({ x: 0, y: 0 })
  const dragStartRef = useRef({ x: 0, y: 0 })
  const lastDirectionRef = useRef({ x: 0, y: 0 })
  const hapticTimeoutRef = useRef<number | null>(null)

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
      setIsDragging(false)
      setPosition({ x: 0, y: 0 })
      setIsPressed(false)
      lastDirectionRef.current = { x: 0, y: 0 }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !nubRef.current) return

      const rect = nubRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      
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

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setIsPressed(true)
    triggerHaptic('medium')
    
    const rect = nubRef.current!.getBoundingClientRect()
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }
    dragStartRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (Math.abs(position.x) < 5 && Math.abs(position.y) < 5) {
      triggerHaptic('heavy')
      onClick()
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const touch = e.touches[0]
    setIsDragging(true)
    setIsPressed(true)
    triggerHaptic('medium')
    
    // Use touch start position as center for more precise control
    centerRef.current = {
      x: touch.clientX,
      y: touch.clientY
    }
    dragStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()
    
    const touch = e.touches[0]
    
    // Calculate delta from initial touch position
    const deltaX = touch.clientX - centerRef.current.x
    const deltaY = touch.clientY - centerRef.current.y
    
    processInput(deltaX, deltaY)
  }

  const handleTouchEnd = () => {
    if (Math.abs(position.x) < 5 && Math.abs(position.y) < 5) {
      triggerHaptic('heavy')
      onClick()
    }
    setIsDragging(false)
    setPosition({ x: 0, y: 0 })
    setIsPressed(false)
    lastDirectionRef.current = { x: 0, y: 0 }
  }

  return (
    <div 
      className="track-nub-container"
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        ref={nubRef}
        className={`track-nub ${isPressed ? 'pressed' : ''}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) ${isPressed ? 'scale(0.95)' : 'scale(1)'}`,
          pointerEvents: 'none'
        }}
      >
        <div className="nub-surface">
          <div className="nub-texture"></div>
          <div className="nub-highlight"></div>
          <div className="nub-shadow"></div>
        </div>
      </div>
    </div>
  )
}

export default TrackNub