<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { generateStationData, generateRadarData } from '@/mock/weather'
import type { StationData, RadarData } from '@/mock/weather'

const stations = ref<StationData[]>([])
const radarData = ref<RadarData[]>([])
const selectedStation = ref<StationData | null>(null)
const mapContainer = ref<HTMLElement>()

// 模拟地图中心点（北京）
const center = { lat: 39.9042, lng: 116.4074 }
const zoom = ref(10)

// 简化的地图渲染（实际项目中会使用高德地图或Mapbox）
function renderMap() {
  // 这里只是模拟地图效果
  // 实际项目中需要集成真正的地图SDK
}

onMounted(() => {
  stations.value = generateStationData()
  radarData.value = generateRadarData()
  renderMap()
})
</script>

<template>
  <div class="radar-map" ref="mapContainer">
    <!-- 地图背景 -->
    <div class="map-background">
      <div class="grid-overlay"></div>
      <div class="radar-sweep"></div>
    </div>

    <!-- 雷达回波层 -->
    <div class="radar-layer">
      <div
        v-for="(item, index) in radarData"
        :key="index"
        class="radar-point"
        :class="item.type"
        :style="{
          left: `${((item.lng - center.lng + 0.5) / 1.0) * 100}%`,
          top: `${((center.lat - item.lat + 0.5) / 1.0) * 100}%`,
          opacity: item.intensity
        }"
      ></div>
    </div>

    <!-- 站点标记层 -->
    <div class="station-layer">
      <div
        v-for="station in stations"
        :key="station.id"
        class="station-marker"
        :class="{ active: selectedStation?.id === station.id }"
        :style="{
          left: `${((station.lng - center.lng + 0.5) / 1.0) * 100}%`,
          top: `${((center.lat - station.lat + 0.5) / 1.0) * 100}%`
        }"
        @click="selectedStation = station"
      >
        <div class="marker-dot"></div>
        <div class="marker-pulse"></div>
        <div class="marker-label">{{ station.name }}</div>
      </div>
    </div>

    <!-- 站点信息弹窗 -->
    <div
      v-if="selectedStation"
      class="station-popup"
      :style="{
        left: `${((selectedStation.lng - center.lng + 0.5) / 1.0) * 100 + 2}%`,
        top: `${((center.lat - selectedStation.lat + 0.5) / 1.0) * 100 - 5}%`
      }"
    >
      <div class="popup-header">
        <span class="popup-title">{{ selectedStation.name }}</span>
        <span class="popup-close" @click="selectedStation = null">×</span>
      </div>
      <div class="popup-content">
        <div class="popup-row">
          <span class="popup-label">天气</span>
          <span class="popup-value">{{ selectedStation.weatherText }}</span>
        </div>
        <div class="popup-row">
          <span class="popup-label">温度</span>
          <span class="popup-value">{{ selectedStation.temperature }}°C</span>
        </div>
        <div class="popup-row">
          <span class="popup-label">湿度</span>
          <span class="popup-value">{{ selectedStation.humidity }}%</span>
        </div>
        <div class="popup-row">
          <span class="popup-label">风速</span>
          <span class="popup-value">{{ selectedStation.windSpeed }}级</span>
        </div>
      </div>
    </div>

    <!-- 地图控件 -->
    <div class="map-controls">
      <button class="control-btn" @click="zoom = Math.min(zoom + 1, 15)">+</button>
      <button class="control-btn" @click="zoom = Math.max(zoom - 1, 5)">-</button>
    </div>

    <!-- 图例 -->
    <div class="map-legend">
      <div class="legend-title">回波强度</div>
      <div class="legend-items">
        <div class="legend-item">
          <span class="legend-color light"></span>
          <span>弱</span>
        </div>
        <div class="legend-item">
          <span class="legend-color moderate"></span>
          <span>中</span>
        </div>
        <div class="legend-item">
          <span class="legend-color heavy"></span>
          <span>强</span>
        </div>
        <div class="legend-item">
          <span class="legend-color extreme"></span>
          <span>极强</span>
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
  background: linear-gradient(135deg, #0a1628 0%, #0d2137 100%);
  border-radius: $radius-lg;
  overflow: hidden;
}

.map-background {
  position: absolute;
  inset: 0;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 212, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
}

.radar-sweep {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  transform: translate(-50%, -50%);
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(0, 212, 255, 0.1) 30deg,
    transparent 60deg
  );
  animation: rotate 8s linear infinite;
}

.radar-layer {
  position: absolute;
  inset: 0;
}

.radar-point {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  filter: blur(5px);

  &.light {
    background: #52c41a;
    box-shadow: 0 0 15px rgba(82, 196, 26, 0.5);
  }

  &.moderate {
    background: #1890ff;
    box-shadow: 0 0 15px rgba(24, 144, 255, 0.5);
  }

  &.heavy {
    background: #fa8c16;
    box-shadow: 0 0 15px rgba(250, 140, 22, 0.5);
  }

  &.extreme {
    background: #f5222d;
    box-shadow: 0 0 15px rgba(245, 34, 45, 0.5);
  }
}

.station-layer {
  position: absolute;
  inset: 0;
}

.station-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;

  &:hover {
    z-index: 20;

    .marker-dot {
      transform: scale(1.3);
    }

    .marker-label {
      opacity: 1;
    }
  }

  &.active {
    .marker-dot {
      transform: scale(1.5);
      background: #00d4ff;
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
    }
  }
}

.marker-dot {
  width: 12px;
  height: 12px;
  background: #fff;
  border: 2px solid #00d4ff;
  border-radius: 50%;
  transition: all $transition-fast;
}

.marker-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(0, 212, 255, 0.5);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.marker-label {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  padding: 4px 8px;
  background: rgba(13, 31, 60, 0.9);
  border: 1px solid #1a3a5c;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
  opacity: 0;
  transition: opacity $transition-fast;
}

.station-popup {
  position: absolute;
  width: 200px;
  background: rgba(13, 31, 60, 0.95);
  border: 1px solid #1a3a5c;
  border-radius: $radius-md;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  z-index: 100;
  animation: fadeIn 0.3s ease;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #1a3a5c;
}

.popup-title {
  font-size: $font-base;
  font-weight: bold;
  color: $accent;
}

.popup-close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);

  &:hover {
    color: #fff;
  }
}

.popup-content {
  padding: 12px;
}

.popup-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(26, 58, 92, 0.5);
  }
}

.popup-label {
  font-size: $font-sm;
  color: rgba(255, 255, 255, 0.6);
}

.popup-value {
  font-size: $font-sm;
  font-weight: bold;
  color: #fff;
}

.map-controls {
  position: absolute;
  top: $spacing-lg;
  right: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.control-btn {
  width: 40px;
  height: 40px;
  background: rgba(13, 31, 60, 0.9);
  border: 1px solid #1a3a5c;
  border-radius: $radius-sm;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: rgba(0, 212, 255, 0.2);
    border-color: $accent;
  }
}

.map-legend {
  position: absolute;
  bottom: $spacing-lg;
  right: $spacing-lg;
  background: rgba(13, 31, 60, 0.9);
  border: 1px solid #1a3a5c;
  border-radius: $radius-md;
  padding: $spacing-md;
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

  &.light {
    background: #52c41a;
  }

  &.moderate {
    background: #1890ff;
  }

  &.heavy {
    background: #fa8c16;
  }

  &.extreme {
    background: #f5222d;
  }
}
</style>
