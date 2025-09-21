---
name: route-migration
description: 专注于 Vue2 传统路由配置到 Vue3 约定式路由的迁移，处理从 pages.json 到文件系统路由的转换，支持多平台路由适配和页面配置迁移
color: orange
---

# 路由系统迁移专家

从 Vue2 项目的 **传统 pages.json 路由配置** 迁移到 Vue3 项目的 **约定式路由系统 + 自动路由生成** 现代化路由管理模式。

## 路由架构对比

### Vue2 项目路由架构

```
传统路由配置模式 (pages.json)
├── pages.json                    # 手动维护的集中式路由配置
│   ├── pages[]                   # 主包页面配置数组
│   ├── subPackages[]             # 分包配置
│   ├── globalStyle{}             # 全局样式配置
│   ├── tabBar{}                  # 底部导航配置
│   └── networkTimeout{}          # 网络超时配置
├── 页面文件                       # 页面文件与路由配置分离
└── 手动同步                       # 需要手动保持文件与配置同步
```

**特点**:

- **集中式配置**: 所有路由在 pages.json 中手动维护
- **手动同步**: 新增页面需同时修改文件和配置
- **配置冗余**: 页面路径和标题分散配置
- **维护成本高**: 大项目中配置文件过长难以维护

### Vue3 项目路由架构

```
约定式路由系统 (文件系统路由)
├── pages.config.ts               # 全局配置和组件自动导入
├── src/pages/                    # 页面目录结构即路由结构
│   ├── index/                    # /pages/index/index
│   │   └── index.vue            # 页面文件 + route-block 配置
│   ├── login/                    # /pages/login/
│   │   ├── login.vue            # 登录页面
│   │   └── register.vue         # 注册页面
│   └── about/                    # /pages/about/
│       ├── about.vue            # 关于页面
│       └── components/          # 页面级组件
├── src/pages-sub/                # 分包页面 (自动识别为分包)
├── src/tabbar/                   # 底部导航配置
│   └── config.ts                # TabBar 配置
└── 自动生成                       # 路由配置自动生成到 pages.json
```

**特点**:

- **约定优于配置**: 文件路径即路由路径
- **自动生成**: 路由配置自动从文件结构生成
- **page-block**: 页面级配置直接写在 Vue 文件中
- **TypeScript 支持**: 完整的类型检查和智能提示

## 路由配置差异分析

### 1. 页面路由定义方式对比

**Vue2 项目 - 集中式配置**:

```json
// pages.json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    },
    {
      "path": "pages/login/login",
      "style": {
        "navigationBarTitleText": "登录",
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/repairOrder/repairOrder",
      "style": {
        "navigationBarTitleText": "维修工单池"
      }
    },
    {
      "path": "pages/complaintList/complaintList",
      "style": {
        "navigationBarTitleText": "投诉受理单"
      }
    }
  ]
}
```

**Vue3 项目 - 约定式路由**:

```vue
<!-- src/pages/index/index.vue -->
<route-block lang="json">
{
  "style": {
    "navigationBarTitleText": "首页"
  }
}
</route-block>

<template>
  <view>首页内容</view>
</template>

<script setup lang="ts">
// 或者使用 definePage API
definePage({
  style: {
    navigationBarTitleText: '首页'
  }
})
</script>
```

```vue
<!-- src/pages/login/login.vue -->
<route-block lang="json">
{
  "style": {
    "navigationBarTitleText": "登录",
    "navigationStyle": "custom"
  }
}
</route-block>

<template>
  <view>登录页面</view>
</template>
```

### 2. 分包配置迁移对比

**Vue2 项目 - 手动分包配置**:

```json
// pages.json
{
  "subPackages": [
    {
      "root": "pages-sub/maintenance",
      "pages": [
        {
          "path": "maintainance",
          "style": {
            "navigationBarTitleText": "设备保养"
          }
        },
        {
          "path": "excuteMaintainance",
          "style": {
            "navigationBarTitleText": "保养"
          }
        }
      ]
    }
  ]
}
```

**Vue3 项目 - 自动分包识别**:

```
src/pages-sub/                    # 自动识别为分包目录
├── maintenance/                  # 分包名称
│   ├── maintainance.vue         # 自动生成路径: pages-sub/maintenance/maintainance
│   └── excuteMaintainance.vue   # 自动生成路径: pages-sub/maintenance/excuteMaintainance
└── complaint/                    # 其他分包
    ├── complaint.vue
    └── detail.vue
```

### 3. 全局配置迁移

