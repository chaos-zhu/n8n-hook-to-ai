export const useToast = () => {
  const toasts = useState('toasts', () => [])

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random()

    toasts.value.push({
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration
    })

    // 自动移除
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message, duration) => addToast(message, 'success', duration)
  const error = (message, duration) => addToast(message, 'error', duration)
  const warning = (message, duration) => addToast(message, 'warning', duration)
  const info = (message, duration) => addToast(message, 'info', duration)

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}