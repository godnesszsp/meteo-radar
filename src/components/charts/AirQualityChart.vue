<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  data: {
    aqi: number
    level: string
    pm25: number
    pm10: number
    o3: number
    no2: number
    so2: number
    co: number
  }
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function getAqiColor(aqi: number): string {
  if (aqi <= 50) return '#52c41a'
  if (aqi <= 100) return '#faad14'
  if (aqi <= 150) return '#fa8c16'
  if (aqi <= 200) return '#f5222d'
  return '#722ed1'
}

function initChart() {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chart) return

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 300,
        splitNumber: 6,
        axisLine: {
          lineStyle: {
            width: 20,
            color: [
              [0.17, '#52c41a'],
              [0.33, '#faad14'],
              [0.5, '#fa8c16'],
              [0.67, '#f5222d'],
              [1, '#722ed1']
            ]
          }
        },
        pointer: {
          itemStyle: {
            color: 'auto'
          },
          length: '60%',
          width: 6
        },
        axisTick: {
          distance: -20,
          length: 6,
          lineStyle: {
            color: '#fff',
            width: 1
          }
        },
        splitLine: {
          distance: -25,
          length: 15,
          lineStyle: {
            color: '#fff',
            width: 2
          }
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          distance: 30,
          fontSize: 12
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          color: getAqiColor(props.data.aqi),
          fontSize: 32,
          fontWeight: 'bold',
          offsetCenter: [0, '60%']
        },
        title: {
          offsetCenter: [0, '85%'],
          fontSize: 14,
          color: 'rgba(255, 255, 255, 0.6)'
        },
        data: [
          {
            value: props.data.aqi,
            name: `AQI ${props.data.level}`
          }
        ]
      }
    ],
    animationDuration: 2000
  }

  chart.setOption(option)
}

watch(() => props.data, () => {
  updateChart()
}, { deep: true })

onMounted(() => {
  initChart()

  window.addEventListener('resize', () => {
    chart?.resize()
  })
})
</script>

<template>
  <div class="air-quality-chart">
    <h3 class="chart-title">
      <span class="title-icon">🌿</span>
      <span>空气质量指数</span>
    </h3>

    <div class="chart-content">
      <div ref="chartRef" class="chart-container"></div>

      <div class="aqi-details">
        <div class="detail-item">
          <span class="detail-label">PM2.5</span>
          <span class="detail-value">{{ data.pm25 }} μg/m³</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">PM10</span>
          <span class="detail-value">{{ data.pm10 }} μg/m³</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">O₃</span>
          <span class="detail-value">{{ data.o3 }} μg/m³</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">NO₂</span>
          <span class="detail-value">{{ data.no2 }} μg/m³</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.air-quality-chart {
  @include card-base;
  padding: $spacing-lg;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-title {
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

.chart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chart-container {
  flex: 1;
  min-height: 150px;
}

.aqi-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-sm;
  margin-top: $spacing-md;
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
</style>
