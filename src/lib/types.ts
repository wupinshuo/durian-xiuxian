/* eslint-disable @typescript-eslint/no-explicit-any */
// 修炼境界枚举
export enum CultivationRealm {
  QiRefining = "练气",
  Foundation = "筑基",
  CoreFormation = "结丹",
  NascentSoul = "元婴",
  SpiritSevering = "化神",
  Void = "炼虚",
  Integration = "合体",
  Ascension = "大乘",
}

// 功法类型
export type SkillType =
  | "cultivation"
  | "combat"
  | "body"
  | "mental"
  | "auxiliary";

// 物品和功法品质
export type SkillRarity =
  | "common" // 凡品
  | "uncommon" // 下品
  | "rare" // 中品
  | "epic" // 上品
  | "legendary" // 极品
  | "mythic"; // 仙品

// 角色属性
export interface CharacterAttributes {
  attack: number;
  defense: number;
  spirit: number;
  speed: number;
  health: number;
  healthCurrent: number;
  mana: number;
  manaCurrent: number;
}

// 角色信息
export interface Character {
  id: string;
  name: string;
  avatar: string; // 头像图片路径
  realm: CultivationRealm; // 境界
  realmLevel: number; // 境界层级（1-12）
  realmProgress: number; // 修为进度（0-100%）
  sect?: string; // 门派
  sectPosition?: string; // 门派职位
  age: number; // 年龄
  wisdom: number; // 悟性（影响修炼速度）
  lifespan: number; // 寿元
  attributes: CharacterAttributes;
  talents: string[]; // 天赋特质
  appearance: string; // 外貌描述
}

// 功法
export interface Skill {
  id: string;
  name: string;
  description: string;
  type: SkillType;
  rarity: SkillRarity;
  element?: string; // 属性：金、木、水、火、土、风、雷等
  level: number; // 功法层级（1-9）
  progress: number; // 修炼进度（0-100%）
  maxLevel: number; // 最大可修炼层级
  effects: {
    [key: string]: number; // 效果名称和数值，如 {"attackBonus": 10, "manaRegen": 5}
  };
  requirements?: {
    realm?: CultivationRealm; // 修炼要求：最低境界
    realmLevel?: number; // 修炼要求：最低境界层级
    attributes?: Partial<CharacterAttributes>; // 修炼要求：最低属性要求
  };
  learningDifficulty: number; // 学习难度（1-100）
  unlocked: boolean; // 是否已解锁
}

// 物品
export interface Item {
  id: string;
  name: string;
  description: string;
  type: string; // pill丹药, weapon武器, material材料等
  rarity: SkillRarity;
  effects?: {
    [key: string]: number;
  };
  quantity: number;
  value: number; // 价值（灵石）
  usable: boolean; // 是否可使用
  sellable: boolean; // 是否可出售
  stackable: boolean; // 是否可叠加
  icon: string; // 图标
}

// 游戏事件
export interface GameEvent {
  id: string;
  type: string; // cultivation修炼, combat战斗, quest任务, story剧情等
  title: string;
  description: string;
  timestamp: number;
  relatedEntities?: string[]; // 关联实体的ID
  rewards?: Record<string, unknown>; // 奖励内容
  choices?: Array<Record<string, unknown>>; // 可选选项
}

// 玩家数据
export interface PlayerData {
  character: Character;
  skills: Skill[];
  inventory: {
    maxSize: number;
    items: Item[];
  };
  spiritualStones: number; // 灵石
  spiritGems: number; // 灵玉
  events: GameEvent[]; // 事件记录
  quests: Array<Record<string, unknown>>; // 任务
  statistics: {
    [key: string]: number;
  };
  settings: {
    [key: string]: unknown;
  };
}
