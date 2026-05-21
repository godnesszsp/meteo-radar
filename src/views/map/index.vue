<script setup lang="ts">
import { ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ChinaMap from '@/components/map/ChinaMap.vue'
import { generateChinaData, weatherIconMap, getAqiLevel } from '@/mock/china'
import type { ProvinceData } from '@/mock/china'

const mapMode = ref('temperature')
const selectedProvince = ref<ProvinceData | null>(null)
const provinces = ref<ProvinceData[]>(generateChinaData())

// 数据模式选项
const modeOptions = [
  { value: 'temperature', label: '温度分布', icon: '🌡️', color: '#f5222d' },
  { value: 'humidity', label: '湿度分布', icon: '💧', color: '#1890ff' },
  { value: 'aqi', label: '空气质量', icon: '🌿', color: '#52c41a' },
]

// 处理省份点击
function handleProvinceClick(province: ProvinceData) {
  selectedProvince.value = province
}

// 关闭详情面板
function closeDetail() {
  selectedProvince.value = null
}

// 获取温度颜色
function getTempColor(temp: number): string {
  if (temp < 0) return '#313695'
  if (temp < 10) return '#4575b4'
  if (temp < 20) return '#74add1'
  if (temp < 25) return '#abd9e9'
  if (temp < 30) return '#fee090'
  if (temp < 35) return '#fdae61'
  return '#d73027'
}

// 统计数据
const stats = ref({
  maxTemp: Math.max(...provinces.value.map(p => p.temperature)),
  minTemp: Math.min(...provinces.value.map(p => p.temperature)),
  avgAqi: Math.round(provinces.value.reduce((sum, p) => sum + p.aqi, 0) / provinces.value.length),
  alertCount: provinces.value.filter(p => p.aqi > 150).length,
})
</script>

<template>
  <DashboardLayout>
    <div class="map-page">
      <!-- 左侧控制面板 -->
      <div class="control-panel">
        <div class="panel-section">
          <h3 class="panel-title">
            <span class="title-icon">📊</span>
            <span>数据图层</span>
          </h3>
          <div class="mode-list">
            <button
              v-for="mode in modeOptions"
              :key="mode.value"
              :class="['mode-btn', { active: mapMode === mode.value }]"
              @click="mapMode = mode.value"
            >
              <span class="mode-icon">{{ mode.icon }}</span>
              <span class="mode-label">{{ mode.label }}</span>
              <span
                v-if="mapMode === mode.value"
                class="mode-indicator"
                :style="{ background: mode.color }"
              ></span>
            </button>
          </div>
        </div>

        <div class="panel-section">
          <h3 class="panel-title">
            <span class="title-icon">📈</span>
            <span>统计概览</span>
          </h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">最高温</span>
              <span class="stat-value" :style="{ color: '#f5222d' }">{{ stats.maxTemp }}°C</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">最低温</span>
              <span class="stat-value" :style="{ color: '#1890ff' }">{{ stats.minTemp }}°C</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">平均AQI</span>
              <span class="stat-value" :style="{ color: getAqiLevel(stats.avgAqi).color }">{{ stats.avgAqi }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">污染预警</span>
              <span class="stat-value" :style="{ color: '#fa8c16' }">{{ stats.alertCount }}省</span>
            </div>
          </div>
        </div>

        <div class="panel-section">
          <h3 class="panel-title">
            <span class="title-icon">🏙️</span>
            <span>省份列表</span>
          </h3>
          <div class="province-list">
            <div
              v-for="p in provinces.slice(0, 10)"
              :key="p.name"
              class="province-item"
              @click="handleProvinceClick(p)"
            >
              <span class="province-name">{{ p.name }}</span>
              <span class="province-temp" :style="{ color: getTempColor(p.temperature) }">
                {{ p.temperature }}°C
              </span>
              <span class="province-weather">{{ weatherIconMap[p.weather] }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 中央地图 -->
      <div class="map-container">
        <ChinaMap
          :mode="mapMode"
          :show-markers="true"
          height="100%"
          @province-click="handleProvinceClick"
        />
      </div>

      <!-- 省份详情面板 -->
      <transition name="slide">
        <div v-if="selectedProvince" class="detail-panel">
          <div class="detail-header">
            <div class="detail-title">
              <span class="detail-icon">{{ weatherIconMap[selectedProvince.weather] }}</span>
              <span>{{ selectedProvince.name }}</span>
            </div>
            <button class="close-btn" @click="closeDetail">×</button>
          </div>

          <div class="detail-content">
            <div class="detail-weather">
              <span class="weather-text">{{ selectedProvince.weather }}</span>
              <span class="weather-temp" :style="{ color: getTempColor(selectedProvince.temperature) }">
                {{ selectedProvince.temperature }}°C
              </span>
            </div>

            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">💧 湿度</span>
                <span class="detail-value">{{ selectedProvince.humidity }}%</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">💨 风速</span>
                <span class="detail-value">{{ selectedProvince.windSpeed }} m/s</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">🌿 AQI</span>
                <span
                  class="detail-value"
                  :style="{ color: getAqiLevel(selectedProvince.aqi).color }"
                >
                  {{ selectedProvince.aqi }} {{ getAqiLevel(selectedProvince.aqi).level }}
                </span>
              </div>
            </div>

            <div class="detail-chart">
              <div class="mini-bar" v-for="i in 24" :key="i">
                <div
                  class="bar-fill"
                  :style="{
                    height: `${30 + Math.random() * 70}%`,
                    background: `linear-gradient(to top, rgba(0,212,255,0.3), rgba(0,212,255,0.8))`,
                  }"
                ></div>
                <span class="bar-label" v-if="i % 4 === 0">{{ i - 1 }}h</span>
              </div>
            </div>
            <div class="chart-label">24小时温度趋势</div>
          </div>
        </div>
      </transition>
    </div>
  </DashboardLayout>
</template>

<style lang="scss" scoped>
.map-page {
  display: flex;
  width: 100%;
  height: 100%;
  gap: $spacing-lg;
  animation: fadeIn 0.5s ease;
}

.control-panel {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  animation: slideInLeft 0.6s ease;
}

.panel-section {
  @include card-base;
  padding: $spacing-lg;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-base;
  color: $accent;
  margin-bottom: $spacing-md;
}

.title-icon {
  font-size: 20px;
}

.mode-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.mode-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: 12px 16px;
  background: rgba(13, 31, 60, 0.5);
  border: 1px solid transparent;
  border-radius: $radius-md;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba(0, 212, 255, 0.1);
    border-color: rgba(0, 212, 255, 0.2);
  }

  &.active {
    background: rgba(0, 212, 255, 0.15);
    border-color: $accent;
    color: #fff;
  }
}

