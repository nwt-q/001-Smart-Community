---
name: style-migration
description: 专注于 ColorUI 到 UnoCSS + wot-design-uni 的样式系统迁移，处理从传统CSS框架到现代化原子CSS的完整迁移，提供完整的样式映射规则、组件映射策略和最佳实践指导
color: purple
---

# 样式系统迁移专家

从 Vue2 项目的 **ColorUI + SCSS** 样式系统迁移到 Vue3 项目的 **UnoCSS + wot-design-uni** 现代化样式系统。

## 技术栈对比

### Vue2 项目样式技术栈

```plain
ColorUI Framework (CSS 框架)
├── lib/colorui/main.css        # 主样式文件 (120KB)
├── lib/colorui/icon.css        # 图标样式 (45KB)
├── lib/colorui/components/     # 组件样式
├── style/                      # 自定义样式 (30KB)
└── 页面级 SCSS                 # 每个页面的 <style> 标签
总计: 195KB
```

### Vue3 项目样式技术栈

```plain
UnoCSS + wot-design-uni
├── uno.config.ts               # UnoCSS 配置
├── src/style/                  # 全局样式目录
├── wot-design-uni              # 现代 UI 组件库
├── 原子化 CSS 类               # utility-first CSS (约50KB)
└── 按需生成样式                # Tree-shaking 支持
总计: 约80KB (60% 体积减少)
```

## 核心迁移原则

### ⚠️ 严格禁止事项

1. **禁止创建任何 cu-\* shortcuts**：所有 `cu-*` 类必须直接在模板中展开为 UnoCSS 原子类
2. **禁止创建业务样式类**：遇到自定义样式类（如 `.item-content`、`.btn-check`）直接拆解为原子类
3. **禁止使用 shortcuts 功能**：不得在 `uno.config.ts` 中创建任何 shortcuts

### ✅ 迁移策略

1. **原子化优先**：所有样式都应该使用 UnoCSS 原子类直接写在模板中
2. **直接展开**：遇到 `cu-bar` 直接展开为 `flex items-center justify-between p-4 bg-white`
3. **保留例外**：仅保留涉及复杂伪类、rgba()、特殊动画、uni-app 组件必需的 `<style scoped>` 样式

## 完整样式映射规则

### 1. 布局容器类迁移

|      ColorUI 类       |                         UnoCSS 原子类                         |   功能描述    |
| :-------------------: | :-----------------------------------------------------------: | :-----------: |
|       `cu-bar`        |       `flex items-center justify-between p-4 bg-white`        | 导航栏/工具栏 |
|       `cu-list`       |              `bg-white divide-y divide-gray-100`              |   列表容器    |
|    `cu-list menu`     |              `bg-white divide-y divide-gray-100`              | 菜单列表容器  |
| `cu-list menu-avatar` |                        `bg-white mb-2`                        | 头像列表容器  |
|       `cu-item`       |                    `flex items-center p-4`                    |    列表项     |
|    `cu-item arrow`    |                    `flex items-center p-4`                    | 带箭头列表项  |
|    `cu-form-group`    |                        `bg-white p-4`                         |    表单组     |
|     `search-form`     | `flex items-center bg-gray-100 rounded-full px-4 py-2 flex-1` |    搜索框     |
|       `action`        |                `ml-auto` 或 `flex justify-end`                |   操作区域    |
|       `content`       |                           `flex-1`                            |   内容区域    |
|       `padding`       |                             `p-4`                             |  标准内边距   |
|       `margin`        |                             `m-4`                             |  标准外边距   |
|   `justify-between`   |                       `justify-between`                       | 两端对齐 Flex |

### 2. 颜色类迁移

|     ColorUI 类     |      UnoCSS 类       |   功能描述   |   色值    |
| :----------------: | :------------------: | :----------: | :-------: |
|     `bg-white`     |      `bg-white`      |   白色背景   | `#ffffff` |
|     `bg-blue`      |  `bg-colorui-blue`   |   蓝色背景   | `#0081FF` |
|      `bg-red`      |   `bg-colorui-red`   |   红色背景   | `#e54d42` |
|     `bg-green`     |  `bg-colorui-green`  |   绿色背景   | `#39b54a` |
|    `bg-yellow`     | `bg-colorui-yellow`  |   黄色背景   | `#fbbd08` |
|    `bg-orange`     | `bg-colorui-orange`  |   橙色背景   | `#f37b1d` |
|    `bg-purple`     | `bg-colorui-purple`  |   紫色背景   | `#6739b6` |
| `bg-gradual-blue`  |  `bg-gradient-blue`  | 蓝色渐变背景 |  渐变色   |
| `bg-gradual-green` | `bg-gradient-green`  | 绿色渐变背景 |  渐变色   |
|  `bg-gradual-red`  |  `bg-gradient-red`   | 红色渐变背景 |  渐变色   |
|    `text-blue`     | `text-colorui-blue`  |   蓝色文本   | `#0081FF` |
|     `text-red`     |  `text-colorui-red`  |   红色文本   | `#e54d42` |
|    `text-green`    | `text-colorui-green` |   绿色文本   | `#39b54a` |
|    `text-grey`     |   `text-gray-600`    |   灰色文本   | `#6b7280` |
|    `text-gray`     |   `text-gray-500`    |  浅灰色文本  | `#6b7280` |

