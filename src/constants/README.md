# 常量定义目录

本目录包含榴莲修仙项目的全局常量定义，按功能模块分类存放。

## 文件说明

- `cultivation.ts`: 修炼相关常量，包括境界、灵根等
- `game.ts`: 游戏核心常量，包括默认设置等
- `text.ts`: 文本常量，包括提示信息等
- `index.ts`: 导出所有常量的索引文件

## 常量设计原则

1. 常量名称使用UPPER_SNAKE_CASE命名
2. 枚举类型使用PascalCase命名
3. 相关常量应该放在同一文件中
4. 所有常量应该有中文注释说明其用途
5. 避免硬编码，将所有魔法数字和字符串定义为常量

## 使用示例

```tsx
import { CultivationRealm, MAX_REALM_PROGRESS } from '@/constants';

function Character() {
  return (
    <div>
      <h2>当前境界: {CultivationRealm.QiRefining}</h2>
      <div>修为上限: {MAX_REALM_PROGRESS}</div>
    </div>
  );
}
```