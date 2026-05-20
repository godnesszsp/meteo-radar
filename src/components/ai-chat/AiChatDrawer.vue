<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useAppStore } from '@/stores/app'
import { getAiResponse } from '@/mock/weather'

const appStore = useAppStore()

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const messages = ref<Message[]>([
  {
    id: 1,
    role: 'assistant',
    content: '您好！我是MeteoRadar AI气象助手。我可以为您提供天气查询、天气预测、空气质量等气象信息。请问有什么可以帮助您的？',
    timestamp: new Date().toLocaleTimeString()
  }
])

const inputText = ref('')
const isLoading = ref(false)
const messageListRef = ref<HTMLElement>()

function scrollToBottom() {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

function sendMessage() {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  // 添加用户消息
  messages.value.push({
    id: Date.now(),
    role: 'user',
    content: text,
    timestamp: new Date().toLocaleTimeString()
  })

  inputText.value = ''
  isLoading.value = true
  scrollToBottom()

  // 模拟AI回复延迟
  setTimeout(() => {
    const response = getAiResponse(text)

    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      content: response,
      timestamp: new Date().toLocaleTimeString()
    })

    isLoading.value = false
    scrollToBottom()
  }, 800 + Math.random() * 400)
}

function clearMessages() {
  messages.value = [
    {
      id: 1,
      role: 'assistant',
      content: '对话已清空。请问有什么可以帮助您的？',
      timestamp: new Date().toLocaleTimeString()
    }
  ]
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}
</script>

<template>
  <n-drawer
    v-model:show="appStore.aiDrawerVisible"
    :width="420"
    placement="right"
  >
    <n-drawer-content closable>
      <template #header>
        <div class="drawer-header">
          <span class="header-icon">🤖</span>
          <span class="header-title">AI气象助手</span>
          <n-button size="small" quaternary @click="clearMessages">
            清空对话
          </n-button>
        </div>
      </template>

      <div class="chat-container">
        <!-- 消息列表 -->
        <div class="message-list" ref="messageListRef">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['message-item', msg.role]"
          >
            <div class="message-avatar">
              {{ msg.role === 'user' ? '👤' : '🤖' }}
            </div>
            <div class="message-content">
              <div class="message-text">{{ msg.content }}</div>
              <div class="message-time">{{ msg.timestamp }}</div>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="isLoading" class="message-item assistant">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
              <div class="message-text loading">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 快捷问题 -->
        <div class="quick-questions">
          <span class="quick-label">快捷提问:</span>
          <n-button size="small" @click="inputText = '北京天气'; sendMessage()">北京天气</n-button>
          <n-button size="small" @click="inputText = '上海天气'; sendMessage()">上海天气</n-button>
          <n-button size="small" @click="inputText = '未来三天天气'; sendMessage()">未来三天</n-button>
          <n-button size="small" @click="inputText = '空气质量'; sendMessage()">空气质量</n-button>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <n-input
            v-model:value="inputText"
            type="textarea"
            placeholder="请输入您的问题..."
            :autosize="{ minRows: 2, maxRows: 4 }"
            @keydown="handleKeydown"
          />
          <n-button
            type="primary"
            :loading="isLoading"
            :disabled="!inputText.trim()"
            @click="sendMessage"
          >
            发送
          </n-button>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="scss" scoped>
.drawer-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.header-icon {
  font-size: 24px;
}

.header-title {
  flex: 1;
  font-size: $font-lg;
  font-weight: bold;
  color: $accent;
}

.chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  @include scrollbar;
}

.message-item {
  display: flex;
  gap: $spacing-sm;
  animation: fadeIn 0.3s ease;

  &.user {
    flex-direction: row-reverse;

    .message-content {
      align-items: flex-end;
    }

    .message-text {
      background: rgba(24, 144, 255, 0.3);
      border: 1px solid rgba(24, 144, 255, 0.5);
    }
  }

  &.assistant {
    .message-text {
      background: rgba(13, 31, 60, 0.8);
      border: 1px solid #1a3a5c;
    }
  }
}

.message-avatar {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 50%;
  font-size: 20px;
  flex-shrink: 0;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 80%;
}

.message-text {
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  font-size: $font-sm;
  line-height: 1.6;
  color: #fff;

  &.loading {
    display: flex;
    gap: 6px;
    padding: 12px 16px;
  }
}

.dot {
  width: 8px;
  height: 8px;
  background: $accent;
  border-radius: 50%;
  animation: pulse 1.4s ease-in-out infinite;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

.message-time {
  font-size: $font-xs;
  color: rgba(255, 255, 255, 0.4);
  padding: 0 $spacing-sm;
}

.quick-questions {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  border-top: 1px solid #1a3a5c;
  overflow-x: auto;

  @include scrollbar;
}

.quick-label {
  font-size: $font-xs;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
}

.input-area {
  display: flex;
  gap: $spacing-sm;
  padding: $spacing-md;
  border-top: 1px solid #1a3a5c;
  background: rgba(13, 31, 60, 0.5);
}

:deep(.n-input) {
  --n-color: rgba(13, 31, 60, 0.8);
  --n-border: 1px solid #1a3a5c;
  --n-text-color: #fff;
  --n-placeholder-color: rgba(255, 255, 255, 0.3);

  &:focus-within {
    --n-border: 1px solid #00d4ff;
    --n-box-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
  }
}
</style>
