# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 启用 corepack 以使用 yarn
RUN corepack enable

# 复制 package.json 和 yarn.lock
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN yarn build

# 生产阶段
FROM node:20-alpine AS runner

WORKDIR /app

# 复制构建产物
COPY --from=builder /app/.output ./.output

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# 启动应用
CMD ["node", ".output/server/index.mjs"]