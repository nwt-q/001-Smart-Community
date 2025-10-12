# 物业管理模块强类型路由迁移总结

## 任务概述

为 `src/pages-sub/property` 目录下的 5 个页面创建了严格的强类型路由跳转函数，完全替代了原有的 `uni.navigateTo` 和 `JSON.stringify` 传参方式。

## 实施方案

### 1. 类型定义层更新 (`src/types/routes.ts`)

#### 1.1 新增路由路径类型

在 `PageRoute` 联合类型中添加了 5 个物业管理模块的路由路径：

```typescript
| '/pages-sub/property/apply-room'                  // 房屋申请列表
| '/pages-sub/property/apply-room-detail'           // 房屋申请详情
| '/pages-sub/property/apply-room-record'           // 房屋申请记录
| '/pages-sub/property/apply-room-record-handle'    // 记录处理
| '/pages-sub/property/apply-room-record-detail'    // 记录详情
```

#### 1.2 定义参数类型映射

在 `PageParams` 接口中为每个路由定义了严格的参数类型：

|                    路由路径                    |                                   参数类型                                   |
| :--------------------------------------------: | :--------------------------------------------------------------------------: |
|        `/pages-sub/property/apply-room`        |                                `{}` (无参数)                                 |
|    `/pages-sub/property/apply-room-detail`     |                   `{ ardId: string, communityId: string }`                   |
|    `/pages-sub/property/apply-room-record`     |         `{ ardId, communityId, roomId, roomName, state, stateName }`         |
| `/pages-sub/property/apply-room-record-handle` |         `{ ardId, communityId, roomId, roomName, state, stateName }`         |
| `/pages-sub/property/apply-room-record-detail` | `{ ardrId, applicationId, roomId, roomName, communityId, state, stateName }` |

### 2. 路由工具层更新 (`src/router/helpers.ts`)

#### 2.1 新增 TypedRouter 静态方法

在 `TypedRouter` 类中添加了 5 个物业模块的路由跳转方法：

```typescript
/** 物业管理模块导航 */
static toApplyRoomList()
static toApplyRoomDetail(ardId: string, communityId: string)
static toApplyRoomRecord(params: PageParams['/pages-sub/property/apply-room-record'])
static toApplyRoomRecordHandle(params: PageParams['/pages-sub/property/apply-room-record-handle'])
static toApplyRoomRecordDetail(params: PageParams['/pages-sub/property/apply-room-record-detail'])
```

**特点**：

- 简单参数直接展开（如 `ardId`, `communityId`）
- 复杂参数使用结构化对象（如 `params`）
- 完整的 TypeScript 类型检查
- 自动参数编码

#### 2.2 更新 isValidRoute 函数

将 5 个新路由路径添加到 `isValidRoute` 函数的路由验证列表中。

### 3. 路由参数辅助工具 (`src/utils/property-route-helper.ts`)

创建了专门的工具函数来处理复杂对象的参数提取和重建。

#### 3.1 参数提取函数

```typescript
/** 从 PropertyApplication 对象提取跟踪记录所需参数 */
extractApplyRecordParams(apply: PropertyApplication)

/** 从 ApplicationRecord 对象提取记录详情所需参数 */
extractRecordDetailParams(record: ApplicationRecord, communityId: string)
```

#### 3.2 对象重建函数

```typescript
/** 从 URL 参数重建 PropertyApplication 对象的核心字段 */
buildApplyFromParams(params: {...})

/** 从 URL 参数重建 ApplicationRecord 对象的核心字段 */
buildRecordFromParams(params: {...})
```

**优势**：

- 类型安全的参数提取
- 避免直接使用 JSON.stringify
- 只传递必要的字段
- 接收端可以安全地重建对象

### 4. 导出层更新 (`src/router/index.ts`)

在导出配置中添加了 5 个新的路由跳转函数：

```typescript
export const {
  // ... 现有导出
  toApplyRoomList,
  toApplyRoomDetail,
  toApplyRoomRecord,
  toApplyRoomRecordHandle,
  toApplyRoomRecordDetail,
} = TypedRouter
```

