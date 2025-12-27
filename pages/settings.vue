<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">系统设置</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">管理账户信息和系统配置</p>
      </div>
    </div>

    <!-- 账户设置 -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">账户设置</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 修改用户名 -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              修改用户名
            </h4>
            <form @submit.prevent="updateUsername" class="space-y-4">
              <div>
                <input
                  v-model="usernameForm.username"
                  type="text"
                  class="input-field"
                  placeholder="请输入新用户名"
                  required
                />
              </div>
              <button
                type="submit"
                class="btn-primary w-full"
                :disabled="savingUsername || !usernameForm.username"
              >
                {{ savingUsername ? '保存中...' : '保存用户名' }}
              </button>
            </form>
          </div>

          <!-- 修改密码 -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              修改密码
            </h4>
            <form @submit.prevent="updatePassword" class="space-y-4">
              <div>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="input-field"
                  placeholder="当前密码"
                  required
                />
              </div>
              <div>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="input-field"
                  placeholder="新密码（至少4位）"
                  required
                  minlength="4"
                />
              </div>
              <div>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="input-field"
                  placeholder="确认新密码"
                  required
                />
              </div>
              <button
                type="submit"
                class="btn-primary w-full"
                :disabled="savingPassword || !isPasswordFormValid"
              >
                {{ savingPassword ? '保存中...' : '修改密码' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
const { authFetch, logout } = useAuth()
const toast = useToast()

const settings = reactive({
  username: '',
  createdAt: null,
  updatedAt: null
})

const usernameForm = reactive({
  username: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const savingUsername = ref(false)
const savingPassword = ref(false)

const baseUrl = computed(() => {
  if (import.meta.client) {
    return window.location.origin
  }
  return ''
})

const isPasswordFormValid = computed(() => {
  return passwordForm.currentPassword &&
    passwordForm.newPassword &&
    passwordForm.confirmPassword &&
    passwordForm.newPassword.length >= 4 &&
    passwordForm.newPassword === passwordForm.confirmPassword
})

// 加载设置
const loadSettings = async () => {
  try {
    const res = await authFetch('/api/settings')
    if (res.success) {
      settings.username = res.data.username
      settings.createdAt = res.data.createdAt
      settings.updatedAt = res.data.updatedAt
      usernameForm.username = res.data.username
    }
  } catch (error) {
    toast.error('加载设置失败')
  }
}

// 更新用户名
const updateUsername = async () => {
  if (!usernameForm.username) {
    toast.warning('请输入新用户名')
    return
  }

  if (usernameForm.username === settings.username) {
    toast.info('用户名未更改')
    return
  }

  savingUsername.value = true
  try {
    const res = await authFetch('/api/settings', {
      method: 'PUT',
      body: { username: usernameForm.username }
    })
    if (res.success) {
      toast.success('用户名已更新')
      loadSettings()
    }
  } catch (error) {
    toast.error(error.data?.message || '更新用户名失败')
  } finally {
    savingUsername.value = false
  }
}

// 更新密码
const updatePassword = async () => {
  if (!passwordForm.currentPassword) {
    toast.warning('请输入当前密码')
    return
  }

  if (!passwordForm.newPassword) {
    toast.warning('请输入新密码')
    return
  }

  if (passwordForm.newPassword.length < 4) {
    toast.warning('新密码长度不能少于4位')
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.warning('两次输入的密码不一致')
    return
  }

  savingPassword.value = true
  try {
    const res = await authFetch('/api/settings', {
      method: 'PUT',
      body: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }
    })
    if (res.success) {
      toast.success('密码已更新，请重新登录')
      // 清空表单
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
      // 延迟后退出登录
      setTimeout(() => {
        logout()
      }, 1500)
    }
  } catch (error) {
    toast.error(error.data?.message || '更新密码失败')
  } finally {
    savingPassword.value = false
  }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadSettings()
})
</script>
