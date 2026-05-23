export const STAGE_IDS = ['old-street', 'ancient-well', 'stone-bridge', 'garden-maze', 'city-tower'];

export const STAGES = [
  {
    id: 'old-street',
    title: '老街灯影阵',
    objective: {
      type: 'lamps',
      label: '击退妖影，点亮 3 盏灯',
      target: 3,
      pointsKey: 'old-street-lamps',
      ultimateTask: '终极任务：点亮老街三盏夜巡灯，破开第一重灯影妖雾'
    },
    enemies: ['lamp-shadow', 'paper-doll']
  },
  {
    id: 'ancient-well',
    title: '古井回声阵',
    objective: {
      type: 'echo-fragments',
      label: '收集回声碎片，避开井影波纹',
      target: 5,
      pointsKey: 'well-echo-fragments',
      ultimateTask: '终极任务：集齐古井五枚回声碎片，唤醒水脉记忆'
    },
    enemies: ['well-shadow']
  },
  {
    id: 'stone-bridge',
    title: '石桥渡影阵',
    objective: {
      type: 'lamps',
      label: '护送火种过桥，点亮 4 盏桥灯',
      target: 4,
      pointsKey: 'bridge-lanterns',
      ultimateTask: '终极任务：点亮桥头四盏引路灯，护住夜巡火种过桥'
    },
    enemies: ['paper-doll', 'well-shadow']
  },
  {
    id: 'garden-maze',
    title: '园林迷踪阵',
    objective: {
      type: 'echo-fragments',
      label: '穿过曲径，收集 6 枚园林回声',
      target: 6,
      pointsKey: 'garden-echo-fragments',
      ultimateTask: '终极任务：集齐六枚园林回声，找到通往城楼的暗门'
    },
    enemies: ['lamp-shadow', 'well-shadow']
  },
  {
    id: 'city-tower',
    title: '城楼镇妖阵',
    objective: {
      type: 'talismans',
      label: '守住城门，击破镇妖护符',
      target: 3,
      pointsKey: 'tower-talismans',
      ultimateTask: '终极任务：击破三道镇妖护符，逼出雾甲守将真身'
    },
    enemies: ['paper-doll', 'lamp-shadow']
  }
];

export function getStageDefinition(stageId) {
  return STAGES.find((stage) => stage.id === stageId) ?? STAGES[0];
}

export function createStageProgress(stageId) {
  const stage = getStageDefinition(stageId);
  return {
    id: stage.id,
    type: stage.objective.type,
    label: stage.objective.label,
    ultimateTask: stage.objective.ultimateTask,
    pointsKey: stage.objective.pointsKey ?? stage.objective.type,
    current: 0,
    target: stage.objective.target,
    complete: false
  };
}

export function getStageSnapshot(stageIndex, progress) {
  const stage = STAGES[stageIndex] ?? STAGES[0];
  return {
    id: stage.id,
    title: stage.title,
    index: stageIndex + 1,
    total: STAGES.length,
    objective: {
      type: progress.type,
      label: progress.label,
      ultimateTask: progress.ultimateTask,
      current: progress.current,
      target: progress.target,
      complete: progress.complete
    }
  };
}