### 5. 页面代码更新

#### 5.1 apply-room.vue（房屋申请列表页）

**迁移前**：

```typescript
function toApplyRoomDetail(item: PropertyApplication) {
  uni.navigateTo({
    url: `/pages-sub/property/apply-room-detail?ardId=${item.ardId}&communityId=${item.communityId}`,
  })
}
```

**迁移后**：

```typescript
import { TypedRouter } from '@/router'

/** 跳转到房屋申请详情页 */
function toApplyRoomDetail(item: PropertyApplication) {
  TypedRouter.toApplyRoomDetail(item.ardId, item.communityId)
}
```

#### 5.2 apply-room-detail.vue（房屋申请详情页）

**迁移前**：

```typescript
function showApplyRoomRecord() {
  uni.navigateTo({
    url: `/pages-sub/property/apply-room-record?apply=${JSON.stringify(applyRoomInfo.value)}`,
  })
}
```

**迁移后**：

```typescript
import { TypedRouter } from '@/router'
import { extractApplyRecordParams } from '@/utils/property-route-helper'

/** 显示房屋申请跟踪记录 */
function showApplyRoomRecord() {
  const params = extractApplyRecordParams(applyRoomInfo.value)
  TypedRouter.toApplyRoomRecord(params)
}
```

#### 5.3 apply-room-record.vue（房屋申请记录页）

**迁移前**：

```typescript
function addRecord() {
  uni.navigateTo({
    url: `/pages-sub/property/apply-room-record-handle?apply=${JSON.stringify(applyRoomInfo.value)}`,
  })
}

function showDetail(_item: ApplicationRecord) {
  const itemWithCommunityId = { ..._item, communityId: applyRoomInfo.value.communityId }
  uni.navigateTo({
    url: `/pages-sub/property/apply-room-record-detail?apply=${JSON.stringify(itemWithCommunityId)}`,
  })
}

onLoad((options: { apply: string }) => {
  applyRoomInfo.value = JSON.parse(options.apply)
})
```

**迁移后**：

```typescript
import { TypedRouter } from '@/router'
import { buildApplyFromParams, extractRecordDetailParams } from '@/utils/property-route-helper'

/** 新增跟踪记录 */
function addRecord() {
  const params = {
    ardId: applyRoomInfo.value.ardId,
    communityId: applyRoomInfo.value.communityId,
    roomId: applyRoomInfo.value.roomId,
    roomName: applyRoomInfo.value.roomName,
    state: applyRoomInfo.value.state,
    stateName: applyRoomInfo.value.stateName,
  }
  TypedRouter.toApplyRoomRecordHandle(params)
}

/** 显示记录详情 */
function showDetail(_item: ApplicationRecord) {
  const params = extractRecordDetailParams(_item, applyRoomInfo.value.communityId)
  TypedRouter.toApplyRoomRecordDetail(params)
}

onLoad(
  (options: {
    ardId?: string
    communityId?: string
    roomId?: string
    roomName?: string
    state?: string
    stateName?: string
  }) => {
    if (
      options.ardId &&
      options.communityId &&
      options.roomId &&
      options.roomName &&
      options.state &&
      options.stateName
    ) {
      applyRoomInfo.value = buildApplyFromParams({
        ardId: options.ardId,
        communityId: options.communityId,
        roomId: options.roomId,
        roomName: options.roomName,
        state: options.state,
        stateName: options.stateName,
      }) as PropertyApplication
    }
  },
)
```

#### 5.4 apply-room-record-handle.vue（记录处理页）

**迁移前**：

```typescript
onLoad((options: { apply: string }) => {
  applyRoomInfo.value = JSON.parse(options.apply)
  communityId.value = '' // TODO: 获取当前小区ID
})
```

**迁移后**：

