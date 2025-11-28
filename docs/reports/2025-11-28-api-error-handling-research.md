# 项目接口错误提示能力调研报告

## 1. 调研概述

### 1.1 调研目标

基于 `wot-design-uni` 组件库和 `unibest` 模板，全面调研本项目应如何实现优雅美观的接口请求错误提示能力，制定统一的错误提示标准和实施方案。

### 1.2 调研范围

- wot-design-uni 消息提示组件最佳实践
- unibest 模板错误处理机制
- 本项目现有 HTTP 请求封装和错误处理
- 本项目现有错误提示实现方式
- 统一接口错误提示方案设计

## 2. 技术栈分析

### 2.1 wot-design-uni 消息提示组件

#### 核心组件对比

| 组件              | 适用场景               | 特点                   | 推荐度     |
| ----------------- | ---------------------- | ---------------------- | ---------- |
| Toast 轻提示      | 简单信息提示、操作反馈 | 轻量级、自动消失       | ⭐⭐⭐⭐⭐ |
| Message 弹框      | 重要信息确认、用户输入 | 需要用户交互           | ⭐⭐⭐     |
| Notification 通知 | 非阻塞式通知、重要提醒 | 可自定义位置、持续显示 | ⭐⭐⭐⭐   |

#### 推荐的错误提示策略

```typescript
// 1. 网络错误 - Toast 轻提示
toast.error('网络连接异常，请检查网络设置')

// 2. 业务错误 - Toast 轻提示
toast.error('操作失败：用户名已存在')

// 3. 权限错误 - Message 确认框
message.alert({
  title: '权限不足',
  msg: '您没有权限执行此操作，请联系管理员',
})

// 4. 系统通知 - Notification
showNotify({
  type: 'warning',
  message: '系统将于 10 分钟后进行维护',
  duration: 0, // 不自动关闭
})
```

### 2.2 unibest 模板错误处理机制

#### 双重 HTTP 封装方案

| 方案             | 特点               | 适用场景         | 现状                  |
| ---------------- | ------------------ | ---------------- | --------------------- |
| uni.request 封装 | 简单直接、易于理解 | 项目当前主要使用 | ✅ 已配置             |
| Alova 封装       | 功能强大、支持缓存 | 高级特性需求     | ✅ 已配置但未完全启用 |

#### 现有错误处理流程

1. **请求拦截器**: 自动添加认证信息、处理 URL 拼接
2. **响应拦截器**: 统一状态码处理、自动 token 刷新
3. **错误分类**: 网络错误、认证错误、业务逻辑错误

## 3. 项目现状分析

### 3.1 HTTP 请求封装现状

#### 优点

- ✅ 完整的请求/响应拦截器机制
- ✅ 支持双 Token 无感刷新
- ✅ 统一的错误状态码处理
- ✅ TypeScript 类型定义完善

#### 问题与不足

- ❌ 错误提示方式单一（仅使用 uni.showToast）
- ❌ 缺乏错误级别的区分
- ❌ 错误信息用户体验不够友好
- ❌ 没有与 wot-design-uni 组件集成

### 3.2 错误提示实现现状

#### 现有实现方式

```typescript
// 方式1：uni.showToast - 基础提示
uni.showToast({
  icon: 'none',
  title: '网络错误，换个网络试试',
})

// 方式2：useGlobalToast - 封装的 wot-design-uni Toast
const toast = useGlobalToast()
toast.error('请先选择楼栋')
```

#### 问题分析

1. **不一致性**: 混合使用 uni.showToast 和 wot-design-uni Toast
2. **缺乏统一标准**: 不同页面使用不同的错误提示方式
3. **用户体验差**: 错误信息不够友好和具体
4. **维护困难**: 缺乏统一的错误处理工具类

## 4. 统一接口错误提示方案设计

### 4.1 设计原则

1. **一致性**: 统一使用 wot-design-uni 组件
2. **用户友好**: 错误信息通俗易懂，避免技术术语
3. **分级处理**: 根据错误严重程度选择合适的提示方式
4. **可配置性**: 支持静默处理和自定义处理
5. **可维护性**: 集中管理，便于统一调整

### 4.2 错误分类与处理策略

#### 错误级别定义

