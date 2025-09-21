/**
 * Mock 工具函数
 */

// 模拟请求延迟
export const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 生成随机延迟
export function randomDelay(min: number = 200, max: number = 800) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return delay(ms)
}

// 模拟分页数据
export function createPaginationResponse<T>(
  data: T[],
  page: number = 1,
  pageSize: number = 10,
) {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = data.slice(start, end)

  return {
    list,
    total: data.length,
    page,
    pageSize,
    hasMore: end < data.length,
  }
}

// 生成随机 ID
export function generateId(prefix: string = 'ID') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 模拟成功响应
export function successResponse<T>(data: T, message: string = '操作成功') {
  return {
    success: true,
    code: '200',
    message,
    data,
    timestamp: Date.now(),
  }
}

// 模拟错误响应
export function errorResponse(message: string = '操作失败', code: string = '500') {
  return {
    success: false,
    code,
    message,
    data: null,
    timestamp: Date.now(),
  }
}

// 调试日志
export function mockLog(label: string, ...args: any[]) {
  console.log(`🚀 Mock API [${label}]:`, ...args)
}
