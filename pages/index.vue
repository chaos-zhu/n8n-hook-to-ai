<template>
  <div class="space-y-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Hook数量 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Hook 总数</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalHooks }}</p>
          </div>
        </div>
      </div>

      <!-- 启用的Hook -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">已启用</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.enabledHooks }}</p>
          </div>
        </div>
      </div>

      <!-- API Key数量 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">API Key</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalKeys }}</p>
          </div>
        </div>
      </div>

      <!-- 今日调用 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">今日调用</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.todayCalls }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 快速入门 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">快速入门</h2>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-bold text-primary-600 dark:text-primary-400">1</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">添加 n8n Hook</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">在 Hook 管理页面添加你的 n8n Webhook URL</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-bold text-primary-600 dark:text-primary-400">2</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">生成 API Key</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">在 API Key 页面生成访问密钥</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-bold text-primary-600 dark:text-primary-400">3</span>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">调用 API</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">使用 OpenAI 兼容的 API 格式进行调用</p>
            </div>
          </div>
        </div>
      </div>

      <!-- API 端点 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">API 端点</h2>
        </div>
        <div class="p-6 space-y-4">
          <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">GET</span>
              <button @click="copyToClipboard('/api/v1/models')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <code class="text-sm text-gray-700 dark:text-gray-300">/api/v1/models</code>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">获取可用模型列表</p>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">POST</span>
              <button @click="copyToClipboard('/api/v1/chat/completions')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <code class="text-sm text-gray-700 dark:text-gray-300">/api/v1/chat/completions</code>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">对话补全接口（支持流式）</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近日志 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">最近调用</h2>
        <NuxtLink to="/logs" class="text-sm text-primary-600 dark:text-primary-400 hover:underline">
          查看全部
        </NuxtLink>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">时间</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">模型</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">耗时</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="log in recentLogs" :key="log._id" class="hover:bg-gray-50 dark:hover:bg-gray-900/50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime(log.timestamp) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ log.model }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    log.status === 'success'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  ]"
                >
                  {{ log.status === 'success' ? '成功' : '失败' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ log.duration }}ms
              </td>
            </tr>
            <tr v-if="recentLogs.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                暂无调用记录
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const { authFetch } = useAuth()
const toast = useToast()

const stats = reactive({
  totalHooks: 0,
  enabledHooks: 0,
  totalKeys: 0,
  todayCalls: 0
})

const recentLogs = ref([])

// 加载统计数据
const loadStats = async () => {
  try {
    // 获取Hook统计
    const hooksRes = await authFetch('/api/hooks')
    if (hooksRes.success) {
      stats.totalHooks = hooksRes.data.length
      stats.enabledHooks = hooksRes.data.filter(h => h.enabled).length
    }

    // 获取Key统计
    const keysRes = await authFetch('/api/keys')
    if (keysRes.success) {
      stats.totalKeys = keysRes.data.length
    }

    // 获取今日调用统计
    const logsRes = await authFetch('/api/logs?limit=500')
    if (logsRes.success) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      stats.todayCalls = logsRes.data.logs.filter(log => new Date(log.timestamp) >= today).length
      recentLogs.value = logsRes.data.logs.slice(0, 5)
    }
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(window.location.origin + text)
    toast.success('已复制到剪贴板')
  } catch (error) {
    toast.error('复制失败')
  }
}

onMounted(() => {
  loadStats()
})
</script>