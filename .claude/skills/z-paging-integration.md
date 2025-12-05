---
name: z-paging-integration
description: z-paging 分页组件与 api-migration 适配方案 - 提供 z-paging 与 useRequest 回调钩子模式的正确集成方式
---

# z-paging 分页组件集成方案

## 1. 适用场景

当页面需要使用 `<z-paging>` 组件实现分页列表功能，同时需要遵循 `api-migration` 规范使用 `useRequest` 管理接口请求时，必须使用本 Skill 中的集成方案。

## 2. 核心约束

### 2.1 api-migration 规范要求

1. **必须使用 useRequest**：所有接口调用都必须通过 Alova 的 `useRequest` 管理状态
2. **必须设置 immediate: false**：禁止自动执行请求，必须手动触发
3. **必须使用回调钩子**：使用 `onSuccess`、`onError`、`onComplete` 处理请求结果
4. **禁止使用 try/catch**：不允许使用 try/catch 包装 send 函数调用

### 2.2 z-paging 核心机制

|     方法     |        用途        |                       调用时机                        |
| :----------: | :----------------: | :---------------------------------------------------: |
|   `@query`   | 接收分页参数并请求 | z-paging 自动调用（组件挂载时、下拉刷新、上拉加载时） |
| `complete()` |  通知数据加载完成  |                 请求成功或失败后调用                  |
|  `reload()`  |    重新加载数据    |      筛选条件变化、手动刷新时调用，重置到第 1 页      |

## 3. 标准集成方案

### 3.1 核心代码模板

```vue
<template>
  <z-paging ref="pagingRef" v-model="dataList" :default-page-size="15" @query="handleQuery">
    <view v-for="item in dataList" :key="item.id">
      {{ item.name }}
    </view>

    <template #empty>
      <wd-status-tip image="search" tip="暂无数据" />
    </template>
  </z-paging>
</template>

<script setup lang="ts">
import type { YourDataType, YourListParams } from '@/types/your-module'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { getYourDataList } from '@/api/your-module'

/** z-paging 组件引用 */
const pagingRef = ref()

/** 列表数据 */
const dataList = ref<YourDataType[]>([])

/**
 * 使用 useRequest 管理请求状态
 * @description 必须设置 immediate: false，由 z-paging 控制请求时机
 */
const {
  loading,
  send: loadList,
  onSuccess,
  onError,
} = useRequest((params: YourListParams) => getYourDataList(params), { immediate: false })

/**
 * 成功回调 - 通知 z-paging 数据加载完成
 * @description 在回调中调用 complete 方法
 */
onSuccess((event) => {
  const result = event.data
  // 方式一：传入列表，z-paging 自动判断是否有更多
  pagingRef.value?.complete(result.list || [])

  // 方式二：精确控制（如果后端返回 total）
  // pagingRef.value?.completeByTotal(result.list || [], result.total)
})

/**
 * 失败回调 - 通知 z-paging 加载失败
 * @description 错误提示已由全局拦截器自动处理
 */
onError((error) => {
  console.error('加载列表失败:', error)
  pagingRef.value?.complete(false)
})

/**
 * z-paging 的 @query 回调
 * @description 接收分页参数，触发请求（不使用 await/try-catch）
 */
function handleQuery(pageNo: number, pageSize: number) {
  loadList({
    page: pageNo,
    row: pageSize,
    // 其他筛选参数...
  })
}

/** 手动刷新列表 */
function handleRefresh() {
  pagingRef.value?.reload()
}
</script>
```

### 3.2 带筛选条件的完整示例

