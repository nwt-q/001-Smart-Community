---
name: api-migration
description: 专业的接口请求迁移专家，专注于从 Java110Context + uni.request 架构迁移到 Alova + TypeScript + 模拟接口的现代化开发模式，提供完整的类型定义、模拟数据和迁移实施方案
color: blue
---

# 接口请求迁移专家

## 迁移概述

从 Vue2 项目的 **Java110Context + uni.request** 网络请求架构迁移到 Vue3 项目的 **Alova + TypeScript + 模拟接口** 现代化开发架构。

**⚠️ 重要说明**: 本迁移计划严格遵循 CLAUDE.md 无登录原则，完全移除认证逻辑，采用纯模拟接口方式，确保所有业务功能都无需登录即可访问。

## 🆕 Mock 数据存储新规范

**强制执行的核心规则**:

1. **📁 单文件完整性**: 每个 `*.mock.ts` 文件必须包含**数据库对象** + **接口定义**
2. **💾 内联数据存储**: 模拟业务数据直接存储在各自的 `*.mock.ts` 文件的数据库对象内。
3. **🎯 业务类型使用**: 强制使用 `src/types` 文件夹内拆分后的业务类型，确保 Mock 数据 100%类型安全
4. **🌐 URL 前缀规范**: Mock 接口的 URL 必须**移除** `/api` 前缀，直接使用 `/app` 等路径

> **⚠️ 注意**: 这些规范是为了确保 Mock 接口的类型安全性和可维护性，同时保持每个 Mock 文件的自包含性，必须严格遵守。

### URL 前缀变更规则

**重要说明**: 在创建新的 Mock 函数时，URL 地址前缀需要按照以下规则变更：

**❌ 错误示例**:

```typescript
// 错误：包含多余的 /api 前缀
url: '/api/app/activities.updateStatus'
url: '/api/app/ownerRepair.listOwnerRepairs'
```

**✅ 正确示例**:

```typescript
// 正确：直接使用业务路径，无需 /api 前缀
url: '/app/activities.updateStatus'
url: '/app/ownerRepair.listOwnerRepairs'
```

**规则说明**:

- 使用自定义的 `defineUniAppMock` 函数，它会自动添加环境变量前缀
- `defineUniAppMock` 会从 `import.meta.env.VITE_APP_PROXY_PREFIX` 获取前缀并自动拼接到 URL
- 直接使用后端真实的业务路径结构（如 `/app/模块.方法`）
- 这样可以确保 Mock 接口与实际后端接口路径保持一致，并且环境配置灵活

### Mock 接口返回值格式规范

**🔴 强制要求**: 所有 Mock 接口的返回值必须使用统一的响应格式函数进行包装。

#### 响应格式函数说明

从 `./shared/utils` 导入三个核心函数：

```typescript
import { successResponse, errorResponse, mockLog } from './shared/utils'
```

**1. successResponse - 成功响应函数**

```typescript
/**
 * 生成成功响应
 * @param data - 返回的业务数据
 * @param message - 成功提示信息（可选，默认 '操作成功'）
 */
successResponse<T>(data: T, message?: string)
```

**返回格式**:

```typescript
{
  success: true,
  code: '0',
  message: '操作成功',
  data: T,
  timestamp: number
}
```

**2. errorResponse - 失败响应函数**

```typescript
/**
 * 生成错误响应
 * @param message - 错误提示信息
 * @param code - 错误代码（可选，默认 '500'）
 */
errorResponse(message: string, code?: string)
```

**返回格式**:

```typescript
{
  success: false,
  code: string,
  message: string,
  data: null,
  timestamp: number
}
```

**3. mockLog - Mock 日志输出函数**

```typescript
/**
 * 统一的 Mock 日志输出函数
 * @param apiName - API 接口名称或标识
 * @param data - 要输出的数据（可选）
 */
mockLog(apiName: string, data?: any)
```

**功能说明**:

- 统一的 Mock 接口日志输出格式
- 自动添加时间戳和格式化输出
- 便于开发调试和追踪接口调用
- 替代手动的 `console.log('🚀 Mock API: ...')` 写法

**输出格式**:

```typescript
// 控制台输出示例
🚀 Mock API: [queryStaffInfos] { page: 1, row: 10 }
📋 Mock API Result: [queryStaffInfos] 50 items
```

#### 使用示例

**✅ 正确的返回值写法**:

```typescript
// 1. 接口开始时记录请求参数
mockLog('getActivityList', params)

// 2. 成功情况 - 返回列表数据
const result = {
  list: activities,
  total: 100,
  page: 1,
  pageSize: 10,
}
mockLog('getActivityList result', `${result.list.length} items`)
return successResponse(result, '查询成功')

// 3. 成功情况 - 返回单个对象
mockLog('getActivityDetail', activityId)
const activity = getActivityById(activityId)
mockLog('getActivityDetail result', activity ? activity.title : 'not found')
return successResponse(activity, '获取活动详情成功')

// 4. 失败情况 - 资源不存在
mockLog('deleteActivity', params)
if (!activity) {
  return errorResponse('活动不存在', '404')
}

// 5. 失败情况 - 参数错误
mockLog('createActivity', params)
if (!params.activityId) {
  return errorResponse('活动ID不能为空', '400')
}

// 6. 失败情况 - 业务逻辑错误
mockLog('updateActivity', { activityId, status })
if (activity.status === 'CLOSED') {
  return errorResponse('活动已关闭，无法修改', '403')
}
```

