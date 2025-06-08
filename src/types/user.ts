/**
 * 游戏角色类型定义
 */

import { Character } from "./character";

/** 用户设置 */
export interface UserSettings {
  /** 音效开关 */
  soundEnabled: boolean;
  /** 音效音量 */
  soundVolume: number;
  /** 音乐开关 */
  musicEnabled: boolean;
  /** 音乐音量 */
  musicVolume: number;
  /** 自动保存 */
  autoSave: boolean;
  /** 难度设置 */
  difficulty: "easy" | "normal" | "hard" | "expert";
  /** 界面设置 */
  ui: {
    /** 深色模式 */
    darkMode: boolean;
    /** 字体大小 */
    fontSize: number;
    /** 动画效果 */
    animations: boolean;
  };
}

/** 用户统计数据 */
export interface UserStatistics {
  /** 游戏时长（分钟） */
  playTime: number;
  /** 获取灵石总量 */
  spiritualStonesGained: number;
  /** 消费灵石总量 */
  spiritualStonesSpent: number;
  /** 修炼次数 */
  cultivationSessions: number;
  /** 突破次数 */
  breakthroughs: number;
  /** 战斗次数 */
  battles: number;
  /** 战斗胜利次数 */
  battlesWon: number;
  /** 物品获取数量 */
  itemsAcquired: number;
  /** 物品使用数量 */
  itemsUsed: number;
  /** 任务完成数量 */
  questsCompleted: number;
  [key: string]: number;
}

/** 用户记录数据 */
export interface UserProfile {
  /** 用户ID */
  id: string;
  /** 用户名 */
  username: string;
  /** 角色 */
  character: Character;
  /** 创建时间 */
  createdAt: number;
  /** 上次登录时间 */
  lastLoginAt: number;
  /** 设置 */
  settings: UserSettings;
  /** 统计数据 */
  statistics: UserStatistics;
}
