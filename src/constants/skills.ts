/**
 * 技能和功法相关常量
 */

/** 功法类型 */
export enum SkillType {
  /** 修炼功法 */
  Cultivation = "cultivation",
  /** 战斗功法 */
  Combat = "combat",
  /** 体修功法 */
  Body = "body",
  /** 神识功法 */
  Mental = "mental",
  /** 辅助功法 */
  Auxiliary = "auxiliary",
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

/** 功法效果类型 */
export enum SkillEffectType {
  /** 攻击加成 */
  AttackBonus = "attack_bonus",
  /** 防御加成 */
  DefenseBonus = "defense_bonus",
  /** 灵力加成 */
  SpiritBonus = "spirit_bonus",
  /** 速度加成 */
  SpeedBonus = "speed_bonus",
  /** 修炼速度加成 */
  CultivationSpeedBonus = "cultivation_speed_bonus",
  /** 气血恢复速度加成 */
  HealthRegenBonus = "health_regen_bonus",
  /** 灵力恢复速度加成 */
  ManaRegenBonus = "mana_regen_bonus",
}

/** 功法最大等级 */
export const MAX_SKILL_LEVEL = 7;

/** 功法修炼进度满值 */
export const MAX_SKILL_PROGRESS = 100;
