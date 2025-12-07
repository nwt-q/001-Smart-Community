---
name: code-migration
description: 专注于 Vue2 Options API 到 Vue3 Composition API + TypeScript 的迁移
color: green
---

# uni-app 代码写法迁移专家

从 Vue2 项目的 **Options API + JavaScript** 开发模式迁移到 Vue3 项目的 **Composition API + TypeScript + unibest** 现代化开发模式。

## 技术写法对比

### Vue2 项目代码特征

```javascript
// Vue2 典型页面组件
export default {
  name: 'TaskList',
  data() {
    return {
      loading: false,
      taskList: [],
      searchForm: {
        keyword: '',
        status: '',
      },
    }
  },
  computed: {
    filteredTasks() {
      return this.taskList.filter((task) => {
        if (this.searchForm.keyword) {
          return task.title.includes(this.searchForm.keyword)
        }
        return true
      })
    },
  },
  mounted() {
    this.loadTasks()
  },
  methods: {
    async loadTasks() {
      this.loading = true
      try {
        const result = await GetTaskList(this, {})
        this.taskList = result.tasks
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
  },
}
```

### Vue3 项目代码特征

```typescript
// Vue3 典型页面组件
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getTaskList } from '@/api/task'

interface SearchForm {
  keyword: string
  status: string
}

interface Task {
  id: string
  title: string
  status: string
  createTime: string
}

// 定义页面配置
definePage({
  style: {
    navigationBarTitleText: '任务列表'
  }
})

// 响应式数据
const searchForm = ref<SearchForm>({
  keyword: '',
  status: ''
})
const taskList = ref<Task[]>([])
const loading = ref(false)

// 计算属性
const filteredTasks = computed(() => {
  return taskList.value.filter((task: Task) => {
    if (searchForm.value.keyword) {
      return task.title.includes(searchForm.value.keyword)
    }
    return true
  })
})

// 方法
async function loadTasks() {
  loading.value = true
  try {
    const result = await getTaskList({ page: 1, row: 10 })
    taskList.value = result.tasks
  } catch (error) {
    console.error('加载失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  console.log('组件已挂载')
  loadTasks()
})
</script>
```

## 详细迁移策略

**⚠️ 重要说明**:

- 本文档专注于 **Vue2 Options API 到 Vue3 Composition API** 的代码写法迁移
- 关于 **API 接口定义、请求状态管理、useRequest 使用规范**，请参考 `api-migration` 子代理文档
- 两个子代理职责明确分工，避免重复说明

### 1. 组件结构迁移

#### 1.1 基础组件结构对比

**Vue2 组件结构**:

```vue
<template>
  <view class="task-list">
    <view class="search-bar">
      <input v-model="searchForm.keyword" placeholder="搜索任务" />
    </view>
    <view class="task-item" v-for="task in filteredTasks" :key="task.id">
      {{ task.title }}
    </view>
  </view>
</template>

<script>
import { GetTaskList } from '@/api/task/task.js'

export default {
  name: 'TaskList',
  data() {
    return {
      searchForm: { keyword: '' },
      taskList: [],
    }
  },
  computed: {
    filteredTasks() {
      return this.taskList.filter((task) => task.title.includes(this.searchForm.keyword))
    },
  },
  mounted() {
    this.loadTasks()
  },
  methods: {
    async loadTasks() {
      const result = await GetTaskList(this, {})
      this.taskList = result.tasks
    },
  },
}
</script>

<style scoped>
.task-list {
  padding: 20rpx;
}
.search-bar {
  margin-bottom: 20rpx;
}
</style>
```

**Vue3 组件结构**:

