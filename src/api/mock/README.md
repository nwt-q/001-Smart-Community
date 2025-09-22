# Mock API 开发说明

本目录用于管理 `vite-plugin-mock-dev-server` 的模拟接口文件。

## 📁 目录结构

```plain
src/api/mock/
├── shared/
│   ├── utils.ts        # Mock 工具函数
│   └── mockData.ts     # 通用模拟数据生成器
├── test.mock.ts        # 测试 Mock 文件
├── activity.mock.ts    # 活动模块 Mock 接口
├── maintainance.mock.ts # 维修模块 Mock 接口
└── README.md           # 本说明文件
```

## 📋 文件命名规范

- **业务模块**: `{模块名}.mock.ts`（如：`activity.mock.ts`、`maintainance.mock.ts`）
- **共享数据**: `shared/mockData.ts`
- **工具函数**: `shared/utils.ts`

## 🔧 Mock 文件格式

所有 Mock 文件必须使用 `*.mock.ts` 格式，并使用 `defineUniAppMock()` 函数：

```typescript
import { defineUniAppMock } from './shared/utils'

export default defineUniAppMock([
  {
    url: '/api/your-endpoint',
    method: ['GET', 'POST'],
    delay: 300,
    body: {
      success: true,
      data: {},
    },
  },
])
```

## 🚀 使用说明

1. **创建 Mock 文件**: 在 `src/api/mock` 目录下创建 `*.mock.ts` 文件
2. **定义接口**: 使用 `defineUniAppMock()` 函数定义 Mock 接口
3. **启动开发服务器**: 运行 `pnpm dev` 启动开发服务器
4. **访问 Mock 接口**: 发送请求到配置的接口路径

## 🧪 测试接口

启动开发服务器后，可以测试以下接口：

- `GET /api/test` - 基础测试
- `GET /api/test/params?name=test` - 参数测试
- `GET /api/test/error?trigger=error` - 错误测试

## ⚠️ 重要提醒

- Mock 文件必须放在 `src/api/mock` 目录下
- Mock 文件与 API 接口文件在同一目录层级，便于管理和维护
- 使用 `defineUniAppMock()` 而非 `defineMock()` 函数
- Mock 接口仅在开发环境生效
- 通过 `vite.config.ts` 中的 `dir: 'src/api/mock'` 配置指定目录
