# PRD: ChefMatch

## Document Info
- **Author:** Gary
- **Created:** 2026-03-01
- **Status:** Draft
- **Last Updated:** 2026-03-01

## Problem Statement
Finding a personal chef for an in-home dining experience is surprisingly difficult for regular consumers. Existing platforms use traditional directory-style browsing, focus exclusively on high-end professionally trained chefs ($1,600+ per event), and offer no fun or engaging discovery experience. There is no platform that makes chef discovery intuitive, visual, and accessible for regular date nights and family occasions — and no platform that opens the market to talented home cooks alongside classically trained professionals.

## Target User

### Consumers
Couples and families looking for special occasion dining at home — date nights, birthdays, anniversaries, dinner parties. Primarily dual-income households with disposable income but limited time. They want an easy, fun way to discover and book a personal chef without the formality of existing high-end platforms.

### Chefs
Two distinct segments:
1. **Classically Trained:** Professional chefs looking for freelance income outside traditional restaurant work
2. **Home Chefs:** Talented home cooks looking to monetize their skills in the gig economy, entering at a lower price point

## Success Metrics
- **Primary:** 10 completed bookings in the Lake Wylie/Charlotte metro area within 90 days of launch
- **Supply-side:** 20-30 onboarded chef profiles before consumer launch
- **Engagement:** 50%+ of matched pairs proceed to the messaging/booking stage
- **Retention:** At least 3 repeat bookings within the first 90 days

## Competitive Landscape

| Platform | Model | Key Strength | Key Weakness | Price Range |
|----------|-------|-------------|--------------|-------------|
| Yhangry | Browse/filter/book | Expanding to US (50 locations), £800K funding | UK-focused, no discovery mechanic | £30+/head |
| Take a Chef | Browse/filter/book | Global (4,000+ chefs, 100 countries) | Traditional directory, not engaging | $60-200/person |
| CHEFIN | Algorithm matching | Claims largest platform | Premium pricing, high-end only | $1,600+ for up to 10 |
| Table at Home | Bid/proposal | Accepts amateur chefs | 6 US cities only, slow proposal model | Varies |
| Gradito | Curated high-end | Strong vetting, sommelier add-ons | Very premium, limited accessibility | $1,600+ |

**ChefMatch's Gap:** No platform uses a swipe/match discovery mechanic. No platform tiers chefs by training level to expand supply and accessibility. ChefMatch combines both.

## MVP Scope — What's In

### Feature 1: Swipe-Based Chef Discovery
- **Description:** Consumers browse chef profiles by swiping through cards showing photos, bio, cuisine style, chef tier, and price range
- **User story:** As a consumer, I want to swipe through chef profiles so that I can quickly and enjoyably find a chef that matches my taste and budget
- **Acceptance criteria:**
  - [ ] Swipe right to express interest, left to pass
  - [ ] Cards display chef photo, name, cuisine specialties, tier badge, and price range
  - [ ] Smooth, native-feeling swipe animation (no jank or lag)
  - [ ] Cards are filtered by location (chef's service area includes consumer's location)
  - [ ] Deck refreshes with new profiles when exhausted
- **Priority:** Must-have

### Feature 2: Chef Profiles with Two Tiers
- **Description:** Chef profiles include all information needed for a consumer to make a decision, with clear distinction between Classically Trained and Home Chef tiers
- **User story:** As a consumer, I want to see a chef's full profile so that I can assess their skills, style, and pricing before booking
- **Acceptance criteria:**
  - [ ] Profile includes: photos (up to 10), bio, cuisine specialties, sample menus, pricing, tier badge, reviews
  - [ ] Classically Trained tier shows credentials and experience
  - [ ] Home Chef tier shows specialties and progression level
  - [ ] Profile is viewable from the swipe card via tap
- **Priority:** Must-have

### Feature 3: Allergy Management
- **Description:** Both consumers and chefs declare allergies and dietary restrictions during onboarding. The system flags conflicts before any booking can proceed
- **User story:** As a consumer with allergies, I want the app to warn me about potential allergen conflicts so that I can dine safely
- **Acceptance criteria:**
  - [ ] Consumer onboarding captures all allergies and dietary restrictions
  - [ ] Chef onboarding captures allergens they commonly work with and cannot accommodate
  - [ ] System flags conflicts when a consumer views a chef profile (visible warning)
  - [ ] Conflicts are re-checked before booking confirmation
  - [ ] Common allergens from a standard list (FDA top 9) plus free-text entry
