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
  const tapCountRef = useRef(0)
  const tapTimerRef = useRef<number | null>(null)
  const doubleTapDelay = 300 // ms for double tap detection

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
    clickSoundManager.playClick()
    
    // CASE 1: On springboard - single tap opens app immediately
    if (!openApp) {
      if (selectedIndex === 10) {
        // Flip app
        setIsFlipped(!isFlipped)
        document.querySelector('.app')?.classList.toggle('flipped')
      } else if (!isAnimating) {
        // Open selected app
        setIsAnimating(true)
        setAppSelectedIndex(0)
        setTimeout(() => {
          setOpenApp(`app-${selectedIndex}`)
          setIsAnimating(false)
          // Select the first focusable element in the app
          setTimeout(() => {
            // Clear ALL selections first
            document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'))
            
            // Find and select the close button in the new app
            const appScreen = document.querySelector('.app-screen')
            if (appScreen) {
              const closeButton = appScreen.querySelector('.app-close-button') as HTMLElement
              if (closeButton) {
                closeButton.classList.add('selected')
                setAppSelectedIndex(0) // Reset index
              }
            }
          }, 100)
        }, 300)
      }
      setTimeout(() => setIsPressed(false), 100)
      return
    }
    
    // CASE 2: In app - handle taps
    tapCountRef.current += 1
    
    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current)
    }
    
    tapTimerRef.current = window.setTimeout(() => {
      const taps = tapCountRef.current
      tapCountRef.current = 0
      
      console.log(`Processing ${taps} tap(s) in app`)
      
      if (taps >= 2) {
        // Double tap (or more) - always go home
        console.log('Double tap detected - going home')
        triggerHaptic('medium')
        setTimeout(() => triggerHaptic('medium'), 50)
        
        setIsAnimating(true)
        setTimeout(() => {
          setOpenApp(null)
          setIsAnimating(false)
          // Clear all selections when going home
          document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'))
        }, 300)
      } else if (taps === 1) {
        // Single tap - activate selected element ONLY
        const appScreen = document.querySelector('.app-screen')
        if (!appScreen) {
          console.warn('No app screen found')
          return
        }
        
        const selectedElement = appScreen.querySelector('.selected') as HTMLElement
        
        if (!selectedElement) {
          console.warn('No element selected within app screen')
          return
        }
        
        // Ensure the selected element is actually within the current app
        if (!appScreen.contains(selectedElement)) {
          console.warn('Selected element is not within current app screen')
          return
        }
        
        console.log('Selected element:', selectedElement.className, selectedElement.textContent)
        
        // Check if it's the close button
        if (selectedElement.classList.contains('app-close-button')) {
          console.log('Close button selected - closing app')
          // Close app
          handleCloseApp()
        } else {
          console.log('Activating element:', selectedElement)
          // Activate the element (click it)
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          })
          selectedElement.dispatchEvent(clickEvent)
        }
      }
    }, doubleTapDelay)
    
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
        // Select the first focusable element in the app
        setTimeout(() => {
          // Clear ALL selections first
          document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'))
          
          // Find and select the close button in the new app
          const appScreen = document.querySelector('.app-screen')
          if (appScreen) {
            const closeButton = appScreen.querySelector('.app-close-button') as HTMLElement
            if (closeButton) {
              closeButton.classList.add('selected')
              setAppSelectedIndex(0) // Reset index
            }
          }
        }, 100)
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
        // Clear all selections when closing app
        document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'))
      }, 300)
    }
  }
  
  const handleAppNavigation = (direction: 'up' | 'down' | 'left' | 'right') => {
    // Get all focusable elements in the current app
    const appScreen = document.querySelector('.app-screen')
    if (!appScreen) return
    
    // Define selectors for focusable elements
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '.note-item',
      '.mail-item',
      '.conversation-item',
      '.setting-item',
      '.photo-item',
      '.forecast-day',
      '.map-action',
      '.clock-button',
      '.camera-mode',
      '.control-btn',
      '.nav-item',
      '.app-close-button'
    ].join(', ')
    
    // Get all focusable elements from the entire app screen
    const allFocusable = Array.from(appScreen.querySelectorAll(focusableSelectors))
    
    if (allFocusable.length === 0) return
    
    // Clear all existing selections first
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'))
    
    // Find currently selected element
    let currentIndex = appSelectedIndex
    if (currentIndex < 0 || currentIndex >= allFocusable.length) {
      currentIndex = 0
    }
    
    // Calculate positions of all elements
    const elementPositions = allFocusable.map(el => {
      const rect = el.getBoundingClientRect()
      return {
        element: el,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right
      }
    })
    
    const currentPos = elementPositions[currentIndex]
    let nextIndex = currentIndex
    
    if (currentPos) {
      // Find the best next element based on direction
      const candidates = elementPositions.filter((pos, idx) => {
        if (idx === currentIndex) return false
        
        switch (direction) {
          case 'up':
            return pos.y < currentPos.y - 10
          case 'down':
            return pos.y > currentPos.y + 10
          case 'left':
            return pos.x < currentPos.x - 10
          case 'right':
            return pos.x > currentPos.x + 10
          default:
            return false
        }
      })
      
      if (candidates.length > 0) {
        // Find the closest element in the given direction
        const closest = candidates.reduce((best, pos) => {
          const distance = Math.sqrt(
            Math.pow(pos.x - currentPos.x, 2) + 
            Math.pow(pos.y - currentPos.y, 2)
          )
          const bestDistance = Math.sqrt(
            Math.pow(best.x - currentPos.x, 2) + 
            Math.pow(best.y - currentPos.y, 2)
          )
          return distance < bestDistance ? pos : best
        })
        
        nextIndex = elementPositions.indexOf(closest)
      }
    }
    
    // Update selection
    if (nextIndex >= 0 && nextIndex < allFocusable.length) {
      // Clear all selections
      document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'))
      
      // Add selected class to next element
      const nextElement = allFocusable[nextIndex]
      nextElement.classList.add('selected')
      
      // Update the app selected index
      setAppSelectedIndex(nextIndex)
      
      // Scroll element into view if needed
      const container = document.querySelector('.app-content')
      if (container) {
        const rect = nextElement.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        
        // Check if element is outside visible area
        if (rect.top < containerRect.top || rect.bottom > containerRect.bottom - 90) {
          nextElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
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

    // Prevent touch scrolling
    const preventScroll = (e: TouchEvent) => {
      e.preventDefault()
    }
    
    document.addEventListener('touchmove', preventScroll, { passive: false })
    
    return () => {
      document.removeEventListener('touchmove', preventScroll)
      window.removeEventListener('resize', checkMobile)
      // Clear tap timer on unmount
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current)
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