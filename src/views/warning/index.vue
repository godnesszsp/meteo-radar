<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ChinaMap from '@/components/map/ChinaMap.vue'
import { generateWarningData, warningColors, warningIcons } from '@/mock/weather'
import type { WarningData, WarningLevel } from '@/mock/weather'

const warnings = ref<WarningData[]>(generateWarningData())
const selectedWarning = ref<WarningData | null>(null)
const filterLevel = ref<WarningLevel | 'all'>('all')

let refreshTimer: ReturnType<typeof setInterval>

// 筛选后的预警列表
const filteredWarnings = computed(() => {
  if (filterLevel.value === 'all') return warnings.value
  return warnings.value.filter(w => w.level === filterLevel.value)
})

// 预警统计
const warningStats = computed(() => {
  const stats = { red: 0, orange: 0, yellow: 0, blue: 0 }
  warnings.value.forEach(w => {
    stats[w.level]++
  })
  return stats
})

// 筛选选项
const filterOptions = [
  { value: 'all', label: '全部', count: warnings.value.length },
  { value: 'red', label: '红色', count: warningStats.value.red },
  { value: 'orange', label: '橙色', count: warningStats.value.orange },
  { value: 'yellow', label: '黄色', count: warningStats.value.yellow },
  { value: 'blue', label: '蓝色', count: warningStats.value.blue },
]

// 选择预警
function selectWarning(warning: WarningData) {
  selectedWarning.value = warning
}

// 关闭详情
function closeDetail() {
  selectedWarning.value = null
}

// 获取级别文本
function getLevelText(level: WarningLevel): string {
  const map: Record<WarningLevel, string> = {
    red: '红色',
    orange: '橙色',
    yellow: '黄色',
    blue: '蓝色',
  }
  return map[level]
}

// 获取级别样式类
function getLevelClass(level: WarningLevel): string {
  return `level-${level}`
}

onMounted(() => {
  // 每30秒刷新预警数据
  refreshTimer = setInterval(() => {
    warnings.value = generateWarningData()
  }, 30000)
})

onUnmounted(() => {
  clearInterval(refreshTimer)
})
</script>

