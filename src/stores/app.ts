import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { darkTheme } from 'naive-ui'

export const useAppStore = defineStore('app', () => {
  const isDark = ref(true)
  const aiDrawerVisible = ref(false)
  const currentTime = ref(new Date())

  const naiveTheme = computed(() => isDark.value ? darkTheme : null)

  function toggleAiDrawer() {
    aiDrawerVisible.value = !aiDrawerVisible.value
  }

  function updateTime() {
    currentTime.value = new Date()
  }

  return {
    isDark,
    aiDrawerVisible,
    currentTime,
    naiveTheme,
    toggleAiDrawer,
    updateTime
  }
})
