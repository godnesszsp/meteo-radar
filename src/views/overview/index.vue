<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DataCard from '@/components/cards/DataCard.vue'
import ChinaMap from '@/components/map/ChinaMap.vue'
import TemperatureChart from '@/components/charts/TemperatureChart.vue'
import ForecastChart from '@/components/charts/ForecastChart.vue'
import WarningList from '@/components/cards/WarningList.vue'
import AirQualityChart from '@/components/charts/AirQualityChart.vue'
import { useWeatherStore } from '@/stores/weather'
import { useWarningStore } from '@/stores/warning'

const weatherStore = useWeatherStore()
const warningStore = useWarningStore()

onMounted(() => {
  weatherStore.startPolling(5000)
})

onUnmounted(() => {
  weatherStore.stopPolling()
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
          :value="weatherStore.realtime.temperature"
          unit="°C"
          icon="🌡️"
          trend="up"
          color="#f5222d"
        />
        <DataCard
          title="湿度"
          :value="weatherStore.realtime.humidity"
          unit="%"
          icon="💧"
          trend="stable"
          color="#1890ff"
        />
        <DataCard
          title="风速"
          :value="weatherStore.realtime.windSpeed"
          unit="m/s"
          icon="💨"
          :trend="weatherStore.realtime.windSpeed > 5 ? 'up' : 'down'"
          color="#52c41a"
        />
        <DataCard
          title="气压"
          :value="weatherStore.realtime.pressure"
          unit="hPa"
          icon="📊"
          trend="stable"
          color="#722ed1"
        />
      </div>

      <!-- 24小时温度曲线 -->
      <div class="chart-container">
        <TemperatureChart :data="weatherStore.hourlyTemp" />
      </div>
    </div>

    <!-- 中央地图区域 -->
    <div class="center-panel">
      <div class="map-wrapper">
        <h3 class="section-title">
          <span class="title-icon">🗺️</span>
          <span>全国气象态势</span>
        </h3>
        <ChinaMap mode="temperature" :show-markers="true" height="calc(100% - 48px)" />
      </div>
    </div>

    <!-- 右侧面板 -->
    <div class="right-panel">
      <!-- 7天预测 -->
      <div class="chart-container">
        <ForecastChart :data="weatherStore.forecast" />
      </div>

      <!-- 预警信息 -->
      <div class="warning-container">
        <WarningList :warnings="warningStore.warnings" />
      </div>

      <!-- 空气质量 -->
      <div class="chart-container small">
        <AirQualityChart :data="weatherStore.realtime.airQuality" />
      </div>
    </div>
  </DashboardLayout>
</template>

<style lang="scss" scoped>
.left-panel {
  width: clamp(320px, 15vw, 520px);
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  animation: slideInLeft 0.8s ease;

  @include respond-to('fhd') {
    width: clamp(300px, 14vw, 440px);
  }

  @include respond-to('hd') {
    width: clamp(260px, 14vw, 360px);
    gap: $spacing-md;
  }
}

.center-panel {
  flex: 1;
  min-width: 0;
  animation: fadeIn 1s ease;
}

.right-panel {
  width: clamp(320px, 15vw, 520px);
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  animation: slideInRight 0.8s ease;

  @include respond-to('fhd') {
    width: clamp(300px, 14vw, 440px);
  }

  @include respond-to('hd') {
    width: clamp(260px, 14vw, 360px);
    gap: $spacing-md;
  }
}

.data-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;

  @include respond-to('hd') {
    gap: $spacing-sm;
  }
}

.chart-container {
  flex: 1;
  min-height: 300px;

  &.small {
    min-height: 200px;
    flex: none;
  }

  @include respond-to('hd') {
    min-height: 220px;
    &.small { min-height: 160px; }
  }
}

.warning-container {
  flex: 1;
  min-height: 250px;
}

.map-wrapper {
  @include card-base;
  padding: $spacing-lg;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.section-title {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-lg;
  color: $accent;
  margin-bottom: $spacing-md;
}

.title-icon {
  font-size: 24px;
}
</style>
