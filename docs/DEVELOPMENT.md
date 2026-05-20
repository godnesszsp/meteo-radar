# MeteoRadar 开发指南

本文档为开发者提供完整的开发指导。

## 目录

- [环境准备](#环境准备)
- [项目启动](#项目启动)
- [开发规范](#开发规范)
- [组件开发](#组件开发)
- [样式开发](#样式开发)
- [Mock数据](#mock数据)
- [调试技巧](#调试技巧)
- [常见问题](#常见问题)

## 环境准备

### 必要工具

1. **Node.js** >= 18.0.0
   ```bash
   # 检查版本
   node --version
   
   # 推荐使用 nvm 管理版本
   nvm install 18
   nvm use 18
   ```

2. **包管理器** npm >= 9.0.0 或 pnpm >= 8.0.0
   ```bash
   # npm
   npm --version
   
   # pnpm (推荐)
   npm install -g pnpm
   pnpm --version
   ```

3. **编辑器** 推荐 VS Code
   - 安装 Vue - Official 扩展
   - 安装 ESLint 扩展
   - 安装 Prettier 扩展

### 可选工具

- **Git**: 版本控制
- **Chrome DevTools**: 调试工具
- **Vue DevTools**: Vue调试工具

## 项目启动

### 1. 克隆项目

```bash
git clone https://github.com/godnesszsp/meteo-radar.git
cd meteo-radar
```

### 2. 安装依赖

```bash
# npm
npm install

# pnpm (推荐)
pnpm install
```

### 3. 启动开发服务器

```bash
# npm
npm run dev

# pnpm
pnpm dev
```

访问 http://localhost:3000

### 4. 其他命令

```bash
# 类型检查
npm run type-check

# 代码检查
npm run lint

# 代码格式化
npm run format

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 开发规范

### 目录结构规范

```
src/
├── components/           # 公共组件
│   ├── component-name/   # 组件目录 (kebab-case)
│   │   ├── index.vue     # 主组件
│   │   ├── types.ts      # 类型定义
│   │   └── utils.ts      # 工具函数
│   └── index.ts          # 统一导出
├── views/                # 页面组件
│   └── page-name/        # 页面目录
│       ├── index.vue     # 页面主组件
│       └── components/   # 页面子组件
├── composables/          # 组合式函数
│   └── use-feature.ts    # use前缀
├── stores/               # 状态管理
│   └── module.ts         # 模块名
├── types/                # 类型定义
│   └── module.d.ts       # 模块类型
└── utils/                # 工具函数
    └── helper.ts         # 工具名
```

### 命名规范

- **文件/目录**: kebab-case (如 `data-card.vue`)
- **组件**: PascalCase (如 `DataCard`)
- **函数/变量**: camelCase (如 `getData`)
- **常量**: UPPER_SNAKE_CASE (如 `API_BASE_URL`)
- **类型/接口**: PascalCase (如 `WeatherData`)

### 代码风格

#### TypeScript

```typescript
// 使用接口定义对象结构
interface User {
  id: number
  name: string
  email?: string // 可选属性
}

// 使用类型别名定义联合类型
type Status = 'active' | 'inactive' | 'pending'

// 使用泛型提高复用性
function fetchData<T>(url: string): Promise<T> {
  return axios.get(url)
}

// 使用 enum 定义枚举
enum WeatherType {
  Sunny = 'sunny',
  Cloudy = 'cloudy',
  Rain = 'rain'
}
```

#### Vue 3 Composition API

```vue
<script setup lang="ts">
// 1. 导入
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/stores/counter'

// 2. Props & Emits
const props = defineProps<{
  title: string
  data: DataType[]
}>()

const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'close'): void
}>()

// 3. Store
const store = useStore()

// 4. 响应式数据
const count = ref(0)
const doubled = computed(() => count.value * 2)

// 5. 方法
function increment() {
  count.value++
  emit('update', String(count.value))
}

// 6. 生命周期
onMounted(() => {
  console.log('Component mounted')
})
</script>
```

## 组件开发

### 组件模板

```vue
<script setup lang="ts">
/**
 * ComponentName 组件
 * @description 组件描述
 */

import { ref } from 'vue'

// Props
const props = defineProps<{
  /** 标题 */
  title: string
  /** 数据列表 */
  data?: DataType[]
}>()

// Emits
const emit = defineEmits<{
  (e: 'change', value: string): void
}>()

// 响应式数据
const visible = ref(false)

// 方法
function handleClick() {
  visible.value = !visible.value
  emit('change', String(visible.value))
}
</script>

<template>
  <div class="component-name" @click="handleClick">
    <h3>{{ title }}</h3>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.component-name {
  // 样式
}
</style>
```

### ECharts 组件示例

```vue
<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  data: { name: string; value: number }[]
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
    // 配置项
  }
  
  chart.setOption(option)
}

function handleResize() {
  chart?.resize()
}

watch(() => props.data, () => {
  updateChart()
}, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>

<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>
```

### 组件注册

#### 全局注册

```typescript
// main.ts
import DataCard from '@/components/cards/DataCard.vue'

app.component('DataCard', DataCard)
```

#### 局部注册

```vue
<script setup>
import DataCard from '@/components/cards/DataCard.vue'
</script>
```

#### 自动注册

使用 `unplugin-vue-components`：

```typescript
// vite.config.ts
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    Components({
      // 自动注册组件
    })
  ]
})
```

## 样式开发

### SCSS 变量

```scss
// src/assets/styles/variables.scss
$primary: #1890ff;
$accent: #00d4ff;

// 使用
.my-class {
  color: $primary;
}
```

### UnoCSS 工具类

```html
<!-- 布局 -->
<div class="flex items-center justify-between">
<div class="grid grid-cols-3 gap-4">

<!-- 间距 -->
<div class="p-4 m-2">
<div class="px-4 py-2">

<!-- 颜色 -->
<span class="text-white bg-blue-500">
<span class="border border-gray-200">
```

### UnoCSS Shortcuts

```typescript
// uno.config.ts
shortcuts: {
  'card': 'bg-[#0d1f3c] border border-[#1a3a5c] rounded-lg p-4',
  'btn-primary': 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600',
}
```

```html
<!-- 使用 -->
<div class="card">
<button class="btn-primary">Click</button>
```

### Scoped 样式

```vue
<style lang="scss" scoped>
.my-component {
  // 只作用于当前组件
  
  :deep(.child-component) {
    // 深度选择器，影响子组件
  }
  
  :slotted(*) {
    // 插槽内容样式
  }
}
</style>
```

## Mock数据

### 添加新的 Mock 数据

```typescript
// src/mock/data.ts

// 定义接口
export interface MyData {
  id: string
  name: string
  value: number
}

// 生成函数
export function generateMyData(): MyData[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `item-${i}`,
    name: `Item ${i}`,
    value: Math.random() * 100
  }))
}
```

### 在组件中使用

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { generateMyData } from '@/mock/data'

const data = ref(generateMyData())

// 定时更新
onMounted(() => {
  setInterval(() => {
    data.value = generateMyData()
  }, 5000)
})
</script>
```

