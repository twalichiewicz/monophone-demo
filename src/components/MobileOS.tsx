import React, { useState, useEffect } from 'react'
import './MobileOS.css'
import { ClockUI, MapsUI, PhotosUI, CameraUI, WeatherUI, NotesUI, MusicUI, MailUI, SettingsUI, MessagesUI } from './AppUIs'

interface MobileOSProps {
  selectedIndex: number
  isPressed: boolean
  openApp: string | null
  isAnimating: boolean
  appSelectedIndex?: number
  onAppClick: (index: number) => void
  onCloseApp: () => void
}

const apps = [
  { name: 'Clock', icon: '⏰', color: '#e67e22' },
  { name: 'Maps', icon: '🗺️', color: '#1abc9c' },
  { name: 'Photos', icon: '🖼️', color: '#e74c3c' },
  { name: 'Camera', icon: '📷', color: '#3498db' },
  { name: 'Weather', icon: '☀️', color: '#3498db' },
  { name: 'Notes', icon: '📝', color: '#f1c40f' },
  { name: 'Music', icon: '🎵', color: '#f39c12' },
  { name: 'Mail', icon: '✉️', color: '#34495e' },
  { name: 'Settings', icon: '⚙️', color: '#95a5a6' },
  { name: 'Messages', icon: '💬', color: '#2ecc71' },
  { name: 'Flip', icon: '↻', color: '#8e44ad' },
]

const dockApps = [
  { name: 'Phone', icon: '📞', color: '#27ae60' },
  { name: 'Safari', icon: '🌐', color: '#3498db' },
  { name: 'Music', icon: '🎵', color: '#e74c3c' },
]

const MobileOS: React.FC<MobileOSProps> = ({ selectedIndex, isPressed, openApp, isAnimating, appSelectedIndex: propAppSelectedIndex, onAppClick, onCloseApp }) => {
  const [localAppSelectedIndex, setLocalAppSelectedIndex] = useState(0)
  const appSelectedIndex = propAppSelectedIndex ?? localAppSelectedIndex
  
  useEffect(() => {
    setLocalAppSelectedIndex(0)
  }, [openApp])
  
  const handleAppNavigate = () => {
    // This would be connected to the actual navigation
    // For now, just cycle through indices
    setLocalAppSelectedIndex(prev => (prev + 1) % 10)
  }
  
  const getAppNavItems = (appName: string) => {
    switch (appName) {
      case 'Clock':
        return [
          { icon: '⏰', label: 'Alarm' },
          { icon: '⏱️', label: 'Timer' },
          { icon: '⏲️', label: 'Stopwatch' },
          { icon: '🌍', label: 'World Clock' }
        ]
      case 'Maps':
        return [
          { icon: '📍', label: 'Current' },
          { icon: '🏠', label: 'Home' },
          { icon: '🏢', label: 'Work' },
          { icon: '⭐', label: 'Saved' }
        ]
      case 'Photos':
        return [
          { icon: '📷', label: 'Library' },
          { icon: '📚', label: 'Albums' },
          { icon: '🔍', label: 'Search' },
          { icon: '👤', label: 'For You' }
        ]
      case 'Camera':
        return [
          { icon: '📸', label: 'Photo' },
          { icon: '🎥', label: 'Video' },
          { icon: '👤', label: 'Portrait' },
          { icon: '🌄', label: 'Pano' }
        ]
      case 'Weather':
        return [
          { icon: '📍', label: 'My Location' },
          { icon: '📋', label: 'List' },
          { icon: '🗺️', label: 'Map' },
          { icon: '📊', label: 'Details' }
        ]
      case 'Notes':
        return [
          { icon: '📝', label: 'All Notes' },
          { icon: '📁', label: 'Folders' },
          { icon: '➕', label: 'New' },
          { icon: '🔍', label: 'Search' }
        ]
      case 'Music':
        return [
          { icon: '🎵', label: 'Library' },
          { icon: '📻', label: 'Radio' },
          { icon: '🔍', label: 'Search' },
          { icon: '👤', label: 'For You' }
        ]
      case 'Mail':
        return [
          { icon: '📥', label: 'Inbox' },
          { icon: '✉️', label: 'Compose' },
          { icon: '📤', label: 'Sent' },
          { icon: '🗑️', label: 'Trash' }
        ]
      case 'Settings':
        return [
          { icon: '⚙️', label: 'General' },
          { icon: '🔔', label: 'Notifications' },
          { icon: '🔒', label: 'Privacy' },
          { icon: '♿', label: 'Accessibility' }
        ]
      case 'Messages':
        return [
          { icon: '💬', label: 'Chats' },
          { icon: '✏️', label: 'Compose' },
          { icon: '👤', label: 'Contacts' },
          { icon: '🔍', label: 'Search' }
        ]
      default:
        return [
          { icon: '◀', label: 'Back' },
          { icon: '●', label: 'Home' },
          { icon: '■', label: 'Recent' }
        ]
    }
  }
  
  const renderAppUI = (appIndex: number, selectedIdx: number, onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void) => {
    const appName = apps[appIndex]?.name
    
    switch (appName) {
      case 'Clock':
        return <ClockUI appName={appName} selectedIndex={selectedIdx} onNavigate={onNavigate} />
      case 'Maps':
        return <MapsUI appName={appName} selectedIndex={selectedIdx} onNavigate={onNavigate} />
      case 'Photos':
        return <PhotosUI appName={appName} selectedIndex={selectedIdx} onNavigate={onNavigate} />
      case 'Camera':
        return <CameraUI appName={appName} selectedIndex={selectedIdx} onNavigate={onNavigate} />
      case 'Weather':
        return <WeatherUI appName={appName} selectedIndex={selectedIdx} onNavigate={onNavigate} />
      case 'Notes':
        return <NotesUI appName={appName} selectedIndex={selectedIdx} onNavigate={onNavigate} />
      case 'Music':
        return <MusicUI appName={appName} selectedIndex={selectedIdx} onNavigate={onNavigate} />
      case 'Mail':
        return <MailUI appName={appName} selectedIndex={selectedIdx} onNavigate={onNavigate} />
      case 'Settings':
        return <SettingsUI appName={appName} selectedIndex={selectedIdx} onNavigate={onNavigate} />
      case 'Messages':
        return <MessagesUI appName={appName} selectedIndex={selectedIdx} onNavigate={onNavigate} />
      default:
        return (
          <>
            <div className="app-icon-large">
              {apps[appIndex]?.icon}
            </div>
            <p>Swipe up or click trackpad to close</p>
          </>
        )
    }
  }
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
            onClick={() => onAppClick(index)}
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
            <div className="app-close-bar">
              <button className="app-close-button" onClick={onCloseApp} tabIndex={0}>
                <span className="close-icon">✕</span>
                <span className="close-text">Close</span>
              </button>
            </div>
            <div className="app-title">{apps[parseInt(openApp.split('-')[1])]?.name}</div>
          </div>
          <div className="app-content">
            {renderAppUI(parseInt(openApp.split('-')[1]), appSelectedIndex, handleAppNavigate)}
          </div>
          <div className="app-nav-bar">
            {getAppNavItems(apps[parseInt(openApp.split('-')[1])]?.name).map((item, index) => (
              <div key={index} className="nav-item" tabIndex={0}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </div>
            ))}
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
              onClick={() => onAppClick(12 + index)}
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