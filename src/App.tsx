import { useState, useRef, useEffect } from 'react'
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
  const [appSelectedIndex, setAppSelectedIndex] = useState(0)
  const lastNavTimeRef = useRef(0)
  const navCooldown = 200 // ms between navigation

  const handleDirectionInput = (direction: { x: number; y: number }) => {
    // Handle omnidirectional navigation with cooldown
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
    
    // If app is open, handle app-specific navigation
    if (openApp) {
      // Update app-specific selection based on direction
      setAppSelectedIndex((prev) => {
        // Simple cycling through items for now
        // Each app can have different navigation logic
        return (prev + 1) % 10
      })
      
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
    
    // Play click sound with variation
    clickSoundManager.playClick()
    
    // Check if flip app was selected (Flip is now at index 10)
    if (selectedIndex === 10 && !openApp) {
      setIsFlipped(!isFlipped)
      document.querySelector('.app')?.classList.toggle('flipped')
      return
    }
    
    // Open app animation
    if (!openApp && !isAnimating) {
      setIsAnimating(true)
      setAppSelectedIndex(0) // Reset app navigation when opening new app
      setTimeout(() => {
        setOpenApp(`app-${selectedIndex}`)
        setIsAnimating(false)
      }, 300)
    } else if (openApp) {
      // Close app
      setIsAnimating(true)
      setTimeout(() => {
        setOpenApp(null)
        setIsAnimating(false)
      }, 300)
    }
    
    setTimeout(() => setIsPressed(false), 100)
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

    // Prevent touch scrolling
    const preventScroll = (e: TouchEvent) => {
      e.preventDefault()
    }
    
    document.addEventListener('touchmove', preventScroll, { passive: false })
    
    return () => {
      document.removeEventListener('touchmove', preventScroll)
      window.removeEventListener('resize', checkMobile)
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
          appSelectedIndex={appSelectedIndex}
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