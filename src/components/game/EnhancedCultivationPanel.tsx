"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useGameData } from "@/store/GameDataContext";
import { FaPlay, FaStop, FaBolt, FaFlask, FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { Skill as GameSkill } from "@/lib/types/game";
import { generateUUID } from "@/lib/utils";

export default function EnhancedCultivationPanel() {
  const {
    character,
    skills,
    addRealmProgress,
    addSkillProgress,
    addEvent,
    checkForRealmUpgrade,
    upgradeRealm,
  } = useGameData();

  const [isCultivating, setIsCultivating] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [showBreakthroughEffect, setShowBreakthroughEffect] = useState(false);
  const [cultivationStatus, setCultivationStatus] = useState<string | null>(
    "开始修炼以提升修为，点击下方按钮"
  );
  const [statusType, setStatusType] = useState<
    "success" | "warning" | "error" | "info"
  >("info");

  // 添加本地状态来跟踪进度，确保UI响应性
  const [localRealmProgress, setLocalRealmProgress] = useState(
    character.realmProgress
  );
  const [localSkillProgress, setLocalSkillProgress] = useState(0);

  // 用于修炼进度更新的随机时间
  const minUpdateTime = 1000; // 1秒
  const maxUpdateTime = 2000; // 2秒
  const nextUpdateTimeRef = useRef<number>(getRandomTime());
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const statusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  function getRandomTime(): number {
    return (
      Math.floor(Math.random() * (maxUpdateTime - minUpdateTime + 1)) +
      minUpdateTime
    );
  }

  // 清除状态显示
  const clearCultivationStatus = () => {
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }
    statusTimeoutRef.current = setTimeout(() => {
      // 修炼结束后恢复默认提示信息
      setCultivationStatus(
        isCultivating
          ? "正在修炼中，灵气环绕周身..."
          : "开始修炼以提升修为，点击下方按钮"
      );
      setStatusType("info");
    }, 3000);
  };

  // 修炼反馈
  const showCultivationStatus = (
    message: string,
    type: "success" | "warning" | "error"
  ) => {
    setCultivationStatus(message);
    setStatusType(type);
    clearCultivationStatus();
  };

  // 初始化选中的功法（默认选第一个修炼功法）
  useEffect(() => {
    if (skills.length > 0 && !selectedSkillId) {
      const cultivationSkill =
        skills.find((s: GameSkill) => s.type === "cultivation") || skills[0];
      setSelectedSkillId(cultivationSkill.id);
    }
  }, [skills, selectedSkillId]);

  // 清理计时器
  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  // 当前选中的功法
  const selectedSkill = skills?.find(
    (skill: GameSkill) => skill.id === selectedSkillId
  );

  // 计算修炼效率（这里简化处理）
  const cultivationEfficiency = 120; // 120%的修炼效率

  // 同步character和skills变化到本地状态
  useEffect(() => {
    setLocalRealmProgress(character.realmProgress);
  }, [character.realmProgress]);

  useEffect(() => {
    if (selectedSkill) {
      setLocalSkillProgress(selectedSkill.progress);
    }
  }, [selectedSkill]);

  // 每帧检查是否应该更新修炼进度
  useEffect(() => {
    if (!isCultivating) return;

    // 替换requestAnimationFrame为setInterval，更可靠地更新进度
    const intervalId = setInterval(() => {
      const now = Date.now();
      if (now - lastUpdateTimeRef.current >= nextUpdateTimeRef.current) {
        // 随机判断是否走火入魔（10%概率）
        const isDeviation = Math.random() < 0.1;

        if (isDeviation) {
          // 走火入魔，修为倒退
          const decreaseAmount = -0.3;
          addRealmProgress(decreaseAmount);
          // 更新本地状态，立即反映到UI
          setLocalRealmProgress((prev) => Math.max(0, prev + decreaseAmount));

          // 随机选择走火入魔的提示文案
          const deviationMessages = [
            "走火入魔！灵力运转失控，修为受损。",
            "心境不稳，修炼出现偏差，修为倒退少许。",
            "分心了，灵力运行错误，修为受损。",
            "灵气暴动，丹田受损，修为倒退。",
          ];
          const message =
            deviationMessages[
              Math.floor(Math.random() * deviationMessages.length)
            ];

          showCultivationStatus(message, "error");

          // 添加走火入魔事件
          addEvent({
            id: generateUUID(),
            type: "cultivation",
            title: "走火入魔",
            description: message,
            timestamp: Date.now(),
          });
        } else {
          // 正常修炼，增加修为进度
          const progressAmount = 0.2;
          addRealmProgress(progressAmount);
          // 更新本地状态，立即反映到UI
          setLocalRealmProgress((prev) => Math.min(100, prev + progressAmount));

          // 随机决定是否显示修炼反馈（30%概率）
          if (Math.random() < 0.3) {
            const successMessages = [
              "灵力运转顺畅，修为有所增长。",
              "心境平和，修炼效果良好。",
              "灵气吸收顺利，修为稳步提升。",
              "感悟到了功法的一点奥妙，修炼速度加快。",
            ];
            const message =
              successMessages[
                Math.floor(Math.random() * successMessages.length)
              ];
            showCultivationStatus(message, "success");
          }
        }

        // 无论是否走火入魔，功法修炼都有进度
        if (selectedSkillId) {
          const skillProgressAmount = 0.3;
          addSkillProgress(selectedSkillId, skillProgressAmount);
          // 更新本地技能进度状态
          setLocalSkillProgress((prev) =>
            Math.min(100, prev + skillProgressAmount)
          );
        }

        // 更新计时器和最后更新时间
        lastUpdateTimeRef.current = now;
        nextUpdateTimeRef.current = getRandomTime();
      }
    }, 100); // 每100毫秒检查一次，确保UI及时更新

    return () => clearInterval(intervalId);
  }, [
    isCultivating,
    addRealmProgress,
    addSkillProgress,
    selectedSkillId,
    addEvent,
  ]);

  // 开始修炼
  const startCultivation = () => {
    if (isCultivating || !selectedSkillId) return;

    setIsCultivating(true);
    lastUpdateTimeRef.current = Date.now();

    showCultivationStatus("开始入定修炼，灵气开始运转...", "success");

    // 设置持续的修炼状态
    setTimeout(() => {
      setCultivationStatus("正在修炼中，灵气环绕周身...");
      setStatusType("info");
    }, 3500);

    addEvent({
      id: generateUUID(),
      type: "cultivation",
      title: "开始修炼",
      description: `开始修炼《${selectedSkill?.name || ""}》，进入入定状态。`,
      timestamp: Date.now(),
    });
  };

  // 停止修炼
  const stopCultivation = () => {
    if (!isCultivating) return;

    setIsCultivating(false);
    showCultivationStatus("修炼结束，退出入定状态。", "warning");

    // 设置延迟恢复默认提示
    setTimeout(() => {
      setCultivationStatus("开始修炼以提升修为，点击下方按钮");
      setStatusType("info");
    }, 3500);

    addEvent({
      id: generateUUID(),
      type: "cultivation",
      title: "结束修炼",
      description: `结束修炼《${selectedSkill?.name || ""}》，退出入定状态。`,
      timestamp: Date.now(),
    });
  };

  // 加速修炼（消耗灵石）
  const speedUpCultivation = () => {
    // 这里简化实现，实际应检查灵石数量
    addRealmProgress(2);

    if (selectedSkillId) {
      addSkillProgress(selectedSkillId, 3);
    }

    addEvent({
      id: generateUUID(),
      type: "cultivation",
      title: "加速修炼",
      description: `消耗灵石加速修炼，修为大幅提升！`,
      timestamp: Date.now(),
    });
  };

  // 尝试突破境界
  const attemptBreakthrough = () => {
    if (!checkForRealmUpgrade()) {
      return;
    }

    // 显示突破特效
    setShowBreakthroughEffect(true);

    // 尝试突破
    setTimeout(() => {
      upgradeRealm();

      // 3秒后隐藏特效
      setTimeout(() => {
        setShowBreakthroughEffect(false);
      }, 3000);
    }, 2000);
  };

  // 使用丹药
  const usePill = () => {
    // 简化实现
    console.log("使用丹药");
  };

  // 检查是否可以突破
  const canBreakthrough = checkForRealmUpgrade();

  // 预计突破时间
  const calculateBreakthroughTime = () => {
    if (isCultivating && character.realmProgress < 100) {
      const remainingProgress = 100 - character.realmProgress;
      const progressPerSecond =
        (0.2 * (maxUpdateTime + minUpdateTime)) / (2 * 1000); // 平均每秒进度
      const remainingSeconds = remainingProgress / progressPerSecond;

      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);

      return `${hours}小时${minutes}分钟`;
    }
    return "未知";
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg relative overflow-hidden">
      {/* 突破特效 */}
      {showBreakthroughEffect && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-50 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{ duration: 5, times: [0, 0.3, 1] }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 0] }}
              transition={{ duration: 5, times: [0, 0.3, 1] }}
              className="text-white text-4xl font-bold"
            >
              突破中...
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* 修炼状态反馈 - 使用固定高度容器避免布局变化 */}
      <div className="h-20 mb-4 flex items-center justify-center">
        <motion.div
          className={`p-4 rounded-md w-full ${
            statusType === "success"
              ? "bg-green-800 bg-opacity-30 border border-green-600"
              : statusType === "warning"
              ? "bg-yellow-800 bg-opacity-30 border border-yellow-600"
              : statusType === "error"
              ? "bg-red-800 bg-opacity-30 border border-red-600"
              : "bg-blue-800 bg-opacity-20 border border-blue-600"
          }`}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center">
            <svg
              className={`w-5 h-5 mr-3 ${
                statusType === "success"
                  ? "text-green-400"
                  : statusType === "warning"
                  ? "text-yellow-400"
                  : statusType === "error"
                  ? "text-red-400"
                  : "text-blue-400"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              {statusType === "success" ? (
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              ) : statusType === "warning" ? (
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                ></path>
              ) : statusType === "error" ? (
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                ></path>
              ) : (
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
                  clipRule="evenodd"
                ></path>
              )}
            </svg>
            <div className="text-center text-sm font-medium">
              {cultivationStatus}
            </div>
          </div>
        </motion.div>
      </div>

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
              {isCultivating
                ? localRealmProgress.toFixed(1)
                : character.realmProgress.toFixed(1)}
              % → 100%
            </span>
          </div>
          <div className="h-2 bg-gray-600 rounded-full mb-2">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              style={{
                width: `${
                  isCultivating ? localRealmProgress : character.realmProgress
                }%`,
              }}
              animate={{
                width: `${
                  isCultivating ? localRealmProgress : character.realmProgress
                }%`,
              }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </div>
          <div className="text-xs text-gray-400">
            {isCultivating
              ? `正在修炼中... 预计突破时间: ${calculateBreakthroughTime()}`
              : "待机状态，点击开始修炼"}
          </div>
        </div>

        {selectedSkill && (
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-sm">《{selectedSkill.name}》修炼</span>
              <span className="text-sm">
                {isCultivating
                  ? localSkillProgress.toFixed(1)
                  : selectedSkill.progress.toFixed(1)}
                % → 100%
              </span>
            </div>
            <div className="h-2 bg-gray-600 rounded-full mb-2">
              <motion.div
                className="h-full bg-purple-600 rounded-full"
                style={{
                  width: `${
                    isCultivating ? localSkillProgress : selectedSkill.progress
                  }%`,
                }}
                animate={{
                  width: `${
                    isCultivating ? localSkillProgress : selectedSkill.progress
                  }%`,
                }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </div>
            <div className="text-xs text-gray-400">预计进度提升: 0.3%/次</div>
          </div>
        )}
      </div>

      {/* 修炼操作按钮 */}
      <div className="flex flex-wrap gap-2">
        {!canBreakthrough ? (
          <>
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
          </>
        ) : (
          <button
            className="bg-yellow-600 hover:bg-yellow-700 px-5 py-2 rounded-md text-base flex-grow flex items-center justify-center font-bold"
            onClick={attemptBreakthrough}
          >
            <FaArrowUp className="mr-2" />
            <span>
              尝试突破 {character.realm} →{" "}
              {character.realm === "练气"
                ? "筑基"
                : character.realm === "筑基"
                ? "结丹"
                : "更高境界"}
            </span>
          </button>
        )}
      </div>

      {/* 若达到突破条件，显示突破提示 */}
      {canBreakthrough && (
        <div className="mt-4 bg-yellow-800 bg-opacity-30 border border-yellow-600 rounded-md p-3">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-400 mr-2 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              ></path>
            </svg>
            <div className="text-sm">
              你已达到{character.realm}
              {character.realmLevel}层巅峰，可以尝试突破到更高境界了！
              <div className="text-xs text-yellow-300 mt-1">
                注意：突破有5%几率遭遇天劫，请确保准备充分。
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
