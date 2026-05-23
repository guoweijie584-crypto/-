# Phase 2: Three-Stage Combat Loop - Context

**Gathered:** 2026-05-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Turn the migrated Phase 1 Canvas survival loop into a 3-5 minute scenic-stage action game. This phase delivers weapon choice with strong mechanical differences, three sequential stage objectives, stage-appropriate enemies, a two-phase final boss, an explicit victory state, and run summary data for Phase 3.

This phase does not implement final culture-card content, AI-generated title/comment, real route recommendation, mobile touch controls, or PWA metadata.

</domain>

<decisions>
## Implementation Decisions

### Weapon Identity And Progression
- **D-01:** Use strong mechanical differentiation for sword, blade, and spear rather than light stat-only differences.
- **D-02:** Sword keeps the agile sword-wave identity; blade gets heavier broad-sweep or circular-slash identity; spear gets thrust/dash penetration identity.
- **D-03:** Each weapon gets a weapon-specific upgrade pool with 3 selectable upgrades. Level-up choices should come from the selected weapon's pool to preserve the existing upgrade-choice feel while making weapon identity visible.
- **D-04:** Phase 2 may rebalance speed, range, damage, cooldown, knockback, and projectile behavior per weapon, but must preserve the existing movement, attack, throw, ultimate, HUD, particles, damage text, and screen shake paths from Phase 1.

### Stage Objectives
- **D-05:** Use distinct objectives for the three stages instead of making all stages kill-count gates.
- **D-06:** Stage 1, `老街灯影阵`, requires killing enemies and lighting 3 lamps.
- **D-07:** Stage 2, `古井回声阵`, requires collecting echo fragments while dodging echo-wave hazards.
- **D-08:** Stage 3, `城楼镇妖阵`, requires holding/defending the gate or breaking talismans before entering the boss fight.
- **D-09:** The stage flow is sequential: `老街灯影阵` -> `古井回声阵` -> `城楼镇妖阵` -> `雾甲守将` boss -> victory.

### Enemies And Boss
- **D-10:** Enemy names and behavior should move into the target domain: `灯影妖`, `纸人怪`, `井影`, and `雾甲守将`.
- **D-11:** Enemy behavior should be meaningfully different but not full bespoke systems for every enemy: `灯影妖` is fast chase pressure, `纸人怪` works as group surround pressure, `井影` uses ranged or ripple interference, and `雾甲守将` uses boss-scale charge and area slash.
- **D-12:** The final boss uses a two-phase structure. At half health, it gains a fog-armor shield and/or summons paper enemies. Do not expand to a three-phase boss in Phase 2.

### Victory And Run Summary
- **D-13:** Phase 2 must produce a standard run summary for Phase 3: selected weapon, kills, remaining HP, completion time, victory flag, per-stage completion status, echo fragment count, boss phase reached, selected upgrades, and damage-taken count.
- **D-14:** Phase 2 should show a victory panel plus a `江湖游历卡` placeholder shell. The panel can show `破阵成功`, weapon, kills, time, remaining HP, stage completion, fragments, damage taken, and boss phase.
- **D-15:** Phase 2 must not generate AI titles/comments, show finalized culture-card content, or recommend a real-world route. Those remain Phase 3 scope.

### the agent's Discretion
- Exact numeric thresholds for kills, lamp activation radius, fragment count, gate/talisman health, enemy spawn rates, boss HP, and cooldowns may be tuned during implementation as long as the full loop targets 3-5 minutes.
- Exact visual treatment of lamps, fragments, echo waves, talismans, gate, and boss attacks may use Canvas shapes/effects before a sprite pipeline exists.
- Exact module names may vary, but game stage/weapon/enemy data should be structured enough for Phase 3 to consume stage-clear and run-summary events.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope
- `.planning/PROJECT.md` — Product goal, constraints, and Jianghu cultural-tourism positioning.
- `.planning/REQUIREMENTS.md` — GAME-01 through GAME-05 definitions and out-of-scope boundaries.
- `.planning/ROADMAP.md` — Phase 2 goal, success criteria, and plan outline.
- `.planning/STATE.md` — Current phase focus and prior decisions.

