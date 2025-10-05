import type { PriorityType } from '@/types/api'
import type { RepairOrder, RepairStatus, RepairType } from '@/types/repair'
import { createPaginationResponse, defineUniAppMock, errorResponse, generateAddress, generateAmount, generateChineseName, generateId, generatePhoneNumber, randomDelay, successResponse } from './shared/utils'

/**
 * 维修模块 Mock 接口 - 完全自包含架构
 * 数据库对象 + 接口定义 + 数据生成器全部集成在此文件中
 */

// ==================== 维修数据生成器 ====================

/** 维修类型配置 */
const REPAIR_TYPES: RepairType[] = [
  '水电维修',
  '门窗维修',
  '空调维修',
  '电梯维修',
  '管道疏通',
  '墙面修补',
  '其他维修',
]

/** 维修状态配置 */
const REPAIR_STATUSES: RepairStatus[] = [
  'PENDING',
  'ASSIGNED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]

/** 生成维修描述 */
function generateRepairDescription(repairType: RepairType): string {
  const descriptions = {
    水电维修: [
      '卫生间水龙头漏水，需要更换密封圈',
      '客厅插座没电，怀疑是线路问题',
      '厨房热水器不出热水，需要检修',
      '阳台排水管堵塞，积水严重',
      '卧室开关失灵，灯光无法正常控制',
    ],
    门窗维修: [
      '入户门锁损坏，无法正常开启',
      '卧室窗户密封条老化，漏风严重',
      '阳台推拉门滑轨卡死，开关困难',
      '防盗门猫眼松动，存在安全隐患',
      '窗户玻璃有裂痕，需要更换',
    ],
    空调维修: [
      '客厅空调不制冷，怀疑缺氟',
      '卧室空调噪音过大，影响休息',
      '空调遥控器失灵，无法调节温度',
      '空调滤网长期未清洗，风量减小',
      '空调外机支架松动，存在安全风险',
    ],
    电梯维修: [
      '电梯按钮失灵，部分楼层无法到达',
      '电梯门关闭不严，存在安全隐患',
      '电梯运行时有异响，需要检查',
      '电梯停电后困人，应急系统故障',
      '电梯显示屏不亮，楼层显示不清',
    ],
    管道疏通: [
      '厨房下水道堵塞，污水倒灌',
      '卫生间马桶堵塞，无法正常使用',
      '阳台地漏堵塞，雨水无法排出',
      '洗手池下水慢，怀疑管道堵塞',
      '楼道排水管破裂，污水泄漏',
    ],
    墙面修补: [
      '客厅墙面开裂，影响美观',
      '卧室墙皮脱落，需要重新粉刷',
      '厨房瓷砖松动，存在脱落风险',
      '卫生间墙面渗水，怀疑防水层破损',
      '阳台墙面发霉，需要除霉处理',
    ],
    其他维修: [
      '楼道照明灯具损坏，影响出行安全',
      '小区健身器材故障，无法正常使用',
      '停车场地面破损，车辆容易受损',
      '小区门禁系统故障，业主无法刷卡',
      '消防设施损坏，存在安全隐患',
    ],
  }

  const typeDescriptions = descriptions[repairType] || descriptions['其他维修']
  return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)]
}

/** 核心维修数据生成器 */
function createMockRepair(id: string): RepairOrder {
  const repairType = REPAIR_TYPES[Math.floor(Math.random() * REPAIR_TYPES.length)]
  const status = REPAIR_STATUSES[Math.floor(Math.random() * REPAIR_STATUSES.length)]
  const priority = (['HIGH', 'MEDIUM', 'LOW'] as PriorityType[])[Math.floor(Math.random() * 3)]
  const now = Date.now()
  const randomDays = Math.floor(Math.random() * 30)

  return {
    repairId: `REP_${id}`,
    title: `${repairType} - ${generateChineseName()}的维修申请`,
    description: generateRepairDescription(repairType),
    ownerName: generateChineseName(),
    ownerPhone: generatePhoneNumber(),
    address: generateAddress(),
    repairType,
    status,
    priority,
    createTime: new Date(now - randomDays * 24 * 60 * 60 * 1000).toISOString(),
    updateTime: new Date().toISOString(),
    assignedWorker: status === 'PENDING' ? null : `维修工${Math.floor(Math.random() * 10 + 1)}`,
    estimatedCost: generateAmount(50, 500),
    actualCost: status === 'COMPLETED' ? generateAmount(40, 600) : null,
    images: Math.random() > 0.5 ? [`https://picsum.photos/400/300?random=${id}`] : [],
    communityId: 'COMM_001',
    evaluation: status === 'COMPLETED' && Math.random() > 0.3 ? {
      rating: Math.floor(Math.random() * 2) + 4, // 4-5星
      comment: ['服务很好，维修及时', '师傅很专业，问题解决了', '效率很高，满意', '态度不错'][Math.floor(Math.random() * 4)],
      evaluateTime: new Date().toISOString(),
    } : undefined,
  }
}

// ==================== 维修数据库对象 ====================