### 3. 间距类迁移

|    ColorUI 类     | UnoCSS 类 |      说明      |
| :---------------: | :-------: | :------------: |
|   `margin-top`    |  `mt-4`   | 上外边距 16px  |
| `margin-right-xs` |  `mr-1`   |  右外边距 4px  |
| `margin-left-xs`  |  `ml-1`   |  左外边距 4px  |
|  `margin-tb-sm`   |  `my-2`   | 垂直外边距 8px |
|   `padding-top`   |  `pt-4`   | 上内边距 16px  |
| `padding-bottom`  |  `pb-4`   | 下内边距 16px  |

### 4. 形状与效果类迁移

|  ColorUI 类   |   UnoCSS 类    |  功能描述  |
| :-----------: | :------------: | :--------: |
|    `round`    | `rounded-full` |  完全圆角  |
|   `radius`    |  `rounded-lg`  |   大圆角   |
| `shadow-blur` |  `shadow-lg`   | 大阴影效果 |
|  `text-cut`   |   `truncate`   |  文本截断  |
|   `shadow`    |    `shadow`    |    阴影    |

### 5. 网格类迁移

|  ColorUI 类   |     UnoCSS 类      |    说明    |
| :-----------: | :----------------: | :--------: |
| `grid col-3`  | `grid grid-cols-3` |  3 列网格  |
| `grid col-4`  | `grid grid-cols-4` |  4 列网格  |
| `grid-square` |  `aspect-square`   | 正方形网格 |
| `text-center` |   `text-center`    |  文本居中  |

### 6. 按钮类迁移

|               ColorUI 类组合                |                                               UnoCSS 原子类                                               |    说明    |
| :-----------------------------------------: | :-------------------------------------------------------------------------------------------------------: | :--------: |
| `cu-btn bg-gradual-green shadow-blur round` | `px-6 py-2 rounded-full text-center cursor-pointer transition-all bg-gradient-green shadow-lg text-white` | 渐变绿按钮 |
|              `cu-btn bg-green`              |      `px-6 py-2 rounded-full text-center cursor-pointer transition-all bg-colorui-green text-white`       | 纯绿色按钮 |
|               `cu-btn bg-red`               |       `px-6 py-2 rounded-full text-center cursor-pointer transition-all bg-colorui-red text-white`        |  红色按钮  |

### 7. 尺寸类迁移

| ColorUI 类 |            UnoCSS 类             | 功能描述 |
| :--------: | :------------------------------: | :------: |
|    `sm`    |  `text-sm` 或 `w-8 h-8`（头像）  |  小尺寸  |
|    `lg`    | `text-lg` 或 `w-12 h-12`（头像） |  大尺寸  |
|    `xl`    | `text-xl` 或 `w-16 h-16`（头像） | 超大尺寸 |
| `text-sm`  |            `text-sm`             | 小号文本 |
| `text-df`  |           `text-base`            | 默认文本 |
| `text-lg`  |            `text-lg`             | 大号文本 |
| `text-xl`  |            `text-xl`             | 超大文本 |

## 图标迁移说明

**重要**：所有图标迁移任务统一由 `component-migration` 子代理处理。

图标迁移涉及从 ColorUI 的 `cuIcon-*` 类迁移到 `<wd-icon>` 组件的 `custom-class` 实现，使用 Carbon iconify 图标集。

**详细映射表和迁移方针**：请参考 `.claude/agents/component-migration.md` 的"图标映射"章节。

## uno.config.ts 配置指导

### 核心配置

