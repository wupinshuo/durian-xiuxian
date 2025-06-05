/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 游戏核心类型定义
 */

// 境界等级
export enum CultivationRealm {
  QiRefining = "练气", // 练气期
  Foundation = "筑基", // 筑基期
  CoreFormation = "结丹", // 结丹期
  NascentSoul = "元婴", // 元婴期
  SpiritSevering = "化神", // 化神期
  Void = "空劫", // 空劫期
}

// 境界层次
export type RealmLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// 灵根类型
export enum SpiritRootType {
  Metal = "金", // 金灵根
  Wood = "木", // 木灵根
  Water = "水", // 水灵根
  Fire = "火", // 火灵根
  Earth = "土", // 土灵根
  Thunder = "雷", // 雷灵根
  Wind = "风", // 风灵根
  Ice = "冰", // 冰灵根
  Mixed = "混合", // 混合灵根
  Chaos = "混沌", // 混沌灵根
}

// 灵根资质
export enum SpiritRootQuality {
  Poor = "下等", // 下等资质
  Common = "中等", // 中等资质
  Good = "上等", // 上等资质
  Excellent = "极品", // 极品资质
  Heavenly = "天灵", // 天灵资质
}

// 道行类型
export enum CultivationPath {
  Righteous = "正道", // 正道
  Neutral = "中立", // 中立
  Evil = "魔道", // 魔道
}

// 功法品级
export enum SkillRank {
  Mortal = "凡品", // 凡品
  Low = "下品", // 下品
  Middle = "中品", // 中品
  High = "上品", // 上品
  Supreme = "极品", // 极品
  Heavenly = "天级", // 天级
  Immortal = "仙级", // 仙级
}

// 角色基本属性
export interface CharacterAttributes {
  attack: number; // 攻击
  defense: number; // 防御
  spirit: number; // 灵力
  speed: number; // 速度
  health: number; // 气血最大值
  mana: number; // 灵力最大值
  healthCurrent: number; // 当前气血
  manaCurrent: number; // 当前灵力
  insight: number; // 悟性
}

// 角色信息
export interface Character {
  id: string;
  name: string; // 角色名称
  avatar: string; // 角色头像
  realm: CultivationRealm; // 境界
  realmLevel: RealmLevel; // 境界层次
  realmProgress: number; // 境界修炼进度（0-100%）
  sect?: string; // 所属门派
  sectPosition?: string; // 门派职位
  age: number; // 年龄
  lifespan: number; // 寿元
  spiritRoots: SpiritRootType[]; // 灵根
  spiritRootQuality: SpiritRootQuality; // 灵根资质
  cultivationPath: CultivationPath; // 修炼道路
  attributes: CharacterAttributes; // 角色属性
}

// 功法类型
export interface Skill {
  id: string;
  name: string; // 功法名称
  description: string; // 功法描述
  type: "cultivation" | "combat" | "auxiliary"; // 功法类型: 修炼功法、战斗功法、辅助功法
  rank: SkillRank; // 功法品级
  level: number; // 功法等级
  progress: number; // 修炼进度（0-100%）
  effects: SkillEffect[]; // 功法效果
}

// 功法效果
export interface SkillEffect {
  type: string; // 效果类型
  value: number; // 效果数值
  description: string; // 效果描述
}

// 道具类型
export enum ItemType {
  Pill = "丹药", // 丹药
  Weapon = "法器", // 法器
  Artifact = "法宝", // 法宝
  Material = "材料", // 材料
  Talisman = "符箓", // 符箓
  Quest = "任务物品", // 任务物品
}

// 物品
export interface Item {
  id: string;
  name: string; // 物品名称
  description: string; // 物品描述
  type: ItemType; // 物品类型
  rank: SkillRank; // 物品品级
  stackable: boolean; // 是否可堆叠
  quantity: number; // 数量
  effects?: ItemEffect[]; // 物品效果
  value: number; // 价值（灵石）
}

// 物品效果
export interface ItemEffect {
  type: string; // 效果类型
  value: number; // 效果数值
  duration?: number; // 持续时间（秒）
  description: string; // 效果描述
}

// 游戏事件
export interface GameEvent {
  id: string;
  type: string; // 事件类型
  title: string; // 事件标题
  description: string; // 事件描述
  timestamp: number; // 事件时间戳
  effects?: any[]; // 事件效果
}

// 玩家完整数据
export interface PlayerData {
  character: Character; // 角色信息
  skills: Skill[]; // 已学功法
  inventory: {
    items: Item[]; // 背包物品
    capacity: number; // 背包容量
    currency: {
      spiritualStones: number; // 灵石
      spiritGems: number; // 灵玉
    };
  };
  events: GameEvent[]; // 事件记录
}
