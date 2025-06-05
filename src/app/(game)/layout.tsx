"use client";

import React from "react";
import GameNavbar from "@/components/game/GameNavbar";
import { GameDataProvider } from "@/store/GameDataContext";

interface GameLayoutProps {
  children: React.ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  return (
    <GameDataProvider>
      <div className="min-h-screen flex flex-col">
        <GameNavbar />
        <main className="flex-grow container mx-auto px-4 py-6 max-w-7xl">
          {children}
        </main>
        <footer className="bg-gray-800 text-gray-400 text-sm p-4 text-center">
          <p>榴莲修仙 &copy; {new Date().getFullYear()} - 踏上修真之路</p>
        </footer>
      </div>
    </GameDataProvider>
  );
}
