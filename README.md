# ChefMatch

A swipe-based mobile marketplace connecting consumers with personal chefs for in-home dining experiences.

## Status
Phase 1 — Foundation (In Development)

## Overview
ChefMatch makes finding a personal chef fun and accessible. Instead of browsing traditional directories, consumers swipe through chef profiles — discovering their style, cuisine, and pricing in an engaging, visual way.

The platform uniquely supports two tiers of chefs: classically trained professionals and talented home cooks. This dramatically expands supply and makes in-home chef experiences accessible for regular date nights, not just $1,600+ special occasions.

ChefMatch handles the full flow from discovery to booking: swipe to discover, match to connect, message to plan, and book to confirm.

## Tech Stack
- **Frontend:** React Native (Expo) with TypeScript
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Background Checks:** Checkr API
- **Deployment:** Expo Application Services (EAS)
- **Testing:** Jest + React Native Testing Library

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator, or Expo Go on a physical device

### Installation
```bash
# Clone the repo
git clone <repo-url>
cd chefmatch

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your Supabase and Checkr credentials
```

### Running
```bash
# Start the Expo development server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Project Structure
```
src/
├── api/          # Supabase client and API helpers
├── components/   # Reusable UI components (common, chef, consumer)
├── screens/      # Screen components (auth, chef, consumer, shared)
├── navigation/   # React Navigation definitions
├── hooks/        # Custom React hooks
├── models/       # TypeScript types and interfaces
├── services/     # External service integrations
├── utils/        # Shared utility functions
└── config/       # Configuration and constants
```

See CLAUDE.md for detailed directory documentation and coding standards.

## Contributing
This is a personal project built by Gary with Claude Code. See CLAUDE.md for coding standards and conventions.

## License
TBD
