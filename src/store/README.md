# 状态管理目录

本目录包含榴莲修仙项目的状态管理相关文件，使用React Context API实现全局状态管理。

## 文件说明

- `GameDataContext.tsx`: 游戏数据上下文，管理角色、技能、物品等游戏核心数据

## 设计原则

1. 状态管理应该分层，避免单一上下文过于庞大
2. 上下文应该提供清晰的API和类型定义
3. 状态更新应该是不可变的（immutable）
4. 复杂逻辑应该封装在服务层，而非直接在上下文中实现
5. 上下文应该处理数据的持久化和同步

## 使用示例

```tsx
import { useGameData } from '@/store/GameDataContext';

function MyComponent() {
  const { character, addRealmProgress } = useGameData();
  
  const handleCultivate = () => {
    addRealmProgress(5);
  };
  
  return (
    <div>
      <h2>修为: {character.realmProgress}%</h2>
      <button onClick={handleCultivate}>修炼</button>
    </div>
  );
}
```