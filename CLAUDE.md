# CLAUDE.md — ChefMatch

## Project Overview
**ChefMatch** is a mobile marketplace app that connects consumers with personal chefs for in-home dining experiences using a swipe-based discovery mechanic (think Tinder for personal chefs). It differentiates from existing platforms by making chef discovery fun and accessible, and by opening the market to both classically trained chefs and talented home cooks.

- **Type:** Mobile App (React Native + Expo)
- **Stack:** TypeScript, React Native (Expo), Supabase (PostgreSQL + Auth + Storage + Realtime), Checkr API
- **Package Manager:** npm
- **Target:** iOS and Android via Expo Application Services (EAS)
- **Status:** Phase 1 — Foundation

## Directory Structure
```
chefmatch/
├── .github/workflows/       # CI/CD (future)
├── src/
│   ├── api/                 # Supabase client setup, API helper functions
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Buttons, inputs, cards, modals
│   │   ├── chef/            # Chef-specific components (profile card, menu editor)
│   │   └── consumer/        # Consumer-specific components (swipe card, filters)
│   ├── screens/             # Screen components (one per route)
│   │   ├── auth/            # Login, signup, onboarding
│   │   ├── chef/            # Chef dashboard, profile setup, bookings
│   │   ├── consumer/        # Discovery feed, booking flow, matches
│   │   └── shared/          # Settings, messaging, reviews
│   ├── navigation/          # React Navigation stack/tab definitions
│   ├── hooks/               # Custom React hooks
│   ├── models/              # TypeScript types and interfaces
│   ├── services/            # External service integrations (Supabase, Checkr)
│   ├── utils/               # Pure utility functions
│   ├── config/              # Environment config, constants, theme
│   └── assets/              # Images, fonts, static files
├── tests/
│   ├── unit/                # Unit tests mirroring src/ structure
│   ├── integration/         # End-to-end and integration tests
│   ├── fixtures/            # Mock data for tests
│   └── setup.ts             # Jest setup file
├── docs/                    # Architecture decisions, API docs
├── scripts/                 # Utility scripts (DB seed, migrations)
├── .env.example             # Environment variable template
├── app.json                 # Expo configuration
├── babel.config.js          # Babel configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
├── CLAUDE.md                # This file
├── PRD.md                   # Product requirements document
└── README.md                # Project README
```

## Session Protocol

### Starting a Session
1. Read this CLAUDE.md fully
2. Read PRD.md to understand current scope and phase
3. Check `git log --oneline -10` for recent work
4. Check the Current TODOs section below for pending items
5. Summarize what was done last and what's next

### Mid-Session Rules
- Commit after completing each meaningful unit of work
- Run tests before committing — never commit failing tests
- Update the Design Decisions Log when making architectural choices
- Update Gotchas Log when discovering unexpected behavior
- Keep commits focused — one logical change per commit

### Ending a Session
1. Run all tests and confirm they pass
2. Commit any uncommitted work
3. Update the Current TODOs section below
4. Update the Design Decisions Log if any new decisions were made
5. Provide a brief summary of what was accomplished

## Communication Preferences
- Be direct and concise — no filler
- When presenting options, give a recommendation with reasoning
- Flag scope creep immediately — check PRD "What's NOT In" before adding features
- If something will take significantly longer than expected, say so upfront
- Use technical language freely — Gary is a developer

## Coding Standards

### TypeScript
- Strict mode enabled — no `any` types unless absolutely necessary (and document why)
- Use interfaces over type aliases for object shapes
- Use enums for fixed sets of values (chef tier, booking status, etc.)
- Prefer named exports over default exports
- File naming: `kebab-case.ts` for utilities, `PascalCase.tsx` for components

### React Native
- Functional components only — no class components
- Use React Navigation for routing
- Use custom hooks to encapsulate business logic — keep components thin
- StyleSheet.create for all styles (no inline style objects)
- Components should be self-contained — props in, UI out

### Supabase
- All database queries go through `src/services/` — never call Supabase directly from components
- Use Row Level Security (RLS) for all tables
- Type-generate from Supabase schema — don't manually define DB types
- Handle errors explicitly — no silent swallows

