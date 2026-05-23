export function render(ctx, canvas, state, input) {
  const { camera, terrain, droppedWeapons, projectiles, enemies, particles, damageTexts } = state;

  ctx.fillStyle = '#101613';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  if (state.screenShake > 0) {
    ctx.translate((Math.random() - 0.5) * state.screenShake, (Math.random() - 0.5) * state.screenShake);
  }
  ctx.translate(-camera.x, -camera.y);

  drawWorld(ctx, canvas, camera, terrain);
  drawDroppedWeapons(ctx, state, droppedWeapons);
  drawProjectiles(ctx, projectiles);
  enemies.forEach((enemy) => drawEnemy(ctx, state, enemy));
  drawPlayer(ctx, state, input);
  drawParticles(ctx, particles);
  drawDamageTexts(ctx, damageTexts);

  ctx.restore();
}

function drawWorld(ctx, canvas, camera, terrain) {
  ctx.fillStyle = '#162119';
  ctx.fillRect(camera.x - 80, camera.y - 80, canvas.width + 160, canvas.height + 160);

  ctx.strokeStyle = 'rgba(215, 168, 75, 0.18)';
  ctx.lineWidth = 2;
  const grid = 160;
  const startX = Math.floor((camera.x - 80) / grid) * grid;
  const startY = Math.floor((camera.y - 80) / grid) * grid;

  for (let x = startX; x < camera.x + canvas.width + 160; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, camera.y - 80);
    ctx.lineTo(x, camera.y + canvas.height + 80);
    ctx.stroke();
  }

  for (let y = startY; y < camera.y + canvas.height + 160; y += grid) {
    ctx.beginPath();
    ctx.moveTo(camera.x - 80, y);
    ctx.lineTo(camera.x + canvas.width + 80, y);
    ctx.stroke();
  }

  const viewBuffer = 100;
  terrain.decorations.forEach((decoration) => {
    if (
      decoration.x > camera.x - viewBuffer &&
      decoration.x < camera.x + canvas.width + viewBuffer &&
      decoration.y > camera.y - viewBuffer &&
      decoration.y < camera.y + canvas.height + viewBuffer
    ) {
      if (decoration.type === 'grass') {
        drawGrass(ctx, decoration.x, decoration.y);
      } else {
        drawFlower(ctx, decoration.x, decoration.y, decoration.color);
      }
    }
  });
}

function drawGrass(ctx, x, y) {
  ctx.strokeStyle = '#54C6B2';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 3, y - 8);
  ctx.moveTo(x, y);
  ctx.lineTo(x + 2, y - 10);
  ctx.moveTo(x, y);
  ctx.lineTo(x + 5, y - 6);
  ctx.stroke();
}

