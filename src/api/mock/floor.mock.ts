/**
 * 楼栋模块 Mock 接口
 * 功能：模拟楼栋数据，支持分页和搜索
 * 包含：内联数据 + 数据库对象 + 接口定义
 */

import type { Floor } from '@/types/selector'
import {
  defineUniAppMock,
  errorResponse,
  mockLog,
  randomDelay,
  ResultEnumMap,
  successResponse,
} from './shared/utils'

// ==================== 楼栋数据生成器 ====================

/** 社区配置 */
const COMMUNITIES = [
  { communityId: 'COMM_001', communityName: '阳光花园小区' },
  { communityId: 'COMM_002', communityName: '绿洲新城' },
  { communityId: 'COMM_003', communityName: '滨江花园' },
]

/** 楼栋名称模板 */
const BUILDING_NAMES = [
  '住宅楼',
  '商住楼',
  '公寓楼',
  '高层住宅',
  '小高层',
]

/** Mock 楼栋数据库对象 */
const mockFloorDatabase = {
  /** 楼栋数据存储 */
  floors: [] as Floor[],

  /** 初始化楼栋数据 */
  initFloors() {
    if (this.floors.length === 0) {
      this.floors = this.generateFloorList()
    }
  },

  /** 生成楼栋列表（每个社区生成30栋） */
  generateFloorList(): Floor[] {
    const floors: Floor[] = []

    COMMUNITIES.forEach((community) => {
      for (let i = 1; i <= 30; i++) {
        floors.push({
          floorId: `F_${community.communityId}_${i.toString().padStart(3, '0')}`,
          floorNum: i.toString(),
          floorName: `${i}${BUILDING_NAMES[Math.floor(Math.random() * BUILDING_NAMES.length)]}`,
          communityId: community.communityId,
        })
      }
    })

    return floors
  },

  /** 根据条件筛选楼栋 */
  filterFloors(params: {
    communityId?: string
    floorNum?: string
    keyword?: string
  }): Floor[] {
    return this.floors.filter((floor) => {
      const matchCommunity = !params.communityId || floor.communityId === params.communityId
      const matchFloorNum = !params.floorNum || floor.floorNum.includes(params.floorNum)
      const matchKeyword = !params.keyword
        || floor.floorName.includes(params.keyword)
        || floor.floorNum.includes(params.keyword)

      return matchCommunity && matchFloorNum && matchKeyword
    })
  },

  /** 根据ID查询楼栋 */
  getFloorById(floorId: string): Floor | undefined {
    return this.floors.find(floor => floor.floorId === floorId)
  },

  /** 获取楼栋列表（支持分页） - z-paging兼容格式 */
  getFloorList(params: {
    communityId?: string
    floorNum?: string
    keyword?: string
    page?: number
    row?: number
  }): { list: Floor[], total: number } {
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

      try {
        const params = { ...query, ...body }
        mockLog('queryFloors', params)

        const {
          communityId = 'COMM_001',
          page = 1,
          row = 50,
          floorNum,
          keyword,
        } = params

        const result = mockFloorDatabase.getFloorList({
          communityId,
          floorNum,
          keyword,
          page: Number(page),
          row: Number(row),
        })

        mockLog('queryFloors result', `${result.list.length} items`)
        return successResponse(result, '查询楼栋列表成功')
      }
      catch (error) {
        return errorResponse('查询楼栋列表失败', ResultEnumMap.InternalServerError)
      }
    },
  },
  {
    url: '/app/floor.queryFloorDetail',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)

      try {
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
      }
      catch (error) {
        return errorResponse('查询楼栋详情失败', ResultEnumMap.InternalServerError)
      }
    },
  },
])
