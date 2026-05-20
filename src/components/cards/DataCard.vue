<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'

const props = defineProps<{
  title: string
  value: number | string
  unit?: string
  icon?: string
  trend?: 'up' | 'down' | 'stable'
  color?: string
  decimals?: number
}>()

const displayValue = ref(0)
const isAnimating = ref(false)
const animationFrame = ref<number>()

const isNumeric = computed(() => typeof props.value === 'number')
const formattedValue = computed(() => {
  if (!isNumeric.value) return props.value
  return displayValue.value.toFixed(props.decimals ?? 1)
})

function animateValue(start: number, end: number, duration: number = 800) {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
  }

  isAnimating.value = true
  const startTime = performance.now()
  const difference = end - start

  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // easeOutCubic 缓动函数
    const easeOutCubic = 1 - Math.pow(1 - progress, 3)
    displayValue.value = start + difference * easeOutCubic

    if (progress < 1) {
      animationFrame.value = requestAnimationFrame(update)
    } else {
      displayValue.value = end
      isAnimating.value = false
    }
  }

  animationFrame.value = requestAnimationFrame(update)
}

watch(() => props.value, (newVal, oldVal) => {
  if (typeof newVal === 'number' && typeof oldVal === 'number') {
    animateValue(oldVal, newVal)
  } else {
    displayValue.value = typeof newVal === 'number' ? newVal : 0
  }
})

onMounted(() => {
  if (typeof props.value === 'number') {
    animateValue(0, props.value, 1200)
  }
})
</script>

<template>
  <div class="data-card" :style="{ '--accent-color': color || '#00d4ff' }">
    <div class="card-header">
      <span class="card-icon" v-if="icon">{{ icon }}</span>
      <span class="card-title">{{ title }}</span>
    </div>

    <div class="card-body">
      <span :class="['card-value', { 'animating': isAnimating }]">
        {{ isNumeric ? formattedValue : value }}
      </span>
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

    <div class="card-border-glow"></div>
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
    box-shadow: 0 0 25px rgba(0, 212, 255, 0.25);
    transform: translateY(-3px);

    .card-border-glow {
      opacity: 1;
    }
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
  transition: text-shadow 0.3s ease;

  &.animating {
    text-shadow: 0 0 30px rgba(0, 212, 255, 0.6);
  }
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

.card-border-glow {
  position: absolute;
  inset: 0;
  border: 2px solid var(--accent-color);
  border-radius: $radius-lg;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  animation: borderPulse 3s ease-in-out infinite;
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

@keyframes borderPulse {
  0%, 100% {
    border-color: rgba(0, 212, 255, 0.3);
  }
  50% {
    border-color: rgba(0, 212, 255, 0.6);
  }
}
</style>
