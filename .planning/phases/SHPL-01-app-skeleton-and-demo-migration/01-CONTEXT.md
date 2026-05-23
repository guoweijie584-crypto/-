# Phase 1: App Skeleton And Demo Migration - Context

**Gathered:** 2026-05-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Create a Vite + Canvas H5 app shell and migrate the current single-file demo into it without losing core combat behavior. This phase proves the project can run as a modern web app while keeping the old HTML demo untouched as the reference implementation.

</domain>

<decisions>
## Implementation Decisions

### Runtime And Stack
- **D-01:** Use vanilla Vite with ES modules, not React/Vue/Svelte, to minimize migration risk from the current plain JavaScript Canvas demo.
- **D-02:** Use Canvas 2D for the game surface in Phase 1; do not introduce Phaser 3 in this phase.
- **D-03:** Use `lucide` for icon rendering in DOM UI shell controls where icons are needed.
- **D-04:** Use Vitest + jsdom for lightweight automated smoke tests in Phase 1; browser visual checks can be manual or Browser-plugin based during execution.

### Migration Boundary
- **D-05:** Keep `gemini-code-1779459048019_副本.html` unchanged as the reference demo.
- **D-06:** Preserve the existing movement, attack, throw, ultimate, enemy spawn, EXP/upgrade, HUD, particle, damage-text, and screen-shake behavior during migration.
- **D-07:** The migrated game must expose a stable `mountGame(container, options)` style API so later phases can drive stage/weapon/content state without rewriting the loop.

### UI Shell
- **D-08:** Use DOM/CSS overlays for product UI around the Canvas, matching the existing HUD/modal approach.
- **D-09:** Phase 1 UI regions must reserve surfaces for weapon selection, narrator dialogue, culture cards, completion card, and route output, but full content behavior remains Phase 2/3 scope.
- **D-10:** The first screen should show the actual app/game experience, not a marketing landing page.

### the agent's Discretion
- Exact file/module names inside `src/game/` may vary if they preserve the public mount API and behavior.
- Exact test helpers may vary if `npm test` and `npm run build` verify the same acceptance criteria.
- Exact icon choices may vary among Lucide icons, but use familiar symbols for weapons, map/route, scroll/story, and card surfaces.

</decisions>

<specifics>
## Specific Ideas

- Use the current demo's `#gameCanvas`, `#ui-layer`, `update()`, `render()`, `performAttack()`, `throwWeapon()`, `triggerUltimate()`, `damageEnemy()`, and `showUpgradeScreen()` as migration anchors.
- Use the new product title `山河破阵录：古城夜巡` in app metadata and visible shell copy.
- UI shell copy should use concise Jianghu/product terms such as `选择兵器`, `AI 说书人`, `文化线索`, `江湖游历卡`, and `游览路线`.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Scope
- `.planning/PROJECT.md` — Product goal, constraints, active requirements, and out-of-scope boundaries.
- `.planning/REQUIREMENTS.md` — APP-01, APP-02, APP-03 requirement definitions.
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria, and plan outline.
- `.planning/STATE.md` — Current phase focus and prior decisions.

### Existing Code
- `gemini-code-1779459048019_副本.html` — Reference implementation for gameplay behavior.
- `.planning/codebase/ARCHITECTURE.md` — Current demo architecture and recommended next boundaries.
- `.planning/codebase/STRUCTURE.md` — Existing file/function map.
- `.planning/codebase/CONVENTIONS.md` — Current code style and recommended conventions.
- `.planning/codebase/TESTING.md` — Manual behaviors to preserve and test risks.

### Research And Design
- `.planning/research/SUMMARY.md` — Project-level stack and roadmap guidance.
- `.planning/phases/SHPL-01-app-skeleton-and-demo-migration/01-UI-SPEC.md` — Phase 1 visual and interaction contract.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `gemini-code-1779459048019_副本.html` script block: source of truth for current combat behavior.
- Existing DOM HUD/modals: proof that Canvas game and DOM UI overlay work together.
- Existing Canvas drawing helpers: useful initial visual fallback before custom assets exist.

### Established Patterns
- Global state and imperative update/render loop are the current behavior source.
- Event listeners mutate input state; `update()` consumes input and mutates world state; `render()` draws the world.
- `updateUI()` synchronizes DOM HUD with game state.

### Integration Points
- New app entry should call `renderShell()` and `mountGame()` once.
- Future phases should listen to stable game events such as stage clear, run summary, card unlock, and route generated.

</code_context>

<deferred>
## Deferred Ideas

- Sword/blade/spear final gameplay balancing is Phase 2.
- Real culture card unlock behavior is Phase 3.
- Touch controls and PWA metadata are Phase 4.
- Real AI API integration is v2.

</deferred>

---

*Phase: SHPL-01-app-skeleton-and-demo-migration*
*Context gathered: 2026-05-23*
