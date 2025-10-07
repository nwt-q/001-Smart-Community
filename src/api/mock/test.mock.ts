import { defineUniAppMock, errorResponse, mockLog, successResponse } from './shared/utils'

/**
 * 测试 Mock 插件是否正常工作
 */
export default defineUniAppMock([
  /** 基础测试接口 */
  {
    url: '/test',
    method: 'GET',
    delay: 300,
    body: () => {
      mockLog('test', 'Mock 插件测试')
      return successResponse({
        timestamp: Date.now(),
        version: '1.0.0',
        plugin: 'vite-plugin-mock-dev-server',
      }, 'Mock 插件工作正常！')
    },
  },

  /** 带参数的测试接口 */
  {
    url: '/test/params',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: ({ query, body }) => {
      mockLog('test/params', { query, body })
      return successResponse({
        receivedQuery: query,
        receivedBody: body,
      }, '参数测试成功')
    },
  },

  /** 模拟错误响应 */
  {
    url: '/test/error',
    method: 'GET',
    body: ({ query }) => {
      mockLog('test/error', query)
      if (query.trigger === 'error') {
        return errorResponse('模拟服务器错误', '500')
      }
      return successResponse(null, '正常响应')
    },
  },
])
