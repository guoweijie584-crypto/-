# Requirements: 山河破阵录：古城夜巡

**Defined:** 2026-05-23
**Core Value:** 用一段 3-5 分钟可扫码即玩的动作闯关体验，把真实景区文化转化成玩家愿意完成、分享并线下跟走的江湖副本。

## v1 Requirements

Requirements for the initial hackathon MVP. Each maps to exactly one roadmap phase.

### App Shell

- [ ] **APP-01**: User can open the project as a Vite-based H5 app with the game visible in the first screen.
- [ ] **APP-02**: User can play the migrated Canvas combat loop without losing the existing movement, attack, throw, ultimate, enemy, upgrade, HUD, and feedback behavior.
- [ ] **APP-03**: User can use a DOM-based interface around the Canvas for weapon selection, narrator dialogue, culture cards, completion card, and route output.

### Gameplay

- [ ] **GAME-01**: User can choose one of three weapons before entering the city: sword, blade, or spear.
- [ ] **GAME-02**: User experiences distinct weapon behavior: sword is agile with sword-wave identity, blade has larger sweep impact, and spear has thrust/dash penetration.
- [ ] **GAME-03**: User can progress through three stages: 老街灯影阵, 古井回声阵, and 城楼镇妖阵.
- [ ] **GAME-04**: User can fight stage-appropriate enemies including 灯影妖, 纸人怪, 回声/井影类敌人, and 雾甲守将.
- [ ] **GAME-05**: User can complete the final boss encounter and reach a clear win state within a 3-5 minute target experience.

### Cultural Content

- [ ] **CULT-01**: User unlocks a culture card after clearing 老街灯影阵.
- [ ] **CULT-02**: User unlocks a culture card after clearing 古井回声阵.
- [ ] **CULT-03**: User unlocks a culture card after clearing 城楼镇妖阵.
- [ ] **CULT-04**: Each culture card is backed by structured replaceable data with `spotId`, `title`, `sourceNote`, `unlockStage`, and `routeOrder`.

### Narration And AI Fallback

- [ ] **NARR-01**: User sees AI storyteller-style Jianghu narration for onboarding, stage transitions, culture unlocks, and completion.
- [ ] **NARR-02**: User receives a generated title and completion comment based on selected weapon, kills, remaining HP, cleared stages, and completion outcome.
- [ ] **NARR-03**: Narration, title, comment, and route copy work through local fallback templates without requiring a real AI API.

### Travel Card And Route

- [ ] **ROUTE-01**: User receives a final 江湖游历卡 after completing the run.
- [ ] **ROUTE-02**: The travel card shows selected weapon, performance summary, unlocked culture cards, generated title, and completion comment.
- [ ] **ROUTE-03**: User receives a real-world route recommendation ordered as 老街 -> 古井 -> 城楼 for the demo content.

### Mobile And PWA Readiness

- [ ] **MOB-01**: User can play the complete loop on a phone viewport with touch-friendly movement and action controls.
- [ ] **MOB-02**: User can view all HUD, narrator, culture card, completion card, and route UI without text overlap on mobile.
- [ ] **MOB-03**: User can load the app with basic PWA metadata suitable for scan-and-play sharing.

## v2 Requirements

Deferred to future releases. Tracked but not in current roadmap.

### Real Scenic Content

- **REAL-01**: Operator can replace demo content with a specific real scenic area's verified old street, well, tower, heritage, and route data.
- **REAL-02**: Culture cards can display source labels or citations for verified scenic-area materials.

### Real AI Integration

- **AI-01**: App can call a backend or edge proxy for real model-generated narration, title, comments, and route copy.
- **AI-02**: AI generation falls back to local templates when the provider fails or times out.

### Operations

- **OPS-01**: Scenic-area operator can manage multiple routes or scenic spots without code changes.
- **OPS-02**: Operator can view basic analytics for completions, shares, and route clicks.

### Extended Gameplay

- **EXT-01**: User can replay with additional weapons, skills, enemy patterns, and stage variants.
- **EXT-02**: User can share a rendered image version of the completion card.

## Out of Scope

Explicitly excluded from v1 to protect the 3-5 minute MVP.

| Feature | Reason |
|---------|--------|
| Account system | Not needed for scan-and-play scenic/event usage. |
| Leaderboard or social graph | Adds complexity without proving文旅 conversion. |
| Multi-scenic-area CMS | Single-route demo content is enough to validate the product loop. |
| Real AI API dependency | Requires backend/proxy and key management; local fallback proves the interaction first. |
| Phaser 3 migration | Existing Canvas demo is working; Vite + Canvas reduces migration risk. |
| Native app | H5/PWA is the distribution requirement for QR-code play. |
| Large 3D or heavy art pipeline | First version prioritizes loop, culture, route, and shareability. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| APP-01 | Phase 1 | Pending |
| APP-02 | Phase 1 | Pending |
| APP-03 | Phase 1 | Pending |
| GAME-01 | Phase 2 | Pending |
| GAME-02 | Phase 2 | Pending |
| GAME-03 | Phase 2 | Pending |
| GAME-04 | Phase 2 | Pending |
| GAME-05 | Phase 2 | Pending |
| CULT-01 | Phase 3 | Pending |
| CULT-02 | Phase 3 | Pending |
| CULT-03 | Phase 3 | Pending |
| CULT-04 | Phase 3 | Pending |
| NARR-01 | Phase 3 | Pending |
| NARR-02 | Phase 3 | Pending |
| NARR-03 | Phase 3 | Pending |
| ROUTE-01 | Phase 3 | Pending |
| ROUTE-02 | Phase 3 | Pending |
| ROUTE-03 | Phase 3 | Pending |
| MOB-01 | Phase 4 | Pending |
| MOB-02 | Phase 4 | Pending |
| MOB-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0

## User Stories

- As a visitor, I can scan into a short Jianghu action game and understand the scenic route through play.
- As a visitor, I can defeat three scenic-stage challenges and unlock cultural story cards as rewards.
- As a visitor, I can receive a personalized title, travel card, and route suggestion after clearing the game.
- As a scenic-area operator, I can see how the demo turns attractions into an interactive route entry point.

## Acceptance Criteria

- The v1 loop is complete when a user can start, choose a weapon, clear three stages, defeat the boss, unlock three culture cards, receive a title/comment/travel card, and see the 老街 -> 古井 -> 城楼 route.
- The v1 loop is demo-ready when it works on desktop and phone viewports without requiring a real AI API.
- Cultural facts are not generated freely; they come from replaceable structured data.

## Definition of Done

- All v1 requirements are implemented, verified, and mapped to completed phases.
- Manual browser verification covers desktop and mobile viewports.
- No frontend API keys or provider secrets are present.
- The app can be demonstrated as a 3-5 minute scan-and-play H5/PWA MVP.

---
*Requirements defined: 2026-05-23*
*Last updated: 2026-05-23 after initial definition*
