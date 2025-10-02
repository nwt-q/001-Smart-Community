/**
 * 员工通讯录类型定义
 * 从 Vue2 项目迁移到 Vue3 + TypeScript
 */

import type { PaginationParams } from './api'

// 用户信息（替代原项目的 java110Context.getUserInfo() 返回的数据）
export interface UserInfo {
  userId: string
  userName: string
  storeId: string
  token: string
  communityId?: string
  communityName?: string
  roles?: string[]
  privileges?: string[]
}

// 员工信息接口
export interface Staff {
  id: string
  name: string
  tel: string
  orgName: string
  initials: string // 拼音首字母
  position?: string // 职位
  email?: string
  avatar?: string
  isOnline?: boolean // 是否在线
}

// 按字母分组的员工列表
export interface StaffGroup {
  initials: string // 字母
  staffs: Staff[] // 该字母下的员工列表
}

// 员工查询参数
export interface StaffQueryParams extends PaginationParams {
  name?: string // 员工姓名
  orgName?: string // 组织名称
  initials?: string // 首字母
  storeId?: string // 商户ID
}

// 员工列表响应
export interface StaffListResponse {
  staffs: Staff[]
  total: number
  page: number
  row: number
}

// 字母索引触摸事件参数
export interface IndexTouchEvent {
  touches: Touch[]
  target?: {
    id?: string
  }
}

// 索引栏位置信息
export interface IndexBarPosition {
  boxTop: number // 索引栏顶部位置
  barTop: number // 滚动区域顶部位置
  barHeight?: number // 索引栏高度
}
