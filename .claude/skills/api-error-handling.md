---
name: api-error-handling
description: 接口错误提示能力 - 提供统一的接口错误提示标准和实施方案，基于 wot-design-uni 和 Alova useRequest 回调模式
---

# 接口错误提示能力

## 1. 核心架构约束

本项目接口请求遵循以下强制规范：

1. **必须使用 useRequest**：所有接口调用都必须通过 Alova 的 `useRequest` 管理状态
2. **必须设置 immediate: false**：禁止自动执行请求，必须手动触发
3. **必须使用回调钩子**：使用 `onSuccess`、`onError`、`onComplete` 处理请求结果
4. **禁止使用 try/catch**：不允许使用 try/catch 包装 send 函数调用

## 2. 双层错误处理机制

|      层级      |         职责         |            实现位置            |
| :------------: | :------------------: | :----------------------------: |
| **全局拦截层** | 自动错误提示（默认） | `src/http/alova.ts` responded  |
| **组件回调层** |  日志记录、状态恢复  | useRequest 的 onError 回调钩子 |

## 3. 错误级别定义

|   级别    |        错误类型        |         处理方式          |          示例          |
| :-------: | :--------------------: | :-----------------------: | :--------------------: |
| L1 - 致命 |  认证过期、服务器宕机  |  Message 弹框 + 跳转处理  | 登录已过期，请重新登录 |
| L2 - 严重 |  权限不足、数据不存在  | Toast 错误提示 + 交互指导 |  您没有权限执行此操作  |
| L3 - 一般 | 业务逻辑错误、参数错误 |      Toast 错误提示       |    手机号格式不正确    |
| L4 - 轻微 |     网络波动、超时     |  Toast 警告提示（短暂）   |  网络异常，请稍后重试  |

## 4. 核心工具类

### 4.1 ApiErrorHandler 工具类

```typescript
// src/utils/api-error-handler.ts
import { useGlobalToast } from '@/hooks/useGlobalToast'

/** 错误级别枚举 */
export enum ErrorLevel {
  FATAL = 'fatal',
  SEVERE = 'severe',
  NORMAL = 'normal',
  LIGHT = 'light',
}

/** API 错误信息接口 */
export interface ApiErrorInfo {
  level: ErrorLevel
  message: string
  code?: number | string
}

/**
 * API 错误处理器
 * @description 统一的接口错误提示处理工具，供全局拦截器和组件层使用
 */
export class ApiErrorHandler {
  /**
   * 统一错误处理入口
   * @example ApiErrorHandler.handle({ level: ErrorLevel.NORMAL, message: '操作失败' })
   */
  static handle(error: ApiErrorInfo, options: { shouldShowError?: boolean } = {}): void {
    const { shouldShowError = true } = options
    if (!shouldShowError) return

    const toast = useGlobalToast()

    switch (error.level) {
      case ErrorLevel.FATAL:
        uni.showModal({
          title: '系统错误',
          content: error.message,
          showCancel: false,
          success: () => uni.reLaunch({ url: '/pages/index/index' }),
        })
        break
      case ErrorLevel.SEVERE:
        toast.error({ msg: error.message, duration: 3000 })
        break
      case ErrorLevel.NORMAL:
        toast.error({ msg: error.message, duration: 2000 })
        break
      case ErrorLevel.LIGHT:
        toast.warning({ msg: error.message, duration: 1500 })
        break
    }
  }

  /**
   * 映射 HTTP 状态码到错误信息
   */
  static mapStatusCode(statusCode: number, originalMessage?: string): ApiErrorInfo {
    const errorMap: Record<number, { level: ErrorLevel; message: string }> = {
      400: { level: ErrorLevel.NORMAL, message: '请求参数错误' },
      401: { level: ErrorLevel.FATAL, message: '登录已过期，请重新登录' },
      403: { level: ErrorLevel.SEVERE, message: '权限不足，无法访问' },
      404: { level: ErrorLevel.NORMAL, message: '请求的资源不存在' },
      500: { level: ErrorLevel.SEVERE, message: '服务器内部错误' },
      502: { level: ErrorLevel.LIGHT, message: '网关错误，请稍后重试' },
      503: { level: ErrorLevel.SEVERE, message: '服务暂时不可用' },
    }

    const defaultError = { level: ErrorLevel.NORMAL, message: '请求失败，请稍后重试' }
    const error = errorMap[statusCode] || defaultError

    return { ...error, code: statusCode, message: originalMessage || error.message }
  }

  /**
   * 映射业务错误码到错误信息
   */
  static mapBusinessCode(code: string | number, message: string): ApiErrorInfo {
    return { level: ErrorLevel.NORMAL, message, code }
  }
}
```

