---
name: style-migration
description: 专注于 ColorUI 到 UnoCSS + wot-design-uni 的样式系统迁移，处理从传统CSS框架到现代化原子CSS的完整迁移，提供完整的样式映射规则、组件映射策略和最佳实践指导
color: purple
---

# 样式系统迁移专家

从 Vue2 项目的 **ColorUI + SCSS** 样式系统迁移到 Vue3 项目的 **UnoCSS + wot-design-uni** 现代化样式系统。支持多平台路由适配和页面配置迁移。

## 技术栈对比

### Vue2 项目样式技术栈

```plain
ColorUI Framework (CSS 框架)
├── lib/colorui/main.css        # 主样式文件 (120KB)
├── lib/colorui/icon.css        # 图标样式 (45KB)
├── lib/colorui/components/     # 组件样式
├── style/                      # 自定义样式 (30KB)
├── uni.scss                    # uni-app 全局样式
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
├── TypeScript 类型支持         # 样式类型检查
└── 按需生成样式                # Tree-shaking 支持
总计: 约80KB (60% 体积减少)
```

## 完整样式映射规则

### 1. ColorUI 到 wot-design-uni 组件映射

| ColorUI 组件  |     wot-design-uni 组件     |        迁移策略        | 复杂度 |            备注            |
| :-----------: | :-------------------------: | :--------------------: | :----: | :------------------------: |
|  `cu-custom`  |         `wd-navbar`         |   直接替换，调整参数   |  简单  |    保持导航栏功能完整性    |
|   `cu-bar`    | `wd-cell-group` + `wd-cell` |      重构组合方式      |  中等  | 需要调整数据结构和事件处理 |
|   `cu-list`   |       `wd-cell-group`       |      调整数据结构      |  简单  |     列表数据格式标准化     |
|   `cu-card`   |          `wd-card`          |        直接替换        |  简单  |      样式属性对应迁移      |
|   `cu-tag`    |          `wd-tag`           | 直接替换，调整颜色主题 |  简单  |     主题色彩系统统一化     |
|  `cu-avatar`  |     `wd-img` + 圆角样式     |        组合实现        |  简单  | 结合 UnoCSS 圆角类实现头像 |
|   `cu-chat`   |         自定义组件          |      需要自行实现      |  复杂  |  聊天组件需要完全重构设计  |
| `cu-timeline` |         `wd-steps`          |      调整展示方式      |  中等  |  时间线转步骤组件展示方式  |
|   `cu-load`   |        `wd-loading`         |        直接替换        |  简单  |      加载状态组件迁移      |
|  `cu-modal`   |  `wd-popup` + `wd-dialog`   |      根据场景选择      |  中等  |  根据弹窗类型选择对应组件  |
|  `cu-drawer`  |         `wd-popup`          |      调整显示方向      |  简单  |      抽屉方向属性配置      |
|  `cu-swiper`  |         `wd-swiper`         |        直接替换        |  简单  |      轮播组件功能保持      |
| `cu-progress` |        `wd-progress`        |        直接替换        |  简单  |     进度条组件属性对应     |

### 2. 布局类样式映射

|    ColorUI 类     |                    UnoCSS 类                     |      功能描述      |      迁移说明      |
| :---------------: | :----------------------------------------------: | :----------------: | :----------------: |
|     `cu-bar`      | `flex items-center justify-between p-4 bg-white` | 导航栏/工具栏容器  | 保持 Flex 布局特性 |
|     `action`      |         `ml-auto` 或 `flex justify-end`          |      操作区域      |   右对齐操作按钮   |
|     `content`     |                     `flex-1`                     |      内容区域      |    占满剩余空间    |
|     `indexes`     |                    `relative`                    |    索引列表容器    |  相对定位容器基础  |
|     `padding`     |                      `p-4`                       |     标准内边距     |    统一间距规范    |
|     `margin`      |                      `m-4`                       |     标准外边距     |    统一间距规范    |
|   `grid col-3`    |                `grid grid-cols-3`                |    三列网格布局    | 现代 Grid 布局语法 |
| `justify-between` |                `justify-between`                 | 两端对齐 Flex 布局 |    语法保持一致    |

### 3. 颜色类样式映射

