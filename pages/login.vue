<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md">
      <!-- Logo和标题 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">n8n Hook to AI API</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">管理员登录</p>
      </div>

      <!-- 登录表单 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- 用户名 -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              用户名
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="input-field"
              placeholder="请输入用户名"
              :disabled="loading"
            />
          </div>

          <!-- 密码 -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              密码
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="input-field"
              placeholder="请输入密码"
              :disabled="loading"
            />
          </div>

          <!-- 错误提示 -->
          <div v-if="errorMessage" class="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
          </div>

          <!-- 登录按钮 -->
          <button
            type="submit"
            class="btn-primary w-full flex items-center justify-center gap-2"
            :disabled="loading"
          >
            <svg v-if="loading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? '登录中...' : '登录' }}</span>
          </button>
        </form>
      </div>

      <!-- 主题切换 -->
      <div class="mt-6 flex justify-center">
        <LayoutThemeToggle />
      </div>
    </div>
  </div>
</template>

<script setup>
// 页面元数据
definePageMeta({
  layout: false
})

const { login, isAuthenticated } = useAuth()
const router = useRouter()

const form = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

// 如果已登录，跳转到首页
onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/')
  }
})

const handleLogin = async () => {
  if (!form.username || !form.password) {
    errorMessage.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const result = await login(form.username, form.password)

    if (result.success) {
      router.push('/')
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>