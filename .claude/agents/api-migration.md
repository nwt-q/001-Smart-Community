---
name: api-migration
description: 专业的接口请求迁移专家，专注于从 Java110Context + uni.request 架构迁移到 Alova + TypeScript + 模拟接口的现代化开发模式，提供完整的类型定义、模拟数据和迁移实施方案
color: blue
---

# 接口请求迁移专家

## 迁移概述

从 Vue2 项目的 **Java110Context + uni.request** 网络请求架构迁移到 Vue3 项目的 **Alova + TypeScript + 模拟接口** 现代化开发架构。

**重要说明**: 本迁移计划专注于前端开发效率，采用模拟接口方式，无需处理后端认证和权限问题。

## 技术栈对比

### Vue2 项目网络请求架构

```
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

```
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
- **无需认证**: 直接请求即可获取数据，简化开发流程
- **模拟接口**: 使用假数据进行快速开发和测试
- **自动错误处理**: 全局统一错误处理机制
- **响应式状态**: 自动管理请求状态和数据响应式更新

## 迁移策略

### 1. 核心架构变化

#### 1.1 请求实例对比

**Vue2 项目 (Java110Context)**:

```javascript
// lib/java110/request.js
export default {
  request: function(_reqObj) {
    // 复杂的会话管理和认证逻辑
    hasSession().then((_data) => {
      _reqObj.header.cookie = '_java110_token_=' + uni.getStorageSync('token')

      let _success = _reqObj.success
      _reqObj.success = function(_res) {
        if (_res.statusCode == 401) {
          uni.reLaunch({ url: '/pages/login/login' })
          return
        }
        _success(_res)
      }

      uni.request(_reqObj)
    })
  }
}
```

**Vue3 项目 (简化的 Alova)**:

```typescript
// src/http/alova.ts
import { createAlova } from 'alova'
import AdapterUniapp from '@alova/adapter-uniapp'
import VueHook from 'alova/vue'

// 简化的请求实例，无需认证
const alovaInstance = createAlova({
  baseURL: '/api', // 简化的基础路径
  ...AdapterUniapp(),
  timeout: 5000,
  statesHook: VueHook,

  beforeRequest(method) {
    // 简单的请求头设置，无需认证
    method.config.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...method.config.headers,
    }
  },

  responded(response) {
    const { statusCode, data } = response

    // 简化的响应处理
    if (statusCode !== 200) {
      throw new Error(`请求失败[${statusCode}]`)
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
  return new Promise(function(resolve, reject) {
    _that.context.post({
      url: url.UpdateMaintainanceTask,
      data: _data,
      success: function(res) {
        resolve(res.data) // 不知道返回什么类型
      },
      fail: function(e) {
        wx.showToast({
          title: "服务器异常了",
          icon: 'none',
          duration: 2000
        })
        reject(e)
      }
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
  PaginationResponse
} from '@/types'

// 1. 更新维修任务
export const updateMaintainanceTask = (data: UpdateMaintainanceTaskReq) =>
  http.Post<MaintainanceTask>('/app/ownerRepair.updateOwnerRepair', data)

// 2. 查询维修任务列表
export const getMaintainanceTaskList = (params: MaintainanceTaskListParams) =>
  http.Get<PaginationResponse<MaintainanceTask>>('/app/ownerRepair.listOwnerRepairs', {
    params
  })

// 3. 获取任务详情
export const getMaintainanceTaskDetail = (taskId: string) =>
  http.Get<MaintainanceTask>('/app/ownerRepair.getOwnerRepair', {
    params: { taskId }
  })

// 4. 创建维修任务
export const createMaintainanceTask = (data: Omit<MaintainanceTask, 'id' | 'taskId' | 'createTime' | 'updateTime'>) =>
  http.Post<MaintainanceTask>('/app/ownerRepair.saveOwnerRepair', data)

// 5. 删除维修任务
export const deleteMaintainanceTask = (taskId: string) =>
  http.Delete<{ success: boolean }>('/app/ownerRepair.deleteOwnerRepair', {
    params: { taskId }
  })
```