| 级别      | 错误类型               | 处理方式                | 示例                   |
| --------- | ---------------------- | ----------------------- | ---------------------- |
| L1 - 致命 | 认证过期、服务器宕机   | Message 弹框 + 跳转处理 | 登录已过期，请重新登录 |
| L2 - 严重 | 权限不足、数据不存在   | Toast 轻提示 + 交互指导 | 您没有权限执行此操作   |
| L3 - 一般 | 业务逻辑错误、参数错误 | Toast 轻提示            | 手机号格式不正确       |
| L4 - 轻微 | 网络波动、超时         | Toast 轻提示（短暂）    | 网络异常，请稍后重试   |

### 4.3 技术实现方案

#### 核心工具类设计

```typescript
// src/utils/error-handler.ts
import { useToast, useMessage, showNotify } from 'wot-design-uni'

export enum ErrorLevel {
  FATAL = 'fatal', // 致命错误
  SEVERE = 'severe', // 严重错误
  NORMAL = 'normal', // 一般错误
  LIGHT = 'light', // 轻微错误
}

export class ApiErrorHandler {
  private static toast = useToast()
  private static message = useMessage()

  /**
   * 统一错误处理入口
   */
  static handle(error: ApiError, options?: ErrorHandlerOptions): void {
    const { level, message, code, shouldShowError = true } = error

    if (!shouldShowError) return

    switch (level) {
      case ErrorLevel.FATAL:
        this.handleFatalError(message, code)
        break
      case ErrorLevel.SEVERE:
        this.handleSevereError(message)
        break
      case ErrorLevel.NORMAL:
        this.handleNormalError(message)
        break
      case ErrorLevel.LIGHT:
        this.handleLightError(message)
        break
    }
  }

  private static handleFatalError(message: string, code?: number) {
    this.message
      .alert({
        title: '系统错误',
        msg: message,
      })
      .then(() => {
        // 跳转到登录页或首页
        uni.reLaunch({ url: '/pages/index/index' })
      })
  }

  private static handleSevereError(message: string) {
    this.toast.error({
      msg: message,
      duration: 3000,
    })
  }

  private static handleNormalError(message: string) {
    this.toast.error({
      msg: message,
      duration: 2000,
    })
  }

  private static handleLightError(message: string) {
    this.toast.warning({
      msg: message,
      duration: 1500,
    })
  }
}
```

#### HTTP 请求拦截器改造

```typescript
// src/http/http.ts 修改部分
import { ApiErrorHandler, ErrorLevel } from '@/utils/error-handler'

export function http<T>(options: CustomRequestOptions) {
  return new Promise<IResData<T>>((resolve, reject) => {
    uni.request({
      ...options,
      success: async (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          return resolve(res.data as IResData<T>)
        }

        const resData: IResData<T> = res.data as IResData<T>

        // 认证错误处理
        if (res.statusCode === 401 || resData.code === 401) {
          ApiErrorHandler.handle(
            {
              level: ErrorLevel.FATAL,
              message: '登录已过期，请重新登录',
              code: res.statusCode,
            },
            { shouldShowError: !options.hideErrorToast },
          )

          // 原有的 token 刷新逻辑...
          return
        }

        // 业务错误处理
        const apiError = this.mapApiError(res.statusCode, resData.msg)
        ApiErrorHandler.handle(apiError, {
          shouldShowError: !options.hideErrorToast,
        })

        reject(res)
      },
      fail(err) {
        ApiErrorHandler.handle(
          {
            level: ErrorLevel.LIGHT,
            message: '网络连接异常，请检查网络设置',
            code: -1,
          },
          { shouldShowError: !options.hideErrorToast },
        )

        reject(err)
      },
    })
  })
}

/**
 * 映射 API 错误到标准错误格式
 */
function mapApiError(statusCode: number, originalMessage?: string): ApiError {
  const errorMap = {
    400: { level: ErrorLevel.NORMAL, message: '请求参数错误' },
    403: { level: ErrorLevel.SEVERE, message: '权限不足，无法访问' },
    404: { level: ErrorLevel.NORMAL, message: '请求的资源不存在' },
    500: { level: ErrorLevel.SEVERE, message: '服务器内部错误' },
    502: { level: ErrorLevel.LIGHT, message: '网关错误，请稍后重试' },
    503: { level: ErrorLevel.SEVERE, message: '服务暂时不可用' },
  }

  const error = errorMap[statusCode] || {
    level: ErrorLevel.NORMAL,
    message: '请求失败，请稍后重试',
  }

  return {
    ...error,
    code: statusCode,
    message: originalMessage || error.message,
  }
}
```

