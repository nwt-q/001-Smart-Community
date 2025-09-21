/**
 * 活动相关类型定义
 */

// 活动基础信息
export interface Activity {
  activitiesId: string
  title: string
  userName: string
  startTime: string
  context: string
  headerImg: string
  src?: string
  endTime?: string
  communityId?: string
  createTime?: string
  updateTime?: string
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT'
  viewCount?: number
  likeCount?: number
}

// 活动列表查询参数
export interface ActivityListParams {
  page: number
  row: number
  activitiesId?: string
  communityId: string
  keyword?: string
  status?: string
  startTime?: string
  endTime?: string
}

// 活动列表响应
export interface ActivityListResponse {
  activitiess: Activity[]
  total?: number
  page?: number
  row?: number
}

// 创建活动请求
export interface CreateActivityReq {
  title: string
  context: string
  startTime: string
  endTime?: string
  headerImg?: string
  communityId: string
  status?: Activity['status']
}

// 更新活动请求
export interface UpdateActivityReq {
  activitiesId: string
  title?: string
  context?: string
  startTime?: string
  endTime?: string
  headerImg?: string
  status?: Activity['status']
}
