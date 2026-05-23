# Walking Skeleton — 山河破阵录：古城夜巡

**Phase:** 1
**Generated:** 2026-05-23

## Capability Proven End-to-End

A visitor can open a Vite-served H5 app, see the Canvas game surface immediately, and interact with reserved DOM UI surfaces for the future weapon, narrator, culture card, completion card, and route flows.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Vanilla Vite | Matches the existing plain JavaScript Canvas demo and avoids framework migration risk. |
| Game renderer | Canvas 2D | Existing demo already proves Canvas movement/combat/rendering. |
| Data layer | ES module demo content + browser app state | Phase 1 has no backend or database; content placeholders are enough for the shell. |
| Auth | None | Scan-and-play MVP does not require accounts. |
| Deployment target | Local Vite dev/build output | Phase 1 proves local build and run before PWA/share hardening. |
| Directory layout | `src/app`, `src/game`, `src/ui`, `src/content`, `tests` | Keeps game, shell UI, app state, and demo content separate for later phases. |

## Stack Touched in Phase 1

- [x] Project scaffold (Vite, build script, test runner)
- [x] Routing (single app route served by `index.html`)
- [x] Data (one local content module read and one browser/app-state update path)
- [x] UI (one interactive app shell wired to game mount)
- [x] Deployment (documented local dev/build commands)

## Out of Scope (Deferred to Later Slices)

- Final sword/blade/spear behavior.
- Stage progression and boss win condition.
- Real culture card unlock behavior.
- Real AI API calls.
- Touch controls and PWA metadata.
- Account system, backend, database, and analytics.

## Subsequent Slice Plan

- Phase 2: Weapon selection, stage objectives, enemies, boss, and win state.
- Phase 3: Culture cards, local AI-style narration, completion card, and route reward.
- Phase 4: Mobile controls, responsive hardening, PWA metadata, and demo readiness.

