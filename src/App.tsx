import { useState, useRef, useEffect } from 'react'
import './App.css'
import PhoneMockup from './components/PhoneMockup'
import TrackNub from './components/TrackNub'
import MobileOS from './components/MobileOS'
import DesktopModal from './components/DesktopModal'

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPressed, setIsPressed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
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
    
    // Determine direction based on angle (now with 4 columns)
    let moved = false
    if (angle >= -45 && angle < 45) {
      // Right
      setSelectedIndex((prev) => {
        if ((prev + 1) % 4 === 0) return prev
        moved = true
        return Math.min(prev + 1, 11)
      })
    } else if (angle >= 45 && angle < 135) {
      // Up
      setSelectedIndex((prev) => {
        moved = true
        return Math.max(prev - 4, 0)
      })
    } else if (angle >= -135 && angle < -45) {
      // Down
      setSelectedIndex((prev) => {
        moved = true
        return Math.min(prev + 4, 11)
      })
    } else {
      // Left
      setSelectedIndex((prev) => {
        if (prev % 4 === 0) return prev
        moved = true
        return Math.max(prev - 1, 0)
      })
    }
    
    if (moved) {
      lastNavTimeRef.current = now
    }
  }

  const handleClick = () => {
    setIsPressed(true)
    // Play click sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
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

    // Create click sound
    const audio = new Audio()
    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPThjMGG2C559SpXh0LPJzn9ctjJwVFmNDvxnEkA0f/'
    audioRef.current = audio

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
        <MobileOS selectedIndex={selectedIndex} isPressed={isPressed} />
      </PhoneMockup>
      <TrackNub
        onDirectionInput={handleDirectionInput}
        onClick={handleClick}
      />
      <button className="flip-button" onClick={() => {
        setIsFlipped(!isFlipped)
        document.querySelector('.app')?.classList.toggle('flipped')
      }}>
        ↻ Flip
      </button>
      <audio ref={audioRef} />
    </div>
  )
}

export default App