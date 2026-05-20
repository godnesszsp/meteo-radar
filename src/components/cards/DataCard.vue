<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  title: string
  value: number | string
  unit?: string
  icon?: string
  trend?: 'up' | 'down' | 'stable'
  color?: string
}>()

const displayValue = ref(props.value)

watch(() => props.value, (newVal) => {
  displayValue.value = newVal
})
</script>

<template>
  <div class="data-card" :style="{ '--accent-color': color || '#00d4ff' }">
    <div class="card-header">
      <span class="card-icon" v-if="icon">{{ icon }}</span>
      <span class="card-title">{{ title }}</span>
    </div>

    <div class="card-body">
      <span class="card-value">{{ displayValue }}</span>
      <span class="card-unit" v-if="unit">{{ unit }}</span>
    </div>

    <div class="card-trend" v-if="trend">
      <span :class="['trend-icon', trend]">
        {{ trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→' }}
      </span>
      <span class="trend-text">
        {{ trend === 'up' ? '上升' : trend === 'down' ? '下降' : '稳定' }}
      </span>
    </div>

    <div class="card-glow"></div>
  </div>
</template>

<style lang="scss" scoped>
.data-card {
  position: relative;
  padding: $spacing-lg;
  background: $dark-card;
  border: 1px solid $dark-border;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: all $transition-normal;

  &:hover {
    border-color: var(--accent-color);
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
    transform: translateY(-2px);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-md;
}

.card-icon {
  font-size: 24px;
}

.card-title {
  font-size: $font-sm;
  color: rgba(255, 255, 255, 0.7);
}

.card-body {
  display: flex;
  align-items: baseline;
  gap: $spacing-xs;
}

.card-value {
  font-family: 'DIN', monospace;
  font-size: $font-3xl;
  font-weight: bold;
  color: var(--accent-color);
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
}

.card-unit {
  font-size: $font-base;
  color: rgba(255, 255, 255, 0.5);
}

.card-trend {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  margin-top: $spacing-sm;
}

.trend-icon {
  font-size: $font-sm;

  &.up {
    color: $danger;
  }

  &.down {
    color: $success;
  }

  &.stable {
    color: $accent;
  }
}

.trend-text {
  font-size: $font-xs;
  color: rgba(255, 255, 255, 0.5);
}

.card-glow {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, var(--accent-color) 0%, transparent 70%);
  opacity: 0.05;
  pointer-events: none;
}
</style>