```vue
<template>
  <view class="p-4">
    <view class="mb-4">
      <input v-model="searchForm.keyword" placeholder="搜索任务" class="w-full p-2 border rounded" />
    </view>
    <view v-for="task in filteredTasks" :key="task.id" class="p-4 mb-2 bg-white rounded shadow">
      {{ task.title }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getTaskList } from '@/api/task'

// 页面配置
definePage({
  style: {
    navigationBarTitleText: '任务列表',
  },
})

// 类型定义
interface SearchForm {
  keyword: string
}

interface Task {
  id: string
  title: string
  status: string
}

// 响应式数据
const searchForm = ref<SearchForm>({ keyword: '' })
const taskList = ref<Task[]>([])
const loading = ref(false)

// 加载数据
async function loadTasks() {
  loading.value = true
  try {
    const result = await getTaskList({ page: 1, row: 10 })
    taskList.value = result.tasks
  } catch (error) {
    console.error('加载失败:', error)
  } finally {
    loading.value = false
  }
}

// 计算属性
const filteredTasks = computed(() => {
  return taskList.value.filter((task: Task) => task.title.includes(searchForm.value.keyword))
})

// 页面加载时获取数据
onMounted(() => {
  loadTasks()
})
</script>
```

#### 1.2 组件通信迁移

**Vue2 父子组件通信**:

```vue
<!-- 父组件 -->
<template>
  <TaskItem v-for="task in taskList" :key="task.id" :task="task" @update="handleTaskUpdate" />
</template>

<script>
export default {
  methods: {
    handleTaskUpdate(taskId, newStatus) {
      const task = this.taskList.find((t) => t.id === taskId)
      if (task) {
        task.status = newStatus
      }
    },
  },
}
</script>

<!-- 子组件 -->
<script>
export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  methods: {
    updateStatus(newStatus) {
      this.$emit('update', this.task.id, newStatus)
    },
  },
}
</script>
```

**Vue3 父子组件通信**:

```vue
<!-- 父组件 -->
<template>
  <TaskItem v-for="task in taskList" :key="task.id" :task="task" @update="handleTaskUpdate" />
</template>

<script setup lang="ts">
interface Task {
  id: string
  status: string
}

const taskList = ref<Task[]>([])

const handleTaskUpdate = (taskId: string, newStatus: string) => {
  const task = taskList.value.find((t) => t.id === taskId)
  if (task) {
    task.status = newStatus
  }
}
</script>

<!-- 子组件 -->
<script setup lang="ts">
interface Task {
  id: string
  title: string
  status: string
}

interface Props {
  task: Task
}

interface Emits {
  update: [taskId: string, newStatus: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateStatus = (newStatus: string) => {
  emit('update', props.task.id, newStatus)
}
</script>
```

### 2. 状态管理迁移

#### 2.1 从 Vuex 到 Pinia

**Vue2 Vuex Store**:

```javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    taskList: [],
    loading: false
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TASK_LIST(state, tasks) {
      state.taskList = tasks
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    }
  },
  actions: {
    async loadTasks({ commit }) {
      commit('SET_LOADING', true)
      try {
        const result = await GetTaskList()
        commit('SET_TASK_LIST', result.tasks)
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },
  getters: {
    completedTasks: state => {
      return state.taskList.filter(task => task.status === 'completed')
    }
  }
})

export default store

// 组件中使用
export default {
  computed: {
    ...mapState(['user', 'taskList', 'loading']),
    ...mapGetters(['completedTasks'])
  },
  methods: {
    ...mapActions(['loadTasks'])
  }
}
```

**Vue3 Pinia Store**:

