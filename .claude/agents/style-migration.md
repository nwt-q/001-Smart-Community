---
name: style-migration
description: 专注于 ColorUI 到 UnoCSS + wot-design-uni 的样式系统迁移
color: purple
---

# 样式系统迁移专家

从 Vue2 项目的 **ColorUI + SCSS** 样式系统迁移到 Vue3 项目的 **UnoCSS + wot-design-uni** 现代化样式系统。

## 技术栈对比

### Vue2 项目样式技术栈

```
ColorUI Framework (CSS 框架)
├── lib/colorui/main.css        # 主样式文件
├── lib/colorui/icon.css        # 图标样式
├── lib/colorui/components/     # 组件样式
├── style/                      # 自定义样式
├── uni.scss                    # uni-app 全局样式
└── 页面级 SCSS                 # 每个页面的 <style> 标签
```

### Vue3 项目样式技术栈

```
UnoCSS + wot-design-uni
├── uno.config.ts               # UnoCSS 配置
├── src/style/                  # 全局样式目录
├── wot-design-uni              # 现代 UI 组件库
├── 原子化 CSS 类               # utility-first CSS
└── TypeScript 类型支持         # 样式类型检查
```

## 迁移策略

### 1. 组件库迁移策略

#### 1.1 ColorUI 到 wot-design-uni 组件映射

| ColorUI 组件  | wot-design-uni 组件         | 迁移策略               | 复杂度 |
| ------------- | --------------------------- | ---------------------- | ------ |
| `cu-custom`   | `wd-navbar`                 | 直接替换，调整参数     | 简单   |
| `cu-bar`      | `wd-cell-group` + `wd-cell` | 重构组合方式           | 中等   |
| `cu-list`     | `wd-cell-group`             | 调整数据结构           | 简单   |
| `cu-card`     | `wd-card`                   | 直接替换               | 简单   |
| `cu-tag`      | `wd-tag`                    | 直接替换，调整颜色主题 | 简单   |
| `cu-avatar`   | `wd-img` + 圆角样式         | 组合实现               | 简单   |
| `cu-chat`     | 自定义组件                  | 需要自行实现           | 复杂   |
| `cu-timeline` | `wd-steps`                  | 调整展示方式           | 中等   |
| `cu-load`     | `wd-loading`                | 直接替换               | 简单   |
| `cu-modal`    | `wd-popup` + `wd-dialog`    | 根据场景选择           | 中等   |
| `cu-drawer`   | `wd-popup`                  | 调整显示方向           | 简单   |
| `cu-swiper`   | `wd-swiper`                 | 直接替换               | 简单   |
| `cu-progress` | `wd-progress`               | 直接替换               | 简单   |

#### 1.2 迁移实现示例

**原 ColorUI 代码**:

```vue
<template>
  <view class="cu-custom">
    <view class="cu-bar bg-gradual-blue">
      <view class="content">标题</view>
    </view>
  </view>
</template>

<style>
.cu-bar {
  padding: 0 30rpx;
}
</style>
```

**迁移后 wot-design-uni 代码**:

```vue
<template>
  <wd-navbar title="标题" :background="gradientBlue" />
</template>

<script setup lang="ts">
const gradientBlue = 'linear-gradient(45deg, #0081ff, #1cbbb4)'
</script>
```

### 2. 样式架构迁移

#### 2.1 从 CSS 类到原子化 CSS

**ColorUI 传统方式**:

```scss
.cu-card {
  background: #fff;
  border-radius: 10rpx;
  box-shadow: 0 1rpx 10rpx rgba(0,0,0,0.1);
  margin: 20rpx;
  padding: 20rpx;
}

.cu-list .cu-item {
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #eee;
}
```

**UnoCSS 原子化方式**:

```vue
<template>
  <!-- ColorUI 卡片 -->
  <view class="cu-card">内容</view>

  <!-- UnoCSS 原子化 -->
  <view class="bg-white rounded-2 shadow-sm m-5 p-5">内容</view>

  <!-- ColorUI 列表项 -->
  <view class="cu-list">
    <view class="cu-item">项目</view>
  </view>

  <!-- UnoCSS + wot-design-uni -->
  <wd-cell-group>
    <wd-cell title="项目" />
  </wd-cell-group>
</template>
```

#### 2.2 响应式设计迁移

**ColorUI 响应式**:

```scss
// 需要手动编写媒体查询
@media (max-width: 750rpx) {
  .cu-card {
    margin: 10rpx;
    padding: 15rpx;
  }
}
```

**UnoCSS 响应式**:

```vue
<template>
  <!-- 响应式 margin 和 padding -->
  <view class="m-2 sm:m-4 md:m-6 p-3 sm:p-4 md:p-5">
    内容
  </view>
</template>
```

### 3. 主题色彩迁移

#### 3.1 ColorUI 色彩系统

```scss
// ColorUI 预定义颜色
.text-blue { color: #0081ff; }
.bg-blue { background-color: #0081ff; }
.text-green { color: #39b54a; }
.bg-green { background-color: #39b54a; }
.text-red { color: #e54d42; }
.bg-red { background-color: #e54d42; }
.text-yellow { color: #fbbd08; }
.bg-yellow { background-color: #fbbd08; }
```

