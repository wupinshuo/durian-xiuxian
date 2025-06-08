"use client";

import React from "react";
import { useGameData } from "@/store/GameDataContext";
import { Skill } from "@/types";

interface SkillListProps {
  limit?: number;
  onSkillClick?: (skill: Skill) => void;
}

export default function SkillList({ limit, onSkillClick }: SkillListProps) {
  const { skills } = useGameData();

  const displayedSkills = limit ? skills.slice(0, limit) : skills;

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-2">修炼功法</h3>
      <div className="space-y-4">
        {displayedSkills.map((skill) => (
          <div
            key={skill.id}
            className="mb-4 cursor-pointer hover:bg-gray-750 transition-colors p-1 rounded"
            onClick={() => onSkillClick && onSkillClick(skill)}
          >
            <div className="flex justify-between mb-1">
              <span
                className={
                  skill.type === "cultivation" ? "text-yellow-400" : ""
                }
              >
                《{skill.name}》
              </span>
              <span>
                第{skill.level}层 ({skill.progress.toFixed(1)}%)
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full">
              <div
                className={`h-full rounded-full ${getSkillProgressBarColor(
                  skill.type
                )}`}
                style={{ width: `${skill.progress}%` }}
              ></div>
            </div>
            <div className="text-gray-400 text-sm mt-1">
              {skill.description}
            </div>
          </div>
        ))}

        {displayedSkills.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            暂无修炼功法，可前往门派学习
          </div>
        )}
      </div>
    </div>
  );
}

function getSkillProgressBarColor(skillType: string): string {
  switch (skillType) {
    case "cultivation":
      return "bg-purple-600";
    case "combat":
      return "bg-blue-600";
    case "auxiliary":
      return "bg-yellow-600";
    default:
      return "bg-gray-600";
  }
}
