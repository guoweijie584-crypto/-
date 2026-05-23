# Architecture

**Mapped:** 2026-05-23
**Scope:** Existing single-file browser demo

## Summary

The current architecture is a monolithic browser game in `gemini-code-1779459048019_副本.html`. It combines document structure, CSS, game state, input handling, simulation, rendering, and UI updates in one file. The runtime model is a classic imperative Canvas loop: collect input, mutate global state in `update()`, draw current state in `render()`, repeat through `requestAnimationFrame`.

## Entry Points

| Entry Point | Responsibility |
|-------------|----------------|
| HTML document load | Defines DOM, canvas, HUD, upgrade modal, game-over modal, and script. |
| Script top level | Creates `canvas`, `ctx`, global game state, player state, arrays, event listeners, and terrain. |
| `updateUI()` | Initializes HUD values before the loop starts. |
| `requestAnimationFrame(gameLoop)` | Starts the continuous update/render loop. |

## State Model

State is stored in module-global variables inside the script:

- `gameState`: `playing`, `upgrade`, or `gameover`.
- `kills`, `gameTime`, `spawnTimer`, `screenShake`.
- `keys` and `mouse` for input state.
- `camera` for viewport tracking.
- `terrain.decorations` for generated grass/flower decoration.
- `player` object for position, stats, weapon state, attack state, upgrade flags, and visual hue.
- `enemies`, `droppedWeapons`, `projectiles`, `particles`, `damageTexts` arrays.

There is no separation between authoritative state and presentation state. Most functions mutate globals directly.

## Main Loop

`gameLoop()` calls:

1. `update()`
2. `render()`
3. `requestAnimationFrame(gameLoop)`

`update()` is skipped unless `gameState === 'playing'`, which pauses simulation during upgrade and game-over modals. `render()` still runs every frame, keeping the last game scene visible behind overlays.

## Input Flow

Keyboard:

- `keydown` and `keyup` mutate `keys`.
- Space triggers `triggerUltimate()`.
- WASD and arrow keys are read in `update()` to move the player.

Mouse:

- `mousemove` stores screen-space aim coordinates.
- `update()` converts screen-space mouse coordinates into world coordinates through `camera`.
- Left mouse hold repeatedly calls `performAttack()` when cooldown reaches zero.
- Right mouse down calls `throwWeapon()`.

## Gameplay Flow

Combat and progression are managed by direct function calls:

- `spawnEnemy()` creates enemy objects around the player using random type selection and game-time scaling.
- `performAttack()` checks range and cone angle against every enemy, then calls `damageEnemy()`.
- `throwWeapon()` creates a flying dropped weapon; `update()` handles flight, collision, pickup, and optional explosion.
- `triggerUltimate()` teleports to mouse world position, deals area damage, and spawns line/chain visual effects.
- `damageEnemy()` handles HP reduction, kill accounting, EXP, energy, particles, vampiric heal, enemy removal, level-up check, and UI updates.
- `checkLevelUp()` switches to upgrade state and calls `showUpgradeScreen()`.
- `showUpgradeScreen()` chooses three random upgrades from `UPGRADES` and binds click handlers.

## Rendering Flow

`render()`:

1. Clears screen with a dark background.
2. Applies screen shake and camera translation.
3. Draws visible terrain decorations.
4. Draws dropped weapons.
5. Draws projectiles/effects.
6. Draws enemies.
7. Draws player and swing arc.
8. Draws particles.
9. Draws floating damage text.

Rendering functions include `drawGrass()`, `drawFlower()`, `drawPlayer()`, and `drawEnemy()`.

## UI Flow

The HUD is not drawn in Canvas. It is standard DOM layered over the canvas:

- `updateUI()` updates HP, EXP, energy bars and text.
- `showUpgradeScreen()` builds upgrade option DOM nodes.
- `hurtPlayer()` displays the game-over modal when HP reaches zero.
- `resetGame()` resets state and hides modals.

This split is useful for the target product because AI dialogue, culture cards, unlock cards, and final route cards can be regular Web UI while the action gameplay stays in Canvas.

## Current Architectural Limits

- All data and behavior are in one file, making feature additions risky.
- No scene abstraction exists for weapon selection, stage progression, cultural card unlocks, boss fight, or final card.
- No content model exists for real scenic/cultural information.
- No event bus or domain events exist for `level cleared`, `card unlocked`, `boss defeated`, or `route generated`.
- Combat logic, visual effects, and UI updates are tightly coupled.
- No deterministic time-step or seeded randomness exists, so behavior is hard to test.

## Recommended Next Architecture

For the first production-shaped version, split into:

- `game`: player, enemies, weapons, stages, collision, effects, update/render loop.
- `content`: stage definitions, scenic spot metadata, non-heritage clues, card copy, route nodes.
- `ai`: prompt builders, provider calls, fallback generators.
- `ui`: weapon select, narrator dialogue, culture cards, completion card, share/route panels.
- `app`: routing, persistence, PWA shell, analytics hooks.