### 2. 模拟接口实现策略

⚠️ **重要说明**: 本项目使用 `vite-plugin-mock-dev-server` 插件进行模拟接口开发。

#### 2.1 Mock 文件结构要求

**核心要求**:

- **文件格式**: 必须使用 `*.mock.ts` 格式，不得使用其他格式
- **文件位置**: 模拟接口文件必须放在 `src/api/mock` 目录下
- **注意**: Mock 文件与 API 接口文件在同一目录层级，便于管理和维护

**正确的项目结构**:

```
项目根目录/
├── src/
│   └── api/                       # API 目录
│       ├── mock/                  # Mock 文件目录
│       │   ├── maintainance.mock.ts    # 维修模块 Mock 接口
│       │   ├── complaint.mock.ts       # 投诉模块 Mock 接口
│       │   ├── activity.mock.ts        # 活动模块 Mock 接口
│       │   └── shared/                 # 共享 Mock 数据
│       │       ├── mockData.ts         # 通用模拟数据生成器
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

#### 2.3 模拟数据生成器

**创建共享的模拟数据工厂**:

```typescript
// src/api/mock/shared/mockData.ts
import type { MaintainanceTask, PaginationResponse } from '@/types'

// 模拟数据生成器
export const createMockMaintainanceTask = (id: string): MaintainanceTask => ({
  id,
  taskId: `TASK_${id}`,
  title: `维修任务 ${id}`,
  description: `这是一个测试维修任务的详细描述 ${id}`,
  status: ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'][Math.floor(Math.random() * 4)] as any,
  priority: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)] as any,
  assigneeId: `USER_${Math.floor(Math.random() * 100)}`,
  assigneeName: `维修员${Math.floor(Math.random() * 100)}`,
  createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updateTime: new Date().toISOString(),
  dueDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  images: [
    'https://picsum.photos/300/200?random=' + Math.floor(Math.random() * 1000),
    'https://picsum.photos/300/200?random=' + Math.floor(Math.random() * 1000)
  ],
  location: `${Math.floor(Math.random() * 20 + 1)}号楼${Math.floor(Math.random() * 6 + 1)}0${Math.floor(Math.random() * 9 + 1)}室`,
  remark: Math.random() > 0.5 ? `备注信息 ${id}` : undefined
})

// 生成模拟任务列表
export const generateMockTaskList = (count: number = 20): MaintainanceTask[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockMaintainanceTask((index + 1).toString().padStart(3, '0'))
  )
}

// 创建内存数据库
export class MockDatabase {
  private static instance: MockDatabase
  public maintainanceTasks: MaintainanceTask[] = generateMockTaskList(50)

  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase()
    }
    return MockDatabase.instance
  }

  // 获取任务列表（支持分页和筛选）
  getTaskList(params: {
    page: number
    pageSize: number
    status?: string
    keyword?: string
  }): PaginationResponse<MaintainanceTask> {
    let filteredTasks = [...this.maintainanceTasks]

    // 状态筛选
    if (params.status) {
      filteredTasks = filteredTasks.filter(task => task.status === params.status)
    }

    // 关键词筛选
    if (params.keyword) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.includes(params.keyword!) ||
        task.description.includes(params.keyword!)
      )
    }

    // 分页处理
    const total = filteredTasks.length
    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize
    const list = filteredTasks.slice(start, end)

    return {
      list,
      total,
      page: params.page,
      pageSize: params.pageSize,
      hasMore: end < total
    }
  }

  // 其他数据库操作方法...
  getTaskById(taskId: string): MaintainanceTask | undefined {
    return this.maintainanceTasks.find(task => task.taskId === taskId)
  }

  updateTask(taskId: string, updateData: Partial<MaintainanceTask>): MaintainanceTask | null {
    const index = this.maintainanceTasks.findIndex(task => task.taskId === taskId)
    if (index === -1) return null

    this.maintainanceTasks[index] = {
      ...this.maintainanceTasks[index],
      ...updateData,
      updateTime: new Date().toISOString()
    }

    return this.maintainanceTasks[index]
  }

  createTask(taskData: Omit<MaintainanceTask, 'id' | 'taskId' | 'createTime' | 'updateTime'>): MaintainanceTask {
    const newId = (this.maintainanceTasks.length + 1).toString().padStart(3, '0')
    const newTask: MaintainanceTask = {
      ...taskData,
      id: newId,
      taskId: `TASK_${newId}`,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    }

    this.maintainanceTasks.unshift(newTask)
    return newTask
  }

  deleteTask(taskId: string): boolean {
    const index = this.maintainanceTasks.findIndex(task => task.taskId === taskId)
    if (index === -1) return false

    this.maintainanceTasks.splice(index, 1)
    return true
  }
}

