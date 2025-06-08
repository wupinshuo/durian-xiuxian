import { encryptTool } from "@/tools/encrypt";
import { uuidTool } from "@/tools/uuid";

import { GAME_SETTINGS, DEFAULT_CHARACTER } from "@/constants/game";
import {
  Character,
  Item,
  PlayerData,
  ItemEffect,
  Skill,
  GameEvent,
} from "@/types";
import {
  MAX_REALM_PROGRESS,
  CultivationRealm,
  SpiritRootType,
  SpiritRootQuality,
  CultivationPath,
  SkillRank,
  ItemType,
  MAX_REALM_LEVEL,
  TRIBULATION_PROBABILITY,
  RealmLevel,
} from "@/constants";

/**
 * 游戏数据处理服务
 */
class GameDataService {
  /** 本地存储键名 durian_xiuxian_save */
  private static readonly STORAGE_KEY = GAME_SETTINGS.STORAGE_KEY;

  /** 获取玩家数据 */
  public getPlayerData(): PlayerData {
    if (typeof window === "undefined") {
      return this.getInitialData();
    }

    // 从本地存储读取数据
    const savedData = localStorage.getItem(GameDataService.STORAGE_KEY);
    if (savedData) {
      try {
        // 解密数据
        const decryptedData = encryptTool.decryptData(savedData);
        if (decryptedData) {
          return decryptedData;
        }
        // 解密失败，返回初始数据
        console.warn("游戏数据解密失败，使用初始数据");
        return this.getInitialData();
      } catch (error) {
        console.error("解析游戏数据失败:", error);
        return this.getInitialData();
      }
    }

    // 如果没有保存的数据，返回初始数据
    return this.getInitialData();
  }

  /**
   * 保存玩家数据到本地存储
   * @param data 玩家数据
   */
  public savePlayerData(data: PlayerData): void {
    if (typeof window !== "undefined") {
      // 加密数据
      const encryptedData = encryptTool.encryptData(data);
      localStorage.setItem(GameDataService.STORAGE_KEY, encryptedData);
    }
  }

  /**
   * 获取玩家角色信息
   * @returns 角色信息
   */
  public getCharacter(): Character {
    return this.getPlayerData().character;
  }

  /**
   * 获取玩家功法列表
   * @returns 功法列表
   */
  public getSkills(): Skill[] {
    return this.getPlayerData().skills;
  }

  /**
   * 获取玩家背包物品
   * @returns 背包物品
   */
  public getItems(): Item[] {
    return this.getPlayerData().inventory.items;
  }

  /**
   * 获取玩家事件记录
   * @returns 事件记录
   */
  public getEvents(): GameEvent[] {
    return this.getPlayerData().events;
  }

  /**
   * 获取玩家灵石数量
   * @returns 灵石数量
   */
  public getSpiritualStones(): number {
    const playerData = this.getPlayerData();
    // 适配新的PlayerData结构
    if ("inventory" in playerData && "currency" in playerData.inventory) {
      return playerData.inventory.currency.spiritualStones;
    }
    // 兼容旧结构
    return (playerData as any).spiritualStones || 0;
  }

  /**
   * 获取玩家灵玉数量
   * @returns 灵玉数量
   */
  public getSpiritGems(): number {
    const playerData = this.getPlayerData();
    // 适配新的PlayerData结构
    if ("inventory" in playerData && "currency" in playerData.inventory) {
      return playerData.inventory.currency.spiritGems;
    }
    // 兼容旧结构
    return (playerData as any).spiritGems || 0;
  }

