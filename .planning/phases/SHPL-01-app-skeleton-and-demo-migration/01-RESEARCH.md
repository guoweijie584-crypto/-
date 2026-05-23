# Phase 1: App Skeleton And Demo Migration - Research

**Researched:** 2026-05-23
**Domain:** Vite + Canvas H5 app migration
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Use vanilla Vite with ES modules, not React/Vue/Svelte.
- D-02: Use Canvas 2D for the game surface; do not introduce Phaser 3 in Phase 1.
- D-03: Use `lucide` for icon rendering in DOM UI shell controls where icons are needed.
- D-04: Use Vitest + jsdom for lightweight automated smoke tests in Phase 1.
- D-05: Keep `gemini-code-1779459048019_副本.html` unchanged as the reference demo.
- D-06: Preserve the existing movement, attack, throw, ultimate, enemy spawn, EXP/upgrade, HUD, particle, damage-text, and screen-shake behavior.
- D-07: The migrated game must expose a stable `mountGame(container, options)` style API.
- D-08: Use DOM/CSS overlays for product UI around the Canvas.
- D-09: Reserve surfaces for weapon selection, narrator dialogue, culture cards, completion card, and route output.
- D-10: The first screen should show the actual app/game experience, not a marketing landing page.

### the agent's Discretion
- Exact file/module names inside `src/game/`.
- Exact test helpers if `npm test` and `npm run build` prove the same criteria.
- Exact Lucide icon choices among familiar weapon/map/story/card symbols.

### Deferred Ideas (OUT OF SCOPE)
- Final weapon balancing and stage progression.
- Real culture card unlock behavior.
- Touch controls and PWA metadata.
- Real AI API integration.
</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Vite app shell | Browser/Client | CDN/Static | Phase 1 is a static H5 app with no backend. |
| Canvas game migration | Browser/Client | — | Simulation and rendering run locally in Canvas. |
| DOM UI shell | Browser/Client | — | Weapon/narrator/card/route placeholders are browser UI surfaces. |
| Content placeholders | Browser/Client | — | Demo content can be ES module data for now. |
| Smoke tests | Browser/Client tooling | — | Vitest/jsdom can verify DOM mount and module contracts. |
</architectural_responsibility_map>

<research_summary>
## Summary

Phase 1 should use a vanilla Vite app instead of framework scaffolding. Vite officially supports the `vanilla` template and a non-interactive current-directory scaffold path, but for this repo a manual scaffold is safer because the existing untracked HTML demo should remain untouched.

The standard migration pattern is to create a stable app entry (`src/main.js`) that mounts a DOM shell and a game module, then migrate the current script behavior behind `mountGame(container, options)`. Keep the DOM/CSS overlay split from the existing demo because it is already proven by the old HUD and modal structure.

**Primary recommendation:** Create a manual Vite vanilla app with `package.json`, `index.html`, `src/main.js`, `src/game/GameApp.js`, `src/ui/shell.js`, `src/content/demoContent.js`, shared CSS, and Vitest smoke tests.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vite | latest compatible | Dev server and production build | Official supported modern web build tool with vanilla template support. |
| lucide | latest compatible | DOM icons | Official Lucide package supports vanilla JavaScript icon rendering. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| vitest | latest compatible | Unit/smoke tests | Verify modules, DOM shell, and exported mount contracts. |
| jsdom | latest compatible | Test DOM environment | Required for DOM mount tests under Vitest. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vanilla Vite | React Vite | React adds UI structure but slows migration from plain JS. |
| Canvas 2D | Phaser 3 | Phaser gives scene management later, but first phase should preserve behavior with minimal migration risk. |
| Vitest | Playwright | Playwright is stronger for browser checks, but Phase 1 can start with Vitest and manual Browser verification. |

**Installation:**
```bash
npm install lucide
npm install -D vite vitest jsdom
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### System Architecture Diagram

```text
Browser loads index.html
  -> src/main.js
    -> createAppState()
    -> renderShell(appRoot, state)
    -> mountGame(gameRoot, { state, emit })
      -> input handlers
      -> update loop
      -> render loop
      -> DOM HUD/event callbacks
```

### Recommended Project Structure
```text
src/
├── app/
│   └── appState.js        # Shared shell/game state and event helpers
├── content/
│   └── demoContent.js     # Replaceable demo stage/card/route placeholders
├── game/
│   └── GameApp.js         # Canvas game mount and migrated loop entry
├── ui/
│   └── shell.js           # DOM shell rendering and Lucide icon setup
├── main.js                # App entry
└── styles.css             # Global layout and overlay styling
tests/
├── app-shell.test.js
└── game-contract.test.js
```

### Pattern 1: Stable Game Mount API
**What:** Keep all game startup behind a single exported mount function.
**When to use:** Any future stage/weapon/content integration needs to start or reset the game without reaching into internals.
**Example target shape:** `export function mountGame(container, options = {}) { return { start, stop, reset, getSnapshot } }`

### Pattern 2: DOM Shell Owns Product Surfaces
**What:** Let `renderShell()` create fixed DOM regions for product UI while the game module owns Canvas.
**When to use:** Narrator, weapon select, culture cards, completion card, and route panels.
**Example target shape:** `renderShell(root, state)` creates `#game-root`, `#hud-root`, `#narrator-root`, `#cards-root`, and `#route-root`.

