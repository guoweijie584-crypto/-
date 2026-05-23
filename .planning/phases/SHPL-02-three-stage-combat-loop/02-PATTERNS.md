# Phase 2 Pattern Map

**Mapped:** 2026-05-23
**Phase:** SHPL-02-three-stage-combat-loop

## Target Files And Existing Analogs

| Target | Role | Closest Existing Analog | Notes |
|--------|------|-------------------------|-------|
| `src/game/weapons.js` | Weapon definitions, attack tuning, upgrade pools | `src/game/gameState.js` `UPGRADES`; `src/content/demoContent.js` `weapons` | Keep data-first definitions. Weapon IDs must stay `sword`, `blade`, `spear`. |
| `src/game/stages.js` | Stage definitions and objective contracts | `src/content/demoContent.js` `cultureCards`; `src/game/gameState.js` world state | Use structured stage IDs matching content: `old-street`, `ancient-well`, `city-tower`. |
| `src/game/enemies.js` | Enemy definitions and behavior helpers | `src/game/GameApp.js` `spawnEnemy()` and `updateEnemies()` | Replace prototype enemy IDs with domain IDs while preserving simple behavior loops. |
| `src/game/boss.js` | `雾甲守将` boss state and attacks | `src/game/GameApp.js` enemy/damage/projectile functions | Prefer special enemy object plus `state.boss` over a separate engine. |
| `src/game/runSummary.js` | Victory summary creation | `src/game/GameApp.js` `getSnapshot()` | Summary should be deterministic and unit-testable. |
| `src/game/GameApp.js` | Integration loop | Existing `GameApp.js` | Preserve `mountGame(container, options)` as the public entry point. |
| `src/game/rendering.js` | Draw gameplay objects | Existing `drawPlayer`, `drawEnemy`, `drawProjectiles` | Add shape-based rendering for lamps, fragments, echo waves, talismans, boss telegraphs. |
| `src/ui/shell.js` | DOM panels and victory shell | Existing shell panels | Add stable selectors from UI-SPEC without implementing Phase 3 content. |
| `tests/*` | Contract coverage | Existing jsdom tests | Prefer data/snapshot/summary tests over frame-perfect Canvas tests. |

## Existing Patterns To Preserve

- Game state is a mutable object created by `createInitialGameState()`.
- Input state is isolated in `createInputController()` and read during `update()`.
- `mountGame()` owns loop lifecycle and emits app-state events.
- Canvas visuals are shape-based and use existing palette values.
- DOM shell uses stable IDs and `data-*` attributes for testable surfaces.
- Existing reference HTML remains untouched and untracked.

## Planning Implications

- Split data contracts first, then wire behavior through `GameApp.js`.
- Avoid a full engine rewrite; keep old combat helpers recognizable.
- Each plan should add focused tests for the new contract it introduces.
- Final plan needs browser verification because Phase 2 changes visible gameplay flow and victory UI.
