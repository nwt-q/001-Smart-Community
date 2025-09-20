# 接口请求迁移计划

## 迁移概述

从 Vue2 项目的 **Java110Context + uni.request** 网络请求架构迁移到 Vue3 项目的 **Alova** 现代化请求库架构。

## 技术栈对比

### Vue2 项目网络请求架构

```
Java110Context 生态系统
├── lib/java110/request.js          # 核心请求封装
├── lib/java110/Java110Context.js   # 统一上下文对象
├── lib/java110/api/                # API 工具函数
│   ├── Java110SessionApi.js       # 会话管理
│   └── SystemApi.js               # 系统相关 API
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
- **Cookie 认证**: 使用 cookie 方式进行身份验证
- **手动错误处理**: 每个请求需要手动处理错误
- **同步调用方式**: 主要使用 Promise 和回调函数

### Vue3 项目网络请求架构

```
Alova 现代化请求架构
├── src/http/alova.ts              # Alova 实例配置
├── src/http/types.ts              # TypeScript 类型定义
├── src/http/tools/enum.ts         # 枚举和常量
├── src/api/                       # API 接口定义
│   └── foo-alova.ts              # 示例 API
├── 组合式函数调用                  # 在组件中使用 useRequest
└── 自动状态管理                   # 自动管理 loading、error 状态
```

#### 特点

- **现代化库**: 基于 Alova 的先进请求管理
- **TypeScript 支持**: 完整的类型检查和智能提示
- **Token 认证**: 使用 token 方式进行身份验证
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

**Vue3 项目 (Alova)**:

```typescript
// src/http/alova.ts
const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_APP_PROXY_PREFIX,
  ...AdapterUniapp(),
  timeout: 5000,
  statesHook: VueHook,

  beforeRequest: onAuthRequired((method) => {
    method.config.headers = {
      ContentType: ContentTypeEnum.JSON,
      Accept: 'application/json, text/plain, */*',
      ...method.config.headers,
    }

    const token = getToken()
    if (token) {
      method.config.headers.Authorization = `Bearer ${token}`
    }
  }),

  responded: onResponseRefreshToken((response, method) => {
    // 统一响应处理
    const { statusCode, data: rawData } = response
    if (statusCode !== 200) {
      throw new Error(`HTTP错误[${statusCode}]`)
    }

    const { code, message, data } = rawData
    if (code !== ResultEnum.Success) {
      throw new Error(`业务错误[${code}]：${message}`)
    }
    return data
  }),
})
```

#### 1.2 API 定义方式对比

**Vue2 项目 API 定义**:

```javascript
// api/maintainance/maintainance.js
export function UpdateMaintainanceTask(_that, _data) {
  return new Promise(function(resolve, reject) {
    _that.context.post({
      url: url.UpdateMaintainanceTask,
      data: _data,
      success: function(res) {
        resolve(res.data)
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

**Vue3 项目 API 定义**:

```typescript
// src/api/maintainance.ts
import { http } from '@/http/alova'

export interface MaintainanceTask {
  id: string
  title: string
  status: string
  // ... 其他字段
}

export interface UpdateMaintainanceTaskReq {
  id: string
  status: string
  remark?: string
}

// 更新维修任务
export const updateMaintainanceTask = (data: UpdateMaintainanceTaskReq) =>
  http.Post<MaintainanceTask>('/api/maintainance/task', data)

// 查询维修任务列表
export const getMaintainanceTaskList = (params: {
  page: number
  pageSize: number
  status?: string
}) =>
  http.Get<{ list: MaintainanceTask[], total: number }>('/api/maintainance/tasks', {
    params
  })
```

#### 1.3 组件中的使用方式对比

**Vue2 项目组件使用**:

```vue
<script>
import { UpdateMaintainanceTask } from '@/api/maintainance/maintainance.js'

export default {
  data() {
    return {
      loading: false,
      taskList: []
    }
  },
  methods: {
    async updateTask(taskData) {
      this.loading = true
      try {
        const result = await UpdateMaintainanceTask(this, taskData)
        this.taskList = result.tasks
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
import { useRequest } from 'alova/client'
import { updateMaintainanceTask, getMaintainanceTaskList } from '@/api/maintainance'

// 获取任务列表
const {
  loading: listLoading,
  data: taskList,
  send: refreshList
} = useRequest(getMaintainanceTaskList({ page: 1, pageSize: 10 }), {
  immediate: true
})

// 更新任务
const {
  loading: updateLoading,
  send: sendUpdate
} = useRequest(updateMaintainanceTask, {
  immediate: false
})

const updateTask = async (taskData: UpdateMaintainanceTaskReq) => {
  try {
    await sendUpdate(taskData)
    uni.showToast({ title: '更新成功', icon: 'success' })
    await refreshList() // 刷新列表
  } catch (error) {
    console.error('更新失败', error)
  }
}
</script>
```

### 2. 认证机制迁移

#### 2.1 Vue2 项目认证方式

```javascript
// Java110Context 认证
hasSession().then((data) => {
  // 使用 cookie 方式
  _reqObj.header.cookie = '_java110_token_=' + uni.getStorageSync('token')
})

// 401 处理
if (_res.statusCode == 401) {
  uni.reLaunch({ url: '/pages/login/login' })
  return
}
```

#### 2.2 Vue3 项目认证方式

```typescript
// Alova Token 认证
const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication({
  refreshTokenOnError: {
    isExpired: (error) => error.response?.status === ResultEnum.Unauthorized,
    handler: async () => {
      // 自动刷新 token 或跳转登录
      await uni.reLaunch({ url: LOGIN_PAGE })
      throw error
    },
  },
})

// 请求拦截添加 token
beforeRequest: onAuthRequired((method) => {
  const token = getToken()
  if (token) {
    method.config.headers.Authorization = `Bearer ${token}`
  }
})
```

### 3. 迁移实施计划

#### 3.1 第一阶段：基础设施搭建（3-5天）

**任务清单**:

- [ ] 配置 Alova 实例，适配 Java110 后端接口规范
- [ ] 建立 TypeScript 类型定义体系
- [ ] 实现认证机制迁移 (Cookie → Token)
- [ ] 配置请求/响应拦截器
- [ ] 建立错误处理统一机制

**配置示例**:

```typescript
// src/http/java110-alova.ts
import { createAlova } from 'alova'
import AdapterUniapp from '@alova/adapter-uniapp'
import VueHook from 'alova/vue'

// Java110 响应数据结构
interface Java110Response<T = any> {
  code: string
  message: string
  data: T
}

const java110Alova = createAlova({
  baseURL: import.meta.env.VITE_JAVA110_BASE_URL,
  ...AdapterUniapp(),
  statesHook: VueHook,

  beforeRequest(method) {
    // 适配 Java110 请求头格式
    method.config.headers = {
      'Content-Type': 'application/json',
      'App-Id': 'your-app-id',
      'Transaction-Id': generateTransactionId(),
      'Req-Time': new Date().toISOString(),
      ...method.config.headers,
    }

    // 添加认证信息
    const token = uni.getStorageSync('java110_token')
    if (token) {
      method.config.headers.cookie = `_java110_token_=${token}`
    }
  },

  responded(response) {
    const { statusCode, data } = response

    if (statusCode !== 200) {
      throw new Error(`网络错误[${statusCode}]`)
    }

    const responseData = data as Java110Response

    // Java110 业务错误处理
    if (responseData.code !== '0000') {
      // 未登录处理
      if (responseData.code === '1001') {
        uni.reLaunch({ url: '/pages/login/login' })
      }
      throw new Error(`[${responseData.code}] ${responseData.message}`)
    }

    return responseData.data
  }
})

export { java110Alova }
```

#### 3.2 第二阶段：API 接口迁移（1-2周）

**迁移优先级**:

1. **核心认证接口**（1-2天）
   - 登录/登出接口
   - 会话验证接口
   - 用户信息获取接口

2. **工单管理接口**（3-4天）
   - 维修工单 CRUD 接口
   - 投诉处理接口
   - 工单流转接口

3. **巡检管理接口**（2-3天）
   - 巡检任务接口
   - 巡检记录接口
   - 巡检报告接口

4. **其他业务接口**（3-4天）
   - 通讯录接口
   - 公告管理接口
   - 文件上传下载接口

**迁移模板**:

```typescript
// 原 Vue2 接口
// api/maintainance/maintainance.js
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

// 迁移后 Vue3 接口
// src/api/maintainance.ts
export interface UpdateTaskRequest {
  taskId: string
  status: 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
  remark?: string
  images?: string[]
}

export interface TaskInfo {
  taskId: string
  title: string
  status: string
  createTime: string
  // ... 其他字段
}

export const updateMaintainanceTask = (data: UpdateTaskRequest) =>
  java110Alova.Post<TaskInfo>('/api/maintainance/updateTask', data, {
    meta: {
      toast: true, // 自动显示成功/失败提示
    }
  })

// 组件中使用
const { loading, send: updateTask } = useRequest(updateMaintainanceTask, {
  immediate: false
})
```

#### 3.3 第三阶段：数据状态管理迁移（3-5天）

**从手动状态管理到自动状态管理**:

```vue
<!-- Vue2 手动状态管理 -->
<script>
export default {
  data() {
    return {
      loading: false,
      error: null,
      taskList: [],
      refreshing: false
    }
  },
  async mounted() {
    await this.loadTasks()
  },
  methods: {
    async loadTasks() {
      this.loading = true
      this.error = null
      try {
        const result = await GetMaintainanceTaskList(this, {
          page: 1,
          pageSize: 20
        })
        this.taskList = result.tasks
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    async refreshTasks() {
      this.refreshing = true
      try {
        await this.loadTasks()
      } finally {
        this.refreshing = false
      }
    }
  }
}
</script>

<!-- Vue3 自动状态管理 -->
<script setup lang="ts">
// 列表查询 - 自动管理 loading 状态
const {
  loading,
  data: taskList,
  error,
  send: refreshTasks
} = useRequest(getMaintainanceTaskList({ page: 1, pageSize: 20 }), {
  immediate: true
})

// 分页查询
const {
  loading: loadingMore,
  send: loadMore
} = useRequest((page: number) =>
  getMaintainanceTaskList({ page, pageSize: 20 }), {
  immediate: false
})

// 下拉刷新
const {
  loading: refreshing,
  send: pullRefresh
} = useRequest(getMaintainanceTaskList({ page: 1, pageSize: 20 }), {
  immediate: false,
  force: true // 强制重新请求
})
</script>
```

### 4. 高级功能迁移

#### 4.1 文件上传迁移

**Vue2 文件上传**:

```javascript
// 原文件上传
uploadFile(filePath) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: url.uploadUrl,
      filePath: filePath,
      name: 'file',
      header: {
        cookie: '_java110_token_=' + uni.getStorageSync('token')
      },
      success: (res) => {
        resolve(JSON.parse(res.data))
      },
      fail: reject
    })
  })
}
```

**Vue3 文件上传**:

```typescript
// Alova 文件上传
export const uploadFile = (file: File | string) =>
  java110Alova.Post<{ fileId: string, url: string }>('/api/file/upload',
    { file },
    {
      meta: { requestType: 'upload' },
      // Alova 会自动处理文件上传
    }
  )

// 组件中使用
const { loading: uploading, send: upload } = useRequest(uploadFile, {
  immediate: false
})

const handleUpload = async (filePath: string) => {
  try {
    const result = await upload(filePath)
    console.log('上传成功', result)
  } catch (error) {
    console.error('上传失败', error)
  }
}
```

#### 4.2 实时数据同步

**利用 Alova 的缓存和状态同步**:

```typescript
// 设置缓存策略
export const getTaskDetail = (taskId: string) =>
  java110Alova.Get<TaskInfo>(`/api/maintainance/task/${taskId}`, {
    // 缓存策略
    localCache: 60 * 1000, // 1分钟本地缓存
    // 自动刷新
    enableDownload: true,
    // 数据同步
    sync: {
      query: ['task-list'], // 与列表数据同步
    }
  })

// 在组件中自动同步
const { data: taskDetail } = useRequest(getTaskDetail(taskId), {
  immediate: true
})

// 当任务详情更新时，自动同步到列表
const { send: updateTask } = useRequest(updateMaintainanceTask, {
  immediate: false,
  afterSuccess() {
    // 自动刷新相关数据
    refresh(['task-list', `task-detail-${taskId}`])
  }
})
```

### 5. 错误处理机制迁移

#### 5.1 统一错误处理

**Vue2 分散错误处理**:

```javascript
// 每个接口都需要手动处理错误
try {
  const result = await UpdateMaintainanceTask(this, data)
  // 成功处理
} catch (error) {
  // 手动错误处理
  uni.showToast({
    title: error.message || '操作失败',
    icon: 'none'
  })
}
```

**Vue3 统一错误处理**:

```typescript
// 全局错误处理配置
const java110Alova = createAlova({
  // ...其他配置
  responded(response, method) {
    const { config } = method
    const { statusCode, data } = response

    if (statusCode !== 200) {
      const errorMessage = getHttpErrorMessage(statusCode)
      // 自动显示错误提示
      if (config.meta?.toast !== false) {
        uni.showToast({
          title: errorMessage,
          icon: 'error'
        })
      }
      throw new Error(errorMessage)
    }

    const { code, message, data: responseData } = data
    if (code !== '0000') {
      // 自动显示业务错误提示
      if (config.meta?.toast !== false) {
        uni.showToast({
          title: message,
          icon: 'none'
        })
      }
      throw new Error(`[${code}] ${message}`)
    }

    return responseData
  }
})

// 组件中使用 - 自动错误处理
const { send: updateTask } = useRequest(updateMaintainanceTask, {
  immediate: false,
  // 成功后自动提示
  afterSuccess() {
    uni.showToast({
      title: '操作成功',
      icon: 'success'
    })
  }
})
```

### 6. 性能优化策略

#### 6.1 请求缓存和去重

```typescript
// 智能缓存配置
export const getUserInfo = () =>
  java110Alova.Get<UserInfo>('/api/user/info', {
    // 缓存策略
    localCache: 5 * 60 * 1000, // 5分钟本地缓存
    // 请求去重
    shareRequest: true,
    // 静默请求
    silent: true,
  })

// 分页数据缓存
export const getTaskList = (params: TaskListParams) =>
  java110Alova.Get<TaskListResponse>('/api/maintainance/tasks', {
    params,
    // 分页缓存
    localCache: {
      mode: 'placeholder', // 占位符模式
      expire: 2 * 60 * 1000, // 2分钟过期
    }
  })
```

#### 6.2 并发请求优化

```typescript
// Vue2 串行请求
async loadPageData() {
  this.loading = true
  try {
    const userInfo = await GetUserInfo(this)
    const taskList = await GetTaskList(this, { userId: userInfo.userId })
    const statistics = await GetStatistics(this, { userId: userInfo.userId })

    this.userInfo = userInfo
    this.taskList = taskList
    this.statistics = statistics
  } finally {
    this.loading = false
  }
}

// Vue3 并行请求
const {
  loading,
  data: [userInfo, taskList, statistics]
} = useRequest(() => Promise.all([
  getUserInfo(),
  getTaskList({ page: 1, pageSize: 10 }),
  getStatistics()
]), {
  immediate: true
})
```

### 7. 测试策略

#### 7.1 API 接口测试

```typescript
// api 单元测试
import { describe, it, expect, vi } from 'vitest'
import { updateMaintainanceTask } from '@/api/maintainance'

describe('维修任务 API', () => {
  it('应该能够更新维修任务', async () => {
    const mockData = {
      taskId: 'task-001',
      status: 'COMPLETED' as const,
      remark: '任务完成'
    }

    const result = await updateMaintainanceTask(mockData)

    expect(result).toBeDefined()
    expect(result.taskId).toBe(mockData.taskId)
    expect(result.status).toBe(mockData.status)
  })
})
```

#### 7.2 组件集成测试

```typescript
// 组件测试
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TaskList from '@/pages/task/TaskList.vue'

describe('TaskList 组件', () => {
  it('应该正确加载和显示任务列表', async () => {
    const wrapper = mount(TaskList)

    // 等待数据加载
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.task-item').exists()).toBe(true)
    expect(wrapper.findAll('.task-item')).toHaveLength(10)
  })
})
```

### 8. 迁移检查清单

#### 8.1 功能完整性检查

- [ ] **用户认证功能**
  - [ ] 登录/登出正常
  - [ ] Token 自动刷新
  - [ ] 权限验证正确

- [ ] **核心业务接口**
  - [ ] 维修工单 CRUD 操作
  - [ ] 投诉处理流程
  - [ ] 巡检任务管理
  - [ ] 文件上传下载

- [ ] **数据状态管理**
  - [ ] Loading 状态正确显示
  - [ ] 错误处理机制有效
  - [ ] 数据缓存策略合理

#### 8.2 性能指标检查

- [ ] **请求性能**
  - [ ] 平均响应时间 ≤ 原系统
  - [ ] 并发请求处理正确
  - [ ] 缓存命中率 ≥ 80%

- [ ] **用户体验**
  - [ ] 加载状态友好
  - [ ] 错误提示清晰
  - [ ] 操作反馈及时

#### 8.3 兼容性检查

- [ ] **平台兼容性**
  - [ ] H5 浏览器正常
  - [ ] 微信小程序正常
  - [ ] APP 平台正常

- [ ] **数据格式兼容**
  - [ ] 请求参数格式正确
  - [ ] 响应数据解析正确
  - [ ] 错误码处理一致

### 9. 回滚计划

#### 9.1 快速回滚方案

```typescript
// 兼容性适配器
class Java110CompatAdapter {
  // 保留原有的 Java110Context 接口
  static createCompatLayer() {
    return {
      post: (options: any) => {
        // 将原有接口调用转换为 Alova 调用
        return java110Alova.Post(options.url, options.data)
      },
      get: (options: any) => {
        return java110Alova.Get(options.url, { params: options.data })
      }
    }
  }
}

// 在迁移过程中提供兼容性支持
if (import.meta.env.VITE_USE_COMPAT_MODE) {
  Vue.prototype.context = Java110CompatAdapter.createCompatLayer()
}
```

### 10. 最佳实践建议

#### 10.1 代码组织

```typescript
// 推荐的 API 组织结构
src/api/
├── types/                    # 公共类型定义
│   ├── common.ts            # 通用类型
│   ├── user.ts              # 用户相关类型
│   └── task.ts              # 任务相关类型
├── modules/                  # 业务模块 API
│   ├── auth.ts              # 认证相关
│   ├── user.ts              # 用户管理
│   ├── maintainance.ts      # 维修管理
│   ├── complaint.ts         # 投诉管理
│   └── inspection.ts        # 巡检管理
├── utils/                    # API 工具
│   ├── request.ts           # 请求工具
│   └── cache.ts             # 缓存工具
└── index.ts                  # 统一导出
```

#### 10.2 类型安全

```typescript
// 严格的类型定义
export interface ApiResponse<T = any> {
  code: string
  message: string
  data: T
  timestamp: number
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
}

// 泛型 API 函数
export const createPaginatedApi = <T, P = any>(url: string) =>
  (params: PaginationParams & P) =>
    java110Alova.Get<PaginationResponse<T>>(url, { params })
```

---

## 总结

接口请求迁移是整个项目迁移的关键环节，通过合理的规划和实施，可以实现：

1. **技术升级**: 从传统请求方式升级到现代化请求管理
2. **开发效率提升**: 自动状态管理和类型检查
3. **用户体验改善**: 更好的加载状态和错误处理
4. **维护成本降低**: 统一的请求规范和错误处理机制

迁移过程中需要特别关注**业务逻辑一致性**、**数据格式兼容性**和**错误处理完整性**，确保迁移后的系统功能和用户体验不低于原系统。
