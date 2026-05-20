<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DataCard from '@/components/cards/DataCard.vue'
import RadarMap from '@/components/map/RadarMap.vue'
import TemperatureChart from '@/components/charts/TemperatureChart.vue'
import ForecastChart from '@/components/charts/ForecastChart.vue'
import WarningList from '@/components/cards/WarningList.vue'
import AirQualityChart from '@/components/charts/AirQualityChart.vue'
import WindRoseChart from '@/components/charts/WindRoseChart.vue'
import {
  generateRealtimeData,
  generateForecastData,
  generateWarningData,
  generateHourlyTemp,
  generateWindRoseData
} from '@/mock/weather'
import type { RealtimeData, ForecastData, WarningData } from '@/mock/weather'

const realtimeData = ref<RealtimeData>(generateRealtimeData())
const forecastData = ref<ForecastData[]>(generateForecastData())
const warnings = ref<WarningData[]>(generateWarningData())
const hourlyTemp = ref(generateHourlyTemp())
const windRoseData = ref(generateWindRoseData())

let dataTimer: ReturnType<typeof setInterval>

onMounted(() => {
  // 每5秒更新实时数据
  dataTimer = setInterval(() => {
    realtimeData.value = generateRealtimeData()
  }, 5000)
})

onUnmounted(() => {
  clearInterval(dataTimer)
})
</script>

<template>
  <DashboardLayout>
    <!-- 左侧面板 -->
    <div class="left-panel">
      <!-- 实时数据卡片 -->
      <div class="data-cards">
        <DataCard
          title="温度"
          :value="realtimeData.temperature"
          unit="°C"
          icon="🌡️"
          trend="up"
          color="#f5222d"
        />
        <DataCard
          title="湿度"
          :value="realtimeData.humidity"
          unit="%"
          icon="💧"
          trend="stable"
          color="#1890ff"
        />
        <DataCard
          title="风速"
          :value="realtimeData.windSpeed"
          unit="m/s"
          icon="💨"
          :trend="realtimeData.windSpeed > 5 ? 'up' : 'down'"
          color="#52c41a"
        />
        <DataCard
          title="气压"
          :value="realtimeData.pressure"
          unit="hPa"
          icon="📊"
          trend="stable"
          color="#722ed1"
        />
      </div>

      <!-- 24小时温度曲线 -->
      <div class="chart-container">
        <TemperatureChart :data="hourlyTemp" />
      </div>
    </div>

    <!-- 中央地图区域 -->
    <div class="center-panel">
      <RadarMap />
    </div>

    <!-- 右侧面板 -->
    <div class="right-panel">
      <!-- 7天预测 -->
      <div class="chart-container">
        <ForecastChart :data="forecastData" />
      </div>

      <!-- 预警信息 -->
      <div class="warning-container">
        <WarningList :warnings="warnings" />
      </div>

      <!-- 空气质量 -->
      <div class="chart-container small">
        <AirQualityChart :data="realtimeData.airQuality" />
      </div>
    </div>
  </DashboardLayout>
</template>

<style lang="scss" scoped>
.left-panel {
  width: 480px;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  animation: slideInLeft 0.8s ease;
}

.center-panel {
  flex: 1;
  animation: fadeIn 1s ease;
}

.right-panel {
  width: 480px;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  animation: slideInRight 0.8s ease;
}

.data-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
}

.chart-container {
  flex: 1;
  min-height: 300px;

  &.small {
    min-height: 200px;
    flex: none;
  }
}

.warning-container {
  flex: 1;
  min-height: 250px;
}
</style>
