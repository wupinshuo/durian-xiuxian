/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 游戏核心类型定义
 */

import {
  CultivationRealm,
  SpiritRootType,
  SpiritRootQuality,
  CultivationPath,
  SkillRank,
  ItemType,
  RealmLevel,
} from "@/constants";

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
