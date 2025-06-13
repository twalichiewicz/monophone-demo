import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import PhoneMockup from './components/PhoneMockup'
import TrackNub from './components/TrackNub'
import MobileOS from './components/MobileOS'
import DesktopModal from './components/DesktopModal'
import SpatialView from './components/SpatialView'
import { clickSoundManager } from './utils/audioUtils'

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPressed, setIsPressed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [openApp, setOpenApp] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSpatialView, setShowSpatialView] = useState(false)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 }) // Percentage-based position
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [cursorVisible, setCursorVisible] = useState(false)
  const cursorTimeoutRef = useRef<number | undefined>(undefined)
  const lastNavTimeRef = useRef(0)
  const navCooldown = 200 // ms between navigation

  const handleDirectionInput = (direction: { x: number; y: number }, isDelta: boolean = false) => {
    // If we're in trackpad mode, update cursor position
    if (isDelta) {
      // Show cursor when there's input
      setCursorVisible(true)
      
      // Clear existing timeout
      if (cursorTimeoutRef.current) {
        clearTimeout(cursorTimeoutRef.current)
      }
      
      // Set new timeout to hide cursor after 1.5 seconds of inactivity
      cursorTimeoutRef.current = window.setTimeout(() => {
        setCursorVisible(false)
        setCursorPosition({ x: 50, y: 50 }) // Reset to center
        setHoveredIndex(null)
      }, 1500)
      setCursorPosition(prev => {
        // Get trackpad center position (assuming it's at bottom center of screen)
        const trackpadCenterX = 50; // percentage
        const trackpadCenterY = 90; // percentage (near bottom)
        
        // Calculate distance from trackpad center to cursor
        const distanceX = Math.abs(prev.x - trackpadCenterX);
        const distanceY = Math.abs(prev.y - trackpadCenterY);
        const radialDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // Apply decreasing sensitivity based on distance (1.0 at center, 0.5 at edges)
        const distanceFactor = Math.max(0.5, 1.0 - (radialDistance / 100));
        const baseSensitivity = 1.0;
        const adjustedSensitivity = baseSensitivity * distanceFactor;
        
        const newX = Math.max(0, Math.min(100, prev.x + direction.x * adjustedSensitivity))
        const newY = Math.max(0, Math.min(100, prev.y + direction.y * adjustedSensitivity))
        return { x: newX, y: newY }
      })
      
      // Check which app the cursor is over
      checkHoveredApp()
      return
    }
    
    // Handle omnidirectional navigation with cooldown (legacy mode)
    const now = Date.now()
    if (now - lastNavTimeRef.current < navCooldown) return
    
    const threshold = 0.3
    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y)
    
    if (magnitude < threshold) return
    
    // Calculate angle in degrees (inverted Y for natural touch direction)
    // Flip controls when screen is rotated
    const adjustedX = isFlipped ? -direction.x : direction.x
    const adjustedY = isFlipped ? direction.y : -direction.y
    const angle = Math.atan2(adjustedY, adjustedX) * (180 / Math.PI)
    
    // If app is open and not in trackpad mode, handle directional navigation
    if (openApp && !isDelta) {
      let navDirection: 'up' | 'down' | 'left' | 'right'
      
      if (angle >= -45 && angle < 45) {
        navDirection = 'right'
      } else if (angle >= 45 && angle < 135) {
        navDirection = 'up'
      } else if (angle >= -135 && angle < -45) {
        navDirection = 'down'
      } else {
        navDirection = 'left'
      }
      
      // Pass direction to app navigation handler
      handleAppNavigation(navDirection)
      
      lastNavTimeRef.current = now
      triggerHaptic('light')
      return
    }
    
    // Determine direction based on angle (now with 4 columns)
    let moved = false
    if (angle >= -45 && angle < 45) {
      // Right
      setSelectedIndex((prev) => {
        if (prev < 12 && (prev + 1) % 4 === 0) return prev
        moved = true
        return Math.min(prev + 1, 14) // 12 apps + 3 dock items
      })
    } else if (angle >= 45 && angle < 135) {
      // Up
      setSelectedIndex((prev) => {
        if (prev >= 12) return 8 + (prev - 12) // From dock to bottom row of apps
        moved = true
        return Math.max(prev - 4, 0)
      })
    } else if (angle >= -135 && angle < -45) {
      // Down
      setSelectedIndex((prev) => {
        if (prev >= 8 && prev < 12) return 12 + Math.min(prev - 8, 2) // From bottom row to dock
        moved = true
        return Math.min(prev + 4, 11)
      })
    } else {
      // Left
      setSelectedIndex((prev) => {
        if (prev < 12 && prev % 4 === 0) return prev
        moved = true
        return Math.max(prev - 1, 0)
      })
    }
    
    if (moved) {
      lastNavTimeRef.current = now
      triggerHaptic('light')
    }
  }

  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if ('vibrate' in navigator) {
      const duration = style === 'light' ? 10 : style === 'medium' ? 20 : 30
      navigator.vibrate(duration)
    }
  }

  const handleClick = () => {
    setIsPressed(true)
    triggerHaptic('heavy')
    // Sound is now played in TrackNub on press, not on click
    
    if (!openApp) {
      // On springboard - open app based on hovered index
      const indexToOpen = hoveredIndex !== null ? hoveredIndex : selectedIndex
      
      if (indexToOpen === 10) {
        setIsFlipped(!isFlipped)
        document.querySelector('.app')?.classList.toggle('flipped')
      } else if (!isAnimating && indexToOpen >= 0 && indexToOpen <= 14) {
        setIsAnimating(true)
        setTimeout(() => {
          setOpenApp(`app-${indexToOpen}`)
          setIsAnimating(false)
          // Initialize first element as selected
          setSelectedElementId('app-close-button')
        }, 300)
      }
    } else {
      // In app - activate selected element
      if (selectedElementId === 'app-close-button') {
        handleCloseApp()
      } else if (selectedElementId) {
        const element = document.getElementById(selectedElementId)
        if (element) {
          element.click()
        }
      }
    }
    
    setTimeout(() => setIsPressed(false), 100)
  }
  
  const handleAppDirectClick = (index: number) => {
    triggerHaptic('medium')
    // Sound is played by touch/mouse events in the UI components
    
    setSelectedIndex(index)
    
    if (index === 10 && !openApp) {
      setIsFlipped(!isFlipped)
      document.querySelector('.app')?.classList.toggle('flipped')
      return
    }
    
    if (!openApp && !isAnimating) {
      setIsAnimating(true)
      setTimeout(() => {
        setOpenApp(`app-${index}`)
        setIsAnimating(false)
        setSelectedElementId('app-close-button')
      }, 300)
    }
  }
  
  const checkHoveredApp = React.useCallback(() => {
    // Get cursor position in viewport coordinates
    const mobileOS = document.querySelector('.mobile-os')
    if (!mobileOS) return
    
    const rect = mobileOS.getBoundingClientRect()
    const x = rect.left + (cursorPosition.x / 100) * rect.width
    const y = rect.top + (cursorPosition.y / 100) * rect.height
    
    if (openApp) {
      // Check selectable elements in app
      const selectableElements = document.querySelectorAll('[data-selectable]')
      let foundElementId: string | null = null
      
      selectableElements.forEach((element) => {
        const htmlElement = element as HTMLElement
        const elemRect = htmlElement.getBoundingClientRect()
        if (x >= elemRect.left && x <= elemRect.right &&
            y >= elemRect.top && y <= elemRect.bottom) {
          foundElementId = htmlElement.id
        }
      })
      
      if (foundElementId) {
        setSelectedElementId(foundElementId)
      }
    } else {
      // Check all app icons
      const appIcons = document.querySelectorAll('.app-icon')
      let foundIndex: number | null = null
      
      appIcons.forEach((icon, index) => {
        const iconRect = icon.getBoundingClientRect()
        if (x >= iconRect.left && x <= iconRect.right &&
            y >= iconRect.top && y <= iconRect.bottom) {
          foundIndex = index
        }
      })
      
      // Check dock items
      const dockItems = document.querySelectorAll('.dock-item')
      dockItems.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect()
        if (x >= itemRect.left && x <= itemRect.right &&
            y >= itemRect.top && y <= itemRect.bottom) {
          foundIndex = 12 + index
        }
      })
      
      setHoveredIndex(foundIndex)
      if (foundIndex !== null) {
        setSelectedIndex(foundIndex)
      }
    }
  }, [cursorPosition, openApp])
  
  const handleCloseApp = () => {
    triggerHaptic('light')
    // Sound is played by touch/mouse events in the UI components
    
    if (openApp) {
      setIsAnimating(true)
      setTimeout(() => {
        setOpenApp(null)
        setIsAnimating(false)
        setSelectedElementId(null)
      }, 300)
    }
  }
  
  const handleAppNavigation = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!openApp) return
    
    const appScreen = document.querySelector('.app-screen')
    if (!appScreen) return
    
    // Get all elements with data-selectable attribute
    const selectableElements = Array.from(
      appScreen.querySelectorAll('[data-selectable]')
    ) as HTMLElement[]
    
    if (selectableElements.length === 0) return
    
    // Find current selected element
    const currentElement = selectedElementId 
      ? selectableElements.find(el => el.id === selectedElementId)
      : null
    
    const currentIndex = currentElement 
      ? selectableElements.indexOf(currentElement)
      : -1
    
    // Get element positions
    const positions = selectableElements.map(el => {
      const rect = el.getBoundingClientRect()
      return {
        element: el,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom
      }
    })
    
    let nextElement: HTMLElement | null = null
    
    if (currentIndex >= 0) {
      const current = positions[currentIndex]
      
      // Find best candidate in direction
      const candidates = positions.filter((pos, idx) => {
        if (idx === currentIndex) return false
        
        switch (direction) {
          case 'up':
            return pos.y < current.y - 5
          case 'down':
            return pos.y > current.y + 5
          case 'left':
            return pos.x < current.x - 5
          case 'right':
            return pos.x > current.x + 5
          default:
            return false
        }
      })
      
      if (candidates.length > 0) {
        // Find closest in the direction
        const closest = candidates.reduce((best, pos) => {
          const dist = Math.sqrt(
            Math.pow(pos.x - current.x, 2) + 
            Math.pow(pos.y - current.y, 2)
          )
          const bestDist = Math.sqrt(
            Math.pow(best.x - current.x, 2) + 
            Math.pow(best.y - current.y, 2)
          )
          return dist < bestDist ? pos : best
        })
        
        nextElement = closest.element
      }
    } else {
      // No selection, select first element
      nextElement = selectableElements[0]
    }
    
    if (nextElement) {
      setSelectedElementId(nextElement.id)
      
      // Scroll into view if needed
      const container = appScreen.querySelector('.app-content')
      if (container) {
        const rect = nextElement.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        
        if (rect.top < containerRect.top || rect.bottom > containerRect.bottom - 90) {
          nextElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          })
        }
      }
    }
  }

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || 
                  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Initialize click sound manager
    clickSoundManager.init()
    
    // Add global haptic feedback for all button/interactive element clicks
    const handleGlobalClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('button, [data-selectable="true"], .app-icon, .dock-app, a, input[type="button"], input[type="submit"]')) {
        // Test with direct vibration call
        if ('vibrate' in navigator) {
          navigator.vibrate(20)
          console.log('Vibration triggered')
        } else {
          console.log('Vibration API not available')
        }
      }
    }
    
    // Only use touchstart for mobile to avoid double triggers
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', handleGlobalClick, { passive: true })
    } else {
      document.addEventListener('click', handleGlobalClick)
    }

    // Prevent touch scrolling
    const preventScroll = (e: TouchEvent) => {
      e.preventDefault()
    }
    
    document.addEventListener('touchmove', preventScroll, { passive: false })
    
    return () => {
      document.removeEventListener('touchmove', preventScroll)
      window.removeEventListener('resize', checkMobile)
      if ('ontouchstart' in window) {
        document.removeEventListener('touchstart', handleGlobalClick)
      } else {
        document.removeEventListener('click', handleGlobalClick)
      }
    }
  }, [])

  // Handle selection state
  useEffect(() => {
    if (!openApp || !selectedElementId) return
    
    // Clear all selections
    document.querySelectorAll('.selected').forEach(el => {
      el.classList.remove('selected')
    })
    
    // Add selection to current element
    const element = document.getElementById(selectedElementId)
    if (element) {
      element.classList.add('selected')
    }
  }, [selectedElementId, openApp])

  // Update hovered app when cursor moves
  useEffect(() => {
    checkHoveredApp()
  }, [checkHoveredApp])
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (cursorTimeoutRef.current) {
        clearTimeout(cursorTimeoutRef.current)
      }
    }
  }, [])

  if (!isMobile) {
    return <DesktopModal />
  }

  return (
    <div className="app">
      <PhoneMockup>
        <MobileOS 
          selectedIndex={selectedIndex} 
          isPressed={isPressed} 
          openApp={openApp}
          isAnimating={isAnimating}
          selectedElementId={selectedElementId}
          onAppClick={handleAppDirectClick}
          onCloseApp={handleCloseApp}
          cursorPosition={cursorPosition}
          hoveredIndex={hoveredIndex}
          cursorVisible={cursorVisible}
        />
      </PhoneMockup>
      <TrackNub
        onDirectionInput={handleDirectionInput}
        onClick={handleClick}
        onFlip={() => {
          setIsFlipped(!isFlipped)
          document.querySelector('.app')?.classList.toggle('flipped')
        }}
        onLongPress={() => {
          setShowSpatialView(true)
        }}
      />
      {showSpatialView && (
        <SpatialView onClose={() => setShowSpatialView(false)} />
      )}
    </div>
  )
}

export default App