---
name: api-migration
description: 1111
color: green
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

#### 2.1 模拟数据生成

**创建模拟数据工厂**:

```typescript
// src/api/mock/maintainanceData.ts
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

// 全局模拟数据存储
export const mockDatabase = {
  maintainanceTasks: generateMockTaskList(50),

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
  },

  // 获取单个任务
  getTaskById(taskId: string): MaintainanceTask | undefined {
    return this.maintainanceTasks.find(task => task.taskId === taskId)
  },

  // 更新任务
  updateTask(taskId: string, updateData: Partial<MaintainanceTask>): MaintainanceTask | null {
    const index = this.maintainanceTasks.findIndex(task => task.taskId === taskId)
    if (index === -1) return null

    this.maintainanceTasks[index] = {
      ...this.maintainanceTasks[index],
      ...updateData,
      updateTime: new Date().toISOString()
    }

    return this.maintainanceTasks[index]
  },

  // 创建任务
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
  },

  // 删除任务
  deleteTask(taskId: string): boolean {
    const index = this.maintainanceTasks.findIndex(task => task.taskId === taskId)
    if (index === -1) return false

    this.maintainanceTasks.splice(index, 1)
    return true
  }
}
```

#### 2.2 模拟接口拦截器

**使用 Alova 的模拟适配器**:

```typescript
// src/http/mockAdapter.ts
import { mockDatabase } from '@/api/mock/maintainanceData'
import type { MaintainanceTask, UpdateMaintainanceTaskReq } from '@/types'

// 模拟请求延迟
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟接口响应拦截器
export const mockInterceptor = {
  // 维修任务相关接口
  async '/app/ownerRepair.listOwnerRepairs'(params: any) {
    await delay()

    const result = mockDatabase.getTaskList({
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      status: params.status,
      keyword: params.keyword
    })

    console.log('🚀 Mock API: listOwnerRepairs', params, '→', result)
    return result
  },

  async '/app/ownerRepair.getOwnerRepair'(params: any) {
    await delay()

    const task = mockDatabase.getTaskById(params.taskId)
    if (!task) {
      throw new Error('任务不存在')
    }

    console.log('🚀 Mock API: getOwnerRepair', params, '→', task)
    return task
  },

  async '/app/ownerRepair.updateOwnerRepair'(data: UpdateMaintainanceTaskReq) {
    await delay()

    const updatedTask = mockDatabase.updateTask(data.taskId, data)
    if (!updatedTask) {
      throw new Error('更新失败，任务不存在')
    }

    console.log('🚀 Mock API: updateOwnerRepair', data, '→', updatedTask)
    return updatedTask
  },

  async '/app/ownerRepair.saveOwnerRepair'(data: any) {
    await delay()

    const newTask = mockDatabase.createTask(data)
    console.log('🚀 Mock API: saveOwnerRepair', data, '→', newTask)
    return newTask
  },

  async '/app/ownerRepair.deleteOwnerRepair'(params: any) {
    await delay()

    const success = mockDatabase.deleteTask(params.taskId)
    const result = { success }

    console.log('🚀 Mock API: deleteOwnerRepair', params, '→', result)
    return result
  }
}
```

#### 2.3 组件中的使用方式对比

**Vue2 项目组件使用**:

```vue
<script>
import { UpdateMaintainanceTask } from '@/api/maintainance/maintainance.js'

export default {
  data() {
    return {
      loading: false,
      taskList: [] // 不知道数组元素类型
    }
  },
  methods: {
    async updateTask(taskData) { // 参数无类型约束
      this.loading = true
      try {
        const result = await UpdateMaintainanceTask(this, taskData)
        this.taskList = result.tasks // 不确定 result 的结构
        uni.showToast({
          title: '更新成功',
          icon: 'success'
        })
      } catch (error) {
        console.error('更新失败', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
```

**Vue3 项目组件使用**:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRequest } from 'alova/client'
import {
  updateMaintainanceTask,
  getMaintainanceTaskList
} from '@/api/maintainance'
import type {
  UpdateMaintainanceTaskReq,
  MaintainanceTask
} from '@/types'

