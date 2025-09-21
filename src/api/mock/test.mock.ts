import { defineMock } from 'vite-plugin-mock-dev-server'

/**
 * 测试 Mock 插件是否正常工作
 */
export default defineMock([
  // 基础测试接口
  {
    url: '/api/test',
    method: 'GET',
    delay: 300,
    body: {
      success: true,
      message: 'Mock 插件工作正常！',
      data: {
        timestamp: Date.now(),
        version: '1.0.0',
        plugin: 'vite-plugin-mock-dev-server',
      },
    },
  },

  // 带参数的测试接口
  {
    url: '/api/test/params',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: ({ query, body }) => {
      return {
        success: true,
        message: '参数测试成功',
        receivedQuery: query,
        receivedBody: body,
        timestamp: Date.now(),
      }
    },
  },

  // 模拟错误响应
  {
    url: '/api/test/error',
    method: 'GET',
    body: ({ query }) => {
      if (query.trigger === 'error') {
        return {
          status: 500,
          statusText: 'Internal Server Error',
          body: {
            success: false,
            message: '模拟服务器错误',
            error: 'MOCK_ERROR',
          },
        }
      }
      return {
        success: true,
        message: '正常响应',
      }
    },
  },
])
