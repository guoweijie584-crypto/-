import { describe, expect, it, vi } from 'vitest';

import { drawPlayer } from '../src/game/rendering.js';
import { createInitialGameState } from '../src/game/gameState.js';

function createContextMock() {
  return {
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    ellipse: vi.fn(),
    fillText: vi.fn(),
    closePath: vi.fn(),
    strokeRect: vi.fn(),
    rect: vi.fn(),
    scale: vi.fn(),
    quadraticCurveTo: vi.fn(),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() }))
  };
}

describe('player rendering', () => {
  it('keeps the anime player body static while rotating six weapons around it', () => {
    const ctx = createContextMock();
    const state = createInitialGameState({ selectedWeapon: 'sword' });
    const aimAngle = Math.PI / 4;
    state.gameTime = 0;
    state.player.x = 0;
    state.player.y = 0;

    drawPlayer(ctx, state, {
      mouse: { worldX: Math.cos(aimAngle) * 100, worldY: Math.sin(aimAngle) * 100 },
      keys: {}
    });

    expect(ctx.rotate.mock.calls.length).toBeGreaterThanOrEqual(6);
    for (let index = 0; index < 6; index += 1) {
      const expectedAngle = aimAngle + Math.PI / 2 + (Math.PI * 2 * index) / 6;
      expect(ctx.rotate.mock.calls.some(([angle]) => Math.abs(angle - expectedAngle) < 0.005)).toBe(true);
    }
    expect(ctx.translate.mock.calls).toContainEqual([state.player.x, state.player.y]);
    const orbitRadius = state.player.radius + 25;
    const orbitTranslations = ctx.translate.mock.calls.filter(([x, y]) => {
      const distance = Math.hypot(x, y);
      return Math.abs(distance - orbitRadius) < 0.005;
    });
    expect(orbitTranslations).toHaveLength(6);
  });
});
