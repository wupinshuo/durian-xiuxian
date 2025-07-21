import { useState, useCallback } from "react";
import { useGameData } from "@/store/GameDataContext";
import { GameEvent } from "@/types";
import { uuidTool } from "@/tools/uuid";

/**
 * 游戏事件钩子，处理游戏事件相关逻辑
 * @returns 事件相关状态和方法
 */
export function useGameEvents() {
  const { events, addEvent } = useGameData();
  const [filteredEvents, setFilteredEvents] = useState<GameEvent[]>(events);
  const [eventFilter, setEventFilter] = useState<string | null>(null);

  /**
   * 过滤事件列表
   * @param type 事件类型，null表示显示所有事件
   */
  const filterEvents = useCallback(
    (type: string | null) => {
      setEventFilter(type);
      if (type === null) {
        setFilteredEvents(events);
      } else {
        setFilteredEvents(events.filter((event) => event.type === type));
      }
    },
    [events]
  );

  /**
   * 创建新事件
   * @param type 事件类型
   * @param title 事件标题
   * @param description 事件描述
   */
  const createEvent = useCallback(
    (type: string, title: string, description: string) => {
      const newEvent: GameEvent = {
        id: uuidTool.generateUUID(),
        type,
        title,
        description,
        timestamp: Date.now(),
      };

      addEvent(newEvent);

      // 如果当前有过滤器，且新事件类型与过滤器匹配，则更新过滤后的事件列表
      if (eventFilter === null || eventFilter === type) {
        setFilteredEvents((prev) => [newEvent, ...prev]);
      }

      return newEvent;
    },
    [addEvent, eventFilter]
  );

  /**
   * 获取事件类型统计
   * @returns 各类型事件数量的对象
   */
  const getEventTypeStats = useCallback(() => {
    const stats: Record<string, number> = {};

    events.forEach((event) => {
      if (stats[event.type]) {
        stats[event.type]++;
      } else {
        stats[event.type] = 1;
      }
    });

    return stats;
  }, [events]);

  /**
   * 获取最近的事件
   * @param count 获取数量
   * @returns 最近的事件数组
   */
  const getRecentEvents = useCallback(
    (count: number = 5) => {
      return events.slice(0, count);
    },
    [events]
  );

  return {
    events,
    filteredEvents,
    eventFilter,
    filterEvents,
    createEvent,
    getEventTypeStats,
    getRecentEvents,
  };
}
