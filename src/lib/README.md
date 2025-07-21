# 工具库目录

本目录包含榴莲修仙项目的工具函数和服务类，用于处理游戏核心逻辑和数据操作。

## 目录结构

- `service-handle/`: 服务处理类，包括游戏数据服务等
- `utils.ts`: 通用工具函数

## 设计原则

1. 工具函数应该是纯函数，没有副作用
2. 服务类应该有明确的职责和接口
3. 所有函数和方法必须有TypeScript类型注解
4. 复杂逻辑必须添加中文注释
5. 公共API必须有JSDoc文档

## 使用示例

```tsx
// 使用工具函数
import { cn } from '@/lib/utils';

const className = cn('base-class', condition && 'conditional-class');

// 使用服务
import { gameDataService } from '@/lib/service-handle/game-data-service';

const playerData = gameDataService.getPlayerData();
```