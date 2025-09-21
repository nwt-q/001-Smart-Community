import type { RepairStatus } from '@/types/repair'
import { defineMock } from 'vite-plugin-mock-dev-server'
import { createMockRepair } from './shared/mockData'
import { createPaginationResponse, errorResponse, generateId, randomDelay, successResponse } from './shared/utils'

/**
 * 维修模块 Mock 接口
 * 基于 Java110Context + uni.request 架构向 Alova + TypeScript + Mock 的现代化迁移
 */

// 模拟维修工单数据库
const mockRepairDatabase = {
  repairs: Array.from({ length: 50 }, (_, index) =>
    createMockRepair((index + 1).toString().padStart(3, '0'))),

  // 获取工单详情
  getRepairById(repairId: string) {
    return this.repairs.find(repair => repair.repairId === repairId)
  },

  // 获取工单列表（支持筛选）
  getRepairList(params: {
    page: number
    row: number
    communityId?: string
    status?: string
    repairType?: string
    keyword?: string
    startDate?: string
    endDate?: string
  }) {
    let filteredRepairs = [...this.repairs]

    // 状态筛选
    if (params.status) {
      filteredRepairs = filteredRepairs.filter(repair => repair.status === params.status)
    }

    // 维修类型筛选
    if (params.repairType) {
      filteredRepairs = filteredRepairs.filter(repair => repair.repairType === params.repairType)
    }

    // 关键词筛选
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredRepairs = filteredRepairs.filter(repair =>
        repair.title.toLowerCase().includes(keyword)
        || repair.description.toLowerCase().includes(keyword)
        || repair.ownerName.toLowerCase().includes(keyword)
        || repair.address.toLowerCase().includes(keyword),
      )
    }

    // 日期范围筛选
    if (params.startDate) {
      filteredRepairs = filteredRepairs.filter(repair =>
        new Date(repair.createTime) >= new Date(params.startDate!),
      )
    }
    if (params.endDate) {
      filteredRepairs = filteredRepairs.filter(repair =>
        new Date(repair.createTime) <= new Date(params.endDate!),
      )
    }

    // 按创建时间倒序排序
    filteredRepairs.sort((a, b) =>
      new Date(b.createTime).getTime() - new Date(a.createTime).getTime(),
    )

    return createPaginationResponse(filteredRepairs, params.page, params.row)
  },

  // 添加工单
  addRepair(repair: any) {
    this.repairs.unshift(repair)
    return repair
  },

  // 更新工单状态
  updateRepairStatus(repairId: string, status: RepairStatus, assignedWorker?: string) {
    const repair = this.getRepairById(repairId)
    if (repair) {
      repair.status = status
      repair.updateTime = new Date().toISOString()
      if (assignedWorker) {
        repair.assignedWorker = assignedWorker
      }
      return repair
    }
    return null
  },
}