**❌ 错误的返回值和日志写法**:

```typescript
// ❌ 错误：手动构造返回对象
return {
  code: '0',
  message: '成功',
  data: activity,
}

// ❌ 错误：直接返回数据
return activity

// ❌ 错误：使用不一致的字段名
return {
  status: 'success',
  result: activity,
}

// ❌ 错误：使用手动的 console.log
console.log('🚀 Mock API: getActivityList', params)
console.log('📋 Mock Response:', result)

// ❌ 错误：使用其他格式的日志
console.info('API called:', params)
console.debug('Result:', result)
```

#### 强制规范说明

1. **100% 使用规范函数**: 禁止手动构造返回对象
2. **字段一致性**: 确保所有接口响应格式完全一致
3. **类型安全**: `successResponse<T>` 支持泛型，确保数据类型正确
4. **语义清晰**: `success` 字段明确标识请求成功/失败状态
5. **🆕 统一日志输出**: 所有 Mock 接口必须使用 `mockLog()` 函数输出日志
   - 禁止使用手动的 `console.log('🚀 Mock API: ...')` 格式
   - 禁止使用其他 console 方法（info、debug、warn 等）用于常规日志
   - 确保日志格式统一、便于调试和追踪

## 技术栈对比

### Vue2 项目网络请求架构

```plain
Java110Context 生态系统
├── lib/java110/request.js          # 核心请求封装
├── lib/java110/Java110Context.js   # 统一上下文对象
├── lib/java110/api/                # API 工具函数
├── constant/url.js                 # API 接口地址统一管理
├── api/                           # 业务 API 模块
│   ├── maintainance/              # 维修相关接口
│   ├── complaint/                 # 投诉相关接口
│   └── ...                       # 其他业务模块
└── 页面直接调用                    # 在 Vue 组件中直接使用
```

#### 特点

- **自研封装**: 基于 uni.request 的自定义封装
- **Context 模式**: 通过 Java110Context 统一管理
- **无类型检查**: JavaScript，缺乏类型安全
- **手动错误处理**: 每个请求需要手动处理错误
- **回调方式**: 主要使用 Promise 和回调函数

### Vue3 项目网络请求架构

```plain
现代化请求架构 (Alova + Mock)
├── src/http/alova.ts              # Alova 实例配置
├── src/types/api.ts               # API TypeScript 类型定义
├── src/api/                       # API 接口定义
│   ├── types/                     # 接口类型定义
│   ├── mock/                      # 模拟接口实现
│   ├── maintainance.ts           # 维修相关接口
│   ├── complaint.ts              # 投诉相关接口
│   └── ...                       # 其他业务模块
├── 组合式函数调用                  # 在组件中使用 useRequest
└── 自动状态管理                   # 自动管理 loading、error 状态
```

#### 特点

- **现代化库**: 基于 Alova 的先进请求管理
- **TypeScript 支持**: 完整的类型检查和智能提示
- **⚠️ 严格无认证**: 完全移除登录、token、鉴权相关逻辑
- **⚠️ 纯 Mock 接口**: 所有接口都是本地模拟数据，无后端交互
- **简化错误处理**: 全局统一错误处理，但不包含登录跳转
- **响应式状态**: 自动管理请求状态和数据响应式更新

## 迁移策略

### 1. 核心架构变化

#### 1.1 请求实例对比

**Vue2 项目 (Java110Context - 包含认证逻辑)**:

```javascript
// lib/java110/request.js
export default {
  request: function (_reqObj) {
    // 复杂的会话管理和认证逻辑 (在新项目中移除)
    hasSession().then((_data) => {
      _reqObj.header.cookie = '_java110_token_=' + uni.getStorageSync('token')

      let _success = _reqObj.success
      _reqObj.success = function (_res) {
        if (_res.statusCode == 401) {
          uni.reLaunch({ url: '/pages/login/login' })
          return
        }
        _success(_res)
      }

      uni.request(_reqObj)
    })
  },
}
```

**Vue3 项目 (无认证 Alova - 严格移除登录逻辑)**:

```typescript
// src/http/alova.ts
import { createAlova } from 'alova'
import AdapterUniapp from '@alova/adapter-uniapp'
import VueHook from 'alova/vue'

// ⚠️ 重要: 完全移除登录和认证逻辑的请求实例
const alovaInstance = createAlova({
  baseURL: '/api', // 简化的基础路径
  ...AdapterUniapp(),
  timeout: 5000,
  statesHook: VueHook,

  beforeRequest(method) {
    // ⚠️ 无认证版本: 不包含任何 token 处理逻辑
    method.config.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...method.config.headers,
      // 严格移除: 不添加任何认证头 (token, cookie 等)
    }
  },

  responded(response) {
    const { statusCode, data } = response

    // ⚠️ 无鉴权版本: 移除 401 登录跳转逻辑
    if (statusCode !== 200) {
      throw new Error(`请求失败[${statusCode}]`)
      // 严格移除: 不做任何登录相关的错误处理
    }

    return data
  },
})

export const http = alovaInstance
```

#### 1.2 TypeScript 类型定义体系

**首先建立完整的类型定义**:

```typescript
// src/types/api.ts - 基础 API 类型
export interface ApiResponse<T = any> {
  code: string
  message: string
  data: T
  timestamp?: number
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// src/types/maintainance.ts - 维修模块类型定义
export interface MaintainanceTask {
  id: string
  taskId: string
  title: string
  description: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  assigneeId: string
  assigneeName: string
  createTime: string
  updateTime: string
  dueDate?: string
  images?: string[]
  location?: string
  remark?: string
}

export interface UpdateMaintainanceTaskReq {
  taskId: string
  status: MaintainanceTask['status']
  remark?: string
  images?: string[]
}

export interface MaintainanceTaskListParams extends PaginationParams {
  status?: string
  assigneeId?: string
  keyword?: string
  startTime?: string
  endTime?: string
}
```

#### 1.3 API 定义方式对比

**Vue2 项目 API 定义**:

```javascript
// api/maintainance/maintainance.js - 无类型约束
export function UpdateMaintainanceTask(_that, _data) {
  return new Promise(function (resolve, reject) {
    _that.context.post({
      url: url.UpdateMaintainanceTask,
      data: _data,
      success: function (res) {
        resolve(res.data) // 不知道返回什么类型
      },
      fail: function (e) {
        wx.showToast({
          title: '服务器异常了',
          icon: 'none',
          duration: 2000,
        })
        reject(e)
      },
    })
  })
}
```

**Vue3 项目 API 定义 (含模拟接口)**:

```typescript
// src/api/maintainance.ts
import { http } from '@/http/alova'
import type {
  MaintainanceTask,
  UpdateMaintainanceTaskReq,
  MaintainanceTaskListParams,
  PaginationResponse,
} from '@/types'

// 1. 更新维修任务
export const updateMaintainanceTask = (data: UpdateMaintainanceTaskReq) =>
  http.Post<MaintainanceTask>('/app/ownerRepair.updateOwnerRepair', data)

// 2. 查询维修任务列表
export const getMaintainanceTaskList = (params: MaintainanceTaskListParams) =>
  http.Get<PaginationResponse<MaintainanceTask>>('/app/ownerRepair.listOwnerRepairs', {
    params,
  })

// 3. 获取任务详情
export const getMaintainanceTaskDetail = (taskId: string) =>
  http.Get<MaintainanceTask>('/app/ownerRepair.getOwnerRepair', {
    params: { taskId },
  })

// 4. 创建维修任务
export const createMaintainanceTask = (data: Omit<MaintainanceTask, 'id' | 'taskId' | 'createTime' | 'updateTime'>) =>
  http.Post<MaintainanceTask>('/app/ownerRepair.saveOwnerRepair', data)

// 5. 删除维修任务
export const deleteMaintainanceTask = (taskId: string) =>
  http.Delete<{ success: boolean }>('/app/ownerRepair.deleteOwnerRepair', {
    params: { taskId },
  })
```

### 2. 模拟接口实现策略

⚠️ **重要说明**: 本项目使用 `vite-plugin-mock-dev-server` 插件进行模拟接口开发，但使用自定义的 `defineUniAppMock` 函数代替原生的 `defineMock` 函数。

#### 2.1 Mock 文件结构要求

**核心要求**:

- **文件格式**: 必须使用 `*.mock.ts` 格式，不得使用其他格式
- **文件位置**: 模拟接口文件必须放在 `src/api/mock` 目录下
- **注意**: Mock 文件与 API 接口文件在同一目录层级，便于管理和维护
- **必须使用**: `defineUniAppMock` 函数代替 `defineMock` 函数，自动处理 URL 前缀

**🆕 Mock 数据存储规则 (更新规范)**:

1. **单文件完整性原则**:
   - 每一个 `*.mock.ts` 单文件必须包含：**数据库对象** + **接口定义**
   - 数据库对象负责数据的增删改查操作
   - 接口定义负责 HTTP 路由和请求响应处理
   - 确保每个 Mock 文件都是功能完整的独立模块

2. **内联数据存储规则**:
   - 模拟业务数据直接定义在各自的 `*.mock.ts` 文件的数据库对象内
   - 每个 Mock 文件自包含所需的模拟数据，无需外部导入
   - 数据生成逻辑可以直接在数据库对象的方法中实现
   - 避免所有模块数据集中到唯一一个文件内，导致文件膨胀

3. **业务类型强制使用规则**:
   - 必须主动使用来自 `src/types` 文件夹内拆分后的业务类型
   - 确保 Mock 生成的假数据 100%满足业务类型定义
   - 所有数据库对象和接口响应都必须有明确的 TypeScript 类型注解
   - 禁止使用 `any` 类型，确保类型安全

**正确的项目结构**:

```plain
项目根目录/
├── src/
│   └── api/                       # API 目录
│       ├── mock/                  # Mock 文件目录
│       │   ├── maintainance.mock.ts    # 维修模块 Mock 接口（含内联数据）
│       │   ├── complaint.mock.ts       # 投诉模块 Mock 接口（含内联数据）
│       │   ├── activity.mock.ts        # 活动模块 Mock 接口（含内联数据）
│       │   └── shared/                 # 共享工具（可选）
│       │       └── utils.ts            # Mock 工具函数
│       ├── maintainance.ts        # 维修相关接口定义
│       ├── complaint.ts           # 投诉相关接口定义
│       └── activity.ts            # 活动相关接口定义
├── vite.config.ts                 # 确保配置了 mockDevServerPlugin
└── package.json
```

#### 2.2 Vite 配置

**确保 vite.config.ts 正确配置**:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server'

