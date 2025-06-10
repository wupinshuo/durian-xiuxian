"use client";

import React, { useState } from "react";
import CharacterCard from "@/components/game/CharacterCard";
import CharacterDetails from "@/components/game/CharacterDetails";
import SkillList from "@/components/game/SkillList";
import EventList from "@/components/game/EventList";
import axios from "axios";

export default function HomePage() {
  const [apiResult, setApiResult] = useState<string | null>(null);

  // 测试API的函数
  const testApi = async (url = "gold") => {
    try {
      if (url === "gold") {
        const response = await axios.get(`/api/${url}`);
        const data = response.data;
        alert(`API测试成功: ${JSON.stringify(data)}`);
      } else {
        const response = await axios.post(`/api/${url}`, { type: "weibo" });
        const data = response.data;
        alert(`API测试成功: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      alert(`API测试失败: ${error}`);
    }
  };

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-6">角色信息</h1>

      <div className="flex flex-wrap">
        <div className="w-full md:w-1/3 p-2">
          <CharacterCard />
        </div>

        <div className="w-full md:w-2/3 p-2">
          <div className="space-y-4">
            <CharacterDetails />

            <SkillList limit={3} />

            <EventList limit={3} />
          </div>
        </div>
      </div>

      {/* 临时API测试按钮 - 完成测试后删除 */}
      <button
        onClick={() => testApi("gold")}
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded-full opacity-50 hover:opacity-100"
        title="测试API"
      >
        测试gold
      </button>
      <button
        onClick={() => testApi("hot")}
        className="fixed bottom-4 right-20 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded-full opacity-50 hover:opacity-100"
        title="测试API"
      >
        测试hot
      </button>
    </div>
  );
}
