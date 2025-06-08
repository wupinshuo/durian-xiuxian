/**
 * 事件相关常量
 */

/** 事件类型 */
export enum EventType {
  /** 修炼事件 */
  Cultivation = "cultivation",
  /** 战斗事件 */
  Combat = "combat",
  /** 任务事件 */
  Quest = "quest",
  /** 剧情事件 */
  Story = "story",
  /** 天劫事件 */
  Tribulation = "tribulation",
  /** 突破事件 */
  Breakthrough = "breakthrough",
  /** 物品事件 */
  Item = "item",
  /** 系统事件 */
  System = "system",
}

/** 事件最大保存数量 */
export const MAX_EVENTS_HISTORY = 50;