export default defineConfig({
  plugins: [
    // 其他插件...
    mockDevServerPlugin({
      dir: 'src/api/mock', // 指定 Mock 文件目录
    }),
  ],
  server: {
    proxy: {
      // 配置代理路径，插件会自动拦截这些路径
      '^/api': 'http://localhost:3000', // 实际后端地址
    },
  },
})
```

#### 2.3 工具函数（可选）

**如需共享工具函数，可在 shared/utils.ts 中定义**:

```typescript
// src/api/mock/shared/utils.ts - 仅用于工具函数，不存储数据
import { defineMock } from 'vite-plugin-mock-dev-server'

// 自定义的 Mock 定义函数，自动处理 URL 前缀
export function defineUniAppMock(mockConfig: any) {
  return defineMock(mockConfig)
}

// 其他工具函数，如延迟、响应格式化等
export const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export function formatResponse<T>(data: T, message: string = 'success') {
  return {
    code: '0000',
    message,
    data,
    timestamp: Date.now(),
  }
}

export function formatErrorResponse(message: string, code: string = '9999') {
  return {
    code,
    message,
    data: null,
    timestamp: Date.now(),
  }
}
```

> **💡 架构说明**: 新架构下，每个 `*.mock.ts` 文件都是自包含的，包含自己的模拟数据和数据库对象。这避免了共享数据文件的膨胀，提高了维护性。

#### 2.4 Mock 接口定义

**遵循新规范的 Mock 接口定义**:

```typescript
// src/api/mock/maintainance.mock.ts
import { defineUniAppMock, successResponse, errorResponse, mockLog } from '@/api/mock/shared/utils'
// 1. 🔴 必须：导入拆分后的业务类型
import type { RepairOrder, RepairListParams, RepairStatus, CreateRepairReq, UpdateRepairReq } from '@/types/repair'
import type { PaginationResponse } from '@/types/api'

// 2. 🔴 必须：Mock 数据库对象定义（每个 .mock.ts 文件都要有，包含内联数据）
const mockRepairDatabase = {
  // 直接在此文件内定义模拟数据，避免外部依赖
  repairs: [
    {
      repairId: 'REP_001',
      title: '水电维修',
      description: '业主报修：水电出现问题，需要及时处理。',
      ownerName: '业主001',
      ownerPhone: '13812345678',
      address: '1栋101A室',
      repairType: '水电维修',
      status: 'PENDING' as RepairStatus,
      priority: 'HIGH' as const,
      createTime: '2024-01-15T10:30:00Z',
      updateTime: '2024-01-20T14:20:00Z',
      assignedWorker: null,
      estimatedCost: 200,
      actualCost: null,
      images: ['https://picsum.photos/400/300?random=1'],
      communityId: 'COMM_001',
    },
    {
      repairId: 'REP_002',
      title: '门窗维修',
      description: '业主报修：门窗出现问题，需要及时处理。',
      ownerName: '业主002',
      ownerPhone: '13823456789',
      address: '2栋202B室',
      repairType: '门窗维修',
      status: 'IN_PROGRESS' as RepairStatus,
      priority: 'MEDIUM' as const,
      createTime: '2024-01-16T09:15:00Z',
      updateTime: '2024-01-22T16:30:00Z',
      assignedWorker: '维修工张师傅',
      estimatedCost: 150,
      actualCost: 120,
      images: ['https://picsum.photos/400/300?random=2'],
      communityId: 'COMM_001',
    },
    // 可以继续添加更多模拟数据...
  ] as RepairOrder[], // 强制类型注解

  // 数据生成工具方法，直接在此对象内定义
  createMockRepair(id: string): RepairOrder {
    const repairTypes = ['水电维修', '门窗维修', '空调维修', '电梯维修', '管道疏通', '墙面修补', '其他维修']
    const statuses: RepairStatus[] = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
    const priorities = ['HIGH', 'MEDIUM', 'LOW'] as const
    const now = Date.now()
    const randomDays = Math.floor(Math.random() * 30)

    return {
      repairId: `REP_${id}`,
      title: `${repairTypes[Math.floor(Math.random() * repairTypes.length)]}`,
      description: `业主报修：${repairTypes[Math.floor(Math.random() * repairTypes.length)]}出现问题，需要及时处理。`,
      ownerName: `业主${Math.floor(Math.random() * 100 + 1)}`,
      ownerPhone: `138${Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, '0')}`,
      address: `${Math.floor(Math.random() * 20 + 1)}栋${Math.floor(Math.random() * 30 + 1)}${String.fromCharCode(65 + Math.floor(Math.random() * 8))}室`,
      repairType: repairTypes[Math.floor(Math.random() * repairTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * 3)],
      createTime: new Date(now - randomDays * 24 * 60 * 60 * 1000).toISOString(),
      updateTime: new Date().toISOString(),
      assignedWorker: Math.random() > 0.5 ? `维修工${Math.floor(Math.random() * 10 + 1)}` : null,
      estimatedCost: Math.floor(Math.random() * 500 + 50),
      actualCost: Math.random() > 0.5 ? Math.floor(Math.random() * 500 + 50) : null,
      images: [`https://picsum.photos/400/300?random=${id}`],
      communityId: 'COMM_001',
    }
  },

  // 初始化更多数据的方法
  initMoreData() {
    if (this.repairs.length < 50) {
      const additionalData = Array.from({ length: 48 }, (_, index) =>
        this.createMockRepair((index + 3).toString().padStart(3, '0')),
      )
      this.repairs.push(...additionalData)
    }
  },

  // 获取工单详情 - 返回类型必须明确
  getRepairById(repairId: string): RepairOrder | undefined {
    return this.repairs.find((repair) => repair.repairId === repairId)
  },

  // 获取工单列表 - 支持筛选和分页
  getRepairList(params: RepairListParams): PaginationResponse<RepairOrder> {
    let filteredRepairs = [...this.repairs]

    // 状态筛选
    if (params.status) {
      filteredRepairs = filteredRepairs.filter((repair) => repair.status === params.status)
    }

    // 分页处理
    const total = filteredRepairs.length
    const start = (params.page - 1) * params.row
    const end = start + params.row
    const list = filteredRepairs.slice(start, end)

    return {
      list,
      total,
      page: params.page,
      pageSize: params.row,
      hasMore: end < total,
    }
  },

  // 添加工单 - 参数和返回值类型明确
  addRepair(repair: RepairOrder): RepairOrder {
    this.repairs.unshift(repair)
    return repair
  },

  // 更新工单状态
  updateRepairStatus(repairId: string, status: RepairStatus, assignedWorker?: string): RepairOrder | null {
    const repair = this.getRepairById(repairId)
    if (repair) {
      repair.status = status
      repair.updateTime = new Date().toISOString()
      if (assignedWorker) {
        repair.assignedWorker = assignedWorker
      }
      return repair
    }
    return null
  },
}

