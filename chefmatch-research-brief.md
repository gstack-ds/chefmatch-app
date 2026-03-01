# Research Brief: ChefMatch
**Date:** 2026-03-01
**Status:** Research Complete — Ready for PRD

## Problem Statement
Finding a personal chef for an in-home dining experience is surprisingly difficult for regular consumers — existing options are hard to discover, overly formal, or don't exist in many local markets.

## Target User
**Consumers:** Couples and families looking for special occasion dining at home (date nights, birthdays, anniversaries) who want an easy, fun way to discover and book a personal chef. Primarily dual-income households with disposable income but limited time.

**Chefs:** Both classically trained professionals looking for freelance income and talented home cooks looking to monetize their skills in the gig economy.

## Landscape

### Direct Competitors
| Platform | Model | Strengths | Weaknesses | Price Range |
|----------|-------|-----------|------------|-------------|
| Yhangry | Browse/filter/book | Strong UK presence, expanding to US (50 locations by end 2025), escrow payments, £800K funding round Jan 2025 | UK-focused, mobile UX has issues per reviews, no discovery mechanic | £30+/head |
| Take a Chef | Browse/filter/book | Global (4,000+ chefs, 100 countries), founded 2012, strong reviews | Traditional directory model, no fun discovery experience | $60-200/person |
| CHEFIN | Algorithm matching | Claims largest platform, algorithm matches preferences to chefs | Premium pricing, focused on high-end only | $1,600+ for up to 10 guests |
| Table at Home | Bid/proposal | Accepts both professional and amateur chefs, chef bids on events | Limited to 6 US cities, proposal model is slow | Varies by chef bid |
| SRVE | Preference-based | Covers multiple use cases (occasions, meal prep, pop-ups) | Less established, generic booking flow | Varies |
| Gradito | Curated high-end | Strong vetting, sommelier add-ons | Very premium, limited accessibility | $1,600+ |
| MiumMium | Browse/book | Claims largest marketplace | Limited differentiation | Varies |
| Private Chef Manager | SaaS for chefs | Great chef-side tools (scheduling, menus, website builder) | Not a consumer marketplace, chef management tool only | 2.9% service fee |

### Current Gap
**No platform uses a swipe/match discovery mechanic.** Every existing platform uses a traditional search-browse-filter-book flow. Discovery is functional but not fun or engaging. Additionally, most platforms focus exclusively on professionally trained chefs, leaving talented home cooks out of the market entirely.

## Market Assessment
- Global personal chef services market valued at ~$16.6 billion in 2024
- Growing at 6.7% CAGR through 2030 (projected to reach ~$24.2 billion)
- US market growing at 5.0% CAGR
- 61% of US personal chef service consumers are dual-income households
- AI-driven menu planning tools saw 22% adoption increase (2023-2025)
- Experiential dining services grew 26% in same period
- 54% of clients prefer in-home services over off-site preparation
- Digital booking platform adoption increased 48% among market players
- Yhangry raised £800K in Jan 2025 and expanding to US — signals investor confidence

## Data & Technical Feasibility

### Tech Stack (Decided)
- **Frontend:** React Native with Expo (cross-platform iOS/Android from single codebase)
- **Backend:** Supabase (PostgreSQL database, authentication, file storage for chef photos, real-time messaging)
- **Background Checks:** Checkr API
- **Deployment:** Expo Application Services (EAS) for app store builds

### Key Technical Considerations
- Swipe mechanic needs to feel smooth and native — this is the core UX differentiator
- Real-time messaging between chef and diner after match is essential
- Photo storage and optimization for chef portfolios
- Geolocation for local chef discovery
- Previous build with React Native + Expo failed due to poor architecture, not the technology itself

## Academic & Expert Grounding

### Key Research Areas
The critical domain knowledge for ChefMatch is marketplace design and network effects, not culinary science.

### Key Researchers / Practitioners
- **Andrei Hagiu** (Boston University) — foundational work on multi-sided platform strategy
- **Geoffrey Parker, Marshall Van Alstyne, Sangeet Paul Choudary** — authors of *Platform Revolution*, the definitive book on platform business models
- **Evans & Schmalensee** — identified three strategies for the chicken-and-egg problem: Two-Steps (get one side first), Zig-Zag (grow both simultaneously), Commitment Community
- **Trabucchi (2020)** at Politecnico di Milano — tactical approaches to solving chicken-and-egg in platform startups
- **Collaborative filtering research** — relevant for future recommendation engine based on swipe data

