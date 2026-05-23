export const STAGE_IDS = ['old-street', 'ancient-well', 'city-tower'];

export const STAGES = [
  {
    id: 'old-street',
    title: '老街灯影阵',
    objective: {
      type: 'lamps',
      label: '击退妖影，点亮 3 盏灯',
      target: 3
    },
    enemies: ['lamp-shadow', 'paper-doll']
  },
  {
    id: 'ancient-well',
    title: '古井回声阵',
    objective: {
      type: 'echo-fragments',
      label: '收集回声碎片，避开井影波纹',
      target: 5
    },
    enemies: ['well-shadow']
  },
  {
    id: 'city-tower',
    title: '城楼镇妖阵',
    objective: {
      type: 'talismans',
      label: '守住城门，击破镇妖护符',
      target: 3
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
      current: progress.current,
      target: progress.target,
      complete: progress.complete
    }
  };
}
