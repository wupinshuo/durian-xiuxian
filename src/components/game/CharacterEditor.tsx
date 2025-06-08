"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useGameData } from "@/store/GameDataContext";
import { FaEdit, FaSave, FaTimes, FaUndo, FaCheck } from "react-icons/fa";

// 可用头像列表
const AVAILABLE_AVATARS = [
  "/avatars/default.png",
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
];

export default function CharacterEditor() {
  const { character, updateCharacterInfo } = useGameData();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(character.name);
  const [selectedAvatar, setSelectedAvatar] = useState(
    character.avatar || "/avatars/default.png"
  );
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [originalName, setOriginalName] = useState(character.name);
  const [originalAvatar, setOriginalAvatar] = useState(
    character.avatar || "/avatars/default.png"
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [previewChangesMade, setPreviewChangesMade] = useState(false);

  // 当角色信息变更时，更新编辑状态
  useEffect(() => {
    setEditName(character.name);
    setSelectedAvatar(character.avatar || "/avatars/default.png");
    setOriginalName(character.name);
    setOriginalAvatar(character.avatar || "/avatars/default.png");
  }, [character]);

  // 保存修改
  const handleSave = () => {
    if (editName.trim() !== "") {
      updateCharacterInfo({
        ...character,
        name: editName.trim(),
        avatar: selectedAvatar,
      });
      setIsEditing(false);
      setShowAvatarSelector(false);
      setPreviewMode(false);
      setPreviewChangesMade(false);
    }
  };

  // 取消修改
  const handleCancel = () => {
    setEditName(originalName);
    setSelectedAvatar(originalAvatar);
    setIsEditing(false);
    setShowAvatarSelector(false);
    setPreviewMode(false);
    setPreviewChangesMade(false);
  };

  // 选择头像
  const handleSelectAvatar = (avatarPath: string) => {
    setSelectedAvatar(avatarPath);
    setPreviewChangesMade(originalAvatar !== avatarPath);
    // 预览模式下不自动关闭选择器
    if (!previewMode) {
      setShowAvatarSelector(false);
    }
  };

  // 切换预览模式
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  // 恢复原始设置
  const restoreOriginal = () => {
    setEditName(originalName);
    setSelectedAvatar(originalAvatar);
    setPreviewChangesMade(false);
  };

  // 处理名称变更
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
    setPreviewChangesMade(
      originalName !== e.target.value || originalAvatar !== selectedAvatar
    );
  };

  return (
    <div className="relative">
      {/* 头像和编辑按钮 */}
      <div className="flex items-center mb-4">
        <div className="relative">
          <div
            className={`relative w-16 h-16 ${
              isEditing ? "cursor-pointer group" : ""
            }`}
            onClick={() =>
              isEditing && setShowAvatarSelector(!showAvatarSelector)
            }
          >
            <Image
              src={selectedAvatar}
              alt="角色头像"
              fill
              className={`rounded-full object-cover border-2 ${
                isEditing
                  ? "border-blue-500 ring-2 ring-blue-300 ring-opacity-50"
                  : "border-gray-700"
              } transition-all duration-300`}
            />
            {isEditing && (
              <>
                <div className="absolute bottom-0 right-0 bg-blue-500 bg-opacity-90 p-1 rounded-full w-6 h-6 flex items-center justify-center">
                  <FaEdit className="text-white text-xs" />
                </div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  点击修改头像
                </div>
              </>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></div>
        </div>

        <div className="ml-4">
          {isEditing ? (
            <div className="mb-2">
              <input
                type="text"
                value={editName}
                onChange={handleNameChange}
                className="bg-gray-700 border border-gray-600 text-xl font-bold rounded px-2 py-1 mb-1 w-full"
                maxLength={12}
                autoFocus
              />
              {previewMode && previewChangesMade && (
                <div className="text-xs text-blue-400 mt-1 flex items-center">
                  <span>实时预览中</span>
                  <button
                    onClick={restoreOriginal}
                    className="ml-2 text-yellow-400 hover:text-yellow-300 flex items-center"
                  >
                    <FaUndo className="mr-1" size={10} />
                    <span>恢复原始设置</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <h3 className="text-xl font-bold">玩家名号: {character.name}</h3>
          )}

          <div className="flex items-center">
            <span className="text-yellow-400 mr-2">
              境界: {character.realm}
              {character.realmLevel}层
            </span>
          </div>
        </div>

        {/* 编辑/保存按钮 */}
        <div className="ml-auto">
          {isEditing ? (
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded group relative"
                >
                  <FaSave />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    保存修改
                  </span>
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded group relative"
                >
                  <FaTimes />
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    取消修改
                  </span>
                </button>
              </div>
              <label className="flex items-center text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={previewMode}
                  onChange={togglePreviewMode}
                  className="mr-1"
                />
                实时预览
              </label>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsEditing(true);
                // 确保使用当前头像
                setSelectedAvatar(character.avatar || "/avatars/default.png");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center"
            >
              <FaEdit className="mr-1" />
              <span>修改</span>
            </button>
          )}
        </div>
      </div>

      {/* 头像选择器弹出框 */}
      {isEditing && showAvatarSelector && (
        <div className="absolute top-20 left-0 z-10 bg-gray-800 border border-gray-700 rounded-md p-3 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-bold text-gray-300">选择头像</h4>
            {previewMode && (
              <button
                onClick={() => setShowAvatarSelector(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* 当前选中的头像预览 */}
          <div className="mb-3 flex justify-center">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500">
              <Image
                src={selectedAvatar}
                alt="当前选择的头像"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {AVAILABLE_AVATARS.map((avatar, index) => (
              <div
                key={index}
                className={`relative w-16 h-16 cursor-pointer rounded-full overflow-hidden border-2 ${
                  selectedAvatar === avatar
                    ? "border-blue-500 scale-110"
                    : "border-transparent"
                } hover:border-blue-400 transition-all duration-200`}
                onClick={() => handleSelectAvatar(avatar)}
              >
                <Image
                  src={avatar}
                  alt={`头像${index + 1}`}
                  fill
                  className="object-cover"
                />
                {selectedAvatar === avatar && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                    <div className="bg-blue-500 text-white rounded-full p-1">
                      <FaCheck size={10} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
