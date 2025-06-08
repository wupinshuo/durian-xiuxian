# 常量管理

本目录包含榴莲修仙项目中所有全局常量定义。按功能模块进行了分类，便于管理和引用。

## 目录结构

- `cultivation.ts`: 修炼相关常量，包括境界、灵根、道行等
- `events.ts`: 游戏事件相关常量，包括事件类型等
- `game.ts`: 游戏核心常量，包括游戏设置、角色默认值等
- `items.ts`: 物品相关常量，包括物品类型、品级等
- `skills.ts`: 技能和功法相关常量，包括功法类型、品级等
- `text.ts`: 游戏文本相关常量，包括提示文案等
- `index.ts`: 导出所有常量的索引文件

## 使用方式

推荐使用索引文件统一导入常量：

```typescript
import { CultivationRealm, ItemType, MAX_REALM_PROGRESS } from '@/constants';
```

也可以从特定文件导入常量：

```typescript
import { CultivationRealm } from '@/constants/cultivation';
```

## 常量设计原则

1. 所有常量使用大写蛇形命名（如 `MAX_REALM_PROGRESS`）
2. 枚举使用 PascalCase 命名
3. 相关常量应分组在对象中（如 `DEFAULT_CHARACTER`）
4. 所有常量必须添加适当的中文注释

## 维护指南

1. 添加新常量时，应放入合适的分类文件中
2. 若现有分类不适合，可创建新的分类文件
3. 确保在 `index.ts` 中导出新添加的常量
4. 不要在组件或服务中定义硬编码常量，统一在此目录管理 