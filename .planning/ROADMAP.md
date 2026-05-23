# Roadmap: 山河破阵录：古城夜巡

## Overview

The v1 roadmap turns the existing single-file Canvas action demo into a structured H5/PWA MVP. It first creates a Vite + Canvas app shell, then builds the three-stage action loop, then adds cultural cards and local AI-style narration, and finally hardens mobile/PWA/share readiness so the project can be shown as a scenic-area Jianghu副本入口.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: App Skeleton And Demo Migration** - Create the Vite + Canvas H5 shell and preserve the existing playable combat loop.
- [ ] **Phase 2: Three-Stage Combat Loop** - Add weapon selection, scenic stages, enemies, boss, and a win state.
- [ ] **Phase 3: Culture, Narration, And Route Reward** - Add culture cards, local AI fallback narration, completion card, and route recommendation.
- [ ] **Phase 4: Mobile PWA And Demo Hardening** - Make the full loop phone-friendly, share-ready, and PWA-presentable.

## Phase Details

### Phase 1: App Skeleton And Demo Migration
**Goal**: Create a Vite + Canvas H5 app shell and migrate the current demo into it without losing core combat behavior.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: [APP-01, APP-02, APP-03]
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. User can open a Vite-served app and see the game surface immediately.
  2. User can move, attack, throw, use ultimate, fight enemies, level up, and see HUD feedback after migration.
  3. User can see DOM UI regions reserved for weapon selection, narration, culture cards, completion card, and route output.
  4. Existing `gemini-code-1779459048019_副本.html` remains untouched as the reference demo.
**Plans**: 3 plans

Plans:
- [ ] 01-01: Create Vite app shell, scripts, entry HTML, styles, and Canvas mount.
- [ ] 01-02: Migrate existing combat loop into modular game code while preserving behavior.
- [ ] 01-03: Add DOM UI shell/state wiring for upcoming weapon, narration, card, and route surfaces.

### Phase 2: Three-Stage Combat Loop
**Goal**: Turn endless survival into a 3-5 minute scenic-stage action loop with three weapons, stage goals, enemies, boss, and win state.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: [GAME-01, GAME-02, GAME-03, GAME-04, GAME-05]
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. User can choose sword, blade, or spear and feel distinct mechanics for each weapon.
  2. User progresses through 老街灯影阵, 古井回声阵, and 城楼镇妖阵 in order.
  3. User fights stage-appropriate enemies and a final 雾甲守将 boss.
  4. User reaches an explicit victory state within the target 3-5 minute loop.
**Plans**: 3 plans

Plans:
- [ ] 02-01: Implement weapon selection and distinct sword/blade/spear combat behavior.
- [ ] 02-02: Implement stage data, stage objectives, transitions, and enemy set mapping.
- [ ] 02-03: Implement boss encounter, win condition, and run summary metrics.

### Phase 3: Culture, Narration, And Route Reward
**Goal**: Deliver the文旅 loop: stage-clear culture cards, Jianghu narrator fallback, generated title/comment, final travel card, and route recommendation.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: [CULT-01, CULT-02, CULT-03, CULT-04, NARR-01, NARR-02, NARR-03, ROUTE-01, ROUTE-02, ROUTE-03]
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. User unlocks one structured culture card after each stage clear.
  2. User sees Jianghu-style narrator text during onboarding, transitions, unlocks, and completion.
  3. User receives a performance-based title and completion comment from local fallback templates.
  4. User receives a final 江湖游历卡 and the 老街 -> 古井 -> 城楼 route recommendation.
**Plans**: 3 plans

Plans:
- [ ] 03-01: Add structured demo content data and culture-card unlock UI.
- [ ] 03-02: Add local narrator/title/comment/route fallback generation.
- [ ] 03-03: Add completion travel card and route recommendation flow.

### Phase 4: Mobile PWA And Demo Hardening
**Goal**: Make the complete MVP usable and presentable on mobile as a scan-and-play H5/PWA demo.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: [MOB-01, MOB-02, MOB-03]
**UI hint**: yes
**Success Criteria** (what must be TRUE):
  1. User can complete the full loop on a phone viewport with touch-friendly movement and action controls.
  2. HUD, narrator, cards, completion output, and route UI do not overlap on mobile.
  3. App includes basic PWA metadata for scan-and-play sharing.
  4. Manual verification confirms the full loop on desktop and mobile viewports.
**Plans**: 2 plans

Plans:
- [ ] 04-01: Implement mobile controls, responsive layout, and visual polish pass.
- [ ] 04-02: Add PWA metadata, smoke verification, and demo-readiness checklist.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. App Skeleton And Demo Migration | 0/3 | Not started | - |
| 2. Three-Stage Combat Loop | 0/3 | Not started | - |
| 3. Culture, Narration, And Route Reward | 0/3 | Not started | - |
| 4. Mobile PWA And Demo Hardening | 0/2 | Not started | - |

## Coverage

| Phase | Requirements |
|-------|--------------|
| Phase 1 | APP-01, APP-02, APP-03 |
| Phase 2 | GAME-01, GAME-02, GAME-03, GAME-04, GAME-05 |
| Phase 3 | CULT-01, CULT-02, CULT-03, CULT-04, NARR-01, NARR-02, NARR-03, ROUTE-01, ROUTE-02, ROUTE-03 |
| Phase 4 | MOB-01, MOB-02, MOB-03 |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0

---
*Roadmap created: 2026-05-23*
*Last updated: 2026-05-23 after initial roadmap*
