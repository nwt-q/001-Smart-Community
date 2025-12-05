/**
 * 房屋模块 Mock 接口
 * 包含：内联数据 + 数据库对象 + 接口定义
 */

import type { PaginationResponse } from '@/types/api'
import type { Room, RoomQueryParams } from '@/types/selector'
import {
  defineUniAppMock,
  errorResponse,
  mockLog,
  randomDelay,
  ResultEnumMap,
  successResponse,
} from './shared/utils'

// ==================== 房屋数据生成器 ====================

/**
 * 生成单个房屋数据
 * @param id - 房屋序号ID
 * @returns 房屋对象
 */
function createMockRoom(id: string): Room {
  const floorIndex = Math.floor(Number.parseInt(id) / 36) + 1 // 每栋楼36个房间（6单元×6房间）
  const unitIndex = Math.floor((Number.parseInt(id) % 36) / 6) + 1
  const roomIndex = (Number.parseInt(id) % 6) + 1

  const floorId = `F_COMM_001_${floorIndex.toString().padStart(3, '0')}`
  const unitId = `U_${floorIndex.toString().padStart(3, '0')}_${unitIndex.toString().padStart(2, '0')}`
  const floorNum = (roomIndex * 100).toString() // 101, 201, 301, 401, 501, 601
  const roomNum = `${floorIndex}0${unitIndex}${(roomIndex * 100).toString().padStart(2, '0')}`

  return {
    roomId: `R_${floorIndex.toString().padStart(3, '0')}_${unitIndex.toString().padStart(2, '0')}_${roomIndex.toString().padStart(2, '0')}`,
    roomNum,
    unitId,
    floorId,
  }
}

// ==================== 房屋数据库对象 ====================

const mockRoomDatabase = {
  /** 初始化数据 - 内联数据存储 */
  rooms: Array.from({ length: 720 }, (_, index) =>
    createMockRoom(index.toString().padStart(3, '0'))) as Room[],

  /**
   * 根据参数获取房屋列表
   * @param params - 查询参数
   * @returns 分页后的房屋列表响应
   */
  getRoomList(params: RoomQueryParams): PaginationResponse<Room> {
    let filteredRooms = [...this.rooms]

    // 筛选数据：按楼栋ID、单元ID和房间号模糊匹配
    if (params.floorId) {
      filteredRooms = filteredRooms.filter(room => room.floorId === params.floorId)
    }
    if (params.unitId) {
      filteredRooms = filteredRooms.filter(room => room.unitId === params.unitId)
    }
    if (params.roomNum) {
      filteredRooms = filteredRooms.filter(room =>
        room.roomNum.includes(params.roomNum as string),
      )
    }

    // 计算分页
    const page = Number(params.page) || 1
    const pageSize = Number(params.row) || 50
    const start = (page - 1) * pageSize
    const end = start + pageSize

    const list = filteredRooms.slice(start, end)
    const total = filteredRooms.length

    return {
      list,
      total,
      page,
      pageSize,
      hasMore: end < total,
    }
  },

  /**
   * 根据 roomId 获取房屋详情
   * @param roomId - 房屋ID
   * @returns 房屋对象或 undefined
   */
  getRoomById(roomId: string): Room | undefined {
    return this.rooms.find(room => room.roomId === roomId)
  },

  /**
   * 添加房屋
   * @param room - 房屋对象
   * @returns 添加的房屋对象
   */
  addRoom(room: Room): Room {
    this.rooms.unshift(room)
    return room
  },

  /**
   * 更新房屋
   * @param roomId - 房屋ID
   * @param updateData - 更新的数据
   * @returns 更新后的房屋对象或 null
   */
  updateRoom(roomId: string, updateData: Partial<Room>): Room | null {
    const room = this.getRoomById(roomId)
    if (room) {
      Object.assign(room, updateData)
      return room
    }
    return null
  },

  /**
   * 删除房屋
   * @param roomId - 房屋ID
   * @returns 删除成功返回 true，否则返回 false
   */
  deleteRoom(roomId: string): boolean {
    const index = this.rooms.findIndex(room => room.roomId === roomId)
    if (index !== -1) {
      this.rooms.splice(index, 1)
      return true
    }
    return false
  },
}

// ==================== Mock 接口定义 ====================

export default defineUniAppMock([
  /** 1. 查询房屋列表 */
  {
    url: '/app/room.queryRooms',
    method: ['GET', 'POST'],
    delay: [300, 600],
    body: async ({ query, body }) => {
      await randomDelay(300, 600)

      const params = { ...query, ...body } as RoomQueryParams
      mockLog('queryRooms', params)

      const result = mockRoomDatabase.getRoomList({
        communityId: params.communityId || 'COMM_001',
        page: Number(params.page) || 1,
        row: Number(params.row) || 50,
        floorId: params.floorId,
        unitId: params.unitId,
        roomNum: params.roomNum,
      })

      mockLog('queryRooms result', `${result.list.length} items`)
      return successResponse(result, '查询成功')
    },
  },

  /** 2. 查询房屋详情 */
  {
    url: '/app/room.queryRoomDetail',
    method: ['GET', 'POST'],
    delay: [200, 500],
    body: async ({ query, body }) => {
      await randomDelay(200, 500)

      const params = { ...query, ...body }
      const roomId = params.roomId

      mockLog('queryRoomDetail', { roomId })

      // 参数验证
      if (!roomId) {
        return errorResponse('房间ID不能为空', ResultEnumMap.Error)
      }

      const room = mockRoomDatabase.getRoomById(roomId)

      if (!room) {
        return errorResponse('房屋不存在', ResultEnumMap.NotFound)
      }

      mockLog('queryRoomDetail result', room.roomNum)
      return successResponse(room, '查询成功')
    },
  },
])