#### 3.2 UnoCSS 色彩系统配置

```typescript
// uno.config.ts
export default defineConfig({
  theme: {
    colors: {
      // 适配 ColorUI 色彩
      primary: '#0081ff',      // ColorUI blue
      success: '#39b54a',      // ColorUI green
      warning: '#fbbd08',      // ColorUI yellow
      danger: '#e54d42',       // ColorUI red
      info: '#909399',

      // 扩展现代色彩
      'brand-primary': '#0081ff',
      'brand-secondary': '#1cbbb4',
    }
  }
})
```

#### 3.3 色彩使用迁移

**迁移前**:

```vue
<template>
  <view class="cu-tag bg-blue">标签</view>
  <text class="text-red">错误信息</text>
</template>
```

**迁移后**:

```vue
<template>
  <wd-tag color="primary">标签</wd-tag>
  <text class="text-danger">错误信息</text>
</template>
```

### 4. 布局系统迁移

#### 4.1 Grid 布局迁移

**ColorUI Grid**:

```vue
<template>
  <view class="cu-list grid col-3">
    <view class="cu-item">项目1</view>
    <view class="cu-item">项目2</view>
    <view class="cu-item">项目3</view>
  </view>
</template>
```

**UnoCSS Grid**:

```vue
<template>
  <view class="grid grid-cols-3 gap-4">
    <view class="p-4 bg-gray-50 rounded">项目1</view>
    <view class="p-4 bg-gray-50 rounded">项目2</view>
    <view class="p-4 bg-gray-50 rounded">项目3</view>
  </view>
</template>
```

#### 4.2 Flex 布局迁移

**ColorUI Flex**:

```vue
<template>
  <view class="cu-bar justify-between">
    <view class="content">标题</view>
    <view class="action">操作</view>
  </view>
</template>
```

**UnoCSS Flex**:

```vue
<template>
  <view class="flex justify-between items-center p-4">
    <view>标题</view>
    <view>操作</view>
  </view>
</template>
```

### 5. 动画系统迁移

#### 5.1 ColorUI 动画

```scss
.cu-load::before {
  animation: cuIcon-spin 2s linear infinite;
}

@keyframes cuIcon-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

#### 5.2 UnoCSS 动画

```typescript
// uno.config.ts 动画配置
export default defineConfig({
  rules: [
    // 自定义旋转动画
    ['animate-spin-slow', { animation: 'spin 2s linear infinite' }],
  ],
  shortcuts: {
    // 加载动画组合
    'loading-spinner': 'animate-spin-slow text-primary text-xl',
  }
})
```

```vue
<template>
  <view class="loading-spinner">⭐</view>
</template>
```

### 6. 图标系统迁移

#### 6.1 ColorUI 图标

```vue
<template>
  <text class="cuIcon-add text-blue"></text>
  <text class="cuIcon-delete text-red"></text>
</template>
```

#### 6.2 wot-design-uni 图标

```vue
<template>
  <wd-icon name="add" color="primary" />
  <wd-icon name="delete" color="danger" />
</template>
```

### 7. 迁移实施计划

#### 7.1 第一阶段：基础配置（3-5天）

**任务列表**:

- [ ] 配置 UnoCSS 基础规则
- [ ] 设置 wot-design-uni 主题色彩
- [ ] 创建 ColorUI 到 UnoCSS 的样式映射表
- [ ] 建立组件替换对照表
- [ ] 配置自定义样式规则

**配置文件示例**:

```typescript
// uno.config.ts
export default defineConfig({
  presets: [
    presetUni(),
    presetAttributify(),
  ],
  theme: {
    colors: {
      // ColorUI 兼容色彩
      primary: '#0081ff',
      success: '#39b54a',
      warning: '#fbbd08',
      danger: '#e54d42',
    },
    spacing: {
      // uni-app rpx 单位适配
      'safe-area-top': 'var(--status-bar-height)',
    }
  },
  shortcuts: {
    // ColorUI 常用组合类
    'cu-card': 'bg-white rounded-lg shadow-sm p-4 m-4',
    'cu-bar': 'flex items-center justify-between p-4',
    'cu-btn': 'px-6 py-2 rounded-full text-center',
  }
})
```

#### 7.2 第二阶段：组件迁移（1-2周）

**迁移顺序**:

1. **基础组件**（1-3天）
   - 按钮 (cu-btn → wd-button)
   - 标签 (cu-tag → wd-tag)
   - 头像 (cu-avatar → wd-img)
   - 加载 (cu-load → wd-loading)

2. **布局组件**（2-4天）
   - 导航栏 (cu-custom → wd-navbar)
   - 列表 (cu-list → wd-cell-group)
   - 卡片 (cu-card → wd-card)
   - 网格 (cu-grid → grid 类)

3. **交互组件**（3-5天）
   - 弹窗 (cu-modal → wd-dialog/wd-popup)
   - 抽屉 (cu-drawer → wd-popup)
   - 轮播 (cu-swiper → wd-swiper)
   - 时间线 (cu-timeline → wd-steps)

#### 7.3 第三阶段：样式优化（3-5天）

**优化任务**:

- [ ] 清理冗余样式代码
- [ ] 优化响应式布局
- [ ] 统一间距和尺寸规范
- [ ] 建立样式组件复用机制
- [ ] 性能优化和体积压缩

### 8. 迁移工具和方法

#### 8.1 自动化迁移脚本

```javascript
// migrate-styles.js - 样式迁移脚本
const fs = require('fs')
const path = require('path')

