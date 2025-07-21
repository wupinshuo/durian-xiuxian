# UI组件库

本目录包含榴莲修仙项目的基础UI组件，这些组件是构建游戏界面的基础元素。

## 组件列表

- `Button`: 按钮组件，支持多种样式变体和尺寸
- `ErrorBoundary`: 错误边界组件，用于捕获和处理组件错误

## 设计原则

1. 组件应该是可复用的，并且具有良好的类型定义
2. 使用Tailwind CSS进行样式设计，确保一致的视觉风格
3. 支持自定义样式和变体
4. 遵循无障碍设计原则，确保键盘可访问性
5. 组件应该有合理的默认值，减少使用时的配置

## 使用示例

```tsx
import { Button, ErrorBoundary } from '@/components/ui';

function MyComponent() {
  return (
    <ErrorBoundary>
      <div>
        <Button>默认按钮</Button>
        <Button variant="destructive" size="sm">小型危险按钮</Button>
        <Button variant="outline" size="lg">大型轮廓按钮</Button>
      </div>
    </ErrorBoundary>
  );
}
```