function drawFlower(ctx, x, y, color) {
  ctx.fillStyle = color;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.arc(x + Math.cos(i * Math.PI / 2) * 3, y + Math.sin(i * Math.PI / 2) * 3, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawPlayer(ctx, state, input) {
  const { player, gameTime } = state;
  const { mouse } = input;

  ctx.save();
  ctx.translate(player.x, player.y);

  if (player.energy >= player.maxEnergy) {
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#54C6B2';
    ctx.strokeStyle = '#54C6B2';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, player.radius + Math.sin(gameTime * 10) * 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = '#D7A84B';
  ctx.beginPath();
  ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#25342C';
  ctx.lineWidth = 3;
  ctx.stroke();

  const aimAngle = Math.atan2(mouse.worldY - player.y, mouse.worldX - player.x);
  ctx.rotate(aimAngle);

  ctx.fillStyle = '#101613';
  ctx.beginPath();
  ctx.arc(8, -6, 3, 0, Math.PI * 2);
  ctx.arc(8, 6, 3, 0, Math.PI * 2);
  ctx.fill();

  if (player.hasWeapon) {
    ctx.shadowBlur = 14;
    ctx.shadowColor = `hsl(${player.colorHue}, 100%, 58%)`;
    ctx.strokeStyle = '#f7f1d2';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(12 + 40 * player.rangeMult, 0);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#D7A84B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(15, -8);
    ctx.lineTo(15, 8);
    ctx.stroke();
  }

  ctx.restore();

  if (player.isSwingAnimating) {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.shadowBlur = 20;
    ctx.shadowColor = `hsl(${player.colorHue}, 100%, 50%)`;
    ctx.strokeStyle = `hsla(${player.colorHue}, 100%, 70%, 0.82)`;
    ctx.lineWidth = player.hasWeapon ? 12 : 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 0, (player.hasWeapon ? 65 : 40) * player.rangeMult, player.swingStart, player.swingEnd);
    ctx.stroke();
    ctx.restore();
  }
}

export function drawEnemy(ctx, state, enemy) {
  const { player } = state;
  ctx.save();
  ctx.translate(enemy.x, enemy.y);

  const lookAngle = enemy.behavior === 'chase'
    ? Math.atan2(player.y - enemy.y, player.x - enemy.x)
    : enemy.targetAngle || 0;
  ctx.rotate(lookAngle);

  if (enemy.type === 'neutral_animal') {
    ctx.fillStyle = '#f3f0df';
    ctx.beginPath();
    ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#D7A84B';
    ctx.beginPath();
    ctx.ellipse(enemy.radius, 0, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (enemy.type === 'silly_dog') {
    ctx.fillStyle = '#73533b';
    ctx.beginPath();
    ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#D7A84B';
    ctx.beginPath();
    ctx.ellipse(enemy.radius, 0, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#C9493D';
    ctx.fillStyle = '#25342C';
    ctx.beginPath();
    ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#C9493D';
    ctx.beginPath();
    ctx.arc(enemy.radius * 0.6, -10, 4, 0, Math.PI * 2);
    ctx.arc(enemy.radius * 0.6, 10, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  if (enemy.hp < enemy.maxHp) {
    const barW = enemy.radius * 2;
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(enemy.x - barW / 2, enemy.y - enemy.radius - 12, barW, 6);
    ctx.fillStyle = '#C9493D';
    ctx.fillRect(enemy.x - barW / 2, enemy.y - enemy.radius - 12, barW * (enemy.hp / enemy.maxHp), 6);
  }
}

function drawDroppedWeapons(ctx, state, droppedWeapons) {
  droppedWeapons.forEach((weapon) => {
    ctx.save();
    ctx.translate(weapon.x, weapon.y);
    if (weapon.isFlying) {
      ctx.rotate((state.gameTime * 30) % (Math.PI * 2));
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#54C6B2';
    }
    ctx.strokeStyle = '#f7f1d2';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(20, 0);
    ctx.stroke();
    ctx.strokeStyle = '#D7A84B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-8, -8);
    ctx.lineTo(-8, 8);
    ctx.stroke();
    ctx.restore();
  });
}

function drawProjectiles(ctx, projectiles) {
  projectiles.forEach((projectile) => {
    ctx.save();
    if (projectile.type === 'explosion') {
      ctx.fillStyle = `rgba(215, 168, 75, ${projectile.duration / 20})`;
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (projectile.type === 'wave') {
      ctx.shadowBlur = 15;
      ctx.shadowColor = projectile.color;
      ctx.fillStyle = projectile.color;
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (projectile.type === 'ult_line' || projectile.type === 'ult_chain') {
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#54C6B2';
      ctx.strokeStyle = projectile.type === 'ult_line' ? '#54C6B2' : '#D7A84B';
      ctx.lineWidth = projectile.type === 'ult_line' ? 10 * (projectile.duration / 20) : 3;
      ctx.beginPath();
      ctx.moveTo(projectile.x1, projectile.y1);
      ctx.lineTo(projectile.x2, projectile.y2);
      ctx.stroke();
    }
    ctx.restore();
  });
}

function drawParticles(ctx, particles) {
  particles.forEach((particle) => {
    ctx.globalAlpha = particle.alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawDamageTexts(ctx, damageTexts) {
  damageTexts.forEach((text) => {
    ctx.globalAlpha = text.alpha;
    ctx.fillStyle = text.color;
    ctx.font = `bold ${text.size}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(text.text, text.x, text.y);
  });
  ctx.globalAlpha = 1;
}
