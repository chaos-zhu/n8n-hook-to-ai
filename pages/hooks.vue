<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Hook 管理</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">管理 n8n Webhook 配置</p>
      </div>
      <button @click="openCreateModal" class="btn-primary flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        添加 Hook
      </button>
    </div>

    <!-- Hook列表 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">名称</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">模型名称</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Webhook URL</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">创建时间</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="hook in hooks" :key="hook._id" class="hover:bg-gray-50 dark:hover:bg-gray-900/50">
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="toggleHook(hook)"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                    hook.enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  ]"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      hook.enabled ? 'translate-x-5' : 'translate-x-0'
                    ]"
                  />
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ hook.name }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <code class="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">{{ hook.modelName }}</code>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-500 dark:text-gray-400 truncate block max-w-xs" :title="hook.webhookUrl">
                  {{ hook.webhookUrl }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(hook.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="testHook(hook)"
                    :disabled="testingHookId === hook._id"
                    class="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    title="测试"
                  >
                    <svg v-if="testingHookId !== hook._id" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button
                    @click="openEditModal(hook)"
                    class="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="编辑"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(hook)"
                    class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="删除"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="hooks.length === 0 && !loading">
              <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center">
                  <svg class="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <p class="text-gray-500 dark:text-gray-400">暂无 Hook 配置</p>
                  <button @click="openCreateModal" class="mt-4 text-primary-600 dark:text-primary-400 hover:underline">
                    添加第一个 Hook
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 创建/编辑模态框 -->
    <UiModal v-model="showModal" :title="isEditing ? '编辑 Hook' : '添加 Hook'" size="lg">
      <form @submit.prevent="saveHook" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            名称 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            class="input-field"
            placeholder="例如：客服助手"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            模型名称 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.modelName"
            type="text"
            class="input-field"
            placeholder="例如：gpt-4-customer-service"
            required
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">用于 OpenAI API 的 model 字段</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Webhook URL <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.webhookUrl"
            type="url"
            class="input-field"
            placeholder="https://your-n8n-instance/webhook/xxx"
            required
          />
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="form.enabled = !form.enabled"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              form.enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                form.enabled ? 'translate-x-5' : 'translate-x-0'
              ]"
            />
          </button>
          <span class="text-sm text-gray-700 dark:text-gray-300">启用此 Hook</span>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-between">
          <button
            v-if="isEditing"
            @click="testCurrentHook"
            :disabled="testingModal"
            class="btn-secondary flex items-center gap-2"
          >
            <svg v-if="!testingModal" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ testingModal ? '测试中...' : '测试' }}
          </button>
          <div v-else></div>
          <div class="flex gap-3">
            <button @click="showModal = false" class="btn-secondary">
              取消
            </button>
            <button @click="saveHook" class="btn-primary" :disabled="saving">
              {{ saving ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </template>
    </UiModal>

    <!-- 删除确认框 -->
    <UiConfirm
      v-model="showDeleteConfirm"
      title="删除 Hook"
      :message="`确定要删除 Hook「${deleteTarget?.name}」吗？此操作不可恢复。`"
      type="danger"
      confirm-text="删除"
      @confirm="deleteHook"
    />

    <!-- 测试结果模态框 -->
    <UiModal v-model="showTestResult" title="测试结果" size="lg" @close="cancelTest">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">输入</label>
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
            <code class="text-sm text-gray-800 dark:text-gray-200">{{ testResult?.input }}</code>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            输出
            <span v-if="testResult?.duration" class="text-xs text-gray-500 dark:text-gray-400 ml-2">
              (耗时: {{ testResult.duration }}ms)
            </span>
            <span v-if="testingInProgress" class="text-xs text-blue-500 dark:text-blue-400 ml-2">
              <svg class="w-3 h-3 inline animate-spin mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              接收中...
            </span>
          </label>
          <div
            ref="outputContainer"
            :class="[
              'rounded-lg p-3 max-h-64 overflow-y-auto',
              testResult?.error
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            ]"
          >
            <pre
              :class="[
                'text-sm whitespace-pre-wrap break-words',
                testResult?.error ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'
              ]"
            >{{ testResult?.error || testResult?.output || (testingInProgress ? '等待响应...' : '(无输出)') }}</pre>
          </div>
        </div>

        <div v-if="testResult?.status" class="flex items-center gap-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">HTTP 状态:</span>
          <span
            :class="[
              'px-2 py-1 rounded text-xs font-medium',
              testResult.status >= 200 && testResult.status < 300
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            ]"
          >
            {{ testResult.status }}
          </span>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <button v-if="testingInProgress" @click="cancelTest" class="btn-secondary">
            取消测试
          </button>
          <button @click="closeTestResult" class="btn-primary">
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

const hooks = ref([])
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const saving = ref(false)
const showDeleteConfirm = ref(false)
const deleteTarget = ref(null)
const testingHookId = ref(null)
const testingModal = ref(false)
const showTestResult = ref(false)
const testResult = ref(null)
const testingInProgress = ref(false)
const testAbortController = ref(null)
const outputContainer = ref(null)

