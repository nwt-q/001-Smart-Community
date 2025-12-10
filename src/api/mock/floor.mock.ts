/**
 * 楼栋模块 Mock 接口
 * 功能：模拟楼栋数据，支持分页和搜索
 * 包含：内联数据 + 数据库对象 + 接口定义
 */

import type { Floor } from '@/types/selector'
import { COMMUNITY_OPTIONS } from '../../constants/common'
import { BUILDING_NAME_OPTIONS } from '../../constants/floor'
import { defineUniAppMock, errorResponse, mockLog, randomDelay, ResultEnumMap, successResponse } from './shared/utils'

// ==================== 楼栋数据生成器 ====================

/** Mock 楼栋数据库对象 */
const mockFloorDatabase = {
  /** 楼栋数据存储 */
  floors: [] as Floor[],

  /**
   * 初始化楼栋数据
   * 如果数据为空则生成初始数据
   */
  initFloors() {
    if (this.floors.length === 0) {
      this.floors = this.generateFloorList()
    }
  },

  /**
   * 生成楼栋列表（每个社区生成30栋）
   * @returns 生成的楼栋数据数组
   */
  generateFloorList(): Floor[] {
    const floors: Floor[] = []

    COMMUNITY_OPTIONS.forEach((community) => {
      for (let i = 1; i <= 30; i++) {
        const buildingItem = BUILDING_NAME_OPTIONS[Math.floor(Math.random() * BUILDING_NAME_OPTIONS.length)]
        floors.push({
          floorId: `F_${community.value}_${i.toString().padStart(3, '0')}`,
          floorNum: i.toString(),
          floorName: `${i}${buildingItem.label}`,
          communityId: community.value as string,
        })
      }
    })

    return floors
  },

  /**
   * 根据条件筛选楼栋
   * @param params - 筛选条件
   * @param params.communityId - 社区ID
   * @param params.floorNum - 楼栋编号
   * @param params.keyword - 搜索关键词
   * @returns 筛选后的楼栋数组
   */
  filterFloors(params: { communityId?: string, floorNum?: string, keyword?: string }): Floor[] {
    return this.floors.filter((floor) => {
      const matchCommunity = !params.communityId || floor.communityId === params.communityId
      const matchFloorNum = !params.floorNum || floor.floorNum.includes(params.floorNum)
      const matchKeyword
        = !params.keyword || floor.floorName.includes(params.keyword) || floor.floorNum.includes(params.keyword)

      return matchCommunity && matchFloorNum && matchKeyword
    })
  },

  /**
   * 根据ID查询楼栋
   * @param floorId - 楼栋ID
   * @returns 楼栋对象或 undefined
   */
  getFloorById(floorId: string): Floor | undefined {
    return this.floors.find(floor => floor.floorId === floorId)
  },

  /**
   * 获取楼栋列表（支持分页） - z-paging兼容格式
   * @param params - 查询参数
   * @param params.communityId - 社区ID
   * @param params.floorNum - 楼栋编号
   * @param params.keyword - 搜索关键词
   * @param params.page - 页码
   * @param params.row - 每页数量
   * @returns 分页后的楼栋列表和总数
   */
  getFloorList(params: { communityId?: string, floorNum?: string, keyword?: string, page?: number, row?: number }): {
    list: Floor[]
    total: number
  } {
    const filteredFloors = this.filterFloors(params)
    const page = params.page || 1
    const row = params.row || 50

    const start = (page - 1) * row
    const end = start + row
    const list = filteredFloors.slice(start, end)

    return {
      list,
      total: filteredFloors.length,
    }
  },
}

// 初始化数据
mockFloorDatabase.initFloors()

// ==================== Mock 接口定义 ====================

export default defineUniAppMock([
  {
    url: '/app/floor.queryFloors',
    method: ['GET', 'POST'],
    delay: [300, 600],
    body: async ({ query, body }) => {
      await randomDelay(300, 600)

      const params = { ...query, ...body }
      mockLog('queryFloors', params)

      const { communityId = 'COMM_001', page = 1, row = 50, floorNum, keyword } = params

      const result = mockFloorDatabase.getFloorList({
        communityId,
        floorNum,
        keyword,
        page: Number(page),
        row: Number(row),
      })

      mockLog('queryFloors result', `${result.list.length} items`)
      return successResponse(result, '查询楼栋列表成功')
    },
  },
  {
    url: '/app/floor.queryFloorDetail',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)

      const params = { ...query, ...body }
      mockLog('queryFloorDetail', params)

      const { floorId } = params
      if (!floorId) {
        return errorResponse('楼栋ID不能为空', ResultEnumMap.Error)
      }

      const floor = mockFloorDatabase.getFloorById(floorId as string)
      if (!floor) {
        return errorResponse('楼栋不存在', ResultEnumMap.NotFound)
      }

      mockLog('queryFloorDetail result', floor.floorName)
      return successResponse(floor, '查询楼栋详情成功')
    },
  },
])
