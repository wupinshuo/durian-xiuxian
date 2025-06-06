# 依赖安装阶段
FROM node:20-alpine AS deps

WORKDIR /app

# 设置npm镜像源
RUN npm config set registry https://registry.npmmirror.com

# 安装 pnpm
RUN npm install -g pnpm@9.15.1 --force && pnpm config set registry https://registry.npmmirror.com

# 只复制用于安装的必要文件
COPY package.json pnpm-lock.yaml .npmrc ./

RUN pnpm install

# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 设置环境变量
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# 先复制 node_modules
COPY --from=deps /app/node_modules ./node_modules

# 再复制其他源码
COPY . .

# 安装 pnpm
RUN npm install -g pnpm@9.15.1 --force && pnpm config set registry https://registry.npmmirror.com

# 构建应用
RUN pnpm build

# 运行阶段
FROM node:20-alpine AS runner

WORKDIR /app

# 设置环境变量
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3001

# 从builder阶段复制构建后的产物
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3001

# 启动应用
CMD ["node", "server.js"]

