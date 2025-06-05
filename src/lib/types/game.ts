/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 游戏核心类型定义
 */

/** 境界等级 */
export enum CultivationRealm {
  /** 练气 */
  QiRefining = "练气",
  /** 筑基 */
  Foundation = "筑基",
  /** 结丹 */
  CoreFormation = "结丹",
  /** 元婴 */
  NascentSoul = "元婴",
  /** 化神 */
  SpiritSevering = "化神",
  /** 空劫 */
  Void = "空劫",
}

/** 境界层次 */
export type RealmLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** 灵根类型 */
export enum SpiritRootType {
  /** 金灵根 */
  Metal = "金",
  /** 木灵根 */
  Wood = "木",
  /** 水灵根 */
  Water = "水",
  /** 火灵根 */
  Fire = "火",
  /** 土灵根 */
  Earth = "土",
  /** 雷灵根 */
  Thunder = "雷",
  /** 风灵根 */
  Wind = "风",
  /** 冰灵根 */
  Ice = "冰",
  /** 混合灵根 */
  Mixed = "混合",
  /** 混沌灵根 */
  Chaos = "混沌",
}

/** 灵根资质 */
export enum SpiritRootQuality {
  /** 下等资质 */
  Poor = "下等",
  /** 中等资质 */
  Common = "中等",
  /** 上等资质 */
  Good = "上等",
  /** 极品资质 */
  Excellent = "极品",
  /** 天灵资质 */
  Heavenly = "天灵",
}

/** 道行类型 */
export enum CultivationPath {
  /** 正道 */
  Righteous = "正道",
  /** 中立 */
  Neutral = "中立",
  /** 魔道 */
  Evil = "魔道",
}

/** 功法品级 */
export enum SkillRank {
  /** 凡品 */
  Mortal = "凡品",
  /** 下品 */
  Low = "下品",
  /** 中品 */
  Middle = "中品",
  /** 上品 */
  High = "上品",
  /** 极品 */
  Supreme = "极品",
  /** 天级 */
  Heavenly = "天级",
  /** 仙级 */
  Immortal = "仙级",
}

/** 角色基本属性 */
export interface CharacterAttributes {
  /** 攻击 */
  attack: number;
  /** 防御 */
  defense: number;
  /** 灵力 */
  spirit: number;
  /** 速度 */
  speed: number;
  /** 气血最大值 */
  health: number;
  /** 灵力最大值 */
  mana: number;
  /** 当前气血 */
  healthCurrent: number;
  /** 当前灵力 */
  manaCurrent: number;
  /** 悟性 */
  insight: number;
}

/** 角色信息 */
export interface Character {
  id: string;
  /** 角色名称 */
  name: string;
  /** 角色头像 */
  avatar: string;
  /** 境界 */
  realm: CultivationRealm;
  /** 境界层次 */
  realmLevel: RealmLevel;
  /** 境界修炼进度（0-100%） */
  realmProgress: number;
  /** 所属门派 */
  sect?: string;
  /** 门派职位 */
  sectPosition?: string;
  /** 年龄 */
  age: number;
  /** 寿元 */
  lifespan: number;
  /** 灵根 */
  spiritRoots: SpiritRootType[];
  /** 灵根资质 */
  spiritRootQuality: SpiritRootQuality;
  /** 修炼道路 */
  cultivationPath: CultivationPath;
  /** 角色属性 */
  attributes: CharacterAttributes;
}

/** 功法类型 */
export interface Skill {
  id: string;
  /** 功法名称 */
  name: string;
  /** 功法描述 */
  description: string;
  /** 功法类型: 修炼功法、战斗功法、辅助功法 */
  type: "cultivation" | "combat" | "auxiliary";
  /** 功法品级 */
  rank: SkillRank;
  /** 功法等级 */
  level: number;
  /** 最大可修炼层级 */
  maxLevel: number;
  /** 修炼进度（0-100%） */
  progress: number;
  /** 功法效果 */
  effects: SkillEffect[];
}

/** 功法效果 */
export interface SkillEffect {
  /** 效果类型 */
  type: string;
  /** 效果数值 */
  value: number;
  /** 效果描述 */
  description: string;
}

/** 物品类型 */
export enum ItemType {
  /** 丹药 */
  Pill = "丹药",
  /** 法器 */
  Weapon = "法器",
  /** 法宝 */
  Artifact = "法宝",
  /** 材料 */
  Material = "材料",
  /** 符箓 */
  Talisman = "符箓",
  /** 任务物品 */
  Quest = "任务物品",
}

/** 物品 */
export interface Item {
  id: string;
  /** 物品名称 */
  name: string;
  /** 物品描述 */
  description: string;
  /** 物品类型 */
  type: ItemType;
  /** 物品品级 */
  rank: SkillRank;
  /** 是否可堆叠 */
  stackable: boolean;
  /** 数量 */
  quantity: number;
  /** 物品效果 */
  effects?: ItemEffect[];
  /** 价值（灵石） */
  value: number;
  /** 是否可使用 */
  usable: boolean;
}

/** 物品效果 */
export interface ItemEffect {
  /** 效果类型 */
  type: string;
  /** 效果数值 */
  value: number;
  /** 持续时间（秒） */
  duration?: number;
  /** 效果描述 */
  description: string;
}

/** 游戏事件 */
export interface GameEvent {
  id: string;
  /** 事件类型 */
  type: string;
  /** 事件标题 */
  title: string;
  /** 事件描述 */
  description: string;
  /** 事件时间戳 */
  timestamp: number;
  /** 事件效果 */
  effects?: any[];
}

/** 玩家完整数据 */
export interface PlayerData {
  /** 角色信息 */
  character: Character;
  /** 已学功法 */
  skills: Skill[];
  inventory: {
    /** 背包物品 */
    items: Item[];
    /** 背包容量 */
    capacity: number;
    /** 背包最大容量 */
    maxSize: number;
    /** 货币 */
    currency: {
      /** 灵石 */
      spiritualStones: number;
      /** 灵玉 */
      spiritGems: number;
    };
  };
  /** 事件记录 */
  events: GameEvent[];
}
