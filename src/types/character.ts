/**
 * 角色相关类型定义
 */

import {
  CultivationRealm,
  SpiritRootType,
  SpiritRootQuality,
  CultivationPath,
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

// 扩展角色信息接口，包含更多角色相关信息
export interface ExtendedCharacter extends Character {
  talents?: string[]; // 天赋特质
  appearance?: string; // 外貌描述
  wisdom?: number; // 悟性（影响修炼速度）
  background?: string; // 角色背景故事
  relations?: Record<string, string>; // 角色关系
}
