function getWeapon(content, weaponId) {
  return content.weapons.find((weapon) => weapon.id === weaponId) ?? content.weapons[0];
}

function getClearedStages(summary = {}) {
  return (summary.stages ?? []).filter((stage) => stage.complete);
}

function formatTime(seconds = 0) {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}分${String(rest).padStart(2, '0')}秒`;
}

export function createOnboardingNarration(content) {
  const firstStop = content.route[0]?.title ?? '古城';
  const lastStop = content.route.at(-1)?.title ?? '城楼';
  return `雾起${firstStop}，夜巡人入阵。沿灯影一路破关，终点在${lastStop}。`;
}

export function createStageNarration(stage, context = {}) {
  const weapon = context.weapon?.name ?? '兵器';
  const indexText = stage?.index && stage?.total ? `第 ${stage.index} / ${stage.total} 阵` : '下一阵';
  return `${indexText}：${stage?.title ?? '古城阵门'}已开。执${weapon}稳住节奏，先破任务，再寻文化线索。`;
}

export function createCultureUnlockNarration(card, context = {}) {
  const weapon = context.weapon?.name ?? '兵器';
  return `线索解开：${card.title}。${card.teaser} 执${weapon}继续巡夜，下一处路标已亮。`;
}

export function createTravelTitle(summary = {}, content) {
  const weapon = getWeapon(content, summary.selectedWeapon);
  const clearedCount = getClearedStages(summary).length;
  const hp = summary.remainingHp ?? 0;
  const victory = summary.victory === true;

  if (victory && clearedCount >= content.route.length && hp >= 80) {
    return `${weapon.name}定山河`;
  }
  if (victory && (summary.kills ?? 0) >= 45) {
    return `${weapon.name}破雾侠`;
  }
  if (victory) {
    return `${weapon.name}巡城客`;
  }
  return `${weapon.name}问路人`;
}

export function createCompletionComment(summary = {}, unlockedCards = [], content) {
  const weapon = getWeapon(content, summary.selectedWeapon);
  const clearedCount = getClearedStages(summary).length;
  const routeCount = content.route.length;
  const timeText = formatTime(summary.completionTime);
  const hp = summary.remainingHp ?? 0;
  const hpTone = hp >= 70 ? '气血尚足' : hp >= 35 ? '带伤守阵' : '险胜收刀';

  if (summary.victory) {
    return `${hpTone}，以${weapon.name}清出 ${clearedCount}/${routeCount} 处夜巡线索，用时 ${timeText}。已解锁 ${unlockedCards.length} 张文化卡，适合按路线线下跟走。`;
  }
  return `本轮以${weapon.name}探到 ${clearedCount}/${routeCount} 处线索，用时 ${timeText}。整理已解锁文化卡后，可再入阵补全路线。`;
}

export function createCompletionNarration(summary = {}, unlockedCards = [], content) {
  const title = createTravelTitle(summary, content);
  const finalStop = content.route.at(-1)?.title ?? '终点';
  return `${title}归档。${finalStop}风口的妖雾已散，${unlockedCards.length} 处文化线索并入江湖游历卡。`;
}

export function createRouteRecommendation(route = [], cards = []) {
  const cardBySpot = new Map(cards.map((card) => [card.spotId, card]));
  const ordered = [...route].sort((a, b) => a.routeOrder - b.routeOrder);
  const routeText = ordered.map((stop) => stop.title).join(' -> ');
  const stopLines = ordered.map((stop) => {
    const card = cardBySpot.get(stop.spotId);
    const hint = stop.visitHint ?? card?.visitTip ?? card?.teaser ?? '';
    return `${stop.title}：${hint}`;
  });
  return {
    routeText,
    stopLines,
    summary: `夜巡路线建议：${routeText}。先按游戏解锁顺序走，再在每处停留查看对应文化线索。`
  };
}
