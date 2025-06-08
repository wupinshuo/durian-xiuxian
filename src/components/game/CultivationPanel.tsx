"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useGameData } from "@/store/GameDataContext";
import { FaPlay, FaStop, FaBolt, FaFlask } from "react-icons/fa";
import { GameEvent } from "@/types";
import { uuidTool } from "@/tools/uuid";

export default function CultivationPanel() {
  const { character, skills, addRealmProgress, addSkillProgress, addEvent } =
    useGameData();

  const [isCultivating, setIsCultivating] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [progressInterval, setProgressInterval] =
    useState<NodeJS.Timeout | null>(null);

  // 初始化选中的功法（默认选第一个修炼功法）
  useEffect(() => {
    if (skills.length > 0 && !selectedSkillId) {
      const cultivationSkill =
        skills.find((s) => s.type === "cultivation") || skills[0];
      setSelectedSkillId(cultivationSkill.id);
    }
  }, [skills, selectedSkillId]);

  // 当前选中的功法
  const selectedSkill = skills.find((skill) => skill.id === selectedSkillId);

  // 计算修炼效率（这里简化处理）
  const cultivationEfficiency = 120; // 120%的修炼效率

  // 开始修炼
  const startCultivation = () => {
    if (isCultivating || !selectedSkillId) return;

    setIsCultivating(true);

    // 设置修炼进度定时器（每1.5秒增加一次进度）
    const interval = setInterval(() => {
      // 增加修为进度
      addRealmProgress(0.5);

      // 增加功法修炼进度
      if (selectedSkillId) {
        addSkillProgress(selectedSkillId, 0.1);
      }
    }, 1500);

    setProgressInterval(interval);

    const event: GameEvent = {
      id: uuidTool.generateUUID(),
      type: "cultivation",
      title: "开始修炼",
      description: `开始修炼功法，进入入定状态。`,
      timestamp: Date.now(),
    };

    addEvent(event);
  };

  // 停止修炼
  const stopCultivation = () => {
    if (!isCultivating) return;

    setIsCultivating(false);

    // 清除定时器
    if (progressInterval) {
      clearInterval(progressInterval);
      setProgressInterval(null);
    }

    const limitEvent: GameEvent = {
      id: uuidTool.generateUUID(),
      type: "cultivation",
      title: "瓶颈出现",
      description: "你已经达到了当前境界的修炼极限，需要寻求突破。",
      timestamp: Date.now(),
    };

    addEvent(limitEvent);
  };

  // 加速修炼（消耗灵石）
  const speedUpCultivation = () => {
    // 这里简化实现，实际应检查灵石数量
    addRealmProgress(2);

    if (selectedSkillId) {
      addSkillProgress(selectedSkillId, 3);
    }

    const outerFocusEvent: GameEvent = {
      id: uuidTool.generateUUID(),
      type: "cultivation",
      title: "外界干扰",
      description: "修炼过程中受到外界干扰，心神不宁，效果大打折扣。",
      timestamp: Date.now(),
    };

    addEvent(outerFocusEvent);
  };

  // 使用丹药
  const usePill = () => {
    // 简化实现
    console.log("使用丹药");
  };

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [progressInterval]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-16 h-16 relative mr-4">
            <Image
              src="/images/xiulian.png"
              alt="修炼场景"
              className="rounded-lg object-cover"
              fill
            />
          </div>
          <div>
            <h3 className="text-xl font-bold">修炼场</h3>
            <p className="text-gray-400 text-sm">
              当前位置: {character.sect || "无门派"} - 灵峰秘境
            </p>
          </div>
        </div>
        <div>
          <span className="text-sm text-gray-400">修炼效率: </span>
          <span className="text-green-400">+{cultivationEfficiency}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-700 p-3 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-sm">修为进度</span>
            <span className="text-sm">
              {character.realmProgress.toFixed(1)}% → 100%
            </span>
          </div>
          <div className="h-2 bg-gray-600 rounded-full mb-2">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${character.realmProgress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-400">
            {isCultivating ? "正在修炼中..." : "待机状态，点击开始修炼"}
          </div>
        </div>

        {selectedSkill && (
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-sm">《{selectedSkill.name}》修炼</span>
              <span className="text-sm">
                {selectedSkill.progress.toFixed(1)}% →{" "}
                {Math.min(100, selectedSkill.progress + 1).toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-gray-600 rounded-full mb-2">
              <div
                className="h-full bg-purple-600 rounded-full"
                style={{ width: `${selectedSkill.progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400">预计进度提升: 0.2%/次</div>
          </div>
        )}
      </div>

      {/* 修炼操作按钮 */}
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1 rounded-md text-sm flex items-center ${
            isCultivating
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={startCultivation}
          disabled={isCultivating}
        >
          <FaPlay className="mr-2" />
          <span>开始修炼</span>
        </button>

        <button
          className={`px-3 py-1 rounded-md text-sm flex items-center ${
            !isCultivating
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-700"
          }`}
          onClick={stopCultivation}
          disabled={!isCultivating}
        >
          <FaStop className="mr-2" />
          <span>停止修炼</span>
        </button>

        <button
          className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md text-sm flex items-center"
          onClick={speedUpCultivation}
        >
          <FaBolt className="mr-2" />
          <span>加速修炼 (消耗灵石)</span>
        </button>

        <button
          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm flex items-center"
          onClick={usePill}
        >
          <FaFlask className="mr-2" />
          <span>使用丹药</span>
        </button>
      </div>
    </div>
  );
}
