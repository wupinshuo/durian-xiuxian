/**
 * 游戏数据服务
 * 提供对游戏数据的读取和修改方法
 */

"use client";

import {
  PlayerData,
  Character,
  Skill,
  Item,
  GameEvent,
  CultivationRealm,
  ItemType,
  SpiritRootQuality,
  SpiritRootType,
  CultivationPath,
  RealmLevel,
  SkillRank,
  ItemEffect,
} from "@/lib/types/game";
import { generateUUID } from "@/lib/utils";

// 存储键
const STORAGE_KEY = "durian_xiuxian_game_data";
// 加密密钥，在实际应用中可以使用更复杂的密钥生成方法
const ENCRYPTION_KEY = "durian_xiuxian_secret_key_2024";
// 签名密钥
const SIGNATURE_KEY = "durian_xiuxian_signature_2024";

// 默认头像
const DEFAULT_AVATAR = "/avatars/default.png";

/**
 * 使用AES加密数据
 * @param data 要加密的数据
 * @returns 加密后的字符串
 */
function encryptData(data: any): string {
  try {
    // 将数据转换为JSON字符串
    const jsonString = JSON.stringify(data);

    // 计算数据签名
    const signature = generateSignature(jsonString);

    // 将数据和签名打包在一起
    const payload = {
      data: jsonString,
      signature: signature,
      timestamp: Date.now(),
    };

    // 简单加密实现，使用Base64和异或运算
    const payloadStr = JSON.stringify(payload);
    let encrypted = "";
    for (let i = 0; i < payloadStr.length; i++) {
      const charCode =
        payloadStr.charCodeAt(i) ^
        ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      encrypted += String.fromCharCode(charCode);
    }

    // 安全处理Unicode字符串的Base64编码
    return btoa(
      encodeURIComponent(encrypted).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
  } catch (error) {
    console.error("数据加密失败:", error);
    return "";
  }
}

/**
 * 解密数据
 * @param encryptedData 加密的数据字符串
 * @returns 解密后的数据对象，如果解密失败则返回null
 */
function decryptData(encryptedData: string): any {
  try {
    // 安全解码Base64
    const rawStr = atob(encryptedData);
    const result = decodeURIComponent(
      Array.from(
        rawStr,
        (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
      ).join("")
    );

    // 解密
    let decrypted = "";
    for (let i = 0; i < result.length; i++) {
      const charCode =
        result.charCodeAt(i) ^
        ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      decrypted += String.fromCharCode(charCode);
    }

    // 解析payload
    const payload = JSON.parse(decrypted);

    // 验证签名
    const calculatedSignature = generateSignature(payload.data);
    if (calculatedSignature !== payload.signature) {
      console.error("数据签名验证失败，可能被篡改");
      return null;
    }

    // 解析原始数据
    return JSON.parse(payload.data);
  } catch (error) {
    console.error("数据解密失败:", error);
    return null;
  }
}

/**
 * 生成数据签名
 * @param data 要签名的数据
 * @returns 数据签名
 */
function generateSignature(data: string): string {
  // 简单的签名实现，使用字符串和签名密钥计算哈希值
  let signature = 0;
  const stringToHash = data + SIGNATURE_KEY;

  for (let i = 0; i < stringToHash.length; i++) {
    signature = (signature << 5) - signature + stringToHash.charCodeAt(i);
    signature = signature & signature; // 转换为32位整数
  }

  return signature.toString(16);
}

/**
 * 提供对游戏数据的操作方法
 */
export class GameDataService {
  private playerData: PlayerData;

  constructor() {
    this.playerData = this.getPlayerData();
  }

  /**
   * 获取玩家数据
   */
  getPlayerData(): PlayerData {
    if (typeof window === "undefined") {
      return this.getInitialData();
    }

    // 从本地存储读取数据
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        // 解密数据
        const decryptedData = decryptData(savedData);
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
   */
  savePlayerData(data: PlayerData): void {
    if (typeof window !== "undefined") {
      // 加密数据
      const encryptedData = encryptData(data);
      localStorage.setItem(STORAGE_KEY, encryptedData);
    }
  }

  /**
   * 获取玩家角色信息
   */
  getCharacter(): Character {
    return this.getPlayerData().character;
  }

  /**
   * 获取玩家功法列表
   */
  getSkills(): Skill[] {
    return this.getPlayerData().skills;
  }

  /**
   * 获取玩家背包物品
   */
  getItems(): Item[] {
    return this.getPlayerData().inventory.items;
  }

  /**
   * 获取玩家事件记录
   */
  getEvents(): GameEvent[] {
    return this.getPlayerData().events;
  }

  /**
   * 获取玩家灵石数量
   */
  getSpiritualStones(): number {
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
   */
  getSpiritGems(): number {
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
   */
  updateRealmProgress(progress: number): void {
    const data = this.getPlayerData();
    data.character.realmProgress = Math.min(Math.max(0, progress), 100);
    this.savePlayerData(data);
  }

  /**
   * 增加修为进度
   */
  addRealmProgress(amount: number): void {
    const data = this.getPlayerData();
    data.character.realmProgress += amount;

    // 如果达到100%，且当前不是巅峰层级，自动升级层级
    if (data.character.realmProgress >= 100 && data.character.realmLevel < 12) {
      data.character.realmLevel += 1;
      data.character.realmProgress -= 100;

      // 添加升级事件
      const upgradeEvent: GameEvent = {
        id: generateUUID(),
        type: "cultivation",
        title: "境界提升",
        description: `修为积累满足，你的境界提升到了${data.character.realm}${data.character.realmLevel}层！`,
        timestamp: Date.now(),
      };

      data.events.unshift(upgradeEvent);
    } else if (data.character.realmProgress >= 100) {
      // 如果是巅峰层级，保持在100%
      data.character.realmProgress = 100;

      // 添加提示事件
      const readyEvent: GameEvent = {
        id: generateUUID(),
        type: "cultivation",
        title: "突破准备",
        description: `你已经达到${data.character.realm}${data.character.realmLevel}层巅峰，可以尝试突破到更高境界了！`,
        timestamp: Date.now(),
      };

      // 避免重复事件
      const hasReadyEvent = data.events.some(
        (e) =>
          e.type === "cultivation" &&
          e.title === "突破准备" &&
          Date.now() - e.timestamp < 3600000 // 1小时内
      );

      if (!hasReadyEvent) {
        data.events.unshift(readyEvent);
      }
    }

    this.savePlayerData(data);
  }

  /**
   * 修改功法修炼进度
   */
  updateSkillProgress(skillId: string, progress: number): void {
    const data = this.getPlayerData();
    const skill = data.skills.find((s) => s.id === skillId);

    if (skill) {
      skill.progress = Math.min(Math.max(0, progress), 100);
      this.savePlayerData(data);
    }
  }

  /**
   * 增加功法修炼进度
   */
  addSkillProgress(skillId: string, amount: number): void {
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
        id: generateUUID(),
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
   */
  updateSpiritualStones(amount: number): void {
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
   */
  updateSpiritGems(amount: number): void {
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
   */
  addItem(item: Item): boolean {
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
   */
  useItem(itemId: string): boolean {
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
              id: generateUUID(),
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
              id: generateUUID(),
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
        id: generateUUID(),
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
        id: generateUUID(),
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
   */
  resetData(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // 获取初始数据
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

  // 初始角色信息
  private getInitialCharacter(): Character {
    return {
      id: generateUUID(),
      name: "无名散修",
      avatar: DEFAULT_AVATAR,
      realm: CultivationRealm.QiRefining, // 练气期
      realmLevel: 1,
      realmProgress: 0,
      age: 16,
      lifespan: 100,
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

  // 初始功法
  private getInitialSkills(): Skill[] {
    return [
      {
        id: generateUUID(),
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
        id: generateUUID(),
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
        id: generateUUID(),
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

  // 初始物品
  private getInitialItems(): Item[] {
    return [
      {
        id: generateUUID(),
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
        id: generateUUID(),
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

  // 初始事件
  private getInitialEvents(): GameEvent[] {
    return [
      {
        id: generateUUID(),
        type: "story",
        title: "踏入修真之路",
        description: "你开始了自己的修真之旅，愿仙途坦荡。",
        timestamp: Date.now(),
      },
    ];
  }
}
