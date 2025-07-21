# 组件目录

本目录包含榴莲修仙项目的所有React组件，按功能分类存放。

## 目录结构

- `game/`: 游戏核心组件，包括角色面板、修炼界面等
- `layout/`: 布局相关组件，包括页面布局、导航栏等
- `ui/`: 基础UI组件，如按钮、输入框等

## 组件设计原则

1. 组件文件名使用kebab-case命名
2. 组件本身使用PascalCase命名
3. 每个组件目录包含index.ts导出文件
4. 组件Props必须定义接口类型，并以I开头
5. 复杂组件应拆分为更小的子组件

## 使用示例

```tsx
import { CharacterCard, CultivationPanel } from '@/components/game';
import { Button } from '@/components/ui';

function GamePage() {
  return (
    <div>
      <CharacterCard />
      <CultivationPanel />
      <Button>开始修炼</Button>
    </div>
  );
}
```