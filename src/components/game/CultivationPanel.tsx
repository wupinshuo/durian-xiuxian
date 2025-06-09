"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useGameData } from "@/store/GameDataContext";
import { FaPlay, FaStop, FaBolt, FaArrowUp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Skill } from "@/types";
import { uuidTool } from "@/tools/uuid";
import { DEVIATION_MESSAGES, SUCCESS_MESSAGES } from "@/constants/text";
import { gameDataService } from "@/lib/service-handle/game-data-service";
import {
  DEVIATION_PROBABILITY,
  DEVIATION_PROGRESS,
  NORMAL_PROGRESS,
  SKILL_PROGRESS,
} from "@/constants/cultivation";

export default function CultivationPanel() {
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
  const [breakthroughStatus, setBreakthroughStatus] = useState<
    "loading" | "success" | "failed" | null
  >(null);
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
        skills.find((s: Skill) => s.type === "cultivation") || skills[0];
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
    (skill: Skill) => skill.id === selectedSkillId
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
        // 如果已经达到突破条件，自动停止修炼
        if (character.realmProgress >= 100 || checkForRealmUpgrade()) {
          // 停止修炼
          setIsCultivating(false);

          // 显示提示
          showCultivationStatus(
            "修为已达到突破境界，自动停止修炼！",
            "success"
          );

          // 添加突破提醒事件
          addEvent({
            id: uuidTool.generateUUID(),
            type: "cultivation",
            title: "修为圆满",
            description: "你的修为已达到当前境界的巅峰，可尝试突破了！",
            timestamp: Date.now(),
          });

          // 退出更新循环
          return;
        }

        // 随机判断是否走火入魔（5%概率）
        const isDeviation = Math.random() < DEVIATION_PROBABILITY * 0.01;

        if (isDeviation) {
          // 走火入魔，修为倒退，灵力受损，不能为负数，且不能超过100%
          const decreaseAmount = -DEVIATION_PROGRESS;
          addRealmProgress(decreaseAmount);
          // 更新本地状态，立即反映到UI
          setLocalRealmProgress((prev) => Math.max(0, prev + decreaseAmount));

          // 随机选择走火入魔的提示文案
          const deviationMessages = DEVIATION_MESSAGES;
          const message =
            deviationMessages[
              Math.floor(Math.random() * deviationMessages.length)
            ];

          showCultivationStatus(message, "error");

          // 添加走火入魔事件
          addEvent({
            id: uuidTool.generateUUID(),
            type: "cultivation",
            title: "走火入魔",
            description: message,
            timestamp: Date.now(),
          });
        } else {
          // 正常修炼，增加修为进度
          const progressAmount = NORMAL_PROGRESS;
          addRealmProgress(progressAmount);
          // 更新本地状态，立即反映到UI
          setLocalRealmProgress((prev) => Math.min(100, prev + progressAmount));

          // 随机决定是否显示修炼反馈（30%概率）
          if (Math.random() < 0.3) {
            const successMessages = SUCCESS_MESSAGES;
            const message =
              successMessages[
                Math.floor(Math.random() * successMessages.length)
              ];
            showCultivationStatus(message, "success");

            // 添加修炼事件
            addEvent({
              id: uuidTool.generateUUID(),
              type: "cultivation",
              title: "修炼成功",
              description: message,
              timestamp: Date.now(),
            });
          }
        }

        // 无论是否走火入魔，功法修炼都有进度
        if (selectedSkillId) {
          const skillProgressAmount = SKILL_PROGRESS;
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
    character.realmProgress,
    checkForRealmUpgrade,
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
      id: uuidTool.generateUUID(),
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
      // 只有在未达到突破条件时，才显示默认提示
      if (!checkForRealmUpgrade()) {
        setCultivationStatus("开始修炼以提升修为，点击下方按钮");
        setStatusType("info");
      }
    }, 3500);

    addEvent({
      id: uuidTool.generateUUID(),
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
      id: uuidTool.generateUUID(),
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

    // 显示突破特效和加载状态
    setShowBreakthroughEffect(true);
    setBreakthroughStatus("loading");
    showCultivationStatus("正在渡劫，电闪雷鸣...", "warning");

    // 突破有5%的失败率
    const isFailure = Math.random() < 0.05;

    // 尝试突破（模拟加载过程）
    setTimeout(() => {
      if (isFailure) {
        // 突破失败
        setBreakthroughStatus("failed");
        showCultivationStatus("突破失败，遭遇天劫，修为受损！", "error");

        addEvent({
          id: uuidTool.generateUUID(),
          type: "breakthrough",
          title: "突破失败",
          description: "天劫降临，灵气紊乱，修为受损，吐血不止。需闭关调养。",
          timestamp: Date.now(),
        });

        // 突破失败，修为减少10%
        addRealmProgress(-10);

        // 4秒后隐藏特效，重置状态
        setTimeout(() => {
          setShowBreakthroughEffect(false);
          setBreakthroughStatus(null);
          setCultivationStatus("开始修炼以提升修为，点击下方按钮");
          setStatusType("info");
        }, 4000);
      } else {
        // 突破成功
        setBreakthroughStatus("success");
        showCultivationStatus("突破成功！金光环绕，祥瑞降临！", "success");

        upgradeRealm();

        addEvent({
          id: uuidTool.generateUUID(),
          type: "breakthrough",
          title: "突破成功",
          description: `成功突破至${
            character.realm === "练气"
              ? "筑基"
              : character.realm === "筑基"
              ? "结丹"
              : "更高境界"
          }，祥瑞环绕，天地感应！`,
          timestamp: Date.now(),
        });

        // 4秒后隐藏特效，重置状态
        setTimeout(() => {
          setShowBreakthroughEffect(false);
          setBreakthroughStatus(null);
        }, 4000);
      }
    }, 4000); // 增加渡劫时间
  };

  // 使用丹药
  const usePill = () => {
    // 丹药功能尚未开发，这是一个占位函数
    console.log("使用丹药功能尚未开发");
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
        <div className="absolute inset-0 z-10 overflow-hidden">
          {/* 背景效果 */}
          <motion.div
            className={`absolute inset-0 ${
              breakthroughStatus === "loading"
                ? "bg-gradient-to-b from-gray-900 to-purple-900"
                : breakthroughStatus === "success"
                ? "bg-gradient-to-b from-blue-900 to-yellow-500"
                : breakthroughStatus === "failed"
                ? "bg-gradient-to-b from-gray-900 to-red-900"
                : "bg-gradient-to-r from-purple-500 to-blue-500"
            } opacity-75`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ duration: 0.5 }}
          />

          {/* 闪电效果 - 仅在加载和失败时显示 */}
          {(breakthroughStatus === "loading" ||
            breakthroughStatus === "failed") && (
            <>
              <AnimatePresence>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`lightning-${i}`}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.8, 0] }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.7 + Math.random() * 0.5,
                      repeat: breakthroughStatus === "loading" ? Infinity : 3,
                      repeatDelay: Math.random() * 2,
                    }}
                  >
                    <div
                      className="w-full h-full bg-white"
                      style={{
                        clipPath: `polygon(${Math.random() * 100}% 0%, ${
                          Math.random() * 100
                        }% ${Math.random() * 100}%, ${Math.random() * 100}% ${
                          Math.random() * 100
                        }%, ${Math.random() * 100}% 100%)`,
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* 雷鸣云效果 */}
              <div className="absolute inset-0 flex items-start justify-center">
                <motion.div
                  className="w-full h-20 bg-gray-800 opacity-70 mt-10 rounded-full"
                  animate={{
                    scale: [1, 1.05, 0.98, 1.02, 1],
                    y: [0, -5, 2, -3, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              </div>
            </>
          )}

          {/* 金光效果 - 仅在成功时显示 */}
          {breakthroughStatus === "success" && (
            <>
              {/* 放射光芒 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-80 h-80 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0.7], scale: [0, 1, 1.5] }}
                  transition={{ duration: 3, times: [0, 0.3, 1] }}
                />
              </div>

              {/* 飘动的金色粒子 */}
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute rounded-full bg-yellow-300"
                  style={{
                    width: Math.random() * 6 + 2,
                    height: Math.random() * 6 + 2,
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: [50, -50 - Math.random() * 100],
                    x: [0, (Math.random() - 0.5) * 100],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 2,
                    delay: Math.random() * 1,
                    repeat: 1,
                    repeatType: "reverse",
                  }}
                />
              ))}
            </>
          )}

          {/* 吐血效果 - 仅在失败时显示 */}
          {breakthroughStatus === "failed" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {/* 吐血效果 */}
                <motion.div
                  className="absolute w-40 h-20 bg-red-600 rounded-full blur-md"
                  style={{
                    top: "30%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.7, 0],
                    scaleX: [0, 1.5, 2],
                    scaleY: [0, 1, 0.5],
                  }}
                  transition={{ duration: 1, delay: 1.2 }}
                />

                {/* 血滴 */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`blood-${i}`}
                    className="absolute w-2 h-2 rounded-full bg-red-600"
                    style={{
                      top: "30%",
                      left: "50%",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      x: [
                        (Math.random() - 0.5) * 20,
                        (Math.random() - 0.5) * 60,
                      ],
                      y: [0, 50 + Math.random() * 30],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: 1.2 + Math.random() * 0.3,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          )}

          {/* 中央文字内容 */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale:
                  breakthroughStatus === "loading"
                    ? [0.8, 1.2, 0.8]
                    : [0, 1.5, breakthroughStatus === "failed" ? 0.5 : 0],
              }}
              transition={{
                duration: breakthroughStatus === "loading" ? 2 : 5,
                times:
                  breakthroughStatus === "loading" ? [0, 0.5, 1] : [0, 0.3, 1],
                repeat: breakthroughStatus === "loading" ? Infinity : 0,
              }}
              className={`text-white text-4xl font-bold p-6 rounded-full ${
                breakthroughStatus === "loading"
                  ? "bg-purple-900 bg-opacity-50 shadow-lg shadow-purple-500"
                  : breakthroughStatus === "success"
                  ? "bg-yellow-600 bg-opacity-30 shadow-lg shadow-yellow-300"
                  : breakthroughStatus === "failed"
                  ? "bg-red-900 bg-opacity-50 shadow-lg shadow-red-500"
                  : ""
              } backdrop-blur-sm`}
            >
              {breakthroughStatus === "loading" ? (
                <div className="flex items-center">
                  <span className="mr-3 text-blue-100">渡劫中</span>
                  <div className="flex space-x-1">
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.4,
                      }}
                    />
                  </div>
                </div>
              ) : breakthroughStatus === "success" ? (
                <div className="flex items-center text-yellow-100">
                  <span>突破成功</span>
                  <motion.div
                    className="ml-3 text-yellow-300"
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                  >
                    ✓
                  </motion.div>
                </div>
              ) : breakthroughStatus === "failed" ? (
                <div className="flex items-center text-red-100">
                  <motion.span
                    animate={{ x: [0, -2, 3, -2, 0] }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    突破失败
                  </motion.span>
                  <motion.div
                    className="ml-3 text-red-300"
                    initial={{ rotate: 45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                  >
                    ✗
                  </motion.div>
                </div>
              ) : (
                "突破中..."
              )}
            </motion.div>
          </div>
        </div>
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
              className={`px-3 py-1 rounded-md text-sm flex items-center transition-colors duration-200 ${
                !isCultivating
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 active:bg-red-800"
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

            {/* 丹药功能尚未开发，暂时注释
            <button
              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm flex items-center"
              onClick={usePill}
            >
              <FaFlask className="mr-2" />
              <span>使用丹药</span>
            </button>
            */}
          </>
        ) : (
          <button
            className={`px-5 py-2 rounded-md text-base flex-grow flex items-center justify-center font-bold ${
              showBreakthroughEffect
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-yellow-600 hover:bg-yellow-700"
            }`}
            onClick={attemptBreakthrough}
            disabled={showBreakthroughEffect}
          >
            {showBreakthroughEffect ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="mr-2 w-5 h-5 border-2 border-t-transparent border-white rounded-full"
                />
                <span>突破中...</span>
              </>
            ) : (
              <>
                <FaArrowUp className="mr-2" />
                <span>
                  尝试突破 {character.realm} →{" "}
                  {gameDataService.getNextRealm(character.realm)}
                </span>
              </>
            )}
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
