export const demoContent = {
  title: '山河破阵录：古城夜巡',
  weapons: [
    {
      id: 'sword',
      name: '剑',
      trait: '灵活剑气',
      description: '剑走轻灵，适合快速破开灯影妖阵。'
    },
    {
      id: 'blade',
      name: '刀',
      trait: '横扫重击',
      description: '刀势沉猛，适合压制成群纸人怪。'
    },
    {
      id: 'spear',
      name: '枪',
      trait: '突进穿刺',
      description: '枪如游龙，适合穿阵直取守将。'
    },
    {
      id: 'daggers',
      name: '双月匕',
      trait: '近身连闪',
      description: '双匕轻快，适合贴身连续破影。'
    },
    {
      id: 'ring',
      name: '月轮刃',
      trait: '环刃回旋',
      description: '月轮回旋，适合扫开侧翼妖影。'
    },
    {
      id: 'fan',
      name: '符箓折扇',
      trait: '符风封阵',
      description: '折扇引符，适合远距封阵控场。'
    }
  ],
  uiPlaceholders: {
    narrator: '雾起古城，巡夜人入阵。先稳住脚步，再寻灯影里的破绽。',
    culture: '文化线索待解锁',
    completion: '江湖游历卡待生成',
    route: '游览路线待推荐'
  },
  cultureCards: [
    {
      spotId: 'old-street',
      title: '老街灯影阵',
      sourceNote: '演示资料：后续替换为真实老街历史与商贸文化来源。',
      unlockStage: 1,
      routeOrder: 1,
      teaser: '青石板路与沿街灯影，藏着古城夜市的第一段故事。'
    },
    {
      spotId: 'ancient-well',
      title: '古井回声阵',
      sourceNote: '演示资料：后续替换为真实古井传说、水系和民俗资料。',
      unlockStage: 2,
      routeOrder: 2,
      teaser: '井沿回声不散，像在复述一座城的水脉记忆。'
    },
    {
      spotId: 'stone-bridge',
      title: '石桥渡影阵',
      sourceNote: '演示资料：后续替换为真实水巷石桥、桥梁营造与舟行民俗资料。',
      unlockStage: 3,
      routeOrder: 3,
      teaser: '桥灯沿水巷次第亮起，像把夜巡火种送过雾中的河面。'
    },
    {
      spotId: 'garden-maze',
      title: '园林迷踪阵',
      sourceNote: '演示资料：后续替换为真实园林空间、游线与造景资料。',
      unlockStage: 4,
      routeOrder: 4,
      teaser: '曲径、漏窗与树影交叠，藏着通往城楼前的最后暗门。'
    },
    {
      spotId: 'city-tower',
      title: '城楼镇妖阵',
      sourceNote: '演示资料：后续替换为真实城楼营造、城防和登临路线资料。',
      unlockStage: 5,
      routeOrder: 5,
      teaser: '登城望远，雾甲守将把最后一段路线压在城楼风口。'
    }
  ],
  route: [
    { spotId: 'old-street', title: '老街', routeOrder: 1 },
    { spotId: 'ancient-well', title: '古井', routeOrder: 2 },
    { spotId: 'stone-bridge', title: '石桥', routeOrder: 3 },
    { spotId: 'garden-maze', title: '园林', routeOrder: 4 },
    { spotId: 'city-tower', title: '城楼', routeOrder: 5 }
  ]
};