```typescript
import { buildApplyFromParams } from '@/utils/property-route-helper'

onLoad(
  (options: {
    ardId?: string
    communityId?: string
    roomId?: string
    roomName?: string
    state?: string
    stateName?: string
  }) => {
    if (
      options.ardId &&
      options.communityId &&
      options.roomId &&
      options.roomName &&
      options.state &&
      options.stateName
    ) {
      applyRoomInfo.value = buildApplyFromParams({
        ardId: options.ardId,
        communityId: options.communityId,
        roomId: options.roomId,
        roomName: options.roomName,
        state: options.state,
        stateName: options.stateName,
      }) as PropertyApplication
      communityId.value = options.communityId
    }
  },
)
```

#### 5.5 apply-room-record-detail.vue（记录详情页）

**迁移前**：

```typescript
onLoad((options: { apply: string }) => {
  recordInfo.value = JSON.parse(options.apply)
  commonBaseUrl.value = ''
  loadRecordDetail()
})
```

**迁移后**：

```typescript
import { buildRecordFromParams } from '@/utils/property-route-helper'

onLoad(
  (options: {
    ardrId?: string
    applicationId?: string
    roomId?: string
    roomName?: string
    communityId?: string
    state?: string
    stateName?: string
  }) => {
    if (
      options.ardrId &&
      options.applicationId &&
      options.roomId &&
      options.roomName &&
      options.communityId &&
      options.state &&
      options.stateName
    ) {
      recordInfo.value = buildRecordFromParams({
        ardrId: options.ardrId,
        applicationId: options.applicationId,
        roomId: options.roomId,
        roomName: options.roomName,
        communityId: options.communityId,
        state: options.state,
        stateName: options.stateName,
      }) as ApplicationRecord & { communityId: string }
      commonBaseUrl.value = ''
      loadRecordDetail()
    }
  },
)
```

## 核心改进点

### 1. 消除 JSON.stringify 传参

**问题**：

- 不是类型安全的
- 参数过长可能超出 URL 限制
- 调试困难
- 无法利用 TypeScript 类型检查

**解决方案**：

- 提取必要的标识符字段通过 URL 参数传递
- 使用辅助函数进行参数提取和重建
- 保持类型安全

### 2. 统一路由跳转接口

**优势**：

- 所有路由跳转都通过 `TypedRouter` 类
- 完整的 TypeScript 类型提示
- IDE 智能提示和自动完成
- 重构安全（修改路由路径时会有编译错误提示）

### 3. 参数验证和类型约束

**类型检查**：

```typescript
// ✅ 正确 - 参数类型匹配
TypedRouter.toApplyRoomDetail('ARD001', 'COM001')

// ❌ 错误 - TypeScript 会报错：缺少必需参数
TypedRouter.toApplyRoomDetail('ARD001')

// ❌ 错误 - TypeScript 会报错：参数类型不匹配
TypedRouter.toApplyRoomDetail(123, 'COM001')
```

### 4. 清晰的函数命名

|          函数名           |      功能描述      |
| :-----------------------: | :----------------: |
|     `toApplyRoomList`     | 跳转到房屋申请列表 |
|    `toApplyRoomDetail`    | 跳转到房屋申请详情 |
|    `toApplyRoomRecord`    | 跳转到申请跟踪记录 |
| `toApplyRoomRecordHandle` |   跳转到记录处理   |
| `toApplyRoomRecordDetail` |   跳转到记录详情   |

## 使用示例

### 示例 1：简单跳转（列表 → 详情）

```typescript
import { TypedRouter } from '@/router'

function handleItemClick(item: PropertyApplication) {
  // 简单、清晰、类型安全
  TypedRouter.toApplyRoomDetail(item.ardId, item.communityId)
}
```

### 示例 2：复杂对象跳转（详情 → 记录）

```typescript
import { TypedRouter } from '@/router'
import { extractApplyRecordParams } from '@/utils/property-route-helper'

function showRecords(apply: PropertyApplication) {
  // 使用辅助函数提取参数
  const params = extractApplyRecordParams(apply)
  TypedRouter.toApplyRoomRecord(params)
}
```

### 示例 3：参数重建（接收页面）

```typescript
import { buildApplyFromParams } from '@/utils/property-route-helper'

onLoad((options) => {
  if (/* 所有参数都存在 */) {
    // 从 URL 参数重建对象
    const apply = buildApplyFromParams(options)
    // 使用重建的对象
  }
})
```