### Anti-Patterns to Avoid
- **Scaffolding over the old demo:** Do not overwrite or rename `gemini-code-1779459048019_副本.html`.
- **Changing gameplay while migrating:** Preserve behavior first; retheme and stage logic come later.
- **Letting game code own AI/culture UI:** Future Phase 3 surfaces should be driven by shell/content layers.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dev server/build pipeline | Custom static server scripts | Vite | HMR, build, asset handling, and scripts are already solved. |
| Test runner | Ad hoc browser console checks only | Vitest + jsdom | Repeatable smoke tests prevent migration regressions. |
| SVG button icons | Manually drawn SVG icon set | Lucide | Consistent icon language with low implementation cost. |

**Key insight:** The risky work is migration fidelity, not inventing tooling. Use standard tooling and spend effort preserving behavior.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Breaking The Reference Demo
**What goes wrong:** The old HTML is edited during migration and no longer works as a comparison point.
**Why it happens:** Executor copies in place instead of creating a new app shell.
**How to avoid:** Treat `gemini-code-1779459048019_副本.html` as read-only for Phase 1.
**Warning signs:** Git diff shows changes to the old HTML file.

### Pitfall 2: Horizontal Over-Splitting
**What goes wrong:** Scaffold, game, UI, and tests are isolated without a running app until the end.
**Why it happens:** Plans focus on folders instead of a vertical slice.
**How to avoid:** Plan 01-01 must produce a working Vite page immediately.
**Warning signs:** `npm run dev` starts but first viewport is blank or has no Canvas.

### Pitfall 3: Migrating By Rewriting Mechanics
**What goes wrong:** Combat feels different or loses attacks/throw/ultimate/upgrades.
**Why it happens:** Executor recreates from memory instead of copying behavior from the reference script.
**How to avoid:** Read the old HTML before editing and preserve exact behavior paths first.
**Warning signs:** Functions such as `performAttack`, `throwWeapon`, `triggerUltimate`, `damageEnemy`, or `showUpgradeScreen` have no migrated equivalent.
</common_pitfalls>

<code_examples>
## Code Examples

### Vite Current-Directory Scaffold
```bash
# Source: Vite official guide
npm create vite@latest . -- --template vanilla
```

### Vite Scripts
```json
{
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0",
    "test": "vitest run"
  }
}
```

### Lucide Vanilla Pattern
```js
// Source: Lucide vanilla docs pattern
import { createIcons, Sword, Map, ScrollText } from 'lucide';

createIcons({ icons: { Sword, Map, ScrollText } });
```
</code_examples>

<sota_updates>
## State of the Art (2024-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Handwritten script tags for larger apps | Vite ES modules | Stable through 2026 | Easier modularization and production build. |
| Framework-first for every UI | Vanilla Vite for small app shells | Stable | Lower migration cost for plain Canvas apps. |
| One-off SVG icons | Lucide package imports | Stable | Consistent icons without manual SVG maintenance. |

**New tools/patterns to consider:**
- Vite supports modern baseline browser targets and non-interactive scaffolding.
- Lucide 1.x ecosystem supports vanilla JavaScript and framework packages.

**Deprecated/outdated:**
- Keeping all future code in one HTML file is not suitable for this project after Phase 1.
</sota_updates>

<open_questions>
## Open Questions

1. **Exact game module split**
   - What we know: `mountGame()` must be stable and behavior-preserving.
   - What's unclear: Whether one `GameApp.js` file is enough or whether the executor should split helpers immediately.
   - Recommendation: Start with `GameApp.js` plus small helpers only when extraction lowers risk; do not over-split before behavior is preserved.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- Vite official guide: https://vite.dev/guide/ — vanilla templates, non-interactive scaffold, browser support, Vite binary/scripts.
- Lucide docs/GitHub package guidance: https://github.com/lucide-icons/lucide — vanilla JavaScript package and `createIcons` pattern.

### Secondary (MEDIUM confidence)
- Project codebase map in `.planning/codebase/` — local source of truth for current demo structure and risks.

### Tertiary (LOW confidence - needs validation)
- None.
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Vite vanilla app with Canvas 2D.
- Ecosystem: Vite, Vitest, jsdom, Lucide.
- Patterns: app mount shell, Canvas mount API, DOM overlay surfaces.
- Pitfalls: migration fidelity, reference demo protection, blank shell risk.

**Confidence breakdown:**
- Standard stack: HIGH — official docs and local constraints align.
- Architecture: HIGH — based on current demo architecture and project research.
- Pitfalls: HIGH — derived from local codebase map.
- Code examples: MEDIUM — final package versions resolved during `npm install`.

**Research date:** 2026-05-23
**Valid until:** 2026-06-22
</metadata>

---

*Phase: SHPL-01-app-skeleton-and-demo-migration*
*Research completed: 2026-05-23*
*Ready for planning: yes*