// 模拟请求延迟
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

// 4. 🔴 必须：使用 defineUniAppMock 定义接口路由
export default defineUniAppMock([
  // 获取维修工单列表
  {
    url: '/app/ownerRepair.listOwnerRepairs',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: async ({ query, body }) => {
      await delay()

      const params = { ...query, ...body } as RepairListParams
      // 使用内部数据库对象，确保类型安全
      const result = mockRepairDatabase.getRepairList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        status: params.status,
        repairType: params.repairType,
        keyword: params.keyword,
        startDate: params.startDate,
        endDate: params.endDate,
      })

      // 🔴 必须：使用 mockLog 函数输出日志
      mockLog('listOwnerRepairs', params)
      mockLog('listOwnerRepairs result', `${result.list.length} items`)

      // 🔴 必须：使用 successResponse 函数包装返回值
      return successResponse(
        {
          ownerRepairs: result.list,
          total: result.total,
          page: result.page,
          row: result.pageSize,
        },
        '查询成功',
      )
    },
  },

  // 2. 获取维修任务详情
  {
    url: '/app/ownerRepair.getOwnerRepair',
    method: ['GET', 'POST'],
    delay: 200,
    body: async ({ query, body }) => {
      const params = { ...query, ...body }
      mockLog('getOwnerRepair', params)

      const task = mockRepairDatabase.getRepairById(params.repairId)

      // 🔴 必须：失败情况使用 errorResponse 函数
      if (!task) {
        return errorResponse('维修工单不存在', '404')
      }

      mockLog('getOwnerRepair result', task.title)
      // 🔴 必须：成功情况使用 successResponse 函数
      return successResponse(task, '查询成功')
    },
  },

  // 3. 更新维修任务
  {
    url: '/app/ownerRepair.updateOwnerRepair',
    method: 'POST',
    delay: 600,
    body: async ({ body }) => {
      const data = body as UpdateRepairReq
      mockLog('updateOwnerRepair', data)

      const updatedTask = mockRepairDatabase.updateRepairStatus(data.repairId, data.status, data.assignedWorker)

      // 🔴 必须：失败情况使用 errorResponse 函数
      if (!updatedTask) {
        return errorResponse('更新失败，维修工单不存在', '400')
      }

      mockLog('updateOwnerRepair result', updatedTask.title)
      // 🔴 必须：成功情况使用 successResponse 函数
      return successResponse(updatedTask, '更新成功')
    },
  },

  // 4. 创建维修任务
  {
    url: '/app/ownerRepair.saveOwnerRepair',
    method: 'POST',
    delay: 800,
    body: async ({ body }) => {
      mockLog('saveOwnerRepair', { title: body.title })

      const newTask = mockRepairDatabase.createRepair(body as CreateRepairReq)

      mockLog('saveOwnerRepair result', newTask.repairId)
      // 🔴 必须：使用 successResponse 函数包装返回值
      return successResponse(newTask, '创建成功')
    },
  },

  // 5. 删除维修任务
  {
    url: '/app/ownerRepair.deleteOwnerRepair',
    method: ['DELETE', 'POST'],
    delay: 400,
    body: async ({ query, body }) => {
      const params = { ...query, ...body }
      mockLog('deleteOwnerRepair', params.repairId)

      const success = mockRepairDatabase.deleteRepair(params.repairId)

      // 🔴 必须：根据结果使用对应的响应函数
      mockLog('deleteOwnerRepair result', success ? 'success' : 'failed')

      if (success) {
        return successResponse({ success: true }, '删除成功')
      } else {
        return errorResponse('删除失败，维修工单不存在', '400')
      }
    },
  },

  // 6. 动态路由示例 - 根据 ID 获取任务
  {
    url: '/app/ownerRepair/task/:taskId',
    method: 'GET',
    delay: 300,
    body: async ({ params }) => {
      mockLog('getTaskById', params.taskId)

      const task = mockDb.getTaskById(params.taskId)

      if (!task) {
        return errorResponse('任务不存在', '404')
      }

      mockLog('getTaskById result', task.title)
      return successResponse(task, '查询成功')
    },
  },
])
```

#### 2.5 高级 Mock 特性示例

**条件响应和数据验证**:

```typescript
// src/api/mock/advanced.mock.ts
import { defineUniAppMock, successResponse, errorResponse, mockLog } from '@/api/mock/shared/utils'

