import React from 'react'
import './SpatialView.css'

interface SpatialViewProps {
  onClose: () => void
}

const SpatialView: React.FC<SpatialViewProps> = ({ onClose }) => {
  return (
    <div className="spatial-view">
      <div className="spatial-background">
        <div className="spatial-grid"></div>
        <div className="spatial-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>
      
      <div className="spatial-content">
        <div className="glass-panel main-panel">
          <h1 className="spatial-title">Spatial Interface</h1>
          <p className="spatial-subtitle">Welcome to your AR/VR workspace</p>
          
          <div className="spatial-cards">
            <div className="glass-card">
              <div className="card-icon">🎯</div>
              <h3>Focus Mode</h3>
              <p>Enhanced productivity view</p>
            </div>
            <div className="glass-card">
              <div className="card-icon">🌐</div>
              <h3>World View</h3>
              <p>Explore spatial content</p>
            </div>
            <div className="glass-card">
              <div className="card-icon">💬</div>
              <h3>AI Assistant</h3>
              <p>Chat with intelligent agents</p>
            </div>
          </div>
        </div>
        
        <div className="glass-panel side-panel">
          <h2>Quick Actions</h2>
          <div className="action-list">
            <div className="action-item">
              <span className="action-icon">📱</span>
              <span>Phone Mode</span>
            </div>
            <div className="action-item">
              <span className="action-icon">🖼️</span>
              <span>Gallery</span>
            </div>
            <div className="action-item">
              <span className="action-icon">⚙️</span>
              <span>Settings</span>
            </div>
          </div>
        </div>
      </div>
      
      <button className="spatial-close" onClick={onClose}>
        <span>✕</span>
      </button>
    </div>
  )
}

export default SpatialView