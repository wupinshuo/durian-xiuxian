/**
 * 游戏物品类型定义
 */

import { ItemType, SkillRank } from "@/constants";
import { SkillRarity } from "./skill";

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

/** 旧版物品接口 */
export interface LegacyItem {
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

/** 背包接口 */
export interface Inventory {
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
}