- **Priority:** Must-have

### Feature 4: Booking Flow with In-App Messaging
- **Description:** After a mutual match, the consumer and chef can message each other to plan the event, then confirm a booking
- **User story:** As a consumer, I want to message my matched chef to discuss my event details and finalize the booking
- **Acceptance criteria:**
  - [ ] Match triggers a notification to both parties
  - [ ] Real-time messaging via Supabase Realtime
  - [ ] Consumer proposes: date, time, party size, occasion, and any special requests
  - [ ] Chef can accept, counter-propose, or decline
  - [ ] Both parties confirm to finalize the booking
  - [ ] Booking summary visible to both parties after confirmation
- **Priority:** Must-have

### Feature 5: Flexible Service Models
- **Description:** Two service models available per booking — full-service (chef brings everything) or collaborative (diner shops from chef's grocery list)
- **User story:** As a consumer, I want to choose whether the chef brings all ingredients or I shop from their list, so I can control cost and involvement
- **Acceptance criteria:**
  - [ ] Chef sets which service models they offer on their profile
  - [ ] Consumer selects preferred model during booking flow
  - [ ] Collaborative model: chef provides a grocery list, consumer confirms they've shopped
  - [ ] Full-service model: chef handles all procurement
  - [ ] Pricing reflects the selected model
- **Priority:** Must-have

### Feature 6: Background Checks
- **Description:** All chefs must pass a background check via Checkr before their profile goes live
- **User story:** As a consumer, I want to know that every chef on the platform has been background checked so I feel safe inviting them into my home
- **Acceptance criteria:**
  - [ ] Checkr integration initiated during chef onboarding
  - [ ] Chef profile shows "Background Check Verified" badge after passing
  - [ ] Chef cannot appear in consumer discovery feed until check clears
  - [ ] Failed checks result in rejection with explanation
  - [ ] Checks are renewed annually
- **Priority:** Must-have

### Feature 7: Chef Onboarding Training
- **Description:** Mandatory training module that all chefs must complete before going live, covering food safety, platform policies, and professionalism
- **User story:** As a platform operator, I want all chefs to complete training so that service quality is consistent and safety standards are met
- **Acceptance criteria:**
  - [ ] Training content is presented in-app (not external link)
  - [ ] Module includes: food safety basics, allergen handling, platform policies, in-home etiquette
  - [ ] Quiz at the end — must score 80%+ to pass
  - [ ] Chef cannot go live until both training and background check are complete
  - [ ] Training completion is tracked and visible in admin view
- **Priority:** Must-have

### Feature 8: Home Chef Quality Control
- **Description:** Home chefs start with access to small events only and earn access to larger events through successful completion and positive reviews
- **User story:** As a platform operator, I want home chefs to prove themselves with small events before taking on larger ones, to manage quality risk
- **Acceptance criteria:**
  - [ ] Home chefs initially limited to events of 4 or fewer guests
  - [ ] After 3 successful events with 4+ star average rating, unlock events up to 8 guests
  - [ ] After 8 successful events with 4+ star average rating, unlock events up to 12 guests
  - [ ] Classically Trained chefs have no event size restrictions
  - [ ] Progression is visible on the chef's dashboard
- **Priority:** Must-have

### Feature 9: Reviews and Ratings
- **Description:** Both consumers and chefs can rate and review each other after a completed booking
- **User story:** As a consumer, I want to read reviews of chefs before booking, and leave my own review after the experience
- **Acceptance criteria:**
  - [ ] Review prompt appears 24 hours after event date
  - [ ] 1-5 star rating plus text review
  - [ ] Both parties can review each other (bidirectional)
  - [ ] Reviews are public on profiles
  - [ ] Average rating displayed on chef's swipe card
  - [ ] Minimum 3 reviews before average is shown (prevents single-review skew)
- **Priority:** Must-have

### Feature 10: Dietary and Cuisine Filters
- **Description:** Consumers can filter the discovery feed by location, cuisine type, occasion, dietary needs, and budget
- **User story:** As a consumer, I want to filter chefs by my preferences so I only see relevant profiles
- **Acceptance criteria:**
  - [ ] Filter by: location/radius, cuisine type (multi-select), occasion type, dietary restrictions, budget range, chef tier
  - [ ] Filters persist across sessions
  - [ ] Filters reduce the swipe deck to matching chefs only
  - [ ] Clear indication when no chefs match current filters
  - [ ] Easy to reset all filters
- **Priority:** Must-have

## MVP Scope — What's NOT In
These are explicitly deferred to v2.0+ to prevent scope creep:

- **Payment processing** — Use Venmo/Zelle/cash for v1.0. Adding Stripe adds weeks of work and compliance requirements.
- **AI-powered matching algorithms** — Simple filters work at small scale. AI recommendations come after we have swipe data to train on.
- **Waiter/server booking add-on** — Nice future feature, but not needed for MVP.
- **Grocery delivery integration** — Collaborative model just provides a list; consumer shops on their own.
- **Analytics dashboard** — No admin dashboard in v1.0. Use Supabase dashboard directly for metrics.
- **Web version** — Mobile app only. 98% of swipe-based app usage is mobile.
- **Push notification campaigns** — Basic notifications for matches/messages only. No marketing automation.
- **Chef availability calendar** — Chefs manage availability through messaging for v1.0.

## Technical Approach
- **Frontend:** React Native with Expo (TypeScript) — cross-platform iOS/Android from a single codebase
- **Backend:** Supabase — PostgreSQL database, authentication (email + social), file storage (chef photos), real-time messaging
- **Background Checks:** Checkr API — integrated into chef onboarding flow
- **Deployment:** Expo Application Services (EAS) for app store builds and OTA updates
- **State Management:** React Context + custom hooks for v1.0 (upgrade to Zustand if complexity warrants it)
- **Navigation:** React Navigation (stack + bottom tabs)

### Architecture Notes
- Supabase handles auth, database, storage, and realtime — minimizing backend infrastructure
- Row Level Security (RLS) policies enforce data access at the database level
- Chef photos stored in Supabase Storage with CDN delivery
- Real-time messaging via Supabase Realtime subscriptions
- Geolocation for local chef discovery using PostGIS extensions in Supabase

## Phase Plan
| Phase | Description | Key Deliverables | Status |
|-------|-------------|-----------------|--------|
| 1 | Foundation | Auth flow, database schema, chef onboarding (profile + photos), basic navigation shell | Not Started |
| 2 | Discovery | Swipe mechanic, chef cards, filters, consumer onboarding, allergy management | Not Started |
| 3 | Matching & Booking | Match system, in-app messaging, booking flow, service model selection | Not Started |
| 4 | Trust & Safety | Background check integration, chef training module, home chef progression | Not Started |
| 5 | Polish & Launch | Reviews/ratings, bug fixes, performance optimization, app store submission | Not Started |

## Risks & Mitigations
| Risk | Category | Severity | Likelihood | Mitigation |
|------|----------|----------|------------|------------|
| Liability — food poisoning or kitchen damage | Legal | High | Medium | Research insurance models (platform blanket vs. chef-carries-own). Dedicated research session needed before launch |
| Cold start — not enough chefs locally | Market | High | High | Need 20-30 chefs minimum. Supply-first strategy. Use Top Chef contestant connection as anchor |
| Tech execution — previous Expo build failed | Technical | Medium | Medium | Starting fresh with proper architecture, CLAUDE.md, and PRD. The technology works |
| Trust and safety — strangers in homes | Safety | High | Medium | Background checks mandatory, reviews system, chef training module |
| Regulatory — cottage food laws for home chefs | Legal | Medium | Medium | Research SC/NC regulations before home chef tier launches |
| Home chef quality control | Product | Medium | High | Tiered access system — start small, earn access to larger events |
| Competition — Yhangry expanding to US | Market | Medium | Medium | Move fast on local market. Different UX positioning (swipe vs. browse) |
| Gary's bandwidth — job, family, grad school | Personal | Medium | High | Realistic phase plan, strict MVP scope, no feature creep |

## Open Questions
1. **Insurance model:** Platform blanket policy vs. requiring chefs to carry their own? Needs dedicated research.
2. **Cottage food laws:** What are the regulations in SC/NC for home chefs cooking in others' homes? Needs legal research.
3. **Checkr pricing:** What is the per-check cost, and who pays (platform or chef)?
4. **Chef onboarding training content:** Who writes the food safety and etiquette training material?
5. **Launch geography:** Start with Lake Wylie/Charlotte metro only, or broader?
6. **Meet-and-greet:** Should there be a mandatory in-person or video meet before first booking? Referenced in research but not yet decided.
