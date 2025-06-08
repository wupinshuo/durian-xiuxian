/**
 * 物品相关常量
 */

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

/** 物品品级 */
export enum ItemRank {
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

/** 物品效果类型 */
export enum ItemEffectType {
  /** 恢复气血 */
  HealHealth = "heal_health",
  /** 恢复灵力 */
  HealMana = "heal_mana",
  /** 增加修为 */
  AddCultivation = "add_cultivation",
  /** 提升属性 */
  BuffAttribute = "buff_attribute",
  /** 永久提升属性 */
  PermanentAttribute = "permanent_attribute",
}

/** 默认背包大小 */
export const DEFAULT_INVENTORY_SIZE = 20;

/** 物品出售价值折扣（百分比） */
export const ITEM_SELL_DISCOUNT = 60;