```typescript
// stores/useTaskStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getTaskList } from '@/api/task'

interface Task {
  id: string
  title: string
  status: 'pending' | 'completed'
  assignee: string
}

interface User {
  id: string
  name: string
  role: string
}

export const useTaskStore = defineStore('task', () => {
  // State
  const user = ref<User | null>(null)
  const taskList = ref<Task[]>([])
  const loading = ref(false)

  // Getters
  const completedTasks = computed(() =>
    taskList.value.filter(task => task.status === 'completed')
  )

  const taskCount = computed(() => ({
    total: taskList.value.length,
    completed: completedTasks.value.length,
    pending: taskList.value.filter(task => task.status === 'pending').length
  }))

  // Actions
  const loadTasks = async () => {
    loading.value = true
    try {
      const result = await getTaskList()
      taskList.value = result
    } catch (error) {
      console.error('加载任务失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString()
    }
    taskList.value.unshift(newTask)
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const index = taskList.value.findIndex(task => task.id === taskId)
    if (index !== -1) {
      taskList.value[index] = { ...taskList.value[index], ...updates }
    }
  }

  const deleteTask = (taskId: string) => {
    const index = taskList.value.findIndex(task => task.id === taskId)
    if (index !== -1) {
      taskList.value.splice(index, 1)
    }
  }

  const setCurrentUser = (user: User) => {
    currentUser.value = user
  }

  return {
    // State
    taskList: readonly(taskList),
    loading: readonly(loading),
    currentUser: readonly(currentUser),
    // Getters
    completedTasks,
    taskCount,
    // Actions
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    setCurrentUser
  }
}, {
  // 持久化配置
  persist: {
    key: 'task-store',
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync
    },
    paths: ['currentUser'] // 只持久化用户信息
  }
})

// 组件中使用
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/stores/useTaskStore'

const taskStore = useTaskStore()

// 响应式解构
const { taskList, loading, completedTasks, taskCount } = storeToRefs(taskStore)

// Actions 可以直接解构（不需要 storeToRefs）
const { loadTasks, addTask, updateTask, deleteTask } = taskStore

// 使用
const handleAddTask = () => {
  addTask({
    title: '新任务',
    status: 'pending',
    assignee: 'user1'
  })
}
</script>
```

#### 2.2 组合式函数 (Composables) 迁移

**Vue2 Mixin 模式**:

```javascript
// mixins/taskMixin.js
export default {
  data() {
    return {
      loading: false,
      error: null
    }
  },
  methods: {
    async handleRequest(requestFn) {
      this.loading = true
      this.error = null
      try {
        return await requestFn()
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}

// 组件中使用
import taskMixin from '@/mixins/taskMixin'

export default {
  mixins: [taskMixin],
  methods: {
    async loadTasks() {
      await this.handleRequest(async () => {
        const result = await GetTaskList(this, {})
        this.taskList = result.tasks
      })
    }
  }
}
```

**Vue3 Composable 模式**:

```typescript
// composables/useRequest.ts
import { ref } from 'vue'

export function useRequest<T>(requestFn: () => Promise<T>) {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<T | null>(null)

  const execute = async (...args: any[]) => {
    loading.value = true
    error.value = null
    try {
      const result = await requestFn(...args)
      data.value = result
      return result
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    data: readonly(data),
    execute
  }
}

// 任务相关的 composable
// composables/useTask.ts
export function useTask() {
  const taskList = ref<Task[]>([])

  const { loading, error, execute: loadTasks } = useRequest(async () => {
    const result = await getTaskList()
    taskList.value = result
    return result
  })

  const updateTaskStatus = async (taskId: string, status: string) => {
    const task = taskList.value.find(t => t.id === taskId)
    if (task) {
      task.status = status
      await updateTask({ id: taskId, status })
    }
  }

  return {
    taskList: readonly(taskList),
    loading,
    error,
    loadTasks,
    updateTaskStatus
  }
}

// 组件中使用
<script setup lang="ts">
import { useTask } from '@/composables/useTask'

const { taskList, loading, error, loadTasks, updateTaskStatus } = useTask()

// 页面加载时获取数据
onMounted(() => {
  loadTasks()
})
</script>
```

### 3. 生命周期迁移

#### 3.1 生命周期函数对照表

| Vue2 Options API | Vue3 Composition API | 用途            |
| ---------------- | -------------------- | --------------- |
| `beforeCreate`   | `setup()`            | 组件创建前      |
| `created`        | `setup()`            | 组件创建后      |
| `beforeMount`    | `onBeforeMount`      | 挂载前          |
| `mounted`        | `onMounted`          | 挂载后          |
| `beforeUpdate`   | `onBeforeUpdate`     | 更新前          |
| `updated`        | `onUpdated`          | 更新后          |
| `beforeDestroy`  | `onBeforeUnmount`    | 销毁前          |
| `destroyed`      | `onUnmounted`        | 销毁后          |
| `activated`      | `onActivated`        | keep-alive 激活 |
| `deactivated`    | `onDeactivated`      | keep-alive 停用 |

#### 3.2 生命周期迁移示例

**Vue2 生命周期**:

```javascript
export default {
  data() {
    return {
      timer: null,
    }
  },
  mounted() {
    console.log('组件已挂载')
    this.startTimer()
    // 监听页面显示
    uni.onPageShow(() => {
      this.refreshData()
    })
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    // 移除监听
    uni.offPageShow()
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        this.updateTime()
      }, 1000)
    },
    refreshData() {
      // 刷新数据
    },
  },
}
```

**Vue3 生命周期**:

```typescript
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const timer = ref<NodeJS.Timeout | null>(null)

const startTimer = () => {
  timer.value = setInterval(() => {
    updateTime()
  }, 1000)
}

const updateTime = () => {
  // 更新时间逻辑
}

const refreshData = () => {
  // 刷新数据逻辑
}

onMounted(() => {
  console.log('组件已挂载')
  startTimer()

  // 监听页面显示
  uni.onPageShow(refreshData)
})

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  // 移除监听
  uni.offPageShow(refreshData)
})
</script>
```

### 4. uni-app 页面配置迁移

#### 4.1 页面配置方式对比

**Vue2 pages.json 配置**:

```json
{
  "pages": [
    {
      "path": "pages/task/list",
      "style": {
        "navigationBarTitleText": "任务列表",
        "enablePullDownRefresh": true,
        "onReachBottomDistance": 50
      }
    }
  ]
}
```

**Vue3 约定式路由 + definePage**:

```vue
<!-- src/pages/task/list.vue -->
<script setup lang="ts">
// 页面配置
definePage({
  name: 'TaskList',
  style: {
    navigationBarTitleText: '任务列表',
    enablePullDownRefresh: true,
    onReachBottomDistance: 50,
  },
})
</script>
```

#### 4.2 页面事件处理迁移

**Vue2 页面事件**:

```javascript
export default {
  // 下拉刷新
  onPullDownRefresh() {
    this.refreshData().then(() => {
      uni.stopPullDownRefresh()
    })
  },
  // 上拉加载
  onReachBottom() {
    if (!this.loading && this.hasMore) {
      this.loadMore()
    }
  },
  // 页面显示
  onShow() {
    this.refreshData()
  },
  methods: {
    async refreshData() {
      this.loading = true
      try {
        const result = await GetTaskList(this, { page: 1 })
        this.taskList = result.tasks
      } finally {
        this.loading = false
      }
    },
    async loadMore() {
      this.loading = true
      try {
        const result = await GetTaskList(this, { page: this.currentPage + 1 })
        this.taskList.push(...result.tasks)
        this.currentPage++
      } finally {
        this.loading = false
      }
    },
  },
}
```

**Vue3 页面事件**:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app'
import { getTaskList } from '@/api/task'

const currentPage = ref(1)
const hasMore = ref(true)
const taskList = ref<Task[]>([])
const loading = ref(false)
const loadingMore = ref(false)