// 获取任务列表 - 自动类型推导
const {
  loading: listLoading,
  data: taskList, // 类型：Ref<PaginationResponse<MaintainanceTask> | undefined>
  send: refreshList
} = useRequest(getMaintainanceTaskList({ page: 1, pageSize: 10 }), {
  immediate: true
})

// 更新任务 - 类型安全
const {
  loading: updateLoading,
  send: sendUpdate
} = useRequest(updateMaintainanceTask, {
  immediate: false
})

// 严格的类型约束
const updateTask = async (taskData: UpdateMaintainanceTaskReq) => {
  try {
    const updatedTask = await sendUpdate(taskData) // 返回类型：MaintainanceTask
    uni.showToast({ title: '更新成功', icon: 'success' })
    await refreshList() // 自动刷新列表
  } catch (error) {
    console.error('更新失败', error)
  }
}

// 搜索功能 - 类型安全的参数
const searchTasks = async (keyword: string, status?: string) => {
  const { send } = useRequest(getMaintainanceTaskList, { immediate: false })

  const result = await send({
    page: 1,
    pageSize: 20,
    keyword,
    status
  })

  taskList.value = result // TypeScript 会检查类型兼容性
}
</script>

<template>
  <view class="task-list">
    <!-- 加载状态 -->
    <view v-if="listLoading" class="loading">
      加载中...
    </view>

    <!-- 任务列表 - 完整的类型提示 -->
    <view
      v-for="task in taskList?.list"
      :key="task.taskId"
      class="task-item"
    >
      <text>{{ task.title }}</text>
      <text>状态：{{ task.status }}</text>
      <text>负责人：{{ task.assigneeName }}</text>

      <!-- 更新按钮 -->
      <button
        :disabled="updateLoading"
        @click="updateTask({
          taskId: task.taskId,
          status: 'COMPLETED',
          remark: '任务已完成'
        })"
      >
        完成任务
      </button>
    </view>
  </view>
</template>
```

### 3. 模拟接口集成配置

#### 3.1 Alova 集成模拟适配器

**配置模拟响应拦截**:

```typescript
// src/http/alova.ts - 更新配置
import { createAlova } from 'alova'
import AdapterUniapp from '@alova/adapter-uniapp'
import VueHook from 'alova/vue'
import { mockInterceptor } from './mockAdapter'

const isDevelopment = import.meta.env.DEV

const alovaInstance = createAlova({
  baseURL: '/api',
  ...AdapterUniapp(),
  timeout: 5000,
  statesHook: VueHook,

  beforeRequest(method) {
    method.config.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...method.config.headers,
    }
  },

  responded: async (response, method) => {
    const { statusCode } = response

    // 开发环境使用模拟接口
    if (isDevelopment) {
      const url = method.url
      const mockHandler = mockInterceptor[url]

      if (mockHandler) {
        try {
          const mockData = await mockHandler(method.data || method.config.params || {})
          console.log(`🎭 Mock Response [${method.type.toUpperCase()}] ${url}:`, mockData)
          return mockData
        } catch (error) {
          console.error(`❌ Mock Error [${url}]:`, error)
          throw error
        }
      }
    }

    // 生产环境或未配置模拟的接口走真实请求
    if (statusCode !== 200) {
      throw new Error(`请求失败[${statusCode}]`)
    }

    return response.data
  },
})

export const http = alovaInstance
```

#### 3.2 完整业务模块示例

**投诉管理模块**:

```typescript
// src/types/complaint.ts
export interface Complaint {
  id: string
  complaintId: string
  title: string
  content: string
  type: 'NOISE' | 'ENVIRONMENT' | 'SERVICE' | 'FACILITY' | 'OTHER'
  status: 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  reporterId: string
  reporterName: string
  reporterPhone: string
  handlerId?: string
  handlerName?: string
  createTime: string
  handleTime?: string
  resolveTime?: string
  images?: string[]
  location?: string
  remark?: string
}

