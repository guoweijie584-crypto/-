# Integrations

**Mapped:** 2026-05-23
**Scope:** Existing single-file browser demo

## Summary

The current demo has no external integrations. All gameplay, UI, state, and rendering are local to the browser and contained in `gemini-code-1779459048019_副本.html`.

## Browser APIs

| API | Usage | File |
|-----|-------|------|
| DOM selection | Reads canvas, HUD fields, modals, and option containers with `document.getElementById`. | `gemini-code-1779459048019_副本.html` |
| Canvas 2D | Renders terrain, player, enemies, projectiles, particles, damage text, and screen effects. | `gemini-code-1779459048019_副本.html` |
| Keyboard events | Tracks WASD/arrow movement and Space ultimate activation. | `gemini-code-1779459048019_副本.html` |
| Mouse events | Tracks aim position, left-click attacks, and right-click weapon throws. | `gemini-code-1779459048019_副本.html` |
| `contextmenu` event | Prevents browser context menu so right-click can throw weapons. | `gemini-code-1779459048019_副本.html` |
| `resize` event | Resizes the canvas to viewport dimensions. | `gemini-code-1779459048019_副本.html` |
| `requestAnimationFrame` | Drives the main game loop. | `gemini-code-1779459048019_副本.html` |

## External Services

None currently.

There is no AI API, route API, content CMS, analytics endpoint, login provider, payment provider, map provider, or backend.

## Data Sources

No external cultural or scenic-area data is loaded. Content currently embedded in the demo is generic action-game text rather than local heritage content:

- Title: `刀钝狗的奇幻破阵 - 动作生存游戏`
- Upgrade names such as `无锋之刃`, `极意斩击`, `雷霆步伐`
- Ultimate text `瞬狱影杀阵！`
- Controls and game-over copy

## Planned Integration Points

The target product description implies several future integrations:

- AI storyteller for Jianghu-style narrative guidance.
- AI or templated generation of culture unlock cards.
- AI title/comment generation from player performance.
- Real route recommendation from unlocked scenic spots.
- PWA install/offline support for site/event distribution.
- Optional analytics for completion, share, route clicks, and offline conversion.

## Integration Boundaries To Add

Before adding external services, create explicit boundaries:

- `content` layer for verified scenic/cultural data and card templates.
- `ai` layer for narrator/copy/title/route prompts and fallback text.
- `game` layer for deterministic combat/state events.
- `ui` layer for cards, narrator dialogue, weapon selection, and shareable completion card.

## Security Notes

No secrets are present in the existing demo. Future AI integrations must not expose private API keys in browser code. Any OpenAI or model-provider key should be called through a backend, edge function, or controlled proxy.

