/**
 * 单元模块 API 接口定义
 * 对应业务：楼栋单元管理
 *
 * @fileoverview 提供单元信息的查询接口，支持列表查询和详情查询
 */

import type { PaginationResponse } from '@/types/api'
import type { Unit, UnitQueryParams } from '@/types/selector'
import { http } from '@/http/alova'

/** ==================== 查询接口 ==================== */

/** 查询单元列表 */
export function getUnitList(params: UnitQueryParams) {
  return http.Get<PaginationResponse<Unit>>('/app/unit.queryUnits', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}

/** 查询单元详情 */
export function getUnitDetail(params: { unitId: string }) {
  return http.Get<Unit>('/app/unit.queryUnitDetail', {
    params,
    meta: {
      ignoreAuth: true,
    },
  })
}
