---
phase: 1
slug: app-skeleton-and-demo-migration
status: approved
shadcn_initialized: false
preset: none
created: 2026-05-23
---

# Phase 1 — UI Design Contract

> Visual and interaction contract for the Vite + Canvas app shell and preserved demo migration.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none |
| Preset | not applicable |
| Component library | none |
| Icon library | lucide (`lucide` package for vanilla DOM icons) |
| Font | system UI stack with Microsoft YaHei fallback |

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, tight HUD labels |
| sm | 8px | Compact controls, pill gaps |
| md | 16px | Default overlay padding |
| lg | 24px | Shell panel padding |
| xl | 32px | Major card gaps |
| 2xl | 48px | Full-screen modal spacing |
| 3xl | 64px | Not used in Phase 1 shell |

Exceptions: none

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 15px | 400 | 1.5 |
| Label | 12px | 600 | 1.35 |
| Heading | 20px | 700 | 1.25 |
| Display | 28px | 800 | 1.15 |

Letter spacing: 0 for all roles.

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | #101613 | Game page background and shell base |
| Secondary (30%) | #25342C | HUD panels, modal surfaces, controls |
| Accent (10%) | #D7A84B | Primary action, active weapon, key route moments |
| Support | #54C6B2 | Energy, narrator signal, interactive focus |
| Destructive | #C9493D | Damage, death, destructive warning only |

Accent reserved for: active weapon, stage-clear highlight, primary CTA, important route marker.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA | 开始夜巡 |
| Weapon select heading | 选择兵器 |
| Narrator label | AI 说书人 |
| Culture card placeholder | 文化线索待解锁 |
| Completion placeholder | 江湖游历卡待生成 |
| Route placeholder | 游览路线待推荐 |
| Empty state heading | 尚未破阵 |
| Empty state body | 通关后解锁文化线索与游览路线。 |
| Error state | 游戏加载失败，请刷新后重试。 |
| Destructive confirmation | 重新开始：当前进度将清空。 |

---

## Layout Contract

- Canvas is full-bleed inside the viewport, not framed in a decorative card.
- HUD and product UI are DOM overlays above Canvas.
- Phase 1 shell must reserve stable regions for:
  - top-left combat HUD
  - top/right or bottom narrator strip
  - weapon selection/start panel
  - culture card modal
  - completion card panel
  - route panel
- Cards are allowed for individual modals or repeated content only; do not place page sections inside cards.
- Text must not overlap buttons, bars, canvas controls, or modal content at desktop and phone viewport widths.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | none | not required |
| third-party blocks | none | not allowed in Phase 1 |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-05-23
