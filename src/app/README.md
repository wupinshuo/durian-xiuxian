# 应用路由目录

本目录包含榴莲修仙项目的Next.js App Router路由和页面组件。

## 目录结构

- `layout.tsx`: 应用的主布局
- `page.tsx`: 主页面
- `globals.css`: 全局CSS样式
- `/(auth)`: 授权相关路由
- `/(game)`: 游戏相关路由

## 路由设计原则

1. 使用App Router的文件系统路由
2. 使用路由组来组织相关路由
3. 页面组件应该专注于数据获取和布局
4. 复杂UI逻辑应该封装在组件中
5. 使用服务器组件和客户端组件的合理分离

## 使用示例

```tsx
// app/page.tsx
import { GameNavbar } from '@/components/game';

export default function HomePage() {
  return (
    <main>
      <GameNavbar />
      <h1>榴莲修仙</h1>
      {/* 页面内容 */}
    </main>
  );
}
```