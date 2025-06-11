import React from 'react'
import './PhoneMockup.css'

interface PhoneMockupProps {
  children: React.ReactNode
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ children }) => {
  return (
    <div className="phone-mockup">
      <div className="phone-frame">
        <div className="phone-speaker"></div>
        <div className="phone-screen">
          {children}
        </div>
        <div className="phone-home-indicator"></div>
      </div>
    </div>
  )
}

export default PhoneMockup