const form = reactive({
  name: '',
  modelName: '',
  webhookUrl: '',
  enabled: true
})

// 加载Hook列表
const loadHooks = async () => {
  loading.value = true
  try {
    const res = await authFetch('/api/hooks')
    if (res.success) {
      hooks.value = res.data
    }
  } catch (error) {
    toast.error('加载 Hook 列表失败')
  } finally {
    loading.value = false
  }
}

// 打开创建模态框
const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  form.name = ''
  form.modelName = ''
  form.webhookUrl = ''
  form.enabled = true
  showModal.value = true
}

// 打开编辑模态框
const openEditModal = (hook) => {
  isEditing.value = true
  editingId.value = hook._id
  form.name = hook.name
  form.modelName = hook.modelName
  form.webhookUrl = hook.webhookUrl
  form.enabled = hook.enabled
  showModal.value = true
}

// 保存Hook
const saveHook = async () => {
  if (!form.name || !form.modelName || !form.webhookUrl) {
    toast.warning('请填写所有必填字段')
    return
  }

  saving.value = true
  try {
    if (isEditing.value) {
      const res = await authFetch(`/api/hooks/${editingId.value}`, {
        method: 'PUT',
        body: form
      })
      if (res.success) {
        toast.success('Hook 已更新')
        showModal.value = false
        loadHooks()
      }
    } else {
      const res = await authFetch('/api/hooks', {
        method: 'POST',
        body: form
      })
      if (res.success) {
        toast.success('Hook 已创建')
        showModal.value = false
        loadHooks()
      }
    }
  } catch (error) {
    toast.error(error.data?.message || '保存失败')
  } finally {
    saving.value = false
  }
}

// 切换Hook状态
const toggleHook = async (hook) => {
  try {
    const res = await authFetch(`/api/hooks/${hook._id}`, {
      method: 'PUT',
      body: { enabled: !hook.enabled }
    })
    if (res.success) {
      hook.enabled = !hook.enabled
      toast.success(hook.enabled ? 'Hook 已启用' : 'Hook 已禁用')
    }
  } catch (error) {
    toast.error('操作失败')
  }
}

// 确认删除
const confirmDelete = (hook) => {
  deleteTarget.value = hook
  showDeleteConfirm.value = true
}

// 删除Hook
const deleteHook = async () => {
  if (!deleteTarget.value) return

  try {
    const res = await authFetch(`/api/hooks/${deleteTarget.value._id}`, {
      method: 'DELETE'
    })
    if (res.success) {
      toast.success('Hook 已删除')
      loadHooks()
    }
  } catch (error) {
    toast.error('删除失败')
  }
}

// 执行测试（SSE流式）
const executeTest = async (webhookUrl, hookId = null) => {
  const input = 'hi'

  // 立即显示弹窗
  testResult.value = { input, output: '', duration: null, status: null, error: null }
  showTestResult.value = true
  testingInProgress.value = true

  // 创建 AbortController 用于取消请求
  testAbortController.value = new AbortController()

  try {
    const { getAuthHeaders } = useAuth()
    const response = await fetch(`/api/hooks/${hookId || 'test'}/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ input, webhookUrl }),
      signal: testAbortController.value.signal
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // 解析 SSE 事件
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))

            switch (data.type) {
              case 'start':
                // 测试开始
                break
              case 'content':
                // 追加内容
                testResult.value.output += data.content
                // 自动滚动到底部
                nextTick(() => {
                  if (outputContainer.value) {
                    outputContainer.value.scrollTop = outputContainer.value.scrollHeight
                  }
                })
                break
              case 'error':
                testResult.value.error = data.error
                testResult.value.duration = data.duration
                if (data.status) testResult.value.status = data.status
                break
              case 'done':
                testResult.value.duration = data.duration
                if (data.status) testResult.value.status = data.status
                break
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      // 用户取消了测试
      testResult.value.error = '测试已取消'
    } else {
      testResult.value.error = error.message || '测试失败'
    }
  } finally {
    testingInProgress.value = false
    testAbortController.value = null
    testingHookId.value = null
    testingModal.value = false
  }
}

// 测试Hook（列表中）- 使用列表中的参数
const testHook = async (hook) => {
  testingHookId.value = hook._id
  await executeTest(hook.webhookUrl, hook._id)
}

// 测试当前编辑的Hook - 使用弹窗中的参数
const testCurrentHook = async () => {
  if (!form.webhookUrl) {
    toast.warning('请先填写 Webhook URL')
    return
  }

  testingModal.value = true
  await executeTest(form.webhookUrl, editingId.value)
}

// 取消测试
const cancelTest = () => {
  if (testAbortController.value) {
    testAbortController.value.abort()
  }
}

// 关闭测试结果弹窗
const closeTestResult = () => {
  cancelTest()
  showTestResult.value = false
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

onMounted(() => {
  loadHooks()
})
</script>