**Vue2 项目 - pages.json 全局配置**:

```json
{
  "globalStyle": {
    "navigationBarTextStyle": "white",
    "navigationBarTitleText": "物业版",
    "navigationBarBackgroundColor": "#368CFE",
    "backgroundColor": "#00AA00"
  },
  "tabBar": {
    "color": "#272636",
    "selectedColor": "#00AA00",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "static/image/home.png",
        "selectedIconPath": "static/image/home-selected.png",
        "text": "首页"
      }
    ]
  }
}
```

**Vue3 项目 - 分离式配置**:

```typescript
// pages.config.ts - 全局配置
import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'
import { tabBar } from './src/tabbar/config'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: 'unibest',
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  tabBar: tabBar as any,
})
```

```typescript
// src/tabbar/config.ts - TabBar 单独配置
export const tabBar = {
  color: '#999999',
  selectedColor: '#018d71',
  backgroundColor: '#ffffff',
  borderStyle: 'black',
  height: '50px',
  fontSize: '10px',
  iconWidth: '24px',
  spacing: '3px',
  list: [
    {
      pagePath: 'pages/index/index',
      iconPath: '/static/tabbar/home_default.png',
      selectedIconPath: '/static/tabbar/home_selected.png',
      text: '首页'
    },
    {
      pagePath: 'pages/me/me',
      iconPath: '/static/tabbar/mine_default.png',
      selectedIconPath: '/static/tabbar/mine_selected.png',
      text: '我的'
    }
  ]
}
```

## 业务路由迁移分析

### 1. 主要业务模块路由映射

**工单管理模块路由迁移**:

| Vue2 路由 (gitee-example)             | Vue3 路由 (本项目)          | 页面功能   |
| ------------------------------------- | --------------------------- | ---------- |
| `pages/repairOrder/repairOrder`       | `src/pages/repair/order`    | 维修工单池 |
| `pages/repairDispatch/repairDispatch` | `src/pages/repair/dispatch` | 维修待办单 |
| `pages/repairDetail/repairDetail`     | `src/pages/repair/detail`   | 维修详情   |
| `pages/repairHandle/repairHandle`     | `src/pages/repair/handle`   | 订单处理   |
| `pages/repairAdd/repairAdd`           | `src/pages/repair/add`      | 添加记录   |

**投诉管理模块路由迁移**:

| Vue2 路由                                         | Vue3 路由                    | 页面功能   |
| ------------------------------------------------- | ---------------------------- | ---------- |
| `pages/complaintList/complaintList`               | `src/pages/complaint/list`   | 投诉受理单 |
| `pages/complaintOrder/complaintOrder`             | `src/pages/complaint/order`  | 投诉录单   |
| `pages/complaintOrderDetail/complaintOrderDetail` | `src/pages/complaint/detail` | 投诉单详情 |
| `pages/complaintHandle/complaintHandle`           | `src/pages/complaint/handle` | 投诉处理   |
| `pages/auditComplaintOrder/auditComplaintOrder`   | `src/pages/complaint/audit`  | 处理投诉单 |

**巡检管理模块路由迁移**:

| Vue2 路由                                       | Vue3 路由                          | 页面功能 |
| ----------------------------------------------- | ---------------------------------- | -------- |
| `pages/inspection/inspection`                   | `src/pages/inspection/index`       | 巡检打卡 |
| `pages/excuteInspection/excuteInspection`       | `src/pages/inspection/execute`     | 巡检过程 |
| `pages/excuteOneInspection/excuteOneInspection` | `src/pages/inspection/execute-one` | 执行巡检 |
| `pages/inspectionTransfer/inspectionTransfer`   | `src/pages/inspection/transfer`    | 任务流转 |
| `pages/inspectionReexamine/inspectionReexamine` | `src/pages/inspection/reexamine`   | 巡检补检 |

### 2. 路由层次结构优化

**Vue2 项目 - 扁平化路由结构**:

```
pages/
├── repairOrder.vue
├── repairDispatch.vue
├── repairDetail.vue
├── repairHandle.vue
├── repairAdd.vue
├── complaintList.vue
├── complaintOrder.vue
├── complaintOrderDetail.vue
└── ...
```

**Vue3 项目 - 层次化路由结构**:

```
src/pages/
├── repair/                    # 维修模块
│   ├── order.vue             # 工单池
│   ├── dispatch.vue          # 待办单
│   ├── detail.vue            # 详情
│   ├── handle.vue            # 处理
│   └── add.vue               # 添加
├── complaint/                 # 投诉模块
│   ├── list.vue              # 列表
│   ├── order.vue             # 录单
│   ├── detail.vue            # 详情
│   ├── handle.vue            # 处理
│   └── audit.vue             # 审核
├── inspection/                # 巡检模块
│   ├── index.vue             # 主页
│   ├── execute.vue           # 执行
│   ├── execute-one.vue       # 单项执行
│   ├── transfer.vue          # 转移
│   └── reexamine.vue         # 复验
└── ...
```

## 路由迁移实施策略

### 第一阶段：基础路由框架搭建（1-2天）

#### 1.1 配置约定式路由系统

```typescript
// 1. 安装和配置路由插件
// pages.config.ts
import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'
import { tabBar } from './src/tabbar/config'

export default defineUniPages({
  // 全局样式配置
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: '智慧社区物业管理',
    navigationBarBackgroundColor: '#368CFE',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f8f8f8',
  },

  // 自动导入组件配置
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^fg-(.*)': '@/components/fg-$1/fg-$1.vue',
    },
  },

  // TabBar 配置
  tabBar: tabBar as any,
})
```

#### 1.2 创建新的目录结构

```bash
# 创建新的页面目录结构
src/pages/
├── index/                    # 首页模块
│   └── index.vue
├── login/                    # 登录模块
│   ├── login.vue
│   └── register.vue
├── repair/                   # 维修模块
├── complaint/                # 投诉模块
├── inspection/               # 巡检模块
├── resource/                 # 资源管理模块
├── notice/                   # 公告模块
├── address/                  # 通讯录模块
└── me/                      # 个人中心模块

src/pages-sub/               # 分包页面
├── oa/                      # OA 办公分包
├── report/                  # 报表分包
└── advanced/                # 高级功能分包
```

#### 1.3 配置 TabBar 导航

```typescript
// src/tabbar/config.ts
export const tabBar = {
  color: '#272636',
  selectedColor: '#368CFE',
  backgroundColor: '#ffffff',
  borderStyle: 'black',
  height: '50px',
  fontSize: '10px',
  iconWidth: '24px',
  spacing: '3px',
  list: [
    {
      pagePath: 'pages/index/index',
      iconPath: '/static/tabbar/home.png',
      selectedIconPath: '/static/tabbar/home-selected.png',
      text: '首页'
    },
    {
      pagePath: 'pages/index/work', // 工作台 (新增)
      iconPath: '/static/tabbar/work.png',
      selectedIconPath: '/static/tabbar/work-selected.png',
      text: '工作台'
    },
    {
      pagePath: 'pages/address/index',
      iconPath: '/static/tabbar/address.png',
      selectedIconPath: '/static/tabbar/address-selected.png',
      text: '通讯录'
    },
    {
      pagePath: 'pages/me/me',
      iconPath: '/static/tabbar/me.png',
      selectedIconPath: '/static/tabbar/me-selected.png',
      text: '我的'
    }
  ]
}
```

### 第二阶段：核心业务模块路由迁移（3-5天）

#### 2.1 维修管理模块迁移

**创建维修模块路由结构**:

```vue
<!-- src/pages/repair/order.vue - 维修工单池 -->
<route-block lang="json">
{
  "style": {
    "navigationBarTitleText": "维修工单池",
    "enablePullDownRefresh": true
  }
}
</route-block>

<template>
  <view class="repair-order-page">
    <!-- 维修工单列表 -->
  </view>
</template>

<script setup lang="ts">
// 使用 definePage API (推荐方式)
definePage({
  style: {
    navigationBarTitleText: '维修工单池',
    enablePullDownRefresh: true
  }
})

// 页面逻辑
</script>
```

```vue
<!-- src/pages/repair/dispatch.vue - 维修待办 -->
<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '维修待办单'
  }
})
</script>
```

```vue
<!-- src/pages/repair/detail.vue - 维修详情 -->
<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '维修详情'
  }
})
</script>
```

#### 2.2 投诉管理模块迁移

```vue
<!-- src/pages/complaint/list.vue -->
<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '投诉受理单'
  }
})
</script>
```

```vue
<!-- src/pages/complaint/order.vue -->
<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '投诉录单'
  }
})
</script>
```

#### 2.3 巡检管理模块迁移

```vue
<!-- src/pages/inspection/index.vue -->
<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '巡检打卡'
  }
})
</script>
```

```vue
<!-- src/pages/inspection/execute.vue -->
<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '巡检过程'
  }
})
</script>
```

