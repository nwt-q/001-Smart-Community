/**
 * 房屋模块 API 接口定义
 * 对应业务：房屋选择器相关功能
 *
 * @fileoverview 提供房屋信息的查询接口，支持列表查询和详情查询
 */

import type { ApiResponse } from '@/types/api'
import type { Room, RoomQueryParams } from '@/types/selector'
import { http } from '@/http/alova'

/** z-paging 兼容的分页响应格式 */
export interface ZPaginationResponse<T> {
  list: T[]
  total: number
}

/** ==================== 查询接口 ==================== */

/** 查询房屋列表（z-paging兼容格式） */
export function getRoomList(params: RoomQueryParams) {
  return http.Get<ZPaginationResponse<Room>>('/app/room.queryRooms', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}

/** 查询房屋详情 */
export function getRoomDetail(params: { roomId: string }) {
  return http.Get<ApiResponse<Room>>('/app/room.queryRoomDetail', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}
