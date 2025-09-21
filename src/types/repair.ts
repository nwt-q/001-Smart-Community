/**
 * 维修模块类型定义
 */

import type { PaginationParams, PriorityType } from './api'

// 维修状态枚举
export type RepairStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

// 维修类型
export type RepairType = '水电维修' | '门窗维修' | '空调维修' | '电梯维修' | '管道疏通' | '墙面修补' | '其他维修'

// 维修工单信息
export interface RepairOrder {
  repairId: string
  title: string
  description: string
  ownerName: string
  ownerPhone: string
  address: string
  repairType: RepairType
  status: RepairStatus
  priority: PriorityType
  createTime: string
  updateTime: string
  assignedWorker?: string | null
  estimatedCost?: number
  actualCost?: number | null
  images?: string[]
  communityId?: string
  evaluation?: {
    rating: number
    comment: string
    evaluateTime: string
  }
}

// 维修工单列表查询参数
export interface RepairListParams extends PaginationParams {
  communityId?: string
  status?: RepairStatus
  repairType?: RepairType
  keyword?: string
  startDate?: string
  endDate?: string
  assignedWorker?: string
}

// 维修工单列表响应
export interface RepairListResponse {
  ownerRepairs: RepairOrder[]
  total: number
  page: number
  row: number
}

// 创建维修工单请求
export interface CreateRepairReq {
  title: string
  description: string
  ownerName: string
  ownerPhone: string
  address: string
  repairType?: RepairType
  priority?: PriorityType
  estimatedCost?: number
  images?: string[]
  communityId?: string
}

// 更新维修工单请求
export interface UpdateRepairReq extends Partial<CreateRepairReq> {
  repairId: string
}

// 维修工单统计
export interface RepairStatistics {
  total: number
  statusStats: Record<RepairStatus, number>
  typeStats: Record<string, number>
  monthlyStats: Record<string, number>
  avgResponseTime: string
  satisfactionRate: string
}
