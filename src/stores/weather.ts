import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  generateRealtimeData,
  generateForecastData,
  generateStationData,
  generateHourlyTemp,
  generateWindRoseData,
} from '@/mock/weather'
import type { RealtimeData, ForecastData, StationData } from '@/mock/weather'

export const useWeatherStore = defineStore('weather', () => {
  const realtime = ref<RealtimeData>(generateRealtimeData())
  const forecast = ref<ForecastData[]>(generateForecastData())
  const stations = ref<StationData[]>(generateStationData())
  const hourlyTemp = ref(generateHourlyTemp())
  const windRose = ref(generateWindRoseData())

  let timer: ReturnType<typeof setInterval> | null = null

  function refresh() {
    realtime.value = generateRealtimeData()
    stations.value = generateStationData()
    windRose.value = generateWindRoseData()
  }

  function startPolling(intervalMs = 5000) {
    stopPolling()
    timer = setInterval(refresh, intervalMs)
  }

  function stopPolling() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  return { realtime, forecast, stations, hourlyTemp, windRose, refresh, startPolling, stopPolling }
})