export default defineMock([
  // 获取维修工单列表
  {
    url: '/api/app/ownerRepair.listOwnerRepairs',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: async ({ query, body }) => {
      await randomDelay(300, 800)

      const params = { ...query, ...body }

      try {
        const result = mockRepairDatabase.getRepairList({
          page: Number(params.page) || 1,
          row: Number(params.row) || 10,
          communityId: params.communityId,
          status: params.status,
          repairType: params.repairType,
          keyword: params.keyword,
          startDate: params.startDate,
          endDate: params.endDate,
        })

        console.log('🚀 Mock API: listOwnerRepairs', params, '→', `${result.list.length} items`)
        return successResponse({
          ownerRepairs: result.list,
          total: result.total,
          page: result.page,
          row: result.pageSize,
        }, '获取维修工单列表成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: listOwnerRepairs', error)
        return errorResponse(error.message || '获取维修工单列表失败')
      }
    },
  },

  // 获取维修工单详情
  {
    url: '/api/app/ownerRepair.queryOwnerRepair',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)

      const params = { ...query, ...body }

      try {
        if (!params.repairId) {
          return errorResponse('维修工单ID不能为空', '400')
        }

        const repair = mockRepairDatabase.getRepairById(params.repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', '404')
        }

        console.log('🚀 Mock API: queryOwnerRepair', params, '→', repair)
        return successResponse({
          ownerRepair: repair,
        }, '获取维修工单详情成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: queryOwnerRepair', error)
        return errorResponse(error.message || '获取维修工单详情失败')
      }
    },
  },

  // 创建维修工单
  {
    url: '/api/app/ownerRepair.saveOwnerRepair',
    method: 'POST',
    delay: [500, 1200],
    body: async ({ body }) => {
      await randomDelay(500, 1200)

      try {
        // 数据验证
        if (!body.title?.trim()) {
          return errorResponse('维修标题不能为空', '400')
        }
        if (!body.description?.trim()) {
          return errorResponse('维修描述不能为空', '400')
        }
        if (!body.ownerName?.trim()) {
          return errorResponse('业主姓名不能为空', '400')
        }
        if (!body.ownerPhone?.trim()) {
          return errorResponse('联系电话不能为空', '400')
        }
        if (!body.address?.trim()) {
          return errorResponse('维修地址不能为空', '400')
        }

        const newRepair = {
          repairId: generateId('REP'),
          title: body.title,
          description: body.description,
          ownerName: body.ownerName,
          ownerPhone: body.ownerPhone,
          address: body.address,
          repairType: body.repairType || '其他维修',
          status: RepairStatus.PENDING,
          priority: body.priority || 'MEDIUM',
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
          assignedWorker: null,
          estimatedCost: body.estimatedCost || 0,
          actualCost: null,
          images: body.images || [],
          communityId: body.communityId || 'COMM_001',
        }

        mockRepairDatabase.addRepair(newRepair)
        console.log('🚀 Mock API: saveOwnerRepair', body, '→', newRepair)
        return successResponse({
          ownerRepair: newRepair,
        }, '创建维修工单成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: saveOwnerRepair', error)
        return errorResponse(error.message || '创建维修工单失败')
      }
    },
  },

  // 更新维修工单状态
  {
    url: '/api/app/ownerRepair.updateRepairStatus',
    method: 'POST',
    delay: [300, 700],
    body: async ({ body }) => {
      await randomDelay(300, 700)

      try {
        if (!body.repairId) {
          return errorResponse('维修工单ID不能为空', '400')
        }
        if (!body.status) {
          return errorResponse('工单状态不能为空', '400')
        }

        // 验证状态有效性
        const validStatuses = Object.values(RepairStatus)
        if (!validStatuses.includes(body.status)) {
          return errorResponse('无效的工单状态', '400')
        }

        const updatedRepair = mockRepairDatabase.updateRepairStatus(
          body.repairId,
          body.status,
          body.assignedWorker,
        )

        if (!updatedRepair) {
          return errorResponse('维修工单不存在', '404')
        }

        console.log('🚀 Mock API: updateRepairStatus', body, '→', updatedRepair)
        return successResponse({
          ownerRepair: updatedRepair,
        }, '更新维修工单状态成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: updateRepairStatus', error)
        return errorResponse(error.message || '更新维修工单状态失败')
      }
    },
  },

  // 分配维修工
  {
    url: '/api/app/ownerRepair.assignWorker',
    method: 'POST',
    delay: [200, 600],
    body: async ({ body }) => {
      await randomDelay(200, 600)

      try {
        if (!body.repairId) {
          return errorResponse('维修工单ID不能为空', '400')
        }
        if (!body.assignedWorker) {
          return errorResponse('维修工不能为空', '400')
        }

        const repair = mockRepairDatabase.getRepairById(body.repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', '404')
        }

        repair.assignedWorker = body.assignedWorker
        repair.status = RepairStatus.ASSIGNED
        repair.updateTime = new Date().toISOString()

        console.log('🚀 Mock API: assignWorker', body, '→', repair)
        return successResponse({
          ownerRepair: repair,
        }, '分配维修工成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: assignWorker', error)
        return errorResponse(error.message || '分配维修工失败')
      }
    },
  },

  // 维修工单统计
  {
    url: '/api/app/ownerRepair.getRepairStatistics',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)

      try {
        const params = { ...query, ...body }
        const allRepairs = mockRepairDatabase.repairs

        // 按状态统计
        const statusStats = Object.values(RepairStatus).reduce((acc, status) => {
          acc[status] = allRepairs.filter(repair => repair.status === status).length
          return acc
        }, {} as Record<string, number>)

        // 按类型统计
        const typeStats = allRepairs.reduce((acc, repair) => {
          acc[repair.repairType] = (acc[repair.repairType] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        // 月度统计
        const monthlyStats = allRepairs.reduce((acc, repair) => {
          const month = new Date(repair.createTime).toISOString().slice(0, 7) // YYYY-MM
          acc[month] = (acc[month] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        const statistics = {
          total: allRepairs.length,
          statusStats,
          typeStats,
          monthlyStats,
          avgResponseTime: '2.5小时',
          satisfactionRate: '95.8%',
        }

        console.log('🚀 Mock API: getRepairStatistics', params, '→', statistics)
        return successResponse(statistics, '获取维修统计数据成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: getRepairStatistics', error)
        return errorResponse(error.message || '获取维修统计数据失败')
      }
    },
  },

  // 维修工单评价
  {
    url: '/api/app/ownerRepair.evaluateRepair',
    method: 'POST',
    delay: [300, 600],
    body: async ({ body }) => {
      await randomDelay(300, 600)

      try {
        if (!body.repairId) {
          return errorResponse('维修工单ID不能为空', '400')
        }
        if (!body.rating || body.rating < 1 || body.rating > 5) {
          return errorResponse('评分必须在1-5之间', '400')
        }

        const repair = mockRepairDatabase.getRepairById(body.repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', '404')
        }

        // 添加评价信息
        repair.evaluation = {
          rating: body.rating,
          comment: body.comment || '',
          evaluateTime: new Date().toISOString(),
        }
        repair.updateTime = new Date().toISOString()

        console.log('🚀 Mock API: evaluateRepair', body, '→', repair)
        return successResponse({
          ownerRepair: repair,
        }, '维修工单评价成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: evaluateRepair', error)
        return errorResponse(error.message || '维修工单评价失败')
      }
    },
  },
])
