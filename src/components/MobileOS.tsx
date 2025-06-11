import React from 'react'
import './MobileOS.css'
import beakerIcon from '../assets/beaker.png'

interface MobileOSProps {
  selectedIndex: number
  isPressed: boolean
  openApp: string | null
  isAnimating: boolean
}

const apps = [
  { name: 'Lab', icon: 'beaker', isImage: true, color: '#2ecc71' },
  { name: 'Camera', icon: '📷', color: '#3498db' },
  { name: 'Photos', icon: '🖼️', color: '#e74c3c' },
  { name: 'Music', icon: '🎵', color: '#f39c12' },
  { name: 'Settings', icon: '⚙️', color: '#95a5a6' },
  { name: 'Calendar', icon: '📅', color: '#9b59b6' },
  { name: 'Maps', icon: '🗺️', color: '#1abc9c' },
  { name: 'Weather', icon: '☀️', color: '#3498db' },
  { name: 'Notes', icon: '📝', color: '#f1c40f' },
  { name: 'Clock', icon: '⏰', color: '#e67e22' },
  { name: 'Mail', icon: '✉️', color: '#34495e' },
  { name: 'Flip', icon: '↻', color: '#8e44ad' },
]

const dockApps = [
  { name: 'Phone', icon: '📞', color: '#27ae60' },
  { name: 'Safari', icon: '🌐', color: '#3498db' },
  { name: 'Music', icon: '🎵', color: '#e74c3c' },
]

const MobileOS: React.FC<MobileOSProps> = ({ selectedIndex, isPressed, openApp, isAnimating }) => {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="mobile-os">
      <div className="status-bar">
        <div className="status-time">{currentTime}</div>
        <div className="status-icons">
          <span className="signal">📶</span>
          <span className="wifi">📶</span>
          <span className="battery">🔋</span>
        </div>
      </div>
      
      <div className="lock-screen">
        <div className="date">{currentDate}</div>
        <div className="time">{currentTime}</div>
      </div>
      
      <div className={`app-grid ${openApp ? 'hidden' : ''}`}>
        {apps.map((app, index) => (
          <div
            key={index}
            className={`app-icon ${selectedIndex === index ? 'selected' : ''} ${
              selectedIndex === index && isPressed ? 'pressed' : ''
            } ${selectedIndex === index && isAnimating ? 'launching' : ''}`}
            style={{
              '--app-color': app.color
            } as React.CSSProperties}
          >
            <div className="app-icon-content">
              <span className="app-emoji">{app.icon}</span>
            </div>
            <span className="app-name">{app.name}</span>
          </div>
        ))}
      </div>
      
      {openApp && (
        <div className={`app-screen ${isAnimating ? 'animating' : ''}`} style={{
          '--app-color': apps[parseInt(openApp.split('-')[1])]?.color || '#333'
        } as React.CSSProperties}>
          <div className="app-header">
            <div className="app-title">{apps[parseInt(openApp.split('-')[1])]?.name}</div>
            <div className="app-close">✕</div>
          </div>
          <div className="app-content">
            <div className="app-icon-large">
              {apps[parseInt(openApp.split('-')[1])]?.icon}
            </div>
            <p>Swipe up or click trackpad to close</p>
          </div>
          <div className="app-nav-bar">
            <div className="nav-item">
              <span className="nav-icon">←</span>
              <span className="nav-label">Back</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">⏺</span>
              <span className="nav-label">Home</span>
            </div>
            <div className="nav-item">
              <span className="nav-icon">⋮</span>
              <span className="nav-label">More</span>
            </div>
          </div>
        </div>
      )}
      
      <div className={`dock ${openApp ? 'hidden' : ''}`}>
        <div className="dock-apps">
          {dockApps.map((app, index) => (
            <div
              key={index}
              className={`dock-app ${selectedIndex === 12 + index ? 'selected' : ''} ${
                selectedIndex === 12 + index && isPressed ? 'pressed' : ''
              }`}
              style={{
                '--app-color': app.color
              } as React.CSSProperties}
            >
              <div className="dock-app-content">
                <span className="dock-app-emoji">{app.icon}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MobileOS