/**
 * 类型转换工具函数
 * 帮助在新旧类型系统之间进行转换
 */

import { SkillRank } from "@/constants";
import { Skill, UISkill, SkillEffect, SkillRarity, SkillType } from "@/types";

/**
 * 将系统 Skill 类型转换为 UI 使用的 UISkill 类型
 */
export function convertToUISkill(skill: Skill): UISkill {
  // 转换 rank 到 rarity
  const rarity = convertRankToRarity(skill.rank);

  // 转换 effects
  const effectsObj: { [key: string]: number } = {};
  if (skill.effects && Array.isArray(skill.effects)) {
    skill.effects.forEach((effect: SkillEffect) => {
      effectsObj[effect.type] = effect.value;
    });
  }

  return {
    id: skill.id,
    name: skill.name,
    description: skill.description,
    type: skill.type as SkillType,
    rarity,
    level: skill.level,
    progress: skill.progress,
    maxLevel: skill.maxLevel,
    effects: effectsObj,
    learningDifficulty: 50, // 默认值
    unlocked: true, // 默认值
  };
}

/**
 * 将 SkillRank 枚举转换为 SkillRarity 字符串
 */
export function convertRankToRarity(rank: SkillRank): SkillRarity {
  switch (rank) {
    case SkillRank.Mortal:
      return "common";
    case SkillRank.Low:
      return "uncommon";
    case SkillRank.Middle:
      return "rare";
    case SkillRank.High:
      return "epic";
    case SkillRank.Supreme:
      return "legendary";
    case SkillRank.Heavenly:
    case SkillRank.Immortal:
    default:
      return "mythic";
  }
}

/**
 * 将 SkillRarity 字符串转换为 SkillRank 枚举
 */
export function convertRarityToRank(rarity: SkillRarity): SkillRank {
  switch (rarity) {
    case "common":
      return SkillRank.Mortal;
    case "uncommon":
      return SkillRank.Low;
    case "rare":
      return SkillRank.Middle;
    case "epic":
      return SkillRank.High;
    case "legendary":
      return SkillRank.Supreme;
    case "mythic":
    default:
      return SkillRank.Immortal;
  }
}

/**
 * 将对象格式的 effects 转换为数组格式
 */
export function convertEffectsToArray(effectsObj: {
  [key: string]: number;
}): SkillEffect[] {
  return Object.entries(effectsObj).map(([type, value]) => ({
    type,
    value,
    description: getEffectDescription(type, value),
  }));
}

/**
 * 获取效果描述
 */
function getEffectDescription(type: string, value: number): string {
  switch (type) {
    case "attackBonus":
      return `增加攻击力 ${value}`;
    case "defenseBonus":
      return `增加防御力 ${value}`;
    case "spiritBonus":
      return `增加灵力 ${value}`;
    case "speedBonus":
      return `增加速度 ${value}`;
    case "cultivationSpeed":
      return `增加修炼速度 ${value}%`;
    default:
      return `${type}: ${value}`;
  }
}
