/**
 * 楼栋模块 API 接口定义
 * 对应业务：楼栋选择器相关功能
 *
 * @fileoverview 提供楼栋信息的查询接口，支持列表查询和详情查询
 */

import type { ApiResponse } from '@/types/api'
import type { Floor, FloorQueryParams } from '@/types/selector'
import { http } from '@/http/alova'

/** z-paging 兼容的分页响应格式 */
export interface ZPaginationResponse<T> {
  list: T[]
  total: number
}

/** ==================== 查询接口 ==================== */

/** 查询楼栋列表（z-paging兼容格式） */
export function getFloorList(params: FloorQueryParams) {
  return http.Get<ZPaginationResponse<Floor>>('/app/floor.queryFloors', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}

/** 查询楼栋详情 */
export function getFloorDetail(params: { floorId: string }) {
  return http.Get<ApiResponse<Floor>>('/app/floor.queryFloorDetail', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}
