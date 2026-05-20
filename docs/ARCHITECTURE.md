# MeteoRadar 架构设计文档

## 1. 系统概述

MeteoRadar 是一个基于 Vue 3 的气象数据可视化大屏系统，采用现代化前端技术栈，提供实时气象数据展示、天气预测和AI气象知识问答功能。

## 2. 技术架构

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                      用户界面层 (UI Layer)                    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │ 地图组件 │  │ 图表组件 │  │ 卡片组件 │  │ AI对话  │       │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
├─────────────────────────────────────────────────────────────┤
│                      业务逻辑层 (Business Layer)             │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   状态管理       │  │    数据处理      │                  │
│  │   (Pinia)       │  │   (Composables) │                  │
│  └─────────────────┘  └─────────────────┘                  │
├─────────────────────────────────────────────────────────────┤
│                      数据访问层 (Data Layer)                 │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │    Mock数据      │  │    API接口      │                  │
│  │  (开发环境)      │  │   (生产环境)    │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 技术栈

| 层次 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Vue 3 | 3.4+ | Composition API |
| 构建 | Vite | 5.0+ | 快速开发体验 |
| 可视化 | ECharts | 5.5+ | 图表可视化 |
| UI库 | Naive UI | 2.x | Vue3组件库 |
| 状态 | Pinia | 2.x | 状态管理 |
| 样式 | UnoCSS + SCSS | - | 原子化CSS |
| 路由 | Vue Router | 4.x | 路由管理 |
| HTTP | Axios | - | 请求库 |
| 工具 | VueUse | - | 组合式工具 |

### 2.3 项目结构

```
meteo-radar/
├── .github/                    # GitHub配置
│   ├── ISSUE_TEMPLATE/        # Issue模板
│   ├── workflows/             # CI/CD配置
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                       # 项目文档
│   ├── ARCHITECTURE.md        # 架构设计
│   ├── API.md                 # API文档
│   ├── DEPLOYMENT.md          # 部署指南
│   ├── DEVELOPMENT.md         # 开发指南
│   ├── PRD.md                 # 产品需求
│   └── UI.md                  # UI设计规范
├── public/                     # 静态资源
├── src/
│   ├── api/                   # API接口定义
│   ├── assets/                # 资源文件
│   │   ├── images/           # 图片资源
│   │   ├── styles/           # 全局样式
│   │   └── fonts/            # 字体文件
│   ├── components/            # 公共组件
│   │   ├── ai-chat/          # AI对话组件
│   │   ├── cards/            # 数据卡片组件
│   │   ├── charts/           # 图表组件
│   │   ├── common/           # 通用组件
│   │   └── map/              # 地图组件
│   ├── composables/           # 组合式函数
│   ├── layouts/               # 布局组件
│   ├── mock/                  # Mock数据
│   ├── router/                # 路由配置
│   ├── stores/                # 状态管理
│   ├── types/                 # TypeScript类型
│   ├── utils/                 # 工具函数
│   └── views/                 # 页面视图
│       └── dashboard/         # 大屏页面
├── .env                       # 环境变量
├── .env.development           # 开发环境
├── .env.production            # 生产环境
├── .eslintrc.cjs              # ESLint配置
├── .prettierrc                # Prettier配置
├── index.html                 # 入口HTML
├── package.json               # 项目配置
├── tsconfig.json              # TypeScript配置
├── uno.config.ts              # UnoCSS配置
└── vite.config.ts             # Vite配置
```

## 3. 核心模块设计

### 3.1 组件架构

```
App
├── NConfigProvider (Naive UI主题)
│   └── RouterView
│       └── DashboardLayout
│           ├── Header (标题栏)
│           │   ├── Logo
│           │   ├── TimeDisplay
│           │   └── ActionButtons
│           ├── Main (主内容区)
│           │   ├── LeftPanel
│           │   │   ├── DataCards (数据卡片)
│           │   │   └── TemperatureChart (温度曲线)
│           │   ├── CenterPanel
│           │   │   └── RadarMap (雷达地图)
│           │   └── RightPanel
│           │       ├── ForecastChart (预测图表)
│           │       ├── WarningList (预警列表)
│           │       └── AirQualityChart (空气质量)
│           ├── Footer (状态栏)
│           └── AiChatDrawer (AI对话抽屉)
```

### 3.2 数据流

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Mock/API   │ ──▶ │   Store     │ ──▶ │  Components │
│  Data Source│     │  (Pinia)    │     │   (View)    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Data Gen   │     │  State      │     │  Rendering  │
│  Functions  │     │  Update     │     │  & Events   │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 3.3 状态管理

```typescript
// stores/app.ts - 应用状态
interface AppState {
  isDark: boolean           // 主题模式
  aiDrawerVisible: boolean  // AI抽屉状态
  currentTime: Date         // 当前时间
}

// stores/weather.ts - 气象数据状态
interface WeatherState {
  realtimeData: RealtimeData      // 实时数据
  forecastData: ForecastData[]    // 预测数据
  warnings: WarningData[]         // 预警信息
  stations: StationData[]         // 站点数据
  radarData: RadarData[]          // 雷达数据
}
```

## 4. 组件设计

### 4.1 组件分类

| 类型 | 目录 | 说明 | 示例 |
|------|------|------|------|
| 布局组件 | layouts/ | 页面布局 | DashboardLayout |
| 页面组件 | views/ | 页面视图 | dashboard/index |
| 业务组件 | components/ | 功能组件 | RadarMap, DataCard |
| 通用组件 | components/common/ | 基础组件 | - |

### 4.2 组件通信