```vue
<template>
  <view class="page-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <wd-search v-model="searchKeyword" placeholder="搜索..." @search="handleSearch" />
      <wd-button type="primary" size="small" @click="handleSearch"> 搜索 </wd-button>
    </view>

    <!-- 列表 -->
    <z-paging ref="pagingRef" v-model="dataList" :default-page-size="15" @query="handleQuery">
      <view v-for="item in dataList" :key="item.id" class="list-item">
        {{ item.title }}
      </view>

      <template #empty>
        <wd-status-tip image="search" tip="暂无数据" />
      </template>
    </z-paging>
  </view>
</template>

<script setup lang="ts">
import type { RepairOrder, RepairListParams } from '@/types/repair'
import { useRequest } from 'alova/client'
import { ref } from 'vue'
import { getRepairOrderList } from '@/api/repair'

/** z-paging 组件引用 */
const pagingRef = ref()

/** 列表数据 */
const dataList = ref<RepairOrder[]>([])

/** 搜索条件 */
const searchKeyword = ref('')
const selectedStatus = ref('')

/**
 * 使用 useRequest 管理请求状态
 */
const {
  loading,
  send: loadList,
  onSuccess,
  onError,
} = useRequest((params: RepairListParams) => getRepairOrderList(params), { immediate: false })

/** 成功回调 */
onSuccess((event) => {
  const result = event.data
  pagingRef.value?.complete(result.ownerRepairs || [])
})

/** 失败回调 */
onError((error) => {
  console.error('加载列表失败:', error)
  pagingRef.value?.complete(false)
})

/**
 * z-paging 的 @query 回调
 * @description 将筛选条件合并到请求参数中
 */
function handleQuery(pageNo: number, pageSize: number) {
  loadList({
    page: pageNo,
    row: pageSize,
    repairName: searchKeyword.value || undefined,
    state: selectedStatus.value || undefined,
  })
}

/**
 * 搜索处理
 * @description 重置到第一页并刷新
 */
function handleSearch() {
  pagingRef.value?.reload()
}

/**
 * 筛选条件变化
 */
function handleFilterChange() {
  pagingRef.value?.reload()
}
</script>
```

## 4. 关键适配点

### 4.1 不使用 await/try-catch

```typescript
// 错误：使用 try-catch（违反 api-migration 规范）
async function handleQuery(pageNo: number, pageSize: number) {
  try {
    const result = await loadList({ page: pageNo, row: pageSize })
    pagingRef.value?.complete(result.list)
  } catch {
    pagingRef.value?.complete(false)
  }
}

// 正确：使用回调钩子
function handleQuery(pageNo: number, pageSize: number) {
  loadList({ page: pageNo, row: pageSize })
  // complete 在 onSuccess/onError 回调中调用
}
```

### 4.2 在回调中调用 complete

```typescript
// onSuccess 中处理成功
onSuccess((event) => {
  pagingRef.value?.complete(event.data.list || [])
})

// onError 中处理失败
onError((error) => {
  console.error('加载失败:', error)
  pagingRef.value?.complete(false)
})
```

### 4.3 确保 pagingRef 可用性

由于回调是异步执行的，需要使用可选链确保安全调用：

```typescript
onSuccess((event) => {
  // 使用可选链确保安全调用
  pagingRef.value?.complete(event.data.list || [])
})
```

## 5. complete 方法详解

|             调用方式             |                          说明                           |
| :------------------------------: | :-----------------------------------------------------: |
|         `complete(list)`         | 传入数组，z-paging 根据数组长度自动判断是否还有更多数据 |
|        `complete(false)`         |                     加载失败时调用                      |
|  `completeByTotal(list, total)`  |           传入数组和总数，更精确控制分页状态            |
| `completeByNoMore(list, noMore)` |             传入数组和是否没有更多的布尔值              |

## 6. 常见错误模式

|             错误模式             |                  原因                  |              正确做法               |
| :------------------------------: | :------------------------------------: | :---------------------------------: |
|    在 @query 中使用 try/catch    | 违反 api-migration 禁止 try/catch 规范 |     使用 onSuccess/onError 回调     |
| 在 @query 中直接调用 uni.request |       未使用 useRequest 管理状态       |    使用 useRequest 的 send 方法     |
|      手动管理 loading 状态       |         useRequest 已自动管理          | 直接使用 useRequest 的 loading 状态 |
|  在 onError 中重复显示错误提示   |          全局拦截器已自动处理          |  仅记录日志和调用 complete(false)   |

## 7. immediate: false 必要性

由于 z-paging 会在组件挂载时自动触发 `@query` 事件，因此 `useRequest` 必须设置 `immediate: false`，避免重复请求：

```typescript
const { send: loadList } = useRequest(
  (params) => getDataList(params),
  { immediate: false }, // 必须设置，由 z-paging 控制请求时机
)
```

## 8. z-paging 的 auto 属性

如果设置 `:auto="false"`，z-paging 不会在挂载时自动触发 `@query`，需要手动调用 `reload()`：

```typescript
onMounted(() => {
  // 手动触发首次加载
  setTimeout(() => {
    pagingRef.value?.reload()
  }, 100)
})
```

## 9. 适配核心原则总结

1. **使用 useRequest 管理请求**：符合 api-migration 规范
2. **在回调钩子中调用 complete**：将 z-paging 的完成通知放在 onSuccess/onError 中
3. **不使用 try/catch**：遵循回调钩子模式
4. **保持职责分离**：错误提示由全局拦截器处理，组件层仅负责日志和 UI 状态
