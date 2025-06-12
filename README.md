# Monophone Demo

A mobile-first prototype exploring spatial navigation interfaces for touchscreen devices. This demo showcases an innovative trackpad-style input method designed specifically for one-handed mobile use.

## 🎯 Overview

Monophone Demo reimagines mobile navigation by introducing a compact trackpad interface in the bottom-right corner of the screen. This allows users to navigate through apps and interfaces using swipe gestures rather than direct touch, similar to how a laptop trackpad works.

## 🚀 Features

- **Spatial Navigation**: Navigate through apps using omnidirectional swipe gestures
- **Haptic Feedback**: Feel subtle vibrations as you navigate between items
- **Audio Feedback**: Custom click sounds with variations for a more natural feel
- **App Demonstrations**: 11 demo apps showing how different interfaces work with spatial navigation:
  - Clock, Maps, Photos, Camera, Weather, Notes, Music, Mail, Settings, Messages, and a special Flip app
- **Gesture Controls**:
  - Swipe to navigate between apps
  - Tap to select/open
  - Long press for additional options
  - Screen rotation with the Flip app

## 🛠️ Technical Stack

- **React 19.1.0** with TypeScript
- **Vite** for fast development and building
- **Web Audio API** for dynamic sound generation
- **Vibration API** for haptic feedback
- **CSS-in-JS** for dynamic styling
- **QR Code generation** for easy mobile access

## 📱 Usage

This prototype is designed exclusively for mobile devices. To use it:

1. Visit the demo on your mobile phone
2. Lock your screen orientation to portrait mode
3. Use the trackpad in the bottom-right corner to navigate
4. Tap the trackpad to select items

### Trackpad Controls
- **Swipe Up/Down/Left/Right**: Navigate between apps
- **Tap**: Open selected app or perform action
- **Long Press**: Activate spatial view mode

## 🏃‍♂️ Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
git clone https://github.com/twalichiewicz/monophone-demo.git
cd monophone-demo
npm install
```

### Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎨 Design Philosophy

The Monophone interface explores how we might interact with mobile devices if we treated them more like precision instruments rather than direct-touch surfaces. By adding a layer of indirection through the trackpad, users can:

- Navigate without obscuring content with their fingers
- Access the entire screen with one-handed use
- Develop muscle memory for common navigation patterns
- Experience a more deliberate, controlled interaction model

## 🌐 Deployment

The demo is configured for deployment to GitHub Pages. The production build uses the `/monophone-demo/` base path.

## 📄 License

MIT
