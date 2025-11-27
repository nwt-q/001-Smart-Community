/**
 * 单元模块 API 接口定义
 * 对应业务：楼栋单元管理
 *
 * @fileoverview 提供单元信息的查询接口，支持列表查询和详情查询
 */

import type { ApiResponse } from '@/types/api'
import type { Unit, UnitQueryParams } from '@/types/selector'
import { http } from '@/http/alova'

/** z-paging 兼容的分页响应格式 */
export interface ZPaginationResponse<T> {
  list: T[]
  total: number
}

/** ==================== 查询接口 ==================== */

/** 查询单元列表（z-paging兼容格式） */
export function getUnitList(params: UnitQueryParams) {
  return http.Get<ZPaginationResponse<Unit>>('/app/unit.queryUnits', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}

/** 查询单元详情 */
export function getUnitDetail(params: { unitId: string }) {
  return http.Get<ApiResponse<Unit>>('/app/unit.queryUnitDetail', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}