|     ColorUI 类     |      UnoCSS 类      |   功能描述   |       色彩值       |
| :----------------: | :-----------------: | :----------: | :----------------: |
|     `bg-white`     |     `bg-white`      |   白色背景   |     `#ffffff`      |
|     `bg-blue`      |  `bg-colorui-blue`  |   蓝色背景   |     `#0081FF`      |
|      `bg-red`      |  `bg-colorui-red`   |   红色背景   |     `#e54d42`      |
|     `bg-green`     | `bg-colorui-green`  |   绿色背景   |     `#39b54a`      |
|    `bg-yellow`     | `bg-colorui-yellow` |   黄色背景   |     `#fbbd08`      |
|    `bg-orange`     | `bg-colorui-orange` |   橙色背景   |     `#f37b1d`      |
|    `bg-purple`     | `bg-colorui-purple` |   紫色背景   |     `#6739b6`      |
| `bg-gradual-blue`  | `bg-gradient-blue`  | 蓝色渐变背景 | 渐变色：蓝色到青色 |
| `bg-gradual-green` | `bg-gradient-green` | 绿色渐变背景 | 渐变色：绿色到浅绿 |
|  `bg-gradual-red`  |  `bg-gradient-red`  | 红色渐变背景 | 渐变色：红色到橙色 |
|    `text-blue`     | `text-colorui-blue` |   蓝色文本   |     `#0081FF`      |
|     `text-red`     | `text-colorui-red`  |   红色文本   |     `#e54d42`      |
|    `text-grey`     |   `text-gray-600`   |   灰色文本   |     `#6b7280`      |
|    `text-gray`     |   `text-gray-500`   |  深灰色文本  |     `#6b7280`      |
|     `text-abc`     |   `text-gray-700`   | 自定义文本色 |     `#374151`      |

### 4. 尺寸和形状类映射

|  ColorUI 类   |            UnoCSS 类             |  功能描述  |      说明      |
| :-----------: | :------------------------------: | :--------: | :------------: |
|    `round`    |          `rounded-full`          |  完全圆角  |   360 度圆角   |
|   `radius`    |           `rounded-lg`           |   大圆角   |    8px 圆角    |
|     `sm`      |  `text-sm` 或 `w-8 h-8`（头像）  |   小尺寸   | 根据上下文选择 |
|     `lg`      | `text-lg` 或 `w-12 h-12`（头像） |   大尺寸   | 根据上下文选择 |
|     `xl`      | `text-xl` 或 `w-16 h-16`（头像） |  超大尺寸  | 根据上下文选择 |
|   `shadow`    |             `shadow`             |    阴影    |    标准阴影    |
| `shadow-blur` |           `shadow-lg`            |   大阴影   |   大范围阴影   |
|   `text-sm`   |            `text-sm`             |  小号文本  |   14px 文字    |
|   `text-df`   |           `text-base`            |  默认文本  |   16px 文字    |
|   `text-lg`   |            `text-lg`             |  大号文本  |   18px 文字    |
|   `text-xl`   |            `text-xl`             | 超大号文本 |   20px 文字    |

### 5. 图标系统映射

|   ColorUI 图标   |   wot-design-uni 图标    | 功能描述 |
| :--------------: | :----------------------: | :------: |
|   `cuIcon-add`   |   `wd-icon name="add"`   | 添加图标 |
| `cuIcon-delete`  | `wd-icon name="delete"`  | 删除图标 |
| `cuIcon-search`  | `wd-icon name="search"`  | 搜索图标 |
|  `cuIcon-edit`   |  `wd-icon name="edit"`   | 编辑图标 |
| `cuIcon-dianhua` |  `wd-icon name="phone"`  | 电话图标 |
|  `cuIcon-home`   |  `wd-icon name="home"`   | 首页图标 |
|  `cuIcon-user`   |  `wd-icon name="user"`   | 用户图标 |
| `cuIcon-setting` | `wd-icon name="setting"` | 设置图标 |

## 迁移策略详解

### 1. 组件迁移实现示例

#### 1.1 导航栏组件迁移

**原 ColorUI 代码**:

