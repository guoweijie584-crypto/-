# Stack

**Mapped:** 2026-05-23
**Scope:** Existing single-file browser demo

## Summary

The current codebase is a standalone HTML5 Canvas action-survival demo in `gemini-code-1779459048019_副本.html`. It has no build step, no package manager metadata, and no external runtime dependencies. The browser provides all execution primitives: DOM, Canvas 2D, keyboard/mouse events, and `requestAnimationFrame`.

## Languages And Runtime

| Area | Current Choice | Evidence |
|------|----------------|----------|
| Markup | HTML | `gemini-code-1779459048019_副本.html` contains the full document structure. |
| Styling | Inline CSS in `<style>` | HUD, modal, bars, and body layout are defined in the same file. |
| Game logic | Plain JavaScript in `<script>` | Game state, input, update loop, collision, spawning, rendering, and UI updates are all in one script. |
| Rendering | HTML5 Canvas 2D | `const ctx = canvas.getContext('2d')` drives all player, enemy, terrain, projectile, particle, and text drawing. |
| Runtime | Modern browser | Runs by opening the HTML file directly; no server required for current behavior. |

## Frameworks And Libraries

No frameworks or libraries are currently installed or referenced.

There is no `package.json`, no Phaser import, no module system, and no CDN dependency. The current implementation is deliberately lightweight but not yet structured for a larger H5/PWA product.

## Application Surface

The demo currently exposes:

- Fullscreen Canvas game surface via `#gameCanvas`.
- HTML HUD via `#ui-layer` for HP, EXP, energy, level, kills, and controls.
- Upgrade modal via `#upgrade-modal`.
- Game-over modal via `#gameover-modal`.

## Configuration

No external configuration files exist. Game tuning values are embedded as constants or object fields in `gemini-code-1779459048019_副本.html`, including:

- `MAP_SIZE = 4000`
- player stats such as `speed`, `hp`, `attackCooldown`, `damageMult`, `rangeMult`
- enemy HP/speed/EXP formulas in `spawnEnemy()`
- upgrade definitions in `UPGRADES`

## Build And Run

Current run path:

1. Open `gemini-code-1779459048019_副本.html` in a browser.
2. The script initializes terrain, updates UI, and starts `requestAnimationFrame(gameLoop)`.

There is no development server, bundler, linter, or test command.

## Fit For Target Product

The existing stack is enough for a quick prototype of action gameplay. For the target H5/PWA cultural-tourism game, the stack should likely evolve toward:

- A Vite-based web app for asset loading, module boundaries, local dev server, and deployment.
- Phaser 3 or a structured Canvas engine layer for scene/state management if gameplay grows beyond the current demo.
- Separate UI components for AI narrator, culture unlock cards, itinerary card, and activity landing/share flows.
- A service-worker/PWA layer after the first playable slice is stable.

## Decisions To Preserve

- Canvas 2D is already sufficient for fast browser-based action and works well for scan-and-play H5.
- HTML overlay UI is already used for HUD and modals, which matches the desired split between game canvas and regular Web UI.
- No dependency lock-in exists yet; choosing Phaser 3, Vite, or plain Canvas remains open.