### Phase 1 Foundation
- `.planning/phases/SHPL-01-app-skeleton-and-demo-migration/01-CONTEXT.md` — Locked stack, migration, UI shell, and public game-entry decisions.
- `.planning/phases/SHPL-01-app-skeleton-and-demo-migration/01-03-SUMMARY.md` — Current app shell and browser verification state.
- `src/game/GameApp.js` — Current migrated game loop and public `mountGame()` entry point.
- `src/game/gameState.js` — Current player/world state and generic upgrades.
- `src/game/rendering.js` — Current Canvas rendering helpers.
- `src/game/input.js` — Current keyboard/mouse input setup.
- `src/ui/shell.js` — Current DOM shell surfaces.
- `src/app/appState.js` — Current app state/event bridge.
- `src/content/demoContent.js` — Current demo content shape for stages/routes/culture placeholders.

### Existing Reference
- `gemini-code-1779459048019_副本.html` — Original untouched gameplay reference for movement, attacks, throw, ultimate, HUD, upgrades, particles, damage text, and screen shake.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `mountGame(container, options)` already creates the Canvas, installs input, emits snapshots, and returns `start`, `stop`, `reset`, and `getSnapshot`.
- `createInitialGameState()` already centralizes player/world arrays and can be expanded for selected weapon, current stage, objectives, boss state, and run summary.
- `UPGRADES` already models selectable upgrade effects; it can be split into weapon-specific pools.
- `render()` and helper functions already draw player, enemies, projectiles, particles, and damage text; Phase 2 can add lamps, fragments, echo waves, talismans, gate, boss, and victory effects without changing the DOM shell first.
- `renderShell()` already has weapon, narrator, culture, completion, and route surfaces; Phase 2 can use the weapon panel and a victory/summary surface without implementing Phase 3 content.

### Established Patterns
- Game code is imperative Canvas simulation: input mutates input state, `update()` mutates world state, `render()` draws the world.
- App/game integration uses events such as `game:ready`, `game:started`, `game:reset`, and `game:snapshot`.
- Tests use Vitest + jsdom smoke contracts around shell roots, Canvas creation, lifecycle methods, and snapshot shape.
- The old HTML reference remains untracked and unchanged; Phase 2 should continue treating it as read-only.

### Integration Points
- `demoContent.weapons` should drive visible weapon choices; selected weapon should reach the game through app state or `mountGame` options.
- Game snapshots should expand to include stage status, objective status, selected weapon, boss status, and run summary when available.
- Victory should be represented as explicit game state and an emitted summary event so Phase 3 can consume it for culture cards, AI fallback, travel card, and route recommendation.

</code_context>

<specifics>
## Specific Ideas

- Weapon upgrade pools should feel like Jianghu `功法` but remain local gameplay data in Phase 2.
- The three stages should have different verbs: fight/light, collect/dodge, defend/break.
- Boss fight should feel like the final `城楼镇妖阵` payoff without becoming a long multi-phase encounter.
- The victory UI can be a concise summary panel plus `江湖游历卡` placeholder, not a full final card.

</specifics>

<deferred>
## Deferred Ideas

- Full `江湖游历卡` content, AI-generated title/comment, culture-card copy, and route recommendation are deferred to Phase 3.
- Touch controls, mobile UI hardening, and PWA metadata are deferred to Phase 4.
- Three-phase boss, full skill trees, per-enemy weak-point systems, and detailed analytics such as hit rate or skill-use counts are out of Phase 2 scope and can be considered in later gameplay expansion.

</deferred>

---

*Phase: SHPL-02-three-stage-combat-loop*
*Context gathered: 2026-05-23*