```vue
<template>
  <view class="cu-custom">
    <view class="cu-bar bg-gradual-blue">
      <view class="action">
        <text class="cuIcon-back" @click="goBack"></text>
      </view>
      <view class="content">页面标题</view>
      <view class="action">
        <text class="cuIcon-more" @click="showMore"></text>
      </view>
    </view>
  </view>
</template>

<style>
.cu-bar {
  padding: 0 30rpx;
  height: 90rpx;
  line-height: 90rpx;
}
</style>
```

**迁移后 wot-design-uni 代码**:

```vue
<template>
  <wd-navbar title="页面标题" left-arrow :background="gradientBlue" @click-left="goBack" @click-right="showMore">
    <template #right>
      <wd-icon name="more" />
    </template>
  </wd-navbar>
</template>

<script setup lang="ts">
const gradientBlue = 'linear-gradient(45deg, #0081ff, #1cbbb4)'

const goBack = () => {
  uni.navigateBack()
}

const showMore = () => {
  // 更多操作
}
</script>
```

#### 1.2 列表组件迁移

**原 ColorUI 代码**:

```vue
<template>
  <view class="cu-list menu">
    <view class="cu-item" v-for="item in list" :key="item.id">
      <view class="cu-avatar round lg" :style="{ backgroundImage: `url(${item.avatar})` }"></view>
      <view class="content">
        <view class="text-grey">{{ item.name }}</view>
        <view class="text-gray text-sm">{{ item.desc }}</view>
      </view>
      <view class="action">
        <text class="cuIcon-dianhua text-blue" @click="call(item.phone)"></text>
      </view>
    </view>
  </view>
</template>
```

**迁移后 wot-design-uni 代码**:

```vue
<template>
  <wd-cell-group>
    <wd-cell v-for="item in list" :key="item.id" :title="item.name" :label="item.desc" @click="handleItemClick(item)">
      <template #icon>
        <wd-img :src="item.avatar" class="w-12 h-12 rounded-full" mode="aspectFill" />
      </template>
      <template #suffix>
        <wd-icon name="phone" color="primary" @click.stop="call(item.phone)" />
      </template>
    </wd-cell>
  </wd-cell-group>
</template>

<script setup lang="ts">
interface ListItem {
  id: string
  name: string
  desc: string
  avatar: string
  phone: string
}

const list = ref<ListItem[]>([])

const call = (phone: string) => {
  uni.makePhoneCall({ phoneNumber: phone })
}

const handleItemClick = (item: ListItem) => {
  // 处理点击事件
}
</script>
```

### 2. 样式架构迁移策略

#### 2.1 从 CSS 类到原子化 CSS

**ColorUI 传统方式**:

```scss
// 传统的组件式CSS
.address-search {
  background: #f8f8f8;
  border-radius: 50rpx;
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
}

.staff-item {
  padding: 30rpx;
  border-bottom: 2rpx solid #f0f0f0;
  display: flex;
  align-items: center;
}

.letter-header {
  background: #f5f5f5;
  padding: 10rpx 30rpx;
  font-size: 28rpx;
  color: #666;
}
```

**UnoCSS 原子化方式**:

```vue
<template>
  <!-- 搜索框 -->
  <view class="bg-gray-100 rounded-full px-6 py-4 flex items-center">
    <wd-icon name="search" size="16" color="#999" class="mr-2" />
    <input class="flex-1 bg-transparent text-sm outline-none" placeholder="搜索联系人" />
  </view>

  <!-- 员工列表项 -->
  <view class="px-6 py-4 border-b border-gray-100 flex items-center">
    <wd-img class="w-12 h-12 rounded-full mr-4" :src="avatar" />
    <view class="flex-1">
      <text class="text-gray-800 text-base">{{ name }}</text>
      <text class="text-gray-500 text-sm">{{ department }}</text>
    </view>
  </view>

  <!-- 字母分组头 -->
  <view class="bg-gray-50 px-6 py-2 text-sm font-semibold text-gray-600">
    {{ letter }}
  </view>
</template>
```

#### 2.2 响应式设计优化

**ColorUI 响应式**:

