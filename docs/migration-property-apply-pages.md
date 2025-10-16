# 房屋申请系列页面迁移报告

> **迁移日期**: 2025-10-16
> **迁移范围**: 房屋申请系列页面（5 个文件）
> **技术栈**: ColorUI + Vue2 → UnoCSS + wot-design-uni + Vue3

## 📋 目录

- [1. 迁移概述](#1-迁移概述)
- [3. 详细迁移统计](#3-详细迁移统计)
- [5. 技术要点总结](#5-技术要点总结)

## 1. 迁移概述

### 1.1 迁移目标

将房屋申请系列页面从 Vue2 + ColorUI 技术栈完整迁移到 Vue3 + UnoCSS + wot-design-uni 现代化技术栈。

### 1.2 涉及文件

| 序号 | 文件路径                                              | 页面功能           | 迁移复杂度 |
| :--: | :---------------------------------------------------- | :----------------- | :--------: |
|  1   | `src/pages-sub/property/apply-room.vue`               | 房屋申请列表页     |    中等    |
|  2   | `src/pages-sub/property/apply-room-record.vue`        | 房屋申请记录页     |    中等    |
|  3   | `src/pages-sub/property/apply-room-detail.vue`        | 房屋申请详情页     |     高     |
|  4   | `src/pages-sub/property/apply-room-record-detail.vue` | 房屋申请记录详情页 |    中等    |
|  5   | `src/pages-sub/property/apply-room-record-handle.vue` | 房屋申请记录处理页 |     低     |

### 1.3 迁移原则

1. **不滥用 shortcuts**：所有 `cu-*` 类必须直接展开为 UnoCSS 原子类
2. **避免业务样式类**：自定义业务样式类必须拆解到模板中
3. **保持视觉一致**：迁移后的视觉效果与原来完全一致
4. **代码清晰可读**：添加详细注释，结构清晰

#### 阶段 3: 配置验证

**验证项**：

- ✅ `uno.config.ts` 配置完整性
- ✅ 颜色变量定义正确
- ✅ 渐变色支持正常
- ✅ rpx 单位支持正常

**结果**：无需修改 `uno.config.ts`，所有配置已完善

---

## 3. 详细迁移统计

### 3.1 图标迁移统计

| 文件名                       | 迁移前图标数 | 迁移后图标数  | 迁移方式         |
| :--------------------------- | :----------: | :-----------: | :--------------- |
| apply-room.vue               | 4 个 cuIcon  | 4 个 wd-icon  | ColorUI → Carbon |
| apply-room-record.vue        | 2 个 cuIcon  | 2 个 wd-icon  | ColorUI → Carbon |
| apply-room-detail.vue        | 13 个 cuIcon | 13 个 wd-icon | ColorUI → Carbon |
| apply-room-record-detail.vue | 3 个 cuIcon  | 3 个 wd-icon  | ColorUI → Carbon |
| apply-room-record-handle.vue |     0 个     |     0 个      | -                |
| **总计**                     |  **22 个**   |   **22 个**   | **100%**         |

#### 图标映射表

| ColorUI 图标          | Carbon 图标              | 使用频率 | 语义说明  |
| :-------------------- | :----------------------- | :------: | :-------- |
| `cuIcon-search`       | `i-carbon-search`        |   2 次   | 搜索      |
| `cuIcon-notification` | `i-carbon-notification`  |   3 次   | 通知/消息 |
| `cuIcon-right`        | `i-carbon-chevron-right` |   2 次   | 右箭头    |
| `cuIcon-time`         | `i-carbon-time`          |  10 次   | 时间      |
| `cuIcon-edit`         | `i-carbon-edit`          |   1 次   | 编辑      |
| `cuIcon-ticket`       | `i-carbon-ticket`        |   1 次   | 票据/类型 |
| `cuIcon-profile`      | `i-carbon-user-avatar`   |   1 次   | 用户头像  |
| `cuIcon-phone`        | `i-carbon-phone`         |   1 次   | 电话      |
| `cuIcon-footprint`    | `i-carbon-footprints`    |   4 次   | 足迹/备注 |
| `cuIcon-deletefill`   | `i-carbon-trash-can`     |   1 次   | 删除      |

**迁移示例**：

```vue
<!-- 迁移前 -->
<text class="cuIcon-notification text-green" />

<!-- 迁移后 -->
<wd-icon name="" custom-class="i-carbon-notification text-colorui-green" />
```

### 3.2 样式类迁移统计

#### 布局容器类迁移

| ColorUI 类            | UnoCSS 原子类                                                 | 使用频率 | 说明          |
| :-------------------- | :------------------------------------------------------------ | :------: | :------------ |
| `cu-bar`              | `flex items-center justify-between p-4 bg-white`              |   1 次   | 导航栏/工具栏 |
| `cu-list menu`        | `bg-white divide-y divide-gray-100`                           |   3 次   | 列表容器      |
| `cu-list menu-avatar` | `bg-white mb-2`                                               |   2 次   | 列表项容器    |
| `cu-item`             | `flex items-center p-4`                                       |   多次   | 列表项        |
| `cu-item arrow`       | `flex items-center p-4`                                       |   多次   | 带箭头列表项  |
| `cu-form-group`       | `bg-white p-4`                                                |   2 次   | 表单组        |
| `search-form`         | `flex items-center bg-gray-100 rounded-full px-4 py-2 flex-1` |   2 次   | 搜索框        |

#### 颜色类迁移

| ColorUI 类         | UnoCSS 类            | 色值      | 使用频率 |
| :----------------- | :------------------- | :-------- | :------: |
| `text-grey`        | `text-gray-600`      | `#6b7280` |   高频   |
| `text-gray`        | `text-gray-500`      | `#6b7280` |   高频   |
| `text-green`       | `text-colorui-green` | `#39b54a` |   高频   |
| `bg-white`         | `bg-white`           | `#ffffff` |   高频   |
| `bg-red`           | `bg-colorui-red`     | `#e54d42` |   1 次   |
| `bg-gradual-green` | `bg-gradient-green`  | 渐变色    |   2 次   |

#### 间距类迁移

| ColorUI 类        | UnoCSS 类 | 说明           |
| :---------------- | :-------- | :------------- |
| `margin-top`      | `mt-4`    | 上外边距 16px  |
| `margin-right-xs` | `mr-1`    | 右外边距 4px   |
| `margin-left-xs`  | `ml-1`    | 左外边距 4px   |
| `margin-tb-sm`    | `my-2`    | 垂直外边距 8px |

#### 形状与效果类迁移

| ColorUI 类    | UnoCSS 类      | 说明       |
| :------------ | :------------- | :--------- |
| `round`       | `rounded-full` | 完全圆角   |
| `shadow-blur` | `shadow-lg`    | 大阴影效果 |
| `text-cut`    | `truncate`     | 文本截断   |

#### 按钮类迁移

| ColorUI 类组合                              | UnoCSS 原子类                                                                                             | 说明         |
| :------------------------------------------ | :-------------------------------------------------------------------------------------------------------- | :----------- |
| `cu-btn bg-gradual-green shadow-blur round` | `px-6 py-2 rounded-full text-center cursor-pointer transition-all bg-gradient-green shadow-lg text-white` | 渐变绿色按钮 |
| `cu-btn bg-green`                           | `px-6 py-2 rounded-full text-center cursor-pointer transition-all bg-colorui-green text-white`            | 纯绿色按钮   |
| `cu-btn bg-red`                             | `px-6 py-2 rounded-full text-center cursor-pointer transition-all bg-colorui-red text-white`              | 红色按钮     |

#### 网格类迁移

| ColorUI 类    | UnoCSS 类          | 说明         |
| :------------ | :----------------- | :----------- |
| `grid col-4`  | `grid grid-cols-4` | 4 列网格     |
| `grid-square` | `aspect-square`    | 正方形网格项 |
| `text-center` | `text-center`      | 文本居中     |

**拆解示例**：

```vue
<!-- 迁移前 -->
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

<!-- 迁移后 -->
<view class="w-full ml-5 leading-relaxed">
  <text>内容</text>
</view>
<!-- <style scoped> 已删除 -->
```

## 5. 技术要点总结

#### 2. 图标映射策略

| 场景 | ColorUI               | Carbon                   | 选择依据             |
| :--- | :-------------------- | :----------------------- | :------------------- |
| 搜索 | `cuIcon-search`       | `i-carbon-search`        | 语义直接对应         |
| 通知 | `cuIcon-notification` | `i-carbon-notification`  | 语义直接对应         |
| 箭头 | `cuIcon-right`        | `i-carbon-chevron-right` | 现代化箭头样式       |
| 时间 | `cuIcon-time`         | `i-carbon-time`          | 语义直接对应         |
| 用户 | `cuIcon-profile`      | `i-carbon-user-avatar`   | 更准确的用户头像语义 |
| 删除 | `cuIcon-deletefill`   | `i-carbon-trash-can`     | 更通用的删除图标     |

### 5.2 样式类迁移技术要点

#### 1. Flex 布局原子化

```vue
<!-- ColorUI 组合类 -->
<view class="cu-bar"></view>

<!-- UnoCSS 原子类展开 -->
<view class="flex items-center justify-between p-4 bg-white"></view>
```

**优势**：

- 更直观地看出布局方式
- 更灵活地调整单个属性
- 无需记忆框架特定类名

#### 2. 颜色系统统一化

```typescript
// uno.config.ts 颜色配置
colors: {
  'colorui-green': '#39b54a',  // ColorUI 绿色
  'colorui-red': '#e54d42',    // ColorUI 红色
  'colorui-blue': '#0081FF',   // ColorUI 蓝色
}
```

**使用示例**：

```vue
<text class="text-colorui-green">成功</text>
<view class="bg-colorui-red">错误</view>
```

#### 3. 渐变背景配置

```typescript
// uno.config.ts 渐变色规则
rules: [
  [
    /^bg-gradient-(\w+)$/,
    ([, color]) => ({
      'background-image': `linear-gradient(45deg, ${gradientColors[color]})`,
    }),
  ],
]
```

**使用示例**：

```vue
<button class="bg-gradient-green">提交</button>
```

#### 4. rpx 单位支持

```typescript
// uno.config.ts rpx 单位规则
rules: [
  [/^text-(\d+)rpx$/, ([, d]) => ({ 'font-size': `${d}rpx` })],
  [/^rounded-(\d+\.?\d*)$/, ([, d]) => ({ 'border-radius': `${d}rpx` })],
]
```

**使用示例**：

```vue
<text class="text-32rpx">标题</text>
<view class="rounded-3.75">圆角容器</view>
```

#### 5. 透明度语法

```vue
<!-- UnoCSS 透明度语法 -->
<text class="text-gray-600/60">60% 透明度的灰色文本</text>
<view class="bg-black/40">40% 透明度的黑色背景</view>
```

**等价于**：

```css
color: rgba(107, 114, 128, 0.6);
background-color: rgba(0, 0, 0, 0.4);
```