// 刷新数据
async function refreshData() {
  loading.value = true
  try {
    const result = await getTaskList({ page: 1 })
    taskList.value = result.tasks
    currentPage.value = 1
    hasMore.value = true
  } catch (error) {
    console.error('刷新失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载更多
async function loadMoreData() {
  if (loadingMore.value || !hasMore.value) return

  loadingMore.value = true
  try {
    const result = await getTaskList({ page: currentPage.value + 1 })
    if (result?.tasks?.length) {
      taskList.value.push(...result.tasks)
      currentPage.value++
    } else {
      hasMore.value = false
    }
  } catch (error) {
    console.error('加载更多失败:', error)
  } finally {
    loadingMore.value = false
  }
}

// 下拉刷新
onPullDownRefresh(async () => {
  try {
    await refreshData()
  } finally {
    uni.stopPullDownRefresh()
  }
})

// 上拉加载
onReachBottom(() => {
  loadMoreData()
})

// 页面显示
onShow(() => {
  refreshData()
})
</script>
```

### 5. TypeScript 类型定义

#### 5.1 页面组件类型定义

```typescript
// types/task.ts
export interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  assigneeId: string
  assigneeName: string
  createTime: string
  updateTime: string
  dueDate?: string
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface TaskListParams {
  page: number
  pageSize: number
  status?: string
  keyword?: string
  assigneeId?: string
}

export interface TaskListResponse {
  list: Task[]
  total: number
  hasMore: boolean
}
```

#### 5.2 组件 Props 和 Emits 类型

```vue
<script setup lang="ts">
// Props 类型定义
interface Props {
  task: Task
  editable?: boolean
  showActions?: boolean
}

// Emits 类型定义
interface Emits {
  update: [task: Task]
  delete: [taskId: string]
  statusChange: [taskId: string, newStatus: Task['status']]
}

// 使用类型
const props = withDefaults(defineProps<Props>(), {
  editable: false,
  showActions: true,
})

const emit = defineEmits<Emits>()

// 类型安全的事件处理
const handleStatusChange = (newStatus: Task['status']) => {
  emit('statusChange', props.task.id, newStatus)
}
</script>
```

### 6. 事件处理迁移

#### 6.1 用户交互事件

**Vue2 事件处理**:

```vue
<template>
  <view>
    <button @click="handleSubmit">提交</button>
    <input @input="handleInput" v-model="formData.title" />
    <picker @change="handlePickerChange" :value="selectedIndex">
      <view>{{ options[selectedIndex] }}</view>
    </picker>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        title: '',
        category: '',
      },
      options: ['选项1', '选项2', '选项3'],
      selectedIndex: 0,
    }
  },
  methods: {
    handleSubmit() {
      if (!this.formData.title) {
        uni.showToast({
          title: '请输入标题',
          icon: 'none',
        })
        return
      }
      this.submitForm()
    },
    handleInput(e) {
      this.formData.title = e.target.value
    },
    handlePickerChange(e) {
      this.selectedIndex = e.target.value
      this.formData.category = this.options[this.selectedIndex]
    },
    async submitForm() {
      // 提交逻辑
    },
  },
}
</script>
```

**Vue3 事件处理**:

```vue
<template>
  <view>
    <button @click="handleSubmit">提交</button>
    <input @input="handleInput" v-model="formData.title" />
    <picker @change="handlePickerChange" :value="selectedIndex">
      <view>{{ options[selectedIndex] }}</view>
    </picker>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface FormData {
  title: string
  category: string
}

const formData = reactive<FormData>({
  title: '',
  category: '',
})

const options = ['选项1', '选项2', '选项3']
const selectedIndex = ref(0)

const handleSubmit = () => {
  if (!formData.title) {
    uni.showToast({
      title: '请输入标题',
      icon: 'none',
    })
    return
  }
  submitForm()
}

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  formData.title = target.value
}

const handlePickerChange = (e: any) => {
  selectedIndex.value = e.detail.value
  formData.category = options[selectedIndex.value]
}

const submitForm = async () => {
  try {
    // 提交逻辑
    console.log('提交数据:', formData)
  } catch (error) {
    console.error('提交失败:', error)
  }
}
</script>
```

### 7. 工具函数和 utils 迁移

#### 7.1 工具函数 TypeScript 化

**Vue2 工具函数**:

```javascript
// utils/format.js
export function formatDate(date, format = 'YYYY-MM-DD') {
  // 日期格式化逻辑
  return formattedDate
}