// ColorUI 到 UnoCSS 类名映射
const classMap = {
  'cu-card': 'bg-white rounded-lg shadow-sm p-4',
  'cu-btn': 'px-6 py-2 rounded-full text-center cursor-pointer',
  'text-blue': 'text-primary',
  'bg-blue': 'bg-primary',
  'text-red': 'text-danger',
  'bg-red': 'bg-danger',
  // ... 更多映射
}

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')

  // 替换 class 名称
  for (const [oldClass, newClass] of Object.entries(classMap)) {
    const regex = new RegExp(oldClass, 'g')
    content = content.replace(regex, newClass)
  }

  // 移除 ColorUI 导入
  content = content.replace(/@import.*colorui.*\n/g, '')

  fs.writeFileSync(filePath, content)
}
```

#### 8.2 样式检查工具

```javascript
// style-check.js - 样式迁移完整性检查
function checkMigration(dirPath) {
  const issues = []

  // 检查是否还有 ColorUI 类名
  const cuClasses = ['cu-', 'text-blue', 'bg-blue', 'text-red', 'bg-red']

  // 检查是否正确使用 wot-design-uni 组件
  const requiredComponents = ['wd-button', 'wd-cell', 'wd-navbar']

  // 生成检查报告
  return issues
}
```

### 9. 测试验证策略

#### 9.1 视觉一致性测试

**测试内容**:

- [ ] 页面整体布局一致性
- [ ] 颜色主题一致性
- [ ] 字体大小和间距一致性
- [ ] 响应式布局正确性
- [ ] 动画效果流畅性

**测试方法**:

```javascript
// visual-test.js
describe('样式迁移视觉测试', () => {
  test('主色调一致性', () => {
    expect(getPrimaryColor()).toBe('#0081ff')
  })

  test('按钮样式一致性', () => {
    expect(getButtonStyle()).toMatchSnapshot()
  })
})
```

#### 9.2 跨平台兼容性测试

**测试平台**:

- [ ] H5 浏览器
- [ ] 微信小程序
- [ ] 支付宝小程序
- [ ] APP (Android/iOS)

### 10. 回滚和风险控制

#### 10.1 渐进式迁移

```vue
<!-- 兼容性迁移方案 -->
<template>
  <view class="migration-container">
    <!-- 新样式 -->
    <wd-button v-if="useNewUI" type="primary">新按钮</wd-button>

    <!-- 旧样式兼容 -->
    <view v-else class="cu-btn bg-blue">旧按钮</view>
  </view>
</template>

<script setup lang="ts">
// 通过配置控制新旧样式切换
const useNewUI = ref(true)
</script>
```

#### 10.2 样式回滚机制

```typescript
// rollback-styles.ts
export function rollbackToColorUI() {
  // 恢复 ColorUI 样式文件
  document.head.appendChild(createStyleLink('/lib/colorui/main.css'))
  document.head.appendChild(createStyleLink('/lib/colorui/icon.css'))

  // 移除 UnoCSS 样式
  document.getElementById('uno-css')?.remove()
}
```

### 11. 性能优化

#### 11.1 样式体积优化

**优化前 (ColorUI)**:

```
lib/colorui/main.css    → 120KB
lib/colorui/icon.css    → 45KB
自定义样式              → 30KB
总计                    → 195KB
```

**优化后 (UnoCSS)**:

```
UnoCSS 运行时生成       → 约 50KB (实际使用的类)
wot-design-uni 组件样式 → 按需加载
总计                    → 约 80KB (60% 体积减少)
```

#### 11.2 加载性能优化

```typescript
// 样式懒加载配置
export default defineConfig({
  uno: {
    // 按需生成样式
    mode: 'per-module',
    // 样式提取优化
    extract: {
      include: ['src/**/*.{vue,ts}'],
      exclude: ['node_modules/**/*']
    }
  }
})
```

---

## 总结

样式系统迁移是整个项目迁移的重要组成部分，通过合理的规划和实施，可以：

1. **提升开发效率**: 原子化 CSS + 现代组件库
2. **改善用户体验**: 更好的视觉效果和交互体验
3. **降低维护成本**: 标准化的样式规范和组件复用
4. **提高性能**: 更小的样式体积和更快的加载速度

迁移过程中需要重点关注**功能一致性**、**视觉一致性**和**性能表现**，确保迁移后的用户体验不低于原系统。
