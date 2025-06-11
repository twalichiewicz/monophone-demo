# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `npm run dev` - Start Vite development server with hot module reloading
- `npm run build` - Run TypeScript compiler and build for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Architecture Overview

This is a React mobile phone simulator demo that mimics a spatial navigation interface. The app is designed to run only on mobile devices and features:

### Core Components
- **App.tsx**: Main controller handling navigation state, haptic feedback, and app lifecycle
- **PhoneMockup**: Container component that frames the mobile OS interface
- **MobileOS**: Renders the app grid and dock, manages app animations
- **TrackNub**: Touch-based omnidirectional navigation control with gesture recognition
- **SpatialView**: Alternative navigation view triggered by long press
- **DesktopModal**: Displays when accessed from desktop, prompting mobile usage

### Key Features
- Omnidirectional navigation using trackpad-style input with 4x3 app grid + 3 dock items
- Haptic feedback integration via Navigator.vibrate API
- Click sound variations managed through audioUtils
- Screen flip functionality (app at index 11)
- App open/close animations with 300ms transitions

### Deployment
Configured for GitHub Pages deployment with base path `/monophone-demo/` set in vite.config.ts