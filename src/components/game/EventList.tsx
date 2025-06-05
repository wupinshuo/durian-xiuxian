"use client";

import React, { useState } from "react";
import { useGameData } from "@/store/GameDataContext";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

interface EventListProps {
  limit?: number;
}

export default function EventList({ limit = 5 }: EventListProps) {
  const { events } = useGameData();
  const [showAll, setShowAll] = useState(false);

  const maxEvents = 10; // 最多显示的事件数量
  const displayedEvents = showAll
    ? events.slice(0, maxEvents)
    : events.slice(0, limit);

  // 根据事件类型获取边框颜色
  const getEventBorderColor = (type: string): string => {
    switch (type) {
      case "cultivation":
        return "border-blue-500";
      case "combat":
        return "border-green-500";
      case "insight":
        return "border-yellow-500";
      case "item":
        return "border-purple-500";
      default:
        return "border-gray-500";
    }
  };

  // 格式化时间
  const formatTime = (timestamp: number): string => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: zhCN,
    });
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-4">最近事件</h3>
      <div className="space-y-3">
        {displayedEvents.map((event) => (
          <div
            key={event.id}
            className={`p-2 border-l-4 ${getEventBorderColor(event.type)}`}
          >
            <div className="text-sm text-gray-400">
              {formatTime(event.timestamp)}
            </div>
            <div>{event.description}</div>
          </div>
        ))}

        {displayedEvents.length === 0 && (
          <div className="text-center text-gray-500 py-4">暂无事件记录</div>
        )}
      </div>

      {events.length > limit && (
        <div className="text-center mt-3">
          <button
            onClick={toggleShowAll}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            {showAll ? "收起" : "查看更多"}
          </button>
        </div>
      )}
    </div>
  );
}