  /**
   * 获取下一个境界
   * @param currentRealm 当前境界
   * @returns 下一个境界或null
   */
  public getNextRealm(currentRealm: CultivationRealm): CultivationRealm | null {
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

  /**
   * 检查是否可以升级境界
   * @param character 角色数据
   * @returns 是否可以升级
   */
  public checkForRealmUpgrade(character: Character): boolean {
    return (
      character.realmLevel >= MAX_REALM_LEVEL &&
      character.realmProgress >= MAX_REALM_PROGRESS
    );
  }

  /**
   * 更新角色信息
   * @param data 玩家数据
   * @param updatedCharacter 更新的角色信息
   * @returns 更新后的玩家数据
   */
  public updateCharacter(
    data: PlayerData,
    updatedCharacter: Character
  ): PlayerData {
    return {
      ...data,
      character: updatedCharacter,
    };
  }

  /**
   * 更新修为进度
   * @param data 玩家数据
   * @param progress 新进度
   * @returns 更新后的玩家数据
   */
  public updateRealmProgress(data: PlayerData, progress: number): PlayerData {
    return {
      ...data,
      character: {
        ...data.character,
        realmProgress: Math.min(Math.max(0, progress), MAX_REALM_PROGRESS),
      },
    };
  }

  /**
   * 增加修为进度
   * @param data 玩家数据
   * @param amount 增加量
   * @returns 更新后的玩家数据
   */
  public addRealmProgress(data: PlayerData, amount: number): PlayerData {
    // 计算新的修为进度
    let newProgress = data.character.realmProgress + amount;
    let newRealmLevel = data.character.realmLevel;
    const newRealm = data.character.realm;
    let updatedEvents = [...data.events];

    // 如果修为进度小于0，则设置为0
    if (newProgress < 0) {
      newProgress = 0;
    }

    // 如果达到100%，且不是巅峰层级，自动升级层级
    if (newProgress >= MAX_REALM_PROGRESS && newRealmLevel < MAX_REALM_LEVEL) {
      // 确保newRealmLevel是合法的RealmLevel类型
      newRealmLevel = (newRealmLevel + 1) as RealmLevel;
      newProgress -= MAX_REALM_PROGRESS;

      // 升级事件
      const upgradeEvent: GameEvent = {
        id: uuidTool.generateUUID(),
        type: "cultivation",
        title: "境界提升",
        description: `修为积累满足，你的境界提升到了${newRealm}${newRealmLevel}层！`,
        timestamp: Date.now(),
      };

      updatedEvents = [upgradeEvent, ...updatedEvents];
    } else if (newProgress >= MAX_REALM_PROGRESS) {
      // 达到巅峰，保持在100%
      newProgress = MAX_REALM_PROGRESS;

      // 提示事件
      const readyEvent: GameEvent = {
        id: uuidTool.generateUUID(),
        type: "cultivation",
        title: "突破准备",
        description: `你已经达到${newRealm}${newRealmLevel}层巅峰，可以尝试突破到更高境界了！`,
        timestamp: Date.now(),
      };

      updatedEvents = [readyEvent, ...updatedEvents];
    }

    // 返回更新后的数据
    return {
      ...data,
      character: {
        ...data.character,
        realmLevel: newRealmLevel,
        realmProgress: newProgress,
      },
      events: updatedEvents,
    };
  }

  /**
   * 更新技能进度
   * @param data 玩家数据
   * @param skillId 技能ID
   * @param progress 新进度
   * @returns 更新后的玩家数据
   */
  public updateSkillProgress(
    data: PlayerData,
    skillId: string,
    progress: number
  ): PlayerData {
    // 查找技能
    const skillIndex = data.skills.findIndex((s) => s.id === skillId);
    if (skillIndex === -1) return data;

    // 创建技能副本
    const updatedSkills = [...data.skills];
    updatedSkills[skillIndex] = {
      ...updatedSkills[skillIndex],
      progress: Math.min(Math.max(0, progress), 100),
    };

    // 返回更新后的数据
    return {
      ...data,
      skills: updatedSkills,
    };
  }

  /**
   * 增加功法修炼进度
   * @param data 玩家数据
   * @param skillId 功法ID
   * @param amount 进度
   * @returns 更新后的玩家数据
   */
  public addSkillProgress(
    data: PlayerData,
    skillId: string,
    amount: number
  ): PlayerData {
    const skill = data.skills.find((s) => s.id === skillId);
    if (!skill) return data;

    // 创建副本
    let updatedSkills = [...data.skills];
    let updatedEvents = [...data.events];

    // 找到技能索引
    const skillIndex = updatedSkills.findIndex((s) => s.id === skillId);
    if (skillIndex === -1) return data;

    // 更新技能副本
    let updatedSkill = { ...updatedSkills[skillIndex] };
    updatedSkill.progress += amount;

    // 如果技能进度满了，提升层级
    if (
      updatedSkill.progress >= 100 &&
      updatedSkill.level < updatedSkill.maxLevel
    ) {
      updatedSkill.level += 1;
      updatedSkill.progress -= 100;

      // 添加技能升级事件
      const skillUpgradeEvent: GameEvent = {
        id: uuidTool.generateUUID(),
        type: "skill",
        title: "功法突破",
        description: `你的《${updatedSkill.name}》已经突破到第${updatedSkill.level}层！`,
        timestamp: Date.now(),
      };

      updatedEvents = [skillUpgradeEvent, ...updatedEvents];
    } else if (updatedSkill.progress >= 100) {
      // 技能已达最大层级，保持在100%
      updatedSkill.progress = 100;
    }

    // 更新技能列表
    updatedSkills[skillIndex] = updatedSkill;

    // 返回更新后的数据
    return {
      ...data,
      skills: updatedSkills,
      events: updatedEvents,
    };
  }

  /**
   * 更新灵石数量
   * @param data 玩家数据
   * @param amount 新数量
   * @returns 更新后的玩家数据
   */
  public updateSpiritualStones(data: PlayerData, amount: number): PlayerData {
    return {
      ...data,
      inventory: {
        ...data.inventory,
        currency: {
          ...data.inventory.currency,
          spiritualStones: Math.max(0, amount),
        },
      },
    };
  }

  /**
   * 更新灵玉数量
   * @param data 玩家数据
   * @param amount 新数量
   * @returns 更新后的玩家数据
   */
  public updateSpiritGems(data: PlayerData, amount: number): PlayerData {
    return {
      ...data,
      inventory: {
        ...data.inventory,
        currency: {
          ...data.inventory.currency,
          spiritGems: Math.max(0, amount),
        },
      },
    };
  }

  /**
   * 添加物品到背包
   * @param data 玩家数据
   * @param item 物品
   * @returns 添加结果和更新后的玩家数据
   */
  public addItem(
    data: PlayerData,
    item: Item
  ): { success: boolean; updatedData: PlayerData } {
    // 检查背包是否已满
    if (data.inventory.items.length >= data.inventory.maxSize) {
      return { success: false, updatedData: data };
    }

    // 创建物品列表副本
    let updatedItems = [...data.inventory.items];

    // 检查是否可堆叠
    if (item.stackable) {
      const existingItemIndex = updatedItems.findIndex(
        (i) => i.name === item.name && i.type === item.type
      );

      if (existingItemIndex !== -1) {
        // 更新现有物品数量
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        };

        return {
          success: true,
          updatedData: {
            ...data,
            inventory: {
              ...data.inventory,
              items: updatedItems,
            },
          },
        };
      }
    }

    // 添加新物品
    return {
      success: true,
      updatedData: {
        ...data,
        inventory: {
          ...data.inventory,
          items: [...updatedItems, item],
        },
      },
    };
  }

