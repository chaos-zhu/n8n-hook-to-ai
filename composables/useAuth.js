export const useAuth = () => {
  const token = useState('auth_token', () => {
    if (import.meta.client) {
      return localStorage.getItem('auth_token') || null
    }
    return null
  })

  const user = useState('auth_user', () => {
    if (import.meta.client) {
      const userData = localStorage.getItem('auth_user')
      return userData ? JSON.parse(userData) : null
    }
    return null
  })

  const isAuthenticated = computed(() => !!token.value)

  const login = async (username, password) => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { username, password }
      })

      if (response.success) {
        token.value = response.data.token
        user.value = response.data.user

        if (import.meta.client) {
          localStorage.setItem('auth_token', response.data.token)
          localStorage.setItem('auth_user', JSON.stringify(response.data.user))
        }

        return { success: true }
      }

      return { success: false, message: '登录失败' }
    } catch (error) {
      return {
        success: false,
        message: error.data?.message || '登录失败，请检查用户名和密码'
      }
    }
  }

  const logout = () => {
    token.value = null
    user.value = null

    if (import.meta.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }

    navigateTo('/login')
  }

  const getAuthHeaders = () => {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  // 带认证的fetch封装
  const authFetch = async (url, options = {}) => {
    const headers = {
      ...options.headers,
      ...getAuthHeaders()
    }

    try {
      return await $fetch(url, { ...options, headers })
    } catch (error) {
      // 如果是401错误，自动登出
      if (error.statusCode === 401) {
        logout()
      }
      throw error
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    getAuthHeaders,
    authFetch
  }
}