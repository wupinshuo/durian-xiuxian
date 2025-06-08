/**
 * 游戏事件类型定义
 */

import { EventType } from "@/constants";
import { ItemEffect } from "./item";

/** 游戏事件 */
export interface GameEvent {
  id: string;
  /** 事件类型 */
  type: string | EventType;
  /** 事件标题 */
  title: string;
  /** 事件描述 */
  description: string;
  /** 事件时间戳 */
  timestamp: number;
  /** 事件效果 */
  effects?: ItemEffect[];
}

/** 扩展游戏事件 */
export interface ExtendedGameEvent extends GameEvent {
  /** 关联实体的ID */
  relatedEntities?: string[];
  /** 奖励内容 */
  rewards?: Record<string, unknown>;
  /** 可选选项 */
  choices?: Array<EventChoice>;
  /** 位置信息 */
  location?: string;
  /** 持续时间 */
  duration?: number;
}

/** 事件选项 */
export interface EventChoice {
  /** 选项ID */
  id: string;
  /** 选项文本 */
  text: string;
  /** 选项要求 */
  requirements?: Record<string, unknown>;
  /** 选项结果 */
  outcome?: Record<string, unknown>;
}
