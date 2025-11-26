/**
 * 单元模块 Mock 接口
 * 包含：内联数据 + 数据库对象 + 接口定义
 */

import type { PaginationResponse } from '@/types/api'
import type { Unit, UnitQueryParams } from '@/types/selector'
import {
  createPaginationResponse,
  defineUniAppMock,
  errorResponse,
  mockLog,
  randomDelay,
  ResultEnumMap,
  successResponse,
} from './shared/utils'

// ==================== 单元数据生成器 ====================

/** 核心单元数据生成器 */
function createMockUnit(floorIndex: number, unitIndex: number): Unit {
  return {
    unitId: `U_${floorIndex}_${unitIndex}`,
    unitNum: `${unitIndex}`,
    floorId: `F_COMM_001_${floorIndex}`,
  }
}

// ==================== 单元数据库对象 ====================

const mockUnitDatabase = {
  /** 初始化数据 - 内联数据存储 */
  units: [] as Unit[],

  /** 初始化数据库 */
  init() {
    // 每栋楼生成6个单元（1-6单元）
    for (let floorIndex = 1; floorIndex <= 20; floorIndex++) {
      for (let unitIndex = 1; unitIndex <= 6; unitIndex++) {
        this.units.push(createMockUnit(floorIndex, unitIndex))
      }
    }
  },

  /** 获取单元详情 */
  getUnitById(unitId: string): Unit | undefined {
    return this.units.find(unit => unit.unitId === unitId)
  },

  /** 获取单元列表（支持筛选和分页） */
  getUnitList(params: UnitQueryParams): PaginationResponse<Unit> {
    let filteredUnits = [...this.units]

    // 按楼栋ID筛选
    if (params.floorId) {
      filteredUnits = filteredUnits.filter(unit => unit.floorId === params.floorId)
    }

    // 按单元编号模糊搜索
    if (params.unitNum) {
      const keyword = params.unitNum.toLowerCase()
      filteredUnits = filteredUnits.filter(unit =>
        unit.unitNum.toLowerCase().includes(keyword),
      )
    }

    return createPaginationResponse(
      filteredUnits,
      params.page || 1,
      params.row || 10,
    )
  },

  /** 根据楼栋ID获取单元列表 */
  getUnitsByFloorId(floorId: string): Unit[] {
    return this.units.filter(unit => unit.floorId === floorId)
  },

  /** 添加单元 */
  addUnit(unit: Unit): Unit {
    this.units.unshift(unit)
    return unit
  },

  /** 更新单元 */
  updateUnit(unitId: string, updateData: Partial<Unit>): Unit | null {
    const unit = this.getUnitById(unitId)
    if (unit) {
      Object.assign(unit, updateData)
      return unit
    }
    return null
  },

  /** 删除单元 */
  deleteUnit(unitId: string): boolean {
    const index = this.units.findIndex(unit => unit.unitId === unitId)
    if (index !== -1) {
      this.units.splice(index, 1)
      return true
    }
    return false
  },
}

// 初始化数据库
mockUnitDatabase.init()

// ==================== Mock 接口定义 ====================

export default defineUniAppMock([
  /** 1. 查询单元列表 */
  {
    url: '/app/unit.queryUnits',
    method: ['GET', 'POST'],
    delay: [300, 600],
    body: async ({ query, body }) => {
      await randomDelay(300, 600)
      const params = { ...query, ...body }

      try {
        const result = mockUnitDatabase.getUnitList({
          page: Number(params.page) || 1,
          row: Number(params.row) || 10,
          communityId: params.communityId,
          floorId: params.floorId,
          unitNum: params.unitNum,
        })

        mockLog('queryUnits', params, `→ ${result.list.length} items`)
        return successResponse(result, '查询成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: queryUnits', error)
        return errorResponse(error.message || '查询单元列表失败')
      }
    },
  },

  /** 2. 查询单元详情 */
  {
    url: '/app/unit.queryUnitDetail',
    method: ['GET', 'POST'],
    delay: [200, 400],
    body: async ({ query, body }) => {
      await randomDelay(200, 400)
      const params = { ...query, ...body }

      try {
        if (!params.unitId) {
          return errorResponse('单元ID不能为空', ResultEnumMap.Error)
        }

        const unit = mockUnitDatabase.getUnitById(params.unitId)
        if (!unit) {
          return errorResponse('单元不存在', ResultEnumMap.NotFound)
        }

        mockLog('queryUnitDetail', params.unitId, `→ ${unit.unitNum}单元`)
        return successResponse(unit, '查询成功')
      }
      catch (error: any) {
        console.error('❌ Mock API Error: queryUnitDetail', error)
        return errorResponse(error.message || '获取单元详情失败')
      }
    },
  },
])