<template>
  <DashboardLayout>
    <div class="warning-page">
      <!-- 左侧预警列表 -->
      <div class="warning-panel">
        <!-- 预警统计 -->
        <div class="stats-card">
          <h3 class="card-title">
            <span class="title-icon">📊</span>
            <span>预警统计</span>
          </h3>
          <div class="stats-grid">
            <div
              v-for="opt in filterOptions"
              :key="opt.value"
              :class="['stat-item', opt.value, { active: filterLevel === opt.value }]"
              @click="filterLevel = opt.value as any"
            >
              <span class="stat-count">{{ opt.count }}</span>
              <span class="stat-label">{{ opt.label }}</span>
            </div>
          </div>
        </div>

        <!-- 预警列表 -->
        <div class="warning-list-card">
          <h3 class="card-title">
            <span class="title-icon">⚠️</span>
            <span>预警信息</span>
            <span class="warning-badge">{{ filteredWarnings.length }}</span>
          </h3>

          <div class="warning-list">
            <div
              v-for="warning in filteredWarnings"
              :key="warning.id"
              :class="['warning-item', warning.level, { active: selectedWarning?.id === warning.id }]"
              @click="selectWarning(warning)"
            >
              <div class="warning-header">
                <span class="warning-icon">{{ warningIcons[warning.type] }}</span>
                <span class="warning-title">{{ warning.title }}</span>
                <span
                  class="warning-level"
                  :style="{ background: warningColors[warning.level] }"
                >
                  {{ getLevelText(warning.level) }}
                </span>
              </div>

              <div class="warning-meta">
                <span class="meta-item">
                  <span class="meta-icon">📍</span>
                  {{ warning.region }}
                </span>
                <span class="meta-item">
                  <span class="meta-icon">🕐</span>
                  {{ warning.publishTime }}
                </span>
              </div>

              <div class="warning-pulse" :class="warning.level"></div>
            </div>

            <div v-if="filteredWarnings.length === 0" class="empty-state">
              <span class="empty-icon">✅</span>
              <span class="empty-text">暂无该级别预警</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 中央地图 -->
      <div class="map-container">
        <div class="map-wrapper">
          <h3 class="card-title">
            <span class="title-icon">🗺️</span>
            <span>预警地图分布</span>
          </h3>
          <ChinaMap mode="aqi" :show-markers="true" height="calc(100% - 48px)" />
        </div>
      </div>

      <!-- 右侧详情 -->
      <transition name="slide">
        <div v-if="selectedWarning" class="detail-panel">
          <div class="detail-header">
            <div class="detail-title">
              <span class="detail-icon">{{ warningIcons[selectedWarning.type] }}</span>
              <span>{{ selectedWarning.title }}</span>
            </div>
            <button class="close-btn" @click="closeDetail">×</button>
          </div>

          <div class="detail-content">
            <!-- 级别标签 -->
            <div class="level-tag" :class="getLevelClass(selectedWarning.level)">
              {{ getLevelText(selectedWarning.level) }}预警
            </div>

            <!-- 预警内容 -->
            <div class="warning-content">
              <p>{{ selectedWarning.content }}</p>
            </div>

            <!-- 详细信息 -->
            <div class="info-grid">
              <div class="info-item">
                <span class="info-icon">📍</span>
                <div class="info-text">
                  <span class="info-label">影响区域</span>
                  <span class="info-value">{{ selectedWarning.region }}</span>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">📅</span>
                <div class="info-text">
                  <span class="info-label">发布时间</span>
                  <span class="info-value">{{ selectedWarning.publishTime }}</span>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">⏰</span>
                <div class="info-text">
                  <span class="info-label">生效时间</span>
                  <span class="info-value">{{ selectedWarning.effectiveTime }}</span>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">⏳</span>
                <div class="info-text">
                  <span class="info-label">过期时间</span>
                  <span class="info-value">{{ selectedWarning.expireTime }}</span>
                </div>
              </div>
            </div>

            <!-- 防御指南 -->
            <div class="defense-guide">
              <h4 class="guide-title">
                <span class="guide-icon">🛡️</span>
                <span>防御指南</span>
              </h4>
              <ul class="guide-list">
                <li>关注最新天气预报和预警信息</li>
                <li>做好防寒/防暑/防雨等准备工作</li>
                <li>减少不必要的户外活动</li>
                <li>注意人身和财产安全</li>
              </ul>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </DashboardLayout>
</template>

<style lang="scss" scoped>
.warning-page {
  display: flex;
  width: 100%;
  height: 100%;
  gap: $spacing-lg;
  animation: fadeIn 0.5s ease;
}

.warning-panel {
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  animation: slideInLeft 0.6s ease;
}

.stats-card {
  @include card-base;
  padding: $spacing-lg;
}

