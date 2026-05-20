<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { generateStationData, generateRadarData } from '@/mock/weather'
import type { StationData, RadarData } from '@/mock/weather'

const mapContainer = ref<HTMLElement>()
const stations = ref<StationData[]>([])
const radarData = ref<RadarData[]>([])
const selectedStation = ref<StationData | null>(null)
const mapReady = ref(false)
const mapError = ref(false)
const activeLayer = ref<'radar' | 'heatmap'>('radar')

// 地图实例使用 shallowRef 避免深度响应
const map = shallowRef<any>(null)
const AMap = shallowRef<any>(null)

// 北京中心坐标
const center = [116.4074, 39.9042]

// 高德地图 Key（从环境变量读取，需在 .env 中配置）
const MAP_KEY = import.meta.env.VITE_MAP_KEY || 'e377454ce255d259fa3e15a56865e1c9'

async function initMap() {
  try {
    const AMapSdk = await AMapLoader.load({
      key: MAP_KEY,
      version: '2.0',
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.HeatMap']
    })

    AMap.value = AMapSdk

    // 创建地图实例
    map.value = new AMapSdk.Map(mapContainer.value, {
      zoom: 10,
      center: center,
      mapStyle: 'amap://styles/dark',
      viewMode: '2D'
    })

    // 监听地图鉴权失败（如 Key 无效）
    map.value.on('error', () => {
      console.warn('地图鉴权失败，使用备用显示')
      mapError.value = true
      mapReady.value = false
    })

    // 添加控件
    map.value.addControl(new AMapSdk.Scale())
    map.value.addControl(new AMapSdk.ToolBar({ position: { bottom: '80px', right: '20px' } }))

    // 添加站点标记
    addStationMarkers()

    // 添加雷达回波
    addRadarOverlay()

    mapReady.value = true
  } catch (error) {
    console.error('地图加载失败:', error)
    mapError.value = true
  }
}

function addStationMarkers() {
  if (!map.value || !AMap.value) return

  stations.value.forEach(station => {
    // 创建标记
    const marker = new AMap.value.Marker({
      position: [station.lng, station.lat],
      title: station.name,
      label: {
        content: station.name,
        direction: 'top',
        offset: [0, -8],
        style: {
          color: '#fff',
          backgroundColor: 'rgba(13, 31, 60, 0.9)',
          border: '1px solid #1a3a5c',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }
      }
    })

    // 点击事件
    marker.on('click', () => {
      selectedStation.value = station
      showInfoWindow(station)
    })

    map.value.add(marker)
  })
}

function showInfoWindow(station: StationData) {
  if (!map.value || !AMap.value) return

  const content = `
    <div style="padding: 12px; min-width: 150px;">
      <div style="font-size: 16px; font-weight: bold; color: #00d4ff; margin-bottom: 8px;">${station.name}</div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="color: rgba(255,255,255,0.6);">天气</span>
        <span style="color: #fff;">${station.weatherText}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="color: rgba(255,255,255,0.6);">温度</span>
        <span style="color: #fff;">${station.temperature}°C</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="color: rgba(255,255,255,0.6);">湿度</span>
        <span style="color: #fff;">${station.humidity}%</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span style="color: rgba(255,255,255,0.6);">风速</span>
        <span style="color: #fff;">${station.windSpeed} m/s</span>
      </div>
    </div>
  `

  const infoWindow = new AMap.value.InfoWindow({
    content: content,
    offset: new AMap.value.Pixel(0, -30),
    isCustom: true
  })

  infoWindow.open(map.value, [station.lng, station.lat])
}

function addRadarOverlay() {
  if (!map.value || !AMap.value) return

  // 添加雷达回波覆盖物（使用圆形模拟）
  radarData.value.forEach(item => {
    const color = getRadarColor(item.type)
    const circle = new AMap.value.Circle({
      center: [item.lng, item.lat],
      radius: 2000 + item.intensity * 3000,
      strokeColor: color,
      strokeWeight: 0,
      fillColor: color,
      fillOpacity: item.intensity * 0.6
    })

    map.value.add(circle)
  })
}

function getRadarColor(type: string): string {
  switch (type) {
    case 'light': return '#52c41a'
    case 'moderate': return '#1890ff'
    case 'heavy': return '#fa8c16'
    case 'extreme': return '#f5222d'
    default: return '#1890ff'
  }
}

function toggleLayer() {
  activeLayer.value = activeLayer.value === 'radar' ? 'heatmap' : 'radar'
  // 实际项目中这里切换图层显示
}

onMounted(() => {
  stations.value = generateStationData()
  radarData.value = generateRadarData()
  initMap()
})

onUnmounted(() => {
  if (map.value) {
    map.value.destroy()
  }
})
</script>

