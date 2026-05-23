# Project Research: Features

**Defined:** 2026-05-23
**Project:** 山河破阵录：古城夜巡

## Table Stakes For v1

| Feature | Why It Matters | Complexity |
|---------|----------------|------------|
| Scan-and-play web app | Core distribution model for scenic areas and events. | Medium |
| Weapon selection | Player agency and replayability; required by concept. | Medium |
| Three-stage loop | Proves "景点是关卡" instead of endless combat. | Medium |
| Basic enemies and Boss | Gives clear action-game progression and finale. | Medium |
| Culture unlock cards | Core文旅 value; combat must reveal real cultural content. | Medium |
| AI storyteller fallback | Demonstrates AI narrative value without external dependency. | Medium |
| Completion travel card | Creates shareable output and player reward. | Medium |
| Route recommendation | Connects online play to offline visitation. | Low |
| Mobile controls | Required for actual scan-and-play. | Medium |

## Differentiators

- Jianghu framing of real scenic content.
- Performance-based title and comment generation.
- Culture card unlocks tied to combat milestones.
- Final route card that recommends the same physical path as the player's cleared stages.

## Anti-Features For v1

- Account system and persistent profiles.
- Ranking, PVP, social graph, or long-term economy.
- Multi-scenic-area management.
- Real AI API as a hard dependency.
- Large asset pipeline or 3D scenes.

## Feature Dependencies

- Stage progression depends on migrated game state and win conditions.
- Culture cards depend on stage-clear events and content data.
- Completion card depends on run summary metrics.
- Route recommendation depends on unlocked route-order metadata.
- Mobile controls should be designed before final gameplay balancing.

