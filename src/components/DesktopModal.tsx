import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import './DesktopModal.css'

const DesktopModal: React.FC = () => {
  const currentUrl = window.location.href
  
  return (
    <div className="desktop-modal-overlay">
      <div className="desktop-modal">
        <div className="modal-icon">📱</div>
        <h1>Mobile Experience Only</h1>
        <p className="modal-subtitle">
          This prototype is designed for mobile devices.
        </p>
        <div className="qr-code-container">
          <QRCodeSVG 
            value={currentUrl} 
            size={200}
            level="H"
            includeMargin={true}
            bgColor="#1a1a1a"
            fgColor="#ffffff"
          />
        </div>
        <div className="modal-instructions">
          <div className="instruction-item">
            <span className="instruction-number">1</span>
            <span>Scan QR code or visit this page on your phone</span>
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
          <p className="url-hint">Or visit:</p>
          <code className="current-url">{currentUrl}</code>
        </div>
      </div>
    </div>
  )
}

export default DesktopModal