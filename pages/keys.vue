<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">API Key 管理</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">管理 OpenAI 兼容 API 的访问密钥</p>
      </div>
      <button @click="openCreateModal" class="btn-primary flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        生成 API Key
      </button>
    </div>

    <!-- Key列表 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">名称</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">API Key</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">创建时间</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">最后使用</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="key in keys" :key="key._id" class="hover:bg-gray-50 dark:hover:bg-gray-900/50">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ key.name || '未命名' }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <code class="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">{{ key.key }}</code>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(key.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ key.lastUsedAt ? formatDate(key.lastUsedAt) : '从未使用' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button
                  @click="confirmDelete(key)"
                  class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="删除"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="keys.length === 0 && !loading">
              <td colspan="5" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center">
                  <svg class="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <p class="text-gray-500 dark:text-gray-400">暂无 API Key</p>
                  <button @click="openCreateModal" class="mt-4 text-primary-600 dark:text-primary-400 hover:underline">
                    生成第一个 API Key
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 使用说明 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">使用说明</h3>
      <div class="space-y-4 text-sm text-gray-600 dark:text-gray-400">
        <p>在请求 API 时，需要在 HTTP Header 中添加 Authorization：</p>
        <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <code class="text-gray-700 dark:text-gray-300">Authorization: Bearer sk-xxxxxxxxxxxxxxxx</code>
        </div>
        <p>示例请求：</p>
        <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-gray-700 dark:text-gray-300 text-xs">curl {{ baseUrl }}/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-xxxxxxxxxxxxxxxx" \
  -d '{
    "model": "your-model-name",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": true
  }'</pre>
        </div>
      </div>
    </div>

    <!-- 创建模态框 -->
    <UiModal v-model="showModal" title="生成 API Key" size="md">
      <form @submit.prevent="createKey" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            名称/备注
          </label>
          <input
            v-model="form.name"
            type="text"
            class="input-field"
            placeholder="例如：测试环境"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">可选，用于标识此 Key 的用途</p>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button @click="showModal = false" class="btn-secondary">
            取消
          </button>
          <button @click="createKey" class="btn-primary" :disabled="creating">
            {{ creating ? '生成中...' : '生成' }}
          </button>
        </div>
      </template>
    </UiModal>

    <!-- 新Key展示模态框 -->
    <UiModal v-model="showNewKeyModal" title="API Key 已生成" size="md" :close-on-overlay="false">
      <div class="space-y-4">
        <div class="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-sm text-yellow-700 dark:text-yellow-300">
              请立即复制此 API Key，关闭后将无法再次查看完整内容。
            </p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            API Key
          </label>
          <div class="flex items-center gap-2">
            <input
              :value="newKey"
              type="text"
              readonly
              class="input-field flex-1 font-mono text-sm"
            />
            <button
              @click="copyNewKey"
              class="btn-primary flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制
            </button>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <button @click="closeNewKeyModal" class="btn-primary">
            我已保存，关闭
          </button>
        </div>
      </template>
    </UiModal>

    <!-- 删除确认框 -->
    <UiConfirm
      v-model="showDeleteConfirm"
      title="删除 API Key"
      :message="`确定要删除此 API Key 吗？删除后使用此 Key 的应用将无法访问 API。`"
      type="danger"
      confirm-text="删除"
      @confirm="deleteKey"
    />
  </div>
</template>

<script setup>
const { authFetch } = useAuth()
const toast = useToast()

const keys = ref([])
const loading = ref(false)
const showModal = ref(false)
const creating = ref(false)
const showNewKeyModal = ref(false)
const newKey = ref('')
const showDeleteConfirm = ref(false)
const deleteTarget = ref(null)

const form = reactive({
  name: ''
})

const baseUrl = computed(() => {
  if (import.meta.client) {
    return window.location.origin
  }
  return ''
})

// 加载Key列表
const loadKeys = async () => {
  loading.value = true
  try {
    const res = await authFetch('/api/keys')
    if (res.success) {
      keys.value = res.data
    }
  } catch (error) {
    toast.error('加载 API Key 列表失败')
  } finally {
    loading.value = false
  }
}

// 打开创建模态框
const openCreateModal = () => {
  form.name = ''
  showModal.value = true
}

// 创建Key
const createKey = async () => {
  creating.value = true
  try {
    const res = await authFetch('/api/keys', {
      method: 'POST',
      body: { name: form.name }
    })
    if (res.success) {
      newKey.value = res.data.fullKey
      showModal.value = false
      showNewKeyModal.value = true

      // 自动复制到剪贴板
      try {
        await navigator.clipboard.writeText(res.data.fullKey)
        toast.success('API Key 已复制到剪贴板')
      } catch (e) {
        // 剪贴板复制失败，用户需要手动复制
      }

      loadKeys()
    }
  } catch (error) {
    toast.error('生成 API Key 失败')
  } finally {
    creating.value = false
  }
}

// 复制新Key
const copyNewKey = async () => {
  try {
    await navigator.clipboard.writeText(newKey.value)
    toast.success('已复制到剪贴板')
  } catch (error) {
    toast.error('复制失败，请手动复制')
  }
}

// 关闭新Key模态框
const closeNewKeyModal = () => {
  showNewKeyModal.value = false
  newKey.value = ''
}

// 确认删除
const confirmDelete = (key) => {
  deleteTarget.value = key
  showDeleteConfirm.value = true
}

// 删除Key
const deleteKey = async () => {
  if (!deleteTarget.value) return

  try {
    const res = await authFetch(`/api/keys/${deleteTarget.value._id}`, {
      method: 'DELETE'
    })
    if (res.success) {
      toast.success('API Key 已删除')
      loadKeys()
    }
  } catch (error) {
    toast.error('删除失败')
  }
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadKeys()
})
</script>