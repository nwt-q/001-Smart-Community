/**
 * 房屋模块 API 接口定义
 * 对应业务：房屋选择器相关功能
 *
 * @fileoverview 提供房屋信息的查询接口，支持列表查询和详情查询
 */

import type { PaginationResponse } from '@/types/api'
import type { Room, RoomQueryParams } from '@/types/selector'
import { http } from '@/http/alova'

/** ==================== 查询接口 ==================== */

/** 查询房屋列表 */
export function getRoomList(params: RoomQueryParams) {
  return http.Get<PaginationResponse<Room>>('/app/room.queryRooms', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}

/** 查询房屋详情 */
export function getRoomDetail(params: { roomId: string }) {
  return http.Get<Room>('/app/room.queryRoomDetail', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}
