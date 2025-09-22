/**
 * Mock 工具函数
 */

import { createDefineMock } from 'vite-plugin-mock-dev-server'
// FIXME: 无法使用路径别名 出现路径识别错误 编译失败
// import { ResultEnum } from '@/http/tools/enum'
import { ResultEnum } from '../../../http/tools/enum'

/**
 * 自定义 Mock 定义函数，自动添加环境变量前缀
 */
export const defineUniAppMock = createDefineMock((mock) => {
  const prefix = import.meta.env.VITE_APP_PROXY_PREFIX || ''

  /**
   * 为什么这里要加两次 prefix？
   * 1 第一个前缀来自于 vite 的反向代理配置
   * 2 第二个前缀来自于 alova 请求实例的 baseURL
   */
  mock.url = `${prefix}${prefix}${mock.url}`
})

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

// 生成随机 ID（更加真实的业务ID格式）
export function generateId(prefix: string = 'ID') {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}_${timestamp}_${random}`.toUpperCase()
}

// 生成业务编号（按日期 + 序号格式）
export function generateBusinessId(prefix: string = 'BIZ') {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '') // YYYYMMDD
  const timeStr = date.toTimeString().slice(0, 8).replace(/:/g, '') // HHMMSS
  const random = Math.floor(Math.random() * 999).toString().padStart(3, '0')
  return `${prefix}${dateStr}${timeStr}${random}`
}

// 生成随机中文姓名
export function generateChineseName() {
  const surnames = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗']
  const names = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞']
  const surname = surnames[Math.floor(Math.random() * surnames.length)]
  const name = names[Math.floor(Math.random() * names.length)]
  return surname + name
}

// 生成随机手机号
export function generatePhoneNumber() {
  const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '150', '151', '152', '153', '155', '156', '157', '158', '159', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
  return prefix + suffix
}

// 生成随机地址
export function generateAddress() {
  const buildings = Array.from({ length: 20 }, (_, i) => (i + 1).toString())
  const units = ['A', 'B', 'C', 'D', 'E', 'F']
  const floors = Array.from({ length: 30 }, (_, i) => (i + 1).toString().padStart(2, '0'))

  const building = buildings[Math.floor(Math.random() * buildings.length)]
  const unit = units[Math.floor(Math.random() * units.length)]
  const floor = floors[Math.floor(Math.random() * floors.length)]

  return `${building}栋${floor}${unit}室`
}

// 生成随机时间范围
export function generateTimeRange(startDaysFromNow: number = -30, endDaysFromNow: number = 30) {
  const now = Date.now()
  const startTime = now + (startDaysFromNow * 24 * 60 * 60 * 1000)
  const endTime = now + (endDaysFromNow * 24 * 60 * 60 * 1000)
  const randomTime = startTime + Math.random() * (endTime - startTime)
  return new Date(randomTime).toISOString()
}

// 生成随机金额
export function generateAmount(min: number = 10, max: number = 1000) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 生成随机状态
export function generateStatus<T extends string>(statuses: T[]): T {
  return statuses[Math.floor(Math.random() * statuses.length)]
}

// 生成随机优先级
export function generatePriority() {
  return generateStatus(['HIGH', 'MEDIUM', 'LOW'])
}

// 模拟成功响应
export function successResponse<T>(data: T, message: string = '操作成功') {
  return {
    success: true,
    code: ResultEnum.Success,
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
