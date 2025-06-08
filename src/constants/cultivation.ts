/**
 * 修炼相关常量
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
  /** 炼虚 */
  Void = "炼虚",
  /** 合体 */
  Integration = "合体",
  /** 大乘 */
  Ascension = "大乘",
}

/** 境界层次 最高10层 */
export type RealmLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

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

/** 默认每层修为进度满值 */
export const MAX_REALM_PROGRESS = 100;

/** 每个境界最大层级 1-10 */
export const MAX_REALM_LEVEL = 10;

/** 突破天劫概率（百分比） */
export const TRIBULATION_PROBABILITY = 5;

/** 走火入魔概率（百分比） */
export const DEVIATION_PROBABILITY = 5;

/** 走火入魔修为倒退百分比 */
export const DEVIATION_PROGRESS = 0.3;

/**正常修炼修为进度百分比 */
export const NORMAL_PROGRESS = 3;

/** 修炼功法进度百分比 */
export const SKILL_PROGRESS = 0.3;
