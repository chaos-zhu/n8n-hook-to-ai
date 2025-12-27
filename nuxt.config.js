// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // 使用根目录作为源目录（兼容 Nuxt 3 项目结构）
  srcDir: '.',

  // 关闭SSR，使用SPA模式
  ssr: false,

  // 模块配置
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  // Tailwind CSS配置
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js'
  },

  // 运行时配置
  runtimeConfig: {
    // 服务端私有配置
    jwtSecret: process.env.JWT_SECRET || 'n8n-hook-to-ai-api-secret-key-2024',
    // 公开配置（客户端可访问）
    public: {
      apiBase: '/api'
    }
  },

  // 应用配置
  app: {
    head: {
      title: 'n8n Hook to AI API',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Convert n8n webhook to OpenAI compatible API' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  }
})