.card-title {
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

.warning-badge {
  margin-left: auto;
  padding: 2px 10px;
  background: rgba(245, 34, 45, 0.2);
  border: 1px solid rgba(245, 34, 45, 0.5);
  border-radius: 12px;
  font-size: $font-xs;
  color: $danger;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: $spacing-sm;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $spacing-sm;
  background: rgba(13, 31, 60, 0.5);
  border-radius: $radius-sm;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    transform: translateY(-2px);
  }

  &.active {
    border: 1px solid;
  }

  &.all {
    border-color: $accent;
  }

  &.red {
    border-color: #f5222d;
    .stat-count { color: #f5222d; }
  }

  &.orange {
    border-color: #fa8c16;
    .stat-count { color: #fa8c16; }
  }

  &.yellow {
    border-color: #faad14;
    .stat-count { color: #faad14; }
  }

  &.blue {
    border-color: #1890ff;
    .stat-count { color: #1890ff; }
  }
}

.stat-count {
  font-family: 'DIN', monospace;
  font-size: $font-xl;
  font-weight: bold;
  color: #fff;
}

.stat-label {
  font-size: $font-xs;
  color: rgba(255, 255, 255, 0.5);
}

.warning-list-card {
  @include card-base;
  padding: $spacing-lg;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.warning-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

  @include scrollbar;
}

.warning-item {
  position: relative;
  padding: $spacing-md;
  background: rgba(13, 31, 60, 0.5);
  border-radius: $radius-md;
  cursor: pointer;
  overflow: hidden;
  transition: all $transition-fast;
  border-left: 4px solid transparent;

  &:hover {
    background: rgba(13, 31, 60, 0.8);
    transform: translateX(4px);
  }

  &.active {
    background: rgba(0, 212, 255, 0.1);
    border-color: $accent;
  }

  &.red {
    border-left-color: #f5222d;
  }

  &.orange {
    border-left-color: #fa8c16;
  }

  &.yellow {
    border-left-color: #faad14;
  }

  &.blue {
    border-left-color: #1890ff;
  }
}

.warning-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-sm;
}

.warning-icon {
  font-size: 20px;
}

.warning-title {
  flex: 1;
  font-size: $font-sm;
  font-weight: bold;
  color: #fff;
}

.warning-level {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: $font-xs;
  color: #fff;
}

.warning-meta {
  display: flex;
  gap: $spacing-lg;
  padding-left: 32px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: $font-xs;
  color: rgba(255, 255, 255, 0.5);
}

.meta-icon {
  font-size: 14px;
}

.warning-pulse {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 70%, rgba(245, 34, 45, 0.05) 100%);
  animation: pulse 3s ease-in-out infinite;
  pointer-events: none;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
}

.empty-icon {
  font-size: 48px;
}

.empty-text {
  font-size: $font-base;
  color: rgba(255, 255, 255, 0.5);
}

.map-container {
  flex: 1;
  animation: fadeIn 0.8s ease;
}

.map-wrapper {
  @include card-base;
  padding: $spacing-lg;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-panel {
  width: 360px;
  @include card-base;
  padding: $spacing-lg;
  animation: slideInRight 0.3s ease;
  overflow-y: auto;

  @include scrollbar;
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
  font-size: $font-lg;
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

.level-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  border-radius: $radius-md;
  font-size: $font-base;
  font-weight: bold;
  color: #fff;

  &.level-red {
    background: linear-gradient(135deg, #f5222d, #cf1322);
    box-shadow: 0 0 20px rgba(245, 34, 45, 0.3);
  }

  &.level-orange {
    background: linear-gradient(135deg, #fa8c16, #d46b08);
    box-shadow: 0 0 20px rgba(250, 140, 22, 0.3);
  }

  &.level-yellow {
    background: linear-gradient(135deg, #faad14, #d48806);
    box-shadow: 0 0 20px rgba(250, 173, 20, 0.3);
  }

  &.level-blue {
    background: linear-gradient(135deg, #1890ff, #096dd9);
    box-shadow: 0 0 20px rgba(24, 144, 255, 0.3);
  }
}

.warning-content {
  padding: $spacing-lg;
  background: rgba(13, 31, 60, 0.5);
  border-radius: $radius-md;
  border-left: 3px solid $accent;

  p {
    font-size: $font-sm;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.8);
  }
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.info-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: rgba(13, 31, 60, 0.5);
  border-radius: $radius-md;
}

.info-icon {
  font-size: 24px;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: $font-xs;
  color: rgba(255, 255, 255, 0.5);
}

.info-value {
  font-size: $font-sm;
  color: #fff;
}

.defense-guide {
  padding: $spacing-lg;
  background: rgba(82, 196, 26, 0.05);
  border: 1px solid rgba(82, 196, 26, 0.2);
  border-radius: $radius-md;
}

.guide-title {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-base;
  color: $success;
  margin-bottom: $spacing-md;
}

.guide-icon {
  font-size: 20px;
}

.guide-list {
  margin: 0;
  padding-left: $spacing-lg;

  li {
    font-size: $font-sm;
    color: rgba(255, 255, 255, 0.7);
    line-height: 2;
  }
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
