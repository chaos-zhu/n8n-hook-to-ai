<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UiToast />
  </div>
</template>

<script setup>
// 初始化主题 - useTheme 会自动从 composables 导入
const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>