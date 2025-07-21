# 工具函数目录

本目录包含榴莲修仙项目的通用工具函数，按功能分类存放。

## 设计原则

1. 工具函数应该是纯函数，没有副作用
2. 每个工具函数应该专注于单一功能
3. 所有函数必须有TypeScript类型注解
4. 复杂逻辑必须添加中文注释
5. 公共API必须有JSDoc文档

## 使用示例

```tsx
import { uuidTool } from '@/tools/uuid';
import { encryptTool } from '@/tools/encrypt';

// 生成UUID
const id = uuidTool.generateUUID();

// 加密数据
const encryptedData = encryptTool.encryptData(data);
```