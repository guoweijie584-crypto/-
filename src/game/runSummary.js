import { STAGES } from './stages.js';

export function createRunSummary(state) {
  return {
    selectedWeapon: state.selectedWeapon,
    kills: state.kills,
    remainingHp: Math.max(0, Math.floor(state.player.hp)),
    completionTime: Number(state.gameTime.toFixed(1)),
    victory: state.gameState === 'victory',
    stages: STAGES.map((stage) => ({
      id: stage.id,
      title: stage.title,
      complete: state.stageStatus.some((item) => item.id === stage.id && item.complete)
    })),
    echoFragments: state.runStats.echoFragments,
    bossPhaseReached: state.runStats.bossPhaseReached,
    selectedUpgrades: state.runStats.selectedUpgrades.map((upgrade) => ({ ...upgrade })),
    damageTaken: Math.floor(state.runStats.damageTaken)
  };
}