#### 组件使用示例

```vue
<template>
  <!-- 页面中需要包含 toast 组件 -->
  <wd-toast></wd-toast>

  <view>
    <wd-button @click="handleGetData">获取数据</wd-button>
  </view>
</template>

<script setup lang="ts">
import { http } from '@/http/http'
import { ApiErrorHandler } from '@/utils/error-handler'

// 自动错误提示
async function handleGetData() {
  try {
    const data = await http.get('/api/data')
    console.log('请求成功:', data)
  } catch (error) {
    // 自动错误提示已处理，这里可以记录日志
    console.error('获取数据失败:', error)
  }
}

// 静默处理
async function handleSilentRequest() {
  try {
    const data = await http.get('/api/data', { hideErrorToast: true })
    return data
  } catch (error) {
    // 自定义错误处理
    ApiErrorHandler.handle({
      level: ErrorLevel.NORMAL,
      message: '自定义错误提示',
      code: -1,
    })
  }
}
</script>
```

## 5. 实施建议

### 5.1 分阶段实施计划

#### 阶段一：基础设施建设（1-2 天）

1. 创建 `src/utils/error-handler.ts` 错误处理工具类
2. 创建 `src/types/error.ts` 错误类型定义
3. 创建 `src/utils/error-messages.ts` 错误信息映射
4. 单元测试覆盖核心功能

#### 阶段二：HTTP 请求拦截器改造（1 天）

1. 修改 `src/http/http.ts` 集成新的错误处理
2. 修改 `src/http/alova.ts` 统一错误处理逻辑
3. 更新错误状态码映射规则
4. 测试各种错误场景

#### 阶段三：组件和应用改造（2-3 天）

1. 更新全局 Toast 组件配置
2. 逐步替换现有的 uni.showToast 调用
3. 统一 API 调用的错误处理方式
4. 完善错误日志记录

#### 阶段四：优化和测试（1-2 天）

1. 用户界面和交互优化
2. 多端兼容性测试（H5、小程序、APP）
3. 性能优化
4. 文档完善

### 5.2 关键注意事项

1. **向后兼容**: 保持现有 API 接口不变，新增可选参数
2. **渐进式改造**: 先新功能使用新方案，逐步改造旧功能
3. **多端适配**: 确保在不同平台下的一致性表现
4. **国际化支持**: 错误信息支持多语言
5. **性能考虑**: 避免频繁的错误提示影响性能

### 5.3 质量保证

1. **代码规范**: 遵循项目现有的代码规范和 ESLint 配置
2. **类型安全**: 完善 TypeScript 类型定义
3. **单元测试**: 核心错误处理逻辑测试覆盖率 100%
4. **集成测试**: 端到端错误处理流程测试
5. **用户测试**: 用户体验和反馈收集

## 6. 预期收益

### 6.1 用户体验提升

- ✅ 错误提示更加友好和具体
- ✅ 错误处理更加一致和规范
- ✅ 减少用户困惑和操作错误

### 6.2 开发效率提升

- ✅ 统一的错误处理标准，减少重复代码
- ✅ 集中管理，便于维护和调整
- ✅ 完善的类型定义，减少开发错误

### 6.3 系统稳定性提升

- ✅ 完善的错误分类和处理机制
- ✅ 更好的错误日志和监控
- ✅ 统一的异常处理流程

## 7. 结论与建议

基于本次调研，建议采用基于 `wot-design-uni` 组件库的统一错误提示方案。该方案能够：

1. **保持技术栈一致性**: 充分利用 wot-design-uni 的组件能力
2. **提升用户体验**: 提供更友好的错误提示和交互指导
3. **降低维护成本**: 集中管理错误处理逻辑，便于统一调整
4. **支持未来扩展**: 灵活的配置和扩展机制，支持业务发展

建议按照分阶段实施计划逐步推进，确保在提升用户体验的同时，保持系统的稳定性和可靠性。
