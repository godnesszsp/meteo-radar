<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { ForecastData } from '@/mock/weather'
import { weatherIcons } from '@/mock/weather'

const props = defineProps<{
  data: ForecastData[]
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
      top: 60,
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
        const index = params[0].dataIndex
        const forecast = props.data[index]
        return `
          <div style="padding: 8px;">
            <div style="font-size: 16px; margin-bottom: 8px;">${forecast.date} ${forecast.dayOfWeek}</div>
            <div style="margin-bottom: 4px;">${weatherIcons[forecast.weather]} ${forecast.weatherText}</div>
            <div style="margin-bottom: 4px;">温度: ${forecast.tempHigh}°C / ${forecast.tempLow}°C</div>
            <div style="margin-bottom: 4px;">湿度: ${forecast.humidity}%</div>
            <div style="margin-bottom: 4px;">风: ${forecast.windDirection} ${forecast.windSpeed}级</div>
            <div>降水概率: ${forecast.precipitationProb}%</div>
          </div>
        `
      }
    },
    legend: {
      data: ['最高温度', '最低温度', '降水概率'],
      textStyle: {
        color: 'rgba(255, 255, 255, 0.7)'
      },
      top: 10
    },
    xAxis: {
      type: 'category',
      data: props.data.map(item => `${item.date}\n${item.dayOfWeek}`),
      axisLine: {
        lineStyle: {
          color: '#1a3a5c'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        interval: 0
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '温度(°C)',
        axisLine: {
          show: false
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 12
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(26, 58, 92, 0.5)',
            type: 'dashed'
          }
        }
      },
      {
        type: 'value',
        name: '降水(%)',
        max: 100,
        axisLine: {
          show: false
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 12
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '最高温度',
        type: 'line',
        data: props.data.map(item => item.tempHigh),
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: {
          color: '#f5222d',
          width: 3
        },
        itemStyle: {
          color: '#f5222d'
        }
      },
      {
        name: '最低温度',
        type: 'line',
        data: props.data.map(item => item.tempLow),
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: {
          color: '#1890ff',
          width: 3
        },
        itemStyle: {
          color: '#1890ff'
        }
      },
      {
        name: '降水概率',
        type: 'bar',
        yAxisIndex: 1,
        data: props.data.map(item => item.precipitationProb),
        barWidth: 30,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 212, 255, 0.8)' },
            { offset: 1, color: 'rgba(0, 212, 255, 0.2)' }
          ]),
          borderRadius: [4, 4, 0, 0]
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
  <div class="forecast-chart">
    <h3 class="chart-title">
      <span class="title-icon">📅</span>
      <span>7天天气预测</span>
    </h3>
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<style lang="scss" scoped>
.forecast-chart {
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
  min-height: 250px;
}
</style>