## 修改文件清单

### 新增文件

1. `src/utils/property-route-helper.ts` - 参数提取和重建工具
2. `.claude/docs/property-route-migration-summary.md` - 本文档

### 修改文件

1. `src/types/routes.ts` - 添加路由路径和参数类型定义
2. `src/router/helpers.ts` - 添加路由跳转函数和验证逻辑
3. `src/router/index.ts` - 导出新的路由函数
4. `src/pages-sub/property/apply-room.vue` - 替换路由跳转代码
5. `src/pages-sub/property/apply-room-detail.vue` - 替换路由跳转代码
6. `src/pages-sub/property/apply-room-record.vue` - 替换路由跳转和参数接收代码
7. `src/pages-sub/property/apply-room-record-handle.vue` - 替换参数接收代码
8. `src/pages-sub/property/apply-room-record-detail.vue` - 替换参数接收代码

## 验证步骤

### 1. 类型检查

所有代码通过 TypeScript 编译，无类型错误。

### 2. 功能测试

建议测试以下路由跳转链路：

```plain
房屋申请列表
  ↓ 点击列表项
房屋申请详情
  ↓ 点击"空置房跟踪记录"
申请跟踪记录列表
  ↓ 点击"新增记录"
记录处理页
  ↓ 提交后返回
申请跟踪记录列表
  ↓ 点击记录项
记录详情页
```

### 3. 参数传递验证

在每个页面的 `onLoad` 中打印接收到的参数，确认参数正确传递。

## 最佳实践总结

### 1. 路由跳转统一使用 TypedRouter

```typescript
// ❌ 不推荐
uni.navigateTo({ url: '/pages-sub/property/apply-room-detail?ardId=xxx' })

// ✅ 推荐
TypedRouter.toApplyRoomDetail('xxx', 'yyy')
```

### 2. 避免 JSON 传参

```typescript
// ❌ 不推荐
uni.navigateTo({ url: `/path?data=${JSON.stringify(obj)}` })

// ✅ 推荐
const params = extractParams(obj)
TypedRouter.toSomePage(params)
```

### 3. 使用辅助函数处理复杂对象

```typescript
// ❌ 不推荐 - 手动拼接参数
function jump(item) {
  TypedRouter.toSomePage({
    id: item.id,
    name: item.name,
    // ... 手动列举所有字段
  })
}

// ✅ 推荐 - 使用辅助函数
function jump(item) {
  const params = extractParams(item)
  TypedRouter.toSomePage(params)
}
```

### 4. 参数接收时进行完整性检查

```typescript
onLoad((options) => {
  // ✅ 推荐 - 检查所有必需参数
  if (options.id && options.name && options.status) {
    const obj = buildFromParams(options)
    // 使用 obj
  } else {
    // 处理参数不完整的情况
    console.error('缺少必需参数')
  }
})
```

## 后续优化建议

### 1. 考虑使用状态管理

对于复杂对象（如 `PropertyApplication`），可以考虑：

- 使用 Pinia store 存储当前对象
- 页面间只传递标识符（如 `ardId`）
- 目标页面从 store 中获取完整对象

### 2. 实现路由参数缓存

对于频繁访问的页面，可以实现参数缓存机制：

- 首次传递完整参数
- 后续只传递标识符
- 从缓存中恢复对象

### 3. 添加参数验证装饰器

可以创建装饰器来自动验证路由参数：

```typescript
@ValidateParams(['ardId', 'communityId'])
onLoad(options) {
  // 参数已验证，可以安全使用
}
```

## 结论

本次迁移成功实现了：

1. ✅ 完全替代了 `uni.navigateTo` + 字符串拼接的传统方式
2. ✅ 消除了 `JSON.stringify` 传参的不安全做法
3. ✅ 建立了类型安全的路由跳转系统
4. ✅ 提供了清晰的辅助工具函数
5. ✅ 保持了现有业务逻辑不变

所有路由跳转现在都具备：

- 完整的 TypeScript 类型检查
- IDE 智能提示和自动完成
- 编译时错误检测
- 更好的可维护性和可读性
