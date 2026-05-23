# Concerns

**Mapped:** 2026-05-23
**Scope:** Existing single-file browser demo

## Summary

The demo is a useful gameplay prototype, but it is not yet product-shaped for an AI cultural-tourism H5/PWA. The largest risks are monolithic structure, desktop-only controls, lack of stage/content model, no AI boundary, no factual-content safeguards, and no test coverage.

## Technical Debt

| Concern | Evidence | Impact |
|---------|----------|--------|
| Monolithic file | All HTML, CSS, JS, game logic, and rendering live in `gemini-code-1779459048019_副本.html`. | Hard to extend safely into stages, cards, AI, PWA, and share flow. |
| Global mutable state | `player`, `enemies`, `projectiles`, `particles`, `damageTexts`, `gameState`, and timers are all globals. | Bugs become harder to isolate as mechanics grow. |
| No content model | Cultural cards, scenic spots, stage metadata, and route data do not exist. | Core文旅 value cannot be implemented cleanly without a data layer. |
| Prototype naming | Title, player copy, and enemy types still reflect the old demo concept. | User-facing identity is inconsistent with `山河破阵录：古城夜巡`. |
| No mobile controls | Input depends on keyboard, mouse, left/right click, and Space. | Scan-and-play H5 usage on phones will fail without touch controls. |
| No asset pipeline | Visuals are drawn as Canvas primitives. | Fast for prototype, but limits scenic atmosphere, share card polish, and brand quality. |

## Gameplay Risks

- No stage progression exists; current gameplay is endless survival.
- No boss-specific behavior exists; `fierce_monster` is just a larger chasing enemy.
- Weapon identity is binary `hasWeapon`, not sword/blade/spear classes.
- Enemy spawning is time-based and infinite, not tied to stage objectives.
- Level-up interrupts action but is unrelated to cultural unlocks or level goals.
- No win condition exists, only game-over and survival progression.

## Product Risks

- AI-generated cultural content could hallucinate facts unless grounded in verified scenic-area data.
- The cultural unlock cards are the core differentiator, but no implementation exists yet.
- Route recommendation must be explicit about being a real itinerary, not a fantasy path.
- Shareable completion cards require stable layout and probably image export, neither exists yet.
- The product needs a 3-5 minute complete loop; current endless survival has no designed endpoint.

## Security And Privacy Risks

- No secrets exist now.
- Future AI provider keys must not be shipped in frontend code.
- If analytics or share tracking is added, avoid collecting unnecessary personal data.
- If user-generated names or card text are added, sanitize before rendering into DOM.

## Performance Risks

- Terrain generation creates 2000 decorations at reset. Rendering culls by viewport, which helps.
- Enemies, particles, and damage texts are maintained in arrays with per-frame iteration.
- Long sessions may accumulate enough active objects to affect lower-end phones.
- The game currently targets desktop input and may not be tuned for mobile browser frame budgets.

## Accessibility And UX Risks

- Current controls hint assumes keyboard and mouse.
- Right-click weapon throwing is unavailable or awkward on many mobile browsers.
- Color-heavy feedback may need non-color cues.
- Modal text and HUD spacing have not been checked across small mobile screens.
- No pause/menu/help state exists.

## Immediate Remediation Priorities

1. Convert the demo into a structured H5 app with separate game, content, and UI modules.
2. Add stage data for `老街灯影阵`, `古井回声阵`, and `城楼镇妖阵`.
3. Replace old demo identity with the new Jianghu cultural-tourism theme.
4. Implement weapon selection and distinct sword/blade/spear behaviors.
5. Add mobile/touch controls early, before gameplay balancing.
6. Add a factual content layer and AI fallback copy before live AI integration.
7. Add at least browser smoke tests once a dev app structure exists.