export default defineUniAppMock([
  // 条件响应示例
  {
    url: '/app/task/conditional',
    method: 'POST',
    // 使用 validator 根据不同条件返回不同数据
    validator: { body: { type: 'urgent' } },
    body: ({ body }) => {
      mockLog('conditional task', { type: body.type })
      return successResponse(
        {
          message: '紧急任务处理',
          priority: 'HIGH',
        },
        '紧急任务创建成功',
      )
    },
  },
  {
    url: '/app/task/conditional',
    method: 'POST',
    validator: { body: { type: 'normal' } },
    body: ({ body }) => {
      mockLog('conditional task', { type: body.type })
      return successResponse(
        {
          message: '普通任务处理',
          priority: 'MEDIUM',
        },
        '普通任务创建成功',
      )
    },
  },

  // 文件上传模拟
  {
    url: '/api/upload/image',
    method: 'POST',
    delay: 1000,
    body: ({ body }) => {
      mockLog('uploadImage', { name: body.name })

      const fileId = `FILE_${Date.now()}`
      const result = {
        fileId,
        url: `https://picsum.photos/400/300?random=${Date.now()}`,
        size: Math.floor(Math.random() * 1000000) + 50000,
        originalName: body.name || 'uploaded_file.jpg',
      }

      mockLog('uploadImage result', fileId)
      return successResponse(result, '文件上传成功')
    },
  },

  // 错误处理示例
  {
    url: '/app/error/demo',
    method: 'GET',
    body: ({ query }) => {
      mockLog('errorDemo', query)

      if (query.trigger === 'error') {
        return errorResponse('模拟服务器错误', '500')
      }

      return successResponse({ message: '正常响应' }, '请求成功')
    },
  },
])
```

#### 2.6 活动模块 Mock 示例

**基于 Activity 模块的完整 Mock 实现**:

```typescript
// src/api/mock/activity.mock.ts
import { defineUniAppMock, successResponse, errorResponse, mockLog } from '@/api/mock/shared/utils'

// 活动模拟数据
const mockActivities = [
  {
    activitiesId: 'ACT_001',
    title: '社区春节联欢会',
    userName: '物业管理处',
    startTime: '2024-02-10 19:00:00',
    endTime: '2024-02-10 21:30:00',
    context: `
      <h2>🎊 社区春节联欢会 🎊</h2>
      <p>新春佳节即将到来，为了增进邻里感情...</p>
    `,
    headerImg: 'spring_festival_header.jpg',
    src: 'https://picsum.photos/800/500?random=festival',
    communityId: 'COMM_001',
    createTime: '2024-01-15 10:30:00',
    updateTime: '2024-01-20 14:20:00',
    status: 'ACTIVE',
    viewCount: 245,
    likeCount: 38,
  },
  // ... 更多模拟数据
]

