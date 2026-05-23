# Structure

**Mapped:** 2026-05-23
**Scope:** Existing single-file browser demo

## Repository Layout

```text
.
├── .git/
├── .planning/
│   └── codebase/
│       ├── ARCHITECTURE.md
│       ├── CONCERNS.md
│       ├── CONVENTIONS.md
│       ├── INTEGRATIONS.md
│       ├── STACK.md
│       ├── STRUCTURE.md
│       └── TESTING.md
└── gemini-code-1779459048019_副本.html
```

The only source file is `gemini-code-1779459048019_副本.html`.

## Source File Organization

`gemini-code-1779459048019_副本.html` is organized into three broad sections:

| Section | Approximate Location | Responsibility |
|---------|----------------------|----------------|
| `<head>` metadata and CSS | top of file | Page metadata, fullscreen layout, HUD bars, modal styles, upgrade option styles. |
| `<body>` DOM | middle of file | Game container, HUD, upgrade modal, game-over modal, canvas. |
| `<script>` game logic | remainder of file | Input, state, gameplay simulation, rendering, UI updates, game loop. |

## DOM Structure

The body has one primary root:

- `#game-container`

Children:

- `#ui-layer`: overlay HUD and controls hint.
- `#upgrade-modal`: upgrade selection modal.
- `#gameover-modal`: game-over modal.
- `#gameCanvas`: Canvas render target.

## Script Structure

The script follows this rough order:

1. Canvas/DOM references and browser event listeners.
2. Canvas resize handling.
3. Global camera and terrain initialization.
4. Player object and gameplay arrays.
5. Upgrade definitions.
6. Reset/helpers/effects functions.
7. Combat functions.
8. Progression and UI update functions.
9. Main `update()` simulation.
10. Drawing helpers and `render()`.
11. `gameLoop()` startup.

## Important Functions

| Function | Role |
|----------|------|
| `resizeCanvas()` | Sets canvas dimensions to the viewport. |
| `initTerrain()` | Generates random terrain decorations. |
| `resetGame()` | Resets all major state and hides modals. |
| `distance()` | Utility for collision/range checks. |
| `spawnText()` | Creates floating damage/status text. |
| `spawnParticles()` | Creates simple particle effects. |
| `triggerUltimate()` | Executes ultimate teleport and area damage. |
| `throwWeapon()` | Creates a thrown weapon projectile. |
| `spawnEnemy()` | Spawns random enemies around the player. |
| `performAttack()` | Resolves melee swing attacks and sword-wave creation. |
| `damageEnemy()` | Applies damage and handles kill rewards. |
| `checkLevelUp()` | Advances level and pauses into upgrade selection. |
| `showUpgradeScreen()` | Renders three random upgrade choices. |
| `updateUI()` | Syncs DOM HUD with game state. |
| `hurtPlayer()` | Applies player damage and triggers game-over. |
| `update()` | Main simulation tick. |
| `drawGrass()` / `drawFlower()` | Terrain decoration drawing. |
| `drawPlayer()` | Player body, weapon, energy aura, and swing arc drawing. |
| `drawEnemy()` | Enemy drawing and enemy HP bars. |
| `render()` | Main render pass. |
| `gameLoop()` | Calls update/render every animation frame. |

## Naming And Domain Fit

The current file still carries prototype naming from an earlier concept:

- Page title references `刀钝狗的奇幻破阵`.
- Player comments and game-over text refer to `刀钝狗`.
- Enemy types are `neutral_animal`, `silly_dog`, and `fierce_monster`.

The target product should rename these concepts to the new domain:

- player: `巡夜少侠`
- enemy types: `灯影妖`, `纸人怪`, `井影`, `雾甲守将`
- stages: `老街灯影阵`, `古井回声阵`, `城楼镇妖阵`
- weapons: sword, blade, spear variants with distinct behavior.

## Files Missing For A Production-Shaped App

The repository does not yet include:

- `package.json`
- source directory such as `src/`
- module boundaries
- asset directory
- cultural content data files
- AI integration layer
- PWA manifest/service worker
- tests
- README

