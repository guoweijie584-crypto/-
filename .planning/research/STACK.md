# Project Research: Stack

**Defined:** 2026-05-23
**Project:** 山河破阵录：古城夜巡

## Recommendation

Use a Vite-based H5/PWA app with a plain Canvas game core for v1. This keeps the existing demo's working action loop while adding the project structure needed for mobile UI, cultural content, fallback AI text, and deployment.

## Recommended Stack

| Layer | Choice | Rationale | Confidence |
|-------|--------|-----------|------------|
| App shell | Vite | Lightweight modern dev server/build, easy PWA integration later. | High |
| Game renderer | Canvas 2D | Existing demo is already Canvas and v1 scope does not require Phaser. | High |
| Game architecture | Small modular JS/TS files | Enough separation for game state, content, UI, and fallback AI without overengineering. | High |
| UI layer | DOM/CSS over Canvas | Existing HUD/modal pattern matches AI dialogue, culture cards, and route cards. | High |
| PWA | Manifest + service worker in later hardening phase | Useful for install/offline/event distribution after core loop works. | Medium |
| AI v1 | Local template fallback | Avoids backend/API-key risk while proving the product loop. | High |

## What Not To Use In v1

- Native app: raises install friction and does not fit scan-and-play.
- Full backend: unnecessary until real AI API, analytics, or CMS are needed.
- Phaser 3 migration immediately: useful later if scene complexity grows, but first migration should minimize risk.
- CMS for multi-scenic-area content: defer until one scenic route loop proves value.

## Implementation Implications

- Preserve the existing Canvas update/render loop as the first migration target.
- Split content data from generated text and UI state early.
- Keep AI provider calls behind an interface even when v1 uses local fallback.
- Treat mobile controls as a first-class app requirement, not a final polish task.

