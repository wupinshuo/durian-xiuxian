"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { GameDataService } from "@/lib/services/gameDataService";
import {
  CultivationRealm,
  MAX_REALM_LEVEL,
  MAX_REALM_PROGRESS,
  TRIBULATION_PROBABILITY,
  ItemType,
} from "@/constants";
import {
  PlayerData,
  Character,
  Skill,
  Item,
  GameEvent,
  ItemEffect,
} from "@/types";
import { generateUUID } from "@/lib/utils";

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

// 获取下一个境界
function getNextRealm(currentRealm: CultivationRealm): CultivationRealm | null {
  switch (currentRealm) {
    case CultivationRealm.QiRefining:
      return CultivationRealm.Foundation;
    case CultivationRealm.Foundation:
      return CultivationRealm.CoreFormation;
    case CultivationRealm.CoreFormation:
      return CultivationRealm.NascentSoul;
    case CultivationRealm.NascentSoul:
      return CultivationRealm.SpiritSevering;
    case CultivationRealm.SpiritSevering:
      return CultivationRealm.Void;
    case CultivationRealm.Void:
      return CultivationRealm.Integration;
    case CultivationRealm.Integration:
      return CultivationRealm.Ascension;
    case CultivationRealm.Ascension:
      return null; // 已达最高境界
    default:
      return null;
  }
}

