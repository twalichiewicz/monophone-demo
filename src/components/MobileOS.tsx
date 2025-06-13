import React from 'react'
import './MobileOS.css'
import { ClockUI, MapsUI, PhotosUI, CameraUI, WeatherUI, NotesUI, MusicUI, MailUI, SettingsUI, MessagesUI, PhoneUI, SafariUI } from './AppUIs'

interface MobileOSProps {
  selectedIndex: number
  isPressed: boolean
  openApp: string | null
  isAnimating: boolean
  selectedElementId?: string | null
  onAppClick: (index: number) => void
  onCloseApp: () => void
  cursorPosition?: { x: number; y: number }
  hoveredIndex?: number | null
  cursorVisible?: boolean
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
  { name: 'Mail', icon: '✉️', color: '#007AFF' },
]

const MobileOS: React.FC<MobileOSProps> = ({ selectedIndex, isPressed, openApp, isAnimating, onAppClick, onCloseApp, cursorPosition, hoveredIndex, cursorVisible }) => {
  
  const getAppNavItems = (appName: string) => {
    // Handle dock apps
    if (appName === 'Phone' || appName === 'Safari') {
      return []
    }
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
  
  const renderAppUI = (appIndex: number) => {
    let appName: string
    
    // Check if it's a dock app
    if (appIndex >= 12) {
      appName = dockApps[appIndex - 12]?.name
    } else {
      appName = apps[appIndex]?.name
    }
    
    switch (appName) {
      case 'Phone':
        return <PhoneUI appName={appName} />
      case 'Safari':
        return <SafariUI appName={appName} />
      case 'Clock':
        return <ClockUI appName={appName} />
      case 'Maps':
        return <MapsUI appName={appName} />
      case 'Photos':
        return <PhotosUI appName={appName} />
      case 'Camera':
        return <CameraUI appName={appName} />
      case 'Weather':
        return <WeatherUI appName={appName} />
      case 'Notes':
        return <NotesUI appName={appName} />
      case 'Music':
        return <MusicUI appName={appName} />
      case 'Mail':
        return <MailUI appName={appName} />
      case 'Settings':
        return <SettingsUI appName={appName} />
      case 'Messages':
        return <MessagesUI appName={appName} />
      default: {
        const icon = appIndex >= 12 ? dockApps[appIndex - 12]?.icon : apps[appIndex]?.icon
        return (
          <>
            <div className="app-icon-large">
              {icon}
            </div>
            <p>Swipe up or click trackpad to close</p>
          </>
        )
      }
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
          <span className="signal">•••</span>
          <span className="wifi">))))</span>
          <span className="battery">100%</span>
        </div>
      </div>
      
      <div className="lock-screen">
        <div className="date">{currentDate}</div>
        <div className="time">{currentTime}</div>
      </div>
      
      {/* Floating cursor */}
      {cursorPosition && (
        <div 
          className={`floating-cursor ${cursorVisible ? 'visible' : 'hidden'}`}
          style={{
            position: 'absolute',
            left: `${cursorPosition.x}%`,
            top: `${cursorPosition.y}%`,
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9999,
            boxShadow: `
              0 0 20px rgba(0, 122, 255, 0.6),
              0 0 40px rgba(0, 122, 255, 0.4),
              0 0 60px rgba(0, 122, 255, 0.2),
              inset 0 0 10px rgba(255, 255, 255, 0.5),
              0 2px 4px rgba(0, 0, 0, 0.3)
            `
          }}
        />
      )}
      
      <div className={`app-grid ${openApp ? 'hidden' : ''}`}>
        {apps.map((app, index) => (
          <div
            key={index}
            className={`app-icon ${
              cursorVisible && hoveredIndex === index ? 'selected' : 
              !cursorVisible && selectedIndex === index ? 'selected' : ''
            } ${
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
          '--app-color': parseInt(openApp.split('-')[1]) >= 12 
            ? dockApps[parseInt(openApp.split('-')[1]) - 12]?.color 
            : apps[parseInt(openApp.split('-')[1])]?.color || '#333'
        } as React.CSSProperties}>
          <div className="app-header">
            <div className="app-close-bar">
              <button 
                id="app-close-button"
                className="app-close-button" 
                onClick={onCloseApp} 
                data-selectable="true"
              >
                <span className="close-icon">×</span>
                <span className="close-text">Close</span>
              </button>
            </div>
            <div className="app-title">
              {parseInt(openApp.split('-')[1]) >= 12 
                ? dockApps[parseInt(openApp.split('-')[1]) - 12]?.name
                : apps[parseInt(openApp.split('-')[1])]?.name}
            </div>
          </div>
          <div className="app-content">
            {renderAppUI(parseInt(openApp.split('-')[1]))}
          </div>
          {getAppNavItems(
            parseInt(openApp.split('-')[1]) >= 12 
              ? dockApps[parseInt(openApp.split('-')[1]) - 12]?.name
              : apps[parseInt(openApp.split('-')[1])]?.name
          ).length > 0 && (
            <div className="floating-options">
              {getAppNavItems(
                parseInt(openApp.split('-')[1]) >= 12 
                  ? dockApps[parseInt(openApp.split('-')[1]) - 12]?.name
                  : apps[parseInt(openApp.split('-')[1])]?.name
              ).map((item, index) => (
                <div 
                  key={index} 
                  id={`floating-option-${index}`}
                  className="floating-option" 
                  data-selectable="true"
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className={`dock ${openApp ? 'hidden' : ''}`}>
        <div className="dock-apps">
          {dockApps.map((app, index) => (
            <div
              key={index}
              className={`dock-item dock-app ${
                cursorVisible && hoveredIndex === 12 + index ? 'selected' : 
                !cursorVisible && selectedIndex === 12 + index ? 'selected' : ''
              } ${
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