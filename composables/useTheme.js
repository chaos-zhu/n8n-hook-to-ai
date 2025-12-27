export const useTheme = () => {
  const isDark = useState('theme_dark', () => {
    if (import.meta.client) {
      const saved = localStorage.getItem('theme')
      if (saved) {
        return saved === 'dark'
      }
      // 检测系统偏好
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  const toggleTheme = () => {
    isDark.value = !isDark.value
    updateTheme()
  }

  const setTheme = (dark) => {
    isDark.value = dark
    updateTheme()
  }

  const updateTheme = () => {
    if (import.meta.client) {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')

      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  // 初始化主题
  const initTheme = () => {
    if (import.meta.client) {
      updateTheme()
    }
  }

  return {
    isDark,
    toggleTheme,
    setTheme,
    initTheme
  }
}