<p align="center">
  <h1 align="center">MeteoRadar</h1>
  <p align="center">气象雷达预测系统 + AI 知识库</p>
</p>

<p align="center">
  <a href="https://github.com/godnesszsp/meteo-radar/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License">
  </a>
  <a href="https://github.com/godnesszsp/meteo-radar">
    <img src="https://img.shields.io/badge/vue-3.4+-green.svg" alt="Vue 3.4+">
  </a>
  <a href="https://github.com/godnesszsp/meteo-radar">
    <img src="https://img.shields.io/badge/typescript-5.0+-blue.svg" alt="TypeScript 5.0+">
  </a>
  <a href="https://github.com/godnesszsp/meteo-radar">
    <img src="https://img.shields.io/badge/vite-5.0+-purple.svg" alt="Vite 5.0+">
  </a>
</p>

---

## 预览

**[在线预览](https://godnesszsp.github.io/meteo-radar/)**

> 🚀 一个基于 Vue 3 + ECharts 的专业气象雷达预测系统，集成 AI 知识库，提供实时气象数据可视化、天气预测和智能问答服务。

### 功能特性

- 🌡️ **实时气象数据** - 温度、湿度、风速、气压等实时数据展示
- 📊 **数据可视化** - ECharts 图表，直观展示气象数据
- 🗺️ **雷达地图** - 高德地图集成，雷达回波图、气象站点标记
- 📅 **天气预测** - 7 天天气预测曲线图
- ⚠️ **预警系统** - 气象预警信息展示
- 🤖 **AI 知识库** - 智能气象知识问答，支持快捷查询
- 🌿 **空气质量** - AQI 指数和污染物数据
- 🖥️ **4K 大屏** - 3840x2160 分辨率适配
- ✨ **科技感 UI** - 深色主题、发光效果、流畅动画
- 📱 **全屏模式** - 支持全屏展示，适合大屏场景

## 技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | [Vue 3](https://vuejs.org/) | 3.4+ | Composition API |
| 构建 | [Vite](https://vitejs.dev/) | 5.0+ | 快速开发体验 |
| 语言 | [TypeScript](https://www.typescriptlang.org/) | 5.0+ | 类型安全 |
| 可视化 | [ECharts](https://echarts.apache.org/) | 5.5+ | 图表可视化 |
| UI 库 | [Naive UI](https://www.naiveui.com/) | 2.x | Vue 3 组件库 |
| 状态 | [Pinia](https://pinia.vuejs.org/) | 2.x | 状态管理 |
| 样式 | [UnoCSS](https://unocss.dev/) + SCSS | - | 原子化 CSS |
| 路由 | [Vue Router](https://router.vuejs.org/) | 4.x | 路由管理 |
| 工具 | [VueUse](https://vueuse.org/) | - | 组合式工具 |

## 快速开始

### 环境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 或 **pnpm**: >= 8.0.0

### 安装

```bash
# 克隆仓库
git clone https://github.com/godnesszsp/meteo-radar.git
cd meteo-radar

# 安装依赖
npm install
# 或
pnpm install
```

### 开发

```bash
# 启动开发服务器
npm run dev
# 或
pnpm dev
```

访问 http://localhost:3000

### 构建

```bash
# 构建生产版本
npm run build
# 或
pnpm build

# 预览构建结果
npm run preview
```

### 其他命令

```bash
# 类型检查
npm run type-check

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 项目结构

```
meteo-radar/
├── .github/                  # GitHub 配置
│   ├── ISSUE_TEMPLATE/      # Issue 模板
│   ├── workflows/           # CI/CD 配置
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                     # 项目文档
│   ├── API.md               # API 接口文档
│   ├── ARCHITECTURE.md      # 架构设计文档
│   ├── DEPLOYMENT.md        # 部署指南
│   ├── DEVELOPMENT.md       # 开发指南
│   ├── PRD.md               # 产品需求文档
│   └── UI.md                # UI 设计规范
├── public/                   # 静态资源
├── src/
│   ├── api/                 # API 接口
│   ├── assets/              # 资源文件
│   │   ├── images/         # 图片
│   │   └── styles/         # 样式
│   ├── components/          # 公共组件
│   │   ├── ai-chat/        # AI 对话组件
│   │   ├── cards/          # 数据卡片
│   │   ├── charts/         # 图表组件
│   │   └── map/            # 地图组件
│   ├── composables/         # 组合式函数
│   ├── layouts/             # 布局组件
│   ├── mock/                # Mock 数据
│   ├── router/              # 路由配置
│   ├── stores/              # 状态管理
│   ├── types/               # 类型定义
│   ├── utils/               # 工具函数
│   └── views/               # 页面视图
│       └── dashboard/       # 大屏页面
├── .env.example             # 环境变量示例
├── .eslintrc.cjs            # ESLint 配置
├── .gitignore               # Git 忽略文件
├── CHANGELOG.md             # 更新日志
├── CODE_OF_CONDUCT.md       # 行为准则
├── CONTRIBUTING.md          # 贡献指南
├── LICENSE                  # 开源许可证
├── README.md                # 项目说明
├── index.html               # 入口 HTML
├── package.json             # 项目配置
├── tsconfig.json            # TypeScript 配置
├── uno.config.ts            # UnoCSS 配置
└── vite.config.ts           # Vite 配置
```

## 组件说明

### 核心组件

| 组件 | 路径 | 说明 |
|------|------|------|
| DashboardLayout | `src/layouts/DashboardLayout.vue` | 大屏布局组件 |
| RadarMap | `src/components/map/RadarMap.vue` | 雷达回波地图 |
| DataCard | `src/components/cards/DataCard.vue` | 实时数据卡片 |
| TemperatureChart | `src/components/charts/TemperatureChart.vue` | 24 小时温度曲线 |
| ForecastChart | `src/components/charts/ForecastChart.vue` | 7 天预测图表 |
| AirQualityChart | `src/components/charts/AirQualityChart.vue` | 空气质量仪表盘 |
| WindRoseChart | `src/components/charts/WindRoseChart.vue` | 风向玫瑰图 |
| WarningList | `src/components/cards/WarningList.vue` | 预警信息列表 |
| AiChatDrawer | `src/components/ai-chat/AiChatDrawer.vue` | AI 对话抽屉 |

## 文档

- 📄 [产品需求文档 (PRD)](docs/PRD.md) - 详细功能需求和验收标准
- 🎨 [UI 设计规范](docs/UI.md) - 色彩、字体、动效设计标准
- 🏗️ [架构设计文档](docs/ARCHITECTURE.md) - 系统架构和模块设计
- 📚 [开发指南](docs/DEVELOPMENT.md) - 开发环境搭建和规范
- 🚀 [部署指南](docs/DEPLOYMENT.md) - 多种部署方案
- 📡 [API 接口文档](docs/API.md) - 数据接口规范

## 设计规范

### 色彩方案

| 用途 | 色值 | 说明 |
|------|------|------|
| 主背景 | `#0a1628` | 深蓝色背景 |
| 卡片背景 | `#0d1f3c` | 深蓝卡片 |
| 主色调 | `#1890ff` | 科技蓝 |
| 强调色 | `#00d4ff` | 青色 |
| 警告色 | `#fa8c16` | 橙色 |
| 危险色 | `#f5222d` | 红色 |
| 成功色 | `#52c41a` | 绿色 |

### 动效规范

- 页面进入：渐入 + 滑入动画 (0.8s)
- 数据刷新：呼吸灯效果 (2s 循环)
- 预警闪烁：脉冲动画 (3s 循环)
- 交互反馈：缩放 + 阴影 (0.3s)

## 开发指南

### 添加新组件

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  title: string
  data: DataType[]
}>()

const chartRef = ref<HTMLElement>()

onMounted(() => {
  // 初始化逻辑
})
</script>

<template>
  <div class="my-component">
    <h3>{{ title }}</h3>
    <div ref="chartRef"></div>
  </div>
</template>

<style lang="scss" scoped>
.my-component {
  // 样式
}
</style>
```

### Mock 数据

所有 Mock 数据位于 `src/mock/` 目录：

```typescript
import { generateRealtimeData } from '@/mock/weather'

const data = generateRealtimeData()
```

## 贡献

欢迎贡献！请阅读 [贡献指南](CONTRIBUTING.md) 了解如何参与项目。

### 贡献者

感谢所有为这个项目做出贡献的人！

<a href="https://github.com/godnesszsp/meteo-radar/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=godnesszsp/meteo-radar" />
</a>

## 许可证

本项目基于 [MIT License](LICENSE) 开源。

## 致谢

- [Vue.js](https://vuejs.org/)
- [ECharts](https://echarts.apache.org/)
- [Naive UI](https://www.naiveui.com/)
- [Vite](https://vitejs.dev/)

---

<p align="center">
  Made with ❤️ by MeteoRadar Team
</p>
