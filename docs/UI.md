# MeteoRadar 气象雷达预测系统 - UI设计规范

## 1. 设计原则

### 1.1 科技感
- 深色主题，突出数据可视化
- 渐变色和发光效果
- 流畅的动画过渡

### 1.2 专业性
- 数据展示清晰准确
- 色彩编码符合气象标准
- 信息层次分明

### 1.3 易用性
- 交互反馈及时
- 操作简单直观
- 信息获取高效

---

## 2. 色彩系统

### 2.1 主色调

```scss
// 背景色
$dark-bg: #0a1628;        // 主背景
$dark-card: #0d1f3c;      // 卡片背景
$dark-border: #1a3a5c;    // 边框颜色

// 功能色
$primary: #1890ff;        // 主色调 - 科技蓝
$accent: #00d4ff;         // 强调色 - 青色
$purple: #722ed1;         // 辅助色 - 紫色

// 状态色
$success: #52c41a;        // 成功 - 绿色
$warning: #fa8c16;        // 警告 - 橙色
$danger: #f5222d;         // 危险 - 红色
```

### 2.2 渐变色

```scss
// 背景渐变
$gradient-blue: linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%);
$gradient-accent: linear-gradient(135deg, #00d4ff 0%, #1890ff 100%);
$gradient-purple: linear-gradient(135deg, #722ed1 0%, #1890ff 100%);

// 发光效果
$glow-accent: 0 0 20px rgba(0, 212, 255, 0.3);
$glow-primary: 0 0 20px rgba(24, 144, 255, 0.3);
```

### 2.3 色彩应用

| 元素 | 色彩 | 说明 |
|------|------|------|
| 主背景 | $dark-bg | 深蓝背景 |
| 卡片 | $dark-card | 深蓝卡片 |
| 标题文字 | $accent | 青色发光 |
| 数据文字 | $accent | 青色高亮 |
| 正文文字 | rgba(255,255,255,0.7) | 半透明白色 |
| 边框 | $dark-border | 蓝色边框 |
| 悬停状态 | $accent + glow | 青色发光 |

---

## 3. 字体系统

### 3.1 字体选择

```scss
// 标题字体
$title-font: 'DIN Alternate', 'PingFang SC', 'Microsoft YaHei', sans-serif;

// 数字字体
$number-font: 'DIN Pro', 'Arial', monospace;

// 正文字体
$body-font: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
```

### 3.2 字号规范

```scss
$font-xs: 14px;      // 标签文字
$font-sm: 16px;      // 辅助文字
$font-base: 18px;    // 正文
$font-lg: 22px;      // 小标题
$font-xl: 28px;      // 标题
$font-2xl: 36px;     // 大标题
$font-3xl: 48px;     // 数据展示
```

### 3.3 字重规范

| 用途 | 字重 | 说明 |
|------|------|------|
| 标题 | 700 (Bold) | 强调标题 |
| 数据 | 600 (Semi-Bold) | 数据展示 |
| 正文 | 400 (Regular) | 正文内容 |
| 标签 | 300 (Light) | 辅助标签 |

---

## 4. 间距系统

### 4.1 间距变量

```scss
$spacing-xs: 8px;
$spacing-sm: 12px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;
```

### 4.2 应用场景

| 场景 | 间距 | 说明 |
|------|------|------|
| 组件内边距 | $spacing-lg | 卡片内边距 |
| 组件间距 | $spacing-lg | 组件之间 |
| 元素间距 | $spacing-md | 同一组件内 |
| 紧凑间距 | $spacing-sm | 紧凑布局 |
| 最小间距 | $spacing-xs | 图标与文字 |

---

## 5. 圆角系统

### 5.1 圆角变量

```scss
$radius-sm: 4px;     // 小圆角
$radius-md: 8px;     // 中圆角
$radius-lg: 12px;    // 大圆角
$radius-xl: 16px;    // 超大圆角
$radius-full: 9999px; // 全圆角
```

### 5.2 应用场景

| 元素 | 圆角 | 说明 |
|------|------|------|
| 卡片 | $radius-lg | 主要卡片 |
| 按钮 | $radius-md | 按钮圆角 |
| 输入框 | $radius-md | 输入框圆角 |
| 标签 | $radius-sm | 小标签 |
| 头像 | $radius-full | 圆形头像 |

