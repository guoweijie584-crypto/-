---
phase: 2
slug: three-stage-combat-loop
status: approved
shadcn_initialized: false
preset: none
created: 2026-05-23
---

# Phase 2 — UI Design Contract

> Visual and interaction contract for weapon selection, stage objectives, boss state, and victory summary in the Canvas + DOM H5 shell.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none |
| Preset | not applicable |
| Component library | none |
| Icon library | lucide (`lucide` package for vanilla DOM icons) |
| Font | keep Phase 1 stack: `"Trebuchet MS", "Microsoft YaHei", "PingFang SC", sans-serif` |
| Rendering split | Canvas for gameplay visuals; DOM overlays for status, weapon choice, upgrade choices, objective text, and victory summary |

Phase 2 must preserve the Phase 1 first-screen direction: the game is the product surface, not a landing page.

---

## Spacing Scale

Declared values must stay compatible with Phase 1 CSS variables:

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, meter labels |
| sm | 8px | Weapon chips, objective rows, compact button gaps |
| md | 16px | Default overlay padding |
| lg | 24px | Upgrade/victory panel padding |
| xl | 32px | Modal groups and summary sections |
| 2xl | 48px | Full-screen modal spacing |

No new spacing scale should be introduced in Phase 2.

---

## Typography

| Role | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| Body | 15px | 400 | 1.5 | Narrative and summary text |
| Label | 12px | 600 | 1.35 | HUD labels, objective status, stage meta |
| Heading | 20px | 700 | 1.25 | Panel headings and upgrade modal title |
| Display | 28px | 800 | 1.15 | Game title and victory heading only |

Letter spacing: `0` for all roles. Do not scale font size with viewport width.

---

## Color

Phase 2 inherits the Phase 1 palette and assigns gameplay semantics:

| Role | Value | Usage |
|------|-------|-------|
| Dominant | `#101613` | Game page background and deep night Canvas base |
| Secondary | `#25342C` | HUD panels, modal surfaces, neutral objective blocks |
| Accent | `#D7A84B` | Active weapon, stage-complete markers, lamps, victory highlights |
| Support | `#54C6B2` | Energy, sword/echo effects, active objective focus |
| Destructive | `#C9493D` | Damage, boss warning, failed/blocked objective states |

Weapon accent mapping:

| Weapon | Primary UI signal | Secondary signal |
|--------|-------------------|------------------|
| Sword | `#54C6B2` | pale sword-wave glow |
| Blade | `#D7A84B` | warm heavy-impact flash |
| Spear | `#f4efe0` | teal thrust trail |

Boss warning and low HP states must use `#C9493D`, not purple/red gradients.

---

## Copywriting Contract

All visible Phase 2 copy should be concise and playable. Avoid tutorial paragraphs.

| Element | Copy |
|---------|------|
| Start CTA | 开始夜巡 |
| Weapon heading | 选择兵器 |
| Sword label | 剑 |
| Sword trait | 灵活剑气 |
| Blade label | 刀 |
| Blade trait | 横扫重击 |
| Spear label | 枪 |
| Spear trait | 突进穿刺 |
| Upgrade modal heading | 选择功法 |
| Stage 1 title | 老街灯影阵 |
| Stage 1 objective | 击退妖影，点亮 3 盏灯 |
| Stage 2 title | 古井回声阵 |
| Stage 2 objective | 收集回声碎片，避开井影波纹 |
| Stage 3 title | 城楼镇妖阵 |
| Stage 3 objective | 守住城门，击破镇妖护符 |
| Boss title | 雾甲守将 |
| Boss phase 1 | 破甲前 |
| Boss phase 2 | 雾甲觉醒 |
| Victory heading | 破阵成功 |
| Completion placeholder | 江湖游历卡待生成 |
| Route placeholder | 游览路线待推荐 |
| Phase 3 hold copy | 通关数据已记录，游历卡将在下一阶段生成。 |

Phase 2 must not display generated AI titles, generated completion comments, culture-card body content, or real route recommendations.

---

## Layout Contract

- Canvas remains full-bleed under DOM overlays.
- Top-left combat HUD remains compact and should add stage/objective status without becoming a large card.
- Weapon selection remains in the right-side panel before the run starts. After the run starts, selected weapon can collapse to a compact weapon badge.
- Upgrade choices may use a centered modal or right-side panel, but each option must show weapon-specific `功法` title and one-line effect.
- Stage objective status must be visible during play without blocking the player at center screen.
- Boss HP/status should be a top-center or top-right overlay, not inside the existing weapon panel.
- Victory summary should be a modal/panel over the Canvas after boss defeat, showing performance data and a `江湖游历卡` placeholder only.
- The route panel stays placeholder-only in Phase 2.
- Do not put UI cards inside other cards.
- Text must not overlap on desktop or phone viewports. If mobile space is constrained, hide nonessential Phase 3 placeholder panels before shrinking gameplay below usability.

Stable DOM roots or selectors expected by planning/execution:

| Surface | Required selector/role |
|---------|------------------------|
| Stage HUD | `#stage-panel` or `[data-panel="stage"]` |
| Objective status | `[data-hud="objective"]` |
| Upgrade modal/panel | `#upgrade-panel` or `[data-panel="upgrade"]` |
| Boss status | `#boss-panel` or `[data-panel="boss"]` |
| Victory summary | `#victory-panel` or `[data-panel="victory"]` |
| Completion placeholder | existing `#completion-panel` |

---

## Interaction Contract

- Weapon buttons are selectable before starting the run and should visually show the active weapon.
- Starting the run locks or collapses weapon selection; weapon switching mid-run is out of scope.
- Upgrade selection must be a deliberate player choice when level-up happens. Auto-applying random upgrades is not acceptable after Phase 2.
- Stage transitions should update the stage title/objective copy immediately.
- Victory state should stop combat simulation and present the summary panel.
- Reset keeps the existing `重新开始` affordance and returns to the pre-run weapon selection state.

---

## Canvas Visual Contract

Canvas visuals may stay shape-based but must make Phase 2 mechanics inspectable:

| Mechanic | Visual signal |
|----------|---------------|
| Lamps | warm gold markers that visibly switch from unlit to lit |
| Echo fragments | teal collectible shards or circles |
| Echo waves | expanding support-colored rings with clear danger timing |
| Talismans/gate | gold or paper-like objective markers near city tower area |
| Boss charge | red warning line/telegraph before movement |
| Boss slash | red/orange arc or radius telegraph before hit |
| Fog armor | visible shield ring or muted armor halo after half HP |
| Victory | brief accent/support burst before the DOM victory panel |

All telegraphs must be readable against the dark green Canvas base.

---

## Responsive Contract

Desktop target:

- `1280x720` and wider should show Canvas, combat HUD, weapon/stage panels, narrator, and placeholders without overlap.

Phone target in Phase 2:

- Touch gameplay is Phase 4, but visual layout must not collapse incoherently at phone width.
- On narrow screens, hide culture/route placeholders during active combat and keep stage objective, weapon badge, HP/energy, and start/reset controls visible.
- Victory panel must fit within the viewport with scroll if needed.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not required |
| third-party blocks | none | not allowed in Phase 2 |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-05-23