  /**
   * 使用物品
   * @param data 玩家数据
   * @param itemId 物品ID
   * @returns 使用成功和更新后的玩家数据
   */
  public useItem(
    data: PlayerData,
    itemId: string
  ): { success: boolean; updatedData: PlayerData } {
    const itemIndex = data.inventory.items.findIndex(
      (item) => item.id === itemId
    );

    if (itemIndex === -1 || !data.inventory.items[itemIndex].usable) {
      return { success: false, updatedData: data };
    }

    const item = data.inventory.items[itemIndex];
    const updatedItems = [...data.inventory.items];

    // 减少物品数量
    if (updatedItems[itemIndex].quantity > 1) {
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity: updatedItems[itemIndex].quantity - 1,
      };
    } else {
      updatedItems.splice(itemIndex, 1);
    }

    // 应用物品效果
    let updatedCharacter = { ...data.character };
    let updatedEvents = [...data.events];

    // 处理丹药效果
    if (item.type === ItemType.Pill) {
      const effects = item.effects as ItemEffect[];
      // 恢复灵力
      if (effects.length > 0 && effects[0].type === "manaRestore") {
        const manaRestorePercent = effects[0].value as number;
        const maxMana = updatedCharacter.attributes.mana;
        const restoreAmount = Math.floor((maxMana * manaRestorePercent) / 100);

        updatedCharacter.attributes = {
          ...updatedCharacter.attributes,
          manaCurrent: Math.min(
            maxMana,
            updatedCharacter.attributes.manaCurrent + restoreAmount
          ),
        };

        updatedEvents.unshift({
          id: uuidTool.generateUUID(),
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

        updatedCharacter.attributes = {
          ...updatedCharacter.attributes,
          healthCurrent: Math.min(
            maxHealth,
            updatedCharacter.attributes.healthCurrent + restoreAmount
          ),
        };

        updatedEvents.unshift({
          id: uuidTool.generateUUID(),
          type: "item",
          title: "使用物品",
          description: `使用了${item.name}，恢复了${restoreAmount}点气血。`,
          timestamp: Date.now(),
        });
      }
    }

    return {
      success: true,
      updatedData: {
        ...data,
        character: updatedCharacter,
        inventory: {
          ...data.inventory,
          items: updatedItems,
        },
        events: updatedEvents,
      },
    };
  }

  /**
   * 出售物品
   * @param data 玩家数据
   * @param itemId 物品ID
   * @returns 出售价格和更新后的玩家数据
   */
  public sellItem(
    data: PlayerData,
    itemId: string
  ): { price: number; updatedData: PlayerData } {
    const item = data.inventory.items.find((item) => item.id === itemId);
    if (!item) return { price: 0, updatedData: data };

    const price = item.value || 0;

    return {
      price,
      updatedData: {
        ...data,
        inventory: {
          ...data.inventory,
          items: data.inventory.items.filter((i) => i.id !== itemId),
          currency: {
            ...data.inventory.currency,
            spiritualStones: data.inventory.currency.spiritualStones + price,
          },
        },
      },
    };
  }

  /**
   * 添加事件
   * @param data 玩家数据
   * @param event 事件
   * @returns 更新后的玩家数据
   */
  public addEvent(data: PlayerData, event: GameEvent): PlayerData {
    return {
      ...data,
      events: [event, ...data.events.slice(0, 49)], // 保留最新的50条记录
    };
  }

  /**
   * 升级境界
   * @param data 玩家数据
   * @returns 是否升级成功和更新后的玩家数据
   */
  public upgradeRealm(data: PlayerData): {
    success: boolean;
    updatedData: PlayerData;
  } {
    if (!this.checkForRealmUpgrade(data.character)) {
      return { success: false, updatedData: data };
    }

    const nextRealm = this.getNextRealm(data.character.realm);
    if (!nextRealm) {
      return { success: false, updatedData: data };
    }

    // 随机决定是否遭遇天劫
    const encounterTribulation = Math.random() * 100 < TRIBULATION_PROBABILITY;

    if (encounterTribulation) {
      // 遭遇天劫
      const tribulationEvent: GameEvent = {
        id: uuidTool.generateUUID(),
        type: "tribulation",
        title: "天劫降临",
        description: `在突破${nextRealm}时，你遭遇了天劫！需要准备更多资源再次尝试突破。`,
        timestamp: Date.now(),
      };

      return {
        success: false,
        updatedData: {
          ...data,
          character: {
            ...data.character,
            realmProgress: Math.max(0, data.character.realmProgress - 30), // 损失30%进度
          },
          events: [tribulationEvent, ...data.events],
        },
      };
    } else {
      // 成功突破
      const breakthroughEvent: GameEvent = {
        id: uuidTool.generateUUID(),
        type: "breakthrough",
        title: "境界突破",
        description: `恭喜你成功突破到${nextRealm}境界！你感觉自己体内的灵力更加充沛了。`,
        timestamp: Date.now(),
      };

      return {
        success: true,
        updatedData: {
          ...data,
          character: {
            ...data.character,
            realm: nextRealm,
            realmLevel: 1,
            realmProgress: 0,
            attributes: {
              ...data.character.attributes,
              attack: data.character.attributes.attack + 50,
              defense: data.character.attributes.defense + 40,
              spirit: data.character.attributes.spirit + 60,
              speed: data.character.attributes.speed + 30,
              health: data.character.attributes.health + 100,
              healthCurrent: data.character.attributes.health + 100,
              mana: data.character.attributes.mana + 80,
              manaCurrent: data.character.attributes.mana + 80,
            },
          },
          events: [breakthroughEvent, ...data.events],
        },
      };
    }
  }

  /**
   * 重置游戏数据
   * @returns 初始数据
   */
  public resetData(): PlayerData {
    if (typeof window !== "undefined") {
      localStorage.removeItem(GameDataService.STORAGE_KEY);
    }
    return this.getInitialData();
  }

  /**
   * 获取初始数据
   * @returns 初始数据
   */
  private getInitialData(): PlayerData {
    return {
      character: this.getInitialCharacter(),
      skills: this.getInitialSkills(),
      inventory: {
        capacity: 20,
        currency: {
          spiritualStones: 100,
          spiritGems: 5,
        },
        maxSize: 20,
        items: this.getInitialItems(),
      },
      events: this.getInitialEvents(),
    };
  }

  /**
   * 初始角色信息
   * @returns 初始角色信息
   */
  private getInitialCharacter(): Character {
    return {
      id: uuidTool.generateUUID(),
      name: DEFAULT_CHARACTER.NAME,
      avatar: DEFAULT_CHARACTER.AVATAR,
      realm: CultivationRealm.QiRefining, // 练气期
      realmLevel: 1,
      realmProgress: 0,
      age: DEFAULT_CHARACTER.AGE,
      lifespan: DEFAULT_CHARACTER.LIFESPAN,
      attributes: {
        attack: 10,
        defense: 10,
        spirit: 15,
        speed: 10,
        health: 100,
        healthCurrent: 100,
        mana: 50,
        manaCurrent: 50,
        insight: 10,
      },
      spiritRoots: [SpiritRootType.Wood],
      spiritRootQuality: SpiritRootQuality.Poor,
      cultivationPath: CultivationPath.Righteous,
    };
  }

  /**
   * 初始功法
   * @returns 初始功法
   */
  private getInitialSkills(): Skill[] {
    return [
      {
        id: uuidTool.generateUUID(),
        name: "紫霄玄功",
        description: "青云门入门功法，修炼可提升灵力和修为。",
        type: "cultivation",
        rank: SkillRank.Low,
        level: 1,
        progress: 0,
        maxLevel: 9,
        effects: [
          {
            type: "spiritBonus",
            value: 5,
            description: "增加灵力",
          },
          {
            type: "cultivationSpeed",
            value: 10,
            description: "增加修炼速度",
          },
        ],
      },
      {
        id: uuidTool.generateUUID(),
        name: "八荒剑诀",
        description: "剑修入门功法，修炼可提高攻击和速度。",
        type: "combat",
        rank: SkillRank.Low,
        level: 1,
        progress: 0,
        maxLevel: 7,
        effects: [
          {
            type: "attackBonus",
            value: 8,
            description: "增加攻击力",
          },
          {
            type: "speedBonus",
            value: 5,
            description: "增加速度",
          },
        ],
      },
      {
        id: uuidTool.generateUUID(),
        name: "金刚不灭体",
        description: "炼体功法，提高体魄和防御。",
        type: "cultivation",
        rank: SkillRank.Low,
        level: 1,
        progress: 0,
        maxLevel: 5,
        effects: [
          {
            type: "healthBonus",
            value: 15,
            description: "增加气血",
          },
          {
            type: "defenseBonus",
            value: 10,
            description: "增加防御",
          },
        ],
      },
    ];
  }

  /**
   * 初始物品
   * @returns 初始物品
   */
  private getInitialItems(): Item[] {
    return [
      {
        id: uuidTool.generateUUID(),
        name: "凝气丹",
        description: "服用后可提升修炼速度30%，持续4小时。",
        type: ItemType.Pill,
        rank: SkillRank.Low,
        effects: [
          {
            type: "cultivationSpeedBonus",
            value: 30,
            description: "增加修炼速度",
            duration: 14400, // 4小时(秒)
          },
        ],
        quantity: 3,
        value: 50,
        usable: true,
        stackable: true,
      },
      {
        id: uuidTool.generateUUID(),
        name: "回气丹",
        description: "服用后立即恢复25%的灵力。",
        type: ItemType.Pill,
        rank: SkillRank.Low,
        effects: [
          {
            type: "manaRestore",
            value: 25, // 百分比
            description: "恢复灵力",
          },
        ],
        quantity: 2,
        value: 30,
        usable: true,
        stackable: true,
      },
    ];
  }

  /**
   * 初始事件
   * @returns 初始事件
   */
  private getInitialEvents(): GameEvent[] {
    return [
      {
        id: uuidTool.generateUUID(),
        type: "story",
        title: "踏入修真之路",
        description: "你开始了自己的修真之旅，愿仙途坦荡。",
        timestamp: Date.now(),
      },
    ];
  }
}

export const gameDataService = new GameDataService();