---

## 6. 阴影系统

### 6.1 阴影变量

```scss
$shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
$shadow-md: 0 4px 16px rgba(0, 0, 0, 0.3);
$shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.4);
$shadow-glow: 0 0 20px rgba(0, 212, 255, 0.3);
```

### 6.2 应用场景

| 元素 | 阴影 | 说明 |
|------|------|------|
| 卡片 | $shadow-md | 默认阴影 |
| 弹窗 | $shadow-lg | 弹窗阴影 |
| 悬停 | $shadow-glow | 发光效果 |
| 按钮 | $shadow-sm | 按钮阴影 |

---

## 7. 动画系统

### 7.1 过渡时间

```scss
$transition-fast: 0.2s ease;
$transition-normal: 0.3s ease;
$transition-slow: 0.5s ease;
```

### 7.2 动画类型

```scss
// 渐入动画
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

// 滑入动画
@keyframes slideInLeft {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

// 脉冲动画
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

// 发光动画
@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px rgba(0, 212, 255, 0.3); }
  50% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.6); }
}
```

### 7.3 应用场景

| 场景 | 动画 | 时长 |
|------|------|------|
| 页面进入 | slideIn + fadeIn | 0.8s |
| 组件加载 | fadeIn | 0.5s |
| 数据刷新 | 呼吸灯 | 2s循环 |
| 预警闪烁 | pulse | 3s循环 |
| 交互反馈 | scale + shadow | 0.3s |

---

## 8. 组件规范

### 8.1 卡片组件

```scss
@mixin card-base {
  background: $dark-card;
  border: 1px solid $dark-border;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  padding: $spacing-lg;
  
  &:hover {
    border-color: $accent;
    box-shadow: $shadow-glow;
    transform: translateY(-2px);
  }
}
```

### 8.2 数据卡片

```
+----------------------------+
| 🌡️ 温度                   |
|                            |
|     28.5°C                 |
|                            |
| ↑ 上升                     |
+----------------------------+
```

- 图标: 24px
- 标题: 16px, rgba(255,255,255,0.7)
- 数值: 48px, DIN字体, 青色
- 趋势: 14px, 红色上升/绿色下降

### 8.3 图表容器

```scss
.chart-container {
  @include card-base;
  display: flex;
  flex-direction: column;
  
  .chart-title {
    font-size: $font-lg;
    color: $accent;
    margin-bottom: $spacing-md;
  }
  
  .chart-body {
    flex: 1;
    min-height: 200px;
  }
}
```

---

## 9. 图标规范

### 9.1 图标使用

| 功能 | 图标 | 说明 |
|------|------|------|
| 温度 | 🌡️ | 温度数据 |
| 湿度 | 💧 | 湿度数据 |
| 风速 | 💨 | 风速数据 |
| 气压 | 📊 | 气压数据 |
| 预警 | ⚠️ | 预警信息 |
| AI助手 | 🤖 | AI对话 |
| 设置 | ⚙️ | 系统设置 |

### 9.2 图标尺寸

| 场景 | 尺寸 | 说明 |
|------|------|------|
| 功能图标 | 24px | 卡片标题 |
| 状态图标 | 18px | 状态栏 |
| 按钮图标 | 20px | 按钮内 |
| 大图标 | 32px | 空状态 |

---

## 10. 响应式规范

### 10.1 断点设置

```scss
$breakpoint-4k: 3840px;
$breakpoint-2k: 2560px;
$breakpoint-fhd: 1920px;
$breakpoint-hd: 1366px;
```

### 10.2 适配策略

| 分辨率 | 布局 | 字号 | 间距 |
|--------|------|------|------|
| 4K | 三栏布局 | 1.5倍 | 1.5倍 |
| 2K | 三栏布局 | 1.2倍 | 1.2倍 |
| FHD | 三栏布局 | 1倍 | 1倍 |
| HD | 两栏布局 | 0.9倍 | 0.9倍 |

---

## 11. 设计资源

### 11.1 设计文件
- Figma设计稿: [链接]
- Sketch组件库: [链接]
- 图标库: [链接]

### 11.2 参考案例
- 阿里云数据大屏
- 腾讯云监控
- Grafana仪表盘
