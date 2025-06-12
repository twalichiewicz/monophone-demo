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
    
    // Play click sound with variation
    clickSoundManager.playClick()
    
    // If an app is open, the click should interact with the app content
    if (openApp) {
      // Here we would handle app-specific actions
      // For now, just provide haptic feedback
      // The app UI components handle their own interactions
      setTimeout(() => setIsPressed(false), 100)
      return
    }
    
    // Check if flip app was selected (Flip is now at index 10)
    if (selectedIndex === 10 && !openApp) {
      setIsFlipped(!isFlipped)
      document.querySelector('.app')?.classList.toggle('flipped')
      return
    }
    
    // Open app animation (only when no app is open)
    if (!openApp && !isAnimating) {
      setIsAnimating(true)
      setAppSelectedIndex(0) // Reset app navigation when opening new app
      setTimeout(() => {
        setOpenApp(`app-${selectedIndex}`)
        setIsAnimating(false)
      }, 300)
    }
    
    setTimeout(() => setIsPressed(false), 100)
  }
  
  const handleAppDirectClick = (index: number) => {
    // Direct touch/click on an app
    triggerHaptic('medium')
    clickSoundManager.playClick()
    
    // Update selected index to match clicked app
    setSelectedIndex(index)
    
    // Check if flip app was clicked (Flip is now at index 10)
    if (index === 10 && !openApp) {
      setIsFlipped(!isFlipped)
      document.querySelector('.app')?.classList.toggle('flipped')
      return
    }
    
    // Open app animation
    if (!openApp && !isAnimating) {
      setIsAnimating(true)
      setAppSelectedIndex(0) // Reset app navigation when opening new app
      setTimeout(() => {
        setOpenApp(`app-${index}`)
        setIsAnimating(false)
      }, 300)
    }
  }
  
  const handleCloseApp = () => {
    // Direct touch/click on close button
    triggerHaptic('light')
    clickSoundManager.playClick()
    
    if (openApp) {
      setIsAnimating(true)
      setTimeout(() => {
        setOpenApp(null)
        setIsAnimating(false)
      }, 300)
    }
  }
  
  const handleAppNavigation = (direction: 'up' | 'down' | 'left' | 'right') => {
    // Get the current app index
    const currentAppIndex = parseInt(openApp?.split('-')[1] || '0')
    const appName = ['Clock', 'Maps', 'Photos', 'Camera', 'Weather', 'Notes', 'Music', 'Mail', 'Settings', 'Messages'][currentAppIndex]
    
    // Different navigation logic for different apps
    switch (appName) {
      case 'Clock':
        // Clock has 3 horizontal buttons
        if (direction === 'left') {
          setAppSelectedIndex(prev => prev > 0 ? prev - 1 : 2)
        } else if (direction === 'right') {
          setAppSelectedIndex(prev => prev < 2 ? prev + 1 : 0)
        }
        break
        
      case 'Maps':
        // Maps has 4 horizontal quick actions
        if (direction === 'left') {
          setAppSelectedIndex(prev => prev > 0 ? prev - 1 : 3)
        } else if (direction === 'right') {
          setAppSelectedIndex(prev => prev < 3 ? prev + 1 : 0)
        }
        break
        
      case 'Photos':
        // Photos has a 3x4 grid
        const photosPerRow = 3
        const totalPhotos = 12
        if (direction === 'up' && appSelectedIndex >= photosPerRow) {
          setAppSelectedIndex(prev => prev - photosPerRow)
        } else if (direction === 'down' && appSelectedIndex < totalPhotos - photosPerRow) {
          setAppSelectedIndex(prev => prev + photosPerRow)
        } else if (direction === 'left' && appSelectedIndex % photosPerRow !== 0) {
          setAppSelectedIndex(prev => prev - 1)
        } else if (direction === 'right' && appSelectedIndex % photosPerRow !== photosPerRow - 1 && appSelectedIndex < totalPhotos - 1) {
          setAppSelectedIndex(prev => prev + 1)
        }
        break
        
      case 'Weather':
        // Weather has 5 horizontal forecast days
        if (direction === 'left') {
          setAppSelectedIndex(prev => prev > 0 ? prev - 1 : 4)
        } else if (direction === 'right') {
          setAppSelectedIndex(prev => prev < 4 ? prev + 1 : 0)
        }
        break
        
      case 'Notes':
      case 'Mail':
      case 'Messages':
        // These have vertical lists (4 items)
        if (direction === 'up') {
          setAppSelectedIndex(prev => prev > 0 ? prev - 1 : 3)
        } else if (direction === 'down') {
          setAppSelectedIndex(prev => prev < 3 ? prev + 1 : 0)
        }
        break
        
      case 'Music':
        // Music has 3 horizontal controls
        if (direction === 'left') {
          setAppSelectedIndex(prev => prev > 0 ? prev - 1 : 2)
        } else if (direction === 'right') {
          setAppSelectedIndex(prev => prev < 2 ? prev + 1 : 0)
        }
        break
        
      case 'Settings':
        // Settings has vertical list (6 items)
        if (direction === 'up') {
          setAppSelectedIndex(prev => prev > 0 ? prev - 1 : 5)
        } else if (direction === 'down') {
          setAppSelectedIndex(prev => prev < 5 ? prev + 1 : 0)
        }
        break
        
      case 'Camera':
        // Camera has 4 horizontal modes
        if (direction === 'left') {
          setAppSelectedIndex(prev => prev > 0 ? prev - 1 : 3)
        } else if (direction === 'right') {
          setAppSelectedIndex(prev => prev < 3 ? prev + 1 : 0)
        }
        break
        
      default:
        // Default behavior - just cycle
        setAppSelectedIndex(prev => (prev + 1) % 10)
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
          onAppClick={handleAppDirectClick}
          onCloseApp={handleCloseApp}
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