import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateWarningData } from '@/mock/weather'
import type { WarningData, WarningLevel } from '@/mock/weather'

export const useWarningStore = defineStore('warning', () => {
  const warnings = ref<WarningData[]>(generateWarningData())
  const activeAlert = ref<{ warning: WarningData; dismissable: boolean } | null>(null)
  const highlightedWarningId = ref<string | null>(null)
  const soundEnabled = ref(true)

  const warningStats = computed(() => {
    const stats: Record<WarningLevel, number> = { red: 0, orange: 0, yellow: 0, blue: 0 }
    warnings.value.forEach(w => {
      stats[w.level]++
    })
    return stats
  })

  let refreshTimer: ReturnType<typeof setInterval> | null = null

  function startPolling(intervalMs = 30000) {
    stopPolling()
    refreshTimer = setInterval(() => {
      warnings.value = generateWarningData()
    }, intervalMs)
  }

  function stopPolling() {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  function dismissAlert() {
    activeAlert.value = null
  }

  function clearHighlight() {
    highlightedWarningId.value = null
  }

  return {
    warnings,
    activeAlert,
    highlightedWarningId,
    soundEnabled,
    warningStats,
    startPolling,
    stopPolling,
    dismissAlert,
    clearHighlight
  }
})
