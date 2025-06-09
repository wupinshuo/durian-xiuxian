"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
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
  FaRedo,
  FaCog,
  FaDownload,
  FaUpload,
  FaCheck,
  FaRedoAlt,
} from "react-icons/fa";
import { useGameData } from "@/store/GameDataContext";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  tooltip?: string;
}

// 加密密钥 - 固定值，用于简单加密
const ENCRYPTION_KEY = "durian-xiuxian-game-save";

// 简单的加密函数 - XOR加密
const encryptData = (data: string): string => {
  // 将密钥转换为UTF-8字节数组
  const textEncoder = new TextEncoder();
  const keyBytes = textEncoder.encode(ENCRYPTION_KEY);
  const dataBytes = textEncoder.encode(data);

  // 加密操作 - 简单的XOR加密
  const encryptedBytes = new Uint8Array(dataBytes.length);
  for (let i = 0; i < dataBytes.length; i++) {
    encryptedBytes[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length];
  }

  // 转换为Base64编码
  return btoa(String.fromCharCode(...encryptedBytes));
};

// 简单的解密函数 - XOR解密
const decryptData = (encryptedData: string): string => {
  try {
    // 从Base64解码
    const encryptedBytes = new Uint8Array(
      atob(encryptedData)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    // 将密钥转换为UTF-8字节数组
    const textEncoder = new TextEncoder();
    const keyBytes = textEncoder.encode(ENCRYPTION_KEY);

    // 解密操作 - 简单的XOR解密
    const decryptedBytes = new Uint8Array(encryptedBytes.length);
    for (let i = 0; i < encryptedBytes.length; i++) {
      decryptedBytes[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    // 转换为字符串
    const textDecoder = new TextDecoder();
    return textDecoder.decode(decryptedBytes);
  } catch (error) {
    throw new Error("解密失败，文件可能已损坏");
  }
};

export default function GameNavbar() {
  const {
    spiritualStones,
    spiritGems,
    character,
    resetData,
    updateCharacterInfo,
  } = useGameData();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRebirthModalOpen, setIsRebirthModalOpen] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showImportMessage, setShowImportMessage] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    message: string;
  }>({ success: true, message: "" });
  const settingsMenuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭设置菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showSettingsMenu &&
        settingsMenuRef.current &&
        !settingsMenuRef.current.contains(event.target as Node)
      ) {
        setShowSettingsMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSettingsMenu]);

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

  // 处理重生确认
  const handleRebirth = () => {
    resetData();
    setIsRebirthModalOpen(false);

    // 显示成功消息
    setImportStatus({
      success: true,
      message: "重生成功！",
    });
    setShowImportMessage(true);

    // 3秒后隐藏消息
    setTimeout(() => {
      setShowImportMessage(false);
    }, 3000);
  };

  // 导出角色数据（道统传承）
  const handleExportData = () => {
    try {
      // 创建一个包含时间戳的文件名，确保文件名唯一
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `${character.name || "character"}-${timestamp}.json`;

      // 将角色数据转换为JSON字符串
      const characterData = JSON.stringify(character, null, 2);

      // 加密数据
      const encryptedData = encryptData(characterData);

      // 创建标准JSON格式的包装结构
      const jsonWrapper = {
        format: "durian-xiuxian-save",
        version: "1.0",
        timestamp: new Date().toISOString(),
        encrypted: true,
        data: encryptedData,
      };

      // 创建一个Blob对象，内容为标准JSON
      const blob = new Blob([JSON.stringify(jsonWrapper, null, 2)], {
        type: "application/json",
      });

      // 创建一个下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      // 触发下载
      document.body.appendChild(link);
      link.click();

      // 清理
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // 显示成功消息
      setImportStatus({
        success: true,
        message: "道统传承成功！",
      });
      setShowImportMessage(true);

      // 3秒后隐藏消息
      setTimeout(() => {
        setShowImportMessage(false);
      }, 3000);

      // 关闭设置菜单
      setShowSettingsMenu(false);
    } catch (error) {
      console.error("导出失败:", error);
      setImportStatus({
        success: false,
        message: `传承失败: ${
          error instanceof Error ? error.message : "未知错误"
        }`,
      });
      setShowImportMessage(true);

      // 3秒后隐藏错误消息
      setTimeout(() => {
        setShowImportMessage(false);
      }, 3000);
    }
  };

  // 导入角色数据（转世夺舍）
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // 安全获取文件
      const file = event.target?.files?.[0];
      if (!file) return;

      // 创建并配置FileReader
      const reader = new FileReader();

      // 设置错误处理
      reader.onerror = (error) => {
        console.error("读取文件错误:", error);
        setImportStatus({
          success: false,
          message: "读取文件时发生错误",
        });
        setShowImportMessage(true);
        setTimeout(() => {
          setShowImportMessage(false);
        }, 3000);
      };

      // 设置成功处理
      reader.onload = (e) => {
        try {
          if (typeof e.target?.result !== "string") {
            throw new Error("无法读取文件内容");
          }

          // 读取文件内容
          const fileContent = e.target.result;
          let characterData;

          try {
            // 尝试解析为JSON
            const parsedContent = JSON.parse(fileContent);

            // 检查是否是我们的包装格式
            if (
              parsedContent.format === "durian-xiuxian-save" &&
              parsedContent.encrypted &&
              parsedContent.data
            ) {
              // 解密数据
              const decryptedData = decryptData(parsedContent.data);
              // 解析解密后的JSON
              characterData = JSON.parse(decryptedData);
            }
            // 检查是否是直接的角色数据
            else if (
              typeof parsedContent === "object" &&
              parsedContent.name &&
              parsedContent.realm
            ) {
              // 直接使用解析后的数据
              characterData = parsedContent;
            }
            // 尝试作为直接加密的字符串处理
            else {
              try {
                const decryptedData = decryptData(fileContent);
                characterData = JSON.parse(decryptedData);
              } catch (decryptError) {
                console.error("无法识别的文件格式");
                throw new Error("无法识别的文件格式");
              }
            }
          } catch (jsonError) {
            console.error("JSON解析失败");
            throw new Error("文件格式不正确");
          }

          // 验证导入的数据结构是否合法
          if (!characterData || typeof characterData !== "object") {
            throw new Error("道法残缺，无法夺舍");
          }

          // 可以添加更多验证逻辑，确保关键字段存在
          if (!characterData.name || !characterData.realm) {
            throw new Error("道法残缺，无法夺舍");
          }

          // 更新角色信息
          const updatedCharacter = {
            ...character,
            ...characterData,
          };

          updateCharacterInfo(updatedCharacter);

          // 显示成功消息
          setImportStatus({
            success: true,
            message: "夺舍成功！",
          });
          setShowImportMessage(true);

          // 3秒后隐藏消息
          setTimeout(() => {
            setShowImportMessage(false);
          }, 3000);

          // 延迟刷新页面，确保数据已保存
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } catch (error) {
          console.error("导入数据失败:", error);
          setImportStatus({
            success: false,
            message: `夺舍失败: ${
              error instanceof Error ? error.message : "未知错误"
            }`,
          });
          setShowImportMessage(true);

          // 3秒后隐藏错误消息
          setTimeout(() => {
            setShowImportMessage(false);
          }, 3000);
        }
      };

      // 开始读取文件
      reader.readAsText(file);

      // 重置文件输入，以便再次选择同一个文件
      if (event.target) {
        event.target.value = "";
      }
    } catch (mainError) {
      console.error("处理错误:", mainError);
      setImportStatus({
        success: false,
        message: `处理错误: ${
          mainError instanceof Error ? mainError.message : "未知错误"
        }`,
      });
      setShowImportMessage(true);
      setTimeout(() => {
        setShowImportMessage(false);
      }, 3000);
    }
  };

  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/game" className="flex items-center mr-8">
              <div className="flex-shrink-0 w-10 h-10 mr-3 flex items-center">
                <Image
                  src="/durian_logo.svg"
                  alt="榴莲修仙"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-blue-400">
                  榴莲修仙
                </span>
                <span className="text-xs text-gray-400">踏上修真之路</span>
              </div>
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

            {/* 设置按钮 - 替代原有的重生按钮 */}
            <div className="relative" ref={settingsMenuRef}>
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="text-gray-400 hover:text-white flex items-center"
                title="修道设置"
              >
                <FaCog
                  className={`transition-transform duration-300 ${
                    showSettingsMenu ? "rotate-90" : ""
                  }`}
                />
              </button>

              {/* 设置下拉菜单 */}
              {showSettingsMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 border border-gray-700 z-50">
                  <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                    修道设置
                  </div>
                  <button
                    onClick={() => {
                      setIsRebirthModalOpen(true);
                      setShowSettingsMenu(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <FaRedoAlt className="mr-2 text-red-400" />
                    <span>涅槃重生</span>
                  </button>
                  <button
                    onClick={handleExportData}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <FaDownload className="mr-2 text-yellow-400" />
                    <span>道统传承</span>
                  </button>
                  <button
                    onClick={() => {
                      // 使用与测试按钮相同的方法
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = ".json";
                      input.onchange = (e) => {
                        try {
                          // @ts-ignore
                          handleImportData(e);
                        } catch (error) {
                          console.error("导入处理错误:", error);
                        }
                      };
                      // 直接添加到DOM并触发点击
                      document.body.appendChild(input);
                      input.click();
                      // 点击后移除
                      setTimeout(() => {
                        document.body.removeChild(input);
                      }, 1000);

                      setShowSettingsMenu(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <FaUpload className="mr-2 text-blue-400" />
                    <span>转世夺舍</span>
                  </button>
                </div>
              )}
            </div>

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

      {/* 重生确认模态框 */}
      {isRebirthModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-red-400 mb-4">确认重生</h2>
            <p className="mb-6">
              重生将会清除你的所有进度，包括修为、功法、物品等，回到最初状态。此操作不可撤销，确定要重生吗？
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsRebirthModalOpen(false)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                取消
              </button>
              <button
                onClick={handleRebirth}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                确认重生
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 导入/导出结果消息 */}
      {showImportMessage && (
        <div
          className={`fixed bottom-4 right-4 p-3 rounded-md shadow-lg ${
            importStatus.success ? "bg-green-600" : "bg-red-600"
          } text-white z-50 transition-all duration-300 transform translate-y-0 opacity-100`}
        >
          <div className="flex items-center">
            {importStatus.success ? (
              <FaCheck className="mr-2" />
            ) : (
              <FaTimes className="mr-2" />
            )}
            <span>{importStatus.message}</span>
          </div>
        </div>
      )}
    </header>
  );
}
