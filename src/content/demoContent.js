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
      subtitle: '青石板路上的商贸灯火',
      sourceNote: '演示资料：后续替换为真实老街历史与商贸文化来源。',
      unlockStage: 1,
      routeOrder: 1,
      teaser: '青石板路与沿街灯影，藏着古城夜市的第一段故事。',
      body: '老街线索聚焦古城街巷、铺面和夜市灯火，适合承载商旅往来与地方生活记忆。',
      heritageHint: '可替换为老字号、街巷格局、传统市集或地方手作资料。',
      visitTip: '线下可从街口牌坊或主街入口开始，顺着灯笼和铺面标识慢行观察。',
      tags: ['街巷', '商贸', '夜市']
    },
    {
      spotId: 'ancient-well',
      title: '古井回声阵',
      subtitle: '井沿水脉与民俗回声',
      sourceNote: '演示资料：后续替换为真实古井传说、水系和民俗资料。',
      unlockStage: 2,
      routeOrder: 2,
      teaser: '井沿回声不散，像在复述一座城的水脉记忆。',
      body: '古井线索聚焦居民取水、城中水脉和围绕井口形成的传说叙事。',
      heritageHint: '可替换为古井年代、井圈形制、水系关系或地方祭井习俗资料。',
      visitTip: '到达井点后留意井沿石材、周边巷口和水系方向，不攀爬井口。',
      tags: ['水脉', '民俗', '传说']
    },
    {
      spotId: 'stone-bridge',
      title: '石桥渡影阵',
      subtitle: '水巷桥灯与舟行记忆',
      sourceNote: '演示资料：后续替换为真实水巷石桥、桥梁营造与舟行民俗资料。',
      unlockStage: 3,
      routeOrder: 3,
      teaser: '桥灯沿水巷次第亮起，像把夜巡火种送过雾中的河面。',
      body: '石桥线索聚焦桥梁连接街巷与水路的功能，以及水边通行和夜间灯影景观。',
      heritageHint: '可替换为桥名来历、桥拱结构、驳岸做法或舟行交通资料。',
      visitTip: '过桥时先看桥面铺石和栏板，再回望水巷两侧的灯影层次。',
      tags: ['桥梁', '水巷', '舟行']
    },
    {
      spotId: 'garden-maze',
      title: '园林迷踪阵',
      subtitle: '曲径漏窗里的造景暗门',
      sourceNote: '演示资料：后续替换为真实园林空间、游线与造景资料。',
      unlockStage: 4,
      routeOrder: 4,
      teaser: '曲径、漏窗与树影交叠，藏着通往城楼前的最后暗门。',
      body: '园林线索聚焦曲径、框景、漏窗和小尺度空间转换，让玩家从战斗路线转入游赏路线。',
      heritageHint: '可替换为园林年代、造园手法、植物配置或题刻匾额资料。',
      visitTip: '进入园林段后放慢节奏，观察转角、窗洞和树影如何组织视线。',
      tags: ['园林', '造景', '游线']
    },
    {
      spotId: 'city-tower',
      title: '城楼镇妖阵',
      subtitle: '登临城防与古城收束',
      sourceNote: '演示资料：后续替换为真实城楼营造、城防和登临路线资料。',
      unlockStage: 5,
      routeOrder: 5,
      teaser: '登城望远，雾甲守将把最后一段路线压在城楼风口。',
      body: '城楼线索聚焦城门、城墙和登临视野，是五点路线从街巷到城防的最终收束。',
      heritageHint: '可替换为城楼建造年代、城防体系、城门名称或登城视角资料。',
      visitTip: '登临时回看刚走过的街巷、水点和桥园路线，形成完整古城方位感。',
      tags: ['城防', '登临', '收束']
    }
  ],
  route: [
    { spotId: 'old-street', title: '老街', routeOrder: 1, visitHint: '从老街入口进入，先看街巷灯火和沿街铺面。' },
    { spotId: 'ancient-well', title: '古井', routeOrder: 2, visitHint: '转入古井点位，观察井沿、水脉与周边巷口。' },
    { spotId: 'stone-bridge', title: '石桥', routeOrder: 3, visitHint: '沿水巷走到石桥，留意桥面、栏板和河岸灯影。' },
    { spotId: 'garden-maze', title: '园林', routeOrder: 4, visitHint: '进入园林曲径，寻找漏窗、框景和转角视线。' },
    { spotId: 'city-tower', title: '城楼', routeOrder: 5, visitHint: '最后登临城楼，回望整条古城夜巡路线。' }
  ]
};
