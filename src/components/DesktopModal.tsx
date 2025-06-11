import React from 'react'
import './DesktopModal.css'

const DesktopModal: React.FC = () => {
  return (
    <div className="desktop-modal-overlay">
      <div className="desktop-modal">
        <div className="modal-icon">📱</div>
        <h1>Mobile Experience Only</h1>
        <p className="modal-subtitle">
          This prototype is designed for mobile devices.
        </p>
        <div className="modal-instructions">
          <div className="instruction-item">
            <span className="instruction-number">1</span>
            <span>Visit this page on your phone</span>
          </div>
          <div className="instruction-item">
            <span className="instruction-number">2</span>
            <span>Lock screen orientation to portrait</span>
          </div>
          <div className="instruction-item">
            <span className="instruction-number">3</span>
            <span>Use the TrackNub in the bottom right to navigate</span>
          </div>
        </div>
        <div className="modal-footer">
          <p className="url-hint">Scan QR code or visit:</p>
          <code className="current-url">{window.location.href}</code>
        </div>
      </div>
    </div>
  )
}

export default DesktopModal