// src/api/complaint.ts
import { http } from '@/http/alova'
import type { Complaint, PaginationResponse, PaginationParams } from '@/types'

export interface ComplaintListParams extends PaginationParams {
  status?: string
  type?: string
  keyword?: string
  startTime?: string
  endTime?: string
}

export interface CreateComplaintReq {
  title: string
  content: string
  type: Complaint['type']
  priority: Complaint['priority']
  reporterName: string
  reporterPhone: string
  location?: string
  images?: string[]
}

export interface UpdateComplaintReq {
  complaintId: string
  status?: Complaint['status']
  handlerName?: string
  remark?: string
}

// API 接口定义 - 保持与旧项目相同的路径
export const getComplaintList = (params: ComplaintListParams) =>
  http.Get<PaginationResponse<Complaint>>('/app/complaint.listComplaints', { params })

export const getComplaintDetail = (complaintId: string) =>
  http.Get<Complaint>('/app/complaint.getComplaint', { params: { complaintId } })

export const createComplaint = (data: CreateComplaintReq) =>
  http.Post<Complaint>('/app/complaint.saveComplaint', data)

export const updateComplaint = (data: UpdateComplaintReq) =>
  http.Post<Complaint>('/app/complaint.updateComplaint', data)

export const auditComplaint = (complaintId: string, auditResult: 'APPROVED' | 'REJECTED', remark?: string) =>
  http.Post<Complaint>('/app/complaint.auditComplaint', { complaintId, auditResult, remark })
```

## 迁移实施计划

### 第一阶段：基础设施搭建（2-3天）

**核心任务**:

- [ ] 配置简化的 Alova 实例（无认证）
- [ ] 建立完整的 TypeScript 类型定义体系
- [ ] 搭建模拟接口框架
- [ ] 配置开发环境模拟数据拦截

**详细任务清单**:

**Day 1: Alova 配置和类型定义**

```typescript
// 1. 创建基础类型定义文件
// src/types/api.ts
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

// 2. 配置简化的 Alova 实例
// src/http/alova.ts
import { createAlova } from 'alova'
import AdapterUniapp from '@alova/adapter-uniapp'
import VueHook from 'alova/vue'

const alovaInstance = createAlova({
  baseURL: '/api',
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
    if (statusCode !== 200) {
      throw new Error(`请求失败[${statusCode}]`)
    }
    return data
  },
})

export const http = alovaInstance
```

**Day 2: 模拟接口框架搭建**

```typescript
// 3. 创建模拟数据管理器
// src/api/mock/index.ts
export class MockDataManager {
  private static instance: MockDataManager
  private databases: Map<string, any> = new Map()

  static getInstance(): MockDataManager {
    if (!MockDataManager.instance) {
      MockDataManager.instance = new MockDataManager()
    }
    return MockDataManager.instance
  }

  register<T>(name: string, database: T): void {
    this.databases.set(name, database)
  }

  get<T>(name: string): T {
    return this.databases.get(name)
  }
}

// 4. 创建模拟接口拦截器
// src/http/mockAdapter.ts
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const mockInterceptor: Record<string, Function> = {}

export function registerMockHandler(url: string, handler: Function) {
  mockInterceptor[url] = handler
  console.log(`📝 注册模拟接口: ${url}`)
}
```

**Day 3: 第一个完整业务模块示例**

```typescript
// 5. 创建维修模块完整示例
// src/types/maintainance.ts - 类型定义
// src/api/maintainance.ts - API 接口
// src/api/mock/maintainanceData.ts - 模拟数据
// src/api/mock/maintainanceHandlers.ts - 模拟处理器

