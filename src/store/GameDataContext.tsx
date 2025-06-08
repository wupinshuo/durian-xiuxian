"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { PlayerData, Character, Skill, Item, GameEvent } from "@/types";
import { uuidTool } from "@/tools/uuid";
import { gameDataService } from "@/lib/service-handle/game-data-service";

// 上下文类型定义
interface GameDataContextType {
  // 游戏数据
  playerData: PlayerData;
  character: Character;
  skills: Skill[];
  items: Item[];
  events: GameEvent[];
  spiritualStones: number;
  spiritGems: number;

  // 数据操作方法
  updateRealmProgress: (progress: number) => void;
  addRealmProgress: (amount: number) => void;
  updateSkillProgress: (skillId: string, progress: number) => void;
  addSkillProgress: (skillId: string, amount: number) => void;
  updateSpiritualStones: (amount: number) => void;
  updateSpiritGems: (amount: number) => void;
  addItem: (item: Item) => boolean;
  useItem: (itemId: string) => boolean;
  sellItem: (itemId: string) => number;
  addEvent: (event: GameEvent) => void;
  updateCharacterInfo: (updatedCharacter: Character) => void;
  checkForRealmUpgrade: () => boolean;
  upgradeRealm: () => boolean;
  resetData: () => void;
}

// 创建上下文
const GameDataContext = createContext<GameDataContextType | undefined>(
  undefined
);

// 上下文提供者组件
export function GameDataProvider({ children }: { children: React.ReactNode }) {
  // 游戏数据状态
  const [isLoaded, setIsLoaded] = useState(false);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);

  // 初始加载游戏数据
  useEffect(() => {
    if (typeof window !== "undefined" && !isLoaded) {
      const data = gameDataService.getPlayerData();
      setPlayerData(data);
      setIsLoaded(true);
    }
  }, [isLoaded]);

  // 保存数据变更到本地
  useEffect(() => {
    if (isLoaded && playerData) {
      gameDataService.savePlayerData(playerData);
    }
  }, [playerData, isLoaded]);

  // 检查是否可以升级境界
  const checkForRealmUpgrade = () => {
    if (!playerData) return false;
    return gameDataService.checkForRealmUpgrade(playerData.character);
  };

  // 升级境界
  const upgradeRealm = () => {
    if (!playerData) return false;

    const result = gameDataService.upgradeRealm(playerData);
    setPlayerData(result.updatedData);
    return result.success;
  };

  /** 更新角色信息 */
  const updateCharacterInfo = (updatedCharacter: Character) => {
    setPlayerData((prev) => {
      if (!prev) return prev;
      return gameDataService.updateCharacter(prev, updatedCharacter);
    });
  };

  /** 更新修为进度 */
  const updateRealmProgress = (progress: number) => {
    setPlayerData((prev) => {
      if (!prev) return prev;
      return gameDataService.updateRealmProgress(prev, progress);
    });
  };

  /** 增加修为进度 */
  const addRealmProgress = (amount: number) => {
    setPlayerData((prev) => {
      if (!prev) return prev;
      return gameDataService.addRealmProgress(prev, amount);
    });
  };

  /** 更新技能进度 */
  const updateSkillProgress = (skillId: string, progress: number) => {
    setPlayerData((prev) => {
      if (!prev) return prev;
      return gameDataService.updateSkillProgress(prev, skillId, progress);
    });
  };

  /** 增加技能进度 */
  const addSkillProgress = (skillId: string, amount: number) => {
    setPlayerData((prev) => {
      if (!prev) return prev;
      return gameDataService.addSkillProgress(prev, skillId, amount);
    });
  };

  /** 更新灵石数量 */
  const updateSpiritualStones = (amount: number) => {
    setPlayerData((prev) => {
      if (!prev) return prev;
      return gameDataService.updateSpiritualStones(prev, amount);
    });
  };

  /** 更新灵玉数量 */
  const updateSpiritGems = (amount: number) => {
    setPlayerData((prev) => {
      if (!prev) return prev;
      return gameDataService.updateSpiritGems(prev, amount);
    });
  };

  /** 添加物品 */
  const addItem = (item: Item): boolean => {
    let success = false;

    setPlayerData((prev) => {
      if (!prev) return prev;

      const result = gameDataService.addItem(prev, item);
      success = result.success;
      return result.updatedData;
    });

    return success;
  };

  /** 使用物品 */
  const useItem = (itemId: string): boolean => {
    let success = false;

    setPlayerData((prev) => {
      if (!prev) return prev;

      const result = gameDataService.useItem(prev, itemId);
      success = result.success;
      return result.updatedData;
    });

    return success;
  };

  /** 出售物品 */
  const sellItem = (itemId: string): number => {
    let price = 0;

    setPlayerData((prev) => {
      if (!prev) return prev;

      const result = gameDataService.sellItem(prev, itemId);
      price = result.price;
      return result.updatedData;
    });

    return price;
  };

  /** 添加游戏事件 */
  const addEvent = (event: GameEvent) => {
    setPlayerData((prev) => {
      if (!prev) return prev;
      return gameDataService.addEvent(prev, event);
    });
  };

  /** 重置游戏数据 */
  const resetData = () => {
    // 重置数据
    const initialData = gameDataService.resetData();
    setPlayerData(initialData);

    // 添加重生事件
    const rebirthEvent: GameEvent = {
      id: uuidTool.generateUUID(),
      type: "story",
      title: "重新开始",
      description: "你决定放弃过去，重新开始修仙之旅。",
      timestamp: Date.now(),
    };

    setPlayerData((prev) => {
      if (!prev) return initialData;
      return gameDataService.addEvent(prev, rebirthEvent);
    });
  };

  /** 如果数据尚未加载完成，显示加载界面 */
  if (!isLoaded || !playerData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-xl">加载中...</h2>
          <div className="mt-4 h-2 w-40 bg-gray-700 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  /** 准备上下文值 */
  const contextValue: GameDataContextType = {
    playerData,
    character: playerData.character,
    skills: playerData.skills,
    items: playerData.inventory.items,
    events: playerData.events,
    spiritualStones: playerData.inventory.currency?.spiritualStones || 0,
    spiritGems: playerData.inventory.currency?.spiritGems || 0,
    updateRealmProgress,
    addRealmProgress,
    updateSkillProgress,
    addSkillProgress,
    updateSpiritualStones,
    updateSpiritGems,
    addItem,
    useItem,
    sellItem,
    addEvent,
    updateCharacterInfo,
    checkForRealmUpgrade,
    upgradeRealm,
    resetData,
  };

  return (
    <GameDataContext.Provider value={contextValue}>
      {children}
    </GameDataContext.Provider>
  );
}

/** 使用上下文的钩子 */
export function useGameData() {
  const context = useContext(GameDataContext);

  if (context === undefined) {
    throw new Error("useGameData 必须在 GameDataProvider 内部使用");
  }

  return context;
}
