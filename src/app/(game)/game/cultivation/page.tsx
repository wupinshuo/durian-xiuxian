"use client";

import React from "react";
import EnhancedCultivationPanel from "@/components/game/EnhancedCultivationPanel";
import SkillSelector from "@/components/game/SkillSelector";
import CharacterEditor from "@/components/game/CharacterEditor";
import { useGameData } from "@/store/GameDataContext";
import { FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import { Skill as UISkill, SkillRarity, SkillType } from "@/lib/types";
import { Skill as GameSkill, SkillEffect } from "@/lib/types/game";

export default function CultivationPage() {
  const { skills } = useGameData();

  // 将游戏系统中的技能转换为UI组件需要的技能类型
  const enhancedSkills: UISkill[] = skills.map((skill: GameSkill) => {
    // 转换effects从SkillEffect[]到{[key: string]: number}
    const convertedEffects: { [key: string]: number } = {};
    // console.log(skill.effects);
    if (skill.effects) {
      skill.effects.forEach((effect: SkillEffect) => {
        convertedEffects[effect.type] = effect.value;
      });
    }

    return {
      id: skill.id,
      name: skill.name,
      description: skill.description,
      type: (skill.type === "auxiliary" ||
      skill.type === "combat" ||
      skill.type === "cultivation"
        ? skill.type
        : "auxiliary") as SkillType, // 确保type是UISkill支持的类型
      rarity: (skill.rank === "凡品"
        ? "common"
        : skill.rank === "下品"
        ? "uncommon"
        : skill.rank === "中品"
        ? "rare"
        : skill.rank === "上品"
        ? "epic"
        : skill.rank === "极品"
        ? "legendary"
        : "mythic") as SkillRarity,
      level: skill.level,
      progress: skill.progress,
      maxLevel: 9,
      effects: convertedEffects, // 使用转换后的effects
      learningDifficulty: 50, // 默认中等难度
      unlocked: true,
    };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">修炼</h1>

      {/* 角色信息编辑组件 */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <CharacterEditor />
      </div>

      {/* 修炼面板 */}
      <EnhancedCultivationPanel />

      {/* 功法选择 */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-3">修炼功法选择</h3>
        <SkillSelector skills={enhancedSkills} />
      </div>

      {/* 修炼提示 */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-3">修炼提示</h3>

        <div className="space-y-3 text-sm">
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-400 mt-1 mr-2" />
            <div>
              在灵气浓郁的地方修炼，可提高修炼速度。青云门的灵峰秘境灵气浓度是普通区域的5倍。
            </div>
          </div>
          <div className="flex items-start">
            <FaInfoCircle className="text-blue-400 mt-1 mr-2" />
            <div>服用&quot;凝气丹&quot;可临时提升修炼速度30%，持续4小时。</div>
          </div>
          <div className="flex items-start">
            <FaExclamationTriangle className="text-yellow-400 mt-1 mr-2" />
            <div>
              修炼突破到下一境界时，有5%几率遭遇天劫。请确保准备充分后再尝试突破。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
