<template>
  <Teleport to="body">
    <Transition name="confirm">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- 遮罩层 -->
        <div
          class="absolute inset-0 bg-black/50"
          @click="handleCancel"
        />

        <!-- 确认框内容 -->
        <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
          <!-- 图标和标题 -->
          <div class="p-6 text-center">
            <!-- 图标 -->
            <div
              :class="[
                'mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4',
                iconBgClasses[type]
              ]"
            >
              <svg
                v-if="type === 'danger'"
                class="w-7 h-7 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <svg
                v-else-if="type === 'warning'"
                class="w-7 h-7 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg
                v-else
                class="w-7 h-7 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <!-- 标题 -->
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ title }}
            </h3>

            <!-- 消息 -->
            <p class="text-gray-500 dark:text-gray-400">
              {{ message }}
            </p>
          </div>

          <!-- 按钮区域 -->
          <div class="flex border-t border-gray-200 dark:border-gray-700">
            <button
              @click="handleCancel"
              class="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              :class="[
                'flex-1 px-4 py-3 font-medium transition-colors border-l border-gray-200 dark:border-gray-700',
                confirmBtnClasses[type]
              ]"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '确认操作'
  },
  message: {
    type: String,
    default: '确定要执行此操作吗？'
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'warning', 'danger'].includes(value)
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const iconBgClasses = {
  info: 'bg-blue-100 dark:bg-blue-900/30',
  warning: 'bg-yellow-100 dark:bg-yellow-900/30',
  danger: 'bg-red-100 dark:bg-red-900/30'
}

const confirmBtnClasses = {
  info: 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30',
  warning: 'text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/30',
  danger: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30'
}

const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}

// 按ESC键关闭
onMounted(() => {
  const handleEsc = (e) => {
    if (e.key === 'Escape' && props.modelValue) {
      handleCancel()
    }
  }
  document.addEventListener('keydown', handleEsc)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEsc)
  })
})
</script>

<style scoped>
.confirm-enter-active,
.confirm-leave-active {
  transition: all 0.3s ease;
}

.confirm-enter-from,
.confirm-leave-to {
  opacity: 0;
}

.confirm-enter-from > div:last-child,
.confirm-leave-to > div:last-child {
  transform: scale(0.95);
}
</style>