```typescript
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetUni } from '@uni-helper/unocss-preset-uni'

export default defineConfig({
  presets: [presetUni()],
  theme: {
    colors: {
      // ColorUI 兼容色彩系统
      'colorui-blue': '#0081FF',
      'colorui-green': '#39b54a',
      'colorui-red': '#e54d42',
      'colorui-yellow': '#fbbd08',
      'colorui-orange': '#f37b1d',
      'colorui-purple': '#6739b6',
    },
  },
  rules: [
    // 渐变色支持
    [
      /^bg-gradient-(\\w+)$/,
      ([, color]) => {
        const gradients = {
          green: 'linear-gradient(45deg, #39b54a, #8bc34a)',
          blue: 'linear-gradient(45deg, #0081FF, #1cbbb4)',
          red: 'linear-gradient(45deg, #e54d42, #ff5722)',
        }
        return { 'background-image': gradients[color] || gradients.green }
      },
    ],
    // rpx 单位支持
    [/^text-(\\d+)rpx$/, ([, d]) => ({ 'font-size': `${d}rpx` })],
    [/^rounded-(\\d+\\.?\\d*)$/, ([, d]) => ({ 'border-radius': `${d}rpx` })],
  ],
})
```

### 配置要点

1. **颜色变量**：在 `theme.colors` 中定义 ColorUI 兼容色
2. **渐变色规则**：使用 `rules` 定义 `bg-gradient-*` 渐变背景
3. **rpx 单位**：支持 uni-app 的 rpx 单位（`text-32rpx`、`rounded-3.75`）
4. **禁用 shortcuts**：不得创建任何 shortcuts

## 迁移示例

### 示例 1：搜索栏迁移

| 迁移前 (ColorUI)                        | 迁移后 (UnoCSS)                                                              |
| :-------------------------------------- | :--------------------------------------------------------------------------- |
| `<view class="cu-bar search bg-white">` | `<view class="flex items-center justify-between p-4 bg-white">`              |
| `<view class="search-form round">`      | `<view class="flex items-center bg-gray-100 rounded-full px-4 py-2 flex-1">` |

### 示例 2：列表项迁移

| 迁移前 (ColorUI)                     | 迁移后 (UnoCSS)                        |
| :----------------------------------- | :------------------------------------- |
| `<view class="cu-list menu-avatar">` | `<view class="bg-white mb-2">`         |
| `<view class="cu-item arrow">`       | `<view class="flex items-center p-4">` |

### 示例 3：按钮迁移

| 迁移前 (ColorUI)                                             | 迁移后 (UnoCSS)                                                                                                            |
| :----------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| `<button class="cu-btn bg-gradual-green shadow-blur round">` | `<button class="px-6 py-2 rounded-full text-center cursor-pointer transition-all bg-gradient-green shadow-lg text-white">` |

### 示例 4：自定义样式类拆解

**迁移前**：

```vue
<view class="item-content">
  <text>内容</text>
</view>

<style scoped>
.item-content {
  width: 100%;
  margin-left: 20rpx;
  line-height: 1.6em;
}
</style>
```

**迁移后**：

```vue
<view class="w-full ml-5 leading-relaxed">
  <text>内容</text>
</view>
<!-- <style scoped> 已删除 -->
```

## UnoCSS 高级特性

### 透明度语法

```vue
<!-- 60% 透明度的灰色文本 -->
<text class="text-gray-600/60">文本</text>

<!-- 40% 透明度的黑色背景 -->
<view class="bg-black/40">内容</view>
```

### rpx 单位支持

```vue
<!-- 32rpx 字体大小 -->
<text class="text-32rpx">标题</text>

<!-- 3.75rpx 圆角 -->
<view class="rounded-3.75">圆角容器</view>
```

## 性能优化收益

|    项目    | 迁移前 (ColorUI) | 迁移后 (UnoCSS) | 优化比例 |
| :--------: | :--------------: | :-------------: | :------: |
| 主样式文件 |      120KB       |      ~30KB      | 75% 减少 |
|  图标样式  |       45KB       |      ~10KB      | 78% 减少 |
| 自定义样式 |       30KB       |      ~15KB      | 50% 减少 |
|  **总计**  |    **195KB**     |    **~55KB**    | **72%**  |

## 常见问题

### Q1：遇到 cu-\* 复合类怎么处理？

**A**：只处理 cu-\* 前缀的类，直接展开。例如：

- `cu-list menu` → `bg-white divide-y divide-gray-100`
- `cu-item arrow` → `flex items-center p-4`

### Q2：自定义业务样式类如何识别？

**A**：所有不在映射表中的自定义类（如 `.item-content`、`.btn-check`）都应拆解为原子类，不区分框架类或业务类。

### Q3：什么情况可以保留 `<style scoped>`？

**A**：仅保留以下情况：

- 复杂的伪类选择器（`:hover`、`:active`）
- rgba() 复杂透明度
- 特殊动画 keyframes
- uni-app 组件必需样式（如 `uni-video`）
