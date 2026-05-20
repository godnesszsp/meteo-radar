<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import { useAppStore } from '@/stores/app'
import AiChatDrawer from '@/components/ai-chat/AiChatDrawer.vue'

const appStore = useAppStore()
const currentTime = ref(dayjs().format('HH:mm:ss'))
const currentDate = ref(dayjs().format('YYYY年MM月DD日'))
const isFullscreen = ref(false)

let timer: ReturnType<typeof setInterval>

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = dayjs().format('HH:mm:ss')
    currentDate.value = dayjs().format('YYYY年MM月DD日')
  }, 1000)

  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  clearInterval(timer)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<template>
  <div class="dashboard-layout">
    <!-- 顶部标题栏 -->
    <header class="dashboard-header">
      <div class="header-left">
        <div class="logo">
          <span class="logo-icon">📡</span>
          <span class="logo-text">MeteoRadar</span>
        </div>
        <h1 class="title">气象雷达预测系统</h1>
      </div>

      <div class="header-center">
        <div class="time-display">
          <span class="time">{{ currentTime }}</span>
          <span class="date">{{ currentDate }}</span>
        </div>
      </div>

      <div class="header-right">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button quaternary circle class="header-btn" @click="appStore.toggleAiDrawer">
              <template #icon>
                <span class="btn-icon">🤖</span>
              </template>
            </n-button>
          </template>
          AI气象助手
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button quaternary circle class="header-btn" @click="toggleFullscreen">
              <template #icon>
                <span class="btn-icon">{{ isFullscreen ? '🔲' : '⛶' }}</span>
              </template>
            </n-button>
          </template>
          {{ isFullscreen ? '退出全屏' : '全屏模式' }}
        </n-tooltip>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="dashboard-main">
      <slot />
    </main>

    <!-- 底部状态栏 -->
    <footer class="dashboard-footer">
      <div class="status-item">
        <span class="status-dot online"></span>
        <span class="status-label">系统状态</span>
        <span class="status-value">正常运行</span>
      </div>
      <div class="status-item">
        <span class="status-icon">🕐</span>
        <span class="status-label">数据更新</span>
        <span class="status-value">{{ currentTime }}</span>
      </div>
      <div class="status-item">
        <span class="status-icon">📡</span>
        <span class="status-label">在线站点</span>
        <span class="status-value">128 / 130</span>
      </div>
      <div class="status-item">
        <span class="status-icon">⚠️</span>
        <span class="status-label">预警信息</span>
        <span class="status-value warning">3 条</span>
      </div>
      <div class="status-item">
        <span class="status-icon">📊</span>
        <span class="status-label">数据采集</span>
        <span class="status-value">实时</span>
      </div>
    </footer>

    <!-- AI对话抽屉 -->
    <AiChatDrawer />
  </div>
</template>

<style lang="scss" scoped>
.dashboard-layout {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $gradient-blue;
  color: #fff;
  overflow: hidden;
}

.dashboard-header {
  position: relative;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $spacing-xl;
  background: rgba(13, 31, 60, 0.9);
  border-bottom: 1px solid $dark-border;
  backdrop-filter: blur(10px);
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, $accent, $purple, $accent, transparent);
    animation: headerGlow 3s ease-in-out infinite;
  }
}

@keyframes headerGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.header-left {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
}

.logo {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.logo-icon {
  font-size: 32px;
}

.logo-text {
  font-size: $font-lg;
  font-weight: bold;
  @include gradient-text;
}

.title {
  font-size: $font-2xl;
  font-weight: bold;
  letter-spacing: 4px;
  @include glow-text;
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.time-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time {
  font-family: 'DIN', monospace;
  font-size: $font-3xl;
  font-weight: bold;
  color: $accent;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
}

.date {
  font-size: $font-sm;
  color: rgba(255, 255, 255, 0.7);
}

.header-right {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.header-btn {
  width: 48px;
  height: 48px;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);

  &:hover {
    background: rgba(0, 212, 255, 0.2);
    border-color: $accent;
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
  }
}

.btn-icon {
  font-size: 24px;
}

.dashboard-main {
  flex: 1;
  display: flex;
  padding: $spacing-lg;
  gap: $spacing-lg;
  overflow: hidden;
}

.dashboard-footer {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 $spacing-xl;
  background: rgba(13, 31, 60, 0.9);
  border-top: 1px solid $dark-border;
  backdrop-filter: blur(10px);
}

.status-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;

  &.online {
    background: $success;
    box-shadow: 0 0 10px rgba(82, 196, 26, 0.5);
    animation: pulse 2s ease-in-out infinite;
  }

  &.offline {
    background: $danger;
  }
}

.status-icon {
  font-size: 18px;
}

.status-label {
  font-size: $font-sm;
  color: rgba(255, 255, 255, 0.6);
}

.status-value {
  font-size: $font-sm;
  font-weight: bold;
  color: $accent;

  &.warning {
    color: $warning;
  }
}
</style>
