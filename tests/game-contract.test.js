import { afterEach, describe, expect, it, vi } from 'vitest';

import { mountGame } from '../src/game/GameApp.js';

const context = {
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

HTMLCanvasElement.prototype.getContext = vi.fn(() => context);
HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 1024,
  height: 640,
  left: 0,
  top: 0,
  right: 1024,
  bottom: 640
}));

globalThis.requestAnimationFrame = vi.fn((callback) => setTimeout(callback, 16));
globalThis.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));

afterEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = '';
});

describe('mountGame', () => {
  it('mounts gameCanvas and returns the public control contract', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const game = mountGame(container);

    expect(container.querySelector('#gameCanvas')).toBeTruthy();
    expect(game.start).toBeTypeOf('function');
    expect(game.stop).toBeTypeOf('function');
    expect(game.reset).toBeTypeOf('function');
    expect(game.setWeapon).toBeTypeOf('function');
    expect(game.selectUpgrade).toBeTypeOf('function');
    expect(game.getSnapshot).toBeTypeOf('function');

    const snapshot = game.getSnapshot();
    expect(snapshot).toHaveProperty('status');
    expect(snapshot).toHaveProperty('player');
    expect(snapshot).toHaveProperty('selectedWeapon', 'sword');
    expect(snapshot).toHaveProperty('weapon');
    expect(snapshot).toHaveProperty('stage');
    expect(snapshot).toHaveProperty('boss');
    expect(snapshot.boss).toMatchObject({
      active: false,
      phase: 0,
      title: '雾甲守将'
    });
    expect(snapshot).toHaveProperty('runSummary', null);
    expect(snapshot.stage).toMatchObject({
      id: 'old-street',
      title: '老街灯影阵',
      objective: { type: 'lamps', current: 0, target: 3 }
    });
    expect(snapshot.objectives).toMatchObject({ type: 'lamps', current: 0, target: 3 });
    expect(snapshot.weapon.attack.style).toBe('sword-wave');
    expect(snapshot.runStats.selectedUpgrades).toEqual([]);
    expect(snapshot).toHaveProperty('kills');

    expect(() => game.stop()).not.toThrow();
  });

  it('accepts an initial weapon and can update the weapon before play starts', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const game = mountGame(container, { selectedWeapon: 'blade' });
    expect(game.getSnapshot().selectedWeapon).toBe('blade');
    expect(game.getSnapshot().weapon.attack.style).toBe('broad-slash');

    game.setWeapon('spear');
    expect(game.getSnapshot().selectedWeapon).toBe('spear');
    expect(game.getSnapshot().weapon.attack.style).toBe('thrust-dash');

    game.stop();
  });
});
