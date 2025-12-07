/**
 * 单元模块 Mock 接口
 * 包含：内联数据 + 数据库对象 + 接口定义
 */

import type { PaginationResponse } from '@/types/api'
import type { Unit, UnitQueryParams } from '@/types/selector'
import { COMMUNITY_OPTIONS } from '../../constants/common'
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

/**
 * 核心单元数据生成器
 * @param communityId - 社区ID
 * @param floorIndex - 楼栋序号
 * @param unitIndex - 单元序号
 * @returns 单元对象
 */
function createMockUnit(communityId: string, floorIndex: number, unitIndex: number): Unit {
  const floorId = `F_${communityId}_${floorIndex.toString().padStart(3, '0')}`
  return {
    unitId: `U_${communityId}_${floorIndex.toString().padStart(3, '0')}_${unitIndex.toString().padStart(2, '0')}`,
    unitNum: `${unitIndex}`,
    floorId,
    communityId,
  }
}

// ==================== 单元数据库对象 ====================

const mockUnitDatabase = {
  /** 初始化数据 - 内联数据存储 */
  units: [] as Unit[],

  /**
   * 初始化数据库
   * 每个社区每栋楼生成8个单元
   */
  init() {
    // 每个社区每栋楼生成8个单元（增加数据量）
    COMMUNITY_OPTIONS.forEach((community) => {
      for (let floorIndex = 1; floorIndex <= 30; floorIndex++) {
        for (let unitIndex = 1; unitIndex <= 8; unitIndex++) {
          this.units.push(createMockUnit(community.value as string, floorIndex, unitIndex))
        }
      }
    })
  },

  /**
   * 获取单元详情
   * @param unitId - 单元ID
   * @returns 单元对象或 undefined
   */
  getUnitById(unitId: string): Unit | undefined {
    return this.units.find(unit => unit.unitId === unitId)
  },

  /**
   * 获取单元列表（支持筛选和分页）
   * @param params - 查询参数
   * @returns 分页后的单元列表响应
   */
  getUnitList(params: UnitQueryParams): PaginationResponse<Unit> {
    let filteredUnits = [...this.units]

    // 按社区筛选
    if (params.communityId) {
      filteredUnits = filteredUnits.filter(unit => unit.communityId === params.communityId)
    }

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

  /**
   * 根据楼栋ID获取单元列表
   * @param floorId - 楼栋ID
   * @returns 单元数组
   */
  getUnitsByFloorId(floorId: string): Unit[] {
    return this.units.filter(unit => unit.floorId === floorId)
  },

  /**
   * 添加单元
   * @param unit - 单元对象
   * @returns 添加的单元对象
   */
  addUnit(unit: Unit): Unit {
    this.units.unshift(unit)
    return unit
  },

  /**
   * 更新单元
   * @param unitId - 单元ID
   * @param updateData - 更新的数据
   * @returns 更新后的单元对象或 null
   */
  updateUnit(unitId: string, updateData: Partial<Unit>): Unit | null {
    const unit = this.getUnitById(unitId)
    if (unit) {
      Object.assign(unit, updateData)
      return unit
    }
    return null
  },

  /**
   * 删除单元
   * @param unitId - 单元ID
   * @returns 删除成功返回 true，否则返回 false
   */
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

      mockLog('queryUnits', params)

      const result = mockUnitDatabase.getUnitList({
        page: Number(params.page) || 1,
        row: Number(params.row) || 10,
        communityId: params.communityId,
        floorId: params.floorId,
        unitNum: params.unitNum,
      })

      mockLog('queryUnits result', `${result.list.length} items`)
      return successResponse(result, '查询成功')
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

      mockLog('queryUnitDetail', params.unitId)

      if (!params.unitId) {
        return errorResponse('单元ID不能为空', ResultEnumMap.Error)
      }

      const unit = mockUnitDatabase.getUnitById(params.unitId)
      if (!unit) {
        return errorResponse('单元不存在', ResultEnumMap.NotFound)
      }

      mockLog('queryUnitDetail result', unit.unitNum)
      return successResponse(unit, '查询成功')
    },
  },
])