export default defineUniAppMock([
  // 获取活动列表/详情
  {
    url: '/app/activities.listActivitiess',
    method: ['GET', 'POST'],
    delay: [300, 600],
    body: ({ query, body }) => {
      const params = { ...query, ...body }

      // 如果有 activitiesId，返回单个活动详情
      if (params.activitiesId) {
        mockLog('getActivityDetail', params)

        const activity = mockActivities.find((a) => a.activitiesId === params.activitiesId)
        const result = {
          activitiess: activity ? [activity] : [],
        }

        mockLog('getActivityDetail result', activity ? activity.title : 'not found')
        return successResponse(result, '获取活动详情成功')
      }

      // 否则返回活动列表（支持分页和筛选）
      mockLog('getActivityList', params)

      let filteredActivities = [...mockActivities]

      if (params.status) {
        filteredActivities = filteredActivities.filter((a) => a.status === params.status)
      }

      if (params.keyword) {
        filteredActivities = filteredActivities.filter(
          (a) => a.title.includes(params.keyword) || a.context.includes(params.keyword),
        )
      }

      const page = Number(params.page) || 1
      const row = Number(params.row) || 10
      const start = (page - 1) * row
      const activitiess = filteredActivities.slice(start, start + row)

      const result = {
        activitiess,
        total: filteredActivities.length,
        page,
        row,
      }

      mockLog('getActivityList result', `${result.activitiess.length} items`)
      return successResponse(result, '获取活动列表成功')
    },
  },

  // 创建活动
  {
    url: '/app/activities.saveActivities',
    method: 'POST',
    delay: 800,
    body: ({ body }) => {
      mockLog('createActivity', { title: body.title })

      const newId = `ACT_${Date.now()}`
      const newActivity = {
        activitiesId: newId,
        ...body,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        viewCount: 0,
        likeCount: 0,
        src: body.headerImg ? `/api/file?fileId=${body.headerImg}` : undefined,
      }

      mockActivities.unshift(newActivity)
      mockLog('createActivity result', newId)
      return successResponse(newActivity, '创建活动成功')
    },
  },

  // 更新活动
  {
    url: '/app/activities.updateActivities',
    method: 'POST',
    delay: 600,
    body: ({ body }) => {
      mockLog('updateActivity', { activitiesId: body.activitiesId })

      const activity = mockActivities.find((a) => a.activitiesId === body.activitiesId)
      if (!activity) {
        return errorResponse('活动不存在', '404')
      }

      Object.assign(activity, {
        ...body,
        updateTime: new Date().toISOString(),
      })

      mockLog('updateActivity result', activity.title)
      return successResponse(activity, '更新活动成功')
    },
  },

  // 删除活动
  {
    url: '/app/activities.deleteActivities',
    method: ['DELETE', 'POST'],
    delay: 400,
    body: ({ query, body }) => {
      const params = { ...query, ...body }
      mockLog('deleteActivity', params)

      const index = mockActivities.findIndex((a) => a.activitiesId === params.activitiesId)

      const success = index !== -1
      if (success) {
        mockActivities.splice(index, 1)
      }

      const result = { success }
      mockLog('deleteActivity result', success ? 'success' : 'failed')
      return successResponse(result, success ? '删除活动成功' : '活动不存在')
    },
  },

  // 增加浏览量
  {
    url: '/app/activities.increaseView',
    method: 'POST',
    delay: 200,
    body: ({ body }) => {
      mockLog('increaseView', body)

      const activity = mockActivities.find((a) => a.activitiesId === body.activitiesId)
      const success = !!activity

      if (activity) {
        activity.viewCount = (activity.viewCount || 0) + 1
      }

      const result = { success }
      mockLog('increaseView result', success ? 'success' : 'failed')
      return successResponse(result, success ? '浏览量增加成功' : '活动不存在')
    },
  },
])
```

### 3. Mock 开发最佳实践

#### 3.1 开发流程规范

**标准开发流程 (更新规范要求)**:

1. **分析原 Vue2 接口** - 理解业务逻辑和数据结构
2. **🆕 创建拆分后的 TypeScript 类型定义** - 在 `src/types/{模块名}.ts` 中定义业务类型
3. **🆕 创建完整的 Mock 文件** - 必须包含内联数据 + 数据库对象 + 接口定义
4. **创建 Alova API 接口** - 现代化的请求定义，使用拆分后的类型
5. **🆕 类型安全验证** - 确保所有 Mock 数据 100%符合业务类型
6. **测试验证** - 确保 Mock 接口正常工作

**🔴 更新后的强制要求**:

- **类型导入**: 必须从 `@/types/{模块名}` 导入业务类型
- **内联数据存储**: 模拟数据直接定义在各自的 `*.mock.ts` 文件的数据库对象内
- **数据库对象**: 每个 `*.mock.ts` 文件必须包含完整的数据库操作对象和内联数据
- **类型注解**: 所有函数参数和返回值必须有明确的类型注解
- **禁用 any**: 严禁使用 `any` 类型，确保类型安全
- **自包含原则**: 每个 Mock 文件应该是功能完整的独立模块，避免外部数据依赖

#### 3.2 文件组织原则

**Mock 文件命名规范**:

- 业务模块：`{模块名}.mock.ts`（如：`activity.mock.ts`、`maintainance.mock.ts`）
- 工具函数：`shared/utils.ts`

**数据管理策略**:

- 使用单例模式管理内存数据库
- 支持数据持久化（开发期间数据不丢失）
- 提供数据重置和初始化功能

#### 3.3 常见模式和技巧

**1. 响应延迟模拟**:

```typescript
export default defineUniAppMock([
  {
    url: '/api/slow-endpoint',
    delay: [500, 2000], // 随机延迟 500-2000ms
    body: { message: '模拟慢接口' },
  },
])
```

**2. 条件响应**:

```typescript
export default defineUniAppMock([
  {
    url: '/api/conditional',
    validator: { query: { type: 'admin' } },
    body: { data: 'admin data' },
  },
  {
    url: '/api/conditional',
    body: { data: 'normal data' },
  },
])
```

**3. 错误模拟**:

```typescript
export default defineUniAppMock([
  {
    url: '/api/error-demo',
    body: ({ query }) => {
      if (query.error === 'true') {
        return {
          status: 500,
          statusText: 'Internal Server Error',
          body: { error: '服务器内部错误' },
        }
      }
      return { success: true }
    },
  },
])
```

#### 3.4 性能优化建议

**数据量控制**:

- 模拟数据数量适中（建议每个模块 20-50 条）
- 使用懒加载和分页
- 避免过度复杂的数据关联

**内存管理**:

- 定期清理过期数据
- 使用 WeakMap 管理临时数据
- 监控内存使用情况

## 迁移实施计划

### 第一阶段：Mock 环境搭建（1-2 天）

**核心任务**:

- [ ] 安装和配置 `vite-plugin-mock-dev-server`
- [ ] 创建 `/mock` 目录和基础文件结构
- [ ] 建立 TypeScript 类型定义体系
- [ ] 验证 Mock 插件正常工作

**详细步骤**:

**Step 1: 插件安装与配置**

```bash
# 安装插件
pnpm add -D vite-plugin-mock-dev-server
# 注意：已配置自定义 defineUniAppMock 函数
```

```typescript
// vite.config.ts
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server'