// 上下文提供者组件
export function GameDataProvider({ children }: { children: React.ReactNode }) {
  // 游戏数据服务
  const gameDataService = new GameDataService();

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
    return (
      playerData.character.realmLevel >= MAX_REALM_LEVEL &&
      playerData.character.realmProgress >= MAX_REALM_PROGRESS
    );
  };

  // 升级境界
  const upgradeRealm = () => {
    if (!playerData || !checkForRealmUpgrade()) return false;

    const nextRealm = getNextRealm(playerData.character.realm);
    if (!nextRealm) return false;

    // 随机决定是否遭遇天劫
    const encounterTribulation = Math.random() * 100 < TRIBULATION_PROBABILITY; // 天劫几率

    if (encounterTribulation) {
      // 遭遇天劫
      setPlayerData((prev) => {
        if (!prev) return prev;

        const tribulationEvent: GameEvent = {
          id: generateUUID(),
          type: "tribulation",
          title: "天劫降临",
          description: `在突破${nextRealm}时，你遭遇了天劫！需要准备更多资源再次尝试突破。`,
          timestamp: Date.now(),
        };

        return {
          ...prev,
          character: {
            ...prev.character,
            realmProgress: Math.max(0, prev.character.realmProgress - 30), // 损失30%进度
          },
          events: [tribulationEvent, ...prev.events],
        };
      });

      return false;
    } else {
      // 成功突破
      setPlayerData((prev) => {
        if (!prev) return prev;

        const breakthroughEvent: GameEvent = {
          id: generateUUID(),
          type: "breakthrough",
          title: "境界突破",
          description: `恭喜你成功突破到${nextRealm}境界！你感觉自己体内的灵力更加充沛了。`,
          timestamp: Date.now(),
        };

        return {
          ...prev,
          character: {
            ...prev.character,
            realm: nextRealm,
            realmLevel: 1,
            realmProgress: 0,
            attributes: {
              ...prev.character.attributes,
              attack: prev.character.attributes.attack + 50,
              defense: prev.character.attributes.defense + 40,
              spirit: prev.character.attributes.spirit + 60,
              speed: prev.character.attributes.speed + 30,
              health: prev.character.attributes.health + 100,
              healthCurrent: prev.character.attributes.health + 100,
              mana: prev.character.attributes.mana + 80,
              manaCurrent: prev.character.attributes.mana + 80,
            },
          },
          events: [breakthroughEvent, ...prev.events],
        };
      });

      return true;
    }
  };

  /** 更新角色信息 */
  const updateCharacterInfo = (updatedCharacter: Character) => {
    setPlayerData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        character: updatedCharacter,
      };
    });
  };

  /** 更新修为进度 */
  const updateRealmProgress = (progress: number) => {
    setPlayerData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        character: {
          ...prev.character,
          realmProgress: Math.min(Math.max(0, progress), MAX_REALM_PROGRESS),
        },
      };
    });
  };

  /** 增加修为进度，用于境界突破 */
  const addRealmProgress = (amount: number) => {
    setPlayerData((prev: any) => {
      if (!prev) return prev;

      // 计算新的修为进度
      let newProgress = prev.character.realmProgress + amount;
      let newRealmLevel = prev.character.realmLevel;
      const newRealm = prev.character.realm;

      // 如果修为进度小于0，则设置为0
      if (newProgress < 0) {
        newProgress = 0;
      }

      // 如果达到100%，且不是巅峰层级，自动升级层级
      if (
        newProgress >= MAX_REALM_PROGRESS &&
        newRealmLevel < MAX_REALM_LEVEL
      ) {
        newRealmLevel += 1;
        newProgress -= MAX_REALM_PROGRESS;

        // 升级事件
        const upgradeEvent: GameEvent = {
          id: generateUUID(),
          type: "cultivation",
          title: "境界提升",
          description: `修为积累满足，你的境界提升到了${newRealm}${newRealmLevel}层！`,
          timestamp: Date.now(),
        };

        return {
          ...prev,
          character: {
            ...prev.character,
            realmLevel: newRealmLevel,
            realmProgress: newProgress,
          },
          events: [upgradeEvent, ...prev.events],
        };
      } else if (newProgress >= MAX_REALM_PROGRESS) {
        // 达到巅峰，保持在100%
        newProgress = MAX_REALM_PROGRESS;

        // 提示事件
        const readyEvent: GameEvent = {
          id: generateUUID(),
          type: "cultivation",
          title: "突破准备",
          description: `你已经达到${newRealm}${newRealmLevel}层巅峰，可以尝试突破到更高境界了！`,
          timestamp: Date.now(),
        };

        return {
          ...prev,
          character: {
            ...prev.character,
            realmProgress: newProgress,
          },
          events: [readyEvent, ...prev.events],
        };
      }

      // 正常增加修为
      return {
        ...prev,
        character: {
          ...prev.character,
          realmProgress: newProgress,
        },
      };
    });
  };

  /** 更新技能进度 */
  const updateSkillProgress = (skillId: string, progress: number) => {
    setPlayerData((prev) => {
      if (!prev) return prev;

      const updatedSkills = prev.skills.map((skill) =>
        skill.id === skillId
          ? { ...skill, progress: Math.min(Math.max(0, progress), 100) }
          : skill
      );

      return {
        ...prev,
        skills: updatedSkills,
      };
    });
  };

  /** 增加技能进度 */
  const addSkillProgress = (skillId: string, amount: number) => {
    setPlayerData((prev) => {
      if (!prev) return prev;

      // 更新前的数据副本
      let updatedPlayerData = { ...prev };

      const updatedSkills = prev.skills.map((skill) => {
        if (skill.id !== skillId) return skill;

        let newProgress = skill.progress + amount;
        let newLevel = skill.level;

        // 如果达到100%且未达最大层级，提升层级
        if (newProgress >= 100 && newLevel < skill.maxLevel) {
          newLevel += 1;
          newProgress -= 100;

          // 技能升级事件
          const skillUpgradeEvent: GameEvent = {
            id: generateUUID(),
            type: "skill",
            title: "功法突破",
            description: `你的《${skill.name}》已经突破到第${newLevel}层！`,
            timestamp: Date.now(),
          };

          updatedPlayerData = {
            ...updatedPlayerData,
            events: [skillUpgradeEvent, ...updatedPlayerData.events],
          };
        } else if (newProgress >= 100) {
          // 已达最大层级，保持在100%
          newProgress = 100;
        }

        return {
          ...skill,
          level: newLevel,
          progress: newProgress,
        };
      });

      return {
        ...updatedPlayerData,
        skills: updatedSkills,
      };
    });
  };

  /** 更新灵石数量 */
  const updateSpiritualStones = (amount: number) => {
    setPlayerData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          currency: {
            ...prev.inventory.currency,
            spiritualStones: Math.max(0, amount),
          },
        },
      };
    });
  };

  /** 更新灵玉数量 */
  const updateSpiritGems = (amount: number) => {
    setPlayerData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          currency: {
            ...prev.inventory.currency,
            spiritGems: Math.max(0, amount),
          },
        },
      };
    });
  };

  /** 添加物品 */
  const addItem = (item: Item): boolean => {
    // 简单实现，实际应检查背包容量
    let success = false;

    setPlayerData((prev) => {
      if (!prev) return prev;

      // 检查背包是否已满
      if (prev.inventory.items.length >= prev.inventory.maxSize) {
        success = false;
        return prev;
      }

      // 如果物品可堆叠，尝试合并
      if (item.stackable) {
        const existingItem = prev.inventory.items.find(
          (i) => i.name === item.name && i.type === item.type
        );

        if (existingItem) {
          // 更新现有物品数量
          const updatedItems = prev.inventory.items.map((i) =>
            i.id === existingItem.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );

          success = true;
          return {
            ...prev,
            inventory: {
              ...prev.inventory,
              items: updatedItems,
            },
          };
        }
      }

      // 添加新物品
      success = true;
      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          items: [...prev.inventory.items, item],
        },
      };
    });

    return success;
  };

  /** 使用物品 */
  const useItem = (itemId: string): boolean => {
    let success = false;

    setPlayerData((prev) => {
      if (!prev) return prev;

      const itemIndex = prev.inventory.items.findIndex(
        (item) => item.id === itemId
      );
      if (itemIndex === -1 || !prev.inventory.items[itemIndex].usable) {
        success = false;
        return prev;
      }

      const item = prev.inventory.items[itemIndex];
      const updatedItems = [...prev.inventory.items];

      // 减少物品数量
      if (updatedItems[itemIndex].quantity > 1) {
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: updatedItems[itemIndex].quantity - 1,
        };
      } else {
        updatedItems.splice(itemIndex, 1);
      }

      // 应用物品效果 (简化版)
      let updatedCharacter = { ...prev.character };
      let updatedEvents = [...prev.events];

      // 处理丹药效果
      if (item.type === ItemType.Pill) {
        const effects = item.effects as ItemEffect[];
        // 恢复灵力
        if (effects.length > 0 && effects[0].type === "manaRestore") {
          const manaRestorePercent = effects[0].value as number;
          const maxMana = updatedCharacter.attributes.mana;
          const restoreAmount = Math.floor(
            (maxMana * manaRestorePercent) / 100
          );

          updatedCharacter.attributes.manaCurrent = Math.min(
            maxMana,
            updatedCharacter.attributes.manaCurrent + restoreAmount
          );

          updatedEvents.unshift({
            id: generateUUID(),
            type: "item",
            title: "使用物品",
            description: `使用了${item.name}，恢复了${restoreAmount}点灵力。`,
            timestamp: Date.now(),
          });
        }

        // 恢复气血
        if (effects.length > 0 && effects[0].type === "healthRestore") {
          const healthRestorePercent = effects[0].value as number;
          const maxHealth = updatedCharacter.attributes.health;
          const restoreAmount = Math.floor(
            (maxHealth * healthRestorePercent) / 100
          );

          updatedCharacter.attributes.healthCurrent = Math.min(
            maxHealth,
            updatedCharacter.attributes.healthCurrent + restoreAmount
          );

          updatedEvents.unshift({
            id: generateUUID(),
            type: "item",
            title: "使用物品",
            description: `使用了${item.name}，恢复了${restoreAmount}点气血。`,
            timestamp: Date.now(),
          });
        }
      }

      success = true;
      return {
        ...prev,
        character: updatedCharacter,
        inventory: {
          ...prev.inventory,
          items: updatedItems,
        },
        events: updatedEvents,
      };
    });

    return success;
  };

  /** 出售物品 */
  const sellItem = (itemId: string): number => {
    let price = 0;

    setPlayerData((prev) => {
      if (!prev) return prev;

      const item = prev.inventory.items.find((item) => item.id === itemId);
      if (!item) return prev;

      price = item.value || 0;

      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          items: prev.inventory.items.filter((i) => i.id !== itemId),
        },
        currency: {
          ...prev.inventory.currency,
          spiritualStones: prev.inventory.currency.spiritualStones + price,
        },
      };
    });

    return price;
  };

  /** 添加游戏事件 */
  const addEvent = (event: GameEvent) => {
    setPlayerData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        events: [event, ...prev.events.slice(0, 49)], // 保留最新的50条记录
      };
    });
  };

  /** 重置游戏数据 */
  const resetData = () => {
    // 重置数据
    gameDataService.resetData();
    // 重新加载初始数据
    const initialData = gameDataService.getPlayerData();
    setPlayerData(initialData);
    // 添加重生事件
    const rebirthEvent: GameEvent = {
      id: generateUUID(),
      type: "story",
      title: "重新开始",
      description: "你决定放弃过去，重新开始修仙之旅。",
      timestamp: Date.now(),
    };
    addEvent(rebirthEvent);
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