const mockRepairDatabase = {
  /** 初始化数据 */
  repairs: Array.from({ length: 50 }, (_, index) =>
    createMockRepair((index + 1).toString().padStart(3, '0'))) as RepairOrder[],

  /** 获取工单详情 */
  getRepairById(repairId: string): RepairOrder | undefined {
    return this.repairs.find(repair => repair.repairId === repairId)
  },

  /** 获取工单列表（支持筛选和分页） */
  getRepairList(params: {
    page: number
    row: number
    communityId?: string
    status?: RepairStatus
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

  /** 添加工单 */
  addRepair(repair: RepairOrder): RepairOrder {
    this.repairs.unshift(repair)
    return repair
  },

  /** 更新工单状态 */
  updateRepairStatus(repairId: string, status: RepairStatus, assignedWorker?: string): RepairOrder | null {
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

  /** 更新工单信息 */
  updateRepair(repairId: string, updateData: Partial<RepairOrder>): RepairOrder | null {
    const repair = this.getRepairById(repairId)
    if (repair) {
      Object.assign(repair, {
        ...updateData,
        updateTime: new Date().toISOString(),
      })
      return repair
    }
    return null
  },

  /** 删除工单 */
  deleteRepair(repairId: string): boolean {
    const index = this.repairs.findIndex(repair => repair.repairId === repairId)
    if (index !== -1) {
      this.repairs.splice(index, 1)
      return true
    }
    return false
  },
}

// ==================== Mock 接口定义 ====================

export default defineUniAppMock([
  /** 获取维修工单列表 */
  {
    url: '/app/ownerRepair.listOwnerRepairs',
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

  /** 获取维修工单详情 */
  {
    url: '/app/ownerRepair.queryOwnerRepair',
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

  /** 创建维修工单 */
  {
    url: '/app/ownerRepair.saveOwnerRepair',
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

        const newRepair: RepairOrder = {
          repairId: generateId('REP'),
          title: body.title,
          description: body.description,
          ownerName: body.ownerName,
          ownerPhone: body.ownerPhone,
          address: body.address,
          repairType: body.repairType || '其他维修',
          status: 'PENDING',
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

  /** 更新维修工单状态 */
  {
    url: '/app/ownerRepair.updateRepairStatus',
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
        const validStatuses: RepairStatus[] = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
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

  /** 分配维修工 */
  {
    url: '/app/ownerRepair.assignWorker',
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
        repair.status = 'ASSIGNED'
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

  /** 维修工单统计 */
  {
    url: '/app/ownerRepair.getRepairStatistics',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)

      try {
        const params = { ...query, ...body }
        const allRepairs = mockRepairDatabase.repairs

        // 按状态统计
        const statusStats: Record<RepairStatus, number> = {
          PENDING: allRepairs.filter(repair => repair.status === 'PENDING').length,
          ASSIGNED: allRepairs.filter(repair => repair.status === 'ASSIGNED').length,
          IN_PROGRESS: allRepairs.filter(repair => repair.status === 'IN_PROGRESS').length,
          COMPLETED: allRepairs.filter(repair => repair.status === 'COMPLETED').length,
          CANCELLED: allRepairs.filter(repair => repair.status === 'CANCELLED').length,
        }

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

        // 满意度统计
        const evaluatedRepairs = allRepairs.filter(repair => repair.evaluation)
        const avgRating = evaluatedRepairs.length > 0
          ? (evaluatedRepairs.reduce((sum, repair) => sum + (repair.evaluation?.rating || 0), 0) / evaluatedRepairs.length).toFixed(1)
          : '0'

        const statistics = {
          total: allRepairs.length,
          statusStats,
          typeStats,
          monthlyStats,
          avgResponseTime: '2.5小时',
          satisfactionRate: `${Math.round((evaluatedRepairs.filter(r => (r.evaluation?.rating || 0) >= 4).length / Math.max(evaluatedRepairs.length, 1)) * 100)}%`,
          avgRating: `${avgRating}分`,
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

  /** 维修工单评价 */
  {
    url: '/app/ownerRepair.evaluateRepair',
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

  /** 更新维修工单 */
  {
    url: '/app/ownerRepair.updateOwnerRepair',
    method: 'POST',
    delay: [400, 800],
    body: async ({ body }) => {
      await randomDelay(400, 800)

      try {
        if (!body.repairId) {
          return errorResponse('维修工单ID不能为空', '400')
        }

        const updatedRepair = mockRepairDatabase.updateRepair(body.repairId, body)
        if (!updatedRepair) {
          return errorResponse('维修工单不存在', '404')
        }

        console.log('🚀 Mock API: updateOwnerRepair', body, '→', updatedRepair)
        return successResponse({
          ownerRepair: updatedRepair,
        }, '更新维修工单成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: updateOwnerRepair', error)
        return errorResponse(error.message || '更新维修工单失败')
      }
    },
  },

  /** 删除维修工单 */
  {
    url: '/app/ownerRepair.deleteOwnerRepair',
    method: ['DELETE', 'POST'],
    delay: [300, 600],
    body: async ({ query, body }) => {
      await randomDelay(300, 600)

      const params = { ...query, ...body }

      try {
        if (!params.repairId) {
          return errorResponse('维修工单ID不能为空', '400')
        }

        const success = mockRepairDatabase.deleteRepair(params.repairId)
        if (!success) {
          return errorResponse('维修工单不存在', '404')
        }

        const result = { success: true }
        console.log('🚀 Mock API: deleteOwnerRepair', params, '→', result)
        return successResponse(result, '删除维修工单成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: deleteOwnerRepair', error)
        return errorResponse(error.message || '删除维修工单失败')
      }
    },
  },
])
