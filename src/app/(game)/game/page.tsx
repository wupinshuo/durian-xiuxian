"use client";

import React from "react";
import CharacterCard from "@/components/game/CharacterCard";
import CharacterDetails from "@/components/game/CharacterDetails";
import SkillList from "@/components/game/SkillList";
import EventList from "@/components/game/EventList";

export default function HomePage() {
  return (
    <div>
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
    </div>
  );
}