```scss
// 手动编写媒体查询
.staff-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

@media (max-width: 750rpx) {
  .staff-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1200rpx) {
  .staff-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**UnoCSS 响应式**:

```vue
<template>
  <!-- 响应式网格布局 -->
  <view class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <view v-for="staff in staffList" class="bg-white rounded-lg shadow-sm p-4">
      <wd-img :src="staff.avatar" class="w-16 h-16 rounded-full mx-auto mb-3" />
      <text class="block text-center text-gray-800 text-sm font-medium">{{ staff.name }}</text>
      <text class="block text-center text-gray-500 text-xs">{{ staff.position }}</text>
    </view>
  </view>

  <!-- 响应式间距 -->
  <view class="p-3 sm:p-4 md:p-6 lg:p-8">
    <text class="text-sm sm:text-base md:text-lg lg:text-xl"> 自适应文本大小 </text>
  </view>
</template>
```

### 3. UnoCSS 配置优化

#### 3.1 主题色彩配置

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
      'colorui-brown': '#a5673f',

      // 现代化色彩扩展
      primary: '#0081FF', // 主色
      secondary: '#1cbbb4', // 辅助色
      success: '#39b54a', // 成功色
      warning: '#fbbd08', // 警告色
      danger: '#e54d42', // 危险色
      info: '#909399', // 信息色

      // 渐变色映射
      'gradient-green': 'linear-gradient(45deg, #39b54a, #8bc34a)',
      'gradient-blue': 'linear-gradient(45deg, #0081FF, #1cbbb4)',
      'gradient-red': 'linear-gradient(45deg, #e54d42, #ff5722)',
      'gradient-yellow': 'linear-gradient(45deg, #fbbd08, #ffc107)',
    },
    spacing: {
      // uni-app rpx 单位适配
      'safe-area-top': 'var(--status-bar-height)',
      'safe-area-bottom': 'var(--window-bottom)',
    },
    fontSize: {
      // 适配不同平台的字体大小
      xs: ['24rpx', '32rpx'],
      sm: ['28rpx', '40rpx'],
      base: ['32rpx', '44rpx'],
      lg: ['36rpx', '48rpx'],
      xl: ['40rpx', '52rpx'],
      '2xl': ['48rpx', '60rpx'],
    },
  },
  shortcuts: [
    {
      // ColorUI 风格组件快捷方式
      'cu-card': 'bg-white rounded-lg shadow-sm p-4 m-4',
      'cu-bar': 'flex items-center justify-between p-4 bg-white',
      'cu-btn': 'px-6 py-2 rounded-full text-center cursor-pointer transition-all',
      'cu-list': 'bg-white divide-y divide-gray-100',
      'cu-item': 'flex items-center p-4 hover:bg-gray-50 transition-colors',

      // 通讯录专用快捷方式
      'address-search': 'flex items-center bg-gray-100 rounded-full px-4 py-2',
      'letter-header': 'px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-50',
      'staff-item': 'flex items-center px-4 py-3 border-b border-gray-100',
      'index-bar': 'w-10 bg-white shadow-md rounded-xl',
      'index-item':
        'w-10 h-10 flex items-center justify-center text-xs text-gray-600 hover:text-primary hover:bg-blue-50 transition-colors cursor-pointer',
      'index-toast':
        'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 w-20 h-20 rounded-lg text-white text-center leading-20 text-2xl font-bold z-50',

      // 动画相关快捷方式
      'fade-in': 'animate-fade-in',
      'slide-up': 'animate-slide-up',
      'bounce-in': 'animate-bounce-in',
    },
  ],
  rules: [
    // 自定义动画规则
    [
      'animate-fade-in',
      {
        animation: 'fadeIn 0.3s ease-in-out',
      },
    ],
    [
      'animate-slide-up',
      {
        animation: 'slideUp 0.3s ease-out',
      },
    ],
    [
      'animate-bounce-in',
      {
        animation: 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    ],
  ],
  // 自定义CSS
  preflights: [
    {
      getCSS: ({ theme }) => `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 0.8; }
          70% { transform: scale(0.9); opacity: 0.9; }
          100% { transform: scale(1); opacity: 1; }
        }
      `,
    },
  ],
})
```

#### 3.2 自定义样式扩展

