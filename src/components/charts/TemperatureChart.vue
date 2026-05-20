<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  data: { hour: string; temp: number }[]
}>()

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  updateChart()
}

function updateChart() {
  if (!chart) return

  const option: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    grid: {
      top: 40,
      right: 20,
      bottom: 40,
      left: 60
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(13, 31, 60, 0.9)',
      borderColor: '#1a3a5c',
      textStyle: {
        color: '#fff'
      },
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>温度: ${data.value}°C`
      }
    },
    xAxis: {
      type: 'category',
      data: props.data.map(item => item.hour),
      axisLine: {
        lineStyle: {
          color: '#1a3a5c'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        formatter: '{value}°C'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(26, 58, 92, 0.5)',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        type: 'line',
        data: props.data.map(item => item.temp),
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#00d4ff',
          width: 3
        },
        itemStyle: {
          color: '#00d4ff',
          borderColor: '#0d1f3c',
          borderWidth: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
            { offset: 1, color: 'rgba(0, 212, 255, 0)' }
          ])
        }
      }
    ],
    animationDuration: 2000,
    animationEasing: 'cubicOut'
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
  <div class="temperature-chart">
    <h3 class="chart-title">
      <span class="title-icon">🌡️</span>
      <span>24小时温度曲线</span>
    </h3>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style lang="scss" scoped>
.temperature-chart {
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

.chart-container {
  flex: 1;
  min-height: 200px;
}
</style>
