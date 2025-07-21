# 榴莲修仙项目开发规范

## 项目概述
榴莲修仙是一款基于Next.js的网页修仙模拟游戏，采用TypeScript + React + Tailwind CSS技术栈。

## 核心技术
- React：函数式组件、hooks和context API
- TypeScript：最新稳定版本，严格类型检查
- shadcn/ui：用于构建响应式和无障碍界面的现代UI组件
- Tailwind CSS：实用优先的CSS框架，用于快速样式设计
- Next.js App Router：用于可扩展应用的服务器端渲染和路由
- Node.js：服务器端逻辑的后端运行环境
- 使用pnpm作为包管理工具

## 项目结构
- `/src`: 所有源代码
  - `/app`: Next.js App Router 路由和页面
    - `layout.tsx`: 应用的主布局
    - `page.tsx`: 主页面
    - `globals.css`: 全局CSS样式
    - `/(auth)`: 授权相关路由
    - `/(game)`: 游戏相关路由
  - `/components`: 可复用的React组件
    - `/game`: 游戏相关组件
    - `/ui`: 通用UI组件（按钮、表单等）
    - `/layout`: 布局相关组件
    - `/shared`: 共享组件
  - `/lib`: 工具函数和库
    - `/service-handle`: 计算相关逻辑（或后端服务）
    - `/data`: 静态数据和配置
  - `/store`: 状态管理
    - `GameDataContext.tsx`: 游戏数据上下文
  - `/types`: 全局类型定义
  - `/constants`: 全局常量
  - `/tools`: 通用工具类函数
- `/public`: 静态资源
- `/.github`: GitHub配置
- `/.vscode`: VSCode配置
- `/node_modules`: 依赖包（不提交到Git）

## 代码规范

### 代码风格和结构
- 仅使用函数式组件和hooks
- 变量和函数遵循camelCase命名，组件使用PascalCase命名
- 优先使用const而非let进行变量声明
- 编写模块化和可重用代码，明确关注点分离
- 百分百的显示最多保留一位小数，如 82.3%

### 命名规范
- 文件名：使用kebab-case（如：character-card.tsx）
- 组件名：使用PascalCase（如：CharacterCard）
- 变量/函数名：使用camelCase（如：getCurrentLevel）
- 常量：使用UPPER_SNAKE_CASE（如：MAX_CULTIVATION_LEVEL）
- 类型/接口：使用PascalCase，接口以I开头（如：ICharacter）

### 文件组织
- 组件文件必须包含对应的类型定义
- 每个组件目录包含index.ts导出文件
- 工具函数按功能分类存放在src/tools目录
- 类型定义统一存放在src/types目录
- 常量定义统一存放在src/constants目录

### TypeScript使用
- 始终使用严格类型检查
- 为所有props和state定义接口和类型
- 在适用情况下使用泛型实现可重用逻辑
- 尽量避免使用any类型；始终明确指定类型

### 代码质量
- 所有函数必须有TypeScript类型注解
- 复杂逻辑必须添加中文注释
- 公共API函数必须有JSDoc文档
- 组件Props必须定义接口类型
- 避免使用any类型，使用具体类型或泛型

### UI和样式
- 使用shadcn/ui组件实现一致且现代的UI
- 应用Tailwind CSS工具类实现响应式设计
- 确保所有组件符合无障碍访问（a11y）标准
- 使用Tailwind内置工具实现深色模式支持

### 性能优化
- 为纯函数组件使用React.memo
- 为路由组件实现懒加载
- 优化useEffect依赖项，防止不必要的重新渲染
- 通过tree-shaking和代码分割最小化包体积
- 合理使用useMemo和useCallback
- 图片资源使用Next.js Image组件

### Git提交规范
遵循Conventional Commits规范：
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建工具或辅助工具的变动

### 代码注释和文档
- 复杂逻辑、关键代码需有中文注释，描述意图和实现思路
- 公共方法、API 函数需写 JSDoc 注释
- 在每个目录中包含一个带有清晰指示的README.md文件
- 提供README的英文和中文版本
- 所有文档文件使用Markdown格式

### 其他规则
- 不要懒惰：为所有请求的功能编写完整且功能性的代码
- 为所有函数和组件提供JSDoc注释
- 为所有组件包含PropTypes验证
- 实现全局错误边界进行错误处理
- 为异步操作使用try/catch块
