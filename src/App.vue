<script setup lang="ts">
import { onErrorCaptured } from 'vue'
import { NConfigProvider, NMessageProvider, NDialogProvider, NNotificationProvider, dateZhCN, zhCN } from 'naive-ui'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

onErrorCaptured((err, instance, info) => {
  if (import.meta.env.DEV) {
    console.error('[ErrorBoundary]', err, info)
  }
  return false
})
</script>

<template>
  <NConfigProvider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="appStore.naiveTheme"
  >
    <NMessageProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <RouterView />
        </NNotificationProvider>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #0a1628;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