// 验证整个流程是否工作正常
```

### 第二阶段：核心业务模块迁移（5-7天）

**迁移优先级和时间安排**:

**Day 1-2: 维修工单模块**

- [ ] 维修任务 CRUD 接口迁移
- [ ] 完整的类型定义（MaintainanceTask, UpdateRequest 等）
- [ ] 模拟数据生成器和处理器
- [ ] 组件使用示例验证

**Day 3-4: 投诉管理模块**

- [ ] 投诉工单 CRUD 接口迁移
- [ ] 投诉类型定义和状态管理
- [ ] 模拟投诉数据和处理逻辑
- [ ] 审核流程接口

**Day 5-6: 巡检管理模块**

- [ ] 巡检任务接口迁移
- [ ] 巡检记录和报告类型
- [ ] 二维码扫描相关接口模拟
- [ ] 巡检流程状态管理

**Day 7: 其他核心接口**

- [ ] 通讯录接口
- [ ] 公告管理接口
- [ ] 文件上传模拟接口

**标准迁移模板**:

```typescript
// Step 1: 分析原 Vue2 接口
// 原始文件：gitee-example/api/maintainance/maintainance.js
export function UpdateMaintainanceTask(_that, _data) {
  return new Promise((resolve, reject) => {
    _that.context.post({
      url: url.UpdateMaintainanceTask,
      data: _data,
      success: (res) => resolve(res.data),
      fail: (e) => reject(e)
    })
  })
}

// Step 2: 创建 TypeScript 类型定义
// src/types/maintainance.ts
export interface UpdateMaintainanceTaskReq {
  taskId: string
  status: 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
  remark?: string
  images?: string[]
  handlerName?: string
}

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
  location?: string
  images?: string[]
  remark?: string
}

// Step 3: 创建现代化 API 接口
// src/api/maintainance.ts
import { http } from '@/http/alova'
import type { MaintainanceTask, UpdateMaintainanceTaskReq, PaginationResponse } from '@/types'

// 保持与旧项目相同的 URL 路径
export const updateMaintainanceTask = (data: UpdateMaintainanceTaskReq) =>
  http.Post<MaintainanceTask>('/app/ownerRepair.updateOwnerRepair', data)

export const getMaintainanceTaskList = (params: {
  page: number
  pageSize: number
  status?: string
  keyword?: string
}) =>
  http.Get<PaginationResponse<MaintainanceTask>>('/app/ownerRepair.listOwnerRepairs', { params })

// Step 4: 创建模拟数据处理器
// src/api/mock/maintainanceHandlers.ts
import { registerMockHandler } from '@/http/mockAdapter'
import { mockDatabase } from './maintainanceData'

// 注册模拟处理器，使用与旧项目相同的 URL
registerMockHandler('/app/ownerRepair.updateOwnerRepair', async (data: UpdateMaintainanceTaskReq) => {
  await delay(300)

  const updatedTask = mockDatabase.updateTask(data.taskId, data)
  if (!updatedTask) {
    throw new Error('任务不存在')
  }

  console.log('🚀 Mock: updateOwnerRepair', data, '→', updatedTask)
  return updatedTask
})

registerMockHandler('/app/ownerRepair.listOwnerRepairs', async (params: any) => {
  await delay(500)

  const result = mockDatabase.getTaskList(params)
  console.log('🚀 Mock: listOwnerRepairs', params, '→', result.list.length, 'items')
  return result
})

// Step 5: 组件中使用验证
// 在页面组件中测试新接口是否工作正常
const { loading, data: taskList, send: refreshTasks } = useRequest(
  getMaintainanceTaskList({ page: 1, pageSize: 10 }),
  { immediate: true }
)

const { loading: updating, send: updateTask } = useRequest(updateMaintainanceTask, {
  immediate: false
})
```

## 总结

接口请求迁移是整个项目迁移的关键环节，通过合理的规划和实施，可以实现：

1. **技术升级**: 从传统请求方式升级到现代化请求管理
2. **开发效率提升**: 自动状态管理和类型检查
3. **用户体验改善**: 更好的加载状态和错误处理
4. **维护成本降低**: 统一的请求规范和错误处理机制

迁移过程中需要特别关注**业务逻辑一致性**、**数据格式兼容性**和**错误处理完整性**，确保迁移后的系统功能和用户体验不低于原系统。