// 导出数据库实例
export const mockDb = MockDatabase.getInstance()
```

#### 2.4 Mock 接口定义

**正确使用 `defineMock` 定义 Mock 接口**:

```typescript
// src/api/mock/maintainance.mock.ts
import { defineMock } from 'vite-plugin-mock-dev-server'
import { mockDb } from './shared/mockData'
import type { UpdateMaintainanceTaskReq } from '@/types'

// 模拟请求延迟
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

export default defineMock([
  // 1. 获取维修任务列表
  {
    url: '/api/app/ownerRepair.listOwnerRepairs',
    method: ['GET', 'POST'],
    delay: [300, 800], // 随机延迟 300-800ms
    body: async ({ query, body }) => {
      await delay()

      const params = { ...query, ...body }
      const result = mockDb.getTaskList({
        page: Number(params.page) || 1,
        pageSize: Number(params.pageSize) || 10,
        status: params.status,
        keyword: params.keyword
      })

      console.log('🚀 Mock API: listOwnerRepairs', params, '→', `${result.list.length} items`)
      return result
    }
  },

  // 2. 获取维修任务详情
  {
    url: '/api/app/ownerRepair.getOwnerRepair',
    method: ['GET', 'POST'],
    delay: 200,
    body: async ({ query, body }) => {
      const params = { ...query, ...body }
      const task = mockDb.getTaskById(params.taskId)

      if (!task) {
        return {
          status: 404,
          statusText: 'Not Found',
          body: { error: '任务不存在' }
        }
      }

      console.log('🚀 Mock API: getOwnerRepair', params, '→', task.title)
      return task
    }
  },

  // 3. 更新维修任务
  {
    url: '/api/app/ownerRepair.updateOwnerRepair',
    method: 'POST',
    delay: 600,
    body: async ({ body }) => {
      const data = body as UpdateMaintainanceTaskReq
      const updatedTask = mockDb.updateTask(data.taskId, data)

      if (!updatedTask) {
        return {
          status: 400,
          statusText: 'Bad Request',
          body: { error: '更新失败，任务不存在' }
        }
      }

      console.log('🚀 Mock API: updateOwnerRepair', data, '→', updatedTask.title)
      return updatedTask
    }
  },

  // 4. 创建维修任务
  {
    url: '/api/app/ownerRepair.saveOwnerRepair',
    method: 'POST',
    delay: 800,
    body: async ({ body }) => {
      const newTask = mockDb.createTask(body)
      console.log('🚀 Mock API: saveOwnerRepair', body.title, '→', newTask)
      return newTask
    }
  },

  // 5. 删除维修任务
  {
    url: '/api/app/ownerRepair.deleteOwnerRepair',
    method: ['DELETE', 'POST'],
    delay: 400,
    body: async ({ query, body }) => {
      const params = { ...query, ...body }
      const success = mockDb.deleteTask(params.taskId)
      const result = { success }

      console.log('🚀 Mock API: deleteOwnerRepair', params.taskId, '→', success)
      return result
    }
  },

  // 6. 动态路由示例 - 根据 ID 获取任务
  {
    url: '/api/app/ownerRepair/task/:taskId',
    method: 'GET',
    delay: 300,
    body: async ({ params }) => {
      const task = mockDb.getTaskById(params.taskId)

      if (!task) {
        return {
          status: 404,
          statusText: 'Not Found',
          body: { error: '任务不存在' }
        }
      }

      console.log('🚀 Mock API: getTaskById', params.taskId, '→', task.title)
      return task
    }
  }
])
```

#### 2.5 高级 Mock 特性示例

**条件响应和数据验证**:

```typescript
// src/api/mock/advanced.mock.ts
import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock([
  // 条件响应示例
  {
    url: '/api/app/task/conditional',
    method: 'POST',
    // 使用 validator 根据不同条件返回不同数据
    validator: { body: { type: 'urgent' } },
    body: {
      message: '紧急任务处理',
      priority: 'HIGH'
    }
  },
  {
    url: '/api/app/task/conditional',
    method: 'POST',
    validator: { body: { type: 'normal' } },
    body: {
      message: '普通任务处理',
      priority: 'MEDIUM'
    }
  },

  // 文件上传模拟
  {
    url: '/api/upload/image',
    method: 'POST',
    delay: 1000,
    body: ({ body }) => {
      // 模拟文件上传成功
      return {
        success: true,
        fileId: `FILE_${Date.now()}`,
        url: `https://picsum.photos/400/300?random=${Date.now()}`,
        size: Math.floor(Math.random() * 1000000) + 50000,
        originalName: body.name || 'uploaded_file.jpg'
      }
    }
  },

  // 错误处理示例
  {
    url: '/api/app/error/demo',
    method: 'GET',
    body: ({ query }) => {
      if (query.trigger === 'error') {
        return {
          status: 500,
          statusText: 'Internal Server Error',
          body: { error: '模拟服务器错误' }
        }
      }
      return { message: '正常响应' }
    }
  }
])
```

#### 2.6 活动模块 Mock 示例

**基于 Activity 模块的完整 Mock 实现**:

```typescript
// src/api/mock/activity.mock.ts
import { defineMock } from 'vite-plugin-mock-dev-server'

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
  }
  // ... 更多模拟数据
]

