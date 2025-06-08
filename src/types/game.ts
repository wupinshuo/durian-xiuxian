/**
 * 游戏核心数据类型
 */

import { Character } from "./character";
import { GameEvent } from "./event";
import { Inventory } from "./item";
import { Skill } from "./skill";
import { UserStatistics } from "./user";

/** 玩家完整数据 */
export interface PlayerData {
  /** 角色信息 */
  character: Character;
  /** 已学功法 */
  skills: Skill[];
  /** 背包 */
  inventory: Inventory;
  /** 事件记录 */
  events: GameEvent[];
  /** 任务 */
  quests?: Array<Record<string, unknown>>;
  /** 统计数据 */
  statistics?: UserStatistics;
  /** 游戏设置 */
  settings?: {
    [key: string]: unknown;
  };
}

/** 游戏存档 */
export interface GameSave {
  /** 存档ID */
  id: string;
  /** 存档名称 */
  name: string;
  /** 存档时间 */
  timestamp: number;
  /** 玩家数据 */
  playerData: PlayerData;
  /** 游戏版本 */
  gameVersion: string;
}

/** 游戏配置 */
export interface GameConfig {
  /** 游戏版本 */
  version: string;
  /** 服务器URL */
  serverUrl?: string;
  /** 调试模式 */
  debugMode: boolean;
  /** 系统公告 */
  announcements: string[];
}
