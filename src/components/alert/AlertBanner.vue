<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { NButton } from 'naive-ui'
import { useWarningStore } from '@/stores/warning'
import { warningColors, warningIcons } from '@/mock/weather'

const router = useRouter()
const warningStore = useWarningStore()

const countdown = ref(15)
let countdownTimer: ReturnType<typeof setInterval> | null = null

function startCountdown() {
  countdown.value = 15
  stopCountdown()
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      warningStore.dismissAlert()
    }
  }, 1000)
}

function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

watch(
  () => warningStore.activeAlert,
  (alert) => {
    if (alert) {
      startCountdown()
    } else {
      stopCountdown()
    }
  }
)

onUnmounted(() => {
  stopCountdown()
})

function handleViewDetails() {
  warningStore.dismissAlert()
  router.push('/warning')
}

function handleDismiss() {
  warningStore.dismissAlert()
}
</script>

<template>
  <transition name="alert-banner">
    <div v-if="warningStore.activeAlert" class="alert-banner-overlay" @click.self="handleDismiss">
      <div
        class="alert-banner-content"
        :class="warningStore.activeAlert.warning.level"
        :style="{ borderColor: warningColors[warningStore.activeAlert.warning.level] }"
      >
        <div class="alert-banner-icon">
          {{ warningIcons[warningStore.activeAlert.warning.type] }}
        </div>
        <div
          class="alert-banner-title"
          :style="{ color: warningColors[warningStore.activeAlert.warning.level] }"
        >
          {{ warningStore.activeAlert.warning.title }}
        </div>
        <div class="alert-banner-body">
          {{ warningStore.activeAlert.warning.content }}
        </div>
        <div class="alert-banner-meta">
          <span class="meta-tag">
            <span class="meta-icon">📍</span>
            {{ warningStore.activeAlert.warning.region }}
          </span>
          <span class="meta-tag">
            <span class="meta-icon">🕐</span>
            {{ warningStore.activeAlert.warning.publishTime }}
          </span>
          <span class="meta-tag">
            <span class="meta-icon">⏳</span>
            {{ warningStore.activeAlert.warning.effectiveTime }} ~ {{ warningStore.activeAlert.warning.expireTime }}
          </span>
        </div>
        <div class="alert-banner-actions">
          <n-button type="error" size="large" @click="handleViewDetails">
            查看详情
          </n-button>
          <n-button quaternary size="large" @click="handleDismiss">
            关闭 ({{ countdown }}s)
          </n-button>
        </div>
        <div class="countdown-bar">
          <div class="countdown-progress" :style="{ width: `${(countdown / 15) * 100}%` }"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.alert-banner-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.alert-banner-content {
  @include glass-effect;
  position: relative;
  width: 560px;
  max-width: 90vw;
  padding: $spacing-2xl;
  border-top: 4px solid;
  text-align: center;
  overflow: hidden;
}

.alert-banner-icon {
  font-size: 64px;
  margin-bottom: $spacing-lg;
  animation: pulse 1.5s ease-in-out infinite;
}

.alert-banner-title {
  font-size: $font-2xl;
  font-weight: bold;
  margin-bottom: $spacing-md;
}

.alert-banner-body {
  font-size: $font-base;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  margin-bottom: $spacing-lg;
}

.alert-banner-meta {
  display: flex;
  justify-content: center;
  gap: $spacing-md;
  flex-wrap: wrap;
  margin-bottom: $spacing-xl;
}

.meta-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: $radius-sm;
  font-size: $font-xs;
  color: rgba(255, 255, 255, 0.7);
}

.meta-icon {
  font-size: 14px;
}

.alert-banner-actions {
  display: flex;
  justify-content: center;
  gap: $spacing-md;
}

.countdown-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
}

.countdown-progress {
  height: 100%;
  background: $accent;
  transition: width 1s linear;
}

// 过渡动画
.alert-banner-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.alert-banner-leave-active {
  transition: all 0.3s ease-in;
}

.alert-banner-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.alert-banner-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
