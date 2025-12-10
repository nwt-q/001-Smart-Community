/**
 * 维修工单模块 Mock 接口
 * 包含：内联数据 + 数据库对象 + 接口定义
 */

import type { PriorityType } from '@/types/api'
import type { RepairListParams, RepairOrder, RepairStatus, RepairType } from '@/types/repair'
import dayjs from 'dayjs'
import {
  REPAIR_PAY_TYPE_OPTIONS,
  REPAIR_RESOURCE_TYPE_OPTIONS,
  REPAIR_STATUSES,
  REPAIR_TYPE_OPTIONS,
} from '../../constants/repair'
import {
  createPaginationResponse,
  defineUniAppMock,
  errorResponse,
  formatDateTime,
  generateAddress,
  generateAmount,
  generateChineseName,
  generateId,
  generatePhoneNumber,
  mockLog,
  randomDelay,
  ResultEnumMap,
  successResponse,
} from './shared/utils'

// ==================== 维修数据生成器 ====================

/** 生成维修描述 */
function generateRepairDescription(repairTypeName: string): string {
  const descriptions: Record<string, string[]> = {
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

  const typeDescriptions = descriptions[repairTypeName] || descriptions['其他维修']
  return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)]
}

/** 核心维修数据生成器 */
function createMockRepair(id: string): RepairOrder {
  const typeItem = REPAIR_TYPE_OPTIONS[Math.floor(Math.random() * REPAIR_TYPE_OPTIONS.length)]
  const statusItem = REPAIR_STATUSES[Math.floor(Math.random() * REPAIR_STATUSES.length)]
  const priority = (['HIGH', 'MEDIUM', 'LOW'] as PriorityType[])[Math.floor(Math.random() * 3)]
  const now = Date.now()
  const randomDays = Math.floor(Math.random() * 30)
  const address = generateAddress()
  const appointment = formatDateTime(dayjs(now).add(Math.floor(Math.random() * 7), 'day'))

  return {
    repairId: `REP_${id}`,
    repairType: typeItem.value as RepairType,
    repairTypeName: typeItem.label,
    context: generateRepairDescription(typeItem.label),
    repairName: generateChineseName(),
    tel: generatePhoneNumber(),
    address,
    repairObjName: address,
    appointmentTime: appointment,
    statusCd: statusItem.value as string,
    statusName: statusItem.label,
    priority,
    createTime: formatDateTime(dayjs(now).subtract(randomDays, 'day')),
    updateTime: formatDateTime(),
    assignedWorker: statusItem.value === '10001' ? null : `维修工${Math.floor(Math.random() * 10 + 1)}`,
    estimatedCost: generateAmount(50, 500),
    actualCost: statusItem.value === '10004' ? generateAmount(40, 600) : null,
    images: Math.random() > 0.5 ? [`https://picsum.photos/400/300?random=${id}`] : [],
    communityId: 'COMM_001',
    evaluation:
			statusItem.value === '10004' && Math.random() > 0.3
			  ? {
			      rating: Math.floor(Math.random() * 2) + 4, // 4-5星
			      comment: ['服务很好，维修及时', '师傅很专业，问题解决了', '效率很高，满意', '态度不错'][
			        Math.floor(Math.random() * 4)
			      ],
			      evaluateTime: formatDateTime(),
			    }
			  : undefined,
  }
}

/** 补齐列表展示必需字段，避免前端出现空白值 */
function normalizeRepairOrder(repair: RepairOrder): RepairOrder {
  const typeItem = REPAIR_TYPE_OPTIONS.find(item => item.value === repair.repairType)
  const statusItem = REPAIR_STATUSES.find(item => item.value === repair.statusCd)
  const normalizedTitle = (repair.title || '').trim()
  const nameFromTitle = normalizedTitle.includes('维修申请')
    ? normalizedTitle
        .replace(/^.*-\s*/, '')
        .replace(/的维修申请.*$/, '')
        .trim()
    : ''
  const typeFromTitle = normalizedTitle.split('-')[0]?.trim()

  const normalizedName = (repair.repairName || '').trim() || nameFromTitle || '未填写报修人'
  const normalizedTel = (repair.tel || (repair as any).ownerTel || (repair as any).phone || '').trim() || '未填写电话'

  return {
    ...repair,
    repairTypeName: repair.repairTypeName || typeItem?.label || typeFromTitle || '其他维修',
    statusName: repair.statusName || statusItem?.label || '待派单',
    repairName: normalizedName,
    tel: normalizedTel,
    repairObjName: repair.repairObjName || repair.address || '未填写位置',
    appointmentTime: repair.appointmentTime || repair.createTime || '',
    context: repair.context || normalizedTitle || '暂无报修内容',
  }
}

/** 确保列表项字段补齐，避免前端显示空白 */
function ensureNormalizedList(list: RepairOrder[]): RepairOrder[] {
  return list.map(normalizeRepairOrder)
}

// ==================== 维修数据库对象 ====================

