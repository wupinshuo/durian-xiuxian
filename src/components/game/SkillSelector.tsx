"use client";

import React from "react";
import { useGameData } from "@/store/GameDataContext";
import { Skill, SkillType, SkillRarity } from "@/lib/types";
import { Skill as GameSkill, SkillRank } from "@/lib/types/game";
import {
  FaFire,
  FaHandSparkles,
  FaFistRaised,
  FaMagic,
  FaShieldAlt,
  FaPlus,
} from "react-icons/fa";

interface SkillSelectorProps {
  onSkillSelect?: (skillId: string) => void;
  selectedSkillId?: string | null;
  skills?: Skill[] | GameSkill[];
}

export default function SkillSelector({
  onSkillSelect,
  selectedSkillId = null,
  skills: propSkills,
}: SkillSelectorProps) {
  const { skills: contextSkills } = useGameData();

  // 使用传入的skills或从上下文获取
  const rawSkills = propSkills || contextSkills;

  // 检查是否为GameSkill类型并转换
  const isGameSkill = (skill: Skill | GameSkill): skill is GameSkill =>
    typeof skill === "object" && "rank" in skill;

  // 将GameSkill转换为UI需要的Skill类型
  const convertGameSkill = (skill: GameSkill): Skill => {
    const convertRank = (rank: SkillRank): SkillRarity => {
      switch (rank) {
        case "凡品":
          return "common";
        case "下品":
          return "uncommon";
        case "中品":
          return "rare";
        case "上品":
          return "epic";
        case "极品":
          return "legendary";
        case "天级":
        case "仙级":
        default:
          return "mythic";
      }
    };

    // 转换effects
    const effectsObj: { [key: string]: number } = {};
    if (skill.effects && Array.isArray(skill.effects)) {
      skill.effects.forEach((effect) => {
        effectsObj[effect.type] = effect.value;
      });
    }

    return {
      id: skill.id,
      name: skill.name,
      description: skill.description,
      type: skill.type as SkillType,
      rarity: convertRank(skill.rank),
      level: skill.level,
      progress: skill.progress,
      maxLevel: 9, // 默认值
      effects: effectsObj,
      learningDifficulty: 50, // 默认值
      unlocked: true, // 默认值
    };
  };

  // 确保所有技能都是UI所需的Skill类型
  const skills = rawSkills.map((skill) =>
    isGameSkill(skill) ? convertGameSkill(skill) : skill
  );

  // 根据功法类型获取图标
  const getSkillIcon = (type: SkillType): React.ReactNode => {
    switch (type) {
      case "cultivation":
        return <FaFire />;
      case "combat":
        return <FaHandSparkles />;
      case "body":
        return <FaFistRaised />;
      case "mental":
        return <FaMagic />;
      case "auxiliary":
        return <FaShieldAlt />;
      default:
        return <FaFire />;
    }
  };

  // 根据功法类型获取背景颜色
  const getSkillBgColor = (type: SkillType): string => {
    switch (type) {
      case "cultivation":
        return "bg-purple-600";
      case "combat":
        return "bg-blue-600";
      case "body":
        return "bg-yellow-600";
      case "mental":
        return "bg-indigo-600";
      case "auxiliary":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  // 根据功法稀有度获取文本颜色
  const getTextColorByRarity = (rarity: SkillRarity): string => {
    switch (rarity) {
      case "common":
      case "uncommon":
        return "text-white";
      case "rare":
        return "text-blue-300";
      case "epic":
        return "text-purple-300";
      case "legendary":
        return "text-yellow-300";
      case "mythic":
        return "text-red-300";
      default:
        return "text-white";
    }
  };

  // 选择功法
  const handleSkillSelect = (skillId: string) => {
    if (onSkillSelect) {
      onSkillSelect(skillId);
    }
  };

  // 获取功法类型的中文名称
  const getSkillTypeText = (type: SkillType): string => {
    switch (type) {
      case "cultivation":
        return "主修功法";
      case "combat":
        return "战斗功法";
      case "body":
        return "体修功法";
      case "mental":
        return "心法";
      case "auxiliary":
        return "辅修功法";
      default:
        return "未知功法";
    }
  };

  // 获取功法品级的中文名称
  const getSkillRarityText = (rarity: SkillRarity): string => {
    switch (rarity) {
      case "common":
        return "凡品";
      case "uncommon":
        return "下品";
      case "rare":
        return "中品";
      case "epic":
        return "上品";
      case "legendary":
        return "极品";
      case "mythic":
        return "仙品";
      default:
        return "未知";
    }
  };

  return (
    <div className="space-y-3">
      {skills.map((skill) => (
        <div
          key={skill.id}
          className={`bg-gray-700 p-3 rounded-lg flex items-center cursor-pointer ${
            selectedSkillId === skill.id ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() => handleSkillSelect(skill.id)}
        >
          <div
            className={`w-8 h-8 rounded-full ${getSkillBgColor(
              skill.type
            )} flex items-center justify-center mr-3`}
          >
            {getSkillIcon(skill.type)}
          </div>
          <div className="flex-grow">
            <div className="flex justify-between">
              <span
                className={`font-bold ${getTextColorByRarity(skill.rarity)}`}
              >
                《{skill.name}》
              </span>
              <span className="text-sm">
                第{skill.level}层 ({skill.progress.toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{getSkillTypeText(skill.type)}</span>
              <span>品阶: {getSkillRarityText(skill.rarity)}</span>
            </div>
          </div>
          <div className="ml-2">
            {selectedSkillId === skill.id ? (
              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            ) : (
              <button
                className="text-xs bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSkillSelect(skill.id);
                }}
              >
                选择
              </button>
            )}
          </div>
        </div>
      ))}

      {skills.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          暂无功法，可前往门派学习
        </div>
      )}

      <button className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded flex items-center justify-center">
        <FaPlus className="mr-2" />
        <span>获取更多功法</span>
      </button>
    </div>
  );
}
