# Project Research: Architecture

**Defined:** 2026-05-23
**Project:** 山河破阵录：古城夜巡

## Recommended Architecture

Use a small web app split into four domains:

- `game`: Canvas loop, player, enemies, weapons, stages, collisions, effects.
- `content`: stage definitions, scenic/cultural cards, route metadata.
- `narration`: local fallback generation for storyteller lines, titles, comments, and route copy.
- `ui`: weapon select, HUD, AI dialogue, culture card modal, completion card, route panel.

## Data Flow

1. Player chooses a weapon.
2. Game starts at Stage 1 using stage data.
3. Combat emits milestone events: enemy defeated, item collected, stage cleared, boss defeated.
4. UI shows culture unlock cards from content data.
5. Narration layer produces Jianghu-style text from templates and run metrics.
6. Completion card combines weapon, performance, unlocked stages, title, comment, and route.

## Build Order

1. Create Vite app and migrate current Canvas demo into a running module.
2. Extract game state and content data enough to define stages and weapons.
3. Add clear conditions and stage transitions.
4. Add cards and narrator fallback around stage events.
5. Add mobile/PWA/share hardening.

## Boundary Rules

- Game code should not know about AI provider APIs.
- AI/narration code should not invent scenic facts; it rewrites known content.
- Content cards should be structured data, not hardcoded modal strings.
- UI should consume game events and state snapshots rather than mutate combat internals directly.

