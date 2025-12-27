<template>
  <div class="flex min-h-screen">
    <!-- 侧边栏 -->
    <LayoutSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- 主内容区域 -->
    <div class="flex-1 lg:ml-[220px]">
      <!-- 顶部栏 -->
      <LayoutHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <!-- 页面内容 -->
      <main class="p-4 lg:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const sidebarOpen = ref(false)
const { isAuthenticated } = useAuth()
const router = useRouter()

// 检查认证状态
onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/login')
  }
})

// 监听认证状态变化
watch(isAuthenticated, (value) => {
  if (!value) {
    router.push('/login')
  }
})
</script>