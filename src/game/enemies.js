export const ENEMY_TYPES = ['lamp-shadow', 'paper-doll', 'well-shadow'];

export const ENEMIES = {
  'lamp-shadow': {
    id: 'lamp-shadow',
    name: '灯影妖',
    hp: 34,
    speed: 3.7,
    radius: 20,
    expValue: 18,
    behavior: 'fast-chase',
    damage: 11
  },
  'paper-doll': {
    id: 'paper-doll',
    name: '纸人怪',
    hp: 44,
    speed: 2.6,
    radius: 18,
    expValue: 16,
    behavior: 'surround',
    damage: 9
  },
  'well-shadow': {
    id: 'well-shadow',
    name: '井影',
    hp: 55,
    speed: 2.1,
    radius: 22,
    expValue: 22,
    behavior: 'ripple-ranged',
    damage: 10
  }
};

export function createEnemy(type, position, gameTime = 0) {
  const definition = ENEMIES[type] ?? ENEMIES['lamp-shadow'];
  const hp = definition.hp + gameTime * 0.8;
  return {
    x: position.x,
    y: position.y,
    type: definition.id,
    name: definition.name,
    hp,
    maxHp: hp,
    speed: definition.speed,
    radius: definition.radius,
    expValue: definition.expValue,
    hitCooldown: 0,
    behavior: definition.behavior,
    damage: definition.damage,
    targetAngle: Math.random() * Math.PI * 2,
    seed: Math.random(),
    actionTimer: 30 + Math.floor(Math.random() * 50)
  };
}
