"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaCoins,
  FaGem,
  FaBars,
  FaTimes,
  FaHome,
  FaFire,
  FaWarehouse,
  FaUsers,
  FaDungeon,
  FaShoppingBag,
} from "react-icons/fa";
import { useGameData } from "@/store/GameDataContext";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  tooltip?: string;
}

export default function GameNavbar() {
  const { spiritualStones, spiritGems, character } = useGameData();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: "主页", href: "/game", icon: <FaHome /> },
    { label: "修炼", href: "/game/cultivation", icon: <FaFire /> },
    {
      label: "洞府",
      href: "/game/residence",
      icon: <FaWarehouse />,
      disabled: true,
      tooltip: "暂未开放",
    },
    {
      label: "宗门",
      href: "/game/sect",
      icon: <FaUsers />,
      disabled: true,
      tooltip: "暂未开放",
    },
    {
      label: "副本",
      href: "/game/dungeon",
      icon: <FaDungeon />,
      disabled: true,
      tooltip: "暂未开放",
    },
  ];

  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/game" className="text-xl font-bold mr-6">
              榴莲修仙
            </Link>

            {/* 桌面导航 */}
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.disabled ? "#" : item.href}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                      pathname === item.href
                        ? "bg-gray-900 text-white"
                        : "text-gray-400 hover:text-yellow-300"
                    } ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={(e) => item.disabled && e.preventDefault()}
                  >
                    <span className="mr-1">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                  {item.tooltip && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-24 px-2 py-1 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {item.tooltip}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-black"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 角色信息和货币 */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaCoins className="text-yellow-400 mr-1" />
              <span>{spiritualStones.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <FaGem className="text-blue-400 mr-1" />
              <span>{spiritGems.toLocaleString()}</span>
            </div>

            {/* 角色信息栏 */}
            <div className="p-1 px-2 bg-gray-700 rounded-md text-sm">
              <Link href="/game" className="flex items-center">
                <span className="text-gray-300 mr-1">{character.name}</span>
                <span className="text-yellow-400">
                  {character.realm}
                  {character.realmLevel}层
                </span>
              </Link>
            </div>

            {/* 背包图标 */}
            <Link
              href="/game/inventory"
              className="text-gray-400 hover:text-white"
            >
              <FaShoppingBag />
            </Link>

            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden text-gray-300 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* 移动端导航菜单 */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 space-y-2">
            {navItems.map((item) => (
              <div key={item.href} className="relative">
                <Link
                  href={item.disabled ? "#" : item.href}
                  className={`block px-3 py-2 rounded-md ${
                    pathname === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-400 hover:text-yellow-300"
                  } ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={(e) => item.disabled && e.preventDefault()}
                >
                  <span className="mr-2">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.tooltip && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({item.tooltip})
                    </span>
                  )}
                </Link>
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
