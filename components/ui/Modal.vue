<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- 遮罩层 -->
        <div
          class="absolute inset-0 bg-black/50"
          @click="closeOnOverlay && $emit('update:modelValue', false)"
        />

        <!-- 模态框内容 -->
        <div
          :class="[
            'relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden flex flex-col',
            sizeClasses[size]
          ]"
        >
          <!-- 头部 -->
          <div
            v-if="title || $slots.header"
            class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700"
          >
            <slot name="header">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ title }}
              </h3>
            </slot>
            <button
              v-if="showClose"
              @click="$emit('update:modelValue', false)"
              class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- 内容区域 -->
          <div class="flex-1 overflow-y-auto px-6 py-4">
            <slot />
          </div>

          <!-- 底部 -->
          <div
            v-if="$slots.footer"
            class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
          >
            <slot name="footer" />
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
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  showClose: {
    type: Boolean,
    default: true
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl'
}

// 监听关闭
watch(() => props.modelValue, (newVal, oldVal) => {
  if (oldVal && !newVal) {
    emit('close')
  }
})

// 按ESC键关闭
onMounted(() => {
  const handleEsc = (e) => {
    if (e.key === 'Escape' && props.modelValue) {
      emit('update:modelValue', false)
    }
  }
  document.addEventListener('keydown', handleEsc)
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEsc)
  })
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95);
}
</style>