<template>
  <div class="radar-map">
    <!-- 地图容器 -->
    <div ref="mapContainer" class="map-container"></div>

    <!-- 加载状态 -->
    <div v-if="!mapReady && !mapError" class="map-loading">
      <div class="loading-spinner"></div>
      <span>地图加载中...</span>
    </div>

    <!-- 加载失败 -->
    <div v-if="mapError" class="map-error">
      <span class="error-icon">🗺️</span>
      <span class="error-text">地图加载失败，请刷新页面重试</span>
      <div class="error-stations">
        <div v-for="station in stations" :key="station.id" class="station-item">
          <span class="station-name">{{ station.name }}</span>
          <span class="station-temp">{{ station.temperature }}°C</span>
        </div>
      </div>
    </div>

    <!-- 地图控件层 -->
    <div class="map-overlay">
      <!-- 图层切换 -->
      <div class="layer-controls">
        <button
          :class="['layer-btn', { active: activeLayer === 'radar' }]"
          @click="activeLayer = 'radar'"
        >
          <span class="layer-icon">📡</span>
          <span>雷达回波</span>
        </button>
        <button
          :class="['layer-btn', { active: activeLayer === 'heatmap' }]"
          @click="activeLayer = 'heatmap'"
        >
          <span class="layer-icon">🌡️</span>
          <span>温度热力</span>
        </button>
      </div>

      <!-- 图例 -->
      <div class="map-legend">
        <div class="legend-title">回波强度</div>
        <div class="legend-items">
          <div class="legend-item">
            <span class="legend-color" style="background: #52c41a"></span>
            <span>弱</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #1890ff"></span>
            <span>中</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #fa8c16"></span>
            <span>强</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #f5222d"></span>
            <span>极强</span>
          </div>
        </div>
      </div>

      <!-- 站点信息 -->
      <div v-if="selectedStation" class="station-info">
        <div class="info-header">
          <span class="info-title">{{ selectedStation.name }}</span>
          <span class="info-close" @click="selectedStation = null">×</span>
        </div>
        <div class="info-content">
          <div class="info-row">
            <span class="info-label">天气</span>
            <span class="info-value">{{ selectedStation.weatherText }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">温度</span>
            <span class="info-value">{{ selectedStation.temperature }}°C</span>
          </div>
          <div class="info-row">
            <span class="info-label">湿度</span>
            <span class="info-value">{{ selectedStation.humidity }}%</span>
          </div>
          <div class="info-row">
            <span class="info-label">风速</span>
            <span class="info-value">{{ selectedStation.windSpeed }} m/s</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.radar-map {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: $radius-lg;
  overflow: hidden;
}

.map-container {
  width: 100%;
  height: 100%;
}

.map-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  background: rgba(10, 22, 40, 0.9);
  color: $accent;
  font-size: $font-sm;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 212, 255, 0.2);
  border-top-color: $accent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.map-error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  background: linear-gradient(135deg, #0a1628 0%, #0d2137 100%);
  color: $accent;
}

.error-icon {
  font-size: 64px;
}

.error-text {
  font-size: $font-base;
  color: rgba(255, 255, 255, 0.6);
}

.error-stations {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
  margin-top: $spacing-lg;
  padding: $spacing-lg;
  background: rgba(13, 31, 60, 0.5);
  border-radius: $radius-lg;
}

.station-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: $spacing-sm $spacing-md;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: $radius-md;
}

.station-name {
  font-size: $font-sm;
  color: #fff;
}

.station-temp {
  font-family: 'DIN', monospace;
  font-size: $font-lg;
  font-weight: bold;
  color: $accent;
}

.map-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.layer-controls {
  position: absolute;
  top: $spacing-lg;
  left: $spacing-lg;
  display: flex;
  gap: $spacing-sm;
  pointer-events: auto;
}

.layer-btn {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  padding: 8px 16px;
  background: rgba(13, 31, 60, 0.9);
  border: 1px solid #1a3a5c;
  border-radius: $radius-md;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba(0, 212, 255, 0.1);
    border-color: rgba(0, 212, 255, 0.3);
  }

  &.active {
    background: rgba(0, 212, 255, 0.2);
    border-color: $accent;
    color: #fff;
  }
}

.layer-icon {
  font-size: 16px;
}

.map-legend {
  position: absolute;
  bottom: $spacing-lg;
  right: $spacing-lg;
  background: rgba(13, 31, 60, 0.9);
  border: 1px solid #1a3a5c;
  border-radius: $radius-md;
  padding: $spacing-md;
  pointer-events: auto;
}

.legend-title {
  font-size: $font-sm;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: $spacing-sm;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-xs;
  color: rgba(255, 255, 255, 0.7);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.station-info {
  position: absolute;
  top: $spacing-lg;
  right: $spacing-lg;
  width: 220px;
  background: rgba(13, 31, 60, 0.95);
  border: 1px solid #1a3a5c;
  border-radius: $radius-md;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  pointer-events: auto;
  animation: fadeIn 0.3s ease;
}

.info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #1a3a5c;
}

.info-title {
  font-size: $font-base;
  font-weight: bold;
  color: $accent;
}

.info-close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;

  &:hover {
    color: #fff;
  }
}

.info-content {
  padding: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(26, 58, 92, 0.5);
  }
}

.info-label {
  font-size: $font-sm;
  color: rgba(255, 255, 255, 0.6);
}

.info-value {
  font-size: $font-sm;
  font-weight: bold;
  color: #fff;
}

// 高德地图信息窗口自定义样式
:deep(.amap-info-content) {
  background: rgba(13, 31, 60, 0.95) !important;
  border: 1px solid #1a3a5c !important;
  border-radius: $radius-md !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
}

:deep(.amap-info-sharp) {
  border-top-color: #1a3a5c !important;
}
</style>