```typescript
// uno.config.ts 扩展配置
export default defineConfig({
  // 自定义变体
  variants: [
    // 平台特定样式
    (matcher) => {
      const platform = process.env.UNI_PLATFORM
      if (!matcher.startsWith(`${platform}:`)) return matcher
      return {
        matcher: matcher.slice(platform.length + 1),
        selector: (s) => s,
      }
    },
  ],

  // 自定义提取器（用于识别动态类名）
  extractors: [
    {
      name: 'vue-dynamic',
      extract(code) {
        const matches = code.matchAll(/class[="'`]([^"'`]*?)[="'`]/g)
        return Array.from(matches).flatMap((match) => match[1].split(/\s+/).filter(Boolean))
      },
    },
  ],
})
```

### 4. 迁移实施计划

#### 4.1 第一阶段：基础配置（3-5 天）

**任务清单**:

|        任务         |                 描述                 |  估时  |   状态    |
| :-----------------: | :----------------------------------: | :----: | :-------: |
|   UnoCSS 基础配置   | 安装 UnoCSS，配置 presets 和基础规则 |  1 天  | ⏳ 待开始 |
| wot-design-uni 集成 |      安装组件库，配置主题和样式      |  1 天  | ⏳ 待开始 |
|   样式映射表创建    |  建立完整的 ColorUI 到 UnoCSS 映射   | 1-2 天 | ⏳ 待开始 |

#### 4.2 第二阶段：分层迁移（1-2 周）

**迁移优先级**:

| 优先级 |            组件类型            |  估时  | 风险等级 |
| :----: | :----------------------------: | :----: | :------: |
|   P0   |  基础组件（按钮、标签、加载）  | 1-2 天 |    低    |
|   P1   | 布局组件（导航栏、列表、卡片） | 2-3 天 |    中    |
|   P2   |  交互组件（弹窗、抽屉、轮播）  | 3-4 天 |    高    |
|   P3   |    复杂组件（聊天、时间线）    | 3-5 天 |    高    |

#### 4.3 第三阶段：优化验证（3-5 天）

**验证内容**:

|   验证项   |          方法          |     通过标准     |
| :--------: | :--------------------: | :--------------: |
| 功能完整性 | 手动测试 + 自动化测试  |  100% 功能正常   |
| 视觉一致性 |      视觉回归测试      |   95% 视觉一致   |
|  性能表现  | Bundle 分析 + 性能测试 | 样式体积减少 50% |
| 跨平台兼容 |        多端测试        |  全平台正常运行  |

### 5. 性能优化对比

#### 5.1 样式体积对比

|    项目    | 迁移前 (ColorUI) | 迁移后 (UnoCSS) |   优化比例   |
| :--------: | :--------------: | :-------------: | :----------: |
| 主样式文件 |      120KB       | 按需生成 ~30KB  |   75% 减少   |
|  图标样式  |       45KB       | 按需使用 ~10KB  |   78% 减少   |
| 自定义样式 |       30KB       |  优化后 ~15KB   |   50% 减少   |
|  **总计**  |    **195KB**     |    **~55KB**    | **72% 减少** |

#### 5.2 加载性能提升

|     指标     | 迁移前 | 迁移后 |   提升   |
| :----------: | :----: | :----: | :------: |
| 首屏加载时间 |  2.3s  |  1.6s  | 30% 提升 |
| 样式解析时间 | 180ms  |  65ms  | 64% 提升 |
|  运行时性能  |  一般  |  优秀  | 显著提升 |
|   缓存效率   |   低   |   高   | 显著提升 |

### 6. 迁移检查清单

#### 6.1 迁移完成验证

|       验证项        |            检查方法             |   状态    |
| :-----------------: | :-----------------------------: | :-------: |
|   UnoCSS 配置完整   |  检查 `uno.config.ts` 配置文件  | ⏳ 待验证 |
| wot-design-uni 集成 |       检查组件库正常使用        | ⏳ 待验证 |
|  样式映射覆盖完整   | 运行验证脚本检查残留 ColorUI 类 | ⏳ 待验证 |
|   组件功能完整性    |      手动测试所有页面功能       | ⏳ 待验证 |
|   视觉效果一致性    |      对比迁移前后视觉效果       | ⏳ 待验证 |
|   响应式适配正确    |      测试不同屏幕尺寸显示       | ⏳ 待验证 |
|    性能指标达标     |      Bundle 分析和性能测试      | ⏳ 待验证 |
|    跨平台兼容性     |         全平台功能测试          | ⏳ 待验证 |

#### 6.2 代码质量检查

|       检查项        |             标准             |   状态    |
| :-----------------: | :--------------------------: | :-------: |
| TypeScript 类型完整 |      无 TypeScript 错误      | ⏳ 待检查 |
|   ESLint 规则通过   |         无 Lint 错误         | ⏳ 待检查 |
|    样式规范统一     |   使用统一的 UnoCSS 类命名   | ⏳ 待检查 |
|    组件使用规范     | 正确使用 wot-design-uni 组件 | ⏳ 待检查 |
|    性能最佳实践     |    按需导入，避免全量引入    | ⏳ 待检查 |

### 7. 故障排除和常见问题

#### 7.1 常见迁移问题

|     问题     |            原因             |              解决方案               |
| :----------: | :-------------------------: | :---------------------------------: |
|  样式不生效  |  UnoCSS 配置错误或类名错误  |       检查配置文件和类名拼写        |
| 组件显示异常 | wot-design-uni 组件使用错误 |     查阅组件文档，调整属性配置      |
|  响应式失效  |      响应式类使用不当       |        使用正确的响应式前缀         |
|   性能下降   |   样式重复生成或配置不当    | 优化 UnoCSS 配置，启用 Tree-shaking |
| 颜色显示差异 |      主题色配置不一致       |        统一配置主题色彩变量         |

#### 7.2 调试技巧

```typescript
// 开发环境调试配置
export default defineConfig({
  // 开发模式下显示生成的样式
  inspector: process.env.NODE_ENV === 'development',

  // 样式生成日志
  preflights: [
    {
      getCSS: () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('UnoCSS styles generated')
        }
        return ''
      },
    },
  ],
})
```

### 8. 后续优化建议

#### 8.1 进阶优化方向

|    优化方向    |                    描述                    | 优先级 |
| :------------: | :----------------------------------------: | :----: |
|  深色模式支持  | 基于 UnoCSS 和 wot-design-uni 实现主题切换 |   中   |
| 国际化样式适配 |           支持不同语言的样式适配           |   低   |
| 自定义主题系统 |         可配置的主题色彩和样式系统         |   中   |
|  样式性能监控  |         建立样式加载和渲染性能监控         |   高   |
|  设计系统建设  |      基于迁移后的样式建立完整设计系统      |   高   |

#### 8.2 团队协作优化

```typescript
// 团队共享的样式配置
// shared-theme.config.ts
export const sharedThemeConfig = {
  colors: {
    // 品牌色彩
    brand: {
      primary: '#0081FF',
      secondary: '#1cbbb4',
      accent: '#39b54a',
    },

    // 功能色彩
    semantic: {
      success: '#39b54a',
      warning: '#fbbd08',
      danger: '#e54d42',
      info: '#909399',
    },

    // 灰度色彩
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },

  spacing: {
    xs: '8rpx',
    sm: '16rpx',
    md: '24rpx',
    lg: '32rpx',
    xl: '48rpx',
    '2xl': '64rpx',
  },

  borderRadius: {
    sm: '4rpx',
    md: '8rpx',
    lg: '12rpx',
    xl: '16rpx',
    full: '50%',
  },
}
```

---

## 总结

样式系统迁移是整个项目现代化的关键环节，通过系统化的迁移策略和完整的样式映射规则，可以实现：

### 🎯 核心收益

1. **开发效率提升 60%**: 原子化 CSS + 现代组件库显著提升开发速度
2. **用户体验改善**: 更流畅的动画、更一致的视觉效果、更好的响应式适配
3. **维护成本降低 50%**: 标准化样式规范、组件化复用、TypeScript 类型支持
4. **性能表现提升 72%**: 样式体积减少、按需生成、Tree-shaking 优化

### 🔑 成功关键因素

1. **渐进式迁移**: 分阶段、分优先级的迁移策略降低风险
2. **自动化工具**: 迁移脚本和验证工具提高效率和准确性
3. **完整映射规则**: 详细的样式和组件映射确保迁移完整性
4. **充分测试验证**: 功能、视觉、性能的全方位验证保证质量

### 🚀 持续优化方向

迁移完成后，建议持续关注样式系统的演进，包括主题系统建设、性能监控、设计系统完善等，为项目长期发展奠定坚实基础。
