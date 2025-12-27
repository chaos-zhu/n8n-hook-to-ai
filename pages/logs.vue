<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">调用日志</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">查看 API 调用记录（最多保留 500 条）</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- 状态筛选 -->
        <select
          v-model="filters.status"
          class="input-field text-sm py-2"
          @change="loadLogs"
        >
          <option value="">全部状态</option>
          <option value="success">成功</option>
          <option value="failed">失败</option>
        </select>
        <!-- 刷新按钮 -->
        <button
          @click="loadLogs"
          class="btn-secondary inline-flex items-center gap-2 whitespace-nowrap"
          :disabled="loading"
        >
          <svg
            :class="['w-4 h-4 flex-shrink-0', loading ? 'animate-spin' : '']"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>刷新</span>
        </button>
      </div>
    </div>

    <!-- 日志列表 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">时间</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">模型</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">请求内容</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">耗时</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="log in logs" :key="log._id" class="hover:bg-gray-50 dark:hover:bg-gray-900/50">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(log.timestamp) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <code class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300">{{ log.ip || '-' }}</code>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ log.model }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="max-w-xs">
                  <span class="text-sm text-gray-500 dark:text-gray-400 truncate block" :title="log.request">
                    {{ truncateText(log.request, 50) }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
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
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ log.duration }}ms
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right">
                <button
                  @click="viewDetail(log)"
                  class="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="查看详情"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="logs.length === 0 && !loading">
              <td colspan="7" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center">
                  <svg class="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-gray-500 dark:text-gray-400">暂无调用日志</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div v-if="total > pageSize" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          共 {{ total }} 条记录
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ currentPage }} / {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage >= totalPages"
            class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- 详情模态框 -->
    <UiModal v-model="showDetailModal" title="日志详情" size="lg">
      <div v-if="selectedLog" class="space-y-4">
        <!-- 基本信息 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">调用时间</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(selectedLog.timestamp) }}</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">调用IP</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ selectedLog.ip || '-' }}</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">模型</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ selectedLog.model }}</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">状态</label>
            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                selectedLog.status === 'success'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              ]"
            >
              {{ selectedLog.status === 'success' ? '成功' : '失败' }}
            </span>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">耗时</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ selectedLog.duration }}ms</p>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">API Key</label>
            <p class="text-sm text-gray-900 dark:text-white">{{ selectedLog.apiKeyId ? `...${selectedLog.apiKeyId.slice(-8)}` : '-' }}</p>
          </div>
        </div>

        <!-- 请求内容 -->
        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">请求内容</label>
          <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-40 overflow-y-auto">
            <pre class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">{{ selectedLog.request || '-' }}</pre>
          </div>
        </div>

        <!-- 响应内容 -->
        <div>
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">响应内容</label>
          <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-40 overflow-y-auto">
            <pre class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">{{ selectedLog.response || '-' }}</pre>
          </div>
        </div>

        <!-- 错误信息 -->
        <div v-if="selectedLog.error">
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">错误信息</label>
          <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
            <pre class="text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap break-words">{{ selectedLog.error }}</pre>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <button @click="showDetailModal = false" class="btn-secondary">
            关闭
          </button>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup>
const { authFetch } = useAuth()
const toast = useToast()

const logs = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = 20
const showDetailModal = ref(false)
const selectedLog = ref(null)
let autoRefreshTimer = null

const filters = reactive({
  status: ''
})

const totalPages = computed(() => Math.ceil(total.value / pageSize))

// 加载日志列表
const loadLogs = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      limit: pageSize.toString(),
      skip: ((currentPage.value - 1) * pageSize).toString()
    })

    if (filters.status) {
      params.append('status', filters.status)
    }

    const res = await authFetch(`/api/logs?${params.toString()}`)
    if (res.success) {
      logs.value = res.data.logs
      total.value = res.data.total
    }
  } catch (error) {
    toast.error('加载日志列表失败')
  } finally {
    loading.value = false
  }
}

// 启动自动刷新
const startAutoRefresh = () => {
  stopAutoRefresh()
  autoRefreshTimer = setInterval(() => {
    loadLogs()
  }, 2000)
}

// 停止自动刷新
const stopAutoRefresh = () => {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer)
    autoRefreshTimer = null
  }
}

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadLogs()
  }
}

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadLogs()
  }
}

// 查看详情
const viewDetail = (log) => {
  selectedLog.value = log
  showDetailModal.value = true
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 截断文本
const truncateText = (text, maxLength) => {
  if (!text) return '-'
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

onMounted(() => {
  loadLogs()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>
