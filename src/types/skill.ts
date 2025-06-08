/**
 * 游戏技能类型定义
 */

import { SkillRank } from "@/constants";
import { Character, CharacterAttributes } from "./character";

/** 技能效果 */
export interface SkillEffect {
  /** 效果类型 */
  type: string;
  /** 效果数值 */
  value: number;
  /** 效果描述 */
  description: string;
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

/** UI组件使用的技能类型 */
export interface UISkill {
  id: string;
  /** 功法名称 */
  name: string;
  /** 功法描述 */
  description: string;
  /** 功法类型 */
  type: SkillType;
  /** 功法品级（使用旧版字符串枚举） */
  rarity: SkillRarity;
  /** 功法等级 */
  level: number;
  /** 最大可修炼层级 */
  maxLevel: number;
  /** 修炼进度（0-100%） */
  progress: number;
  /** 功法效果（使用对象格式） */
  effects: {
    [key: string]: number;
  };
  /** 学习难度 */
  learningDifficulty: number;
  /** 是否已解锁 */
  unlocked: boolean;
}

/** 功法类型 */
export type SkillType =
  | "cultivation" // 修炼功法
  | "combat" // 战斗功法
  | "body" // 体修功法
  | "mental" // 神识功法
  | "auxiliary"; // 辅助功法

/** 功法品级类型（旧版） */
export type SkillRarity =
  | "common" // 凡品
  | "uncommon" // 下品
  | "rare" // 中品
  | "epic" // 上品
  | "legendary" // 极品
  | "mythic"; // 仙品

/** 功法要求 */
export interface SkillRequirement {
  /** 修炼要求：最低境界 */
  realm?: Character["realm"];
  /** 修炼要求：最低境界层级 */
  realmLevel?: number;
  /** 修炼要求：最低属性要求 */
  attributes?: Partial<CharacterAttributes>;
  /** 修炼要求：悟性要求 */
  insight?: number;
}
