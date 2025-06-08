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
   * 修改玩家修为进度
   * @param progress 进度
   */
  public updateRealmProgress(progress: number): void {
    const data = this.getPlayerData();
    data.character.realmProgress = Math.min(
      Math.max(0, progress),
      MAX_REALM_PROGRESS
    );
    this.savePlayerData(data);
  }

  /**
   * 增加玩家修为进度
   * @param amount 进度
   */
  public addRealmProgress(amount: number): void {
    const data = this.getPlayerData();

    // 防止整数溢出
    let newProgress = data.character.realmProgress + amount;

    if (newProgress <= 0) {
      // 如果修为减少到0以下，则重置为0
      data.character.realmProgress = 0;
    } else if (newProgress >= MAX_REALM_PROGRESS) {
      // 如果修为超过最大值，则设置为最大值
      data.character.realmProgress = MAX_REALM_PROGRESS;
    } else {
      // 正常增加修为
      data.character.realmProgress = newProgress;
    }

    this.savePlayerData(data);
  }

  /**
   * 修改功法修炼进度
   * @param skillId 功法ID
   * @param progress 进度
   */
  public updateSkillProgress(skillId: string, progress: number): void {
    const data = this.getPlayerData();
    const skill = data.skills.find((s) => s.id === skillId);

    if (skill) {
      skill.progress = Math.min(Math.max(0, progress), 100);
      this.savePlayerData(data);
    }
  }

  /**
   * 增加功法修炼进度
   * @param skillId 功法ID
   * @param amount 进度
   */
  public addSkillProgress(skillId: string, amount: number): void {
    const data = this.getPlayerData();
    const skill = data.skills.find((s) => s.id === skillId);

    if (!skill) return;

    skill.progress += amount;

    // 如果技能进度满了，提升层级
    if (skill.progress >= 100 && skill.level < skill.maxLevel) {
      skill.level += 1;
      skill.progress -= 100;

      // 添加技能升级事件
      const skillUpgradeEvent: GameEvent = {
        id: uuidTool.generateUUID(),
        type: "skill",
        title: "功法突破",
        description: `你的${skill.name}已经提升到了${skill.rank}级！功法威力大幅提升。`,
        timestamp: Date.now(),
      };

      data.events.unshift(skillUpgradeEvent);
    } else if (skill.progress >= 100) {
      // 技能已达最大层级，保持在100%
      skill.progress = 100;
    }

    this.savePlayerData(data);
  }

  /**
   * 增加或减少灵石
   * @param amount 数量
   */
  public updateSpiritualStones(amount: number): void {
    const data = this.getPlayerData();
    // 适配新的PlayerData结构
    if ("inventory" in data && "currency" in data.inventory) {
      data.inventory.currency.spiritualStones = Math.max(0, amount);
    } else {
      // 兼容旧结构
      (data as any).spiritualStones = Math.max(0, amount);
    }
    this.savePlayerData(data);
  }

  /**
   * 增加或减少灵玉
   * @param amount 数量
   */
  public updateSpiritGems(amount: number): void {
    const data = this.getPlayerData();
    // 适配新的PlayerData结构
    if ("inventory" in data && "currency" in data.inventory) {
      data.inventory.currency.spiritGems = Math.max(0, amount);
    } else {
      // 兼容旧结构
      (data as any).spiritGems = Math.max(0, amount);
    }
    this.savePlayerData(data);
  }

  /**
   * 添加物品到背包
   * @param item 物品
   * @returns 是否添加成功
   * @description 添加物品后，如果物品可堆叠，则合并相同物品
   * @description 添加物品后，如果背包已满，则返回false
   * @description 添加物品后，保存玩家数据
   */
  public addItem(item: Item): boolean {
    const data = this.getPlayerData();

    // 检查背包是否已满
    if (data.inventory.items.length >= data.inventory.maxSize) {
      return false;
    }

    // 检查是否可堆叠
    if (item.stackable) {
      const existingItem = data.inventory.items.find(
        (i) => i.name === item.name && i.type === item.type
      );
      if (existingItem) {
        existingItem.quantity += item.quantity;
        this.savePlayerData(data);
        return true;
      }
    }

    // 添加新物品
    data.inventory.items.push(item);
    this.savePlayerData(data);
    return true;
  }

  /**
   * 使用物品
   * @param itemId 物品ID
   * @returns 是否使用成功
   * @description 使用物品后，物品数量减少，如果物品数量为0，则从背包中删除
   * @description 使用物品后，应用物品效果
   * @description 使用物品后，添加使用物品事件
   * @description 使用物品后，保存玩家数据
   * @description 使用物品后，如果物品数量为0，则从背包中删除
   * @description 使用物品后，应用物品效果
   * @description 使用物品后，添加使用物品事件
   * @description 使用物品后，保存玩家数据
   */
  public useItem(itemId: string): boolean {
    const data = this.getPlayerData();
    const itemIndex = data.inventory.items.findIndex(
      (item) => item.id === itemId
    );

    if (itemIndex === -1 || !data.inventory.items[itemIndex].usable) {
      return false;
    }

    const item = data.inventory.items[itemIndex];

    // 减少物品数量
    item.quantity -= 1;

    // 如果物品数量为0，从背包中删除
    if (item.quantity <= 0) {
      data.inventory.items.splice(itemIndex, 1);
    }

    // 应用物品效果
    this.applyItemEffect(data, item);

    this.savePlayerData(data);
    return true;
  }

  /**
   * 应用物品效果
   * @param data 玩家数据
   * @param item 物品
   * @description 应用物品效果后，恢复灵力或生命值
   * @description 应用物品效果后，添加使用物品事件
   * @description 应用物品效果后，保存玩家数据
   */
  private applyItemEffect(data: PlayerData, item: Item): void {
    // 这里只是简单实现，实际应该根据物品类型应用不同效果
    if (item.type === ItemType.Pill) {
      // 物品效果
      const effects = item.effects;
      if (effects) {
        effects.forEach((effect) => {
          if (effect.type === "manaRestore") {
            // 恢复灵力
            const manaRestorePercent = effect.value as number;
            const maxMana = data.character.attributes.mana;
            const restoreAmount = Math.floor(
              (maxMana * manaRestorePercent) / 100
            );

            data.character.attributes.manaCurrent = Math.min(
              maxMana,
              data.character.attributes.manaCurrent + restoreAmount
            );

            // 添加使用物品事件
            const manaEvent: GameEvent = {
              id: uuidTool.generateUUID(),
              type: "item",
              title: "使用物品",
              description: `你使用了${item.name}，恢复了法力值。`,
              timestamp: Date.now(),
            };

            data.events.unshift(manaEvent);
          } else if (effect.type === "healthRestore") {
            // 恢复生命值
            const healthRestorePercent = effect.value as number;
            const maxHealth = data.character.attributes.health;
            const restoreAmount = Math.floor(
              (maxHealth * healthRestorePercent) / 100
            );

            data.character.attributes.healthCurrent = Math.min(
              maxHealth,
              data.character.attributes.healthCurrent + restoreAmount
            );

            // 添加使用物品事件
            const healEvent: GameEvent = {
              id: uuidTool.generateUUID(),
              type: "item",
              title: "使用物品",
              description: `你使用了${item.name}，恢复了生命值。`,
              timestamp: Date.now(),
            };

            data.events.unshift(healEvent);
          }
        });
      }
    }
  }

  /**
   * 添加事件记录
   * @param event 事件
   * @description 添加事件记录后，恢复灵力或生命值
   * @description 添加事件记录后，添加使用物品事件
   * @description 添加事件记录后，保存玩家数据
   */
  addEvent(event: GameEvent): void {
    const data = this.getPlayerData();
    // 物品效果
    const effects = event.effects as ItemEffect[];
    if (effects.length > 0 && effects[0].type === "manaRestore") {
      // 恢复灵力
      const manaRestorePercent = effects[0].value as number;
      const maxMana = data.character.attributes.mana;
      const restoreAmount = Math.floor((maxMana * manaRestorePercent) / 100);

      data.character.attributes.manaCurrent = Math.min(
        maxMana,
        data.character.attributes.manaCurrent + restoreAmount
      );

      // 添加使用物品事件
      const manaEvent: GameEvent = {
        id: uuidTool.generateUUID(),
        type: "item",
        title: "使用物品",
        description: `你使用了${event.title}，恢复了法力值。`,
        timestamp: Date.now(),
      };

      data.events.unshift(manaEvent);
    }
    if (effects.length > 0 && effects[0].type === "healthRestore") {
      // 恢复生命值
      const healthRestorePercent = effects[0].value as number;
      const maxHealth = data.character.attributes.health;
      const restoreAmount = Math.floor(
        (maxHealth * healthRestorePercent) / 100
      );

      data.character.attributes.healthCurrent = Math.min(
        maxHealth,
        data.character.attributes.healthCurrent + restoreAmount
      );

      // 添加使用物品事件
      const healEvent: GameEvent = {
        id: uuidTool.generateUUID(),
        type: "item",
        title: "使用物品",
        description: `你使用了${event.title}，恢复了生命值。`,
        timestamp: Date.now(),
      };

      data.events.unshift(healEvent);
    }
  }

  // /**
  //  * 添加事件记录
  //  */
  // addEvent(event: GameEvent): void {
  //   const data = this.getPlayerData();
  //   data.events.unshift(event);

  //   // 只保留最近的50条事件
  //   if (data.events.length > 50) {
  //     data.events = data.events.slice(0, 50);
  //   }

  //   this.savePlayerData(data);
  // }

  /**
   * 重置游戏数据（慎用）
   * @description 重置游戏数据后，删除本地存储数据
   * @description 重置游戏数据后，返回初始数据
   * @description 重置游戏数据后，保存玩家数据
   */
  resetData(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(GameDataService.STORAGE_KEY);
    }
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
