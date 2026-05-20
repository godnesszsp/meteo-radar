<script setup lang="ts">
import { ref } from 'vue'
import type { WarningData } from '@/mock/weather'
import { warningColors, warningIcons } from '@/mock/weather'

defineProps<{
  warnings: WarningData[]
}>()

const selectedWarning = ref<WarningData | null>(null)
</script>

<template>
  <div class="warning-list">
    <h3 class="list-title">
      <span class="title-icon">⚠️</span>
      <span>预警信息</span>
      <span class="warning-count">{{ warnings.length }}</span>
    </h3>

    <div class="list-content">
      <div
        v-for="warning in warnings"
        :key="warning.id"
        :class="['warning-item', warning.level]"
        @click="selectedWarning = warning"
      >
        <div class="warning-header">
          <span class="warning-icon">{{ warningIcons[warning.type] }}</span>
          <span class="warning-title">{{ warning.title }}</span>
          <span
            class="warning-badge"
            :style="{ background: warningColors[warning.level] }"
          >
            {{ warning.level === 'red' ? '红色' : warning.level === 'orange' ? '橙色' : warning.level === 'yellow' ? '黄色' : '蓝色' }}
          </span>
        </div>

        <div class="warning-body">
          <p class="warning-content">{{ warning.content }}</p>
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
        </div>

        <div class="warning-pulse"></div>
      </div>

      <div v-if="warnings.length === 0" class="empty-state">
        <span class="empty-icon">✅</span>
        <span class="empty-text">暂无预警信息</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.warning-list {
  @include card-base;
  padding: $spacing-lg;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-title {
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

.warning-count {
  margin-left: auto;
  padding: 2px 10px;
  background: rgba(245, 34, 45, 0.2);
  border: 1px solid rgba(245, 34, 45, 0.5);
  border-radius: 12px;
  font-size: $font-sm;
  color: $danger;
}

.list-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  @include scrollbar;
}

.warning-item {
  position: relative;
  padding: $spacing-md;
  background: rgba(13, 31, 60, 0.5);
  border-radius: $radius-md;
  cursor: pointer;
  overflow: hidden;
  transition: all $transition-normal;

  &:hover {
    background: rgba(13, 31, 60, 0.8);
    transform: translateX(4px);
  }

  &.red {
    border-left: 4px solid #f5222d;
  }

  &.orange {
    border-left: 4px solid #fa8c16;
  }

  &.yellow {
    border-left: 4px solid #faad14;
  }

  &.blue {
    border-left: 4px solid #1890ff;
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
  font-size: $font-base;
  font-weight: bold;
  color: #fff;
}

.warning-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: $font-xs;
  color: #fff;
}

.warning-body {
  padding-left: 32px;
}

.warning-content {
  font-size: $font-sm;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: $spacing-sm;
}

.warning-meta {
  display: flex;
  gap: $spacing-lg;
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
  background: linear-gradient(90deg, transparent 70%, rgba(245, 34, 45, 0.1) 100%);
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
</style>
