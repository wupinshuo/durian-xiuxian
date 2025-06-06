import {
  Character,
  CharacterAttributes,
  CultivationPath,
  CultivationRealm,
  GameEvent,
  Item,
  ItemType,
  PlayerData,
  Skill,
  SkillRank,
  SpiritRootQuality,
  SpiritRootType,
} from "../types/game";
import { v4 as uuidv4 } from "uuid";

// 模拟角色属性
const mockAttributes: CharacterAttributes = {
  attack: 256,
  defense: 189,
  spirit: 347,
  speed: 215,
  health: 495,
  mana: 300,
  healthCurrent: 421,
  manaCurrent: 180,
  insight: 45,
};

// 模拟角色信息
export const mockCharacter: Character = {
  id: uuidv4(),
  name: "玄霄子",
  avatar: "/avatars/default.png",
  realm: CultivationRealm.QiRefining,
  realmLevel: 2,
  realmProgress: 65,
  sect: "青云门",
  sectPosition: "外门弟子",
  age: 18,
  lifespan: 120,
  spiritRoots: [
    SpiritRootType.Metal,
    SpiritRootType.Wood,
    SpiritRootType.Water,
    SpiritRootType.Fire,
    SpiritRootType.Earth,
  ],
  spiritRootQuality: SpiritRootQuality.Common,
  cultivationPath: CultivationPath.Righteous,
  attributes: mockAttributes,
};

// 模拟功法
export const mockSkills: Skill[] = [
  {
    id: uuidv4(),
    name: "紫霄玄功",
    description: "提升修为速度，增强灵力。",
    type: "cultivation",
    rank: SkillRank.High,
    level: 3,
    maxLevel: 7,
    progress: 35,
    effects: [
      {
        type: "cultivation_speed",
        value: 20,
        description: "修炼速度+20%",
      },
      {
        type: "spirit",
        value: 15,
        description: "灵力+15%",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "八荒剑诀",
    description: "剑修功法，提高攻击和速度。",
    type: "combat",
    rank: SkillRank.Middle,
    level: 2,
    maxLevel: 7,
    progress: 68,
    effects: [
      {
        type: "attack",
        value: 15,
        description: "攻击+15%",
      },
      {
        type: "speed",
        value: 10,
        description: "速度+10%",
      },
    ],
  },
  {
    id: uuidv4(),
    name: "金刚不灭体",
    description: "炼体功法，提高体魄和防御。",
    type: "auxiliary",
    rank: SkillRank.High,
    level: 1,
    maxLevel: 7,
    progress: 12,
    effects: [
      {
        type: "health",
        value: 20,
        description: "气血+20%",
      },
      {
        type: "defense",
        value: 15,
        description: "防御+15%",
      },
    ],
  },
];

// 模拟物品
export const mockItems: Item[] = [
  {
    id: uuidv4(),
    name: "凝气丹",
    description: "服用后可临时提升修炼速度30%，持续4小时。",
    type: ItemType.Pill,
    rank: SkillRank.Middle,
    stackable: true,
    quantity: 5,
    effects: [
      {
        type: "cultivation_speed",
        value: 30,
        duration: 14400, // 4小时 = 4 * 60 * 60秒
        description: "修炼速度+30%，持续4小时",
      },
    ],
    value: 150,
    usable: true,
  },
  {
    id: uuidv4(),
    name: "回气丹",
    description: "立即恢复25%灵力",
    type: ItemType.Pill,
    rank: SkillRank.Middle,
    stackable: true,
    quantity: 3,
    effects: [
      {
        type: "restore_mana",
        value: 25,
        description: "立即恢复25%灵力",
      },
    ],
    value: 120,
    usable: true,
  },
  {
    id: uuidv4(),
    name: "灵晶石",
    description: "蕴含丰富灵气的矿石，可用于修炼或炼器",
    type: ItemType.Material,
    rank: SkillRank.Low,
    stackable: true,
    quantity: 12,
    value: 50,
    usable: true,
  },
];

// 模拟事件
export const mockEvents: GameEvent[] = [
  {
    id: uuidv4(),
    type: "cultivation",
    title: "炼制丹药成功",
    description: "你成功炼制了一瓶「凝气丹」，修为提升5%。",
    timestamp: Date.now() - 3600000, // 1小时前
    effects: [
      {
        type: "realm_progress",
        value: 5,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "combat",
    title: "击败妖兽",
    description: "在「落剑山」击败野怪「阴风狼」，获得灵石×15。",
    timestamp: Date.now() - 86400000, // 1天前
    effects: [
      {
        type: "currency",
        value: 15,
      },
    ],
  },
  {
    id: uuidv4(),
    type: "insight",
    title: "悟性提升",
    description: "悟性提升，《八荒剑诀》修炼速度增加10%。",
    timestamp: Date.now() - 100800000, // 1天前多一点
    effects: [
      {
        type: "skill_progress",
        skillId: mockSkills[1].id,
        value: 10,
      },
    ],
  },
];

// 模拟玩家完整数据
export const mockPlayerData: PlayerData = {
  character: mockCharacter,
  skills: mockSkills,
  inventory: {
    items: mockItems,
    capacity: 50,
    maxSize: 50,
    currency: {
      spiritualStones: 1253,
      spiritGems: 75,
    },
  },
  events: mockEvents,
};
