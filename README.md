# Spider Weight Matching Application

A tournament management system for organizing fighter matches based on weight classes with intelligent matching algorithms.

## Features

- **Fighter Entry Management**: Add fighters with names, team colors, and weights (100-999 range)
- **Smart Weight Matching**: Automatic pairing with exact weight priority and ±3 tolerance range
- **Team Conflict Prevention**: Ensures fighters from same team never face each other
- **Priority Betting System**: High-priority entries get preferential matching
- **Fight Distribution**: Maximum 2 fights per fighter for fair competition
- **Mobile App Ready**: PWA capabilities for mobile installation

## Quick Start

1. **Development**:
   ```bash
   npm install
   npm run dev
   ```

2. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

## Mobile App Installation

### For Users - Installing on Mobile

**Android:**
1. Visit the app URL in Chrome
2. Tap "Add to Home Screen" when prompted
3. App appears on home screen like a native app

**iPhone:**
1. Visit the app URL in Safari
2. Tap Share button → "Add to Home Screen"
3. Confirm installation

## Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects the configuration

2. **Build Settings**:
   - Build Command: `vite build` (auto-configured)
   - Output Directory: `dist/public` (auto-configured)
   - Install Command: `npm install` (auto-configured)

3. **Deploy**:
   - Click "Deploy"
   - Your app will be live at `yourapp.vercel.app`

### Alternative: Netlify Deployment

1. **Connect Repository**:
   - Visit [netlify.com](https://netlify.com)
   - Import your GitHub repository

2. **Build Settings**:
   - Build Command: `vite build`
   - Publish Directory: `dist/public`

3. **Deploy**:
   - Click "Deploy Site"
   - Your app will be live at `yourapp.netlify.app`

## Usage

1. **Add Fighters**: Enter fighter details including weight (100-999 only)
2. **Generate Matches**: Click to automatically create optimal fight pairings
3. **View Results**: See generated matches with fight numbers and weight classes
4. **Manage Tournament**: Clear entries or matches as needed

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Database**: In-memory storage (production-ready for PostgreSQL)
- **UI**: Shadcn/ui components with Tailwind CSS
- **PWA**: Service worker for mobile app functionality

## Weight Matching Algorithm

1. **Priority Processing**: High-priority (betting) entries matched first
2. **Exact Weight**: Perfect weight matches prioritized
3. **Tolerance Range**: ±3 weight difference allowed
4. **Team Avoidance**: Same team conflicts prevented
5. **Fair Distribution**: Maximum 2 fights per fighter

Your app is now ready for deployment and mobile installation!
