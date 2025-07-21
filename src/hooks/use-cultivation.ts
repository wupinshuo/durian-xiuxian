import { useState, useEffect, useRef } from "react";
import { useGameData } from "@/store/GameDataContext";
import { uuidTool } from "@/tools/uuid";
import {
  DEVIATION_PROBABILITY,
  NORMAL_PROGRESS,
} from "@/constants/cultivation";
import { SUCCESS_MESSAGES, DEVIATION_MESSAGES } from "@/constants/text";

/**
 * 修炼钩子，处理修炼相关逻辑
 * @returns 修炼状态和控制方法
 */
export function useCultivation() {
  const {
    character,
    addRealmProgress,
    addSkillProgress,
    addEvent,
    checkForRealmUpgrade,
  } = useGameData();

  const [isCultivating, setIsCultivating] = useState(false);
  const [localRealmProgress, setLocalRealmProgress] = useState(
    character.realmProgress
  );
  const [localSkillProgress, setLocalSkillProgress] = useState(0);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [cultivationStatus, setCultivationStatus] = useState<string | null>(
    "开始修炼以提升修为，点击下方按钮"
  );
  const [statusType, setStatusType] = useState<
    "success" | "warning" | "error" | "info"
  >("info");

  // 修炼进度更新的随机时间
  const minUpdateTime = 1000; // 1秒
  const maxUpdateTime = 2000; // 2秒
  const nextUpdateTimeRef = useRef<number>(getRandomTime());
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const statusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 获取随机时间间隔
   * @returns 随机时间（毫秒）
   */
  function getRandomTime(): number {
    return (
      Math.floor(Math.random() * (maxUpdateTime - minUpdateTime + 1)) +
      minUpdateTime
    );
  }

  // 同步character变化到本地状态
  useEffect(() => {
    setLocalRealmProgress(character.realmProgress);
  }, [character.realmProgress]);

  // 清理计时器
  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  // 每帧检查是否应该更新修炼进度
  useEffect(() => {
    if (!isCultivating) return;

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
          // 走火入魔，修为倒退
          const decreaseAmount = -DEVIATION_PROBABILITY;
          addRealmProgress(decreaseAmount);
          // 更新本地状态，立即反映到UI
          setLocalRealmProgress((prev) => Math.max(0, prev + decreaseAmount));

          // 随机选择走火入魔的提示文案
          const message =
            DEVIATION_MESSAGES[
              Math.floor(Math.random() * DEVIATION_MESSAGES.length)
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
            const message =
              SUCCESS_MESSAGES[
                Math.floor(Math.random() * SUCCESS_MESSAGES.length)
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
          const skillProgressAmount = 0.3; // 技能进度增加量
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

  /**
   * 清除状态显示
   */
  const clearCultivationStatus = () => {
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }
    statusTimeoutRef.current = setTimeout(() => {
      setCultivationStatus(
        isCultivating
          ? "正在修炼中，灵气环绕周身..."
          : "开始修炼以提升修为，点击下方按钮"
      );
      setStatusType("info");
    }, 3000);
  };

  /**
   * 修炼反馈
   * @param message 状态消息
   * @param type 状态类型
   */
  const showCultivationStatus = (
    message: string,
    type: "success" | "warning" | "error"
  ) => {
    setCultivationStatus(message);
    setStatusType(type);
    clearCultivationStatus();
  };

  /**
   * 开始修炼
   * @param skillId 功法ID
   * @param skillName 功法名称
   */
  const startCultivation = (skillId: string, skillName: string) => {
    if (isCultivating) return;

    setSelectedSkillId(skillId);
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
      description: `开始修炼《${skillName}》，进入入定状态。`,
      timestamp: Date.now(),
    });
  };

  /**
   * 停止修炼
   * @param skillName 功法名称
   */
  const stopCultivation = (skillName: string) => {
    if (!isCultivating) return;

    setIsCultivating(false);
    showCultivationStatus("修炼结束，退出入定状态。", "warning");

    // 设置延迟恢复默认提示
    setTimeout(() => {
      if (!checkForRealmUpgrade()) {
        setCultivationStatus("开始修炼以提升修为，点击下方按钮");
        setStatusType("info");
      }
    }, 3500);

    addEvent({
      id: uuidTool.generateUUID(),
      type: "cultivation",
      title: "结束修炼",
      description: `结束修炼《${skillName}》，退出入定状态。`,
      timestamp: Date.now(),
    });
  };

  /**
   * 计算预计突破时间
   * @returns 预计突破时间字符串
   */
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

  return {
    isCultivating,
    localRealmProgress,
    localSkillProgress,
    selectedSkillId,
    setSelectedSkillId,
    cultivationStatus,
    statusType,
    startCultivation,
    stopCultivation,
    showCultivationStatus,
    calculateBreakthroughTime,
  };
}
