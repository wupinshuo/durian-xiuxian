"use client";

import React from "react";
import { useGameData } from "@/store/GameDataContext";
import { convertTool } from "@/tools/convert";

export default function CharacterDetails() {
  const { character } = useGameData();

  // 灵根类型转换为中文字符串
  const spiritRootText =
    character.spiritRoots?.length > 0
      ? character.spiritRoots.length === 1
        ? `${character.spiritRoots[0]}灵根`
        : character.spiritRoots.length === 5
        ? "五行杂灵根"
        : `${character.spiritRoots.join("")}属性灵根`
      : "无灵根";

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-2">当前修为</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">境界:</span>
            <span>
              {character.realm}
              {character.realmLevel}层
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">灵根:</span>
            <span>
              {spiritRootText} ({character.spiritRootQuality || "普通"}资质)
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">道行:</span>
            <span>{character.cultivationPath || "未定"}</span>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">门派:</span>
            <span>
              {character.sect || "无门派"} ({character.sectPosition || "散修"})
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">年龄:</span>
            <span>
              {character.age}岁 (寿元{character.lifespan}年)
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">悟性:</span>
            <span>
              {character.attributes.insight || character.attributes.spirit} (
              {convertTool.getInsightLevel(
                character.attributes.insight || character.attributes.spirit
              )}
              )
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