const mockRepairDatabase = {
  /** 初始化数据 - 内联数据存储 */
  repairs: Array.from({ length: 60 }, (_, index) =>
    createMockRepair((index + 1).toString().padStart(3, '0'))) as RepairOrder[],

  /** 维修师傅数据 */
  staffs: [
    { staffId: 'STAFF_001', staffName: '张师傅', repairTypes: ['水电维修', '管道疏通'] },
    { staffId: 'STAFF_002', staffName: '李师傅', repairTypes: ['门窗维修', '墙面修补'] },
    { staffId: 'STAFF_003', staffName: '王师傅', repairTypes: ['空调维修', '电梯维修'] },
    { staffId: 'STAFF_004', staffName: '赵师傅', repairTypes: ['水电维修', '其他维修'] },
    { staffId: 'STAFF_005', staffName: '刘师傅', repairTypes: ['管道疏通', '墙面修补'] },
  ],

  /** 维修物品/资源数据 */
  resources: [
    {
      resId: 'RES_001',
      resName: '水龙头',
      resTypeName: '水电材料',
      specName: '普通型',
      price: 50,
      outLowPrice: 40,
      outHighPrice: 60,
      unit: '个',
      stock: 20,
    },
    {
      resId: 'RES_002',
      resName: '插座',
      resTypeName: '水电材料',
      specName: '五孔',
      price: 15,
      outLowPrice: 12,
      outHighPrice: 18,
      unit: '个',
      stock: 50,
    },
    {
      resId: 'RES_003',
      resName: '门锁',
      resTypeName: '五金材料',
      specName: '防盗型',
      price: 120,
      outLowPrice: 100,
      outHighPrice: 150,
      unit: '把',
      stock: 10,
    },
    {
      resId: 'RES_004',
      resName: '窗户密封条',
      resTypeName: '五金材料',
      specName: '隔音型',
      price: 30,
      outLowPrice: 25,
      outHighPrice: 35,
      unit: '米',
      stock: 100,
    },
    {
      resId: 'RES_005',
      resName: '空调氟利昂',
      resTypeName: '空调材料',
      specName: 'R410A',
      price: 200,
      outLowPrice: 180,
      outHighPrice: 220,
      unit: '瓶',
      stock: 5,
    },
    {
      resId: 'RES_006',
      resName: '瓷砖',
      resTypeName: '装修材料',
      specName: '釉面砖',
      price: 25,
      outLowPrice: 20,
      outHighPrice: 30,
      unit: '片',
      stock: 200,
    },
    {
      resId: 'RES_007',
      resName: '电线',
      resTypeName: '水电材料',
      specName: '2.5平方',
      price: 8,
      outLowPrice: 7,
      outHighPrice: 10,
      unit: '米',
      stock: 500,
    },
    {
      resId: 'RES_008',
      resName: '管道胶',
      resTypeName: '水电材料',
      specName: '防水型',
      price: 35,
      outLowPrice: 30,
      outHighPrice: 40,
      unit: '瓶',
      stock: 15,
    },
  ],

  /** 物资类型数据 */
  resourceTypes: REPAIR_RESOURCE_TYPE_OPTIONS.map(item => ({
    rstId: item.value as string,
    name: item.label,
    parentRstId: undefined,
  })),

  /** 维修设置配置（维修类型配置） */
  repairSettings: [
    {
      repairType: '1001',
      repairTypeName: '水电维修',
      payFeeFlag: 'T' as const,
      priceScope: '50-300元',
      publicArea: 'T' as const,
    },
    {
      repairType: '1002',
      repairTypeName: '门窗维修',
      payFeeFlag: 'T' as const,
      priceScope: '80-400元',
      publicArea: 'T' as const,
    },
    {
      repairType: '1003',
      repairTypeName: '空调维修',
      payFeeFlag: 'T' as const,
      priceScope: '100-500元',
      publicArea: 'T' as const,
    },
    {
      repairType: '1004',
      repairTypeName: '电梯维修',
      payFeeFlag: 'F' as const,
      priceScope: undefined,
      publicArea: 'T' as const,
    },
    {
      repairType: '1005',
      repairTypeName: '管道疏通',
      payFeeFlag: 'T' as const,
      priceScope: '60-200元',
      publicArea: 'F' as const,
    },
    {
      repairType: '1006',
      repairTypeName: '墙面修补',
      payFeeFlag: 'T' as const,
      priceScope: '40-250元',
      publicArea: 'F' as const,
    },
    {
      repairType: '1007',
      repairTypeName: '其他维修',
      payFeeFlag: 'T' as const,
      priceScope: '30-500元',
      publicArea: 'F' as const,
    },
  ],

  /** 维修状态字典 */
  repairStates: REPAIR_STATUSES.map(item => ({ statusCd: item.value, name: item.label })),

  /** 支付方式字典 */
  payTypes: REPAIR_PAY_TYPE_OPTIONS.map(item => ({ statusCd: item.value as string, name: item.label })),

  /** 获取工单详情 */
  getRepairById(repairId: string): RepairOrder | undefined {
    return this.repairs.find(repair => repair.repairId === repairId)
  },

  /** 获取工单列表（支持筛选和分页） */
  getRepairList(params: RepairListParams) {
    let filteredRepairs = [...this.repairs]

    // 状态筛选
    if (params.statusCd) {
      filteredRepairs = filteredRepairs.filter(repair => repair.statusCd === params.statusCd)
    }

    // 维修类型筛选
    if (params.repairType) {
      filteredRepairs = filteredRepairs.filter(repair => repair.repairType === params.repairType)
    }

    // 关键词筛选
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredRepairs = filteredRepairs.filter(
        repair =>
          (repair.context || '').toLowerCase().includes(keyword)
          || (repair.repairName || '').toLowerCase().includes(keyword)
          || (repair.tel || '').toLowerCase().includes(keyword)
          || (repair.address || '').toLowerCase().includes(keyword),
      )
    }

    // 日期范围筛选
    if (params.startDate) {
      filteredRepairs = filteredRepairs.filter(
        repair => dayjs(repair.createTime).valueOf() >= dayjs(params.startDate).valueOf(),
      )
    }
    if (params.endDate) {
      filteredRepairs = filteredRepairs.filter(
        repair => dayjs(repair.createTime).valueOf() <= dayjs(params.endDate).valueOf(),
      )
    }

    // 指派维修工筛选
    if (params.assignedWorker) {
      filteredRepairs = filteredRepairs.filter(repair => repair.assignedWorker === params.assignedWorker)
    }

    // 按创建时间倒序排序
    filteredRepairs.sort((a, b) => dayjs(b.createTime).valueOf() - dayjs(a.createTime).valueOf())

    const pagination = createPaginationResponse(filteredRepairs, params.page || 1, params.row || 10)

    return {
      ...pagination,
      list: ensureNormalizedList(pagination.list),
    }
  },

  /** 添加工单 */
  addRepair(repair: RepairOrder): RepairOrder {
    this.repairs.unshift(repair)
    return repair
  },

  /** 更新工单 */
  updateRepair(repairId: string, updateData: Partial<RepairOrder>): RepairOrder | null {
    const repair = this.getRepairById(repairId)
    if (repair) {
      Object.assign(repair, {
        ...updateData,
        updateTime: formatDateTime(),
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

  /** 获取待办单列表（ASSIGNED 和 IN_PROGRESS 状态） */
  getDispatchList(params: RepairListParams) {
    const result = this.getRepairList(params)

    // 只返回 已派单/处理中 状态的工单，支持按传入的 statusCd 精确过滤
    const allowedStatus = ['10002', '10003']
    result.list = result.list.filter((repair) => {
      const isAllowed = allowedStatus.includes(repair.statusCd || '')
      const matchFilter = params.statusCd ? repair.statusCd === params.statusCd : true
      return isAllowed && matchFilter
    })
    result.total = result.list.length

    return result
  },

  /** 获取已办单列表（COMPLETED 状态） */
  getFinishList(params: RepairListParams) {
    return this.getRepairList({
      ...params,
      statusCd: '10004',
    })
  },

  /** 根据维修类型获取维修师傅 */
  getRepairStaffsByType(repairType: string) {
    return this.staffs.filter(staff => staff.repairTypes.includes(repairType))
  },

  /** 获取维修设置配置列表，支持筛选和分页 */
  getRepairSettings(params: { communityId?: string, publicArea?: string, page?: number, row?: number }) {
    let settings = [...this.repairSettings]

    // 按公共区域筛选
    if (params.publicArea) {
      settings = settings.filter(setting => setting.publicArea === params.publicArea)
    }

    // 分页处理
    const page = Number(params.page) || 1
    const row = Number(params.row) || 10
    const start = (page - 1) * row
    const end = start + row

    return {
      list: settings.slice(start, end),
      total: settings.length,
      page,
      pageSize: row,
    }
  },

  /** 根据 rstId 获取物资类型名称 */
  getResourceTypeName(rstId: string) {
    const type = this.resourceTypes.find(t => t.rstId === rstId)
    return type ? type.name : '未知类型'
  },

  /** 根据 rstId 获取物资列表 */
  getResourcesByType(rstId: string) {
    const typeName = this.getResourceTypeName(rstId)
    return this.resources.filter(res => res.resTypeName === typeName)
  },
}

// ==================== Mock 接口定义 ====================

export default defineUniAppMock([
  /** 1. 获取维修工单列表（工单池） */
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
          statusCd: params.statusCd || params.status,
          repairType: params.repairType,
          keyword: params.keyword,
          startDate: params.startDate,
          endDate: params.endDate,
          assignedWorker: params.assignedWorker,
        })

        const normalizedList = ensureNormalizedList(result.list)

        mockLog('listOwnerRepairs', params, `→ ${normalizedList.length} items`)
        return successResponse(
          {
            ownerRepairs: normalizedList,
            total: result.total,
            page: result.page,
            row: result.pageSize,
          },
          '查询成功',
        )
      }
      catch (error: any) {
        console.error('❌ Mock API Error: listOwnerRepairs', error)
        return errorResponse(error.message || '查询维修工单列表失败')
      }
    },
  },

  /** 2. 获取维修待办单列表 */
  {
    url: '/app/ownerRepair.listStaffRepairs',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: async ({ query, body }) => {
      await randomDelay(300, 800)
      const params = { ...query, ...body }

      try {
        const result = mockRepairDatabase.getDispatchList({
          page: Number(params.page) || 1,
          row: Number(params.row) || 10,
          communityId: params.communityId,
          keyword: params.keyword,
          statusCd: params.statusCd || params.status,
        })

        const normalizedList = ensureNormalizedList(result.list)

        mockLog('listStaffRepairs', params, `→ ${normalizedList.length} items`)
        return successResponse(
          {
            ownerRepairs: normalizedList,
            total: normalizedList.length,
            page: result.page,
            row: result.pageSize,
          },
          '查询成功',
        )
      }
      catch (error: any) {
        console.error('❌ Mock API Error: listStaffRepairs', error)
        return errorResponse(error.message || '查询待办单列表失败')
      }
    },
  },

  /** 3. 获取维修已办单列表 */
  {
    url: '/app/ownerRepair.listStaffFinishRepairs',
    method: ['GET', 'POST'],
    delay: [300, 800],
    body: async ({ query, body }) => {
      await randomDelay(300, 800)
      const params = { ...query, ...body }

      try {
        const result = mockRepairDatabase.getFinishList({
          page: Number(params.page) || 1,
          row: Number(params.row) || 10,
          communityId: params.communityId,
          keyword: params.keyword,
        })

        const normalizedList = ensureNormalizedList(result.list)

        mockLog('listStaffFinishRepairs', params, `→ ${normalizedList.length} items`)
        return successResponse(
          {
            ownerRepairs: normalizedList,
            total: result.total,
            page: result.page,
            row: result.pageSize,
          },
          '查询成功',
        )
      }
      catch (error: any) {
        console.error('❌ Mock API Error: listStaffFinishRepairs', error)
        return errorResponse(error.message || '查询已办单列表失败')
      }
    },
  },

  /** 4. 获取维修工单详情 */
  {
    url: '/app/ownerRepair.queryOwnerRepair',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)
      const params = { ...query, ...body }

      try {
        if (!params.repairId) {
          return errorResponse('维修工单ID不能为空', ResultEnumMap.Error)
        }

        const repair = mockRepairDatabase.getRepairById(params.repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', ResultEnumMap.NotFound)
        }

        const normalizedRepair = normalizeRepairOrder(repair)

        mockLog('queryOwnerRepair', params.repairId, `→ ${normalizedRepair.repairName || normalizedRepair.repairId}`)
        return successResponse({ ownerRepair: normalizedRepair }, '查询成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: queryOwnerRepair', error)
        return errorResponse(error.message || '获取工单详情失败')
      }
    },
  },

  /** 5. 创建维修工单 */
  {
    url: '/app/ownerRepair.saveOwnerRepair',
    method: 'POST',
    delay: [500, 1200],
    body: async ({ body }) => {
      await randomDelay(500, 1200)

      try {
        const title = (body.title ?? '').trim()
        const context = (body.context ?? '').trim()
        const repairName = (body.repairName ?? '').trim()
        const tel = (body.tel ?? '').trim()
        const address = (body.address ?? '').trim()
        const images = Array.isArray(body.photos) ? body.photos.filter(Boolean) : []

        // 数据验证
        if (!title) {
          return errorResponse('维修标题不能为空', ResultEnumMap.Error)
        }
        if (!context) {
          return errorResponse('维修描述不能为空', ResultEnumMap.Error)
        }
        if (!repairName) {
          return errorResponse('业主姓名不能为空', ResultEnumMap.Error)
        }
        if (!tel) {
          return errorResponse('联系电话不能为空', ResultEnumMap.Error)
        }
        if (!address) {
          return errorResponse('维修地址不能为空', ResultEnumMap.Error)
        }

        const newRepair: RepairOrder = {
          repairId: generateId('REP'),
          title,
          context,
          repairName,
          tel,
          address,
          repairType: body.repairType || '1007',
          repairTypeName: body.repairTypeName || '其他维修',
          statusCd: '10001',
          statusName: '待派单',
          priority: body.priority || 'MEDIUM',
          createTime: formatDateTime(),
          updateTime: formatDateTime(),
          assignedWorker: null,
          estimatedCost: body.estimatedCost || 0,
          actualCost: null,
          images,
          communityId: body.communityId || 'COMM_001',
        }

        mockRepairDatabase.addRepair(newRepair)
        mockLog('saveOwnerRepair', title, `→ ${newRepair.repairId}`)
        return successResponse({ ownerRepair: newRepair }, '创建维修工单成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: saveOwnerRepair', error)
        return errorResponse(error.message || '创建维修工单失败')
      }
    },
  },

  /** 6. 更新维修工单 */
  {
    url: '/app/ownerRepair.updateOwnerRepair',
    method: 'POST',
    delay: [400, 800],
    body: async ({ body }) => {
      await randomDelay(400, 800)

      try {
        if (!body.repairId) {
          return errorResponse('维修工单ID不能为空', ResultEnumMap.Error)
        }

        const updatedRepair = mockRepairDatabase.updateRepair(body.repairId, body)
        if (!updatedRepair) {
          return errorResponse('维修工单不存在', ResultEnumMap.NotFound)
        }

        mockLog('updateOwnerRepair', body.repairId, '→ 更新成功')
        return successResponse({ ownerRepair: updatedRepair }, '更新维修工单成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: updateOwnerRepair', error)
        return errorResponse(error.message || '更新维修工单失败')
      }
    },
  },

  /** 7. 派单/转单/退单 */
  {
    url: '/app/ownerRepair.repairDispatch',
    method: 'POST',
    delay: [300, 700],
    body: async ({ body }) => {
      await randomDelay(300, 700)

      try {
        if (!body.repairId) {
          return errorResponse('维修工单ID不能为空', ResultEnumMap.Error)
        }
        if (!body.action) {
          return errorResponse('操作类型不能为空', ResultEnumMap.Error)
        }
        if (!body.staffId && body.action !== 'RETURN') {
          return errorResponse('维修师傅不能为空', ResultEnumMap.Error)
        }

        const repair = mockRepairDatabase.getRepairById(body.repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', ResultEnumMap.NotFound)
        }

        // 根据不同操作更新状态
        if (body.action === 'DISPATCH' || body.action === 'TRANSFER') {
          repair.statusCd = '10002'
          repair.statusName = '已派单'
          repair.assignedWorker = body.staffName
        }
        else if (body.action === 'RETURN') {
          repair.statusCd = '10001'
          repair.statusName = '待派单'
          repair.assignedWorker = null
        }

        repair.updateTime = formatDateTime()

        mockLog('repairDispatch', body.action, `→ ${body.repairId}`)
        return successResponse(
          { success: true },
          `${body.action === 'DISPATCH' ? '派单' : body.action === 'TRANSFER' ? '转单' : '退单'}成功`,
        )
      }
      catch (error: any) {
        console.error('❌ Mock API Error: repairDispatch', error)
        return errorResponse(error.message || '操作失败')
      }
    },
  },

  /** 8. 办结工单 */
  {
    url: '/app/ownerRepair.repairFinish',
    method: 'POST',
    delay: [500, 1000],
    body: async ({ body }) => {
      await randomDelay(500, 1000)

      try {
        if (!body.repairId) {
          return errorResponse('维修工单ID不能为空', ResultEnumMap.Error)
        }
        if (!body.feeFlag) {
          return errorResponse('请选择维修类型', ResultEnumMap.Error)
        }
        if (!body.context) {
          return errorResponse('请填写处理意见', ResultEnumMap.Error)
        }

        const repair = mockRepairDatabase.getRepairById(body.repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', ResultEnumMap.NotFound)
        }

        // 更新工单状态为已完成
        repair.statusCd = '10004'
        repair.statusName = '已完成'
        repair.actualCost = body.totalPrice || repair.estimatedCost
        repair.updateTime = formatDateTime()

        mockLog('repairFinish', body.repairId, '→ 办结成功')
        return successResponse({ success: true }, '办结工单成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: repairFinish', error)
        return errorResponse(error.message || '办结工单失败')
      }
    },
  },

  /** 9. 结束订单 */
  {
    url: '/app/ownerRepair.repairEnd',
    method: 'POST',
    delay: [300, 600],
    body: async ({ body }) => {
      await randomDelay(300, 600)

      try {
        if (!body.repairId) {
          return errorResponse('维修工单ID不能为空', ResultEnumMap.Error)
        }

        const repair = mockRepairDatabase.getRepairById(body.repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', ResultEnumMap.NotFound)
        }

        // 更新工单状态为已取消
        repair.statusCd = '10005'
        repair.statusName = '已取消'
        repair.updateTime = formatDateTime()

        mockLog('repairEnd', body.repairId, '→ 结束成功')
        return successResponse({ success: true }, '结束订单成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: repairEnd', error)
        return errorResponse(error.message || '结束订单失败')
      }
    },
  },

  /** 10. 回访工单 */
  {
    url: '/callComponent/ownerRepair.appraiseRepair',
    method: 'POST',
    delay: [300, 600],
    body: async ({ body }) => {
      await randomDelay(300, 600)

      try {
        if (!body.repairId) {
          return errorResponse('维修工单ID不能为空', ResultEnumMap.Error)
        }
        if (!body.context) {
          return errorResponse('请填写评价内容', ResultEnumMap.Error)
        }

        const repair = mockRepairDatabase.getRepairById(body.repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', ResultEnumMap.NotFound)
        }

        // 添加评价信息
        repair.evaluation = {
          rating: 5, // 默认5星
          comment: body.context,
          evaluateTime: formatDateTime(),
        }
        repair.updateTime = formatDateTime()

        mockLog('appraiseRepair', body.repairId, '→ 评价成功')
        return successResponse({ success: true }, '评价成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: appraiseRepair', error)
        return errorResponse(error.message || '评价失败')
      }
    },
  },

  /** 11. 回复评价 */
  {
    url: '/app/repair.replyRepairAppraise',
    method: 'POST',
    delay: [200, 500],
    body: async ({ body }) => {
      await randomDelay(200, 500)

      try {
        if (!body.repairId) {
          return errorResponse('维修工单ID不能为空', ResultEnumMap.Error)
        }
        if (!body.reply) {
          return errorResponse('请填写回复内容', ResultEnumMap.Error)
        }

        const repair = mockRepairDatabase.getRepairById(body.repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', ResultEnumMap.NotFound)
        }

        mockLog('replyRepairAppraise', body.repairId, '→ 回复成功')
        return successResponse({ success: true }, '回复成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: replyRepairAppraise', error)
        return errorResponse(error.message || '回复失败')
      }
    },
  },

  /** 12. 查询维修师傅列表 */
  {
    url: '/app/ownerRepair.listRepairStaffs',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)
      const params = { ...query, ...body }

      try {
        let staffs = [...mockRepairDatabase.staffs]

        // 按维修类型筛选
        if (params.repairType) {
          staffs = staffs.filter(staff => staff.repairTypes.includes(params.repairType))
        }

        mockLog('listRepairStaffs', params, `→ ${staffs.length} items`)
        return successResponse({ staffs }, '查询成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: listRepairStaffs', error)
        return errorResponse(error.message || '查询师傅列表失败')
      }
    },
  },

  /** 13. 查询报修师傅（按类型） */
  {
    url: '/app/repair.listRepairTypeUsers',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)
      const params = { ...query, ...body }

      try {
        let staffs = [...mockRepairDatabase.staffs]

        if (params.repairType) {
          staffs = staffs.filter(staff => staff.repairTypes.includes(params.repairType))
        }

        const users = staffs.map(staff => ({
          userId: staff.staffId,
          userName: staff.staffName,
        }))

        mockLog('listRepairTypeUsers', params, `→ ${users.length} items`)
        return successResponse({ users }, '查询成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: listRepairTypeUsers', error)
        return errorResponse(error.message || '查询师傅列表失败')
      }
    },
  },

  /** 14. 查询维修物品/资源 */
  {
    url: '/app/resourceStore.listUserStorehouses',
    method: ['GET', 'POST'],
    delay: [200, 600],
    body: async ({ query, body }) => {
      await randomDelay(200, 600)
      const params = { ...query, ...body }

      try {
        let resources = [...mockRepairDatabase.resources]

        // 关键词筛选
        if (params.keyword) {
          const keyword = params.keyword.toLowerCase()
          resources = resources.filter(
            res => res.resName.toLowerCase().includes(keyword) || res.resTypeName.toLowerCase().includes(keyword),
          )
        }

        // 分页
        const page = Number(params.page) || 1
        const row = Number(params.row) || 20
        const result = createPaginationResponse(resources, page, row)

        mockLog('listUserStorehouses', params, `→ ${result.list.length} items`)
        return successResponse(
          {
            resources: result.list,
            total: result.total,
          },
          '查询成功',
        )
      }
      catch (error: any) {
        console.error('❌ Mock API Error: listUserStorehouses', error)
        return errorResponse(error.message || '查询物品列表失败')
      }
    },
  },

  /** 15. 获取维修统计数据 */
  {
    url: '/app/ownerRepair.getRepairStatistics',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)

      try {
        const allRepairs = mockRepairDatabase.repairs

        // 按状态统计
        const statusStats: Record<RepairStatus, number> = allRepairs.reduce(
          (acc, repair) => {
            const code = repair.statusCd || 'UNKNOWN'
            acc[code] = (acc[code] || 0) + 1
            return acc
          },
          {} as Record<RepairStatus, number>,
        )

        // 按类型统计
        const typeStats = allRepairs.reduce(
          (acc, repair) => {
            acc[repair.repairType] = (acc[repair.repairType] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )

        // 月度统计
        const monthlyStats = allRepairs.reduce(
          (acc, repair) => {
            const month = dayjs(repair.createTime).format('YYYY-MM')
            acc[month] = (acc[month] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )

        // 满意度统计
        const evaluatedRepairs = allRepairs.filter(r => r.evaluation)
        const satisfactionRate
          = evaluatedRepairs.length > 0
            ? `${Math.round((evaluatedRepairs.filter(r => (r.evaluation?.rating || 0) >= 4).length / evaluatedRepairs.length) * 100)}%`
            : '0%'

        const statistics = {
          total: allRepairs.length,
          statusStats,
          typeStats,
          monthlyStats,
          avgResponseTime: '2.5小时',
          satisfactionRate,
        }

        mockLog('getRepairStatistics', '→ 统计成功')
        return successResponse(statistics, '获取统计数据成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: getRepairStatistics', error)
        return errorResponse(error.message || '获取统计数据失败')
      }
    },
  },

  /** 16. 查询维修相关配置信息和物资类型（支持 parentId 参数） */
  {
    url: '/app/resourceStoreType.listResourceStoreTypes',
    method: ['GET', 'POST'],
    delay: [200, 400],
    body: async ({ query, body }) => {
      await randomDelay(200, 400)

      try {
        const params = { ...query, ...body }
        let resourceStoreTypes = [...mockRepairDatabase.resourceTypes]

        // 如果提供了 parentId，筛选子类型（树形结构查询）
        if (params.parentId) {
          resourceStoreTypes = resourceStoreTypes.filter(type => type.parentRstId === params.parentId)
        }

        mockLog('listResourceStoreTypes', params, `→ ${resourceStoreTypes.length} items`)
        return successResponse({ resourceStoreTypes }, '查询成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: listResourceStoreTypes', error)
        return errorResponse(error.message || '查询配置失败')
      }
    },
  },

  /** 17. 获取报修类型配置列表 */
  {
    url: '/app/repairSetting.listRepairSettings',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)

      try {
        const params = { ...query, ...body }
        let settings = [...mockRepairDatabase.repairSettings]

        // 按公共区域筛选
        if (params.publicArea) {
          settings = settings.filter(setting => setting.publicArea === params.publicArea)
        }

        // 分页处理
        const page = Number(params.page) || 1
        const row = Number(params.row) || 10
        const start = (page - 1) * row
        const end = start + row
        const paginatedSettings = settings.slice(start, end)

        mockLog('listRepairSettings', params, `→ ${paginatedSettings.length} items`)
        return successResponse(paginatedSettings, '查询成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: listRepairSettings', error)
        return errorResponse(error.message || '查询报修配置失败')
      }
    },
  },

  /** 18. 查询字典数据 */
  {
    url: '/callComponent/core/list',
    method: ['GET', 'POST'],
    delay: [200, 400],
    body: async ({ query, body }) => {
      await randomDelay(200, 400)
      const params = { ...query, ...body }

      try {
        // 模拟不同域的字典数据
        const dictData: Record<string, Array<{ statusCd: string, name: string }>> = {
          repair_status: [
            { statusCd: 'PENDING', name: '待派单' },
            { statusCd: 'ASSIGNED', name: '已派单' },
            { statusCd: 'IN_PROGRESS', name: '处理中' },
            { statusCd: 'COMPLETED', name: '已完成' },
            { statusCd: 'CANCELLED', name: '已取消' },
          ],
          repair_type: [
            { statusCd: '1001', name: '水电维修' },
            { statusCd: '1002', name: '门窗维修' },
            { statusCd: '1003', name: '空调维修' },
            { statusCd: '1004', name: '电梯维修' },
            { statusCd: '1005', name: '管道疏通' },
            { statusCd: '1006', name: '墙面修补' },
            { statusCd: '1007', name: '其他维修' },
          ],
          maintenance_type: [
            { statusCd: '1001', name: '有偿用料' },
            { statusCd: '1002', name: '无偿用料' },
            { statusCd: '1003', name: '有偿不用料' },
            { statusCd: '1004', name: '无偿不用料' },
          ],
        }

        const data = dictData[params.domain] || []

        mockLog('queryDictInfo', params.domain, `→ ${data.length} items`)
        return successResponse({ data }, '查询成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: queryDictInfo', error)
        return errorResponse(error.message || '查询字典失败')
      }
    },
  },

  /** 19. 开始维修 */
  {
    url: '/app/ownerRepair.repairStart',
    method: 'POST',
    delay: [200, 500],
    body: async ({ body }) => {
      await randomDelay(200, 500)

      try {
        if (!body.repairId) {
          return errorResponse('维修工单ID不能为空', ResultEnumMap.Error)
        }

        const repair = mockRepairDatabase.getRepairById(body.repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', ResultEnumMap.NotFound)
        }

        repair.statusCd = '10003'
        repair.statusName = '处理中'
        repair.updateTime = formatDateTime()

        mockLog('repairStart', body.repairId, '→ 开始维修')
        return successResponse({ success: true }, '开始维修成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: repairStart', error)
        return errorResponse(error.message || '开始维修失败')
      }
    },
  },

  /** 20. 暂停维修 */
  {
    url: '/app/ownerRepair.repairStop',
    method: 'POST',
    delay: [200, 500],
    body: async ({ body }) => {
      await randomDelay(200, 500)

      try {
        if (!body.repairId) {
          return errorResponse('维修工单ID不能为空', ResultEnumMap.Error)
        }

        const repair = mockRepairDatabase.getRepairById(body.repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', ResultEnumMap.NotFound)
        }

        repair.statusCd = '10002'
        repair.statusName = '已派单'
        repair.updateTime = formatDateTime()

        mockLog('repairStop', body.repairId, '→ 暂停维修')
        return successResponse({ success: true }, '暂停维修成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: repairStop', error)
        return errorResponse(error.message || '暂停维修失败')
      }
    },
  },

  /** 21. 抢单 */
  {
    url: '/app/ownerRepair.grabbingRepair',
    method: 'POST',
    delay: [300, 600],
    body: async ({ body }) => {
      await randomDelay(300, 600)

      try {
        if (!body.repairId) {
          return errorResponse('维修工单ID不能为空', ResultEnumMap.Error)
        }
        if (!body.staffId) {
          return errorResponse('维修师傅不能为空', ResultEnumMap.Error)
        }

        const repair = mockRepairDatabase.getRepairById(body.repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', ResultEnumMap.NotFound)
        }

        if (repair.statusCd !== '10001') {
          return errorResponse('该工单已被抢单', ResultEnumMap.Error)
        }

        repair.statusCd = '10002'
        repair.statusName = '已派单'
        repair.assignedWorker = body.staffName
        repair.updateTime = formatDateTime()

        mockLog('grabbingRepair', body.repairId, `→ ${body.staffName} 抢单成功`)
        return successResponse({ success: true }, '抢单成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: grabbingRepair', error)
        return errorResponse(error.message || '抢单失败')
      }
    },
  },

  /** 22. 查询维修状态字典 */
  {
    url: '/app/dict.queryRepairStates',
    method: ['GET', 'POST'],
    delay: [200, 400],
    body: async () => {
      await randomDelay(200, 400)

      try {
        const states = mockRepairDatabase.repairStates

        mockLog('queryRepairStates', `→ ${states.length} items`)
        return successResponse(states, '查询成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: queryRepairStates', error)
        return errorResponse(error.message || '查询维修状态失败')
      }
    },
  },

  /** 23. 查询工单流转记录 */
  {
    url: '/app/ownerRepair.listRepairStaffRecords',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)
      const params = { ...query, ...body }

      try {
        if (!params.repairId) {
          return errorResponse('维修工单ID不能为空', ResultEnumMap.Error)
        }

        const repair = mockRepairDatabase.getRepairById(params.repairId)
        if (!repair) {
          return errorResponse('维修工单不存在', ResultEnumMap.NotFound)
        }

        // 模拟工单流转记录
        const staffRecords: Array<{
          ruId: string
          repairId: string
          staffId: string
          staffName: string
          statusCd: string
          statusName: string
          startTime: string
          endTime?: string
          context?: string
        }> = [
          {
            ruId: 'RU_001',
            repairId: params.repairId,
            staffId: 'STAFF_001',
            staffName: '张师傅',
            statusCd: '10001',
            statusName: '待派单',
            startTime: repair.createTime,
            endTime: repair.statusCd !== '10001' ? formatDateTime(dayjs(repair.createTime).add(1, 'hour')) : undefined,
            context: '工单已创建',
          },
        ]

        if (repair.statusCd === '10002' || repair.statusCd === '10003' || repair.statusCd === '10004') {
          staffRecords.push({
            ruId: 'RU_002',
            repairId: params.repairId,
            staffId: 'STAFF_002',
            staffName: repair.assignedWorker || '李师傅',
            statusCd: '10002',
            statusName: '已派单',
            startTime: formatDateTime(dayjs(repair.createTime).add(1, 'hour')),
            endTime: repair.statusCd !== '10002' ? formatDateTime(dayjs(repair.createTime).add(2, 'hour')) : undefined,
            context: '已派单给维修师傅',
          })
        }

        if (repair.statusCd === '10003' || repair.statusCd === '10004') {
          staffRecords.push({
            ruId: 'RU_003',
            repairId: params.repairId,
            staffId: 'STAFF_002',
            staffName: repair.assignedWorker || '李师傅',
            statusCd: '10003',
            statusName: '处理中',
            startTime: formatDateTime(dayjs(repair.createTime).add(2, 'hour')),
            endTime: repair.statusCd === '10004' ? formatDateTime(dayjs(repair.createTime).add(3, 'hour')) : undefined,
            context: '正在处理维修问题',
          })
        }

        if (repair.statusCd === '10004') {
          staffRecords.push({
            ruId: 'RU_004',
            repairId: params.repairId,
            staffId: 'STAFF_002',
            staffName: repair.assignedWorker || '李师傅',
            statusCd: '10004',
            statusName: '已完成',
            startTime: formatDateTime(dayjs(repair.createTime).add(3, 'hour')),
            endTime: formatDateTime(dayjs(repair.createTime).add(3, 'hour')),
            context: '维修已完成，问题已解决',
          })

          if (repair.evaluation) {
            staffRecords.push({
              ruId: 'RU_005',
              repairId: params.repairId,
              staffId: 'STAFF_002',
              staffName: repair.assignedWorker || '李师傅',
              statusCd: '10007',
              statusName: '业主评价',
              startTime: repair.evaluation.evaluateTime,
              endTime: repair.evaluation.evaluateTime,
              context: repair.evaluation.comment,
            })
          }
        }

        mockLog('listRepairStaffRecords', params.repairId, `→ ${staffRecords.length} items`)
        return successResponse({ staffRecords }, '查询成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: listRepairStaffRecords', error)
        return errorResponse(error.message || '查询流转记录失败')
      }
    },
  },

  /** 24. 查询支付方式字典 */
  {
    url: '/app/dict.queryPayTypes',
    method: ['GET', 'POST'],
    delay: [200, 400],
    body: async () => {
      await randomDelay(200, 400)

      try {
        const payTypes = mockRepairDatabase.payTypes

        mockLog('queryPayTypes', `→ ${payTypes.length} items`)
        return successResponse(payTypes, '查询成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: queryPayTypes', error)
        return errorResponse(error.message || '查询支付方式失败')
      }
    },
  },

  /** 25. 查询维修物资 */
  {
    url: '/app/resourceStore.listResources',
    method: ['GET', 'POST'],
    delay: [200, 600],
    body: async ({ query, body }) => {
      await randomDelay(200, 600)
      const params = { ...query, ...body }

      try {
        let resources = [...mockRepairDatabase.resources]

        // 按资源类型筛选
        if (params.rstId) {
          const resourceType = mockRepairDatabase.resourceTypes.find(type => type.rstId === params.rstId)
          if (resourceType) {
            resources = resources.filter(res => res.resTypeName === resourceType.name)
          }
        }

        mockLog('listResources', params, `→ ${resources.length} items`)
        return successResponse(
          {
            resources,
            total: resources.length,
          },
          '查询成功',
        )
      }
      catch (error: any) {
        console.error('❌ Mock API Error: listResources', error)
        return errorResponse(error.message || '查询物资失败')
      }
    },
  },
])
