import React from 'react'
import './AppUIs.css'

interface AppUIProps {
  appName: string
}

export const ClockUI: React.FC<AppUIProps> = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  const buttons = ['Alarm', 'Timer', 'Stopwatch']
  
  return (
    <div className="clock-ui">
      <div className="digital-clock">
        <span className="time-large">{hours}:{minutes}</span>
        <span className="time-seconds">{seconds}</span>
      </div>
      <div className="clock-date">
        {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </div>
      <div className="clock-actions">
        {buttons.map((button, i) => (
          <div 
            key={i} 
            id={`clock-${button.toLowerCase()}`}
            data-selectable="true"
            className="clock-button"
            tabIndex={0}
          >
            {button}
          </div>
        ))}
      </div>
    </div>
  )
}

export const MapsUI: React.FC<AppUIProps> = () => {
  const locations = ['Current Location', 'Home', 'Work', 'Saved Places']
  
  return (
    <div className="maps-ui">
      <div className="map-container">
        <div className="map-placeholder">
          <div className="map-marker">📍</div>
          <div className="map-grid">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="map-tile" />
            ))}
          </div>
        </div>
      </div>
      <div className="map-search">
        <input 
          id="maps-search"
          data-selectable="true"
          type="text" 
          placeholder="Search for a place..." 
          className="map-search-input" 
        />
      </div>
      <div className="map-quick-actions">
        {locations.map((loc, i) => (
          <div 
            key={i} 
            id={`maps-${loc.toLowerCase().replace(/\s+/g, '-')}`}
            data-selectable="true"
            className="map-action"
            tabIndex={0}
          >
            {loc}
          </div>
        ))}
      </div>
    </div>
  )
}

