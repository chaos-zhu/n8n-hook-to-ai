# n8n Hook to AI API

将 n8n Webhook 转换为 OpenAI 兼容的 API 接口，让你可以在任何支持 OpenAI API 的应用中使用 n8n 工作流。

## 功能特性

- 🔗 **Webhook 转换** - 将 n8n Webhook 转换为 OpenAI 兼容的 Chat Completions API
- 🔑 **API Key 管理** - 支持创建和管理多个 API Key
- 📊 **调用日志** - 记录所有 API 调用，方便调试和监控
- 🎨 **现代化界面** - 基于 Tailwind CSS 的响应式管理界面
- 🌙 **深色模式** - 支持明暗主题切换
- 🐳 **Docker 支持** - 提供 Docker 镜像，一键部署

## 快速开始

### Docker Compose 部署（推荐）

```bash
# 下载 docker-compose.yml
wget https://raw.githubusercontent.com/chaos-zhu/n8n-hook-to-ai-api/main/docker-compose.yml

# 启动服务
docker-compose up -d
```

### Docker 部署

```bash
docker run -d \
  --name n8n-hook-to-ai-api \
  -p 3000:3000 \
  -v ./data:/app/data \
  ghcr.io/chaos-zhu/n8n-hook-to-ai-api:latest
```

### 本地开发

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn dev

# 构建生产版本
yarn build

# 预览生产版本
yarn preview
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `PORT` | 服务端口 | `3000` |
| `HOST` | 监听地址 | `0.0.0.0` |
| `JWT_SECRET` | JWT 密钥 | 随机生成 |

## API 使用

### 获取模型列表

```bash
curl http://localhost:3000/api/v1/models \
  -H "Authorization: Bearer your-api-key"
```

### Chat Completions

```bash
curl http://localhost:3000/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "model": "your-hook-name",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

## 项目结构

```
├── components/          # Vue 组件
│   ├── layout/         # 布局组件
│   └── ui/             # UI 组件
├── composables/        # 组合式函数
├── layouts/            # 页面布局
├── pages/              # 页面
├── public/             # 静态资源
├── server/             # 服务端代码
│   ├── api/           # API 路由
│   ├── middleware/    # 中间件
│   ├── plugins/       # 插件
│   └── utils/         # 工具函数
├── Dockerfile          # Docker 构建文件
└── nuxt.config.js      # Nuxt 配置
```

## 技术栈

- **前端**: Nuxt 3, Vue 3, Tailwind CSS
- **后端**: Nitro (Nuxt Server)
- **数据库**: NeDB (嵌入式数据库)
- **认证**: JWT

## License

MIT
