export function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

export function spawnText(state, x, y, text, color = '#fff', size = 16) {
  state.damageTexts.push({ x, y, text, color, alpha: 1, vy: -2, age: 0, size });
}

export function spawnParticles(state, x, y, color, count, speed, life = 0.02) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const spd = Math.random() * speed;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      radius: 2 + Math.random() * 4,
      color,
      alpha: 1,
      decay: life
    });
  }
}
