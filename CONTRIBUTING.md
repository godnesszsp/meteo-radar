# 贡献指南

感谢您对 MeteoRadar 项目的关注！我们欢迎任何形式的贡献。

## 如何贡献

### 报告Bug

如果您发现了Bug，请通过 [GitHub Issues](https://github.com/godnesszsp/meteo-radar/issues) 提交，包含：

1. Bug描述
2. 复现步骤
3. 期望行为
4. 实际行为
5. 环境信息（浏览器、操作系统、Node版本）
6. 截图或录屏（如适用）

### 提交功能建议

功能建议也请通过 Issue 提交，包含：

1. 功能描述
2. 使用场景
3. 预期效果

### 提交代码

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'feat: add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

## 开发规范

### 分支规范

- `main`: 主分支，保持稳定
- `develop`: 开发分支
- `feature/*`: 功能分支
- `fix/*`: 修复分支
- `docs/*`: 文档分支

### Commit 规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型：**
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链
- `revert`: 回滚

**示例：**
```
feat(chart): 添加风向玫瑰图组件

- 实现极坐标图表展示
- 支持风速和频率数据显示
- 添加动画效果

Closes #123
```

### 代码规范

- 使用 TypeScript 编写
- 遵循项目 ESLint 配置
- 组件使用 `<script setup>` 语法
- 样式使用 SCSS + UnoCSS
- 保持代码简洁，添加必要注释

### 组件开发规范

```vue
<script setup lang="ts">
// 1. 导入
import { ref, onMounted } from 'vue'

// 2. Props定义
const props = defineProps<{
  title: string
  data: DataType[]
}>()

// 3. 响应式数据
const chartRef = ref<HTMLElement>()

// 4. 方法
function initChart() {
  // ...
}

// 5. 生命周期
onMounted(() => {
  initChart()
})
</script>

<template>
  <div class="component-name">
    <!-- 模板内容 -->
  </div>
</template>

<style lang="scss" scoped>
.component-name {
  // 样式
}
</style>
```

### 样式规范

- 使用 BEM 命名规范
- 优先使用 UnoCSS 工具类
- 自定义样式使用 SCSS
- 颜色使用设计规范变量

## Pull Request 规范

### PR 标题

遵循 Commit 规范，例如：
- `feat: 添加xxx功能`
- `fix: 修复xxx问题`

### PR 描述

请包含：

1. **变更内容**: 简述本次PR的变更
2. **变更原因**: 说明为什么需要这个变更
3. **测试情况**: 说明如何测试
4. **关联Issue**: 关联相关的Issue

### PR 模板

```markdown
## 变更内容

简述本次变更...

## 变更类型

- [ ] 新功能
- [ ] Bug修复
- [ ] 文档更新
- [ ] 重构
- [ ] 其他

## 测试情况

- [ ] 本地测试通过
- [ ] 添加了新的测试用例
- [ ] 所有测试通过

## 截图（如适用）

## 关联Issue

Closes #xxx
```

## 开发环境

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0

### 本地开发

```bash
# 1. Fork并克隆仓库
git clone https://github.com/godnesszsp/meteo-radar.git

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问 http://localhost:3000
```

### 代码检查

```bash
# ESLint检查
npm run lint

# TypeScript类型检查
npm run type-check

# 格式化代码
npm run format
```

## 文档贡献

文档同样重要！您可以：

- 完善现有文档
- 添加示例代码
- 翻译文档
- 修正错别字

## 行为准则

请遵守我们的 [行为准则](CODE_OF_CONDUCT.md)。

## 联系方式

- Issue: [GitHub Issues](https://github.com/godnesszsp/meteo-radar/issues)
- Discussion: [GitHub Discussions](https://github.com/godnesszsp/meteo-radar/discussions)

## 致谢

感谢所有贡献者的付出！

[![Contributors](https://contrib.rocks/image?repo=godnesszsp/meteo-radar)](https://github.com/godnesszsp/meteo-radar/graphs/contributors)