```typescript
// Props & Emits (父子组件)
const props = defineProps<{ data: DataType[] }>()
const emit = defineEmits<{ (e: 'update', value: string): void }>()

// Provide/Inject (跨层级)
provide('theme', theme)
const theme = inject('theme')

// Pinia Store (全局状态)
const store = useWeatherStore()

// Event Bus (兄弟组件)
import mitt from 'mitt'
const emitter = mitt()
emitter.on('event', handler)
emitter.emit('event', data)
```

### 4.3 组件设计原则

1. **单一职责**: 每个组件只做一件事
2. **可复用性**: 通过props和slots提高复用性
3. **可测试性**: 组件逻辑清晰，便于测试
4. **性能优化**: 合理使用缓存和懒加载

## 5. 样式架构

### 5.1 样式层次

```
┌─────────────────────────────────────┐
│         UnoCSS 工具类               │  快速开发
├─────────────────────────────────────┤
│         SCSS 变量                   │  主题配置
├─────────────────────────────────────┤
│         组件 Scoped 样式            │  组件样式
├─────────────────────────────────────┤
│         全局样式                    │  基础样式
└─────────────────────────────────────┘
```

### 5.2 主题系统

```scss
// 变量定义
$primary: #1890ff;
$accent: #00d4ff;
$dark-bg: #0a1628;
$dark-card: #0d1f3c;

// 混合器
@mixin card-base {
  background: $dark-card;
  border: 1px solid $dark-border;
  border-radius: $radius-lg;
}

// UnoCSS shortcuts
shortcuts: {
  'card-bg': 'bg-[#0d1f3c] border border-[#1a3a5c] rounded-lg',
  'glow-text': 'text-[#00d4ff] text-shadow-[0_0_10px_rgba(0,212,255,0.5)]',
}
```

## 6. 数据架构

### 6.1 数据模型

```typescript
// 实时数据
interface RealtimeData {
  temperature: number      // 温度
  humidity: number         // 湿度
  windSpeed: number        // 风速
  windDirection: string    // 风向
  pressure: number         // 气压
  precipitation: number    // 降水量
  visibility: number       // 能见度
  uvIndex: number          // 紫外线指数
  airQuality: AirQuality   // 空气质量
}

// 预测数据
interface ForecastData {
  date: string             // 日期
  weather: WeatherType     // 天气类型
  tempHigh: number         // 最高温度
  tempLow: number          // 最低温度
  humidity: number         // 湿度
  windSpeed: number        // 风速
  precipitationProb: number // 降水概率
}

// 预警数据
interface WarningData {
  id: string               // 预警ID
  type: WarningType        // 预警类型
  level: WarningLevel      // 预警级别
  title: string            // 预警标题
  content: string          // 预警内容
  publishTime: string      // 发布时间
  region: string           // 影响区域
}
```

### 6.2 数据流设计

```
数据源 (Mock/API)
      │
      ▼
数据处理层 (Composables)
  - 数据转换
  - 数据验证
  - 数据缓存
      │
      ▼
状态管理层 (Pinia Store)
  - 集中管理
  - 响应式更新
  - 持久化
      │
      ▼
视图层 (Components)
  - 数据展示
  - 用户交互
  - 事件处理
```

## 7. 性能优化

### 7.1 加载优化

- **代码分割**: 路由级别懒加载
- **资源压缩**: 图片、字体压缩
- **CDN加速**: 静态资源CDN部署
- **预加载**: 关键资源预加载

### 7.2 渲染优化

- **虚拟滚动**: 长列表虚拟滚动
- **防抖节流**: 高频事件处理
- **缓存策略**: 合理使用缓存
- **按需加载**: 组件和库按需加载

### 7.3 数据优化

- **数据采样**: 大数据集采样显示
- **增量更新**: 数据增量更新
- **WebSocket**: 实时数据推送
- **Worker**: 复杂计算使用Web Worker

## 8. 安全设计

### 8.1 前端安全

- **XSS防护**: 输入输出转义
- **CSP策略**: 内容安全策略
- **HTTPS**: 强制HTTPS
- **依赖审计**: 定期审计依赖

### 8.2 数据安全

- **数据脱敏**: 敏感数据脱敏
- **接口鉴权**: API接口鉴权
- **日志审计**: 操作日志记录

## 9. 可扩展性

### 9.1 插件化设计

```typescript
// 图表插件接口
interface ChartPlugin {
  name: string
  init: (container: HTMLElement) => void
  update: (data: any) => void
  destroy: () => void
}

// 注册插件
app.use(chartPlugin, options)
```

### 9.2 主题定制

```typescript
// 主题配置接口
interface ThemeConfig {
  colors: Record<string, string>
  fonts: Record<string, string>
  spacing: Record<string, string>
}

// 应用主题
const theme = createTheme(customConfig)
app.use(theme)
```

## 10. 部署架构

### 10.1 部署方案

```
┌─────────────────────────────────────────┐
│              CDN (静态资源)              │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│           Nginx (Web服务器)             │
│  - 静态文件服务                         │
│  - 反向代理                            │
│  - 负载均衡                            │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         后端API服务 (可选)              │
│  - 数据接口                            │
│  - AI服务                              │
└─────────────────────────────────────────┘
```

### 10.2 容器化部署

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 11. 监控与运维

### 11.1 性能监控

- **首屏加载**: 监控FCP、LCP等指标
- **运行时性能**: 监控FPS、内存使用
- **错误监控**: 捕获和上报错误
- **用户行为**: 用户行为分析

### 11.2 日志管理

- **错误日志**: 前端错误收集
- **性能日志**: 性能数据上报
- **业务日志**: 关键业务操作记录

---

本架构文档将随项目迭代持续更新。
