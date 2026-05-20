<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  data: { direction: string; speed: number; frequency: number }[]
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
    polar: {
      radius: ['30%', '80%']
    },
    angleAxis: {
      type: 'category',
      data: props.data.map(item => item.direction),
      axisLine: {
        lineStyle: {
          color: 'rgba(26, 58, 92, 0.8)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12
      }
    },
    radiusAxis: {
      axisLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(26, 58, 92, 0.5)',
          type: 'dashed'
        }
      }
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
        return `${data.name}风<br/>风速: ${props.data[data.dataIndex].speed} m/s<br/>频率: ${props.data[data.dataIndex].frequency}%`
      }
    },
    series: [
      {
        type: 'bar',
        data: props.data.map(item => item.frequency),
        coordinateSystem: 'polar',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00d4ff' },
            { offset: 1, color: '#1890ff' }
          ]),
          borderRadius: 4
        },
        barWidth: '60%'
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
  <div class="wind-rose-chart">
    <h3 class="chart-title">
      <span class="title-icon">🌬️</span>
      <span>风向频率玫瑰图</span>
    </h3>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style lang="scss" scoped>
.wind-rose-chart {
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