export default defineConfig({
  plugins: [
    // 其他插件...
    mockDevServerPlugin(),
  ],
  server: {
    proxy: {
      '^/api': 'http://localhost:3000', // 后端地址
    },
  },
})
```

**Step 2: 创建目录结构**

```plain
项目根目录/
├── src/
│   ├── api/
│   │   ├── mock/
│   │   │   ├── shared/
│   │   │   │   └── utils.ts        # Mock 工具函数
│   │   │   ├── activity.mock.ts    # 活动模块 Mock
│   │   │   └── README.md           # Mock 开发说明
│   │   ├── activity.ts             # 活动 API 接口
│   │   └── ...
│   └── types/                      # TypeScript 类型定义
│       ├── api.ts
│       ├── activity.ts
│       └── ...
└── vite.config.ts
```

**Step 3: 创建第一个 Mock 文件验证**

```typescript
// src/api/mock/test.mock.ts
import { defineUniAppMock } from '@/api/mock/shared/utils'

export default defineUniAppMock({
  url: '/test', // 注意：无需 /api 前缀，defineUniAppMock 会自动添加环境变量前缀
  delay: 300,
  body: {
    message: 'Mock 插件工作正常！',
    timestamp: Date.now(),
  },
})
```

### 第二阶段：核心业务模块迁移（3-5 天）

**迁移优先级和完整流程**:

**Day 1: 活动管理模块**

- [ ] 创建 `src/types/activity.ts` 类型定义
- [ ] 创建 `src/api/activity.ts` API 接口
- [ ] 创建 `src/api/mock/activity.mock.ts` Mock 文件
- [ ] 在组件中测试验证

**完整迁移示例**:

```typescript
// Step 1: 分析原接口 (gitee-example/api/activities/activities.js)
// 原始：
export function getActivitiesList(_that, _reqObj) {
  return new Promise((resolve, reject) => {
    _that.context.post({
      url: url.getActivitiesList,
      data: _reqObj,
      // ...
    })
  })
}

// Step 2: 创建类型定义 (src/types/activity.ts)
export interface Activity {
  activitiesId: string
  title: string
  userName: string
  startTime: string
  context: string
  headerImg: string
  // ...其他字段
}

// Step 3: 创建 API 接口 (src/api/activity.ts)
export const getActivityList = (params: ActivityListParams) =>
  http.Get<ActivityListResponse>('/app/activities.listActivitiess', { params })

// Step 4: 创建 Mock 文件 (src/api/mock/activity.mock.ts)
export default defineUniAppMock([
  {
    url: '/app/activities.listActivitiess',
    method: ['GET', 'POST'],
    delay: [300, 600],
    body: ({ query, body }) => {
      // Mock 逻辑
      return mockActivityList
    },
  },
])

// Step 5: 组件中使用验证
const { loading, data } = useRequest(getActivityList({ page: 1, row: 10 }))
```

**Day 2-3: 维修管理模块**

- [ ] 维修任务 CRUD 接口完整迁移
- [ ] 复杂状态流转逻辑处理
- [ ] 文件上传模拟接口

**Day 4: 投诉管理模块**

- [ ] 投诉工单接口迁移
- [ ] 审核流程模拟

**Day 5: 其他核心模块**

- [ ] 通讯录、公告等辅助模块
- [ ] 整体测试和优化

### 第三阶段：迁移验证和优化（1 天）

**验证任务**:

- [ ] 所有 Mock 接口响应正常
- [ ] TypeScript 类型检查通过
- [ ] 页面功能完全正常
- [ ] 性能测试和优化

**质量检查清单 (新增规范检查)**:

**🔴 基础格式要求**:

- ✅ 所有 Mock 文件使用 `*.mock.ts` 格式
- ✅ Mock 文件都在 `src/api/mock` 目录下
- ✅ 使用 `defineUniAppMock()` 而非原生 `defineMock()` 函数
- ✅ API 接口保持与原项目相同的 URL 路径
- ✅ **Mock 接口返回值必须使用统一的响应格式函数**:
  - 成功响应: 必须使用 `successResponse<T>(data, message?)` 函数包装
  - 失败响应: 必须使用 `errorResponse(message, code?)` 函数包装
  - 日志输出: 必须使用 `mockLog(apiName, data?)` 函数输出日志
  - 这三个函数从 `./shared/utils` 导入
  - 禁止手动构造返回对象，确保响应格式的一致性
  - 禁止使用手动的 `console.log('🚀 Mock API: ...')` 格式，必须统一使用 `mockLog()` 函数

**🆕 类型安全要求**:

- ✅ 必须从 `@/types/{模块名}` 导入拆分后的业务类型
- ✅ 模拟数据直接定义在各自的 `*.mock.ts` 文件的数据库对象内
- ✅ 数据生成逻辑可以直接在数据库对象的方法中实现，保持文件自包含
- ✅ 所有函数参数和返回值都有明确的 TypeScript 类型注解
- ✅ 严禁使用 `any` 类型，确保 100%类型安全

**🆕 文件结构要求**:

- ✅ 每个 `*.mock.ts` 文件必须包含：内联数据 + 数据库对象 + 接口定义
- ✅ 数据库对象包含完整的 CRUD 操作方法和模拟数据存储
- ✅ 数据库对象的所有方法都有明确的类型定义
- ✅ Mock 生成的假数据 100%符合业务类型定义
- ✅ 每个 Mock 文件是功能完整的独立模块，无需外部数据依赖

**🔴 功能完整性要求**:

- ✅ 适当的延迟和错误处理模拟
- ✅ 控制台日志便于调试
- ✅ 支持分页、筛选、排序等业务逻辑
- ✅ 数据持久化（开发期间数据不丢失）