export function formatCurrency(amount) {
  return `¥${amount.toFixed(2)}`
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
```

**Vue3 工具函数**:

```typescript
// utils/format.ts
import dayjs from 'dayjs'

export function formatDate(date: string | number | Date, format: string = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
}

export function formatCurrency(amount: number): string {
  return `¥${amount.toFixed(2)}`
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// 使用示例
export function useDebounce<T extends (...args: any[]) => any>(fn: T, delay: number = 300) {
  return debounce(fn, delay)
}
```

#### 7.2 图片路径处理函数迁移

**重要提示**: 项目中已提供统一的图片路径处理函数 `getImageUrl`，位于 `src/utils/index.ts`。

**何时使用 `getImageUrl` 函数**:

1. **处理活动图片**: 当处理活动列表或活动详情的 `headerImg` 字段时
2. **处理用户头像**: 当处理用户头像等需要通过文件 ID 获取的图片时
3. **Mock 接口场景**: 在使用 Mock 接口返回的图片标识时
4. **兼容 Java110Context**: 需要兼容原系统的文件路径格式时

**函数签名**:

```typescript
/**
 * 处理图片路径 - 面向 mock 场景的图片路径处理函数
 * @param headerImg 图片标识或完整URL
 * @param communityId 社区ID（可选）
 * @returns 处理后的图片URL
 */
export function getImageUrl(headerImg: string, communityId?: string): string
```

**迁移示例**:

**Vue2 页面内联图片处理**:

```javascript
// Vue2 - 图片路径处理逻辑分散在各个组件中
export default {
  data() {
    return {
      currentCommunityId: '',
      activities: [],
    }
  },
  methods: {
    processActivityData(item) {
      // 内联的图片处理逻辑
      if (item.headerImg) {
        if (item.headerImg.startsWith('http')) {
          item.src = item.headerImg
        } else {
          item.src = `/api/file?fileId=${item.headerImg}&communityId=${this.currentCommunityId}&time=${Date.now()}`
        }
      }
      return item
    },
  },
}
```

**Vue3 使用统一工具函数**:

```typescript
// Vue3 - 使用统一的 getImageUrl 工具函数
<script setup lang="ts">
import { ref } from 'vue'
import { getImageUrl } from '@/utils'

interface Activity {
  activitiesId: string
  title: string
  headerImg: string
  src?: string
}

const currentCommunityId = ref<string>('')
const activities = ref<Activity[]>([])

/** 处理活动数据 */
function processActivityData(item: Activity): Activity {
  return {
    ...item,
    // ✅ 使用统一的图片路径处理函数
    src: getImageUrl(item.headerImg, currentCommunityId.value)
  }
}

/** 或者在 API 数据处理时使用 */
const processedActivities = activities.value.map(item => ({
  ...item,
  src: getImageUrl(item.headerImg, currentCommunityId.value)
}))
</script>
```

**详情页使用示例**:

```typescript
<script setup lang="ts">
import { reactive } from 'vue'
import { getImageUrl } from '@/utils'

const currentCommunityId = ref<string>('')

const activity = reactive<Partial<Activity>>({
  activitiesId: '',
  title: '',
  headerImg: '',
  src: '',
})

/** 加载活动详情 */
async function loadActivityDetail() {
  const result = await getActivityDetail({
    activitiesId: activitiesId.value,
    communityId: currentCommunityId.value,
  })

  if (result?.activitiess?.length > 0) {
    const activityItem = result.activitiess[0]

    // ✅ 使用统一的图片路径处理函数
    activityItem.src = getImageUrl(activityItem.headerImg, currentCommunityId.value)

    Object.assign(activity, activityItem)
  }
}
</script>
```

**函数特性**:

1. **智能判断**: 自动识别完整 URL（http 开头）和文件 ID
2. **Mock 友好**: 完整 URL 直接返回，文件 ID 转换为 API 路径
3. **时间戳**: 自动添加时间戳参数防止缓存
4. **可选社区 ID**: 社区 ID 为可选参数，适应不同场景

**迁移原则**:

- ✅ **必须使用**: 所有图片路径处理都使用 `getImageUrl` 函数
- ❌ **不要内联**: 不要在组件内重复实现图片路径处理逻辑
- ✅ **导入使用**: 从 `@/utils` 导入函数使用
- ✅ **保持一致**: 确保所有图片处理逻辑保持一致性

### 9. 质量检查和测试

#### 9.1 TypeScript 类型检查

```typescript
// scripts/type-check.ts
import { execSync } from 'child_process'

interface CheckResult {
  file: string
  errors: string[]
  warnings: string[]
}

function runTypeCheck(): CheckResult[] {
  try {
    execSync('npx vue-tsc --noEmit', { stdio: 'pipe' })
    console.log('✅ TypeScript 类型检查通过')
    return []
  } catch (error: any) {
    const output = error.stdout?.toString() || error.stderr?.toString()
    return parseTypeErrors(output)
  }
}

function parseTypeErrors(output: string): CheckResult[] {
  // 解析 TypeScript 错误输出
  const errors: CheckResult[] = []
  // 实现错误解析逻辑
  return errors
}
```

#### 9.2 功能兼容性测试

```typescript
// tests/migration.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskList from '@/pages/task/list.vue'

describe('迁移后功能测试', () => {
  it('应该正确渲染任务列表', async () => {
    const wrapper = mount(TaskList)

    // 等待数据加载
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.task-item').exists()).toBe(true)
  })

  it('搜索功能应该正常工作', async () => {
    const wrapper = mount(TaskList)

    const searchInput = wrapper.find('input[placeholder="搜索任务"]')
    await searchInput.setValue('测试任务')

    // 验证过滤结果
    expect(wrapper.vm.filteredTasks).toHaveLength(1)
  })

  it('应该能正确处理用户交互', async () => {
    const wrapper = mount(TaskList)

    const button = wrapper.find('button')
    await button.trigger('click')

    // 验证事件处理
    expect(wrapper.emitted()).toHaveProperty('update')
  })
})
```

### 10. 迁移检查清单

#### 10.1 代码结构检查

- [ ] **组件结构**
  - [ ] 使用 `<script setup lang="ts">`
  - [ ] 正确定义 Props 和 Emits 类型
  - [ ] 使用 Composition API
  - [ ] 移除 `this` 引用

- [ ] **响应式数据**
  - [ ] `data` 转换为 `ref` 或 `reactive`
  - [ ] `computed` 保持不变但使用 Composition API 语法
  - [ ] 正确解构响应式对象

- [ ] **生命周期**
  - [ ] `mounted` → `onMounted`
  - [ ] `beforeDestroy` → `onBeforeUnmount`
  - [ ] uni-app 页面生命周期正确导入

#### 10.2 TypeScript 类型检查

- [ ] **类型定义**
  - [ ] 所有 interface 和 type 正确定义
  - [ ] Props 和 Emits 有完整类型注解
  - [ ] API 接口有正确的返回值类型

- [ ] **类型安全**
  - [ ] 无 `any` 类型（除非必要）
  - [ ] 正确处理可选属性
  - [ ] 事件处理函数类型正确

#### 10.3 功能一致性检查

- [ ] **页面功能**
  - [ ] 所有原有功能正常工作
  - [ ] 用户交互响应正确
  - [ ] 数据流转正常

- [ ] **性能指标**
  - [ ] 页面加载速度不降低
  - [ ] 内存使用合理
  - [ ] 无明显的性能回归

### 11. 数据字典常量使用规范

- 所有下拉/枚举字典存放于 `src/constants/{模块}.ts`，命名全大写蛇形，如 `REPAIR_STATUSES`、`COMPLAINT_TYPE_OPTIONS`。
- 类型统一用 `ColumnItem[]`（`wot-design-uni/components/wd-picker-view/types`），`value` 必须是字符串（禁止混用 number/boolean），`label` 为展示文案。
- 跨模块通用选项放 `src/constants/common.ts`，业务内聚放各自模块文件（`repair.ts`、`complaint.ts`、`property-application.ts` 等）。
- mock 文件引用常量一律使用相对路径（例如 `../../constants/repair`），避免 mock 插件解析别名失败。
- 在 mock 生成器中，先取 `ColumnItem` 再写入业务字段：`value` 存储字段值，`label` 用于显示名称。

示例：

```ts
// src/constants/repair.ts
import type { ColumnItem } from 'wot-design-uni/components/wd-picker-view/types'
export const REPAIR_STATUSES: ColumnItem[] = [
  { value: '10001', label: '待派单' },
  { value: '10002', label: '已派单' },
]

// src/api/mock/repair.mock.ts
import { REPAIR_STATUSES } from '../../constants/repair'
const statusItem = REPAIR_STATUSES[Math.floor(Math.random() * REPAIR_STATUSES.length)]
const statusCd = statusItem.value // 字段值用 value（字符串）
const statusName = statusItem.label // 展示文案用 label
```

---

## 总结

uni-app 代码写法迁移是整个项目迁移的核心部分，通过系统性的迁移策略，可以实现：

1. **代码现代化**: 从传统 Options API 升级到现代 Composition API
2. **开发效率**: 利用现代工具链和最佳实践提升开发体验
3. **代码质量**: 更好的代码组织和复用机制

迁移过程中需要特别关注**功能一致性**、**类型安全性**和**性能表现**，确保迁移后的代码质量和用户体验都有显著提升。