### How Our Approach Differs
Existing personal chef platforms are directories with search bars. ChefMatch is a discovery engine. Instead of browsing profiles like shopping on Amazon, users swipe through chefs like Tinder — making discovery intuitive, visual, and fun. ChefMatch also uniquely tiers chefs as classically trained or home-taught, opening the market to talented cooks without formal credentials at a lower price point. This dramatically expands supply and makes in-home chef experiences accessible for regular date nights, not just $1,600+ special occasions.

## MVP Scope

### In v1.0
1. **Swipe-based chef discovery** — photos, bio, cuisine style, tier, price range
2. **Chef profiles with two tiers** — Classically Trained and Home Chef
3. **Allergy management** — core safety feature, captured during onboarding for both sides, conflicts flagged before booking
4. **Booking flow with in-app messaging** — match → propose date/party size/occasion → confirm
5. **Flexible service models** — full-service (chef brings everything) vs. collaborative (diner shops from chef's grocery list)
6. **Background checks** — required for all chefs via Checkr API
7. **Chef onboarding training** — mandatory module that must be completed and passed
8. **Quality control for home chefs** — start with small events, earn access to larger ones
9. **Reviews and ratings** — both sides can rate each other
10. **Dietary/cuisine filters** — location, cuisine type, occasion, dietary needs, budget

### Explicitly NOT in v1.0
- Payment processing (use Venmo/Zelle/cash initially)
- AI-powered matching algorithms (simple filters work at small scale)
- Waiter booking add-on
- Grocery delivery integration
- Analytics dashboard
- Web version (mobile app only — 98% of Tinder usage is mobile)

### Success Metric
10 completed bookings in the local market within 90 days of launch.

## Go-to-Market Assets
- **Wife's event planning company** — built-in demand channel with existing client relationships
- **Top Chef contestant connections** — met two contestants recently, exchanged contact info. Potential anchor supply for launch credibility and marketing
- **Supply-first strategy** — onboard chefs before consumers. Consider starting with a profile/portfolio builder tool that's valuable to chefs standalone, then flip the switch to consumer discovery

## Risks & Pitfalls
| Risk | Category | Severity | Likelihood | Mitigation |
|------|----------|----------|------------|------------|
| Liability — food poisoning or kitchen damage | Legal | High | Medium | Research insurance models (platform blanket policy vs. chef-carries-own). Dedicated research session needed |
| Cold start — not enough chefs locally to make swiping feel abundant | Market | High | High | Need 20-30 chefs minimum in metro area. Start with supply-first strategy, use Top Chef connection as anchor |
| Tech execution — previous Expo build failed | Technical | Medium | Medium | Start fresh with proper CLAUDE.md, PRD, and architecture. The technology works, the previous process was the problem |
| Trust and safety — strangers in homes | Safety | High | Medium | Background checks mandatory, meet-and-greet before first booking, reviews system, chef training module |
| Regulatory — cottage food laws for home chefs | Legal | Medium | Medium | Research local regulations in Lake Wylie/Charlotte area. May vary by jurisdiction |
| Home chef quality control — unqualified cooks | Product | Medium | High | Tiered access system, audition/trial process, mentorship pairing, start with small events only |
| Competition — Yhangry expanding to US with funding | Market | Medium | Medium | Move fast on local market. Yhangry uses traditional browse model, not swipe. Different UX positioning |
| Gary's bandwidth — full-time job, family, grad school | Personal | Medium | High | Realistic phase plan, MVP-only scope, no feature creep. /end-session skill to maintain momentum between sessions |

## Recommended Next Steps
1. Run /project-kickoff to scaffold the repo with CLAUDE.md, PRD, and README
2. Research liability/insurance models for service marketplaces (dedicated /research-mode session)
3. Research cottage food laws in SC/NC for the home chef tier
4. Begin Phase 1 build focused on chef-side onboarding and profile creation