export const PhotosUI: React.FC<AppUIProps> = () => {
  const photos = Array(12).fill(null)
  
  return (
    <div className="photos-ui">
      <div className="photos-header">
        <h3>Library</h3>
        <div className="photo-count">12 Photos</div>
      </div>
      <div className="photos-grid">
        {photos.map((_, i) => (
          <div 
            key={i} 
            id={`photo-${i}`}
            data-selectable="true"
            className="photo-item"
            tabIndex={0}
          >
            <div className="photo-placeholder">
              🖼️
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const CameraUI: React.FC<AppUIProps> = () => {
  const modes = ['Photo', 'Video', 'Portrait', 'Pano']
  
  return (
    <div className="camera-ui">
      <div className="camera-viewfinder">
        <div className="camera-grid-overlay">
          <div className="grid-line horizontal" />
          <div className="grid-line horizontal" />
          <div className="grid-line vertical" />
          <div className="grid-line vertical" />
        </div>
        <div className="camera-focus-square" />
      </div>
      <div className="camera-controls">
        <div className="camera-modes">
          {modes.map((mode, i) => (
            <div 
              key={i} 
              id={`camera-mode-${mode.toLowerCase()}`}
              data-selectable="true"
              className="camera-mode"
              tabIndex={0}
            >
              {mode}
            </div>
          ))}
        </div>
        <div className="camera-shutter">
          <div 
            id="camera-shutter"
            data-selectable="true"
            className="shutter-button" 
          />
        </div>
      </div>
    </div>
  )
}

export const WeatherUI: React.FC<AppUIProps> = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  
  return (
    <div className="weather-ui">
      <div className="weather-current">
        <div className="weather-location">San Francisco</div>
        <div className="weather-temp">72°</div>
        <div className="weather-condition">Partly Cloudy</div>
        <div className="weather-icon">⛅</div>
      </div>
      <div className="weather-details">
        <div className="weather-detail">
          <span className="detail-label">Feels like</span>
          <span className="detail-value">70°</span>
        </div>
        <div className="weather-detail">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">65%</span>
        </div>
        <div className="weather-detail">
          <span className="detail-label">Wind</span>
          <span className="detail-value">8 mph</span>
        </div>
      </div>
      <div className="weather-forecast">
        {days.map((day, i) => (
          <div 
            key={i} 
            id={`weather-day-${day.toLowerCase()}`}
            data-selectable="true"
            className="forecast-day"
            tabIndex={0}
          >
            <div className="forecast-day-name">{day}</div>
            <div className="forecast-icon">☀️</div>
            <div className="forecast-temp">75°</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const NotesUI: React.FC<AppUIProps> = () => {
  const notes = [
    { title: 'Meeting Notes', preview: 'Discuss Q4 goals...' },
    { title: 'Shopping List', preview: 'Milk, eggs, bread...' },
    { title: 'Ideas', preview: 'App concept for...' },
    { title: 'Todo', preview: 'Call dentist...' }
  ]
  
  return (
    <div className="notes-ui">
      <div className="notes-list">
        {notes.map((note, i) => (
          <div 
            key={i} 
            id={`note-${i}`}
            data-selectable="true"
            className="note-item"
            tabIndex={0}
          >
            <div className="note-title">{note.title}</div>
            <div className="note-preview">{note.preview}</div>
            <div className="note-date">Today</div>
          </div>
        ))}
      </div>
      <div className="note-editor">
        <div className="editor-toolbar">
          <button id="notes-bold" data-selectable="true" className="toolbar-btn">B</button>
          <button id="notes-italic" data-selectable="true" className="toolbar-btn">I</button>
          <button id="notes-underline" data-selectable="true" className="toolbar-btn">U</button>
        </div>
        <textarea 
          id="notes-editor"
          data-selectable="true"
          className="editor-content" 
          placeholder="Start typing..."
          readOnly
        />
      </div>
    </div>
  )
}

export const MusicUI: React.FC<AppUIProps> = () => {
  
  return (
    <div className="music-ui">
      <div className="album-art">
        <div className="album-placeholder">🎵</div>
      </div>
      <div className="track-info">
        <div className="track-title">Awesome Song</div>
        <div className="track-artist">Great Artist</div>
      </div>
      <div className="playback-progress">
        <div className="progress-bar">
          <div className="progress-filled" style={{ width: '40%' }} />
        </div>
        <div className="time-info">
          <span>1:32</span>
          <span>3:45</span>
        </div>
      </div>
      <div className="playback-controls">
        <button id="music-previous" data-selectable="true" className="control-btn">⏮</button>
        <button id="music-play" data-selectable="true" className="control-btn play">▶️</button>
        <button id="music-next" data-selectable="true" className="control-btn">⏭</button>
      </div>
    </div>
  )
}

export const MailUI: React.FC<AppUIProps> = () => {
  const emails = [
    { from: 'Team', subject: 'Project Update', preview: 'The latest updates on...' },
    { from: 'Newsletter', subject: 'Weekly Digest', preview: 'This week in tech...' },
    { from: 'John Doe', subject: 'Meeting Tomorrow', preview: 'Confirming our meeting...' },
    { from: 'Support', subject: 'Ticket Resolved', preview: 'Your issue has been...' }
  ]
  
  return (
    <div className="mail-ui">
      <div className="mail-header">
        <h3>Inbox</h3>
        <div className="mail-count">4 unread</div>
      </div>
      <div className="mail-list">
        {emails.map((email, i) => (
          <div 
            key={i} 
            id={`mail-${i}`}
            data-selectable="true"
            className="mail-item"
            tabIndex={0}
          >
            <div className="mail-from">{email.from}</div>
            <div className="mail-subject">{email.subject}</div>
            <div className="mail-preview">{email.preview}</div>
            <div className="mail-time">2h ago</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const SettingsUI: React.FC<AppUIProps> = () => {
  const settings = [
    { icon: '🔔', title: 'Notifications', value: 'On' },
    { icon: '🔊', title: 'Sound & Haptics', value: '80%' },
    { icon: '🌙', title: 'Display & Brightness', value: 'Auto' },
    { icon: '🔒', title: 'Privacy', value: '' },
    { icon: '📱', title: 'General', value: '' },
    { icon: '♿', title: 'Accessibility', value: '' }
  ]
  
  return (
    <div className="settings-ui">
      <div className="settings-header">
        <h3>Settings</h3>
      </div>
      <div className="settings-list">
        {settings.map((setting, i) => (
          <div 
            key={i} 
            id={`settings-${setting.title.toLowerCase().replace(/[&\s]+/g, '-')}`}
            data-selectable="true"
            className="setting-item"
            tabIndex={0}
          >
            <span className="setting-icon">{setting.icon}</span>
            <span className="setting-title">{setting.title}</span>
            {setting.value && <span className="setting-value">{setting.value}</span>}
            <span className="setting-arrow">›</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const MessagesUI: React.FC<AppUIProps> = () => {
  const conversations = [
    { name: 'Mom', message: 'How are you doing?', time: '2m' },
    { name: 'Work Group', message: 'Meeting at 3pm', time: '1h' },
    { name: 'Jane', message: 'Thanks!', time: '3h' },
    { name: 'Delivery', message: 'Your package has arrived', time: '5h' }
  ]
  
  return (
    <div className="messages-ui">
      <div className="messages-header">
        <h3>Messages</h3>
        <button id="messages-compose" data-selectable="true" className="compose-btn">✏️</button>
      </div>
      <div className="conversations-list">
        {conversations.map((convo, i) => (
          <div 
            key={i} 
            id={`message-${i}`}
            data-selectable="true"
            className="conversation-item"
            tabIndex={0}
          >
            <div className="convo-avatar">{convo.name[0]}</div>
            <div className="convo-details">
              <div className="convo-name">{convo.name}</div>
              <div className="convo-message">{convo.message}</div>
            </div>
            <div className="convo-time">{convo.time}</div>
          </div>
        ))}
      </div>
      <div className="message-input-area">
        <input 
          id="messages-input"
          data-selectable="true"
          type="text" 
          placeholder="Type a message..." 
          className="message-input" 
        />
        <button id="messages-send" data-selectable="true" className="send-btn">→</button>
      </div>
    </div>
  )
}

export const PhoneUI: React.FC<AppUIProps> = () => {
  const recentCalls = [
    { name: 'Mom', time: '10:30 AM', type: 'outgoing' },
    { name: 'Unknown', number: '(555) 987-6543', time: '9:15 AM', type: 'missed' },
    { name: 'John Doe', time: 'Yesterday', type: 'incoming' }
  ]
  
  return (
    <div className="phone-ui">
      <div className="phone-tabs">
        <div id="phone-favorites" data-selectable="true" className="phone-tab">⭐ Favorites</div>
        <div id="phone-recents" data-selectable="true" className="phone-tab active">🕐 Recents</div>
        <div id="phone-contacts" data-selectable="true" className="phone-tab">👤 Contacts</div>
        <div id="phone-keypad" data-selectable="true" className="phone-tab">🔢 Keypad</div>
      </div>
      
      <div className="phone-content">
        <div className="recent-calls">
          {recentCalls.map((call, i) => (
            <div 
              key={i} 
              id={`call-${i}`}
              data-selectable="true"
              className="call-item"
            >
              <div className={`call-icon ${call.type}`}>
                {call.type === 'missed' ? '📵' : call.type === 'outgoing' ? '📱' : '📞'}
              </div>
              <div className="call-info">
                <div className="call-name">{call.name || call.number}</div>
                <div className="call-time">{call.time}</div>
              </div>
              <div id={`call-action-${i}`} data-selectable="true" className="call-action">ℹ️</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="phone-dial-button">
        <div id="phone-dial" data-selectable="true" className="dial-button">
          📞
        </div>
      </div>
    </div>
  )
}

export const SafariUI: React.FC<AppUIProps> = () => {
  const bookmarks = [
    { name: 'Google', url: 'google.com', icon: '🔍' },
    { name: 'YouTube', url: 'youtube.com', icon: '📺' },
    { name: 'GitHub', url: 'github.com', icon: '💻' },
    { name: 'Twitter', url: 'twitter.com', icon: '🐦' }
  ]
  
  const suggestions = [
    'Latest news',
    'Weather today',
    'Nearby restaurants',
    'Movie times'
  ]
  
  return (
    <div className="safari-ui">
      <div className="safari-header">
        <div className="url-bar">
          <div id="safari-back" data-selectable="true" className="nav-button">←</div>
          <div id="safari-forward" data-selectable="true" className="nav-button">→</div>
          <input 
            id="safari-url"
            data-selectable="true"
            type="text" 
            placeholder="Search or enter website name" 
            className="url-input" 
          />
          <div id="safari-refresh" data-selectable="true" className="nav-button">↻</div>
        </div>
      </div>
      
      <div className="safari-content">
        <div className="safari-welcome">
          <h2>Welcome to Safari</h2>
          <div className="bookmarks-grid">
            {bookmarks.map((bookmark, i) => (
              <div 
                key={i} 
                id={`bookmark-${i}`}
                data-selectable="true"
                className="bookmark-item"
              >
                <div className="bookmark-icon">{bookmark.icon}</div>
                <div className="bookmark-name">{bookmark.name}</div>
              </div>
            ))}
          </div>
          
          <div className="suggestions">
            <h3>Suggested Searches</h3>
            {suggestions.map((suggestion, i) => (
              <div 
                key={i} 
                id={`suggestion-${i}`}
                data-selectable="true"
                className="suggestion-item"
              >
                🔍 {suggestion}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="safari-toolbar">
        <div id="safari-share" data-selectable="true" className="toolbar-button">↗️</div>
        <div id="safari-bookmarks" data-selectable="true" className="toolbar-button">📚</div>
        <div id="safari-tabs" data-selectable="true" className="toolbar-button">⧉</div>
      </div>
    </div>
  )
}