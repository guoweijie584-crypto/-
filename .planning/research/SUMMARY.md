# Project Research Summary

**Defined:** 2026-05-23
**Project:** 山河破阵录：古城夜巡

## Stack

Use Vite + Canvas for v1. This preserves the existing playable Canvas mechanics and adds enough structure for H5/PWA deployment, DOM UI overlays, content data, and fallback AI generation.

## Table Stakes

- A 3-5 minute complete web loop.
- Weapon select with sword, blade, and spear.
- Three scenic-stage encounters ending in a boss.
- Culture unlock cards after stage clears.
- AI storyteller/title/comment behavior through local fallback templates.
- Completion travel card and `老街 -> 古井 -> 城楼` route recommendation.
- Mobile controls suitable for scan-and-play.

## Watch Outs

- Do not let combat polish crowd out the文旅 loop.
- Do not let AI generate unsupported cultural facts.
- Do not leave touch controls until the end.
- Do not introduce Phaser/backend/CMS until the single-route MVP proves the concept.

## Roadmap Guidance

Use four coarse MVP phases: app skeleton migration, gameplay loop, culture/AI/route loop, and mobile/PWA/share hardening.

