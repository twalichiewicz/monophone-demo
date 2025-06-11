import React from 'react'
import './MobileOS.css'

interface MobileOSProps {
  selectedIndex: number
  isPressed: boolean
}

const apps = [
  { name: 'Messages', icon: '💬', color: '#2ecc71' },
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
  { name: 'Safari', icon: '🌐', color: '#3498db' },
]

const MobileOS: React.FC<MobileOSProps> = ({ selectedIndex, isPressed }) => {
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
      
      <div className="app-grid">
        {apps.map((app, index) => (
          <div
            key={index}
            className={`app-icon ${selectedIndex === index ? 'selected' : ''} ${
              selectedIndex === index && isPressed ? 'pressed' : ''
            }`}
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
      
      <div className="dock">
        <div className="dock-apps">
          <div className="dock-app">📞</div>
          <div className="dock-app">✉️</div>
          <div className="dock-app">🌐</div>
          <div className="dock-app">🎵</div>
        </div>
      </div>
    </div>
  )
}

export default MobileOS