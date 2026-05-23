# Phase 1: App Skeleton And Demo Migration - Pattern Map

**Mapped:** 2026-05-23
**Phase:** SHPL-01-app-skeleton-and-demo-migration

## Source Pattern

The closest existing analog is the current single-file demo:

- `gemini-code-1779459048019_副本.html`

## Pattern Extraction

| Target Area | Existing Analog | Pattern To Preserve |
|-------------|-----------------|---------------------|
| Canvas mount | `#gameCanvas` and `const ctx = canvas.getContext('2d')` | The Canvas fills the viewport and is the primary game surface. |
| Game loop | `gameLoop() { update(); render(); requestAnimationFrame(gameLoop); }` | Simulation and rendering are separate functions called each frame. |
| Input state | `keys` object and `mouse` object | Event listeners update input state; `update()` consumes it. |
| Player state | `player` object | Store position, HP, EXP, energy, attack cooldown, and upgrade flags together. |
| Entity arrays | `enemies`, `droppedWeapons`, `projectiles`, `particles`, `damageTexts` | Keep active world objects in arrays and filter expired objects each frame. |
| DOM HUD | `#ui-layer`, `updateUI()` | DOM overlays can reflect game state without drawing UI in Canvas. |
| Modals | `#upgrade-modal`, `#gameover-modal` | Use DOM modal surfaces for choices and end states. |

## Target File Mapping

| Target File | Role | Existing Reference |
|-------------|------|--------------------|
| `src/main.js` | App entry that mounts shell and game | top-level script startup and `requestAnimationFrame(gameLoop)` |
| `src/game/GameApp.js` | Canvas game mount and migrated loop | entire script block in old HTML |
| `src/ui/shell.js` | DOM shell and placeholder product surfaces | `#ui-layer`, `#upgrade-modal`, `#gameover-modal` |
| `src/app/appState.js` | Shared app state/event bridge | `gameState`, `kills`, `player`, UI update calls |
| `src/content/demoContent.js` | Replaceable route/card placeholder content | no existing analog; required by PROJECT/REQUIREMENTS |
| `src/styles.css` | App, overlay, modal, HUD styling | old `<style>` block |

## Migration Rules

- Read `gemini-code-1779459048019_副本.html` before touching any migrated game file.
- Do not edit `gemini-code-1779459048019_副本.html`.
- Preserve the exported game API: `mountGame(container, options)`.
- Preserve gameplay function equivalents for `performAttack`, `throwWeapon`, `triggerUltimate`, `damageEnemy`, `checkLevelUp`, `showUpgradeScreen`, `updateUI`, `update`, and `render`.
- Keep game logic isolated from culture card, narrator, and route generation behavior in Phase 1.

## Known Fragile Areas

- Enemy removal during `forEach` loops.
- Explosion projectile hit tracking uses one `hitEnemies` flag.
- Ultimate teleports to mouse world position before clamping.
- Long sessions can accumulate many active objects.
- Existing controls are desktop-first; mobile controls remain Phase 4.

