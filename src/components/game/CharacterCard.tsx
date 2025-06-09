"use client";

import React from "react";
import Image from "next/image";
import { useGameData } from "@/store/GameDataContext";
import { FaQuestionCircle } from "react-icons/fa";

export default function CharacterCard() {
  const { character } = useGameData();
  const { attributes } = character;

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full">
      <div className="flex items-center mb-4">
        <div className="relative w-16 h-16 mr-4">
          <Image
            src={character.avatar || "/avatars/default.png"}
            alt={character.name}
            fill
            className="rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></div>
        </div>
        <div>
          <h3 className="text-xl font-bold">名称: {character.name}</h3>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-2">
              境界: {character.realm}
              {character.realmLevel}层
            </span>
            <FaQuestionCircle
              className="text-gray-500 cursor-help"
              title="修为境界"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-gray-400">修为</div>
          <div className="flex items-center">
            <div className="h-2 flex-grow bg-gray-700 rounded-full mr-2">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${character.realmProgress}%` }}
              ></div>
            </div>
            <span>{character.realmProgress.toFixed(1)}%</span>
          </div>
        </div>
        <div>
          <div className="text-gray-400">气血</div>
          <div className="flex items-center">
            <div className="h-2 flex-grow bg-gray-700 rounded-full mr-2">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{
                  width: `${
                    (attributes.healthCurrent / attributes.health) * 100
                  }%`,
                }}
              ></div>
            </div>
            <span>
              {((attributes.healthCurrent / attributes.health) * 100).toFixed(
                1
              )}
              %
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-700 p-2 rounded">
          <div className="text-gray-400">攻击</div>
          <div className="text-lg">{attributes.attack}</div>
        </div>
        <div className="bg-gray-700 p-2 rounded">
          <div className="text-gray-400">防御</div>
          <div className="text-lg">{attributes.defense}</div>
        </div>
        <div className="bg-gray-700 p-2 rounded">
          <div className="text-gray-400">灵力</div>
          <div className="text-lg">{attributes.spirit}</div>
        </div>
        <div className="bg-gray-700 p-2 rounded">
          <div className="text-gray-400">速度</div>
          <div className="text-lg">{attributes.speed}</div>
        </div>
      </div>
    </div>
  );
}