.mode-icon {
  font-size: 20px;
}

.mode-label {
  font-size: $font-sm;
}

.mode-indicator {
  position: absolute;
  right: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-sm;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-sm;
  background: rgba(13, 31, 60, 0.5);
  border-radius: $radius-sm;
}

.stat-label {
  font-size: $font-xs;
  color: rgba(255, 255, 255, 0.5);
}

.stat-value {
  font-family: 'DIN', monospace;
  font-size: $font-lg;
  font-weight: bold;
}

.province-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  max-height: 300px;
  overflow-y: auto;

  @include scrollbar;
}

.province-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: rgba(13, 31, 60, 0.5);
  border-radius: $radius-sm;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba(0, 212, 255, 0.1);
    transform: translateX(4px);
  }
}

.province-name {
  flex: 1;
  font-size: $font-sm;
  color: rgba(255, 255, 255, 0.8);
}

.province-temp {
  font-family: 'DIN', monospace;
  font-size: $font-base;
  font-weight: bold;
  margin-right: $spacing-sm;
}

.province-weather {
  font-size: 18px;
}

.map-container {
  flex: 1;
  animation: fadeIn 0.8s ease;
}

.detail-panel {
  width: 320px;
  @include card-base;
  padding: $spacing-lg;
  animation: slideInRight 0.3s ease;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-lg;
}

.detail-title {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-xl;
  font-weight: bold;
  color: $accent;
}

.detail-icon {
  font-size: 28px;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 34, 45, 0.1);
  border: 1px solid rgba(245, 34, 45, 0.3);
  border-radius: $radius-sm;
  color: $danger;
  font-size: 20px;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba(245, 34, 45, 0.2);
    border-color: $danger;
  }
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.detail-weather {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  background: rgba(13, 31, 60, 0.5);
  border-radius: $radius-md;
}

.weather-text {
  font-size: $font-lg;
  color: rgba(255, 255, 255, 0.8);
}

.weather-temp {
  font-family: 'DIN', monospace;
  font-size: $font-3xl;
  font-weight: bold;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-sm;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-sm;
  background: rgba(13, 31, 60, 0.5);
  border-radius: $radius-sm;
}

.detail-label {
  font-size: $font-xs;
  color: rgba(255, 255, 255, 0.5);
}

.detail-value {
  font-size: $font-sm;
  font-weight: bold;
  color: #fff;
}

.detail-chart {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 100px;
  padding: $spacing-sm 0;
}

.mini-bar {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}

.bar-fill {
  width: 100%;
  border-radius: 2px 2px 0 0;
  transition: height 0.3s ease;
}

.bar-label {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 2px;
}

.chart-label {
  text-align: center;
  font-size: $font-xs;
  color: rgba(255, 255, 255, 0.5);
}

// 过渡动画
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