### Testing
- Test framework: Jest + React Native Testing Library
- Test files live in `tests/` mirroring `src/` structure
- Name pattern: `*.test.ts` or `*.test.tsx`
- Test behavior, not implementation — focus on what the user sees and does
- Every new service function needs at least one test

### Git
- Commit messages: `type: description` (feat, fix, refactor, test, docs, chore)
- Branch naming: `feature/short-description`, `fix/short-description`
- No force pushes to main

## Design Decisions Log
| Date | Decision | Context | Alternatives Considered |
|------|----------|---------|------------------------|
| 2026-03-01 | React Native + Expo | Cross-platform from single codebase, previous build used same stack — failure was architectural not technological | Flutter (less JS ecosystem), native iOS+Android (double the work) |
| 2026-03-01 | Supabase for backend | PostgreSQL + Auth + Storage + Realtime in one platform, generous free tier, good React Native SDK | Firebase (NoSQL less suited for relational data), custom backend (too much work for MVP) |
| 2026-03-01 | TypeScript over JavaScript | Type safety critical for marketplace with multiple user roles and complex state | JavaScript (faster initially but harder to maintain) |
| 2026-03-01 | No payment processing in v1.0 | Reduces complexity, legal burden, and time-to-market. Venmo/Zelle works for early adopters | Stripe integration (adds weeks of work and compliance requirements) |
| 2026-03-01 | Two chef tiers (Classically Trained / Home Chef) | Opens supply side dramatically, makes platform accessible at lower price points | Single tier (limits supply), three+ tiers (overcomplicates onboarding) |
| 2026-03-02 | Like = instant match (no two-sided matching) | Simplifies MVP — consumer swipe-right creates a conversation immediately | Two-sided matching (adds complexity, delays engagement) |
| 2026-03-02 | Skip location filtering for MVP | Launching in one metro area, all live chefs shown | Geo-filtering (adds complexity, not needed for single-city launch) |
| 2026-03-02 | Photos optional for going live in MVP | Reduces friction for chef onboarding during early testing | Required photos (add back before production) |

## Gotchas Log
| Date | Issue | Resolution |
|------|-------|------------|
| 2026-03-02 | Supabase crash: "Cannot assign to property 'protocol' which has only a getter" | Hermes URL implementation is read-only. Import `react-native-url-polyfill/auto` as first line in App.tsx (entry point), not in supabase.ts — module evaluation order means supabase.ts import may run before the polyfill if placed there. |
| 2026-03-02 | Worklets version mismatch (JS 0.7.4 vs native 0.5.1) | Use `npx expo install` to resolve SDK-compatible versions of reanimated, gesture-handler, and worklets. Don't manually pin versions — let Expo resolve them. Add react-native-worklets as explicit dep. |
| 2026-03-02 | "main has not been registered" crash on launch | With `"main": "./src/App.tsx"` in package.json, we bypass Expo's AppEntry.js wrapper. Must call `registerRootComponent(App)` explicitly in App.tsx. |
| 2026-03-02 | expo-router causing transform.routerRoot in bundle URL | Uninstall expo-router if not using file-based routing. The param is injected by @expo/metro-config unconditionally but is inert without expo-router installed. |

## Current TODOs
- [ ] Set up Supabase project and configure environment variables
- [ ] Design database schema (users, chefs, consumers, bookings, reviews, messages)
- [x] Implement authentication flow (signup/login with Supabase Auth)
- [x] Build chef onboarding screens (profile creation, photo upload, menu setup)
- [x] Build swipe-based discovery UI
- [x] Upgrade Expo SDK 52 → 54 (React Native 0.81.5, React 19.1.0)
- [x] Fix Expo Go launch issues (URL polyfill, worklets, registerRootComponent)
- [x] Route live chefs to home screen after onboarding
- [ ] Build messaging UI (conversations list + chat screen)
- [ ] Build consumer profile screen (edit allergies, preferences)
- [ ] Build booking flow (request → confirm → complete)
- [ ] Re-add photo requirement for going live before production launch