## 5. 组件层使用规范

### 5.1 标准请求场景

```vue
<script setup lang="ts">
import { useRequest } from 'alova/client'
import { getRepairOrderList } from '@/api/repair'
import { ref, onMounted } from 'vue'

const queryParams = ref({ page: 1, row: 10 })

/**
 * 请求管理 - 使用 useRequest + 回调钩子
 * 🔴 强制规范：必须设置 immediate: false
 */
const {
  loading,
  data: repairData,
  send: loadRepairList,
  onSuccess,
  onError,
  onComplete,
} = useRequest(() => getRepairOrderList(queryParams.value), {
  immediate: false,
})

/**
 * 成功回调 - 处理业务逻辑
 * @description 错误提示已在 Alova 响应拦截器中自动处理
 */
onSuccess((result) => {
  console.log('加载成功:', result)
})

/**
 * 失败回调 - 日志记录和状态恢复
 * @description 错误提示已自动处理，这里用于日志和状态恢复
 */
onError((error) => {
  console.error('加载失败:', error)
  // 不需要重复显示错误提示
})

/**
 * 完成回调 - 无论成功失败都执行
 */
onComplete(() => {
  uni.stopPullDownRefresh()
})

onMounted(() => {
  loadRepairList()
})
</script>
```

### 5.2 表单提交场景

```vue
<script setup lang="ts">
import { useRequest } from 'alova/client'
import { createRepairOrder } from '@/api/repair'
import { reactive } from 'vue'
import { useGlobalToast } from '@/hooks/useGlobalToast'

const toast = useGlobalToast()
const formData = reactive({ title: '', description: '' })

const {
  loading: submitting,
  send: submitRepair,
  onSuccess: onSubmitSuccess,
  onError: onSubmitError,
} = useRequest((data) => createRepairOrder(data), {
  immediate: false,
})

/** 提交成功回调 - 显示成功提示 */
onSubmitSuccess((result) => {
  toast.success('创建成功')
  // 重置表单或返回上一页
})

/** 提交失败回调 - 错误提示已自动处理 */
onSubmitError((error) => {
  console.error('创建失败:', error)
})

function handleSubmit() {
  if (!formData.title) {
    toast.warning('请输入标题')
    return
  }
  submitRepair(formData)
}
</script>
```

### 5.3 静默请求场景

当需要禁用自动错误提示时，使用 `meta.toast: false`：

```vue
<script setup lang="ts">
import { useRequest } from 'alova/client'
import { getRepairDetail } from '@/api/repair'
import { ApiErrorHandler, ErrorLevel } from '@/utils/api-error-handler'

/**
 * 静默请求 - 禁用全局错误提示
 */
const {
  send: loadDetail,
  onSuccess,
  onError,
} = useRequest((repairId: string) => getRepairDetail({ repairId }).setMeta({ toast: false }), {
  immediate: false,
})

onSuccess((result) => {
  console.log('加载成功:', result)
})

/**
 * 失败回调 - 自定义错误处理
 * @description 由于禁用了自动提示，需要手动处理错误
 */
onError((error) => {
  console.error('加载失败:', error)

  // 自定义错误处理
  ApiErrorHandler.handle({
    level: ErrorLevel.LIGHT,
    message: '加载失败，将使用缓存数据',
  })
})
</script>
```

## 6. 错误处理职责划分

|     场景     |     在 onError 中的处理     |                说明                 |
| :----------: | :-------------------------: | :---------------------------------: |
| **默认情况** |         仅记录日志          |   错误提示已由全局拦截器自动处理    |
| **静默请求** |       自定义错误处理        | 使用 meta.toast: false 后需手动处理 |
| **状态恢复** | 重置 loading 状态、恢复数据 |          用于 UI 状态管理           |
| **兜底逻辑** | 使用缓存数据、显示占位内容  |            保证用户体验             |

## 7. 使用 Toast 工具

```typescript
import { useGlobalToast } from '@/hooks/useGlobalToast'

const toast = useGlobalToast()

// 成功提示
toast.success('操作成功')

// 错误提示
toast.error('操作失败')

// 警告提示
toast.warning('请注意...')

// 信息提示
toast.info('正在处理中...')
```

## 8. 完整文档参考

更详细的错误处理方案请参阅：`docs/reports/2025-11-28-api-error-handling-research.md`