## 调试技巧

### Vue DevTools

1. 安装浏览器扩展
2. 查看组件树
3. 检查响应式数据
4. 追踪事件

### ECharts 调试

```typescript
// 开启调试日志
echarts.init(dom, null, {
  renderer: 'canvas', // 或 'svg'
  useDirtyRect: true
})

// 监听事件
chart.on('click', (params) => {
  console.log('Click:', params)
})
```

### 网络请求调试

```typescript
// 请求拦截
axios.interceptors.request.use(config => {
  console.log('Request:', config)
  return config
})

// 响应拦截
axios.interceptors.response.use(response => {
  console.log('Response:', response)
  return response
})
```

### 性能调试

```typescript
// 组件渲染时间
const start = performance.now()
// ... 渲染逻辑
const end = performance.now()
console.log(`Render time: ${end - start}ms`)

// 使用 Vue DevTools 的 Performance 面板
```

## 常见问题

### 1. 组件不更新

**问题**: Props 变化但组件未重新渲染

**解决**: 检查是否正确使用响应式数据

```vue
<script setup>
// ✅ 正确
const data = ref(initialData)
watch(() => props.data, (newVal) => {
  data.value = newVal
})

// ❌ 错误
const data = props.data // 不是响应式的
</script>
```

### 2. ECharts 图表不显示

**问题**: 图表容器初始化时尺寸为 0

**解决**: 确保容器有明确的宽高

```vue
<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  min-height: 300px; /* 设置最小高度 */
}
</style>
```

### 3. 样式不生效

**问题**: Scoped 样式未正确应用

**解决**: 使用正确的选择器

```vue
<style scoped>
/* ✅ 正确 */
.my-class :deep(.child) {
  color: red;
}

/* ❌ 错误 */
.my-class .child {
  color: red; /* 不会生效 */
}
</style>
```

### 4. TypeScript 类型错误

**问题**: 找不到模块或类型

**解决**: 检查类型声明文件

```typescript
// src/env.d.ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

### 5. 热更新不工作

**问题**: 修改代码后页面未自动更新

**解决**:
1. 检查文件路径大小写
2. 清除缓存：`rm -rf node_modules/.vite`
3. 重启开发服务器

## 进阶主题

### 自定义指令

```typescript
// src/directives/v-highlight.ts
import type { Directive } from 'vue'

export const vHighlight: Directive = {
  mounted(el) {
    el.style.backgroundColor = '#ffff00'
  }
}

// 使用
// <p v-highlight>高亮文本</p>
```

### 插件开发

```typescript
// src/plugins/my-plugin.ts
import type { App } from 'vue'

export default {
  install(app: App, options: any) {
    // 全局属性
    app.config.globalProperties.$myPlugin = {
      // ...
    }
    
    // 全局组件
    app.component('MyComponent', MyComponent)
  }
}
```

### 组合式函数

```typescript
// src/composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const doubled = computed(() => count.value * 2)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  return {
    count,
    doubled,
    increment,
    decrement
  }
}
```

---

更多问题请查看 [GitHub Issues](https://github.com/godnesszsp/meteo-radar/issues)。
