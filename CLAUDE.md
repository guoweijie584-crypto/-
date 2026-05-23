# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

《山河破阵录：古城夜巡》— a Vite + Canvas H5/PWA action mini-game. Players pick a weapon and clear three culture-themed stages (老街 → 古井 → 城楼) plus a boss to unlock cultural cards and a recommended walking route. The legacy single-file demo at `gemini-code-1779459048019_副本.html` is the design reference and **must not be edited** unless a GSD plan explicitly says so.

The repo path contains CJK characters (`黑客松-山河破阵录`); always quote it in shell commands.

## Commands

- `npm run dev` — Vite dev server, bound to `0.0.0.0` for LAN/mobile testing.
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve the built bundle on `0.0.0.0`.
- `npm test` — run the full Vitest suite once (jsdom env).
- `npx vitest run tests/game-contract.test.js` — run a single test file.
- `npx vitest run -t "<name>"` — run a single test by name.

There is no lint/typecheck script; do not invent one.

## Architecture

### Boot path

`index.html` → `src/main.js` wires three pieces:

1. `createAppState()` (`src/app/appState.js`) — tiny pub/sub store. The `emit(eventName, payload)` method has hard-coded side effects for specific events (`weapon:selected`, `game:upgrade-available`, `game:upgrade-selected`, `game:started`, `game:reset`, `game:snapshot`, `game:completed`); adding new lifecycle events usually means editing this switch.
2. `renderShell(root, appState, content)` (`src/ui/shell.js`) — builds the DOM overlay (HUD, weapon panel, upgrade panel, boss panel, victory panel, narrator, culture/route placeholders) using Lucide icons. Returns imperative handles (`updateHud`, `showUpgradePanel`, `showVictory`, …). The shell renders **around** a `#game-root` div that hosts the canvas.
3. `mountGame(gameRoot, { selectedWeapon, emit })` (`src/game/GameApp.js`) — creates the canvas, runs the game loop, and emits snapshots back through the same `emit` callback.

The shell and game never call each other directly; they communicate by emitting events on the app-state bus. `main.js` is the only place that subscribes and forwards. When wiring new UI ↔ game interactions, follow this pattern instead of importing across the boundary.

### Game module layout (`src/game/`)

- `GameApp.js` — public entry. `mountGame()` returns `{ start, stop, reset, setWeapon, selectUpgrade, getSnapshot }`. Owns the `requestAnimationFrame` loop, input wiring, attack/upgrade/objective/boss orchestration, and emits `game:snapshot`, `game:upgrade-available`, `game:upgrade-selected`, `game:objective-updated`, `game:stage-changed`, `game:boss-started`, `game:completed`.
- `gameState.js` — `createInitialGameState()` is the single source of truth for the in-game state shape (player, camera, objectives, runStats, enemies, projectiles, particles, …). `reset()` re-runs this and `Object.assign`s back onto the live state, so adding a field requires updating this factory.
- `stages.js` — `STAGES` array drives stage progression: `old-street` (light 3 lamps) → `ancient-well` (collect 5 echo fragments) → `city-tower` (break 3 talismans) → boss. `getStageSnapshot()` is what the HUD reads.
- `weapons.js` — `WEAPON_IDS = ['sword','blade','spear','daggers','ring','fan']`, full `WEAPONS` definitions, and per-weapon upgrade trees via `getWeaponUpgrades()`. Adding a weapon means updating: this file, `src/content/demoContent.js` weapons list, the orbiting-weapon list in `rendering.js`, and `visualAssets.js`.
- `cityMap.js` — `SUZHOU_CITY_MAP` (Pingjiang Road / Panmen) plus `moveCircleWithCollisions`, `isSegmentBlocked`, `clampToCityBounds`, and `getStageObjectivePoints()`. All player/enemy/projectile movement must go through these so collisions stay consistent.
- `boss.js`, `enemies.js`, `effects.js`, `runSummary.js` — boss FSM, enemy factory by `behavior` (`fast-chase` / `surround` / `ripple-ranged`), particle/text spawners, and the victory payload shape consumed by the shell.
- `rendering.js` (~1.4k lines) — all canvas drawing. Uses sprite sheets from `visualAssets.js` with deterministic Canvas fallbacks; `onPlayerSpriteReady` / `onEnemySpritesReady` let `GameApp` re-render once async images load.
- `visualAssets.js` — manifest of player/enemy/weapon/effect/scene-prop sprite paths and fallback palettes. The render layer always falls back to procedural Canvas drawing when sprites are missing, so it is safe to ship without bundled image assets.
- `audio.js` — `createSoundController()` wraps `WebAudio` with named profiles (`attack`, `hit`, `stage`, `victory`, …). Mute and missing-AudioContext both no-op safely.
- `input.js` — keyboard/mouse, exposes `keys`, `mouse`, and binds `Q` (ultimate) / `E` (throw weapon).

### Content & UI

- `src/content/demoContent.js` — title, weapon list (UI side), `cultureCards`, `route`, and narrator placeholder copy. Cultural copy is intentionally placeholder; the `sourceNote` field marks it as demo data to be replaced with sourced facts (per the conventions, AI/fallback rewrites tone but does not invent facts).
- `src/ui/shell.js` — DOM templates are inline; HUD updates happen via `data-hud="*"` attributes. Panels toggle visibility through the `is-hidden` class.
- `src/styles.css` — single global stylesheet for the shell.

### State & event contract

When changing the game ↔ UI contract, update all four sides together: the snapshot shape in `GameApp.getSnapshot()`, the event payload emitted from `GameApp`, the side effects in `appState.emit`, and the consumers in `shell.js` (`updateHud`, `showUpgradePanel`, `updateBoss`, `showVictory`).

## Conventions (from AGENTS.md)

- Identifiers and code in English; user-facing game/culture strings in Chinese.
- Keep Canvas/game code free of AI/network calls. AI v1 is local fallback templates only — no provider API keys in frontend code.
- Treat scenic/cultural content as structured verified data; AI/fallback rewrites tone but does not invent facts.
- DOM UI (narrator, culture cards, completion card, route panel) sits around the canvas, not inside it.

## GSD workflow

This project uses the GSD planning workflow. Before making non-trivial edits, route work through a GSD entry point so `.planning/STATE.md` and phase artifacts stay in sync:

- `$gsd-quick` — small fixes / docs / ad-hoc tasks (artifacts land in `.planning/quick/`).
- `$gsd-debug` — investigation & bug fixing.
- `$gsd-plan-phase N` / `$gsd-execute-phase` — planned phase work (`.planning/phases/SHPL-NN-*`).

Direct edits outside a GSD workflow are only appropriate when the user explicitly asks to bypass it. `.planning/STATE.md` is the live progress index; `AGENTS.md` mirrors core project/stack/conventions sections.

## Testing notes

- Vitest runs in `jsdom`. Tests for `GameApp` mock `HTMLCanvasElement.prototype.getContext` and `requestAnimationFrame` (see `tests/game-contract.test.js` for the shared canvas-context stub) — copy that pattern when adding canvas-touching tests.
- `tests/visual-assets.test.js` and `tests/player-rendering.test.js` guard the sprite manifest and render fallback paths; update them when changing `visualAssets.js`.
