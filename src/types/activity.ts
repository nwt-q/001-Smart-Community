/**
 * 活动模块类型定义
 */

import type { PaginationParams, StatusType } from './api'

// 活动基础信息
export interface Activity {
  activitiesId: string
  title: string
  userName: string
  startTime: string
  endTime: string
  context: string
  headerImg?: string
  src?: string
  communityId: string
  createTime: string
  updateTime: string
  status: StatusType
  viewCount: number
  likeCount: number
  // 兼容原有属性名
  readCount: number
  collectCount: number
  // 格式化后的时间字段（运行时添加）
  formattedStartTime?: string
  formattedCreateTime?: string
  formattedEndTime?: string
}

// 活动列表查询参数
export interface ActivityListParams extends PaginationParams {
  activitiesId?: string
  communityId: string
  status?: StatusType
  keyword?: string
  startDate?: string
  endDate?: string
}

// 活动列表响应
export interface ActivityListResponse {
  activitiess: Activity[]
  total: number
  page: number
  row: number
}

// 创建活动请求
export interface CreateActivityReq {
  title: string
  context: string
  startTime: string
  endTime: string
  headerImg?: string
  communityId?: string
  status?: StatusType
}

// 更新活动请求
export interface UpdateActivityReq extends CreateActivityReq {
  activitiesId: string
}
