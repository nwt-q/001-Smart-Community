/**
 * 投诉模块类型定义
 */

import type { PaginationParams, PriorityType } from './api'

// 投诉状态
export type ComplaintStatus = 'SUBMITTED' | 'PROCESSING' | 'RESOLVED' | 'CLOSED'

// 投诉类型
export type ComplaintType = '噪音投诉' | '卫生问题' | '设施损坏' | '服务态度' | '收费问题' | '其他投诉'

// 投诉工单
export interface Complaint {
  complaintId: string
  title: string
  description: string
  complaintType: ComplaintType
  ownerName: string
  ownerPhone: string
  address?: string
  status: ComplaintStatus
  priority: PriorityType
  createTime: string
  updateTime: string
  assignedHandler?: string
  images?: string[]
  communityId: string
  response?: {
    content: string
    handlerName: string
    responseTime: string
  }
  satisfaction?: {
    rating: number
    comment: string
    evaluateTime: string
  }
}

// 投诉列表查询参数
export interface ComplaintListParams extends PaginationParams {
  communityId?: string
  status?: ComplaintStatus
  complaintType?: ComplaintType
  keyword?: string
  startDate?: string
  endDate?: string
}

// 创建投诉请求
export interface CreateComplaintReq {
  title: string
  description: string
  complaintType: ComplaintType
  ownerName: string
  ownerPhone: string
  address?: string
  priority?: PriorityType
  images?: string[]
  communityId?: string
}