export default defineMock([
  // 获取活动列表/详情
  {
    url: '/api/app/activities.listActivitiess',
    method: ['GET', 'POST'],
    delay: [300, 600],
    body: ({ query, body }) => {
      const params = { ...query, ...body }

      // 如果有 activitiesId，返回单个活动详情
      if (params.activitiesId) {
        const activity = mockActivities.find(a => a.activitiesId === params.activitiesId)
        const result = {
          activitiess: activity ? [activity] : [],
        }
        console.log('🚀 Mock API: getActivityDetail', params, '→', result)
        return result
      }

      // 否则返回活动列表（支持分页和筛选）
      let filteredActivities = [...mockActivities]

      if (params.status) {
        filteredActivities = filteredActivities.filter(a => a.status === params.status)
      }

      if (params.keyword) {
        filteredActivities = filteredActivities.filter(a =>
          a.title.includes(params.keyword) || a.context.includes(params.keyword)
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
        row
      }

      console.log('🚀 Mock API: getActivityList', params, '→', `${result.activitiess.length} items`)
      return result
    }
  },

  // 创建活动
  {
    url: '/api/app/activities.saveActivities',
    method: 'POST',
    delay: 800,
    body: ({ body }) => {
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
      console.log('🚀 Mock API: createActivity', body, '→', newActivity)
      return newActivity
    }
  },

  // 更新活动
  {
    url: '/api/app/activities.updateActivities',
    method: 'POST',
    delay: 600,
    body: ({ body }) => {
      const activity = mockActivities.find(a => a.activitiesId === body.activitiesId)
      if (!activity) {
        return {
          status: 404,
          statusText: 'Not Found',
          body: { error: '活动不存在' }
        }
      }

      Object.assign(activity, {
        ...body,
        updateTime: new Date().toISOString(),
      })

      console.log('🚀 Mock API: updateActivity', body, '→', activity)
      return activity
    }
  },

  // 删除活动
  {
    url: '/api/app/activities.deleteActivities',
    method: ['DELETE', 'POST'],
    delay: 400,
    body: ({ query, body }) => {
      const params = { ...query, ...body }
      const index = mockActivities.findIndex(a => a.activitiesId === params.activitiesId)

      const success = index !== -1
      if (success) {
        mockActivities.splice(index, 1)
      }

      const result = { success }
      console.log('🚀 Mock API: deleteActivity', params, '→', result)
      return result
    }
  },

  // 增加浏览量
  {
    url: '/api/app/activities.increaseView',
    method: 'POST',
    delay: 200,
    body: ({ body }) => {
      const activity = mockActivities.find(a => a.activitiesId === body.activitiesId)
      const success = !!activity

      if (activity) {
        activity.viewCount = (activity.viewCount || 0) + 1
      }

      const result = { success }
      console.log('🚀 Mock API: increaseView', body, '→', result)
      return result
    }
  }
])
```

### 3. Mock 开发最佳实践

#### 3.1 开发流程规范

**标准开发流程**:

1. **分析原 Vue2 接口** - 理解业务逻辑和数据结构
2. **创建 TypeScript 类型定义** - 确保类型安全
3. **创建 Alova API 接口** - 现代化的请求定义
4. **创建 Mock 数据** - 在 `/mock` 目录下创建 `*.mock.ts` 文件
5. **测试验证** - 确保 Mock 接口正常工作

#### 3.2 文件组织原则

**Mock 文件命名规范**:

- 业务模块：`{模块名}.mock.ts`（如：`activity.mock.ts`、`maintainance.mock.ts`）
- 共享数据：`shared/mockData.ts`
- 工具函数：`shared/utils.ts`

**数据管理策略**:

- 使用单例模式管理内存数据库
- 支持数据持久化（开发期间数据不丢失）
- 提供数据重置和初始化功能

#### 3.3 常见模式和技巧

**1. 响应延迟模拟**:

```typescript
export default defineMock([
  {
    url: '/api/slow-endpoint',
    delay: [500, 2000], // 随机延迟 500-2000ms
    body: { message: '模拟慢接口' }
  }
])
```

**2. 条件响应**:

```typescript
export default defineMock([
  {
    url: '/api/conditional',
    validator: { query: { type: 'admin' } },
    body: { data: 'admin data' }
  },
  {
    url: '/api/conditional',
    body: { data: 'normal data' }
  }
])
```

**3. 错误模拟**:

```typescript
export default defineMock([
  {
    url: '/api/error-demo',
    body: ({ query }) => {
      if (query.error === 'true') {
        return {
          status: 500,
          statusText: 'Internal Server Error',
          body: { error: '服务器内部错误' }
        }
      }
      return { success: true }
    }
  }
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

### 第一阶段：Mock 环境搭建（1-2天）

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

```
项目根目录/
├── src/
│   ├── api/
│   │   ├── mock/
│   │   │   ├── shared/
│   │   │   │   ├── mockData.ts     # 通用数据生成器
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
import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock({
  url: '/api/test',
  delay: 300,
  body: {
    message: 'Mock 插件工作正常！',
    timestamp: Date.now()
  }
})
```

### 第二阶段：核心业务模块迁移（3-5天）

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
  http.Get<ActivityListResponse>('/api/app/activities.listActivitiess', { params })

// Step 4: 创建 Mock 文件 (src/api/mock/activity.mock.ts)
export default defineMock([
  {
    url: '/api/app/activities.listActivitiess',
    method: ['GET', 'POST'],
    delay: [300, 600],
    body: ({ query, body }) => {
      // Mock 逻辑
      return mockActivityList
    }
  }
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

### 第三阶段：迁移验证和优化（1天）

**验证任务**:

- [ ] 所有 Mock 接口响应正常
- [ ] TypeScript 类型检查通过
- [ ] 页面功能完全正常
- [ ] 性能测试和优化

**质量检查清单**:

- ✅ 所有 Mock 文件使用 `*.mock.ts` 格式
- ✅ Mock 文件都在 `src/api/mock` 目录下
- ✅ 使用 `defineMock()` 而非自定义函数
- ✅ API 接口保持与原项目相同的 URL 路径
- ✅ 完整的 TypeScript 类型定义
- ✅ 适当的延迟和错误处理模拟
- ✅ 控制台日志便于调试
