# 自定义钩子目录

本目录包含榴莲修仙项目的所有自定义React钩子（Custom Hooks），用于提取和复用组件逻辑。

## 钩子设计原则

1. 钩子名称必须以`use`开头，如`useCultivation`
2. 钩子应该专注于单一功能，遵循单一职责原则
3. 钩子应该有完整的TypeScript类型注解
4. 复杂逻辑必须添加中文注释
5. 公共钩子必须有JSDoc文档

## 目前实现的钩子

- `useCultivation`: 处理修炼相关逻辑
- `useGameEvents`: 处理游戏事件相关逻辑

## 使用示例

```tsx
import { useCultivation } from '@/hooks/use-cultivation';

function CultivationPanel() {
  const {
    isCultivating,
    localRealmProgress,
    cultivationStatus,
    statusType,
    startCultivation,
    stopCultivation
  } = useCultivation();
  
  // 组件逻辑...
  
  return (
    <div>
      {/* 组件UI... */}
    </div>
  );
}
```