<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue'
import * as echarts from 'echarts'
import { generateChinaData, weatherIconMap, getAqiLevel } from '@/mock/china'
import type { ProvinceData } from '@/mock/china'

interface Props {
  /** 地图数据模式：temperature | humidity | aqi */
  mode?: string
  /** 是否显示散点标记 */
  showMarkers?: boolean
  /** 地图高度 */
  height?: string
  /** 点击省份回调 */
  onProvinceClick?: (province: ProvinceData) => void
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'temperature',
  showMarkers: true,
  height: '100%',
})

const emit = defineEmits<{
  (e: 'province-click', province: ProvinceData): void
}>()

const chartRef = ref<HTMLElement>()
const chart = shallowRef<echarts.ECharts | null>(null)
const provinces = ref<ProvinceData[]>(generateChinaData())
const mapLoaded = ref(false)
const currentZoom = ref(1)

// 颜色映射
const colorSchemes: Record<string, { min: number; max: number; colors: string[] }> = {
  temperature: {
    min: -10,
    max: 40,
    colors: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#fee090', '#fdae61', '#f46d43', '#d73027'],
  },
  humidity: {
    min: 0,
    max: 100,
    colors: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594'],
  },
  aqi: {
    min: 0,
    max: 300,
    colors: ['#52c41a', '#a0d911', '#faad14', '#fa8c16', '#f5222d', '#722ed1'],
  },
}

// 获取当前模式的数据范围和颜色
function getVisualMap() {
  const scheme = colorSchemes[props.mode] || colorSchemes.temperature
  const labels: Record<string, string> = {
    temperature: '温度 (°C)',
    humidity: '湿度 (%)',
    aqi: 'AQI',
  }

  return {
    min: scheme.min,
    max: scheme.max,
    text: [labels[props.mode] || '', ''],
    inRange: {
      color: scheme.colors,
    },
    textStyle: {
      color: 'rgba(255,255,255,0.7)',
    },
  }
}

// 获取省份数据值
function getProvinceValue(name: string): number {
  const p = provinces.value.find(item => item.name === name)
  if (!p) return 0
  switch (props.mode) {
    case 'temperature': return p.temperature
    case 'humidity': return p.humidity
    case 'aqi': return p.aqi
    default: return p.temperature
  }
}

// 构建地图数据
function getMapData() {
  return provinces.value.map(p => ({
    name: p.name,
    value: getProvinceValue(p.name),
  }))
}

// 构建散点数据
function getScatterData() {
  return provinces.value.map(p => {
    const aqiInfo = getAqiLevel(p.aqi)
    return {
      name: p.name,
      value: [...p.center, p.temperature],
      province: p,
      itemStyle: {
        color: aqiInfo.color,
      },
    }
  })
}

async function loadMapGeoJson(): Promise<any> {
  // 从本地 public 目录加载
  try {
    const resp = await fetch('./china.json')
    if (resp.ok) {
      return await resp.json()
    }
  } catch {
    console.error('本地地图数据加载失败')
  }

  // 如果本地失败，尝试从 CDN 加载
  const urls = [
    'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json',
    'https://geojson.cn/api/data/100000_full.json',
  ]

  for (const url of urls) {
    try {
      const resp = await fetch(url)
      if (resp.ok) {
        return await resp.json()
      }
    } catch {
      continue
    }
  }

  return null
}

async function initChart() {
  if (!chartRef.value) return

  // 加载地图 GeoJSON
  const geoJson = await loadMapGeoJson()
  if (!geoJson) {
    console.error('中国地图数据加载失败')
    return
  }

  // 注册地图
  echarts.registerMap('china', geoJson)
  mapLoaded.value = true

  // 初始化图表
  chart.value = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chart.value || !mapLoaded.value) return

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(13, 31, 60, 0.95)',
      borderColor: '#1a3a5c',
      textStyle: { color: '#fff' },
      formatter: (params: any) => {
        if (params.seriesType === 'scatter') {
          const p: ProvinceData = params.data.province
          const aqiInfo = getAqiLevel(p.aqi)
          return `
            <div style="padding: 8px; min-width: 160px;">
              <div style="font-size: 16px; font-weight: bold; color: #00d4ff; margin-bottom: 8px;">
                ${weatherIconMap[p.weather] || ''} ${p.name}
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span style="color:rgba(255,255,255,0.6);">天气</span>
                <span>${p.weather}</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span style="color:rgba(255,255,255,0.6);">温度</span>
                <span style="color:#f5222d;font-weight:bold;">${p.temperature}°C</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span style="color:rgba(255,255,255,0.6);">湿度</span>
                <span>${p.humidity}%</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <span style="color:rgba(255,255,255,0.6);">风速</span>
                <span>${p.windSpeed} m/s</span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span style="color:rgba(255,255,255,0.6);">AQI</span>
                <span style="color:${aqiInfo.color};">${p.aqi} ${aqiInfo.level}</span>
              </div>
            </div>
          `
        }
        return params.name
      },
    },
    geo: {
      map: 'china',
      roam: true,
      zoom: currentZoom.value,
      scaleLimit: {
        min: 0.8,
        max: 15,
      },
      center: [104.5, 36],
      itemStyle: {
        areaColor: '#0d2137',
        borderColor: '#1a3a5c',
        borderWidth: 1,
      },
      emphasis: {
        itemStyle: {
          areaColor: '#1a5276',
          borderColor: '#00d4ff',
          borderWidth: 2,
        },
        label: {
          show: true,
          color: '#fff',
          fontSize: 12,
        },
      },
      select: {
        itemStyle: {
          areaColor: '#1a5276',
        },
        label: {
          color: '#fff',
        },
      },
      label: {
        show: false,
      },
    },
    visualMap: {
      ...getVisualMap(),
      left: 20,
      bottom: 20,
      calculable: true,
    },
    series: [
      {
        name: '气象数据',
        type: 'map' as const,
        geoIndex: 0,
        data: getMapData(),
      },
      ...(props.showMarkers
        ? [
            {
              name: '站点',
              type: 'scatter' as const,
              coordinateSystem: 'geo' as const,
              data: getScatterData(),
              symbol: 'circle',
              symbolSize: (val: any) => {
                return 8 + Math.abs(val[2]) / 5
              },
              label: {
                show: true,
                formatter: '{b}',
                position: 'right' as const,
                color: 'rgba(255,255,255,0.8)',
                fontSize: 10,
              },
              emphasis: {
                itemStyle: {
                  borderColor: '#fff',
                  borderWidth: 2,
                },
              },
            },
          ]
        : []),
    ],
  }

  chart.value.setOption(option, true)
}

// 监听模式变化
watch(() => props.mode, () => {
  updateChart()
})

// 监听数据变化
watch(provinces, () => {
  updateChart()
}, { deep: true })

// 处理点击事件
function handleClick(params: any) {
  if (params.seriesType === 'scatter' && params.data?.province) {
    emit('province-click', params.data.province)
  }
}

onMounted(() => {
  initChart()

  window.addEventListener('resize', () => {
    chart.value?.resize()
  })

  chart.value?.on('click', handleClick)
})

onUnmounted(() => {
  chart.value?.off('click', handleClick)
  chart.value?.dispose()
})
</script>

<template>
  <div class="china-map" :style="{ height }">
    <div ref="chartRef" class="chart-container"></div>
    <div v-if="!mapLoaded" class="map-loading">
      <div class="loading-spinner"></div>
      <span>地图加载中...</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.china-map {
  position: relative;
  width: 100%;
  border-radius: $radius-lg;
  overflow: hidden;
}

.chart-container {
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
  to {
    transform: rotate(360deg);
  }
}
</style>