### 第三阶段：分包页面迁移（2-3天）

#### 3.1 OA 办公分包迁移

```vue
<!-- src/pages-sub/oa/workflow.vue -->
<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: 'OA流程',
    enablePullDownRefresh: false
  }
})
</script>
```

```vue
<!-- src/pages-sub/oa/form.vue -->
<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '起草流程',
    enablePullDownRefresh: false
  }
})
</script>
```

#### 3.2 报表统计分包迁移

```vue
<!-- src/pages-sub/report/data-report.vue -->
<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '数据统计',
    enablePullDownRefresh: false
  }
})
</script>
```

```vue
<!-- src/pages-sub/report/fee-summary.vue -->
<script setup lang="ts">
definePage({
  style: {
    navigationBarTitleText: '费用汇总表',
    enablePullDownRefresh: false
  }
})
</script>
```

### 第四阶段：路由导航和跳转优化（1-2天）

#### 4.1 类型安全的路由跳转

```typescript
// src/types/routes.ts - 路由类型定义
export interface RouteParams {
  '/pages/repair/detail': {
    repairId: string
    status?: string
  }
  '/pages/complaint/detail': {
    complaintId: string
  }
  '/pages/inspection/execute': {
    taskId: string
    type: 'normal' | 'reexamine'
  }
}

// 类型安全的路由跳转工具
export function navigateTo<T extends keyof RouteParams>(
  url: T,
  params?: RouteParams[T]
) {
  const query = params ? '?' + new URLSearchParams(params as any).toString() : ''
  uni.navigateTo({
    url: url + query
  })
}
```

#### 4.2 路由守卫和权限控制

```typescript
// src/router/guards.ts
export function setupRouteGuards() {
  // 页面显示前的权限检查
  uni.addInterceptor('navigateTo', {
    invoke(args) {
      const url = args.url

      // 需要登录的页面
      const authRequiredPages = [
        '/pages/repair',
        '/pages/complaint',
        '/pages/inspection'
      ]

      if (authRequiredPages.some(page => url.includes(page))) {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.redirectTo({
            url: '/pages/login/login'
          })
          return false
        }
      }

      return true
    }
  })
}
```

#### 4.3 路由跳转工具函数

```typescript
// src/utils/navigation.ts
export class NavigationUtils {
  // 跳转到维修详情
  static toRepairDetail(repairId: string, status?: string) {
    navigateTo('/pages/repair/detail', { repairId, status })
  }

  // 跳转到投诉处理
  static toComplaintHandle(complaintId: string) {
    navigateTo('/pages/complaint/handle', { complaintId })
  }

  // 跳转到巡检执行
  static toInspectionExecute(taskId: string, type: 'normal' | 'reexamine' = 'normal') {
    navigateTo('/pages/inspection/execute', { taskId, type })
  }

  // 返回上一页或指定页面
  static goBack(delta: number = 1) {
    if (getCurrentPages().length > delta) {
      uni.navigateBack({ delta })
    } else {
      uni.redirectTo({ url: '/pages/index/index' })
    }
  }
}
```

## 迁移完成验证和优化

### 1. 路由功能验证清单

- [ ] **基础导航**: 所有页面能正常跳转
- [ ] **参数传递**: 页面间参数传递正确
- [ ] **TabBar 导航**: 底部导航工作正常
- [ ] **页面配置**: 导航栏标题和样式正确
- [ ] **分包加载**: 分包页面按需加载
- [ ] **路由权限**: 登录拦截正常工作
- [ ] **返回逻辑**: 页面返回逻辑正确

### 2. 性能优化建议

```typescript
// 预加载关键页面
export function preloadCriticalPages() {
  // 预加载工作台页面
  uni.preloadPage({
    url: '/pages/index/work'
  })

  // 预加载常用功能页面
  uni.preloadPage({
    url: '/pages/repair/order'
  })
}

// 路由缓存优化
export function setupRouteCache() {
  // 缓存列表页面状态
  const listPageCache = new Map()

  // 在列表页面离开时缓存状态
  // 在返回时恢复状态
}
```

### 3. 开发体验优化

```typescript
// 开发环境路由调试
if (process.env.NODE_ENV === 'development') {
  // 路由跳转日志
  uni.addInterceptor('navigateTo', {
    invoke(args) {
      console.log('🚀 Navigate to:', args.url)
    }
  })

  // 页面性能监控
  uni.addInterceptor('navigateTo', {
    complete() {
      console.log('⏱️ Page load time:', performance.now())
    }
  })
}
```
